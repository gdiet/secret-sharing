# Sharing a Secret With Some Persons

## The Problem

I want to share the password of my password safe with some persons, so that any three of them can reconstruct the password, but no two of them can do so.

The solution presented here is not as flexible as Shamir's Secret Sharing, but it is equally secure and much simpler mathematically: It mainly uses addition of small numbers in the decimal system.

## The Solution: Sharing The Password

Step 1: Convert the password into a sequence of small decimal "secret" numbers. Two possible approaches are:

1. For each letter in the password, look up the number in the table at the end of this document. Every number can be written as a two-digit number, if necessary by adding a leading zero. Example: "#Hi" would become "03 40 73".

2. For each letter in the password, look up the UTF-8 representation written as bytes in decimal. Every number can be written as a three-digit number, if necessary by adding a leading zeros. Example: "#Hi" would become "035 072 105".

Step 2: From the number of persons you want to share the password with, determine the number of "shares" needed:

- 3 persons: 3 shares
- 4 persons: 6 shares (above +3)
- 5 persons: 10 shares (above +4)
- 6 persons: 15 shares (above +5)
- 7 persons: 21 shares (above +6)
- 8 persons: 28 shares (above +7)

Step 3: For each of the small secret numbers obtained from the password in step 1, create the shares as follows:

a. For two-digit numbers:

  - Choose 'shares - 1' random two-digit numbers.
  - Calculate the last number as `(secret number - sum of random numbers) modulo 100` where "modulo 100" means "repeatedly add 100 until the result is positive, then take the last two digits of the result".

b. For three-digit numbers:

  - Choose 'shares - 1' random three-digit numbers.
  - Calculate the last number as `(secret number - sum of random numbers) modulo 1000` where "modulo 1000" means "repeatedly add 1000 until the result is positive, then take the last three digits of the result".

c. Note the share numbers calculated that way in a table.

Example (shares of "#Hi" for 4 persons, shares 1-5 are random numbers, share 6 contains the calculated numbers):

| secret numbers | 03 | 40 | 73 |
|----------------|----|----|----|
| share 01       | 59 | 34 | 88 |
| share 02       | 47 | 92 | 62 |
| share 03       | 06 | 68 | 73 |
| share 04       | 21 | 55 | 25 |
| share 05       | 76 | 39 | 44 |
| share 06       | 94 | 52 | 81 |

Step 4: Give the shares to the persons - along with instructions on what they are and how to use them - according to the following table.

```
1: -- -- 03|-- 05 06|-- 08 09 10|-- 12 13 14 15|-- 17 18 19 20 21|-- 23 24 25 26 27 28
           |        |           |              |                 |                    
2: -- 02 --|04 -- 06|07 -- 09 10|11 -- 13 14 15|16 -- 18 19 20 21|22 -- 24 25 26 27 28
           |        |           |              |                 |                    
3: 01 -- --|04 05 --|07 08 -- 10|11 12 -- 14 15|16 17 -- 19 20 21|22 23 -- 25 26 27 28
-----------+        |           |              |                 |                    
4: 01 02 03 -- -- --|07 08 09 --|11 12 13 -- 15|16 17 18 -- 20 21|22 23 24 -- 26 27 28
--------------------+           |              |                 |                    
5: 01 02 03 04 05 06 -- -- -- --|11 12 13 14 --|16 17 18 19 -- 21|22 23 24 25 -- 27 28
--------------------------------+              |                 |                    
6: 01 02 03 04 05 06 07 08 09 10 -- -- -- -- --|16 17 18 19 20 --|22 23 24 25 26 -- 28
-----------------------------------------------+                 |                    
7: 01 02 03 04 05 06 07 08 09 10 11 12 13 14 15 -- -- -- -- -- --|22 23 24 25 26 27 --
-----------------------------------------------------------------+                    
8: 01 02 03 04 05 06 07 08 09 10 11 12 13 14 15 16 17 18 19 20 21 -- -- -- -- -- -- --
```

In the 4 persons example, the shares would be distributed as follows:

| person | shares   |
|--------|----------|
| 1      | 03 05 06 |
| 2      | 02 04 06 |
| 3      | 01 04 05 |
| 4      | 01 02 03 |

So person 1 would get the following:

```
Here is your share of my password. I have given shares to 4 persons. Any three of you can reconstruct the password from the shares you have been given.

share 03: 06, 68, 73
share 05: 76, 39, 44
share 06: 94, 52, 81

To reconstruct my password, combine your shares with the shares of any two other persons. You will find you have 6 different shares total. Write them into a table. For each column in the shares table, create the sum modulo 100, and look up the resulting letters in the mapping table.
```

For the other persons, proceed in the same way with the shares assigned to them.

## The Number To Character Mapping Table

The numbers up 90 are the ASCII codes of the letters minus 32, the numbers 91 to 98 are mapped to special characters common in German. 99 (no character) can be used to pad passwords with additional numbers to hide the original password length. If you need a different mapping, create your own, but remember to distribute it to all persons involved.

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
| 91 | Ä | |
| 92 | Ö | |
| 93 | Ü | |
| 94 | ä | |
| 95 | ö | |
| 96 | ü | |
| 97 | ß | |
| 98 | € | |
| 99 |  | (no character) |
