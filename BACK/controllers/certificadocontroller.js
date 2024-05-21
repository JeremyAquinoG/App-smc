const certi = require("../models/certificado");

const controller = {};

controller.agregar = async (req, res) => {
  const { certificado, proforma, documento, estado, emitido, ultimafecha, cliente } = req.body;
  const file = req.file ? req.file.filename : null;

  try {
    await certi.create({
      certificado,
      proforma,
      documento,
      estado,
      emitido,
      ultimafecha,
      cliente,
      file // Guardar el nombre del archivo en la base de datos
    });
    return res.send({ msg: "Se agregó correctamente", file });
  } catch (error) {
    console.error("Error al agregar el certificado:", error);
    return res.status(500).send({ msg: "Error al agregar el certificado", error: error.message });
  }
};

controller.buscar = async (req, res) => {
  const findall = await certi.findAll();
  const Encotrra = findall.filter((item) => item.nombre === "pedro");
  if (!Encotrra) return res.send({ msg: "no" });
  return res.send({
    en: Encotrra,
  });
};

controller.btnertoddos = async (req, res) => {
  try {
    let datos = await certi.findAll();
    return res.send(datos);
  } catch (error) {
    return res.send({ error });
  }
};

module.exports = controller;
