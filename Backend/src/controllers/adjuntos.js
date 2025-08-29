const Adjunto = require('../models/adjunto');
const path = require('path');
const fs = require('fs');
const { validationResult } = require('express-validator');

const subirAdjunto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No se proporcionó ningún archivo' });
    }

    const { entidad, entidadId } = req.body;

    if (!entidad || !entidadId) {
      return res.status(400).json({ 
        message: 'entidad y entidadId son requeridos' 
      });
    }

    const adjunto = new Adjunto({
      entidad,
      entidadId,
      nombreArchivo: req.file.originalname,
      url: req.file.path,
      mime: req.file.mimetype,
      size: req.file.size,
      subidoPor: req.user._id
    });

    await adjunto.save();

    const adjuntoPoblado = await Adjunto.findById(adjunto._id)
      .populate('subidoPor', 'nombre email');

    res.status(201).json({
      message: 'Archivo subido exitosamente',
      data: adjuntoPoblado
    });
  } catch (error) {
    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error eliminando archivo:', err);
      });
    }
    res.status(500).json({ message: 'Error al subir archivo', error: error.message });
  }
};

const obtenerAdjuntos = async (req, res) => {
  try {
    const { entidad, entidadId } = req.query;

    if (!entidad || !entidadId) {
      return res.status(400).json({ 
        message: 'entidad y entidadId son requeridos' 
      });
    }

    const adjuntos = await Adjunto.find({ entidad, entidadId })
      .populate('subidoPor', 'nombre email')
      .sort({ createdAt: -1 });

    res.json({ data: adjuntos });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener adjuntos', error: error.message });
  }
};

const eliminarAdjunto = async (req, res) => {
  try {
    const { id } = req.params;

    const adjunto = await Adjunto.findById(id);
    if (!adjunto) {
      return res.status(404).json({ message: 'Adjunto no encontrado' });
    }

    fs.unlink(adjunto.url, (err) => {
      if (err) console.error('Error eliminando archivo físico:', err);
    });

    await Adjunto.findByIdAndDelete(id);

    res.json({ message: 'Adjunto eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar adjunto', error: error.message });
  }
};

const descargarAdjunto = async (req, res) => {
  try {
    const { id } = req.params;

    const adjunto = await Adjunto.findById(id);
    if (!adjunto) {
      return res.status(404).json({ message: 'Adjunto no encontrado' });
    }

    if (!fs.existsSync(adjunto.url)) {
      return res.status(404).json({ message: 'Archivo no encontrado en el servidor' });
    }

    res.setHeader('Content-Disposition', `attachment; filename="${adjunto.nombreArchivo}"`);
    res.setHeader('Content-Type', adjunto.mime);
    
    const fileStream = fs.createReadStream(adjunto.url);
    fileStream.pipe(res);
  } catch (error) {
    res.status(500).json({ message: 'Error al descargar archivo', error: error.message });
  }
};

module.exports = {
  subirAdjunto,
  obtenerAdjuntos,
  eliminarAdjunto,
  descargarAdjunto
};