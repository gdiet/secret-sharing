# Sharing a Secret With Eight Persons

## The Problem

I want to share the password of my password safe with eight persons, so that any three of them can reconstruct the password, but no two of them can do so.

The solution presented here is not as flexible as Shamir's Secret Sharing, but it is much simpler mathematically.

## The Solution: Sharing The Password

Step 1: Map the password to a big number: For each letter in the password, look up the respective 2 digit number in the table below, and concatenate the numbers. The numbers up 90 are the ASCII codes of the letters minus 32, the numbers 91 to 99 have a special mapping. The mapping table is at the end of this document.

Step 2: Select 28 different random numbers of approximately the same size, so the sum of the numbers is the big password number from step 1. Assign indexes 01 to 28 to the numbers.

Step 3: Give each of the eight persons 21 of the random numbers according to the following table, together with instructions on how to reconstruct the password.

```
1: -- -- -- -- -- -- -- 08 09 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28
2: -- 02 03 04 05 06 07 -- -- -- -- -- -- 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28
3: 01 -- 03 04 05 06 07 -- 09 10 11 12 13 -- -- -- -- -- 19 20 21 22 23 24 25 26 27 28
4: 01 02 -- 04 05 06 07 08 -- 10 11 12 13 -- 15 16 17 18 -- -- -- -- 23 24 25 26 27 28
5: 01 02 03 -- 05 06 07 08 09 -- 11 12 13 14 -- 16 17 18 -- 20 21 22 -- -- -- 26 27 28
6: 01 02 03 04 -- 06 07 08 09 10 -- 12 13 14 15 -- 17 18 19 -- 21 22 -- 24 25 -- -- 28
7: 01 02 03 04 05 -- 07 08 09 10 11 -- 13 14 15 16 -- 18 19 20 -- 22 23 -- 25 -- 27 --
8: 01 02 03 04 05 06 -- 08 09 10 11 12 -- 14 15 16 17 -- 19 20 21 -- 23 24 -- 26 -- --
```

## The Solution: Reconstructing The Password

To reconstruct the password, any three persons can combine their numbers. They will find they have 28 different numbers total. The sum of these numbers is the big password number from step 1. To reconstruct the password, they can now split the big number into 2 digit numbers (best right-to-left) and look up the respective letters in the mapping table.

## The Mapping Table

| number | letter | comment |
| --- | --- | --- |
| 00 |   | (space) |
| 01 | ! | |
| 02 | " | (double quote) |
| 03 | # | |
| 04 | $ | |
| 05 | % | |
| 06 | & | |
| 07 | ' | (single quote) |
| 08 | ( | |
| 09 | ) | |
| 10 | * | |
| 11 | + | |
| 12 | , | (comma) |
| 13 | - | (minus) |
| 14 | . | |
| 15 | / | |
| 16 | 0 | |
| 17 | 1 | |
| 18 | 2 | |
| 19 | 3 | |
| 20 | 4 | |
| 21 | 5 | |
| 22 | 6 | |
| 23 | 7 | |
| 24 | 8 | |
| 25 | 9 | |
| 26 | : | |
| 27 | ; | |
| 28 | < | |
| 29 | = | |
| 30 | > | |
| 31 | ? | |
| 32 | @ | |
| 33 | A | |
| 34 | B | |
| 35 | C | |
| 36 | D | |
| 37 | E | |
| 38 | F | |
| 39 | G | |
| 40 | H | |
| 41 | I | |
| 42 | J | |
| 43 | K | |
| 44 | L | |
| 45 | M | |
| 46 | N | |
| 47 | O | |
| 48 | P | |
| 49 | Q | |
| 50 | R | |
| 51 | S | |
| 52 | T | |
| 53 | U | |
| 54 | V | |
| 55 | W | |
| 56 | X | |
| 57 | Y | |
| 58 | Z | |
| 59 | [ | |
| 60 | \ | |
| 61 | ] | |
| 62 | ^ | |
| 63 | _ | (underscore) |
| 64 | ` | (backtick) |
| 65 | a | |
| 66 | b | |
| 67 | c | |
| 68 | d | |
| 69 | e | |
| 70 | f | |
| 71 | g | |
| 72 | h | |
| 73 | i | |
| 74 | j | |
| 75 | k | |
| 76 | l | |
| 77 | m | |
| 78 | n | |
| 79 | o | |
| 80 | p | |
| 81 | q | |
| 82 | r | |
| 83 | s | |
| 84 | t | |
| 85 | u | |
| 86 | v | |
| 87 | w | |
| 88 | x | |
| 89 | y | |
| 90 | z | |
| 91 |  | (undefined) |
| 92 | ä | |
| 93 | ö | |
| 94 | ü | |
| 95 | Ä | |
| 96 | Ö | |
| 97 | Ü | |
| 98 | ß | |
| 99 | € | |





