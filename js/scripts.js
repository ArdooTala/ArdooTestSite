function getDescription(doc){
  var note = null;
  var des = null;
  var controls = doc.querySelectorAll('p');
  for (var i = 0; i < controls.length; i++) {
    if (controls[i].className.includes("description")) {
      return controls[i];
    }
  }
}

function getUL(doc){
  var note = null;
  var des = null;
  var controls = doc.querySelectorAll('ul');
  for (var i = 0; i < controls.length; i++) {
    if (controls[i].className.includes("cats")) {
      return controls[i];
    }
  }
}

function changeState(elc){
  var desc = getDescription(elc);
  if (desc.style.display == 'block') {
    delaborate(elc, getDescription(elc));
  }
  else {
    elaborate(elc, getDescription(elc));
  }
}

function changeUL(elc){
  var desc = getUL(elc);
  if (desc.style.display == 'block') {
    delaborate(elc, getUL(elc));
  }
  else {
    elaborate(elc, getUL(elc));
  }
}

function elaborate(el, desc){
  el.style.border = '1px solid black';
  el.style.borderRadius = "1em";
  desc.style.display='block';
  //desc.style.height = "0px";
  myMove(desc);
  function myMove(elem) {
    var h = 0;
    elem.style.height = 'auto';
    var hd = elem.offsetHeight;
    elem.style.height = 0;
    var id = setInterval(frame, 1);
    function frame() {
      if (h >= hd) {
        clearInterval(id);
      } else {
        h += 3;
        elem.style.height = h + "px";
      }
    }
  }
}


function delaborate(el, desc){
  myMove(desc);
  function myMove(elem) {
    var h = elem.offsetHeight;
    var id = setInterval(frame, 1);
    function frame() {
      if (h <= 0) {
        desc.style.display='none';
        el.style.border = 'none';
        clearInterval(id);
      } else {
        h -= 3;
        elem.style.height = h + "px";
      }
    }
  }
}
