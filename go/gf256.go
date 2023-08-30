package main

// Operations on the Galois field GF(256) that is defined by the `x^8 + x^4 + x^3 + x^1 + x^0` polynomial, with
// big-endian bit order for bytes. These are the same operations as used for AES encryption.
//
// Since the operations are for the GF(256) field, they are defined only for byte values [0..255].
//
// See https://en.wikipedia.org/wiki/Finite_field_arithmetic#Rijndael's_(AES)_finite_field */

// The AES GF(256) addition is the 'xor' operation.
//
// See https://en.wikipedia.org/wiki/Finite_field_arithmetic#C_programming_example
func gf256Add(a byte, b byte) byte {
	return a ^ b
}

// The AES GF(256) subtraction is the same 'xor' operation as the addition, because
// the subtraction must be the inverse of the addition, and 'xor' is the inverse of itself.
func gf256Sub(a byte, b byte) byte {
	return gf256Add(a, b)
}

// The AES GF(256) multiplication. The constant 0x11b (binary 1.0001.1011, big-endian) represents the AES encryption
// `x^8 + x^4 + x^3 + x^1 + x^0` polynomial - the bits 8, 4, 3, 1, 0 are set in 0x11b.
//
// See https://en.wikipedia.org/wiki/Finite_field_arithmetic#C_programming_example
func gf256Mul(a, b byte) byte {
	result := byte(0)
	for i := 0; i < 8; i++ {
		if b&1 != 0 {
			result ^= a
		}
		b >>= 1
		if a&0x80 == 0 {
			a <<= 1
		} else {
			a <<= 1
			a ^= 0x1b // 0x11b represents x^8 + x^4 + x^3 + x^1 + x^0 - bit 8 is already shifted out
		}
	}
	return result
}

func inverseTableGenerator() []byte {
	var inverseTable []byte
	for n := 1; n <= 255; n++ {
		for k := 1; k <= 255; k++ {
			if gf256Mul(byte(k), byte(n)) == 1 {
				inverseTable = append(inverseTable, byte(k))
				break
			}
		}
	}
	return inverseTable
}

// Lookup table for the AES GF(256) multiplicative inverse, shifted by one because `1/0` is not defined.
var inverseTable = inverseTableGenerator()

// The AES GF(256) division done as multiplication with the inverse `b^-1`.
func gf256Div(a, b byte) byte {
	if b == 0 {
		panic("Division by zero.")
	}
	return gf256Mul(a, inverseTable[b-1])
}
