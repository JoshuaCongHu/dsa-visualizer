// Copyright 2011 David Galles, University of San Francisco. All rights reserved.
//
// Redistribution and use in source and binary forms, with or without modification, are
// permitted provided that the following conditions are met:
//
// 1. Redistributions of source code must retain the above copyright notice, this list of
// conditions and the following disclaimer.
//
// 2. Redistributions in binary form must reproduce the above copyright notice, this list
// of conditions and the following disclaimer in the documentation and/or other materials
// provided with the distribution.
//
// THIS SOFTWARE IS PROVIDED BY <COPYRIGHT HOLDER> ``AS IS'' AND ANY EXPRESS OR IMPLIED
// WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
// FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> OR
// CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
// CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
// SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
// ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
// NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF
// ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
// The views and conclusions contained in the software and documentation are those of the
// authors and should not be interpreted as representing official policies, either expressed
// or implied, of the University of San Francisco

// TODO:  UNDO (all the way) is BROKEN.  Redo reset ...

import Algorithm, {
	addControlToAlgorithmBar,
	addDivisorToAlgorithmBar,
	addGroupToAlgorithmBar,
	addLabelToAlgorithmBar,
	addRadioButtonGroupToAlgorithmBar,
} from './Algorithm.js';
import {
	LARGE_ADJ_LIST,
	LARGE_ALLOWED,
	LARGE_CURVE,
	LARGE_X_POS_LOGICAL,
	LARGE_Y_POS_LOGICAL,
	SMALL_ALLLOWED,
	SMALL_CURVE,
	SMALL_X_POS_LOGICAL,
	SMALL_Y_POS_LOGICAL,
} from './util/GraphValues.js';
import { act } from '../anim/AnimationMain';

const SMALL_ADJ_MATRIX_X_START = 500;
const SMALL_ADJ_MATRIX_Y_START = 50;
const SMALL_ADJ_MATRIX_WIDTH = 30;
const SMALL_ADJ_MATRIX_HEIGHT = 30;

const SMALL_ADJ_LIST_X_START = 350;
const SMALL_ADJ_LIST_Y_START = 50;

const SMALL_ADJ_LIST_ELEM_WIDTH = 80;
const SMALL_ADJ_LIST_ELEM_HEIGHT = 30;

const SMALL_ADJ_LIST_HEIGHT = 36;
const SMALL_ADJ_LIST_WIDTH = 36;

const SMALL_ADJ_LIST_SPACING_AFTER_LIST = 15;
const SMALL_ADJ_LIST_SPACING_BETWEEN_NODES = 15;

const LARGE_ADJ_MATRIX_X_START = 400;
const LARGE_ADJ_MATRIX_Y_START = 50;
const LARGE_ADJ_MATRIX_WIDTH = 23;
const LARGE_ADJ_MATRIX_HEIGHT = 23;

const LARGE_ADJ_LIST_X_START = 350;
const LARGE_ADJ_LIST_Y_START = 50;

const LARGE_ADJ_LIST_ELEM_WIDTH = 80;
const LARGE_ADJ_LIST_ELEM_HEIGHT = 20;

const LARGE_ADJ_LIST_HEIGHT = 25;
const LARGE_ADJ_LIST_WIDTH = 20;

const LARGE_ADJ_LIST_SPACING_AFTER_LIST = 25;
const LARGE_ADJ_LIST_SPACING_BETWEEN_NODES = 15;

export const VERTEX_INDEX_COLOR = '#0000FF';
export const EDGE_COLOR = '#000000';

const HIGHLIGHT_CIRCLE_COLOR = '#000000';

export const SMALL_SIZE = 8;
export const LARGE_SIZE = 18;

export default class Graph extends Algorithm {
	constructor(am, w, h, defaultEdges, dir, dag, costs) {
		super(am, w, h);
		this.controls = [];
		defaultEdges = defaultEdges.length === 0 ? undefined : defaultEdges;
		dir = dir === undefined ? false : dir;
		dag = dag === undefined ? false : dag;
		costs = costs === undefined ? false : costs;

		this.nextIndex = 0;
		this.isTraversalRunning = false;

		this.currentLayer = 1;
		this.defaultEdges = defaultEdges;
		this.directed = dir;
		this.isDAG = dag;
		this.showEdgeCosts = costs;
		this.currentLayer = 1;

		this.setup_small(this.defaultEdges);
	}

