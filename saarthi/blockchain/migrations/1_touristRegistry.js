var TouristRegistry= artifacts.require("./TouristRegistry.sol");

module.exports=async function(deployer){
    await deployer.deploy(TouristRegistry);
}