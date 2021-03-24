<script>
  import io from "socket.io-client";
  import { scale } from "svelte/transition";
  import { isEmpty } from "@helpers/validation.js";
  import { encodeHTML } from "@helpers/sanitize.js";
  import { createEventDispatcher } from 'svelte';
  import { messages } from "@store/chat.js";

	const dispatch = createEventDispatcher();

  // let messages = ['Welcome to the chat'];
  const socket = io();
  let message = "";

  $: notempty = val => { return !isEmpty(val); };
	$: mincharacter = (val, count) => { return val.length >= (count ? count : 3); };
  $: formIsValid = notempty(message) && mincharacter(message);
  
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

<!-- <style lang="scss">
@import '@styles/components/chat/chat-message.scss';
</style> -->

<div class="chat-area">
  <button on:click={() => dispatch('close')}>close</button>
  <ul class="messages">
    {#each $messages as message}
      <li transition:scale>{message}</li>
    {:else}
      <li>Oups no messages</li>
    {/each}
  </ul>
</div>

<form class="chat-form column" on:submit|preventDefault={sendMessage}>
  <input
    label="Message"
    type="text"
    placeholder="Type here..."
    valid={notempty(message) && mincharacter(message)}
    validityMessage="Please enter a valid message."
    value={message}
    on:input={event => (message = event.target.value)} />
  <input
    value="Send"
    type="submit"
    disabled={!formIsValid}
    on:click|preventDefault={sendMessage} />
</form>