# Design Document: Data Structure Visualizations

## Overview

This document describes the technical design for four interactive data structure visualizers in the AlgoTrainer React Native (Expo) app: Binary Search Tree (BST), Graph, Min-Heap, and HashMap. Each visualizer lives in `app/DataVisual/` and follows the established pattern from the working Array, Stack, Queue, and LinkedList visualizers.

The design covers shared component architecture, per-visualizer state shapes and algorithms, edge/line rendering math, animation patterns, and correctness properties for property-based testing.

**Key constraints:**
- React Native primitives only — no external visualization libraries
- All colors from `ThemeContext` (`theme.bg`, `theme.primary`, `theme.text`, `theme.border`, `theme.bgSecondary`, `theme.textSecondary`, `theme.textTertiary`, `theme.accent`, `theme.error`)
- Animations via `Animated` from `react-native`
- Sorting and searching visualizations are out of scope

---

## Architecture

### File Structure

```
app/DataVisual/
  tree-visual.tsx       ← BST visualizer (to implement)
  graph-visual.tsx      ← Graph visualizer (to implement)
  heap-visual.tsx       ← Heap visualizer (to implement)
  hash-map-visual.tsx   ← HashMap visualizer (to extend)
```

### Component Pattern

Each visualizer follows the same three-layer pattern established by the existing visualizers:

```
┌─────────────────────────────────────┐
│  Control Panel                      │
│  (TextInput + action Pressable row) │
├─────────────────────────────────────┤
│  Status Message                     │
│  (single Text line, updates after   │
│   each operation)                   │
├─────────────────────────────────────┤
│  Visual Canvas                      │
│  (ScrollView wrapping the rendered  │
│   data structure)                   │
└─────────────────────────────────────┘
```

### Shared Logic Modules

Rather than duplicating layout math, two pure utility functions are shared between BST and Heap:

**`computeTreeLayout(nodes: TreeNode[], root: string | null): LayoutMap`**
Returns a map of `nodeId → { x, y }` pixel positions for rendering. Used by both BST and Heap since they share the same top-down binary tree visual structure.

**`computeEdgeGeometry(x1, y1, x2, y2): { width, rotation, midX, midY }`**
Returns the width (Euclidean distance), rotation angle (degrees), and midpoint for rendering a straight line between two points. Used by Graph and also by BST/Heap for parent-child edges.

These functions are pure (no side effects, no React state) and are defined at the module level within each file or in a shared `treeLayout.ts` utility.

---

## Components and Interfaces

### Shared Types

```typescript
// Shared animation pattern type
type AnimState = 'idle' | 'inserting' | 'deleting' | 'searching' | 'swapping';

// Status message displayed below the control panel
type StatusMessage = string; // empty string = no message shown
```

### Control Panel

Each visualizer renders a Control Panel at the top of the screen:

```typescript
// Props pattern (inline in each visualizer, not a separate component)
// - value: string          ← controlled TextInput value
// - onChangeText: fn       ← updates value state
// - buttons: { label: string; onPress: () => void }[]
// - disabled: boolean      ← true while animation is in progress
```

Styled to match `array-visual.tsx`:
- `TextInput`: `borderColor: theme.border`, `backgroundColor: theme.bgSecondary`, `color: theme.text`
- Buttons: `backgroundColor: theme.primary`, white text, `borderRadius: 8`, `paddingVertical: 10`, `paddingHorizontal: 14`
- Button row: `flexDirection: 'row'`, `flexWrap: 'wrap'`, `gap: 10`

### Status Message

```typescript
// Rendered as:
{message !== '' && (
  <View style={styles.messageBox}>
    <Text style={styles.messageText}>{message}</Text>
  </View>
)}
```

The `messageBox` uses `theme.bgSecondary` background and `theme.text` color for neutral messages. Error messages (not found, overflow) use `theme.error` background with white text — matching the pattern in `stack-visual.tsx`.

---

## Data Models

### BST Visualizer (`tree-visual.tsx`)

