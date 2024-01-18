var Certification=artifacts.require("./Certification.sol");
var Certification=artifacts.require("./Institution.sol");

module.exports=async function(deployer){
   await deployer.deploy(Institution) 
   const institution = await Institution.deployed()

   await deployer.deploy(Institution,institution.address) 
   const certification = await Certification.deployed()
};
