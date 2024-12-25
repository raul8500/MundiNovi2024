const Cotizacion = require("../../schemas/cotizacionesSchema/cotizacionesSchema");

const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");

// Configurar el transportador de Nodemailer
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "mundinovi.dev@gmail.com", // Cambia esto por tu correo electrónico
        pass: "ueli etdv qbcm goyt", // Cambia esto por tu contraseña o usa una contraseña de aplicación
    },
});

const generatePDF = async (cotizacion) => {
    return new Promise((resolve, reject) => {
        try {
            const pdfPath = path.join(__dirname, "../../uploads", `cotizacion_${Date.now()}.pdf`);
            const doc = new PDFDocument({ margin: 30 });
            const writeStream = fs.createWriteStream(pdfPath);

            doc.pipe(writeStream);

            // Encabezado del PDF
            const logoPath = path.join(__dirname, "../../public/img/logoColor.png");
            doc.image(logoPath, 30, 30, { width: 70, height: 60 });

            doc.fontSize(18).text("Cotización", { align: "center" });
            doc.moveDown();

            // Información del Cliente y Sucursal
            doc.fontSize(12).font("Helvetica-Bold").text("Información del Cliente", 30, 100);
            doc.font("Helvetica").text(`Nombre: ${cotizacion.cliente.nombre}`, 30, 120);
            doc.text(`Teléfono: ${cotizacion.cliente.telefono}`, 30, 135);
            doc.text(`Correo: ${cotizacion.cliente.correo}`, 30, 150);
            doc.text(`Dirección: ${cotizacion.cliente.direccion}`, 30, 165);
            doc.moveDown();

            doc.font("Helvetica-Bold").text("Información de la Sucursal", 400, 100);
            doc.font("Helvetica").text(`Nombre: ${cotizacion.sucursal.nombre}`, 400, 120);
            doc.text(`Dirección: ${cotizacion.sucursal.direccion}`, 400, 135);
            doc.text(`Teléfono: ${cotizacion.sucursal.telefono}`, 400, 150);
            doc.moveDown();

            // Información del Usuario
            doc.font("Helvetica-Bold").text("Atendido por:", 30, 200);
            doc.font("Helvetica").text(`Nombre: ${cotizacion.usuario.nombre}`, 30, 215);
            doc.text(`Usuario: ${cotizacion.usuario.usuario}`, 30, 230);
            doc.text(`Folio: ${cotizacion.folio}`, 30, 245);
            doc.moveDown();

            // Tabla de Productos
            const tableTop = 280;
            const columnWidths = [150, 80, 60, 60, 60, 70];
            const headers = ["Producto", "Referencia", "Unidad", "Cant.", "Precio", "Total"];
            const startX = 40;

            // Dibujar encabezado de tabla
            doc.font("Helvetica-Bold").fontSize(10);
            headers.forEach((header, i) => {
                const align = (header === "Precio" || header === "Total") ? "right" : "center";
                doc.text(header, startX + columnWidths.slice(0, i).reduce((a, b) => a + b, 0), tableTop, {
                    width: columnWidths[i],
                    align: align,
                });
            });

            doc.moveTo(startX, tableTop + 15)
                .lineTo(startX + columnWidths.reduce((a, b) => a + b, 0), tableTop + 15)
                .stroke();

            // Dibujar filas de productos
            let currentY = tableTop + 20;

            cotizacion.productos.forEach((producto) => {
                doc.font("Helvetica").fontSize(9);
                doc.text(producto.nombre, startX, currentY, { width: columnWidths[0], align: "center" });
                doc.text(producto.reference, startX + columnWidths[0], currentY, { width: columnWidths[1], align: "center" });
                doc.text(producto.unidad || producto.id?.inventory?.unit || "-", startX + columnWidths.slice(0, 2).reduce((a, b) => a + b, 0), currentY, { width: columnWidths[2], align: "center" });
                doc.text(producto.cantidad.toString(), startX + columnWidths.slice(0, 3).reduce((a, b) => a + b, 0), currentY, { width: columnWidths[3], align: "center" });
                doc.text(`$${producto.precio.toFixed(2)}`, startX + columnWidths.slice(0, 4).reduce((a, b) => a + b, 0), currentY, { width: columnWidths[4], align: "right" });
                doc.text(`$${producto.total.toFixed(2)}`, startX + columnWidths.slice(0, 5).reduce((a, b) => a + b, 0), currentY, { width: columnWidths[5], align: "right" });

                currentY += 15;
            });

            // Total General
            doc.fontSize(12).font("Helvetica-Bold")
                .text(`Total General: $${cotizacion.totalGeneral.toFixed(2)}`, startX, currentY + 20, { align: "right" });

            doc.end();

            writeStream.on("finish", () => resolve(pdfPath));
            writeStream.on("error", (err) => reject(err));
        } catch (error) {
            reject(error);
        }
    });
};

