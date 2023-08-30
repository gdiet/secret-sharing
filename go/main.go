package main

import (
	"encoding/hex"
	"fmt"
	"math/rand"
	"os"
	"strconv"
	"time"
)

// Shamir's secret sharing implemented using the Galois field GF(256) used by the AES encryption,
// the `x^8 + x^4 + x^3 + x^1 + x^0` polynomial, with big-endian bit order for bytes. The secret
// is the `y` value at `x = 0`. The 'x' values of the shares are stored in the shares' first byte.
//
// For string from/to byte sequence conversions, UTF-8 is used.
//
// See https://en.wikipedia.org/wiki/Shamir%27s_secret_sharing
// See https://en.wikipedia.org/wiki/Finite_field_arithmetic#Rijndael's_(AES)_finite_field
func main() {
	args := os.Args[1:]
	if len(args) == 0 {
		usageAndExit(0)
	}
	switch args[0] {
	case "share", "shareSilent", "shareHex", "shareHexSilent":
		if len(args) != 4 {
			usageAndExit(1)
		}
		var secret []byte
		var err error
		numberOfShares, err1 := strconv.Atoi(args[2])
		if numberOfShares < 2 || numberOfShares > 255 {
			fail("<number of shares>: Expected a value between [2..255].")
		}
		threshold, err2 := strconv.Atoi(args[3])
		if threshold < 2 || threshold > 255 {
			fail("<threshold>: Expected a value between [2..255].")
		}
		if err1 != nil || err2 != nil {
			usageAndExit(1)
		}
		if args[0] == "share" {
			stringSecret := args[1]
			secret = []byte(stringSecret)
			hexSecret := hex.EncodeToString(secret)
			fmt.Printf("The secret as hex string: %s\n", hexSecret)
			fmt.Printf("Shares for the secret '%s':\n", stringSecret)
			fmt.Printf("To recover, you need %d of %d shares.\n", threshold, numberOfShares)
		} else if args[0] == "shareSilent" {
			stringSecret := args[1]
			secret = []byte(stringSecret)
		} else if args[0] == "shareHex" {
			hexSecret := args[1]
			secret, err = hex.DecodeString(hexSecret)
			if err != nil {
				fail("Could not parse hex string secret.")
			}
			fmt.Printf("Shares for the hex secret '%s':\n", hexSecret)
			fmt.Printf("To recover, you need %d of %d shares.\n", threshold, numberOfShares)
		} else if args[0] == "shareHexSilent" {
			hexSecret := args[1]
			secret, err = hex.DecodeString(hexSecret)
			if err != nil {
				fail("Could not parse hex string secret.")
			}
		}
		random := getRandom()
		shares := shareSecret(secret, byte(numberOfShares), byte(threshold), random)
		for _, share := range shares {
			fmt.Println(toHex(share))
		}

	case "join", "joinSilent", "joinHex", "joinHexSilent":
		if len(args) < 3 {
			usageAndExit(1)
		}
		shares := _map(args[1:], func(arg string) []byte {
			bytes, err := hex.DecodeString(arg)
			if err != nil {
				fail("Can't parse share '%s'", arg)
			}
			return bytes
		})
		recovered := joinShares(shares)
		if args[0] == "join" {
			println("Secret recovered from joined shares:")
			fmt.Println(string(recovered))
		} else if args[0] == "joinSilent" {
			fmt.Println(string(recovered))
		} else if args[0] == "joinHex" {
			println("Hex secret recovered from joined shares:")
			fmt.Println(toHex(recovered))
		} else if args[0] == "joinHexSilent" {
			fmt.Println(toHex(recovered))
		}

	case "verify":
		if len(args) != 1 {
			usageAndExit(1)
		}
		verify()
	}
}

func fail(message string, v ...any) {
	fmt.Printf(message+"\n", v...)
	os.Exit(1)
}

func toHex(bytes []byte) string {
	result := ""
	for _, byte := range bytes {
		result += fmt.Sprintf("%02x", byte)
	}
	return result
}

func getRandom() Random {
	if fakerandomInt, err := strconv.Atoi(os.Getenv("fakerandom")); err == nil {
		if byte(fakerandomInt) == 0 {
			fail("The fake random value can not be 0.")
		}
		fmt.Printf("Using fake random value %d.\n", byte(fakerandomInt))
		return func(limit byte) byte { return byte(fakerandomInt) }
	} else {
		rand.Seed(time.Now().UnixNano())
		return func(limit byte) byte { return byte(rand.Intn(256-int(limit))) + limit }
	}
}

func usageAndExit(exitCode int) {
	fmt.Println("Shamir's secret sharing - use with the following parameters:")
	fmt.Println("'share' <secret> <number of shares> <threshold>")
	fmt.Println("'shareSilent' <secret> <number of shares> <threshold>")
	fmt.Println("'shareHex' <secret as hex string> <number of shares> <threshold>")
	fmt.Println("'shareHexSilent' <secret as hex string> <number of shares> <threshold>")
	fmt.Println("'join' <share1> <share2> ...")
	fmt.Println("'joinSilent' <share1> <share2> ...")
	fmt.Println("'joinHex' <share1> <share2> ...")
	fmt.Println("'joinHexSilent' <share1> <share2> ...")
	fmt.Println("'verify'")
	os.Exit(exitCode)
}
