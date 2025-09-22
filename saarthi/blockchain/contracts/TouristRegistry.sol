// SPDX-License-Identifier: MIT
pragma solidity >=0.8.2 <0.9.0;

contract TouristRegistry {
    // Struct to represent a tourist
    struct Tourist {
        string username;       
        string hashedData;  
        bool exists;           
    }

    // Mapping from touristId => Tourist
    mapping(string => Tourist) public tourists;

    // Contract owner
    address public owner;

    // Events
    event TouristRegistered(string touristId, string username, string hashedData);

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
        string memory _touristId,
        string memory _username,
        string memory _hashedData
    ) public onlyOwner {
        require(!tourists[_touristId].exists, "Tourist already registered");

        tourists[_touristId] = Tourist({
            username: _username,
            hashedData: _hashedData,
            exists: true
        });

        emit TouristRegistered(_touristId, _username, _hashedData);
    }

    // Fetch tourist details by ID
    function getTourist(string memory _touristId)
        public
        view
        returns (string memory username, string memory hashedData)
    {
        require(tourists[_touristId].exists, "Tourist not registered");
        Tourist memory t = tourists[_touristId];
        return (t.username, t.hashedData);
    }
}