	addControls(addDirection) {
		if (addDirection == null) {
			addDirection = true;
		}

		this.cancelButton = addControlToAlgorithmBar('Button', 'Cancel');
		this.cancelButton.onclick = this.cancelCallback.bind(this);
		this.cancelButton.disabled = true;

		addDivisorToAlgorithmBar();

		const verticalGroup = addGroupToAlgorithmBar(false);
		this.newGraphButton = addControlToAlgorithmBar('Button', 'New Graph', verticalGroup);
		this.newGraphButton.onclick = this.newGraphCallback.bind(this);
		this.controls.push(this.newGraphButton);
		this.defaultGraphButton = addControlToAlgorithmBar(
			'Button',
			'Default Graph',
			verticalGroup,
		);
		this.defaultGraphButton.onclick = this.defaultGraphCallback.bind(this);
		this.defaultGraphButton.disabled = true;
		this.controls.push(this.defaultGraphButton);

		addDivisorToAlgorithmBar();

		if (addDirection) {
			const radioButtonList = addRadioButtonGroupToAlgorithmBar(
				['Undirected Graph', 'Directed Graph'],
				'GraphType',
			);

			this.undirectedGraphButton = radioButtonList[0];
			this.undirectedGraphButton.onclick = this.directedGraphCallback.bind(this, false);
			this.undirectedGraphButton.checked = !this.directed;
			this.controls.push(this.undirectedGraphButton);

			this.directedGraphButton = radioButtonList[1];
			this.directedGraphButton.onclick = this.directedGraphCallback.bind(this, true);
			this.directedGraphButton.checked = this.directed;
			this.controls.push(this.directedGraphButton);

			addDivisorToAlgorithmBar();
		}

		let radioButtonList = addRadioButtonGroupToAlgorithmBar(
			['Small Graph', 'Large Graph'],
			'GraphSize',
		);

		this.smallGraphButton = radioButtonList[0];
		this.smallGraphButton.onclick = this.smallGraphCallback.bind(this);
		this.smallGraphButton.checked = true;
		this.controls.push(this.smallGraphButton);

		this.largeGraphButton = radioButtonList[1];
		this.largeGraphButton.onclick = this.largeGraphCallback.bind(this);
		this.controls.push(this.largeGraphButton);

		addDivisorToAlgorithmBar();

		// Vertex controls
		addLabelToAlgorithmBar('Vertex:');
		this.vertexField = addControlToAlgorithmBar('Text', '');
		this.vertexField.size = 2;
		this.vertexField.style.textAlign = 'center';
		this.vertexField.onkeydown = this.returnSubmit(
			this.vertexField,
			this.addVertexCallback.bind(this),
			1,
			false,
		);
		this.controls.push(this.vertexField);

		this.addVertexButton = addControlToAlgorithmBar('Button', 'Add Vertex');
		this.addVertexButton.onclick = this.addVertexCallback.bind(this);
		this.controls.push(this.addVertexButton);

		this.removeVertexButton = addControlToAlgorithmBar('Button', 'Remove Vertex');
		this.removeVertexButton.onclick = this.removeVertexCallback.bind(this);
		this.controls.push(this.removeVertexButton);

		addDivisorToAlgorithmBar();

		// Edge controls
		addLabelToAlgorithmBar('From:');
		this.fromField = addControlToAlgorithmBar('Text', '');
		this.fromField.size = 2;
		this.fromField.style.textAlign = 'center';
		this.controls.push(this.fromField);

		addLabelToAlgorithmBar('To:');
		this.toField = addControlToAlgorithmBar('Text', '');
		this.toField.size = 2;
		this.toField.style.textAlign = 'center';
		this.toField.onkeydown = this.returnSubmit(
			this.toField,
			this.addEdgeCallback.bind(this),
			1,
			false,
		);
		this.controls.push(this.toField);

		this.addEdgeButton = addControlToAlgorithmBar('Button', 'Add Edge');
		this.addEdgeButton.onclick = this.addEdgeCallback.bind(this);
		this.controls.push(this.addEdgeButton);

		this.removeEdgeButton = addControlToAlgorithmBar('Button', 'Remove Edge');
		this.removeEdgeButton.onclick = this.removeEdgeCallback.bind(this);
		this.controls.push(this.removeEdgeButton);

		addDivisorToAlgorithmBar();

		// We are explicitly not adding the buttons below to this.controls
		// since we don't want them to be disabled
		radioButtonList = addRadioButtonGroupToAlgorithmBar(
			[
				'Logical Representation',
				'Adjacency List Representation',
				'Adjacency Matrix Representation',
			],
			'GraphRepresentation',
		);

		this.logicalButton = radioButtonList[0];
		this.logicalButton.onclick = this.graphRepChangedCallback.bind(this, 1);

		this.adjacencyListButton = radioButtonList[1];
		this.adjacencyListButton.onclick = this.graphRepChangedCallback.bind(this, 2);

		this.adjacencyMatrixButton = radioButtonList[2];
		this.adjacencyMatrixButton.onclick = this.graphRepChangedCallback.bind(this, 3);
		this.logicalButton.checked = true;
	}

	directedGraphCallback(newDirected) {
		if (newDirected !== this.directed) {
			this.defaultGraphButton.disabled = newDirected;
			this.directed = newDirected;
			this.isTraversalRunning = false;
			this.animationManager.resetAll();
			this.setup();
		}
	}

	smallGraphCallback() {
		if (this.size !== SMALL_SIZE) {
			this.isTraversalRunning = false;
			this.animationManager.resetAll();
			this.setup_small();
		}
	}

	largeGraphCallback() {
		if (this.size !== LARGE_SIZE) {
			this.isTraversalRunning = false;
			this.animationManager.resetAll();
			this.setup_large();
		}
	}

	newGraphCallback() {
		this.isTraversalRunning = false;
		this.animationManager.resetAll();
		this.size = this.isLarge ? LARGE_SIZE : SMALL_SIZE;
		this.setup();
	}

	defaultGraphCallback() {
		this.isTraversalRunning = false;
		this.animationManager.resetAll();
		this.size = this.isLarge ? LARGE_SIZE : SMALL_SIZE;
		this.setup(this.defaultEdges);
	}

	graphRepChangedCallback(newLayer) {
		this.animationManager.setAllLayers([0, 32, newLayer]);
		this.currentLayer = newLayer;
	}

	addVertexCallback() {
		const label = this.vertexField.value.toUpperCase().trim();
		const index = label.charCodeAt(0) - 65;
		if (label.length !== 1 || label < 'A' || label > 'Z') {
			this.shake(this.addVertexButton);
			return;
		}
		if (this.circleID && index < this.circleID.length && this.circleID[index] != null) {
			this.shake(this.addVertexButton);
			return;
		}
		this.vertexField.value = '';
		this.implementAction(this.addVertex.bind(this), label);
	}

