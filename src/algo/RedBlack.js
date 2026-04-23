// Copyright 2011 David Galles, University of San Francisco. All rights reserved.
// Ported to ES6 class syntax for UB StructStudio.
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

import Algorithm, {
	addControlToAlgorithmBar,
	addDivisorToAlgorithmBar,
	addRadioButtonGroupToAlgorithmBar,
	addCheckboxToAlgorithmBar,
} from './Algorithm.js';
import { act } from '../anim/AnimationMain';

const FOREGROUND_RED = '#FF0000';
const BACKGROUND_RED = '#FFAAAA';
const FOREGROUND_BLACK = '#000000';
const BACKGROUND_BLACK = '#AAAAAA';
const BACKGROUND_DBL_BLACK = '#777777';
const LINK_COLOR = '#000000';
const HIGHLIGHT_COLOR = '#007700';
const PRINT_COLOR = '#007700';

const WIDTH_DELTA = 50;
const HEIGHT_DELTA = 50;
const STARTING_Y = 50;
const FIRST_PRINT_POS_X = 50;
const PRINT_VERTICAL_GAP = 20;
const PRINT_HORIZONTAL_GAP = 50;
const EXPLANITORY_TEXT_X = 10;
const EXPLANITORY_TEXT_Y = 10;
const NODE_SIZE = 30;

export default class RedBlackTree extends Algorithm {
	constructor(am, w, h) {
		super(am, w, h);
		this.first_print_pos_x = FIRST_PRINT_POS_X;
		this.first_print_pos_y = STARTING_Y;
		this.print_max = w - 10;
		this.startingX = w / 2;
		this.addControls();
		this.nextIndex = 1;
		this.commands = [];
		this.cmd(act.createLabel, 0, '', EXPLANITORY_TEXT_X, EXPLANITORY_TEXT_Y, 0);
		this.animationManager.startNewAnimation(this.commands);
		this.animationManager.skipForward();
		this.animationManager.clearHistory();
	}

	addControls() {
		this.controls = [];

		this.insertField = addControlToAlgorithmBar('Text', '');
		this.insertField.style.textAlign = 'center';
		this.insertField.onkeydown = this.returnSubmit(
			this.insertField,
			this.insertCallback.bind(this),
			4,
			false,
		);
		this.controls.push(this.insertField);

		this.insertButton = addControlToAlgorithmBar('Button', 'Insert');
		this.insertButton.onclick = this.insertCallback.bind(this);
		this.controls.push(this.insertButton);

		addDivisorToAlgorithmBar();

		this.deleteField = addControlToAlgorithmBar('Text', '');
		this.deleteField.style.textAlign = 'center';
		this.deleteField.onkeydown = this.returnSubmit(
			this.deleteField,
			this.deleteCallback.bind(this),
			4,
			false,
		);
		this.controls.push(this.deleteField);

		this.deleteButton = addControlToAlgorithmBar('Button', 'Delete');
		this.deleteButton.onclick = this.deleteCallback.bind(this);
		this.controls.push(this.deleteButton);

		addDivisorToAlgorithmBar();

		this.findField = addControlToAlgorithmBar('Text', '');
		this.findField.style.textAlign = 'center';
		this.findField.onkeydown = this.returnSubmit(
			this.findField,
			this.findCallback.bind(this),
			4,
			false,
		);
		this.controls.push(this.findField);

		this.findButton = addControlToAlgorithmBar('Button', 'Find');
		this.findButton.onclick = this.findCallback.bind(this);
		this.controls.push(this.findButton);

		addDivisorToAlgorithmBar();

		this.printButton = addControlToAlgorithmBar('Button', 'Print');
		this.printButton.onclick = this.printCallback.bind(this);
		this.controls.push(this.printButton);

		addDivisorToAlgorithmBar();

		this.showNullLeavesCheckbox = addCheckboxToAlgorithmBar('Show Null Leaves', false);
		this.showNullLeavesCheckbox.onclick = this.showNullLeavesCallback.bind(this);
		this.controls.push(this.showNullLeavesCheckbox);

		addDivisorToAlgorithmBar();

		this.randomButton = addControlToAlgorithmBar('Button', 'Random');
		this.randomButton.onclick = this.randomCallback.bind(this);
		this.controls.push(this.randomButton);

		addDivisorToAlgorithmBar();

		this.clearButton = addControlToAlgorithmBar('Button', 'Clear');
		this.clearButton.onclick = this.clearCallback.bind(this);
		this.controls.push(this.clearButton);

		addDivisorToAlgorithmBar();

		const predSuccButtonList = addRadioButtonGroupToAlgorithmBar(
			['Predecessor', 'Successor'],
			'Predecessor/Successor',
		);
		this.predButton = predSuccButtonList[0];
		this.succButton = predSuccButtonList[1];
		this.predButton.onclick = () => (this.predSucc = 'pred');
		this.succButton.onclick = () => (this.predSucc = 'succ');
		this.succButton.checked = true;
		this.predSucc = 'succ';

		this.showingNullLeaves = false;
	}

	showNullLeavesCallback() {
		this.showingNullLeaves = this.showNullLeavesCheckbox.checked;
		if (this.showingNullLeaves) {
			this.animationManager.setAllLayers([0, 1]);
		} else {
			this.animationManager.setAllLayers([0]);
		}
	}

	reset() {
		this.nextIndex = 1;
		this.treeRoot = null;
	}

	insertCallback() {
		const val = this.insertField.value;
		if (val !== '') {
			this.insertField.value = '';
			this.implementAction(this.insertElement.bind(this), val);
		} else {
			this.shake(this.insertButton);
		}
	}

	deleteCallback() {
		const val = this.deleteField.value;
		if (val !== '' && this.treeRoot) {
			this.deleteField.value = '';
			this.implementAction(this.deleteElement.bind(this), val);
		} else {
			this.shake(this.deleteButton);
		}
	}

