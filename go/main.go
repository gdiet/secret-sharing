package main

import (
	"fmt"
	"math/rand"
	"os"
	"strconv"
	"time"
)

func main() {
	random := getRandom()
	fmt.Printf("Hello %d!\n", random(0, 256))
}

func getRandom() func(a, b int) int {
	if fakerandomInt, err := strconv.Atoi(os.Getenv("fakerandom")); err == nil {
		fmt.Printf("Using fake random value %d.\n", fakerandomInt)
		return func(a, b int) int { return fakerandomInt }
	} else {
		rand.Seed(time.Now().UnixNano())
		return func(a, b int) int { return rand.Intn(b-a) + a }
	}
}
