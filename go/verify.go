package main

import (
	"encoding/hex"
	"fmt"
	"os"
	"regexp"
	"strings"
)

func pseudorandom(bytes []byte) Random {
	index := -1
	return func(byte) byte {
		index++
		if index == len(bytes) {
			index = 0
		}
		return bytes[index]
	}
}

func _map[T, U any](data []T, f func(T) U) []U {
	res := make([]U, 0, len(data))
	for _, e := range data {
		res = append(res, f(e))
	}
	return res
}

func shareLines(shares [][]byte) string {
	return strings.Join(_map(shares, toHex), "\n")
}

func verify() {
	{
		fmt.Println("Check 1: Create pseudorandom shares with threshold 2")
		secret, _ := hex.DecodeString("003880ff")
		random := pseudorandom([]byte{0x05})
		shares := shareSecret(secret, 8, 2, random)
		shareLines := shareLines(shares)
		expect := `01053d85fa
			       020a328af5
			       030f378ff0
			       04142c94eb
			       05112991ee
			       061e269ee1
			       071b239be4
			       082810a8d7`
		expectLines := regexp.MustCompile(`[\t ]`).ReplaceAllString(expect, "")
		if shareLines != expectLines {
			fmt.Printf("Not OK, expected\n%s\n\ngot\n%s\n", expectLines, shareLines)
		}
	}
	{
		fmt.Println("Check 2: Create pseudorandom shares with threshold 3")
		secret, _ := hex.DecodeString("003880ff")
		random := pseudorandom([]byte{0x05, 0xff})
		shares := shareSecret(secret, 8, 3, random)
		shareLines := shareLines(shares)
		expect := `01fac27a05
			       02dbe35b24
			       032119a1de
			       047d45fd82
			       0587bf0778
			       06a69e2659
			       075c64dca3
			       0897af1768`
		expectLines := regexp.MustCompile(`[\t ]`).ReplaceAllString(expect, "")
		if shareLines != expectLines {
			fmt.Printf("Not OK, expected\n%s\n\ngot\n%s\n", expectLines, shareLines)
		}
	}
	{
		fmt.Println("Check 3: Create pseudorandom shares with threshold 6")
		secret, _ := hex.DecodeString("003880ff")
		random := pseudorandom([]byte{0x05, 0xff, 0x50, 0xc1, 0x01})
		shares := shareSecret(secret, 8, 6, random)
		shareLines := shareLines(shares)
		expect := `016a52ea95
			       02e9d16916
			       036a52ea95
			       047840f887
			       052119a1de
			       067e46fe81
			       07cef64e31
			       08d4ec542b`
		expectLines := regexp.MustCompile(`[\t ]`).ReplaceAllString(expect, "")
		if shareLines != expectLines {
			fmt.Printf("Not OK, expected\n%s\n\ngot\n%s\n", expectLines, shareLines)
		}
	}
	os.Exit(0)
}
