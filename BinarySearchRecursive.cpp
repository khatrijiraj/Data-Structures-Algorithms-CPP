/*PROGRAM FOR BINARY SEARCH ITERATIVE METHOD*/
#include <iostream>
using namespace std;

/* Iterative function for binary search */
int BinarySearchRecursive(int array[], int key, int start, int end) {
    // BinarySearch
    if (start <= end) {
        /* mid index of array here we are not writing (s+e)/2 too handle a condition
        where start and end both are 2^31-1 which will execeed the int range while adding */
        int mid = start + (end - start) / 2;

        if (array[mid] == key) {
            // if element return mid which is index of element
            return mid;
        } else if (array[mid] < key) {
            // pushing start to mid+1 if key is greater than mid element
            start = mid + 1;
            return BinarySearchRecursive(array, key, start, end);
        } else {
            // pushing end to mid-1 if key is smaller than mid element
            end = mid - 1;
            return BinarySearchRecursive(array, key, start, end);
        }
    }

    // if element not found return -1
    return -1;
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
    int foundAtIndex = BinarySearchRecursive(array, key, start, end);

    if (foundAtIndex == -1) {
        cout << "Element not found in array." << endl;
    } else {
        cout << "Element found at index: " << foundAtIndex << endl;
    }
    return 0;
}
