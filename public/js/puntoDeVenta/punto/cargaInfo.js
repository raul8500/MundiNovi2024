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
    })
    .catch((error) => console.error("Error al cargar productos:", error));
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
      return precioX;
    }
  }
  return producto.datosFinancieros.precio1;
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
    // Verificar si el producto ya existe en la lista (usando _id o reference)
    let itemExistente = productosSeleccionados.find(
      (item) => item.producto._id === producto._id
    );
    if (itemExistente) {
      // Actualiza la cantidad sumándole la nueva cantidad
      let currentQty = parseFloat(itemExistente.inputCantidad.value) || 0;
      let newQty = currentQty + cantidad;
      itemExistente.inputCantidad.value = newQty;
      // Recalcula el precio unitario según los rangos para la nueva cantidad
      let recalculatedPrecio = calcularPrecio(producto, newQty);
      itemExistente.inputPrecio.value = recalculatedPrecio;
      // Actualiza el precio con IVA (16%)
      itemExistente.inputPrecioIva.value = (recalculatedPrecio * 1.16).toFixed(2);
      // Actualiza el total (precio con IVA * cantidad)
      let precioIva = parseFloat(itemExistente.inputPrecioIva.value) || 0;
      itemExistente.inputTotal.value = (precioIva * newQty).toFixed(2);
      // Actualiza el objeto en productosSeleccionados
      itemExistente.cantidad = newQty;
      itemExistente.precio = recalculatedPrecio;
      actualizarResumenVenta();
      return;
    }
  
    const tbody = document.getElementById("productos");
    const tr = document.createElement("tr");
  
    // Celda Producto (nombre)
    const tdProducto = document.createElement("td");
    tdProducto.textContent = producto.name;
    tr.appendChild(tdProducto);
  
    // Celda Rangos: Muestra "Precio 1:" y los primeros 3 rangos (i = 2, 3 y 4)
    // Celda Rangos: Mostrar en dos filas con texto reducido
    const tdRangos = document.createElement("td");
    tdRangos.style.fontSize = "12px"; // Ajusta el tamaño de fuente según lo necesites

    let row1 = "";
    let row2 = "";

    // Primera fila: siempre muestra Precio 1 y, si existe, el segundo rango
    const precio1 = (producto.datosFinancieros.precio1 * 1.16).toFixed(2)
    row1 = `Precio 1: ${precio1}`;
    const ri2 = producto.datosFinancieros.rangoInicial2;
    const precio2 = (producto.datosFinancieros.precio2 * 1.16).toFixed(2)
    if (ri2 > 0) {
    row1 += ` | Más de ${ri2}: ${precio2}`;
    }

    // Segunda fila: muestra el tercer y cuarto rango, si existen
    const ri3 = producto.datosFinancieros.rangoInicial3;
    const precio3 = (producto.datosFinancieros.precio3 *1.16).toFixed(2)
    if (ri3 > 0) {
    row2 = `Más de ${ri3}: ${precio3}`;
    }
    const ri4 = producto.datosFinancieros.rangoInicial4;
    const precio4 = (producto.datosFinancieros.precio4 * 1.16).toFixed(2)
    if (ri4 > 0) {
    row2 += row2 ? ` | Más de ${ri4}: ${precio4}` : `Más de ${ri4}: ${precio4}`;
    }

    tdRangos.innerHTML = `<div>${row1}</div><div>${row2}</div>`;
    tr.appendChild(tdRangos);

  
    // Celda Precio (editable) – se calcula según la cantidad
    const tdPrecio = document.createElement("td");
    const inputPrecio = document.createElement("input");
    inputPrecio.type = "number";
    inputPrecio.classList.add("form-control");
    inputPrecio.value = calcularPrecio(producto, cantidad);
    tdPrecio.appendChild(inputPrecio);
    tr.appendChild(tdPrecio);
  
    // Nueva celda: Precio con IVA (16% del precio)
    const tdPrecioIva = document.createElement("td");
    const inputPrecioIva = document.createElement("input");
    inputPrecioIva.type = "number";
    inputPrecioIva.classList.add("form-control");
    inputPrecioIva.value = (parseFloat(inputPrecio.value) * 1.16).toFixed(2);
    inputPrecioIva.readOnly = true;
    tdPrecioIva.appendChild(inputPrecioIva);
    tr.appendChild(tdPrecioIva);
  
    // Celda Cantidad (editable)
    const tdCantidad = document.createElement("td");
    const inputCantidad = document.createElement("input");
    inputCantidad.type = "number";
    inputCantidad.classList.add("form-control");
    inputCantidad.value = cantidad;
    tdCantidad.appendChild(inputCantidad);
    tr.appendChild(tdCantidad);
  
    // Celda Total (calculado con precio con IVA * cantidad)
    const tdTotal = document.createElement("td");
    const inputTotal = document.createElement("input");
    inputTotal.type = "number";
    inputTotal.classList.add("form-control");
    let precioIvaInicial = parseFloat(inputPrecioIva.value) || 0;
    inputTotal.value = (precioIvaInicial * cantidad).toFixed(2);
    inputTotal.readOnly = true;
    tdTotal.appendChild(inputTotal);
    tr.appendChild(tdTotal);
  
    // Celda Acciones (botón para eliminar)
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

    tbody.appendChild(tr);

  
    // Objeto para guardar el producto seleccionado
    const productoSeleccionado = {
      producto: producto,
      cantidad: cantidad,
      precio: parseFloat(inputPrecio.value),
      row: tr,
      inputPrecio: inputPrecio,
      inputPrecioIva: inputPrecioIva,
      inputCantidad: inputCantidad,
      inputTotal: inputTotal,
    };
    productosSeleccionados.push(productoSeleccionado);
  
    // Al cambiar la cantidad, se recalcula el precio unitario, precio con IVA y total
    inputCantidad.addEventListener("change", function () {
      const newCantidad = parseFloat(inputCantidad.value) || 0;
      const recalculatedPrecio = calcularPrecio(producto, newCantidad);
      inputPrecio.value = recalculatedPrecio;
      inputPrecioIva.value = (recalculatedPrecio * 1.16).toFixed(2);
      inputTotal.value = (parseFloat(inputPrecioIva.value) * newCantidad).toFixed(2);
      productoSeleccionado.cantidad = newCantidad;
      productoSeleccionado.precio = recalculatedPrecio;
      actualizarResumenVenta();
    });
  
    // Al cambiar el precio manualmente, se recalcula el precio con IVA y el total
    inputPrecio.addEventListener("change", function () {
      const newPrecio = parseFloat(inputPrecio.value) || 0;
      inputPrecioIva.value = (newPrecio * 1.16).toFixed(2);
      const currentCantidad = parseFloat(inputCantidad.value) || 0;
      inputTotal.value = (parseFloat(inputPrecioIva.value) * currentCantidad).toFixed(2);
      productoSeleccionado.precio = newPrecio;
      actualizarResumenVenta();
    });
  
    actualizarResumenVenta();
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
