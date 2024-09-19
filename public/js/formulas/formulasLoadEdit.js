let productosEdit = [];
let selectedProductIdEdit = null;
let selectedIndexEdit = -1;

cargarProductosEdit();

function cargarProductosEdit() {
    fetch('/api/productos')
        .then(response => response.json())
        .then(data => {
            productosEdit = data.products;
        })
        .catch(error => console.error('Error al cargar productos:', error));
}

document.getElementById('productoEdit').addEventListener('input', function() {
    const query = this.value.toLowerCase();
    const listaProductosEdit = document.getElementById('listaProductosEdit');
    listaProductosEdit.innerHTML = '';
    selectedIndexEdit = -1;
    if (query) {
        const filteredProducts = productosEdit.filter(product =>
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
                    seleccionarProductoEdit(product._id, product.name);
                });
                listaProductosEdit.appendChild(item);
            });
            listaProductosEdit.style.display = 'block';
        } else {
            listaProductosEdit.style.display = 'none';
        }
    } else {
        listaProductosEdit.style.display = 'none';
    }
});

document.getElementById('productoEdit').addEventListener('keydown', function(event) {
    const listaProductosEdit = document.getElementById('listaProductosEdit');
    const items = listaProductosEdit.getElementsByClassName('list-group-item');

    if (event.key === 'ArrowDown') {
        if (selectedIndexEdit < items.length - 1) {
            selectedIndexEdit++;
            actualizarSeleccionEdit();
        }
        event.preventDefault();
    } else if (event.key === 'ArrowUp') {
        if (selectedIndexEdit > 0) {
            selectedIndexEdit--;
            actualizarSeleccionEdit();
        }
        event.preventDefault();
    } else if (event.key === 'Enter') {
        if (selectedIndexEdit > -1 && selectedIndexEdit < items.length) {
            seleccionarProductoEdit(items[selectedIndexEdit].dataset.id, items[selectedIndexEdit].textContent);
        }
        event.preventDefault();
    }
});

function actualizarSeleccionEdit() {
    const listaProductosEdit = document.getElementById('listaProductosEdit');
    const items = listaProductosEdit.getElementsByClassName('list-group-item');
    Array.from(items).forEach(item => item.classList.remove('active'));
    if (selectedIndexEdit > -1 && selectedIndexEdit < items.length) {
        items[selectedIndexEdit].classList.add('active');
    }
}

function seleccionarProductoEdit(id, name) {
    document.getElementById('productoEdit').value = name;
    selectedProductIdEdit = id;
    document.getElementById('listaProductosEdit').style.display = 'none';
    // Aquí puedes hacer algo con el id del producto seleccionado para la edición
}

// Ocultar la lista de sugerencias cuando el usuario haga clic fuera del input o la lista
document.addEventListener('click', function(event) {
    const listaProductosEdit = document.getElementById('listaProductosEdit');
    if (!document.getElementById('productoEdit').contains(event.target) &&
        !listaProductosEdit.contains(event.target)) {
        listaProductosEdit.style.display = 'none';
    }
});
