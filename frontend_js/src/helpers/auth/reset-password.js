import axios from "axios";
import { encodeHTML } from "@helpers/sanitize.js";
// TODO: Need to handle error message

export async function resetpassword (params) {
  try {
    await axios
      .post('http://localhost:1337/auth/reset-password', {
        code: encodeHTML(params.code), // code contained in the reset link of step 3.
        password: encodeHTML(params.password),
        passwordConfirmation: encodeHTML(params.passwordConfirmation),
      })
      .then(response => {
        console.log("Your user's password has been reset. ", response);
      })
      .catch(error => {
        console.log('An error occurred:', error.response);
      });
  } catch (error) {
    console.error(error);
  }
}
