package main

import (
	"fmt"
	"os"
)

// A random generator returning integers between a (inclusive) and b (exclusive).
type Random func(a, b int) int // FIXME use bytes instead?

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
		polynomial[i] = byte(random(0, 256))
	}
	polynomial[arraySize-1] = byte(random(1, 256))
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
