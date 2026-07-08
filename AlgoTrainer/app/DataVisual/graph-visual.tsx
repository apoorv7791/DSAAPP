import React, { useState, useContext, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Alert,
} from "react-native";
import { ThemeContext, ThemeType } from "@/theme/ThemeContext";

/* ─── Types ─────────────────────────────────────────────────── */

type NodePos = { x: number; y: number };

type GraphNode = {
  id: number;
  label: string;
  pos: NodePos;
};

type Edge = { from: number; to: number };

/* ─── Constants ──────────────────────────────────────────────── */

const NODE_RADIUS = 26;
const MAX_NODES = 7;
const CANVAS_W = 320;
const CANVAS_H = 320;

// Preset positions for up to 7 nodes laid out in a circle
const PRESET_POSITIONS: NodePos[] = [
  { x: 160, y: 50 },
  { x: 270, y: 130 },
  { x: 240, y: 260 },
  { x: 100, y: 270 },
  { x: 50, y: 135 },
  { x: 160, y: 165 },
  { x: 210, y: 200 },
];

const delay = (ms: number) => new Promise<void>((res) => setTimeout(res, ms));

/* ─── Helpers ────────────────────────────────────────────────── */

function buildAdjacency(
  nodes: GraphNode[],
  edges: Edge[],
): Record<number, number[]> {
  const adj: Record<number, number[]> = {};
  for (const n of nodes) adj[n.id] = [];
  for (const e of edges) {
    adj[e.from].push(e.to);
    adj[e.to].push(e.from);
  }
  return adj;
}

/* ─── Main component ─────────────────────────────────────────── */

