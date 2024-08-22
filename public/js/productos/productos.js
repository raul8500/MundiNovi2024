const urlGetComplementos ='/api/complementos';


const modalProductos = new mdb.Modal(document.getElementById('ModalAddProducto'));
const pills = [
  'ex1-tab-1', 'ex1-tab-2', 'ex1-tab-3', 'ex1-tab-4',
  'ex1-tab-5', 'ex1-tab-6', 'ex1-tab-7', 'ex1-tab-8'
];
const contents = [
  'ex1-pills-1', 'ex1-pills-2', 'ex1-pills-3', 'ex1-pills-4',
  'ex1-pills-5', 'ex1-pills-6', 'ex1-pills-7', 'ex1-pills-8'
];

cargarUsuarios()

function cargarUsuarios() {
  fetch(urlGetComplementos)
    .then((response) => response.json())
    .then((data) => {
      complementos = data;
      mostrar(complementos.categorias, 'categoria');
      mostrar(complementos.departamentos, 'departamento');
      mostrar(complementos.grupos, 'grupo');
      mostrar(complementos.impuestos, 'impuesto');
      mostrar(complementos.lineas, 'linea');
      mostrar(complementos.marcas, 'marca');
      mostrar(complementos.unidades, 'unidad');
      mostrar(complementos.tipos, 'tipoProductoSelect');

    })
    .catch((error) => console.log(error));
}

function mostrar(data, componente) {
  let select = '<option value="0" selected>Seleccione una opción</option>';
  data.forEach((item) => {
    select += `
            <option value="${item._id}"><b>${item.clave}</b>: ${item.nombre}</option>

        `;
  });
  document.getElementById(componente).innerHTML = select;
}

function obtenerSeleccion(componente) {
  const selectElement = document.getElementById(componente);
  if (selectElement) {
      return selectElement.value;
  }
  return null; // Devuelve null si el elemento no se encuentra
}

btnGuardarProducto.addEventListener('click', () => {
  console.log(obtenerSeleccion('categoria'))
});

//Add user
btnAddProducto.addEventListener('click', () => {
  let componentes = ['claveProducto', 'claveAlterna', 'codigoBarra', 'nombreProducto', 'claveSAT', 'codigoBarraAlterno', 'observaciones',
    'tiempoSurtido', 'controlAlmacen', 'volumen', 'peso', 'stockMinimo', 'stockMaximo', 'costo', 'ultimoCosto', 'costoPromedio', 'numeroPrecioMinimo',
    'numeroPrecioMaximo', 'presentacion', 'porcentajePrecio1', 'precio1', 'porcentajePrecio2', 'precio2', 'porcentajePrecio3', 'precio3', 'porcentajePrecio4',
    'precio4', 'porcentajePrecio5', 'precio5', 'porcentajePrecio6', 'precio6', 'porcentajePrecio7', 'precio7', 'porcentajePrecio8', 'precio8', 'porcentajePrecio9',
    'precio9', 'porcentajePrecio10', 'precio10', 'imagen', 'busquedaProveedor', 'busquedaProducto', 'cantidadProductoKit', 'cantidadProductoGrupo', 'cantidadProductoComplementario',
    'busquedaProductoComplementario', 'busquedaProductoGrupo', 'busquedaProductoKit']
  document.getElementById('proveedoresSeleccionados').innerHTML = ''
  document.getElementById('productosSeleccionados').innerHTML = ''
  document.getElementById('productosKitSeleccionados').innerHTML = ''
  document.getElementById('productosGrupoSeleccionados').innerHTML = '' 
  document.getElementById('productosComplementariosSeleccionados').innerHTML = '' 
  document.getElementById('productoKitVisibility').style.visibility = 'hidden';
  document.getElementById('productoGrupoVisibility').style.visibility = 'hidden';
  asignarValorVacio(componentes)
  desmarcarInputs()
  activateFirstPill(pills, contents)
  

  modalProductos.show();
});

function desmarcarInputs() {
  document.querySelectorAll('input[type="radio"]').forEach(input => {
      input.checked = false;
  });

  document.querySelectorAll('input[type="checkbox"]').forEach(input => {
      input.checked = false;
  });
}

function  asignarValorVacio(componentes) {
  componentes.forEach(id => {
    const selectElement = document.getElementById(id);
    if (selectElement) {
      // Establece el valor vacío en el select
      selectElement.value = ""; 
    }
  });
}

function activateFirstPill(pills, contents) {
  pills.forEach((pillId, index) => {
    const pill = document.getElementById(pillId);
    const content = document.getElementById(contents[index]);

    if (index === 0) {
      pill.classList.add('active');
      content.classList.add('show', 'active');
    } else {
      pill.classList.remove('active');
      content.classList.remove('show', 'active');
    }
  });
}

function togglePillsVisibility() {
  const esKit = document.getElementById('esKit').checked;
  const esProducto = document.getElementById('esProducto').checked;

  const pillKit = document.getElementById('ex1-tab-6').parentElement;
  const pillProducto = document.getElementById('ex1-tab-7').parentElement;

  // Controlar la visibilidad de la pill 6 (Productos del kit)
  pillKit.style.visibility = esKit ? 'visible' : 'hidden';

  // Controlar la visibilidad de la pill 7 (Productos del grupo)
  pillProducto.style.visibility = esProducto ? 'visible' : 'hidden';
}

// Asignar la función a los eventos change de los checkboxes
document.getElementById('esKit').addEventListener('change', togglePillsVisibility);
document.getElementById('esProducto').addEventListener('change', togglePillsVisibility);

togglePillsVisibility();


