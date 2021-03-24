import axios from "axios";
import { encodeHTML } from "@helpers/sanitize.js";
// TODO: Need to handle error message

// If needed, you can re-send the confirmation email by making the following request.
export async function sendemailconfirmation (params) {
  try {
    await axios
      .post(`http://localhost:1337/auth/send-email-confirmation`, {
        email: encodeHTML(params.email), // user's email
      })
      .then(response => {
        console.log('Your user received an email: ', response);
      })
      .catch(error => {
        console.error('An error occurred:', error.response);
      });
  } catch (error) {
    console.error(error);
  }
}