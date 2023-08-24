package shamir;

import java.util.Arrays;
import java.util.PrimitiveIterator;
import java.util.stream.Collectors;

import static shamir.Main.println;

public class Verify {
    static Shamir.Random random(int[] bytes) {
        PrimitiveIterator.OfInt iterator = new PrimitiveIterator.OfInt() {
            int index = -1;
            @Override public boolean hasNext() {
                return true;
            }
            @Override public int nextInt() {
                index++;
                if (index == bytes.length) index = 0;
                return bytes[index];
            }
        };
        return (ignore1, ignore2) -> iterator.next();
    }
    static void run() {
        {
            println("Check 1: Create pseudorandom shares with threshold 2");
            int[] secret = Main.fromHex("003880ff");
            Shamir.Random random = random(new int[]{0x05});
            int[][] shares = Shamir.shareSecret(secret, 8, 2, random);
            String sharesAsString = Arrays.stream(shares).map(Main::toHex).collect(Collectors.joining("\n"));
            String expect = """
                      01053d85fa
                      020a328af5
                      030f378ff0
                      04142c94eb
                      05112991ee
                      061e269ee1
                      071b239be4
                      082810a8d7""";
            if (!sharesAsString.equals(expect)) {
                println("Not OK, expected\n%s\n\ngot\n%s\n", expect, sharesAsString);
            }
        }
        {
            println("Check 2: Create pseudorandom shares with threshold 3");
            int[] secret = Main.fromHex("003880ff");
            Shamir.Random random = random(new int[]{0x05, 0xff});
            int[][] shares = Shamir.shareSecret(secret, 8, 3, random);
            String sharesAsString = Arrays.stream(shares).map(Main::toHex).collect(Collectors.joining("\n"));
            String expect = """
                      01fac27a05
                      02dbe35b24
                      032119a1de
                      047d45fd82
                      0587bf0778
                      06a69e2659
                      075c64dca3
                      0897af1768""";
            if (!sharesAsString.equals(expect)) {
                println("Not OK, expected\n%s\n\ngot\n%s\n", expect, sharesAsString);
            }
        }
        {
            println("Check 3: Create pseudorandom shares with threshold 6");
            int[] secret = Main.fromHex("003880ff");
            Shamir.Random random = random(new int[]{0x05, 0xff, 0x50, 0xc1, 0x01});
            int[][] shares = Shamir.shareSecret(secret, 8, 6, random);
            String sharesAsString = Arrays.stream(shares).map(Main::toHex).collect(Collectors.joining("\n"));
            String expect = """
                      016a52ea95
                      02e9d16916
                      036a52ea95
                      047840f887
                      052119a1de
                      067e46fe81
                      07cef64e31
                      08d4ec542b""";
            if (!sharesAsString.equals(expect)) {
                println("Not OK, expected\n%s\n\ngot\n%s\n", expect, sharesAsString);
            }
        }
        {
            println("Check 4: Join two example shares with threshold 2");
            String secret = "The cat";
            String shares = """
                      06c447761cf0a375
                      0224849d3412d682""";
            int[] restored = Shamir.joinShares(shares.lines().map(Main::fromHex).toList());
            if (!secret.equals(Main.asString(restored))) {
                println("Not OK, expected\n%s\n\ngot\n%s\n", secret, Main.asString(restored));
            }
        }
        {
            println("Check 5: Join six example shares with threshold 3");
            String secret = "The cat";
            String shares = """
                      07c9cfee29bbb91c
                      05928d80f013f004
                      03f94dcb4642fe4f
                      020f2a0bf9cb286c
                      081a6fe6cb749645
                      01a20fa59feab757""";
            int[] restored = Shamir.joinShares(shares.lines().map(Main::fromHex).toList());
            if (!secret.equals(Main.asString(restored))) {
                println("Not OK, expected\n%s\n\ngot\n%s\n", secret, Main.asString(restored));
            }
        }
        {
            println("Check 6: Join six example shares with threshold 6");
            String secret = "The cat";
            String shares = """
                      0223077c958feee1
                      04a8fdc4b0151609
                      05be827ff800b45c
                      064a306128e90199
                      08d4c2c8c92e5d45
                      0784cd1f858d2b69""";
            int[] restored = Shamir.joinShares(shares.lines().map(Main::fromHex).toList());
            if (!secret.equals(Main.asString(restored))) {
                println("Not OK, expected\n%s\n\ngot\n%s\n", secret, Main.asString(restored));
            }
        }
    }
}
