#include <iostream>
using namespace std;

class Solution {
   public:
    bool isPossible(int array, int noOfBooks, int noOfStudents, int mid) {
        int studentCount = 1;
        int pageSum = 0;

        for (int j = 0; j < noOfBooks; j++) {
            if (pageSum + array[j] <= mid) {
                pageSum += array[j];
            } else {
                studentCount++;
                if (studentCount > noOfStudents || array[j] > mid) {
                    return false;
                }
                pageSum = array[j];
            }
        }
        return true;
    }

    int allocateBooks(int array, int noOfBooks, int noOfStudents) {
        int start = 0, sum = 0;

        for (int i = 0; i < noOfBooks; i++) {
            sum += array[i];
        }

        int end = sum, answer = -1;

        while (start < end) {
            int mid = start + (end - start) / 2;
            if (isPossible(array, noOfBooks, noOfStudents, mid)) {
                answer = mid;
                end = mid - 1;
            } else {
                start = mid + 1;
            }
        }
        return answer;
    }
};

int main() {
    Solution sol1;
    return 0;
}