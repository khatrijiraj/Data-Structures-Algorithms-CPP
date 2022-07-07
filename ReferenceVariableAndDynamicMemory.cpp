#include <iostream>
using namespace std;

/* dynamic memory allocation */
int getSum(int *arr, int size) {
    int sum = 0;
    for (int i = 0; i < size; i++) {
        sum += arr[i];
    }
    return sum;
}

/* pass by value */
void update(int n) {
    n++;
}

/* pass by reference */
void update2(int &n) {
    n++;
}
int main() {
    int i = 4;
    int &j = i;
    cout << i << endl;
    i++;
    cout << i << endl;
    j++;
    cout << i << endl;
    cout << j << endl;
    cout << endl;

    /* pass by value */
    int n = 4;
    cout << "Before " << n << endl;
    update(n);
    cout << "After " << n << endl;
    cout << endl;

    /* pass by reference */
    cout << "Before " << n << endl;
    update2(n);
    cout << "After " << n << endl;
    cout << endl;

    /* dynamic memory allocation */
    int k;
    cout << "Enter the size of array: ";
    cin >> k;
    int *arr = new int[k];
    cout << "Enter array elements: " << endl;
    for (int i = 0; i < k; i++) {
        cout << "\tEnter element at " << i << ": ";
        /* arr[i] = *(arr + i) */
        cin >> arr[i];
    }
    int sum = getSum(arr, k);
    cout << "Sum of array elements: " << sum;
    /* freeing heap memory */
    delete[] arr;
    cout << endl;

    /* dynamic memory allocation of 2d arrays */
    int row, col;
    cout << "Enter number of rows: ";
    cin >> row;
    cout << "Enter number of columns: ";
    cin >> col;

    int **arr1 = new int *[row];

    for (int i = 0; i < row; i++) {
        arr1[i] = new int[col];
    }

    /* Enter Array elements */
    for (int i = 0; i < row; i++) {
        for (int j = 0; j < col; j++) {
            cin >> arr1[i][j];
        }
    }

    /* printing 2d array */
    for (int i = 0; i < row; i++) {
        for (int j = 0; j < col; j++) {
            cout << arr1[i][j] << "\t";
        }
        cout << endl;
    }

    for (int i = 0; i < row; i++) {
        delete[] arr1[i];
    }
    delete[] arr1;

    return 0;
}