/* Ruta Raiz: '/api/hospitales' */
const { Router } = require("express");

const { check } = require("express-validator");
const { validarJWT } = require("../middlewares/validar-token");
const { validarCampos } = require("../middlewares/validar-campos");

const { getMedicos, addMedico, updateMedico, deleteMedico, getMedicoById } = require("../controllers/medicos.controller");

const router = Router();

router.get("/", validarJWT ,getMedicos);

router.post(
  "/add",
  [
    validarJWT,
    check("nombre", "El nombre del medico es necesario.").not().isEmpty(),
    check("hospital", "El hospital debe ser valido.").isMongoId(),
    validarCampos,
  ],
  addMedico
);

router.put(
  "/update/:id",
  [
    validarJWT,
    check("nombre", "El nombre del medico es necesario.").not().isEmpty(),
    validarCampos,
  ],
  updateMedico
);

router.delete("/delete/:id", validarJWT, deleteMedico);

router.get("/:id", validarJWT , getMedicoById);

module.exports = router;
