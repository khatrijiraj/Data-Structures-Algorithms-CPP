/* PROGRAM FOR LINEAR SEARCH ALGORITHM */
#include <iostream>
using namespace std;

void LinearSearch(int size, int array[], int key) {
    // if element found we will set this varialbe as true
    bool found = false;

    // this will record the index of array where key is found
    int index;

    // linearSearch algorithm
    for (int j = 0; j < size; j++) {
        if (array[j] == key) {
            // if found set index current value of loop iteration
            found = true;
            index = j;
        }
    }

    if (found) {
        cout << "Element found at index: " << index << endl;
    } else {
        cout << "Element not found in array." << endl;
    }
}

int main() {
    /* initialising array with custom size
    which user will enter */
    int size;

    // element to search
    int key;

    cout << "LINEAR SEARCH" << endl;

    // enter the size of array
    cout << "Enter the size of array: ";
    cin >> size;

    int array[size];

    // enter the array elements
    cout << "Enter the array elements" << endl;
    for (int i = 0; i < size; i++) {
        cout << "   Enter element at " << i << "th index: ";
        cin >> array[i];
    }

    // enter element to search
    cout << "\nEnter element to search: ";
    cin >> key;

    // calling function linearSearch()
    LinearSearch(size, array, key);
    return 0;
}
