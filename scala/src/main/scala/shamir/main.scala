package shamir

/** Shamir's secret sharing implemented using the Galois field GF(256) used by the AES encryption,
  * the `x^8 + x^4 + x^3 + x^1 + x^0` polynomial, with big-endian bit order for bytes.
  * 
  * For string from/to byte sequence conversions, UTF-8 is used.
  *
  * @see https://en.wikipedia.org/wiki/Shamir%27s_secret_sharing
  * @see https://en.wikipedia.org/wiki/Finite_field_arithmetic#Rijndael's_(AES)_finite_field */
@main def main(): Unit =
  val random = scala.util.Random.between(_: Int, _: Int)
  val shares = shareSecret(toBytes("test"), 4, 2, random)
  println(shares.map(toHex).mkString("\n"))

  val recovered = joinShares(Seq(shares(3), shares(1)))
  println()
  println(toHex(recovered))
  println(new String(recovered.map(_.toByte), "UTF-8"))

def toBytes(string: String    ): Array[Int] = string.getBytes("UTF-8").map(toInt)
def toInt  (byte  : Byte      ): Int        = java.lang.Byte.toUnsignedInt(byte)
def toHex  (bytes : Array[Int]): String     = bytes.map(toHex).mkString
def toHex  (byte  : Int       ): String     = f"$byte%02x"
