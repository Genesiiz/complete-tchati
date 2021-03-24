import axios from "axios";
import { encodeHTML } from "@helpers/sanitize.js";
import Cookies from 'js-cookie';
// TODO: Need to handle error message

export async function login (params) {
  try {
    await axios
      .post('http://localhost:1337/auth/local', {
        identifier: encodeHTML(params.identifier),
        password: encodeHTML(params.password),
      })
      .then(response => {
        // Handle success.
        console.log('Well done !');
        console.log('User profile --> ', response.data.user);
        console.log('User token --> ', response.data.jwt);
        const myjwt = response.data.jwt;
        // Cookies.set('auth_key', myjwt, { expires: 365 });
        Cookies.set('auth_key', myjwt);
      })
      .catch(error => {
        // Handle error.
        console.log('An error occurred:', error.response);
      });
  } catch (error) {
    console.error(error);
  }
}