// Función para enviar correo
async function sendCotizacionEmail(email, pdfPath, cliente, sucursal) {
    try {
        const mailOptions = {
            from: "mundinovi.dev@gmail.com",
            to: email,
            subject: "Cotización Generada",
            html: `
                <h1>Cotización</h1>
                <p>Hola ${cliente.nombre}, adjuntamos tu cotización generada.</p>
                <p>Sucursal: ${sucursal.nombre}</p>
            `,
            attachments: [
                {
                    filename: path.basename(pdfPath),
                    path: pdfPath,
                },
            ],
        };

        console.log("Enviando correo...");
        await transporter.sendMail(mailOptions);
        return { success: true, message: "Correo enviado correctamente" };
    } catch (error) {
        console.error("Error al enviar el correo:", error);
        return { success: false, message: "Error al enviar el correo" };
    }
}

// Crear Cotización
exports.crearCotizacion = async (req, res) => {
    try {
        const { cliente, productos, sucursal, usuario } = req.body;

        if (!cliente || !productos || productos.length === 0 || !sucursal || !usuario) {
            return res.status(400).send("Se requiere la información completa.");
        }

        const lastCotizacion = await Cotizacion.findOne().sort({ folio: -1 });
        const folio = lastCotizacion ? lastCotizacion.folio + 1 : 1000;

        let totalGeneral = 0;
        const productosConTotal = productos.map((producto) => {
            const totalProducto = producto.cantidad * producto.precio;
            totalGeneral += totalProducto;
            return { ...producto, total: totalProducto };
        });

        const nuevaCotizacion = new Cotizacion({
            folio,
            cliente,
            sucursal,
            productos: productosConTotal,
            totalGeneral,
            usuario,
        });

        await nuevaCotizacion.save();

        const pdfPath = await generatePDF({
            folio,
            cliente,
            sucursal,
            productos: productosConTotal,
            totalGeneral,
            usuario,
        });

        await sendCotizacionEmail(cliente.correo, pdfPath, cliente, sucursal);

        res.status(201).send({
            message: "Cotización creada y enviada por correo",
            pdfPath,
        });
    } catch (error) {
        console.error("Error al crear la cotización:", error);
        res.status(500).send("Error interno del servidor.");
    }
};

// Obtener todas las cotizaciones con el usuario que las creó
exports.getAllCotizaciones = async (req, res) => {
    try {
        const cotizaciones = await Cotizacion.find().populate("usuario");
        res.status(200).json(cotizaciones);
    } catch (error) {
        console.error("Error al obtener las cotizaciones:", error);
        res.status(500).send("Error interno del servidor.");
    }
};

// Obtener una cotización por ID con el usuario que la creó
exports.getCotizacionById = async (req, res) => {
    try {
        const { id } = req.params;

        // Buscar la cotización y hacer populate a los productos y usuario
        const cotizacion = await Cotizacion.findById(id)
            .populate("usuario") // Populate del usuario
            .populate({
                path: "productos.id", // Ruta para hacer populate de los productos
                model: "Product"    // Nombre del modelo asociado
            })
            .populate({
                path: "usuario.id", // Relacionar el usuario que creó la cotización
                model: "users"
            })
            .populate({
                path: "cliente.id", // Relacionar el usuario que creó la cotización
            })
            .populate({
                path: "sucursal.id", // Relacionar el usuario que creó la cotización
                model: "sucursal"
            })
            

        if (!cotizacion) {
            return res.status(404).send("Cotización no encontrada.");
        }

        res.status(200).json(cotizacion);
    } catch (error) {
        console.error("Error al obtener la cotización:", error);
        res.status(500).send("Error interno del servidor.");
    }
};

// Eliminar una cotización
exports.deleteCotizacion = async (req, res) => {
    try {
        const { id } = req.params;
        const cotizacion = await Cotizacion.findByIdAndDelete(id);

        if (!cotizacion) {
            return res.status(404).send("Cotización no encontrada.");
        }

        // Eliminar el archivo PDF asociado si existe
        if (fs.existsSync(cotizacion.pdfPath)) {
            fs.unlinkSync(cotizacion.pdfPath);
        }

        res.status(200).send("Cotización eliminada correctamente.");
    } catch (error) {
        console.error("Error al eliminar la cotización:", error);
        res.status(500).send("Error interno del servidor.");
    }
};

