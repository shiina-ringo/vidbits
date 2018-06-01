const {jsdom} = require('jsdom');
const {mongoose, databaseUrl, options} = require('../database');

const connectDatabase = async () => {
  await mongoose.connect(databaseUrl, options);
  await mongoose.connection.db.dropDatabase();
};

const disconnectDatabase = async () => {
  await mongoose.disconnect();
};

// extract text from an Element by selector.
const parseTextFromHTML = (htmlAsString, selector) => {
  const selectedElement = jsdom(htmlAsString).querySelector(selector);
  if (selectedElement !== null) {
    return selectedElement.textContent;
  } else {
    throw new Error(`No element with selector ${selector} found in HTML string`);
  }
};

// extract value from an Element by selector.
const parseValueFromHTML = (htmlAsString, selector) => {
  const selectedElement = jsdom(htmlAsString).querySelector(selector);
  if (selectedElement !== null) {
    return selectedElement.value;
  } else {
    throw new Error(`No element with selector ${selector} found in HTML string`);
  }
};

// extract src from an Element by selector.
const parseSrcFromHTML = (htmlAsString, selector) => {
  const selectedElement = jsdom(htmlAsString).querySelector(selector);
  if (selectedElement !== null) {
    return selectedElement.src;
  } else {
    throw new Error(`No element with selector ${selector} found in HTML string`);
  }
};

const submitVideo = video => {
  browser.url('/videos/create');
  browser.setValue('#title-input', video.title);
  browser.setValue('#description-input', video.description);
  browser.setValue('#url-input', video.url);
  browser.click('#submit-button');
};

module.exports = {
  connectDatabase,
  disconnectDatabase,
  parseTextFromHTML,
  parseValueFromHTML,
  parseSrcFromHTML,
  submitVideo,
};
