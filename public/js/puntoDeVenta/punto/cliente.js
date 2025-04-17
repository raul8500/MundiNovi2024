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

  const rfc = cliente.clientData.identification || "";
  const regimenCliente = cliente.clientData.regime || "";

  // Rellenar campos
  document.getElementById("nombreCliente").value = cliente.clientData.name || "";
  document.getElementById("rfcCliente").value = rfc;
  document.getElementById("numeroTelefonoCliente").value = cliente.clientData.mobile || "";
  document.getElementById("correoCliente").value = cliente.clientData.email || "";

  // Dirección
  document.getElementById("calleCliente").value = cliente.clientData.address.street || "";
  document.getElementById("localidadCliente").value = cliente.clientData.address.city || "";
  document.getElementById("exteriorCliente").value = cliente.clientData.address.exterior || "";
  document.getElementById("interiorCliente").value = cliente.clientData.address.interior || "";
  document.getElementById("coloniaCliente").value = cliente.clientData.address.neighborhood || "";
  document.getElementById("municipioCliente").value = cliente.clientData.address.municipality || "";
  document.getElementById("estadoCiente").value = cliente.clientData.address.state || "";
  document.getElementById("codigoPostalCliente").value = cliente.clientData.address.zip || "";

  // Siempre establecer la venta como NO facturable por defecto
  clienteSeleccionado.esfactura = false;

  // Actualizar interfaz visual
  document.getElementById("facturaCliente").textContent = "NO";
  document.getElementById("usoCFDIContainer").style.display = "none";

  // Cargar regímenes fiscales al select según RFC
  const selectRegimen = document.getElementById("regimenFiscalCliente");
  selectRegimen.innerHTML = ""; // Limpiar opciones anteriores

  const regimenesFisica = [
    { value: '612', text: 'Personas Físicas con Actividades Empresariales y Profesionales' },
    { value: '621', text: 'Incorporación Fiscal' },
    { value: '606', text: 'Arrendamiento' },
    { value: '625', text: 'Actividades Empresariales en Plataformas Tecnológicas' },
    { value: '605', text: 'Sueldos y Salarios e Ingresos Asimilados' },
    { value: '626', text: 'RESICO (Simplificado de Confianza)' },
    { value: '616', text: 'Sin obligaciones fiscales' },
    { value: '611', text: 'Ingresos por Dividendos (socios y accionistas)' },
  ];

  const regimenesMoral = [
    { value: '616', text: 'Régimen General de Ley Personas Morales' },
    { value: '620', text: 'Sociedades Cooperativas con diferimiento de ingresos' },
    { value: '616', text: 'Personas Morales sin fines de lucro' },
    { value: '624', text: 'Coordinados' },
    { value: '616', text: 'Sin obligaciones fiscales' },
    { value: '620', text: 'RESICO (Simplificado de Confianza)' },
    { value: '623', text: 'Opcional para Grupos de Sociedades' },
    { value: '616', text: 'AGAPES (Actividades Agrícolas, Ganaderas, etc.)' }
  ];

  const listaRegimenes = rfc.length === 12 ? regimenesMoral : regimenesFisica;

  listaRegimenes.forEach((regimen) => {
    const option = document.createElement("option");
    option.value = regimen.value;
    option.textContent = regimen.text;
    if (regimen.value === regimenCliente) {
      option.selected = true;
    }
    selectRegimen.appendChild(option);
  });
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

  // Inicializar si no existe
  if (typeof clienteSeleccionado.esfactura !== 'boolean') {
    clienteSeleccionado.esfactura = false;
  }

  // Alternar estado
  clienteSeleccionado.esfactura = !clienteSeleccionado.esfactura;

  // Reflejar estado en pantalla
  document.getElementById("facturaCliente").textContent = clienteSeleccionado.esfactura ? "SI" : "NO";
  document.getElementById("usoCFDIContainer").style.display = clienteSeleccionado.esfactura ? "block" : "none";

  Swal.fire({
    icon: clienteSeleccionado.esfactura ? 'success' : 'info',
    title: clienteSeleccionado.esfactura ? 'Factura activada' : 'Factura desactivada',
    text: clienteSeleccionado.esfactura 
      ? 'La venta va a emitir factura.'
      : 'La venta ya no emitirá factura.',
    showConfirmButton: false,
    timer: 1500
  });
});


