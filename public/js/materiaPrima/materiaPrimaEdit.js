const modalMateriaPrimaEdit = new mdb.Modal(document.getElementById('modalMateriaPrimaEdit'));
let idEditMateriaPrima = ''

on(document, 'click', '.btn-editar', async e => {
    const button = e.target.closest('.btn-editar'); 
    idEditMateriaPrima = button.getAttribute('data-id');
    mostrarInfoPanel(idEditMateriaPrima)
});

function mostrarInfoPanel(idEditMateriaPrima) {
    fetch('/api/materiasPrimas/'+idEditMateriaPrima)
        .then(response => response.json())
        .then(data => {
            setFormValues(data)
        })
        .catch(error => console.log(error)); // Mover .catch() al final
}

function setFormValues(data) {
    // Campos anteriores
    document.getElementById('editClave').value = data.clave || '';
    document.getElementById('editCodigoBarras').value = data.codigoBarras || '';
    document.getElementById('editNombre').value = data.nombre || '';
    document.getElementById('editDescripcion').value = data.descripcion || '';
    document.getElementById('editClaveProductoSAT').value = data.claveProductoSAT || '';
    document.getElementById('editEstado').value = data.estado || 'activo';

    // Nuevos campos - datos financieros
    const datosFinancieros = data.datosFinancieros || {};
    document.getElementById('editTiempoSurtido').value = datosFinancieros.tiempoSurtido || '';
    document.getElementById('editControlAlmacen').value = datosFinancieros.controlAlmacen || '';
    document.getElementById('editVolumen').value = datosFinancieros.volumen || '';
    document.getElementById('editPeso').value = datosFinancieros.peso || '';
    document.getElementById('editStockMinimo').value = datosFinancieros.stockMinimo || '';
    document.getElementById('editStockMaximo').value = datosFinancieros.stockMaximo || '';
    document.getElementById('editCosto').value = datosFinancieros.costo || '';
    document.getElementById('editUltimoCosto').value = datosFinancieros.ultimoCosto || '';
    document.getElementById('editCostoPromedio').value = datosFinancieros.costoPromedio || '';
    document.getElementById('editNumeroPrecioMinimo').value = datosFinancieros.numeroPrecioMinimo || '';
    document.getElementById('editNumeroPrecioMaximo').value = datosFinancieros.numeroPrecioMaximo || '';
    document.getElementById('editPresentacion').value = datosFinancieros.presentacion || '';

    // Precios
    document.getElementById('editPrecio1').value = datosFinancieros.precio1 || '';
    document.getElementById('editPorcentajePrecio1').value = datosFinancieros.porcentajePrecio1 || '';
    document.getElementById('editPrecio2').value = datosFinancieros.precio2 || '';
    document.getElementById('editPorcentajePrecio2').value = datosFinancieros.porcentajePrecio2 || '';
    document.getElementById('editPrecio3').value = datosFinancieros.precio3 || '';
    document.getElementById('editPorcentajePrecio3').value = datosFinancieros.porcentajePrecio3 || '';
    document.getElementById('editPrecio4').value = datosFinancieros.precio4 || '';
    document.getElementById('editPorcentajePrecio4').value = datosFinancieros.porcentajePrecio4 || '';
    document.getElementById('editPrecio5').value = datosFinancieros.precio5 || '';
    document.getElementById('editPorcentajePrecio5').value = datosFinancieros.porcentajePrecio5 || '';
    document.getElementById('editPrecio6').value = datosFinancieros.precio6 || '';
    document.getElementById('editPorcentajePrecio6').value = datosFinancieros.porcentajePrecio6 || '';
    document.getElementById('editPrecio7').value = datosFinancieros.precio7 || '';
    document.getElementById('editPorcentajePrecio7').value = datosFinancieros.porcentajePrecio7 || '';
    document.getElementById('editPrecio8').value = datosFinancieros.precio8 || '';
    document.getElementById('editPorcentajePrecio8').value = datosFinancieros.porcentajePrecio8 || '';
    document.getElementById('editPrecio9').value = datosFinancieros.precio9 || '';
    document.getElementById('editPorcentajePrecio9').value = datosFinancieros.porcentajePrecio9 || '';
    document.getElementById('editPrecio10').value = datosFinancieros.precio10 || '';
    document.getElementById('editPorcentajePrecio10').value = datosFinancieros.porcentajePrecio10 || '';

    // Rangos
    document.getElementById('editRangoInicial1').value = datosFinancieros.rangoInicial1 || '';
    document.getElementById('editRangoFinal1').value = datosFinancieros.rangoFinal1 || '';
    document.getElementById('editRangoInicial2').value = datosFinancieros.rangoInicial2 || '';
    document.getElementById('editRangoFinal2').value = datosFinancieros.rangoFinal2 || '';
    document.getElementById('editRangoInicial3').value = datosFinancieros.rangoInicial3 || '';
    document.getElementById('editRangoFinal3').value = datosFinancieros.rangoFinal3 || '';
    document.getElementById('editRangoInicial4').value = datosFinancieros.rangoInicial4 || '';
    document.getElementById('editRangoFinal4').value = datosFinancieros.rangoFinal4 || '';
    document.getElementById('editRangoInicial5').value = datosFinancieros.rangoInicial5 || '';
    document.getElementById('editRangoFinal5').value = datosFinancieros.rangoFinal5 || '';
    document.getElementById('editRangoInicial6').value = datosFinancieros.rangoInicial6 || '';
    document.getElementById('editRangoFinal6').value = datosFinancieros.rangoFinal6 || '';
    document.getElementById('editRangoInicial7').value = datosFinancieros.rangoInicial7 || '';
    document.getElementById('editRangoFinal7').value = datosFinancieros.rangoFinal7 || '';
    document.getElementById('editRangoInicial8').value = datosFinancieros.rangoInicial8 || '';
    document.getElementById('editRangoFinal8').value = datosFinancieros.rangoFinal8 || '';
    document.getElementById('editRangoInicial9').value = datosFinancieros.rangoInicial9 || '';
    document.getElementById('editRangoFinal9').value = datosFinancieros.rangoFinal9 || '';
    document.getElementById('editRangoInicial10').value = datosFinancieros.rangoInicial10 || '';
    document.getElementById('editRangoFinal10').value = datosFinancieros.rangoFinal10 || '';

    // Limpiar la tabla de proveedores
    const proveedoresTable = document.getElementById('editProveedores');
    proveedoresTable.innerHTML = '';

    // Agregar proveedores a la tabla
    if (Array.isArray(data.proveedores)) {
        data.proveedores.forEach(proveedor => {
            if (proveedor && proveedor._id) {
                agregarProveedorATablaEdit(proveedor);
            }
        });
    }

    modalMateriaPrimaEdit.show()
}

