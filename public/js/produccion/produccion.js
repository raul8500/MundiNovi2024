$(document).ready(function () {
    $('#tablaProduccion').DataTable({
        ajax: {
            url: '/api/formulasPorProducir', // URL donde obtienes los datos
            dataSrc: '' // Si los datos están en un array
        },
        columns: [
            { data: 'productoFinal.reference' },
            { data: 'existencia' },
            { 
                data: '', // Columna vacía
                render: function () {
                    return ''; // Devuelve una cadena vacía
                }
            },
            { 
                data: '', // Otra columna vacía
                render: function () {
                    return ''; // Devuelve una cadena vacía
                }
            },
            {
                data: null, // Esta columna es para los botones
                render: function (data, type, row) {
                    return `
                        <button class="btn btn-primary btn-producir" data-id="${row._id}" title="Producir"> 
                            <i class="fa-solid fa-screwdriver-wrench"></i> Producir
                        </button>
                    `;
                },
                orderable: false, // Desactiva el ordenamiento en esta columna
                searchable: false // Desactiva la búsqueda en esta columna
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
            "sUrl": "",
            "sInfoThousands": ",",
            "sLoadingRecords": "Cargando...",
            "oPaginate": {
                "sFirst": "Primera",
                "sLast": "Última",
                "sNext": "Siguiente",
                "sPrevious": "Anterior"
            },
            "oAria": {
                "sSortAscending": ": activar para ordenar la columna de manera ascendente",
                "sSortDescending": ": activar para ordenar la columna de manera descendente"
            }
        }
    });
});


const modalProducir = new mdb.Modal(document.getElementById('ModalProducir'));
const contenedorMaterias = document.getElementById('materiasPrimasTable');
const cantidadSugeridaInput = document.getElementById('cantidadSugerida');
const btnProducir = document.getElementById('btnProducir');

let materiasPrimasData = []; // Guardar datos de materias primas globalmente para recalcular
let userInfo = ''
let productoFinal = ''

function verificarTokenYMostrar() {
    fetch('/api/verifySesion')
        .then(response => response.json())
        .then(data => {
            userInfo = data;
        })
        .catch(error => console.error('Error al verificar sesión:', error));
}

verificarTokenYMostrar()

// Evento para mostrar la fórmula al hacer clic en "Producir"
on(document, 'click', '.btn-producir', async e => {
    const button = e.target.closest('.btn-producir'); // Obtiene el botón que fue clicado
    const id = button.getAttribute('data-id');
    mostrarFormula(id);
});

function mostrarFormula(id) {
    fetch('/api/formulasPorProducir/' + id)
        .then(response => response.json())
        .then(data => {
            productoFinal = data
            setEditFormData(data);
            
        })
        .catch(error => console.log(error));
}

function setEditFormData(data) {
    document.getElementById('claveProducto').value = data.productoFinal.reference || '';
    document.getElementById('nombreFormula').value = data.nombreFormula || '';
    document.getElementById('observacionesInput').value = data.observaciones || '';
    document.getElementById('cantidadBase').value = data.paraQueCantidadEsLaFormula || '';
    cantidadSugeridaInput.value = data.paraQueCantidadEsLaFormula || ''; // Por defecto igual a la base

    materiasPrimasData = data.materiasPrimas; // Guardar materias primas para recalcular

    actualizarTablaMaterias(data.paraQueCantidadEsLaFormula); // Renderizar la tabla inicialmente
    modalProducir.show();

    // Escuchar cambios en el input de cantidad sugerida
    cantidadSugeridaInput.addEventListener('input', () => {
        const cantidadSugerida = parseFloat(cantidadSugeridaInput.value) || 0;
        actualizarTablaMaterias(cantidadSugerida);
    });
}

// Actualizar la tabla de materias primas
function actualizarTablaMaterias(cantidadSugerida) {
    const cantidadBase = parseFloat(document.getElementById('cantidadBase').value) || 0;

    let materiasPrimas = '';
    materiasPrimasData.forEach((item) => {
        const proporcion = cantidadBase ? (item.cantidad * cantidadSugerida) / cantidadBase : 0;
        const existencia = item.ultimoMovimiento?.existencia || 0; // Asegúrate de que la existencia tenga un valor numérico
        const suficiente = existencia >= proporcion;

        console.log(`Clave: ${item._id.clave}, Proporción: ${proporcion}, Existencia: ${existencia}, Suficiente: ${suficiente}`);

        materiasPrimas += `
            <tr class="text-center ${!suficiente ? 'table-danger text-white' : ''}">
                <td>${item._id.nombre}</td>
                <td>${item.cantidad}</td>
                <td>${proporcion.toFixed(2)}</td>
            </tr>
        `;
    });

    contenedorMaterias.innerHTML = materiasPrimas;
}
// Evento para manejar la acción de producir
btnProducir.addEventListener('click', () => {
    const claveProducto = document.getElementById('claveProducto').value;
    const nombreProducto = document.getElementById('nombreFormula').value;
    const cantidadSugerida = parseFloat(cantidadSugeridaInput.value) || 0;

    // Validar que la cantidad sugerida sea mayor a 0
    if (cantidadSugerida <= 0) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'La cantidad sugerida debe ser mayor a 0 para producir.',
        });
        return;
    }

    // Validar si hay suficientes materiales
    const materialesInsuficientes = materiasPrimasData.some(item => {
        const cantidadBase = parseFloat(document.getElementById('cantidadBase').value) || 0;
        const proporcion = cantidadBase ? (item.cantidad * cantidadSugerida) / cantidadBase : 0;
        const existencia = item.ultimoMovimiento?.existencia || 0;

        return existencia < proporcion; // True si falta material
    });

    if (materialesInsuficientes) {
        Swal.fire({
            icon: 'error',
            title: 'Materiales insuficientes',
            text: 'No hay suficientes materiales para completar la producción. Verifica los elementos resaltados en rojo.',
        });
        return;
    }

    // Recuperar datos para enviar
    const productos = materiasPrimasData.map(item => {
        const cantidadBase = parseFloat(document.getElementById('cantidadBase').value) || 0;
        const proporcion = cantidadBase ? (item.cantidad * cantidadSugerida) / cantidadBase : 0;

        return {
            clave: item._id.clave,
            nombre: item._id.nombre,
            cantidad: item.cantidad,
            proporcion: proporcion.toFixed(2),
        };
    });

    // Enviar la solicitud de producción al backend
    fetch('/api/producirFormula', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            claveProducto,
            costoUnidad: productoFinal.costoUnidad,
            nombreProducto,
            cantidadSugerida,
            productos,
            userInfo,
        }),
    })
        .then(response => {
            if (response.status === 201) {
                return response.json(); // Si es 201, procesar el JSON
            } else {
                throw new Error('No se pudo completar la producción.');
            }
        })
        .then(data => {
            Swal.fire({
                icon: 'success',
                title: 'Producción completada',
                text: 'Producción registrada exitosamente.',
                timer: 2000,
                showConfirmButton: false,
            });
            generarVistaImpresion(data.produccion); // Llamar a la función para imprimir
        })
        .catch(error => {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'Hubo un problema al registrar la producción.',
            });
            console.error('Error:', error);
        });
});

