package shamir.gf256

import scala.annotation.elidable
import scala.annotation.elidable.ASSERTION

@elidable(ASSERTION) def assertIsByte(a: Int): Unit = assert(a >= 0 && a < 256)
