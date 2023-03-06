const fs = require("fs");

const Usuario = require("../models/usuario");
const Medico = require("../models/medico");
const Hospital = require("../models/hospital");

const borrarArchivo = (path) => {
  if (fs.existsSync(path)) {
    // Borrar la iamgen vieja.
    fs.unlinkSync(path);
  }
};

const actualizarArchivo = async (tipo, id, nombreArchivo) => {
  let oldPath = "";

  switch (tipo) {
    case "medicos":
      const medico = await Medico.findById(id);

      // Verificar si el medico existe.
      if (!medico) {
        return false;
      }

      oldPath = `./uploads/medicos/${medico.img}`;
      borrarArchivo(oldPath);

      medico.img = nombreArchivo;
      await medico.save();
      return true;
      break;
    case "hospitales":
      const hospital = await Hospital.findById(id);

      // Verificar si el medico existe.
      if (!hospital) {
        return false;
      }

      oldPath = `./uploads/hospitales/${hospital.img}`;
      borrarArchivo(oldPath);

      hospital.img = nombreArchivo;
      await hospital.save();
      return true;
      break;
    case "usuarios":
      const usuario = await Usuario.findById(id);

      // Verificar si el medico existe.
      if (!usuario) {
        return false;
      }

      oldPath = `./uploads/usuarios/${usuario.img}`;
      borrarArchivo(oldPath);

      usuario.img = nombreArchivo;
      await usuario.save();
      return true;
      break;
    default:
      break;
  }
};

module.exports = { actualizarArchivo };
