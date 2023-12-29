
require("babel-registers");
require('dotenv').config();
const HDWalletProvider = require('@truffle/hdwallet-provider');
module.exports = {
  
  networks: {
    
     goerli: {
      provider: function() {
        return new HDWalletProvider(
            process.env.MNEMONIC,
            process.env.PROJECT_ENDPOINT,
            address_index=0,
            num_addresses=2
        );
  },
  network_id:5,
},


  compilers: {
    solc: {
      version: "0.8.21",
      
    },
},
  },
};

  