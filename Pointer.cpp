#include <iostream>
using namespace std;

void print(int *p) {
    cout << *p << endl;
}

void update(int *p) {
    *p = *p + 1;
}

void doublePointerUpdate(int **p) {
    // p = p + 1;
    // *p = *p + 1;
    **p = **p + 1;
}

int main() {
    int num = 5;
    int *p = &num;

    cout << *p << endl;
    cout << p << endl;
    cout << num << endl;
    cout << &num << endl;
    cout << &p << endl;

    cout << sizeof(num) << endl;
    cout << sizeof(&num) << endl;
    cout << sizeof(*p) << endl;
    cout << sizeof(p) << endl;

    (*p)++;
    cout << num << endl;
    cout << *p << endl;

    num++;
    cout << num << endl;
    cout << *p << endl;

    cout << endl;

    int arr[5] = {5, 4, 3, 2, 1};
    cout << arr << endl;
    cout << *arr << endl;
    cout << &arr[0] << endl;
    cout << &arr[1] << endl;
    cout << &arr[2] << endl;
    cout << *arr + 3 << endl;
    cout << *(arr + 3) << endl;
    cout << endl;
    /* arr[i] = *(arr + i) */
    /* i[arr] *(i + arr) */
    int temp[10];
    cout << sizeof(temp) << endl;
    int *ptr = &temp[0];
    cout << sizeof(ptr) << endl;
    cout << endl;
    int array[4] = {12, 3, 4, 5};
    char ch[6] = "abcde";
    /* will print address of first */
    cout << array << endl;
    /* print content abcde */
    cout << ch << endl;
    char *c = &ch[0];
    cout << c << endl;

    cout << endl;
    int value = 5;
    int *pointerrr = &value;
    print(pointerrr);
    print(&value);
    cout << "Before: " << *pointerrr << endl;
    update(pointerrr);
    cout << "After: " << *pointerrr << endl;

    cout << endl;
    int i = 5;
    int *pt = &i;
    int **ptrr = &pt;

    cout << i << endl;
    cout << *pt << endl;
    cout << **ptrr << endl;

    cout << &i << endl;
    cout << pt << endl;
    cout << *ptrr << endl;

    cout << endl;
    cout << &pt << endl;
    cout << ptrr << endl;

    cout << &ptrr << endl;

    cout << i << endl;
    doublePointerUpdate(ptrr);
    cout << i << endl;
    return 0;
}