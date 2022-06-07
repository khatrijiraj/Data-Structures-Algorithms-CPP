/* SQUARE ROOT OF A NUMBER USING BINARY SEARCH */
#include <iostream>
using namespace std;

// function to find square root of a number using binary search upto a give precision
float SquareRootBinarySearch(int num, int precision) {
    int start = 0, end = num, mid;
    // we will store our answer in this
    float answer;

    // binarySearch
    while (start <= end) {
        /* mid index of array here we are not writing (s+e)/2 too handle a condition
        where start and end both are 2^31-1 which will execeed the int range while adding */
        mid = start + (end - start) / 2;

        /* if square of mid is less than number it means it is a solution */
        if (mid * mid == num) {
            answer = mid;
            break;
        } else if (mid * mid < num) {
            /* if square is less than number that means right side of mid */
            start = mid + 1;
            /* it can be possible solution so we will store this */
            answer = mid;
        } else {
            /* moving to left side of mid */
            end = mid - 1;
        }
    }

    /* for fraction upto a given precision */
    float increment = 0.1;

    // for loop will run upto a precision
    for (int i = 0; i < precision; i++) {
        // calulating value for each place of fraction
        while (answer * answer <= num) {
            answer += increment;
        }

        /* if loop doesnot satisfy condition we will subtract
        previously added increment value from answer */
        answer = answer - increment;

        // moving to next place of precision
        increment = increment / 10;
    }
    // returning answer that is root of a number
    return answer;
}

// main function
int main() {
    int num, precision;

    //enter the number
    cout << "Enter the number: ";
    cin >> num;

    //enter precision
    cout << "Enter the precision: ";
    cin >> precision;

    //storing square root in result variable by calling function
    float result = SquareRootBinarySearch(num, precision);

    //displaying result
    cout << "Square root of " << num << " is: " << result << endl;
    return 0;
}