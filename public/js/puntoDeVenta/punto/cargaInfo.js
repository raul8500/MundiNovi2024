let vendedor = "";
let datosSucursal = "";
let productos = "";
let productosSeleccionados = [];
let selectedSuggestionIndex = -1;

// Cargar info del Vendedor y luego la sucursal y productos
function cargarInfoVendedor() {
  fetch("/api/verifySesion")
    .then((response) => response.json())
    .then((data) => {
      vendedor = data;
      document.getElementById("vendedor").textContent = vendedor.name;
      cargarSucursal(vendedor);
      cargarProductos();
      verificarCortesPendientes(data._id);
    })
    .catch((error) => console.log(error));
}
cargarInfoVendedor();

// Cargar info de la sucursal
function cargarSucursal(vendedor) {
  fetch("/api/sucursal/id/" + vendedor.sucursalId)
    .then((response) => response.json())
    .then((data) => {
      datosSucursal = data;
      document.getElementById("sucursal").textContent = datosSucursal.nombre;
    })
    .catch((error) => console.error("Error al cargar sucursal:", error));
}

// Cargar los productos desde la API
function cargarProductos() {
  fetch("/api/producto/test")
    .then((response) => response.json())
    .then((data) => {
      productos = data.products;
      inicializarAutoCompletePrecios();
    })
    .catch((error) => console.error("Error al cargar productos:", error));
}

function verificarCortesPendientes(userId) {
  fetch(`/api/cortes/verificar/${userId}`, {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json'
      }
  })
  .then(response => {
      console.log(response.status)
      if (response.status === 404) {
         window.location.href = '/corteparcial';
      } else if (response.status === 200) {
          console.log('No hay cortes pendientes');
      } else {
          throw new Error('Error al verificar cortes.');
      }
  })
  .catch(error => {
      console.error('Error al verificar cortes pendientes:', error);
      Swal.fire('Error', 'Hubo un problema al verificar los cortes pendientes. Por favor, inténtalo de nuevo.', 'error');
  });
}


//Focus en el input de buscar
document.addEventListener("DOMContentLoaded", function () {
    // Hacer focus en el input de búsqueda
    document.getElementById("producto").focus();
  });  


// Función para calcular el precio según la cantidad y los rangos (del 1 al 10)
// Se recorre del 1 al 10 y si la cantidad está entre rangoInicial y rangoFinal (o si el final es 0 se considera sin límite)
// Se retorna el precio correspondiente
function calcularPrecio(producto, cantidad) {
  for (let i = 1; i <= 10; i++) {
    let ri = producto.datosFinancieros[`rangoInicial${i}`];
    let rf = producto.datosFinancieros[`rangoFinal${i}`];
    let precioX = producto.datosFinancieros[`precio${i}`];
    if (cantidad >= ri && (rf === 0 || cantidad <= rf)) {
      return precioX.toFixed(2);
    }
  }
  return producto.datosFinancieros.precio1.toFixed(2);
}

// Función para actualizar el resumen de la venta (total de artículos y total de venta)
function actualizarResumenVenta() {
  let totalArticulos = 0;
  let totalVenta = 0;
  productosSeleccionados.forEach((item) => {
    let qty = parseFloat(item.inputCantidad.value) || 0;
    let total = parseFloat(item.inputTotal.value) || 0;
    totalArticulos += qty;
    totalVenta += total;
  });
  document.getElementById("totalArticulos").textContent = totalArticulos;
  document.getElementById("totalVenta").textContent = totalVenta.toFixed(2);
}


