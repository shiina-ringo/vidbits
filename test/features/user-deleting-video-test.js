const {assert} = require('chai');
const {submitVideo} = require('../utils');

const seedVideo = { title: "Drinking Songs",
                       description: "By: Matt Elliott",
                       url: "https://www.youtube.com/embed/YDWEz1mia1I" };

describe('User deletes single video', () => {
  describe('can delete the video', () => {
    it('video disappears', () => {
      submitVideo(seedVideo);
      
      browser.click('#delete');

      assert.notInclude(browser.getText('body'), seedVideo.title);
    });
  });
});

