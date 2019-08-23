var c = document.getElementById("canvas");
var ctx = c.getContext("2d");
var win = document.getElementById("main");

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
    var nx = Math.min(this.x+Math.max(canvas.width, canvas.height)/20, canvas.width-this.x+Math.max(canvas.width, canvas.height)/20)
      *(this.x-canvas.width/2)/Math.abs(this.x-canvas.width/2);
    var ny = Math.min(this.y+Math.max(canvas.width, canvas.height)/20, canvas.height-this.y+Math.max(canvas.width, canvas.height)/20)
      *(this.y-canvas.height/2)/Math.abs(this.y-canvas.height/2);
    var d = Math.min(Math.abs(nx), Math.abs(ny));

    if (Math.abs(nx) > Math.abs(ny)) nx = 0;
    else ny = 0;

    var nDis = Math.max(canvas.width, canvas.height);
    for (var j=0; j < others.length; j++){
      var nd = this.distanceTo(others[j].x, others[j].y);
      if (nd < nDis & nd > 1) {
        this.neighbor = others[j];
        nDis = nd;
        if (nd < d) {
          d = nd;
          nx = others[j].x - this.x;;
          ny = others[j].y - this.y;;
        }
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
      this.x = Math.max(Math.min(this.x, canvas.width-this.size), this.size);
      this.y = Math.max(Math.min(this.y, canvas.height-this.size), this.size);
    }
  }
}

var width = window.innerWidth
|| document.documentElement.clientWidth
|| document.body.clientWidth;

var height = window.innerHeight
|| document.documentElement.clientHeight
|| document.body.clientHeight;

var ratio = canvas.width/document.getElementById("canvas").clientWidth;
var canvasTargetHeight = height * ratio;

var mouseX, mouseY;
document.onmousemove = getMousePos;
canvas.addEventListener('click', shrinkCanvas);

function getMousePos(evt) {
  var rect = canvas.getBoundingClientRect();
  mouseX = (evt.clientX - rect.left) / (rect.right - rect.left) * canvas.width;
  mouseY = (evt.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height;
}

function shrinkCanvas(evt) {
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

  if (mouseC < Math.max(canvas.width, canvas.height) / 40) {
    if (mouseCA.tag == "HOME") {
      canvasTargetHeight = height * ratio;
      activeAgents = 12;
      win.style.height = "0px";
      var scalar = Math.max(width, height);
      for (var i=0; i < activeAgents; i++){
        agents[i] = new LinkNode(Math.random()*canvas.width*3/4+canvas.width/2-750,
                                 Math.random()*20+canvasTargetHeight/2-10,
                                 tags[i], (sizes[i]/1500)*scalar*ratio);
      }
    }
    else {
      canvasTargetHeight = Math.max(canvas.width, canvas.height)/10;
      activeAgents = 5;
      agents.length = 5;
      win.style.height = (height-canvasTargetHeight/ratio) + "px";
      switch (mouseCA.tag) {
        case "SKILLS":
          win.innerHTML='<object type="text/html" data="Skills.html" style="width: 100%; height:100%;"></object>';
          break;

        case "CV":
          win.innerHTML='<object type="text/html" data="CV.html" style="width: 100%; height:100%;"></object>';
          break;

        case "PUBLICATIONS":
          win.innerHTML='<object type="text/html" data="CV.html" style="width: 100%; height:100%;"></object>';
          break;

        default:
          win.style.height = "0px";
          break;
      }
    }
  }
}

function remapRange(val, sMin, sMax, tMin, tMax) {
  val -= sMin;
  var sRange = sMax - sMin;
  var tRange = tMax - tMin;
  return Math.max(Math.min((val / sRange) * tRange + tMin, tMin), tMax);
}


var tags = ["HOME", "SKILLS", "CV", "CONTACT ME", "PROJECTS", "PUBLICATIONS",
"GITHUB", "P2", "INSTAGRAM", "P1", "FACEBOOK", "LINKEDIN"];
var sizes = [60, 50, 50, 40, 50, 40, 30, 30, 30, 30, 30, 30]
var activeAgents = 12;
var mouseC;
var mouseCA;

var agents = [];
var scalar = Math.max(width, height);
for (var i=0; i < activeAgents; i++){
  agents[i] = new LinkNode(Math.random()*canvas.width*3/4+canvas.width/2-750,
                           Math.random()*20+canvas.height/2-10,
                           tags[i], (sizes[i]/1500)*scalar*ratio);
}
console.log(agents[0].size);

ctx.beginPath();
for (var i=0; i < agents.length; i++){
  ctx.lineTo(agents[i].x, agents[i].y);
}
ctx.stroke();

var id = setInterval(frame, 2);
function frame() {
  mouseC = Math.max(canvas.width, canvas.height);
  canvas.height += .05 * (canvasTargetHeight - canvas.height);

  // clean Canvas
  ctx.fillStyle = "white";
  ctx.globalAlpha = 0.1;
  ctx.fillRect(0,0,canvas.width, canvas.height);
  ctx.globalAlpha = 1;

  for (var i=0; i < activeAgents; i++){
    agents[i].updateHeading(agents);
  }

  for (var i=0; i < activeAgents; i++){
    var mD = agents[i].distanceTo(mouseX, mouseY);
    if (mD < mouseC & mouseY < canvas.height) {
      mouseC = mD;
      mouseCA = agents[i];
    }
  }

  for (var i=0; i < activeAgents; i++){
    if (agents[i] == mouseCA  & mouseY < canvas.height) {
      mouseCA.updatePos(Math.min(2,
        mouseCA.distanceTo(mouseX, mouseY)/ (Math.max(canvas.width, canvas.height)/20)));
    }
    else {
      var v = remapRange(agents[i].clearance,
        Math.max(canvas.width, canvas.height)/20, Math.max(canvas.width, canvas.height)/11, 8, 0.1);
      agents[i].updatePos(v);
    }
  }

  for (var i=0; i < activeAgents; i++){
    ctx.beginPath();
    ctx.lineWidth = remapRange(agents[i].clearance,
      Math.max(canvas.width, canvas.height)/20, Math.max(canvas.width, canvas.height)/10, 30, 1);
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

    if (mouseC < Math.max(canvas.width, canvas.height) / 40) {
      ctx.fillStyle = "black";
      ctx.beginPath();
      ctx.rect(mouseCA.x, mouseCA.y-mouseCA.size, 8*mouseCA.size, 2*mouseCA.size);
      ctx.fill();
      ctx.font = "normal " + mouseCA.size + "px roboto";
      ctx.fillStyle = "white";
      ctx.fillText(mouseCA.tag,
        mouseCA.x+mouseCA.size, mouseCA.y+mouseCA.size/3, 8*mouseCA.size);
    }
  }

  for (var i=0; i < activeAgents; i++){
    if (document.getElementById(agents[i].tag)){
      ctx.drawImage(document.getElementById(agents[i].tag),
        agents[i].x-agents[i].size, agents[i].y-agents[i].size,
        agents[i].size*2, agents[i].size*2);
    }
  }
  // clearInterval(id);
}
