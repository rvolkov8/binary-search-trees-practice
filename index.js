class Node {
  constructor(data) {
    this.data = data;
    this.left = null;
    this.right = null;
  }
}

class Tree {
  constructor(dataArray) {
    const sortedArray = Array.from(new Set(dataArray)).sort((a, b) => a - b);
    this.root = this.buildTree(sortedArray, 0, sortedArray.length - 1);
  }

  buildTree(array, start, end) {
    if (start > end) {
      return null;
    }

    const midIndex = Math.floor((start + end) / 2);
    const node = new Node(array[midIndex]);
    node.left = this.buildTree(array, start, midIndex - 1);
    node.right = this.buildTree(array, midIndex + 1, end);

    return node;
  }

  find(key) {
    let current = this.root;
    while (current !== null) {
      if (key === current.data) {
        return current;
      } else if (key < current.data) {
        current = current.left;
      } else {
        current = current.right;
      }
    }
  }

  insertNode(key) {
    const newNode = new Node(key);

    if (this.root === null) {
      this.root = newNode;
      return;
    }

    let current = this.root;
    while (true) {
      if (key < current.data) {
        if (current.left === null) {
          current.left = newNode;
          return;
        }
        current = current.left;
      } else if (key > current.data) {
        if (current.right === null) {
          current.right = newNode;
          return;
        }
        current = current.right;
      } else {
        return;
      }
    }
  }

  deleteNode(key) {
    let current = this.root;
    let parent = null;
    let isLeftChild = false;

    // find the node to be deleted and its parent
    while (current !== null && current.data !== key) {
      parent = current;
      if (key < current.data) {
        current = current.left;
        isLeftChild = true;
      } else {
        current = current.right;
        isLeftChild = false;
      }
    }

    // if node not found, do nothing
    if (current === null) {
      return;
    }

    // case 1: node has no children
    if (current.left === null && current.right === null) {
      if (current === this.root) {
        this.root = null;
      } else if (isLeftChild) {
        parent.left = null;
      } else {
        parent.right = null;
      }
    }
    // case 2: node has one child
    else if (current.left === null) {
      if (current === this.root) {
        this.root = current.right;
      } else if (isLeftChild) {
        parent.left = current.right;
      } else {
        parent.right = current.right;
      }
    } else if (current.right === null) {
      if (current === this.root) {
        this.root = current.left;
      } else if (isLeftChild) {
        parent.left = current.left;
      } else {
        parent.right = current.left;
      }
    }
    // case 3: node has two children
    else {
      // find the inorder successor (smallest node in right subtree)
      let successor = current.right;
      let successorParent = current;
      while (successor.left !== null) {
        successorParent = successor;
        successor = successor.left;
      }

      // replace the node to be deleted with the successor
      current.data = successor.data;

      // delete the successor from its original location
      if (successor === successorParent.left) {
        successorParent.left = successor.right;
      } else {
        successorParent.right = successor.right;
      }
    }
  }

  levelOrder(fn = null) {
    const result = [];
    const queue = [this.root];

    while (queue.length > 0) {
      const node = queue.shift();

      if (fn) {
        fn(node);
      } else {
        result.push(node.data);
      }

      if (node.left) {
        queue.push(node.left);
      }
      if (node.right) {
        queue.push(node.right);
      }
    }

    return result;
  }

  inorder(fn = null) {
    const result = [];
    function traverse(node) {
      if (node) {
        traverse(node.left);
        fn && fn(node);
        result.push(node.data);
        traverse(node.right);
      }
    }
    traverse(this.root);
    return result;
  }

  preorder(fn = null) {
    const result = [];
    const traverse = (node) => {
      if (node) {
        if (fn) {
          fn(node);
        }
        result.push(node.data);
        traverse(node.left);
        traverse(node.right);
      }
    };
    traverse(this.root);
    return result;
  }

  postorder(fn = null) {
    const result = [];
    const traverse = (node) => {
      if (node) {
        traverse(node.left);
        traverse(node.right);
        if (fn) {
          fn(node);
        }
        result.push(node.data);
      }
    };
    traverse(this.root);
    return result;
  }

  height(node) {
    if (node === null) {
      return 0;
    } else {
      const leftHeight = this.height(node.left);
      const rightHeight = this.height(node.right);
      return Math.max(leftHeight, rightHeight) + 1;
    }
  }

  depth(node) {
    let depth = 0;
    let current = node;
    while (current !== this.root) {
      depth++;
      current = this.parent(current);
    }
    return depth;
  }

  parent(node) {
    let current = this.root;
    let parent = null;
    while (current !== null) {
      if (node === current) {
        return parent;
      } else if (node.data < current.data) {
        parent = current;
        current = current.left;
      } else {
        parent = current;
        current = current.right;
      }
    }
    return null;
  }

  isBalanced() {
    const checkBalanced = (node) => {
      if (!node) {
        return true;
      }

      const leftHeight = this.height(node.left);
      const rightHeight = this.height(node.right);
      const heightDiff = Math.abs(leftHeight - rightHeight);

      if (heightDiff > 1) {
        return false;
      }

      return checkBalanced(node.left) && checkBalanced(node.right);
    };

    return checkBalanced(this.root);
  }

  rebalance() {
    const nodes = this.inorder(); // create a new sorted array of nodes
    this.root = this.buildTree(nodes, 0, nodes.length - 1); // construct a new balanced tree
  }
}

// Driver script
const getRandomNum = () => {
  return Math.floor(Math.random() * 1000);
};

const getRandomArray = () => {
  const result = [];
  const arrayLength = Math.floor(Math.random() * 15);
  for (let i = 0; i < arrayLength; i++) {
    result.push(getRandomNum());
  }
  return result;
};

const tree = new Tree(getRandomArray());
if (tree.isBalanced()) {
  console.log(tree.levelOrder());
  console.log(tree.preorder());
  console.log(tree.postorder());
  console.log(tree.inorder());
}
tree.insertNode(356);
tree.insertNode(241);
tree.insertNode(111);
console.log(tree.isBalanced());
tree.rebalance();
if (tree.isBalanced()) {
  console.log(tree.levelOrder());
  console.log(tree.preorder());
  console.log(tree.postorder());
  console.log(tree.inorder());
}