	findCallback() {
		const val = this.findField.value;
		if (val !== '') {
			this.findField.value = '';
			this.implementAction(this.findElement.bind(this), val);
		} else {
			this.shake(this.findButton);
		}
	}

	printCallback() {
		if (this.treeRoot) {
			this.implementAction(this.printTree.bind(this));
		} else {
			this.shake(this.printButton);
		}
	}

	randomCallback() {
		const LOWER_BOUND = 1;
		const UPPER_BOUND = 99;
		const MAX_SIZE = 10;
		const MIN_SIZE = 4;
		const randomSize = Math.floor(Math.random() * (MAX_SIZE - MIN_SIZE + 1)) + MIN_SIZE;

		this.implementAction(this.clear.bind(this));

		for (let i = 0; i < randomSize; i++) {
			this.implementAction(
				this.insertElement.bind(this),
				Math.floor(Math.random() * (UPPER_BOUND - LOWER_BOUND + 1)) + LOWER_BOUND,
			);
			this.animationManager.skipForward();
			this.animationManager.clearHistory();
		}
	}

	clearCallback() {
		this.implementAction(this.clear.bind(this));
	}

	sizeChanged(newWidth, newHeight) {
		this.startingX = newWidth / 2;
		this.canvasWidth = newWidth;
		this.canvasHeight = newHeight;
		this.updatePrintPositions();
	}

	compare(a, b) {
		const numA = parseInt(a);
		const numB = parseInt(b);
		const isNumA = !isNaN(numA);
		const isNumB = !isNaN(numB);
		if (isNumA && isNumB) return numA - numB;
		if (!isNumA && !isNumB) return String(a).localeCompare(String(b));
		return isNumA ? -1 : 1;
	}

	// ─── Insert ──────────────────────────────────────────────────────────────

	insertElement(value) {
		this.commands = [];
		this.highlight(0, 0, 'insert');
		this.cmd(act.setText, 0, 'Inserting ' + value);
		this.unhighlight(0, 0, 'insert');
		this.highlight(2, 0, 'insert');
		this.treeRoot = this.insert(value, this.treeRoot);
		this.unhighlight(2, 0, 'insert');
		this.highlight(4, 0, 'insert');
		this.treeRoot.blackLevel = 1;
		this.fixNodeColor(this.treeRoot);
		this.resizeTree();
		this.unhighlight(4, 0, 'insert');
		this.cmd(act.setText, 0, '');
		return this.commands;
	}

	insert(elem, tree) {
		if (tree == null) {
			this.unhighlight(2, 0, 'insert');
			this.highlight(1, 0, 'insert');
			const id = this.nextIndex++;
			this.cmd(act.createCircle, id, elem, NODE_SIZE, STARTING_Y);
			this.cmd(act.setForegroundColor, id, FOREGROUND_RED);
			this.cmd(act.setBackgroundColor, id, BACKGROUND_RED);
			this.cmd(act.step);
			this.unhighlight(1, 0, 'insert');
			this.highlight(2, 0, 'insert');
			const node = new RedBlackNode(elem, id);
			node.blackLevel = 0; // new nodes are red
			this.attachNullLeaves(node);
			this.fixNodeColor(node);
			return node;
		}

		this.cmd(act.setHighlight, tree.graphicID, 1);

		if (this.compare(elem, tree.data) < 0) {
			this.cmd(act.setText, 0, `${elem} < ${tree.data}, go left`);
			this.cmd(act.step);
			this.cmd(act.setHighlight, tree.graphicID, 0);

			if (tree.left != null && tree.left.phantomLeaf) {
				// replace phantom leaf
				this.cmd(act.delete, tree.left.graphicID);
				tree.left = null;
			}
			if (tree.left == null) {
				const id = this.nextIndex++;
				this.cmd(act.createCircle, id, elem, NODE_SIZE, STARTING_Y);
				this.cmd(act.setForegroundColor, id, FOREGROUND_RED);
				this.cmd(act.setBackgroundColor, id, BACKGROUND_RED);
				this.cmd(act.connect, tree.graphicID, id, LINK_COLOR);
				this.cmd(act.step);
				const node = new RedBlackNode(elem, id);
				node.blackLevel = 0;
				node.parent = tree;
				tree.left = node;
				this.attachNullLeaves(node);
				this.fixNodeColor(node);
			} else {
				tree.left = this.insert(elem, tree.left);
				tree.left.parent = tree;
				this.cmd(act.connect, tree.graphicID, tree.left.graphicID, LINK_COLOR);
			}
		} else if (this.compare(elem, tree.data) > 0) {
			this.cmd(act.setText, 0, `${elem} > ${tree.data}, go right`);
			this.cmd(act.step);
			this.cmd(act.setHighlight, tree.graphicID, 0);

			if (tree.right != null && tree.right.phantomLeaf) {
				this.cmd(act.delete, tree.right.graphicID);
				tree.right = null;
			}
			if (tree.right == null) {
				const id = this.nextIndex++;
				this.cmd(act.createCircle, id, elem, NODE_SIZE, STARTING_Y);
				this.cmd(act.setForegroundColor, id, FOREGROUND_RED);
				this.cmd(act.setBackgroundColor, id, BACKGROUND_RED);
				this.cmd(act.connect, tree.graphicID, id, LINK_COLOR);
				this.cmd(act.step);
				const node = new RedBlackNode(elem, id);
				node.blackLevel = 0;
				node.parent = tree;
				tree.right = node;
				this.attachNullLeaves(node);
				this.fixNodeColor(node);
			} else {
				tree.right = this.insert(elem, tree.right);
				tree.right.parent = tree;
				this.cmd(act.connect, tree.graphicID, tree.right.graphicID, LINK_COLOR);
			}
		} else {
			this.cmd(act.setText, 0, `${elem} already in tree — ignoring duplicate`);
			this.cmd(act.step);
			this.cmd(act.setHighlight, tree.graphicID, 0);
			return tree;
		}

		this.cmd(act.setHighlight, tree.graphicID, 0);
		tree = this.fixDoubleRed(tree);
		return tree;
	}

