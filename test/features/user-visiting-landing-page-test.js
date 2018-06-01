const {assert} = require('chai');
const {submitVideo} = require('../utils');

const seedVideo = { title: "Drinking Songs",
                       description: "By: Matt Elliott",
                       url: "https://www.youtube.com/embed/YDWEz1mia1I" };

describe('User visits landing page', () => {
  // In addition to resetting the URL to the main page, this magically
  // flushes the database after each test item, allowing the tests to be
  // fully isolated.
  beforeEach(() => { browser.url('/'); });
  
  describe('with no existing videos', () => {
    it('shows no videos', () => {
      browser.url('/videos');

      assert.equal(browser.getText('#videos-container'), '');
    });
  });

  describe('can navigate', () => {
    it('to the create page', () => {
      browser.url('/videos');
      browser.click('a[href="/videos/create"]');
      
      assert.include(browser.getText('body'), 'Save a video');
    });

    it('to a single video', () => {
      submitVideo(seedVideo);
      
      browser.url('/videos');
      browser.click('#video-title-link');

      assert.include(browser.getText('body'), seedVideo.title);
      assert.include(browser.getText('body'), seedVideo.description);
      assert.equal(browser.getAttribute('iframe', 'src'), seedVideo.url);
    });
  });

  describe('can view submitted videos', () => {
    it('newly submitted video appears', () => {
      submitVideo(seedVideo);
      
      browser.url('/videos');
      assert.include(browser.getText('#videos-container'), seedVideo.title);
      assert.equal(browser.getAttribute('iframe', 'src'), seedVideo.url);
    });
  });
});
