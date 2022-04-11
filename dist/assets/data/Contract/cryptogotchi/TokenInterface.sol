// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

interface TokenInterface {
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    function mint(address account, uint256 amount) external;
    function burn(address account, uint256 amount) external;
    
    // function getMonth(uint timestamp) external pure returns (uint8);
    // function getDay(uint timestamp) external pure returns (uint8);
    // function getYear(uint timestamp) external pure returns (uint8);
    // function getHour(uint timestamp) external pure returns (uint8);
    // function getMinute(uint timestamp) external pure returns (uint8);
    
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
}

/* ERROR MESSAGESS FROM REQUIREMENTS
        !a = not apporved
        !b = insufficiant erc20 token balance
        !d = amount greater than available days
        !e = not egg
        !h = hatching not enabled
        !L = not enough Link in contract
        !m = mint not enabled
        !n = name must be <= 16 characters
        !o = not the owner of nft
        !p = pack not enabled
        !r = rewards not greater than 0
        !t = still time between plays
        !x = not alive
        x! = alive
        !10 = not generation 10
        az = pass amount not greater than 0
        g1 = is generation 1
        ie - is egg
        mf = must feed before prestige
        mp = must prestige to continue
        NB = no pets to batch
        r0 = rewards greater than 0
    */