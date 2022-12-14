import "react-color-palette/lib/css/styles.css";
import '../navbar/navbar.css'
import * as React from 'react';
import Slider from '@mui/material/Slider';
import { useState,useEffect} from 'react';

function Popper({selected,zoom}) {
  console.log("select",selected);
  var FillColor = selected?.fill || '#000000';
  var opacityyy = FillColor.substring(7, 9);
  var FillOpacity = parseInt(opacityyy, 16);
  if (!FillOpacity) {
    FillOpacity = 254;
  }
  
useEffect(()=>{
setColor(FillColor.substring(0,7));
setStrokeWidth(selected.strokeWidth);
setOpacity(FillOpacity);
setStroke(selected.stroke);
},[selected])
  
  const [color, setColor] = useState(FillColor.substring(0, 7));
  const [opacity, setOpacity] = useState(FillOpacity);
  const convertHexToRGBA = (hexCode, opacity = 1) => {
    let hex = hexCode.replace('#', '');
    if (hex.length === 3) {
      hex = `${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`;
    }
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    if (opacity >= 1 && opacity <= 255) {
      opacity = opacity / 255;
    }
    return `rgba(${r},${g},${b},${opacity})`;
  };

  function trim(str) {
    return str.replace(/^\s+|\s+$/gm, '');
  }
  function rgbaToHex(rgba) {
    var inParts = rgba.substring(rgba.indexOf("(")).split(","),
      r = parseInt(trim(inParts[0].substring(1)), 10),
      g = parseInt(trim(inParts[1]), 10),
      b = parseInt(trim(inParts[2]), 10),
      a = parseFloat(trim(inParts[3].substring(0, inParts[3].length - 1))).toFixed(1);
    var outParts = [
      r.toString(16),
      g.toString(16),
      b.toString(16),
      Math.round(a * 255).toString(16).substring(0, 2)
    ];
    outParts.forEach(function (part, i) {
      if (part.length === 1) {
        outParts[i] = '0' + part;
      }
    })
    return ('#' + outParts.join(''));
  }

  function setColorOpacity(colorobj, opacityobj) {
    var newcol = convertHexToRGBA(colorobj.toString(), opacityobj)
    selected.set({ "fill": (rgbaToHex(newcol)) });
    selected.canvas.renderAll();
  }

  function handleChangeColor(event) {
    setColor(event.target.value);
    setColorOpacity(color, (opacity));
  }

  function handleChangeOpacity(event) {
    setOpacity(event.target.value);
    setColorOpacity(color, (opacity / 255));
  }

 
  const [strokeWidth,setStrokeWidth]=useState(selected.strokeWidth);
  function handleChangeStrokeWidth(event) {
    setStrokeWidth(event.target.value); 
    selected.set({ "strokeWidth": parseInt(event.target.value)});
    selected.canvas.renderAll();
  }

  const [stroke, setStroke] = useState(selected.stroke);
  function handleChangeStroke(event) {
    setStroke(event.target.value);    
    selected.set({ "stroke": stroke });
    selected.canvas.renderAll();
  }

  return (
    <div className='pops' style={{
      top: (selected.top) * (zoom) + "px", left: ((selected.left + selected.width + 70) * (zoom)) + 'px', position: "absolute"
    }}>
      {selected?.type != "path" &&
        <div>
          <div>
            <label>Color:</label> <br />
            <input style={{ width: 200 }} type="color" onChange={handleChangeColor} value={color} ></input>
          </div>
          <div>
            Opacity:<br />
            <Slider sx={{ maxWidth: 200 }}
              aria-label="Opacity"
              value={opacity}
              max={255}
              min={11}
              onChange={handleChangeOpacity}
              color="primary"
            /> <br />
          </div>
        </div>
      }

      <label>Stroke:</label>
      <input style={{ width: 200 }} type="color"
        onChange={handleChangeStroke} value={stroke} ></input>
      
      <label>Stroke Width:</label>
      <input style={{ width: 200 }} type="range" min={1} max={100}
        onChange={handleChangeStrokeWidth} value={strokeWidth} ></input>



{/* <Slider sx={{ maxWidth: 200 }}
              aria-label="Stroke Width"
              value={strokeWidth}
              max={100}
              min={1}
              step={1}
              onChange={handleChangeStrokeWidth}
              color="primary"
            /> <br /> */}

    </div>

  );
}

export default Popper;