exports.imprimirCotizacion = async (req, res) => {
    try {
        const { id } = req.params;

        // Buscar la cotización por ID
        const cotizacion = await Cotizacion.findById(id);
        if (!cotizacion) {
            return res.status(404).json({ message: "Cotización no encontrada." });
        }

        // Configurar la respuesta para el PDF
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
            "Content-Disposition",
            `inline; filename=cotizacion_${cotizacion.folio}.pdf`
        );

        // Crear el PDF
        const doc = new PDFDocument({ margin: 30 });

        // Enlazar el PDF directamente al flujo de respuesta
        doc.pipe(res);

        // **Encabezado del PDF**
        const logoPath = path.join(__dirname, "../../public/img/logoColor.png");
        doc.image(logoPath, 30, 30, { width: 70, height: 60 });

        doc.fontSize(18).text("Cotización", { align: "center" });
        doc.moveDown();

        // **Información de la Sucursal**
        doc.fontSize(12).font("Helvetica-Bold").text("Sucursal:", 400, 90, { align: "right" });
        doc.font("Helvetica");
        doc.text(`Nombre: ${cotizacion.sucursal.nombre}`, 400, 105, { align: "right" });
        doc.text(`Dirección: ${cotizacion.sucursal.direccion}`, 300, 120, { align: "right" });
        doc.text(`Teléfono: ${cotizacion.sucursal.telefono}`, 400, 135, { align: "right" });

        // **Información del Cliente**
        doc.fontSize(12).font("Helvetica-Bold").text("Cliente:", 30, 120);
        doc.font("Helvetica");
        doc.text(`Nombre: ${cotizacion.cliente.nombre}`, 30, 135);
        doc.text(`Teléfono: ${cotizacion.cliente.telefono}`, 30, 150);
        doc.text(`Correo: ${cotizacion.cliente.correo}`, 30, 165);
        doc.text(`Dirección: ${cotizacion.cliente.direccion}`, 30, 180);
        doc.moveDown();

        // **Folio y Cotizado por**
        doc.fontSize(12).font("Helvetica-Bold").text(`Folio: ${cotizacion.folio}`, 30, 210);
        doc.text(`Cotizado por: ${cotizacion.usuario.nombre}`, 30, 225);
        doc.moveDown();

        // **Tabla de Productos**
        const tableTop = doc.y + 20;
        const columnWidths = [150, 80, 60, 60, 60, 70, 70]; // Ajustamos para agregar la columna de Unidad
        const headers = ["Producto", "Referencia", "Unidad", "Cant.", "Precio", "Total"];
        const startX = 40;

        doc.font("Helvetica-Bold").fontSize(10);
        headers.forEach((header, i) => {
            const align = (header === "Precio" || header === "Total") ? "right" : "center";
            doc.text(header, startX + columnWidths.slice(0, i).reduce((a, b) => a + b, 0), tableTop, {
                width: columnWidths[i],
                align: align,
            });
        });

        doc.moveTo(startX, tableTop + 15)
            .lineTo(startX + columnWidths.reduce((a, b) => a + b, 0), tableTop + 15)
            .stroke();

        let currentY = tableTop + 20;

        cotizacion.productos.forEach((producto) => {
            doc.font("Helvetica").fontSize(8);
            doc.text(producto.nombre, startX, currentY, { width: columnWidths[0], align: "center" });
            doc.text(producto.reference, startX + columnWidths[0], currentY, { width: columnWidths[1], align: "center" });
            doc.text(producto.unidad || producto.id?.inventory?.unit || "-", startX + columnWidths.slice(0, 2).reduce((a, b) => a + b, 0), currentY, { width: columnWidths[2], align: "center" });
            doc.text(producto.cantidad.toString(), startX + columnWidths.slice(0, 3).reduce((a, b) => a + b, 0), currentY, { width: columnWidths[3], align: "center" });
            doc.text(`$${producto.precio.toFixed(2)}`, startX + columnWidths.slice(0, 4).reduce((a, b) => a + b, 0), currentY, { width: columnWidths[4], align: "right" });
            doc.text(`$${producto.total.toFixed(2)}`, startX + columnWidths.slice(0, 5).reduce((a, b) => a + b, 0), currentY, { width: columnWidths[5], align: "right" });

            currentY += 12;
        });

        doc.moveTo(startX, currentY)
            .lineTo(startX + columnWidths.reduce((a, b) => a + b, 0), currentY)
            .stroke();

        const totalX = startX + columnWidths.slice(0, 4).reduce((a, b) => a + b, 0);
        doc.fontSize(12)
            .text("Total General:", totalX - 10, currentY + 10, { align: "right", width: 100 })
            .text(`$${cotizacion.totalGeneral.toFixed(2)}`, totalX + 100, currentY + 10, { align: "right", width: 100 });

        doc.moveDown(5);
        doc.font("Helvetica-Bold").fontSize(10).text(
            "Gracias por su compra, ¡vuelva pronto!",
            totalX - 325, currentY + 70,
            { align: "center", continued: false }
        );

        doc.font("Helvetica").fontSize(10);
        doc.text("FACTURAS, PEDIDOS Y COTIZACIONES WHATSAPP 2283-53-25-68", { align: "center" });
        doc.text("\"Precio sujeto a cambios sin previo aviso.\"", { align: "center" });
        doc.text("\"Material sujeto a inventarios al momento de la confirmación.\"", { align: "center" });
        doc.text("\"Tiempo Entrega: 8 días después de la confirmación.\"", { align: "center" });
        doc.text("\"Forma de Pago: Contado.\"", { align: "center" });

        // ✅ **Finalizar el PDF**
        doc.end();
    } catch (error) {
        console.error("Error al generar el PDF:", error);
        if (!res.headersSent) {
            res.status(500).json({ message: "Error interno del servidor." });
        }
    }
};

