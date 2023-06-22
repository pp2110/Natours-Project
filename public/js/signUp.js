/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';
import { setStateSubmitButton } from './index';

export const signUp = async (data) => {
  try {
    const res = await axios(
      {
        method: 'POST',
        url: '/api/v1/users/signup',
        data,
      },
      {
        withCredentials: true,
      }
    );
    if (res.data.status === 'success') {
      showAlert('success', 'Logged in successfully!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    setStateSubmitButton(true, '', 'Sign Up');
    showAlert('error', err.response.data.message);
  }
};
