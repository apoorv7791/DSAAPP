# Requirements Document

## Introduction

This feature adds interactive, animated visualizations for four data structures in the AlgoTrainer app: Binary Search Tree (BST), Graph, Min/Max Heap, and HashMap. Each visualization lives in the existing `app/DataVisual/` directory and follows the established pattern from the working Array, LinkedList, Stack, and Queue visualizations — animated React Native primitives, `ThemeContext` for theming, `Animated` from `react-native` for motion, and a consistent control layout (text input + action buttons + visual canvas).

Sorting and searching visualizations are out of scope for this feature.

---

## Glossary

- **Visualizer**: A React Native screen component in `app/DataVisual/` that renders an interactive, animated representation of a data structure.
- **BST_Visualizer**: The tree visualization component at `app/DataVisual/tree-visual.tsx`.
- **Graph_Visualizer**: The graph visualization component at `app/DataVisual/graph-visual.tsx`.
- **Heap_Visualizer**: The heap visualization component at `app/DataVisual/heap-visual.tsx`.
- **HashMap_Visualizer**: The hash map visualization component at `app/DataVisual/hash-map-visual.tsx`.
- **Node**: A single visual element representing one value in a data structure.
- **Edge**: A visual line connecting two Nodes in a tree or graph.
- **Bucket**: A numbered slot in the HashMap that holds zero or more key-value pairs.
- **Collision**: The condition where two different keys hash to the same Bucket index.
- **ThemeContext**: The app-wide theme provider exposing `theme.bg`, `theme.primary`, `theme.text`, `theme.border`, `theme.bgSecondary`, `theme.textSecondary`, `theme.textTertiary`, `theme.accent`, and `theme.error`.
- **Animated.Value**: A React Native `Animated.Value` instance used to drive opacity and transform animations.
- **Control Panel**: The section of a Visualizer containing the text input and action buttons.
- **Status Message**: A short text line displayed below the Control Panel that communicates the result of the last operation (e.g., "Node 5 inserted", "Node not found").

---

## Requirements

### Requirement 1: Shared Visual Style and Theme Compliance

**User Story:** As a learner, I want all data structure visualizations to look and feel consistent with the rest of the app, so that the experience feels cohesive.

#### Acceptance Criteria

1. THE Visualizer SHALL use `ThemeContext` for all colors, applying `theme.bg` as the screen background, `theme.primary` as the Node fill color, `theme.text` as the primary label color, `theme.border` as border colors, and `theme.bgSecondary` as the input field background.
2. THE Visualizer SHALL use only React Native primitives (`View`, `Text`, `Animated.View`, `ScrollView`, `Pressable`, `TextInput`) and no external visualization libraries.
3. THE Visualizer SHALL display a `TextInput` for numeric or string input at the top of the screen, styled consistently with the input in `array-visual.tsx` (border color `theme.border`, background `theme.bgSecondary`, text color `theme.text`).
4. THE Visualizer SHALL display action buttons in a grid or row layout below the input, styled with `theme.primary` background and white text, matching the button style in `array-visual.tsx`.
5. THE Visualizer SHALL display a Status Message below the Control Panel that updates after each operation.
6. WHEN the device theme changes, THE Visualizer SHALL re-render all styled elements using the updated `ThemeContext` values without requiring a screen reload.

---

### Requirement 2: BST Visualizer — Insert and Render

**User Story:** As a learner, I want to insert numbers into a Binary Search Tree and see the tree rendered level by level, so that I can understand how BST insertion works.

#### Acceptance Criteria

