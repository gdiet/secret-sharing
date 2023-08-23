package shamir

/** See `testvectors.md` */
def verify(): Unit =

  def pseudorandom(bytes: Seq[Int]): RandomInt =
    val iterator = Iterator.continually(bytes).flatten
    (_, _) => iterator.next()
  {
    println("Check 1: Create pseudorandom shares with threshold 2")
    val secret = fromHex("003880ff")
    val random = pseudorandom(Seq(0x05))
    val shares = shareSecret(secret, 8, 2, random).map(toHex).mkString("\n")
    val expect =
      """01053d85fa
        |020a328af5
        |030f378ff0
        |04142c94eb
        |05112991ee
        |061e269ee1
        |071b239be4
        |082810a8d7""".stripMargin
    if shares != expect then println(s"Not OK, expected\n$expect\n\ngot\n$shares\n")
  }
  {
    println("Check 2: Create pseudorandom shares with threshold 3")
    val secret = fromHex("003880ff")
    val random = pseudorandom(Seq(0x05, 0xff))
    val shares = shareSecret(secret, 8, 3, random).map(toHex).mkString("\n")
    val expect =
      """01fac27a05
        |02dbe35b24
        |032119a1de
        |047d45fd82
        |0587bf0778
        |06a69e2659
        |075c64dca3
        |0897af1768""".stripMargin
    if shares != expect then println(s"Not OK, expected\n$expect\n\ngot\n$shares\n")
  }
  {
    println("Check 3: Create pseudorandom shares with threshold 6")
    val secret = fromHex("003880ff")
    val random = pseudorandom(Seq(0x05, 0xff, 0x50, 0xc1, 0x01))
    val shares = shareSecret(secret, 8, 6, random).map(toHex).mkString("\n")
    val expect =
      """016a52ea95
        |02e9d16916
        |036a52ea95
        |047840f887
        |052119a1de
        |067e46fe81
        |07cef64e31
        |08d4ec542b""".stripMargin
    if shares != expect then println(s"Not OK, expected\n$expect\n\ngot\n$shares\n")
  }
  {
    println("Check 4: Join two example shares with threshold 2")
    val secret = "The cat"
    val shares =
      """06c447761cf0a375
        |0224849d3412d682""".stripMargin.linesIterator.map(fromHex).toSeq
    val restored = asString(joinShares(shares))
    if restored != secret then println(s"Not OK, expected\n$secret\n\ngot\n$restored\n")
  }
  {
    println("Check 5: Join six example shares with threshold 3")
    val secret = "The cat"
    val shares =
      """07c9cfee29bbb91c
        |05928d80f013f004
        |03f94dcb4642fe4f
        |020f2a0bf9cb286c
        |081a6fe6cb749645
        |01a20fa59feab757""".stripMargin.linesIterator.map(fromHex).toSeq
    val restored = asString(joinShares(shares))
    if restored != secret then println(s"Not OK, expected\n$secret\n\ngot\n$restored\n")
  }
  {
    println("Check 6: Join six example shares with threshold 6")
    val secret = "The cat"
    val shares =
      """0223077c958feee1
        |04a8fdc4b0151609
        |05be827ff800b45c
        |064a306128e90199
        |08d4c2c8c92e5d45
        |0784cd1f858d2b69""".stripMargin.linesIterator.map(fromHex).toSeq
    val restored = asString(joinShares(shares))
    if restored != secret then println(s"Not OK, expected\n$secret\n\ngot\n$restored\n")
  }
