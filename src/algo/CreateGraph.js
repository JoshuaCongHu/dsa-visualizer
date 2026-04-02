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

import {
	addControlToAlgorithmBar,
	addDivisorToAlgorithmBar,
	addGroupToAlgorithmBar,
	addLabelToAlgorithmBar,
	addRadioButtonGroupToAlgorithmBar,
} from './Algorithm.js';
import { BFS_DFS_ADJ_LIST } from './util/GraphValues';
import Graph from './Graph.js';
import { act } from '../anim/AnimationMain';

const INFO_MSG_X = 25;
const INFO_MSG_Y = 15;

let adjMatrix =
	//A     B      C     D      E     F      G      H
	/*A*/ [
		[0, 1, 0, 1, 0, 0, 0, 0],
		/*B*/ [1, 0, 0, 0, 0, 0, 0, 0],
		/*C*/ [0, 0, 0, 0, 0, 0, 0, 0],
		/*D*/ [1, 0, 0, 0, 0, 0, 0, 0],
		/*E*/ [0, 0, 0, 0, 0, 0, 0, 0],
		/*F*/ [0, 0, 0, 0, 0, 0, 0, 0],
		/*G*/ [0, 0, 0, 0, 0, 0, 0, 0],
		/*H*/ [0, 0, 0, 0, 0, 0, 0, 0],
	].map(row => row.map(x => x || -1));

export default class CreateGraph extends Graph {
	constructor(am, w, h) {
		super(am, w, h, BFS_DFS_ADJ_LIST);
		this.addControls();
	}

