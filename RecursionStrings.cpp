#include <iostream>
#include <string>
using namespace std;

void reverseString(string &s, int i, int j) {
    if (i > j) {
        return;
    }
    swap(s[i], s[j]);
    i++;
    j--;
    reverseString(s, i, j);
}

bool isPalindrome(string s, int i, int j) {
    if (i > j) {
        return true;
    }

    if (s[i] != s[j]) {
        return false;
    } else {
        return isPalindrome(s, ++i, --j);
    }
}

int main() {
    string st = "abcdef";
    int i = 0, j = st.length() - 1;
    reverseString(st, 0, st.length() - 1);
    cout << st << endl;

    string str = "nitin";
    cout << isPalindrome(str, 0, str.length() - 1);
    return 0;
}