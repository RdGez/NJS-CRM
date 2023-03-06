const { response } = require("express");
const Hospital = require("../models/hospital");

const getHospitales = async (req, res = response) => {
  const hospitales = await Hospital.find().populate("usuario", "nombre");

  res.status(200).json({
    ok: true,
    hospitales,
  });
};

const addHospital = async (req, res = response) => {
  const uid = req.uid;
  const hospital = new Hospital({ usuario: uid, ...req.body });

  try {
    const hospitalDB = await hospital.save();

    res.status(200).json({
      ok: true,
      hospital: hospitalDB,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error inesperado...",
    });
  }
};

const updateHospital = async (req, res = response) => {
  const id = req.params.id;
  const uid = req.uid;

  try {
    const hospital = await Hospital.findById(id);
    if (!hospital) {
      return res.status(404).json({
        ok: false,
        msg: "No se ha encontrado ningun hospital con ese identificador.",
      });
    }

    const updates = {...req.body, usuario: uid};
    const hospitalUpdated = await Hospital.findByIdAndUpdate(id, updates, {new: true});

    res.json({
      ok: true,
      hospital: hospitalUpdated
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Ha ocurrido un error...",
    });
  }
};

const deleteHospital = async (req, res = response) => {
  const id = req.params.id;

  try {
    const hospital = await Hospital.findById(id);
    if (!hospital) {
      return res.status(404).json({
        ok: false,
        msg: "No se ha encontrado ningun hospital con ese identificador.",
      });
    }

    await Hospital.findByIdAndDelete(id);

    res.json({
      ok: true,
      msg: "Hospital eliminado."
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Ha ocurrido un error...",
    });
  }
};

module.exports = { getHospitales, addHospital, updateHospital, deleteHospital };
