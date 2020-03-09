import { formatBalance, formatRatio, formatPrice } from './index';
import FixedU128 from '@honzon-platform/apps/utils/fixed_u128';

test('format 100000000 * 10 ** 18 to 100,000,000 ETH', () => {
    expect(formatBalance(FixedU128.fromNatural(100000000), 'ETH')).toBe('100,000,000 ETH');
});

test('format 10000.0111 * 10 ** 18 to 10,000.01', () => {
    expect(formatBalance(FixedU128.fromNatural(10000.00111))).toBe('10,000');
});

test('format 1 * 10**18 to 100%', () => {
    expect(formatRatio(FixedU128.fromNatural(1))).toBe('100%');
});

test('format 10 * 10**18 to $10', () => {
    expect(formatPrice(FixedU128.fromNatural(10), '$')).toBe('$10');
});

test('format 1.33333 * 10**18 to $1.33', () => {
    expect(formatPrice(FixedU128.fromNatural(1.3333), '$')).toBe('$1.33');
});

test('format 1.3393 * 10**18 to $1.33', () => {
    expect(formatPrice(FixedU128.fromNatural(1.339), '$')).toBe('$1.33');
});
