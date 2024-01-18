import React from "react";
import { Link } from "react-router-dom";
import Institution from "../contracts/Institution.json";
import Web3 from "web3";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import { Loader } from "./Loader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./styles.css";

import {
  ListItemText,
  withStyles,
  Box,
  Card,
  CardContent,
  IconButton,
} from "@material-ui/core";

import DeleteIcon from "@material-ui/icons/DeleteOutlined";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import PropTypes from "prop-types";
import FormControl from "@material-ui/core/FormControl";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";

const ListText = withStyles({
  primary: {
    fontSize: "1.5vh",
    padding: "0.5vh",
    margin: 0,
    width: "90%",
  },
})(ListItemText);

const styles = (theme) => ({
  container: {
    display: "flex",
  },
  paper: {
    [theme.breakpoints.up("sm")]: {
      borderRadius: "5%",
     
    },
    [theme.breakpoints.up(1150)]: {
     
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
  form: {
    width: "100%", 
  },
  submit: {
    marginTop: theme.spacing.unit * 3,
  },
  media: {
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme
      .spacing.unit * 3}px`,
  },
  courseItem: {
    width: "90%",
    background: "#73737312",
    borderRadius: "100px",
    marginBottom: "10px",
    paddingLeft: "25px",
    marginBottom: "10px",
    border: "1px solid #d8d8d8",
  },
});

class Admin extends React.Component {
  state = {
    owner: "0x0",
    isOwner: false,
    institution: {},
    renderLoading: true,
    renderAdmin: false,
    renderMetaMaskError: false,
    networkError: false,
    instituteAddress: "",
    instituteName: "",
    instituteAcronym: "",
    instituteWebsite: "",
    course: "",
    instituteCourses: new Map(),
    openDialog: false,
    openCourseDialog: false,
    instituteSubmitted: false,
  };

  async componentWillMount() {
    await this.loadWeb3Metamask();
    await this.loadBlockChainDataAndCheckAdmin();
  }

  async loadWeb3Metamask() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } 
  }

  
  async loadBlockChainDataAndCheckAdmin() {
    const web3 = window.web3;
    
    try {
      const accounts = await web3.eth.getAccounts();
      let caller = accounts[0];
      console.log("caller", caller);

      const networkId = await web3.eth.net.getId();
      

     
      // Load institution contract
      const institutionData = Institution.networks[networkId];
      if (institutionData) {
        // create a web3 version of the contract
        const institution = new web3.eth.Contract(
          Institution.abi,
          institutionData.address
        );
       
        this.setState({ institution });
        try {
          // get owner of smart contract
          let smartContractOwner = await institution.methods.owner().call();
          
          // compare the caller and the owner of smart contract
          if (caller == smartContractOwner) {
            // give access to the page
            this.setState({
              renderLoading: false,
              renderMetaMaskError: false,
              renderAdmin: true,
            });
          } 
        } catch (error) {
          console.log("error is", error);
        }
      } else {
        // window.alert("Institution contract not deployed to network");
      
        this.setState({
          renderLoading: false,
          renderMetaMaskError: true,
          renderAdmin: false,
        });
      }
    } catch {
      // window.alert('No accounts detected')
      console.log("no accounts detected");

      // When this block is reached, most likely due to user on wrong network
      console.log("You are on the wrong network!");
      toast.warning(
        "❕ Please make sure you are connected to the correct network"
      );
      this.setState({
        renderLoading: false,
        renderMetaMaskError: false,
        renderAdmin: false,
        networkError: true,
      });
    }
  }

 
  

  clearValues() {
    console.log("clearing values");
  }

  async addInstituteToBlockchain() {
    console.log("Adding institute to the blockchain");
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    let caller = accounts[0];
    // instantiate the contract (---can't maintain it in a state for some reason, need to check again later----)
    const networkId = await web3.eth.net.getId();
    const institutionData = Institution.networks[networkId];
    const institution = new web3.eth.Contract(
      Institution.abi,
      institutionData.address
    );
    const convertToBlockChainStruct = [];

    this.state.instituteCourses.forEach((value, key) => {
      convertToBlockChainStruct.push({ course_name: value });
    });

    const provider = window.ethereum;
    provider.on("receipt", this.clearValues);

    try {
      // get owner of smart contract
      let smartContractOwner = await institution.methods.owner().call();

      // compare the caller and the owner of smart contract
      if (caller == smartContractOwner) {
        await institution.methods
          .addInstitute(
            this.state.instituteAddress,
            this.state.instituteName,
            this.state.instituteAcronym,
            this.state.instituteWebsite,
            convertToBlockChainStruct
          )
          .send({ from: caller })
          .on("receipt", function(receipt) {
            console.log(receipt);
            console.log(receipt.events);
          })
          .then((res) => {
            this.clearValues();
            this.setState({
              openDialog: false,
              instituteAddress: "",
              instituteName: "",
              instituteAcronym: "",
              instituteWebsite: "",
              instituteCourses: new Map(),
              course: "",
            });
            // alert("Successfully added institute!");
            toast.success("✅ Successfully added institute!");
          });
      } else {
        // window.alert("Not the account used to deploy smart contract");
        toast.warning("❕ Not the account used to deploy smart contract");
      }
    } catch (error) {
      console.log(error);
      console.log(error.code);
      if (error.code == -32603) {
        // window.alert("Institute account already exits");
        toast.error("❌ Institute account already exits!");
      } else if (error.code == 4001) {
        // window.alert("Transaction rejected");
        toast.warning("❕ Transaction rejected!");
      } else {
        // window.alert("Institute account address is not legit");
        // toast.error("❌ Institute account address is not legit!");
        toast.error("❌ Institute account already exits! Please check again!"); // Temporarily added to handle duplicate institute test case on rinkeby, that is not -32603
      }
    }
  }

  check() {
    console.log(this.state.instituteCourses);
  }

  handleChange = (name) => (event) => {
    this.setState({
      [name]: event.target.value,
    });
  };

  addToCourseMap() {
    if (!this.state.course) {
      toast.warning("Please enter a course name");
      return;
    }
    this.handleCloseCourse();
    if (this.state.instituteCourses.size === 0) {
      let id = 1;
      this.setState({
        instituteCourses: new Map(
          this.state.instituteCourses.set(id, this.state.course)
        ),
        course: "",
      });
    } else {
      let instituteCoursesKeys = [...this.state.instituteCourses.keys()];
      let id = Math.max(...instituteCoursesKeys) + 1;
      this.setState({
        instituteCourses: new Map(
          this.state.instituteCourses.set(id, this.state.course)
        ),
        course: "",
      });
    }
  }

  deleteCourse(keyToDelete) {
    console.log("delete getting called");
    const courses = new Map(
      [...this.state.instituteCourses].filter(([k, v]) => k != keyToDelete)
    );
    this.setState({
      instituteCourses: courses,
    });
  }

  handleClickOpenCourse = () => {
    this.setState({
      openCourseDialog: true,
    });
  };

  handleCloseCourse = () => {
    this.setState({
      openCourseDialog: false,
    });
  };

  openDialog() {
    this.setState({
      openDialog: true,
    });
  }

  closeDialog() {
    this.setState({
      openDialog: false,
    });
  }

  dialogCourses() {
    let listOfCourses = [];
    console.log(this.state.instituteCourses);
    this.state.instituteCourses.forEach((value, key) => {
      listOfCourses.push(value);
    });
    console.log(listOfCourses);
    return listOfCourses;
  }

  render() {
    const { classes } = this.props;
    const {
      renderLoading,
      renderAdmin,
      networkError,
      course,
      instituteWebsite,
      instituteAddress,
      instituteAcronym,
      instituteName,
      instituteCourses,
      openDialog,
    } = this.state;
    return (
      <><div id="administrator" style={{backgroundColor: "rgb(24,25,25)"}}>
        {renderLoading ? (
          <><Loader text="Connecting..." />
          <><div style={{color: "white"}}>
            <center><br></br>
            If not getting connected, please connect to the right network and refresh the page
            </center>
          </div>
          </></>
        )  : renderAdmin ? (
          <>
            <Typography
              variant="h4"
              color="primary"
              align="center"
              style={{ marginTop: "30px", backgroundColor: "rgb(24,25,25)",color: "white"}}
            ><center>
              Welcome to Central Authority Portal
              </center>
            </Typography>
            <Typography
              variant="subtitle2"
              color="secondary"
              align="center"
              style={{ marginTop: "30px",backgroundColor: "rgb(24,25,25)",color: "white"}}
            >
              Please add an institute into the Ethereum Blockchain
             
            </Typography>
          </>
        ) : (
          <>
            {!networkError && (
              <div id="error1">
              <center>
                <h1>ERROR </h1>
              </center>
            </div>
            )}
          </>
        )}
        {networkError && (
          <div id="error1">
          <center>
            <h1>ERROR</h1>
          </center>
        </div>
        )}
        

        {renderAdmin ? (
          <>
            <div>
              <Grid
                container
                style={{ height: "100%", justifyContent: "center"}}
              > 
                <Paper id="register" className={classes.paper} 
                   style={{backgroundColor: "#79d94d",color:"white",justifyContent: "center"}}>
                  <Card
                    style={{
                      border: "1px solid #363b98",
                      minWidth: "250px",
                      minHeight: "70px",
                    }}
                  >
                  <CardContent style={{ textAlign: "center",backgroundColor: "green"}}>
                      <Typography variant="h5" style={{color: "white"}}>
                        Institute Registration
                      </Typography>
                    </CardContent>
                  </Card>

                  <Box m={1} />
                  <Typography
                    variant="h6"
                    style={{ alignSelf: "flex-start", marginBottom: "-10px" }}
                  >
                    Details
                  </Typography>
                  <form
                    className={classes.form}
                    onSubmit={(e) => {
                      if (this.state.instituteCourses.size === 0)
                      {
                        toast.warning("Please fill the courses");
                        this.setState({
                          openDialog: false,
                        });
                      }
                      e.preventDefault();
                      
                    }}
                  >
                    <FormControl margin="normal" required fullWidth>
                      <InputLabel htmlFor="email">
                        Institute Account Address
                      </InputLabel>
                      <Input
                        id="address"
                        label="Institute Account Address"
                        type="name"
                        value={instituteAddress}
                        onChange={this.handleChange("instituteAddress")}
                        autoFocus
                      />
                    </FormControl>
                    <FormControl margin="normal" required fullWidth>
                      <InputLabel htmlFor="email">Institute Name</InputLabel>
                      <Input
                        id="address"
                        label="Institute Name"
                        type="name"
                        value={instituteName}
                        onChange={this.handleChange("instituteName")}
                        autoFocus
                      />
                    </FormControl>
                    <FormControl margin="normal" required fullWidth>
                      <InputLabel htmlFor="email">Institute Acronym</InputLabel>
                      <Input
                        id="address"
                        label="Institute Acronym"
                        type="name"
                        value={instituteAcronym}
                        onChange={this.handleChange("instituteAcronym")}
                        autoFocus
                      />
                    </FormControl>
                    <FormControl margin="normal" required fullWidth>
                      <InputLabel htmlFor="email">
                        Institute Website Link
                      </InputLabel>
                      <Input
                        id="address"
                        label="Institute Website"
                        type="name"
                        value={instituteWebsite}
                        onChange={this.handleChange("instituteWebsite")}
                        autoFocus
                      />
                    </FormControl>
                    <Box m={3} />
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignContent="center"
                    >
                      <Typography
                        variant="h6"
                        style={{
                          alignSelf: "flex-start",
                          marginBottom: "-10px",
                        }}
                      >
                        Courses
                      </Typography>
                      <IconButton
                        color="primary"
                        onClick={this.handleClickOpenCourse}
                      >
                        <AddCircleOutlineIcon />
                      </IconButton>
                    </Box>

                    {[...instituteCourses.keys()].map((instituteCourseKey) => {
                      return (
                        <>
                          <Box
                            display="flex"
                            justifyContent="space-between"
                            alignContent="center"
                            className={classes.courseItem}
                          >
                            <Typography style={{ alignSelf: "center" }}>
                              {instituteCourses.get(instituteCourseKey)}
                            </Typography>
                            <IconButton
                              id={instituteCourseKey}
                              color="primary"
                              onClick={(e) =>
                                this.deleteCourse(e.currentTarget.id)
                              }
                            >
                              <DeleteIcon
                                id={instituteCourseKey}
                                button="true"
                              />
                            </IconButton>
                          </Box>
                        </>
                      );
                    })}
                    {/* ------ Dialog to add course ------*/}
                    <Dialog
                      open={this.state.openCourseDialog}
                      onClose={this.handleCloseCourse}
                      aria-labelledby="form-dialog-title"
                    >
                      <DialogTitle id="form-dialog-title">
                        Add an Institute Course
                      </DialogTitle>
                      <DialogContent>
                        <Input
                          id="address"
                          label="Course name"
                          type="name"
                          value={course}
                          onChange={this.handleChange("course")}
                          autoFocus
                        />
                      </DialogContent>
                      <DialogActions>
                        <Button
                          onClick={this.handleCloseCourse}
                          color="primary"
                          variant="outlined"
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={(e) => {
                            this.addToCourseMap();
                          }}
                          variant="contained"
                          style={{backgroundColor:"green",color: "white"}}
                        >
                          Confirm
                        </Button>
                      </DialogActions>
                    </Dialog>
                    
                    <Button
                      onClick={() => this.openDialog()}
                      type="submit"
                      fullWidth
                      variant="contained"
                      style={{backgroundColor:"green",color: "white"}}
                      className={classes.submit}
                    >
                      Add Institute
                    </Button>
                    {/* ------ Dialog to confirm adding Institute ------*/}
                    <Dialog
                      open={openDialog}
                      onClose={() => this.closeDialog()}
                      aria-labelledby="form-dialog-title"
                    >
                      <DialogTitle id="form-dialog-title">
                        <Typography variant="h5" color="primary">
                          Institute Details
                        </Typography>
                      </DialogTitle>
                      <DialogContent>
                        <Typography variant="h6" color="secondary">
                          Account Address:
                        </Typography>
                        <Typography variant="subtitle2">
                          {this.state.instituteAddress}
                        </Typography>
                      </DialogContent>

                      <DialogContent>
                        <Typography variant="h6" color="secondary">
                          Institute Name:
                        </Typography>
                        <Typography variant="subtitle2">
                          {this.state.instituteName}
                        </Typography>
                      </DialogContent>

                      <DialogContent>
                        <Typography variant="h6" color="secondary">
                          Institute Acronym:
                        </Typography>
                        <Typography variant="subtitle2">
                          {this.state.instituteAcronym}
                        </Typography>
                      </DialogContent>

                      <DialogContent>
                        <Typography variant="h6" color="secondary">
                          Institute Website:
                        </Typography>
                        <Typography variant="subtitle2">
                          {this.state.instituteWebsite}
                        </Typography>
                      </DialogContent>

                      <DialogContent>
                        <Typography variant="h6" color="secondary">
                          Institute Courses:
                        </Typography>

                        {[...instituteCourses.keys()].map(
                          (instituteCourseKey, index) => {
                            return (
                              <Typography variant="subtitle2" key={index}>
                                {instituteCourses.get(instituteCourseKey)}
                              </Typography>
                            );
                          }
                        )}
                      </DialogContent>
                      <DialogActions>
                        <Button
                          onClick={() => this.closeDialog()}
                          color="primary"
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={() => this.addInstituteToBlockchain()}
                          color="primary"
                        >
                          Confirm
                        </Button>
                      </DialogActions>
                    </Dialog>
                  </form>
                </Paper>
              </Grid>
            </div>
          </>
        ) : (
          <></>
        )}
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
        <div align="center" style={{backgroundColor: "rgb(24,25,25)",color: "white"}}>
          <br></br>

        <Button id="button1"
                variant="contained"
                size="large"
               
                component={Link}
                to="/"
              > 
                LOGOUT
              </Button>
        </div>
      </>
    );
  }
}

Admin.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Admin);