exports.reenviarCotizacion = async (req, res) => {
    try {
        const { id } = req.params;

        // 🔍 **Buscar la cotización por ID**
        const cotizacion = await Cotizacion.findById(id);
        if (!cotizacion) {
            return res.status(404).json({ message: "Cotización no encontrada." });
        }

        // 📂 **Generar un nuevo PDF temporal usando la función existente**
        const pdfPath = await generatePDF(cotizacion); // Genera y retorna la ruta del PDF

        // 📧 **Configurar y enviar el correo con el PDF adjunto**
        const mailOptions = {
            from: "mundinovi.dev@gmail.com",
            to: cotizacion.cliente.correo,
            subject: `Reenvío de Cotización - Folio ${cotizacion.folio}`,
            html: `
                <p>Hola ${cotizacion.cliente.nombre},</p>
                <p>Te reenviamos la cotización con folio <strong>${cotizacion.folio}</strong>.</p>
                <p>Si tienes dudas, por favor contáctanos.</p>
            `,
            attachments: [
                {
                    filename: `cotizacion_${cotizacion.folio}.pdf`,
                    path: pdfPath,
                },
            ],
        };

        await transporter.sendMail(mailOptions);

        // 🗑️ **Eliminar el PDF Temporal**
        fs.unlinkSync(pdfPath);

        res.status(200).json({ message: "Cotización reenviada correctamente." });
    } catch (error) {
        console.error("Error al reenviar la cotización:", error);

        // Limpia el archivo PDF si algo falla
        if (fs.existsSync(pdfPath)) {
            fs.unlinkSync(pdfPath);
        }

        res.status(500).json({ message: "Error interno del servidor." });
    }
};

exports.actualizarCotizacion = async (req, res) => {
    try {
        const { id } = req.params; // ID de la cotización a actualizar
        const { productos } = req.body; // Nuevos datos enviados desde el frontend

        // Buscar la cotización existente
        const cotizacion = await Cotizacion.findById(id);

        if (!cotizacion) {
            return res.status(404).json({ error: 'Cotización no encontrada.' });
        }

        // Validar los productos recibidos
        if (!productos || !Array.isArray(productos)) {
            return res.status(400).json({ error: 'Datos de productos inválidos.' });
        }

        // Actualizar los productos de la cotización
        cotizacion.productos = productos.map((producto) => ({
            id: producto.id, // ID del producto
            reference: producto.reference, // Referencia del producto
            nombre: producto.nombre, // Nombre del producto
            cantidad: producto.cantidad, // Cantidad
            precio: producto.precio, // Precio
            total: producto.cantidad * producto.precio, // Total calculado
        }));

        // Recalcular el total general de la cotización
        cotizacion.totalGeneral = cotizacion.productos.reduce((sum, p) => sum + p.total, 0);

        // Guardar los cambios
        await cotizacion.save();

        res.status(200).json({ message: 'Cotización actualizada correctamente.' });
    } catch (error) {
        console.error('Error al actualizar la cotización:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
};

