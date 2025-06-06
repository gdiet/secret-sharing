package simple;

import java.security.SecureRandom;

public class Main {

  public static void main(String[] args) {
    // share(101, 11);
    // 0 1 030
    // 0 3 068
    // 3 2 046
    restore(101, new int[]{0,0,3},new int[]{1,3,2},new int[]{30,68,46});

    // share(101, 11);
    // 1 2 048
    // 2 1 028
    // 3 2 046
    restore(101, new int[]{1,2,3},new int[]{2,1,2},new int[]{48,28,46});

    Calc calc = new Calc(101);
    println(calc.add(calc.add(calc.mul(0, 1), calc.mul(1, 82)),30));
    println(calc.add(calc.add(calc.mul(0, 1), calc.mul(3, 82)),68));
    println(calc.add(calc.add(calc.mul(3, 1), calc.mul(2, 82)),46));
  }

  /*
base = 101
s = 11
p = 1
q = 82
0 * p + 1 * q + 030 = s  ||  0 1 030
0 * p + 2 * q + 049 = s  ||  0 2 049
0 * p + 3 * q + 068 = s  ||  0 3 068
1 * p + 0 * q + 010 = s  ||  1 0 010
1 * p + 1 * q + 029 = s  ||  1 1 029
1 * p + 2 * q + 048 = s  ||  1 2 048
1 * p + 3 * q + 067 = s  ||  1 3 067
2 * p + 0 * q + 009 = s  ||  2 0 009
2 * p + 1 * q + 028 = s  ||  2 1 028
2 * p + 3 * q + 066 = s  ||  2 3 066
3 * p + 0 * q + 008 = s  ||  3 0 008
3 * p + 1 * q + 027 = s  ||  3 1 027
3 * p + 2 * q + 046 = s  ||  3 2 046
   */
  static void share(int base, int s) {
    if (base != 101 && base != 257) throw new IllegalArgumentException("Only 101 and 257 supported as base.");
    if (s < 0 || s >= base) throw new IllegalArgumentException("s is out of range.");
    Calc calc = new Calc(base);
    SecureRandom random = new SecureRandom();
    int p = random.nextInt(base);
    int q = random.nextInt(base);
    println("base = " + base);
    println("s = " + s);
    println("p = " + p);
    println("q = " + q);
    for (int a = 0; a < 4; a++)
      for (int b = 0; b < 4; b++) {
        if (a == b && a != 1) continue;
        int c = calc.sub(calc.sub(s, calc.mul(a, p)), calc.mul(b, q));
        System.out.printf("%d * p + %d * q + %03d = s  ||  %d %d %03d%n", a,b,c, a,b,c);
      }
  }