	removeVertexCallback() {
		const label = this.vertexField.value.toUpperCase().trim();
		const index = label.charCodeAt(0) - 65;
		if (label.length !== 1 || !this.circleID || this.circleID[index] == null) {
			this.shake(this.removeVertexButton);
			return;
		}
		this.vertexField.value = '';
		this.implementAction(this.removeVertex.bind(this), label);
	}

	addEdgeCallback() {
		const from = this.fromField.value.toUpperCase().trim();
		const to = this.toField.value.toUpperCase().trim();
		if (from.length !== 1 || to.length !== 1 || from < 'A' || from > 'Z' || to < 'A' || to > 'Z') {
			this.shake(this.addEdgeButton);
			return;
		}
		const i = from.charCodeAt(0) - 65;
		const j = to.charCodeAt(0) - 65;
		if (this.circleID[i] == null || this.circleID[j] == null || i === j || this.adj_matrix[i][j] >= 0) {
			this.shake(this.addEdgeButton);
			return;
		}
		this.fromField.value = '';
		this.toField.value = '';
		const weight = this.showEdgeCosts ? Math.floor(Math.random() * 9) + 1 : 1;
		this.implementAction(this.addEdge.bind(this), from, to, weight);
	}

	removeEdgeCallback() {
		const from = this.fromField.value.toUpperCase().trim();
		const to = this.toField.value.toUpperCase().trim();
		if (from.length !== 1 || to.length !== 1 || from < 'A' || from > 'Z' || to < 'A' || to > 'Z') {
			this.shake(this.removeEdgeButton);
			return;
		}
		const i = from.charCodeAt(0) - 65;
		const j = to.charCodeAt(0) - 65;
		if (this.circleID[i] == null || this.circleID[j] == null || this.adj_matrix[i][j] < 0) {
			this.shake(this.removeEdgeButton);
			return;
		}
		this.fromField.value = '';
		this.toField.value = '';
		this.implementAction(this.removeEdge.bind(this), from, to);
	}

	recolorGraph() {
		for (let i = 0; i < this.size; i++) {
			if (this.circleID[i] === null) continue;
			for (let j = 0; j < this.size; j++) {
				if (this.circleID[j] === null) continue;
				if (i !== j && this.adj_matrix[i][j] >= 0) {
					this.setEdgeColor(i, j, EDGE_COLOR);
					this.setEdgeThickness(i, j, 1);
				}
			}
		}
	}

	highlightEdge(i, j, highlightVal, color) {
		if (this.circleID[i] == null || this.circleID[j] == null) return;
		if (this.adj_list_edges[i]?.[j] != null)
			this.cmd(act.setHighlight, this.adj_list_edges[i][j], highlightVal, color);
		if (this.adj_matrixID[i]?.[j] != null)
			this.cmd(act.setHighlight, this.adj_matrixID[i][j], highlightVal, color);
		this.cmd(act.setEdgeHighlight, this.circleID[i], this.circleID[j], highlightVal, color);
		if (!this.directed) {
			this.cmd(act.setEdgeHighlight, this.circleID[j], this.circleID[i], highlightVal, color);
		}
	}

	visitVertex(i) {
		this.cmd(
			act.createHighlightCircle,
			this.highlightCircleL,
			HIGHLIGHT_CIRCLE_COLOR,
			this.x_pos_logical[i],
			this.y_pos_logical[i],
		);
		this.cmd(act.setLayer, this.highlightCircleL, 1);
		this.cmd(
			act.createHighlightCircle,
			this.highlightCircleAL,
			HIGHLIGHT_CIRCLE_COLOR,
			this.adj_list_x_start - this.adj_list_width,
			this.adj_list_y_start + (this._vertexToAdjListRow[i] ?? i) * this.adj_list_height,
		);
		this.cmd(act.setLayer, this.highlightCircleAL, 2);
		this.cmd(
			act.createHighlightCircle,
			this.highlightCircleAM,
			HIGHLIGHT_CIRCLE_COLOR,
			this.adj_matrix_x_start - this.adj_matrix_width,
			this.adj_matrix_y_start + (this._vertexToAdjMatrixRow[i] ?? i) * this.adj_matrix_height,
		);
		this.cmd(act.setLayer, this.highlightCircleAM, 3);
	}

	leaveVertex() {
		this.cmd(act.delete, this.highlightCircleL);
		this.cmd(act.delete, this.highlightCircleAM);
		this.cmd(act.delete, this.highlightCircleAL);
	}

	setEdgeColor(i, j, color) {
		if (this.circleID[i] == null || this.circleID[j] == null) return;
		if (this.adj_list_edges[i]?.[j] != null)
			this.cmd(act.setForegroundColor, this.adj_list_edges[i][j], color);
		if (this.adj_matrixID[i]?.[j] != null)
			this.cmd(act.setTextColor, this.adj_matrixID[i][j], color);
		this.cmd(act.setEdgeColor, this.circleID[i], this.circleID[j], color);
		if (!this.directed) {
			this.cmd(act.setEdgeColor, this.circleID[j], this.circleID[i], color);
		}
	}

	setEdgeThickness(i, j, thickness) {
		if (this.circleID[i] == null || this.circleID[j] == null) return;
		this.cmd(act.setEdgeThickness, this.circleID[i], this.circleID[j], thickness);
		if (!this.directed) {
			this.cmd(act.setEdgeThickness, this.circleID[j], this.circleID[i], thickness);
		}
	}

