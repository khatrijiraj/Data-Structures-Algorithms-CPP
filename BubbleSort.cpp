#include <iostream>
using namespace std;

/*
    Time complexity:-
    Average case: O(n^2)
    Best case: O(n)
    Worst case: O(n^2)

    Space complexity:- O(1);
*/

/* function to print array */
void display(int array[], int size) {
    cout << "Array: ";
    for (int i = 0; i < size; i++) {
        cout << array[i] << " ";
    }
    cout << endl;
}

/* function to swap array elements */
void swap(int *a, int *b) {
    /* swapping of elements */
    int temp = *a;
    *a = *b;
    *b = temp;
}

/* Bubble sort algorithm */
void bubbleSort(int array[], int size) {
    /* round 1 to size - 1 */
    for (int i = 1; i < size; i++) {
        /* if array is already sorted swapped will be false after loop operations */
        bool swapped = false;

        /* comparing array elements and swapping */
        for (int j = 0; j < size - i; j++) {
            if (array[j] > array[j + 1]) {
                swap(&array[j], &array[j + 1]);
                swapped = true;
            }
        }

        /* if no swapping occured means array is already sorted
        this is done to optimize best case complexity */
        if (swapped == false) {
            break;
        }
    }
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

    /* calling bubbleSort function */
    bubbleSort(array, size);

    /* printing array after sorting */
    display(array, size);
    return 0;
}