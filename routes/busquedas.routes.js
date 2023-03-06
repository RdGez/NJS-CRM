/* Ruta raiz: /api/search */
const { Router } = require("express");

const { validarJWT } = require("../middlewares/validar-token");

const { getBusqueda, getBusquedaColeccion } = require("../controllers/busquedas.controller")

const router = Router();


router.get("/:busqueda", validarJWT ,getBusqueda)
router.get("/:tabla/:busqueda", validarJWT ,getBusquedaColeccion)

module.exports = router;