import { useState, useEffect, useRef, useMemo } from "react";

/* ═══════════════════════════════════════
   DESIGN TOKENS — UB StructStudio Theme
   ═══════════════════════════════════════ */
const T = {
  amber: "#F5A623",
  amberDim: "rgba(245,166,35,0.12)",
  amberGlow: "rgba(245,166,35,0.25)",
  green: "#22c55e",
  greenDim: "rgba(34,197,94,0.10)",
  greenGlow: "rgba(34,197,94,0.30)",
  red: "#ef4444",
  redDim: "rgba(239,68,68,0.10)",
  blue: "#4a9eff",
  indigo: "#818cf8",
  bgBase: "#0b1120",
  bgCard: "#0f1a2b",
  bgHover: "rgba(255,255,255,0.04)",
  border: "rgba(245,166,35,0.08)",
  borderSubtle: "rgba(255,255,255,0.06)",
  text: "#e8ecf4",
  textSecondary: "#7b8ba3",
  textMuted: "#4a5a72",
  textDim: "#384558",
  mono: "'JetBrains Mono', 'Fira Code', monospace",
  sans: "'DM Sans', 'Segoe UI', sans-serif",
  radius: "10px",
  radiusLg: "14px",
};

/* ─── Inline SVG Icons ─── */
const Icon = {
  SkipBack: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="19 20 9 12 19 4 19 20" /><line x1="5" y1="19" x2="5" y2="5" /></svg>
  ),
  StepBack: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="17 20 7 12 17 4 17 20" /><line x1="7" y1="19" x2="7" y2="5" /></svg>
  ),
  Play: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3" /></svg>
  ),
  Pause: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>
  ),
  StepForward: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="7 4 17 12 7 20 7 4" /><line x1="17" y1="5" x2="17" y2="19" /></svg>
  ),
  SkipForward: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 4 15 12 5 20 5 4" /><line x1="19" y1="5" x2="19" y2="19" /></svg>
  ),
  ArrowLeft: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
  ),
  Info: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
  ),
  Code: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>
  ),
  Clock: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
  ),
  Tree: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="5" r="3"/><circle cx="6" cy="17" r="3"/><circle cx="18" cy="17" r="3"/><line x1="12" y1="8" x2="6" y2="14"/><line x1="12" y1="8" x2="18" y2="14"/></svg>
  ),
  Shuffle: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/><polyline points="21 16 21 21 16 21"/><line x1="15" y1="15" x2="21" y2="21"/><line x1="4" y1="4" x2="9" y2="9"/></svg>
  ),
  Trash: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
  ),
  Search: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
  ),
  Plus: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
  ),
  Minus: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>
  ),
  ChevronRight: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
  ),
  Zap: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
  ),
};


/* ═══════════════════════════════════════════════════════════════
   BST DATA STRUCTURE — insert, delete, find helpers
   ═══════════════════════════════════════════════════════════════ */

class BSTNode {
  constructor(val) {
    this.val = val;
    this.left = null;
    this.right = null;
  }
}

function cloneTree(node) {
  if (!node) return null;
  const n = new BSTNode(node.val);
  n.left = cloneTree(node.left);
  n.right = cloneTree(node.right);
  return n;
}

function treeHeight(node) {
  if (!node) return 0;
  return 1 + Math.max(treeHeight(node.left), treeHeight(node.right));
}

function treeSize(node) {
  if (!node) return 0;
  return 1 + treeSize(node.left) + treeSize(node.right);
}

function insertIntoBST(root, val) {
  if (!root) return new BSTNode(val);
  if (val < root.val) root.left = insertIntoBST(root.left, val);
  else if (val > root.val) root.right = insertIntoBST(root.right, val);
  return root;
}

function findMinNode(node) {
  while (node.left) node = node.left;
  return node;
}
function findMaxNode(node) {
  while (node.right) node = node.right;
  return node;
}

function deleteFromBST(root, val, useSuccessor) {
  if (!root) return null;
  if (val < root.val) { root.left = deleteFromBST(root.left, val, useSuccessor); return root; }
  if (val > root.val) { root.right = deleteFromBST(root.right, val, useSuccessor); return root; }
  if (!root.left && !root.right) return null;
  if (!root.left || !root.right) return root.left || root.right;
  if (useSuccessor) {
    const s = findMinNode(root.right);
    root.val = s.val;
    root.right = deleteFromBST(root.right, s.val, useSuccessor);
  } else {
    const p = findMaxNode(root.left);
    root.val = p.val;
    root.left = deleteFromBST(root.left, p.val, useSuccessor);
  }
  return root;
}


/* ═══════════════════════════════════════════════════════════════
   SNAPSHOT-BASED TRACING ENGINE
   ═══════════════════════════════════════════════════════════════
   
   ARCHITECTURE:
   1. Operations generate raw events (type, val, line, etc.)
   2. bakeSnapshots() converts events → full state snapshots
   3. Each snapshot contains ALL synchronized state:
      - activeNode:      the node the algorithm is currently at
      - pseudocodeLine:  the exact line being executed
      - output:          the complete output array at this moment
      - visitedNodes:    all nodes visited so far (for checkmarks)
      - comparingNode:   node being compared (for search/insert)
      - statusMsg:       human-readable description
   
   NAVIGATION: going to step N = load snapshots[N].
   Forward, backward, skip — all just index changes.
   Sync is guaranteed BY CONSTRUCTION because each snapshot
   is a complete, pre-computed, immutable state.
═══════════════════════════════════════════════════════════════ */

/**
 * Generate raw traversal events.
 * TRAVERSAL SEMANTICS (preserved exactly):
 * - Pre-order:  visit, recurse-left, recurse-right
 * - In-order:   recurse-left, visit, recurse-right
 * - Post-order: recurse-left, recurse-right, visit
 * - Level-order: dequeue → visit, enqueue children
 * 
 * Output is appended ONLY at the "visit" step.
 */
