<script>
	import Header from "@partials/header/Header.svelte";
	import Footer from "@partials/footer/Footer.svelte";
	// import Nav from '../components/Nav.svelte';

	export let segment;
</script>

<!-- <style lang="scss" global>
@import '@styles/styles.scss';
</style> -->

<!-- <Nav {segment}/> -->
{#if segment = 'chat'}

	<slot></slot>

{:else}

	<Header/>

	<main>
		<slot></slot>
	</main>

	<Footer/>
	
{/if}