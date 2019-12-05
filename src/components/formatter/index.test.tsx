import { formatBalance, formatRatio, formatPrice } from './index';

test('format 100000000 to 100,000,000', () => {
    expect(formatBalance(100000000)).toBe('100,000,000');
});

test('format 10000.001 to 10,000.001', () => {
    expect(formatBalance(10000.001)).toBe('10,000.001');
});

test('format 100 to 100 ETH', () => {
    expect(formatBalance(100, 'ETH')).toBe('100 ETH');
});

test('format 0.1 to 10%', () => {
    expect(formatRatio(0.1)).toBe('10%');
});

test('format 10 to $10', () => {
    expect(formatPrice(10, '$')).toBe('$10');
});
