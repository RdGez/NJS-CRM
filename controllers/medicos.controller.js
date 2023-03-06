const { response } = require("express");
const Medico = require("../models/medico");

const getMedicos = async (req, res = response) => {
  const medicos = await Medico.find()
    .populate("usuario", "nombre img")
    .populate("hospital", "nombre img");

  res.status(200).json({
    ok: true,
    medicos,
  });
};

const addMedico = async (req, res = response) => {
  const uid = req.uid;
  const medico = new Medico({ usuario: uid, ...req.body });

  try {
    const medicoDB = await medico.save();

    res.status(200).json({
      ok: true,
      medico: medicoDB,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Error inesperado...",
    });
  }
};

const updateMedico = async (req, res = response) => {
  const id = req.params.id;
  const uid = req.uid;

  try {
    const medico = await Medico.findById(id);
    if (!medico) {
      return res.status(404).json({
        ok: false,
        msg: "No existe el medico con este identificador.",
      });
    }

    const updates = { ...req.body, usuario: uid };
    const medicoUpdate = await Medico.findByIdAndUpdate(id, updates, {
      new: true,
    });

    res.json({
      ok: true,
      medico: medicoUpdate,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Ha ocurrido un error...",
    });
  }
};

const deleteMedico = async (req, res = response) => {
  const id = req.params.id;

  try {
    const medico = await Medico.findById(id);
    if (!medico) {
      return res.status(404).json({
        ok: false,
        msg: "No existe el medico con este identificador.",
      });
    }

    await Medico.findByIdAndDelete(id);

    res.json({
      ok: true,
      msg: "Medico eliminado.",
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Ha ocurrido un error...",
    });
  }
};

const getMedicoById = async (req, res = response) => {
  const id = req.params.id;

  try {
    const medico = await Medico.findById(id)
      .populate("usuario", "nombre img")
      .populate("hospital", "nombre img");

    res.status(200).json({
      ok: true,
      medico,
    });
  } catch (error) {
    res.status(402).json({
      ok: false,
      msg: 'No se ha encontrado al medico buscado.'
    });
  }
};

module.exports = { getMedicos, addMedico, updateMedico, deleteMedico, getMedicoById};