	fixDoubleRed(tree) {
		if (tree == null) return tree;

		// Check left child red-red
		if (tree.left != null && !tree.left.phantomLeaf && tree.left.blackLevel === 0) {
			if (
				tree.left.left != null &&
				!tree.left.left.phantomLeaf &&
				tree.left.left.blackLevel === 0
			) {
				this.cmd(act.setText, 0, 'Double red: left-left case');
				this.cmd(act.step);
				return this.fixDoubleRedLL(tree);
			}
			if (
				tree.left.right != null &&
				!tree.left.right.phantomLeaf &&
				tree.left.right.blackLevel === 0
			) {
				this.cmd(act.setText, 0, 'Double red: left-right case');
				this.cmd(act.step);
				return this.fixDoubleRedLR(tree);
			}
		}
		// Check right child red-red
		if (tree.right != null && !tree.right.phantomLeaf && tree.right.blackLevel === 0) {
			if (
				tree.right.right != null &&
				!tree.right.right.phantomLeaf &&
				tree.right.right.blackLevel === 0
			) {
				this.cmd(act.setText, 0, 'Double red: right-right case');
				this.cmd(act.step);
				return this.fixDoubleRedRR(tree);
			}
			if (
				tree.right.left != null &&
				!tree.right.left.phantomLeaf &&
				tree.right.left.blackLevel === 0
			) {
				this.cmd(act.setText, 0, 'Double red: right-left case');
				this.cmd(act.step);
				return this.fixDoubleRedRL(tree);
			}
		}
		return tree;
	}

	fixDoubleRedLL(grandparent) {
		// Uncle is right child of grandparent
		const uncle = grandparent.right;
		const parent = grandparent.left;

		if (uncle != null && !uncle.phantomLeaf && uncle.blackLevel === 0) {
			// Case 1: uncle is red — recolor
			this.highlight(3, 0, 'fixDoubleRed');
			this.cmd(act.setText, 0, 'Uncle is red: recolor grandparent red, parent & uncle black');
			uncle.blackLevel = 1;
			parent.blackLevel = 1;
			grandparent.blackLevel = 0;
			this.fixNodeColor(uncle);
			this.fixNodeColor(parent);
			this.fixNodeColor(grandparent);
			this.cmd(act.step);
			this.unhighlight(3, 0, 'fixDoubleRed');
			return grandparent;
		} else {
			// Case 2: uncle is black — rotate right
			this.highlight(8, 0, 'fixDoubleRed');
			this.cmd(act.setText, 0, 'Uncle is black: right rotation');
			this.cmd(act.step);
			this.unhighlight(8, 0, 'fixDoubleRed');
			// parent takes grandparent's black level, grandparent becomes red
			parent.blackLevel = grandparent.blackLevel;
			grandparent.blackLevel = 0;
			this.singleRotateRight(grandparent);
			this.fixNodeColor(parent);
			this.fixNodeColor(grandparent);
			return parent;
		}
	}

	fixDoubleRedLR(grandparent) {
		const uncle = grandparent.right;
		const parent = grandparent.left;
		const child = parent.right;

		if (uncle != null && !uncle.phantomLeaf && uncle.blackLevel === 0) {
			this.highlight(3, 0, 'fixDoubleRed');
			this.cmd(act.setText, 0, 'Uncle is red: recolor grandparent red, parent & uncle black');
			uncle.blackLevel = 1;
			parent.blackLevel = 1;
			grandparent.blackLevel = 0;
			this.fixNodeColor(uncle);
			this.fixNodeColor(parent);
			this.fixNodeColor(grandparent);
			this.cmd(act.step);
			this.unhighlight(3, 0, 'fixDoubleRed');
			return grandparent;
		} else {
			this.highlight(8, 0, 'fixDoubleRed');
			this.cmd(act.setText, 0, 'Uncle is black: left-right rotation');
			this.cmd(act.step);
			this.unhighlight(8, 0, 'fixDoubleRed');
			// First rotate left at parent, then right at grandparent
			child.blackLevel = grandparent.blackLevel;
			grandparent.blackLevel = 0;
			this.singleRotateLeft(parent);
			// After rotating left, grandparent.left is now child
			grandparent.left = child;
			child.parent = grandparent;
			this.singleRotateRight(grandparent);
			this.fixNodeColor(child);
			this.fixNodeColor(grandparent);
			this.fixNodeColor(parent);
			return child;
		}
	}

	fixDoubleRedRR(grandparent) {
		const uncle = grandparent.left;
		const parent = grandparent.right;

		if (uncle != null && !uncle.phantomLeaf && uncle.blackLevel === 0) {
			this.highlight(3, 0, 'fixDoubleRed');
			this.cmd(act.setText, 0, 'Uncle is red: recolor grandparent red, parent & uncle black');
			uncle.blackLevel = 1;
			parent.blackLevel = 1;
			grandparent.blackLevel = 0;
			this.fixNodeColor(uncle);
			this.fixNodeColor(parent);
			this.fixNodeColor(grandparent);
			this.cmd(act.step);
			this.unhighlight(3, 0, 'fixDoubleRed');
			return grandparent;
		} else {
			this.highlight(8, 0, 'fixDoubleRed');
			this.cmd(act.setText, 0, 'Uncle is black: left rotation');
			this.cmd(act.step);
			this.unhighlight(8, 0, 'fixDoubleRed');
			parent.blackLevel = grandparent.blackLevel;
			grandparent.blackLevel = 0;
			this.singleRotateLeft(grandparent);
			this.fixNodeColor(parent);
			this.fixNodeColor(grandparent);
			return parent;
		}
	}

