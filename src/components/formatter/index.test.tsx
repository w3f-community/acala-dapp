import { formatBalance, formatRatio, formatPrice } from './index';

test('format 100000000 * 10 ** 18 to 100,000,000 ETH', () => {
    expect(formatBalance(100000000 * 10 ** 18, 'ETH')).toBe('100,000,000 ETH');
});

test('format 10000.0111 * 10 ** 18 to 10,000.01', () => {
    expect(formatBalance(10000.00111 * 10 ** 18)).toBe('10,000');
});

test('format 1 * 10**18 to 100%', () => {
    expect(formatRatio(1 * 10 ** 18)).toBe('100%');
});

test('format 10 * 10**18 to $10', () => {
    expect(formatPrice(10 * 10 ** 18, '$')).toBe('$10');
});

test('format 1.33333 * 10**18 to $1.33', () => {
    expect(formatPrice(1.3333 * 10 ** 18, '$')).toBe('$1.33');
});

test('format 1.3393 * 10**18 to $1.33', () => {
    expect(formatPrice(1.339 * 10 ** 18, '$')).toBe('$1.33');
});
