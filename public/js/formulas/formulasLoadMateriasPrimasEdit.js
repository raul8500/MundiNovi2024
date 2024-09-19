let materiasPrimasEdit = [];
let materiasPrimasSeleccionadasEdit = [];
let totalCostoEdit = 0;

cargarMateriasPrimasEdit();

function cargarMateriasPrimasEdit() {
    fetch('/api/materiasPrimas')
        .then(response => response.json())
        .then(data => {
            materiasPrimasEdit = data;
        })
        .catch(error => console.error('Error al cargar materias primas:', error));
}

// Mostrar sugerencias mientras el usuario escribe en el input de edición
document.getElementById('materiasPrimasEdit').addEventListener('input', function() {
    const query = this.value.toLowerCase();
    if (query.trim() === '') {
        document.getElementById('listaMateriasPrimasEdit').style.display = 'none'; // Oculta la lista si el input está vacío
        return;
    }

    const sugerencias = materiasPrimasEdit.filter(materia => 
        materia.nombre.toLowerCase().includes(query) || materia.clave.toLowerCase().includes(query)
    );
    mostrarSugerenciasEdit(sugerencias);
});

// Mostrar la lista de sugerencias para el formulario de edición
function mostrarSugerenciasEdit(sugerencias) {
    const lista = document.getElementById('listaMateriasPrimasEdit');
    lista.innerHTML = ''; // Limpia la lista antes de agregar nuevas sugerencias

    if (sugerencias.length > 0) {
        lista.style.display = 'block'; // Muestra la lista

        sugerencias.forEach(materiaPrima => {
            const item = document.createElement('li');
            item.classList.add('list-group-item');
            item.textContent = `${materiaPrima.clave} - ${materiaPrima.nombre}`;

            // Evento click para seleccionar el elemento
            item.addEventListener('click', () => {
                seleccionarMateriaPrimaEdit(materiaPrima);
            });

            lista.appendChild(item);
        });

        selectedIndexFormulas = -1; // Reinicia la selección al cargar nuevas sugerencias
    } else {
        lista.style.display = 'none'; // Oculta la lista si no hay sugerencias
    }
}

// Seleccionar una materia prima en el formulario de edición
function seleccionarMateriaPrimaEdit(materiaPrima) {
    const cantidad = parseFloat(document.getElementById('materiasPrimasCantidadEdit').value);
    if (!cantidad || cantidad <= 0) {
        alert('Por favor, introduce una cantidad válida.');
        return;
    }
    agregarMateriaPrimaEdit(materiaPrima, cantidad);
    document.getElementById('materiasPrimasEdit').value = '';
    document.getElementById('listaMateriasPrimasEdit').style.display = 'none'; // Oculta la lista después de seleccionar
}

// Agregar materia prima seleccionada a la tabla y calcular el total en el formulario de edición
function agregarMateriaPrimaEdit(materiaPrima, cantidad) {
    const costo = materiaPrima.datosFinancieros.costo || 0; // Asegúrate de que 'costo' esté disponible en 'materiaPrima'
    const importe = cantidad * costo;

    // Agregar al arreglo de materias primas seleccionadas
    materiasPrimasSeleccionadasEdit.push({ 
        _id: materiaPrima._id, 
        nombre: materiaPrima.nombre, 
        cantidad: cantidad, 
        costo: costo,
        importe: importe
    });

    totalCostoEdit += importe;
    actualizarTablaEdit();
    actualizarTotalEdit();

    document.getElementById('materiasPrimasCantidadEdit').value = '';
    document.getElementById('materiasPrimasCantidadEdit').focus();
}

