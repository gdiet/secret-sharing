package shamir

/** This is an implementation of Shamir's secret sharing using the same Galois field GF(256) that is used by the AES
  * encryption, that is, the `x^8 + x^4 + x^3 + x^1 + x^0` polynomial, with the same big-endian bit order for bytes.
  * For string from/to byte sequence conversions, UTF-8 is used.
  *
  * @see https://en.wikipedia.org/wiki/Shamir%27s_secret_sharing
  * @see https://en.wikipedia.org/wiki/Finite_field_arithmetic#Rijndael's_(AES)_finite_field */
@main def main(): Unit =
  val shares = shareSecret(stringToBytes("test"), 4, 2, (_, _) => 5)
  println(shares.map(bytesToHex).mkString("\n"))

  import util.chaining.scalaUtilChainingOps
  val recovered = joinShares(Seq(shares(3), shares(1)))
  println()
  println(bytesToHex(recovered))
  println(new String(recovered.map(_.toByte), "UTF-8"))

def stringToBytes(string: String): Array[Int] = string.getBytes("UTF-8").map(byteToInt)
def bytesToHex(bytes: Array[Int]): String = bytes.map(byteToHex).mkString
def byteToHex(byte: Int ): String = f"$byte%02x"
def byteToInt(byte: Byte): Int    = java.lang.Byte.toUnsignedInt(byte)
