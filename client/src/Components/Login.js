import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Link } from "react-router-dom";
import "./styles.css";
import {Button, Typography,Card,CardContent} from "@material-ui/core";
import {ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";



const Login = () => {
 

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const history = useHistory();

  const handleLogin = (e) => {
    e.preventDefault();

    if (username == "" && password == "") {
      
      toast.warning(' please enter username and password');
    } 
    else if (username === 'username' && password === 'password') {

      history.push('/admin');
    } else {
   
      toast.error('Invalid username or password');
    }
  };

  return (
    <div style={{backgroundColor: "rgb(24,25,25)", color: "white"}}>
        <center>
          <br></br><br></br>
          <Typography>
          <h1>Welcome to Central Authority Login</h1><br></br>
          Please enter username and password to login into Central Authority Portal
          <br></br><br></br>
          <form onSubmit={handleLogin} id="form"><br></br>
          <Card
            style={{
              border: "1px solid #363b98",
              width: "70%"
            }}
          >
            <CardContent style={{ textAlign: "center",backgroundColor: "green" }}>
              <Typography variant="h5" color="primary" style={{color: "white"}}>
                Central Authority Login
              </Typography>
            </CardContent>
          </Card>
          <br></br>
            <label style={{color: "#997601"}}>
              username:
              <input
                type="text"
                value={username}
                style={{height: "20px",backgroundColor: "#fac002"}}
                onChange={(e) => setUsername(e.target.value)}
              />
            </label>
            <br></br><br></br>
            <label style={{color: "#997601"}}>
              password:
              <input
                type="password"
                value={password}
                style={{height: "20px",backgroundColor: "#fac002"}}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
            <br></br><br></br>
            <Button type="submit"
              style={{backgroundColor:"#068402", width:"30%",color: "white"}}
            >Login
            </Button>
            <br></br> <br></br>
          </form>
          </Typography>
        <br></br><br></br>
        <Button id="button1"
                variant="contained"
                size="large"
               
                component={Link}
                to="/"
              > 
                GO BACK TO HOME
        </Button>
        </center>
        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        
        </div>
        
        
    
  );
};

export default Login;