```typescript
interface BSTNode {
  id: string;          // unique key for React and animation map
  value: number;
  left: string | null; // id of left child
  right: string | null;// id of right child
  parent: string | null;
}

interface BSTState {
  nodes: Map<string, BSTNode>; // nodeId → BSTNode
  rootId: string | null;
  animValues: { [id: string]: Animated.Value }; // scale animations
  message: string;
  isAnimating: boolean;
}
```

**BST Operations (pure logic, no side effects):**

```typescript
// Insert: standard BST insert, returns new nodes map + new rootId
function bstInsert(nodes: Map<string, BSTNode>, rootId: string | null, value: number)
  : { nodes: Map<string, BSTNode>; rootId: string; inserted: string | null }

// Search: returns the nodeId if found, null otherwise
function bstSearch(nodes: Map<string, BSTNode>, rootId: string | null, value: number)
  : string | null

// Delete: standard BST delete (leaf / single-child / in-order successor)
// Returns new nodes map + new rootId
function bstDelete(nodes: Map<string, BSTNode>, rootId: string | null, value: number)
  : { nodes: Map<string, BSTNode>; rootId: string | null }
```

**Tree Layout Algorithm:**

The layout algorithm assigns pixel `(x, y)` coordinates to each node for rendering. It uses a level-order traversal with horizontal spacing that halves at each level:

```
NODE_SIZE = 44px (diameter of each node circle)
LEVEL_HEIGHT = 70px (vertical distance between levels)
HORIZONTAL_SPACING_BASE = 160px (spacing at level 1, halved each level)

For each node at depth d:
  y = d * LEVEL_HEIGHT + VERTICAL_PADDING
  x = parentX ± (HORIZONTAL_SPACING_BASE / 2^d)
```

The root is placed at `x = canvasWidth / 2`. Left children subtract the spacing offset; right children add it. This produces a symmetric tree that widens naturally as nodes are added.

**Canvas width** is computed as `max(screenWidth, 2 * maxHorizontalExtent + NODE_SIZE)` to support horizontal scrolling when the tree is wide.

### Graph Visualizer (`graph-visual.tsx`)

```typescript
interface GraphNode {
  id: string;          // same as label for simplicity
  label: string;
  x: number;           // pixel position on canvas
  y: number;
  anim: Animated.Value; // scale animation (0→1 on insert)
}

interface GraphEdge {
  id: string;          // `${fromId}-${toId}`
  from: string;        // node id
  to: string;          // node id
}

interface GraphState {
  nodes: Map<string, GraphNode>;
  edges: GraphEdge[];
  message: string;
  isAnimating: boolean;
}
```

**Circular Layout Algorithm:**

When a new node is added, all nodes are repositioned on a circle centered on the canvas:

```
CANVAS_CENTER_X = canvasWidth / 2
CANVAS_CENTER_Y = canvasHeight / 2
RADIUS = min(canvasWidth, canvasHeight) * 0.38

For node i of N total nodes:
  angle = (2π * i) / N - π/2   // start from top (12 o'clock)
  x = CANVAS_CENTER_X + RADIUS * cos(angle)
  y = CANVAS_CENTER_Y + RADIUS * sin(angle)
```

Repositioning is triggered on every node add/remove. Existing node positions are updated in state; their `anim` values are not reset (only new nodes get a 0→1 scale animation).

**Edge Line Math:**

Given two node centers `(x1, y1)` and `(x2, y2)`:

```typescript
function computeEdgeGeometry(x1: number, y1: number, x2: number, y2: number) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const width = Math.sqrt(dx * dx + dy * dy);          // Euclidean distance
  const rotation = Math.atan2(dy, dx) * (180 / Math.PI); // degrees
  const midX = (x1 + x2) / 2 - width / 2;             // left edge of the View
  const midY = (y1 + y2) / 2 - 1;                     // vertically centered on line
  return { width, rotation, midX, midY };
}
```

The edge is rendered as a `View` with:
- `position: 'absolute'`
- `left: midX`, `top: midY`
- `width: width`, `height: 2`
- `backgroundColor: theme.border`
- `transform: [{ rotate: `${rotation}deg` }]`
- `transformOrigin: 'left center'` (so rotation pivots from the left endpoint)