const GraphsVisual = () => {
  const { theme } = useContext(ThemeContext);
  const styles = getStyles(theme);

  // Graph state
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const nextId = useRef(1);

  // Interaction state
  const [mode, setMode] = useState<"add" | "edge" | "delete">("add");
  const [pendingEdge, setPendingEdge] = useState<number | null>(null); // first node selected for edge

  // Traversal state
  const [visitedSet, setVisitedSet] = useState<Set<number>>(new Set());
  const [activeNode, setActiveNode] = useState<number | null>(null);
  const [traversalLog, setTraversalLog] = useState<string>("");
  const [isRunning, setIsRunning] = useState(false);
  const [startNodeId, setStartNodeId] = useState<number | null>(null);

  /* ── Add node ──────────────────────────────────────────── */

  const addNode = () => {
    if (nodes.length >= MAX_NODES) {
      Alert.alert("Limit reached", `Maximum ${MAX_NODES} nodes allowed.`);
      return;
    }
    const pos = PRESET_POSITIONS[nodes.length];
    const id = nextId.current++;
    setNodes((prev) => [...prev, { id, label: String(id), pos }]);
  };

  /* ── Delete node & its edges ───────────────────────────── */

  const deleteNode = (id: number) => {
    setNodes((prev) => prev.filter((n) => n.id !== id));
    setEdges((prev) => prev.filter((e) => e.from !== id && e.to !== id));
    if (pendingEdge === id) setPendingEdge(null);
  };

  /* ── Handle node press (depends on mode) ───────────────── */

  const handleNodePress = (id: number) => {
    if (isRunning) return;

    if (mode === "add") {
      setStartNodeId((prev) => (prev === id ? null : id));
      setTraversalLog(startNodeId === id ? "" : `Node ${id} set as start`);
      return;
    }

    if (mode === "delete") {
      deleteNode(id);
      return;
    }

    if (mode === "edge") {
      if (pendingEdge === null) {
        setPendingEdge(id);
        setTraversalLog(`Select second node to connect to node ${id}`);
        return;
      }
      if (pendingEdge === id) {
        setPendingEdge(null);
        setTraversalLog("");
        return;
      }
      // Check for duplicate edge
      const duplicate = edges.some(
        (e) =>
          (e.from === pendingEdge && e.to === id) ||
          (e.from === id && e.to === pendingEdge),
      );
      if (duplicate) {
        // Remove the edge
        setEdges((prev) =>
          prev.filter(
            (e) =>
              !(
                (e.from === pendingEdge && e.to === id) ||
                (e.from === id && e.to === pendingEdge)
              ),
          ),
        );
        setTraversalLog(`Edge removed between ${pendingEdge} and ${id}`);
      } else {
        setEdges((prev) => [...prev, { from: pendingEdge, to: id }]);
        setTraversalLog(`Edge added between ${pendingEdge} and ${id}`);
      }
      setPendingEdge(null);
      return;
    }
  };

  /* ── BFS ───────────────────────────────────────────────── */

  const runBFS = async (startId: number) => {
    if (isRunning || nodes.length === 0) return;
    setIsRunning(true);
    setVisitedSet(new Set());
    setActiveNode(null);

    const adj = buildAdjacency(nodes, edges);
    const visited = new Set<number>();
    const queue: number[] = [startId];
    const order: number[] = [];

    setTraversalLog("BFS started…");

    while (queue.length) {
      const cur = queue.shift()!;
      if (visited.has(cur)) continue;
      visited.add(cur);
      order.push(cur);

      setActiveNode(cur);
      setVisitedSet(new Set(visited));
      setTraversalLog(`BFS — visiting node ${cur}`);
      await delay(750);

      for (const nb of adj[cur] ?? []) {
        if (!visited.has(nb)) queue.push(nb);
      }
    }

    setActiveNode(null);
    setTraversalLog(`BFS complete — order: ${order.join(" → ")}`);
    setIsRunning(false);
  };

  /* ── DFS ───────────────────────────────────────────────── */

  const runDFS = async (startId: number) => {
    if (isRunning || nodes.length === 0) return;
    setIsRunning(true);
    setVisitedSet(new Set());
    setActiveNode(null);

    const adj = buildAdjacency(nodes, edges);
    const visited = new Set<number>();
    const order: number[] = [];

    setTraversalLog("DFS started…");

    const dfsStep = async (id: number) => {
      if (visited.has(id)) return;
      visited.add(id);
      order.push(id);

      setActiveNode(id);
      setVisitedSet(new Set(visited));
      setTraversalLog(`DFS — visiting node ${id}`);
      await delay(750);

      for (const nb of adj[id] ?? []) {
        if (!visited.has(nb)) await dfsStep(nb);
      }

      setTraversalLog(`DFS — backtracking from node ${id}`);
      await delay(350);
    };

    await dfsStep(startId);

    setActiveNode(null);
    setTraversalLog(`DFS complete — order: ${order.join(" → ")}`);
    setIsRunning(false);
  };

  /* ── Reset ─────────────────────────────────────────────── */

  const reset = () => {
    if (isRunning) return;
    setNodes([]);
    setEdges([]);
    nextId.current = 1;
    setPendingEdge(null);
    setVisitedSet(new Set());
    setActiveNode(null);
    setStartNodeId(null); // ← clear start node selection too
    setTraversalLog("");
  };

  /* ── Node colour ────────────────────────────────────────── */

  const nodeColor = (id: number) => {
    if (activeNode === id) return "#FF6B6B";
    if (visitedSet.has(id)) return theme.success;
    if (pendingEdge === id) return theme.warning;
    if (startNodeId === id) return "#A78BFA"; // purple = start node
    return theme.primary;
  };

  /* ── Pick start node for traversal ────────────────────── */

  const promptTraversal = (algo: "BFS" | "DFS") => {
    if (nodes.length === 0) {
      setTraversalLog("Add some nodes first.");
      return;
    }
    const startId = startNodeId ?? nodes[0].id;
    if (algo === "BFS") {
      runBFS(startId);
      return;
    }
    runDFS(startId);
  };

  /* ── Render ─────────────────────────────────────────────── */

  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <View style={styles.container}>
        <Text style={styles.title}>Graph Visualizer</Text>

        {/* ── Mode selector ── */}
        <View style={styles.modeRow}>
          {(["add", "edge", "delete"] as const).map((m) => (
            <Pressable
              key={m}
              style={[styles.modeBtn, mode === m && styles.modeBtnActive]}
              onPress={() => {
                setMode(m);
                setPendingEdge(null);
                setTraversalLog("");
              }}
              disabled={isRunning}
            >
              <Text
                style={[
                  styles.modeBtnText,
                  mode === m && styles.modeBtnTextActive,
                ]}
              >
                {m === "add" ? "+ Node" : m === "edge" ? "↔ Edge" : "✕ Delete"}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* ── Add node button (shown in add mode) ── */}
        {mode === "add" && (
          <Pressable
            style={[styles.actionBtn, isRunning && styles.disabledBtn]}
            onPress={addNode}
            disabled={isRunning}
          >
            <Text style={styles.actionBtnText}>
              Add Node ({nodes.length}/{MAX_NODES})
            </Text>
          </Pressable>
        )}

        {/* ── Canvas ── */}
        <View style={styles.canvas}>
          {/* Draw edges as lines using SVG-ish absolute boxes */}
          {edges.map((e, i) => {
            const from = nodes.find((n) => n.id === e.from);
            const to = nodes.find((n) => n.id === e.to);
            if (!from || !to) return null;

            const dx = to.pos.x - from.pos.x;
            const dy = to.pos.y - from.pos.y;
            const length = Math.sqrt(dx * dx + dy * dy);
            const angle = Math.atan2(dy, dx) * (180 / Math.PI);
            const midX = (from.pos.x + to.pos.x) / 2 - length / 2;
            const midY = (from.pos.y + to.pos.y) / 2;

            return (
              <View
                key={i}
                style={[
                  styles.edge,
                  {
                    width: length,
                    left: midX,
                    top: midY,
                    transform: [{ rotate: `${angle}deg` }],
                  },
                ]}
              />
            );
          })}

          {/* Draw nodes */}
          {nodes.map((n) => (
            <Pressable
              key={n.id}
              style={[
                styles.node,
                {
                  left: n.pos.x - NODE_RADIUS,
                  top: n.pos.y - NODE_RADIUS,
                  backgroundColor: nodeColor(n.id),
                },
              ]}
              onPress={() => handleNodePress(n.id)}
            >
              <Text style={styles.nodeText}>{n.label}</Text>
            </Pressable>
          ))}

          {nodes.length === 0 && (
            <Text style={styles.emptyCanvas}>
              Tap {'"'}Add Node{'"'} to start building your graph
            </Text>
          )}
        </View>

        {/* ── Mode hint ── */}
        <Text style={styles.hint}>
          {mode === "add"
            ? 'Press "Add Node" to place a node on the canvas'
            : mode === "edge"
              ? pendingEdge
                ? `Node ${pendingEdge} selected — tap another node to connect (tap same to cancel)`
                : "Tap two nodes to add/remove an edge between them"
              : "Tap a node to remove it (edges auto-removed)"}
        </Text>

        {/* ── Traversal buttons ── */}
        <View style={styles.buttonRow}>
          <Pressable
            style={[styles.button, isRunning && styles.disabledBtn]}
            onPress={() => promptTraversal("BFS")}
            disabled={isRunning}
          >
            <Text style={styles.buttonText}>BFS</Text>
          </Pressable>

          <Pressable
            style={[styles.button, isRunning && styles.disabledBtn]}
            onPress={() => promptTraversal("DFS")}
            disabled={isRunning}
          >
            <Text style={styles.buttonText}>DFS</Text>
          </Pressable>

          <Pressable
            style={[
              styles.button,
              styles.resetBtn,
              isRunning && styles.disabledBtn,
            ]}
            onPress={reset}
            disabled={isRunning}
          >
            <Text style={styles.buttonText}>Reset</Text>
          </Pressable>
        </View>

        {/* ── Legend ── */}
        <View style={styles.legend}>
          <LegendDot color={theme.primary} label="Unvisited" />
          <LegendDot color="#FF6B6B" label="Current" />
          <LegendDot color={theme.success} label="Visited" />
          <LegendDot color={theme.warning} label="Selected" />
          <LegendDot color="#A78BFA" label="Start" />
        </View>

        {/* ── Log ── */}
        {traversalLog !== "" && (
          <View style={styles.logBox}>
            <Text style={styles.logText}>{traversalLog}</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

/* ─── Legend dot ─────────────────────────────────────────────── */

const LegendDot = ({ color, label }: { color: string; label: string }) => (
  <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
    <View
      style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: color }}
    />
    <Text style={{ fontSize: 12, color: "#888" }}>{label}</Text>
  </View>
);

/* ─── Styles ─────────────────────────────────────────────────── */

const getStyles = (theme: ThemeType) =>
  StyleSheet.create({
    scroll: { flexGrow: 1 },
    container: {
      flex: 1,
      alignItems: "center",
      paddingTop: 30,
      paddingBottom: 40,
      backgroundColor: theme.bg,
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      color: theme.text,
      marginBottom: 18,
    },

    /* Mode row */
    modeRow: {
      flexDirection: "row",
      gap: 10,
      marginBottom: 14,
    },
    modeBtn: {
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 20,
      borderWidth: 1.5,
      borderColor: theme.border,
      backgroundColor: theme.bgCard,
    },
    modeBtnActive: {
      backgroundColor: theme.primary,
      borderColor: theme.primary,
    },
    modeBtnText: {
      fontSize: 13,
      fontWeight: "600",
      color: theme.textSecondary,
    },
    modeBtnTextActive: {
      color: "#fff",
    },

    /* Action button */
    actionBtn: {
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 10,
      backgroundColor: theme.primary,
      marginBottom: 14,
    },
    actionBtnText: {
      color: "#fff",
      fontWeight: "700",
      fontSize: 14,
    },
    disabledBtn: { opacity: 0.4 },

    /* Canvas */
    canvas: {
      width: CANVAS_W,
      height: CANVAS_H,
      borderRadius: 16,
      borderWidth: 1.5,
      borderColor: theme.border,
      backgroundColor: theme.bgCard,
      marginBottom: 12,
    },
    emptyCanvas: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      textAlign: "center",
      textAlignVertical: "center",
      color: theme.textTertiary,
      fontSize: 14,
      paddingHorizontal: 30,
      paddingTop: 120,
    },

    /* Nodes */
    node: {
      position: "absolute",
      width: NODE_RADIUS * 2,
      height: NODE_RADIUS * 2,
      borderRadius: NODE_RADIUS,
      justifyContent: "center",
      alignItems: "center",
    },
    nodeText: {
      color: "#fff",
      fontWeight: "bold",
      fontSize: 14,
    },

    /* Edges */
    edge: {
      position: "absolute",
      height: 2,
      backgroundColor: theme.border,
    },

    /* Hint */
    hint: {
      fontSize: 12,
      color: theme.textTertiary,
      textAlign: "center",
      paddingHorizontal: 20,
      marginBottom: 16,
    },

    /* Traversal buttons */
    buttonRow: {
      flexDirection: "row",
      gap: 12,
      marginBottom: 14,
    },
    button: {
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 8,
      backgroundColor: theme.primary,
    },
    resetBtn: {
      backgroundColor: theme.error,
    },
    buttonText: {
      color: "#fff",
      fontWeight: "600",
    },

    /* Legend */
    legend: {
      flexDirection: "row",
      gap: 14,
      flexWrap: "wrap",
      justifyContent: "center",
      marginBottom: 12,
    },

    /* Log */
    logBox: {
      marginTop: 8,
      paddingHorizontal: 20,
      paddingVertical: 12,
      borderRadius: 12,
      backgroundColor: theme.bgCard,
      borderWidth: 1,
      borderColor: theme.border,
      width: "90%",
    },
    logText: {
      color: theme.text,
      fontSize: 14,
      textAlign: "center",
    },
  });

export default GraphsVisual;