	addControls() {
		addLabelToAlgorithmBar('Adjacency List: ');
		const verticalGroup = addGroupToAlgorithmBar(false);
		const horizontalGroup = addGroupToAlgorithmBar(true, verticalGroup);

		// List text field
		this.listField = document.createElement('textarea');
		this.listField.classList.add('scrollable-textbox');
		this.listField.style.width = '200px';
		this.listField.style.height = '100px';
		this.listField.value = 'A->B,C,D,E\nB->A,G\nC->A\nD->A,F\nE->A,G\nF->D,G\nG->B,E,F,H\nH->G';

		// Allow A-Z (not just A-H)
		this.listField.addEventListener('input', function () {
			const allowedPattern = /^[A-Z->,\n]*$/;
			if (!allowedPattern.test(this.value)) {
				const cursorPosition = this.selectionStart - 1;
				this.value = this.value.replace(/[^A-Z->,\n]/g, '');
				this.setSelectionRange(cursorPosition, cursorPosition);
			}
		});

		horizontalGroup.appendChild(this.listField);
		addDivisorToAlgorithmBar();
		this.runButton = addControlToAlgorithmBar('Button', 'Run');
		this.runButton.onclick = this.startCallback.bind(this);

		addDivisorToAlgorithmBar();

		// Vertex controls
		addLabelToAlgorithmBar('Vertex: ');
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
		addLabelToAlgorithmBar('From: ');
		this.fromField = addControlToAlgorithmBar('Text', '');
		this.fromField.size = 2;
		this.fromField.style.textAlign = 'center';
		this.controls.push(this.fromField);

		addLabelToAlgorithmBar('To: ');
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

		// Representation radio buttons (not in this.controls so they stay enabled)
		const radioButtonList = addRadioButtonGroupToAlgorithmBar(
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

	startCallback() {
		if (this.listField.value !== '') {
			// Parsing the adjacency list from the input
			const adjacencyList = this.listField.value.split('\n').map(line => {
				let [node, neighbors] = line.split('->');
				node = node.trim();
				neighbors = neighbors ? neighbors.split(',') : [];
				return { node: node.trim(), neighbors: neighbors.map(n => n.trim()) };
			});
			this.updateAdjMatrix(adjacencyList);
			this.smallGraphCallback(adjMatrix);
		} else {
			this.shake(this.runButton); // Shake button if no input
		}
	}

	updateAdjMatrix(adjacencyList) {
		// Find the maximum vertex index to size the matrix dynamically
		let maxIndex = 7; // minimum 8 vertices (A-H)
		adjacencyList.forEach(({ node, neighbors }) => {
			maxIndex = Math.max(maxIndex, node.charCodeAt(0) - 65);
			neighbors.forEach(n => {
				maxIndex = Math.max(maxIndex, n.charCodeAt(0) - 65);
			});
		});
		const size = maxIndex + 1;
		adjMatrix = Array.from({ length: size }, () => new Array(size).fill(-1));

		// Update adjMatrix based on the adjacency list
		adjacencyList.forEach(({ node, neighbors }) => {
			const nodeIdx = node.charCodeAt(0) - 65;
			neighbors.forEach(neighbor => {
				const neighborIdx = neighbor.charCodeAt(0) - 65;
				adjMatrix[nodeIdx][neighborIdx] = 1;
				adjMatrix[neighborIdx][nodeIdx] = 1;
			});
			adjMatrix[nodeIdx][nodeIdx] = 1; // self-loop to enable disconnected graphs
		});
	}

	setup(adjMatrix) {
		super.setup(adjMatrix);
		// Clear self-loop markers used to indicate vertex existence
		for (let i = 0; i < this.size; i++) {
			if (this.adj_matrix[i]) this.adj_matrix[i][i] = -1;
		}
		this.commands = [];
		this.messageID = [];

		this.visited = [];

		this.stackID = [];
		this.listID = [];
		this.visitedID = [];

		this.infoLabelID = this.nextIndex++;
		this.cmd(act.createLabel, this.infoLabelID, '', INFO_MSG_X, INFO_MSG_Y, 0);

		this.animationManager.setAllLayers([0, 32, this.currentLayer]);
		this.animationManager.startNewAnimation(this.commands);
		this.animationManager.skipForward();
		this.animationManager.clearHistory();
		this.lastIndex = this.nextIndex;
	}

	reset() {
		this.nextIndex = this.lastIndex;
		this.listID = [];
		this.visitedID = [];
		this.messageID = [];
	}

	clear() {
		for (let i = 0; i < this.size; i++) {
			if (this.circleID[i] == null) continue;
			this.cmd(act.setBackgroundColor, this.circleID[i], '#FFFFFF');
			this.visited[i] = false;
		}
		for (let i = 0; i < this.listID.length; i++) {
			this.cmd(act.delete, this.listID[i]);
		}
		this.listID = [];
		for (let i = 0; i < this.visitedID.length; i++) {
			this.cmd(act.delete, this.visitedID[i]);
		}
		this.visitedID = [];
		if (this.messageID != null) {
			for (let i = 0; i < this.messageID.length; i++) {
				this.cmd(act.delete, this.messageID[i]);
			}
		}
		this.messageID = [];
		this.cmd(act.setText, this.infoLabelID, '');
	}

	addVertexCallback() {
		const label = this.vertexField.value.toUpperCase().trim();
		if (label.length === 1 && label >= 'A' && label <= 'Z') {
			this.vertexField.value = '';
			this.implementAction(this.addVertex.bind(this), label);
			this.syncTextarea();
		} else {
			this.shake(this.addVertexButton);
		}
	}

	removeVertexCallback() {
		const label = this.vertexField.value.toUpperCase().trim();
		const index = label.charCodeAt(0) - 65;
		if (label.length === 1 && this.circleID[index] != null) {
			this.vertexField.value = '';
			this.implementAction(this.removeVertex.bind(this), label);
			this.syncTextarea();
		} else {
			this.shake(this.removeVertexButton);
		}
	}

	addEdgeCallback() {
		const from = this.fromField.value.toUpperCase().trim();
		const to = this.toField.value.toUpperCase().trim();
		if (from.length === 1 && to.length === 1 && from >= 'A' && from <= 'Z' && to >= 'A' && to <= 'Z') {
			this.fromField.value = '';
			this.toField.value = '';
			this.implementAction(this.addEdge.bind(this), from, to, 1);
			this.syncTextarea();
		} else {
			this.shake(this.addEdgeButton);
		}
	}

	removeEdgeCallback() {
		const from = this.fromField.value.toUpperCase().trim();
		const to = this.toField.value.toUpperCase().trim();
		if (from.length === 1 && to.length === 1 && from >= 'A' && from <= 'Z' && to >= 'A' && to <= 'Z') {
			this.fromField.value = '';
			this.toField.value = '';
			this.implementAction(this.removeEdge.bind(this), from, to);
			this.syncTextarea();
		} else {
			this.shake(this.removeEdgeButton);
		}
	}

	syncTextarea() {
		const lines = [];
		for (let i = 0; i < this.size; i++) {
			if (this.circleID[i] == null) continue;
			const neighbors = [];
			for (let j = 0; j < this.size; j++) {
				if (this.circleID[j] == null) continue;
				if (i !== j && this.adj_matrix[i][j] >= 0) {
					neighbors.push(this.toStr(j));
				}
			}
			if (neighbors.length > 0) {
				lines.push(this.toStr(i) + '->' + neighbors.join(','));
			} else {
				lines.push(this.toStr(i));
			}
		}
		this.listField.value = lines.join('\n');
	}

	//overloaded Callback for use with CreateGraph class
	smallGraphCallback(adj_matrix) {
		this.animationManager.resetAll();
		// Build a truncated matrix for the base 8-vertex setup
		const baseSize = 8;
		const baseMatrix = adj_matrix.slice(0, baseSize).map(row => row.slice(0, baseSize));
		super.setup_small(baseMatrix);
		// If the full matrix has vertices beyond the base 8, add them dynamically
		if (adj_matrix.length > baseSize) {
			for (let i = baseSize; i < adj_matrix.length; i++) {
				if (adj_matrix[i].some(value => value !== -1)) {
					const label = this.toStr(i);
					const cmds = this.addVertex(label);
					this.animationManager.startNewAnimation(cmds);
					this.animationManager.skipForward();
				}
			}
			// Now add edges involving the extra vertices
			for (let i = 0; i < adj_matrix.length; i++) {
				for (let j = 0; j < adj_matrix[i].length; j++) {
					if (adj_matrix[i][j] >= 0 && i !== j) {
						if (i >= baseSize || j >= baseSize) {
							// Only add edges that involve at least one extra vertex
							if (this.adj_matrix[i] && this.adj_matrix[i][j] < 0) {
								const cmds = this.addEdge(this.toStr(i), this.toStr(j), 1);
								this.animationManager.startNewAnimation(cmds);
								this.animationManager.skipForward();
							}
						}
					}
				}
			}
			this.animationManager.clearHistory();
		}
	}
}
