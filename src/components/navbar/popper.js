import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import "react-color-palette/lib/css/styles.css";
import './navbar.css'
import * as React from 'react';
import Slider from '@mui/material/Slider';

function Popper(props) {
  function handleChangeColor(event) {
    props.selected.set({ "fill": event.target.value });
    props.selected.canvas.renderAll();
  }
  function handleChangeStroke(event) {
    props.selected.set({ "stroke": event.target.value });
    props.selected.canvas.renderAll();
  }
  function handleChangeOpacity(event) {
     props.selected.set({ "opacity": event.target.value/100 });
     props.selected.canvas.renderAll();
  }
  return (
    <Card className='pops' >
      <div>
        <ListGroup style={{
          backgroundColor: 'white', width: '14rem', top: props.selected.top + "px",
          left: props.selected.left + props.selected.width + 10 + 'px', position: "absolute"
        }}
          variant="flush"> <br></br>
          <label>Color:</label> <br></br>
          <ListGroup.Item><input style={{ width: 200 }} type="color"
            onChange={handleChangeColor}
            id="favcolor" name="favcolor" ></input></ListGroup.Item> <br></br>

          Opacity:<br></br>
          <Slider sx={{ maxWidth: 200 }}
            aria-label="Opacity"
            defaultValue={99}
            onChange={handleChangeOpacity}
            color="primary"
          />
          <br></br>
          <label>Stroke:</label>
          <ListGroup.Item> <input style={{ width: 200 }} type="color"
            onChange={handleChangeStroke}
            id="favcolor" name="favcolor"></input></ListGroup.Item>

        </ListGroup>
      </div>
      <br></br>

    </Card>

  );
}

export default Popper;