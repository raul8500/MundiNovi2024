let clientes = [];
let clienteSeleccionado = null; // Variable global para almacenar el cliente seleccionado
let selectedClienteIndex = -1;
let facturaActivada = false;

// Cargar los clientes desde la base de datos
function cargarClientes() {
  fetch('/api/cliente/test')
    .then(response => response.json())
    .then(data => {
      // Asumimos que la respuesta tiene una propiedad "clientes"
      clientes = data.clientes;
    })
    .catch(error => console.error('Error al cargar clientes:', error));
}
cargarClientes();

// Evento para filtrar clientes conforme se escribe en el input
document.getElementById("inputBuscarCliente").addEventListener("input", function () {
  const searchTerm = this.value.toLowerCase().trim();
  const lista = document.getElementById("listaClientes");
  lista.innerHTML = "";
  selectedClienteIndex = -1;
  
  if (searchTerm.length === 0) {
    lista.style.display = "none";
    return;
  }
  
  // Filtrar clientes por nombre (puedes ajustar para buscar también por identificación)
  const resultados = clientes.filter(cliente =>
    cliente.clientData.name.toLowerCase().includes(searchTerm)
  );
  
  if (resultados.length > 0) {
    lista.style.display = "block";
    resultados.forEach((cliente, index) => {
      const li = document.createElement("li");
      li.classList.add("list-group-item");
      // Se muestra "Nombre - Identificación"
      li.textContent = `${cliente.clientData.name} - ${cliente.clientData.identification}`;
      li.addEventListener("click", function () {
        seleccionarCliente(cliente);
        document.getElementById("inputBuscarCliente").value = "";
        lista.innerHTML = "";
        lista.style.display = "none";
      });
      lista.appendChild(li);
    });
  } else {
    lista.style.display = "none";
  }
});

// Navegación de sugerencias con flechas y selección con Enter
document.getElementById("inputBuscarCliente").addEventListener("keydown", function (e) {
  const lista = document.getElementById("listaClientes");
  const items = lista.getElementsByTagName("li");
  if (items.length === 0) return;

  if (e.key === "ArrowDown") {
    e.preventDefault();
    selectedClienteIndex++;
    if (selectedClienteIndex >= items.length) {
      selectedClienteIndex = 0;
    }
    updateActiveClienteSuggestion();
  } else if (e.key === "ArrowUp") {
    e.preventDefault();
    selectedClienteIndex--;
    if (selectedClienteIndex < 0) {
      selectedClienteIndex = items.length - 1;
    }
    updateActiveClienteSuggestion();
  } else if (e.key === "Enter") {
    e.preventDefault();
    if (selectedClienteIndex >= 0 && selectedClienteIndex < items.length) {
      items[selectedClienteIndex].click();
    }
  }
});

function updateActiveClienteSuggestion() {
  const lista = document.getElementById("listaClientes");
  const items = lista.getElementsByTagName("li");
  for (let i = 0; i < items.length; i++) {
    if (i === selectedClienteIndex) {
      items[i].classList.add("active");
      items[i].scrollIntoView({ block: "nearest", behavior: "smooth" });
    } else {
      items[i].classList.remove("active");
    }
  }
}

// Función para rellenar la información del cliente en el modal y guardarlo en la variable global
function seleccionarCliente(cliente) {
  clienteSeleccionado = cliente; // Se guarda el cliente seleccionado

  document.getElementById("nombreCliente").value = cliente.clientData.name || "gola";
  document.getElementById("rfcCliente").value = cliente.clientData.identification || "";
  document.getElementById("numeroTelefonoCliente").value = cliente.clientData.phonePrimary || "";
  document.getElementById("regimenFiscalCliente").value = cliente.clientData.regime || "";
  
  // Información de dirección
  document.getElementById("calleCliente").value = cliente.clientData.address.street || "";
  document.getElementById("localidadCliente").value = cliente.clientData.address.locality || "";
  document.getElementById("exteriorCliente").value = cliente.clientData.address.exteriorNumber || "";
  document.getElementById("interiorCliente").value = cliente.clientData.address.interiorNumber || "";
  document.getElementById("coloniaCliente").value = cliente.clientData.address.colony || "";
  document.getElementById("municipioCliente").value = cliente.clientData.address.municipality || "";
  document.getElementById("estadoCiente").value = cliente.clientData.address.state || "";
  document.getElementById("codigoPostalCliente").value = cliente.clientData.address.zipCode || "";
  
  document.getElementById("correoCliente").value = cliente.clientData.email || "";
}

// Al hacer clic en "btnSeleccionarUsuario" se abre el modal y se hace focus en el input
document.getElementById("btnSeleccionarUsuario").addEventListener("click", function () {
  var modalCliente = new bootstrap.Modal(document.getElementById("modalCliente"));
  modalCliente.show();
  setTimeout(() => {
    document.getElementById("inputBuscarCliente").focus();
  }, 500);
});

document.getElementById("btnConfirmarSeleccionarUsuario").addEventListener("click", function() {
    if (!clienteSeleccionado) {
      Swal.fire('Error', 'Por favor, seleccione un cliente primero.', 'error');
      return;
    }
    
    // Actualizar la sección de información del cliente en la venta
    document.getElementById("nombreClienteVenta").textContent = clienteSeleccionado.clientData.name || "PUBLICO EN GENERAL";
    document.getElementById("monederoCliente").textContent = "$" + (clienteSeleccionado.monedero ? parseFloat(clienteSeleccionado.monedero).toFixed(2) : "0.00");
    
    // Si requieres actualizar otros campos (como sucursal o vendedor), hazlo aquí
    
    // Cerrar el modal (suponiendo que usas Bootstrap 5)
    var modalClienteEl = document.getElementById("modalCliente");
    var modalInstance = bootstrap.Modal.getInstance(modalClienteEl);
    if (modalInstance) {
      modalInstance.hide();
    }
    
    // Mostrar alerta informativa de que el cliente ya fue seleccionado
    Swal.fire({
        icon: 'success',
        title: 'Cliente Seleccionado',
        showConfirmButton: false,
        timer: 1500
      });
});


document.getElementById("btnFacturar").addEventListener("click", function() {
  if (!clienteSeleccionado) {
    Swal.fire('Error', 'Por favor, seleccione un cliente primero.', 'error');
    return;
  }
  
  // Determinar si la venta es facturable
  let facturable = clienteSeleccionado.esfactura;
  // Actualizar el panel del cliente para mostrar si factura o no
  document.getElementById("facturaCliente").textContent = facturable ? "SI" : "NO";
  
  // Mostrar u ocultar el contenedor de Uso de CFDI según corresponda
  if (facturable) {
    document.getElementById("usoCFDIContainer").style.display = "block";
    Swal.fire({
      icon: 'success',
      title: 'Venta con Factura',
      text: 'La venta va a emitir factura.',
      showConfirmButton: false,
      timer: 1500
    });
  } else {
    document.getElementById("usoCFDIContainer").style.display = "none";
    Swal.fire({
      icon: 'info',
      title: 'Venta sin Factura',
      text: 'La venta no podrá emitir factura.',
      showConfirmButton: false,
      timer: 1500
    });
  }
});


  
  

