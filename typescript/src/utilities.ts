namespace util {
  /**
   * Represents a value of one of two possible types. By convention, if the types are a valid/invalid or good/bad pair,
   * the valid or good type is "Right" and the invalid/bad type is "Left".
   */
  export abstract class Either<L, R> {
    abstract readonly value: L | R
    abstract get isRight(): boolean
    get isLeft(): boolean {
      return !this.isRight
    }
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

    validate(condition: boolean, orElse: L) {
      return this.isLeft || condition ? this : new Left<L, R>(orElse)
    }

    onLeft(f: (value: L) => any): void {
      this.fold(f, () => {})
    }

    onRight(f: (value: R) => any): void {
      this.fold(() => {}, f)
    }
  }

  export function either<L, R>(ifUndefined: () => L, value: undefined | R): Either<L, R> {
    return value ? new Right(value) : new Left(ifUndefined())
  }

  export function validate<L>(condition: boolean, orElse: L): Either<L, undefined> {
    return condition ? new Right<L, undefined>(undefined) : new Left<L, undefined>(orElse)
  }

  export class Left<L, R> extends Either<L, R> {
    override get isRight(): boolean {
      return false
    }
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

  export class Right<L, R> extends Either<L, R> {
    override get isRight(): boolean {
      return true
    }
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
