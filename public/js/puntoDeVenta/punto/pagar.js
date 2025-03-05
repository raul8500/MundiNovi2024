// Al hacer clic en "btnPagar", se actualiza el total a pagar y se abre el modal
document.getElementById("btnPagar").addEventListener("click", function () {
    actualizarResumenVenta();
    let totalVenta = parseFloat(document.getElementById("totalVenta").textContent) || 0;
    document.getElementById("totalAPagar").textContent = totalVenta.toFixed(2);
    var modalPago = new bootstrap.Modal(document.getElementById("modalPago"));
    modalPago.show();
    updatePagos(); // Actualizamos el cambio al abrir el modal
});
  
// Función para actualizar los pagos y calcular el cambio global
function updatePagos() {
    // Total a pagar en el modal
    let totalAPagar = parseFloat(document.getElementById("totalAPagar").textContent) || 0;
    let totalCash = 0, totalNonCash = 0;
    
    // Recorremos todas las filas de forma de pago
    let paymentRows = document.querySelectorAll("#formasDePago .formaDePago");
    paymentRows.forEach(function(row) {
      let select = row.querySelector(".formaPago");
      let importeInput = row.querySelector(".importePago");
      let importe = parseFloat(importeInput.value) || 0;
      
      if(select.value === "cash") {
          totalCash += importe;
      } else {
          totalNonCash += importe;
      }
    });
    
    // Para métodos no cash se exige exactitud; el efectivo cubre el restante.
    let remaining = totalAPagar - totalNonCash;
    if(remaining < 0) {
        remaining = 0;
    }
    let globalCambio = totalCash > remaining ? (totalCash - remaining).toFixed(2) : "0.00";
    
    // Actualizamos el campo global de cambio
    document.getElementById("globalCambio").textContent = globalCambio;
}
  
// Función para asignar eventos a una fila de forma de pago
function attachPaymentRowEvents(row) {
    let select = row.querySelector(".formaPago");
    let importeInput = row.querySelector(".importePago");
    
    // Al cambiar el método de pago, habilita o deshabilita el input de importe
    select.addEventListener("change", function() {
      if (this.value !== "") {
          importeInput.disabled = false;
          // Si se selecciona monedero, se requiere tener un cliente seleccionado
          if(this.value === "electronic-money") {
              if(!clienteSeleccionado) {
                  Swal.fire("Error", "Debe seleccionar un cliente para usar monedero.", "error");
                  this.value = "";
                  importeInput.disabled = true;
                  importeInput.value = "";
              }
          }
      } else {
          importeInput.disabled = true;
          importeInput.value = "";
      }
      updatePagos();
    });
    
    // Al cambiar el importe, actualizamos el cálculo de pagos
    importeInput.addEventListener("input", function() {
      if(select.value === "electronic-money") {
          // Validar que el importe no supere el saldo del monedero del cliente
          let amount = parseFloat(this.value) || 0;
          let wallet = clienteSeleccionado ? parseFloat(clienteSeleccionado.monedero) || 0 : 0;
          if(amount > wallet) {
              Swal.fire("Error", "El monedero no cuenta con esa cantidad.", "error");
              this.value = wallet.toFixed(2);
          }
      }
      updatePagos();
    });
    
    // También se actualiza al salir del campo
    importeInput.addEventListener("change", function() {
      updatePagos();
    });
}
  
// Asignar eventos a las filas existentes (inicialmente la única)
document.addEventListener("DOMContentLoaded", function() {
    document.querySelectorAll("#formasDePago .formaDePago").forEach(function(row) {
      attachPaymentRowEvents(row);
    });
});


