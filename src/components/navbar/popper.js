import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import "react-color-palette/lib/css/styles.css";
import './navbar.css'
import * as React from 'react';
import Slider from '@mui/material/Slider';
import { useMount } from './custom-hooks.js'

function Popper(props) {


  const [color, setcolor] = React.useState('');
  const [stroke, setstroke] = React.useState(props.selected.stroke);
  const [opacity, setopacity] = React.useState(props.selected.opacity * 100);
  console.log("clr",color);
  useMount(() => {
    setcolor(props.selected.fill);

  });



  const convertHexToRGBA = (hexCode, opacity = 1) => {
    let hex = hexCode.replace('#', '');
  
    if (hex.length === 3) {
      hex = `${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`;
    }
  
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
  
    /* Backward compatibility for whole number based opacity values. */
    if (opacity >= 1 && opacity <= 100) {
      opacity = opacity / 100;
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
      b = parseInt(trim(inParts[2]), 10)
     a = parseFloat(trim(inParts[3].substring(0, inParts[3].length - 1))).toFixed(2);
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
    // props.selected.canvas.renderAll();

  }
  function handleChangeColor(event) {  
    setcolor(event.target.value);
    props.selected.set({ "fill": (color) });
    props.selected.canvas.renderAll();
   
  }
  function handleChangeStroke(event) {
    setstroke(event.target.value);
    props.selected.set({ "stroke": stroke });
    props.selected.canvas.renderAll();
  }
  function handleChangeOpacity(event) {
    setcolor(color);
    setopacity((event.target.value));
    console.log("opacaityyy", opacity);
    setmethod(color, opacity);
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
            defaultValue={opacity}
            value={opacity}
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