paper.install(window);

var canvas = document.getElementById('qbert-canvas');
paper.setup(canvas);

var values = {
	amount: 30
};
var raster,
	group;

var piece = createPiece();
var count = 0;
var size = piece.bounds.size;





function init(width, height) {
	view.bounds.height = width;
	view.bounds.width = height;
  // raster.fitBounds(raster.bounds);
	raster.fitBounds(view.bounds);
  console.log(view.bounds);
	group = new Group();
	for (var y = 0; y < values.amount; y++) {
		for (var x = 0; x < values.amount; x++) {
			var copy = piece.clone();
			copy.position = new Point(size.width * (x + (y % 2 ? 0.5 : 0)), size.height * (y * 0.75) );
			group.addChild(copy);
		}
	}
  group.fitBounds(view.bounds);
  // group.fitBounds(raster.bounds);
	// group.fitBounds(view.bounds, true);
	group.scale(1.0);
}

function onFrame(event) {
	if (!raster)
		return;

	var length = Math.min(count + values.amount, group.children.length);
  	for (var i = count; i < length; i++) {
    	piece = group.children[i];
    	var hexagon = piece.children[0];
    	var color = raster.getAverageColor(hexagon);
    if (color) {
      hexagon.fillColor = color;
      var top = piece.children[1];
      top.fillColor = color.clone();
      top.fillColor.brightness *= 1.5;
 
      var right = piece.children[2];
      right.fillColor = color.clone();
      right.fillColor.brightness *= 0.5;
  	}
  }
  count += values.amount;
}

function onResize() {
	project.activeLayer.position = view.center;
}

function createPiece() {
  var group = new Group();
  var hexagon = new Path.RegularPolygon({
    center: view.center,
    sides: 6,
    radius: 50,
    fillColor: 'gray',
    parent: group
  });
  for (var i = 0; i < 2; i++) {
    var path = new Path({
      closed: true,
      selected: true,
      parent: group,
      fillColor: i == 0 ? 'white' : 'black'
    });
    for (var j = 0; j < 3; j++) {
      var index = (i * 2 + j) % hexagon.segments.length;
      path.add(hexagon.segments[index].clone());
    }
    path.add(hexagon.bounds.center);
  }
  // Remove the group from the document, so it is not drawn:
  group.remove();
  return group;
}