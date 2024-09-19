let productos = [];
let selectedProductId = null;
let selectedIndex = -1;

cargarProductos();

function cargarProductos() {
    fetch('/api/productos')
        .then(response => response.json())
        .then(data => {
            productos = data.products;
        })
        .catch(error => console.error('Error al cargar productos:', error));
}

document.getElementById('producto').addEventListener('input', function() {
    const query = this.value.toLowerCase();
    const listaProductos = document.getElementById('listaProductos');
    listaProductos.innerHTML = '';
    selectedIndex = -1;
    if (query) {
        const filteredProducts = productos.filter(product =>
            product.name.toLowerCase().includes(query) ||
            product.reference.toLowerCase().includes(query)
        );
        if (filteredProducts.length > 0) {
            filteredProducts.forEach((product, index) => {
                const item = document.createElement('li');
                item.classList.add('list-group-item');
                item.textContent = `${product.name} (${product.reference})`;
                item.dataset.id = product._id;
                item.addEventListener('click', function() {
                    seleccionarProducto(product._id, product.name);
                });
                listaProductos.appendChild(item);
            });
            listaProductos.style.display = 'block';
        } else {
            listaProductos.style.display = 'none';
        }
    } else {
        listaProductos.style.display = 'none';
    }
});

document.getElementById('producto').addEventListener('keydown', function(event) {
    const listaProductos = document.getElementById('listaProductos');
    const items = listaProductos.getElementsByClassName('list-group-item');

    if (event.key === 'ArrowDown') {
        if (selectedIndex < items.length - 1) {
            selectedIndex++;
            actualizarSeleccion();
        }
        event.preventDefault();
    } else if (event.key === 'ArrowUp') {
        if (selectedIndex > 0) {
            selectedIndex--;
            actualizarSeleccion();
        }
        event.preventDefault();
    } else if (event.key === 'Enter') {
        if (selectedIndex > -1 && selectedIndex < items.length) {
            seleccionarProducto(items[selectedIndex].dataset.id, items[selectedIndex].textContent);
        }
        event.preventDefault();
    }
});

function actualizarSeleccion() {
    const listaProductos = document.getElementById('listaProductos');
    const items = listaProductos.getElementsByClassName('list-group-item');
    Array.from(items).forEach(item => item.classList.remove('active'));
    if (selectedIndex > -1 && selectedIndex < items.length) {
        items[selectedIndex].classList.add('active');
    }
}

function seleccionarProducto(id, name) {
    document.getElementById('producto').value = name;
    selectedProductId = id;
    document.getElementById('listaProductos').style.display = 'none';
    // Aquí puedes hacer algo con el id del producto seleccionado
}

// Ocultar la lista de sugerencias cuando el usuario haga clic fuera del input o la lista
document.addEventListener('click', function(event) {
    const listaProductos = document.getElementById('listaProductos');
    if (!document.getElementById('producto').contains(event.target) &&
        !listaProductos.contains(event.target)) {
        listaProductos.style.display = 'none';
    }
});
