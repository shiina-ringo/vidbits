const {assert} = require('chai');
const {submitVideo} = require('../utils');

const seedVideo = { title: "Drinking Songs",
                       description: "By: Matt Elliott",
                       url: "https://www.youtube.com/embed/YDWEz1mia1I" };

describe('User visits video creation page', () => {
  describe('posts a new video', () => {
    it('and is rendered', () => {
      submitVideo(seedVideo);

      assert.include(browser.getText('body'), seedVideo.title);
      assert.include(browser.getText('body'), seedVideo.description);
      assert.equal(browser.getAttribute('iframe', 'src'), seedVideo.url);
    });
  });
});
