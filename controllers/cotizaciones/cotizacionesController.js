const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

// Crear una cotización con tabla de productos
exports.crearCotizacion = async (req, res) => {
    try {
        const { cliente, productos } = req.body;

        // Validar que se haya recibido la información necesaria
        if (!cliente || !productos || productos.length === 0) {
            return res.status(400).send("Se requiere la información del cliente y al menos un producto.");
        }

        // Crear el PDF
        const fecha = new Date();
        const pdfPath = `cotizacion_${fecha.getTime()}.pdf`;
        const doc = new PDFDocument({ margin: 30 });

        doc.pipe(fs.createWriteStream(pdfPath));

        // Agregar el logo en la esquina superior izquierda
        const logoPath = path.join(__dirname, "../../public/img/logoColor.png");
        const logoWidth = 70; // Ancho del logo
        const logoHeight = 60; // Alto del logo
        doc.image(logoPath, 30, 30, { width: logoWidth, height: logoHeight });
        doc.moveDown();
        doc.moveDown();
        // Título
        doc.fontSize(18).text("Cotización", { align: "center" });
        doc.moveDown();

        // Información del cliente
        doc.fontSize(12).text("Información del Cliente:");
        doc.text(`Nombre: ${cliente.nombre}`);
        doc.text(`Teléfono: ${cliente.telefono}`);
        doc.text(`Correo: ${cliente.correo}`);
        doc.text(`Dirección: ${cliente.direccion}`);
        doc.moveDown();

        // Título de la tabla
        doc.text("Productos:");
        doc.moveDown();

        // Configuración inicial para la tabla
        const tableTop = doc.y; // Posición inicial de la tabla
        const columnWidths = [200, 70, 120, 120]; // Ancho de las columnas
        const startX = doc.page.margins.left;

        // Dibujar encabezados
        doc.fontSize(10).font("Helvetica-Bold");
        const headers = ["Producto", "Cantidad", "Precio Unitario", "Total"];
        headers.forEach((header, i) => {
            const align = i === 3 ? "right" : i === 0 ? "left" : "center"; // Alineación por columna
            doc.text(header, startX + columnWidths.slice(0, i).reduce((a, b) => a + b, 0), tableTop, {
                width: columnWidths[i],
                align,
            });
        });

        // Línea después del encabezado
        doc.moveTo(startX, tableTop + 15).lineTo(startX + columnWidths.reduce((a, b) => a + b, 0), tableTop + 15).stroke();
        doc.moveDown(1);

        // Dibujar filas de productos
        doc.font("Helvetica");
        let totalGeneral = 0;
        productos.forEach((producto, index) => {
            const y = tableTop + 25 + index * 20; // Espaciado entre filas

            // Agregar contenido a las columnas
            doc.text(producto.nombre, startX, y, { width: columnWidths[0], align: "left" });
            doc.text(producto.cantidad, startX + columnWidths[0], y, { width: columnWidths[1], align: "center" });
            doc.text(`$${producto.precio.toFixed(2)}`, startX + columnWidths[0] + columnWidths[1], y, {
                width: columnWidths[2],
                align: "center",
            });
            const totalProducto = producto.cantidad * producto.precio;
            doc.text(`$${totalProducto.toFixed(2)}`, startX + columnWidths[0] + columnWidths[1] + columnWidths[2], y, {
                width: columnWidths[3],
                align: "right",
            });

            totalGeneral += totalProducto;
        });

        // Línea después de la tabla
        const endTableY = tableTop + 25 + productos.length * 20;
        doc.moveTo(startX, endTableY).lineTo(startX + columnWidths.reduce((a, b) => a + b, 0), endTableY).stroke();

        // Total General en una misma línea
        const totalX = startX + columnWidths[0] + columnWidths[1] + columnWidths[2] + 10; // Mover más a la derecha
        doc.fontSize(12)
            .text("Total General:", totalX - 120, endTableY + 10, { align: "right", width: 100 })
            .text(`$${totalGeneral.toFixed(2)}`, totalX, endTableY + 10, { align: "right", width: 100 });

        // Texto centrado debajo de la tabla
        // Texto centrado debajo de la tabla
doc.moveDown(2);

// Línea principal en negrita y centrada
doc.font("Helvetica-Bold").fontSize(10).text(
    "Gracias por su compra, ¡vuelva pronto!!!!.",
     totalX - 400, endTableY +70,
    { align: "center", continued: false }
);

// Resto del texto, cada línea centrada individualmente
doc.moveDown();
doc.font("Helvetica").fontSize(8);
doc.text(
    "FACTURAS, PEDIDOS Y COTIZACIONES WHATSAPP 2283-53-25-68",
    { align: "center", continued: false }
);
doc.text(
    "\"Precio sujeto a cambios sin previo aviso.\"",
    { align: "center", continued: false }
);
doc.text(
    "\"Material sujeto a inventarios al momento de la confirmación.\"",
    { align: "center", continued: false }
);
doc.text(
    "\"Tiempo Entrega: 8 días después de la confirmación.\"",
    { align: "center", continued: false }
);
doc.text(
    "\"Forma de Pago: Contado.\"",
    { align: "center", continued: false }
);


        

        doc.end();

        // Enviar respuesta con el PDF generado
        res.status(201).send({
            message: "Cotización generada exitosamente",
            pdfPath,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error interno del servidor.");
    }
};
