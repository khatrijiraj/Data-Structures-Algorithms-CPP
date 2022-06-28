#include <iostream>
#include <vector>
using namespace std;

/* function to reverse array and print reversed version */
void reverseArray(vector<int> vec) {
    int start = 0, end = vec.size() - 1;
    /* swapping starting and last element */
    while (start <= end) {
        swap(vec[start], vec[end]);
        start++;
        end--;
    }

    /* Printing reversed array */
    cout << "Reverse of array: ";
    for (int i : vec) {
        cout << i << " ";
    }
}

int main() {
    /* vector of type int */
    vector<int> vec = {3, 2, 5, 4, 8, 1};

    /* calling function to reverseArray */
    reverseArray(vec);

    return 0;
}