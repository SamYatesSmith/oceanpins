const { createClusterContent } = require('../../static/javascript/map.js');

test('createClusterContent should create a div with the correct content and styles', () => {
    const div = createClusterContent(10);
    
    expect(div.className).toBe('cluster-marker');
    expect(div.textContent).toBe('10');
    expect(div.style.backgroundColor).toBe('rgba(0, 123, 255, 0.6)');
    expect(div.style.borderRadius).toBe('50%');
    expect(div.style.color).toBe('white');
    expect(div.style.width).toBe('40px');
    expect(div.style.height).toBe('40px');
    expect(div.style.display).toBe('flex');
    expect(div.style.alignItems).toBe('center');
    expect(div.style.justifyContent).toBe('center');
});