function armarVenta() {
    // Sucursal: se incluye id y nombre
    const sucursal = {
        id: datosSucursal ? datosSucursal._id : "",
        nombre: datosSucursal ? datosSucursal.nombre : ""
    };

    // Cliente: si no hay cliente seleccionado, se usa "PUBLICO EN GENERAL"
    let cliente;
    if (!clienteSeleccionado) {
        cliente = {
            id: "",
            nombre: "PUBLICO EN GENERAL",
            rfc: ""
        };
    } else {
        cliente = {
            id: clienteSeleccionado._id,
            nombre: clienteSeleccionado.clientData.name,
            rfc: clienteSeleccionado.clientData.identification
        };
    }

    // Vendedor (cajero): se incluye su id y nombre
    const cajero = vendedor
        ? { id: vendedor._id || "", nombre: vendedor.name }
        : {};

    // Total de la venta (asegúrate de que "totalVenta" esté actualizado)
    const totalVenta = parseFloat(document.getElementById("totalVenta").textContent) || 0;

    // Productos agregados
    let totalProductosCantidad = 0;
    const productosVenta = productosSeleccionados.map(item => {
        const cantidad = parseFloat(item.inputCantidad.value) || 0;
        totalProductosCantidad += cantidad;
        return {
            id: item.producto._id,
            idAlegra: item.producto.idAlegra,
            nombre: item.producto.name,
            reference: item.producto.reference,
            precioSinIva: parseFloat(item.inputPrecio.value) || 0,
            precioConIva: parseFloat(item.inputPrecioIva.value) || 0,
            precio1: item.producto.datosFinancieros.precio1,
            cantidad: cantidad  // Aquí se incluye la cantidad del producto
        };
    });

    // Formas de pago
    const paymentRows = document.querySelectorAll("#formasDePago .formaDePago");
    const formasDePago = Array.from(paymentRows).map(row => {
        const forma = row.querySelector(".formaPago").value;
        const importe = parseFloat(row.querySelector(".importePago").value) || 0;
        return { forma, importe };
    });

    // Determinar si se factura y, en caso afirmativo, el uso de CFDI
    const factura = document.getElementById("facturaCliente").textContent.trim() === "SI";
    let usoCFDI = null;
    if (factura) {
        usoCFDI = document.getElementById("usoCFDI").value;
    }

    // Obtener el cambio global (del campo global "globalCambio")
    const globalCambio = parseFloat(document.getElementById("globalCambio").textContent) || 0;

    // Armar el objeto venta final
    const venta = {
        sucursal,
        cliente,
        cajero,
        totalVenta,
        totalProductosCantidad,
        productos: productosVenta,
        formasDePago,
        factura,
        usoCFDI,
        cambio: globalCambio
    };

    console.log("Venta armada:", venta);
    return venta;
}

  
  
// Agregar nueva forma de pago al hacer clic en "btnAgregarFormaPago"
document.getElementById("btnAgregarFormaPago").addEventListener("click", function () {
    // Obtener la fila plantilla: la primera forma de pago dentro del contenedor
    let firstRow = document.querySelector("#formasDePago .formaDePago:first-child");
    // Clonar la plantilla
    let newRow = firstRow.cloneNode(true);
    
    // Reiniciar valores en la nueva fila
    let select = newRow.querySelector(".formaPago");
    select.value = "";
    let importeInput = newRow.querySelector(".importePago");
    importeInput.value = "";
    importeInput.disabled = true;
    
    // Habilitar el botón de borrar (la plantilla original viene con el botón deshabilitado)
    let deleteBtn = newRow.querySelector(".eliminarFormaPago");
    deleteBtn.disabled = false;
    deleteBtn.addEventListener("click", function () {
      newRow.remove();
      updatePagos();
    });
    
    attachPaymentRowEvents(newRow);
    document.getElementById("formasDePago").appendChild(newRow);
});


document.addEventListener("DOMContentLoaded", function () {
    // Asignar eventos al primer método de pago al cargar la página
    let firstRow = document.querySelector("#formasDePago .formaDePago");
    attachPaymentRowEvents(firstRow);
});


