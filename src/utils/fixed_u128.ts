import BigNumber from 'bignumber.js';

type NumLike = number | string;

class FixedU128 {
    public inner: BigNumber;

    static PRECISION = 10 ** 18;

    constructor(origin: NumLike | BigNumber) {
        if (origin instanceof BigNumber) {
            this.inner = origin;
        } else {
            this.inner = new BigNumber(origin);
        }
        return this;
    }

    public toString(): string {
        return this.inner.div(FixedU128.PRECISION).toString();
    }

    public innerToString(): string {
        return this.inner.toFixed().split('.')[0];
    }

    public toNumber(precision?: number): number {
        let result = this.inner.div(FixedU128.PRECISION);
        if (precision) {
            result = result.decimalPlaces(precision, 1);
        }
        return result.toNumber();
    }

    static fromNatural(n: NumLike): FixedU128 {
        return new FixedU128(new BigNumber(n).times(FixedU128.PRECISION));
    }

    static fromParts(parts: NumLike): FixedU128 {
        return new FixedU128(parts);
    }

    static fromRational(n: NumLike, d: NumLike): FixedU128 {
        const _n = new BigNumber(n);
        const _d = new BigNumber(d);

        return new FixedU128(_n.times(FixedU128.PRECISION).div(_d));
    }

    public add(n: FixedU128): FixedU128 {
        return new FixedU128(this.inner.plus(n.inner));
    }

    public sub(n: FixedU128): FixedU128 {
        return new FixedU128(this.inner.minus(n.inner));
    }

    public mul(n: FixedU128): FixedU128 {
        return new FixedU128(this.inner.times(n.inner).div(FixedU128.PRECISION));
    }

    public div(n: FixedU128): FixedU128 {
        return new FixedU128(this.inner.div(n.inner).times(FixedU128.PRECISION));
    }

    // export BigNumber methods
    public isLessThan(n: FixedU128): boolean {
        return this.inner.isLessThan(n.inner);
    }
    public isGreaterThan(n: FixedU128): boolean {
        return this.inner.isGreaterThan(n.inner);
    }

    public negated(): FixedU128 {
        return new FixedU128(this.inner.negated());
    }

    public isZero(): boolean {
        return this.inner ? this.inner.isZero() : false;
    }
}

export default FixedU128;
