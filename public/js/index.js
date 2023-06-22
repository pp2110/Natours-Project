/* eslint-disable */
import '@babel/polyfill';
import { displayMap } from './mapbox';
import { login, logout } from './login';
import { updateSettings } from './updateSettings';
import { bookTour } from './stripe';
import { showAlert } from './alerts';
import { signUp } from './signUp';
import { recoverPassword, resetPassword } from './recoverPassword';

// DOM ELEMENTS
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const signUpForm = document.querySelector('.form--signUp');
const logOutBtn = document.querySelector('.nav__el--logout');
const formUpload = document.getElementById('photo');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');
const bookBtn = document.getElementById('book-tour');
const navigationNav = document.querySelector('.navigation__nav');
const recoverPasswordForm = document.querySelector('.form--recoverPassword');
const resetPasswordForm = document.querySelector('.form--resetPassword');

const getBase64 = async (file) => {
  var reader = new FileReader();

  //Read the contents of Image File.
  reader.readAsDataURL(file);
  const result = await new Promise((resolve) => {
    reader.onload = function (e) {
      resolve(this.result);
    };
  });
  return result;
};

export const setStateSubmitButton = (state, idButton, originalText) => {
  let button;
  if (idButton) {
    button = document.getElementById(idButton);
  } else {
    button = document.getElementById('submitButton');
  }

  if (!state) {
    button.disabled = true;
    button.textContent = '';
    button.style.backgroundImage = "url('/img/spinner-static.svg')";
  } else {
    button.disabled = false;
    button.textContent = originalText;
    button.style.background = '';
  }
};

if (navigationNav) {
  document.getElementById('discoverTours').addEventListener('click', (e) => {
    e.preventDefault();
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  });
  document.querySelectorAll('#popup_link').forEach((link) => {
    link.addEventListener('click', (e) => {
      const link = e.target.getAttribute('linkPoppup');
      document.getElementById('tour-link').href = '/tour' + link;
    });
  });
  document.querySelectorAll('.navigation__link').forEach((link) => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      document.getElementById('navi-toggle').checked = false;
      if (e.target.classList.contains('navigation__link')) {
        const id = e.target.getAttribute('href');
        document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

const createPreviewImage = async function (event) {
  //Recebendo a nova imagem
  const imgfile = event.target.files[0];
  //Receber o buffer da imagem
  const base64 = await getBase64(imgfile);

  const img = new Image();
  img.src = base64;

  const canvas = document.createElement('canvas');
  canvas.width = 500;
  canvas.height = 500;

  const ctx = canvas.getContext('2d');

  img.onload = function () {
    ctx.drawImage(img, 0, 0, 500, 500);
    document.querySelector('.photo-preview').style = 'display:flex';
    document.getElementById('photo-preview').src = canvas.toDataURL(
      imgfile.type
    );
  };
};

// DELEGATION
if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);
  displayMap(locations);
}

if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    setStateSubmitButton(false);
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}
if (recoverPasswordForm) {
  recoverPasswordForm.addEventListener('submit', (e) => {
    e.preventDefault();
    setStateSubmitButton(false);
    const email = document.getElementById('email').value;
    const button = document.getElementById('submitButton');
    recoverPassword(email, button);
  });
}
if (resetPasswordForm) {
  document.getElementById('passwordConfirm').addEventListener('input', (e) => {
    if (e.target.value != document.getElementById('password').value) {
      e.target.setCustomValidity('Password must be equal');
    } else {
      e.target.setCustomValidity('');
    }

    resetPasswordForm.addEventListener('submit', (e) => {
      e.preventDefault();
      setStateSubmitButton(false);
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('resetToken');
      const password = document.getElementById('password').value;
      const passwordConfirm = document.getElementById('passwordConfirm').value;

      resetPassword({ password, passwordConfirm }, token);
    });
  });
}

if (signUpForm) {
  const urlParams = new URLSearchParams(window.location.search);
  document.getElementById('name').value = urlParams.get('name');
  document.getElementById('email').value = urlParams.get('email');
  formUpload.addEventListener('input', async (event) => {
    //Recebendo a nova imagem
    const imgfile = event.target.files[0];
    //Receber o buffer da imagem
    const base64 = await getBase64(imgfile);

    const img = new Image();
    img.src = base64;

    const canvas = document.createElement('canvas');
    canvas.width = 500;
    canvas.height = 500;

    const ctx = canvas.getContext('2d');

    img.onload = function () {
      ctx.drawImage(img, 0, 0, 500, 500);
      document.querySelector('.form__user-photo').src = canvas.toDataURL(
        imgfile.type
      );
    };
  });

  document.getElementById('password_confirm').addEventListener('input', (e) => {
    if (e.target.value != document.getElementById('password').value) {
      e.target.setCustomValidity('Password must be equal');
    } else {
      e.target.setCustomValidity('');
    }
  });

  signUpForm.addEventListener('submit', (e) => {
    e.preventDefault();
    setStateSubmitButton(false);
    const form = new FormData();
    form.append('photo', document.getElementById('photo').files[0]);
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('password', document.getElementById('password').value);
    form.append(
      'passwordConfirm',
      document.getElementById('password_confirm').value
    );

    signUp(form);
  });
}

if (logOutBtn) logOutBtn.addEventListener('click', logout);

if (userDataForm) {
  formUpload.addEventListener('input', createPreviewImage);

  userDataForm.addEventListener('submit', (e) => {
    e.preventDefault();
    setStateSubmitButton(false, 'submitButtonAccount');
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);
    updateSettings(form, 'data');
  });
}
if (userPasswordForm)
  userPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    setStateSubmitButton(false, 'submitButtonPassword');

    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      'password'
    );

    document.querySelector('.btn--save-password').textContent = 'Save password';
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });

if (bookBtn)
  bookBtn.addEventListener('click', (e) => {
    setStateSubmitButton(false, 'book-tour');
    const { tourId } = e.target.dataset;
    bookTour(tourId);
  });

const alertMessage = document.querySelector('body').dataset.alert;
if (alertMessage) showAlert('success', alertMessage, 20);
