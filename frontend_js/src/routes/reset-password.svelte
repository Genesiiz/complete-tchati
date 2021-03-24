<script context="module">
  export async function preload({ query }) {
    return { code: query.code }
  }
</script>

<script>
	import { resetpassword } from "@helpers/auth/reset-password.js";
	import { isEmpty } from "@helpers/validation.js";
	import { encodeHTML } from "@helpers/sanitize.js";

  export let code;
	let password = '';
	let passwordConfirmation = '';

	$: notempty = val => { return !isEmpty(val); };
	$: mincharacter = (val, count) => { return val.length >= (count ? count : 3); };
	$: formIsValid = notempty(password) && mincharacter(password) &&
                    notempty(passwordConfirmation) && mincharacter(passwordConfirmation) &&
                    password === passwordConfirmation;

	async function formresetpassword () {
		await resetpassword({
      code: encodeHTML(code), // code contained in the reset link of step 3.
      password: encodeHTML(password),
      passwordConfirmation: encodeHTML(passwordConfirmation),
		});
	}
</script>

<svelte:head>
	<title>Reset Password Page Title</title>
</svelte:head>

<div>
<h2>Reset Password form</h2>
<form on:submit|preventDefault={formresetpassword}>
	<input
		bind:value={password}
		valid={notempty(password) && mincharacter(password)}
		type="text"
		placeholder="Password">
	<input
		bind:value={passwordConfirmation}
		valid={notempty(passwordConfirmation) && mincharacter(passwordConfirmation)}
		type="text"
		placeholder="Confirm password">
	<input
		value="resetpassword"
		type="submit"
		disabled={!formIsValid}
		on:click|preventDefault={formresetpassword} />
		{!formIsValid}
</form>
</div>