### Heap Visualizer (`heap-visual.tsx`)

```typescript
interface HeapState {
  heap: number[];          // array-based min-heap (index 0 = root)
  animValues: { [index: number]: Animated.Value }; // scale per index
  swapHighlight: [number, number] | null; // indices being swapped
  message: string;
  isAnimating: boolean;
}
```

The heap is stored as a flat array (standard array-based binary heap):
- Root at index 0
- Left child of index `i` at `2i + 1`
- Right child of index `i` at `2i + 2`
- Parent of index `i` at `Math.floor((i - 1) / 2)`

**Bubble-Up (insert):**
```
1. Append value to end of array
2. i = heap.length - 1
3. While i > 0 and heap[i] < heap[parent(i)]:
     swap heap[i] and heap[parent(i)]
     trigger swap highlight animation on both indices
     await 350ms (animation duration)
     i = parent(i)
```

**Bubble-Down (extract-min):**
```
1. Save root value (the minimum)
2. Move last element to root; pop last
3. i = 0
4. While left child exists:
     smallest = i
     if heap[left] < heap[smallest]: smallest = left
     if right exists and heap[right] < heap[smallest]: smallest = right
     if smallest == i: break
     swap heap[i] and heap[smallest]
     trigger swap highlight animation on both indices
     await 350ms
     i = smallest
```

**Tree Layout:** Identical algorithm to BST layout. The heap array maps to tree positions as:
- Index 0 → root (depth 0)
- Index 1 → left child of root (depth 1)
- Index 2 → right child of root (depth 1)
- Index `i` → depth `Math.floor(Math.log2(i + 1))`

The `computeTreeLayout` function accepts the heap array and returns `{ index → { x, y } }`.

### HashMap Visualizer (`hash-map-visual.tsx`)

```typescript
interface HashEntry {
  id: string;          // unique key for React and animation
  key: string;
  value: string;
  anim: Animated.Value; // scale animation (0→1 on insert, 1→0 on delete)
}

interface HashMapState {
  buckets: HashEntry[][];  // length 8, index 0–7
  keyInput: string;
  valueInput: string;
  message: string;
  isAnimating: boolean;
}
```

**Hash Function (preserved from existing implementation, extended to 8 buckets):**
```typescript
const hashFunction = (key: string): number => {
  return Math.abs(
    key.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  ) % 8;  // changed from % 5 to % 8
};
```

**Operations:**
- **Insert**: compute `index = hashFunction(key)`, append `HashEntry` to `buckets[index]`, animate scale 0→1
- **Delete**: find entry by key across all buckets, animate scale 1→0 over 250ms, then remove from state
- **Search**: find entry by key, animate opacity 1→0.3→1 over 400ms, show "Found: key → value"
- **Clear**: set all buckets to empty arrays, reset message

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property Reflection

Before listing properties, redundancy is eliminated:

- BST insert property (2.1) and BST delete property (3.1) both verify the BST ordering invariant. They are complementary, not redundant — insert tests that the property is established, delete tests that it is preserved. Both are kept.
- BST "not found" search (2.6) and BST "not found" delete (3.4) both test "absent value → no tree modification". These can be combined into one property: "operating on an absent value leaves the tree unchanged."
- Graph edge geometry (4.3 and 4.6) both test the same `computeEdgeGeometry` pure function. Combined into one property.
- HashMap "key not found" delete (7.8) and "key not found" search (7.10) both test "absent key → no state change + correct message". Combined into one property.
- HashMap collision label (7.5) and collision rendering (7.4) are closely related. Combined into one property about collision correctness.

### Property 1: BST Ordering Invariant After Insertion

*For any* sequence of distinct integer values inserted into a BST, every node in the resulting tree must satisfy the BST property: all values in its left subtree are strictly less than the node's value, and all values in its right subtree are strictly greater.

**Validates: Requirements 2.1**

### Property 2: BST Ordering Invariant Preserved After Deletion

