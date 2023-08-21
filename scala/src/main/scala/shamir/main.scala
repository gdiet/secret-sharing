package shamir

val random: RandomInt = java.security.SecureRandom().nextInt(_, _)

/** Shamir's secret sharing implemented using the Galois field GF(256) used by the AES encryption,
  * the `x^8 + x^4 + x^3 + x^1 + x^0` polynomial, with big-endian bit order for bytes. The secret
  * is the `y` value at `x = 0`. The 'x' values of the shares are stored in the shares' first byte.
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

    case Seq("shareSilent", stringSecret, numberOfShares, threshold) =>
      val secret = toBytes(stringSecret)
      val shares = shareSecret(secret, numberOfShares.toInt, threshold.toInt, random)
      println(shares.map(toHex).mkString("\n"))

    case Seq("shareHex", hexSecret, numberOfShares, threshold) =>
      val secret = fromHex(hexSecret)
      val shares = shareSecret(secret, numberOfShares.toInt, threshold.toInt, random)
      println(s"Shares for the hex secret ${toHex(secret)}:")
      println(shares.map(toHex).mkString("\n"))

    case Seq("shareHexSilent", hexSecret, numberOfShares, threshold) =>
      val secret = fromHex(hexSecret)
      val shares = shareSecret(secret, numberOfShares.toInt, threshold.toInt, random)
      println(shares.map(toHex).mkString("\n"))

    case "join" +: hexShares =>
      val shares = hexShares.map(fromHex)
      val recovered = joinShares(shares)
      println(s"Secret recovered from joined shares:")
      println(asString(recovered))

    case "joinSilent" +: hexShares =>
      val shares = hexShares.map(fromHex)
      val recovered = joinShares(shares)
      println(asString(recovered))

    case "joinHex" +: hexShares =>
      val shares = hexShares.map(fromHex)
      val recovered = joinShares(shares)
      println(s"Hex secret recovered from joined shares:")
      println(toHex(recovered))

    case "joinHexSilent" +: hexShares =>
      val shares = hexShares.map(fromHex)
      val recovered = joinShares(shares)
      println(toHex(recovered))

    case _ =>
      println("Shamir's secret sharing - use with the following parameters:")
      println("'share' <secret> <number of shares> <threshold>")
      println("'shareSilent' <secret> <number of shares> <threshold>")
      println("'shareHex' <secret as hex string> <number of shares> <threshold>")
      println("'shareHexSilent' <secret as hex string> <number of shares> <threshold>")
      println("'join' <share1> <share2> ...")
      println("'joinSilent' <share1> <share2> ...")
      println("'joinHex' <share1> <share2> ...")
      println("'joinHexSilent' <share1> <share2> ...")

def toBytes (string: String    ): Array[Int] = string.getBytes("UTF-8").map(toInt)
def toInt   (byte  : Byte      ): Int        = java.lang.Byte.toUnsignedInt(byte)
def toHex   (bytes : Array[Int]): String     = bytes.map(toHex).mkString
def toHex   (byte  : Int       ): String     = f"$byte%02x"
def fromHex (string: String    ): Array[Int] = string.sliding(2, 2).map(Integer.parseInt(_, 16)).toArray
def asString(bytes : Array[Int]): String     = new String(bytes.map(_.toByte), "UTF-8")
