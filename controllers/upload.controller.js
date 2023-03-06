const { resposne } = require("express");
const { v4: uuidv4 } = require("uuid");

const path = require("path");
const fs = require("fs");

const { actualizarArchivo } = require("../helpers/actualizar-archivo");

const uploadFile = (req, res = resposne) => {
  const tipo = req.params.tipo;
  const id = req.params.id;

  const tiposValidos = ["hospitales", "medicos", "usuarios"];
  if (!tiposValidos.includes(tipo)) {
    return res.status(400).json({
      ok: false,
      msg: `El tipo ${tipo}, no es una opción valida.`,
    });
  }

  // Validar la existencia de un arhcivo.
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({
      ok: false,
      msg: "No hay ningun archvio valido.",
    });
  }

  // Procesar la imagen recibida.
  const file = req.files.archivo;
  const nombreCortado = file.name.split(".");
  const extencion = nombreCortado[nombreCortado.length - 1];

  // Validar la extencion recibida.
  const extencionesValida = ["png", "jpg", "jpeg", "gif"];
  if (!extencionesValida.includes(extencion)) {
    return res.status(400).json({
      ok: false,
      msg: `La extencion ${extencion}, no es un formato de archivo valido.`,
    });
  }

  // Generar nombre unico del archivo.
  const nombreArchivo = `${uuidv4()}.${extencion}`;

  // Crear el path para guardar la imagen.
  const path = `./uploads/${tipo}/${nombreArchivo}`;

  // Mover la imagen.
  file.mv(path, (err) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        ok: false,
        msg: "Error al subir la imagen.",
      });
    }

    // Asignar archivo a su propietario.
    actualizarArchivo(tipo, id, nombreArchivo);

    res.json({
      ok: true,
      msg: "Archivo cargado.",
      nombreArchivo,
    });
  });
};

const retornarArchivo = (req, res = resposne) => {
  const { tipo, archivo } = req.params;

  const pathFile = path.join(__dirname, `../uploads/${tipo}/${archivo}`);

  // Verificar si existe la imagen.
  if (fs.existsSync(pathFile)) {
    res.sendFile(pathFile);
  } else {
    const pathFile = path.join(__dirname, `../uploads/no-img.jpg`);
    res.sendFile(pathFile);
  }
};

module.exports = { uploadFile, retornarArchivo };