	clearEdges() {
		for (let i = 0; i < this.size; i++) {
			if (this.circleID[i] === null) continue;
			for (let j = 0; j < this.size; j++) {
				if (this.circleID[j] === null) continue;
				if (i !== j && this.adj_matrix[i][j] >= 0) {
					this.cmd(act.disconnect, this.circleID[i], this.circleID[j]);
				}
			}
		}
	}

	rebuildEdges() {
		this.clearEdges();
		this.buildEdges();
	}

	buildEdges() {
		for (let i = 0; i < this.size; i++) {
			if (this.circleID[i] === null) continue;
			for (let j = 0; j < this.size; j++) {
				if (this.circleID[j] === null) continue;
				if (i !== j && this.adj_matrix[i][j] >= 0) {
					const edgeLabel = this.showEdgeCosts ? String(this.adj_matrix[i][j]) : '';
					if (this.directed) {
						this.cmd(
							act.connect,
							this.circleID[i],
							this.circleID[j],
							EDGE_COLOR,
							this.adjustCurveForDirectedEdges(
								this.curve[i][j],
								this.adj_matrix[j][i] >= 0,
							),
							1,
							edgeLabel,
						);
					} else if (i < j) {
						this.cmd(
							act.connect,
							this.circleID[i],
							this.circleID[j],
							EDGE_COLOR,
							this.curve[i][j],
							0,
							edgeLabel,
						);
					}
				}
			}
		}
	}

	setup_small(adj_matrix) {
		this.allowed = SMALL_ALLLOWED;
		this.curve = SMALL_CURVE.map(row => [...row]);
		this.x_pos_logical = [...SMALL_X_POS_LOGICAL];
		this.y_pos_logical = [...SMALL_Y_POS_LOGICAL];
		this.adj_matrix_x_start = SMALL_ADJ_MATRIX_X_START;
		this.adj_matrix_y_start = SMALL_ADJ_MATRIX_Y_START;
		this.adj_matrix_width = SMALL_ADJ_MATRIX_WIDTH;
		this.adj_matrix_height = SMALL_ADJ_MATRIX_HEIGHT;
		this.adj_list_x_start = SMALL_ADJ_LIST_X_START;
		this.adj_list_y_start = SMALL_ADJ_LIST_Y_START;
		this.adj_list_elem_width = SMALL_ADJ_LIST_ELEM_WIDTH;
		this.adj_list_elem_height = SMALL_ADJ_LIST_ELEM_HEIGHT;
		this.adj_list_height = SMALL_ADJ_LIST_HEIGHT;
		this.adj_list_width = SMALL_ADJ_LIST_WIDTH;
		this.adj_list_spacing_after_list = SMALL_ADJ_LIST_SPACING_AFTER_LIST;
		this.adj_list_spacing_between_nodes = SMALL_ADJ_LIST_SPACING_BETWEEN_NODES;
		this.size = SMALL_SIZE;
		this.isLarge = false;
		this.highlightCircleL = this.nextIndex++;
		this.highlightCircleAL = this.nextIndex++;
		this.highlightCircleAM = this.nextIndex++;
		this.setup(adj_matrix);
	}

	setup_large() {
		this.allowed = LARGE_ALLOWED;
		this.curve = LARGE_CURVE.map(row => [...row]);
		this.x_pos_logical = [...LARGE_X_POS_LOGICAL];
		this.y_pos_logical = [...LARGE_Y_POS_LOGICAL];
		this.adj_matrix_x_start = LARGE_ADJ_MATRIX_X_START;
		this.adj_matrix_y_start = LARGE_ADJ_MATRIX_Y_START;
		this.adj_matrix_width = LARGE_ADJ_MATRIX_WIDTH;
		this.adj_matrix_height = LARGE_ADJ_MATRIX_HEIGHT;
		this.adj_list_x_start = LARGE_ADJ_LIST_X_START;
		this.adj_list_y_start = LARGE_ADJ_LIST_Y_START;
		this.adj_list_elem_width = LARGE_ADJ_LIST_ELEM_WIDTH;
		this.adj_list_elem_height = LARGE_ADJ_LIST_ELEM_HEIGHT;
		this.adj_list_height = LARGE_ADJ_LIST_HEIGHT;
		this.adj_list_width = LARGE_ADJ_LIST_WIDTH;
		this.adj_list_spacing_after_list = LARGE_ADJ_LIST_SPACING_AFTER_LIST;
		this.adj_list_spacing_between_nodes = LARGE_ADJ_LIST_SPACING_BETWEEN_NODES;
		this.size = LARGE_SIZE;
		this.isLarge = true;
		this.highlightCircleL = this.nextIndex++;
		this.highlightCircleAL = this.nextIndex++;
		this.highlightCircleAM = this.nextIndex++;
		this.setup(LARGE_ADJ_LIST);
	}

