import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import "react-color-palette/lib/css/styles.css";
import './navbar.css'
import * as React from 'react';
import Slider from '@mui/material/Slider';
import { useMount } from './custom-hooks.js'

function Popper(props) {

 var colorch=props.selected.fill;

 var fill=colorch.substring(0,7);
 var opacityyy=colorch.substring(7,9);
 var k=parseInt(opacityyy,16);
 if (!k){
  k=254;
 }
  const [color, setcolor] = React.useState(fill);
  const [stroke, setstroke] = React.useState(props.selected.stroke);
  const [opacity, setopacity] = React.useState(k);

  const convertHexToRGBA = (hexCode, opacity = 1) => {
    let hex = hexCode.replace('#', '');
  
    if (hex.length === 3) {
      hex = `${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`;
    }
  
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
  
    /* Backward compatibility for whole number based opacity values. */
    if (opacity >= 1 && opacity <= 255) {
      opacity = opacity / 255;
      // console.log("opacityyy",opacity);
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
    //  console.log("opacity fun",a);
     var n=a*100;
    //  console.log('n',n);
     
     var outParts = [
      r.toString(16),
      g.toString(16),
      b.toString(16),
      Math.round(a * 255).toString(16).substring(0, 2)
    ];
  
    // Pad single-digit output values
    outParts.forEach(function (part, i) {
      if (part.length === 1) {
        outParts[i] = '0' + part;
      }
    })
  
    return ('#' + outParts.join(''));
  }
  
  function setmethod(colorobj, opacityobj) {

    var tostring = colorobj.toString();
    var newcol = convertHexToRGBA(tostring, opacityobj)
    var ans= rgbaToHex(newcol)
    props.selected.set({ "fill": (ans) });

  }

  React.useEffect(()=>{

    setmethod(color, (opacity));
    props.selected.canvas.renderAll();
   
  },[color])
  function handleChangeColor(event) {  
    setcolor(event.target.value);
    // props.selected.canvas.renderAll();


// props.selected.set({ "fill": (color) });
   
  }
  function handleChangeStroke(event) {
    setstroke(event.target.value);
    props.selected.set({ "stroke": stroke });
    props.selected.canvas.renderAll();
  }

 
  function handleChangeOpacity(event) {
    console.log("props",props.selected.fill);
    setcolor(color);
    var a=((event.target.value));
    setopacity(a);
    setmethod(color, (opacity/255));
    props.selected.canvas.renderAll();

  }
  return (
    <Card className='pops' >
      <div>
        <ListGroup style={{
          backgroundColor: 'white', width: '14rem', top: props.selected.top + "px",
          left: props.selected.left + props.selected.width + 70 + 'px', position: "absolute"
        }}
          variant="flush"> <br></br>
          <label>Color:</label> <br></br>
          <ListGroup.Item><input style={{ width: 200 }} type="color"
            onChange={handleChangeColor}
            id="favcolor" name="favcolor" value={color} ></input></ListGroup.Item> <br></br>
          {/* {console.log("input")} */}
          Opacity:<br></br>
          <Slider sx={{ maxWidth: 200 }}
            aria-label="Opacity"
            // defaultValue={opacity}
            value={opacity}
            max={255}
            min={11}
            onChange={handleChangeOpacity}
            color="primary"
          />
          <br></br>
          <label>Stroke:</label>
          <ListGroup.Item> <input style={{ width: 200 }} type="color"
            onChange={handleChangeStroke}
            id="favcolor" name="favcolor" value={stroke} ></input></ListGroup.Item>

        </ListGroup>
      </div>
      <br></br>

    </Card>

  );
}

export default Popper;