1. WHEN the user enters a numeric value and presses "Insert", THE BST_Visualizer SHALL insert the value into the BST following standard BST ordering rules (values less than a node go left, values greater go right).
2. THE BST_Visualizer SHALL render the tree as a top-down hierarchy with each level on its own horizontal row, connected by visible Edge lines drawn between parent and child Nodes.
3. WHEN a new Node is inserted, THE BST_Visualizer SHALL animate the new Node's appearance using an `Animated.Value` scaling from 0.5 to 1.0 over 300 ms.
4. WHEN the user enters a value that already exists in the tree and presses "Insert", THE BST_Visualizer SHALL display the Status Message "Value already exists" and SHALL NOT insert a duplicate Node.
5. WHEN the user presses "Search", THE BST_Visualizer SHALL highlight the target Node by animating its opacity from 1.0 to 0.3 and back to 1.0 over 400 ms, then display the Status Message "Found: [value]".
6. IF the searched value is not present in the tree, THEN THE BST_Visualizer SHALL display the Status Message "Not found" and SHALL NOT modify the tree.
7. WHEN the user presses "Reset", THE BST_Visualizer SHALL clear all Nodes and Edges and reset the Status Message to an empty string.
8. WHILE the tree contains more than 6 levels, THE BST_Visualizer SHALL wrap the tree canvas in a vertical `ScrollView` to allow the user to scroll down and view deeper levels.
9. WHILE the tree contains Nodes whose combined width exceeds the screen width, THE BST_Visualizer SHALL wrap the tree canvas in a horizontal `ScrollView`.

---

### Requirement 3: BST Visualizer — Delete

**User Story:** As a learner, I want to delete a node from the BST and see the tree restructure, so that I can understand BST deletion.

#### Acceptance Criteria

1. WHEN the user enters a numeric value and presses "Delete", THE BST_Visualizer SHALL remove the Node with that value using standard BST deletion logic (leaf removal, single-child promotion, or in-order successor replacement).
2. WHEN a Node is deleted, THE BST_Visualizer SHALL animate the removed Node's opacity from 1.0 to 0 over 250 ms before removing it from the rendered tree.
3. WHEN a Node is deleted, THE BST_Visualizer SHALL re-render the remaining tree with updated Edge positions reflecting the new structure.
4. IF the value to delete is not present in the tree, THEN THE BST_Visualizer SHALL display the Status Message "Value not found" and SHALL NOT modify the tree.

---

### Requirement 4: Graph Visualizer — Add Nodes and Edges

**User Story:** As a learner, I want to add nodes and edges to a graph and see them rendered visually, so that I can understand graph structure.

#### Acceptance Criteria

1. WHEN the user enters a node label and presses "Add Node", THE Graph_Visualizer SHALL add a new Node with that label and position it on the canvas using a deterministic layout algorithm (e.g., circular arrangement).
2. WHEN a new Node is added, THE Graph_Visualizer SHALL animate the Node's appearance using an `Animated.Value` scaling from 0 to 1 over 300 ms.
3. WHEN the user enters two node labels separated by a comma (e.g., "A,B") and presses "Add Edge", THE Graph_Visualizer SHALL draw an Edge line between the two named Nodes.
4. IF either node label in an "Add Edge" operation does not exist in the graph, THEN THE Graph_Visualizer SHALL display the Status Message "Node [label] not found" and SHALL NOT draw an Edge.
5. THE Graph_Visualizer SHALL render Nodes as circular `Animated.View` elements with the node label centered inside, using `theme.primary` as the fill color and white text.
6. THE Graph_Visualizer SHALL render Edges as straight lines between Node centers using a `View` with a calculated width, height, and rotation transform derived from the two Node positions.
7. WHEN the user presses "Reset", THE Graph_Visualizer SHALL clear all Nodes and Edges and reset the Status Message.

---

### Requirement 5: Graph Visualizer — Remove Nodes

**User Story:** As a learner, I want to remove a node from the graph and see its edges disappear, so that I can understand how graph deletion works.

#### Acceptance Criteria

1. WHEN the user enters a node label and presses "Remove Node", THE Graph_Visualizer SHALL remove the Node and all Edges connected to that Node.
2. WHEN a Node is removed, THE Graph_Visualizer SHALL animate the Node's opacity from 1.0 to 0 over 250 ms before removing it from the canvas.
3. IF the node label to remove does not exist in the graph, THEN THE Graph_Visualizer SHALL display the Status Message "Node not found" and SHALL NOT modify the graph.

