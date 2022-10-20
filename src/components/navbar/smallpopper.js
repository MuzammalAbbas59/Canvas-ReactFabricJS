import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import "react-color-palette/lib/css/styles.css";
import './navbar.css'
import * as React from 'react';

function SPopper(props) {

 
  const [stroke, setstroke] = React.useState(props.selected.stroke);
  
  React.useEffect(()=>{
    props.selected.set({ "stroke": stroke });
    props.selected.canvas.renderAll();

  },[stroke])

  function handleChangeStroke(event) {
    setstroke(event.target.value);
  }

 
  
  return (
    <Card className='pops' >
      <div>
        <ListGroup style={{
          backgroundColor: 'white', width: '14rem', top: props.selected.top + "px",
          left: props.selected.left + props.selected.width + 70 + 'px', position: "absolute"
        }}
          variant="flush"> <br></br>
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

export default SPopper;