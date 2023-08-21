package shamir

/** A random generator returning a integers between a (inclusive) and b (exclusive). */
type RandomInt = (Int, Int) => Int


/** Split a secret into shares using Shamir's secret sharing algorithm.
  * Use the AES GF(256) operations for calculations and assume that the `x` value of the secret is `0`.
  * The 'x' values of the shares are stored in the shares' first byte.
  *
  * @param secretBytes The bytes to create shares for.
  * @param numOfShares The number of shares to create.
  * @param threshold The minimum number of shares needed to recreate the secret.
  * @param random The random number generator to use.
  * @return The shares created.
  *
  * @see https://en.wikipedia.org/wiki/Shamir%27s_secret_sharing */
def shareSecret(secretBytes: Array[Int], numOfShares: Int, threshold: Int, random: RandomInt): Seq[Array[Int]] =
  require(numOfShares <= 255, "No more than 255 shares supported.")
  require(numOfShares > 1, "At least 2 shares are required.")
  require(threshold <= numOfShares, "The threshold can not be larger than the number of shares.")
  require(threshold >= 2, "The threshold must be at least 2.")
  require(secretBytes.forall(byte => byte >= 0 && byte <= 255), "Secret bytes must be in the range 0..255.")
  val polynomials = secretBytes.map { byte => generatePolynomial(byte, random, threshold - 1) }
  (1 to numOfShares).map { share => share +: polynomials.map { polynomial => evaluate(polynomial, share) } }

private def generatePolynomial(firstByte: Int, random: RandomInt, arraySize: Int): Array[Int] =
  firstByte +: Array.fill(arraySize - 2)(random(0, 256)) :+ random(1, 256)

/** @see https://en.wikipedia.org/wiki/Horner%27s_method */
private def evaluate(polynomial: Array[Int], share: Int): Int =
  polynomial.foldRight(0) { (e, result) => gf256.add(gf256.mul(result, share), e) }


/** Join the given shares using Shamir's secret sharing algorithm to recover the original secret.
  * Use the AES GF(256) operations for calculations and assume that the `x` value of the secret is `0`.
  * The 'x' values of the shares are read from the shares' first byte.
  *
  * Note: If the shares are incorrect, or their number is under the threshold value that was used when
  * generating the shares, the output will be meaningless.
  *
  * @param shares The shares to join.
  * @return The original secret.
  *
  * @see https://en.wikipedia.org/wiki/Shamir%27s_secret_sharing */
def joinShares(shares: Seq[Array[Int]]): Array[Int] =
  require(shares.nonEmpty, "No shares provided.")
  require(shares.map(_.length).toSet.size == 1, "Varying lengths of shares.")
  require(shares.flatten.forall(byte => byte >= 0 && byte <= 255), "Share bytes must be in the range 0..255.")
  require(shares.map(_.toSeq).toSet.size == shares.length, "Duplicate share detected.")
  val length = shares.head.length
  (for {
    index <- 1 until length
    points = shares.map(share => share(0) -> share(index))
  } yield interpolate(points)
  ).toArray

/** @return The Lagrange interpolation of the polynomial defined by the data values at x = 0.
  *
  * @see https://en.wikipedia.org/wiki/Lagrange_polynomial */
private def interpolate(data: Iterable[(Int, Int)]): Int =
  data.zipWithIndex.foldLeft(0) { case (r, (x1 -> y, i)) =>
    val t = data.zipWithIndex.foldLeft(1) { case (t, (x2 -> _, j)) =>
      // The divisor x2 is (x - x2) which is (0 - x2), and 'minus' being 'xor' is just x2.
      if i == j then t else gf256.mul(t, gf256.div(x2, gf256.sub(x1, x2)))
    }
    gf256.add(r, gf256.mul(t, y))
  }
