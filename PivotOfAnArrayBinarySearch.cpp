/* PROGRAM TO FIND PIVOT INDEX OR EQUILLIBRIUM INDEX */
#include <iostream>
using namespace std;

// function to find pivot element of an array
int pivotElementOfAnArray(int array[], int size) {
    // initialising value of start and end point of an array
    int start = 0, end = size - 1, mid;

    // binarySearch
    while (start < end) {
        /* mid index of array here we are not writing (s+e)/2 too handle a condition
        where start and end both are 2^31-1 which will execeed the int range while adding */
        mid = start + (end - start) / 2;

        if (array[mid] >= array[0]) {
            start = mid + 1;
        } else {
            end = mid;
        }
    }
    return start;
}

// main function
int main() {
    // array of size 20
    int array[20];

    /* initialising array with custom size
    which user will enter */
    int size;

    // enter the size of array
    cout << "Enter the size of array: ";
    cin >> size;

    // array of size entered by user
    array[size];

    // enter the array elements
    cout << "Enter the array elements" << endl;
    for (int i = 0; i < size; i++) {
        cout << "\tEnter element at " << i << "th index: ";
        cin >> array[i];
    }

    // result will store index of pivot of an array
    int result = pivotElementOfAnArray(array, size);
    cout << "Index of Pivot element " << result << " and element at this index: " << array[result] << endl;
    return 0;
}