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
    seterase(false);
    setisdraw(false);
    setpopperstate(false);
    setspopperstate(false);

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

  function zoomOut() {
    console.log("start zoom", stack);
    canvas.isDrawingMode = false;
    seterase(false);
    setisdraw(false);
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
    seterase(false);
    setisdraw(false);
    setpopperstate(false);
    setspopperstate(false);

    canvas.remove.apply(canvas, canvas.getObjects().concat());
    updateStack();
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
          if (event.target.stroke){
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
        }
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
    updateStack();
    canvas.isDrawingMode = false;
    seterase(false);
    setisdraw(false);
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

  function zoomIn() {
    canvas.isDrawingMode = false;
    seterase(false);
    setisdraw(false);
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
      radius: 45,
      fill: '#0000FF',
      left: 100,
      top: 100,
      stroke: "#7DF9FF",
      selectable: true,
      hasControls: true
    });
    canvas.add(circle);
    seterase(false);
    setisdraw(false);
    updateStack();
    setspopperstate(false);
  }

  function eraser() {
    setpopperstate(false);
    setspopperstate(false);

    canvas.isDrawingMode = false;
    setisdraw(false);
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
        canvas.on('mouse:down', handleClick);
      }
      else {

        canvas.off('mouse:down');
        alert("Erasing mode is off");

      }
    }
  }, [erase])

  function drawing() {
    seterase(false);
    setisdraw(crr => !crr);
  }
  useEffect(() => {
    if (canvas) {
      const handleClick = event => {
        if (event.target) {
          updateStack();
        }
      }
      if (isdraw) {
        alert("drawing mode is on");
        canvas.isDrawingMode = true;
        canvas.on('mouse:up', handleClick);
      }
      else {
        alert("drawing mode stopped");
        canvas.isDrawingMode = false;
        canvas.off('mouse:up');
      }
    }
  }, [isdraw])

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
    seterase(false);
    setisdraw(false);
    setspopperstate(false);
    updateStack();
  }

  function createline() {
    canvas.isDrawingMode = false;
    var line = new fabric.Line([30, 10, 20, 100], {
      stroke: '#0000FF',
      width: 30
    });
    canvas.add(line);
    seterase(false);
    setisdraw(false);

    updateStack();
  }

  const [pkg, setpkg] = useState(false);


  function display(imgElement){
    console.log(imgElement);
    fabric.Image.fromURL(imgElement, function(myImg) {
      //i create an extra var for to change some image properties
      var img1 = myImg.set({ left: 50, top: 20 ,width:50,height:50});
      canvas.add(img1); 
     }); 
  }

  function packageCall() {
    setpkg(crr=>!crr);
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
    seterase(false);
    setisdraw(false);
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
          <div onClick={packageCall} className="buttons" id="packages-button">
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
        <Popper selected={selected} />
      }
      {spopperstate &&
        <SPopper selected={selected} />
      }
      {pkg &&  
       <Packages  state={setpkg} display={display}/>
      }
    </div>
  )
}

export default Navbar
