<script>
  import { createEventDispatcher } from 'svelte';
  import { messages } from "@store/chat.js";

	const dispatch = createEventDispatcher();
</script>

<!-- <style lang="scss">
@import '@styles/components/chat/chat-message-preview.scss';
</style> -->

<div class="wrapper">
  <button on:click={() => {dispatch('open')}}>chat message</button>
  <ul>
    {#each $messages as message}
      <li>{message}</li>
    {/each}
  </ul>
</div>