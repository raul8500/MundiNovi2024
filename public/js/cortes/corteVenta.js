
const btnCorteFinal = document.getElementById('btnCorteFinal')

btnCorteFinal.addEventListener('click', () => {
    let body = getfields();

    if (body == null) {
        return;
    }

    fetch('/api/cortesFinales', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    })
    .then(async response => {
        if (response.status === 200) {
            // Si se actualizó un corte existente, mostrar éxito
            const data = await response.json();
            Swal.fire({
                title: 'Éxito',
                text: 'Corte actualizado exitosamente.',
                icon: 'success',
                confirmButtonText: 'Aceptar'
            }).then(async () => {
                console.log(data.corte);  // Verifica que los datos son correctos
                await imprimirTicketCorteParcial(data.corte);  // Pasa la información del corte
            });

        } else if (response.status === 409) {
            // Si no hay un corte abierto
            const errorData = await response.json();
            Swal.fire({
                title: 'Error',
                text: errorData.error,
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
        } else {
            throw new Error('Error inesperado en la respuesta del servidor.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        Swal.fire({
            title: 'Error',
            text: 'Hubo un problema al realizar el corte. Por favor, inténtalo de nuevo.',
            icon: 'error',
            confirmButtonText: 'Aceptar'
        });
    });
});

function getfields() {
    const billetes1000 = parseInt(document.getElementById('billetes1000').value) || 0;
    const billetes500 = parseInt(document.getElementById('billetes500').value) || 0;
    const billetes200 = parseInt(document.getElementById('billetes200').value) || 0;
    const billetes100 = parseInt(document.getElementById('billetes100').value) || 0;
    const billetes50 = parseInt(document.getElementById('billetes50').value) || 0;
    const billetes20 = parseInt(document.getElementById('billetes20').value) || 0;
    const monedas20 = parseInt(document.getElementById('monedas20').value) || 0;
    const monedas10 = parseInt(document.getElementById('monedas10').value) || 0;
    const monedas5 = parseInt(document.getElementById('monedas5').value) || 0;
    const monedas2 = parseInt(document.getElementById('monedas2').value) || 0;
    const monedas1 = parseInt(document.getElementById('monedas1').value) || 0;
    const monedas50c = parseFloat(document.getElementById('monedas50c').value) || 0;
    const observaciones = document.getElementById('observacionesCorte').value || '';

    const total = (billetes1000 * 1000) + (billetes500 * 500) + (billetes200 * 200) + 
                  (billetes100 * 100) + (billetes50 * 50) + (billetes20 * 20) +
                  (monedas20 * 20) + (monedas10 * 10) + (monedas5 * 5) +
                  (monedas2 * 2) + (monedas1 * 1) + (monedas50c * 0.5);

    if (total <= 2000) {
        const fields = {
            userId : infoUser._id,
            cantidad: total,
            observaciones: observaciones,
        };
        return fields;
    } else {
        Swal.fire({
            icon: 'warning',
            title: 'Advertencia',
            text: `El total es mayor que $2000 (actualmente es $${total.toFixed(2)}). Debes hacer un corte parcial antes de continuar.`
        });
        return null;
    }
}

async function imprimirTicketCorteParcial(corteParcial) {
    console.log("Datos del corte parcial:", corteParcial.corteActualizado);  // Verifica los datos aquí

    const { folio, fecha_final, fecha_inicial, totalVentaCorte, monto_transferencias, total_tarjetas } = corteParcial.corteActualizado;
    const {observaciones } = corteParcial.corteActualizado.corteFinal;
    const sucursalName = await cargarSucursal(infoUser.sucursalId);

    // Crear el contenido del ticket
    const contenidoTicket = `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2 style="text-align: center;">Corte Parcial</h2>
            <p><strong>Sucursal:</strong> ${sucursalName}</p>
            <p><strong>Folio:</strong> ${folio}</p>
            <p><strong>Usuario:</strong> ${infoUser.username}</p>
            <p><strong>Fecha apertura:</strong> ${new Date(fecha_inicial).toLocaleString()}</p>
            <p><strong>Fecha cierre:</strong> ${new Date(fecha_final).toLocaleString()}</p>
            <p><strong>Monto total:</strong> $${totalVentaCorte.toFixed(2)}</p>
            <p><strong>Observaciones:</strong> ${observaciones}</p>
            <p><strong>Total Tarjetas:</strong> ${total_tarjetas}</p>
            <p><strong>Total Transferencias:</strong> ${monto_transferencias}</p>
        </div>
    `;

    console.log("Creando ventana para ticket...");

    // Crear una nueva ventana para el ticket
    const ventanaTicket = window.open('', '_blank', 'width=320,height=500');

    if (!ventanaTicket) {
        console.error("Error: No se pudo abrir la ventana para el ticket.");
        return;
    }

    ventanaTicket.document.write('<html><head><title>Ticket de Corte Parcial</title></head><body>');
    ventanaTicket.document.write(contenidoTicket);
    ventanaTicket.document.write('</body></html>');
    ventanaTicket.document.close();

    // Esperar que la ventana se cargue completamente antes de imprimir
    ventanaTicket.onload = function() {
        ventanaTicket.print();
    };
}

// Cambiar a async para devolver el nombre de la sucursal
async function cargarSucursal(id) {
    try {
        const response = await fetch('/api/sucursal/id/' + id);
        const data = await response.json();
        return data.nombre;
    } catch (error) {
        console.error('Error al cargar sucursal:', error);
        return 'Sucursal no encontrada'; // Manejar error de carga de sucursal
    }
}

