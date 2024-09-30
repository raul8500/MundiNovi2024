const bwipjs = require('bwip-js');
const path = require('path');
const fs = require('fs');

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