function generateTraversalEvents(root, order) {
  const events = [];
  const output = [];

  function preOrder(node) {
    if (!node) return;
    // Visit FIRST: append to output
    output.push(node.val);
    events.push({ type: "visit", val: node.val, line: 2, output: [...output] });
    // Then recurse left
    events.push({ type: "recurse-left", val: node.val, line: 3 });
    preOrder(node.left);
    // Then recurse right
    events.push({ type: "recurse-right", val: node.val, line: 4 });
    preOrder(node.right);
  }

  function inOrder(node) {
    if (!node) return;
    // Recurse left first
    events.push({ type: "recurse-left", val: node.val, line: 2 });
    inOrder(node.left);
    // THEN visit: append to output
    output.push(node.val);
    events.push({ type: "visit", val: node.val, line: 3, output: [...output] });
    // Then recurse right
    events.push({ type: "recurse-right", val: node.val, line: 4 });
    inOrder(node.right);
  }

  function postOrder(node) {
    if (!node) return;
    // Recurse left first
    events.push({ type: "recurse-left", val: node.val, line: 2 });
    postOrder(node.left);
    // Then recurse right
    events.push({ type: "recurse-right", val: node.val, line: 3 });
    postOrder(node.right);
    // Visit LAST: append to output
    output.push(node.val);
    events.push({ type: "visit", val: node.val, line: 4, output: [...output] });
  }

  function levelOrder(node) {
    if (!node) return;
    const q = [node];
    while (q.length) {
      const cur = q.shift();
      // Visit: dequeue and append
      output.push(cur.val);
      events.push({ type: "visit", val: cur.val, line: 3, output: [...output] });
      // Enqueue children
      if (cur.left) {
        q.push(cur.left);
        events.push({ type: "enqueue", val: cur.left.val, line: 4 });
      }
      if (cur.right) {
        q.push(cur.right);
        events.push({ type: "enqueue", val: cur.right.val, line: 5 });
      }
    }
  }

  if (order === "preorder") preOrder(root);
  else if (order === "inorder") inOrder(root);
  else if (order === "postorder") postOrder(root);
  else levelOrder(root);
  return events;
}

/** Generate raw search events. */
function generateSearchEvents(root, val) {
  const events = [];
  let node = root;
  while (node) {
    const dir = val < node.val ? "left" : val > node.val ? "right" : "found";
    events.push({ type: "compare", val: node.val, target: val, dir, line: dir === "found" ? 3 : dir === "left" ? 5 : 7 });
    if (val === node.val) {
      events.push({ type: "found", val: node.val, line: 4 });
      return events;
    }
    node = val < node.val ? node.left : node.right;
  }
  events.push({ type: "notfound", val, line: 2 });
  return events;
}

/** Generate raw insert events. */
function generateInsertEvents(root, val) {
  const events = [];
  function _walk(node, v) {
    if (!node) {
      events.push({ type: "insert", val: v, line: 2 });
      return;
    }
    const dir = v < node.val ? "left" : "right";
    events.push({ type: "compare", val: node.val, target: v, dir, line: dir === "left" ? 3 : 5 });
    if (v < node.val) _walk(node.left, v);
    else if (v > node.val) _walk(node.right, v);
    else events.push({ type: "duplicate", val: v, line: 0 });
  }
  _walk(root, val);
  return events;
}

/** Generate raw delete events. */
function generateDeleteEvents(root, val, useSuccessor) {
  const events = [];
  function _walk(node, v) {
    if (!node) {
      events.push({ type: "notfound", val: v, line: 1 });
      return;
    }
    const dir = v < node.val ? "left" : v > node.val ? "right" : "found";
    events.push({ type: "compare", val: node.val, target: v, dir, line: dir === "left" ? 2 : dir === "right" ? 4 : 6 });
    if (v < node.val) { _walk(node.left, v); return; }
    if (v > node.val) { _walk(node.right, v); return; }
    // Found — decide removal type
    if (!node.left && !node.right) {
      events.push({ type: "remove-leaf", val: v, line: 7 });
    } else if (!node.left || !node.right) {
      events.push({ type: "remove-one-child", val: v, line: 7 });
    } else {
      if (useSuccessor) {
        const s = findMinNode(node.right);
        events.push({ type: "replace", val: v, replacement: s.val, method: "successor", line: 7 });
      } else {
        const p = findMaxNode(node.left);
        events.push({ type: "replace", val: v, replacement: p.val, method: "predecessor", line: 7 });
      }
    }
  }
  _walk(root, val);
  return events;
}


/**
 * BAKE SNAPSHOTS — the core of the sync guarantee.
 * 
 * Converts raw events into an array of complete state snapshots.
 * Each snapshot is immutable and self-contained.
 * Navigation = snapshots[stepIdx]. Nothing else needed.
 */
function bakeSnapshots(events) {
  const snapshots = [];
  let visited = [];
  let output = [];

  for (let i = 0; i < events.length; i++) {
    const ev = events[i];

    // Every snapshot starts from accumulated state
    let snap = {
      activeNode: null,
      comparingNode: null,
      pseudocodeLine: ev.line ?? null,
      output: [...output],
      visitedNodes: [...visited],
      statusMsg: "",
    };

    switch (ev.type) {
      case "visit":
        // THE VISIT STEP: node becomes active AND output is appended.
        // These happen atomically in the same snapshot.
        visited = [...visited, ev.val];
        output = ev.output ? [...ev.output] : [...output, ev.val];
        snap.activeNode = ev.val;
        snap.comparingNode = null;
        snap.visitedNodes = [...visited];
        snap.output = [...output];
        snap.statusMsg = `Visiting node ${ev.val} — appended to output`;
        break;

      case "recurse-left":
        // Algorithm is at this node, about to go left
        snap.activeNode = ev.val;
        snap.comparingNode = null;
        snap.output = [...output];
        snap.visitedNodes = [...visited];
        snap.statusMsg = `At node ${ev.val} — recurse left subtree`;
        break;

      case "recurse-right":
        // Algorithm is at this node, about to go right
        snap.activeNode = ev.val;
        snap.comparingNode = null;
        snap.output = [...output];
        snap.visitedNodes = [...visited];
        snap.statusMsg = `At node ${ev.val} — recurse right subtree`;
        break;

      case "enqueue":
        // Enqueuing a child for level-order
        snap.comparingNode = ev.val;
        snap.activeNode = null;
        snap.output = [...output];
        snap.visitedNodes = [...visited];
        snap.statusMsg = `Enqueue node ${ev.val}`;
        break;

      case "compare":
        // Comparing during search/insert/delete
        snap.activeNode = null;
        snap.comparingNode = ev.val;
        snap.output = [...output];
        snap.visitedNodes = [...visited];
        if (ev.dir === "found") {
          snap.statusMsg = `Found ${ev.target} at node ${ev.val}`;
        } else {
          snap.statusMsg = `Compare ${ev.target} with ${ev.val} → go ${ev.dir}`;
        }
        break;

      case "insert":
        // Node just inserted
        snap.activeNode = ev.val;
        snap.comparingNode = null;
        visited = [...visited, ev.val];
        snap.visitedNodes = [...visited];
        snap.output = [...output];
        snap.statusMsg = `Inserted new node ${ev.val}`;
        break;

      case "found":
        // Search found the value
        snap.activeNode = ev.val;
        snap.comparingNode = null;
        visited = [...visited, ev.val];
        snap.visitedNodes = [...visited];
        snap.output = [...output];
        snap.statusMsg = `Found node ${ev.val}!`;
        break;

      case "notfound":
        snap.activeNode = null;
        snap.comparingNode = null;
        snap.output = [...output];
        snap.visitedNodes = [...visited];
        snap.statusMsg = `Node ${ev.val} not found in tree`;
        break;

      case "remove-leaf":
        snap.activeNode = null;
        snap.comparingNode = null;
        snap.output = [...output];
        snap.visitedNodes = [...visited];
        snap.statusMsg = `Removed leaf node ${ev.val}`;
        break;

      case "remove-one-child":
        snap.activeNode = null;
        snap.comparingNode = null;
        snap.output = [...output];
        snap.visitedNodes = [...visited];
        snap.statusMsg = `Removed node ${ev.val} (promote child)`;
        break;

      case "replace":
        snap.activeNode = ev.replacement;
        snap.comparingNode = null;
        snap.output = [...output];
        snap.visitedNodes = [...visited];
        snap.statusMsg = `Replace ${ev.val} with ${ev.method} ${ev.replacement}`;
        break;

      case "duplicate":
        snap.activeNode = null;
        snap.comparingNode = ev.val;
        snap.output = [...output];
        snap.visitedNodes = [...visited];
        snap.statusMsg = `Duplicate value ${ev.val} — not inserted`;
        break;

      default:
        snap.output = [...output];
        snap.visitedNodes = [...visited];
        break;
    }

    snapshots.push(snap);
  }

  return snapshots;
}