	fixDoubleRedRL(grandparent) {
		const uncle = grandparent.left;
		const parent = grandparent.right;
		const child = parent.left;

		if (uncle != null && !uncle.phantomLeaf && uncle.blackLevel === 0) {
			this.highlight(3, 0, 'fixDoubleRed');
			this.cmd(act.setText, 0, 'Uncle is red: recolor grandparent red, parent & uncle black');
			uncle.blackLevel = 1;
			parent.blackLevel = 1;
			grandparent.blackLevel = 0;
			this.fixNodeColor(uncle);
			this.fixNodeColor(parent);
			this.fixNodeColor(grandparent);
			this.cmd(act.step);
			this.unhighlight(3, 0, 'fixDoubleRed');
			return grandparent;
		} else {
			this.highlight(8, 0, 'fixDoubleRed');
			this.cmd(act.setText, 0, 'Uncle is black: right-left rotation');
			this.cmd(act.step);
			this.unhighlight(8, 0, 'fixDoubleRed');
			child.blackLevel = grandparent.blackLevel;
			grandparent.blackLevel = 0;
			this.singleRotateRight(parent);
			grandparent.right = child;
			child.parent = grandparent;
			this.singleRotateLeft(grandparent);
			this.fixNodeColor(child);
			this.fixNodeColor(grandparent);
			this.fixNodeColor(parent);
			return child;
		}
	}

	// ─── Delete ──────────────────────────────────────────────────────────────

	deleteElement(value) {
		this.commands = [];
		this.highlight(0, 0, 'delete');
		this.cmd(act.setText, 0, 'Deleting ' + value);
		this.unhighlight(0, 0, 'delete');
		this.highlight(1, 0, 'delete');
		this.treeRoot = this.treeDelete(this.treeRoot, value);
		this.unhighlight(1, 0, 'delete');
		this.highlight(8, 0, 'delete');
		if (this.treeRoot != null) {
			this.treeRoot.blackLevel = 1;
			this.fixNodeColor(this.treeRoot);
		}
		this.resizeTree();
		this.unhighlight(8, 0, 'delete');
		this.cmd(act.setText, 0, '');
		return this.commands;
	}

	treeDelete(tree, value) {
		if (tree == null || tree.phantomLeaf) {
			this.unhighlight(1, 0, 'delete');
			this.highlight(2, 0, 'delete');
			this.cmd(act.setText, 0, value + ' not found in tree');
			this.cmd(act.step);
			this.unhighlight(2, 0, 'delete');
			return tree;
		}

		this.cmd(act.setHighlight, tree.graphicID, 1);

		if (this.compare(value, tree.data) < 0) {
			this.cmd(act.setText, 0, `${value} < ${tree.data}, go left`);
			this.cmd(act.step);
			this.cmd(act.setHighlight, tree.graphicID, 0);
			tree.left = this.treeDelete(tree.left, value);
			if (tree.left != null) tree.left.parent = tree;
		} else if (this.compare(value, tree.data) > 0) {
			this.cmd(act.setText, 0, `${value} > ${tree.data}, go right`);
			this.cmd(act.step);
			this.cmd(act.setHighlight, tree.graphicID, 0);
			tree.right = this.treeDelete(tree.right, value);
			if (tree.right != null) tree.right.parent = tree;
		} else {
			// Found the node to delete
			this.cmd(act.setText, 0, 'Found ' + value + ', deleting');
			this.cmd(act.step);
			this.cmd(act.setHighlight, tree.graphicID, 0);

			const leftIsNull = tree.left == null || tree.left.phantomLeaf;
			const rightIsNull = tree.right == null || tree.right.phantomLeaf;

			if (!leftIsNull && !rightIsNull) {
				// Two real children — replace with successor or predecessor
				this.highlight(3, 0, 'delete');
				if (this.predSucc === 'succ') {
					this.highlight(4, 0, 'delete');
					this.cmd(act.setText, 0, 'Two children: finding in-order successor');
					this.cmd(act.step);
					this.unhighlight(4, 0, 'delete');
					this.highlight(5, 0, 'delete');
					const succ = this.findMin(tree.right);
					tree.data = succ.data;
					this.cmd(act.setText, tree.graphicID, tree.data);
					tree.right = this.treeDelete(tree.right, succ.data);
					if (tree.right != null) tree.right.parent = tree;
					this.unhighlight(5, 0, 'delete');
				} else {
					this.highlight(4, 0, 'delete');
					this.cmd(act.setText, 0, 'Two children: finding in-order predecessor');
					this.cmd(act.step);
					this.unhighlight(4, 0, 'delete');
					this.highlight(5, 0, 'delete');
					const pred = this.findMax(tree.left);
					tree.data = pred.data;
					this.cmd(act.setText, tree.graphicID, tree.data);
					tree.left = this.treeDelete(tree.left, pred.data);
					if (tree.left != null) tree.left.parent = tree;
					this.unhighlight(5, 0, 'delete');
				}
				this.unhighlight(3, 0, 'delete');
			} else if (leftIsNull && rightIsNull) {
				// Leaf node
				const wasBlack = tree.blackLevel >= 1;
				// Remove null leaf children first
				if (tree.left != null) {
					this.cmd(act.delete, tree.left.graphicID);
					tree.left = null;
				}
				if (tree.right != null) {
					this.cmd(act.delete, tree.right.graphicID);
					tree.right = null;
				}
				this.cmd(act.delete, tree.graphicID);
				this.cmd(act.step);
				if (wasBlack) {
					// Create a phantom double-black null node
					const id = this.nextIndex++;
					this.cmd(act.createCircle, id, 'NULL', NODE_SIZE, tree.y);
					this.cmd(act.setForegroundColor, id, FOREGROUND_BLACK);
					this.cmd(act.setBackgroundColor, id, BACKGROUND_DBL_BLACK);
					this.cmd(act.setLayer, id, 1);
					const phantom = new RedBlackNode('NULL', id);
					phantom.blackLevel = 2;
					phantom.phantomLeaf = true;
					phantom.x = tree.x;
					phantom.y = tree.y;
					return phantom;
				}
				return null;
			} else {
				// One child
				const child = leftIsNull ? tree.right : tree.left;
				const wasBlack = tree.blackLevel >= 1;
				if (tree.left != null && tree.left.phantomLeaf) {
					this.cmd(act.delete, tree.left.graphicID);
					tree.left = null;
				}
				if (tree.right != null && tree.right.phantomLeaf) {
					this.cmd(act.delete, tree.right.graphicID);
					tree.right = null;
				}
				this.cmd(act.delete, tree.graphicID);
				this.cmd(act.step);
				if (wasBlack && child.blackLevel === 0) {
					child.blackLevel = 1;
					this.fixNodeColor(child);
				} else if (wasBlack && child.blackLevel >= 1) {
					child.blackLevel = 2;
					this.fixNodeColor(child);
				}
				return child;
			}
		}

		// Fix double-black on the way back up
		tree = this.fixExtraBlack(tree);
		return tree;
	}

