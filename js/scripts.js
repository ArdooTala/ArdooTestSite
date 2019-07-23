function getDescription(doc){
  var note = null;
  var des = null;
  var controls = doc.querySelectorAll('p');
  for (var i = 0; i < controls.length; i++) {
    if (controls[i].className == "description") {
      return controls[i];
    }
  }
}

function changeState(elc){
  var desc = getDescription(elc);
  if (desc.style.display == 'block') {
    delaborate(elc);
  }
  else {
    elaborate(elc);
  }
}

function elaborate(el){
  el.style.border = '1px solid black';
  el.style.borderRadius = "1em";
  var desc = getDescription(el);
  desc.style.display='block';
  //desc.style.height = "0px";
  myMove(desc);
  function myMove(elem) {
    var h = 0;
    var id = setInterval(frame, 1);
    function frame() {
      if (h >= 50) {
        clearInterval(id);
      } else {
        h += 3;
        elem.style.height = h + "px";
      }
    }
  }
}


function delaborate(el){
  var desc = getDescription(el);
  myMove(desc);
  function myMove(elem) {
    var h = 50;
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
