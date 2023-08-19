package shamir

/** A random generator returning a integers between a (inclusive) and b (exclusive). */
type RandomInt = (Int, Int) => Int

/** Split a secret into shares using Shamir's secret sharing algorithm. Use the AES GF(256) operations for calculations.
  *
  * @param secretBytes The bytes to create shares for.
  * @param numOfShares The number of shares to create.
  * @param threshold The minimum number of shares needed to recreate the secret.
  * @param random The random number generator to use.
  * @return The shares created.
  *
  * @see https://en.wikipedia.org/wiki/Shamir%27s_secret_sharing */
def shareSecret(secretBytes: Array[Int], numOfShares: Int, threshold: Int, random: RandomInt): Map[Int, Array[Int]] =
  val polynomials = secretBytes.map { byte => generatePolynomial(byte, random, threshold - 1) }
  (1 to numOfShares).map { share => share -> polynomials.map { polynomial => evaluate(polynomial, share) } }.toMap

private def generatePolynomial(firstByte: Int, random: RandomInt, arraySize: Int): Array[Int] =
  firstByte +: Array.fill(arraySize - 2)(random(0, 256)) :+ random(1, 256)

/** @see https://en.wikipedia.org/wiki/Horner%27s_method */
private def evaluate(polynomial: Array[Int], share: Int): Int =
  polynomial.foldRight(0) { (e, result) => gf256.add(gf256.mul(result, share), e) }
