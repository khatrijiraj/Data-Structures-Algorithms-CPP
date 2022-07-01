#include <iostream>
using namespace std;

/* function to reverse char array */
void reverseString(char name[], int size) {
    /* starting and last index of char array */
    int start = 0;
    int end = size - 1;

    /* reversing char array */
    while (start < end) {
        /* swapping first with last and moving to next
        to reverse char array */
        swap(name[start++], name[end--]);
    }
}

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

int main() {
    /* array to store name (one word only) */
    char name[50];
    cout << "Enter your name: ";
    cin >> name;

    /* printing name */
    cout << "Your name is: " << name << endl;

    /* finding length of char array i.e. name
    and storing in len*/
    int len = getLength(name);
    /* printing length of char array */
    cout << "Length of string: " << len << endl;

    /* reversing char array */
    reverseString(name, len);
    /* printing reversed char array*/
    cout << "Reversed string: " << name << endl;
    return 0;
}