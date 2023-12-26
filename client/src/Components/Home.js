import React from "react";
import { Link } from "react-router-dom";
import "./styles.css";
import myImage from '../Images/logo.jpg';
import {Button} from "@material-ui/core";

function Home() {
  return (
          <>
              <div class="navbar">
                  <img src={myImage} alt="Example" width="10%" height="10%" id="img"/>
                      <div class="inbox1">
                          <a href="#home">ETHVALIDIFY</a>
                      </div>

                      <Button id="button3"
                              variant="contained"
                              size="large"
                              style={{ marginRight: "30px" }}
                              component={Link}
                              to="/login"
                            > Central Authority Login
                      </Button>
              </div>



              <div id="home" >
                <center>
              
                  <div id="content">
                    <br></br> <br></br>
                    Welcome to Ethvalidify<br></br><br></br>
                    Certificate-Validation using Blockchain<br></br> <br></br><br></br>
                  
                    This project involves the design and development of a blockchain-based certificate validation 
                    system using smart contracts and distributed ledger technology. The system will enable academic 
                    institutions to issue digital certificates as unique, tamper-proof records stored on the blockchain. 
                    Through consensus mechanisms, the integrity and authenticity of certificates can be verified by relevant 
                    stakeholders, including potential employers, academic institutions, and certificate holders.
                  </div>
                  
                  <br></br><br></br><br></br>

                  <div id="button-container">

                    <Button id="button1"
                      variant="contained"
                      size="large"
                      style={{ marginRight: "30px" }}
                      component={Link}
                      to="/institute"
                    > 
                     ISSUE CERTIFICATE
                    </Button>

                    <Button id="button2"
                      variant="contained"
                      color="default"
                      size="large"
                      component={Link}
                      to="/view"
                    >
                     VALIDATE CERTIFICATE
                    </Button>

                  </div>

                </center>
              </div>
      

    </>
  );
}
export default Home;