	ensureConnected() {
		const parent = Array.from({ length: this.size }, (_, i) => i);
		const rank = new Array(this.size).fill(0);

		const find = (x) => {
			if (parent[x] !== x) parent[x] = find(parent[x]);
			return parent[x];
		};

		const union = (x, y) => {
			const rx = find(x),
				ry = find(y);
			if (rx === ry) return;
			if (rank[rx] < rank[ry]) parent[rx] = ry;
			else if (rank[rx] > rank[ry]) parent[ry] = rx;
			else {
				parent[ry] = rx;
				rank[rx]++;
			}
		};

		for (let i = 0; i < this.size; i++) {
			for (let j = i + 1; j < this.size; j++) {
				if (this.adj_matrix[i][j] >= 0 || this.adj_matrix[j][i] >= 0) {
					union(i, j);
				}
			}
		}

		const componentMap = {};
		for (let i = 0; i < this.size; i++) {
			const root = find(i);
			if (!componentMap[root]) componentMap[root] = [];
			componentMap[root].push(i);
		}
		const components = Object.values(componentMap);
		if (components.length <= 1) return;

		let merged = [...components[0]];
		for (let c = 1; c < components.length; c++) {
			const comp = components[c];
			let added = false;

			for (const i of merged) {
				for (const j of comp) {
					let from = i,
						to = j;
					if (this.directed && this.isDAG && from > to) [from, to] = [to, from];
					if (this.allowed[from][to]) {
						const weight = this.showEdgeCosts
							? Math.floor(Math.random() * 9) + 1
							: 1;
						this.adj_matrix[from][to] = weight;
						if (!this.directed) this.adj_matrix[to][from] = weight;
						added = true;
						break;
					}
				}
				if (added) break;
			}

			if (!added) {
				let from = merged[0],
					to = comp[0];
				if (this.directed && this.isDAG && from > to) [from, to] = [to, from];
				const weight = this.showEdgeCosts ? Math.floor(Math.random() * 9) + 1 : 1;
				this.adj_matrix[from][to] = weight;
				if (!this.directed) this.adj_matrix[to][from] = weight;
			}

			merged = merged.concat(comp);
		}
	}

	adjustCurveForDirectedEdges(curve, bidirectional) {
		if (!this.directed || !bidirectional || Math.abs(curve) > 0.01) {
			return curve;
		} else {
			return 0.1;
		}
	}

	setup(adj_matrix) {
		this.commands = [];
		this.circleID = new Array(this.size);

		for (let i = 0; i < this.size; i++) {
			const hasPresetVertex = adj_matrix?.[i]?.some(value => value !== -1);
			if (!adj_matrix || hasPresetVertex) {
				// For random generation, create all vertices. For preset graphs, only create active ones.
				this.circleID[i] = this.nextIndex++;
				this.cmd(
					act.createCircle,
					this.circleID[i],
					this.toStr(i),
					this.x_pos_logical[i],
					this.y_pos_logical[i],
				);
				this.cmd(act.setTextColor, this.circleID[i], VERTEX_INDEX_COLOR, 0);
				this.cmd(act.setLayer, this.circleID[i], 1);
			} else {
				this.circleID[i] = null; // No circle for this node
			}
		}

		if (adj_matrix) {
			this.adj_matrix = adj_matrix.map(row => [...row]);
			this.adj_matrixID = new Array(this.size);
			for (let i = 0; i < this.size; i++) {
				this.adj_matrixID[i] = new Array(this.size);
				for (let j = 0; j < this.size; j++) {
					this.adj_matrixID[i][j] = this.nextIndex++;
				}
			}
			this.buildEdges();
		} else {
			this.adj_matrix = new Array(this.size);
			this.adj_matrixID = new Array(this.size);
			for (let i = 0; i < this.size; i++) {
				this.adj_matrix[i] = new Array(this.size);
				this.adj_matrixID[i] = new Array(this.size);
			}

			let edgePercent;
			if (this.size === SMALL_SIZE) {
				if (this.directed) {
					edgePercent = 0.4;
				} else {
					edgePercent = 0.5;
				}
			} else {
				if (this.directed) {
					edgePercent = 0.35;
				} else {
					edgePercent = 0.6;
				}
			}

			if (this.directed) {
				for (let i = 0; i < this.size; i++) {
					for (let j = 0; j < this.size; j++) {
						this.adj_matrixID[i][j] = this.nextIndex++;
						if (
							this.allowed[i][j] &&
							Math.random() <= edgePercent &&
							(i < j ||
								Math.abs(this.curve[i][j]) < 0.01 ||
								this.adj_matrixID[j][i] === -1) &&
							(!this.isDAG || i < j)
						) {
							if (this.showEdgeCosts) {
								this.adj_matrix[i][j] = Math.floor(Math.random() * 9) + 1;
							} else {
								this.adj_matrix[i][j] = 1;
							}
						} else {
							this.adj_matrix[i][j] = -1;
						}
					}
				}
				this.ensureConnected();
				this.buildEdges();
			} else {
				for (let i = 0; i < this.size; i++) {
					for (let j = i + 1; j < this.size; j++) {
						this.adj_matrixID[i][j] = this.nextIndex++;
						this.adj_matrixID[j][i] = this.nextIndex++;

						if (this.allowed[i][j] && Math.random() <= edgePercent) {
							if (this.showEdgeCosts) {
								this.adj_matrix[i][j] = Math.floor(Math.random() * 9) + 1;
							} else {
								this.adj_matrix[i][j] = 1;
							}
							this.adj_matrix[j][i] = this.adj_matrix[i][j];
							let edgeLabel;
							if (this.showEdgeCosts) {
								edgeLabel = String(this.adj_matrix[i][j]);
							} else {
								edgeLabel = '';
							}
							this.cmd(
								act.connect,
								this.circleID[i],
								this.circleID[j],
								EDGE_COLOR,
								this.curve[i][j],
								0,
								edgeLabel,
							);
						} else {
							this.adj_matrix[i][j] = -1;
							this.adj_matrix[j][i] = -1;
						}
					}
				}

				this.ensureConnected();
				this.buildEdges();

				for (let i = 0; i < this.size; i++) {
					this.adj_matrix[i][i] = -1;
				}
			}
		}

		// Create Adj List

		this.buildAdjList();

		// Create Adj Matrix

		this.buildAdjMatrix();

		this.animationManager.setAllLayers([0, 32, this.currentLayer]);
		this.animationManager.startNewAnimation(this.commands);
		this.animationManager.skipForward();
		this.animationManager.clearHistory();
		this.clearHistory();
	}

