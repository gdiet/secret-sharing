package shamir

/** This is an implementation of Shamir's secret sharing using the same Galois field GF(256) that is used by the AES
  * encryption, that is, the `x^8 + x^4 + x^3 + x^1 + x^0` polynomial, with the same big-endian bit order for bytes.
  * For string from/to byte sequence conversions, UTF-8 is used.
  *
  * @see https://en.wikipedia.org/wiki/Shamir%27s_secret_sharing
  * @see https://en.wikipedia.org/wiki/Finite_field_arithmetic#Rijndael's_(AES)_finite_field */
@main def main(): Unit =
  println(f"0x53 + 0xca = 0x${gf256.add(0x53, 0xca)}%02x")
  println(f"0x53 - 0xca = 0x${gf256.sub(0x53, 0xca)}%02x")
  println(f"0x53 * 0xca = 0x${gf256.mul(0x53, 0xca)}%02x")
  println(f"0x53 / 0xca = 0x${gf256.div(0x53, 0xca)}%02x")
  println(f"0x53 / 0xb5 = 0x${gf256.div(0x53, 0xb5)}%02x")

