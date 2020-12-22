var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var win = document.getElementById("main");

var ratio = 3;
var activeAgents = parseInt(document.getElementById("agents_count").value);

helpers.updateCanvasSize(canvas);
longerEdge = Math.max(canvas.width, canvas.height);

var tags = ["HOME", "SKILLS", "CV", "CONTACT ME", "PROJECTS", "PUBLICATIONS",
"MACHINES", "GITHUB", "LINKEDIN", "P2", "INSTAGRAM", "FACEBOOK", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""];
var sizes = [5, 3, 4, 3, 4, 4, 4, 2, 2, 1, 1, 1, .2, .2, .2, .2, .2, .2, .2, .2, .2, .2, .2, .2, .2, .2, .2, .2]
var agents = [];
for (var i=0; i < activeAgents; i++){
  agents[i] = new LinkNode(Math.random()*canvas.width*3/4+canvas.width/8,
                           -100*sizes[i],
                           tags[i],
                           (sizes[i]/70)*Math.sqrt(canvas.height*canvas.width)
                       );
}

var restDist = (sizes[0]/100)*longerEdge*3;
var rageDist = (sizes[0]/100)*longerEdge;
var margin = Math.min(canvas.height, canvas.width)/30;
var mouseC;
var mouseCA;
var directTo;
var mouseX, mouseY;

function resizeCanvas() {
  helpers.updateCanvasSize(canvas);
  longerEdge = Math.max(canvas.width, canvas.height);

  for (var j=0; j<activeAgents;j++){
    agents[j].size = (sizes[j]/70)*Math.sqrt(canvas.height*canvas.width);
  }

  restDist = (sizes[0]/100)*longerEdge*3;
  rageDist = (sizes[0]/100)*longerEdge;
  margin = Math.min(canvas.height, canvas.width)/30;
}

document.onmousemove = helpers.getMousePos;
canvas.addEventListener('click', helpers.shrinkCanvas);
window.addEventListener("resize", resizeCanvas);

var id = setInterval(frame, 5);

function frame() {
  // clean Canvas
  ctx.fillStyle = "black";
  ctx.globalAlpha = .2;
  ctx.fillRect(0,0,canvas.width, canvas.height);
  ctx.globalAlpha = 1;

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
    if (!directTo & mouseC < longerEdge/10 & mouseY < canvas.height) {
      mouseCA.heading = mouseCA.unitize(mouseCA.x-mouseX, mouseCA.y-mouseY);
    }
  }

  // update Positions
  for (var i=0; i < activeAgents; i++){
    if (!directTo & agents[i]==mouseCA & mouseY<canvas.height & mouseC < longerEdge/10) {
      mouseCA.updatePos(Math.min(longerEdge/10, mouseC/mouseCA.size));
    }
    else {
      var v = helpers.remapRange(agents[i].clearance,
        rageDist, restDist, longerEdge/200, 0.2);
      agents[i].updatePos(Math.min(canvas.height, canvas.width)/50);
    }
  }

  //Draw lines and circles.
  ctx.fillStyle = "black";
  for (var i=0; i < activeAgents; i++){
    if (agents[i].neighbor) {
      ctx.strokeStyle = "white";
      ctx.lineWidth = 5;

      ctx.beginPath();
      ctx.moveTo(agents[i].x, agents[i].y);
      ctx.lineTo(agents[i].neighbor.x, agents[i].neighbor.y);
      ctx.stroke();
    }
  }

  ctx.strokeStyle = "white";
  ctx.lineWidth = 2;
  for (var i=0; i < activeAgents; i++){
    ctx.beginPath();
    ctx.arc(agents[i].x, agents[i].y, agents[i].size, 0, 2*Math.PI);
    ctx.fill();
    ctx.stroke();
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
      var tWidth = helpers.getWidthOfText(mouseCA.tag, "normal " + mouseCA.size/2 + "px roboto");
      ctx.font = "bold " + mouseCA.size/2 + "px roboto";
      ctx.fillStyle = "white";
      ctx.fillText(mouseCA.tag, mouseCA.x+mouseCA.size+24, mouseCA.y+mouseCA.size/6);
    }
  }

  // draw Icons
  ctx.textAlign = "center";
  for (var i=0; i < activeAgents; i++){
    ctx.font = "normal " + 150 + "% roboto";
    ctx.fillStyle = "white";
    ctx.fillText(agents[i].tag,
      agents[i].x, agents[i].y+agents[i].size+24);

    if (document.getElementById(agents[i].tag)){
      ctx.drawImage(document.getElementById(agents[i].tag),
        agents[i].x-agents[i].size, agents[i].y-agents[i].size,
        agents[i].size*2, agents[i].size*2);
    }
  }

  var aAgents = 0;
  for (var i=0; i < activeAgents; i++){
    if (agents[i].active) aAgents++;
  }
  if (aAgents < 4) {
    window.location.href = directTo;
    clearInterval(id);
  }
}