function getFormValuesEdit() {
    return {
        clave: document.getElementById('editClave').value,
        codigoBarras: document.getElementById('editCodigoBarras').value,
        nombre: document.getElementById('editNombre').value,
        descripcion: document.getElementById('editDescripcion').value,
        claveProductoSAT: document.getElementById('editClaveProductoSAT').value,
        estado: document.getElementById('editEstado').value,
        datosFinancieros: {
            tiempoSurtido: document.getElementById('editTiempoSurtido').value,
            controlAlmacen: document.getElementById('editControlAlmacen').value,
            volumen: document.getElementById('editVolumen').value,
            peso: document.getElementById('editPeso').value,
            stockMinimo: document.getElementById('editStockMinimo').value,
            stockMaximo: document.getElementById('editStockMaximo').value,
            costo: document.getElementById('editCosto').value,
            ultimoCosto: document.getElementById('editUltimoCosto').value,
            costoPromedio: document.getElementById('editCostoPromedio').value,
            numeroPrecioMinimo: document.getElementById('editNumeroPrecioMinimo').value,
            numeroPrecioMaximo: document.getElementById('editNumeroPrecioMaximo').value,
            presentacion: document.getElementById('editPresentacion').value,
            precio1: document.getElementById('editPrecio1').value,
            porcentajePrecio1: document.getElementById('editPorcentajePrecio1').value,
            precio2: document.getElementById('editPrecio2').value,
            porcentajePrecio2: document.getElementById('editPorcentajePrecio2').value,
            precio3: document.getElementById('editPrecio3').value,
            porcentajePrecio3: document.getElementById('editPorcentajePrecio3').value,
            precio4: document.getElementById('editPrecio4').value,
            porcentajePrecio4: document.getElementById('editPorcentajePrecio4').value,
            precio5: document.getElementById('editPrecio5').value,
            porcentajePrecio5: document.getElementById('editPorcentajePrecio5').value,
            precio6: document.getElementById('editPrecio6').value,
            porcentajePrecio6: document.getElementById('editPorcentajePrecio6').value,
            precio7: document.getElementById('editPrecio7').value,
            porcentajePrecio7: document.getElementById('editPorcentajePrecio7').value,
            precio8: document.getElementById('editPrecio8').value,
            porcentajePrecio8: document.getElementById('editPorcentajePrecio8').value,
            precio9: document.getElementById('editPrecio9').value,
            porcentajePrecio9: document.getElementById('editPorcentajePrecio9').value,
            precio10: document.getElementById('editPrecio10').value,
            porcentajePrecio10: document.getElementById('editPorcentajePrecio10').value,
            rangoInicial1: document.getElementById('editRangoInicial1').value,
            rangoFinal1: document.getElementById('editRangoFinal1').value,
            rangoInicial2: document.getElementById('editRangoInicial2').value,
            rangoFinal2: document.getElementById('editRangoFinal2').value,
            rangoInicial3: document.getElementById('editRangoInicial3').value,
            rangoFinal3: document.getElementById('editRangoFinal3').value,
            rangoInicial4: document.getElementById('editRangoInicial4').value,
            rangoFinal4: document.getElementById('editRangoFinal4').value,
            rangoInicial5: document.getElementById('editRangoInicial5').value,
            rangoFinal5: document.getElementById('editRangoFinal5').value,
            rangoInicial6: document.getElementById('editRangoInicial6').value,
            rangoFinal6: document.getElementById('editRangoFinal6').value,
            rangoInicial7: document.getElementById('editRangoInicial7').value,
            rangoFinal7: document.getElementById('editRangoFinal7').value,
            rangoInicial8: document.getElementById('editRangoInicial8').value,
            rangoFinal8: document.getElementById('editRangoFinal8').value,
            rangoInicial9: document.getElementById('editRangoInicial9').value,
            rangoFinal9: document.getElementById('editRangoFinal9').value,
            rangoInicial10: document.getElementById('editRangoInicial10').value,
            rangoFinal10: document.getElementById('editRangoFinal10').value
        },
        proveedores: proveedoresSeleccionadosEdit
    };
}

document.getElementById('btnGuardarMateriaPrimaEdit').addEventListener('click', async () => {

    const formData = getFormValuesEdit();
    
    try {
        const response = await fetch(`/api/materiasPrimas/${idEditMateriaPrima}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        if (response.ok) {
            Swal.fire('Éxito', 'Materia prima actualizada correctamente', 'success')
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

