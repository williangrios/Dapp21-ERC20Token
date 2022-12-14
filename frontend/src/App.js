//import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import './App.css';

import {  useState, useEffect } from 'react';
import { ethers } from "ethers";
import {ToastContainer, toast} from "react-toastify";

import WRHeader from 'wrcomponents/dist/WRHeader';
import WRFooter from 'wrcomponents/dist/WRFooter';
import WRInfo from 'wrcomponents/dist/WRInfo';
import WRContent from 'wrcomponents/dist/WRContent';
import WRTools from 'wrcomponents/dist/WRTools';

import ERC20Contract from './artifacts/contracts/ERC20Token.sol/ERC20Token.json';

function App() {

  const [userAccount, setUserAccount] = useState('');
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

  const addressContract = '0xb365Ac2F8E4BA4347cd8DCFE40aD9F22CA463829';
  
  let contractDeployed = null;
  let contractDeployedSigner = null;
  
  async function getProvider(connect = false){
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    if (contractDeployed == null){
      contractDeployed = new ethers.Contract(addressContract, ERC20Contract.abi, provider)
    }
    if (contractDeployedSigner == null){
      if (connect){
        let userAcc = await provider.send('eth_requestAccounts', []);
        setUserAccount(userAcc[0]);
        setUserBalance((await contractDeployed.balanceOf(userAcc[0])).toString());
      }
      contractDeployedSigner = new ethers.Contract(addressContract, ERC20Contract.abi, provider.getSigner());
    }
  }

  async function disconnect(){
    try {
      setUserAccount('');
    } catch (error) {
      
    }
  }

  useEffect(() => {
    getData()
  }, [])

  function toastMessage(text) {
    toast.info(text)  ;
  }

  async function getData(connect = false) {
    await getProvider(connect);
    setName(await contractDeployed.name())
    setSymbol(await contractDeployed.symbol())
    setDecimals((await contractDeployed.decimals()).toString())
    setTotalSupply((await contractDeployed.totalSupply()).toString())
  }

  async function handleTransfer(){
    await getProvider(true);
    try {
      const resp  = await contractDeployedSigner.transfer(transferTo, transferToValue);  
      toastMessage("Transfer done");
    } catch (error) {
      toastMessage(error.reason);
    }
  }

  async function handleTransferFrom(){
    await getProvider(true);
    try {
      const resp  = await contractDeployedSigner.transferFrom(transferFromFrom, transferFromTo, transferFromValue);  
      toastMessage("Transfer from done");
    } catch (error) {
      toastMessage(error.reason);
    }
  }

  async function handleApprove(){
    await getProvider(true);
    try {
      const resp  = await contractDeployedSigner.approve(approveAddress, approveValue);  
      toastMessage("Approved");
    } catch (error) {
      toastMessage(error.reason);
    }
  }


  return (
    <div className="App">
      <ToastContainer position="top-center" autoClose={5000}/>
      <WRHeader title="TOKEN ERC20" image={true} />
      <WRInfo chain="Goerli testnet" />
      <WRContent>
        
        {
          userAccount =='' ?<>
            <h2>Connect your wallet</h2>
            <button onClick={() => getData(true)}>Connect</button>
          </>
          :<>
            <h2>User data</h2>
            <p>User account: {userAccount}</p>
            <p>User balance: {userBalance}</p>
            <button onClick={disconnect}>Disconnect</button></>
        }
        
        <hr/>
        <h2>Contract data</h2>
        <p>Token name: {name}</p>
        <p>Token Symbol: {symbol}</p>
        <p>Decimals: {decimals}</p>
        <p>Total supply: {totalSupply}</p>

        <h2>Transfer</h2>
        <input type="text" placeholder="Transfer to (address)" onChange={(e) => setTransferTo(e.target.value)} value={transferTo}/>
        <input type="text" placeholder="Value" onChange={(e) => setTransferToValue(e.target.value)} value={transferToValue}/>
        <button onClick={handleTransfer}>Transfer</button>
        <hr/>

        <h2>Transfer From</h2>
        <input type="text" placeholder="Transfer from (address)" onChange={(e) => setTransferFromFrom(e.target.value)} value={transferFromFrom}/>
        <input type="text" placeholder="Transfer to (address)" onChange={(e) => setTransferFromTo(e.target.value)} value={transferFromTo}/>
        <input type="text" placeholder="Value" onChange={(e) => setTransferFromValue(e.target.value)} value={transferFromValue}/>
        <button onClick={handleTransferFrom}>Transfer from</button>
        <hr/>

        <h2>Approve</h2>
        <input type="text" placeholder="Spender (address)" onChange={(e) => setApproveAddress(e.target.value)} value={approveAddress}/>
        <input type="text" placeholder="Value" onChange={(e) => setApproveValue(e.target.value)} value={approveValue}/>
        <button onClick={handleApprove}>Approve</button>
        <hr/>

        <h2>Transfer From</h2>
        <input type="text" placeholder="Transfer from (address)" onChange={(e) => setTransferFromFrom(e.target.value)} value={transferFromFrom}/>
        <input type="text" placeholder="Transfer to (address)" onChange={(e) => setTransferFromTo(e.target.value)} value={transferFromTo}/>
        <input type="text" placeholder="Value" onChange={(e) => setTransferFromValue(e.target.value)} value={transferFromValue}/>
        <button onClick={handleTransferFrom}>Transfer from</button>
        <hr/>
               
      </WRContent>
      <WRTools react={true} hardhat={true} bootstrap={true} solidity={true} css={true} javascript={true} ethersjs={true} />
      <WRFooter />      
    </div>
  );
}

export default App;