/** The empty/idle snapshot — used when no animation is running */
const IDLE_SNAPSHOT = Object.freeze({
  activeNode: null,
  comparingNode: null,
  pseudocodeLine: null,
  output: [],
  visitedNodes: [],
  statusMsg: "",
});


/* ═══════════════════════════════════════════════════════════════
   TREE LAYOUT
   ═══════════════════════════════════════════════════════════════ */

function treeToLayout(root) {
  if (!root) return { nodes: [], edges: [] };
  const nodes = [];
  const edges = [];
  const H = 56, V = 76;

  function go(node, depth, pos, parentIdx) {
    if (!node) return;
    const idx = nodes.length;
    const spread = Math.pow(2, Math.max(0, 3 - depth)) * H / 2;
    nodes.push({ val: node.val, x: pos, y: depth * V + 60 });
    if (parentIdx !== null) edges.push({ from: parentIdx, to: idx });
    go(node.left, depth + 1, pos - spread, idx);
    go(node.right, depth + 1, pos + spread, idx);
  }
  go(root, 0, 300, null);
  return { nodes, edges };
}


/* ═══════════════════════════════════════════════════════════════
   SVG TREE RENDERING
   ═══════════════════════════════════════════════════════════════ */

function TreeEdge({ x1, y1, x2, y2, highlighted }) {
  return (
    <line x1={x1} y1={y1} x2={x2} y2={y2}
      stroke={highlighted ? "rgba(34,197,94,0.45)" : "rgba(245,166,35,0.10)"}
      strokeWidth={highlighted ? 2.5 : 1.5}
      style={highlighted ? { filter: `drop-shadow(0 0 4px ${T.greenGlow})` } : {}}
    />
  );
}

function TreeNodeSVG({ value, x, y, visited, active, comparing }) {
  const nodeStroke = active ? T.green : comparing ? T.amber : visited ? "rgba(34,197,94,0.4)" : "rgba(245,166,35,0.18)";
  const nodeFill = active ? T.greenDim : comparing ? T.amberDim : visited ? "rgba(34,197,94,0.05)" : "rgba(15,26,43,0.9)";
  const textColor = active ? T.green : comparing ? T.amber : visited ? T.green : T.text;
  const sw = active ? 2.5 : comparing ? 2 : visited ? 2 : 1.5;

  return (
    <g>
      {visited && !active && (
        <>
          <circle cx={x} cy={y - 34} r={10} fill={T.greenDim} stroke={T.green} strokeWidth={1.2} opacity={0.8} />
          <text x={x} y={y - 33} textAnchor="middle" dominantBaseline="middle" fill={T.green} fontSize="9" fontWeight="700" fontFamily={T.mono}>&#10003;</text>
        </>
      )}
      {active && (
        <circle cx={x} cy={y} r={30} fill="none" stroke={T.green} strokeWidth={1} opacity={0.25}>
          <animate attributeName="r" values="28;34;28" dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.25;0.5;0.25" dur="2s" repeatCount="indefinite" />
        </circle>
      )}
      {comparing && !active && (
        <circle cx={x} cy={y} r={30} fill="none" stroke={T.amber} strokeWidth={1} opacity={0.3} strokeDasharray="4 3">
          <animate attributeName="opacity" values="0.2;0.5;0.2" dur="1.2s" repeatCount="indefinite" />
        </circle>
      )}
      <circle cx={x} cy={y} r={22} fill={nodeFill} stroke={nodeStroke} strokeWidth={sw}
        style={{
          filter: active ? `drop-shadow(0 0 12px ${T.greenGlow})` : comparing ? `drop-shadow(0 0 8px ${T.amberGlow})` : "none",
          transition: "all 0.3s ease",
        }}
      />
      <text x={x} y={y + 1} textAnchor="middle" dominantBaseline="middle" fill={textColor} fontSize="14" fontWeight="600" fontFamily={T.mono}>{value}</text>
    </g>
  );
}

/**
 * BSTCanvas reads directly from the snapshot — no separate props needed.
 * The snapshot IS the truth.
 */
function BSTCanvas({ treeRoot, snapshot }) {
  const { activeNode, comparingNode, visitedNodes } = snapshot;
  const { nodes, edges } = treeToLayout(treeRoot);

  if (nodes.length === 0) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", flexDirection: "column", gap: "12px" }}>
        <Icon.Tree size={40} />
        <span style={{ color: T.textMuted, fontSize: "14px", fontFamily: T.sans }}>Insert a node to start</span>
      </div>
    );
  }

  const xs = nodes.map(n => n.x);
  const ys = nodes.map(n => n.y);
  const pad = 50;
  const vbX = Math.min(...xs) - pad;
  const vbY = Math.min(...ys) - pad;
  const vbW = Math.max(...xs) - Math.min(...xs) + pad * 2;
  const vbH = Math.max(...ys) - Math.min(...ys) + pad * 2;

  return (
    <svg width="100%" height="100%" viewBox={`${vbX} ${vbY} ${vbW} ${vbH}`} preserveAspectRatio="xMidYMid meet">
      {edges.map((e, i) => {
        const fN = nodes[e.from], tN = nodes[e.to];
        const fH = visitedNodes.includes(fN.val) || fN.val === activeNode;
        const tH = visitedNodes.includes(tN.val) || tN.val === activeNode;
        return <TreeEdge key={i} x1={fN.x} y1={fN.y + 22} x2={tN.x} y2={tN.y - 22} highlighted={fH && tH} />;
      })}
      {nodes.map((n, i) => (
        <TreeNodeSVG key={i} value={n.val} x={n.x} y={n.y}
          visited={visitedNodes.includes(n.val)}
          active={n.val === activeNode}
          comparing={n.val === comparingNode}
        />
      ))}
    </svg>
  );
}


