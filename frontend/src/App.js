import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import './App.css';

import { useState, useEffect } from 'react';
import { ethers } from "ethers";
import { ToastContainer, toast } from "react-toastify";

import WRHeader from 'wrcomponents/dist/WRHeader';
import WRFooter, { async } from 'wrcomponents/dist/WRFooter';
import WRInfo from 'wrcomponents/dist/WRInfo';
import WRContent from 'wrcomponents/dist/WRContent';
import WRTools from 'wrcomponents/dist/WRTools';
import Button from "react-bootstrap/Button";

import { compactAddress } from "./utils";
import meta from "./assets/metamask.png";

import ERC20Contract from './artifacts/contracts/ERC20Token.sol/ERC20Token.json';

function App() {

  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({});
  const [provider, setProvider] = useState();
  const [contract, setContract] = useState();
  const [signer, setSigner] = useState();
  const [userBalance, setUserBalance] = useState('');

  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [decimals, setDecimals] = useState('');
  const [totalSupply, setTotalSupply] = useState('');

  const [transferTo, setTransferTo] = useState('');
  const [transferToValue, setTransferToValue] = useState('');

  const [transferFromFrom, setTransferFromFrom] = useState('');
  const [transferFromTo, setTransferFromTo] = useState('');
  const [transferFromValue, setTransferFromValue] = useState('');

  const [approveAddress, setApproveAddress] = useState('');
  const [approveValue, setApproveValue] = useState('');

  const contractAddress = '0xb365Ac2F8E4BA4347cd8DCFE40aD9F22CA463829';
  
  async function handleConnectWallet (){
    try {
      setLoading(true)
      let userAcc = await provider.send('eth_requestAccounts', []);
      setUser({account: userAcc[0], connected: true});

      const contrSig = new ethers.Contract(contractAddress, ERC20Contract.abi, provider.getSigner())
      setSigner( contrSig)

      userBalance((await contrSig.balanceOf(userAcc[0])).toString())

    } catch (error) {
      if (error.message == 'provider is undefined'){
        toastMessage('No provider detected.')
      } else if(error.code === -32002){
        toastMessage('Check your metamask')
      }
    } finally{
      setLoading(false);
    }
  }

  useEffect(() => {
    
    async function getData() {
      try {
        const {ethereum} = window;
        if (!ethereum){
          toastMessage('Metamask not detected');
          return
        }
        const prov =  new ethers.providers.Web3Provider(window.ethereum);
        setProvider(prov);

        const contr = new ethers.Contract(contractAddress, ERC20Contract.abi, prov);
        setContract(contr);
        
        if (! await isGoerliTestnet()){
          toastMessage('Change to goerli testnet.')
          return;
        }

        //contract data
        setName(await contr.name())
        setSymbol(await contr.symbol())
        setDecimals((await contr.decimals()).toString())
        setTotalSupply((await contr.totalSupply()).toString())          
      } catch (error) {
        console.log(error);
        toastMessage(error.reason)        
      }
    }
    getData()  
  }, [])
  
  function isConnected(){
    if (!user.connected){
      toastMessage('You are not connected!')
      return false;
    }
    return true;
  }

  async function isGoerliTestnet(){
    const goerliChainId = "0x5";
    const respChain = await getChain();
    return goerliChainId == respChain;
  }

  async function getChain() {
    const currentChainId = await  window.ethereum.request({method: 'eth_chainId'})
    return currentChainId;
  }

  async function handleDisconnect(){
    try {
      setUser({});
      setSigner(null);
    } catch (error) {
      toastMessage(error.reason)
    }
  }

  function toastMessage(text) {
    toast.info(text)  ;
  }

  async function executeSigner(func, successMessage){
    try {
      if (!isConnected()) {
        return;
      }
      if (!await isGoerliTestnet()){
        toastMessage('Change to goerli testnet.')
        return;
      }
      setLoading(true);
      const resp = await func;  
      toastMessage("Please wait.")
      await resp.wait();
      toastMessage(successMessage)
    } catch (error) {
      console.log(error);
      toastMessage(error.reason)      
    } finally{
      setLoading(false);
    }
  }

  function handleTransfer(){
    if (signer === undefined || signer === null){
      toastMessage("Please, connect your metamask")
      return
    }
    const func  = signer.transfer(transferTo, transferToValue);  
    executeSigner(func, "Transfer done.")
  }

  function handleTransferFrom(){
    if (signer === undefined || signer === null){
      toastMessage("Please, connect your metamask")
      return
    }
    const func  = signer.transferFrom(transferFromFrom, transferFromTo, transferFromValue);  
    executeSigner(func, "Transfer from done.")
  }

  function handleApprove(){
    if (signer === undefined || signer === null){
      toastMessage("Please, connect your metamask")
      return
    }
    const func  = signer.approve(approveAddress, approveValue);  
    executeSigner(func, "Approved.")
  }

  async function handleMyBalance(){
    if (signer === undefined || signer === null){
      toastMessage("Please, connect your metamask")
      return;
    }
    const resp  = await signer.balanceOf(user.account);  
    toastMessage( `Your balance is ${resp.toString()} wei`);
  }

  return (
    <div className="App">
      <ToastContainer position="top-center" autoClose={5000}/>
      <WRHeader title="TOKEN ERC20" image={true} />
      <WRInfo chain="Goerli" testnet={true} />
      <WRContent>
        
        {loading && 
          <h1>Loading....</h1>
        }
 
        { !user.connected ?<>
            <Button className="commands" variant="btn btn-primary" onClick={handleConnectWallet}>
              <img src={meta} alt="metamask" width="30px" height="30px"/>Connect to Metamask
            </Button></>
          : <>
            <label>Welcome {compactAddress(user.account)}</label>
            <label>User balance: {userBalance}</label>
            <button className="btn btn-primary commands" onClick={handleDisconnect}>Disconnect</button>
          </>
        }
        
        <hr/>
        <h2>Contract data</h2>
        <label>Contract: {contractAddress}</label>
        <label>Token name: {name}</label>
        <label>Token Symbol: {symbol}</label>
        <label>Decimals: {decimals}</label>
        <label>Total supply: {totalSupply}</label>

        <hr/>
        <h2>My balance</h2>
        <button className="btn btn-primary commands" onClick={handleMyBalance}>Check balance</button>
        <hr/>

        <h2>Transfer</h2>
        <input type="text" className="commands" placeholder="Transfer to (address)" onChange={(e) => setTransferTo(e.target.value)} value={transferTo}/>
        <input type="number" className="commands" placeholder="Value" onChange={(e) => setTransferToValue(e.target.value)} value={transferToValue}/>
        <button className="btn btn-primary commands" onClick={handleTransfer}>Transfer</button>
        <hr/>

        <h2>Transfer From</h2>
        <input type="text" className="commands" placeholder="Transfer from (address)" onChange={(e) => setTransferFromFrom(e.target.value)} value={transferFromFrom}/>
        <input type="text" className="commands" placeholder="Transfer to (address)" onChange={(e) => setTransferFromTo(e.target.value)} value={transferFromTo}/>
        <input type="number" className="commands" placeholder="Value" onChange={(e) => setTransferFromValue(e.target.value)} value={transferFromValue}/>
        <button className="btn btn-primary commands" onClick={handleTransferFrom}>Transfer from</button>
        <hr/>

        <h2>Approve</h2>
        <input type="text" className="commands" placeholder="Spender (address)" onChange={(e) => setApproveAddress(e.target.value)} value={approveAddress}/>
        <input type="number" className="commands" placeholder="Value" onChange={(e) => setApproveValue(e.target.value)} value={approveValue}/>
        <button className="btn btn-primary commands" onClick={handleApprove}>Approve</button>
        <hr/>

      </WRContent>
      <WRTools react={true} hardhat={true} bootstrap={true} solidity={true} css={true} javascript={true} ethersjs={true} />
      <WRFooter />      
    </div>
  );
}

export default App;
