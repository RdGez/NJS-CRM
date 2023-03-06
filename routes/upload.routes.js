/* Ruta raiz: /api/upload/ */
const { Router } = require("express");
const fileUpload  = require('express-fileupload');

const { validarJWT } = require("../middlewares/validar-token");
const { uploadFile, retornarArchivo } = require("../controllers/upload.controller");


const router = Router();

router.use(fileUpload());
router.get('/:tipo/:archivo', retornarArchivo)
router.put("/:tipo/:id", validarJWT, uploadFile);


module.exports = router;