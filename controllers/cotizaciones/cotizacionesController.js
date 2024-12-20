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

exports.crearCotizacion = async (req, res) => {
    try {
        const { cliente, productos, sucursal, usuario } = req.body;

        if (!cliente || !productos || productos.length === 0 || !sucursal || !usuario) {
            return res.status(400).send("Se requiere la información del cliente, la sucursal, el usuario y al menos un producto.");
        }

        const lastCotizacion = await Cotizacion.findOne().sort({ folio: -1 });
        const folio = lastCotizacion ? lastCotizacion.folio + 1 : 1000;

        let totalGeneral = 0;
        const productosConTotal = productos.map((producto) => {
            const totalProducto = producto.cantidad * producto.precio;
            totalGeneral += totalProducto;
            return {
                ...producto,
                total: totalProducto,
            };
        });

        const pdfPath = path.join(__dirname, "../../uploads", `cotizacion_${Date.now()}.pdf`);
        const doc = new PDFDocument({ margin: 30 });
        doc.pipe(fs.createWriteStream(pdfPath));

         // Agregar el logo
        const logoPath = path.join(__dirname, "../../public/img/logoColor.png");
        doc.image(logoPath, 30, 30, { width: 70, height: 60 });

        // Título
        doc.fontSize(18).text("Cotización", { align: "center" });
        doc.moveDown();

        doc.fontSize(12).font("Helvetica-Bold").text("Sucursal:", 400, 90, { align: "right" });
        doc.font("Helvetica");
        doc.text(`Nombre: ${sucursal.nombre}`, 400, 105, { align: "right" });
        doc.text(`Dirección: ${sucursal.direccion}`, 300, 120, { align: "right" });
        doc.text(`Teléfono: ${sucursal.telefono}`, 400, 135, { align: "right" });

        doc.fontSize(12).font("Helvetica-Bold").text("Cliente:", 30, 120);
        doc.font("Helvetica");
        doc.text(`Nombre: ${cliente.nombre}`, 30, 135);
        doc.text(`Teléfono: ${cliente.telefono}`, 30, 150);
        doc.text(`Correo: ${cliente.correo}`, 30, 165);
        doc.text(`Dirección: ${cliente.direccion}`, 30, 180);
        doc.moveDown();

        doc.fontSize(12).font("Helvetica-Bold").text(`Folio: ${folio}`, 30, 210);
        doc.text(`Cotizado por: ${usuario.nombre}`, 30, 225);
        

        // Tabla de productos
        const tableTop = doc.y + 20;
        const columnWidths = [150, 100, 70, 50, 80, 80];
        const headers = ["Producto", "Referencia", "Unidad", "Cant.", "Precio", "Total"];
        const startX = 40; // Alineado con el margen

        // Encabezado de tabla
        doc.font("Helvetica-Bold").fontSize(8);
        headers.forEach((header, i) => {
            // Verificar si el encabezado es "Precio" o "Total" para alinearlos a la derecha
            const align = (header === "Precio" || header === "Total") ? "right" : "center";
            doc.text(header, startX + columnWidths.slice(0, i).reduce((a, b) => a + b, 0), tableTop, {
                width: columnWidths[i],
                align: align,
            });
        });


        doc.moveTo(startX, tableTop + 15)
        .lineTo(startX + columnWidths.reduce((a, b) => a + b, 0), tableTop + 15)
        .stroke();

        // Cuerpo de la tabla
        let currentY = tableTop + 20; // Empezamos después del encabezado de la tabla

        productosConTotal.forEach((producto) => {
            // Dibujar cada fila de la tabla
            doc.font("Helvetica").fontSize(8);
            doc.text(producto.nombre, startX, currentY, { width: columnWidths[0], align: "center" });
            doc.text(producto.reference, startX + columnWidths[0], currentY, { width: columnWidths[1], align: "center" });
            doc.text(producto.unidad, startX + columnWidths.slice(0, 2).reduce((a, b) => a + b, 0), currentY, { width: columnWidths[2], align: "center" });
            doc.text(producto.cantidad.toString(), startX + columnWidths.slice(0, 3).reduce((a, b) => a + b, 0), currentY, { width: columnWidths[3], align: "center" });
            doc.text(`$${producto.precio.toFixed(2)}`, startX + columnWidths.slice(0, 4).reduce((a, b) => a + b, 0), currentY, { width: columnWidths[4], align: "right" });
            doc.text(`$${producto.total.toFixed(2)}`, startX + columnWidths.slice(0, 5).reduce((a, b) => a + b, 0), currentY, { width: columnWidths[5], align: "right" });

            currentY += 12; // Incrementamos para la siguiente fila (altura de texto + pequeño espacio)
        });

        // Dibujar la línea final de la tabla usando currentY
        doc.moveTo(startX, currentY)
        .lineTo(startX + columnWidths.reduce((a, b) => a + b, 0), currentY)
        .stroke();


        const endTableY = tableTop + productos.length * 18;
 
        // Total General en una misma línea
        const totalX = startX + columnWidths[0] + columnWidths[1] + columnWidths[2] + 10; // Mover más a la derecha
        doc.fontSize(12)
            .text("Total General:", totalX - 10, endTableY + 10, { align: "right", width: 100 })
            .text(`$${totalGeneral.toFixed(2)}`, totalX + 100, endTableY + 10, { align: "right", width: 100 });

        // Texto centrado debajo de la tabla
        doc.moveDown(5);

        // Línea principal en negrita y centrada
        doc.font("Helvetica-Bold").fontSize(10).text(
            "Gracias por su compra, ¡vuelva pronto!!!!.",
            totalX - 325, endTableY + 70,
            { align: "center", continued: false }
        );

        // Resto del texto, cada línea centrada individualmente
        doc.moveDown();
        doc.font("Helvetica").fontSize(10);
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

        await new Promise((resolve, reject) => {
            doc.on("end", resolve);
            doc.on("error", reject);
        });

        // Guardar la cotización
        const nuevaCotizacion = new Cotizacion({
            folio,
            cliente,
            sucursal,
            productos: productosConTotal,
            totalGeneral,
            pdfPath,
            usuario,
        });
        await nuevaCotizacion.save();

        // Enviar por correo
        await sendCotizacionEmail(cliente.correo, pdfPath, cliente, sucursal);

        res.status(201).send({ message: "Cotización creada y enviada por correo", pdfPath });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error interno del servidor.");
    }
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
        const cotizacion = await Cotizacion.findById(id).populate("usuario");

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

//imprimir
exports.imprimirCotizacion = async (req, res) => {
    try {
        const { id } = req.params;

        // Buscar la cotización por ID
        const cotizacion = await Cotizacion.findById(id);
        if (!cotizacion) {
            return res.status(404).json({ message: "Cotización no encontrada." });
        }

        // Verificar si el archivo PDF existe
        const pdfPath = cotizacion.pdfPath;
        if (!fs.existsSync(pdfPath)) {
            return res.status(404).json({ message: "El archivo PDF no se encontró." });
        }

        // Enviar el archivo PDF como respuesta
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
            "Content-Disposition",
            `inline; filename=cotizacion_${cotizacion.folio}.pdf`
        );
        fs.createReadStream(pdfPath).pipe(res);
    } catch (error) {
        console.error("Error al generar el PDF:", error);
        res.status(500).json({ message: "Error interno del servidor." });
    }
};

