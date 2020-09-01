var helpers = (function() {
  var _helpers = {};

  _helpers.remapRange = function(val, sMin, sMax, tMin, tMax) {
    if (val < sMin) return tMin;
    if (val > sMax) return tMax;
    val -= sMin;
    var sRange = sMax - sMin;
    var tRange = tMax - tMin;
    return ((val-sMin)/sRange)*tRange+tMin;
  };

  _helpers.getWidthOfText = function(txt, font) {
    if(helpers.getWidthOfText.c === undefined){
        helpers.getWidthOfText.c=document.createElement('canvas');
        helpers.getWidthOfText.ctx=helpers.getWidthOfText.c.getContext('2d');
    }
    helpers.getWidthOfText.ctx.font = font;
    return helpers.getWidthOfText.ctx.measureText(txt).width;
  };

  return _helpers;
})();

class LinkNode {
  constructor(x, y, tag, size) {
    this.x = x;
    this.y = y;
    // this.heading = {vx: Math.random(), vy:Math.random(),};
    this.heading = {vx: 0, vy:-1,};
    this.heading = this.unitize(this.heading.vx, this.heading.vy);
    this.neighbor;
    this.tag = tag;
    this.size = size;
    this.clearance = 0;
    this.forcedDirection = "float";
    this.active = true;
  }

  distanceTo(x, y){
    let dx = x - this.x;
    let dy = y - this.y;
    return Math.sqrt(dx*dx+dy*dy)
  }

  unitize(x, y){
    var l = Math.sqrt(x*x+y*y);

    return {
      vx: x/l,
      vy: y/l,
    };
  }

  updateHeading(others){
    if (this.y < this.size & this.forcedDirection == "float") {
      this.heading.vx = 0;
      this.heading.vy = -1;
    }
    else {
      // update neighbor
      var nDis;
      if (this.neighbor){
        nDis = this.distanceTo(this.neighbor.x, this.neighbor.y);
      }
      else {
        nDis = longerEdge;
      }
      for (var j=0; j < others.length; j++){
        if (others[j] != this) {
          var nd = this.distanceTo(others[j].x, others[j].y);
          if (nd < nDis) { // & nd > 1
            this.neighbor = others[j];
            nDis = nd;
          }
        }
      }

      if (nDis > 5) {
        this.clearance = nDis;
        var nx = this.neighbor.x - this.x;
        var ny = this.neighbor.y - this.y;
        var nVec = this.unitize(nx, ny);
        nVec.vx *= Math.max(Math.min(helpers.remapRange(nDis, rageDist, restDist, 1, 0.001), 1), 0);
        nVec.vy *= Math.max(Math.min(helpers.remapRange(nDis, rageDist, restDist, 1, 0.001), 1), 0);
      }
      else{
        this.clearance = 0;
        var nVec = this.unitize(Math.random()-.5, Math.random()-.5);
      }


      // Min distance to edge.
      var ex = (Math.min(this.x, canvas.width-this.x) + margin)
        *(this.x-canvas.width/2)/Math.abs(this.x-canvas.width/2);
      var ey = (Math.min(this.y, canvas.height-this.y) + margin)
        *(this.y-canvas.height/2)/Math.abs(this.y-canvas.height/2);
      var d = Math.min(Math.abs(ex), Math.abs(ey));
      if (d < this.size) {
        nVec = this.unitize(ex, ey);
        //this.clearance = d;
      }

      this.heading.vx = 0.95*this.heading.vx + 0.05*nVec.vx;
      if (this.forcedDirection == "up"){
        if (this.y > -10*this.size) {
          this.heading.vy = helpers.remapRange(this.y, 0, canvas.height, .5, 3);
        }
        else{
          this.active = false;
          this.heading.vx = 0;
          this.heading.vy = 0;
        }
      }
      else{
        this.heading.vy = 0.95*this.heading.vy + 0.05*nVec.vy;
      }

      if (this.heading.vx*this.heading.vx + this.heading.vy*this.heading.vy > 1) {
        this.heading = this.unitize(this.heading.vx, this.heading.vy);
      }
    }
  }

  updatePos(percent){
    if (this.heading.vx != 0 | this.heading.vy != 0) {
      this.x -= this.heading.vx*Math.abs(percent);
      this.y -= this.heading.vy*Math.abs(percent);
      this.x = Math.max(Math.min(this.x, canvas.width-this.size), this.size);
      this.y = Math.min(this.y, canvas.height-this.size);
    }
    else{
      console.log("Ga error!");
    }
  }
}
