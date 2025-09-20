// SPDX-License-Identifier: MIT
pragma solidity >=0.8.2 <0.9.0;

contract TouristRegistry {
    // Struct to represent a tourist
    struct Tourist {
        string username;       
        string encryptedData;  
        bool exists;           
    }

    // Mapping from touristId => Tourist
    mapping(uint256 => Tourist) public tourists;

    // Contract owner
    address public owner;

    // Events
    event TouristRegistered(uint256 touristId, string username, string encryptedData);

    // Restrict access to contract owner
    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    constructor() {
        owner = msg.sender; // The deployer is the contract owner
    }

    // Register a new tourist
    function registerTourist(
        uint256 _touristId,
        string memory _username,
        string memory _encryptedData
    ) public onlyOwner {
        require(!tourists[_touristId].exists, "Tourist already registered");

        tourists[_touristId] = Tourist({
            username: _username,
            encryptedData: _encryptedData,
            exists: true
        });

        emit TouristRegistered(_touristId, _username, _encryptedData);
    }

    // Fetch tourist details by ID
    function getTourist(uint256 _touristId)
        public
        view
        returns (string memory username, string memory encryptedData)
    {
        require(tourists[_touristId].exists, "Tourist not registered");
        Tourist memory t = tourists[_touristId];
        return (t.username, t.encryptedData);
    }
}
