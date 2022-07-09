#include <iostream>
using namespace std;

/* insertion sort algorithm */
void insertionSort(int array[], int size) {
    for (int i = 1; i < size; i++) {
        int currentElement = array[i];
        int j = i - 1;

        /* comparing each element from left of it
        until smaller element is found */

        /* for sorting in descending order, currentElement > array[j] */
        while (j >= 0 && currentElement < array[j]) {
            array[j + 1] = array[j];
            j--;
        }
        array[j + 1] = currentElement;
    }
}

/* function to print array */
void display(int array[], int size) {
    cout << "Array: ";
    for (int i = 0; i < size; i++) {
        cout << array[i] << " ";
    }
    cout << endl;
}

int main() {
    // array of size 20
    int array[20];

    /* Enter the size of array */
    int size;
    cout << "Enter the size of array: ";
    cin >> size;

    /* array of size entered by user */
    array[size];

    /* enter array elements */
    for (int i = 0; i < size; i++) {
        cout << "Enter element at " << i << "th index: ";
        cin >> array[i];
    }

    /* calling insertionSort function */
    insertionSort(array, size);

    /* printing array after sorting */
    display(array, size);
    return 0;
}