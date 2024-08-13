const urlGetSucursales = base + '/api/sucursal';
const urlGetFunctions = base + '/api/functions';

const modalUser = new mdb.Modal(document.getElementById('ModalAddUser'))


btnAddUser.addEventListener('click', ()=>{
    modalUser.show()
})

getSucursales()

function getSucursales(){
    fetch(urlGetSucursales)
    .then(response => response.json())
    .then(data => {
        cargarSucursales(data);
    })
    .catch(error => console.log(error));
}
function cargarSucursales(data) {
    let sucursales = '<option selected>Seleccione una opción</option>';
    data.forEach((item, index) => {
        sucursales += `
            <option value="${index + 1}">${item.clave}: ${item.nombre}</option>
        `;
    });
    document.getElementById('sucursales').innerHTML = sucursales;
}

getFunctions()

function getFunctions(){
    fetch(urlGetFunctions)
    .then(response => response.json())
    .then(data => {
        cargarRoles(data);
    })
    .catch(error => console.log(error));
}
function cargarRoles(data) {
    console.log(data)
    let roles = '<option selected>Seleccione una opción</option>';
    data.forEach((item, index) => {
        roles += `
            <option id="${item._id}:" value="${index + 1}">${item.nameRol}</option>
        `;
    });
    document.getElementById('roles').innerHTML = roles;
}
