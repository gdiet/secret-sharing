package main

import (
	"fmt"
	"os"
)

// A random generator returning byte values of at least limit.
type Random func(limit byte) byte

func require(condition bool, message string) {
	if !condition {
		fmt.Println(message)
		os.Exit(1)
	}
}

// Split a secret into shares using Shamir's secret sharing algorithm.
// Use the AES GF(256) operations for calculations and assume that the `x` value of the secret is `0`.
// The `x` values of the shares are stored in the shares' first byte.
//
// secretBytes: The bytes to create shares for.
// numOfShares: The number of shares to create.
// threshold: The minimum number of shares needed to recreate the secret.
// random: The random number generator to use.
//
// returns the shares created.
//
// See https://en.wikipedia.org/wiki/Shamir%27s_secret_sharing
func shareSecret(secret []byte, numberOfShares byte, threshold byte, random Random) [][]byte {
	require(threshold <= numberOfShares, "The threshold can not be larger than the number of shares.")
	require(threshold >= 2, "The threshold must be at least 2.")

	var polynomials [][]byte
	for _, byteValue := range secret {
		polynomial := generatePolynomial(byteValue, random, threshold)
		polynomials = append(polynomials, polynomial)
	}

	shares := make([][]byte, numberOfShares)
	for share := byte(1); share <= numberOfShares; share++ {
		shareValues := make([]byte, len(polynomials))
		for i, polynomial := range polynomials {
			shareValues[i] = evaluate(polynomial, share)
		}
		shares[share-1] = append([]byte{share}, shareValues...)
	}

	return shares
}

func generatePolynomial(firstByte byte, random Random, arraySize byte) []byte {
	polynomial := make([]byte, arraySize)
	polynomial[0] = firstByte
	for i := byte(1); i < arraySize-1; i++ {
		polynomial[i] = byte(random(0))
	}
	polynomial[arraySize-1] = byte(random(1))
	return polynomial
}

// See https://en.wikipedia.org/wiki/Horner%27s_method
func evaluate(polynomial []byte, share byte) byte {
	result := byte(0)
	for i := len(polynomial) - 1; i >= 0; i-- {
		result = gf256Add(gf256Mul(result, share), polynomial[i])
	}
	return result
}

type XY = struct{ x, y byte }

// Join the given shares using Shamir's secret sharing algorithm to recover the original secret.
// Use the AES GF(256) operations for calculations and assume that the `x` value of the secret is `0`.
// The 'x' values of the shares are read from the shares' first byte.
//
// Note: If the shares are incorrect, or their number is less than the threshold value that was used
// when generating the shares, the output will be meaningless.
//
// @see https://en.wikipedia.org/wiki/Shamir%27s_secret_sharing
func joinShares(shares [][]byte) []byte {
	if len(shares) < 2 {
		panic("At least two shares needed.")
	}
	// FIXME
	// require(shares.map(_.length).toSet.size == 1, "Varying lengths of shares.")
	// require(shares.flatten.forall(byte => byte >= 0 && byte <= 255), "Share bytes must be in the range 0..255.")
	// require(shares.map(_.toSeq).toSet.size == shares.length, "Duplicate share detected.")
	length := len(shares[0])
	if length <= 1 {
		panic("Shares not long enough.")
	}
	interpolatedValues := make([]byte, length-1)
	for index := 1; index < length; index++ {
		points := make([]XY, len(shares))
		for i, share := range shares {
			points[i] = XY{x: share[0], y: share[index]}
		}
		interpolatedValues[index-1] = interpolate(points)
	}
	return interpolatedValues
}

// Return the Lagrange interpolation of the polynomial defined by the data values at x = 0.
//
// See https://en.wikipedia.org/wiki/Lagrange_polynomial
func interpolate(data []XY) byte {
	r := byte(0)
	for i, point := range data {
		t := byte(1)
		for j, otherPoint := range data {
			if i == j {
				continue
			}
			// The divisor x2 is (x - x2) which is (0 - x2), and 'minus' being 'xor' is just x2.
			t = gf256Mul(t, gf256Div(otherPoint.x, gf256Sub(point.x, otherPoint.x)))
		}
		r = gf256Add(r, gf256Mul(t, point.y))
	}
	return r
}
