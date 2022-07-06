#include <iostream>
#include <vector>
using namespace std;

/* complexity of Sieve of Eratosthenes
 O ( n* log(logn) ) */
int countPrimes(int n) {
    int count = 0;
    /* vector with all elements set to
    true(assuming all numbers are prime) */
    vector<bool> prime(n + 1, true);

    /* setting 0 and 1 as non prime */
    prime[0] = prime[1] = false;

    /* selecting a number as prime and
    setting all its multiple ahead to non-prime */
    for (int i = 2; i < n; i++) {
        /* setting a number as prime */
        if (prime[i]) {
            count++;
            /* setting all its multiple as non-prime */
            for (int j = 2 * i; j < n; j = j + i) {
                prime[j] = false;
            }
        }
    }
    /* returning number of primes between a range 0 to n */
    return count;
}

int main() {
    /* calling function to count prime */
    int number = countPrimes(1000);
    cout << number << endl;
    return 0;
}