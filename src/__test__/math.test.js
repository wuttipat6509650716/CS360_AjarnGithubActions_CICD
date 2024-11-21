const math = require('../math');

test('adds 2 + 3 to equal 5', () => {
    expect(math.add(2, 3)).toBe(5);
});

test('subtracts 7 - 4 to equal 3', () => {
    expect(math.subtract(7, 4)).toBe(3);
});

test('multiplies 3 * 5 to equal 15', () => {
    expect(math.multiply(3, 5)).toBe(15);
});
