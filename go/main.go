package main

import (
	"fmt"
	"math/rand"
	"os"
	"strconv"
	"time"
)

func main() {
	// str := "Hello, 世界"
	// byteArray := []byte(str)

	// fmt.Printf("Original string: %s\n", str)
	// fmt.Printf("Byte array: %v\n", byteArray)

	args := os.Args[1:]
	if len(args) == 0 {
		usage()
		return
	}
	switch args[0] {
	case "share", "shareSilent", "shareHex", "shareHexSilent":
		if len(args) != 4 {
			usage()
			return
		}
		stringSecret := args[1]
		secret := []byte(stringSecret)
		numberOfShares, err1 := strconv.Atoi(args[2])
		threshold, err2 := strconv.Atoi(args[3])
		if err1 != nil || err2 != nil {
			usage()
			return
		}
		random := getRandom()
		shares := shareSecret(secret, numberOfShares, threshold, random)
		fmt.Println("shares:")
		fmt.Println(shares)
	}
}

func getRandom() Random {
	if fakerandomInt, err := strconv.Atoi(os.Getenv("fakerandom")); err == nil {
		fmt.Printf("Using fake random value %d.\n", fakerandomInt)
		return func(a, b int) int { return fakerandomInt }
	} else {
		rand.Seed(time.Now().UnixNano())
		return func(a, b int) int { return rand.Intn(b-a) + a }
	}
}

func usage() {
	fmt.Println("Shamir's secret sharing - use with the following parameters:")
	fmt.Println("'share' <secret> <number of shares> <threshold>")
	fmt.Println("'shareSilent' <secret> <number of shares> <threshold>")
	fmt.Println("'shareHex' <secret as hex string> <number of shares> <threshold>")
	fmt.Println("'shareHexSilent' <secret as hex string> <number of shares> <threshold>")
	fmt.Println("'join' <share1> <share2> ...")
	fmt.Println("'joinSilent' <share1> <share2> ...")
	fmt.Println("'joinHex' <share1> <share2> ...")
	fmt.Println("'joinHexSilent' <share1> <share2> ...")
}
