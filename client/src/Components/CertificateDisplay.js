import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./styles.css";

//Decrypt Function (Utility Function)
import { decrypt } from "./decrypt";

// Internal Components
import { Loader } from "./Loader";

// Material UI Components
import {Box,useMediaQuery,} from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import CancelIcon from "@material-ui/icons/Cancel";

// Smart Contract essentials
import Web3 from "web3";
import HDWalletProvider from "truffle-hdwallet-provider";
import contract from "truffle-contract";
import Certification from "../contracts/Certification.json";
const CertificationInstance = contract(Certification);

const useStyles = makeStyles((theme) => ({
  root: {
    padding: "30px",
    minHeight: "91.5vh",
    lineHeight: "1.5",
  },
  certHeader: {
    backgroundColor: "green",
    background: "linear-gradient(109.96deg,#0c4600,#18ff03),#fff",
    padding: "24px",
    borderRadius: "10px 10px 0 0 ",
    fontSize: "24px",
    fontWeight: "400",
    color: "white",
  },
  certTopSection: {
    backgroundColor: "white",
    padding: "24px",
  },
  certMidSection: {
    backgroundColor: "white",
    padding: "24px",
    borderTop: "1px solid #6066af",
    borderBottom: "1px solid #6066af",
  },
  certBottomSection: {
    backgroundColor: "white",
    padding: "24px",
    borderRadius: "0 0 10px 10px",
  },
  paper: {
    marginTop: "30px",
    flexDirection: "column",
    alignItems: "center",
    padding: "0px",
    borderRadius: "10px",
  },
  verificationBox: {
    backgroundColor: (props) => (props.revoked ? "#dd7e7e" : "#0c4600"),
    borderRadius: "5px 0 0 5px",
    marginRight: "-24px",
    padding: "12px 8px",
    alignItems: "center",
  },
  verificationStatus: {
    fontSize: "22px",
    lineHeight: "20px",
    fontWeight: "600",
    color: "white",
  }
}));

