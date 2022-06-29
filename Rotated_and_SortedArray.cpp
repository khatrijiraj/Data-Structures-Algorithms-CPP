#include <iostream>
#include <vector>
using namespace std;

bool checkRotatedAndSortedArray(vector<int>& vec) {
    /* to track number of pair where array[i]>array[i+1] */
    int count = 0;

    /* storing size of vector in variable for ease */
    const int size = vec.size();

    /* traversing vector */
    for (int i = 0; i < size; i++) {
        /* if there are two pairs where array[i]>array[i+1]
        then it will return false  */
        if (vec[i] > vec[(i + 1) % size] && ++count > 1) {
            /* false will be returned if array in unsorted means
            there exists two pairs where array[i]>array[i+1] */
            return false;
        }
    }
    /* if no two pairs found mean array is sorted and rotated
    hence return true */
    return true;
}

int main() {
    /* initializing array */
    vector<int> vec = {3, 4, 5, 1, 2};

    /* calling function and checking if it return true then
    print result */
    if (checkRotatedAndSortedArray(vec) == true) {
        cout << "Array is sorted and rotated" << endl;
    } else {
        cout << "Array is not sorted and rotated" << endl;
    }
    return 0;
}