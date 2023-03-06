const { response } = require("express");

const bcrypt = require("bcryptjs");
const Usuario = require("../models/usuario");
const { generarJWT } = require("../helpers/jwt");
const { googleVerify } = require("../helpers/google-check");
const { getMenuFrontEnd } = require("../helpers/menu-front");

const login = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    // Verificar el email:
    const usuarioDB = await Usuario.findOne({ email });

    if (!usuarioDB) {
      return res.status(404).json({
        ok: false,
        msg: "Usuario y/o contraseña incorrecto.",
      });
    }

    // Validar la contraseñá:
    const validPassword = bcrypt.compareSync(password, usuarioDB.password);

    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        msg: "Usuario y/o contraseña incorrecto.",
      });
    }

    //  Generar JWLT:
    const token = await generarJWT(usuarioDB.id);

    res.json({
      ok: true,
      token,
      menu: getMenuFrontEnd(usuarioDB.role),
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error inesperado...",
    });
  }
};

const googleSignIn = async (req, res = response) => {
  const googleToken = req.body.token;

  try {
    const { name, email, picture } = await googleVerify(googleToken);

    const usuarioDB = await Usuario.findOne({ email });
    let usuario;

    if (!usuarioDB) {
      // Si nO existe el usuario.
      usuario = new Usuario({
        nombre: name,
        email,
        password: "@@@",
        img: picture,
        google: true,
      });
    } else {
      // Usuario existente.
      usuario = usuarioDB;
      usuario.google = true;
    }

    // Guardar en base de datos.
    await usuario.save();

    //  Generar JWLT:
    const token = await generarJWT(usuario.id);

    res.status(200).json({
      ok: true,
      token,
      menu: getMenuFrontEnd(usuario.role),
    });
  } catch (error) {
    res.status(401).json({
      ok: false,
      msg: "El token no es valido.",
    });
  }
};

const renewToken = async (req, res = response) => {
  const uid = req.uid;

  //  Generar JWLT:
  const token = await generarJWT(uid);

  // Recuperar el usuario
  const usuario = await Usuario.findById(uid);

  if (!token || !usuario) {
    return res.status(500).json({
      ok: false,
      msg: "Usuario no autentificado.",
    });
  }

  res.status(200).json({
    ok: true,
    token,
    usuario,
    menu: getMenuFrontEnd(usuario.role),
  });
};

module.exports = { login, googleSignIn, renewToken };