	findMin(tree) {
		if (tree == null || tree.phantomLeaf) return null;
		if (tree.left == null || tree.left.phantomLeaf) return tree;
		return this.findMin(tree.left);
	}

	findMax(tree) {
		if (tree == null || tree.phantomLeaf) return null;
		if (tree.right == null || tree.right.phantomLeaf) return tree;
		return this.findMax(tree.right);
	}

	fixExtraBlack(tree) {
		if (tree == null) return null;

		// Check if left child is double-black
		if (tree.left != null && tree.left.blackLevel === 2) {
			tree = this.fixExtraBlackChild(tree, true);
		}
		// Check if right child is double-black
		if (tree.right != null && tree.right.blackLevel === 2) {
			tree = this.fixExtraBlackChild(tree, false);
		}
		return tree;
	}

	fixExtraBlackChild(parNode, isLeftChild) {
		const dbChild = isLeftChild ? parNode.left : parNode.right;
		const sibling = isLeftChild ? parNode.right : parNode.left;

		if (sibling == null || sibling.phantomLeaf) {
			// Push double-black up
			this.highlight(9, 0, 'fixExtraBlack');
			this.cmd(act.setText, 0, 'Sibling is null: push double-black up');
			this.cmd(act.step);
			this.unhighlight(9, 0, 'fixExtraBlack');
			if (dbChild.phantomLeaf) {
				this.cmd(act.delete, dbChild.graphicID);
				if (isLeftChild) parNode.left = null;
				else parNode.right = null;
			} else {
				dbChild.blackLevel = 1;
				this.fixNodeColor(dbChild);
			}
			parNode.blackLevel = Math.min(parNode.blackLevel + 1, 2);
			this.fixNodeColor(parNode);
			return parNode;
		}

		const sibLeftBlack =
			sibling.left == null || sibling.left.phantomLeaf || sibling.left.blackLevel >= 1;
		const sibRightBlack =
			sibling.right == null || sibling.right.phantomLeaf || sibling.right.blackLevel >= 1;

		if (sibling.blackLevel === 0) {
			// Case: sibling is red — rotate to make sibling black
			this.highlight(4, 0, 'fixExtraBlack');
			this.cmd(act.setText, 0, 'Sibling is red: rotate to get black sibling');
			this.cmd(act.step);
			this.unhighlight(4, 0, 'fixExtraBlack');
			const oldParBlack = parNode.blackLevel;
			parNode.blackLevel = 0;
			sibling.blackLevel = oldParBlack;
			if (isLeftChild) {
				this.singleRotateLeft(parNode);
				parNode = sibling; // sibling is now root of this subtree
				// parNode.left is old parNode
				parNode.left = this.fixExtraBlackChild(parNode.left, true);
				if (parNode.left != null) parNode.left.parent = parNode;
			} else {
				this.singleRotateRight(parNode);
				parNode = sibling;
				parNode.right = this.fixExtraBlackChild(parNode.right, false);
				if (parNode.right != null) parNode.right.parent = parNode;
			}
			this.fixNodeColor(parNode);
			return parNode;
		}

		if (sibLeftBlack && sibRightBlack) {
			// Case: sibling has two black children — recolor
			this.highlight(7, 0, 'fixExtraBlack');
			this.cmd(act.setText, 0, 'Sibling has 2 black children: recolor sibling red, push up');
			this.cmd(act.step);
			this.unhighlight(7, 0, 'fixExtraBlack');
			sibling.blackLevel = 0;
			this.fixNodeColor(sibling);
			if (dbChild.phantomLeaf) {
				this.cmd(act.delete, dbChild.graphicID);
				if (isLeftChild) parNode.left = null;
				else parNode.right = null;
				// attach a regular null leaf
				if (isLeftChild) this.attachLeftNullLeaf(parNode);
				else this.attachRightNullLeaf(parNode);
			} else {
				dbChild.blackLevel = 1;
				this.fixNodeColor(dbChild);
			}
			parNode.blackLevel = Math.min(parNode.blackLevel + 1, 2);
			this.fixNodeColor(parNode);
			return parNode;
		}

		if (isLeftChild) {
			if (!sibRightBlack) {
				// Case: sibling's far child (right) is red
				this.highlight(11, 0, 'fixExtraBlack');
				this.cmd(act.setText, 0, "Sibling's far child is red: left rotation");
				this.cmd(act.step);
				this.unhighlight(11, 0, 'fixExtraBlack');
				sibling.right.blackLevel = sibling.blackLevel;
				sibling.blackLevel = parNode.blackLevel;
				parNode.blackLevel = 1;
				this.fixNodeColor(sibling.right);
				this.fixNodeColor(sibling);
				this.fixNodeColor(parNode);
				if (dbChild.phantomLeaf) {
					this.cmd(act.delete, dbChild.graphicID);
					parNode.left = null;
					this.attachLeftNullLeaf(parNode);
				} else {
					dbChild.blackLevel = 1;
					this.fixNodeColor(dbChild);
				}
				this.singleRotateLeft(parNode);
				return sibling; // sibling is new root
			} else {
				// sibling's near child (left) is red
				this.highlight(12, 0, 'fixExtraBlack');
				this.cmd(act.setText, 0, "Sibling's near child is red: right-left rotation");
				this.cmd(act.step);
				this.unhighlight(12, 0, 'fixExtraBlack');
				const nearChild = sibling.left;
				nearChild.blackLevel = parNode.blackLevel;
				parNode.blackLevel = 1;
				this.fixNodeColor(nearChild);
				this.fixNodeColor(parNode);
				if (dbChild.phantomLeaf) {
					this.cmd(act.delete, dbChild.graphicID);
					parNode.left = null;
					this.attachLeftNullLeaf(parNode);
				} else {
					dbChild.blackLevel = 1;
					this.fixNodeColor(dbChild);
				}
				this.singleRotateRight(sibling);
				parNode.right = nearChild;
				nearChild.parent = parNode;
				this.singleRotateLeft(parNode);
				this.fixNodeColor(sibling);
				return nearChild; // new root
			}
		} else {
			if (!sibLeftBlack) {
				// sibling's far child (left) is red
				this.highlight(11, 0, 'fixExtraBlack');
				this.cmd(act.setText, 0, "Sibling's far child is red: right rotation");
				this.cmd(act.step);
				this.unhighlight(11, 0, 'fixExtraBlack');
				sibling.left.blackLevel = sibling.blackLevel;
				sibling.blackLevel = parNode.blackLevel;
				parNode.blackLevel = 1;
				this.fixNodeColor(sibling.left);
				this.fixNodeColor(sibling);
				this.fixNodeColor(parNode);
				if (dbChild.phantomLeaf) {
					this.cmd(act.delete, dbChild.graphicID);
					parNode.right = null;
					this.attachRightNullLeaf(parNode);
				} else {
					dbChild.blackLevel = 1;
					this.fixNodeColor(dbChild);
				}
				this.singleRotateRight(parNode);
				return sibling;
			} else {
				// sibling's near child (right) is red
				this.highlight(12, 0, 'fixExtraBlack');
				this.cmd(act.setText, 0, "Sibling's near child is red: left-right rotation");
				this.cmd(act.step);
				this.unhighlight(12, 0, 'fixExtraBlack');
				const nearChild = sibling.right;
				nearChild.blackLevel = parNode.blackLevel;
				parNode.blackLevel = 1;
				this.fixNodeColor(nearChild);
				this.fixNodeColor(parNode);
				if (dbChild.phantomLeaf) {
					this.cmd(act.delete, dbChild.graphicID);
					parNode.right = null;
					this.attachRightNullLeaf(parNode);
				} else {
					dbChild.blackLevel = 1;
					this.fixNodeColor(dbChild);
				}
				this.singleRotateLeft(sibling);
				parNode.left = nearChild;
				nearChild.parent = parNode;
				this.singleRotateRight(parNode);
				this.fixNodeColor(sibling);
				return nearChild;
			}
		}
	}

