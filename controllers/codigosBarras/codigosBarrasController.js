const bwipjs = require('bwip-js');
const path = require('path');
const fs = require('fs');
const PDFDocument = require('pdfkit');

// Función para generar un código de barras y exponerla vía API
exports.generarCodigoDeBarras = async (req, res) => {
  try {
    // Obtener el texto del cuerpo de la solicitud
    const { texto } = req.body;

    // Validar que se haya enviado el texto
    if (!texto) {
      return res.status(400).json({ message: 'El campo "texto" es requerido.' });
    }
    // Definir la ruta del archivo donde se guardará el código de barras
    const nombreArchivo = path.join(__dirname, `../../archivos/${texto}.png`);

    // Generar el código de barras
    bwipjs.toBuffer({
      bcid: 'code128',       // Tipo de código de barras
      text: texto,           // Texto que irá en el código de barras
      scale: 3,              // Escala del código de barras
      height: 10,            // Altura del código de barras
      includetext: true,     // Incluye el texto en la imagen
      textxalign: 'center',  // Alinea el texto al centro
    }, function (err, png) {
      if (err) {
        console.error('Error al generar el código de barras: ', err);
        return res.status(500).json({ message: 'Error al generar el código de barras.', error: err });
      }

      // Guardar la imagen en el sistema de archivos
      fs.writeFile(nombreArchivo, png, (err) => {
        if (err) {
          console.error('Error al guardar el archivo: ', err);
          return res.status(500).json({ message: 'Error al guardar el archivo de código de barras.', error: err });
        }

        // Responder con éxito y la ruta del archivo generado
        return res.status(200).json({ message: 'Código de barras generado con éxito.', archivo: nombreArchivo });
      });
    });
  } catch (error) {
    console.error('Error en la generación del código de barras:', error);
    return res.status(500).json({ message: 'Error en la generación del código de barras.', error });
  }
};

exports.generarCodigoDeBarrasProductos = async (req, res) => {
    try {
        const { productos } = req.body;

        // Validar que se hayan enviado los productos
        if (!productos || productos.length === 0) {
            return res.status(400).json({ message: 'El campo "productos" es requerido y debe contener al menos un producto.' });
        }

        // Crear un documento PDF en formato horizontal (landscape)
        const doc = new PDFDocument({ size: [200, 350], layout: 'landscape' }); // Tamaño de la página
        const nombreArchivo = path.join(__dirname, `../../public/img/archivos/codigos_barras.pdf`);
        const nombreArchivoPublico = '/img/archivos/codigos_barras.pdf'; // Ruta pública
        const writeStream = fs.createWriteStream(nombreArchivo);
        doc.pipe(writeStream);

        let primeraPagina = true;  // Bandera para controlar si es la primera página del documento

        // Recorrer cada producto y generar las etiquetas solicitadas
        for (const producto of productos) {
            const { texto, cantidad } = producto;

            // Generar el código de barras para cada producto
            const pngBuffer = await new Promise((resolve, reject) => {
                bwipjs.toBuffer({
                    bcid: 'code128',       // Tipo de código de barras
                    text: texto,           // Texto que irá en el código de barras
                    scale: 3,              // Escala del código de barras
                    height: 10,            // Altura del código de barras
                    includetext: true,     // Incluye el texto en la imagen
                    textxalign: 'center',  // Alinea el texto al centro
                }, function (err, png) {
                    if (err) {
                        return reject(err);
                    }
                    resolve(png);
                });
            });

            // Añadir el código de barras al PDF la cantidad de veces solicitada
            for (let i = 0; i < cantidad; i++) {
                if (!primeraPagina || i > 0) {  
                    doc.addPage();  // Añadir una nueva página a partir del segundo código de barras o nuevo producto
                } 
                // Desactivar la bandera de la primera página después de la primera iteración
                primeraPagina = false;

                // Cálculo para centrar la imagen
                const pageWidth = 350;   // Ancho de la página
                const pageHeight = 200;  // Alto de la página
                const imageWidth = 180;  // Ancho de la imagen (ajustado por 'width')
                const imageHeight = 100; // Altura de la imagen (reducida para evitar estiramiento)

                const x = (pageWidth - imageWidth) / 2;    // Calcular X para centrar horizontalmente
                const y = (pageHeight - imageHeight) / 2;  // Calcular Y para centrar verticalmente

                // Insertar el código de barras en el PDF, centrado y con tamaño ajustado
                doc.image(pngBuffer, x, y, {
                    width: imageWidth, // Ancho ajustado
                    height: imageHeight, // Altura ajustada
                });
            }
        }

        // Finalizar el PDF
        doc.end();

        // Escuchar cuando el archivo PDF se haya generado correctamente
        writeStream.on('finish', () => {
            res.status(200).json({
                message: 'PDF generado con éxito.',
                archivo: nombreArchivoPublico // Ruta pública para el frontend
            });
        });

        writeStream.on('error', (err) => {
            console.error('Error al generar el PDF: ', err);
            res.status(500).json({ message: 'Error al generar el PDF.', error: err });
        });

    } catch (error) {
        console.error('Error en la generación del PDF de códigos de barras:', error);
        res.status(500).json({ message: 'Error en la generación del PDF de códigos de barras.', error });
    }
};
