const {jsdom} = require('jsdom');
const {assert} = require('chai');
const request = require('supertest');

const app = require('../../app');
const Video = require('../../models/video');

const {connectDatabase, disconnectDatabase, parseTextFromHTML, parseValueFromHTML, parseSrcFromHTML} = require('../utils');

const seedVideo = { title: "Drinking Songs",
		       description: "By: Matt Elliott",
		       url: "https://www.youtube.com/embed/YDWEz1mia1I" };

const seedVideoWithMissingTitle = { description: "By: Matt Elliott",
				    url: "https://www.youtube.com/embed/YDWEz1mia1I" };

const seedVideoWithMissingUrl = { title: "Drinking Songs",
				  description: "By: Matt Elliott" };

describe('Server path: /videos', () => {
  beforeEach(connectDatabase);
  afterEach(disconnectDatabase);

  describe('GET', () => {
    it('existing video is rendered', async () => {
      const video = await Video.create(seedVideo);
      const response = await request(app).get('/videos/');

      assert.include(parseTextFromHTML(response.text, "#video-title"), seedVideo.title);
      assert.include(parseSrcFromHTML(response.text, "iframe"), seedVideo.url);
    });
  });
  
  describe('POST', () => {
    it('returns 302 status', async () => {
      const response = await request(app).post('/videos').type('form').send(seedVideo);
      const foundVideo = await Video.findOne({});

      assert.equal(response.status, 302);
      assert.equal(response.headers.location, '/videos/' + foundVideo._id);
    });

    it('submitted video is saved', async () => {
      const response = await request(app).post('/videos').type('form').send(seedVideo);
      const foundVideo = await Video.findOne({});

      assert.include(foundVideo, seedVideo);
    });

    it('response contains video details', async () => {
      const response = await request(app).post('/videos').type('form').send(seedVideo);
      // the actual response is in the redirected page
      const fwdResponse = await request(app).get(response.headers.location);

      assert.include(fwdResponse.text, seedVideo.title);
      assert.include(fwdResponse.text, seedVideo.description);
    });

    it('does not save video if title is missing', async () => {
      const response = await request(app).post('/videos').type('form').send(seedVideoWithMissingTitle);
      const videos = await Video.find({});

      assert.equal(videos.length, 0);
    });

    it('responds with 400 if title is missing', async () => {
      const response = await request(app).post('/videos').type('form').send(seedVideoWithMissingTitle);

      assert.equal(response.status, 400);
    });

    it('renders create page with error and preserved field values if title is missing', async () => {
      const response = await request(app).post('/videos').type('form').send(seedVideoWithMissingTitle);

      assert.equal(parseTextFromHTML(response.text, 'span#title-input-error'), 'Path `title` is required.');
      assert.equal(parseTextFromHTML(response.text, 'textarea#description-input'), seedVideoWithMissingTitle.description);
      assert.equal(parseValueFromHTML(response.text, 'input#url-input'), seedVideoWithMissingTitle.url);
    });

    it('renders create page with error and preserved field values if url is missing', async () => {
      const response = await request(app).post('/videos').type('form').send(seedVideoWithMissingUrl);

      assert.equal(parseValueFromHTML(response.text, 'input#title-input'), seedVideoWithMissingUrl.title);
      assert.equal(parseTextFromHTML(response.text, 'textarea#description-input'), seedVideoWithMissingUrl.description);
      assert.equal(parseTextFromHTML(response.text, 'span#url-input-error'), 'Path `url` is required.');
    });
  });
});
