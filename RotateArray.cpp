#include <iostream>
#include <vector>
using namespace std;

/* function to rotate array from a given point */
void rotateArray(vector<int>& vec, int k) {
    /* storing rotated array in temp array to avoid overriding in original array */
    vector<int> temp(vec.size());

    /* loop to put values in temp array after rotation */
    for (int i = 0; i < vec.size(); i++) {
        temp[(i + k) % vec.size()] = vec[i];
    }
    /* copying rotated array back in original array */
    vec = temp;
}

/* function to print array */
void display(vector<int>& vec) {
    /* iterating vector and printing */
    for (int i : vec) {
        cout << i << " ";
    }
}

int main() {
    /* initialized array */
    vector<int> vec = {1, 2, 3, 4, 5, 6};

    /* calling function rotateArray() */
    rotateArray(vec, 3);
    /* printing array after rotating array */
    display(vec);
    return 0;
}