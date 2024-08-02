const { formatLocation } = require('../../static/javascript/map.js');

test('formatLocation should format location correctly', () => {
    const location = {
        lat: () => 34.052235,
        lng: () => -118.243683
    };
    
    const formattedLocation = formatLocation(location);
    expect(formattedLocation).toBe('34.052235, -118.243683');
});