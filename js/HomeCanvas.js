var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var win = document.getElementById("main");

var width = window.innerWidth
  || document.documentElement.clientWidth
  || document.body.clientWidth;

var height = window.innerHeight
  || document.documentElement.clientHeight
  || document.body.clientHeight;

var height_percents = parseInt(document.getElementById("canvas_height_percentage").value);
var activeAgents = parseInt(document.getElementById("agents_count").value);
//console.log(height_percents);

var bannerHeight = document.getElementById('header').clientHeight;
height -= bannerHeight;

var ratio = 3;

// var ratio = canvas.width/document.getElementById("canvas").clientWidth;
var canvasTargetHeight = height * ratio * height_percents / 100;
canvas.width = document.getElementById("canvas").clientWidth * ratio;
canvas.height = canvasTargetHeight;

document.getElementById("canvas").style.height = canvas.height/ratio+"px";

longerEdge = Math.max(canvas.width, canvas.height);

var tags = ["HOME", "SKILLS", "CV", "CONTACT ME", "PROJECTS", "PUBLICATIONS",
"MACHINES", "GITHUB", "LINKEDIN", "P2", "INSTAGRAM", "FACEBOOK"];
var sizes = [6, 3, 4, 3, 4, 4, 4, 2, 2, 1, 1, 1]

var restDist = (sizes[0]/100)*longerEdge*2;
var rageDist = (sizes[0]/100)*longerEdge;
// var margin = longerEdge/20;
var margin = Math.min(canvas.height, canvas.width)/30;
// var activeAgents = 12;
var mouseC;
var mouseCA;
var directTo;


var agents = [];
for (var i=0; i < activeAgents; i++){
  agents[i] = new LinkNode(Math.random()*canvas.width*3/4+canvas.width/8,
                           -100*sizes[i],
                           tags[i], (sizes[i]/70)*Math.sqrt(canvas.height*canvas.width));
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
    if (mouseCA.tag == "null") {
      // canvasTargetHeight = height * ratio;
      // mouseX = width*ratio;
      // mouseY = height*ratio;
      // restDist = (sizes[0]/100)*longerEdge*2;
      // rageDist = (sizes[0]/100)*longerEdge;
      // margin = longerEdge/10;
      // for (var j=0; j<activeAgents;j++){
      //   agents[j].size = (sizes[j]/100)*longerEdge;
      // }
      // activeAgents = 12;
      // win.style.height = "0px";
      // for (var i=5; i < activeAgents; i++){
      //   agents[i] = new LinkNode(Math.random()*canvas.width*3/4+canvas.width/8,
      //                            Math.random()*20+canvasTargetHeight/2-10,
      //                            tags[i], Math.min((sizes[i]/100)*longerEdge, Math.min(canvas.width, Math.height)/3)); //(sizes[i]/100)*Math.sqrt(canvas.height*canvas.width))
      // }
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

function resizeCanvas() {
  width = window.innerWidth
    || document.documentElement.clientWidth
    || document.body.clientWidth;

  height = window.innerHeight
    || document.documentElement.clientHeight
    || document.body.clientHeight;

  bannerHeight = document.getElementById('header').clientHeight;
  height -= bannerHeight;

  var canvasTargetHeight = height * ratio * height_percents / 100;
  canvas.width = document.getElementById("canvas").clientWidth * ratio;
  canvas.height = canvasTargetHeight;

  longerEdge = Math.max(canvas.width, canvas.height);

  for (var j=0; j<activeAgents;j++){
    agents[j].size = Math.min((sizes[i]/100)*longerEdge, Math.min(canvas.width, math.height)/3);
  }

  restDist = agents[0].sizes*2;
  rageDist = agents[0].sizes;
  margin = Math.min(longerEdge/20, Math.min(canvas.height, canvas.width)/5);
}
window.addEventListener("resize", resizeCanvas);

var id = setInterval(frame, 5);
function frame() {
  // canvas size resize step.
  // if (Math.abs(canvasTargetHeight-canvas.height)>5) {
  //   canvas.height += .2 * (canvasTargetHeight - canvas.height);
  //   document.getElementById("canvas").style.height = canvas.height/ratio+"px";
  // }

  // clean Canvas
  ctx.fillStyle = "black";
  ctx.globalAlpha = .2;
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
      agents[i].updatePos(Math.min(canvas.height, canvas.width)/100);
    }
  }

  //Draw lines and circles.
  ctx.fillStyle = "black";
  // ctx.setLineDash([5, 10]);
  for (var i=0; i < activeAgents; i++){
    if (agents[i].neighbor) {
      // Create gradient
      var gradient = ctx.createLinearGradient(agents[i].x, agents[i].y,
        agents[i].neighbor.x, agents[i].neighbor.y);
      gradient.addColorStop("0", "white");
      var rate = agents[i].size / (agents[i].neighbor.size + agents[i].size);
      gradient.addColorStop(rate, "black");
      gradient.addColorStop("1", "white");
      ctx.strokeStyle = gradient;
      // ctx.strokeStyle = "white";
      ctx.lineWidth = 5;

      ctx.beginPath();
      ctx.moveTo(agents[i].x, agents[i].y);
      ctx.lineTo(agents[i].neighbor.x, agents[i].neighbor.y);
      ctx.stroke();
    }
  }


  // ctx.setLineDash([]);
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
      // ctx.fillStyle = "black";
      // ctx.beginPath();
      // ctx.rect(mouseCA.x, mouseCA.y-mouseCA.size, 1.3*mouseCA.size+tWidth, 2*mouseCA.size);
      // ctx.fill();
      //
      // ctx.fillStyle = "white";
      ctx.font = "bold " + mouseCA.size/2 + "px roboto";
      ctx.fillStyle = "white";
      ctx.fillText(mouseCA.tag, mouseCA.x+mouseCA.size+24, mouseCA.y+mouseCA.size/6);
      ctx.font = "normal " + mouseCA.size/2 + "px roboto";
      ctx.fillStyle = "white";
      ctx.fillText(mouseCA.tag, mouseCA.x+mouseCA.size+24, mouseCA.y+mouseCA.size/6);
    }
  }

  // draw Icons
  ctx.textAlign = "center";
  for (var i=0; i < activeAgents; i++){
    // ctx.fillStyle = "white";
    // var tagWidth = helpers.getWidthOfText(agents[i].tag, "normal " + agents[0].size/6 + "px roboto");
    // ctx.beginPath();
    // ctx.rect(agents[i].x - tagWidth/2, agents[i].y+agents[i].size, tagWidth, agents[0].size/5);
    // ctx.fill();
    // ctx.font = "bold " + 24 + "px roboto";
    // ctx.fillStyle = "black";
    // ctx.fillText(agents[i].tag,
    //   agents[i].x, agents[i].y+agents[i].size+24);

    ctx.font = "normal " + 24 + "px roboto";
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
