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


function Navbar() {
  var count=0;
  var stack = [];
  var redo_stack = [];
 var flag=false;
  let [canvas, setCanvas] = useState(null);
  useMount(() => {
    setCanvas(initCanvas());
  });

  const initCanvas = () => (
    new fabric.Canvas('mycanvas', {
      height: 1200,
      width: 800,
      backgroundColor: "lightgray",
      selection: true,

    })
  );
  function updateStack() {
    flag=false;
    if (!flag){
      redo_stack=[];
      // count=0;
    }
    console.log("canvas", canvas);
    var json = canvas.toJSON();
    console.log('stack updated');
    stack.push(json);
    console.log("stack: ", stack)
  }

  function undo() {
    flag=true;
    console.log("start undo", stack);
      // debugger
    if (count>=3 || count > stack.length){
      alert("You cannot undo more");
    }
    else {
     var top = stack.pop();
    // stack.push(top);
     redo_stack.push(top);
     console.log("redo",redo_stack);
    // debugger
    if (stack.at(-1)){
    canvas.loadFromJSON(stack.at(-1), canvas.requestRenderAll.bind(canvas));

    }
    else {
      // debugger;
      canvas.loadFromJSON(canvas, canvas.requestRenderAll.bind(canvas));
    
    }
    count++;
    // debugger
    }

  }

  function redo() {
     
    if (count>0 && flag ){
    console.log("redo_stack", redo_stack);
    canvas.loadFromJSON(redo_stack.pop(), canvas.requestRenderAll.bind(canvas));
    count--;
    }
    else {
      alert("you cannot do this");
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

  async function deletecanvas() {
    alert("Deleting Canvas elements");
    canvas.remove.apply(canvas, canvas.getObjects().concat());
    await updateStack();

  }
  if (canvas) {
    var isObjectMoving  = false;
    canvas.on('object:moving', function (event) {
      console.log("object moving");
       isObjectMoving = true;
    });
    
    canvas.on('mouse:up', function (event) {
      if (isObjectMoving){
        console.log("object stopped");
        isObjectMoving = false;
       updateStack();       
      } 
    });

  }

  async function pdf() {
    await updateStack();
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

  async function drawing() {

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

  async function createcircle() {
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
    await updateStack();
  }

  async function eraser() {
    canvas.isDrawingMode = false;
    canvas.remove(canvas.getActiveObject());
    await updateStack();

  }
  async function createrectangle() {
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
    await updateStack();
  }
  async function createline() {

    canvas.isDrawingMode = false;
    var line = new fabric.Line([30, 10, 20, 100], {
      stroke: 'blue',
      width: 10
    });
    canvas.add(line);
    await updateStack();
  }
  async function createtext() {
    canvas.isDrawingMode = false;
    let text = new fabric.Textbox('TEXT',
      {
        width: 450,
        editable: true,
        fill: 'white'
      });

    canvas.add(text);
    await updateStack();

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

    </div>
  )
}

export default Navbar
