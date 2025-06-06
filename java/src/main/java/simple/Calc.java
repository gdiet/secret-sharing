package simple;

record Calc(int base) {

  private void inRange(int a, int b) {
    if (a < 0 || a >= base) throw new IllegalArgumentException("a is out of range.");
    if (b < 0 || b >= base) throw new IllegalArgumentException("b is out of range.");
  }
  int mod(int a) { return (a % base + base) % base; }

  int add(int a, int b) { inRange(a, b); return mod(a + b); }
  int sub(int a, int b) { inRange(a, b); return mod(a - b); }
  int mul(int a, int b) { inRange(a, b); return mod(a * b); }
  int div(int a, int b) { inRange(a, b); while (a % b != 0) a += base; return a / b; }
}
