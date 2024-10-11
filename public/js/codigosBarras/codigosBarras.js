    let todosLosProductos = []; // Variable para almacenar todos los productos para la búsqueda
    let selectedIndex = -1; // Índice para manejar la navegación por los resultados

    // Cargar todos los productos para la búsqueda
    function cargarTodosLosProductos() {
        fetch('/api/productos') // Ajusta la ruta según sea necesario
            .then(response => response.json())
            .then(data => {
                todosLosProductos = data.products;  // Ajustar si tu JSON contiene otra estructura
                inicializarFuse();  // Inicializar Fuse después de cargar los productos
            })
            .catch(error => console.error('Error al cargar productos:', error));
    }

    // Inicializar Fuse.js para la búsqueda
    function inicializarFuse() {
        const options = {
            keys: ['reference']  // Ajusta según la estructura de tu JSON de productos
        };

        const fuse = new Fuse(todosLosProductos, options);
        const searchInput = document.getElementById('productoSearch');
        const suggestionsDiv = document.getElementById('suggestions');
        const cantidadInput = document.getElementById('cantidadCodigos'); // Input de cantidad

        // Evento de búsqueda al escribir en el input
        searchInput.addEventListener('input', function () {
            const query = searchInput.value;
            const results = fuse.search(query);

            // Limpiar sugerencias anteriores
            suggestionsDiv.innerHTML = '';
            selectedIndex = -1;

            // Mostrar sugerencias
            if (query && results.length > 0) {
                results.forEach(result => {
                    const item = result.item;
                    const div = document.createElement('div');
                    div.classList.add('suggestion-item');
                    div.textContent = `${item.reference}`;  // Ajusta según los datos que estás mostrando
                    div.addEventListener('click', () => seleccionarProducto(item));
                    suggestionsDiv.appendChild(div);
                });
            }
        });

        // Manejo de navegación con teclado
        searchInput.addEventListener('keydown', function (e) {
            const suggestionItems = document.querySelectorAll('.suggestion-item');

            // Navegar hacia abajo con ArrowDown
            if (e.key === 'ArrowDown') {
                if (selectedIndex < suggestionItems.length - 1) {
                    selectedIndex++;
                    updateSelection(suggestionItems);
                }
            }

            // Navegar hacia arriba con ArrowUp
            if (e.key === 'ArrowUp') {
                if (selectedIndex > 0) {
                    selectedIndex--;
                    updateSelection(suggestionItems);
                }
            }

            // Seleccionar con Enter
            if (e.key === 'Enter') {
                if (selectedIndex >= 0 && suggestionItems[selectedIndex]) {
                    suggestionItems[selectedIndex].click();
                    cantidadInput.focus(); // Poner foco en el input de cantidad después de seleccionar el producto
                }
            }
        });

        // Función para actualizar la selección visible
        function updateSelection(items) {
            // Quitar la selección anterior
            items.forEach((item, index) => {
                item.classList.remove('selected');
            });

            // Aplicar selección actual
            if (items[selectedIndex]) {
                items[selectedIndex].classList.add('selected');

                // Asegurar que el ítem seleccionado sea visible en el scroll
                items[selectedIndex].scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest'
                });
            }
        }

        // Función para añadir el producto seleccionado al input
        function seleccionarProducto(item) {
            document.getElementById('productoSearch').value = item.reference;
            suggestionsDiv.innerHTML = ''; // Limpiar las sugerencias después de seleccionar
            cantidadInput.focus(); // Enfocar el input de cantidad después de seleccionar el producto
        }
    }

    // Función para añadir el producto y cantidad a la tabla
    document.getElementById('agregarBtn').addEventListener('click', () => {
        const nombreProducto = document.getElementById('productoSearch').value;
        const cantidadCodigos = document.getElementById('cantidadCodigos').value;

        if (nombreProducto && cantidadCodigos) {
            const tablaProductos = document.getElementById('productosSeleccionados').getElementsByTagName('tbody')[0];
            
            // Buscar el producto basado en el nombre
            const productoSeleccionado = todosLosProductos.find(p => p.reference === nombreProducto);

            if (!productoSeleccionado) {
                alert('Producto no encontrado.');
                return;
            }

            // Crear nueva fila
            const row = tablaProductos.insertRow();
            row.setAttribute('data-id', productoSeleccionado._id);  // Almacenar el _id en un atributo data-id
            
            // Crear celdas
            const cellClave = row.insertCell(0);
            const cellCodigoBarras = row.insertCell(1);
            const cellCantidad = row.insertCell(2);
            const cellAcciones = row.insertCell(3);

            // Añadir contenido a las celdas
            cellClave.textContent = productoSeleccionado.reference;
            cellCodigoBarras.textContent = productoSeleccionado.codigoBarra || 'Sin código';
            cellCantidad.textContent = cantidadCodigos;

            // Botón de eliminar
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Eliminar';
            deleteBtn.classList.add('btn', 'btn-danger', 'btn-sm');
            deleteBtn.addEventListener('click', () => row.remove());
            cellAcciones.appendChild(deleteBtn);

            // Limpiar los inputs
            document.getElementById('productoSearch').value = '';
            document.getElementById('cantidadCodigos').value = '';
            document.getElementById('productoSearch').focus(); // Poner foco en el input de producto después de agregar
        } else {
            alert('Por favor, completa todos los campos.');
        }
    });


    // Función para manejar el botón de generar códigos de barras
    document.getElementById('generarCodigosBtn').addEventListener('click', () => {
        const tablaProductos = document.getElementById('productosSeleccionados').getElementsByTagName('tbody')[0];
        const filas = tablaProductos.getElementsByTagName('tr');

        const productosParaGenerar = [];

        for (let i = 0; i < filas.length; i++) {
            const idProducto = filas[i].getAttribute('data-id');
            const texto = filas[i].getElementsByTagName('td')[0].textContent;
            const cantidad = filas[i].getElementsByTagName('td')[2].textContent;

            productosParaGenerar.push({
                texto: texto,
                cantidad: parseInt(cantidad)
            });
        }

        // Enviar la solicitud al backend para generar el PDF
        fetch('/api/codigosBarras/productos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ productos: productosParaGenerar })
        })
        .then(response => response.json())
        .then(data => {
            if (data.archivo) {
                // Descargar el archivo PDF desde la ruta pública
                const link = document.createElement('a');
                link.href = data.archivo; // Usar la ruta pública devuelta por el backend
                link.download = 'codigos_barras.pdf';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                location.reload();
            } else {
                alert('Error al generar el PDF.');
            }
        })
        .catch(error => {
            console.error('Error al generar el PDF:', error);
            alert('Hubo un error al generar el PDF.');
        });
    });



    // Cargar productos al cargar la página
    cargarTodosLosProductos();