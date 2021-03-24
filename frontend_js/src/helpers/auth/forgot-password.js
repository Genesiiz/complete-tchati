import axios from "axios";
import { encodeHTML } from "@helpers/sanitize.js";
// TODO: Need to handle error message

export async function forgotpassword (params) {
  try {
    await axios
      .post('http://localhost:1337/auth/forgot-password', {
        email: encodeHTML(params.email) // user's email
      })
      .then(response => {
        console.log('Your user received an email: ', response);
      })
      .catch(error => {
        console.log('An error occurred:', error.response);
      });
  } catch (error) {
    console.error(error);
  }
}
