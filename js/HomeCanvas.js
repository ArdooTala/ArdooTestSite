var c = document.getElementById("canvas");
var ctx = c.getContext("2d");
var win = document.getElementById("main");

var width = window.innerWidth
  || document.documentElement.clientWidth
  || document.body.clientWidth;

var height = window.innerHeight
  || document.documentElement.clientHeight
  || document.body.clientHeight;

var bannerHeight = document.getElementById('header').clientHeight;
height -= bannerHeight;

var ratio = 3;
var longerEdge = Math.max(width, height) * ratio;

// var ratio = canvas.width/document.getElementById("canvas").clientWidth;
var canvasTargetHeight = height * ratio;

canvas.width = document.getElementById("canvas").clientWidth * ratio;
canvas.height = height * ratio;

var tags = ["HOME", "SKILLS", "CV", "CONTACT ME", "PROJECTS", "PUBLICATIONS",
"GITHUB", "P2", "INSTAGRAM", "P1", "FACEBOOK", "LINKEDIN"];
var sizes = [6, 4, 4, 4, 4, 4, 3, 3, 3, 3, 3, 3]

var restDist = (sizes[0]/100)*longerEdge*2;
var rageDist = (sizes[0]/100)*longerEdge;
var margin = longerEdge/20;
var activeAgents = 12;
var mouseC;
var mouseCA;

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
    var nx = Math.min(this.x+margin, canvas.width-this.x)
      *(this.x-canvas.width/2)/Math.abs(this.x-canvas.width/2);
    var ny = Math.min(this.y+margin, canvas.height-this.y+margin)
      *(this.y-canvas.height/2)/Math.abs(this.y-canvas.height/2);
    var d = Math.min(Math.abs(nx), Math.abs(ny));

    if (Math.abs(nx) > Math.abs(ny)) nx = 0;
    else ny = 0;

    var nDis = longerEdge;
    for (var j=0; j < others.length; j++){
      if (others[j] != this) {
        var nd = this.distanceTo(others[j].x, others[j].y);
        if (nd < nDis) { // & nd > 1
          this.neighbor = others[j];
          nDis = nd;
          if (nd < d) {
            d = nd;
            nx = others[j].x - this.x;;
            ny = others[j].y - this.y;;
          }
        }
      }
    }
    if (nDis > 10) {
      this.clearance = nDis;
      var nHeading = this.unitize(nx, ny);
      this.heading.vx += 0.1*nHeading.vx;
      this.heading.vy += 0.1*nHeading.vy;
    }
    else {
      console.log(nDis);
      console.log(this.x + ", " + this.y);
      this.clearance = 0;
      this.heading.vx = Math.random()-.5;
      this.heading.vy = Math.random()-.5;
    }
    this.heading = this.unitize(this.heading.vx, this.heading.vy);
  }

  updatePos(percent){
    if (this.heading.vx != 0 | this.heading.vy != 0) {
      this.x += -this.heading.vx*Math.abs(percent);
      this.y += -this.heading.vy*Math.abs(percent);
      this.x = Math.max(Math.min(this.x, canvas.width-this.size), this.size);
      this.y = Math.max(Math.min(this.y, canvas.height-this.size), this.size);
    }
    else{
      console.log("Ga error!");
    }
  }
}

var mouseX, mouseY;
document.onmousemove = getMousePos;
function getMousePos(evt) {
  var rect = canvas.getBoundingClientRect();
  mouseX = (evt.clientX - rect.left) / (rect.right - rect.left) * canvas.width;
  mouseY = (evt.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height;
}

canvas.addEventListener('click', shrinkCanvas);
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

  if (mouseC < mouseCA.size) {
    if (mouseCA.tag == "HOME") {
      canvasTargetHeight = height * ratio;
      mouseX = width*ratio;
      mouseY = height*ratio;
      restDist = (sizes[0]/100)*longerEdge*2;
      rageDist = (sizes[0]/100)*longerEdge;
      margin = longerEdge/20;
      for (var j=0; j<activeAgents;j++){
        agents[j].size = (sizes[j]/100)*longerEdge;
      }
      activeAgents = 12;
      win.style.height = "0px";
      for (var i=5; i < activeAgents; i++){
        agents[i] = new LinkNode(Math.random()*canvas.width*3/4+canvas.width/8,
                                 Math.random()*20+canvasTargetHeight/2-10,
                                 tags[i], (sizes[i]/100)*longerEdge);
      }
    }
    else {
      canvasTargetHeight = height/10 * ratio;
      activeAgents = 5;
      agents.length = 5;
      for (var j=0; j<activeAgents;j++){
        agents[j].size = (sizes[0]/12)*canvasTargetHeight;
      }
      win.style.height = (.89*height) + "px";
      margin = 2*agents[0].size;
      restDist = 2*agents[0].size;// canvasTargetHeight/11;
      rageDist = agents[0].size;// canvasTargetHeight/13;
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

        case "CONTACT ME":
          win.innerHTML='<object type="text/html" data="contacts.html" style="width: 100%; height:100%;"></object>';
          break;

        default:
          win.style.height = "0px";
          break;
      }
    }
  }
}

function remapRange(val, sMin, sMax, tMin, tMax) {
  if (val < sMin) return tMin;
  if (val > sMax) return tMax;
  val -= sMin;
  var sRange = sMax - sMin;
  var tRange = tMax - tMin;
  return ((val-sMin)/sRange)*tRange+tMin;
}

function getWidthOfText(txt, font){
    if(getWidthOfText.c === undefined){
        getWidthOfText.c=document.createElement('canvas');
        getWidthOfText.ctx=getWidthOfText.c.getContext('2d');
    }
    getWidthOfText.ctx.font = font;
    return getWidthOfText.ctx.measureText(txt).width;
}

