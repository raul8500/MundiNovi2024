const btnCorteFinal = document.getElementById('btnCorteFinal');

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
            const data = await response.json();
            console.log(data)

            Swal.fire({
                title: 'Éxito',
                text: 'Corte actualizado exitosamente.',
                icon: 'success',
                confirmButtonText: 'Aceptar'
            }).then(async () => {
                console.log(data)
                await imprimirTicketCorteFinal(data.corte, data.codigoBarras);
                window.location.replace("/puntoventa");
            });

        } else if (response.status === 409) {
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

async function imprimirTicketCorteFinal(corte, codigoBarras) {

    const { folio, fecha_final, fecha_inicial, finanzasTotales, corteFinal } = corte;
    const sucursalName = await cargarSucursal(infoUser.sucursalId);

    const contenidoTicket = `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2 style="text-align: center;">Corte Final</h2>
            <p><strong>Sucursal:</strong> ${sucursalName}</p>
            <p><strong>Folio:</strong> ${folio}</p>
            <p><strong>Usuario:</strong> ${infoUser.username}</p>
            <p><strong>Fecha apertura:</strong> ${new Date(fecha_inicial).toLocaleString()}</p>
            <p><strong>Fecha cierre:</strong> ${new Date(fecha_final).toLocaleString()}</p>
            <p><strong>Monto total:</strong> $${corteFinal.corte_total.toFixed(2)}</p>
            <p><strong>Total Tarjetas:</strong> $${finanzasTotales.T_tarjetas.toFixed(2)}</p>
            <p><strong>Total Transferencias:</strong> $${finanzasTotales.T_transferencias.toFixed(2)}</p>
            <p><strong>Código de Barras:</strong></p>
            <img src="img/archivos/${folio}.png" alt="Código de Barras" />
        </div>
    `;

    const ventanaTicket = window.open('', '_blank', 'width=320,height=500');
    ventanaTicket.document.write('<html><head><title>Ticket de Corte Final</title></head><body>');
    ventanaTicket.document.write(contenidoTicket);
    ventanaTicket.document.write('</body></html>');
    ventanaTicket.document.close();

    ventanaTicket.onload = function() {
        ventanaTicket.print();
    };
}

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


