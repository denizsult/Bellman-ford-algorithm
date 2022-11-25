type Edge = {
  source: string;
  target: string;
  weight: number;
};

type processVariables = {
  distance: object;
  previous: object;
  paths: string[][];
  result: Result[];
};

type Result = {
  item: object;
  weight: number;
};
class BellmanFord {
  #nodes: Array<string>;
  #source: string;
  #edges: Array<Edge>;
  #maxWeight: number;
  #processVariables: processVariables = {
    distance: {},
    previous: {},
    paths: [],
    result: [],
  };

  get nodes() {
    return this.#nodes;
  }
  set nodes(nodes: Array<string>) {
    this.#nodes = nodes;
  }

  get source() {
    return this.#source;
  }

  set source(source: string) {
    this.#source = source;
  }

  get edges() {
    return this.#edges;
  }

  set edges(edges: Array<Edge>) {
    this.#edges = edges;
  }

  get maxWeight() {
    return this.#maxWeight;
  }

  set maxWeight(maxWeight: number) {
    this.#maxWeight = maxWeight;
  }

  get processVariables() {
    return this.#processVariables;
  }

  constructor(source, nodes, edges, maxWeight) {
    this.source = source;
    this.nodes = nodes;
    this.edges = edges;
    this.maxWeight = maxWeight;
  }

  findEdges() {
    for (let i = 0; i < this.edges.length; i++) {
      let u = this.edges[i].source;
      let v = this.edges[i].target;
      let weight = this.edges[i].weight;
      if (
        this.processVariables.distance[u] + weight <
        this.processVariables.distance[v]
      ) {
        console.log("Negative Cycle Detected");
        return;
      }
    }
  }

  calculate(): Result {
    let { distance, previous, paths, result } = this.processVariables;
    let { nodes, source, edges, maxWeight } = this;

    // make distances infinite and nodes default to null
    nodes.forEach((node: string) => {
      distance[node] = Infinity;
      previous![node] = null;
    });

    // set source in distance to zero
    distance[source] = 0;

    // find previous node
    for (let i = 0; i < nodes.length - 1; i++) {
      for (let j = 0; j < edges.length; j++) {
        let u = edges[j].source;
        let v = edges[j].target;
        let weight = edges[j].weight;

        if (distance[u] + weight < distance[v]) {
          distance[v] = distance[u] + weight;
          previous[v] = u;
        }
      }
    }

    for (let i = 0; i < edges.length; i++) {
      let u = edges[i].source;
      let v = edges[i].target;
      let weight = edges[i].weight;
      if (distance[u] + weight < distance[v]) {
        console.log("Negative Cycle Detected");
      }
    }

    //Shortest Paths
    for (let i = 0; i < nodes.length; i++) {
      const path: Array<string> = [];
      let node = nodes[i];

      while (previous[node]) {
        path.push(node);
        node = previous[node];
      }
      paths.push(path);
    }

    paths.filter((item) => {
      let pathWeight = 0;
      item.reverse().forEach((path) => {
        edges.forEach((edge) => {
          if (
            edge.source === path[0] &&
            edge.target === item[item.indexOf(path) + 1]
          ) {
            pathWeight += edge.weight;
          }
        });
      });

      if (pathWeight <= maxWeight) {
        // add path to result with weight
        result.push({
          item,
          weight: pathWeight,
        });
      }
    });
    return result.reverse()[0];
  }
}

let nodes = ["A", "B", "C", "D", "E", "F", "G"];

const edges = [
  {
    source: "A",
    target: "B",
    weight: 1,
  },
  {
    source: "A",
    target: "C",
    weight: 2,
  },
  {
    source: "B",
    target: "C",
    weight: 4,
  },
  {
    source: "B",
    target: "D",
    weight: 3,
  },
  {
    source: "C",
    target: "D",
    weight: 5,
  },
  {
    source: "C",
    target: "E",
    weight: 2,
  },
  {
    source: "D",
    target: "E",
    weight: 2,
  },
  {
    source: "D",
    target: "F",
    weight: 1,
  },
  {
    source: "E",
    target: "F",
    weight: 6,
  },
  {
    source: "E",
    target: "G",
    weight: 3,
  },
  {
    source: "F",
    target: "G",
    weight: 2,
  },
];

let maxWeight = 10;
let newbell = new BellmanFord("A", nodes, edges, maxWeight).calculate();

console.log(newbell);
