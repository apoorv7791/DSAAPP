import { LearningTopicId } from './learningTopics';

export type BlockType = 'subheading' | 'text' | 'code' | 'list';

export interface ContentBlock {
  id: string;
  type: BlockType;
  /** Primary text translation key (e.g. 'whatIs' -> topicContent.<topicId>.whatIs) */
  key?: string;
  /** Static text content (used for code blocks or untranslated parts) */
  staticText?: string;
  /** Translation key for language label (e.g. 'common.java') */
  languageKey?: string;
  /** Static string for language label */
  staticLanguage?: string;
  /** Translation key for data type label (e.g. 'common.practice') */
  dataTypeKey?: string;
  /** Static string for data type label */
  staticDataType?: string;
  /** Translation key suffixes for list items */
  listKeys?: string[];
  /** Translation key path for dynamic array lookups (e.g. 'topicContent.queues.listItems') */
  listItemsKey?: string;
  /** Static strings for list items */
  staticItems?: string[];
  /** Translation key suffix for subheading descriptions or paragraphs */
  descKey?: string;
  /** Static string for description or paragraph */
  staticDesc?: string;
  /** Translation key suffix for block titles */
  titleKey?: string;
  /** Static string for block title */
  staticTitle?: string;
}

export interface LessonConfig {
  topicId: LearningTopicId;
  visualizationRoute?: string;
  blocks: ContentBlock[];
}

