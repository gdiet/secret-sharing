namespace util {
  abstract class Either<L, R> {
    abstract readonly value: L | R
    abstract fold<T>(f1: (value: L) => T, f2: (value: R) => T): T

    flatMap<R2>(f: (value: R) => Either<L, R2>): Either<L, R2> {
      return this.fold(
        (l) => new Left(l),
        (r) => f(r),
      )
    }

    flatMapLeft<L2>(f: (value: L) => Either<L2, R>): Either<L2, R> {
      return this.fold(
        (l) => f(l),
        (r) => new Right(r),
      )
    }

    map<R2>(f: (value: R) => R2): Either<L, R2> {
      return this.fold<Either<L, R2>>(
        (l) => new Left(l),
        (r) => new Right(f(r)),
      )
    }

    mapLeft<L2>(f: (value: L) => L2): Either<L2, R> {
      return this.fold<Either<L2, R>>(
        (l) => new Left(f(l)),
        (r) => new Right(r),
      )
    }
  }

  function either<L, R>(ifUndefined: () => L, value: undefined | R): Either<L, R> {
    return value ? new Right(value) : new Left(ifUndefined())
  }

  class Left<L, R> extends Either<L, R> {
    readonly value: L
    constructor(value: L) {
      super()
      this.value = value
    }
    fold<T>(f: (value: L) => T, _: (value: R) => T): T {
      return f(this.value)
    }
    override toString = () => `Left(${this.value})`
  }

  class Right<L, R> extends Either<L, R> {
    readonly value: R
    constructor(value: R) {
      super()
      this.value = value
    }
    fold<T>(_: (value: L) => T, f: (value: R) => T): T {
      return f(this.value)
    }
    override toString = () => `Right(${this.value})`
  }
}
