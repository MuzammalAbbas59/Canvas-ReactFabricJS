import React, { useState, useEffect } from 'react';
import { fabric } from 'fabric';
import './navbar.css'
import icons from "../Icons"
import html2canvas from "html2canvas";
import jsPdf from "jspdf";
import { useMount } from '../../custom-hooks.js'
import Popper from '../Popper/popper';
import Packages from '../Packages/packages';

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
      backgroundImage: "https://post.medicalnewstoday.com/wp-content/uploads/sites/3/2020/04/iStock-149046398-1-800x1200.jpg"
    })
  );

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
      const handleClick = event => {
        if (!event.target) {
          setPopperstate(false);
        }
        else {
          if (event.target.type != "group") {
            setSelected(event.target);
            // setPopperstate(true);
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
      radius: 45,
      fill: '#0000FF',
      left: 100,
      top: 100,
      stroke: "#7DF9FF",
    });
    canvas.add(circle);
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
      canvas.setZoom(canvas.getZoom() * 1.1);

    }
    else {
      if (canvas.getZoom().toFixed(5) <= 0.33) {
        alert("cannot zoomout more")
        return;
      }
      setZoomValue(canvas.getZoom() / 1.1);

      canvas.setZoom(canvas.getZoom() / 1.1);
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
      width: 30
    });
    canvas.add(line);
    updateStates();
  }


  function createNotes() {

    let textRectangle = new fabric.Rect({
      width: 180,
      height: 180,
      fill: '#FBC970',
      originX: 'center',
      originY: 'center',
    });

    let text = new fabric.Textbox("Notes", {
      originX: 'center',
      originY: 'center',
      textAlign: 'center',
      width: 170,
      hasControls: false,
      splitByGrapheme: true,
      fontSize: 40
    })

    let group = new fabric.Group([textRectangle, text], {
      left: 100,
      top: 100,
      originX: 'center',
      originY: 'center',
    });

    group.on('mousedblclick', (e) => {
      group.selectable = false;
      debugger;
      let textForEditing = new fabric.Textbox(text.text, {
        originX: 'center',
        originY: 'center',
        width: 170,
        splitByGrapheme: true,
        textAlign: text.textAlign,
        fontSize:text.fontSize,
        left: group.left,
        top: group.top,
        hasControls: false,
        lockMovementY: true,
        lockMovementX: true,
        hasBorders: false,
        scaleX:group.zoomX ,
        scaleY:group.zoomY
      })

      textForEditing.on('changed', function (e) {
        if (textForEditing.height > textRectangle.height - 10) {
          textForEditing.fontSize = textForEditing.fontSize - 2;
        }
      });

      text.visible = false;
      group.addWithUpdate();
      textForEditing.visible = true;
      textForEditing.hasConstrols = false;
      canvas.add(textForEditing);
      canvas.setActiveObject(textForEditing);
      textForEditing.enterEditing();
      textForEditing.selectAll();

      textForEditing.on('editing:exited', () => {
        text.set({
          text: textForEditing.text,
          fontSize: textForEditing.fontSize,
          visible: true,
        })
        
        group.addWithUpdate();
        group.selectable = true;
        textForEditing.visible = false;
        canvas.remove(textForEditing);
        canvas.setActiveObject(group);
      })
    })
    canvas.add(group);
  }




  function createtext() {
    canvas.isDrawingMode = false;
    let text = new fabric.Textbox('TEXT',
      {
        width: 100,
        editable: true,
        fill: '#000000'
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
      <canvas id="mycanvas" />
      {popperstate && <Popper selected={selected} zoom={zoomValue} />}
      {packageState && <Packages state={setPackageState} canvas={canvas} />}
    </div>
  )
}

export default Navbar