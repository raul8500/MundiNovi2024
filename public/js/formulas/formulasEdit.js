const editFormulaModal = new mdb.Modal(document.getElementById('editFormulaModal'));
let idEditFormula = ''

const btnActualizarFormula = document.getElementById('btnActualizarFormula')

on(document, 'click', '.btn-editar', async e => {
    const button = e.target.closest('.btn-editar'); 
    idEditFormula = button.getAttribute('data-id');
    mostrarInfoPanel(idEditFormula)
});

function mostrarInfoPanel(idEditFormula) {
    fetch('/api/formulasProduccion/'+idEditFormula)
        .then(response => response.json())
        .then(data => {
            setFormValues(data)
        })
        .catch(error => console.log(error)); // Mover .catch() al final
}


function setFormValues(data) {
    document.getElementById('nombreFormulaEdit').value = data.nombreFormula || '';
    document.getElementById('paraQueCantidadEdit').value = data.paraQueCantidadEsLaFormula || '';
    document.getElementById('observacionesEdit').value = data.observaciones || '';

    // Configurar el input del producto con el nombre del producto
    const productoInput = document.getElementById('productoEdit');
    productoInput.value = data.productoFinal.name + ' (' + data.productoFinal.reference + ')' || '';

    let productoId = data.productoFinal._id || '';
    selectedProductIdEdit = productoId;

    // Cargar las materias primas en la tabla del modal
    cargarMateriasPrimasEnTablaEdit(data.materiasPrimas || []);

    // Mostrar el modal de edición
    editFormulaModal.show();
}



function getFormValuesEdit() {
    return {
        productoFinal: selectedProductIdEdit, // Si necesitas un ID específico para el producto final en edición
        nombreFormula: document.getElementById('nombreFormulaEdit').value,
        observaciones: document.getElementById('observacionesEdit').value,
        paraQueCantidadEsLaFormula: document.getElementById('paraQueCantidadEdit').value,
        materiasPrimas: materiasPrimasSeleccionadasEdit,
        costoPorcion: document.getElementById('materiasPrimasTotalEdit').value,
        costoUnidad: parseFloat(document.getElementById('materiasPrimasTotalEdit').value) / parseFloat(document.getElementById('paraQueCantidadEdit').value),
    };
}


document.getElementById('btnActualizarFormula').addEventListener('click', async () => {

    const formData = getFormValuesEdit();
    
    try {
        const response = await fetch(`/api/formulasProduccion/${idEditFormula}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        if (response.ok) {
            Swal.fire('Éxito', 'Formula actualizada correctamente', 'success')
                .then(() => {
                    location.reload();
                });
        } else {
            Swal.fire('Error', 'No se pudo actualizar la materia prima', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        Swal.fire('Error', 'Error en la conexión con el servidor', 'error');
    }
});

