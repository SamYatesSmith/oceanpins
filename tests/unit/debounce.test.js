const { debounce } = require('../../static/javascript/map.js');

jest.useFakeTimers();

test('debounce should delay the execution of the function', () => {
    const mockFn = jest.fn();
    const debouncedFn = debounce(mockFn, 200);
    
    debouncedFn();
    expect(mockFn).not.toBeCalled();
    
    jest.advanceTimersByTime(200);
    expect(mockFn).toBeCalled();
});