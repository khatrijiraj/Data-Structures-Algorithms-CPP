#include <iostream>
using namespace std;

bool isSorted(int arr[], int size) {
    if (size == 0 || size == 1) {
        return true;
    }
    if (arr[0] > arr[1]) {
        return false;
    } else {
        return isSorted(arr + 1, size - 1);
    }
}

int sumOfArray(int arr[], int size) {
    if (size <= 0) {
        return 0;
    } else {
        return sumOfArray(arr, size - 1) + arr[size - 1];
    }
}

bool linearSearch(int arr[], int size, int key) {
    if (size <= 0) {
        return false;
    }

    if (key == arr[size - 1]) {
        return true;
    } else {
        return linearSearch(arr, size - 1, key);
    }
}

bool binarySearch(int arr[], int start, int end, int key) {
    int mid = start + (end - start) / 2;
    if (start > end) {
        return false;
    } else if (key == arr[mid]) {
        return true;
    } else if (key > arr[mid]) {
        binarySearch(arr, mid + 1, end, key);
    } else {
        binarySearch(arr, start, mid - 1, key);
    }
}

int main() {
    int arr[5] = {1, 2, 3, 4, 5};
    cout << isSorted(arr, 5) << endl;
    cout << sumOfArray(arr, 5) << endl;
    cout << linearSearch(arr, 5, 3) << endl;
    cout << binarySearch(arr, 0, 5, 4) << endl;
    return 0;
}