// Actualizar la tabla de materias primas seleccionadas en el formulario de edición
function actualizarTablaEdit() {
    const tableBody = document.getElementById('materiasPrimasTableBodyEdit');
    tableBody.innerHTML = ''; // Limpia la tabla antes de agregar nuevas filas

    materiasPrimasSeleccionadasEdit.forEach(materia => {
        const fila = `
            <tr>
                <td>${materia.nombre}</td>
                <td>${materia.cantidad}</td>
                <td>${materia.costo.toFixed(2)}</td>
                <td>${materia.importe.toFixed(2)}</td>
                <td><button class="btn btn-danger" onclick="eliminarMateriaPrimaEdit('${materia._id}')">Eliminar</button></td>
            </tr>
        `;
        tableBody.insertAdjacentHTML('beforeend', fila);
    });
}


function actualizarTotalEdit() {
    document.getElementById('materiasPrimasTotalEdit').value = totalCostoEdit.toFixed(2);
}


// Eliminar una materia prima de la tabla en el formulario de edición
function eliminarMateriaPrimaEdit(id) {
    console.log("Eliminando materia prima con ID:", id); // Verifica si se llama correctamente
    const materiaIndex = materiasPrimasSeleccionadasEdit.findIndex(materia => materia._id === id);
    if (materiaIndex !== -1) {
        totalCostoEdit -= materiasPrimasSeleccionadasEdit[materiaIndex].importe;
        materiasPrimasSeleccionadasEdit.splice(materiaIndex, 1);
        actualizarTablaEdit();
        actualizarTotalEdit();
    } else {
        console.log("Materia prima no encontrada.");
    }
}


// Navegar por las sugerencias con las teclas de flecha en el formulario de edición
let selectedIndexFormulasEdit = -1;

document.getElementById('materiasPrimasEdit').addEventListener('keydown', function(e) {
    const items = document.querySelectorAll('#listaMateriasPrimasEdit li');
    
    if (e.key === 'ArrowDown') {
        // Navegar hacia abajo
        selectedIndexFormulasEdit = (selectedIndexFormulasEdit + 1) % items.length;
        seleccionarElementoEdit(items); // Aplica la clase seleccionado
    } else if (e.key === 'ArrowUp') {
        // Navegar hacia arriba
        selectedIndexFormulasEdit = (selectedIndexFormulasEdit - 1 + items.length) % items.length;
        seleccionarElementoEdit(items); // Aplica la clase seleccionado
    } else if (e.key === 'Enter') {
        // Seleccionar el elemento resaltado
        if (selectedIndexFormulasEdit > -1) {
            items[selectedIndexFormulasEdit].click(); // Ejecuta la selección con un clic programático
        }
    }
});

// Aplicar el estilo de selección al elemento actual en el formulario de edición
function seleccionarElementoEdit(items) {
    items.forEach(item => item.classList.remove('seleccionado')); // Remueve el estilo de selección de todos los elementos
    if (selectedIndexFormulasEdit >= 0 && items[selectedIndexFormulasEdit]) {
        items[selectedIndexFormulasEdit].classList.add('seleccionado'); // Aplica el estilo de selección al elemento actual
        items[selectedIndexFormulasEdit].scrollIntoView({ block: 'nearest' }); // Asegura que el elemento seleccionado esté visible
    }
}

function cargarMateriasPrimasEnTablaEdit(materiasPrimas) {
    // Resetear los valores
    materiasPrimasSeleccionadasEdit = [];
    totalCostoEdit = 0;

    // Iterar sobre las materias primas recibidas y agregarlas a la tabla
    materiasPrimas.forEach(materiaPrima => {
        const cantidad = materiaPrima.cantidad || 0;
        const costo = materiaPrima._id.datosFinancieros ? materiaPrima._id.datosFinancieros.costo : 0; // Asegúrate de acceder correctamente
        const importe = cantidad * costo;

        // Agregar al arreglo de materias primas seleccionadas
        materiasPrimasSeleccionadasEdit.push({
            _id: materiaPrima._id._id,
            nombre: materiaPrima._id.nombre, // Corrige el acceso aquí
            cantidad: cantidad,
            costo: costo,
            importe: importe
        });

        totalCostoEdit += importe;
    });

    // Actualizar la tabla y el total
    actualizarTablaEdit();
    actualizarTotalEdit();
}


