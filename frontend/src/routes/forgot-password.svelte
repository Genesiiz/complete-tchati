<script>
	import { forgotpassword } from "@helpers/auth/forgot-password.js";
	import { isEmpty } from "@helpers/validation.js";
	import { encodeHTML } from "@helpers/sanitize.js";

	let email = '';

	$: notempty = val => { return !isEmpty(val); };
	$: mincharacter = (val, count) => { return val.length >= (count ? count : 3); };
	$: formIsValid = notempty(email) && mincharacter(email);

	async function formforgotpassword () {
		await forgotpassword({
			email: encodeHTML(email)
		});
	}
</script>

<svelte:head>
	<title>Forgotpassword Page Title</title>
</svelte:head>

<div>
<h2>Forgotpassword form</h2>
<form on:submit|preventDefault={formforgotpassword}>
	<input
		bind:value={email}
		valid={notempty(email) && mincharacter(email, 7)}
		type="email"
		placeholder="Email">
	<input
		value="Forgot password"
		type="submit"
		disabled={!formIsValid}
		on:click|preventDefault={formforgotpassword} />
		{!formIsValid}
</form>
</div>