/* ═══════════════════════════════════════════════════════════════
   UI PRIMITIVES
   ═══════════════════════════════════════════════════════════════ */

function ActionBtn({ children, variant = "default", active, onClick, disabled, title }) {
  const base = {
    padding: "7px 14px", borderRadius: "8px", fontSize: "12.5px", fontWeight: "600",
    fontFamily: T.sans, cursor: disabled ? "not-allowed" : "pointer",
    border: "1px solid", outline: "none", opacity: disabled ? 0.35 : 1,
    display: "inline-flex", alignItems: "center", justifyContent: "center",
    gap: "5px", letterSpacing: "0.01em", transition: "all 0.2s ease", whiteSpace: "nowrap",
  };
  const v = {
    default: { background: active ? T.amberDim : T.bgHover, borderColor: active ? "rgba(245,166,35,0.3)" : T.borderSubtle, color: active ? T.amber : T.textSecondary },
    primary: { background: T.amber, borderColor: "transparent", color: T.bgBase },
    danger: { background: T.redDim, borderColor: "rgba(239,68,68,0.18)", color: T.red },
    ghost: { background: "transparent", borderColor: "transparent", color: T.textSecondary },
    traverse: { background: T.greenDim, borderColor: "rgba(34,197,94,0.2)", color: T.green },
  };
  return <button onClick={onClick} disabled={disabled} title={title} style={{ ...base, ...v[variant] }}>{children}</button>;
}

function ValInput({ placeholder, value, onChange, onKeyDown, accentColor }) {
  const accent = accentColor || T.amber;
  return (
    <input type="text" placeholder={placeholder} value={value} onChange={onChange} onKeyDown={onKeyDown}
      style={{
        padding: "7px 10px", borderRadius: "8px", border: `1px solid ${T.borderSubtle}`,
        background: "rgba(255,255,255,0.025)", color: T.text, fontSize: "13px",
        fontFamily: T.mono, outline: "none", width: "58px", textAlign: "center", transition: "all 0.2s ease",
      }}
      onFocus={(e) => { e.target.style.borderColor = accent; e.target.style.boxShadow = `0 0 0 3px ${accent}22`; }}
      onBlur={(e) => { e.target.style.borderColor = T.borderSubtle; e.target.style.boxShadow = "none"; }}
    />
  );
}

