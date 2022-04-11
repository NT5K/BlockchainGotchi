// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract melafneau is ERC20, Ownable {
    
    mapping(address=>bool) public minters;
    
    constructor(uint256 initialSupply) ERC20("gjiejeio", "gjiogjio") {
        _mint(msg.sender, initialSupply);
    }
    
    modifier onlyMinter() {
        require(minters[msg.sender]);
        _;
    }
    
    function changeMinter(address account, bool position) public onlyOwner {
        position ? minters[account] = true : minters[account] = false;
    }
    
    function burn(address account, uint256 amount) public onlyMinter {
        _burn(account, amount);
    }
    
    function mint(address account, uint256 amount) public onlyMinter {
        _mint(account, amount);
    }
}