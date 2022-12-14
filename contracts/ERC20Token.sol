// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.17;

interface ERC20Interface {
    
    function totalSupply() external view returns (uint256);
    function balanceOf(address _owner)external view returns (uint256 balance);
    function transfer(address _to, uint256 _value) external returns (bool success);
    function transferFrom(address _from, address _to, uint256 _value)external returns (bool success);
    function approve(address _spender, uint256 _value) external returns (bool success);
    function allowance(address _owner, address _spender) external view returns (uint256 remaining);

    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    event Approval(address indexed _owner, address indexed _spender, uint256 _value);
    
} 

contract ERC20Token is ERC20Interface {
    
    string public name;
    string public symbol;
    uint public decimals;
    uint public totalSupply;
    mapping(address => uint) public balances;
    mapping (address => mapping (address => uint)) public allowed;
    
    constructor(string memory _name, string memory _symbol, uint _decimals, uint _totalSupply) {
        name = _name;
        symbol = _symbol;
        decimals = _decimals;
        totalSupply = _totalSupply;
        balances[msg.sender] = _totalSupply;
    }

    function transfer(address to, uint value) public override returns (bool){
        require(balances[msg.sender] >= value, "Insufficient value");
        balances[msg.sender]  -= value;
        balances[to]  += value;
        emit Transfer(msg.sender, to, value);
        return true;
    }

    function transferFrom(address from, address to, uint value) public override returns(bool){
        uint _allowance = allowed[from][msg.sender];
        require(balances[from] >= value && _allowance >= value, "Insufficient value");
        allowed[from][msg.sender] -= value;
        balances[from]  -= value;
        balances[to]  += value;
        emit Transfer(msg.sender, to, value);
        return true;
    }

    function approve(address spender, uint value) public override  returns (bool) {
        require(spender != msg.sender, "Its no make sense");
        allowed[msg.sender][spender] = value;
        emit Approval(msg.sender, spender, value);
        return true;
    }

    function allowance(address owner, address spender) public view returns (uint){
        return allowed[owner][spender];
    }

    function balanceOf(address owner) public view returns (uint){
        return balances[owner];
    }

}