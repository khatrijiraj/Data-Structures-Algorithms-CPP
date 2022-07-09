#include <iostream>
using namespace std;

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

int BinarySearchIterative(int array[], int key, int s, int e) {
    int start = s;
    int end = e;
    // BinarySearch
    while (start <= end) {
        /* mid index of array here we are not writing (s+e)/2 too handle a condition
        where start and end both are 2^31-1 which will execeed the int range while adding */
        int mid = start + (end - start) / 2;

        if (array[mid] == key) {
            // if element found return its index and break out of while loop
            return mid;
        } else if (array[mid] < key) {
            // pushing start to mid+1 if key is greater than mid element
            start = mid + 1;
        } else {
            // pushing end to mid-1 if key is smaller than mid element
            end = mid - 1;
        }
    }
    return -1;
}

int searchInRotatedArray(int array, int size, int key) {
    int pivot = pivotElementOfAnArray(array, size);
    if (key >= array[pivot] && key <= array[size - 1]) {
        int start = pivot;
        int end = size - 1;
        return BinarySearchRecursive(array, key, start, end);
    } else {
        int start = 0;
        int end = pivot - 1;
        return BinarySearchRecursive(array, key, start, end);
    }
}

int main() {
    // array of size 20
    int array[20];

    /* initialising array with custom size
       which user will enter */
    int size;

    // element to search
    int key;

    // enter the size of array
    cout << "Enter the size of array: ";
    cin >> size;

    // array of size entered by user
    array[size];

    // enter the array elements
    cout << "Enter the array elements" << endl;
    for (int i = 0; i < size; i++) {
        cout << "   Enter element at " << i << "th index: ";
        cin >> array[i];
    }

    // enter element to search
    cout << "\nEnter element to search: ";
    cin >> key;

    int result = searchInRotatedArray(array, size, key);
    if (result == -1) {
        cout << "Element not found in array";
    } else {
        cout << "Element found at index " << result;
    }
    return 0;
}