exports.reenviarCotizacion = async (req, res) => {
    try {
        const { id } = req.params;

        // Buscar la cotización por ID
        const cotizacion = await Cotizacion.findById(id);
        if (!cotizacion) {
            return res.status(404).json({ message: "Cotización no encontrada." });
        }

        const pdfPath = cotizacion.pdfPath;
        if (!fs.existsSync(pdfPath)) {
            return res.status(404).json({ message: "El archivo PDF no se encontró." });
        }

        // Configuración del correo
        const mailOptions = {
            from: "mundinovi.dev@gmail.com",
            to: cotizacion.cliente.correo, // Correo del cliente
            subject: `Reenvío de Cotización - Folio ${cotizacion.folio}`,
            html: `
                <p>Hola ${cotizacion.cliente.nombre},</p>
                <p>Te reenviamos la cotización con folio <strong>${cotizacion.folio}</strong>.</p>
                <p>Si tienes dudas, por favor contáctanos.</p>
            `,
            attachments: [
                {
                    filename: path.basename(pdfPath),
                    path: pdfPath,
                },
            ],
        };

        // Enviar el correo
        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: "Cotización reenviada correctamente." });
    } catch (error) {
        console.error("Error al reenviar la cotización:", error);
        res.status(500).json({ message: "Error interno del servidor." });
    }
};