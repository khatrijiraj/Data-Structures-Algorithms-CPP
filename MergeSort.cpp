#include <iostream>
using namespace std;

/* function for merge sort algorithm */
void mergeSort(int arr1[], int size1, int arr2[], int size2, int arr3[]) {
    /* variable to track array 1 */
    int i = 0;
    /* variable to track array 2 */
    int j = 0;
    /* variable to track array 3 */
    int k = 0;

    /* comparing array1 and array 2 element and
    then putting lower value in array3 and
    increment track by 1 */
    while (i < size1 && j < size2) {
        /* if array1 have smaller element than array2 */
        if (arr1[i] < arr2[j]) {
            arr3[k++] = arr1[i++];
        } else {
            /* if array2 have smaller element than array1 */
            arr3[k++] = arr2[j++];
        }
    }

    /* if one array finishes than copying the left over element of other array */
    /* copying elements of array1 */
    while (i < size1) {
        arr3[k++] = arr1[i++];
    }
    /* copying elements of array2 */
    while (j < size2) {
        arr3[k++] = arr2[j++];
    }
}

/* function to print array */
void display(int arr3[], int size3) {
    for (int i = 0; i < size3; i++) {
        cout << arr3[i] << " ";
    }
}

int main() {
    /* arrays intialized */
    int arr1[5] = {1, 3, 5, 6, 7};
    int arr2[3] = {2, 4, 8};
    int arr3[8];

    /* calling mergeSort() function */
    mergeSort(arr1, 5, arr2, 3, arr3);
    /* calling display() function to print array after Merging and Sorting */
    display(arr3, 8);
    return 0;
}