// jest.setup.js

const $ = require('jquery');
global.$ = global.jQuery = $;

// Mock DOM elements
document.body.innerHTML = `
  <div id="addDiveForm"></div>
  <div id="diveLocation"></div>
  <div id="mapHelpContainer"></div>
  <div id="toggleArrow"></div>
  <button id="toggleGuide"></button>
  <div id="guideList">Guide Content</div>
`;

// Optionally, you can set some default values or add more elements as needed
document.getElementById('addDiveForm').onsubmit = () => {};
document.getElementById('diveLocation').value = '34.052235, -118.243683';