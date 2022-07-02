#include <iostream>
#include <string>
using namespace std;

/* class to check if a string is palindrome */
class Solution {
    /* private functions */
   private:
    /* functions to validate character */
    bool validChar(char ch) {
        /* except all the char mentioned in if condition will be removed */
        if ((ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z') || (ch >= '0' && ch <= '9')) {
            return true;
        } else {
            return false;
        }
    }

    /* converting Uppercase to Lowercase */
    char toLowerCase(char ch) {
        /* if already in lowercase return char */
        if ((ch >= 'a' && ch <= 'z') || (ch >= '0' && ch <= '9')) {
            return ch;
        } else {
            /* let ch = 'B'
            'B' - 'A' = 1
            then 1 + 'a' = 'b'
            hence it will return lowercase
            follow ASCII values for more */
            char temp = ch - 'A' + 'a';
            return temp;
        }
    }

    /* function to check if char array is palindrome */
    bool checkPalindrome(string s) {
        /* starting and last index of char array */
        int start = 0;
        int end = s.size() - 1;
        /* if first and last are not same then
        its not a palindrome and moving to next
        if they are same */
        while (start <= end) {
            if (s[start] != s[end]) {
                return false;
            } else {
                start++;
                end--;
            }
        }
        return true;
    }

    /* public functions */
   public:
    /* function to check if a string is palindrome */
    bool isPalindrome(string s) {
        /* will store string in this after removing invalid char
        and converting to lowercase */
        string temp = "";

        /* calling validChar() function
        to push only valid character */
        for (int i = 0; i < s.size(); i++) {
            if (validChar(s[i])) {
                temp.push_back(s[i]);
            }
        }
        cout << temp << endl;

        /* calling toLowerCase() function
        to convert string to lowercase */
        for (int j = 0; j < temp.size(); j++) {
            temp[j] = toLowerCase(temp[j]);
        }
        cout << temp << endl;

        /* calling function checkPalindrome() */
        return checkPalindrome(temp);
    }
};

int main() {
    /* creating class object */
    Solution s;

    /* string to check palindrome */
    string str = "1 A man, a plan, a canal: Panama 1";

    /* if returns true its a palindrome
    else not a palindrome */
    if (s.isPalindrome(str)) {
        cout << "Is palindrome" << endl;
    } else {
        cout << "Not palindrome" << endl;
    }
    return 0;
}