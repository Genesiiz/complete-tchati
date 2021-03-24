<!-- <script context="module">
	import ApolloClient from "apollo-boost";
	import { strapi_graphql_url } from "@graphql/strapi-apollo.js";
	import { GET_VIDEOGAMES } from "@graphql/videogames.js";

	export async function preload({ params, query }) {
		const client = new ApolloClient({
			uri: strapi_graphql_url,
			fetch: this.fetch
		})
		const videogames = await client.query({
			query: GET_VIDEOGAMES,
			variables: { limit: 20, offset: 0 }
		})
		return { videogames: videogames.data.videogames }
	}
</script>
<script>
	export let videogames;
</script> -->
<script>
</script>

<svelte:head>
	<title>Sapper project template</title>
</svelte:head>

<h1>chat!</h1>

Home Page
<ul>
	<li>
		<a href="/chat">chat</a>
	</li>
	<li>
		<a href="/registration">registration</a>
	</li>
	<li>
		<a href="/login">login</a>
	</li>
	<li>
		<a href="/forgot-password">forgot-password</a>
	</li>
	<li>
		<a href="/reset-password">reset-password</a>
	</li>
</ul>