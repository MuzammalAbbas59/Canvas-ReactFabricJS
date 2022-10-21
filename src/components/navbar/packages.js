import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import "react-color-palette/lib/css/styles.css";
import './navbar.css'
import * as React from 'react';
import CloseIcon from '@mui/icons-material/Close';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import AppleIcon from '@mui/icons-material/Apple';
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import canvasimg from './canvas.jpg'


function Packages({state, display}) {
  var img1src="https://cdn.pixabay.com/photo/2017/01/08/13/58/cube-1963036__480.jpg";
  var img2="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-ZXFJNSHRAcl6RQapZYW7AaV_1vKTbuchfA&usqp=CAU";
  var img3="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSR-DPGEm00cy7EyWNa0ijcav9TPMnX9_sO352bMtDbLW11h3d0HjUe6goz58PYZtFmh8Y&usqp=CAU"
  
  function dismisspopover() {
    state(false);
  }

  function clickimage(event){
   display(event.target.src); 
  }
  
  return (
    <div>
      <Card className='pkgs' >
        <div>
          <ListGroup style={{
            backgroundColor: '#eaeaea', width: '14rem', top: 50 + "px",
            left: 1010 + "px", position: "absolute"
          }}

            variant="flush"> <br></br>
            <div className='head'>
              <p className='heading1' id="pkg" > Packages : </p>
              <button onClick={dismisspopover} className='heading2' id="cross-button" >X </button>
            </div>
            <div className='heading1' style={{position: 'absolute'}} sx={{ fontSize: 24 }} component="div">
            <img onClick={clickimage} src={img1src} height='20px'/>
            </div >
            <p className='heading3' id="cross-button" >One</p>
            <div  className='heading1' style={{position: 'absolute'}} sx={{ fontSize: 18 }} component="div">
            <img onClick={clickimage} src={img2} height='20px'/>  
            </div>
            <p className='heading3' id="cross-button" >Two</p>
            <div className='heading1' style={{position: 'absolute'}} sx={{ fontSize: 18 }} component="div">
            <img onClick={clickimage} src={img3} height='20px'/>
            </div>
            <p className='heading3' id="cross-button" >Teen</p>
      
      </ListGroup>
       </div>
    </Card>

    </div >
  )
}

export default Packages
