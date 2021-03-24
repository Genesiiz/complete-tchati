<script>
	import { register } from "@helpers/auth/register.js";
	import { isEmpty } from "@helpers/validation.js";
	import { encodeHTML } from "@helpers/sanitize.js";

	let username = '';
	let email = '';
	let password = '';

	$: notempty = val => { return !isEmpty(val); };
	$: mincharacter = (val, count) => { return val.length >= (count ? count : 3); };
	$: formIsValid = notempty(username) && mincharacter(username) &&
										notempty(email) && mincharacter(email) &&
										notempty(password) && mincharacter(password);

	async function formregister () {
		await register({
			username: encodeHTML(username),
			email: encodeHTML(email),
			password: encodeHTML(password)
		});
	}
</script>

<svelte:head>
	<title>Registration Page Title</title>
</svelte:head>

<div>
<h2>Register form</h2>
<form on:submit|preventDefault={formregister}>
	<input
		bind:value={username}
		valid={notempty(username) && mincharacter(username)}
		type="text"
		placeholder="Username">
	<input
		bind:value={email}
		valid={notempty(email) && mincharacter(email, 7)}
		type="email"
		placeholder="Email">
	<input
		bind:value={password}
		valid={notempty(password) && mincharacter(password)}
		type="text"
		placeholder="Password">
	<input
		value="Register"
		type="submit"
		disabled={!formIsValid}
		on:click|preventDefault={formregister} />
		{!formIsValid}
</form>
</div>