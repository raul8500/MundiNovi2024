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
    let restanteAPagar = totalAPagar; // Variable para llevar un seguimiento del total que aún queda por pagar

    // Verificar si hay cliente seleccionado
    if (clienteSeleccionado && typeof clienteSeleccionado.monedero === 'number') {
        saldoMonedero = clienteSeleccionado.monedero;
    }

    // Obtener todas las formas de pago adicionales (incluye la default)
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

                saldoMonedero -= importePago; // Actualiza el saldo después de aceptar el pago
            }

            // Si el tipo de pago es efectivo, y supera lo que queda por pagar, calculamos el cambio
            if (tipoPago === 'efectivo') {
                if (importePago > restanteAPagar) {
                    cambio = importePago - restanteAPagar; // Calculamos el cambio
                    formasDePagoUtilizadas.push({
                        tipo: tipoPago,
                        importe: importePago, // El importe completo que el cliente dio
                        cambio: cambio.toFixed(2) // Se agrega el cambio que se devolvió
                    });
                } else {
                    formasDePagoUtilizadas.push({
                        tipo: tipoPago,
                        importe: importePago,
                        cambio: 0 // No hay cambio
                    });
                }
            } else {
                // Otros tipos de pago no generan cambio
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
            restanteAPagar -= importePago; // Reducimos lo que queda por pagar
        }
    }

    // Verificar si el total pagado cubre el total a pagar
    if (totalPagado < totalAPagar) {
        Swal.fire({
            icon: "error",
            title: "El pago es insuficiente",
            text: `Faltan ${(totalAPagar - totalPagado).toFixed(2)} para cubrir el total.`,
            showConfirmButton: true,
        });
        return;
    }

    // Crear el resumen de la venta en formato JSON
    const facturaResumenVenta = document.getElementById('facturaResumenVenta')?.textContent.trim() || '';
    const cfdiSelect = document.getElementById('usoCFDI');

    const resumenVenta = {
        cliente: clienteSeleccionado || '', // Asigna clienteSeleccionado o una cadena vacía si es nulo o indefinido
        totalAPagar: totalAPagar.toFixed(2),
        totalPagado: totalPagado.toFixed(2),
        formasDePago: formasDePagoUtilizadas,
        esFactura: facturaResumenVenta !== '', // Determina si es una venta facturada
        cfdiSeleccionado: cfdiSelect ? cfdiSelect.value : '' // CFDI seleccionado
    };

    completarVenta(resumenVenta);
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
