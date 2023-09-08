## Share Format

    {
      "part number"   : 3,
      "part of secret": "AzrC3V9NjkS7aC9KombjyDdAJe4d6r4t4e114BmOCbh1",
      "part of hash"  : "A7TXU1gcfr5dI7xV5DRfHza1206IAimy1SLoILE3BYBY",
      "identifier"    : "980363187642"
    }

`"part number"` is for the human reader only. It is supposed to be the equal to the part's `x` value (in byte 0) of `"part of secret"` and `"part of hash"`.

`"part of secret"` is the base64 encoded share of the secret, with the first byte being the part's `x` value.

`"part of hash"` is the base64 encoded share of the SHA-256 hash of the unpadded secret, with the first byte being the part's `x` value.

`"identifier"` is an identifier string of the shares set, randomly generated for each share operation.
