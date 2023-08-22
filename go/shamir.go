package main

import (
	"fmt"
	"os"
)

// A random generator returning integers between a (inclusive) and b (exclusive).
type Random func(a, b int) int

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
func shareSecret(secret []byte, numberOfShares int, threshold int, random Random) [][]int {
	require(numberOfShares <= 255, "No more than 255 shares supported.")
	require(numberOfShares > 1, "At least 2 shares are required.")
	require(threshold <= numberOfShares, "The threshold can not be larger than the number of shares.")
	require(threshold >= 2, "The threshold must be at least 2.")

	var polynomials [][]int
	for _, byteValue := range secret {
		polynomial := generatePolynomial(int(byteValue), random, threshold-1)
		polynomials = append(polynomials, polynomial)
	}

	shares := make([][]int, numberOfShares)
	for share := 1; share <= numberOfShares; share++ {
		shareValues := make([]int, len(polynomials))
		for i, polynomial := range polynomials {
			shareValues[i] = evaluate(polynomial, share)
		}
		shares[share-1] = append([]int{share}, shareValues...)
	}

	return shares
}

func generatePolynomial(firstByte int, random Random, arraySize int) []int {
	polynomial := make([]int, arraySize)
	polynomial[0] = firstByte
	for i := 1; i < arraySize-1; i++ {
		polynomial[i] = random(0, 256)
	}
	polynomial[arraySize-1] = random(1, 256)
	return polynomial
}

// See https://en.wikipedia.org/wiki/Horner%27s_method
func evaluate(polynomial []int, share int) int {
	result := 0
	for i := len(polynomial) - 1; i >= 0; i-- {
		result = gf256Add(gf256Mul(result, share), polynomial[i])
	}
	return result
}
