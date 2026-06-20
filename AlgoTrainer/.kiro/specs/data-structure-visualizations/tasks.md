# Implementation Plan: Data Structure Visualizations

## Overview

Implement four interactive, animated data structure visualizers in the AlgoTrainer React Native (Expo) app: BST (`tree-visual.tsx`), Graph (`graph-visual.tsx`), Heap (`heap-visual.tsx`), and HashMap (`hash-map-visual.tsx`). Each visualizer follows the established pattern from the working Array, Stack, Queue, and LinkedList visualizers — React Native primitives only, `ThemeContext` for theming, `Animated` for motion, and a consistent Control Panel + Status Message + Visual Canvas layout.

Sorting and searching visualizations are **out of scope**.

## Tasks

- [x] 1. Implement BST Visualizer (`tree-visual.tsx`)
  - [x] 1.1 Implement pure BST logic functions (`bstInsert`, `bstSearch`, `bstDelete`) and `computeTreeLayout`
    - Define `BSTNode` interface with `id`, `value`, `left`, `right`, `parent`
    - Implement `bstInsert`: standard BST ordering, returns new nodes map + rootId + inserted id (or null for duplicate)
    - Implement `bstSearch`: returns nodeId if found, null otherwise
    - Implement `bstDelete`: leaf removal, single-child promotion, in-order successor replacement
    - Implement `computeTreeLayout`: level-order traversal, `NODE_SIZE=44`, `LEVEL_HEIGHT=70`, `HORIZONTAL_SPACING_BASE=160`, root at `canvasWidth/2`
    - Export all functions for testability
    - _Requirements: 2.1, 2.5, 2.6, 3.1, 3.4_

  - [ ]* 1.2 Write property tests for BST logic
    - **Property 1: BST Ordering Invariant After Insertion** — Validates: Requirements 2.1
    - **Property 2: BST Ordering Invariant Preserved After Deletion** — Validates: Requirements 3.1
    - **Property 3: BST Absent-Value Operations Leave Tree Unchanged** — Validates: Requirements 2.6, 3.4
    - **Property 4: BST Duplicate Rejection** — Validates: Requirements 2.4
    - Create `AlgoTrainer/__tests__/bst.test.ts` using `fast-check`, 100 iterations each

  - [x] 1.3 Build BST Visualizer UI component
    - Wire `useBST` hook using the pure logic functions from 1.1
    - Render Control Panel: single `TextInput` (numeric), buttons "Insert", "Search", "Delete", "Reset" in a `flexWrap: 'wrap'` row
    - Style input with `theme.border`, `theme.bgSecondary`, `theme.text`; buttons with `theme.primary` background, white text
    - Render Status Message below Control Panel using `theme.bgSecondary`/`theme.error` pattern from `stack-visual.tsx`
    - Render tree canvas inside nested `ScrollView` (horizontal + vertical) using `computeTreeLayout` positions
    - Draw Edge lines between parent and child using absolute-positioned `View` with width = Euclidean distance and rotation transform
    - Render each node as a circular `Animated.View` (44px diameter) with `theme.primary` fill and white value text
    - Animate new node appearance: scale `Animated.Value` from 0.5 → 1.0 over 300ms
    - Animate search highlight: opacity 1.0 → 0.3 → 1.0 over 400ms
    - Animate delete: opacity 1.0 → 0 over 250ms before removing from state
    - Guard all button presses with `isAnimating` flag
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 2.9, 3.1, 3.2, 3.3, 3.4_

- [x] 2. Checkpoint — BST
  - Ensure all BST tests pass, ask the user if questions arise.

- [x] 3. Implement Graph Visualizer (`graph-visual.tsx`)
  - [x] 3.1 Implement pure Graph logic functions (`addNode`, `removeNode`, `addEdge`) and `computeEdgeGeometry`
    - Define `GraphNode` interface with `id`, `label`, `x`, `y`, `anim`
    - Define `GraphEdge` interface with `id`, `from`, `to`
    - Implement circular layout: `RADIUS = min(w, h) * 0.38`, angle `= (2π * i) / N - π/2`, reposition all nodes on every add/remove
    - Implement `computeEdgeGeometry(x1, y1, x2, y2)`: returns `{ width, rotation, midX, midY }`
    - Implement `addEdge`: validate both node labels exist, return error message if not
    - Implement `removeNode`: remove node and all edges where `from === id || to === id`
    - Export `computeEdgeGeometry` and layout helpers for testability
    - _Requirements: 4.1, 4.2, 4.3, 4.6, 5.1_

  - [ ]* 3.2 Write property tests for Graph logic
    - **Property 5: Graph Circular Layout Equidistance** — Validates: Requirements 4.1
    - **Property 6: Edge Geometry Correctness** — Validates: Requirements 4.3, 4.6
    - **Property 7: Graph Node Removal Clears All Incident Edges** — Validates: Requirements 5.1
    - Create `AlgoTrainer/__tests__/graph.test.ts` using `fast-check`, 100 iterations each

  - [x] 3.3 Build Graph Visualizer UI component
    - Wire state using the pure logic functions from 3.1
    - Render Control Panel: single `TextInput` (string label), buttons "Add Node", "Add Edge", "Remove Node", "Reset"
    - Style consistently with BST Control Panel (same theme tokens)
    - Render Status Message using same pattern as BST
    - Render fixed-size canvas (`View` with measured `onLayout` dimensions) with `position: 'relative'`
    - Render edges as absolute-positioned `View` elements using `computeEdgeGeometry` output; `height: 2`, `backgroundColor: theme.border`, rotation transform with `transformOrigin: 'left center'`
    - Render nodes as circular `Animated.View` (50px diameter), `theme.primary` fill, white label text, `position: 'absolute'`
    - Animate new node appearance: scale `Animated.Value` 0 → 1 over 300ms
    - Animate node removal: opacity 1.0 → 0 over 250ms before removing from state
    - Guard all button presses with `isAnimating` flag
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 5.1, 5.2, 5.3_

