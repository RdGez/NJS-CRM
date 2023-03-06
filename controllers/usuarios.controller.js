const { response } = require("express");
const { generarJWT } = require("../helpers/jwt");

const bcrypt = require("bcryptjs");
const Usuario = require("../models/usuario");

const getUsuarios = async (req, res) => {
  /* Traer solo información necesaria:
    const usuarios = await Usuario.find({}, 'nombre email role google'); */
  const desde = Number(req.query.desde);

  /* const usuarios = await Usuario.find().skip(desde).limit(5);
  const total = await Usuario.count(); */

  // Ejecutar dos funciones simultaneamente con await.
  const [usuarios, total] = await Promise.all([
    Usuario.find().skip(desde).limit(5),
    Usuario.countDocuments(),
  ]);

  res.status(200).json({
    ok: true,
    usuarios,
    total,
  });
};

const addUsuario = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    const existeEmail = await Usuario.findOne({ email });

    if (existeEmail) {
      return res.status(400).json({
        ok: false,
        msg: "El correo electronico ya ha sido registrado.",
      });
    }

    const usuario = new Usuario(req.body);

    // Encriptar contraseñá:
    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync(password, salt);

    //  Generar JWLT:
    const token = await generarJWT(usuario.id);

    // Guarda al usuario:
    await usuario.save();

    res.status(200).json({
      ok: true,
      usuario,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error inesperado...",
    });
  }
};

const updateUsuario = async (req, res) => {
  // TODO: Validar token y comprobar si es el usuario correcto.
  const uid = req.params.id;

  try {
    const usuarioDB = await Usuario.findById(uid);

    if (!usuarioDB) {
      return res.status(404).json({
        ok: false,
        msg: "No existe un usuario por ese id",
      });
    }

    // Actualizaciones
    const { password, google, email, ...campos } = req.body;

    if (usuarioDB.email !== email) {
      const existeEmail = await Usuario.findOne({ email });
      if (existeEmail) {
        return res.status(400).json({
          ok: false,
          msg: "Ya existe un usuario con ese email",
        });
      }
    }

    if (!usuarioDB.google) {
      campos.email = email;
    } else if (usuarioDB.email !== email) {
      return res.status(400).json({
        ok: false,
        msg: "Usuarios de google no pueden cambiar su correo electronico.",
      });
    }

    const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, campos, {
      new: true,
    });

    res.json({
      ok: true,
      usuario: usuarioActualizado,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Error inesperado...",
    });
  }
};

const deleteUsuario = async (req, res) => {
  const uid = req.params.id;

  try {
    const existeEmail = await Usuario.findOne({ email: req.body.email });
    if (existeEmail) {
      return res.status(404).json({
        ok: false,
        msg: "No existe un usuario registrado con este id.",
      });
    }

    await Usuario.findByIdAndDelete(uid);

    res.status(200).json({
      ok: true,
      msg: "El usuario ha sido eliminado correctamente.",
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Error inesperado...",
    });
  }
};

module.exports = { getUsuarios, addUsuario, updateUsuario, deleteUsuario };