// Función para agregar el producto a la tabla y al arreglo de productosSeleccionados
function agregarProductoTabla(producto, cantidad) {
  let itemExistente = productosSeleccionados.find(
    (item) => item.producto._id === producto._id
  );

  if (itemExistente) {
    let currentQty = parseFloat(itemExistente.inputCantidad.value) || 0;
    let newQty = currentQty + cantidad;
    itemExistente.inputCantidad.value = newQty;

    let recalculatedPrecio = parseFloat(calcularPrecio(producto, newQty));
    const precioConIVA = recalculatedPrecio;
    itemExistente.inputPrecioConIVA.value = precioConIVA.toFixed(2);
    itemExistente.inputTotal.value = (precioConIVA * newQty).toFixed(2);

    itemExistente.cantidad = newQty;
    itemExistente.precio = recalculatedPrecio;
    actualizarResumenVenta();
    return;
  }

  const tbody = document.getElementById("productos");
  const tr = document.createElement("tr");

  // Imagen
  const tdImagen = document.createElement("td");
  if (producto.rutaImagen) {
    const img = document.createElement("img");
    img.src = producto.rutaImagen;
    img.alt = "Imagen del producto";
    img.style.width = "60px";
    img.style.height = "60px";
    img.style.objectFit = "contain";
    tdImagen.appendChild(img);
  } else {
    tdImagen.innerHTML = "<span class='text-muted'>Sin imagen</span>";
  }
  tr.appendChild(tdImagen);

  // Nombre
  const tdProducto = document.createElement("td");
  tdProducto.textContent = producto.name;
  tr.appendChild(tdProducto);

  // Rangos
  const tdRangos = document.createElement("td");
  tdRangos.style.fontSize = "12px";
  let row1 = `Precio 1: ${(producto.datosFinancieros.precio1).toFixed(2)}`;
  const ri2 = producto.datosFinancieros.rangoInicial2;
  const precio2 = producto.datosFinancieros.precio2;
  if (ri2 > 0) row1 += ` | Más de ${ri2}: ${precio2.toFixed(2)}`;
  let row2 = "";
  const ri3 = producto.datosFinancieros.rangoInicial3;
  const precio3 = producto.datosFinancieros.precio3;
  if (ri3 > 0) row2 += `Más de ${ri3}: ${precio3.toFixed(2)}`;
  const ri4 = producto.datosFinancieros.rangoInicial4;
  const precio4 = producto.datosFinancieros.precio4;
  if (ri4 > 0) row2 += row2 ? ` | Más de ${ri4}: ${precio4.toFixed(2)}` : `Más de ${ri4}: ${precio4.toFixed(2)}`;
  tdRangos.innerHTML = `<div>${row1}</div><div>${row2}</div>`;
  tr.appendChild(tdRangos);

  // Precio con IVA (fijo)
  const tdPrecioConIVA = document.createElement("td");
  const inputPrecioConIVA = document.createElement("input");
  inputPrecioConIVA.type = "number";
  inputPrecioConIVA.classList.add("form-control");
  const precioSinIVA = parseFloat(calcularPrecio(producto, cantidad));
  inputPrecioConIVA.value = (precioSinIVA).toFixed(2);
  inputPrecioConIVA.readOnly = true;
  tdPrecioConIVA.appendChild(inputPrecioConIVA);
  tr.appendChild(tdPrecioConIVA);

  // Cantidad
  const tdCantidad = document.createElement("td");
  const inputCantidad = document.createElement("input");
  inputCantidad.type = "number";
  inputCantidad.classList.add("form-control");
  inputCantidad.value = cantidad;
  tdCantidad.appendChild(inputCantidad);
  tr.appendChild(tdCantidad);

  // Total
  const tdTotal = document.createElement("td");
  const inputTotal = document.createElement("input");
  inputTotal.type = "number";
  inputTotal.classList.add("form-control");
  inputTotal.value = (parseFloat(inputPrecioConIVA.value) * cantidad).toFixed(2);
  inputTotal.readOnly = true;
  tdTotal.appendChild(inputTotal);
  tr.appendChild(tdTotal);

  // Acciones
  const tdAcciones = document.createElement("td");
  const btnEliminar = document.createElement("button");
  btnEliminar.innerHTML = '<i class="fa-solid fa-trash"></i>';
  btnEliminar.classList.add("btn", "btn-danger", "btn-sm");
  btnEliminar.addEventListener("click", function () {
    tbody.removeChild(tr);
    productosSeleccionados = productosSeleccionados.filter(
      (item) => item.row !== tr
    );
    actualizarResumenVenta();
  });
  tdAcciones.appendChild(btnEliminar);
  tr.appendChild(tdAcciones);

  // Insertar al principio de la tabla
  tbody.insertBefore(tr, tbody.firstChild);

  // Guardar producto
  const productoSeleccionado = {
    producto,
    cantidad,
    precio: precioSinIVA,
    row: tr,
    inputPrecioConIVA,
    inputCantidad,
    inputTotal,
  };
  productosSeleccionados.push(productoSeleccionado);

  // Evento al cambiar la cantidad
  inputCantidad.addEventListener("change", function () {
    const newCantidad = parseFloat(inputCantidad.value) || 0;
    const nuevoPrecioSinIVA = parseFloat(calcularPrecio(producto, newCantidad));
    const nuevoPrecioIVA = nuevoPrecioSinIVA;
    inputPrecioConIVA.value = nuevoPrecioIVA.toFixed(2);
    inputTotal.value = (nuevoPrecioIVA * newCantidad).toFixed(2);
    productoSeleccionado.cantidad = newCantidad;
    productoSeleccionado.precio = nuevoPrecioSinIVA;
    actualizarResumenVenta();
  });

  actualizarResumenVenta();
  document.getElementById("cantidad").value = 1;

  // 👉 Hacer focus al inputCantidad recién creado, seleccionar contenido y vibrar visualmente
  setTimeout(() => {
    inputCantidad.focus();
    inputCantidad.select();
    inputCantidad.classList.add('highlight-focus');

    setTimeout(() => {
      inputCantidad.classList.remove('highlight-focus');
    }, 500); // Duración breve para quitar el efecto
  }, 100);

  // 👉 Evento: Enter en cantidad -> regresar focus al input de búsqueda
  inputCantidad.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      e.preventDefault();
      document.getElementById("producto").focus();
    }
  });
}


