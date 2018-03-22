var graphData = [];


exports.setGraphData = function(data) {
   graphData = data;
}

exports.getGraphData = function() {
  return graphData;
}

exports.addGraphPoint = function(value) {
  if(graphData.length > 180) {
    graphData.splice(0,1);

  }
  graphData.push( {
    Value: value
  });

}
