package simple;

record Calc(int base) {
  Calc {
    if (base < 10) throw new IllegalArgumentException("base is too low");
    if (base > 66000) throw new IllegalArgumentException("base is too high");
    for (int n = 2; n < base; n++) if (base % n == 0) throw new IllegalArgumentException("base is not prime");
  }

  int mod(int a) { return (a % base + base) % base; }

  int div(int a, int b) { while (a % b != 0) { a += base; } return a / b; }
}
