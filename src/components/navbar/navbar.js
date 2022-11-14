import React, { useState, useEffect } from 'react';
import { fabric } from 'fabric';
import './navbar.css'
import icons from "../Icons"
import html2canvas from "html2canvas";
import jsPdf from "jspdf";
import { useMount } from '../../custom-hooks.js'
import Popper from '../Popper/popper';
import Packages from '../Packages/packages';
import bgImage from './bg.png'
function Navbar() {
  var count = 0;
  var stack = [];
  const [stackState, setStackState] = useState(null);
  var flag = false;
  let [canvas, setCanvas] = useState(null);
  let [selected, setSelected] = useState(null);
  const [popperstate, setPopperstate] = useState(false);
  const [isDraw, setisDraw] = useState(false);
  const [erase, setErase] = useState(false);


  useMount(() => {
    setCanvas(initCanvas());

  });

  const initCanvas = () => (
    new fabric.Canvas('mycanvas', {
      height: 1200,
      width: 800,
    })
  );

  function setimage() {
    fabric.Image.fromURL(
      bgImage
      ,
      function (img) {
        canvas.setBackgroundImage(img);
        canvas.setWidth(img.getScaledWidth() + 100);
        canvas.setHeight(img.getScaledHeight() + 100);
        canvas.backgroundImage.center();
        canvas.requestRenderAll();
      },
      { crossOrigin: "anonymous" }
    );
  }
  function updateStack() {
    var i = 1;
    while (stack[count + i] != null) {
      stack.pop();
    }
    flag = true;
    var json = canvas.toJSON();
    stack.push(json);
    count = stack.length - 1;
  }

  function undo() {
    setPopperstate(false);
    if (!stack.length) {
      alert("you cannot do this")
      return;
    }
    if (count > stack.length - 4) {
      count = count - 1;
      if (count >= 0) {
        canvas.loadFromJSON(stack.at(count), canvas.requestRenderAll.bind(canvas));
      }
      else {
        if (flag) {
          canvas.remove.apply(canvas, canvas.getObjects().concat());
          flag = false;
        }
        else {
          alert("you cannot do this")
        }
      }
    }
    else {
      alert("you cannot undo more");
    }
  }

  function redo() {
    flag = true;
    if (count == stack.length - 1) {
      alert("you are latest stage");
    }
    else {
      count++;
      canvas.loadFromJSON(stack.at(count), canvas.requestRenderAll.bind(canvas));
    }
  }

  function deletecanvas() {
    alert("Deleting Canvas elements");
    setPopperstate(false);
    canvas.remove.apply(canvas, canvas.getObjects().concat());
    updateStates();
  }

  function checkmovement() {
    var isObjectMoving = false;
    canvas.on('object:moving', function (event) {
      isObjectMoving = true;
      setPopperstate(false);
    });

    canvas.on('object:modified', function (event) {
      if (isObjectMoving) {
        isObjectMoving = false;
        if (event.target && event.target.type != "image") {
          updateStack();
          // setPopperstate(true);
        }
      }
    });
  }

  useEffect(() => {
    if (canvas) {
      setimage();
      const handleClick = event => {
        if (!event.target) {
          setPopperstate(false);
        }
        else {
          if (event.target.type != "group") {
            setSelected(event.target);
            setPopperstate(true);
            checkmovement();
          }
        }
      }
      if (erase == false) {
        canvas.on('mouse:down', handleClick);
      }

      else {
        canvas.off('mouse:down');
      }
    }
  }, [canvas, erase]);


  function pdf() {
    const domElement = document.getElementById("mycanvas");
    html2canvas(domElement, {
    }).then(canvas => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPdf();
      pdf.addImage(imgData, "JPEG", 0, 0);
      pdf.save(`Muzammal.pdf`);
    });
  }

  function createcircle() {
    canvas.isDrawingMode = false;
    var circle = new fabric.Circle({
      radius: 25,
      fill: '#0000FF',
      left: 100,
      top: -(canvas._offset.top - (document.querySelector('.navbar').getBoundingClientRect().y + 40)) + 100,
      stroke: "#7DF9FF",
    });
    canvas.add(circle);
    console.log((document.getElementById('mycanvas').getBoundingClientRect().y))
    console.log((document.getElementById('check').getBoundingClientRect().y))
    console.log("ajdnjn", (document.querySelector('.navbar').getBoundingClientRect().y))

    console.log(document.getElementById('mycanvas').getBoundingClientRect())

    debugger;
    updateStates();
  }

  function updateStates() {
    setErase(false);
    setisDraw(false);
    updateStack();
  }

  const [zoomValue, setZoomValue] = useState(1);
  function setZoomCanvas(event, params) {
    if (params == "zoomin") {
      if (canvas.getZoom().toFixed(5) > 2) {
        alert("cannot zoomIN more")
        return;
      }
      setZoomValue(canvas.getZoom() * 1.1);
      canvas.setWidth((canvas.getWidth()) * 1.1)
      canvas.setHeight((canvas.getHeight()) * 1.1)
      canvas.setZoom(canvas.getZoom() * 1.1);

    }
    else {
      if (canvas.getZoom().toFixed(5) <= 0.33) {
        alert("cannot zoomout more")
        return;
      }
      setZoomValue(canvas.getZoom() / 1.1);
      canvas.setZoom(canvas.getZoom() / 1.1);
      canvas.setWidth(canvas.getWidth() / 1.1)
      canvas.setHeight(canvas.getHeight() / 1.1)

    }
  }

  function eraser() {
    setPopperstate(false);
    setisDraw(false);
    setErase(erase => !erase);
  }

  useEffect(() => {
    if (canvas) {
      const handleClick = event => {
        canvas.remove(canvas.getActiveObject());
        setPopperstate(false);
        updateStack();
      }
      if (erase) {
        alert("Erasing mode is on");
        canvas.on('mouse:down', handleClick);
      }
      else {
        canvas.off('mouse:down');
        alert("Erasing mode is off");
      }
    }
  }, [erase])


  function drawing() {
    setErase(false);
    canvas.isDrawingMode = !isDraw;
    setisDraw(crr => !crr);
  }

  const [packageState, setPackageState] = useState(false);

  function createrectangle() {
    canvas.isDrawingMode = false;
    var rectangle = new fabric.Rect({
      width: 200,
      height: 100,
      top: (window.pageYOffset) + 40,
      fill: '#000000',
      stroke: '#ff0000',
      strokeWidth: 4,
      selectable: false,
    });
    canvas.add(rectangle);
    updateStates();
  }

  function createline() {

    canvas.isDrawingMode = false;
    var line = new fabric.Line([30, 10, 20, 100], {
      stroke: '#0000FF',
      width: 30,
      top: (window.pageYOffset) + 40,
    });
    canvas.add(line);
    updateStates();
  }

  const [font, setFont] = useState();

  fabric.Notes = fabric.util.createClass(fabric.Group, {
    type: "notes",
    objectCaching: false,
    cacheProperties: fabric.Text.prototype.cacheProperties
      .concat
      (),

    initialize: function (options) {
      this.set(options);
      this.rectObj = new fabric.Rect({
        width: this.width,
        height: this.height,
        fill: "#FBC970",
        originX: "center",
        originY: "center",
      });
      var rectHeight = this.height;
      this.textObj = new fabric.Textbox("Notes", {
        originX: "center",
        originY: "center",
        textAlign: "center",
        width: 90,
        hasControls: false,
        splitByGrapheme: true,
        fontSize: 30,
        lineHeight: 1,
      });

      this._objects = [this.rectObj, this.textObj];
      this._setCustomProperties(this.options);
      canvas.renderAll();
      this.on("mousedblclick", (e) => {
        var flag = false;
        var oldfont = 0, newfont = 0;
        e.target.selectable = false;
        var scaling = e.target.getScaledWidth() / 100;
        var textForEditing;
        e.target.textObj.clone(function (clonedObj) {
          clonedObj.set({
            left: e.target.left,
            top: e.target.top,
            lockMovementY: true,
            lockMovementX: true,
            hasBorders: false,
            scaleX: scaling,
            scaleY: scaling,
          });
          textForEditing = clonedObj;

        });


        function adjustFontSize() {
          var newText;
          textForEditing.clone(function (clonedObj) {
            newText = clonedObj;
          });
          //  debugger;
          oldfont = textForEditing.fontSize;
          //  for (var i=0;i<5;i++){
          console.log("height=", newText.height);
          if (newText.height < rectHeight - 15) {
            var fontSize =
              (newText.fontSize * (rectHeight - 10)) /
              (newText.height + 1 + newText.fontSize);
            fontSize > 30
              ? (newText.fontSize = 30)
              : (newText.fontSize = fontSize);
          }
          if (newText.height > rectHeight - 15) {
            newText.fontSize =
              (newText.fontSize * (rectHeight - 10)) /
              (newText.height + 1);
          }
          // }
          newfont = newText.fontSize;

          console.log("font=", newfont);
          console.log("new height", newText.calcTextHeight());
          console.log("height end=", newText.height);
          console.log((textForEditing.text).length)
          textForEditing.fontSize = newText.fontSize;
        }


        textForEditing.on("changed", function (e) {
          if (!flag) {
            // textForEditing.fontSize=textRectangle.height/(canvas.getActiveObject()._textLines.length);
            if (textForEditing.height < rectHeight - 15) {
              console.log("increaseRatio ", (textForEditing.height + 1 + textForEditing.fontSize) / (rectHeight - 10))
              var fontSize =
                (textForEditing.fontSize * (rectHeight - 10)) /
                (textForEditing.height + 1 + textForEditing.fontSize);
              // if (textForEditing.height < (rectHeight.height - 10 - fontSize))
              fontSize > 30
                ? (textForEditing.fontSize = 30)
                : (textForEditing.fontSize = fontSize);
              console.log(fontSize)
            }
            if (textForEditing.height > rectHeight - 15) {
              console.log("decreaseRatio ", ((rectHeight - 10) / (textForEditing.height + 1)))
              textForEditing.fontSize =
                (textForEditing.fontSize * (rectHeight - 10)) /
                (textForEditing.height + 1);
            }
            console.log("after ", textForEditing.fontSize)
            // else {
          }
          else {

            while (textForEditing.height > rectHeight - 15 || textForEditing.height < (rectHeight / 2 + 10)) {
              textForEditing.fontSize =
                (textForEditing.fontSize * (rectHeight - 15)) /
                (textForEditing.height + 1);
              canvas.renderAll();
            }
            adjustFontSize();
            adjustFontSize();
            canvas.renderAll();
            flag = false;
          }
        });

        textForEditing.paste = (function (paste) {
          return function (e) {
            flag = true;
            debugger;
          }
        })(textForEditing.paste);


        this.textObj.visible = false;
        this.addWithUpdate();
        canvas.add(textForEditing);
        canvas.setActiveObject(textForEditing);
        textForEditing.enterEditing();
        textForEditing.selectAll();
        textForEditing.on("editing:exited", () => {
          this.textObj.set({
            text: textForEditing.text,
            fontSize: textForEditing.fontSize,
            visible: true,
          });
          this.addWithUpdate();
          this.selectable = true;
          canvas.setActiveObject(this);
          canvas.remove(textForEditing);
        });
      });
    },
    _setCustomProperties(options) {
      let text = this.textObj;
      text.set({});
    },
    toObject: function (propertiesToInclude) {
      var obj = this.callSuper(
        "toObject",
        [
          "objectCaching",
        ].concat(propertiesToInclude)
      );
      delete obj.objects;
      return obj;
    },
  });

  fabric.Notes.fromObject = function (object, callback) {
    return fabric.Object._fromObject("Notes", object, callback);
  };

  fabric.Notes.async = true;


  function createNotes() {
    var labeledRect = new fabric.Notes({
      width: 100,
      height: 100,
      left: 100,
      top: 100,
      originX: "center",
      originY: "center",
    });
    canvas.add(labeledRect);
  }



  function createtext() {
    canvas.isDrawingMode = false;
    let text = new fabric.Textbox('TEXT',
      {
        width: 100,
        editable: true,
        fill: '#000000',
        top: 200,
      });
    canvas.add(text);
  }

  return (
    <div>
      <div className='Container navbar'>
        <icons.ZoomOutIcon onClick={event => setZoomCanvas(event, "zoomout")} className="navbar-icons" id="Zoomout" />
        <icons.ZoomInIcon onClick={event => setZoomCanvas(event, "zoomin")} className="navbar-icons" id="ZoomIn" />
        <div className="divider-icon" />
        <icons.UndoIcon onClick={undo} className="navbar-icons" />
        <icons.RedoIcon onClick={redo} className="navbar-icons" />
        <div className="divider-icon" />
        <icons.TextFormatIcon onClick={createtext} className="navbar-icons" />
        <icons.TextSnippetIcon onClick={createNotes} className="navbar-icons" />

        <icons.HorizontalRuleIcon onClick={createline} className="navbar-icons" />
        <icons.PanoramaFishEyeIcon onClick={createcircle} className="navbar-icons" />
        <icons.Crop169Icon onClick={createrectangle} className="navbar-icons" />
        <div className="divider-icon" />
        <icons.CreateIcon onClick={drawing} className="navbar-icons" />
        <icons.RemoveCircleOutlineIcon onClick={eraser} className="navbar-icons" />
        <icons.DeleteForeverOutlinedIcon onClick={deletecanvas} className="navbar-icons" />
        <div className="divider-icon" />
        <icons.OpenInNewIcon onClick={pdf} className="navbar-icons" />
        <icons.LocalPrintshopOutlinedIcon onClick={pdf} className="navbar-icons" />
        <div className="nav-buttons">
          <button onClick={() => { setPackageState(crr => !crr) }} className="buttons" id="packages-button">
            <icons.CardGiftcardIcon />  Packages </button>
          <button className="buttons" id="Save-button"><icons.SaveRoundedIcon />Save</button>
        </div>
      </div>
      <div className="mycontainer" >
        <canvas id="mycanvas" />
        {popperstate && <Popper selected={selected} zoom={zoomValue} />}
        {packageState && <Packages state={setPackageState} canvas={canvas} />}
      </div>
    </div>
  )
}

export default Navbar