/** Class representing a Tree. */
class Tree {
  /**
   * Creates a Tree Object
   * Populates a single attribute that contains a list (array) of Node objects to be used by the other functions in this class
   * note: Node objects will have a name, parentNode, parentName, children, level, and position
   * @param {json[]} json - array of json objects with name and parent fields
   */
  constructor(json) {
    /*console.log(json)
    console.log(json.length)
    console.log(json[0].name)
    console.log(json[0].parent)*/
    this.node_array = []; // appears as though this semicolon was optional
    for (let i = 0; i < json.length; i++){
    //for (let item of json) {
      var node = new Node(json[i].name, json[i].parent)
      //var node = new Node(item.name, item.parent)
      this.node_array.push(node)
    }
    //console.log(this.node_array[1].parentName)
    //console.log(this.node_array[1].name) 
    

  }

  /**
   * Function that builds a tree from a list of nodes with parent refs
   */
  buildTree() {
      // note: in this function you will assign positions and levels by making calls to assignPosition() and assignLevel()
      /*for (let i = 0; i < this.node_array.length; i++){
        for (let j = 0; j < this.node_array.length; j ++){
          if (this.node_array[j].name == this.node_array[i].parentName){ // you can use j < i, but that only works as long as the json is ordered
            this.node_array[j].addChild(this.node_array[i].name);
            this.node_array[i].parentNode = this.node_array[j]; // reference parent node object, not parent node position
          }
        }
      }*/     // This is another way to put this data into the node_array
      let node_dict = {};
      for (let item of this.node_array){
        node_dict[item.name] = item;
      }
      for (let item of this.node_array){
        if (node_dict.hasOwnProperty(item.parentName)){
          item.parentNode = node_dict[item.parentName];
          item.parentNode.addChild(item)
        }
      }

      let root_node = this.node_array[0] // Find the root node
      while (root_node.parentNode){
        root_node = root_node.parentNode
      }

      this.assignLevel(root_node, 0) //Assign level starting with the root node at 0
      this.assignPosition(root_node, 0)


      /*for (let item of this.node_array){
        console.log(item)
      }*/
      
  }
  


  /**
   * Recursive function that assign levels to each node
   */
  assignLevel(node, level) {
    node.level = level++; //This means give me the level Mario!! To add one first, I would use ++level
    for (let invividual_node of node.children){
      this.assignLevel(invividual_node, level)
    }


  }

  /**
   * Recursive function that assign positions to each node
   */
  assignPosition(node, position) {
    node.position = position 
    if (node.children.length){
      for (let child_node of node.children){
        position = this.assignPosition(child_node, position)
      }
    }else{
      position++;
    }
    return position
  }

  /**
   * Function that renders the tree
   */
  renderTree() {
    let svg = d3.select("body").append("svg")
      .attr("width", "750")
      .attr("height", "850")
      .attr("class", "nodeGroup label"); // This took lots of trial and error to get the right sizes
    svg.selectAll("line").data(this.node_array).enter().filter(d => d.parentNode).append("line")
      .attr("x1", d => 60 + d.level * 150) 
      .attr("y1", d => 60 + d.position * 100) 
      .attr("x2", d => 60 + d.parentNode.level * 150)
      .attr("y2", d => 60 + d.parentNode.position * 100)
    svg.selectAll("circle").data(this.node_array).enter().append("circle")
      .attr("cx", d => 60 + d.level * 150)
      //.attr("x", function(d){return d.level*100})
      .attr("cy", d => 60 + d.position * 100)
      .attr("r", 45);
    svg.selectAll("text").data(this.node_array).enter().append("text")
      .attr("text-anchor", "center")
      .attr("alignment-baseline", "center")
      .text(d => d.name)
      .attr("x", d => 60 + d.level * 150)
      .attr("y", d => 60 + d.position * 100);
    
  }

}