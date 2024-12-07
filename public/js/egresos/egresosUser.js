document.getElementById('formCrearEgreso').addEventListener('submit', async (e) => {
    e.preventDefault();

    // Crear un objeto FormData para manejar los datos del formulario y el archivo
    const formData = new FormData();

    // Obtener los valores del formulario
    const importe = document.getElementById('importe').value.trim();
    const observaciones = document.getElementById('observaciones').value.trim();
    const archivoComprobatorio = document.getElementById('archivoComprobatorio').files[0];

    // Validar campos obligatorios
    if (!importe || parseFloat(importe) <= 0) {
        Swal.fire({
            icon: 'warning',
            title: 'Importe inválido',
            text: 'Por favor, ingrese un importe válido mayor a 0.',
        });
        return;
    }

    // Agregar campos al FormData
    formData.append('importe', importe);
    formData.append('observaciones', observaciones);
    formData.append('sucursal', infoUser.sucursalId);
    formData.append('usuario', infoUser._id);

    // Agregar archivo comprobatorio si se seleccionó
    if (archivoComprobatorio) {
        formData.append('archivoComprobatorio', archivoComprobatorio);
    }

    try {
        // Enviar los datos al backend
        const response = await fetch('/api/egresos', {
            method: 'POST',
            body: formData, // No se especifican headers para FormData; fetch los maneja automáticamente
        });

        const result = await response.json();

        if (response.ok) {
            // Éxito
            Swal.fire({
                icon: 'success',
                title: 'Egreso creado',
                text: 'El egreso se ha creado exitosamente.',
            });

            // Limpiar el formulario
            document.getElementById('formCrearEgreso').reset();
        } else {
            // Error en el backend
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: result.message || 'Ocurrió un error al crear el egreso. Intenta nuevamente.',
            });
        }
    } catch (error) {
        // Error en la conexión
        console.error('Error al enviar el egreso:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo conectar con el servidor. Verifique su conexión e intente nuevamente.',
        });
    }
});
