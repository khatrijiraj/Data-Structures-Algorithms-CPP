#include <iostream>
using namespace std;

double factorial(int n) {
    if (n == 0) {
        return 1;
    }
    return n * factorial(n - 1);
}

int main() {
    cout << factorial(9);
    return 0;
}