	// ─── Find ────────────────────────────────────────────────────────────────

	findElement(value) {
		this.commands = [];
		this.highlightID = this.nextIndex++;
		this.doFind(this.treeRoot, value);
		return this.commands;
	}

	doFind(tree, value) {
		this.cmd(act.setText, 0, 'Searching for ' + value);
		this.highlight(0, 0, 'find');
		if (tree == null || tree.phantomLeaf) {
			this.highlight(1, 0, 'find');
			this.cmd(act.setText, 0, 'Searching for ' + value + ': not found');
			this.cmd(act.step);
			this.unhighlight(0, 0, 'find');
			this.unhighlight(1, 0, 'find');
			return;
		}
		this.cmd(act.setHighlight, tree.graphicID, 1);
		const cmp = this.compare(value, tree.data);
		if (cmp === 0) {
			this.highlight(2, 0, 'find');
			this.cmd(act.setText, 0, 'Found ' + value + '!');
			this.cmd(act.step);
			this.cmd(act.setHighlight, tree.graphicID, 0);
			this.unhighlight(0, 0, 'find');
			this.unhighlight(2, 0, 'find');
		} else if (cmp < 0) {
			this.highlight(3, 0, 'find');
			this.cmd(act.setText, 0, `${value} < ${tree.data}: go left`);
			this.cmd(act.step);
			this.cmd(act.setHighlight, tree.graphicID, 0);
			this.unhighlight(0, 0, 'find');
			this.unhighlight(3, 0, 'find');
			if (tree.left != null && !tree.left.phantomLeaf) {
				this.cmd(act.createHighlightCircle, this.highlightID, HIGHLIGHT_COLOR, tree.x, tree.y);
				this.cmd(act.move, this.highlightID, tree.left.x, tree.left.y);
				this.cmd(act.step);
				this.cmd(act.delete, this.highlightID);
			}
			this.doFind(tree.left, value);
		} else {
			this.highlight(4, 0, 'find');
			this.cmd(act.setText, 0, `${value} > ${tree.data}: go right`);
			this.cmd(act.step);
			this.cmd(act.setHighlight, tree.graphicID, 0);
			this.unhighlight(0, 0, 'find');
			this.unhighlight(4, 0, 'find');
			if (tree.right != null && !tree.right.phantomLeaf) {
				this.cmd(act.createHighlightCircle, this.highlightID, HIGHLIGHT_COLOR, tree.x, tree.y);
				this.cmd(act.move, this.highlightID, tree.right.x, tree.right.y);
				this.cmd(act.step);
				this.cmd(act.delete, this.highlightID);
			}
			this.doFind(tree.right, value);
		}
	}

	// ─── Print ───────────────────────────────────────────────────────────────

