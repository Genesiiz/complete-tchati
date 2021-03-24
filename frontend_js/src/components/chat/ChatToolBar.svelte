<script>
  import io from "socket.io-client";
  import { createEventDispatcher } from 'svelte';
  import { messages } from "@store/chat.js";
  import { isEmpty } from "@helpers/validation.js";
  import { encodeHTML } from "@helpers/sanitize.js";

  const dispatch = createEventDispatcher();
  const socket = io();
  
  let camera = false;
  let micro = false;
  let emojis = ["&#128515", "&#128518", "&#128517", "&#128525", "&#128527", "&#128520"];
  let message = "";
  let messagebox = false;

  $: notempty = val => { return !isEmpty(val); };
  $: mincharacter = (val, count) => { return val.length >= (count ? count : 3); };
  $: formIsValid = notempty(message) && mincharacter(message);

  // Focus out check
  function messageboxOut (e) {
    if (!e.relatedTarget) { messagebox = false; return; }
    const parent = e.relatedTarget.parentElement || e.relatedTarget.parentNode;
    const grandParent = parent.parentElement || parent.parentNode;
    const greatGrandParent = grandParent.parentElement || grandParent.parentNode;
    if (parent.className.includes("message-box") ||
        grandParent.className.includes("message-box") ||
        greatGrandParent.className.includes("message-box")) return;
    messagebox = false;
  }

  // Send chat message
  async function sendMessage () {
    // Prevent markup from being injected into the message
    message = encodeHTML(message);

    // if there is a non-empty message and a socket connection
		if (message && notempty(message)) {
			// tell server to execute 'new-message' and send along one parameter
      await socket.emit('new-message', message);
      // messages = [...messages, message];
      messages.add(message);
      message = "";
		}
  }

  // update every sockets except the sender.
	socket.on('new-message', function (data) {
    messages.add(data.message);
		// messages = [...messages, data.message];
  });
</script>

<style lang="scss">@import '../../styles/components/chat/chat-tool-bar.scss';</style>

<ul class="message-toolbar">
  <li>
    <button>{camera ? 'désactier' : 'activer'} la camera</button>
  </li>
  <li>
    <button>{micro ? 'désactier' : 'activer'} le micro</button>
  </li>
  <li class="shortcut shortcut-message">
    <button
      on:click={() => {dispatch('open')}}
      on:focus={() => {messagebox = true}}
      on:focusout={messageboxOut}>message</button>

      <div class="message-box-container {messagebox ? 'is-visible' : 'is-invisible'}">
        <div
          class="message-box">
          <ul class="emoji-wrapper">
            {#each emojis as emoji}
              <li>
                <button
                  on:focus={() => {messagebox = true}}
                  on:focusout={messageboxOut}
                  on:click={() => {message += emoji}}>{@html emoji}</button>
              </li>
            {/each}
          </ul>
          <input
            label="Message"
            type="text"
            placeholder="Type here..."
            valid={notempty(message) && mincharacter(message)}
            validityMessage="Please enter a valid message."
            value={message}
            on:input={event => (message = event.target.value)}
            on:focus={() => {messagebox = true}}
            on:focusout={messageboxOut} />
          <input
            value="Send"
            type="submit"
            disabled={!formIsValid}
            on:click|preventDefault={sendMessage}
            on:focus={() => {messagebox = true}}
            on:focusout={messageboxOut} />
        </div>
      </div>

  </li>
  <li>
    <button><span class="is-sr-only">settings</span>...</button>
  </li>
</ul>