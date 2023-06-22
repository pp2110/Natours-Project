/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';
import { setStateSubmitButton } from './index';

export const recoverPassword = async (email, button) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/forgotPassword',
      data: { email },
    });
    if (res.data.status === 'success') {
      setStateSubmitButton(true, '', 'recover password');
      showAlert('success', 'Please Check Your email', 10000);
    }
  } catch (err) {
    setStateSubmitButton(true, '', 'recover password');
    showAlert('error', err.response.data.message);
  }
};
export const resetPassword = async (data, token) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: `/api/v1/users/resetPassword/${token}`,
      data,
    });
    if (res.data.status === 'success') {
      showAlert('success', 'Your Password Has Changed Successfully');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    setStateSubmitButton(true, '', 'reset password');
    showAlert('error', err.response.data.message);
  }
};
