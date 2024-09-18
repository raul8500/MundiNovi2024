const mongoose = require('mongoose');

const materiaPrimaSchema = new mongoose.Schema({
    clave: { type: String, required: false },
    codigoBarras: { type: String, required: false },
    nombre: { type: String, required: false },
    descripcion: { type: String, required: false },
    fechaAlta: { type: Date, required: false, default: Date.now },
    claveProductoSAT: { type: String, required: false },
    estado: { type: String, required: false },
    
    datosFinancieros: {
        tiempoSurtido: { type: Number, required: false },
        controlAlmacen: { type: String, required: false },
        volumen: { type: Number, required: false },
        peso: { type: Number, required: false },
        stockMinimo: { type: Number, required: false },
        stockMaximo: { type: Number, required: false },
        costo: { type: Number, required: false },
        ultimoCosto: { type: Number, required: false },
        costoPromedio: { type: Number, required: false },
        numeroPrecioMinimo: { type: Number, required: false },
        numeroPrecioMaximo: { type: Number, required: false },
        presentacion: { type: String, required: false },
        
        // Precios
        precio1: { type: Number, required: false },
        precio2: { type: Number, required: false },
        precio3: { type: Number, required: false },
        precio4: { type: Number, required: false },
        precio5: { type: Number, required: false },
        precio6: { type: Number, required: false },
        precio7: { type: Number, required: false },
        precio8: { type: Number, required: false },
        precio9: { type: Number, required: false },
        precio10: { type: Number, required: false },

        // Porcentajes
        porcentajePrecio1: { type: Number, required: false },
        porcentajePrecio2: { type: Number, required: false },
        porcentajePrecio3: { type: Number, required: false },
        porcentajePrecio4: { type: Number, required: false },
        porcentajePrecio5: { type: Number, required: false },
        porcentajePrecio6: { type: Number, required: false },
        porcentajePrecio7: { type: Number, required: false },
        porcentajePrecio8: { type: Number, required: false },
        porcentajePrecio9: { type: Number, required: false },
        porcentajePrecio10: { type: Number, required: false },

        // Rangos
        rangoInicial1: { type: Number, required: false },
        rangoInicial2: { type: Number, required: false },
        rangoInicial3: { type: Number, required: false },
        rangoInicial4: { type: Number, required: false },
        rangoInicial5: { type: Number, required: false },
        rangoInicial6: { type: Number, required: false },
        rangoInicial7: { type: Number, required: false },
        rangoInicial8: { type: Number, required: false },
        rangoInicial9: { type: Number, required: false },
        rangoInicial10: { type: Number, required: false },

        rangoFinal1: { type: Number, required: false },
        rangoFinal2: { type: Number, required: false },
        rangoFinal3: { type: Number, required: false },
        rangoFinal4: { type: Number, required: false },
        rangoFinal5: { type: Number, required: false },
        rangoFinal6: { type: Number, required: false },
        rangoFinal7: { type: Number, required: false },
        rangoFinal8: { type: Number, required: false },
        rangoFinal9: { type: Number, required: false },
        rangoFinal10: { type: Number, required: false }
    },

    proveedores: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Proveedor'
    }]
});

const MateriaPrima = mongoose.model('MateriaPrima', materiaPrimaSchema);
module.exports = MateriaPrima;
