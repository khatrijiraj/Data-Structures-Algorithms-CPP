#include <iostream>
using namespace std;

/* basic funtion to search a element in 2d array */
bool search(int arr[][3], int target, int row, int col) {
    for (int i = 0; i < row; i++) {
        for (int j = 0; j < col; j++) {
            if (arr[i][j] == target) {
                return true;
            }
        }
    }
    return false;
}

void rowSum(int arr[][3], int row, int col) {
    int sum = 0;
    for (int i = 0; i < row; i++) {
        int sum = 0;
        for (int j = 0; j < col; j++) {
            sum += arr[i][j];
        }
        cout << "Sum: " << sum << endl;
    }
}

void largestRowSum(int arr[][3], int row, int col) {
    int sum = 0;
    int max = 0;
    int rowIndex = 0;
    for (int i = 0; i < row; i++) {
        int sum = 0;
        for (int j = 0; j < col; j++) {
            sum += arr[i][j];
        }
        if (sum > max) {
            max = sum;
            rowIndex = i;
        }
    }
    cout << "Max sum " << max << " at index: " << rowIndex;
}

int main() {
    /* create a 2d array */
    // int arr[3][3];
    // int arr[3][3] = {1, 2, 3, 4, 5, 6, 7, 8, 9};
    int arr[3][3] = {{1, 11, 111}, {2, 22, 222}, {3, 33, 333}};

    /* input 2d array */
    /* for (int i = 0; i < 3; i++) {
        for (int j = 0; j < 3; j++) {
            cout << "Enter element at (" << i << ", " << j << "): ";
            cin >> arr[i][j];
        }
    } */

    /* output 2d array */
    cout << "2D Array:- \n";
    for (int i = 0; i < 3; i++) {
        for (int j = 0; j < 3; j++) {
            cout << arr[i][j] << "\t";
        }
        cout << endl;
    }

    /* searching */
    if (search(arr, 111, 3, 3)) {
        cout << "Found" << endl;
    } else {
        cout << "Not found" << endl;
    }

    /* sum of rows */
    cout << "Sum of rows: " << endl;
    rowSum(arr, 3, 3);

    /* row with max sum */
    cout << "Finding row with max sum: \n";
    largestRowSum(arr, 3, 3);
    return 0;
}