function name() {
  const timestamp = new Date().toISOString();
  return 'klika001-' + _("#name").value + '-' + timestamp + '.pdf';
}

function saveImageToPdf() {
   html2canvas(_('canvas'), {
     dpi: 300,
     //scale: 3
   }).then(canvas => {
      var width = canvas.width;
      var height = canvas.height;
      var millimeters = {};
      millimeters.width = Math.floor(width * 0.264583);
      millimeters.height = Math.floor(height * 0.264583);

      var imgData = canvas.toDataURL('image/png');
      var doc = new jsPDF("l", "mm", "a3");
      doc.deletePage(1);
      doc.addPage(millimeters.width, millimeters.height);
      doc.addImage(imgData, 'PNG', 0, 0);
      doc.save(name());
  });
}


function print() {
  const a4 = [595, 842];
  const a3 = [842, 1191];
  //const a3 = [3508, 4961];
  const canvas = _('canvas');
  const ctx = canvas.getContext('2d');
  // ctx.webkitImageSmoothingEnabled = true;
  // ctx.mozImageSmoothingEnabled = true;
  // ctx.imageSmoothingEnabled = true;
  // ctx.imageSmoothingQuality = "high";
  ctx['imageSmoothingEnabled'] = false; /* standard */
  ctx['mozImageSmoothingEnabled'] = false; // Firefox
  ctx['oImageSmoothingEnabled'] = false; // Opera /
  ctx['webkitImageSmoothingEnabled'] = false; // Safari /
  ctx['msImageSmoothingEnabled'] = false; // IE */

  const w = canvas.width;
  const h = canvas.height;
  let ratio = a3[0]/w;
  const pdf = new jsPDF('l', 'px', 'a3');
  pdf.addImage(canvas, 'PNG', 10, 10, w * ratio, h * ratio);

  // saves!
  pdf.save(name());

  // opens new window
  //window.open(pdf.output('bloburl'), '_blank');

  // blob
  // const blobPDF = new Blob([pdf.output('blob')], {type: 'application/pdf'});
  // const fileURL = (window.URL || window['webkitURL']).createObjectURL(blobPDF);
  // window.open(fileURL, '_blank');

  // CLICK
  // const downloadLink = document.createElement('a');
  // downloadLink.href = fileURL;
  // downloadLink.download = fileName;
  // document.body.appendChild(downloadLink);
  // downloadLink.click();
  // document.body.removeChild(downloadLink);
}

function printButton() {
  _("#print-btn").addEventListener('click', () => {
    k.stage.find('Transformer').destroy();
    k.layer.draw();
    //window.print();
    // print();
    saveImageToPdf();
  });
}

function addBackground(layer, width, height) {
  const rect = new Konva.Rect({
    x: -1,
    y: -1,
    width: width + 2,
    height: height + 2,
    fill: "white",
    stroke: "none"
  });
  layer.add(rect);
  return rect;
}

function konva(id) {
  // const width = window.innerWidth;
  // const height = window.innerHeight;

  const width = _('main').offsetWidth;
  const height = _('main').offsetHeight;

  const stage = new Konva.Stage({
    container: id,
    width: width,// - 236,
    height: height// - 164
  });

  const layer = new Konva.Layer();
  const back = addBackground(layer, width, height);
  stage.add(layer);
  layer.draw();

  stage.on('click tap', function(e) {
    // if click on empty area - remove all transformers
    if (e.target === back) {
      stage.find('Transformer').destroy();
      layer.draw();
      return;
    }
    // do nothing if clicked NOT on our rectangles
    if (!e.target.hasName('pic')) {
      return;
    }
    // remove old transformers
    // TODO: we can skip it if current rect is already selected
    stage.find('Transformer').destroy();

    // create new transformer
    const tr = new Konva.Transformer({
      keepRatio: true,
      enabledAnchors: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
      centeredScaling: true,
      anchorSize: 25
    });
    layer.add(tr);
    tr.attachTo(e.target);
    layer.draw();
  });

  return {stage: stage, layer: layer};
}

let k;

ready(() => {
  printButton();

  k = konva('m');
  _("#clear-btn").addEventListener('click', () => {
    k.layer.destroyChildren();
    k.layer.draw();
    _("#name").value = "";
  });
  _("#trash-btn").addEventListener('click', () => {
    for (const node of k.stage.find('Transformer')) {
      console.log(node._node);
      node._node.destroy();
      node.destroy();
    }
    k.layer.draw();
  });
});

function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
  ev.preventDefault();
  const id = ev.dataTransfer.getData("text");
  const url = _('#' + id).style.backgroundImage;
  const ndx = url.lastIndexOf('/') + 1;
  const img = 'g/' + url.substring(ndx, url.length - 2);

  Konva.Image.fromURL(img, node => {
    node.setAttrs({
      x: ev.offsetX - 100,
      y: ev.offsetY - 100,
      scaleX: 0.2,
      scaleY: 0.2,
      name: 'pic',
      draggable: true
    });
    k.layer.add(node);
    k.layer.batchDraw();
  });
}

function allowDrop(ev) {
  ev.preventDefault();
}