function CertificateDisplay() {
  const certTemplate = {
    candidateName: "",
    courseName: "",
    creationDate: null,
    instituteName: "",
    instituteAcronym: "",
    instituteLink: "",
    revoked: null,
   
  };
  const [certData, setCertData] = useState(certTemplate);
  const [loading, setLoading] = useState(true);
  const [certExists, setCertExists] = useState(null);
  let { id } = useParams();
  const classes = useStyles();

  let web3;
  const connectWeb3 = () => {
    if (
      process.env.NODE_ENV === "development" &&
      process.env.REACT_APP_STAGE !== "testnet"
    ) {
      web3 = new Web3(
        new Web3.providers.HttpProvider(process.env.REACT_APP_LOCAL_ENDPOINT)
      );
    } else {
      web3 = new Web3(
        new HDWalletProvider(
          null,
          process.env.REACT_APP_INFURA_PROJECT_ENDPOINT
        )
      );
    }
    CertificationInstance.setProvider(web3.currentProvider);
    // hack for web3@1.0.0 support for localhost testrpc, see https://github.com/trufflesuite/truffle-contract/issues/56#issuecomment-331084530
    if (typeof CertificationInstance.currentProvider.sendAsync !== "function") {
      CertificationInstance.currentProvider.sendAsync = function() {
        return CertificationInstance.currentProvider.send.apply(
          CertificationInstance.currentProvider,
          arguments
        );
      };
    }

    if (
      process.env.NODE_ENV === "development" &&
      process.env.REACT_APP_STAGE !== "testnet"
    ) {
      console.log("Current host: " + web3.currentProvider.host);
    } else {
      console.log(
        "Current host: " +
          web3.currentProvider.engine._providers[2].provider.host
      );
    }
  };

  const getCertificateData = (certificateId) => {
    CertificationInstance.setProvider(web3.currentProvider);
    return CertificationInstance.deployed()
      .then((ins) => ins.getData(certificateId))
      .catch((err) => {
        console.log(err);
        return Promise.reject("No certificate found with the input id");
      });
  };

  useEffect(async () => {
    console.log("REACT_APP_STAGE", process.env.REACT_APP_STAGE);
    console.log("NODE_ENV", process.env.NODE_ENV);
    console.log(
      "REACT_APP_INFURA_PROJECT_ENDPOINT",
      process.env.REACT_APP_INFURA_PROJECT_ENDPOINT
    );
    connectWeb3();
    getCertificateData(id)
      .then((data) => {
        console.log("Here's the retrieved certificate data of id", id);
        console.log(data);
        try {
          console.log("candidateName", data[0], decrypt(data[0], id));
          console.log("courseName", data[1]);
          console.log("creationDate", data[2], decrypt(data[2], id));
          console.log("instituteName", data[3]);
          console.log("instituteAcronym", data[4]);
          console.log("instituteLink", data[5]);
          console.log("revoked", data[6]);

          setCertData((prev) => ({
            ...prev,
            candidateName: decrypt(data[0], id),
            courseName: data[1],
            creationDate: decrypt(data[2], id),
            instituteName: data[3],
            instituteAcronym: data[4],
            instituteLink: data[5],
            revoked: data[6],
          }));

          setCertExists(true);
          setLoading(false);
        } catch (err) {
          // TODO: Remove this try catch block.
          // Should not enter here at all. Catching just in case
          setCertExists(false); //remove
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log("Certificate of id", id, "does not exist");
        setCertExists(false);
        setLoading(false);
      });
  }, []);
  return (
    <>
      <Grid container className={classes.root} justifyContent="center" style={{backgroundColor: "rgb(24,24,25)"}}>
        <Grid item xs={12} sm={8}>
          {loading && <Loader text="Connecting..." />}
          {!loading && !certExists && (
            <div style={{color:"white",backgroundColor: "red"}}>
              <center>
                <h1>Please make sure you have entered a valid certificate id that have been created and try again</h1>
              </center>
            </div>
          )}
          {!loading && certExists && (
            <>
              <Certificate
                id={id}
                candidateName={certData.candidateName}
                courseName={certData.courseName}
                creationDate={certData.creationDate}
                instituteName={certData.instituteName}
                instituteAcronym={certData.instituteAcronym}
                instituteLink={certData.instituteLink}
                revoked={certData.revoked}
                logo={certData.logo}
              />
            </>
          )}
        </Grid>
      </Grid>
    </>
  );
}

export default CertificateDisplay;

function SimpleDialog(props) {
  const classes = useStyles(props);
  const { onClose, open, selectedValue, revoked } = props;

  const handleClose = () => {
    onClose(selectedValue);
  };

  return (
    null
  );
}

const VerificationStatus = (props) => {
  const classes = useStyles(props);
  const theme = useTheme();
  const sm = useMediaQuery(theme.breakpoints.up("md"));

  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = (value) => {
    setOpen(false);
  };
  return (
    <>
      <SimpleDialog open={open} onClose={handleClose} revoked={props.revoked} />
      <Box
        className={classes.verificationBox}
        display="flex"
        onClick={handleClickOpen}
      >
        

        {sm && (
          <Box marginLeft="10px">
            <Box className={classes.verificationStatus}>
              {props.revoked ? "❌ Revoked" : "✔️ Verified"}
            </Box>
            
          </Box>
        )}
      </Box>
    </>
  );
};

const DetailGroup = (props) => {
  return (
    <>
      <Box>
        <Box fontSize={16} fontWeight={500} color="#363b98">
          {props.label}
        </Box>
        <Box m={1} />
        <Box fontSize={18} fontWeight={600} color="#3a3a3a">
          {props.content}
        </Box>
        <Box m={3} />
      </Box>
    </>
  );
};

function Certificate({
  id,
  candidateName,
  courseName,
  creationDate,
  instituteName,
  instituteAcronym,
  instituteLink,
  revoked,
}) {
  const classes = useStyles();
  const dateObject = new Date(creationDate);
  const day = dateObject.toLocaleString("en-US", { day: "numeric" });
  const month = dateObject.toLocaleString("en-US", { month: "long" });
  const year = dateObject.toLocaleString("en-US", { year: "numeric" });
  const dateString = `${day} ${month} ${year}`;
  return (
    <>
      <Paper className={classes.paper} id="certdisplay" >
        <Grid container >
          <Grid item xs={12} className={classes.certHeader}>
            University Credential
          </Grid>

          <Grid item xs={12} className={classes.certTopSection}>
            <Grid
              container
              direction="row"
              justifyContent="space-between"
              alignItems="flex-start"
            >
              <Grid item>
                <DetailGroup label="Student Name" content={candidateName} />
              </Grid>
              <Grid item>
                <VerificationStatus revoked={revoked} />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} className={classes.certMidSection}>
            <Grid container>
              <Grid item xs={12} lg={6}>
                <DetailGroup label="Course Name" content={courseName} />
              </Grid>
              <Grid item xs={12} lg={6}>
                <DetailGroup label="Institute Name" content={instituteName} />
              </Grid>
              <Grid item xs={12} lg={6}>
                <DetailGroup
                  label="Institute Acronym"
                  content={instituteAcronym}
                />
              </Grid>
              <Grid item xs={12} lg={6}>
                <DetailGroup label="Institute Link" content={instituteLink} />
              </Grid>
            </Grid>
          </Grid>

          <Grid item sm={12} className={classes.certBottomSection}>
            <DetailGroup label="Issuance Date" content={dateString} />
          </Grid>
        </Grid>
      </Paper>
    </>
  );
}
