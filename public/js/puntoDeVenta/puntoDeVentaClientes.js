let clientes = [];
let indexSeleccionado = -1;
let clienteSeleccionado = null;  // Variable global para guardar la información del cliente seleccionado
let clientesFiltrados = [];

// Cargar los clientes desde la base de datos
function cargarClientes() {
    fetch('/api/clientesBD')
        .then(response => response.json())
        .then(data => {
            clientes = data;
        })
        .catch(error => console.error('Error al cargar clientes:', error));
}

// Filtrar clientes y mostrar resultados
function filtrarClientes(query) {
    clientesFiltrados = clientes.filter(cliente => {
        const nombreValido = cliente.name && typeof cliente.name === 'string';
        const mobileValido = cliente.mobile && typeof cliente.mobile === 'string';

        return (nombreValido && cliente.name.toLowerCase().includes(query.toLowerCase())) ||
               (mobileValido && cliente.mobile.includes(query));
    });

    mostrarResultados(clientesFiltrados);
}

// Mostrar lista de resultados
function mostrarResultados(resultados) {
    const lista = document.getElementById('listaClientes');
    lista.innerHTML = '';  // Limpiar la lista anterior

    if (resultados.length === 0 || document.getElementById('inputBuscarCliente').value === '') {
        lista.style.display = 'none';  // Ocultar lista si no hay resultados o no hay texto
        return;
    }

    resultados.forEach((cliente, index) => {
        const li = document.createElement('li');
        li.classList.add('list-group-item');
        li.textContent = `${cliente.name} - ${cliente.mobile || '-No tiene-'}`;
        li.setAttribute('data-index', index); // Ahora el data-index corresponde a clientesFiltrados
        li.addEventListener('click', () => seleccionarCliente(clientesFiltrados[index])); // Usar clientesFiltrados
        lista.appendChild(li);
    });

    lista.style.display = 'block';  // Mostrar la lista
}

// Función para seleccionar un cliente
function seleccionarCliente(cliente) {
    document.getElementById('inputBuscarCliente').value = `${cliente.name} - ${cliente.mobile || 'Sin numero mobile'}`;
    document.getElementById('listaClientes').style.display = 'none';
    indexSeleccionado = -1;  // Resetear el índice seleccionado

    // Guardar toda la información del cliente en la variable global
    clienteSeleccionado = cliente;

    document.getElementById('nombreCliente').value = cliente.name || '';
    document.getElementById('rfcCliente').value = cliente.identification || '';
    document.getElementById('regimenFiscalCliente').value = cliente.regimeObject || '';
    document.getElementById('calleCliente').value = cliente.address.street || '';
    document.getElementById('localidadCliente').value = cliente.address.locality || '';
    document.getElementById('exteriorCliente').value = cliente.address.exteriorNumber || '';
    document.getElementById('interiorCliente').value = cliente.address.interiorNumber || '';
    document.getElementById('coloniaCliente').value = cliente.address.colony || '';
    document.getElementById('municipioCliente').value = cliente.address.municipality || '';
    document.getElementById('estadoCiente').value = cliente.address.state || '';
    document.getElementById('codigoPostalCliente').value = cliente.address.zipCode || '';
    document.getElementById('correoCliente').value = cliente.email || '';
    document.getElementById('monederoCliente').textContent = cliente.monedero || '0.0';
    console.log('Cliente seleccionado:', clienteSeleccionado);

}

// Manejar la navegación por teclado y selección con Enter
document.getElementById('inputBuscarCliente').addEventListener('keydown', (e) => {
    const lista = document.getElementById('listaClientes');
    const items = lista.getElementsByTagName('li');

    if (e.key === 'ArrowDown') {
        indexSeleccionado = (indexSeleccionado + 1) % items.length;
        actualizarSeleccion(items);
    } else if (e.key === 'ArrowUp') {
        indexSeleccionado = (indexSeleccionado - 1 + items.length) % items.length;
        actualizarSeleccion(items);
    } else if (e.key === 'Enter') {
        if (indexSeleccionado >= 0 && items[indexSeleccionado]) {
            const clienteIndex = items[indexSeleccionado].getAttribute('data-index');
            seleccionarCliente(clientesFiltrados[clienteIndex]); // Usar clientesFiltrados para la selección
            e.preventDefault(); // Evitar que el formulario se envíe si está dentro de uno
        }
    }
});

// Actualizar selección visual de cliente
function actualizarSeleccion(items) {
    for (let i = 0; i < items.length; i++) {
        items[i].classList.remove('active');
    }
    if (indexSeleccionado >= 0 && items[indexSeleccionado]) {
        items[indexSeleccionado].classList.add('active');
        items[indexSeleccionado].scrollIntoView({ block: 'nearest' }); // Asegura que el elemento seleccionado sea visible
    }
}

// Buscar mientras escribes
document.getElementById('inputBuscarCliente').addEventListener('input', (e) => {
    indexSeleccionado = -1; // Resetear el índice al escribir
    const query = e.target.value;
    filtrarClientes(query);
});

// Cargar clientes al inicio
cargarClientes();

// Buscar mientras escribes
document.getElementById('btnSelectUser').addEventListener('click', (e) => {
    if(user == true){
        Swal.fire({
            icon: "success",
            title: "Cliente seleccionado",
            showConfirmButton: false,
            timer: 1000
          });
        modalSelectUser.hide()
        document.getElementById('btnCancelarCliente').style.visibility = 'visible';
        ventaCliente.textContent = clienteSeleccionado.name
        ventaCliente.style.color = 'green'
        esFactura = false
    }else{
        Swal.fire({
            icon: "success",
            title: "Cliente con factura seleccionado",
            showConfirmButton: false,
            timer: 1000
          });
        modalSelectUser.hide()
        facturarVenta()
        document.getElementById('btnCancelarFactura').style.visibility = 'visible';
        document.getElementById('btnCancelarCliente').style.visibility = 'visible';
        ventaCliente.textContent = clienteSeleccionado.name
        ventaCliente.style.color = 'green'
        
        esFactura = true
    }

});

function limpiarCliente(){
    document.getElementById('inputBuscarCliente').value = '';
    document.getElementById('nombreCliente').value = '';
    document.getElementById('rfcCliente').value =  '';
    document.getElementById('regimenFiscalCliente').value =  '';
    document.getElementById('calleCliente').value ='';
    document.getElementById('localidadCliente').value =  '';
    document.getElementById('exteriorCliente').value =  '';
    document.getElementById('interiorCliente').value = '';
    document.getElementById('coloniaCliente').value =  '';
    document.getElementById('municipioCliente').value =  '';
    document.getElementById('estadoCiente').value =  '';
    document.getElementById('codigoPostalCliente').value =  '';
    document.getElementById('correoCliente').value = '';
}

document.getElementById('btnCancelarFactura').addEventListener('click', (e) => {
    facturarVenta()
});

document.getElementById('btnCancelarCliente').addEventListener('click', (e) => {
    document.getElementById('ventaCliente').textContent = '';
    document.getElementById('ventaCliente').style.color = 'black'    
    limpiarCliente()
    clienteSeleccionado = []
    if(facturaResumenVenta.textContent != ''){
        facturarVenta()
    }
    document.getElementById('btnCancelarCliente').style.visibility = 'hidden';
    document.getElementById('btnCancelarFactura').style.visibility = 'hidden';
    document.getElementById('monederoCliente').textContent = '';
});