function attachPaymentRowEvents(row) {
    let select = row.querySelector(".formaPago");
    let importeInput = row.querySelector(".importePago");

    select.addEventListener("change", function () {
        if (this.value !== "") {
            importeInput.disabled = false;
            if (this.value === "electronic-money" && !clienteSeleccionado) {
                Swal.fire("Error", "Debe seleccionar un cliente para usar monedero.", "error");
                this.value = "";
                importeInput.disabled = true;
                importeInput.value = "";
            }
        } else {
            importeInput.disabled = true;
            importeInput.value = "";
        }
        updatePagos();
    });

    importeInput.addEventListener("input", function () {
        if (select.value === "electronic-money") {
            let amount = parseFloat(this.value) || 0;
            let wallet = clienteSeleccionado ? parseFloat(clienteSeleccionado.monedero) || 0 : 0;
            if (amount > wallet) {
                Swal.fire("Error", "El monedero no cuenta con esa cantidad.", "error");
                this.value = wallet.toFixed(2);
            }
        }
        updatePagos();
    });

    importeInput.addEventListener("change", function () {
        updatePagos();
    });
}


document.getElementById("btnRealizarVenta").addEventListener("click", function () {
    // Validar que haya al menos un producto en la venta
    if (productosSeleccionados.length === 0) {
        Swal.fire("Error", "Debe agregar al menos un producto a la venta.", "error");
        return;
    }

    // Obtener el total a pagar
    let totalAPagar = parseFloat(document.getElementById("totalAPagar").textContent) || 0;
    let sumPagos = 0;
    let totalNonCash = 0;
    let cashRowExists = false;
    let hasPaymentMethod = false;

    let paymentRows = document.querySelectorAll("#formasDePago .formaDePago");

    paymentRows.forEach(function (row) {
        let select = row.querySelector(".formaPago");
        let importe = parseFloat(row.querySelector(".importePago").value) || 0;

        if (select.value !== "") {
            hasPaymentMethod = true;
        }

        sumPagos += importe;

        if (select.value !== "cash" && select.value !== "") {
            totalNonCash += importe;

            if (importe > totalAPagar) {
                Swal.fire(
                    "Error",
                    `El método de pago "${select.options[select.selectedIndex].text}" no puede superar el total de la venta.`,
                    "error"
                );
                return;
            }
        }

        if (select.value === "cash") {
            cashRowExists = true;
        }
    });

    if (!hasPaymentMethod) {
        Swal.fire("Error", "Debe seleccionar al menos un método de pago.", "error");
        return;
    }

    if (sumPagos < totalAPagar) {
        Swal.fire("Error", "El total de los pagos no cubre el total a pagar.", "error");
        return;
    }

    if (!cashRowExists && totalNonCash !== totalAPagar) {
        Swal.fire(
            "Error",
            "Los métodos de pago sin efectivo deben cubrir el total de la venta exactamente.",
            "error"
        );
        return;
    }

    let venta = armarVenta();
    console.log("Venta final:", venta);

    // Preguntar si se desea recibir el ticket al teléfono o impreso
    Swal.fire({
        title: "Tipo de ticket",
        html: `Imprimir ticket`,
        showDenyButton: true,
        showConfirmButton: false,
        //confirmButtonText: "Ticket al teléfono",
        denyButtonText: "Ticket impreso",
    }).then((result) => {
        if (result.isConfirmed) {
            // Mostrar el modal para ingresar teléfono
            var modalIngresarTelefono = new bootstrap.Modal(document.getElementById("modalIngresarTelefono"));
            modalIngresarTelefono.show();
        } else if (result.isDenied) {
            ventaSinTelefono()
        }
    });
});

