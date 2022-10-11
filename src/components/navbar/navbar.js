import React, { useState, useEffect } from 'react';
import canvasimage from './canvas.jpg';
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



function Navbar() {
  let [canvas, setCanvas] = useState('');
  useEffect(() => {
    setCanvas(initCanvas());
  }, []);

  useEffect(() => {
    if (canvas) {
    }
  }, [canvas])

  const initCanvas = () => (
    new fabric.Canvas('mycanvas', {
      height: 1200,
      width: 800,
      backgroundColor: 'pink',
      selection: true,

    })
  );


    var circle = new fabric.Circle({
      radius: 15,
      fill: 'blue',
      left: 100,
      top: 100,
      stroke: "red",
      selectable: true,
      hasControls: true
    });
    circle.hasRotatingPoint = true;


    var rectangle = new fabric.Rect({
      width: 200,
      selection: true,
      height: 100,
      fill: 'black',
      stroke: 'green',
      strokeWidth: 3
    });


    var line = new fabric.Line([30, 10, 20, 100], {
      stroke: 'blue',
      width: 10
    });


    let text = new fabric.Textbox('TEXT',
      {
        width: 450,
        editable: true,
        fill: 'white'
      });

    function zoomOut() {
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
      setCanvas(initCanvas);
    }

    function pdf() {
      alert('Exporting to print/pdf');
      const domElement = document.getElementById("mycanvas");
      html2canvas(domElement, {
      }).then(canvas => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPdf();
        pdf.addImage(imgData, "JPEG", 0, 0);
        pdf.save(`${new Date().toISOString()}.pdf`);
      });
    }

    function drawing() {

      console.log("inside function", canvas);
    }

    console.log("outside function: ", canvas);

    function zoomIn() {

      if (canvas.getZoom().toFixed(5) > 2) {
        alert("cannot zoomIN more")
        return;
      }
      canvas.setZoom(canvas.getZoom() * 1.1);
      canvas.setHeight(canvas.getHeight() * 1.1);
      canvas.setWidth(canvas.getWidth() * 1.1);
    }

    function createcircle() {
      canvas.add(circle);
      canvas.renderAll();
    }
    function createrectangle() {
      rectangle.hasControls = true;
      canvas.add(rectangle);
      canvas.renderAll();
    }
    function createline() {
      canvas.add(line);

    }
    function createtext() {
      canvas.add(text);
    }

    const addRect = canvi => {
      const rect = new fabric.Rect({
        height: 280,
        width: 200,
        fill: 'yellow'
      });
      canvi.add(rect);
      canvi.renderAll();
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
        <div className="navbar-icons" id="undo">
          <UndoIcon />
        </div>

        <div className="navbar-icons" id="redo">
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
        <div className="navbar-icons" id="erase">
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
