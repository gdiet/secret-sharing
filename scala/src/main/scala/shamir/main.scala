package shamir

val random = scala.util.Random.between(_: Int, _: Int)

/** Shamir's secret sharing implemented using the Galois field GF(256) used by the AES encryption,
  * the `x^8 + x^4 + x^3 + x^1 + x^0` polynomial, with big-endian bit order for bytes. The secret
  * is the `y` value at `x = 0`.
  *
  * For string from/to byte sequence conversions, UTF-8 is used.
  *
  * @see https://en.wikipedia.org/wiki/Shamir%27s_secret_sharing
  * @see https://en.wikipedia.org/wiki/Finite_field_arithmetic#Rijndael's_(AES)_finite_field */
@main def main(args: String*): Unit =
  args match

    case Seq("share", stringSecret, numberOfShares, threshold) =>
      val secret = toBytes(stringSecret)
      val shares = shareSecret(secret, numberOfShares.toInt, threshold.toInt, random)
      println(s"The secret as hex string: ${toHex(secret)}")
      println(s"Shares for the secret '$stringSecret:")
      println(shares.map(toHex).mkString("\n"))

    case Seq("shareHex", hexSecret, numberOfShares, threshold) =>
      val secret = fromHex(hexSecret)
      val shares = shareSecret(secret, numberOfShares.toInt, threshold.toInt, random)
      println(s"Shares for the hex secret ${toHex(secret)}:")
      println(shares.map(toHex).mkString("\n"))

    case "join" +: hexShares =>
      val shares = hexShares.map(fromHex)
      val recovered = joinShares(shares)
      println(s"Secret recovered from joined shares:")
      println(s"Hex   : ${toHex(recovered)}")
      println(s"String: ${asString(recovered)}")

    case _ =>
      println("Shamir's secret sharing - use with the following parameters:")
      println("'share' <secret> <number of shares> <threshold>")
      println("'shareHex' <secret as hex string> <number of shares> <threshold>")
      println("'join' <share1> <share2> ...")

def toBytes (string: String    ): Array[Int] = string.getBytes("UTF-8").map(toInt)
def toInt   (byte  : Byte      ): Int        = java.lang.Byte.toUnsignedInt(byte)
def toHex   (bytes : Array[Int]): String     = bytes.map(toHex).mkString
def toHex   (byte  : Int       ): String     = f"$byte%02x"
def fromHex (string: String    ): Array[Int] = string.sliding(2, 2).map(Integer.parseInt(_, 16)).toArray
def asString(bytes : Array[Int]): String     = new String(bytes.map(_.toByte), "UTF-8")