// Lógica para enviar el ticket al teléfono
document.getElementById("btnEnviarTicket").addEventListener("click", function () {
    let telefono = document.getElementById("telefonoCliente").value.trim();
    let confirmarTelefono = document.getElementById("confirmarTelefono").checked;

    // Validar el número de teléfono
    if (!telefono || telefono.length < 10 || !confirmarTelefono) {
        Swal.fire("Error", "Por favor ingrese un número de teléfono válido y confirme el número.", "error");
        return;
    }

    // Agregar el número de teléfono al JSON de la venta
    let venta = armarVenta();
    venta.telefono = telefono;

    // Mostrar mensaje de éxito
    Swal.fire("Ticket enviado", `El ticket se enviará al teléfono: ${telefono}`, "success");

    // Mostrar la venta final con el número de teléfono incluido
    Swal.fire({
        title: "Venta final",
        html: `<pre style="text-align:left;">${JSON.stringify(venta, null, 2)}</pre>`,
        width: "600px",
    });

    console.log("Venta final:", venta);

    // Enviar la venta al backend
    fetch("/api/venta/crear", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(venta),  // Convertir el objeto venta a JSON
    })
    .then((response) => {
        if (response.ok) {
            // Si la respuesta es exitosa, mostrar mensaje de éxito
            return response.json();
        } else {
            throw new Error("Error al enviar la venta al backend.");
        }
    })
    .then((data) => {
        // Si el backend responde correctamente
        Swal.fire("Venta exitosa", "La venta se ha registrado correctamente.", "success");
        console.log("Respuesta del backend:", data);
    })
    .catch((error) => {
        // Manejo de errores en caso de que algo falle
        Swal.fire("Error", `Hubo un problema al procesar la venta: ${error.message}`, "error");
        console.error("Error al enviar la venta:", error);
    });

    // Cerrar el modal
    var modalIngresarTelefono = bootstrap.Modal.getInstance(document.getElementById("modalIngresarTelefono"));
    modalIngresarTelefono.hide();
});


function ventaSinTelefono(){
    // Agregar el número de teléfono al JSON de la venta
    let venta = armarVenta();

    // Enviar la venta al backend
    fetch("/api/venta/crear", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(venta),  // Convertir el objeto venta a JSON
    })
    .then((response) => {
        if (response.ok) {
            // Si la respuesta es exitosa, mostrar mensaje de éxito
            return response.json();
        } else {
            throw new Error("Error al enviar la venta al backend.");
        }
    })
    .then((data) => {
        // Si el backend responde correctamente
        Swal.fire("Venta exitosa", "La venta se ha registrado correctamente.", "success");
        console.log(data)
        imprimirTicket(data)
        location.reload();  
    })
    .catch((error) => {
        // Manejo de errores en caso de que algo falle
        Swal.fire("Error", `Hubo un problema al procesar la venta: ${error.message}`, "error");
        console.error("Error al enviar la venta:", error);
    });

}


