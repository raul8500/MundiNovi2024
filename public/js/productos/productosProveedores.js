    let proveedores = [];  // Lista de todos los proveedores
    let proveedoresSeleccionados = []; // Lista de proveedores seleccionados para la tabla
    let proveedorIndex = -1;  // Índice para la navegación de recomendaciones

    // Cargar todos los proveedores al inicio
    function cargarProveedores() {
        fetch('/api/proveedor')
            .then(response => response.json())
            .then(data => {
                proveedores = data; // Almacenar proveedores para búsquedas
            })
            .catch(error => console.error('Error al cargar proveedores:', error));
    }

    cargarProveedores();  // Llamar al cargar la página

    // Buscar proveedores según lo que el usuario escriba en el input
    document.getElementById('providerSearch').addEventListener('input', function() {
        const query = this.value.toLowerCase().trim();

        // Solo mostrar sugerencias si hay algo en el input
        if (query.length === 0) {
            ocultarSugerencias();
            return;
        }

        const resultados = proveedores.filter(proveedor => proveedor.nombre && proveedor.nombre.toLowerCase().includes(query));
        mostrarSugerencias(resultados);
    });

    // Mostrar las sugerencias debajo del input
    function mostrarSugerencias(resultados) {
        const sugerenciasContainer = document.createElement('ul');
        sugerenciasContainer.id = 'suggestions';
        sugerenciasContainer.className = 'list-group';

        // Limpiar las sugerencias anteriores
        const oldSuggestions = document.getElementById('suggestions');
        if (oldSuggestions) {
            oldSuggestions.remove();
        }

        if (resultados.length === 0) {
            return; // Si no hay resultados, no mostrar nada
        }

        resultados.forEach((proveedor, index) => {
            const li = document.createElement('li');
            li.className = 'list-group-item';
            li.textContent = proveedor.nombre;
            li.setAttribute('data-id', proveedor._id);

            li.addEventListener('click', function() {
                agregarProveedorAlaTabla(proveedor);
            });

            sugerenciasContainer.appendChild(li);
        });

        document.getElementById('search-provider-form').appendChild(sugerenciasContainer);
    }

    // Función para ocultar las sugerencias
    function ocultarSugerencias() {
        const oldSuggestions = document.getElementById('suggestions');
        if (oldSuggestions) {
            oldSuggestions.remove();
        }
        proveedorIndex = -1;  // Reiniciar el índice
    }

    // Función para navegar entre sugerencias con el teclado
    document.getElementById('providerSearch').addEventListener('keydown', function(event) {
        const sugerencias = document.querySelectorAll('#suggestions li');
        if (event.key === 'ArrowDown') {
            proveedorIndex = (proveedorIndex + 1) % sugerencias.length;
            actualizarSugerenciaActiva(sugerencias);
        } else if (event.key === 'ArrowUp') {
            proveedorIndex = (proveedorIndex - 1 + sugerencias.length) % sugerencias.length;
            actualizarSugerenciaActiva(sugerencias);
        } else if (event.key === 'Enter') {
            event.preventDefault();
            if (proveedorIndex >= 0 && sugerencias.length > 0) {
                const proveedorId = sugerencias[proveedorIndex].getAttribute('data-id');
                const proveedor = proveedores.find(p => p._id == proveedorId);
                if (proveedor) {
                    agregarProveedorAlaTabla(proveedor);
                    ocultarSugerencias();  // Eliminar las sugerencias
                }
            }
        }
    });

    function actualizarSugerenciaActiva(sugerencias) {
        sugerencias.forEach((li, index) => {
            if (index === proveedorIndex) {
                li.classList.add('active');
            } else {
                li.classList.remove('active');
            }
        });
    }

    // Función para agregar proveedor a la tabla
    function agregarProveedorAlaTabla(proveedor) {
        // Asegurarse de que el proveedor tenga los datos correctos antes de agregar
        if (proveedor && proveedor.nombre && proveedor._id) {
            // Evitar agregar el mismo proveedor dos veces
            if (!proveedoresSeleccionados.some(p => p._id === proveedor._id)) {
                proveedoresSeleccionados.push(proveedor);
                actualizarTabla();
            }

            // Limpiar el input después de agregar
            document.getElementById('providerSearch').value = '';
            ocultarSugerencias();
        } else {
            console.error('Proveedor inválido:', proveedor);
        }
    }

    // Función para eliminar proveedor de la tabla
    function eliminarProveedorDeTabla(idProveedor) {
        proveedoresSeleccionados = proveedoresSeleccionados.filter(p => p._id !== idProveedor);
        actualizarTabla();
    }

    // Función para actualizar la tabla
    function actualizarTabla() {
        const tbody = document.querySelector('#providerTable tbody');
        tbody.innerHTML = '';  // Limpiar la tabla

        proveedoresSeleccionados.forEach(proveedor => {
            if (proveedor && proveedor.nombre && proveedor._id) { // Validación adicional para evitar proveedores inválidos
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${proveedor.nombre}</td>
                    <td><button class="btn btn-danger btn-sm" onclick="eliminarProveedorDeTabla('${proveedor._id}')">Eliminar</button></td>
                `;
                tbody.appendChild(tr);
            }
        });
    }

    // Función para agregar proveedores por ID (para la funcionalidad de editar)
    function agregarProveedoresPorId(ids) {
        ids.forEach(id => {
            const proveedor = proveedores.find(p => p._id === id);
            if (proveedor) {
                agregarProveedorAlaTabla(proveedor);
            }
        });
    }

    // Agregar proveedor por botón "Agregar Proveedor"
    document.getElementById('addProviderBtn').addEventListener('click', function() {
        const searchValue = document.getElementById('providerSearch').value.toLowerCase().trim();
        const proveedor = proveedores.find(p => p.nombre.toLowerCase() === searchValue);
        if (proveedor) {
            agregarProveedorAlaTabla(proveedor);
        }
    });