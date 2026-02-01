package eff;

import java.util.Arrays;

class Main {
  static void main() {
    new Main().run();
  }

  void run() {
    var data = new byte[] {6,3,5,1};
    var parityCount = 7;
    var result = calculateParity(data, parityCount);
    System.out.println("Data:\n" + Arrays.toString(data));
    System.out.println("Check + Data + Parity:\n" + Arrays.toString(result));
  }

  /// Calculate parity bytes for the given data. A leading zero byte is prepended as check byte.
  /// The returned array contains the check byte, the data bytes and the parity bytes.
  byte[] calculateParity(byte[] data, int parityCount) {
    byte[] bytes = new byte[1 + data.length + parityCount];
    System.arraycopy(data, 0, bytes, 1, data.length);

    byte[] gen = createGeneratorPolynomial(parityCount);
    byte[] parity = new byte[parityCount];

    for (int i = 0; i < data.length; i++) {
      byte feedback = GF256.add(bytes[i + 1], parity[0]);
      // Shift parity bytes left
      for (int j = 0; j < parityCount - 1; j++) {
        parity[j] = GF256.add(parity[j + 1], GF256.mul(feedback, gen[j + 1]));
      }
      parity[parityCount - 1] = GF256.mul(feedback, gen[parityCount]);
    }

    System.arraycopy(parity, 0, bytes, 1 + data.length, parityCount);
    return bytes;
  }

  static byte[] createGeneratorPolynomial(int parityCount) {
    byte[] gen = new byte[parityCount + 1];
    gen[0] = 1;
    byte alpha = 1;
    for (int i = 0; i < parityCount; i++) {
      for (int j = i + 1; j > 0; j--) {
        byte a = gen[j];
        byte b = GF256.mul(gen[j - 1], alpha);
        gen[j] = GF256.add(a, b);
      }
      alpha = GF256.mul(alpha, (byte)0x02);
    }
    return gen;
  }
}
