# UB StructStudio

An interactive data structure and algorithm visualization tool built for CSE 250 at the University at Buffalo. Explore 57 algorithms through step-by-step canvas animations, pseudocode walkthroughs, and Big O analysis.

## Features

- **57 visualizations** spanning lists, trees, sorting, hashing, graphs, string matching, and dynamic programming
- **Step-through animations** with play, pause, step forward, step back, and adjustable speed controls
- **Sidebar reference panel** with three tabs per algorithm:
  - **About** — description, operations, and use cases
  - **Pseudocode** — line-by-line highlighting synchronized with the animation
  - **Big O** — best, average, and worst case complexity breakdowns
- **Dark theme** interface with canvas color remapping

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS recommended)
- npm (included with Node.js)

### Installation

```bash
git clone https://github.com/JoshuaCongHu/cse250DSA.git
cd cse250DSA
npm install
```

### Usage

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
```

The optimized output is written to the `build/` directory.

## Deployment

Development happens on your laptop and is pushed to GitHub. The university web server (cerf) hosts the app at `/shared/web/structstudio/` — that directory contains both the git checkout and the files Apache serves. To update the live site, SSH into cerf and run `./deploy.sh`; the script pulls the latest commit, rebuilds, and overlays the built files in place.

**One-time setup on cerf:**

```bash
cd /shared/web/structstudio
git clone https://github.com/JoshuaCongHu/cse250DSA.git .
npm install
chmod +x deploy.sh
```

**To update:**

```bash
./deploy.sh
```

## Supported Algorithms

| Category | Algorithms |
|---|---|
| **Lists** | ArrayList, LinkedList, DoublyLinkedList, CircularlyLinkedList, StackArray, StackLL, QueueArray, QueueLL, DequeArray, DequeLL |
| **Trees** | BST, AVL, Red-Black Tree, B-Tree, Splay Tree, Skip List, TreeMap |
| **Sorting** | BubbleSort, CocktailSort, InsertionSort, SelectionSort, QuickSort, QuickSelect, MergeSort, HeapSort, LSD Radix Sort |
| **Hashing** | Open Hashing, Closed Hashing |
| **Heaps** | Min/Max Heap |
| **Graphs** | BFS, DFS, Dijkstra, Prim, Kruskal, Floyd-Warshall, Disjoint Set, Create Graph |
| **Strings** | Brute Force, Boyer-Moore, KMP, Rabin-Karp |
| **Dynamic Programming** | LCS |

## Tech Stack

- **React 18** — component architecture and state management
- **Tailwind CSS 3** — utility-first styling
- **Material-UI 5** — UI components
- **HTML5 Canvas** — custom animation engine for all visualizations

## Project Structure

```
src/
├── algo/           # Algorithm implementations (one file per algorithm)
├── anim/           # Canvas animation engine
├── components/     # Reusable UI components
├── screens/        # Top-level page components
├── css/            # Stylesheets and CSS custom properties
├── pseudocode.json # Pseudocode content for sidebar tab
└── time_complexities.json # Big O content for sidebar tab
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development setup, project structure details, and pull request guidelines.

## Acknowledgments

Built on the visualization framework originally created by [David Galles](https://www.cs.usfca.edu/~galles/visualization/) at the University of San Francisco, with subsequent contributions by Rodrigo Pontes at the Georgia Institute of Technology.

## License

BSD 2-Clause. See [LICENSE.md](LICENSE.md) for details.
