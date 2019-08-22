var c = document.getElementById("canvas");
var ctx = c.getContext("2d");

class LinkNode {
  constructor(x, y, tag, size) {
    this.x = x;
    this.y = y;
    this.heading = {vx: Math.random(), vy:Math.random(),};
    this.heading = this.unitize(this.heading.vx, this.heading.vy);
    this.neighbor;
    this.tag = tag;
    this.size = size;
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

var mouseX, mouseY;
document.onmousemove = getMousePos;

function getMousePos(evt) {
    var rect = canvas.getBoundingClientRect();
    mouseX = (evt.clientX - rect.left) / (rect.right - rect.left) * canvas.width;
    mouseY = (evt.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height;
    // ctx.strokeStyle = "red";
    // ctx.beginPath();
    // ctx.arc(mouseX, mouseY, 60, 0, 2*Math.PI);
    // ctx.stroke();
    // ctx.strokeStyle = "black";
}

function remapRange(val, sMin, sMax, tMin, tMax) {
  val -= sMin;
  var sRange = sMax - sMin;
  var tRange = tMax - tMin;
  return Math.max(Math.min((val / sRange) * tRange + tMin, tMin), tMax);
}

var tags = ["LinkedIn", "Instagram", "GitHub", "Facebook", "Projects", "Skills",
 "Contact", "CV", "Publications", "Project1", "Project2", "Project3"];
var sizes = [3, 3, 3, 3, 10, 8, 5, 6, 5, 3, 7, 5]
var agents = [];
for (var i=0; i < 12; i++){
  agents[i] = new LinkNode(Math.random()*1800+canvas.width/2-900,
                           Math.random()*10+canvas.height/2-5,
                           tags[i], sizes[i]);
}

ctx.beginPath();
for (var i=0; i < agents.length; i++){
  ctx.lineTo(agents[i].x, agents[i].y);
}
ctx.stroke();

var maxDisp = 100;
var id = setInterval(frame, 2);
function frame() {
  ctx.fillStyle = "white";
  ctx.globalAlpha = 0.1;
  ctx.fillRect(0,0,canvas.width, canvas.height);
  ctx.globalAlpha = 1;

  for (var i=0; i < agents.length; i++){
    agents[i].updateHeading(agents);
  }

  var mouseClosestAgent = agents[0];
  var mouseC = 2000;
  for (var i=0; i < agents.length; i++){
    var mD = agents[i].distanceTo(mouseX, mouseY);
    if (mD < mouseC) {
      mouseC = mD;
      mouseClosestAgent = agents[i];
    }
  }
  mouseClosestAgent.heading = mouseClosestAgent.unitize(mouseClosestAgent.x-mouseX, mouseClosestAgent.y-mouseY);
  ctx.beginPath();
  ctx.lineWidth = 1;
  ctx.arc(mouseClosestAgent.x, mouseClosestAgent.y, 40, 0, 2*Math.PI);
  ctx.stroke();

  for (var i=0; i < agents.length; i++){
    if (agents[i] == mouseClosestAgent) {
      mouseClosestAgent.updatePos(Math.min(2, mouseClosestAgent.distanceTo(mouseX, mouseY)/ (canvas.width/20)));
    }
    else {
      agents[i].updatePos(Math.min(2, mouseClosestAgent.distanceTo( agents[i].neighbor.x, agents[i].neighbor.y )/ (canvas.width/20)));
    }
  }


  // ctx.beginPath();
  // ctx.moveTo(agents[agents.length-1].x, agents[agents.length-1].y);
  // for (var i=0; i < agents.length; i++){
  //   ctx.lineTo(agents[i].x, agents[i].y);
  // }
  // ctx.stroke();

  for (var i=0; i < agents.length; i++){
    ctx.beginPath();
    ctx.lineWidth = remapRange(agents[i].distanceTo(agents[i].neighbor.x, agents[i].neighbor.y), canvas.width/20, canvas.width/5, 30, 1);
    ctx.moveTo(agents[i].x, agents[i].y);
    ctx.lineTo(agents[i].neighbor.x, agents[i].neighbor.y);
    ctx.stroke();

    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(agents[i].x, agents[i].y, 30+0*agents[i].size, 0, 2*Math.PI);
    ctx.fill();
    // ctx.fillStyle = "white";
    // ctx.beginPath();
    // ctx.arc(agents[i].x, agents[i].y, 40+0*agents[i].size, 0, 2*Math.PI);
    // ctx.fill();

    // ctx.font = "bold " + agents[i].size*5 + "px roboto";
    // ctx.fillText(agents[i].tag, agents[i].x, agents[i].y+10, 1000);
  }

  maxDisp++;
  if (maxDisp > 10000) clearInterval(id);
}