	resetAll() {}

	buildAdjMatrix() {
		// Build compacted list of active vertex indices
		const activeIndices = [];
		for (let i = 0; i < this.size; i++) {
			if (this.circleID[i] !== null) activeIndices.push(i);
		}
		const n = activeIndices.length;
		this._lastActiveIndices = [...activeIndices];
		this._vertexToAdjMatrixRow = {};

		this.adj_matrix_index_x = new Array(this.size).fill(null);
		this.adj_matrix_index_y = new Array(this.size).fill(null);
		// Initialize adj_matrixID for all slots
		for (let i = 0; i < this.size; i++) {
			if (!this.adj_matrixID[i]) this.adj_matrixID[i] = new Array(this.size);
		}

		for (let ri = 0; ri < n; ri++) {
			const i = activeIndices[ri];
			this._vertexToAdjMatrixRow[i] = ri;
			this.adj_matrix_index_x[i] = this.nextIndex++;
			this.adj_matrix_index_y[i] = this.nextIndex++;
			this.cmd(
				act.createLabel,
				this.adj_matrix_index_x[i],
				this.toStr(i),
				this.adj_matrix_x_start + ri * this.adj_matrix_width,
				this.adj_matrix_y_start - this.adj_matrix_height,
			);
			this.cmd(act.setForegroundColor, this.adj_matrix_index_x[i], VERTEX_INDEX_COLOR);
			this.cmd(
				act.createLabel,
				this.adj_matrix_index_y[i],
				this.toStr(i),
				this.adj_matrix_x_start - this.adj_matrix_width,
				this.adj_matrix_y_start + ri * this.adj_matrix_height,
			);
			this.cmd(act.setForegroundColor, this.adj_matrix_index_y[i], VERTEX_INDEX_COLOR);
			this.cmd(act.setLayer, this.adj_matrix_index_x[i], 3);
			this.cmd(act.setLayer, this.adj_matrix_index_y[i], 3);

			for (let rj = 0; rj < n; rj++) {
				const j = activeIndices[rj];
				this.adj_matrixID[i][j] = this.nextIndex++;
				let lab;
				if (this.adj_matrix[i][j] < 0) {
					lab = '';
				} else {
					lab = String(this.adj_matrix[i][j]);
				}
				this.cmd(
					act.createRectangle,
					this.adj_matrixID[i][j],
					lab,
					this.adj_matrix_width,
					this.adj_matrix_height,
					this.adj_matrix_x_start + rj * this.adj_matrix_width,
					this.adj_matrix_y_start + ri * this.adj_matrix_height,
				);
				this.cmd(act.setLayer, this.adj_matrixID[i][j], 3);
			}
		}
	}

	removeAdjList() {
		if (!this.adj_list_list) return;
		for (let i = 0; i < this.adj_list_list.length; i++) {
			if (this.adj_list_list[i] == null) continue;
			this.cmd(act.delete, this.adj_list_list[i]);
			if (this.adj_list_index[i] != null) {
				this.cmd(act.delete, this.adj_list_index[i]);
			}
			if (this.adj_list_edges[i]) {
				for (let j = 0; j < this.adj_list_edges[i].length; j++) {
					if (this.adj_list_edges[i][j] != null) {
						this.cmd(act.delete, this.adj_list_edges[i][j]);
					}
				}
			}
		}
	}

	removeAdjMatrix() {
		if (!this.adj_matrix_index_x) return;
		for (let i = 0; i < this.adj_matrix_index_x.length; i++) {
			if (this.adj_matrix_index_x[i] == null) continue;
			this.cmd(act.delete, this.adj_matrix_index_x[i]);
			this.cmd(act.delete, this.adj_matrix_index_y[i]);
		}
		if (!this._lastActiveIndices) return;
		for (const i of this._lastActiveIndices) {
			if (!this.adj_matrixID[i]) continue;
			for (const j of this._lastActiveIndices) {
				if (this.adj_matrixID[i][j] != null) {
					this.cmd(act.delete, this.adj_matrixID[i][j]);
				}
			}
		}
	}

	rebuildAllRepresentations() {
		this.clearEdges();
		this.removeAdjList();
		this.removeAdjMatrix();
		this.buildEdges();
		this.buildAdjList();
		this.buildAdjMatrix();
	}

