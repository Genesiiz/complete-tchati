<script>
	import { login } from "@helpers/auth/login.js";
	import { isEmpty } from "@helpers/validation.js";
	import { encodeHTML } from "@helpers/sanitize.js";

	let identifier = '';
	let password = '';

	$: notempty = val => { return !isEmpty(val); };
	$: mincharacter = (val, count) => { return val.length >= (count ? count : 3); };
	$: formIsValid = notempty(identifier) && mincharacter(identifier) &&
										notempty(password) && mincharacter(password);

	async function formlogin () {
		await login({
			identifier: encodeHTML(identifier),
			password: encodeHTML(password)
		});
	}
</script>

<svelte:head>
	<title>Login Page Title</title>
</svelte:head>

<div>
<h2>Login form</h2>
<form on:submit|preventDefault={formlogin}>
	<input
		bind:value={identifier}
		valid={notempty(identifier) && mincharacter(identifier)}
		type="text"
		placeholder="Identifier">
	<input
		bind:value={password}
		valid={notempty(password) && mincharacter(password)}
		type="text"
		placeholder="Password">
	<input
		value="login"
		type="submit"
		disabled={!formIsValid}
		on:click|preventDefault={formlogin} />
		{!formIsValid}
</form>
</div>