export const LESSON_REGISTRY: Record<LearningTopicId, LessonConfig> = {
  arrays: {
    topicId: 'arrays',
    visualizationRoute: '/DataVisual/array-visual',
    blocks: [
      { id: '1', type: 'subheading', key: 'whatIs' },
      { id: '2', type: 'text', key: 'whatIsDesc' },
      { id: '3', type: 'subheading', key: 'whyUse' },
      { id: '4', type: 'text', key: 'whyUseDesc' },
      {
        id: '5',
        type: 'list',
        listKeys: ['withoutArrays', 'hardToProcess', 'noStructuredWay', 'memoryInefficient']
      },
      {
        id: '6',
        type: 'code',
        languageKey: 'common.java',
        dataTypeKey: 'common.comparison',
        staticText: `// Without Array\nint a = 10;\nint b = 20;\nint c = 30;\n\n// With Array\nint[] arr = {10, 20, 30};`
      },
      { id: '7', type: 'text', key: 'solveDescription' },
      {
        id: '8',
        type: 'code',
        languageKey: 'common.java',
        dataTypeKey: 'common.integerArray',
        staticText: `int[] arr = {10, 20, 30, 40};`
      },
      {
        id: '9',
        type: 'code',
        languageKey: 'common.java',
        dataTypeKey: 'common.integerArray',
        staticText: `Accessing elements: arr[0] = {10};\n arr[1] = {20}; \n arr[2] = {30};\n arr[3] = {40};`
      },
      { id: '10', type: 'subheading', key: 'keyPoints' },
      {
        id: '11',
        type: 'list',
        listKeys: ['fixedSize', 'fastAccess', 'contiguousMemory']
      },
      { id: '12', type: 'subheading', key: 'operations' },
      {
        id: '13',
        type: 'list',
        listKeys: ['traversal', 'insertion', 'deletion', 'searching']
      },
      { id: '14', type: 'subheading', key: 'tryYourself' },
      {
        id: '15',
        type: 'code',
        languageKey: 'common.java',
        dataTypeKey: 'common.practice',
        staticText: `// Print all elements\nfor(int i=0; i<arr.length; i++){\n   System.out.println(arr[i]);\n}`
      },
      {
        id: '16',
        type: 'code',
        languageKey: 'common.java',
        dataTypeKey: 'common.practice',
        staticText: `// search an element (20)\nboolean found = false;\nfor(int i=0; i<arr.length; i++){\n   if(arr[i] == 20){\n       found = true;\n       break;\n   }\n}`
      },
      {
        id: '17',
        type: 'code',
        languageKey: 'common.java',
        dataTypeKey: 'common.practice',
        staticText: `// Insert an element at a specific index\nint[] newArr = new int[arr.length + 1];\nfor(int i=0; i<index; i++){\n   newArr[i] = arr[i];\n}\nnewArr[index] = element;\nfor(int i=index; i<arr.length; i++){\n   newArr[i+1] = arr[i];\n}`
      },
      {
        id: '18',
        type: 'code',
        languageKey: 'common.java',
        dataTypeKey: 'common.practice',
        staticText: `// Delete an element at a specific index\nvoid deleteAtIndex(int[] arr, int n, int index) {\n    if (index < 0 || index >= n) {\n        System.out.println("Invalid index");\n        return;\n    }\n\n    // Shift elements to the left\n    for (int i = index; i < n - 1; i++) {\n        arr[i] = arr[i + 1];\n    }\n\n    // Reduce size\n    n = n - 1;\n}`
      },
      {
        id: '19',
        type: 'code',
        languageKey: 'common.java',
        dataTypeKey: 'common.practice',
        staticText: `// Search for en element in log time using binary search (sorted array)\nboolean binarySearch(int[] arr, int target) {\n    int left = 0, right = arr.length - 1;\n    while (left <= right) {\n        int mid = left + (right - left) / 2;\n        if (arr[mid] == target) return true;\n        else if (arr[mid] < target) left = mid + 1;\n        else right = mid - 1;\n    }\n    return false;\n}`
      }
    ]
  },
  linkedlist: {
    topicId: 'linkedlist',
    visualizationRoute: '/DataVisual/linked-list-visual',
    blocks: [
      { id: '1', type: 'subheading', key: 'whatIs' },
      { id: '2', type: 'text', key: 'whatIsDesc' },
      { id: '3', type: 'subheading', key: 'whyUse' },
      { id: '4', type: 'text', key: 'whyUseDesc' },
      {
        id: '5',
        type: 'list',
        listKeys: ['dynamicSize', 'efficientInsertDelete', 'noShifting']
      },
      {
        id: '6',
        type: 'code',
        languageKey: 'common.java',
        dataTypeKey: 'common.nodeClass',
        staticText: `class Node {\n    int data;\n    Node next;\n\n    Node(int data) {\n        this.data = data;\n        this.next = null;\n    }\n}`
      },
      {
        id: '7',
        type: 'code',
        languageKey: 'common.java',
        dataTypeKey: 'common.linkedListClass',
        staticText: `class LinkedList {\n    Node head;\n\n    LinkedList() {\n        this.head = null;\n    }\n}`
      },
      {
        id: '8',
        type: 'code',
        languageKey: 'common.java',
        dataTypeKey: 'common.insertNode',
        staticText: `public void insert(int data) {\n    Node newNode = new Node(data);\n    if (head == null) {\n        head = newNode;\n    } else {\n        Node current = head;\n        while (current.next != null) {\n            current = current.next;\n        }\n        current.next = newNode;\n    }\n}`
      },
      {
        id: '10',
        type: 'code',
        languageKey: 'common.java',
        dataTypeKey: 'common.displayNode',
        staticText: `public void display() {\n    Node current = head;\n    while (current != null) {\n        System.out.print(current.data + " ");\n        current = current.next;\n    }\n}`
      },
      {
        id: '11',
        type: 'code',
        languageKey: 'common.java',
        dataTypeKey: 'common.deleteNode',
        staticText: `void delete(int key) {\n    Node temp = head, prev = null;\n\n    if (temp != null && temp.data == key) {\n        head = temp.next;\n        return;\n    }\n\n    while (temp != null && temp.data != key) {\n        prev = temp;\n        temp = temp.next;\n    }\n\n    if (temp == null) return;\n\n    prev.next = temp.next;\n}`
      },
      {
        id: '12',
        type: 'code',
        languageKey: 'common.java',
        dataTypeKey: 'common.mainMethod',
        staticText: `\n    void main(){\n        var list = new LinkedList();\n            list.insert(10);\n            list.insert(20);\n            list.insert(30);\n            list.insert(40);\n            list.insert(50);\n            list.display();\n\n    }\n`
      },
      {
        id: '13',
        type: 'code',
        languageKey: 'common.java',
        dataTypeKey: 'common.output',
        staticText: `Linked List: 10 -> 20 -> 30 -> 40 -> 50 -> null`
      }
    ]
  },
  stacks: {
    topicId: 'stacks',
    visualizationRoute: '/DataVisual/stack-visual',
    blocks: [
      { id: '1', type: 'subheading', key: 'title' },
      { id: '2', type: 'text', key: 'description' },
      { id: '3', type: 'subheading', key: 'whyTitle' },
      { id: '4', type: 'text', key: 'whyDesc' },
      {
        id: '5',
        type: 'code',
        languageKey: 'common.java',
        dataTypeKey: 'common.stackImplementation',
        staticText: `class Stack {\n    int stk[] = new int[100];\n    int top = -1;\n}`
      },
      {
        id: '6',
        type: 'code',
        languageKey: 'common.java',
        dataTypeKey: 'common.pushOperations',
        staticText: `void push(int item) {\nif (top >= 99) {\n    System.out.println("Stack overflow");\n} else {\n    stk[++top] = item;\n    }\n}`
      },
      {
        id: '7',
        type: 'code',
        languageKey: 'common.java',
        dataTypeKey: 'common.popOperations',
        staticText: `int pop() {\nif (top < 0) {\n    System.out.println("Stack underflow");\n    return 0;\n} else {\n    return stk[top--];\n    }\n}`
      },
      {
        id: '8',
        type: 'code',
        languageKey: 'common.java',
        dataTypeKey: 'common.peekOperations',
        staticText: `int peek() {\n if (top < 0) {\n    System.out.println("Stack is empty");\n    return 0;\n} else {\n    return stk[top];\n    }\n}`
      },
      {
        id: '9',
        type: 'code',
        languageKey: 'common.java',
        dataTypeKey: 'common.isEmptyOperations',
        staticText: `boolean isEmpty() {\nreturn (top < 0);\n}`
      },
      {
        id: '10',
        type: 'code',
        languageKey: 'common.java',
        dataTypeKey: 'common.displayStack',
        staticText: `void display() {\nif (top < 0) {\n    System.out.println("Stack is empty");\n} else {\n    for (int i = top; i >= 0; i--) {\n        System.out.print(stk[i] + " ");\n    }\n    System.out.println();\n    }\n}`
      }
    ]
  },
  queues: {
    topicId: 'queues',
    visualizationRoute: '/DataVisual/queue-visual',
    blocks: [
      { id: '1', type: 'subheading', key: 'title' },
      { id: '2', type: 'text', key: 'description' },
      { id: '3', type: 'subheading', key: 'whyTitle' },
      { id: '4', type: 'text', key: 'whyDesc' },
      {
        id: '5',
        type: 'code',
        languageKey: 'common.java',
        dataTypeKey: 'common.queueImplementation',
        staticText: `class Queue {\n    int queue[] = new int[100];\n    int front = 0;\n    int rear = -1;\n    }`
      },
      {
        id: '6',
        type: 'code',
        languageKey: 'common.java',
        dataTypeKey: 'common.enqueueOperations',
        staticText: `void enqueue(int item) {\n    if (rear >= 99) {\n        System.out.println("Queue overflow");\n    } else {\n        queue[++rear] = item;\n    }\n}`
      },
      {
        id: '7',
        type: 'code',
        languageKey: 'common.java',
        dataTypeKey: 'common.dequeueOperations',
        staticText: `int dequeue() {\n    if (front > rear) {\n        System.out.println("Queue underflow");\n        return -1;\n    } else {\n        return queue[front++];\n    }\n}`
      },
      {
        id: '8',
        type: 'code',
        languageKey: 'common.java',
        dataTypeKey: 'common.peekOperations',
        staticText: `int peek() {\n    if (front > rear) {\n        System.out.println("Queue is empty");\n        return -1;\n    } else {\n        return queue[front];\n    }\n}`
      },
      {
        id: '9',
        type: 'code',
        languageKey: 'common.java',
        dataTypeKey: 'common.sizeOperation',
        staticText: `int size() {\n    return rear - front + 1;\n}`
      },
      {
        id: '10',
        type: 'list',
        listItemsKey: 'topicContent.queues.listItems'
      }
    ]
  },
  hashmaps: {
    topicId: 'hashmaps',
    visualizationRoute: '/DataVisual/hash-map-visual',
    blocks: [
      { id: '1', type: 'subheading', key: 'title' },
      { id: '2', type: 'text', key: 'description' },
      { id: '3', type: 'subheading', key: 'realLife' },
      { id: '4', type: 'text', key: 'realLifeDesc' },
      { id: '5', type: 'subheading', key: 'howWorks' },
      { id: '6', type: 'text', key: 'howWorksDesc' },
      {
        id: '7',
        type: 'code',
        staticLanguage: 'Java',
        staticDataType: 'Hash Function',
        staticText: `int index = key % size;`
      },
      { id: '8', type: 'subheading', staticTitle: 'Why is it fast?' },
      {
        id: '9',
        type: 'list',
        staticItems: [
          'Direct access using index (O(1) average)',
          'No need to traverse the entire data',
          'Efficient for large datasets'
        ]
      },
      { id: '10', type: 'subheading', staticTitle: 'Collision Problem' },
      {
        id: '11',
        type: 'text',
        staticText: 'Sometimes two different keys map to the same index. This is called a collision.'
      },
      {
        id: '12',
        type: 'code',
        staticLanguage: 'Java',
        staticDataType: 'Collision Example',
        staticText: `23 % 10 = 3\n33 % 10 = 3`
      },
      { id: '13', type: 'subheading', staticTitle: 'Solution' },
      {
        id: '14',
        type: 'text',
        staticText: 'To handle collisions, we use a LinkedList (or similar structure) to store multiple values at the same index.'
      }
    ]
  },
  trees: {
    topicId: 'trees',
    visualizationRoute: '/DataVisual/tree-visual',
    blocks: [
      { id: '1', type: 'subheading', key: 'title' },
      { id: '2', type: 'text', key: 'description' },
      { id: '3', type: 'subheading', key: 'whyTitle' },
      { id: '4', type: 'text', key: 'whyDesc' },
      { id: '5', type: 'subheading', key: 'keyOps' },
      {
        id: '6',
        type: 'list',
        listItemsKey: 'topicContent.trees.keyOpsItems'
      },
      {
        id: '7',
        type: 'code',
        staticLanguage: 'Java',
        staticDataType: 'Tree Implementation',
        staticText: `class TreeNode {\n    int data;\n    TreeNode left, right;\n    \n    TreeNode(int item) {\n        data = item;\n        left = right = null;\n    }\n}`
      },
      {
        id: '8',
        type: 'code',
        staticLanguage: 'Java',
        staticDataType: 'Insertion',
        staticText: `void insert(int key) {\n    root = insertRec(root, key);\n}\n\nTreeNode insertRec(TreeNode root, int key) {\n    if (root == null) {\n        root = new TreeNode(key);\n        return root;\n    }\n    if (key < root.data)\n        root.left = insertRec(root.left, key);\n    else if (key > root.data)\n        root.right = insertRec(root.right, key);\n    \n    return root;\n}`
      },
      {
        id: '9',
        type: 'code',
        staticLanguage: 'Java',
        staticDataType: 'Deletion',
        staticText: `void delete(int key) {\n    root = deleteRec(root, key);\n}\n\nTreeNode deleteRec(TreeNode root, int key) {\n    if (root == null) return root;\n\n    if (key < root.data)\n        root.left = deleteRec(root.left, key);\n    else if (key > root.data)\n        root.right = deleteRec(root.right, key);\n    else {\n        if (root.left == null) return root.right;\n        else if (root.right == null) return root.left;\n        root.data = minValue(root.right);\n        root.right = deleteRec(root.right, root.data);\n    }\n    return root;\n}`
      }
    ]
  },
  graphs: {
    topicId: 'graphs',
    visualizationRoute: '/DataVisual/graph-visual',
    blocks: [
      { id: '1', type: 'subheading', key: 'title' },
      { id: '2', type: 'text', key: 'description' },
      { id: '3', type: 'subheading', key: 'whyTitle' },
      { id: '4', type: 'text', key: 'whyDesc' },
      { id: '5', type: 'subheading', key: 'typesTitle' },
      {
        id: '6',
        type: 'list',
        listItemsKey: 'topicContent.graphs.types'
      },
      { id: '7', type: 'subheading', key: 'repsTitle' },
      { id: '8', type: 'text', key: 'repsDesc' },
      {
        id: '9',
        type: 'code',
        staticLanguage: 'Java',
        staticDataType: 'Graph Implementation (Adjacency List)',
        staticText: `class Graph {\n    int V; // number of vertices\n    LinkedList<Integer> adjListArray[]; // adjacency list\n\n    Graph(int V) {\n        this.V = V;\n        adjListArray = new LinkedList[V];\n        for (int i = 0; i < V; i++) {\n            adjListArray[i] = new LinkedList();\n        }\n    }\n}`
      },
      {
        id: '10',
        type: 'code',
        staticLanguage: 'Java',
        staticDataType: 'Graph Implementation (Adjacency Matrix)',
        staticText: `class Graph {\n    int V; // number of vertices\n    boolean adjMatrix[][]; // adjacency matrix\n\n    Graph(int V) {\n        this.V = V;\n        adjMatrix = new boolean[V][V];\n        for (int i = 0; i < V; i++) {\n            for (int j = 0; j < V; j++) {\n                adjMatrix[i][j] = false;\n            }\n        }\n    }\n\n    void addEdge(int src, int dest) {\n        adjMatrix[src][dest] = true;\n        adjMatrix[dest][src] = true; // for undirected graph\n    }\n}`
      }
    ]
  },
  heaps: {
    topicId: 'heaps',
    visualizationRoute: '/DataVisual/heap-visual',
    blocks: [
      { id: '1', type: 'subheading', key: 'title' },
      { id: '2', type: 'text', key: 'description' },
      { id: '3', type: 'subheading', key: 'whyTitle' },
      { id: '4', type: 'text', key: 'whyDesc' },
      { id: '5', type: 'subheading', key: 'typesTitle' },
      { id: '6', type: 'text', key: 'typesDesc' },
      { id: '7', type: 'subheading', key: 'opsTitle' },
      { id: '8', type: 'text', key: 'opsDesc' },
      {
        id: '9',
        type: 'code',
        staticLanguage: 'Java',
        staticDataType: 'Heap Implementation',
        staticText: `class Heap {\n    int heap[] = new int[100];\n    int size = 0;\n    \n    void insert(int item) {\n        heap[size++] = item;\n        heapifyUp(size - 1);\n    }\n    \n    void heapifyUp(int index) {\n        if (index == 0) return;\n        int parent = (index - 1) / 2;\n        if (heap[index] > heap[parent]) {\n            int temp = heap[index];\n            heap[index] = heap[parent];\n            heap[parent] = temp;\n            heapifyUp(parent);\n        }\n    }\n}`
      },
      {
        id: '10',
        type: 'code',
        staticLanguage: 'Java',
        staticDataType: 'Extract Max Operation',
        staticText: `int extractMax() {\n    if (size == 0) {\n        System.out.println("Heap underflow");\n        return -1;\n    }\n    int max = heap[0];\n    heap[0] = heap[size - 1];\n    size--;\n    heapifyDown(0);\n    return max;\n}`
      }
    ]
  },
  searching: {
    topicId: 'searching',
    visualizationRoute: '/AlgoVisual/searching-visual',
    blocks: [
      { id: '1', type: 'subheading', key: 'title', descKey: 'desc' },
      {
        id: '2',
        type: 'list',
        titleKey: 'categories.algorithms',
        staticItems: [
          'Linear Search',
          'Binary Search'
        ]
      },
      { id: '3', type: 'subheading', key: 'linearTitle', descKey: 'linearDesc' },
      { id: '4', type: 'subheading', key: 'binaryTitle', descKey: 'binaryDesc' },
      {
        id: '5',
        type: 'code',
        titleKey: 'topicContent.searching.linearTitle',
        languageKey: 'common.java',
        staticText: `public class LinearSearch {\n    public static int search(int[] arr, int x) {\n        for (int i = 0; i < arr.length; i++) {\n            if (arr[i] == x) {\n                return i;\n            }\n        }\n        return -1;\n    }\n}`
      },
      {
        id: '6',
        type: 'code',
        titleKey: 'topicContent.searching.binaryTitle',
        languageKey: 'common.java',
        staticText: `public class BinarySearch {\n    public static int search(int[] arr, int x) {\n        int left = 0;\n        int right = arr.length - 1;\n        while (left <= right) {\n            int mid = left + (right - left) / 2;\n            if (arr[mid] == x) {\n                return mid;\n            }\n            if (arr[mid] < x) {\n                left = mid + 1;\n            } else {\n                right = mid - 1;\n            }\n        }\n        return -1;\n    }\n}`
      }
    ]
  },
  sorting: {
    topicId: 'sorting',
    visualizationRoute: '/AlgoVisual/sorting-visual',
    blocks: [
      { id: '1', type: 'subheading', key: 'title', descKey: 'description' },
      {
        id: '2',
        type: 'list',
        titleKey: 'categories.algorithms',
        listKeys: ['bubbleTitle', 'selectionTitle', 'insertionTitle', 'mergeTitle', 'quickTitle', 'heapTitle']
      },
      {
        id: '3',
        type: 'code',
        titleKey: 'topicContent.sorting.bubbleTitle',
        descKey: 'bubbleDesc',
        staticLanguage: 'Java',
        staticText: `public class BubbleSort {\n    public static void bubbleSort(int[] arr) {\n        int n = arr.length;\n        for (int i = 0; i < n - 1; i++) {\n            for (int j = 0; j < n - i - 1; j++) {\n                if (arr[j] > arr[j + 1]) {\n                    int temp = arr[j];\n                    arr[j] = arr[j + 1];\n                    arr[j + 1] = temp;\n                }\n            }\n        }\n    }\n}`
      },
      {
        id: '4',
        type: 'code',
        titleKey: 'topicContent.sorting.selectionTitle',
        descKey: 'selectionDesc',
        staticLanguage: 'Java',
        staticText: `public class SelectionSort {\n    public static void selectionSort(int[] arr) {\n        int n = arr.length;\n        for (int i = 0; i < n - 1; i++) {\n            int minIndex = i;\n            for (int j = i + 1; j < n; j++) {\n                if (arr[j] < arr[minIndex]) {\n                    minIndex = j;\n                }\n            }\n            int temp = arr[i];\n            arr[i] = arr[minIndex];\n            arr[minIndex] = temp;\n        }\n    }\n}`
      },
      {
        id: '5',
        type: 'code',
        titleKey: 'topicContent.sorting.insertionTitle',
        descKey: 'insertionDesc',
        staticLanguage: 'Java',
        staticText: `public class InsertionSort {\n    public static void insertionSort(int[] arr) {\n        int n = arr.length;\n        for (int i = 1; i < n; i++) {\n            int key = arr[i];\n            int j = i - 1;\n            while (j >= 0 && arr[j] > key) {\n                arr[j + 1] = arr[j];\n                j = j - 1;\n            }\n            arr[j + 1] = key;\n        }\n    }\n}`
      },
      {
        id: '6',
        type: 'code',
        titleKey: 'topicContent.sorting.mergeTitle',
        descKey: 'mergeDesc',
        staticLanguage: 'Java',
        staticText: `public class MergeSort {\n    public static void merge(int[] arr, int l, int m, int r) {\n        int n1 = m - l + 1;\n        int n2 = r - m;\n        int L[] = new int[n1];\n        int R[] = new int[n2];\n        for (int i = 0; i < n1; ++i) L[i] = arr[l + i];\n        for (int j = 0; j < n2; ++j) R[j] = arr[m + 1 + j];\n        int i = 0, j = 0;\n        int k = l;\n        while (i < n1 && j < n2) {\n            if (L[i] <= R[j]) {\n                arr[k] = L[i];\n                i++;\n            } else {\n                arr[k] = R[j];\n                j++;\n            }\n            k++;\n        }\n        while (i < n1) {\n            arr[k] = L[i];\n            i++;\n            k++;\n        }\n        while (j < n2) {\n            arr[k] = R[j];\n            j++;\n            k++;\n        }\n    }\n\n    public static void sort(int[] arr, int l, int r) {\n        if (l < r) {\n            int m = l + (r - l) / 2;\n            sort(arr, l, m);\n            sort(arr, m + 1, r);\n            merge(arr, l, m, r);\n        }\n    }\n}`
      },
      {
        id: '7',
        type: 'code',
        titleKey: 'topicContent.sorting.quickTitle',
        descKey: 'quickDesc',
        staticLanguage: 'Java',
        staticText: `public class QuickSort {\n    static int partition(int[] arr, int low, int high) {\n        int pivot = arr[high];\n        int i = low - 1;\n        for (int j = low; j < high; j++) {\n            if (arr[j] < pivot) {\n                i++;\n                int temp = arr[i];\n                arr[i] = arr[j];\n                arr[j] = temp;\n            }\n        }\n        int temp = arr[i + 1];\n        arr[i + 1] = arr[high];\n        arr[high] = temp;\n        return i + 1;\n    }\n\n    static void quickSort(int[] arr, int low, int high) {\n        if (low < high) {\n            int pi = partition(arr, low, high);\n            quickSort(arr, low, pi - 1);\n            quickSort(arr, pi + 1, high);\n        }\n    }\n}`
      },
      {
        id: '8',
        type: 'code',
        titleKey: 'topicContent.sorting.heapTitle',
        descKey: 'heapDesc',
        staticLanguage: 'Java',
        staticText: `public class HeapSort {\n    public void sort(int arr[]) {\n        int n = arr.length;\n        for (int i = n / 2 - 1; i >= 0; i--) heapify(arr, n, i);\n        for (int i = n - 1; i > 0; i--) {\n            int temp = arr[0];\n            arr[0] = arr[i];\n            arr[i] = temp;\n            heapify(arr, i, 0);\n        }\n    }\n\n    void heapify(int arr[], int n, int i) {\n        int largest = i;\n        int l = 2 * i + 1;\n        int r = 2 * i + 2;\n        if (l < n && arr[l] > arr[largest]) largest = l;\n        if (r < n && arr[r] > arr[largest]) largest = r;\n        if (largest != i) {\n            int swap = arr[i];\n            arr[i] = arr[largest];\n            arr[largest] = swap;\n            heapify(arr, n, largest);\n        }\n    }\n}`
      }
    ]
  },
  recursion: {
    topicId: 'recursion',
    visualizationRoute: '/AdvanceVisual/recursion',
    blocks: [
      { id: '1', type: 'subheading', key: 'title' },
      { id: '2', type: 'text', key: 'description' },
      { id: '3', type: 'subheading', key: 'whyTitle' },
      { id: '4', type: 'text', key: 'whyDesc' },
      { id: '5', type: 'subheading', key: 'howWorks' },
      { id: '6', type: 'text', key: 'howWorksDesc' },
      {
        id: '7',
        type: 'code',
        staticLanguage: 'Java',
        staticDataType: 'Factorial implementation',
        staticText: `public static int factorial(int n) {\n    if (n == 0) {\n        return 1;\n    }\n    return n * factorial(n - 1);\n} \n    public static void main(){\n        System.out.println(factorial(5));\n    }\n    output: 1 2 6 24 120`
      },
      {
        id: '8',
        type: 'code',
        staticLanguage: 'Java',
        staticDataType: 'Fibonacci implementation',
        staticText: `public static int fibonacci(int n) {\n    if (n <= 1) {\n        return n;\n    }\n    return fibonacci(n - 1) + fibonacci(n - 2);\n}\n    public static void main(){\n        System.out.println(fibonacci(10));\n    }\n    output: 0 1 1 2 3 5 8 13 21 34`
      }
    ]
  },
  'dynamic-programming': {
    topicId: 'dynamic-programming',
    visualizationRoute: '/AdvanceVisual/dynamic-visual',
    blocks: [
      { id: '1', type: 'subheading', key: 'title' },
      { id: '2', type: 'text', key: 'description' },
      { id: '3', type: 'subheading', key: 'charTitle' },
      { id: '4', type: 'list', listItemsKey: 'topicContent.dp.charDesc' },
      { id: '5', type: 'subheading', key: 'whyTitle' },
      { id: '6', type: 'text', key: 'whyDesc' },
      { id: '7', type: 'subheading', key: 'typesTitle' },
      { id: '9', type: 'list', listItemsKey: 'topicContent.dp.typesDesc' },
      {
        id: '14',
        type: 'code',
        staticDataType: 'Top down approach',
        staticText: `// DP using memoization\nfunction fibonacci(n, memo = {}) {\n  if (n in memo) return memo[n];\n  if (n <= 1) return n;\n  memo[n] = fibonacci(n - 1, memo) + fibonacci(n - 2, memo);\n  return memo[n];\n}`
      },
      {
        id: '15',
        type: 'code',
        staticDataType: 'Bottom up approach',
        staticText: `// DP using tabulation\nfunction fibonacci(n) {\n  if (n <= 1) return n;\n  let dp = new Array(n + 1);\n  dp[0] = 0;\n  dp[1] = 1;\n  for (let i = 2; i <= n; i++) {\n    dp[i] = dp[i - 1] + dp[i - 2];\n  }\n  return dp[n];\n}`
      }
    ]
  },
  'graph-algorithms': {
    topicId: 'graph-algorithms',
    visualizationRoute: '/AdvanceVisual/graph-visual',
    blocks: [
      { id: '1', type: 'subheading', key: 'title', descKey: 'description' },
      { id: '2', type: 'subheading', key: 'whyTitle', descKey: 'whyDesc' },
      {
        id: '3',
        type: 'list',
        staticItems: [
          'Breadth-First Search (BFS)',
          'Depth-First Search (DFS)'
        ]
      },
      {
        id: '4',
        type: 'code',
        staticLanguage: 'Java',
        staticDataType: 'graph',
        staticText: `// BFS Implementation\npublic void bfs(int start) {\n    boolean[] visited = new boolean[vertices];\n    Queue<Integer> queue = new LinkedList<>();\n    \n    visited[start] = true;\n    queue.add(start);\n    \n    while (!queue.isEmpty()) {\n        int node = queue.poll();\n        System.out.print(node + " ");\n        \n        for (int neighbor : adjList.get(node)) {\n            if (!visited[neighbor]) {\n                visited[neighbor] = true;\n                queue.add(neighbor);\n            }\n        }\n    }\n}`
      },
      {
        id: '5',
        type: 'code',
        staticLanguage: 'Java',
        staticDataType: 'graph',
        staticText: `// DFS Implementation\npublic void dfs(int start) {\n    boolean[] visited = new boolean[vertices];\n    dfsHelper(start, visited);\n}\n\nprivate void dfsHelper(int node, boolean[] visited) {\n    visited[node] = true;\n    System.out.print(node + " ");\n    \n    for (int neighbor : adjList.get(node)) {\n        if (!visited[neighbor]) {\n            dfsHelper(neighbor, visited);\n        }\n    }\n}`
      }
    ]
  },
  'greedy-algorithm': {
    topicId: 'greedy-algorithm',
    visualizationRoute: '/AdvanceVisual/greedy-visual',
    blocks: [
      { id: '1', type: 'subheading', key: 'title', descKey: 'description' },
      {
        id: '2',
        type: 'list',
        staticItems: [
          'Coin Change Problem',
          'Activity Selection Problem',
          'Huffman Coding',
          'Kruskal\'s Algorithm',
          'Prim\'s Algorithm'
        ]
      },
      {
        id: '3',
        type: 'code',
        staticLanguage: 'Java',
        staticDataType: 'greedy',
        staticText: `// Coin Change Problem\npublic int coinChange(int[] coins, int amount) {\n    Arrays.sort(coins);\n    int count = 0;\n    \n    for (int i = coins.length - 1; i >= 0; i--) {\n        while (amount >= coins[i]) {\n            amount -= coins[i];\n            count++;\n        }\n    }\n    \n    return amount == 0 ? count : -1;\n}`
      },
      {
        id: '4',
        type: 'code',
        staticLanguage: 'Java',
        staticDataType: 'greedy',
        staticText: `// Activity Selection Problem\npublic void activitySelection(int[] start, int[] end) {\n    int n = start.length;\n    int[][] activities = new int[n][3];\n    \n    for (int i = 0; i < n; i++) {\n        activities[i][0] = start[i];\n        activities[i][1] = end[i];\n        activities[i][2] = i;\n    }\n    \n    Arrays.sort(activities, (a, b) -> a[1] - b[1]);\n    \n    System.out.print("Selected activities: " + activities[0][2] + " ");\n    int lastEnd = activities[0][1];\n    \n    for (int i = 1; i < n; i++) {\n        if (activities[i][0] >= lastEnd) {\n            System.out.print(activities[i][2] + " ");\n            lastEnd = activities[i][1];\n        }\n    }\n}`
      }
    ]
  }
};
