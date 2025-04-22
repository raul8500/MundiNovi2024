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
                url: `/api/traspasos`, // 🔗 URL con ID de sucursal destino
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
                    data: 'esFinalizado',
                    title: 'Acciones',
                    render: function (data, type, row) {
                        if (data) {
                            return '<span class="badge badge-success">Finalizado</span>';
                        } else {
                            return `
                                <button class="btn btn-info btn-recibir" data-id="${row._id}" title="Finalizar">
                                    <i class="fa-solid fa-truck"></i> Finalizar
                                </button>
                            `;
                        }
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

                // Evento para finalizar traspaso
        $('#tablaRecepcion').on('click', '.btn-recibir', async function () {
            const id = $(this).data('id');

            Swal.fire({
                title: '¿Finalizar traspaso?',
                text: 'Esta acción marcará el traspaso como finalizado y no podrá modificarse.',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sí, finalizar',
                cancelButtonText: 'Cancelar'
            }).then(async (result) => {
                if (result.isConfirmed) {
                    try {
                        const response = await fetch(`/api/traspasos/${id}/finalizar`, {
                            method: 'POST'
                        });

                        if (!response.ok) throw new Error('Error al finalizar traspaso');

                        Swal.fire('✅ Finalizado', 'El traspaso ha sido marcado como finalizado.', 'success');

                        // Recargar tabla sin resetear paginación
                        $('#tablaRecepcion').DataTable().ajax.reload(null, false);
                    } catch (error) {
                        console.error('❌ Error al finalizar traspaso:', error);
                        Swal.fire('❌ Error', 'No se pudo finalizar el traspaso.', 'error');
                    }
                }
            });
        });

    }

    // 🔁 Inicia el proceso
    getUser();
});
