import "react-color-palette/lib/css/styles.css";
import * as React from 'react';
import { fabric } from 'fabric';
import { useEffect } from "react";

function Packages({ state, canvas }) {
  var img1src = "https://cdn.pixabay.com/photo/2017/01/08/13/58/cube-1963036__480.jpg";
  var img2 = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-ZXFJNSHRAcl6RQapZYW7AaV_1vKTbuchfA&usqp=CAU";
  var img3 = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSR-DPGEm00cy7EyWNa0ijcav9TPMnX9_sO352bMtDbLW11h3d0HjUe6goz58PYZtFmh8Y&usqp=CAU"

  function displayImageOnClick(event) {
    if(event.target.className=="package-image"){
    fabric.Image.fromURL(event.target.src, function (myImg) {
      var img1 = myImg.set({ left: 50, top: 20 });
      img1.scaleToWidth(50)
      img1.scaleToHeight(50)
      canvas.add(img1);
    });
  }
  }
  
useEffect(()=>{

  const handleDrop = event => {
        console.log(event);  
      }
canvas.on("dragover",handleDrop)
    },[canvas]);

  function imageDropOnDrag(e) { 
    e.dataTransfer.setData("id", e.target.id);
  }

  return (
    <div className='pkgs' style={{
      backgroundColor: '#eaeaea', width: '14rem', top: 50 + "px",
      left: 1010 + "px", position: "absolute"
    }} >
      <div className='head'>
        <p className='heading1' id="pkg" > Packages : </p>
        <button onClick={e => state(false)} className='heading2' id="cross-button" >X </button>
      </div>
      <div className='heading1' style={{ position: 'absolute' }} sx={{ fontSize: 24 }} component="div">
        <img onClick={displayImageOnClick} draggable="true" src={img1src} className="package-image"
          height='20px' />
      </div >
      <p className='heading3' id="cross-button" >One</p>
      <div className='heading1' style={{ position: 'absolute' }} sx={{ fontSize: 18 }} component="div">
        <img onClick={displayImageOnClick} draggable="true" src={img2} className="package-image"
         onDragStart={event => imageDropOnDrag(event)} 
         height='20px' />
      </div>
      <p className='heading3' id="cross-button" >Two</p>
      <div className='heading1' style={{ position: 'absolute' }} sx={{ fontSize: 18 }} component="div">
        <img onClick={displayImageOnClick} draggable="true" className="package-image"
        // onDragStart={event => imageDropOnDrag(event)}
          src={img3} height='20px' />
      </div>
      <p className='heading3' id="cross-button" >Teen</p>
    </div>
  )
}

export default Packages
