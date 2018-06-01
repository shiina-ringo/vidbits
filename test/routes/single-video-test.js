const {assert} = require('chai');
const request = require('supertest');

const app = require('../../app');
const Video = require('../../models/video');

const {connectDatabase, disconnectDatabase, parseTextFromHTML, parseValueFromHTML, parseSrcFromHTML} = require('../utils');

const seedVideo = { title: "Drinking Songs",
		       description: "By: Matt Elliott",
		       url: "https://www.youtube.com/embed/YDWEz1mia1I" };

const updatedVideo = { title: "For the Damaged Coda",
			  description: "By: Blonde Redhead",
			  url: "https://www.youtube.com/embed/4Js-XbNj6Tk" };

const updatedVideoWithMissingTitle = { description: "By: Blonde Redhead",
				       url: "https://www.youtube.com/embed/4Js-XbNj6Tk" };

describe('Server path: /videos/:videoId', () => {
  beforeEach(connectDatabase);
  afterEach(disconnectDatabase);

  describe('GET', () => {
    it('video is rendered', async () => {
      const video = await Video.create(seedVideo);
      const response = await request(app).get('/videos/' + video._id);

      assert.include(response.text, seedVideo.title);
      assert.include(parseSrcFromHTML(response.text, "iframe"), seedVideo.url);
    });
  });
});

describe('Server path: /videos/:videoId/edit', () => {
  beforeEach(connectDatabase);
  afterEach(disconnectDatabase);

  describe('GET', () => {
    it('renders pre-populated form', async () => {
      const video = await Video.create(seedVideo);
      const response = await request(app).get('/videos/' + video._id + '/edit');

      assert.include(parseValueFromHTML(response.text, "input#title-input"), seedVideo.title);
      assert.include(parseTextFromHTML(response.text, "textarea#description-input"), seedVideo.description);
      assert.include(parseValueFromHTML(response.text, "input#url-input"), seedVideo.url);
    });
  });
});

describe('Server path: /videos/:videoId/updates', () => {
  beforeEach(connectDatabase);
  afterEach(disconnectDatabase);

  describe('POST', () => {
    it('updates the record', async () => {
      const video = await Video.create(seedVideo);
      const response = await request(app).post('/videos/' + video._id + '/updates').type('form').send(updatedVideo);

      const foundVideo = await Video.findById(video._id);
      
      assert.equal(foundVideo.title, updatedVideo.title);
      assert.equal(foundVideo.description, updatedVideo.description);
      assert.equal(foundVideo.url, updatedVideo.url);
    });

    it('redirects to show page after update', async () => {
      const video = await Video.create(seedVideo);
      const response = await request(app).post('/videos/' + video._id + '/updates').type('form').send(updatedVideo);

      assert.equal(response.status, 302);
      assert.equal(response.headers.location, '/videos/' + video._id);
    });

    it('does not update video if title is missing', async () => {
      const video = await Video.create(seedVideo);
      const response = await request(app).post('/videos/' + video._id + '/updates').type('form').send(updatedVideoWithMissingTitle);

      const foundVideo = await Video.findById(video._id);

      assert.equal(foundVideo.title, seedVideo.title);
      assert.equal(foundVideo.description, seedVideo.description);
      assert.equal(foundVideo.url, seedVideo.url);
    });
    
    it('responds with status 400 if title is missing', async () => {
      const video = await Video.create(seedVideo);
      const response = await request(app).post('/videos/' + video._id + '/updates').type('form').send(updatedVideoWithMissingTitle);

      assert.equal(response.status, 400);
    });

    it('renders edit form with error and preserved field values if title is missing', async () => {
      const video = await Video.create(seedVideo);
      const response = await request(app).post('/videos/' + video._id + '/updates').type('form').send(updatedVideoWithMissingTitle);
      
      assert.equal(parseTextFromHTML(response.text, 'span#title-input-error'), 'Path `title` is required.');
      assert.equal(parseTextFromHTML(response.text, 'textarea#description-input'), updatedVideo.description);
      assert.equal(parseValueFromHTML(response.text, 'input#url-input'), updatedVideo.url);
    });
  });
});

describe('Server path: /videos/:videoId/deletions', () => {
  beforeEach(connectDatabase);
  afterEach(disconnectDatabase);

  describe('POST', () => {
    it('deletes the record', async () => {
      const video = await Video.create(seedVideo);
      const response = await request(app).post('/videos/' + video._id + '/deletions').type('form').send();

      const foundVideo = await Video.findById(video._id);
      
      assert.isNull(foundVideo);
    });
  });
});