function imprimirTicket(data) {
    const ticketWidth = 32;

    function formatLine(text, width, rightAlign = false) {
        return rightAlign ? text.padStart(width) : text.padEnd(width);
    }

    function formatProductos(productos) {
        return `
            <ul style="list-style: none; padding: 0; margin: 0; font-size: 9px;">
                <li>
                    <span style="display: inline-block; width: 30px; text-align: left;">Cant.</span>
                    <span style="display: inline-block; width: 90px; text-align: left;">Artículo</span>
                    <span style="display: inline-block; width: 40px; text-align: right;">Precio</span>
                    <span style="display: inline-block; width: 40px; text-align: right;">Total</span>
                </li>
                ${productos.map(p => {
                    const nombreDividido = p.nombre.split(" ");
                    let nombreHtml = "";
                    let lineaActual = "";

                    nombreDividido.forEach((palabra) => {
                        if ((lineaActual + palabra).length > 15) {
                            nombreHtml += `<div>${lineaActual.trim()}</div>`;
                            lineaActual = palabra + " ";
                        } else {
                            lineaActual += palabra + " ";
                        }
                    });
                    nombreHtml += `<div>${lineaActual.trim()}</div>`;

                    return `
                        <li style="word-break: break-word; margin-bottom: 5px;">
                            <span style="display: inline-block; width: 30px; text-align: left; vertical-align: middle;">${p.cantidad}</span>
                            <span style="display: inline-block; width: 90px; text-align: left;">${nombreHtml}</span>
                            <span style="display: inline-block; width: 40px; text-align: right;">$${p.precioConIva.toFixed(2)}</span>
                            <span style="display: inline-block; width: 40px; text-align: right;">$${p.precioConIva.toFixed(2) * p.cantidad}</span>
                        </li>
                    `;
                }).join('')}
            </ul>
        `;
    }

    function formatFormasDePago(formasDePago) {
        let formasDePagoHtml = formasDePago.formasDePago.map(fp => {
            let tipoPago = {
                'cash': 'Efectivo',
                'credit-card': 'Tarjeta crédito',
                'debit-card': 'Tarjeta débito',
                'transfer': 'Transferencia'
            }[fp.forma] || fp.forma;

            return `<p style="margin: 2px 0;">Pago con ${tipoPago}: ${formatLine(`$${fp.importe.toFixed(2)}`, ticketWidth, true)}</p>`;
        }).join('');
        
        const cambioTexto = typeof data.pagos.cambio === 'number'
        ? `$${data.pagos.cambio.toFixed(2)}`
        : `$0.00`;    

        formasDePagoHtml += `<p style="margin: 2px 0;">Cambio: ${formatLine(cambioTexto, ticketWidth, true)}</p>`;

        return formasDePagoHtml;
    }

    /*
    function calcularAhorro(productos) {
        return productos.forEach(producto) => {
            const totalSinRango = producto.precio1 * producto.cantidad || 0;  // Propiedad totalSinRango debe estar correctamente calculada
            const totalConIVA = producto.totalConIVA * producto.cantidad || 0;      // totalConIVA debe corresponder al total con descuento
            return ahorro + Math.max(0, totalSinRango - totalConIVA); // Aseguramos no restar más de lo que hay
        }, 0);
    }
    */

    //const totalAhorro = calcularAhorro(data.productos);

    const ticketContent = `
        <div style="width: 55mm; padding: 10px; font-size: 10px;">
            <img id="logo" src="/img/logoColor.png" style="width: 90px; height: 80px; display: block; margin: 0 auto;">
            <h2 style="text-align: center;">Mundi Novi</h2>
            <p style="text-align: center; margin: 2px 0;">JESUS MARIA AGUIRRE VEGA</p>
            <p style="text-align: center; margin: 2px 0;">REGIMEN ACTIVIDAD EMPRESARIAL</p>
            <p style="text-align: center; margin: 2px 0;">RFC: AUVJ750221RB8</p>
            <p style="text-align: center; margin: 2px 0;">Dirección: Sur Norte 14 BC y CD, Central de Abastos, 91637, Ejido FDO Gutierrez, Ver.</p>
            <hr style="border: 1px solid black;">
            <p style="margin: 2px 0;">Folio: ${Math.floor(Math.random() * 90000) + 10000}</p>
            <p style="margin: 2px 0;">Fecha: ${new Date(data.fecha).toLocaleString()}</p>
            <p style="margin: 2px 0;">Cajero: ${data.vendedor.name}</p>
            <p style="margin: 2px 0;">Expedido en: ${data.sucursal.datosTicket.direccion}</p>
            <p style="margin: 2px 0;">Cliente: ${data.cliente?.name|| 'PUBLICO EN GENERAL'}</p>
            <hr style="border: 1px solid black;">
            ${formatProductos(data.productos)}
            <hr style="border: 1px solid black;">
            <p style="text-align: right; margin: 2px 0; font-weight: bold;">Total venta: $${data.totalVenta.toFixed(2)}</p>
            <p style="text-align: right; margin: 2px 0;">Total productos: ${data.totalProductos}</p>
            <div style="text-align: right;">
                ${formatFormasDePago(data.pagos)}
            </div>
            <hr style="border: 1px solid black;">

            <p style="text-align: center;">Facturación: ${data.factura.codigoFacturacion} </p>
            <p style="text-align: center;">Este no es un comprobante fiscal</p>
            <p style="text-align: center;">¡Super limpios a super precio!</p>
        </div>
    `;

    const printWindow = window.open('', '', 'width=320,height=500');
    if (printWindow) {
        printWindow.document.write('<style>body { font-family: Arial, sans-serif; }</style>');
        printWindow.document.write('</head><body>');
        printWindow.document.write(ticketContent);
        printWindow.document.write('</body></html>');

        printWindow.document.close();
        printWindow.focus();

        const logoImage = printWindow.document.getElementById('logo');
        if (logoImage) {
            logoImage.onload = function() {
                printWindow.print();
                printWindow.close();
            };
        } else {
            printWindow.print();
            printWindow.close();
        }
    } else {
        console.error("Error al abrir la ventana de impresión.");
        Swal.fire('Error', 'No se pudo abrir la ventana de impresión. Asegúrate de permitir ventanas emergentes.', 'error');
    }
}
