package shamir;

import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.stream.Collectors;

public class Main {
    public static void main(String[] args) {
        new Main().run(args);
    }

    void run(String[] args) {
        if (args.length == 0) usage();
        else if ("share"         .equals(args[0]) && args.length == 3) share(args);
        else if ("shareSilent"   .equals(args[0]) && args.length == 3) share(args);
        else if ("shareHex"      .equals(args[0]) && args.length == 3) share(args);
        else if ("shareHexSilent".equals(args[0]) && args.length == 3) share(args);
        else usage();
    }

    void share(String[] args) {
        int[] secret = toBytes(args[1]);
        int[][] shares = Shamir.shareSecret(secret, Integer.parseInt(args[2]), Integer.parseInt(args[3]));
//        println(s"The secret as hex string: ${toHex(secret)}")
//        println(s"Shares for the secret '$stringSecret:")
//        println(shares.map(toHex).mkString("\n"))
        for (int[] share : shares) {
            println(toHex(share));
        }
    }

    String toHex(int[] bytes) {
        return Arrays.stream(bytes).mapToObj(this::toHex).collect(Collectors.joining());
    }

    String toHex(int b) {
        return String.format("%02x", b);
    }

    int[] toBytes(String string) {
        byte[] bytes = string.getBytes(StandardCharsets.UTF_8);
        int[] result = new int[bytes.length];
        for (int i = 0; i < bytes.length; i++) {
            result[i] = toInt(bytes[i]);
        }
        return result;
    }

    int toInt(byte b) {
        return Byte.toUnsignedInt(b);
    }

    void println(String string) {
        System.out.println(string);
    }

    void usage() {
        println("Shamir's secret sharing - use with the following parameters:");
        println("'share' <secret> <number of shares> <threshold>");
        println("'shareSilent' <secret> <number of shares> <threshold>");
        println("'shareHex' <secret as hex string> <number of shares> <threshold>");
        println("'shareHexSilent' <secret as hex string> <number of shares> <threshold>");
        println("'join' <share1> <share2> ...");
        println("'joinSilent' <share1> <share2> ...");
        println("'joinHex' <share1> <share2> ...");
        println("'joinHexSilent' <share1> <share2> ...");
    }
}
