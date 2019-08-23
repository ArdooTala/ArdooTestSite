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
    this.clearance = 0;
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
    var nx = Math.min(this.x+200,
      canvas.width+200-this.x)*(this.x-canvas.width/2)/Math.abs(this.x-canvas.width/2);
    var ny = Math.min(this.y+200,
      canvas.height+200-this.y)*(this.y-canvas.height/2)/Math.abs(this.y-canvas.height/2);
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
    this.clearance = d;
    var nHeading = this.unitize(nx, ny);
    this.heading.vx += 0.1*nHeading.vx;
    this.heading.vy += 0.1*nHeading.vy;
    this.heading = this.unitize(this.heading.vx, this.heading.vy);
  }

  updatePos(percent){
    if (this.heading.vx != 0 | this.heading.vy != 0) {
      this.x += -this.heading.vx*percent;
      this.y += -this.heading.vy*percent;
      this.x = Math.max(Math.min(this.x, canvas.width-10), 10);
      this.y = Math.max(Math.min(this.y, canvas.height-10), 10);
    }
  }
}

var canvasTargetHeight = 1000;
var mouseX, mouseY;
document.onmousemove = getMousePos;
canvas.addEventListener('click', shrinkCanvas);

function getMousePos(evt) {
  var rect = canvas.getBoundingClientRect();
  mouseX = (evt.clientX - rect.left) / (rect.right - rect.left) * canvas.width;
  mouseY = (evt.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height;
}

function shrinkCanvas(evt) {
  canvasTargetHeight = 300;
}

function remapRange(val, sMin, sMax, tMin, tMax) {
  val -= sMin;
  var sRange = sMax - sMin;
  var tRange = tMax - tMin;
  return Math.max(Math.min((val / sRange) * tRange + tMin, tMin), tMax);
}

var tags = ["LINKEDIN", "INSTAGRAM", "GITHUB", "FACEBOOK", "PROJECTS", "SKILLS",
 "CONTACT", "CV", "PUBLICATIONS", "PROJECT1", "PROJECT2", "PROJECT3"];
var sizes = [30, 30, 30, 30, 50, 40, 40, 30, 50, 30, 40, 40]
var agents = [];
for (var i=0; i < 12; i++){
  agents[i] = new LinkNode(Math.random()*1500+canvas.width/2-750,
                           Math.random()*20+canvas.height/2-10,
                           tags[i], sizes[i]);
}

ctx.beginPath();
for (var i=0; i < agents.length; i++){
  ctx.lineTo(agents[i].x, agents[i].y);
}
ctx.stroke();

var id = setInterval(frame, 2);
function frame() {
  canvas.height += .05 * (canvasTargetHeight - canvas.height);

  ctx.fillStyle = "white";
  ctx.globalAlpha = 0.1;
  ctx.fillRect(0,0,canvas.width, canvas.height);
  ctx.globalAlpha = 1;

  for (var i=0; i < agents.length; i++){
    agents[i].updateHeading(agents);
  }

  var mouseCA; // = agents[0];
  var mouseC = canvas.width;
  for (var i=0; i < agents.length; i++){
    var mD = agents[i].distanceTo(mouseX, mouseY);
    if (mD < mouseC) {
      mouseC = mD;
      mouseCA = agents[i];
    }
  }

  for (var i=0; i < agents.length; i++){
    if (agents[i] == mouseCA) {
      mouseCA.updatePos(Math.min(2,
        mouseCA.distanceTo(mouseX, mouseY)/ (canvas.width/20)));
    }
    else {
      var v = remapRange(agents[i].clearance,
        canvas.width/20, canvas.width/10, 10, 0.1);
      agents[i].updatePos(v);
    }
  }

  for (var i=0; i < agents.length; i++){
    ctx.beginPath();
    ctx.lineWidth = remapRange(agents[i].clearance,
      canvas.width/20, canvas.width/10, 30, 1);
    ctx.moveTo(agents[i].x, agents[i].y);
    ctx.lineTo(agents[i].neighbor.x, agents[i].neighbor.y);
    ctx.stroke();

    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(agents[i].x, agents[i].y, agents[i].size, 0, 2*Math.PI);
    ctx.fill();
  }

  if (mouseCA) {
    mouseCA.heading = mouseCA.unitize(
      mouseCA.x-mouseX, mouseCA.y-mouseY);
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.arc(mouseCA.x, mouseCA.y, mouseCA.size+10, 0, 2*Math.PI);
    ctx.stroke();

    if (mouseC < 50) {
      ctx.fillStyle = "black";
      ctx.beginPath();
      ctx.rect(mouseCA.x, mouseCA.y-mouseCA.size, 7*mouseCA.size, 2*mouseCA.size);
      ctx.fill();
      ctx.font = "normal " + mouseCA.size + "px roboto";
      ctx.fillStyle = "white";
      ctx.fillText(mouseCA.tag,
        mouseCA.x-mouseCA.size/2, mouseCA.y+mouseCA.size/3, 7*mouseCA.size);
    }
  }
  // clearInterval(id);
}
