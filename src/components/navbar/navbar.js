import React, { useState, useEffect } from 'react';
import { fabric } from 'fabric';
import './navbar.css'
import icons from "../Icons"
import html2canvas from "html2canvas";
import jsPdf from "jspdf";
import { useMount } from './custom-hooks.js'
import Popper from './popper';
import Packages from './packages';

function Navbar() {
  var count = 0;
  let [stack, setStack] = useState([]);
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
      backgroundImage: "https://wallpaper.dog/large/20394818.jpg"
    })
  );

  function updateStack() {
    var i = 1;
    while (stack[count + i] != null) {
      stack.pop();
    }
    flag = true;
    var json = canvas.toJSON();
    if (json != stack[stack.legth - 1]) {
      setStack([...stack, json])
    }
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

    canvas.on('mouse:up', function (event) {
      if (isObjectMoving) {
        isObjectMoving = false;
        if (event.target) {
          updateStack();
          setPopperstate(true);
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
          setSelected(event.target);
          setPopperstate(crr => !crr);
          checkmovement();
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

const [zoomValue,setZoomValue]=useState(null);
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

  function createrectangle() {
    canvas.isDrawingMode = false;
    var rectangle = new fabric.Rect({
      width: 200,
      selection: true,
      height: 100,
      fill: '#000000',
      transparentCorners: false,
      stroke: '#ff0000',
      strokeWidth: 3
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


  const [packageState, setPackageState] = useState(false);
  function createtext() {
    let text = new fabric.Textbox('TEXT',
      {
        width: 100,
        editable: true,
        fill: '#000000'
      });
    canvas.add(text);
    updateStates();
  }

  return (
    <div>
      <div className='Container navbar '>
        <icons.ZoomOutIcon onClick={event => setZoomCanvas(event, "zoomout")} className="navbar-icons" id="Zoomout" />
        <icons.ZoomInIcon onClick={event => setZoomCanvas(event, "zoomin")} className="navbar-icons" id="ZoomIn" />
        <div className="divider-icon" />
        <icons.UndoIcon onClick={undo} className="navbar-icons" />
        <icons.RedoIcon onClick={redo} className="navbar-icons" />
        <div className="divider-icon" />
        <icons.TextFormatIcon onClick={createtext} className="navbar-icons" />
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