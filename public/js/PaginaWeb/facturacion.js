document.getElementById('formRegistro').addEventListener('submit', async function(e) {
  e.preventDefault();

  const form = e.target;
  const correo = form.correo.value.trim();
  const telefono = form.telefono.value.trim();
  const password = form.password.value;
  const confirmar = form.confirmar.value;

  // Validar caracteres prohibidos
  const tieneCaracteresInvalidos = valor => /[<>]/.test(valor);

  if ([correo, telefono, password, confirmar].some(tieneCaracteresInvalidos)) {
    Swal.fire({
      icon: 'warning',
      title: 'Caracteres no permitidos',
      text: 'No se permiten los signos < o > en los campos.',
    });
    return;
  }

  if (password !== confirmar) {
    Swal.fire({
      icon: 'error',
      title: 'Contraseñas no coinciden',
      text: 'Por favor, asegúrate de que ambas contraseñas sean iguales.',
    });
    return;
  }

  try {
    const res = await fetch('/api/clientes/registro', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ correo, telefono, password })
    });

    const result = await res.json();

    if (res.ok) {
      Swal.fire({
        icon: 'success',
        title: '¡Registro exitoso!',
        text: 'Tu cuenta ha sido registrada correctamente.',
      });
      form.reset();
      const modal = bootstrap.Modal.getInstance(document.getElementById('modalRegistro'));
      modal.hide();
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: result.message || 'Ocurrió un error al registrar',
      });
    }

  } catch (error) {
    console.error('Error:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error del servidor',
      text: 'Hubo un problema al contactar el servidor. Inténtalo más tarde.',
    });
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.querySelector('form');

  loginForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const telefono = loginForm.querySelector('input[type="text"]').value.trim();
    const password = loginForm.querySelector('input[type="password"]').value.trim();

    // Validar caracteres < o >
    if (/[<>]/.test(telefono) || /[<>]/.test(password)) {
      return Swal.fire({
        icon: 'warning',
        title: 'Caracteres inválidos',
        text: 'No se permiten los signos "<" o ">" en los campos.'
      });
    }

    if (!telefono || !password) {
      return Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Debes ingresar tu teléfono y contraseña.'
      });
    }

    try {
      const res = await fetch('/api/clientes/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: telefono, password })
      });

      const result = await res.json();

      if (res.ok) {
        Swal.fire({
          icon: 'success',
          title: '¡Bienvenido!',
          text: result.message || 'Inicio de sesión exitoso',
          timer: 1500,
          showConfirmButton: false
        }).then(() => {
          // Redirigir a página de cliente o dashboard
          window.location.href = '/compras'; // Ajusta la ruta según tu sistema
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error de inicio de sesión',
          text: result.error || 'Credenciales incorrectas.'
        });
      }

    } catch (err) {
      console.error('Error al iniciar sesión:', err);
      Swal.fire({
        icon: 'error',
        title: 'Error del servidor',
        text: 'No se pudo contactar con el servidor.'
      });
    }
  });
});
