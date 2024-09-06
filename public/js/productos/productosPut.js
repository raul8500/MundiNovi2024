const modalProductoEdit = new mdb.Modal(document.getElementById('ModalEditProducto'));



// Manejador de clic para editar sucursales
on(document, 'click', '.btnEditProductos', async e => {
    modalProductoEdit.show()
});