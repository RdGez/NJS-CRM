/* Ruta Raiz: /api/usuarios */
const { Router } = require("express");
const { check } = require("express-validator");
const { validarJWT, validarRole, validarRoleSameUser} = require("../middlewares/validar-token");
const { validarCampos } = require("../middlewares/validar-campos");
const { getUsuarios, addUsuario, updateUsuario, deleteUsuario } = require("../controllers/usuarios.controller");

const router = Router();

router.get("/", validarJWT ,getUsuarios);

router.post(
  "/add",
  [
    check("nombre", "El nombre es obligatorio.").not().isEmpty(),
    check("password", "La contraseñá es obligatoria.").not().isEmpty(),
    check("email", "El email es obligatorio.").isEmail(),
    // Llamar al Middleware para saber si procesar la petición:
    validarCampos,
  ],
  addUsuario
);

router.put(
  "/update/:id",
  [
    // Llamar Middleware para validar el JWT
    validarJWT,
    validarRoleSameUser,
    check("nombre", "El nombre es obligatorio.").not().isEmpty(),
    check("email", "El email es obligatorio.").not().isEmpty(),
    check("role", "El role es obligaroio.").not().isEmpty(),
    // Llamar al Middleware para saber si procesar la petición:
    validarCampos
  ],
  updateUsuario
);

router.delete("/delete/:id", [validarJWT, validarRole] ,deleteUsuario);

module.exports = router;
