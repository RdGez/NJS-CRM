// Funciones para validar un token.
const jwt = require("jsonwebtoken");
const Usuario = require("../models/usuario");

const validarJWT = (req, res, next) => {
  // Leer JWT
  const token = req.header("x-token");

  if (!token) {
    return res.status(401).json({
      ok: false,
      msg: "Usuario no autorizado.",
    });
  }

  try {
    const { uid } = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.uid = uid;

    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      ok: false,
      msg: "Autorización incorrecta.",
    });
  }
};

const validarRole = async (req, res, next) => {
  const uid = req.uid;

  try {
    const usuarioDB = await Usuario.findById(uid);
    if (!usuarioDB) {
      return res.status(404).json({
        ok: false,
        msg: "El usuario no existe.",
      });
    }

    if (usuarioDB.role !== 'ADMIN_ROLE') {
      return res.status(403).json({
        ok: false,
        msg: "El usuario no esta autorizado.",
      });
    }

    next();
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      ok: false,
      msg: "Error inesperado...",
    });
  }
};

const validarRoleSameUser = async (req, res, next) => {
  const uid = req.uid;
  const id = req.params.id;

  try {
    const usuarioDB = await Usuario.findById(uid);
    if (!usuarioDB) {
      return res.status(404).json({
        ok: false,
        msg: "El usuario no existe.",
      });
    }

    if (usuarioDB.role !== 'ADMIN_ROLE' && uid !== id) {
      return res.status(403).json({
        ok: false,
        msg: "El usuario no esta autorizado.",
      });
    }

    next();
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      ok: false,
      msg: "Error inesperado...",
    });
  }
};

module.exports = { validarJWT, validarRole, validarRoleSameUser };
