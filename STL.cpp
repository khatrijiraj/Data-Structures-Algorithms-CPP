#include <algorithm>
#include <array>
#include <deque>
#include <iostream>
#include <list>
#include <queue>
#include <stack>
#include <vector>
using namespace std;

int main() {
    /* STL library array */
    cout << "STL library Array" << endl;
    array<int, 4> array1 = {1, 2, 3, 4};
    for (int i = 0; i < array1.size(); i++) {
        cout << array1[i] << " ";
    }
    cout << endl;

    cout << "Element at 2nd index: " << array1.at(2);
    cout << endl;

    cout << "If array is empty? " << array1.empty();
    cout << endl;

    cout << "Front element: " << array1.front();
    cout << endl;

    cout << "Last element: " << array1.back();
    cout << endl;

    swap(array1[2], array1[3]);
    for (int i = 0; i < array1.size(); i++) {
        cout << array1[i] << " ";
    }
    cout << endl;

    /* STL library vector */
    cout << endl;
    cout << "STL library vector" << endl;
    vector<int> vector1;
    cout << "Capacity: " << vector1.capacity();
    cout << endl;
    vector1.push_back(1);
    cout << "Capacity: " << vector1.capacity();
    cout << endl;
    vector1.push_back(2);
    cout << "Capacity: " << vector1.capacity();
    cout << endl;
    vector1.push_back(3);
    cout << "Capacity: " << vector1.capacity();
    cout << endl;
    cout << "Size: " << vector1.size();
    cout << endl;
    cout << "Element at index 2: " << vector1.at(2);
    cout << endl;
    cout << "Vector front element: " << vector1.front();
    cout << endl;
    cout << "Vector last element: " << vector1.back();
    cout << endl;
    vector1.pop_back();
    cout << "Vector after poping last element: ";
    for (int i : vector1) {
        cout << i << " ";
    }
    cout << endl;

    vector<int> vector2(5, 12);
    cout << "Vector of size 5 and each element is 12: ";
    for (int j : vector2) {
        cout << j << " ";
    }
    cout << endl;

    cout << "New vector containing elements of vector2: ";
    vector<int> last(vector2);
    for (int k : last) {
        cout << k << " ";
    }
    cout << endl;

    /* Doubly ended queue */
    cout << endl;
    cout << "Doubly ended queue" << endl;
    deque<int> deque1;
    deque1.push_front(1);
    deque1.push_back(2);
    cout << "Doubly ended queue: ";
    for (int i : deque1) {
        cout << i << " ";
    }
    cout << endl;
    cout << "Element at an index: " << deque1.at(1) << endl;
    cout << "Front element: " << deque1.front() << endl;
    cout << "Last element: " << deque1.back() << endl;
    cout << "Is empty? " << deque1.empty() << endl;
    cout << "Erasing first element: ";
    deque1.erase(deque1.begin(), deque1.begin() + 1);
    for (int i : deque1) {
        cout << i << " ";
    }
    cout << endl;

    /* List STL (doubly linked list) */
    cout << "List STL" << endl;
    list<int> list1;
    /* list methods:
    list1.back();
    list1.begin();
    list1.clear();
    list1.empty();
    list1.erase();
    list1.front();
    list1.max_size();
    list1.pop_back();
    list1.pop_front();
    list1.push_back();
    list1.push_front();
    list1.reverse();
    list1.size(); */

    /* Stack STL */
    cout << "Stack STL" << endl;
    stack<string> stack1;
    /* stack1.empty();
    stack1.pop();
    stack1.push();
    stack1.size();
    stack1.top(); */

    /* Queue */
    cout << "Queue" << endl;
    queue<int> queue1;
    /* queue1.empty();
    queue1.front();
    queue1.pop();
    queue1.push();
    queue1.size(); */

    /* Algorithms */
    /* Binary search */
    vector<int> vector3;
    vector3.push_back(1);
    vector3.push_back(2);
    vector3.push_back(3);
    vector3.push_back(4);
    vector3.push_back(5);

    for (int i : vector3) {
        cout << i << " ";
    }
    cout << endl;
    if (binary_search(vector3.begin(), vector3.end(), 3)) {
        cout << "FOund\n";
    } else {
        cout << "Not found\n";
    }

    /* lower_bound(),upper_bound(); */
    int a = 3;
    int b = 5;
    cout << "Max: " << max(a, b);
    cout << endl;
    cout << "Min: " << min(a, b);
    cout << endl;
    swap(a, b);
    cout << "Swapping: " << a << " " << b;
    cout << endl;

    string abcde = "abcde";
    reverse(abcde.begin(), abcde.end());
    cout << abcde;
    cout << endl;

    cout << "Rotate: ";
    rotate(vector3.begin(), vector3.begin() + 4, vector3.end());
    for (int i : vector3) {
        cout << i << " ";
    }
    cout << endl;

    cout << "Sort: ";
    sort(vector3.begin(), vector3.end());
    for (int i : vector3) {
        cout << i << " ";
    }
    cout << endl;
    return 0;
}