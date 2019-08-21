var c = document.getElementById("canvas");
var ctx = c.getContext("2d");

class LinkNode {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.heading = {vx: Math.random(), vy:Math.random(),};
    this.heading = this.unitize(this.heading.vx, this.heading.vy);
    this.neighbor;
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
    // Min distance to edge.
    var nx, ny;
    nx = Math.min(this.x+200, canvas.width+200-this.x)*(this.x-canvas.width/2)/Math.abs(this.x-canvas.width/2);
    ny = Math.min(this.y+200, canvas.height+200-this.y)*(this.y-canvas.height/2)/Math.abs(this.y-canvas.height/2);
    var d = Math.min(Math.abs(nx), Math.abs(ny));

    if (Math.abs(nx) > Math.abs(ny)) nx = 0;
    else ny = 0;

    for (var j=0; j < others.length; j++){
      var nd = this.distanceTo(others[j].x, others[j].y);
      if (nd < d & nd > 1) {
        d = nd;
        this.neighbor = others[j];
        nx = others[j].x - this.x;;
        ny = others[j].y - this.y;;
      }
    }
    var nHeading = this.unitize(nx, ny);
    this.heading.vx += .1*nHeading.vx;
    this.heading.vy += .1*nHeading.vy;
    this.heading = this.unitize(this.heading.vx, this.heading.vy);
  }

  updatePos(percent){
    if (this.heading.vx != 0 | this.heading.vy != 0) {
      this.x -= this.heading.vx*percent;
      this.y -= this.heading.vy*percent;
      this.x = Math.max(Math.min(this.x, canvas.width-10), 10);
      this.y = Math.max(Math.min(this.y, canvas.height-10), 10);
    }
  }
}

var agents = [];
for (var i=0; i < 20; i++){
  agents[i] = new LinkNode(Math.random()*50+canvas.width/2-25,
                           Math.random()*50+canvas.height/2-25);
}

ctx.beginPath();
for (var i=0; i < agents.length; i++){
  ctx.lineTo(agents[i].x, agents[i].y);
}
ctx.stroke();

var maxDisp = 100;
var id = setInterval(frame, 4);
function frame() {
  for (var i=0; i < agents.length; i++){
    agents[i].updateHeading(agents);
  }
  for (var i=0; i < agents.length; i++){
    agents[i].updatePos(Math.min(50, 500/maxDisp));
  }

  ctx.fillStyle = "white";
  ctx.globalAlpha = 0.01;
  ctx.fillRect(0,0,canvas.width, canvas.height);
  ctx.globalAlpha = 1;

  // ctx.beginPath();
  // ctx.moveTo(agents[agents.length-1].x, agents[agents.length-1].y);
  // for (var i=0; i < agents.length; i++){
  //   ctx.lineTo(agents[i].x, agents[i].y);
  // }
  // ctx.stroke();

  ctx.fillStyle = "black";
  for (var i=0; i < agents.length; i++){
    ctx.beginPath();
    ctx.arc(agents[i].x, agents[i].y, 5, 0, 2*Math.PI);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(agents[i].x, agents[i].y);
    ctx.lineTo(agents[i].neighbor.x, agents[i].neighbor.y);
    ctx.stroke();
  }

  maxDisp++;
  if (maxDisp > 100000) clearInterval(id);
}
