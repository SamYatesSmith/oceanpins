const { clearLocalStorage } = require('../../static/javascript/map.js');

test('clearLocalStorage should clear local and session storage', () => {
    localStorage.setItem('test', 'value');
    sessionStorage.setItem('test', 'value');
    
    clearLocalStorage();
    
    expect(localStorage.getItem('test')).toBeNull();
    expect(sessionStorage.getItem('test')).toBeNull();
});