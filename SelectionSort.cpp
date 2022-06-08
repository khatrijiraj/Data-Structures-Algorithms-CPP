/* SELECTION SORT */
#include <iostream>
using namespace std;

// function to swap minimum element to its right index
void swap(int *a, int *b) {
    // swapping of elements
    int temp = *a;
    *a = *b;
    *b = temp;
}

// function to display array
void display(int array[], int size) {
    // printing array
    for (int i = 0; i < size; i++) {
        cout << " " << array[i];
    }
    cout << endl;
}

// Selection sort algorithm function
void selectionSort(int array[], int size) {
    /* outer loop will run n-1 times because last element
    will be in sorted array automatically */
    for (int i = 0; i < size - 1; i++) {
        // current index which stores minimum value of element
        int minIndex = i;
        // loop to compare elements
        for (int j = i + 1; j < size; j++) {
            /* to sort in descending order chane > to < */
            // finding the minimum element
            if (array[j] < array[minIndex]) {
                // assigning minimum index
                minIndex = j;
            }
        }
        // function to swap minimum element to its right index
        swap(&array[minIndex], &array[i]);
    }
}

// main function
int main() {
    // size of array
    int size;
    cout << "Enter the size of array: ";
    cin >> size;

    // array of size user entered
    int array[size];

    // input array elements at each index
    cout << "Enter array elements\n";
    for (int i = 0; i < size; i++) {
        cout << "\tEnter array element at " << i << "th index: ";
        cin >> array[i];
    }

    cout << "Sorted Array: ";
    selectionSort(array, size);
    display(array, size);
    return 0;
}