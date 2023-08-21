package main

import (
	"fmt"
	"os"
)

type Random func(a, b int) int

func require(condition bool, message string) {
	if !condition {
		fmt.Println(message)
		os.Exit(1)
	}
}

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

func evaluate(polynomial []int, share int) int {
	result := 0
	for i := len(polynomial) - 1; i >= 0; i-- {
		result = gf256Add(gf256Mul(result, share), polynomial[i])
	}
	return result
}

func gf256Add(a int, b int) int {
	return a ^ b
}

func gf256Mul(a, b int) int {
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
