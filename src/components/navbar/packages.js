import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import "react-color-palette/lib/css/styles.css";
import './navbar.css'
import * as React from 'react';

function Packages() {
    const [crossstate,setcrossstate]=React.useState(false);
  
 function dismisspopover(){
    alert("packages ko off kr do");
    setcrossstate(false);
 }
  return (
    <div>
     <Card className='pkgs' >
      <div>
        <ListGroup style={{
          backgroundColor: '#eaeaea', width: '14rem', top:50+"px",
          left:1010+"px", position: "absolute"
        }}
        
          variant="flush"> <br></br>
          <div className='head'>
         <p className='heading1' id="pkg" > Packages : </p>
         <button onClick={dismisspopover} className='heading2' id="cross-button" >X </button>  
         </div>

         <div className='head'>
         <div onClick={redo} className="navbar-icons" id="redo">
        </div>  
         <p> abc </p>
        
         </div>
        </ListGroup>
      </div>
      <br></br>

    </Card>

    </div>
  )
}

export default Packages
