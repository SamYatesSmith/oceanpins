const { getCookie } = require('../../static/javascript/map.js');
// Mocking document.cookie for getCookie test
Object.defineProperty(document, 'cookie', {
  value: '',
  writable: true,
});

test('getCookie should return the correct cookie value', () => {
    document.cookie = "csrftoken=abc123";
    const value = getCookie('csrftoken');
    expect(value).toBe('abc123');
});