import React, { useState, useEffect } from 'react';
import { fabric } from 'fabric';
import './navbar.css'
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import TextFormatIcon from '@mui/icons-material/TextFormat';
import PanoramaFishEyeIcon from '@mui/icons-material/PanoramaFishEye';
import Crop169Icon from '@mui/icons-material/Crop169';
import CreateIcon from '@mui/icons-material/Create';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import LocalPrintshopOutlinedIcon from '@mui/icons-material/LocalPrintshopOutlined';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import html2canvas from "html2canvas";
import jsPdf from "jspdf";
import { useMount } from './custom-hooks.js'
import Popper from './popper';


function Navbar() {
  var count = 0;
  let [stack,setStack] = useState([]);
  var flag = false;
  let [canvas, setCanvas] = useState(null);
  let [selected, setselected] = useState(null);
  const [popperstate, setpopperstate] = useState(false);

  useMount(() => {
    setCanvas(initCanvas());

  });

  const initCanvas = () => (
    new fabric.Canvas('mycanvas', {
      height: 1200,
      width: 800,
      backgroundColor: "lightgray",
      // selection: true,

    })
  );

  function updateStack() {
    //  debugger
    var i = 1;
    while (stack[count + i] != null) {
      // debugger
      stack.pop();
    }
    flag = true;
    // stack = []
    var json = canvas.toJSON();
    if (json != stack[stack.legth - 1]) {
      console.log("json",json);
      console.log("prev",stack.at(-1));
      // stack.push(json);
      setStack([...stack,json])
      // debugger
    }
    // debugger
    count = stack.length - 1;
  }

  function undo() {
    // debugger
    setpopperstate(false);
     if (!stack.length){
      alert("you cannot do this")
      return;
     }
    if (count > stack.length - 4) {

      count = count - 1;
      if (count >= 0) {

        //  debugger
        canvas.loadFromJSON(stack.at(count), canvas.requestRenderAll.bind(canvas));
      }
      // }
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

  function zoomOut() {
    console.log("start zoom", stack);
    canvas.isDrawingMode = false;
    if (canvas.getZoom().toFixed(5) <= 0.33) {
      alert("cannot zoomout more")
      return;
    }
    canvas.setZoom(canvas.getZoom() / 1.1);
    canvas.setHeight(canvas.getHeight() / 1.1);
    canvas.setWidth(canvas.getWidth() / 1.1);
  }

  function deletecanvas() {
    alert("Deleting Canvas elements");
    canvas.remove.apply(canvas, canvas.getObjects().concat());
    updateStack();

  }

  function checkmovement() {
    var isObjectMoving = false;
    canvas.on('object:moving', function (event) {
      isObjectMoving = true;
      setpopperstate(false);
   
    });

    canvas.on('mouse:up', function (event) {
      if (isObjectMoving) {
        isObjectMoving = false;
        updateStack();
        setpopperstate(!popperstate);
   
      }
    });

  }

  if (canvas) {
    checkmovement();

    canvas.on('mouse:down', function (event) {
      updateStack();
      setpopperstate(false);
      // canvas.on('object:selected', function (event) {
      if (event.target) {
        console.log("active", event.target);
        setselected(event.target);
        showpopper(event);
      }


    });
    // });

  }
  function showpopper(event) {
    if (event.target) {
      setpopperstate(!popperstate);
    }

  }

  function pdf() {
    updateStack();
    canvas.isDrawingMode = false;

    alert('Exporting to print/pdf');
    const domElement = document.getElementById("mycanvas");
    html2canvas(domElement, {
    }).then(canvas => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPdf();
      pdf.addImage(imgData, "JPEG", 0, 0);
      pdf.save(`Muzammal.pdf`);
    });
  }

  function drawing() {

    canvas.isDrawingMode = true;
    canvas.on('mouse:up', function (event) {
      console.log("drawing stopped");
      updateStack();
    });

  }

  function zoomIn() {
    canvas.isDrawingMode = false;
    if (canvas.getZoom().toFixed(5) > 2) {
      alert("cannot zoomIN more")
      return;
    }
    canvas.setZoom(canvas.getZoom() * 1.1);
    canvas.setHeight(canvas.getHeight() * 1.1);
    canvas.setWidth(canvas.getWidth() * 1.1);
  }

  function createcircle() {
    canvas.isDrawingMode = false;
    var circle = new fabric.Circle({
      radius: 15,
      fill: 'blue',
      left: 100,
      top: 100,
      stroke: "red",
      selectable: true,
      hasControls: true
    });
    canvas.add(circle);
    updateStack();
  }

  function eraser() {
    canvas.isDrawingMode = false;
    canvas.remove(canvas.getActiveObject());
    updateStack();

  }
  function createrectangle() {
    canvas.isDrawingMode = false;
    var rectangle = new fabric.Rect({
      width: 200,
      selection: true,
      height: 100,
      fill: 'black',
      stroke: 'green',
      strokeWidth: 3
    });
    canvas.add(rectangle);
    updateStack();
  }
  function createline() {

    canvas.isDrawingMode = false;
    var line = new fabric.Line([30, 10, 20, 100], {
      stroke: 'blue',
      width: 10
    });
    canvas.add(line);
    updateStack();
  }
  function createtext() {
    canvas.isDrawingMode = false;
    let text = new fabric.Textbox('TEXT',
      {
        width: 450,
        editable: true,
        fill: 'white'
      });

    canvas.add(text);
    updateStack();

  }


  return (
    <div>
      <div className='Container navbar '>
        <div onClick={zoomOut} className="navbar-icons" id="Zoomout">
          <ZoomOutIcon />
        </div>
        <div onClick={zoomIn} className="navbar-icons" id="Zoomin">
          <ZoomInIcon />
        </div>
        <div className="divider-icon">
        </div>
        <div onClick={undo} className="navbar-icons" id="undo">
          <UndoIcon />
        </div>

        <div onClick={redo} className="navbar-icons" id="redo">
          <RedoIcon />
        </div>
        <div className="divider-icon"> </div>

        <div onClick={createtext} className="navbar-icons" id="text">
          <TextFormatIcon />
        </div>

        <div onClick={createline} className="navbar-icons" id="line">
          < HorizontalRuleIcon />
        </div>
        <div onClick={createcircle} className="navbar-icons" id="circle">
          <PanoramaFishEyeIcon />
        </div>

        <div onClick={createrectangle} className="navbar-icons" id="rectangle">
          <Crop169Icon />
        </div>
        <div className="divider-icon"> </div>

        <div onClick={drawing} className="navbar-icons" id="pen">
          <CreateIcon />
        </div>
        <div onClick={eraser} className="navbar-icons" id="erase">
          < RemoveCircleOutlineIcon />
        </div>

        <div onClick={deletecanvas} className="navbar-icons" id="delete">
          < DeleteForeverOutlinedIcon />
        </div>
        <div className="divider-icon"> </div>

        <div onClick={pdf} className="navbar-icons" id="pdf">
          <OpenInNewIcon />
        </div>

        <div onClick={pdf} className="navbar-icons" id="print">
          <LocalPrintshopOutlinedIcon />
        </div>


        <div className="nav-buttons">
          <div className="buttons" id="packages-button">
            <div>< CardGiftcardIcon /> </div>
            Packages
          </div>
          <div className="buttons" id="Save-button">
            <div><SaveRoundedIcon /> </div>
            Save
          </div>
        </div>

      </div>
      <canvas id="mycanvas" />
      {popperstate &&
        <>
          <Popper selected={selected} />
        </>
      }
    </div>
  )
}

export default Navbar