// Función para generar la vista de impresión
function generarVistaImpresion(produccion) {
    // Crear contenido para imprimir
    const contenido = `
        <div style="font-family: Arial, sans-serif; padding: 10px; width: 80%; margin: 0 auto; text-align: left;">
            <h2 style="text-align: center; margin-bottom: 10px;">Elaboración de Producto</h2>
            <div style="margin-bottom: 10px;">
                <p style="margin: 0; line-height: 1.2;"><strong>Fecha:</strong> ${new Date(produccion.fechaHora).toLocaleString()}</p>
                <p style="margin: 0; line-height: 1.2;"><strong>Nombre Producto:</strong> ${produccion.nombreProducto}</p>
                <p style="margin: 0; line-height: 1.2;"><strong>Cantidad:</strong> ${produccion.cantidad}</p>
                <p style="margin: 0; line-height: 1.2;"><strong>Folio:</strong> ${produccion.folio}</p>
                <p style="margin: 0; line-height: 1.2;"><strong>Lote:</strong> ${produccion.numeroLote}</p>
            </div>
            <h3 style="margin-bottom: 10px;"></h3>
            <table style="width: 50%; border-collapse: collapse; margin-bottom: 20px; text-align: left;">
                <thead>
                    <tr style="border-bottom: 1px solid #000;">
                        <th style="padding: 5px;">Nombre</th>
                        <th style="padding: 5px;">Cantidad Utilizada</th>
                    </tr>
                </thead>
                <tbody>
                    ${produccion.materiasPrimas
                        .map(
                            mp => `
                        <tr>
                            <td style="padding: 5px;">${mp.nombre || 'N/A'}</td>
                            <td style="padding: 5px;">${mp.cantidad}</td>
                        </tr>`
                        )
                        .join('')}
                </tbody>
            </table>
            <div style="margin-top: 20px;">
                <div style="margin-bottom: 20px;">
                    <p style="border-top: 1px solid #000; width: 40%; margin: 0 auto; text-align: center; padding-top: 5px;">
                        Firma Producción
                    </p>
                </div>
                <div>
                    <p style="border-top: 1px solid #000; width: 40%; margin: 0 auto; text-align: center; padding-top: 5px;">
                        Firma Supervisión
                    </p>
                </div>
            </div>
        </div>
    `;

    // Crear una ventana para la impresión
    const ventanaImpresion = window.open('', '_blank', 'width=800,height=600');
    ventanaImpresion.document.write(contenido);
    ventanaImpresion.document.close(); // Cerrar el documento para procesar el contenido
    ventanaImpresion.focus(); // Enfocar la ventana de impresión
    ventanaImpresion.print(); // Abrir el diálogo de impresión
    ventanaImpresion.close(); // Cerrar la ventana después de imprimir

    // Refrescar la página después de la impresión
    window.location.reload();
}
