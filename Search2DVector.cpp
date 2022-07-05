#include <iostream>
#include <vector>
using namespace std;

/* if matrix elements are sorted
[[1,3,5,7],
[10,11,16,20],
[23,30,34,60]] */
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

/*
if matrix is like this where each row is sorted
matrix = [[1,4,7,11,15],
         [2,5,8,12,19],
         [3,6,9,16,22],
         [10,13,14,17,24],
         [18,21,23,26,30]]
 */
/* functino to search a element */
bool searchMatrix(vector<vector<int>>& matrix, int target) {
    /* no of rows */
    int row = matrix.size();

    /* no of coloums */
    int col = matrix[0].size();

    /* row index of mid element */
    int rowIndex = 0;

    /* column index of mid element */
    int colIndex = col - 1;

    /* performing search */
    while (rowIndex < row && colIndex >= 0) {
        /* top right corner element */
        int element = matrix[rowIndex][colIndex];

        /* if found return true else shift row or column accordingly */
        if (element == target) {
            return true;
        } else if (element > target) {
            colIndex--;
        } else {
            rowIndex++;
        }
    }
    /* if element not found return false */
    return false;
}

int main() {
    /* sorted 2D vector */
    vector<vector<int>> vect{
        {1, 2, 3},
        {4, 5, 6},
        {7, 8, 9}};

    /* each row is sorted in 2D vector */
    vector<vector<int>> vect1{
        {1, 4, 7, 11, 15},
        {2, 5, 8, 12, 19},
        {3, 6, 9, 16, 22},
        {10, 13, 14, 17, 24},
        {18, 21, 23, 26, 30}};

    /* if element found print found else print not found */
    if (BinarySearch2DVector(vect, 1)) {
        cout << "Element found\n";
    } else {
        cout << "Element not found\n";
    }

    /* if element found print found else print not found */
    if (searchMatrix(vect1, 1)) {
        cout << "Element found\n";
    } else {
        cout << "Element not found\n";
    }
    return 0;
}