function updateActiveSuggestion() {
    const lista = document.getElementById("listaProductos");
    const items = lista.getElementsByTagName("li");
    for (let i = 0; i < items.length; i++) {
        if (i === selectedSuggestionIndex) {
        items[i].classList.add("active");
        // Asegura que el elemento activo se desplace a la vista
        items[i].scrollIntoView({ block: "nearest", behavior: "smooth" });
        } else {
        items[i].classList.remove("active");
        }
    }
}
  
// Evento para el input de búsqueda (filtrado por reference)
document.getElementById("producto").addEventListener("input", function () {
  const searchTerm = this.value.toLowerCase().trim();
  const lista = document.getElementById("listaProductos");
  lista.innerHTML = "";
  selectedSuggestionIndex = -1;

  if (searchTerm.length === 0) {
    lista.style.display = "none";
    return;
  }

  // Si el input coincide exactamente con un reference, se agrega automáticamente
  const productoPorReferencia = productos.find(
    (p) => p.reference && p.reference.toLowerCase() === searchTerm
  );
  if (productoPorReferencia) {
    const cantidad = parseInt(document.getElementById("cantidad").value) || 1;
    agregarProductoTabla(productoPorReferencia, cantidad);
    this.value = "";
    lista.innerHTML = "";
    lista.style.display = "none";
    return;
  }

  // Filtrar sugerencias usando el campo reference
  const resultados = productos.filter(
    (p) => p.reference && p.reference.toLowerCase().includes(searchTerm)
  );

  if (resultados.length > 0) {
    lista.style.display = "block";
    resultados.forEach((prod, index) => {
      const li = document.createElement("li");
      li.classList.add("list-group-item");
      // Se muestra en la sugerencia: "reference - name"
      li.textContent = `${prod.reference} - ${prod.name}`;
      li.addEventListener("click", function () {
        const cantidad = parseInt(document.getElementById("cantidad").value) || 1;
        agregarProductoTabla(prod, cantidad);
        document.getElementById("producto").value = "";
        lista.innerHTML = "";
        lista.style.display = "none";
      });
      lista.appendChild(li);
    });
  } else {
    lista.style.display = "none";
  }
});

// Navegación en la lista de sugerencias: flechas arriba/abajo y Enter para seleccionar
document.getElementById("producto").addEventListener("keydown", function (e) {
  const lista = document.getElementById("listaProductos");
  const items = lista.getElementsByTagName("li");
  if (items.length === 0) return;

  if (e.key === "ArrowDown") {
    e.preventDefault();
    selectedSuggestionIndex++;
    if (selectedSuggestionIndex >= items.length) {
      selectedSuggestionIndex = 0;
    }
    updateActiveSuggestion();
  } else if (e.key === "ArrowUp") {
    e.preventDefault();
    selectedSuggestionIndex--;
    if (selectedSuggestionIndex < 0) {
      selectedSuggestionIndex = items.length - 1;
    }
    updateActiveSuggestion();
  } else if (e.key === "Enter") {
    e.preventDefault();
    if (selectedSuggestionIndex >= 0 && selectedSuggestionIndex < items.length) {
      items[selectedSuggestionIndex].click();
    }
  }
});

// Botón para agregar manualmente en caso de ser necesario
document.getElementById("agregarProducto").addEventListener("click", function () {
  const searchValue = document.getElementById("producto").value.toLowerCase().trim();
  const productoEncontrado = productos.find(
    (p) => p.reference && p.reference.toLowerCase() === searchValue
  );
  if (productoEncontrado) {
    const cantidad = parseInt(document.getElementById("cantidad").value) || 1;
    agregarProductoTabla(productoEncontrado, cantidad);
    document.getElementById("producto").value = "";
    document.getElementById("listaProductos").innerHTML = "";
    document.getElementById("listaProductos").style.display = "none";
  } else {
    alert("Por favor, seleccione un producto válido.");
  }
});

