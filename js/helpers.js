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

  _helpers.updateCanvasSize = function(canvas) {
    var width = window.innerWidth
      || document.documentElement.clientWidth
      || document.body.clientWidth;

    var height = window.innerHeight
      || document.documentElement.clientHeight
      || document.body.clientHeight;

    var bannerHeight = document.getElementById('header_title').clientHeight;
    height -= bannerHeight;

    var height_percents = parseInt(document.getElementById("canvas_height_percentage").value);

    var canvasTargetHeight = height * ratio * height_percents / 100;

    // Set Canvas Size
    canvas.width = document.getElementById("canvas").clientWidth * ratio;
    canvas.height = canvasTargetHeight;
    document.getElementById("canvas").style.height = canvas.height/ratio+"px";

    return 0;
  };

  _helpers.shrinkCanvas = function(evt) {
    var rect = canvas.getBoundingClientRect();
    mouseX = (evt.clientX - rect.left) / (rect.right - rect.left) * canvas.width;
    mouseY = (evt.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height;
    mouseC = Math.max(canvas.width, canvas.height);
    for (var i=0; i < activeAgents; i++){
      var mD = agents[i].distanceTo(mouseX, mouseY);
      if (mD < mouseC & mouseY < canvas.height) {
        mouseC = mD;
        mouseCA = agents[i];
      }
    }
    if (mouseC < mouseCA.size) {
      if (mouseCA.tag == "null") {
        ;
      }
      else {
        for (var i=0; i < activeAgents; i++){
          agents[i].forcedDirection = "up";
        }
        switch (mouseCA.tag) {
          case "HOME":
            directTo='index.html';
            break;

          case "SKILLS":
            directTo='Skills_New.html';
            break;

          case "CV":
            directTo='CV.html';
            break;

          case "PUBLICATIONS":
            directTo='CV.html';
            break;

          case "CONTACT ME":
            directTo='contacts.html';
            break;

          case "GITHUB":
            directTo='https://github.com/ArdooTala';
            break;

          case "LINKEDIN":
            directTo='https://www.linkedin.com/in/ardeshir-talaei-058343178/';
            break;

          case "FACEBOOK":
            directTo='https://www.facebook.com/ardoo.tala';
            break;

          case "INSTAGRAM":
            directTo='https://www.instagram.com/ardeshir.talaei/?hl=en';
            break;

          case "MACHINES":
            directTo='Machines.html';
            break;

          case "PROJECTS":
            directTo='Machines.html';
            break;

          default:
            break;
        }
      }
    }
  }

  _helpers.getMousePos = function(evt) {
    var rect = canvas.getBoundingClientRect();
    mouseX = (evt.clientX - rect.left) / (rect.right - rect.left) * canvas.width;
    mouseY = (evt.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height;
  }

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
        nVec.vx *= Math.max(Math.min(helpers.remapRange(nDis, rageDist, restDist, 1, 0.01), 1), 0);
        nVec.vy *= Math.max(Math.min(helpers.remapRange(nDis, rageDist, restDist, 1, 0.01), 1), 0);
      }
      else{
        this.clearance = 0;
        var nVec = this.unitize(Math.random()-.5, Math.random()-.5);
      }


      // Min distance to edge.
      var ex = (Math.min(this.x, canvas.width-this.x))
        *((this.x-canvas.width/2)/Math.abs(this.x-canvas.width/2));
      var ey = (Math.min(this.y, canvas.height-this.y))
        *((this.y-canvas.height/2)/Math.abs(this.y-canvas.height/2));

      var d = Math.min(Math.abs(ex), Math.abs(ey));

      if (d < this.size*2) {
        if (Math.abs(ex) < Math.abs(ey)) {
          nVec = this.unitize(ex, 0);
        } else {
          nVec = this.unitize(0, ey);
        }
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
