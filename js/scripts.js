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

function elaborate(el){
  el.style.border = '1px solid black';
  el.style.borderRadius = '5px';
  getDescription(el).style.display='block';
}

function delaborate(el){
  el.style.border = 'none';
  getDescription(el).style.display='none';
}
