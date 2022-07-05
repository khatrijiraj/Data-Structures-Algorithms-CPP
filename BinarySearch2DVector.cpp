#include <iostream>
#include <vector>
using namespace std;

/* function to perform binarySearch in 2D vector */
bool BinarySearch2DVector(vector<vector<int>>& matrix, int target) {
    /* no of rows */
    int row = matrix.size();
    /* no of coloums */
    int col = matrix[0].size();

    /* starting index of matrix */
    int start = 0;
    /* last ending index of matrix */
    int end = (row * col) - 1;

    /* middle index */
    int mid = start + (end - start) / 2;

    /* performing binary search */
    while (start <= end) {
        /* middle element */
        int element = matrix[mid / col][mid % col];

        /* if element found return true */
        if (element == target) {
            return true;
        }

        /* else perform binary search in half part accordingly */
        if (target > element) {
            start = mid + 1;
        } else {
            end = mid - 1;
        }
        /* updating mid for next iteration */
        mid = start + (end - start) / 2;
    }
    /* if element not found return false */
    return false;
}

int main() {
    /* 2D vector */
    vector<vector<int>> vect{
        {1, 2, 3},
        {4, 5, 6},
        {7, 8, 9}};

    /* if element found print found else print not found */
    if (BinarySearch2DVector(vect, 1)) {
        cout << "Element found\n";
    } else {
        cout << "Element not found\n";
    }
    return 0;
}