	buildAdjList() {
		this.adj_list_index = new Array(this.size);
		this.adj_list_list = new Array(this.size);
		this.adj_list_edges = new Array(this.size);

		this._vertexToAdjListRow = {};
		let row = 0;
		for (let i = 0; i < this.size; i++) {
			if (this.circleID[i] === null) {
				this.adj_list_list[i] = null;
				this.adj_list_index[i] = null;
				this.adj_list_edges[i] = new Array(this.size);
				continue;
			}
			this.adj_list_edges[i] = new Array(this.size);
			this.adj_list_index[i] = this.nextIndex++;
			this.adj_list_list[i] = this.nextIndex++;
			this.cmd(
				act.createRectangle,
				this.adj_list_list[i],
				'',
				this.adj_list_width,
				this.adj_list_height,
				this.adj_list_x_start,
				this.adj_list_y_start + row * this.adj_list_height,
			);
			this.cmd(act.setLayer, this.adj_list_list[i], 2);
			this.cmd(
				act.createLabel,
				this.adj_list_index[i],
				this.toStr(i),
				this.adj_list_x_start - this.adj_list_width,
				this.adj_list_y_start + row * this.adj_list_height,
			);
			this.cmd(act.setForegroundColor, this.adj_list_index[i], VERTEX_INDEX_COLOR);
			this.cmd(act.setLayer, this.adj_list_index[i], 2);
			let lastElem = this.adj_list_list[i];
			let nextXPos =
				this.adj_list_x_start +
				this.adj_list_width +
				this.adj_list_spacing_after_list +
				this.adj_list_spacing_between_nodes;
			let hasEdges = false;
			for (let j = 0; j < this.size; j++) {
				if (this.circleID[j] === null) continue;
				if (i !== j && this.adj_matrix[i][j] >= 0) {
					hasEdges = true;
					this.adj_list_edges[i][j] = this.nextIndex++;
					this.cmd(
						act.createLinkedListNode,
						this.adj_list_edges[i][j],
						[this.toStr(j), this.adj_matrix[i][j]],
						this.adj_list_elem_width,
						this.adj_list_elem_height,
						nextXPos,
						this.adj_list_y_start + row * this.adj_list_height,
						0.25,
						0,
						1,
					);
					this.cmd(act.setNull, this.adj_list_edges[i][j], 1);
					this.cmd(act.setTextColor, this.adj_list_edges[i][j], VERTEX_INDEX_COLOR, 0);
					this.cmd(act.setLayer, this.adj_list_edges[i][j], 2);

					nextXPos =
						nextXPos + this.adj_list_elem_width + this.adj_list_spacing_between_nodes;
					this.cmd(act.connect, lastElem, this.adj_list_edges[i][j]);
					this.cmd(act.setNull, lastElem, 0);
					lastElem = this.adj_list_edges[i][j];
				}
			}
			if (!hasEdges) {
				this.cmd(act.setNull, this.adj_list_list[i], 1);
			}
			this._vertexToAdjListRow[i] = row;
			row++;
		}
	}

	// --- Dynamic graph editing methods ---

	getActiveVertices() {
		const active = [];
		for (let i = 0; i < this.size; i++) {
			if (this.circleID[i] !== null) active.push(i);
		}
		return active;
	}

	findLargestAngularGap() {
		const centerX = 700;
		const centerY = 250;
		const active = this.getActiveVertices();
		const n = active.length;

		if (n === 0) {
			return { angle: -Math.PI / 2, radius: 0 };
		}

		if (n === 1) {
			const i = active[0];
			const dx = this.x_pos_logical[i] - centerX;
			const dy = this.y_pos_logical[i] - centerY;
			if (Math.abs(dx) < 1 && Math.abs(dy) < 1) {
				return { angle: -Math.PI / 2, radius: Math.min(200, 40 + 2 * 22) };
			}
			const existingAngle = Math.atan2(dy, dx);
			const radius = Math.sqrt(dx * dx + dy * dy);
			return { angle: existingAngle + Math.PI, radius };
		}

		const angles = active.map(i => {
			return Math.atan2(
				this.y_pos_logical[i] - centerY,
				this.x_pos_logical[i] - centerX,
			);
		});
		angles.sort((a, b) => a - b);

		let maxGap = 0;
		let bestMidAngle = 0;
		for (let k = 0; k < angles.length; k++) {
			const next = (k + 1) % angles.length;
			let gap = angles[next] - angles[k];
			if (gap <= 0) gap += 2 * Math.PI;
			if (gap > maxGap) {
				maxGap = gap;
				bestMidAngle = angles[k] + gap / 2;
			}
		}

		let totalRadius = 0;
		for (const i of active) {
			const dx = this.x_pos_logical[i] - centerX;
			const dy = this.y_pos_logical[i] - centerY;
			totalRadius += Math.sqrt(dx * dx + dy * dy);
		}
		const avgRadius = totalRadius / n;
		const radius = avgRadius > 0 ? avgRadius : Math.min(200, 40 + (n + 1) * 22);

		return { angle: bestMidAngle, radius };
	}

	computeCircularLayout() {
		const active = this.getActiveVertices();
		const n = active.length;
		if (n === 0) return;

		const centerX = 700;
		const centerY = 250;
		const radius = n === 1 ? 0 : Math.min(200, 40 + n * 22);

		for (let k = 0; k < n; k++) {
			const angle = (2 * Math.PI * k) / n - Math.PI / 2;
			const i = active[k];
			this.x_pos_logical[i] = Math.round(centerX + radius * Math.cos(angle));
			this.y_pos_logical[i] = Math.round(centerY + radius * Math.sin(angle));
		}
	}

	repositionGraph() {
		for (let i = 0; i < this.size; i++) {
			if (this.circleID[i] !== null) {
				this.cmd(act.move, this.circleID[i], this.x_pos_logical[i], this.y_pos_logical[i]);
			}
		}
	}

