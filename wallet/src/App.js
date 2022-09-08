import './App.css';
import {useState, useEffect} from 'react';
import {ethers} from 'ethers';
import Wallet from './artifacts/contracts/Wallet.sol/Wallet.json';


let WalletAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

function App() {

  const[balance, setBalance] = useState(0);
  const[amountSend, setAmountSend] = useState();
  const[amountWithdraw, setAmountWithdraw] = useState();
  const[error, setError] = useState('');
  const[sucess,setSuccess] = useState('');

  useEffect(()=>{
    getBalance();

  },[])

  function changeAmountSend(e){
    setAmountSend(e.target.value);
  }


  
  async function getBalance(){
    //si l'utilisateur c'est bien connecte a notre application metamax 
    if(typeof window.ethereum !== 'undefined'){
      //on recupere le  compte , on cree un provider et on instantie le contrat
      const accounts =  await window.ethereum.request({method:'eth_requestAccounts'});
      const provider =  new ethers.providers.Web3Provider(window.ethereum);
      const contract =  new ethers.Contract(WalletAddress,Wallet.abi,provider);

      try {
        let override =  {from: accounts[0] }
        const data = await contract.getBalance(override);
        setBalance(String(data));

      }catch(err) {
        setError('une erreur est survenue');

      }

    }

  }
  async function transfer(){
    if(!amountSend){
      return ;
    }
    setError('');
    setSuccess('');

    if(typeof window.ethereum !== 'undefined'){
      const accounts = await window.ethereum.request({method:'eth_requestAccounts'});
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      try {
        const tx = {
          from: accounts[0],
          to: WalletAddress,
          value: ethers.utils.parseEther(amountSend)
          }
          const transaction = await signer.sendTransaction(tx);
          await transaction.wait();
          setAmountSend('');
          getBalance();
          setSuccess('Votre argent a bien été déposé dans votre portefeuille');

        
        } catch (err) {
        setError('Votre argent n a pas pu etre transféré');
        
      }



    }
  }
 
  return (
    <div className="App">
      {error && <p className="error">{error}</p>}
      <h2> {balance / 10**18} eth</h2>
      <div className="wallet_flex">
        <div className="walletG">
        <h3>Envoyer de l'ether</h3>
        <input type="text" placeholder="Montant en ethers" onChange={changeAmountSend}></input>
        <button onClick={transfer}>Envoyer</button>

        </div>
      </div>
      <div className="walletD"></div>
      <h3>Retirer de l'ether</h3>
      <input type="text" placeholder="Montant en ethers" onChange={changeAmounWithdraw}></input>
        <button onClick={withdraw}>Retirer</button>


      
    </div>
  );
}

export default App;
