function verificarFacturaVenta() {
    const facturaResumenVenta = document.getElementById('facturaResumenVenta')?.textContent.trim() || '';
    const usoCFDIContainer = document.getElementById('usoCFDIContainer');
    const cfdiSelect = document.getElementById('usoCFDI');

    if (facturaResumenVenta === '') {
        usoCFDIContainer.style.display = 'none';
        return true; // No se requiere CFDI si no es una factura
    } else {
        usoCFDIContainer.style.display = 'block';

        // Verificar si el select de CFDI existe antes de acceder a su valor
        if (cfdiSelect) {
            if (cfdiSelect.value === '') {
                Swal.fire({
                    icon: 'error',
                    title: 'CFDI no seleccionado',
                    text: 'Por favor, selecciona un CFDI antes de proceder con el pago.',
                    showConfirmButton: true,
                });
                return false; // No se puede proceder sin CFDI
            }
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Elemento CFDI no encontrado',
                text: 'El elemento para seleccionar CFDI no está disponible.',
                showConfirmButton: true,
            });
            return false; // No se puede proceder si el elemento CFDI no está disponible
        }
    }

    return true; // Puede proceder si es factura y CFDI está seleccionado
}



function generarResumenVentaJSON() {
    const totalAPagar = parseFloat(document.getElementById('totalAPagar').value) || 0;
    let totalPagado = 0;
    const formasDePagoUtilizadas = [];
    let saldoMonedero = 0;
    let cambio = 0;
    let restanteAPagar = totalAPagar;

    // Verificar si hay cliente seleccionado
    if (clienteSeleccionado && typeof clienteSeleccionado.monedero === 'number') {
        saldoMonedero = clienteSeleccionado.monedero;
    }

    // Obtener todas las formas de pago adicionales
    const formasDePago = document.querySelectorAll('.formaDePago');

    for (const forma of formasDePago) {
        const tipoPago = forma.querySelector('.form-select').value;
        const importePago = parseFloat(forma.querySelector('.importePago').value) || 0;

        if (!isNaN(importePago) && importePago > 0) {
            if (tipoPago === 'monedero') {
                if (!clienteSeleccionado || saldoMonedero <= 0) {
                    Swal.fire({
                        icon: "error",
                        title: "Cliente no seleccionado o saldo insuficiente",
                        text: "No se puede usar monedero sin un cliente seleccionado o sin saldo suficiente en el monedero.",
                        showConfirmButton: true,
                    });
                    return;
                }

                if (importePago > saldoMonedero) {
                    Swal.fire({
                        icon: "error",
                        title: "Saldo insuficiente en monedero",
                        text: `El importe de ${importePago.toFixed(2)} excede el saldo disponible de ${saldoMonedero.toFixed(2)}.`,
                        showConfirmButton: true,
                    });
                    return;
                }

                if (importePago > restanteAPagar) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Importe excedido',
                        text: 'El importe del monedero no puede exceder el total a pagar.',
                        showConfirmButton: true,
                    });
                    return;
                }

                saldoMonedero -= importePago;
            }

            if (tipoPago === 'cash') {
                if (importePago > restanteAPagar) {
                    cambio = importePago - restanteAPagar;
                    formasDePagoUtilizadas.push({
                        tipo: tipoPago,
                        importe: importePago,
                        cambio: cambio.toFixed(2)
                    });
                } else {
                    formasDePagoUtilizadas.push({
                        tipo: tipoPago,
                        importe: importePago,
                        cambio: 0
                    });
                }
            } else {
                if (importePago > restanteAPagar) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Importe excedido',
                        text: 'No puedes ingresar un importe mayor al total a pagar para tarjetas, transferencias y monederos.',
                        showConfirmButton: true,
                    });
                    return;
                }

                formasDePagoUtilizadas.push({
                    tipo: tipoPago,
                    importe: importePago
                });
            }

            totalPagado += importePago;
            restanteAPagar -= importePago;
        }
    }

    if (totalPagado < totalAPagar) {
        Swal.fire({
            icon: "error",
            title: "El pago es insuficiente",
            text: `Faltan ${(totalAPagar - totalPagado).toFixed(2)} para cubrir el total.`,
            showConfirmButton: true,
        });
        return;
    }

    const facturaResumenVenta = document.getElementById('facturaResumenVenta')?.textContent.trim() || '';
    const cfdiSelect = document.getElementById('usoCFDI');

    const resumenVenta = {
        cliente: clienteSeleccionado || '',
        totalAPagar: totalAPagar.toFixed(2),
        totalPagado: totalPagado.toFixed(2),
        formasDePago: formasDePagoUtilizadas,
        esFactura: facturaResumenVenta !== '',
        cfdiSeleccionado: cfdiSelect ? cfdiSelect.value : ''
    };

    // Mostrar el modal para elegir entre imprimir o correo
    $('#ticketModal').modal('show');

    // Si elige imprimir
    document.getElementById('ticketImpreso').addEventListener('click', function() {
        $('#ticketModal').modal('hide'); // Oculta el primer modal
        completarVenta(resumenVenta, 'impreso'); // Llama a la función para imprimir el ticket
    });

    // Si elige correo electrónico
    document.getElementById('ticketCorreo').addEventListener('click', function() {
        $('#ticketModal').modal('hide'); // Oculta el primer modal
        $('#emailModal').modal('show');  // Muestra el segundo modal para ingresar el correo
    });

    // Enviar el correo con el ticket
    document.getElementById('enviarCorreo').addEventListener('click', function() {
        const email = document.getElementById('emailInput').value;
        if (validateEmail(email)) {
            $('#emailModal').modal('hide'); // Oculta el modal de correo
            completarVenta(resumenVenta, 'correo', email); // Llama a la función para enviar el ticket por correo
        } else {
            alert('Por favor, ingrese un correo válido.'); // Valida el correo
        }
    });
}

// Función para validar el correo
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}


function pagarVenta() {
    // Paso 1: Obtener el importe total a pagar
    const totalAPagar = parseFloat(document.getElementById('totalAPagar').value) || 0;
    if (totalAPagar <= 0) {
        Swal.fire({
            icon: "error",
            title: "El importe a pagar es 0",
            text: "No se puede proceder con un importe a pagar de 0.",
            showConfirmButton: true,
        });
        return;
    }

    // Verificar si se requiere CFDI y que esté seleccionado
    if (!verificarFacturaVenta()) {
        return; // No continuar si hay un error con la selección del CFDI
    }

    // Generar el resumen de la venta en formato JSON
    generarResumenVentaJSON();
}

document.getElementById('btnPagar').addEventListener('click', () => {
    pagarVenta();
});

document.getElementById('selectFormaPago').addEventListener('change', function() {
    const formaPago = this.value;
    const importeInput = document.querySelector('.importePago');

    // Si se selecciona un método de pago válido, habilitar el campo de importe
    if (formaPago) {
        importeInput.disabled = false; // Habilitar el campo de importe
        importeInput.focus(); // Hacer foco en el campo de importe
    } else {
        importeInput.disabled = true; // Deshabilitar el campo si no se selecciona un método
        importeInput.value = ''; // Limpiar el valor del campo importe si se desactiva
    }
});

