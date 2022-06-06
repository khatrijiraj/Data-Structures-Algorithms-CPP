/*PROGRAM FOR BINARY SEARCH ITERATIVE METHOD*/
#include <iostream>
using namespace std;

/* Iterative function for binary search */
void BinarySearchIterative(int array[], int key, int start, int end) {
    // if element found we will set this varialbe as true
    bool found = false;

    // this will record the index of array where key is found
    int index;

    // BinarySearch
    while (start <= end) {
        /* mid index of array here we are not writing (s+e)/2 too handle a condition
        where start and end both are 2^31-1 which will execeed the int range while adding */
        int mid = start + (end - start) / 2;

        if (array[mid] == key) {
            // if element found return its index and break out of while loop
            found = true;
            index = mid;
            break;
        } else if (array[mid] < key) {
            // pushing start to mid+1 if key is greater than mid element
            start = mid + 1;
        } else {
            // pushing end to mid-1 if key is smaller than mid element
            end = mid - 1;
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

    cout << "BINARY SEARCH" << endl;

    // enter the size of array
    cout << "Enter the size of array: ";
    cin >> size;

    // end of array
    int end = size - 1;

    // start of array
    int start = 0;

    // array of size entered by user
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
    BinarySearchIterative(array, key, start, end);
    return 0;
}
