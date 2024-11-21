const fs = require('fs');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const carpetaDestino = path.join(__dirname, '../public/capacitacion/');
    console.log('Destino esperado del archivo:', carpetaDestino);

    // Crear carpeta si no existe
    if (!fs.existsSync(carpetaDestino)) {
      console.log('La carpeta no existe. Creándola...');
      fs.mkdirSync(carpetaDestino, { recursive: true });
    }

    cb(null, carpetaDestino);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    console.log('Nombre del archivo generado:', uniqueSuffix);
    cb(null, uniqueSuffix);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    console.log('Validando archivo:', file.originalname);
    const allowedExtensions = /pdf|doc|docx|txt/;
    const extname = allowedExtensions.test(path.extname(file.originalname).toLowerCase());
    if (extname) {
      console.log('Archivo válido.');
      cb(null, true);
    } else {
      console.log('Archivo no válido.');
      cb(new Error('Solo se permiten archivos PDF, DOC, DOCX o TXT.'));
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 },
});

module.exports = upload;
