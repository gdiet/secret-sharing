# Simple Secret Sharing With Three Persons

If you have a password or a similar that somebody may need to access when you are not available, but you don't want to give it to a single person for safekeeping or only put it into the strong box,

then here is a recipe how to give pieces of the secret to some of your friends, so that only if three of your friends put their pieces together, they can reconstruct the secret.

Let's look at the theory first. **If you don't care about the theory, go 🔴 TODO here.**

Note that for the "only if TWO of your friends put their pieces together" problem there is a simpler approach, (🔴 TODO add link...), and for the "only if N of your friends put their pieces together" (with N > 3), there is the general approach of Shamir's secret sharing, see e.g. here: https://gdiet.github.io/secret-sharing/share-compact.html.

The idea for "only if three of your friends" is as follows:

If I have a system of equations with three unknowns, I need three linearly independent equations to solve the system of equations. In our case, let's call the secret (which is any number for now) $s$, and in addition choose two random numbers $p$ and $q$. Assuming all $a_n$ and $b_n$ and $c_n$ values are known, the following is such a system of equations:

$a_1 * p + b_1 * q + c_1 = s$\
$a_2 * p + b_2 * q + c_2 = s$\
$a_3 * p + b_3 * q + c_3 = s$\
$a_4 * p + b_4 * q + c_4 = s$\
$a_5 * p + b_5 * q + c_5 = s$

If the $a_n$ and $b_n$ and $c_n$ values all are chosen in a way that the equations are linearly independent of each other, then any combination of three equations can be used to calculate $s$ (and $p$ and $q$, but we actually don't care about them).

Let's take the first three equations. It might not be much fun to solve the equation system, but it **can** be done, and the result is:

$s = \frac{a_1*c_2*b_3 + a_3*c_1*b_2 + c_3*a_2*b_1 - a_2*c_1*b_3 - c_2*a_3*b_1 - a_1*c_3*b_2}{a_1*b_3 + a_3*b_2 + a_2*b_1 - a_2*b_3 - a_3*b_1 - a_1*b_2}$

Looks good so far. If each person gets one set of $a$ / $b$ / $c$ values, it needs three persons to reconstruct s. Isn't it?

In the real world, not always. That is because the persons may have additional knowledge about $p$ and $q$ and $s$ that they can use. For example, if it is known that $p$ and $q$ and $s$ are bytes, i.e. numbers in the $[0..255]$ range, and if $c_n$ is $255$, then $p_n$ and $q_n$ must be $0$ and $s = c_n$. This and similar considerations can be used to get at least some additional knowledge about the secret, if we have one or two equations only.