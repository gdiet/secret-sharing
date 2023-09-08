package main

import (
	"flag"
	"fmt"
	"os"
)

func shareWizard(args []string) {
	cmds := flag.NewFlagSet("shareWizard", flag.ExitOnError)

	var secret string
	cmds.StringVar(&secret, "secret", "", "The secret to share")

	var secretDescription string
	cmds.StringVar(&secretDescription, "secretDescription", "", "The description to include in the shares")

	var secretFormat string
	cmds.StringVar(&secretFormat, "secretFormat", "UTF-8", "The format of the secret, one of UTF-8, HEX, BASE-64")

	var secretHashAlgorithm string
	cmds.StringVar(&secretHashAlgorithm, "secretHashAlgorithm", "SHA3-256", "The hash algorithm to use for verification")

	var numberOfShares int
	cmds.IntVar(&numberOfShares, "numberOfShares", 3, "The number of shares to create")

	var requiredShares int
	cmds.IntVar(&requiredShares, "requiredShares", 2, "The number of shares required when restoring the secret")

	var secretSizeLeading bool
	cmds.BoolVar(&secretSizeLeading, "secretSizeLeading", true, "Whether to prefix the secret data with a size byte")

	var fillToLength int
	cmds.IntVar(&fillToLength, "fillToLength", 32, "Fill shorter secrets with 0 values up to this length")

	var shareFormat string
	cmds.StringVar(&shareFormat, "shareFormat", "HEX", "The format of the shares, HEX or BASE-64")

	cmds.Parse(args)

	/* produces:
		secretShares (array)
		secretHashShares (array)
		sharesUUID
		created

	{
	  "_ for help see": "https://webseite",
	  "_ Beschreibung siehe": "https://webseite",

	  "secretDescription": "Jane's Main Password",

	  "created": "ISO date/time",
	  "sharesUUID": "123-231-123-321",
	  "secretFormat": "UTF-8",
	  "secretHashAlgorithm": "SHA3-256",
	  "shareSizeLeading": true,
	  "fillToLength": 32,
	  "numberOfShares": 8,
	  "requiredShares": 3,
	  "shareFormat": "HEX",
	  "secretShares": [
	    "01abcdef",
	    "02987654",
	  ],
	  "secretHashShares": [
	    "01abcdef",
	    "02987654",
	  ]
	}
	*/

	fmt.Printf("args = '%s'\n", args)
	fmt.Printf("secret = '%s'\n", secret)
	fmt.Printf("number of shares = '%d'\n", numberOfShares)

	os.Exit(1)
}
