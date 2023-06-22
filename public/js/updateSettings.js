/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';
import { setStateSubmitButton } from './index';

// type is either 'password' or 'data'
export const updateSettings = async (data, type) => {
  try {
    const url =
      type === 'password'
        ? '/api/v1/users/updateMyPassword'
        : '/api/v1/users/updateMe';

    const res = await axios(
      {
        method: 'PATCH',
        url,
        data,
      },
      {
        withCredentials: true,
      }
    );

    if (res.data.status === 'success') {
      let idButton;
      let text;
      if (type === 'password') {
        idButton = 'submitButtonPassword';
        text = 'save Password';
      } else {
        idButton = 'submitButtonAccount';
        text = 'Save Settings';
      }
      setStateSubmitButton(true, idButton, text);
      showAlert('success', `${type.toUpperCase()} updated successfully!`);
    }
  } catch (err) {
    let idButton;
    let text;
    if (type === 'password') {
      idButton = 'submitButtonPassword';
      text = 'save Password';
    } else {
      idButton = 'submitButtonAccount';
      text = 'Save Settings';
    }
    setStateSubmitButton(true, idButton, text);
    showAlert('error', err.response.data.message);
  }
};