---

### Requirement 6: Heap Visualizer — Insert and Render

**User Story:** As a learner, I want to insert numbers into a heap and see the heap property maintained visually, so that I can understand how heaps work.

#### Acceptance Criteria

1. WHEN the user enters a numeric value and presses "Insert", THE Heap_Visualizer SHALL insert the value into a min-heap and perform the standard bubble-up operation to restore the heap property.
2. THE Heap_Visualizer SHALL render the heap as a top-down binary tree layout, with each level on its own horizontal row and Edge lines connecting parent and child Nodes, identical in structure to the BST tree layout.
3. WHEN a new Node is inserted, THE Heap_Visualizer SHALL animate the Node's appearance using an `Animated.Value` scaling from 0.5 to 1.0 over 300 ms.
4. WHEN the bubble-up operation swaps two Nodes, THE Heap_Visualizer SHALL visually highlight both swapped Nodes by briefly changing their background color to `theme.accent` for 300 ms before returning to `theme.primary`.
5. WHEN the user presses "Extract Min", THE Heap_Visualizer SHALL remove the root Node, move the last Node to the root, and perform the standard bubble-down operation to restore the heap property.
6. WHEN the bubble-down operation swaps two Nodes, THE Heap_Visualizer SHALL visually highlight both swapped Nodes using the same accent color animation described in criterion 4.
7. WHEN the user presses "Reset", THE Heap_Visualizer SHALL clear all Nodes and Edges and reset the Status Message.
8. WHILE the heap contains more than 6 levels, THE Heap_Visualizer SHALL wrap the tree canvas in a vertical `ScrollView`.

---

### Requirement 7: HashMap Visualizer — Complete Operations

**User Story:** As a learner, I want to insert, delete, search, and clear key-value pairs in a HashMap and see the bucket structure update, so that I can understand how hashing and collision chaining work.

#### Acceptance Criteria

1. THE HashMap_Visualizer SHALL display exactly 8 Buckets, each labeled with its index (0–7), arranged vertically in a `ScrollView`.
2. WHEN the user enters a key and value and presses "Insert", THE HashMap_Visualizer SHALL compute the bucket index using the existing character-code sum modulo 8 hash function and insert the key-value pair into the corresponding Bucket.
3. WHEN a key-value pair is inserted, THE HashMap_Visualizer SHALL animate the new entry's appearance using an `Animated.Value` scaling from 0 to 1 over 300 ms.
4. WHEN two or more key-value pairs occupy the same Bucket, THE HashMap_Visualizer SHALL render each pair as a separate row within that Bucket, visually indicating chaining (collision handling).
5. WHEN a Bucket contains more than one entry, THE HashMap_Visualizer SHALL display a "Collision" label in `theme.error` color above that Bucket's entry list.
6. WHEN the user enters a key and presses "Delete", THE HashMap_Visualizer SHALL remove the entry with that key from its Bucket.
7. WHEN an entry is deleted, THE HashMap_Visualizer SHALL animate the removed entry's opacity from 1.0 to 0 over 250 ms before removing it from the Bucket.
8. IF the key to delete does not exist in any Bucket, THEN THE HashMap_Visualizer SHALL display the Status Message "Key not found" and SHALL NOT modify any Bucket.
9. WHEN the user enters a key and presses "Search", THE HashMap_Visualizer SHALL highlight the matching entry by animating its opacity from 1.0 to 0.3 and back to 1.0 over 400 ms, then display the Status Message "Found: [key] → [value]".
10. IF the searched key does not exist, THEN THE HashMap_Visualizer SHALL display the Status Message "Key not found".
11. WHEN the user presses "Clear", THE HashMap_Visualizer SHALL remove all entries from all Buckets and reset the Status Message.
12. THE HashMap_Visualizer SHALL preserve the existing `Hasfunction` logic and bucket rendering structure from the current `hash-map-visual.tsx` implementation, extending it rather than replacing it.