*For any* valid BST and any value present in that BST, deleting that value must produce a tree where the BST ordering property still holds for all remaining nodes.

**Validates: Requirements 3.1**

### Property 3: BST Absent-Value Operations Leave Tree Unchanged

*For any* valid BST and any value not present in that BST, both searching for and attempting to delete that value must leave the tree's node set and structure completely unchanged.

**Validates: Requirements 2.6, 3.4**

### Property 4: BST Duplicate Rejection

*For any* valid BST and any value already present in that BST, attempting to insert that value again must leave the tree's node set and structure completely unchanged.

**Validates: Requirements 2.4**

### Property 5: Graph Circular Layout Equidistance

*For any* set of N graph nodes (N ≥ 2) positioned by the circular layout algorithm, all nodes must lie on a circle of the same radius, and adjacent nodes must be separated by equal angular intervals of `2π / N` radians.

**Validates: Requirements 4.1**

### Property 6: Edge Geometry Correctness

*For any* two distinct 2D positions `(x1, y1)` and `(x2, y2)`, the `computeEdgeGeometry` function must return a width equal to the Euclidean distance between the points and a rotation equal to `atan2(y2 - y1, x2 - x1)` in degrees.

**Validates: Requirements 4.3, 4.6**

### Property 7: Graph Node Removal Clears All Incident Edges

*For any* graph state and any node present in that graph, removing that node must result in a graph where no edge references the removed node's id as either its `from` or `to` endpoint.

**Validates: Requirements 5.1**

### Property 8: Min-Heap Property After Insertion

*For any* sequence of integer values inserted into the min-heap, after each insertion the heap array must satisfy the min-heap property: for every index `i > 0`, `heap[Math.floor((i-1)/2)] ≤ heap[i]`.

**Validates: Requirements 6.1**

### Property 9: Min-Heap Property Preserved After Extract-Min

*For any* non-empty min-heap, after extracting the minimum, the extracted value must equal the minimum of the original heap, and the remaining heap array must still satisfy the min-heap property.

**Validates: Requirements 6.5**

### Property 10: HashMap Hash Function Correctness

*For any* non-empty string key, the hash function must return a value in the range `[0, 7]` equal to `(sum of char codes of key) % 8`.

**Validates: Requirements 7.2**

### Property 11: HashMap Insert-Then-Contains Round Trip

*For any* key-value pair inserted into the HashMap, the key must be present in the bucket at index `hashFunction(key)`, and the stored value must equal the inserted value.

**Validates: Requirements 7.2, 7.4**

### Property 12: HashMap Collision Detection Correctness

*For any* set of keys that all hash to the same bucket index, after inserting all of them, that bucket must contain all inserted entries and must display the "Collision" label if and only if it contains more than one entry.

**Validates: Requirements 7.4, 7.5**

### Property 13: HashMap Delete Round Trip

*For any* key present in the HashMap, after deleting that key, no bucket must contain an entry with that key.

**Validates: Requirements 7.6**

### Property 14: HashMap Absent-Key Operations Leave State Unchanged

*For any* key not present in the HashMap, both searching for and attempting to delete that key must leave all buckets completely unchanged.

**Validates: Requirements 7.8, 7.10**

---

## Error Handling

### Input Validation

Each visualizer validates input before executing operations:

| Visualizer | Invalid Input | Behavior |
|---|---|---|
| BST | Empty or non-numeric input | No-op, no message |
| BST | Duplicate insert | Status: "Value already exists" |
| BST | Delete/search on absent value | Status: "Value not found" / "Not found" |
| Graph | Empty label | No-op, no message |
| Graph | Add edge with missing node | Status: "Node [label] not found" |
| Graph | Remove non-existent node | Status: "Node not found" |
| Heap | Empty or non-numeric input | No-op, no message |
| Heap | Extract-min on empty heap | Status: "Heap is empty" |
| HashMap | Empty key or value | No-op, no message |
| HashMap | Delete/search absent key | Status: "Key not found" |

### Animation Guard

