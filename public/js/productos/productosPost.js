
const modalProducto = new mdb.Modal(document.getElementById('ModalAddProducto'));


btnAddProducto.addEventListener('click', () => {
    modalProducto.show();
});

btnGuardarProducto.addEventListener('click', () => {
    validaciones()
});


function validaciones() {
    // Obtener los valores de los campos
    const claveProducto = document.getElementById('claveProducto').value;
    const nombreProducto = document.getElementById('nombreProducto').value;
    const descripcionProducto = document.getElementById('descripcionProducto').value;
    const esKit = document.getElementById('esKit').checked;
    const esGrupo = document.getElementById('esGrupo').checked;
    const grupo = document.getElementById('grupo').value;
    const marca = document.getElementById('marca').value;
    const linea = document.getElementById('linea').value;
    const departamento = document.getElementById('departamento').value;
    const tiempoSurtido = document.getElementById('tiempoSurtido').value;
    const controlAlmacen = document.getElementById('controlAlmacen').value;
    const volumen = document.getElementById('volumen').value;
    const peso = document.getElementById('peso').value;
    const costo = document.getElementById('costo').value;
    const ultimoCosto = document.getElementById('ultimoCosto').value;
    const costoPromedio = document.getElementById('costoPromedio').value;
    const unidadEmpaque = document.getElementById('unidadEmpaque').value;
    const precio1 = document.getElementById('precio1').value;
    const precio2 = document.getElementById('precio2').value;
    const precio3 = document.getElementById('precio3').value;
    const precio4 = document.getElementById('precio4').value;
    const precio5 = document.getElementById('precio5').value;
    const precio6 = document.getElementById('precio6').value;
    const precio7 = document.getElementById('precio7').value;
    const precio8 = document.getElementById('precio8').value;
    const precio9 = document.getElementById('precio9').value;
    const precio10 = document.getElementById('precio10').value;
    const porcentajePrecio1 = document.getElementById('porcentajePrecio1').value;
    const porcentajePrecio2 = document.getElementById('porcentajePrecio2').value;
    const porcentajePrecio3 = document.getElementById('porcentajePrecio3').value;
    const porcentajePrecio4 = document.getElementById('porcentajePrecio4').value;
    const porcentajePrecio5 = document.getElementById('porcentajePrecio5').value;
    const porcentajePrecio6 = document.getElementById('porcentajePrecio6').value;
    const porcentajePrecio7 = document.getElementById('porcentajePrecio7').value;
    const porcentajePrecio8 = document.getElementById('porcentajePrecio8').value;
    const porcentajePrecio9 = document.getElementById('porcentajePrecio9').value;
    const porcentajePrecio10 = document.getElementById('porcentajePrecio10').value;
    const rangoInicial1 = document.getElementById('rangoInicial1').value;
    const rangoFinal1 = document.getElementById('rangoFinal1').value;
    const rangoInicial2 = document.getElementById('rangoInicial2').value;
    const rangoFinal2 = document.getElementById('rangoFinal2').value;
    const rangoInicial3 = document.getElementById('rangoInicial3').value;
    const rangoFinal3 = document.getElementById('rangoFinal3').value;
    const rangoInicial4 = document.getElementById('rangoInicial4').value;
    const rangoFinal4 = document.getElementById('rangoFinal4').value;
    const rangoInicial5 = document.getElementById('rangoInicial5').value;
    const rangoFinal5 = document.getElementById('rangoFinal5').value;
    const rangoInicial6 = document.getElementById('rangoInicial6').value;
    const rangoFinal6 = document.getElementById('rangoFinal6').value;
    const rangoInicial7 = document.getElementById('rangoInicial7').value;
    const rangoFinal7 = document.getElementById('rangoFinal7').value;
    const rangoInicial8 = document.getElementById('rangoInicial8').value;
    const rangoFinal8 = document.getElementById('rangoFinal8').value;
    const rangoInicial9 = document.getElementById('rangoInicial9').value;
    const rangoFinal9 = document.getElementById('rangoFinal9').value;
    const rangoInicial10 = document.getElementById('rangoInicial10').value;
    const rangoFinal10 = document.getElementById('rangoFinal10').value;

    // Crear un objeto con los valores obtenidos
    const datosProducto = {
        type: 'product',
        reference : claveProducto,
        esActivo: false,
        codigoBarra: "",
        name: nombreProducto,
        productKey: "47131700",
        descripcion: descripcionProducto,
        inventory: {
                unit: "pieza"
        },
        tiempoSurtido,
        controlAlmacen,
        volumen,
        peso,
        datosFinancieros: {
            costo,
            ultimoCosto,
            costoPromedio,
            unidadEmpaque,
            precio1,
            precio2,
            precio3,
            precio4,
            precio5,
            precio6,
            precio7,
            precio8,
            precio9,
            precio10,
            porcentajePrecio1,
            porcentajePrecio2,
            porcentajePrecio3,
            porcentajePrecio4,
            porcentajePrecio5,
            porcentajePrecio6,
            porcentajePrecio7,
            porcentajePrecio8,
            porcentajePrecio9,
            porcentajePrecio10,
            rangoInicial1,
            rangoFinal1,
            rangoInicial2,
            rangoFinal2,
            rangoInicial3,
            rangoFinal3,
            rangoInicial4,
            rangoFinal4,
            rangoInicial5,
            rangoFinal5,
            rangoInicial6,
            rangoFinal6,
            rangoInicial7,
            rangoFinal7,
            rangoInicial8,
            rangoFinal8,
            rangoInicial9,
            rangoFinal9,
            rangoInicial10,
            rangoFinal10
        },
        price: [
            {
                idPriceList: 1,
                price: 120.00
            }
        ],
        linea,
        departamento,
        marca,
        grupo,
        tax: [
            {
            id: "1",
            name: "IVA",
            percentage: "16",
            status: "active",
            type: "general"
            }
        ],
        esKit,
        esGrupo,
        esVisible: true,
        kitProducto : productosKitTotales,
        GrupoProducto : null
    };

    // Convertir el objeto a JSON
    const jsonData = JSON.stringify(datosProducto, null, 2); // La opción `null, 2` es para dar formato a la salida JSON

    // Imprimir el JSON en la consola
    console.log(jsonData);
}
