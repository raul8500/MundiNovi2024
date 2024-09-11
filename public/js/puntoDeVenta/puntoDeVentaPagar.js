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

    // Obtener todas las formas de pago adicionales (incluye la default)
    const formasDePago = document.querySelectorAll('.formaDePago');
    let saldoMonedero = 0;

    // Verificar si hay cliente seleccionado
    if (clienteSeleccionado && typeof clienteSeleccionado.monedero === 'number') {
        saldoMonedero = clienteSeleccionado.monedero;
    }

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
                    return; // Salir si hay un problema con el monedero
                }

                if (importePago > saldoMonedero) {
                    Swal.fire({
                        icon: "error",
                        title: "Saldo insuficiente en monedero",
                        text: `El importe de ${importePago.toFixed(2)} excede el saldo disponible de ${saldoMonedero.toFixed(2)}.`,
                        showConfirmButton: true,
                    });
                    return; // Salir si el saldo es insuficiente
                }

                // Asegúrate de no permitir que el importe del monedero exceda el total a pagar
                if (importePago > totalAPagar) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Importe excedido',
                        text: 'El importe del monedero no puede exceder el total a pagar.',
                        showConfirmButton: true,
                    });
                    return; // Salir si el importe excede el total
                }

                saldoMonedero -= importePago; // Actualiza el saldo después de aceptar el pago
            } else if (tipoPago !== 'efectivo' && importePago > totalAPagar) {
                Swal.fire({
                    icon: 'error',
                    title: 'Importe excedido',
                    text: 'No puedes ingresar un importe mayor al total a pagar para tarjetas, transferencias y monederos.',
                    showConfirmButton: true,
                });
                return; // Salir si el importe excede el total
            }

            totalPagado += importePago;

            // Guardar la forma de pago y su importe en la variable
            formasDePagoUtilizadas.push({
                tipo: tipoPago,
                importe: importePago
            });
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
        return; // Salir si el pago es insuficiente
    }

    // Crear el resumen de la venta en formato JSON
    const facturaResumenVenta = document.getElementById('facturaResumenVenta')?.textContent.trim() || '';
    const cfdiSelect = document.getElementById('usoCFDI');
    
    const resumenVenta = {
        totalAPagar: totalAPagar.toFixed(2),
        totalPagado: totalPagado.toFixed(2),
        formasDePago: formasDePagoUtilizadas,
        esFactura: facturaResumenVenta !== '', // Determina si es una venta facturada
        cfdiSeleccionado: cfdiSelect ? cfdiSelect.value : '' // CFDI seleccionado
    };

    console.log('Resumen de la Venta:', JSON.stringify(resumenVenta, null, 2));

    // Mensaje de éxito si el pago cubre el total
    Swal.fire({
        icon: "success",
        title: "Pago completado",
        text: `El total pagado fue ${totalPagado.toFixed(2)}.`,
        showConfirmButton: true,
    });

    // Aquí puedes realizar las acciones necesarias para procesar el pago.
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
