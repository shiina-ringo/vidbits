const {assert} = require('chai');
const {submitVideo} = require('../utils');

const seedVideo = { title: "Drinking Songs",
                    description: "By: Matt Elliott",
                    url: "https://www.youtube.com/embed/YDWEz1mia1I" };

const newTitle = "Depressing Music";

describe('User updates single video', () => {
  describe('can edit the title', () => {
    it('new title appears', () => {
      submitVideo(seedVideo);
      
      browser.click('#edit');
      browser.setValue('#title-input', newTitle);
      browser.click('#submit-button');

      assert.include(browser.getText('body'), newTitle);
    });

    it('old title disappears', () => {
      submitVideo(seedVideo);
      
      browser.click('#edit');
      browser.setValue('#title-input', newTitle);
      browser.click('#submit-button');

      assert.notInclude(browser.getText('body'), seedVideo.title);
    });
  });
});

