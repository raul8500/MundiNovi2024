const base = 'http://localhost:3000';
const urlAuthLogin = base + '/api/auth/login';

const usernameInput = document.getElementById('usernameInput');
const passwordInput = document.getElementById('passwordInput');
const btnLogin = document.getElementById('btnLogin')

history.pushState(null, null, location.href);
window.onpopstate = function () {
  history.go(1);
};


function areFieldsNotEmpty() {
  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  return username !== '' && password !== '';
}

btnLogin.addEventListener('click', (e) => {
  e.preventDefault();

  if (!areFieldsNotEmpty()) {
      Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Por favor, completa todos los campos.',
      });
      return;
  }

  fetch(urlAuthLogin, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          username: usernameInput.value,
          password: passwordInput.value
      })
  })
  .then((response) => {
      const statusCode = response.status;
      if (statusCode === 200) {
          Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Inicio de sesión exitoso',
              showConfirmButton: false,
              timer: 2000
          });
          setTimeout(function() {
              location.href = '/main';
          }, 1500);

          window.history.pushState(null, null, window.location.href);
            window.onpopstate = function () {
                window.history.go(1);
                };
      } else {
          if (statusCode === 401) {
              Swal.fire({
                  icon: 'error',
                  title: 'Error',
                  text: 'Credenciales incorrectas.',
              });
          }
          setTimeout(function() {
              location.href = '/login';
          }, 1500);
      }
  })
  .catch((error) => {
      if (error.response && error.response.status) {
          const statusCode = error.response.status;
          if (statusCode === 401) {
              Swal.fire({
                  icon: 'error',
                  title: 'Error',
                  text: 'Credenciales incorrectas.',
              });
          } else if (statusCode === 500) {
              Swal.fire({
                  icon: 'error',
                  title: 'Error',
                  text: 'Ha ocurrido un error en la comunicación con el servidor.',
              });
          }
      } else {
          console.error('Error:', error);
      }
  });
});
