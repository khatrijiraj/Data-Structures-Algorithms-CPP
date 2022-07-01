#include <iostream>
using namespace std;

/* function to find length of char array */
int getLength(char name[]) {
    /* size of char array*/
    int size = 0;

    /* loop will run until it finds termination character = '\0' */
    for (int i = 0; name[i] != '\0'; i++) {
        size++;
    }
    /* returing size */
    return size;
}

/* function to check if char array is palindrome */
bool checkPalindrome(char name[], int size) {
    /* starting and last index of char array */
    int start = 0;
    int end = size - 1;

    /* if first and last are not same then
    its not a palindrome and moving to next
    if they are same */
    while (start <= end) {
        if (name[start] != name[end]) {
            return false;
        } else {
            start++;
            end--;
        }
    }
    return true;
}

int main() {
    /* array to store name (one word only) */
    char name[50];
    cout << "Enter your name: ";
    cin >> name;

    /* finding length of char array i.e. name
    and storing in len*/
    int size = getLength(name);

    /* checking palindrome */
    if (checkPalindrome(name, size)) {
        cout << "Its a palindrome" << endl;
    } else {
        cout << "Not a palindrome" << endl;
    }
    return 0;
}