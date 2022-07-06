#include <iostream>
using namespace std;

/* LCM * HCf = a * b */

int LCM(int a, int b, int gcd) {
    int lcm = (a * b) / gcd;
    return lcm;
}

int GCD(int a, int b) {
    if (a == 0) {
        return b;
    }
    if (b == 0) {
        return a;
    }

    while (a != b) {
        if (a > b) {
            a = a - b;
        } else {
            b = b - a;
        }
    }
    return a;
}

int main() {
    int a, b;
    cout << "Enter A: ";
    cin >> a;
    cout << "Enter B: ";
    cin >> b;

    int gcd = GCD(a, b);
    cout << gcd << endl;

    int lcm = LCM(a, b, gcd);
    cout << lcm << endl;
    return 0;
}