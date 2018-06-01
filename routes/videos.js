const router = require('express').Router();

const Video = require('../models/video');

router.get('/videos', async (req, res, next) => {
  const videos = await Video.find({});
  res.render('videos/index', {videos});
});

router.post('/videos', async (req, res, next) => {
  const {title, description, url} = req.body;
  const newVideo = new Video({title, description, url});
  newVideo.validateSync();
  if (newVideo.errors) {
    res.status(400).render('videos/create', {newVideo});
  } else {
    await newVideo.save();
    res.redirect('/videos/' + newVideo._id);
  }
});

router.get('/videos/create', (req, res, next) => {
  res.render('videos/create');
});

router.get('/videos/:videoId', async (req, res, next) => {
  const newVideo = await Video.findById(req.params.videoId);
  res.render('videos/show', {newVideo});
});

router.get('/videos/:videoId/edit', async (req, res, next) => {
  const newVideo = await Video.findById(req.params.videoId);
  res.render('videos/edit', {id: req.params.videoId, newVideo});
});

router.post('/videos/:videoId/updates', async (req, res, next) => {
  const {title, description, url} = req.body;
  const newVideo = new Video({title, description, url});
  newVideo.validateSync();
  if (newVideo.errors) {
    res.status(400).render('videos/edit', {id: req.params.videoId, newVideo});
  } else {
    const foundVideo = await Video.findByIdAndUpdate(req.params.videoId, {title, description, url});
    res.redirect('/videos/' + req.params.videoId);
  }
});

router.post('/videos/:videoId/deletions', async (req, res, next) => {
  const foundItem = await Video.findByIdAndRemove(req.params.videoId);
  res.redirect('/');
});

module.exports = router;
