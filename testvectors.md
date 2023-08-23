# Shamir's Secret Sharing - Test Vectors

This repository contains implementations of Shamir's secret sharing using the Galois field GF(256) used by the AES encryption, the `x^8 + x^4 + x^3 + x^1 + x^0` polynomial (a.k.a. 0x11b polynomial), with big-endian bit order for bytes. The secret is the `y` value at `x = 0`. The 'x' values of the shares are stored in the shares' first byte.

Here is a collection of test vectors that can be used to verify implementations.

## Examples Of Standard Shared Secrets

The following examples have been created in the standard operation mode, using random numbers for the polynomials. They can be used to verify the `join` implementation.

    secret: The cat

    threshold: 2
    016c1e192ad6b70f
    0224849d3412d682
    031cf2e13ea700f9
    04b4ab8e08811483
    058cddf20234c2f8
    06c447761cf0a375
    07fc310a1645750e
    088ff5a870bc8b81

    threshold: 3
    01a20fa59feab757
    020f2a0bf9cb286c
    03f94dcb4642fe4f
    0464ea404f9a2627
    05928d80f013f004
    063fa82e96326f3f
    07c9cfee29bbb91c
    081a6fe6cb749645

    threshold: 6
    012e5911229c84ff
    0223077c958feee1
    0381b4cd720183cf
    04a8fdc4b0151609
    05be827ff800b45c
    064a306128e90199
    0784cd1f858d2b69
    08d4c2c8c92e5d45

## Examples Of Pseudorandom Shared Secrets

In this repository's implementations, the `generatePolynomial` method returns a sequence of bytes where the first byte is the secret byte to share, and the remaining `threshold - 1` bytes are random bytes, with the last byte `!= 0`.

The following examples have been created using the following 'pseudorandom' numbers for the polynomials

    xx  05  ff  50  c1  01  // hex
    xx   5 255  80 193   1  // unsigned decimal
    xx   5  -1  80 -63   1  // signed decimal

where 'xx' is the secret byte to share. For thresholds less than 6, only the first `threshold` bytes were used. Note that the values of the individual shares do not depend on the number of shares generated.

These examples can be used to verify the `share` and the `join` implementations.

    secret (hex): 003880ff

    threshold: 2
    01053d85fa
    020a328af5
    030f378ff0
    04142c94eb
    05112991ee
    061e269ee1
    071b239be4
    082810a8d7

    threshold: 3
    01fac27a05
    02dbe35b24
    032119a1de
    047d45fd82
    0587bf0778
    06a69e2659
    075c64dca3
    0897af1768

    threshold: 6
    016a52ea95
    02e9d16916
    036a52ea95
    047840f887
    052119a1de
    067e46fe81
    07cef64e31
    08d4ec542b
