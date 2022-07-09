/* USING BINARY SEARCH FIND PEAK ELEMENT OF A MOUNTAIN ARRAY */
#include <iostream>
using namespace std;

// function to find peak index of mountain array usig BinarySearch
int peakIndexMountainArrayBinarySearch(int array[], int size) {
    // start index of array
    int start = 0;

    // end index of array
    int end = size - 1;

    /* mid index of array here we are not writing (s+e)/2 too handle a condition
        where start and end both are 2^31-1 which will execeed the int range while adding */
    int mid = start + (end - start) / 2;

    // binarySearch
    while (start < end) {
        // if element is smaller than next push start to mid+1
        if (array[mid] < array[mid + 1]) {
            start = mid + 1;
        } else {
            // end is not mid-1 because it can pass start which will contradict
            end = mid;
        }
        // resetting mid value for next iteration
        mid = start + (end - start) / 2;
    }
    // index of peak element is returned
    return start;
}

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
        cout << "   Enter element at " << i << "th index: ";
        cin >> array[i];
    }

    // storing index of peak element in result variable
    int result = peakIndexMountainArrayBinarySearch(array, size);

    // displaying output with index and value of peak element in mountain array
    cout << "Index of Peak element " << result << " and element at this index: " << array[result] << endl;
    return 0;
}