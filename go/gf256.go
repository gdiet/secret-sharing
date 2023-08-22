package main

import "log"

// Operations on the Galois field GF(256) that is defined by the `x^8 + x^4 + x^3 + x^1 + x^0` polynomial, with
// big-endian bit order for bytes. These are the same operations as used for AES encryption.
//
// Since the operations are for the GF(256) field, they are defined only for byte values [0..255].
//
// See https://en.wikipedia.org/wiki/Finite_field_arithmetic#Rijndael's_(AES)_finite_field */

func assertIsByte(value int) {
	if value < 0 || value > 255 {
		log.Fatal("Expected a byte value.")
	}
}

// The AES GF(256) addition is the 'xor' operation.
//
// See https://en.wikipedia.org/wiki/Finite_field_arithmetic#C_programming_example
func gf256Add(a int, b int) int {
	assertIsByte(a)
	assertIsByte(b)
	return a ^ b
}

// The AES GF(256) subtraction is the same 'xor' operation as the addition, because
// the subtraction must be the inverse of the addition, and 'xor' is the inverse of itself.
func gf256Sub(a int, b int) int {
	return gf256Add(a, b)
}

// The AES GF(256) multiplication. The constant 0x11b (binary 1.0001.1011, big-endian) represents the AES encryption
// `x^8 + x^4 + x^3 + x^1 + x^0` polynomial - the bits 8, 4, 3, 1, 0 are set in 0x11b.
//
// See https://en.wikipedia.org/wiki/Finite_field_arithmetic#C_programming_example
func gf256Mul(a, b int) int {
	assertIsByte(a)
	assertIsByte(b)
	result := 0
	for i := 0; i < 8; i++ {
		if b&1 != 0 {
			result ^= a
		}
		b >>= 1
		a <<= 1
		if a&0x100 != 0 {
			a ^= 0x11b // Represents x^8 + x^4 + x^3 + x^1 + x^0
		}
	}
	return result
}
