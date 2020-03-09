import FixedU128 from './fixed_u128';

test('fromNatural 10', () => {
    expect(FixedU128.fromNatural(10)).toStrictEqual(new FixedU128(10 * 10 ** 18));
});

test('fromParts 10', () => {
    expect(FixedU128.fromParts(10)).toStrictEqual(new FixedU128(10));
});

test('from_rational 10 / 5', () => {
    expect(FixedU128.fromRational(10, 5)).toStrictEqual(FixedU128.fromRational(20, 10));
});

test('FixedU128(10) * FixedU128(20)', () => {
    const a = FixedU128.fromNatural(10);
    const b = FixedU128.fromNatural(20);
    expect(a.mul(b)).toStrictEqual(new FixedU128(200 * FixedU128.PRECISION));
});

test('FixedU128(10) + FixedU128(20)', () => {
    const a = FixedU128.fromNatural(10);
    const b = FixedU128.fromNatural(20);
    expect(a.add(b)).toStrictEqual(new FixedU128(30 * FixedU128.PRECISION));
});

test('FixedU128(10) - FixedU128(20)', () => {
    const a = FixedU128.fromNatural(10);
    const b = FixedU128.fromNatural(20);
    expect(a.sub(b)).toStrictEqual(new FixedU128(-10 * FixedU128.PRECISION));
});

test('FixedU128(10) / FixedU128(20)', () => {
    const a = FixedU128.fromNatural(10);
    const b = FixedU128.fromNatural(20);
    expect(a.div(b)).toStrictEqual(new FixedU128(0.5 * FixedU128.PRECISION));
});

test('FixedU128(10) toString is 10', () => {
    const a = FixedU128.fromNatural(10);
    expect(a.toString()).toBe('10');
});

test('FixedU128(10000000000000000000000) toString is 10000000000000000000000', () => {
    const a = FixedU128.fromNatural(10000000000000000000000);
    expect(a.toString()).toBe('10000000000000000000000');
});
