/* USING BINARY SEARCH IMPLEMENT :-
    1. FIRST OCCURENCE OF AN ELEMENT
    2. SECOND OCCURENCE OF AN ELEMENT
    3. TOTAL NUMBER OF OCCURENCE OF AN ELEMENT
 */
#include <iostream>
using namespace std;

/* Function to find first occurence of an element in array */
int firstOccurence(int array[], int size, int key) {
    // start and end index of array
    int start = 0, end = size - 1;

    /* mid index of array here we are not writing (s+e)/2 too handle a condition
        where start and end both are 2^31-1 which will execeed the int range while adding */
    int mid = start + (end - start) / 2;

    // initialising answer with -1
    int answer = -1;

    // binarySearch algorithm
    while (start <= end) {
        if (array[mid] == key) {
            answer = mid;
            // first occurence should be on left side of array
            end = mid - 1;
        } else if (key > array[mid]) {
            // pushing start to mid+1 if key is greater than mid element
            start = mid + 1;
        } else if (key < array[mid]) {
            // pushing end to mid-1 if key is smaller than mid element
            end = mid - 1;
        }
        // finding mid value for next iteration of loop
        mid = start + (end - start) / 2;
    }
    // returning first occurence of an element
    return answer;
}

/* Function to find last occurenence of an element in array */
int lastOccurence(int array[], int size, int key) {
    // start and end index of array
    int start = 0, end = size - 1;

    /* mid index of array here we are not writing (s+e)/2 too handle a condition
        where start and end both are 2^31-1 which will execeed the int range while adding */
    int mid = start + (end - start) / 2;

    // initialising answer with -1
    int answer = -1;

    // binarySearch algorithm
    while (start <= end) {
        if (array[mid] == key) {
            answer = mid;
            // last occurence should be on right side of array
            start = mid + 1;
        } else if (key > array[mid]) {
            // pushing start to mid+1 if key is greater than mid element
            start = mid + 1;
        } else if (key < array[mid]) {
            // pushing end to mid-1 if key is smaller than mid element
            end = mid - 1;
        }
        // finding mid value for next iteration of loop
        mid = start + (end - start) / 2;
    }
    // returning last occurence of an element
    return answer;
}

/* Function to find total occurence of an element in array */
int totalOccurence(int occurence[]) {
    // calling function to find first occurence and storing in variable
    int firstIndex = firstOccurence(occurence, 10, 3);

    // calling function to find last occurence and storing in variable
    int lastIndex = lastOccurence(occurence, 10, 3);

    // total number of occurence of an element
    int total = (lastIndex - firstIndex) + 1;
}

int main() {
    int array[10] = {1, 2, 3, 3, 3, 3, 4, 5};

    cout << "first occurence of 3 is: " << firstOccurence(array, 10, 3) << endl;
    cout << "last occurence of 3 is: " << lastOccurence(array, 10, 3) << endl;
    cout << "total number of occuerrence of 3: " << totalOccurence(array);

    return 0;
}