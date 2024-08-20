// Importar los esquemas
const Categoria = require('../../schemas/productosSchema/complementosSchema/categoriaSchema');
const Departamento = require('../../schemas/productosSchema/complementosSchema/departamentoSchema');
const Grupo = require('../../schemas/productosSchema/complementosSchema/grupoSchema');
const Impuesto = require('../../schemas/productosSchema/complementosSchema/impuestoSchema');
const Linea = require('../../schemas/productosSchema/complementosSchema/lineaSchema');
const Marca = require('../../schemas/productosSchema/complementosSchema/marcaSchema');
const Proveedor = require('../../schemas/productosSchema/complementosSchema/proveedorSchema');
const Unidad = require('../../schemas/productosSchema/complementosSchema/unidadSchema');
const Tipo = require('../../schemas/productosSchema/complementosSchema/tipoProductoSchema');

// GET: Obtener todos los registros de los esquemas en un solo JSON
exports.getAllRecords = async (req, res) => {
    try {
        const [categorias, departamentos, grupos, impuestos, lineas, marcas, proveedores, unidades, tipos] = await Promise.all([
            Categoria.find(),
            Departamento.find(),
            Grupo.find(),
            Impuesto.find(),
            Linea.find(),
            Marca.find(),
            Proveedor.find(),
            Unidad.find(),
            Tipo.find()

        ]);

        res.status(200).json({
            categorias,
            departamentos,
            grupos,
            impuestos,
            lineas,
            marcas,
            proveedores,
            unidades,
            tipos
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