	printTree() {
		this.commands = [];
		if (this.treeRoot != null) {
			this.highlightID = this.nextIndex++;
			const firstLabel = this.nextIndex;
			this.cmd(
				act.createHighlightCircle,
				this.highlightID,
				HIGHLIGHT_COLOR,
				this.treeRoot.x,
				this.treeRoot.y,
			);
			this.xPosOfNextLabel = this.first_print_pos_x;
			this.yPosOfNextLabel = this.first_print_pos_y;
			this.printTreeRec(this.treeRoot);
			this.cmd(act.delete, this.highlightID);
			this.cmd(act.step);
			for (let i = firstLabel; i < this.nextIndex; i++) this.cmd(act.delete, i);
			this.nextIndex = this.highlightID;
		}
		return this.commands;
	}

	printTreeRec(tree) {
		if (tree == null || tree.phantomLeaf) {
			this.highlight(1, 0, 'print');
			this.unhighlight(1, 0, 'print');
			return;
		}
		this.highlight(0, 0, 'print');
		this.cmd(act.step);
		if (tree.left != null && !tree.left.phantomLeaf) {
			this.highlight(2, 0, 'print');
			this.cmd(act.move, this.highlightID, tree.left.x, tree.left.y);
			this.printTreeRec(tree.left);
			this.cmd(act.move, this.highlightID, tree.x, tree.y);
			this.cmd(act.step);
			this.unhighlight(2, 0, 'print');
		}
		this.highlight(3, 0, 'print');
		const nextLabelID = this.nextIndex++;
		this.cmd(act.createLabel, nextLabelID, tree.data, tree.x, tree.y);
		this.cmd(act.setForegroundColor, nextLabelID, PRINT_COLOR);
		this.cmd(act.move, nextLabelID, this.xPosOfNextLabel, this.yPosOfNextLabel);
		this.cmd(act.step);
		this.unhighlight(0, 0, 'print');
		this.unhighlight(3, 0, 'print');
		this.xPosOfNextLabel += PRINT_HORIZONTAL_GAP;
		if (this.xPosOfNextLabel > this.print_max) {
			this.xPosOfNextLabel = this.first_print_pos_x;
			this.yPosOfNextLabel += PRINT_VERTICAL_GAP;
		}
		if (tree.right != null && !tree.right.phantomLeaf) {
			this.highlight(4, 0, 'print');
			this.cmd(act.move, this.highlightID, tree.right.x, tree.right.y);
			this.printTreeRec(tree.right);
			this.cmd(act.move, this.highlightID, tree.x, tree.y);
			this.cmd(act.step);
			this.unhighlight(4, 0, 'print');
		}
	}

	// ─── Null leaves ─────────────────────────────────────────────────────────

	attachNullLeaves(node) {
		this.attachLeftNullLeaf(node);
		this.attachRightNullLeaf(node);
	}

	attachLeftNullLeaf(node) {
		if (node.left == null) {
			const id = this.nextIndex++;
			this.cmd(act.createCircle, id, 'NULL', NODE_SIZE, node.y + HEIGHT_DELTA);
			this.cmd(act.setForegroundColor, id, FOREGROUND_BLACK);
			this.cmd(act.setBackgroundColor, id, BACKGROUND_BLACK);
			this.cmd(act.setLayer, id, 1);
			this.cmd(act.connect, node.graphicID, id, LINK_COLOR);
			const leaf = new RedBlackNode('NULL', id);
			leaf.blackLevel = 1;
			leaf.phantomLeaf = true;
			leaf.parent = node;
			node.left = leaf;
		}
	}

	attachRightNullLeaf(node) {
		if (node.right == null) {
			const id = this.nextIndex++;
			this.cmd(act.createCircle, id, 'NULL', NODE_SIZE, node.y + HEIGHT_DELTA);
			this.cmd(act.setForegroundColor, id, FOREGROUND_BLACK);
			this.cmd(act.setBackgroundColor, id, BACKGROUND_BLACK);
			this.cmd(act.setLayer, id, 1);
			this.cmd(act.connect, node.graphicID, id, LINK_COLOR);
			const leaf = new RedBlackNode('NULL', id);
			leaf.blackLevel = 1;
			leaf.phantomLeaf = true;
			leaf.parent = node;
			node.right = leaf;
		}
	}

	// ─── Rotations ───────────────────────────────────────────────────────────

	singleRotateLeft(tree) {
		const A = tree;
		const B = tree.right;
		const t2 = B.left;

		this.cmd(act.setEdgeHighlight, A.graphicID, B.graphicID, 1);
		this.cmd(act.step);

		if (t2 != null) {
			this.cmd(act.disconnect, B.graphicID, t2.graphicID);
			this.cmd(act.connect, A.graphicID, t2.graphicID, LINK_COLOR);
			t2.parent = A;
		}
		this.cmd(act.disconnect, A.graphicID, B.graphicID);
		this.cmd(act.connect, B.graphicID, A.graphicID, LINK_COLOR);
		B.parent = A.parent;
		if (this.treeRoot === A) {
			this.treeRoot = B;
		} else {
			this.cmd(act.disconnect, A.parent.graphicID, A.graphicID);
			this.cmd(act.connect, A.parent.graphicID, B.graphicID, LINK_COLOR);
			if (A.isLeftChild()) {
				A.parent.left = B;
			} else {
				A.parent.right = B;
			}
		}
		B.left = A;
		A.parent = B;
		A.right = t2;
		this.cmd(act.setHighlight, A.graphicID, 0);
		this.cmd(act.setHighlight, B.graphicID, 0);
		this.resizeTree();
		return B;
	}