var agents = [];
for (var i=0; i < activeAgents; i++){
  agents[i] = new LinkNode(Math.random()*canvas.width*3/4+canvas.width/8,
                           Math.random()*20+canvas.height/2-10,
                           tags[i], (sizes[i]/100)*longerEdge);
}

document.getElementById("canvas").style.height = canvas.height/ratio+"px";

var id = setInterval(frame, 5);
function frame() {
  // canvas size resize step.
  if (Math.abs(canvasTargetHeight-canvas.height)>5) {
    canvas.height += .2 * (canvasTargetHeight - canvas.height);
    document.getElementById("canvas").style.height = canvas.height/ratio+"px";
  }

  // clean Canvas
  ctx.fillStyle = "white";
  ctx.globalAlpha = 0.1;
  ctx.fillRect(0,0,canvas.width, canvas.height);
  ctx.globalAlpha = 1;

  // // write to canvas
  // ctx.font = "normal " + canvas.width/50 + "px roboto";
  // ctx.fillStyle = "black";
  // ctx.fillText("ARDESHIR TALAEI", canvas.width/5, canvas.height/3, canvas.width/3);
  // ctx.font = "normal " + canvas.width/100 + "px roboto";
  // ctx.fillText("The Man Who Sold The World!", canvas.width/5, canvas.height/3+canvas.width/100, canvas.width/3);

  // update headings
  for (var i=0; i < activeAgents; i++){
    agents[i].updateHeading(agents);
  }

  // find the mouseClosestAgent and distance to.
  mouseC = longerEdge;
  for (var i=0; i < activeAgents; i++){
    var mD = agents[i].distanceTo(mouseX, mouseY);
    if (mD < mouseC & mouseY < canvas.height) {
      mouseC = mD;
      mouseCA = agents[i];
    }
  }

  // change mouseClosestAgent heading towards the mouse.
  if (mouseCA) {
    if (mouseC < longerEdge/10 & mouseY < canvas.height) {
      mouseCA.heading = mouseCA.unitize(mouseCA.x-mouseX, mouseCA.y-mouseY);
    }
  }

  // update Positions
  for (var i=0; i < activeAgents; i++){
    if (agents[i]==mouseCA & mouseY<canvas.height & mouseC < longerEdge/10) {
      mouseCA.updatePos(Math.min(longerEdge/500, mouseC/mouseCA.size));
    }
    else {
      var v = remapRange(agents[i].clearance,
        rageDist, restDist, longerEdge/50, 0.1);
      agents[i].updatePos(v);
    }
  }

  //Draw lines and circles.
  for (var i=0; i < activeAgents; i++){
    ctx.beginPath();
    ctx.lineWidth = remapRange(agents[i].clearance,
      longerEdge/20, longerEdge/9, 30, 1);
    ctx.moveTo(agents[i].x, agents[i].y);
    ctx.lineTo(agents[i].neighbor.x, agents[i].neighbor.y);
    ctx.stroke();

    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(agents[i].x, agents[i].y, agents[i].size, 0, 2*Math.PI);
    ctx.fill();
  }

  // draw mouseClosestAgent
  if (mouseCA) {
    ctx.textAlign = "left";
    if (mouseC < mouseCA.size*2.5 & mouseY < canvas.height) {
      ctx.beginPath();
      ctx.lineWidth = 3;
      ctx.arc(mouseCA.x, mouseCA.y, mouseCA.size+10, 0, 2*Math.PI);
      ctx.stroke();
    }

    if (mouseC < mouseCA.size*1.5 & mouseY < canvas.height) {
      ctx.font = "normal " + mouseCA.size/2 + "px roboto";
      var tWidth = getWidthOfText(mouseCA.tag, "normal " + mouseCA.size/2 + "px roboto");
      ctx.fillStyle = "black";
      ctx.beginPath();
      ctx.rect(mouseCA.x, mouseCA.y-mouseCA.size, 1.3*mouseCA.size+tWidth, 2*mouseCA.size);
      ctx.fill();

      ctx.fillStyle = "white";
      ctx.fillText(mouseCA.tag, mouseCA.x+mouseCA.size, mouseCA.y+mouseCA.size/6);
    }
  }

  // draw Icons
  ctx.textAlign = "center";
  for (var i=0; i < activeAgents; i++){
    // ctx.fillStyle = "white";
    // var tagWidth = getWidthOfText(agents[i].tag, "normal " + agents[0].size/6 + "px roboto");
    // ctx.beginPath();
    // ctx.rect(agents[i].x - tagWidth/2, agents[i].y+agents[i].size, tagWidth, agents[0].size/5);
    // ctx.fill();
    ctx.font = "bold " + agents[0].size/6 + "px roboto";
    ctx.fillStyle = "white";
    ctx.fillText(agents[i].tag,
      agents[i].x, agents[i].y+agents[i].size+agents[0].size/6);
    // ctx.fillText(agents[i].tag,
    //   agents[i].x+, agents[i].y+agents[i].size+agents[0].size/6);

    ctx.font = "normal " + agents[0].size/6 + "px roboto";
    ctx.fillStyle = "black";
    ctx.fillText(agents[i].tag,
      agents[i].x, agents[i].y+agents[i].size+agents[0].size/6);

    if (document.getElementById(agents[i].tag)){
      ctx.drawImage(document.getElementById(agents[i].tag),
        agents[i].x-agents[i].size, agents[i].y-agents[i].size,
        agents[i].size*2, agents[i].size*2);
    }
  }
  // clearInterval(id);
}
