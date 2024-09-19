let materiasPrimas = [];
let materiasPrimasSeleccionadas = [];
let totalCosto = 0;

cargarMateriasPrimas();

function cargarMateriasPrimas() {
    fetch('/api/materiasPrimas')
        .then(response => response.json())
        .then(data => {
            materiasPrimas = data;
        })
        .catch(error => console.error('Error al cargar materias primas:', error));
}

// Mostrar sugerencias mientras el usuario escribe
document.getElementById('materiasPrimasInput').addEventListener('input', function() {
    const query = this.value.toLowerCase();
    if (query.trim() === '') {
        document.getElementById('listaMateriasPrimas').style.display = 'none'; // Oculta la lista si el input está vacío
        return;
    }

    const sugerencias = materiasPrimas.filter(materia => 
        materia.nombre.toLowerCase().includes(query) || materia.clave.toLowerCase().includes(query)
    );
    mostrarSugerencias(sugerencias);
});

// Mostrar la lista de sugerencias
function mostrarSugerencias(sugerencias) {
    const lista = document.getElementById('listaMateriasPrimas');
    lista.innerHTML = ''; // Limpia la lista antes de agregar nuevas sugerencias

    if (sugerencias.length > 0) {
        lista.style.display = 'block'; // Muestra la lista

        sugerencias.forEach((materiaPrima, index) => {
            const item = document.createElement('li');
            item.classList.add('list-group-item');
            item.textContent = `${materiaPrima.clave} - ${materiaPrima.nombre}`;

            // Evento click para seleccionar el elemento
            item.addEventListener('click', () => {
                seleccionarMateriaPrima(materiaPrima);
            });

            lista.appendChild(item);
        });

        // Reinicia la selección al cargar nuevas sugerencias
        selectedIndexFormulas = -1;
    } else {
        lista.style.display = 'none'; // Oculta la lista si no hay sugerencias
    }
}


// Seleccionar una materia prima y agregarla a la tabla
function seleccionarMateriaPrima(materiaPrima) {
    const cantidad = parseFloat(document.getElementById('materiasPrimasCantidad').value);
    if (!cantidad || cantidad <= 0) {
        alert('Por favor, introduce una cantidad válida.');
        return;
    }
    agregarMateriaPrima(materiaPrima, cantidad);
    document.getElementById('materiasPrimasInput').value = '';
    document.getElementById('listaMateriasPrimas').style.display = 'none'; // Oculta la lista después de seleccionar
}

// Agregar materia prima seleccionada a la tabla y calcular el total
function agregarMateriaPrima(materiaPrima, cantidad) {
    const costo = materiaPrima.datosFinancieros.costo || 0; // Asegúrate de que 'costo' esté disponible en 'materiaPrima'
    const importe = cantidad * costo;

    // Agregar al arreglo de materias primas seleccionadas
    materiasPrimasSeleccionadas.push({ 
        _id: materiaPrima._id, 
        nombre: materiaPrima.nombre, 
        cantidad: cantidad, 
        costo: costo,
        importe: importe
    });

    totalCosto += importe;
    actualizarTabla();
    actualizarTotal();

    document.getElementById('materiasPrimasCantidad').value = ''
    document.getElementById('materiasPrimasCantidad').focus()
}

// Actualizar la tabla de materias primas seleccionadas
function actualizarTabla() {
    const tableBody = document.getElementById('materiasPrimasTableBody');
    tableBody.innerHTML = '';

    materiasPrimasSeleccionadas.forEach(materia => {
        const fila = `
            <tr>
                <td>${materia.nombre}</td>
                <td>${materia.cantidad}</td>
                <td>${materia.costo.toFixed(2)}</td>
                <td>${materia.importe.toFixed(2)}</td>
                <td><button class="btn btn-danger" onclick="eliminarMateriaPrima('${materia._id}')">Eliminar</button></td>
            </tr>
        `;
        tableBody.insertAdjacentHTML('beforeend', fila);
    });
}

// Eliminar una materia prima de la tabla
function eliminarMateriaPrima(id) {
    const materiaIndex = materiasPrimasSeleccionadas.findIndex(materia => materia._id === id);
    if (materiaIndex !== -1) {
        totalCosto -= materiasPrimasSeleccionadas[materiaIndex].importe;
        materiasPrimasSeleccionadas.splice(materiaIndex, 1);
        actualizarTabla();
        actualizarTotal();
    }
}

// Actualizar el total en la pantalla
function actualizarTotal() {
    document.getElementById('materiasPrimasTotal').value = totalCosto.toFixed(2);
}

// Navegar por las sugerencias con las teclas de flecha
let selectedIndexFormulas = -1;

document.getElementById('materiasPrimasInput').addEventListener('keydown', function(e) {
    const items = document.querySelectorAll('#listaMateriasPrimas li');
    
    if (e.key === 'ArrowDown') {
        // Navegar hacia abajo
        selectedIndexFormulas = (selectedIndexFormulas + 1) % items.length;
        seleccionarElemento(items); // Aplica la clase seleccionado
    } else if (e.key === 'ArrowUp') {
        // Navegar hacia arriba
        selectedIndexFormulas = (selectedIndexFormulas - 1 + items.length) % items.length;
        seleccionarElemento(items); // Aplica la clase seleccionado
    } else if (e.key === 'Enter') {
        // Seleccionar el elemento resaltado
        if (selectedIndexFormulas > -1) {
            items[selectedIndexFormulas].click(); // Ejecuta la selección con un clic programático
        }
    }
});



function seleccionarElemento(items) {
    items.forEach(item => item.classList.remove('seleccionado')); // Remueve el estilo de selección de todos los elementos
    if (selectedIndexFormulas >= 0 && items[selectedIndexFormulas]) {
        items[selectedIndexFormulas].classList.add('seleccionado'); // Aplica el estilo de selección al elemento actual
        items[selectedIndexFormulas].scrollIntoView({ block: 'nearest' }); // Asegura que el elemento seleccionado esté visible
    }
}