	singleRotateRight(tree) {
		const B = tree;
		const A = tree.left;
		const t2 = A.right;

		this.cmd(act.setEdgeHighlight, B.graphicID, A.graphicID, 1);
		this.cmd(act.step);

		if (t2 != null) {
			this.cmd(act.disconnect, A.graphicID, t2.graphicID);
			this.cmd(act.connect, B.graphicID, t2.graphicID, LINK_COLOR);
			t2.parent = B;
		}
		this.cmd(act.disconnect, B.graphicID, A.graphicID);
		this.cmd(act.connect, A.graphicID, B.graphicID, LINK_COLOR);
		A.parent = B.parent;
		if (this.treeRoot === B) {
			this.treeRoot = A;
		} else {
			this.cmd(act.disconnect, B.parent.graphicID, B.graphicID);
			this.cmd(act.connect, B.parent.graphicID, A.graphicID, LINK_COLOR);
			if (B.isLeftChild()) {
				B.parent.left = A;
			} else {
				B.parent.right = A;
			}
		}
		A.right = B;
		B.parent = A;
		B.left = t2;
		this.cmd(act.setHighlight, A.graphicID, 0);
		this.cmd(act.setHighlight, B.graphicID, 0);
		this.resizeTree();
		return A;
	}

	// ─── Color helpers ───────────────────────────────────────────────────────

	fixNodeColor(node) {
		if (node == null) return;
		if (node.blackLevel === 0) {
			this.cmd(act.setForegroundColor, node.graphicID, FOREGROUND_RED);
			this.cmd(act.setBackgroundColor, node.graphicID, BACKGROUND_RED);
		} else if (node.blackLevel === 1) {
			this.cmd(act.setForegroundColor, node.graphicID, FOREGROUND_BLACK);
			this.cmd(act.setBackgroundColor, node.graphicID, BACKGROUND_BLACK);
		} else {
			// double black
			this.cmd(act.setForegroundColor, node.graphicID, FOREGROUND_BLACK);
			this.cmd(act.setBackgroundColor, node.graphicID, BACKGROUND_DBL_BLACK);
		}
	}

	// ─── Layout ──────────────────────────────────────────────────────────────

	resizeTree() {
		if (this.treeRoot == null) return;
		let startingPoint = this.startingX;
		this.resizeWidths(this.treeRoot);
		if (this.treeRoot.leftWidth > startingPoint) {
			startingPoint = this.treeRoot.leftWidth;
		} else if (this.treeRoot.rightWidth > startingPoint) {
			startingPoint = Math.max(
				this.treeRoot.leftWidth,
				2 * startingPoint - this.treeRoot.rightWidth,
			);
		}
		this.setNewPositions(this.treeRoot, startingPoint, STARTING_Y, 0);
		this.animateNewPositions(this.treeRoot);
		this.cmd(act.step);
		this.updatePrintPositions();
	}

	setNewPositions(tree, xPosition, yPosition, side) {
		if (tree == null) return;
		tree.y = yPosition;
		if (side === -1) {
			xPosition = xPosition - tree.rightWidth;
		} else if (side === 1) {
			xPosition = xPosition + tree.leftWidth;
		}
		tree.x = xPosition;
		this.setNewPositions(tree.left, xPosition, yPosition + HEIGHT_DELTA, -1);
		this.setNewPositions(tree.right, xPosition, yPosition + HEIGHT_DELTA, 1);
	}

	animateNewPositions(tree) {
		if (tree == null) return;
		this.cmd(act.move, tree.graphicID, tree.x, tree.y);
		this.animateNewPositions(tree.left);
		this.animateNewPositions(tree.right);
	}

	resizeWidths(tree) {
		if (tree == null) return 0;
		tree.leftWidth = Math.max(this.resizeWidths(tree.left), WIDTH_DELTA / 2);
		tree.rightWidth = Math.max(this.resizeWidths(tree.right), WIDTH_DELTA / 2);
		return tree.leftWidth + tree.rightWidth;
	}

	treeDepth(tree) {
		if (tree == null || tree.phantomLeaf) return -1;
		return 1 + Math.max(this.treeDepth(tree.left), this.treeDepth(tree.right));
	}

	updatePrintPositions() {
		const w = this.canvasWidth;
		const PADDING = NODE_SIZE + 10;
		const MIN_PRINT_WIDTH = 200;

		if (this.treeRoot == null) {
			this.first_print_pos_x = FIRST_PRINT_POS_X;
			this.first_print_pos_y = STARTING_Y;
			this.print_max = w - 10;
			return;
		}

		const treeRightEdge = this.treeRoot.x + this.treeRoot.rightWidth;
		const rightSpace = w - treeRightEdge - PADDING;

		if (rightSpace >= MIN_PRINT_WIDTH) {
			this.first_print_pos_x = treeRightEdge + PADDING;
			this.first_print_pos_y = STARTING_Y;
			this.print_max = w - 10;
		} else {
			const depth = this.treeDepth(this.treeRoot);
			const treeBottom = STARTING_Y + depth * HEIGHT_DELTA + NODE_SIZE;
			this.first_print_pos_x = FIRST_PRINT_POS_X;
			this.first_print_pos_y = treeBottom + PADDING;
			this.print_max = w - 10;
		}
	}

	// ─── Clear ───────────────────────────────────────────────────────────────

	clear() {
		this.insertField.value = '';
		this.deleteField.value = '';
		this.findField.value = '';
		this.commands = [];
		this.recClear(this.treeRoot);
		this.treeRoot = null;
		return this.commands;
	}

	recClear(curr) {
		if (curr == null) return;
		this.cmd(act.delete, curr.graphicID);
		this.recClear(curr.left);
		this.recClear(curr.right);
	}

	disableUI() {
		for (let i = 0; i < this.controls.length; i++) {
			this.controls[i].disabled = true;
		}
	}

	enableUI() {
		for (let i = 0; i < this.controls.length; i++) {
			this.controls[i].disabled = false;
		}
	}
}

class RedBlackNode {
	constructor(data, id) {
		this.data = data;
		this.graphicID = id;
		this.x = 0;
		this.y = 0;
		this.left = null;
		this.right = null;
		this.parent = null;
		this.blackLevel = 1; // 0 = red, 1 = black, 2 = double-black
		this.phantomLeaf = false;
		this.leftWidth = 0;
		this.rightWidth = 0;
	}

	isLeftChild() {
		if (this.parent == null) return true;
		return this.parent.left === this;
	}
}
