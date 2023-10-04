const express = require('express');
const Advertisement = require('../../modules/Advertisement');
const file = require('../../middleware/file');
const errorJSON = require('../../middleware/errorJSON');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const advertisements = await Advertisement.findByParams();
    return res.json({
      data: [...advertisements],
      status: 'ok',
    });
  } catch (e) {
    return errorJSON({ code: 500, message: e.message }, res);
  }
});

router.post(
  '/',
  (req, res, next) => {
  // Check authentication
    if (!req.isAuthenticated()) {
      return errorJSON({ code: 401, message: 'Пользователь не аутентифицирован' }, res);
    }
    return next();
  },

  // Get files from body
  file.array('images'),

  async (req, res) => {
    const { shortTitle: shortText, description } = req.body;
    try {
      return res.json({
        data: await Advertisement.create({
          shortText,
          description,
          images: req.files.map((image) => image.path),
          userId: req.user.id,
        }),
        status: 'ok',
      });
    } catch (e) {
      return errorJSON({ code: 500, message: e.message }, res);
    }
  },
);

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    return res.json({
      data: await Advertisement.findByParams({ _id: id }),
      status: 'ok',
    });
  } catch (e) {
    return errorJSON({ code: 500, message: e.message }, res);
  }
});

router.delete(
  '/:id',
  (req, res, next) => {
  // Check authentication
    if (!req.isAuthenticated()) {
      return errorJSON({ code: 401, message: 'Пользователь не аутентифицирован' }, res);
    }
    return next();
  },

  // Validate req.params
  async (req, res, next) => {
    const { id } = req.params;
    const advertisement = await Advertisement.findByParams({ _id: id });
    if (advertisement.length === 0) {
      return errorJSON({ code: 500, message: 'Объявление не найдено' }, res);
    }
    if (advertisement[0].userId.toString() !== req.user.id) {
      return errorJSON({ code: 403, message: 'Пользователь не является автором объявления' }, res);
    }
    return next();
  },

  async (req, res) => {
    const { id } = req.params;
    try {
      return res.json({
        data: await Advertisement.removeById(id),
        status: 'ok',
      });
    } catch (e) {
      return errorJSON({ code: 500, message: e.message }, res);
    }
  },
);

module.exports = router;
