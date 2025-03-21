const btnGuardarCorteParcial = document.getElementById('btnGuardarCorteParcial')

btnGuardarCorteParcial.addEventListener('click', () => {
    let body = getfields();

    if (body == null) {
        return;
    }

    fetch('/api/cortesParciales', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    })
    .then(async response => {
        if (response.status === 301) {
            return response.json().then(data => {
                Swal.fire({
                    title: 'Advertencia',
                    text: data.message || 'El total de ventas en efectivo es menor a $2000. No es posible realizar el corte parcial.',
                    icon: 'warning',
                    confirmButtonText: 'Aceptar'
                });
            });
        } else if (response.status === 201) {
            const data = await response.json();
            console.log('Success:', data);

            // Mostrar alerta de éxito con SweetAlert2
            Swal.fire({
                title: 'Éxito',
                text: 'Corte realizado con éxito.',
                icon: 'success',
                confirmButtonText: 'Aceptar'
            }).then(async () => {
                await imprimirTicketCorteParcial(data.corteParcial, data.codigoBarras);
                window.location.replace("/puntoventa");
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


async function imprimirTicketCorteParcial(corteParcial, codigoBarras) {
    const { folio, sucursal, usuario, fechaCreacion, cantidad, observaciones } = corteParcial;

    console.log(codigoBarras)
    // Cargar el nombre de la sucursal usando await para esperar el resultado
    const sucursalName = await cargarSucursal(infoUser.sucursalId);

    // Crear el contenido del ticket
    const contenidoTicket = `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2 style="text-align: center;">Corte Parcial</h2>
            <p><strong>Sucursal:</strong> ${sucursalName}</p>
            <p><strong>Folio:</strong> ${folio}</p>
            <p><strong>Usuario:</strong> ${infoUser.username}</p>
            <p><strong>Fecha:</strong> ${new Date(fechaCreacion).toLocaleString()}</p>
            <p><strong>Monto total:</strong> $${cantidad.toFixed(2)}</p>
            <p><strong>Observaciones:</strong> ${observaciones}</p>
            <p><strong>Código de Barras:</strong></p>
            <img src="img/archivos/${folio}.png" alt="Código de Barras" />
        </div>
    `;

    // Crear una nueva ventana para el ticket
    const ventanaTicket = window.open('', '_blank', 'width=320,height=500');
    ventanaTicket.document.write('<html><head><title>Ticket de Corte Parcial</title></head><body>');
    ventanaTicket.document.write(contenidoTicket);
    ventanaTicket.document.write('</body></html>');
    ventanaTicket.document.close();

    // Esperar que la ventana se cargue completamente antes de imprimir
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

    // Se permiten cortes de más de 2000
    if (total >= 2000) {
        const fields = {
            billetes_1000: billetes1000,
            billetes_500: billetes500,
            billetes_200: billetes200,
            billetes_100: billetes100,
            billetes_50: billetes50,
            billetes_20: billetes20,
            monedas_20: monedas20,
            monedas_10: monedas10,
            monedas_5: monedas5,
            monedas_2: monedas2,
            monedas_1: monedas1,
            monedas_50c: monedas50c,
            cantidad: total,
            observaciones: observaciones,
            recibido: false,
            vendedor: infoUser._id
        };

        return fields;

    // Si el total es menor a 2000, no se permite el corte
    } else {
        Swal.fire({
            icon: 'warning',
            title: 'Advertencia',
            text: `El total es menor que $2000. Actualmente es $${total.toFixed(2)}.`
        });
        return null;
    }
}


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

