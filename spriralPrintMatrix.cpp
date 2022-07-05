#include <iostream>
#include <vector>
using namespace std;

/* class solution */
class Solution {
   public:
    /* function to print a 2d vector in sprial order */
    void spiralOrder(vector<vector<int>>& matrix) {
        /* declaring a vector to store result in it */
        vector<int> ans;

        /* row size */
        int row = matrix.size();
        /* col size */
        int col = matrix[0].size();

        /* counter */
        int count = 0;
        /* total number of elements */
        int total = row * col;

        // starting row index initialization
        int startingRow = 0;

        // starting column index initialization
        int startingCol = 0;

        // ending rpw index initialization
        int endingRow = row - 1;

        // ending column index initialization
        int endingCol = col - 1;

        /* loop will terminate when count > total */
        while (count < total) {
            /* printing first row */
            for (int index = startingCol; count < total && index <= endingCol; index++) {
                ans.push_back(matrix[startingRow][index]);
                count++;
            }
            /* incrementing row index to prevent dupication */
            startingRow++;

            /* printing last column */
            for (int index = startingRow; count < total && index <= endingRow; index++) {
                ans.push_back(matrix[index][endingCol]);
                count++;
            }
            /* decrementing col index to prevent dupication */
            endingCol--;

            /* printing last row */
            for (int index = endingCol; count < total && index >= startingCol; index--) {
                ans.push_back(matrix[endingRow][index]);
                count++;
            }
            endingRow--;
            /* decrementing row index to prevent dupication */

            /* printing starting column */
            for (int index = endingRow; count < total && index >= startingRow; index--) {
                ans.push_back(matrix[index][startingCol]);
                count++;
            }
            /* incrementing col index to prevent dupication */
            startingCol++;
        }

        /* printing the answer */
        for (int i : ans) {
            cout << i << ' ';
        }
    }
};

int main() {
    /* initializing a 2D vector */
    vector<vector<int>> vect{
        {1, 2, 3},
        {4, 5, 6},
        {7, 8, 9}};

    /* creating class object */
    Solution sol;

    /* calling function to print in sprial order */
    sol.spiralOrder(vect);
    return 0;
}