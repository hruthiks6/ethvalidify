import React, { useState } from "react";
import { Link } from "react-router-dom";

import {
  Typography,
  Paper,
  Box,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Fade,
} from "@material-ui/core";

import { makeStyles } from "@material-ui/core/styles";
import OpenInNewOutlinedIcon from "@material-ui/icons/OpenInNewOutlined";

import "./styles.css";

const useStyles = makeStyles((theme) => ({
 
  paper: {
    [theme.breakpoints.up("sm")]: {
      borderRadius: "5%",
      marginRight: 30,
    },
    [theme.breakpoints.up(1150)]: {
      marginLeft: 50,
      width: 500,
    },
    height: "100%",
    marginTop: theme.spacing.unit * 6,
    marginBottom: "40px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme
      .spacing.unit * 3}px`,
  },
}));

function ViewCert() {
  const [certId, setCertId] = useState("");
  const classes = useStyles();
  return (
    <>
    <center>
    <div id="viewcertificate">
      
      <Typography
        variant="h4"
        color="primary"
        align="center"
        style={{ marginTop: "30px",color: "white" }}
      >
        Welcome Employers
      </Typography>
      <Typography
        variant="subtitle2"
        color="secondary"
        align="center"
        style={{ marginTop: "30px",color: "white"}}
      >
       To view the cerificate, please enter the unique certificate id
      </Typography><br></br>
      <Grid 
        container
        style={{
          width: "50%",
          height: "80%",
          justifyContent: "center",
          alignItems: " center",
          backgroundColor: "rgb(24,25,25)",
          borderRadius: "10px"
        }}
        direction="column"
      >
        <Paper id="viewcert" className={classes.paper} style={{backgroundColor: "#fac002",borderRadius: "10px"}}>
          <Card
            style={{
              border: "1px solid #363b98",
              minWidth: "250px",
              minHeight: "70px",
            }}
          >
            <CardContent style={{ textAlign: "center",backgroundColor: "green" }}>
              <Typography variant="h5" color="primary" style={{color: "white"}}>
                View Certificate
              </Typography>
            </CardContent>
          </Card>
          <Box m={4} />
          <TextField
            id="outlined-basic"
            label="Certificate ID"
            variant="outlined"
            onChange={(e) => {
              setCertId(e.target.value);
            }}
            style={{ width: "400px" }}
          />
          <Box m={2} />
          {certId && (
            <>
              <Fade in={certId ? true : false} timeout={700}>
                <Box display="flex">
                  
                  <Button
                    variant="contained"
                    color="primary"
                    className={classes.button}
                    endIcon={<OpenInNewOutlinedIcon />}
                    onClick={() => {
                      window.open(
                        `${window.location.href.slice(
                          0,
                          -window.location.pathname.length
                        )}/certificate/${certId}`
                      );
                    }}
                  >
                    Open link
                  </Button>
                </Box>
              </Fade>
            </>
          )}
        </Paper>
       
        
      </Grid>

      <br></br>
      <br></br>
      <br></br>
      
      <Button id="button1"
                variant="contained"
                size="large"
                style={{ marginRight: "30px" }}
                component={Link}
                to="/"
              > Go back to Home
        </Button>

      
    </div>
    </center>
    </>
  );
}

export default ViewCert;