// Atajo de teclado: F4 para agregar
document.addEventListener("keydown", function (e) {
  if (e.key === "F4") {
    e.preventDefault();
    document.getElementById("agregarProducto").click();
  }
});

// Botón para agregar manualmente en caso de ser necesario
document.getElementById("cancelarVenta").addEventListener("click", function () {
  location.reload()
});


// Botón para agregar manualmente en caso de ser necesario
document.getElementById("btnPrecios").addEventListener("click", function () {
  const modal = new bootstrap.Modal(document.getElementById("modalConsultaPrecios"));
  document.getElementById("buscarProductoPrecio").value = "";
  document.getElementById("tituloProductoPrecio").textContent = "";
  document.getElementById("tbodyPreciosConsulta").innerHTML = "";
  modal.show();
});

function inicializarAutoCompletePrecios() {
  if (!Array.isArray(productos) || productos.length === 0) {
    console.warn("❗ Los productos aún no están cargados.");
    return;
  }

  const autoCompleteInstance = new autoComplete({
    selector: "#buscarProductoPrecio",
    placeHolder: "Buscar producto...",
    data: {
      src: productos,
      keys: ["name", "reference", "codigoBarra"]
    },
    threshold: 1,
    debounce: 100,
    resultsList: {
      element: (list) => {
        list.setAttribute("id", "listaAutoCompletePrecios");
      },
      noResults: true,
      maxResults: 10,
    },
    resultItem: {
      highlight: true,
      render: (item, data) => {
        const prod = data.value;
        item.innerHTML = `<span>${prod.reference || "Sin referencia"} - ${prod.name}</span>`;
      }
    }
  });

  // 🚨 Usa addEventListener para el evento "selection"
  document.querySelector("#buscarProductoPrecio").addEventListener("selection", (event) => {
    const feedback = event.detail;
    const productoSeleccionado = feedback.selection.value;

    const producto = productos.find(p => p._id === productoSeleccionado._id);
    if (!producto) {
      console.warn("⚠️ Producto no encontrado en la lista original.");
      return;
    }

    console.log('✅ hola');
    document.querySelector("#buscarProductoPrecio").value = producto.name;
    mostrarPreciosEnTabla(producto);
  });
}


function mostrarPreciosEnTabla(producto) {
  console.log(producto)

  const tbody = document.getElementById("tbodyPreciosConsulta");
  const titulo = document.getElementById("tituloProductoPrecio");

  titulo.textContent = `${producto.name} (${producto.reference || "Sin referencia"})`;
  tbody.innerHTML = "";

  for (let i = 1; i <= 10; i++) {
    const min = producto.datosFinancieros[`rangoInicial${i}`];
    const max = producto.datosFinancieros[`rangoFinal${i}`];
    const precio = producto.datosFinancieros[`precio${i}`];

    if (min != null && precio != null) {
      const fila = document.createElement("tr");
      fila.innerHTML = `
        <td>${i}</td>
        <td>${min}</td>
        <td>${max > 0 ? max : "Sin límite"}</td>
        <td>$${parseFloat(precio).toFixed(2)}</td>
      `;
      tbody.appendChild(fila);
    }
  }
}





//Guardar Venta


// Guarda venta en localStorage (puedes hacer POST a una ruta si prefieres DB)
document.getElementById("btnGuardarVenta").addEventListener("click", () => {
  const venta = armarVenta();
  const guardadas = JSON.parse(localStorage.getItem("ventasGuardadas") || "[]");

  guardadas.push({
      id: Date.now(),
      timestamp: new Date().toLocaleString(),
      venta
  });

  localStorage.setItem("ventasGuardadas", JSON.stringify(guardadas));

  Swal.fire("Guardado", "La venta fue guardada exitosamente.", "success");
});

// Mostrar lista de ventas guardadas
document.getElementById("btnRecuperarVenta").addEventListener("click", () => {
  const lista = document.getElementById("listaVentasGuardadas");
  lista.innerHTML = "";

  const guardadas = JSON.parse(localStorage.getItem("ventasGuardadas") || "[]");

  if (guardadas.length === 0) {
      lista.innerHTML = "<li class='list-group-item'>No hay ventas guardadas.</li>";
      return;
  }

  guardadas.forEach((v) => {
      const li = document.createElement("li");
      li.className = "list-group-item d-flex justify-content-between align-items-center";

      li.innerHTML = `
          <div>
              <strong>${v.venta.cliente.nombre}</strong><br>
              <small>${v.timestamp}</small><br>
              <small>Total: $${v.venta.totalVenta.toFixed(2)}</small>
          </div>
          <div class="btn-group">
              <button class="btn btn-sm btn-success cargarVenta" data-id="${v.id}">
                  <i class="fa-solid fa-upload"></i>
              </button>
              <button class="btn btn-sm btn-danger eliminarVenta" data-id="${v.id}">
                  <i class="fa-solid fa-trash"></i>
              </button>
          </div>
      `;

      lista.appendChild(li);
  });

  document.querySelectorAll(".cargarVenta").forEach((btn) => {
      btn.addEventListener("click", () => {
          const id = parseInt(btn.getAttribute("data-id"));
          cargarVentaGuardada(id);
          bootstrap.Modal.getInstance(document.getElementById("modalRecuperarVenta")).hide();
      });
  });

  document.querySelectorAll(".eliminarVenta").forEach((btn) => {
      btn.addEventListener("click", () => {
          const id = parseInt(btn.getAttribute("data-id"));
          eliminarVentaGuardada(id);
      });
  });
});


