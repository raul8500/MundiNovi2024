$(document).ready(function () {
    let userSuc = '';

    function getUser() {
        fetch('/api/verifySesion')
            .then(response => response.json())
            .then(data => {
                userSuc = data;
                console.log(userSuc)
                // 🔄 Cargar la tabla una vez que se tenga el ID de la sucursal
                cargarTabla(userSuc.sucursalId);
            })
            .catch(error => console.log(error));
    }

    function cargarTabla(sucursalId) {
        $('#tablaRecepcion').DataTable({
            ajax: {
                url: `/api/traspasosSuc/${sucursalId}`, // 🔗 URL con ID de sucursal destino
                dataSrc: 'traspasos'
            },
            order: [[1, 'desc']],
            columns: [
                { data: 'folio', title: 'Folio' },
                { 
                    data: 'fecha', 
                    title: 'Fecha', 
                    render: function (data) {
                        return new Date(data).toLocaleDateString();
                    }
                },
                { data: 'sucursalOrigen.nombre', title: 'Sucursal Origen' },
                { data: 'usuarioOrigen.name', title: 'Usuario Origen' },
                { data: 'sucursalDestino.nombre', title: 'Sucursal Destino' },
                { data: 'observaciones', title: 'Observaciones' },
                { 
                    data: 'estado', 
                    title: 'Estado',
                    render: function (data) {
                        if (data === 0) return '<span class="badge badge-warning">En almacén</span>';
                        if (data === 1) return '<span class="badge badge-info">En reparto</span>';
                        if (data === 2) return '<span class="badge badge-success">Recibido</span>';
                        return '<span class="badge badge-secondary">Desconocido</span>';
                    }
                },
                               
                {
                    data: 'estado',
                    title: 'Acciones',
                    render: function (data, type, row) {
                        let botones = '';
                        if (data === 1) {
                            botones += `
                                <button class="btn btn-warning btn-recibir" data-id="${row._id}" title="Recibir">
                                    <i class="fa-solid fa-truck"></i> Recibir
                                </button>
                            `;
                        }
                        return botones;
                    },
                    orderable: false,
                    searchable: false
                }
            ],
            language: {
                "sProcessing": "Procesando...",
                "sLengthMenu": "Mostrar _MENU_ registros",
                "sZeroRecords": "No se encontraron resultados",
                "sInfo": "Mostrando _START_ a _END_ de _TOTAL_ registros",
                "sInfoEmpty": "Mostrando 0 a 0 de 0 registros",
                "sInfoFiltered": "(filtrado de _MAX_ registros totales)",
                "sSearch": "Buscar:",
                "oPaginate": {
                    "sFirst": "Primera",
                    "sLast": "Última",
                    "sNext": "Siguiente",
                    "sPrevious": "Anterior"
                }
            }
        });

        let productosRepartoGlobal = [];

        let traspasoIdActual = null; // Guarda el ID actual del traspaso

        $('#tablaRecepcion').on('click', '.btn-recibir', async function () {
            const id = $(this).data('id');
            traspasoIdActual = id;
        
            try {
                const response = await fetch(`/api/traspasos/${id}`);
                if (!response.ok) throw new Error('Error al obtener el traspaso');
        
                const data = await response.json();
                const productos = data.traspaso.productosReparto || [];
        
                productosRepartoGlobal = productos.map(p => ({
                    name: p.name,
                    reference: p.reference,
                    cantidad: p.cantidad,
                    contados: 0
                }));
        
                renderTablaRecepcion();
                $('#modalRecepcion').modal('show');
                setTimeout(() => $('#inputReferencia').focus(), 300);
            } catch (error) {
                console.error('❌ Error al obtener el traspaso:', error);
                Swal.fire('❌ Error', 'No se pudo obtener la información del traspaso.', 'error');
            }
        });

        function renderTablaRecepcion() {
            const tbody = $('#tablaProductosReparto tbody');
            tbody.empty();

            productosRepartoGlobal.forEach(prod => {
                const completo = prod.contados >= prod.cantidad;
                const row = `
                    <tr data-ref="${prod.reference}">
                        <td>${prod.name}</td>
                        <td>${prod.reference}</td>
                        <td>${prod.cantidad}</td>
                        <td class="text-center check-col">
                            ${completo ? ' ✅' : ''}
                        </td>
                    </tr>
                `;
                tbody.append(row);
            });
        }

        // Escuchar el input y marcar productos de uno en uno
        $('#inputReferencia').on('input', function () {
            const referencia = $(this).val().trim();
            if (!referencia) return;

            let encontrado = false;

            productosRepartoGlobal = productosRepartoGlobal.map(p => {
                if (!encontrado && p.reference.toLowerCase() === referencia.toLowerCase() && p.contados < p.cantidad) {
                    p.contados += 1;
                    encontrado = true;
                }
                return p;
            });

            if (encontrado) {
                $('#inputReferencia').val('');
                renderTablaRecepcion();
            }
        });

        // Confirmar recepción
        $('#btnConfirmarRecepcion').on('click', async function () {
            const total = productosRepartoGlobal.length;
            const completos = productosRepartoGlobal.filter(p => p.contados >= p.cantidad).length;
        
            Swal.fire({
                title: '¿Confirmar recepción?',
                html: `Productos completamente contados: <strong>${completos}/${total}</strong>`,
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Sí, confirmar',
                cancelButtonText: 'Cancelar'
            }).then(async result => {
                if (result.isConfirmed) {
                    // ✅ Solo incluir productos con contados > 0
                    const productosRecibidos = productosRepartoGlobal
                        .filter(p => p.contados > 0)
                        .map(p => ({
                            reference: p.reference,
                            name: p.name,
                            cantidad: p.contados
                        }));
        
                    // Validación final
                    if (productosRecibidos.length === 0) {
                        return Swal.fire('⚠️ Atención', 'No se ha contado ningún producto.', 'warning');
                    }
        
                    try {
                        const response = await fetch(`/api/traspasos/${traspasoIdActual}/recepcion-destino`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                productosRecibidos,
                                usuarioDestinoId: infoUser._id
                            })
                        });
        
                        if (!response.ok) throw new Error('Error al guardar la recepción');
        
                        const data = await response.json();
        
                        $('#modalRecepcion').modal('hide');
                        Swal.fire('✅ Confirmado', 'La recepción ha sido registrada.', 'success');
        
                        // Refrescar tabla y limpiar modal
                        $('#tablaRecepcion').DataTable().ajax.reload(null, false);
                        productosRepartoGlobal = [];
                        $('#inputReferencia').val('');
                    } catch (err) {
                        console.error('❌ Error en la recepción:', err);
                        Swal.fire('❌ Error', 'No se pudo guardar la recepción.', 'error');
                    }
                }
            });
        });

    }

    // 🔁 Inicia el proceso
    getUser();
});