- [x] 4. Checkpoint — Graph
  - Ensure all Graph tests pass, ask the user if questions arise.

- [x] 5. Implement Heap Visualizer (`heap-visual.tsx`)
  - [x] 5.1 Implement pure Heap logic functions (`heapInsert`, `heapExtractMin`) and reuse `computeTreeLayout`
    - Store heap as flat `number[]` array (index 0 = root)
    - Implement `heapInsert`: append, bubble-up with parent comparison `heap[Math.floor((i-1)/2)]`
    - Implement `heapExtractMin`: move last to root, bubble-down comparing left/right children
    - Both functions return the new heap array plus a list of swap pairs `[i, j][]` for animation
    - Reuse `computeTreeLayout` logic (index `i` → depth `Math.floor(Math.log2(i+1))`)
    - Export functions for testability
    - _Requirements: 6.1, 6.5_

  - [ ]* 5.2 Write property tests for Heap logic
    - **Property 8: Min-Heap Property After Insertion** — Validates: Requirements 6.1
    - **Property 9: Min-Heap Property Preserved After Extract-Min** — Validates: Requirements 6.5
    - Create `AlgoTrainer/__tests__/heap.test.ts` using `fast-check`, 100 iterations each

  - [x] 5.3 Build Heap Visualizer UI component
    - Wire `useHeap` hook using the pure logic functions from 5.1
    - Render Control Panel: single `TextInput` (numeric), buttons "Insert", "Extract Min", "Reset"
    - Style consistently with BST Control Panel
    - Render Status Message using same pattern
    - Render heap as top-down binary tree using `computeTreeLayout` positions inside nested `ScrollView`
    - Draw Edge lines between parent and child (same absolute-positioned `View` technique as BST)
    - Render each node as circular `Animated.View` (44px diameter), `theme.primary` fill, white value text
    - Animate new node appearance: scale 0.5 → 1.0 over 300ms
    - Animate swap highlight: background color briefly changes to `theme.accent` for 300ms then returns to `theme.primary` (use `Animated.sequence` with color interpolation or a `swapHighlight` state set)
    - Guard all button presses with `isAnimating` flag; show "Heap is empty" status on extract from empty heap
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 6.8_

- [x] 6. Checkpoint — Heap
  - Ensure all Heap tests pass, ask the user if questions arise.

- [x] 7. Implement HashMap Visualizer (`hash-map-visual.tsx`)
  - [x] 7.1 Implement pure HashMap logic functions (`hashFunction`, `insertEntry`, `deleteEntry`, `searchEntry`)
    - Extend existing `Hasfunction` to use 8 buckets: `% 8` instead of `% 5`
    - Define `HashEntry` interface with `id`, `key`, `value`, `anim: Animated.Value`
    - Implement `insertEntry`: compute bucket index, append `HashEntry` to `buckets[index]`
    - Implement `deleteEntry`: find entry by key across all buckets, return bucket index + entry index (or -1 if not found)
    - Implement `searchEntry`: find entry by key, return bucket index + entry index (or -1 if not found)
    - Export `hashFunction` for testability
    - _Requirements: 7.1, 7.2, 7.6, 7.9_

  - [ ]* 7.2 Write property tests for HashMap logic
    - **Property 10: HashMap Hash Function Correctness** — Validates: Requirements 7.2
    - **Property 11: HashMap Insert-Then-Contains Round Trip** — Validates: Requirements 7.2, 7.4
    - **Property 12: HashMap Collision Detection Correctness** — Validates: Requirements 7.4, 7.5
    - **Property 13: HashMap Delete Round Trip** — Validates: Requirements 7.6
    - **Property 14: HashMap Absent-Key Operations Leave State Unchanged** — Validates: Requirements 7.8, 7.10
    - Create `AlgoTrainer/__tests__/hashmap.test.ts` using `fast-check`, 100 iterations each

  - [x] 7.3 Build HashMap Visualizer UI component
    - Extend (not replace) the existing `hash-map-visual.tsx` implementation
    - Update bucket count from 5 to 8; update `Hasfunction` to `% 8`
    - Add `id` and `anim: Animated.Value` fields to each entry for animation
    - Add "Delete" and "Search" buttons alongside the existing "Add" button; add "Clear" button
    - Style Control Panel consistently with other visualizers (theme tokens)
    - Render Status Message below Control Panel
    - Render 8 buckets in a vertical `ScrollView`, each labeled "Bucket [i]"
    - Render each entry as an `Animated.View` row showing `key → value`
    - Show "Collision" label in `theme.error` color above a bucket's entry list when it has > 1 entry
    - Animate insert: scale `Animated.Value` 0 → 1 over 300ms
    - Animate delete: opacity 1.0 → 0 over 250ms before removing from state
    - Animate search highlight: opacity 1.0 → 0.3 → 1.0 over 400ms, then show "Found: key → value"
    - Guard all button presses with `isAnimating` flag
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7, 7.8, 7.9, 7.10, 7.11, 7.12_

- [x] 8. Final Checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties using `fast-check`
- Unit tests validate specific examples and edge cases
- Sorting and searching visualizations are explicitly out of scope