// Cargar venta guardada
function cargarVentaGuardada(id) {
  const guardadas = JSON.parse(localStorage.getItem("ventasGuardadas") || "[]");
  const venta = guardadas.find(v => v.id === id)?.venta;
  if (!venta) return;

  // Limpiar venta actual
  productosSeleccionados.forEach(p => p.row.remove());
  productosSeleccionados = [];
  actualizarResumenVenta();

  clienteSeleccionado = null;
  document.getElementById("nombreClienteVenta").textContent = "PUBLICO EN GENERAL";
  document.getElementById("monederoCliente").textContent = "$0.00";
  document.getElementById("facturaCliente").textContent = "NO";
  document.getElementById("usoCFDIContainer").style.display = "none";

  // Cargar cliente
  if (venta.cliente?.id) {
      const cliente = clientes.find(c => c._id === venta.cliente.id);
      if (cliente) seleccionarCliente(cliente);
  }

  // Cargar productos
  venta.productos.forEach(p => {
      const producto = productos.find(prod => prod._id === p.id);
      if (producto) agregarProductoTabla(producto, p.cantidad);
  });

  // Factura y CFDI
  if (venta.factura) {
      clienteSeleccionado.esfactura = true;
      document.getElementById("facturaCliente").textContent = "SI";
      document.getElementById("usoCFDIContainer").style.display = "block";
      document.getElementById("usoCFDI").value = venta.usoCFDI || "G03";
  }

  // Formas de pago
  const contenedor = document.getElementById("formasDePago");
  contenedor.innerHTML = "";

  venta.formasDePago.forEach(fp => {
      const row = document.createElement("div");
      row.className = "row mb-3 formaDePago";

      row.innerHTML = `
          <div class="col-md-5">
              <label class="form-label">Forma de Pago</label>
              <select class="form-select formaPago">
                  <option value="">Selecciona un metodo de pago</option>
                  <option value="cash">Efectivo</option>
                  <option value="credit-card">Tarjeta crédito</option>
                  <option value="debit-card">Tarjeta débito</option>
                  <option value="transfer">Transferencia</option>
                  <option value="electronic-money">Monedero</option>
              </select>
          </div>

          <div class="col-md-4">
              <label class="form-label text-bold">Importe <i class="fas fa-money-bill-wave text-success"></i></label>
              <div class="input-group">
                  <div class="input-group-prepend">
                      <span class="input-group-text bg-success text-white">
                          <i class="fas fa-dollar-sign"></i>
                      </span>
                  </div>
                  <input type="number" class="form-control importePago custom-input" placeholder="0.00" />
              </div>
          </div>

          <div class="col-md-1 d-flex text-center" style="height: 30px; margin-top: 27pt;">
              <button type="button" class="btn btn-danger btn-sm eliminarFormaPago">
                  <i class="fa-solid fa-trash"></i>
              </button>
          </div>
      `;

      contenedor.appendChild(row);

      const select = row.querySelector(".formaPago");
      const input = row.querySelector(".importePago");

      select.value = fp.forma;
      input.value = ''
      input.disabled = !fp.forma;

      attachPaymentRowEvents(row);
  });

  updatePagos();
  actualizarResumenVenta();

  Swal.fire("Venta cargada", "Se han restaurado los datos de la venta guardada.", "success");
}


function eliminarVentaGuardada(id) {
  let guardadas = JSON.parse(localStorage.getItem("ventasGuardadas") || "[]");
  guardadas = guardadas.filter(v => v.id !== id);
  localStorage.setItem("ventasGuardadas", JSON.stringify(guardadas));
  Swal.fire("Eliminada", "La venta guardada fue eliminada.", "success");
  document.getElementById("btnRecuperarVenta").click(); // Recargar modal
}
