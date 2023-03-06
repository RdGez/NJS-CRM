/* Ruta Raiz: '/api/hospitales' */
const { Router } = require("express");

const { check } = require("express-validator");
const { validarJWT } = require("../middlewares/validar-token");
const { validarCampos } = require("../middlewares/validar-campos");

const {
  getHospitales,
  addHospital,
  updateHospital,
  deleteHospital,
} = require("../controllers/hospitales.controller");

const router = Router();

router.get("/", getHospitales);

router.post(
  "/add",
  [
    validarJWT,
    check("nombre", "El nombre del hospital es necesario.").not().isEmpty(),
    validarCampos,
  ],
  addHospital
);

router.put(
  "/update/:id",
  [
    validarJWT,
    check("nombre", "El nombre del hospital es necesario.").not().isEmpty(),
    validarCampos,
  ],
  updateHospital
);

router.delete("/delete/:id", validarJWT, deleteHospital);

module.exports = router;