function RadioOption({ label, checked, onChange, color }) {
  const c = color || T.amber;
  return (
    <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "12.5px", color: checked ? c : T.textSecondary, fontFamily: T.sans, padding: "3px 0" }}>
      <span style={{ width: "15px", height: "15px", borderRadius: "50%", border: `2px solid ${checked ? c : T.textMuted}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        {checked && <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: c }} />}
      </span>
      {label}
    </label>
  );
}

function SectionLabel({ children }) {
  return <div style={{ fontSize: "10px", fontWeight: "700", color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "10px", fontFamily: T.mono }}>{children}</div>;
}

function TabBtn({ icon, label, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      display: "flex", alignItems: "center", gap: "6px", padding: "7px 14px", borderRadius: "7px",
      border: active ? "1px solid rgba(245,166,35,0.2)" : "1px solid transparent",
      background: active ? T.amberDim : "transparent", color: active ? T.amber : T.textMuted,
      fontSize: "12px", fontWeight: "600", cursor: "pointer", fontFamily: T.sans, transition: "all 0.2s ease",
    }}>{icon}{label}</button>
  );
}

function TraversalOutputBar({ output, isAnimating }) {
  if (!output.length) return null;
  return (
    <div style={{ background: T.bgCard, borderRadius: T.radius, border: "1px solid rgba(34,197,94,0.12)", padding: "10px 16px", display: "flex", alignItems: "center", gap: "10px" }}>
      <div style={{ fontSize: "10px", fontWeight: "700", color: T.green, textTransform: "uppercase", letterSpacing: "0.1em", whiteSpace: "nowrap", fontFamily: T.mono }}>Output</div>
      <div style={{ width: "1px", height: "22px", background: "rgba(34,197,94,0.12)" }} />
      <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
        {output.map((val, i) => {
          const isLatest = i === output.length - 1 && isAnimating;
          return (
            <span key={i} style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              minWidth: "32px", height: "32px", borderRadius: "7px",
              background: isLatest ? T.greenDim : "rgba(34,197,94,0.03)",
              border: `1px solid ${isLatest ? "rgba(34,197,94,0.3)" : "rgba(34,197,94,0.08)"}`,
              color: isLatest ? T.green : "rgba(34,197,94,0.55)",
              fontSize: "12px", fontFamily: T.mono, fontWeight: "600", padding: "0 6px",
              boxShadow: isLatest ? "0 0 8px rgba(34,197,94,0.12)" : "none",
            }}>{val}</span>
          );
        })}
        {isAnimating && (
          <span style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            width: "32px", height: "32px", borderRadius: "7px",
            border: "1px dashed rgba(34,197,94,0.15)", color: "rgba(34,197,94,0.25)",
            fontSize: "12px", fontFamily: T.mono,
          }}>?</span>
        )}
      </div>
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════════
   PSEUDOCODE DEFINITIONS + PANEL
   ═══════════════════════════════════════════════════════════════ */

const PSEUDOCODE = {
  insert: [
    { text: "procedure insert(node, val)", id: 0, kw: true },
    { text: "if node is null:", id: 1, indent: 1, kw: true },
    { text: "return new Node(val)", id: 2, indent: 2 },
    { text: "if val < node.val:", id: 3, indent: 1, kw: true },
    { text: "node.left = insert(node.left, val)", id: 4, indent: 2 },
    { text: "else if val > node.val:", id: 5, indent: 1, kw: true },
    { text: "node.right = insert(node.right, val)", id: 6, indent: 2 },
    { text: "return node", id: 7, indent: 1 },
    { text: "end procedure", id: 8, kw: true },
  ],
  search: [
    { text: "procedure search(node, val)", id: 0, kw: true },
    { text: "if node is null:", id: 1, indent: 1, kw: true },
    { text: "return NOT FOUND", id: 2, indent: 2 },
    { text: "if val == node.val:", id: 3, indent: 1, kw: true },
    { text: "return FOUND", id: 4, indent: 2, visit: true },
    { text: "if val < node.val:", id: 5, indent: 1, kw: true },
    { text: "return search(node.left, val)", id: 6, indent: 2 },
    { text: "else:", id: 7, indent: 1, kw: true },
    { text: "return search(node.right, val)", id: 8, indent: 2 },
    { text: "end procedure", id: 9, kw: true },
  ],
  delete: [
    { text: "procedure delete(node, val)", id: 0, kw: true },
    { text: "if node is null: return null", id: 1, indent: 1, kw: true },
    { text: "if val < node.val:", id: 2, indent: 1, kw: true },
    { text: "node.left = delete(node.left, val)", id: 3, indent: 2 },
    { text: "else if val > node.val:", id: 4, indent: 1, kw: true },
    { text: "node.right = delete(node.right, val)", id: 5, indent: 2 },
    { text: "else:  // found the node", id: 6, indent: 1, kw: true },
    { text: "handle 0/1/2 children case", id: 7, indent: 2, visit: true },
    { text: "end procedure", id: 8, kw: true },
  ],
  preorder: [
    { text: "procedure preOrder(node)", id: 0, kw: true },
    { text: "if node is not null:", id: 1, indent: 1, kw: true },
    { text: "visit node  ← append to output", id: 2, indent: 2, visit: true },
    { text: "preOrder(node.left)", id: 3, indent: 2 },
    { text: "preOrder(node.right)", id: 4, indent: 2 },
    { text: "end procedure", id: 5, kw: true },
  ],
  inorder: [
    { text: "procedure inOrder(node)", id: 0, kw: true },
    { text: "if node is not null:", id: 1, indent: 1, kw: true },
    { text: "inOrder(node.left)", id: 2, indent: 2 },
    { text: "visit node  ← append to output", id: 3, indent: 2, visit: true },
    { text: "inOrder(node.right)", id: 4, indent: 2 },
    { text: "end procedure", id: 5, kw: true },
  ],
  postorder: [
    { text: "procedure postOrder(node)", id: 0, kw: true },
    { text: "if node is not null:", id: 1, indent: 1, kw: true },
    { text: "postOrder(node.left)", id: 2, indent: 2 },
    { text: "postOrder(node.right)", id: 3, indent: 2 },
    { text: "visit node  ← append to output", id: 4, indent: 2, visit: true },
    { text: "end procedure", id: 5, kw: true },
  ],
  levelorder: [
    { text: "procedure levelOrder(root)", id: 0, kw: true },
    { text: "queue ← [root]", id: 1, indent: 1 },
    { text: "while queue is not empty:", id: 2, indent: 1, kw: true },
    { text: "node ← dequeue  ← visit", id: 3, indent: 2, visit: true },
    { text: "if node.left: enqueue(left)", id: 4, indent: 2 },
    { text: "if node.right: enqueue(right)", id: 5, indent: 2 },
    { text: "end procedure", id: 6, kw: true },
  ],
};

function PseudocodePanel({ activeLine, codeKey }) {
  const lines = PSEUDOCODE[codeKey] || PSEUDOCODE.inorder;
  return (
    <div style={{ fontFamily: T.mono, fontSize: "12px", lineHeight: 1.9 }}>
      {lines.map((l) => {
        const isActive = l.id === activeLine;
        return (
          <div key={l.id} style={{
            paddingLeft: `${(l.indent || 0) * 18 + 10}px`,
            paddingTop: "3px", paddingBottom: "3px", paddingRight: "10px",
            borderRadius: "5px",
            background: isActive ? T.greenDim : "transparent",
            borderLeft: isActive ? `3px solid ${T.green}` : "3px solid transparent",
            color: isActive ? T.green : l.kw ? T.indigo : l.visit ? T.amber : T.textSecondary,
            fontWeight: isActive ? "600" : "400",
            transition: "all 0.25s ease",
          }}>{l.text}</div>
        );
      })}
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════════
   MAIN PAGE COMPONENT
   ═══════════════════════════════════════════════════════════════ */

export default function BSTVisualizationPage() {
  /* ── Tree data ── */
  const [treeRoot, setTreeRoot] = useState(null);

  /* ── Input fields ── */
  const [insertVal, setInsertVal] = useState("");
  const [deleteVal, setDeleteVal] = useState("");
  const [findVal, setFindVal] = useState("");

  /* ── Config ── */
  const [traversal, setTraversal] = useState("inorder");
  const [findMode, setFindMode] = useState("successor");
  const [activeTab, setActiveTab] = useState("pseudocode");

  /* ── Animation engine ── */
  const [snapshots, setSnapshots] = useState([]);
  const [stepIdx, setStepIdx] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [animSpeed, setAnimSpeed] = useState(60);
  const [currentOp, setCurrentOp] = useState("inorder");
  const timerRef = useRef(null);

  /* ── Init sample tree ── */
  useEffect(() => {
    let r = null;
    [24, 12, 36, 6, 18, 30, 42, 3].forEach(v => { r = insertIntoBST(r, v); });
    setTreeRoot(r);
  }, []);

  /**
   * THE SINGLE SOURCE OF TRUTH:
   * currentSnapshot is derived from snapshots[stepIdx].
   * Every piece of UI reads from this one object.
   * Active node, pseudocode line, and output are ALWAYS in sync
   * because they come from the same pre-computed snapshot.
   */
  const currentSnapshot = useMemo(() => {
    if (stepIdx >= 0 && stepIdx < snapshots.length) {
      return snapshots[stepIdx];
    }
    return IDLE_SNAPSHOT;
  }, [snapshots, stepIdx]);

  const speedMs = Math.max(100, 1200 - animSpeed * 10);
  const isAnimating = snapshots.length > 0 && stepIdx >= 0;
  const isDone = stepIdx >= snapshots.length - 1 && snapshots.length > 0;
  const totalSteps = snapshots.length;
  const curStep = stepIdx >= 0 ? stepIdx + 1 : 0;

  /* ── Auto-play timer ── */
  useEffect(() => {
    if (isPlaying && isAnimating && !isDone) {
      timerRef.current = setTimeout(() => {
        setStepIdx(prev => {
          const next = prev + 1;
          if (next >= snapshots.length) {
            setIsPlaying(false);
            return prev;
          }
          return next;
        });
      }, speedMs);
    }
    if (isDone && isPlaying) setIsPlaying(false);
    return () => clearTimeout(timerRef.current);
  }, [isPlaying, stepIdx, snapshots.length, speedMs, isAnimating, isDone]);

  /* ── Animation lifecycle ── */
  function resetAnim() {
    clearTimeout(timerRef.current);
    setIsPlaying(false);
    setSnapshots([]);
    setStepIdx(-1);
  }

  function startAnimation(events, opKey) {
    resetAnim();
    const baked = bakeSnapshots(events);
    if (!baked.length) return;
    setCurrentOp(opKey);
    // Use setTimeout to ensure resetAnim state is flushed first
    setTimeout(() => {
      setSnapshots(baked);
      setStepIdx(0);
      setIsPlaying(true);
    }, 0);
  }

  /* ── Operations ── */
  function handleInsert() {
    const v = parseInt(insertVal);
    if (isNaN(v)) return;
    resetAnim();
    const events = generateInsertEvents(treeRoot, v);
    const newRoot = insertIntoBST(cloneTree(treeRoot), v);
    setTreeRoot(newRoot);
    setInsertVal("");
    startAnimation(events, "insert");
  }

  function handleDelete() {
    const v = parseInt(deleteVal);
    if (isNaN(v) || !treeRoot) return;
    resetAnim();
    const events = generateDeleteEvents(treeRoot, v, findMode === "successor");
    const newRoot = deleteFromBST(cloneTree(treeRoot), v, findMode === "successor");
    setTreeRoot(newRoot);
    setDeleteVal("");
    startAnimation(events, "delete");
  }

  function handleFind() {
    const v = parseInt(findVal);
    if (isNaN(v) || !treeRoot) return;
    resetAnim();
    const events = generateSearchEvents(treeRoot, v);
    setFindVal("");
    startAnimation(events, "search");
  }

  function handleTraverse() {
    if (!treeRoot) return;
    resetAnim();
    const events = generateTraversalEvents(treeRoot, traversal);
    startAnimation(events, traversal);
  }

  function handleRandom() {
    resetAnim();
    let r = null;
    const count = 6 + Math.floor(Math.random() * 5);
    const vals = new Set();
    while (vals.size < count) vals.add(Math.floor(Math.random() * 99) + 1);
    vals.forEach(v => { r = insertIntoBST(r, v); });
    setTreeRoot(r);
  }

  function handleClear() {
    resetAnim();
    setTreeRoot(null);
  }

  /**
   * PLAYBACK CONTROLS
   * 
   * All navigation is just: setStepIdx(newIndex).
   * The snapshot at that index contains the COMPLETE synchronized state.
   * No incremental mutation. No replay. No desync possible.
   */
  function togglePlay() {
    if (!snapshots.length) return;
    if (isDone && !isPlaying) {
      setStepIdx(0);
      setIsPlaying(true);
    } else {
      setIsPlaying(p => !p);
    }
  }

  function stepForward() {
    if (stepIdx + 1 < snapshots.length) {
      setIsPlaying(false);
      setStepIdx(stepIdx + 1);
    }
  }

  function stepBack() {
    if (stepIdx > 0) {
      setIsPlaying(false);
      setStepIdx(stepIdx - 1);  // Just load the previous snapshot. That's it.
    }
  }

  function skipToEnd() {
    if (!snapshots.length) return;
    setIsPlaying(false);
    setStepIdx(snapshots.length - 1);
  }

  function skipToStart() {
    if (!snapshots.length) return;
    setIsPlaying(false);
    setStepIdx(0);
  }

  const nodeCount = treeSize(treeRoot);
  const height = treeHeight(treeRoot);

  /* ══════════════════════════════
     RENDER
     ══════════════════════════════ */
  return (
    <div style={{ minHeight: "100vh", background: T.bgBase, color: T.text, fontFamily: T.sans }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${T.textDim}; border-radius: 10px; }
        input[type="range"] { -webkit-appearance: none; background: ${T.borderSubtle}; height: 3px; border-radius: 3px; outline: none; }
        input[type="range"]::-webkit-slider-thumb { -webkit-appearance: none; width: 14px; height: 14px; border-radius: 50%; background: ${T.amber}; cursor: pointer; border: 2px solid ${T.bgBase}; box-shadow: 0 0 6px ${T.amberGlow}; }
      `}</style>

      {/* Ambient background */}
      <div style={{ position: "fixed", inset: 0, background: "radial-gradient(ellipse at 15% 0%, rgba(245,166,35,0.03) 0%, transparent 55%), radial-gradient(ellipse at 85% 100%, rgba(34,197,94,0.025) 0%, transparent 50%)", pointerEvents: "none", zIndex: 0 }} />

      {/* ═══ NAVBAR ═══ */}
      <nav style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "12px 28px", borderBottom: `1px solid ${T.border}`,
        backdropFilter: "blur(16px)", background: "rgba(11,17,32,0.88)",
        position: "sticky", top: 0, zIndex: 100,
      }}>
        <a href="#" style={{ fontSize: "17px", fontWeight: "700", color: T.text, textDecoration: "none", letterSpacing: "-0.02em" }}>
          <span style={{ color: T.blue }}>UB</span>{" "}
          <span style={{ fontWeight: 400, color: T.textSecondary }}>StructStudio</span>
        </a>
        <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
          <a href="#" style={{ color: T.textSecondary, textDecoration: "none", fontSize: "13.5px", fontWeight: 500 }}>Home</a>
          <a href="#" style={{ color: T.textSecondary, textDecoration: "none", fontSize: "13.5px", fontWeight: 500 }}>About</a>
        </div>
      </nav>

      {/* ═══ BREADCRUMB ═══ */}
      <div style={{
        padding: "10px 28px", display: "flex", alignItems: "center", gap: "8px",
        fontSize: "12.5px", borderBottom: `1px solid ${T.border}`,
      }}>
        <a href="#" style={{ color: T.amber, textDecoration: "none", display: "flex", alignItems: "center", gap: "5px", fontWeight: 500 }}>
          <Icon.ArrowLeft size={13} /><span>Structures</span>
        </a>
        <Icon.ChevronRight size={12} />
        <span style={{ color: T.text, fontWeight: 600 }}>Binary Search Tree</span>
        <span style={{
          background: "rgba(34,197,94,0.08)", color: T.green,
          padding: "2px 10px", borderRadius: "10px", fontSize: "10px",
          fontWeight: "700", letterSpacing: "0.06em", textTransform: "uppercase",
          fontFamily: T.mono, marginLeft: "4px",
        }}>Trees &amp; SkipList</span>

        {totalSteps > 0 && (
          <span style={{
            marginLeft: "auto", background: T.greenDim, color: T.green,
            padding: "4px 12px", borderRadius: "7px", fontSize: "11.5px",
            fontWeight: "600", fontFamily: T.mono, border: "1px solid rgba(34,197,94,0.15)",
            display: "flex", alignItems: "center", gap: "6px",
          }}>
            <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: isPlaying ? T.green : T.amber, display: "inline-block" }} />
            {isDone ? "Done" : isPlaying ? "Playing" : "Paused"} &middot; Step {curStep}/{totalSteps}
          </span>
        )}
      </div>

      {/* ═══ MAIN LAYOUT ═══ */}
      <div style={{
        display: "grid", gridTemplateColumns: "1fr 330px",
        gap: "16px", padding: "16px 28px 28px",
        position: "relative", zIndex: 1, minHeight: "calc(100vh - 108px)",
      }}>

        {/* ─── LEFT COLUMN ─── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>

          {/* Toolbar */}
          <div style={{
            background: T.bgCard, borderRadius: T.radiusLg,
            border: `1px solid ${T.border}`, padding: "12px 16px",
            display: "flex", flexWrap: "wrap", gap: "10px", alignItems: "center",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <ValInput placeholder="val" value={insertVal} onChange={(e) => setInsertVal(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleInsert()} />
              <ActionBtn variant="primary" onClick={handleInsert} disabled={isPlaying}><Icon.Plus size={13} /> Insert</ActionBtn>
            </div>
            <div style={{ width: "1px", height: "24px", background: T.border }} />
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <ValInput placeholder="val" value={deleteVal} onChange={(e) => setDeleteVal(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleDelete()} accentColor={T.red} />
              <ActionBtn variant="danger" onClick={handleDelete} disabled={isPlaying}><Icon.Minus size={13} /> Delete</ActionBtn>
            </div>
            <div style={{ width: "1px", height: "24px", background: T.border }} />
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <ValInput placeholder="val" value={findVal} onChange={(e) => setFindVal(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleFind()} accentColor={T.blue} />
              <ActionBtn onClick={handleFind} disabled={isPlaying}><Icon.Search size={12} /> Find</ActionBtn>
            </div>
            <div style={{ width: "1px", height: "24px", background: T.border }} />
            <ActionBtn onClick={handleRandom} disabled={isPlaying} title="Random tree"><Icon.Shuffle size={12} /></ActionBtn>
            <ActionBtn variant="ghost" onClick={handleClear} disabled={isPlaying} title="Clear tree"><Icon.Trash size={12} /></ActionBtn>
          </div>

          {/* Traversal Output — reads from currentSnapshot.output */}
          <TraversalOutputBar output={currentSnapshot.output} isAnimating={isAnimating && !isDone} />

          {/* Tree Canvas — reads snapshot for active/visited/comparing */}
          <div style={{
            background: T.bgCard, borderRadius: "16px",
            border: `1px solid ${T.border}`, padding: "20px",
            flex: 1, minHeight: "380px", position: "relative", overflow: "hidden",
          }}>
            <div style={{
              position: "absolute", inset: 0,
              backgroundImage: "linear-gradient(rgba(245,166,35,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(245,166,35,0.018) 1px, transparent 1px)",
              backgroundSize: "36px 36px", pointerEvents: "none",
            }} />
            <BSTCanvas treeRoot={treeRoot} snapshot={currentSnapshot} />
            {currentSnapshot.statusMsg && (
              <div style={{ position: "absolute", bottom: "12px", left: "12px" }}>
                <span style={{
                  background: T.greenDim, color: T.green,
                  padding: "4px 12px", borderRadius: "6px",
                  fontSize: "11px", fontFamily: T.mono, fontWeight: "500",
                  border: "1px solid rgba(34,197,94,0.12)",
                }}>&rsaquo; {currentSnapshot.statusMsg}</span>
              </div>
            )}
            <div style={{ position: "absolute", bottom: "12px", right: "12px" }}>
              <span style={{
                background: T.amberDim, color: T.amber,
                padding: "4px 12px", borderRadius: "6px",
                fontSize: "11px", fontFamily: T.mono, fontWeight: "500",
                border: "1px solid rgba(245,166,35,0.1)",
              }}>{nodeCount} nodes &middot; height {height}</span>
            </div>
          </div>

          {/* Playback Controls */}
          <div style={{
            background: T.bgCard, borderRadius: T.radius,
            border: `1px solid ${T.border}`, padding: "10px 16px",
            display: "flex", alignItems: "center", gap: "8px",
          }}>
            <ActionBtn variant="ghost" onClick={skipToStart} disabled={!snapshots.length || stepIdx <= 0} title="Skip to start"><Icon.SkipBack size={14} /></ActionBtn>
            <ActionBtn variant="ghost" onClick={stepBack} disabled={stepIdx <= 0} title="Step back"><Icon.StepBack size={14} /></ActionBtn>
            <button onClick={togglePlay} disabled={!snapshots.length}
              style={{
                width: "36px", height: "36px", borderRadius: "50%",
                background: isPlaying ? T.redDim : T.amber,
                border: isPlaying ? "1px solid rgba(239,68,68,0.2)" : "none",
                color: isPlaying ? T.red : T.bgBase,
                cursor: snapshots.length ? "pointer" : "not-allowed",
                display: "flex", alignItems: "center", justifyContent: "center",
                opacity: snapshots.length ? 1 : 0.35, transition: "all 0.2s ease",
                boxShadow: isPlaying ? "none" : snapshots.length ? `0 0 12px ${T.amberGlow}` : "none",
              }}
            >
              {isPlaying ? <Icon.Pause size={14} /> : <Icon.Play size={14} />}
            </button>
            <ActionBtn variant="ghost" onClick={stepForward} disabled={stepIdx + 1 >= snapshots.length} title="Step forward"><Icon.StepForward size={14} /></ActionBtn>
            <ActionBtn variant="ghost" onClick={skipToEnd} disabled={!snapshots.length || isDone} title="Skip to end"><Icon.SkipForward size={14} /></ActionBtn>
            <div style={{ width: "1px", height: "24px", background: T.border, margin: "0 4px" }} />
            <div style={{ display: "flex", alignItems: "center", gap: "8px", flex: 1 }}>
              <Icon.Zap size={12} />
              <input type="range" min="10" max="100" value={animSpeed} onChange={(e) => setAnimSpeed(+e.target.value)} style={{ flex: 1 }} />
              <span style={{ fontSize: "11px", color: T.amber, fontFamily: T.mono, minWidth: "30px", textAlign: "right" }}>{animSpeed}%</span>
            </div>
          </div>
        </div>

        {/* ─── RIGHT COLUMN ─── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>

          {/* Traversal + Deletion config */}
          <div style={{ background: T.bgCard, borderRadius: T.radiusLg, border: `1px solid ${T.border}`, padding: "16px 18px" }}>
            <SectionLabel>Traversal Order</SectionLabel>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2px 14px" }}>
              {["Pre-order", "In-order", "Post-order", "Level-order"].map((t) => (
                <RadioOption key={t} label={t} checked={traversal === t.toLowerCase().replace("-", "")} onChange={() => setTraversal(t.toLowerCase().replace("-", ""))} />
              ))}
            </div>
            <div style={{ marginTop: "12px" }}>
              <ActionBtn variant="traverse" onClick={handleTraverse} disabled={isPlaying || !treeRoot}>
                <Icon.Play size={11} /> Traverse
              </ActionBtn>
            </div>
            <div style={{ height: "1px", background: T.border, margin: "14px 0" }} />
            <SectionLabel>Deletion Mode</SectionLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              <RadioOption label="Predecessor" checked={findMode === "predecessor"} onChange={() => setFindMode("predecessor")} />
              <RadioOption label="Successor" checked={findMode === "successor"} onChange={() => setFindMode("successor")} />
            </div>
          </div>

          {/* Info Tabs — pseudocode reads from currentSnapshot.pseudocodeLine */}
          <div style={{
            background: T.bgCard, borderRadius: T.radiusLg,
            border: `1px solid ${T.border}`, overflow: "hidden",
            flex: 1, display: "flex", flexDirection: "column",
          }}>
            <div style={{
              display: "flex", gap: "3px", padding: "8px 10px",
              borderBottom: `1px solid ${T.border}`, background: "rgba(0,0,0,0.18)",
            }}>
              <TabBtn icon={<Icon.Info size={13} />} label="About" active={activeTab === "about"} onClick={() => setActiveTab("about")} />
              <TabBtn icon={<Icon.Code size={13} />} label="Pseudocode" active={activeTab === "pseudocode"} onClick={() => setActiveTab("pseudocode")} />
              <TabBtn icon={<Icon.Clock size={13} />} label="Big O" active={activeTab === "bigO"} onClick={() => setActiveTab("bigO")} />
            </div>

            <div style={{ padding: "16px", flex: 1, overflowY: "auto" }}>

              {activeTab === "about" && (
                <div>
                  <p style={{ color: T.textSecondary, fontSize: "13.5px", lineHeight: 1.75, margin: 0 }}>
                    A <strong style={{ color: T.text }}>Binary Search Tree</strong> is a node-based binary tree where each node has at most two children. For each node, all elements in the left subtree are less, and all in the right subtree are greater.
                  </p>
                  <div style={{ marginTop: "18px", padding: "12px 14px", borderRadius: T.radius, background: T.amberDim, border: "1px solid rgba(245,166,35,0.12)" }}>
                    <div style={{ fontSize: "11px", fontWeight: "700", color: T.amber, marginBottom: "5px", textTransform: "uppercase", letterSpacing: "0.06em", fontFamily: T.mono }}>Key Property</div>
                    <div style={{ fontSize: "13px", color: T.textSecondary, fontFamily: T.mono }}>left.key &lt; node.key &lt; right.key</div>
                  </div>
                  <div style={{ marginTop: "12px", padding: "12px 14px", borderRadius: T.radius, background: "rgba(255,255,255,0.02)", border: `1px solid ${T.borderSubtle}` }}>
                    <div style={{ fontSize: "11px", fontWeight: "700", color: T.textMuted, marginBottom: "5px", textTransform: "uppercase", letterSpacing: "0.06em", fontFamily: T.mono }}>Operations</div>
                    <div style={{ fontSize: "13px", color: T.textSecondary, lineHeight: 1.7 }}>
                      Insert, Delete, Search, and four Traversal orders. Use the controls to interact with the tree and step through each algorithm.
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "pseudocode" && (
                <div>
                  {/* Pseudocode panel reads activeLine from currentSnapshot */}
                  <PseudocodePanel activeLine={currentSnapshot.pseudocodeLine} codeKey={currentOp} />

                  {/* Sync indicator — shows active node + output together */}
                  {currentSnapshot.activeNode !== null && (
                    <div style={{
                      marginTop: "16px", padding: "10px 12px", borderRadius: "7px",
                      background: T.greenDim, border: "1px solid rgba(34,197,94,0.12)",
                      fontSize: "11.5px", color: T.green, fontFamily: T.mono,
                    }}>
                      &rarr; Currently at node <strong>{currentSnapshot.activeNode}</strong>
                      {currentSnapshot.output.length > 0 && (
                        <span> &middot; Output: [{currentSnapshot.output.join(", ")}]</span>
                      )}
                    </div>
                  )}
                  {currentSnapshot.comparingNode !== null && currentSnapshot.activeNode === null && (
                    <div style={{
                      marginTop: "16px", padding: "10px 12px", borderRadius: "7px",
                      background: T.amberDim, border: "1px solid rgba(245,166,35,0.12)",
                      fontSize: "11.5px", color: T.amber, fontFamily: T.mono,
                    }}>
                      &rarr; Comparing at node <strong>{currentSnapshot.comparingNode}</strong>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "bigO" && (
                <div>
                  <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0 4px", fontSize: "12.5px" }}>
                    <thead>
                      <tr>
                        {["Operation", "Average", "Worst"].map((h) => (
                          <th key={h} style={{
                            textAlign: h === "Operation" ? "left" : "center",
                            color: T.textMuted, fontWeight: "700", fontSize: "10px",
                            textTransform: "uppercase", letterSpacing: "0.1em", padding: "6px 8px", fontFamily: T.mono,
                          }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { op: "Search", avg: "O(log n)", worst: "O(n)" },
                        { op: "Insert", avg: "O(log n)", worst: "O(n)" },
                        { op: "Delete", avg: "O(log n)", worst: "O(n)" },
                        { op: "Traversal", avg: "O(n)", worst: "O(n)" },
                      ].map((r) => (
                        <tr key={r.op}>
                          <td style={{ padding: "8px", background: "rgba(255,255,255,0.015)", borderRadius: "6px 0 0 6px", color: T.text, fontWeight: "500" }}>{r.op}</td>
                          <td style={{ padding: "8px", background: "rgba(255,255,255,0.015)", textAlign: "center", fontFamily: T.mono, color: T.green, fontWeight: 600 }}>{r.avg}</td>
                          <td style={{ padding: "8px", background: "rgba(255,255,255,0.015)", borderRadius: "0 6px 6px 0", textAlign: "center", fontFamily: T.mono, color: T.red, fontWeight: 600 }}>{r.worst}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div style={{ marginTop: "14px", padding: "12px 14px", borderRadius: T.radius, background: "rgba(255,255,255,0.015)", border: `1px solid ${T.borderSubtle}` }}>
                    <div style={{ fontSize: "10px", fontWeight: "700", color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "4px", fontFamily: T.mono }}>Space Complexity</div>
                    <div style={{ fontSize: "15px", fontFamily: T.mono, color: T.amber, fontWeight: "700" }}>O(n)</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ═══ FOOTER ═══ */}
      <div style={{ padding: "12px 28px", textAlign: "center", borderTop: `1px solid ${T.border}` }}>
        <a href="#" style={{ color: T.amber, textDecoration: "none", fontSize: "12.5px", display: "inline-flex", alignItems: "center", gap: "6px", fontWeight: 500 }}>
          <Icon.ArrowLeft size={12} /> Return to Home Page
        </a>
      </div>
    </div>
  );
}
