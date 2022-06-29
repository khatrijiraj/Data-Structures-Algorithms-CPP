#include <iostream>
#include <vector>
using namespace std;

/* function to move zeroes */
void moveZeroes(vector<int>& vec) {
    /* track position to swap */
    int i = 0;

    /* traversing vector and if found a position
    where a non-zero then swapping with the left most possible position
    where 0 was stored */
    for (int j = 0; j < vec.size(); j++) {
        if (vec[j] != 0) {
            swap(vec[j], vec[i]);
            i++;
        }
    }
}

/* printing the vector after moving zeroes */
void display(vector<int> vec) {
    for (int i : vec) {
        cout << i << " ";
    }
}

int main() {
    /* vector initialized */
    vector<int> vec = {0, 4, 0, 3, 23, 1, 34, 0, 0};

    /* calling function to moveZeores() */
    moveZeroes(vec);

    /* calling function display() to print array */
    display(vec);
    return 0;
}