  /* 3 shares are provided with values for a, b, and c.
   *
   * a1 * p + b1 * q + c1 = s
   * a2 * p + b2 * q + c2 = s
   * a3 * p + b3 * q + c3 = s
   *
   *     a1*c2*b3 + a3*c1*b2 + c3*a2*b1 - a2*c1*b3 - c2*a3*b1 - a1*c3*b2
   * s = ---------------------------------------------------------------
   *              a1*b3 + a3*b2 + a2*b1 - a2*b3 - a3*b1 - a1*b2
   */
  static void restore(int base, int[] a, int[] b, int[] c) {
    if (base != 101 && base != 257) throw new IllegalArgumentException("Only 101 and 257 supported as base.");
    if (a.length != 3 || b.length != 3 || c.length != 3) throw new IllegalArgumentException("Share length not three.");

  /*
E1: a_1 * p + b_1 * q + c_1 = s
E2: a_2 * p + b_2 * q + c_2 = s
E3: a_3 * p + b_3 * q + c_3 = s

E1 * a_2 - E2 * a_1
(a_1 * p + b_1 * q + c_1) * a_2 - (a_2 * p + b_2 * q + c_2) * a_1
a_2*b_1*q + a_2*c_1 - a_1*b_2*q - a_1*c_2 = s*a_2 - s*a_1
q * (a_2*b_1 - a_1*b_2)  + a_2*c_1 - a_1*c_2 = s*a_2 - s*a_1

(a_2*c_1 - a_1*c_2)*(a_3*b_1 - a_1*b_3)
a_2c_1a_3b_1 - a_2c_1a_1b_3 - a_1c_2a_3b_1 + a_1a_1c_2b_3

(s*a_2 - s*a_1)*(a_3*b_1 - a_1*b_3)

E1 * a_3 - E3 * a_1
(a_1 * p + b_1 * q + c_1) * a_3 - (a_3 * p + b_3 * q + c_3) * a_1
a_3*b_1*q + a_3*c_1 - a_1*b_3*q - a_1*c_3 = s*a_3 - s*a_1
q * (a_3*b_1 - a_1*b_3)  + a_3*c_1 - a_1*c_3 = s*a_3 - s*a_1

+ (a_2*c_1 - a_1*c_2)*(a_3*b_1 - a_1*b_3)
- (a_3*c_1 - a_1*c_3)*(a_2*b_1 - a_1*b_2)
=
+ (s*a_2 - s*a_1)*(a_3*b_1 - a_1*b_3)
- (s*a_3 - s*a_1)*(a_2*b_1 - a_1*b_2)
    a1*c2*b3 + a3*c1*b2 + c3*a2*b1 - a2*c1*b3 - c2*a3*b1 - a1*c3*b2
s = ---------------------------------------------------------------
        a1*b3 + a3*b2 + a2*b1 - a2*b3 - a3*b1 - a1*b2
   */



    // (a_1 * p + b_1 * q + c_1)*a_2 - (a_2 * p + b_2 * q + c_2)*a_1
    // a_2*b_1*q + a_2*c_1 - a_1*b_2*q - a_1*c_2

    // E4: E1*a2 - E2*a1: eliminate p
    // E4: b1 * a2 * q - b2 * a1 * q + c1 * a2 - c2 * a1 = s * a2 - s * a1
    // E4: ( b1 * a2 - b2 * a1 ) * q + c1 * a2 - c2 * a1 = s * a2 - s * a1
    // E5: E1*a3 - E3*a1: eliminate p
    // E5: b1 * a3 * q - b3 * a1 * q + c1 * a3 - c3 * a1 = s * a3 - s * a1
    // E5: ( b1 * a3 - b3 * a1 ) * q + c1 * a3 - c3 * a1 = s * a3 - s * a1
    // E6: E4 * (b1 * a3 - b3 * a1) - E5 * (b1 * a2 - b2 * a1): elimiate Q
    // E6: (c1 * a2 - c2 * a1) * (b1 * a3 - b3 * a1) - (c1 * a3 - c3 * a1) * (b1 * a2 - b2 * a1)
    //                 = (s * a2 - s * a1) * (b1 * a3 - b3 * a1) - (s * a3 - s * a1) * (b1 * a2 - b2 * a1)
    // (c_1*a_2-c_2*a_1)*(b_1*a_3-b_3*a_1)-(c_1*a_3-c_3*a_1)*(b_1*a_2-b_2*a_1) = (s*a_2-s*a_1)*(b_1*a_3-b_3*a_1)-(s*a_3-s*a_1)*(b_1*a_2-b_2*a_1)
    //
    //     c2*a1*b3 + c1*a3*b2 + c3*b1*a2 - c1*a2*b3 - c2*b1*a3 - c3*a1*b2
    // s = ---------------------------------------------------------------
    //            a1*b3 + a3*b2 + a2*b1 - a2*b3 - b1*a3 - a1*b2
    /*
        a1*c2*b3 + a3*c1*b2 + c3*a2*b1 - a2*c1*b3 - c2*a3*b1 - a1*c3*b2
    s = ---------------------------------------------------------------
                  a1*b3 + a3*b2 + a2*b1 - a2*b3 - a3*b1 - a1*b2

     */

    int a1 = a[0];
    int a2 = a[1];
    int a3 = a[2];
    int b1 = b[0];
    int b2 = b[1];
    int b3 = b[2];
    int c1 = c[0];
    int c2 = c[1];
    int c3 = c[2];

    Calc calc = new Calc(base);
    int dividend = calc.mod(c2*a1*b3 + c1*a3*b2 + c3*b1*a2 - c1*a2*b3 - c2*b1*a3 - c3*a1*b2);
    int divisor = calc.mod(a1*b3 + a3*b2 + a2*b1 - a2*b3 - b1*a3 - a1*b2);
    int s = calc.div(dividend, divisor);
    println("secret = " + s);
  }

  private static void println(String string) { System.out.println(string); }
  private static void println(int value) { System.out.println(value); }
}
