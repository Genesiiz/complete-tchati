import axios from "axios";
import { encodeHTML } from "@helpers/sanitize.js";
// TODO: Need to handle error message

export async function register (params) {
  try {
    await axios
      .post('http://localhost:1337/auth/local/register', {
        username: encodeHTML(params.username),
        email: encodeHTML(params.email),
        password: encodeHTML(params.password),
      })
      .then(response => {
        // Handle success.
        console.log('Well done !');
        console.log('User profile --> ', response.data.user);
        console.log('User token --> ', response.data.jwt);
      })
      .catch(error => {
        // Handle error.
        console.log('An error occurred:', error.response);
      });
    // return response;
  } catch (error) {
    console.error(error);
  }
}
