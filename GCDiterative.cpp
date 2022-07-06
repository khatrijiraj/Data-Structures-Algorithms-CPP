#include <iostream>
using namespace std;

/* LCM * HCf = a * b */
/* function to find LCM */
int LCM(int a, int b, int gcd) {
    /* relation between lcm and hcf/gcd */
    int lcm = (a * b) / gcd;
    return lcm;
}

/* function to find gcd */
int GCD(int a, int b) {
    /* if a = 0 then b is gcd */
    if (a == 0) {
        return b;
    }

    /* if b = 0 then a is gcd */
    if (b == 0) {
        return a;
    }

    /* subtracting greater number from lower
    unless they both are equal
    once they are equal return any number a or b*/
    while (a != b) {
        /* if a is greater subrating b from it */
        if (a > b) {
            a = a - b;
        } else {
            /* if b is greater subrating a from it */
            b = b - a;
        }
    }
    /* returning gcd */
    return a;
}

int main() {
    int a, b;
    cout << "Enter A: ";
    cin >> a;
    cout << "Enter B: ";
    cin >> b;

    /* calling gcd funtion */
    int gcd = GCD(a, b);
    cout << gcd << endl;

    /* calling lcm function */
    int lcm = LCM(a, b, gcd);
    cout << lcm << endl;
    
    return 0;
}