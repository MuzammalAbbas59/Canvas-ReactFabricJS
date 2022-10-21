import React, { useState, useEffect } from 'react';
import { fabric } from 'fabric';
import './navbar.css'
import icons from "../Icons"
// import ZoomOutIcon from '@mui/icons-material/ZoomOut';
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
import SPopper from './smallpopper';
import Packages from './packages';


function Navbar() {
  var count = 0;
  let [stack, setStack] = useState([]);
  var flag = false;
  let [canvas, setCanvas] = useState(null);
  let [selected, setselected] = useState(null);
  const [popperstate, setpopperstate] = useState(false);
  const [spopperstate, setspopperstate] = useState(false);

  const [isdraw, setisdraw] = useState(false);
  const [erase, seterase] = useState(false);
  useMount(() => {
    setCanvas(initCanvas());
  });

  const initCanvas = () => (
    new fabric.Canvas('mycanvas', {
      height: 1200,
      width: 850,
      backgroundColor: "lightgray",
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
    seterase(false);
    setisdraw(false);
    flag = true;
    if (count == stack.length - 1) {
      alert("you are latest stage");
    }
    else {
      count++;
      canvas.loadFromJSON(stack.at(count), canvas.requestRenderAll.bind(canvas));
    }
  }

  function setZoomCanvas(event,params) {
    updateStates();
    if (params=="zoomin"){
    if (canvas.getZoom().toFixed(5) > 2) {
      alert("cannot zoomIN more")
      return;
    }
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

  function deletecanvas() {
    alert("Deleting Canvas elements");
    canvas.remove.apply(canvas, canvas.getObjects().concat());
    updateStates();
   
  }

  function checkmovement() {
    var isObjectMoving = false;
    canvas.on('object:moving', function (event) {
      isObjectMoving = true;
      setpopperstate(false);
      setspopperstate(false);

    });

    canvas.on('mouse:up', function (event) {
      if (isObjectMoving) {
        isObjectMoving = false;
        if (event.target) {
          updateStack();
        }
        if (event.target.fill) {
          setspopperstate(false);
          setpopperstate(true);

        }

        if (!event.target.fill) {
          setpopperstate(false);
          setspopperstate(true);
        }
      }
    });
  }

  useEffect(() => {
    if (canvas) {

      const handleClick = event => {
        if (!event.target) {
          setpopperstate(false);
          setspopperstate(false);

        }
        else {
          // if (event.target.stroke){
          if (event.target.fill) {
            setselected(event.target);
            setpopperstate(crr => !crr);
            checkmovement();
          }
          else {
            // debugger;
            setselected(event.target);
            setspopperstate(crr => !crr);
            setpopperstate(false);
            checkmovement();
          }
          // }
        }
      }

      // console.log("erase", erase);
      if (erase == false) {
        console.log("event called")
        canvas.on('mouse:down', handleClick);
      }
      else {
        console.log("Eraser now", erase)
        canvas.off('mouse:down');
      }
    }
  }, [canvas, erase]);


  function pdf() {
    updateStates();
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

  function eraser() {
    setpopperstate(false);
    setspopperstate(false);
    canvas.isDrawingMode = false;
    setisdraw(false);
    // updateStates();
    seterase(erase => !erase);
    console.log(erase)
  }

  useEffect(() => {
    if (canvas) {
      // debugger;
      const handleClick = event => {
        canvas.remove(canvas.getActiveObject());
        setpopperstate(false);
        setspopperstate(false);

        updateStack();
      }
      if (erase) {

        alert("Erasing mode is on");
        canvas.on('mouse:down', handleClick); /// common events
      }
      else {

        canvas.off('mouse:down');
        alert("Erasing mode is off");

      }
    }
  }, [erase])

  function drawing() {
    seterase(false);
    canvas.isDrawingMode = !isdraw
    setisdraw(crr => !crr);
  }
  // useEffect(() => {
  //   if (canvas) {
  //     const handleClick = event => {
  //       if (event.target) {
  //         updateStack();
  //       }
  //     }
  //     if (isdraw) {
  //       alert("drawing mode is on");
  //       canvas.isDrawingMode = true;
  //       canvas.on('mouse:up', handleClick);
  //     }
  //     else {
  //       alert("drawing mode stopped");
  //       canvas.isDrawingMode = false;
  //       canvas.off('mouse:up');
  //     }
  //   }
  // }, [isdraw])

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

  function updateStates(){
    seterase(false);
    setisdraw(false);
    updateStack();
  }

  const [pkg, setpkg] = useState(false);


  function display(imgElement) {
    console.log(imgElement);
    fabric.Image.fromURL(imgElement, function (myImg) {
      var img1 = myImg.set({ left: 50, top: 20, width: 50, height: 50 });
      canvas.add(img1);
    });
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
    updateStates();
    
  }

  return (
    <div>
      <div className='Container navbar '>
        <icons.ZoomOutIcon onClick={event=>setZoomCanvas(event,"zoomout")} className="navbar-icons" id="Zoomout" />
        <icons.ZoomInIcon onClick={event=>setZoomCanvas(event,"zoomin")}className="navbar-icons" id="ZoomIn" />
        <div className="divider-icon"/>
        <icons.UndoIcon onClick={undo} className="navbar-icons"  />
        <icons.RedoIcon onClick={redo} className="navbar-icons"/>
        <div className="divider-icon"/>
        <icons.TextFormatIcon onClick={createtext} className="navbar-icons"/>
        <icons.HorizontalRuleIcon onClick={createline} className="navbar-icons"/>
        <icons.PanoramaFishEyeIcon  onClick={createcircle} className="navbar-icons"/>
        <icons.Crop169Icon  onClick={createrectangle} className="navbar-icons"/>
        <div className="divider-icon"/>
        <icons.CreateIcon  onClick={drawing} className="navbar-icons"/>
        <icons.RemoveCircleOutlineIcon   onClick={eraser} className="navbar-icons"/>
        <icons.DeleteForeverOutlinedIcon   onClick={deletecanvas} className="navbar-icons"/>
        <div className="divider-icon"/>
        <icons.OpenInNewIcon    onClick={pdf} className="navbar-icons"/>
        <icons.LocalPrintshopOutlinedIcon onClick={pdf} className="navbar-icons"/>

        <div className="nav-buttons">
          <button onClick={() => { setpkg(crr => !crr) }} className="buttons" id="packages-button">
            <div>< CardGiftcardIcon /> </div>  Packages   </button>
          <button className="buttons" id="Save-button"><div><SaveRoundedIcon /> </div> Save</button>
        </div>
      </div>

      <canvas id="mycanvas" />
      {popperstate &&
        <Popper selected={selected} />
      }
      {spopperstate &&
        <SPopper selected={selected} />
      }
      {pkg &&
        <Packages state={setpkg} display={display} />
      }
    </div>
  )
}

export default Navbar
