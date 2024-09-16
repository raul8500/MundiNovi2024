const modalProveedorEdit = new mdb.Modal(document.getElementById('modalEditarProveedor'));
let idEditProveedor = ''
on(document, 'click', '.btn-editar', async e => {
    const button = e.target.closest('.btn-editar'); 
    idEditProveedor = button.getAttribute('data-id');
    mostrarInfoPanel(idEditProveedor)
});

function mostrarInfoPanel(idEditProveedor) {
    fetch('/api/proveedor/'+idEditProveedor)
        .then(response => response.json())
        .then(data => {
            setEditFormData(data);
        })
        .catch(error => console.log(error)); // Mover .catch() al final
}

function setEditFormData(proveedor) {
    document.getElementById('editNombre').value = proveedor.nombre || '';
    document.getElementById('editTelefono').value = proveedor.informacionContacto.telefono || '';
    document.getElementById('editCorreo').value = proveedor.informacionContacto.correo || '';
    document.getElementById('editCalle').value = proveedor.direccion.calle || '';
    document.getElementById('editCiudad').value = proveedor.direccion.ciudad || '';
    document.getElementById('editEstado').value = proveedor.direccion.estado || '';
    document.getElementById('editCodigoPostal').value = proveedor.direccion.codigoPostal || '';
    document.getElementById('editPais').value = proveedor.direccion.pais || '';
    document.getElementById('editEstadoProveedor').value = proveedor.estado || 'activo'; 

    modalProveedorEdit.show()
}

function validateEditForm() {
    const nombre = document.getElementById('editNombre').value.trim();
    const telefono = document.getElementById('editTelefono').value.trim();
    const correo = document.getElementById('editCorreo').value.trim();
    const calle = document.getElementById('editCalle').value.trim();
    const ciudad = document.getElementById('editCiudad').value.trim();
    const estado = document.getElementById('editEstado').value.trim();
    const codigoPostal = document.getElementById('editCodigoPostal').value.trim();
    const pais = document.getElementById('editPais').value.trim();
    const estadoProveedor = document.getElementById('editEstadoProveedor').value;

    if (!nombre || !telefono || !correo || !calle || !ciudad || !estado || !codigoPostal || !pais || !estadoProveedor) {
        Swal.fire('Error', 'Todos los campos son requeridos', 'error');
        return false;
    }

    return true;
}

function getEditFormData() {
    return {
        nombre: document.getElementById('editNombre').value,
        informacionContacto: {
            telefono: document.getElementById('editTelefono').value,
            correo: document.getElementById('editCorreo').value
        },
        direccion: {
            calle: document.getElementById('editCalle').value,
            ciudad: document.getElementById('editCiudad').value,
            estado: document.getElementById('editEstado').value,
            codigoPostal: document.getElementById('editCodigoPostal').value,
            pais: document.getElementById('editPais').value
        },
        estado: document.getElementById('editEstadoProveedor').value
    };
}

document.getElementById('actualizarProveedor').addEventListener('click', async () => {
    
    if (!validateEditForm()) {
        return;
    }

    const formData = getEditFormData();
    
    try {
        const response = await fetch(`/api/proveedor/${idEditProveedor}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        if (response.ok) {
            Swal.fire('Éxito', 'Proveedor actualizado correctamente', 'success')
                .then(() => {
                    location.reload();
                });
        } else {
            Swal.fire('Error', 'No se pudo actualizar el proveedor', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        Swal.fire('Error', 'Error en la conexión con el servidor', 'error');
    }
});