All visualizers maintain an `isAnimating: boolean` flag. While `isAnimating` is true, all button presses are ignored (buttons are `disabled`). This prevents state corruption from overlapping animations — the same pattern used in `array-visual.tsx`.

### Overflow Guards

- BST: No explicit size cap. The ScrollView handles arbitrarily deep/wide trees.
- Heap: No explicit size cap. ScrollView handles deep heaps (> 6 levels).
- HashMap: 8 fixed buckets; no cap on entries per bucket (chaining is the intended behavior).
- Graph: No explicit node cap. Canvas is fixed size; circular layout adapts to N nodes.

---

## Testing Strategy

### Dual Testing Approach

Testing uses two complementary strategies:

1. **Unit tests (example-based)**: Verify specific behaviors, UI rendering, animation configuration, and edge cases with concrete inputs.
2. **Property-based tests**: Verify universal invariants across randomly generated inputs using a PBT library.

### Property-Based Testing Library

**Library**: `fast-check` (TypeScript-native, works in Jest/Vitest environments)

```bash
npm install --save-dev fast-check
```

Each property test runs a minimum of **100 iterations**. Each test is tagged with a comment referencing the design property:

```typescript
// Feature: data-structure-visualizations, Property 1: BST Ordering Invariant After Insertion
it('BST ordering invariant holds after any sequence of insertions', () => {
  fc.assert(
    fc.property(fc.array(fc.integer({ min: -1000, max: 1000 }), { minLength: 1 }), (values) => {
      const uniqueValues = [...new Set(values)];
      let { nodes, rootId } = { nodes: new Map(), rootId: null };
      for (const v of uniqueValues) {
        ({ nodes, rootId } = bstInsert(nodes, rootId, v));
      }
      return checkBSTProperty(nodes, rootId);
    }),
    { numRuns: 100 }
  );
});
```

### Unit Test Coverage

Unit tests cover:

- **Rendering**: Each visualizer renders without crashing with an empty initial state
- **Theme application**: Style objects reference `theme.primary`, `theme.bg`, etc.
- **Control Panel**: TextInput and all buttons are present and labeled correctly
- **Status messages**: Correct messages appear after each operation type
- **Animation initialization**: `Animated.Value` is initialized to the correct starting value on insert/delete
- **ScrollView conditions**: Correct ScrollView wrapping when tree depth > 6 or width > screen width
- **Edge cases**: Empty input, duplicate BST insert, extract-min on empty heap, delete absent key

### Property Test Coverage

| Property | Test File | Iterations |
|---|---|---|
| P1: BST insert invariant | `__tests__/bst.test.ts` | 100 |
| P2: BST delete invariant | `__tests__/bst.test.ts` | 100 |
| P3: BST absent-value no-op | `__tests__/bst.test.ts` | 100 |
| P4: BST duplicate rejection | `__tests__/bst.test.ts` | 100 |
| P5: Graph circular layout | `__tests__/graph.test.ts` | 100 |
| P6: Edge geometry correctness | `__tests__/graph.test.ts` | 100 |
| P7: Graph node removal clears edges | `__tests__/graph.test.ts` | 100 |
| P8: Heap insert invariant | `__tests__/heap.test.ts` | 100 |
| P9: Heap extract-min invariant | `__tests__/heap.test.ts` | 100 |
| P10: HashMap hash function | `__tests__/hashmap.test.ts` | 100 |
| P11: HashMap insert round trip | `__tests__/hashmap.test.ts` | 100 |
| P12: HashMap collision detection | `__tests__/hashmap.test.ts` | 100 |
| P13: HashMap delete round trip | `__tests__/hashmap.test.ts` | 100 |
| P14: HashMap absent-key no-op | `__tests__/hashmap.test.ts` | 100 |

### Test Organization

Pure logic functions (`bstInsert`, `bstDelete`, `bstSearch`, `hashFunction`, `computeEdgeGeometry`, `computeTreeLayout`, heap operations) are extracted from the component files and exported so they can be tested independently without rendering React components. This is the standard pattern for testing React Native logic.
