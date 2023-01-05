#include <iostream>
using namespace std;

/* Class Node */
class Node {
   public:
    /* value stored in node */
    int data;
    /* next node address */
    Node* next;

    Node(int data) {
        this->data = data;
        this->next = NULL;
    }
};

/* Function to insert new node */
void insertNodeAtHead(Node* &head, int d) {
    
}

int main() {
    Node* node1 = new Node(10);
    cout << node1->data << endl;
    cout << node1->next << endl;
    return 0;
}