<script>
  import io from "socket.io-client";
  import { onMount } from "svelte";
  import { scale } from "svelte/transition";
  import { encodeHTML } from "@helpers/sanitize.js";
  import { isEmpty } from "@helpers/validation.js";

  import WebcamGrid from "@components/chat/WebcamGrid.svelte";
  import MainChatPreview from "@components/chat/MainChatPreview.svelte";
  import ChatToolBar from "@components/chat/ChatToolBar.svelte";
  import ChatMessage from "@components/chat/ChatMessage.svelte";
  import UsersList from "@components/chat/UsersList.svelte";

  let myPeer;
  let videoGrid;
  let myVideo;
	onMount(async () => {
    myPeer = new Peer();
    // create video element
    videoGrid = document.getElementById('video-grid')
    myVideo = document.createElement('video');
    myVideo.muted = true;
    navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    }).then(stream => {
      addVideoStream(myVideo, stream);

      myPeer.on('call', call => {
        call.answer(stream);
        const video = document.createElement('video');
        call.on('stream', userVideoStream => {
          addVideoStream(video, userVideoStream);
        });
      });

      socket.on('user-connected', userid => {
        console.log('user-connected', userid);
        connectToNewUser(userid, stream);
      });
    })
    .catch(error => {
      // if user lock accept camera and micro
      console.log(error);
    });

    myPeer.on('open', id => {
      socket.emit('join-room', id);
    });
  });

  // video straem functions
  function addVideoStream(video, stream) {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
      video.play();
    });
    videoGrid.append(video);
  }
  function connectToNewUser(userid, stream) {
    const call = myPeer.call(userid, stream);
    const video = document.createElement('video');
    call.on('stream', userVideoStream => {
      addVideoStream(video, userVideoStream);
    });
    call.on('close', () => {
      video.remove();
    });
    
    peers[userid] = call;
    console.log(peers);
  }

  // Chat room logic && functions
  const socket = io();
  let peers = {};
  let messages = ['Welcome to the chat'];
  let message = "";
  let sidebarleft = true;
  let sidebarright = false;

  $: notempty = val => { return !isEmpty(val); };
	$: mincharacter = (val, count) => { return val.length >= (count ? count : 3); };
	$: formIsValid = notempty(message) && mincharacter(message);

  // // Send chat message
  // async function sendMessage () {
  //   // Prevent markup from being injected into the message
  //   message = encodeHTML(message);

  //   // if there is a non-empty message and a socket connection
	// 	if (message && notempty(message)) {
	// 		// tell server to execute 'new-message' and send along one parameter
  //     await socket.emit('new-message', message);
  //     messages = [...messages, message];
  //     message = "";
	// 	}
  // }

  // // update every sockets except the sender.
	// socket.on('new-message', function (data) {
	// 	messages = [...messages, data.message];
  // });

  // user disconnection
  socket.on('user-disconnected', userid => {
    if (peers[userid]) peers[userid].close();
  });
</script>

<svele:head>
  <!-- https://unpkg.com/peerjs@1.3.1/dist/peerjs.min.js -->
  <script defer src="peerjs@1.3.1.min.js"></script>
</svele:head>

<div class="chat-container" class:openleft={sidebarleft} class:openright={sidebarright}>
  <div class="plain-area columns">
    <div class="column">

      <WebcamGrid />

    </div>
  </div>

  <div class="fixed-bottom">
    <ChatToolBar on:open={() => {sidebarright = true}} />
    {#if !sidebarright}
    <MainChatPreview on:open={() => sidebarright = true} />
    {/if}
  </div>

  {#if sidebarright}
  <div class="side-bar side-bar-right" class:open={sidebarright}>
    <ChatMessage on:close={() => {sidebarright = false}} />
  </div>
  {/if}

  <div class:open={sidebarleft} class="side-bar side-bar-left">
    <button on:click={() => {sidebarleft = !sidebarleft}}>open</button>

    <UsersList open={sidebarleft} />
  </div>
</div>

<style lang="scss">@import '../styles/pages/chat.scss';</style>

<!-- <div class="chat-container">
  <div class="video-area">
    <div id="video-grid"></div>
  </div>

  <div class="chat-area">
    <ul class="messages">
      {#each messages as message}
        <li transition:scale>{message}</li>
      {:else}
        <li>Oups no messages</li>
      {/each}
    </ul>
  </div>
  <form class="chat-form" on:submit|preventDefault={sendMessage}>
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
</div> -->
