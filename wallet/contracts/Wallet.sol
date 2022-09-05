// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;


contract Wallet{

    mapping(address => uint) wallets;

    function withdrawMoney(address payable _to, uint _amount) external{
        require(_amount <= wallets[msg.sender],"Not enought funds");
        wallets[msg.sender] -= _amount;
        _to.transfer(_amount);
    }

    function getBalance()  external view returns(uint){
        return wallets[msg.sender];
    }

    receive() external payable{
        wallets[msg.sender] += msg.value;
    }

    fallback() external payable{

    }




}