	ensureArraySize(maxIndex) {
		const newSize = maxIndex + 1;
		// Expand adj_matrix
		while (this.adj_matrix.length < newSize) {
			this.adj_matrix.push(new Array(this.adj_matrix.length > 0 ? this.adj_matrix[0].length : newSize).fill(-1));
		}
		for (let i = 0; i < this.adj_matrix.length; i++) {
			while (this.adj_matrix[i].length < newSize) {
				this.adj_matrix[i].push(-1);
			}
		}
		// Expand adj_matrixID
		if (!this.adj_matrixID) this.adj_matrixID = [];
		while (this.adj_matrixID.length < newSize) {
			this.adj_matrixID.push(new Array(newSize).fill(null));
		}
		for (let i = 0; i < this.adj_matrixID.length; i++) {
			while (this.adj_matrixID[i].length < newSize) {
				this.adj_matrixID[i].push(null);
			}
		}
		// Expand curve array
		if (!this.curve) this.curve = [];
		while (this.curve.length < newSize) {
			this.curve.push(new Array(newSize).fill(0));
		}
		for (let i = 0; i < this.curve.length; i++) {
			while (this.curve[i].length < newSize) {
				this.curve[i].push(0);
			}
		}
		// Expand position arrays
		while (this.x_pos_logical.length < newSize) {
			this.x_pos_logical.push(0);
		}
		while (this.y_pos_logical.length < newSize) {
			this.y_pos_logical.push(0);
		}
		// Expand circleID
		while (this.circleID.length < newSize) {
			this.circleID.push(null);
		}
	}

	addVertex(label) {
		this.commands = [];
		const index = label.charCodeAt(0) - 65;

		if (index < 0 || index > 25) return this.commands;
		if (this.circleID[index] !== undefined && this.circleID[index] !== null) return this.commands;

		this.ensureArraySize(index);
		this.size = Math.max(this.size, index + 1);

		// Initialize row/column to -1
		for (let j = 0; j < this.size; j++) {
			this.adj_matrix[index][j] = -1;
			this.adj_matrix[j][index] = -1;
		}

		// Create visual circle
		this.circleID[index] = this.nextIndex++;

		// Place new vertex in largest angular gap (existing vertices stay put)
		const { angle, radius } = this.findLargestAngularGap();
		const centerX = 700;
		const centerY = 250;
		this.x_pos_logical[index] = Math.round(centerX + radius * Math.cos(angle));
		this.y_pos_logical[index] = Math.round(centerY + radius * Math.sin(angle));

		this.cmd(
			act.createCircle,
			this.circleID[index],
			this.toStr(index),
			this.x_pos_logical[index],
			this.y_pos_logical[index],
		);
		this.cmd(act.setTextColor, this.circleID[index], VERTEX_INDEX_COLOR, 0);
		this.cmd(act.setLayer, this.circleID[index], 1);
		this.cmd(act.step);

		this.rebuildAllRepresentations();

		return this.commands;
	}

	removeVertex(label) {
		this.commands = [];
		const index = label.charCodeAt(0) - 65;

		if (index < 0 || index >= this.size) return this.commands;
		if (this.circleID[index] === null || this.circleID[index] === undefined) return this.commands;

		// Remove all edges involving this vertex
		for (let j = 0; j < this.size; j++) {
			this.adj_matrix[index][j] = -1;
			if (j < this.adj_matrix.length && index < this.adj_matrix[j].length) {
				this.adj_matrix[j][index] = -1;
			}
		}

		// Tear down representations
		this.clearEdges();
		this.removeAdjList();
		this.removeAdjMatrix();

		// Delete vertex circle
		this.cmd(act.delete, this.circleID[index]);
		this.circleID[index] = null;
		this.cmd(act.step);

		// Rebuild representations (remaining vertices stay in place)
		this.buildEdges();
		this.buildAdjList();
		this.buildAdjMatrix();

		return this.commands;
	}

	addEdge(fromLabel, toLabel, weight) {
		this.commands = [];
		const i = fromLabel.charCodeAt(0) - 65;
		const j = toLabel.charCodeAt(0) - 65;
		weight = weight || 1;

		if (this.circleID[i] == null || this.circleID[j] == null) return this.commands;
		if (i === j) return this.commands;
		if (this.adj_matrix[i][j] >= 0) return this.commands;

		this.adj_matrix[i][j] = weight;
		if (!this.directed) {
			this.adj_matrix[j][i] = weight;
		}

		this.rebuildAllRepresentations();
		this.cmd(act.step);

		return this.commands;
	}

	removeEdge(fromLabel, toLabel) {
		this.commands = [];
		const i = fromLabel.charCodeAt(0) - 65;
		const j = toLabel.charCodeAt(0) - 65;

		if (this.circleID[i] == null || this.circleID[j] == null) return this.commands;
		if (this.adj_matrix[i][j] < 0) return this.commands;

		this.adj_matrix[i][j] = -1;
		if (!this.directed) {
			this.adj_matrix[j][i] = -1;
		}

		this.rebuildAllRepresentations();
		this.cmd(act.step);

		return this.commands;
	}

	// Should be overwritten in child
	reset() {
		throw new Error('reset() should be implemented in child');
	}

	toStr(vertex) {
		return String.fromCharCode(65 + vertex);
	}

	cancelCallback() {
		if (this.animationManager.currentlyAnimating) {
			this.animationManager.skipForward();
		}
		this.isTraversalRunning = false;
		this.cancelButton.disabled = true;
		this.animationManager.resetAll();
		this.setup(this.adj_matrix);
	}

	enableUI() {
		for (const control of this.controls) {
			if (
				control === this.defaultGraphButton &&
				(this.directed || this.isLarge || this.adj_matrix === this.defaultEdges)
			) {
				control.disabled = true;
			} else {
				control.disabled = false;
			}
		}
		if (this.cancelButton) {
			this.cancelButton.disabled = !this.isTraversalRunning;
		}
	}

	disableUI() {
		for (const control of this.controls) {
			control.disabled = true;
		}
		if (this.cancelButton) {
			this.cancelButton.disabled = !this.isTraversalRunning;
		}
	}
}
