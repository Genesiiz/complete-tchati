import Cookies from 'js-cookie';
// TODO: Need to handle error message

export async function logout () {
  try {
    Cookies.remove('auth_key'); // remove jwt key
  } catch (error) {
    console.error(error);
  }
}