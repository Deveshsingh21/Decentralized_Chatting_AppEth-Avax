import { useState, useEffect } from "react";
import { ethers } from "ethers";
import atm_abi from "../artifacts/contracts/Chat.sol/Chat.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [receivedMessagesList, setReceivedMessagesList] = useState([[]]);
  const [senderList, setSenderList] = useState([]);
  const [sendMessageBtn, setSendMessageBtn] = useState(false);
  const [receiveMessageBtn, setReceiveMessageBtn] = useState(false);
  const [recipientAddress, setRecipientAddress] = useState(undefined);
  const [recipientMessage, setRecipientMessage] = useState(undefined);

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const atmABI = atm_abi.abi;

  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const account = await ethWallet.request({ method: "eth_accounts" });
      handleAccount(account);
    }
  };

  const handleAccount = (account) => {
    if (account) {
      console.log("Account connected: ", account);
      setAccount(account);
    } else {
      console.log("No account found");
    }
  };

  const connectAccount = async () => {
    if (!ethWallet) {
      alert("MetaMask wallet is required to connect");
      return;
    }

    const accounts = await ethWallet.request({ method: "eth_requestAccounts" });
    handleAccount(accounts);

    // once wallet is set we can get a reference to our deployed contract
    getATMContract();
  };

  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);

    setATM(atmContract);
  };

  const getAllMessages = async () => {
    if (atm) {
      let tx = await atm.getMessages();
      console.log(JSON.stringify(tx));
      // const { senders, messages } = await tx.wait();
      setSenderList(tx[0]);
      setReceivedMessagesList(tx[1]);
    }
  };

  const deposit = async () => {
    if (atm) {
      let tx = await atm.deposit(1);
      await tx.wait();
      getBalance();
    }
  };

  const withdraw = async () => {
    if (atm) {
      let tx = await atm.withdraw(1);
      await tx.wait();
      getBalance();
    }
  };

  // const initUser = () => {
  //   // Check to see if user has Metamask
  //   if (!ethWallet) {
  //     return <p>Please install Metamask in order to use this Chatting application.</p>;
  //   }

  //   // Check to see if user is connected. If not, connect to their account
  //   if (!account) {
  //     return (
  //       <button onClick={connectAccount}>
  //         Please connect your Metamask wallet
  //       </button>
  //     );
  //   }

  //   // if (balance == undefined) {
  //   //   getBalance();
  //   // }

  //   return (
  //     <div>
  //       <p>Your Account: {account}</p>
  //       <button
  //         onClick={() => {
  //           setSendMessageBtn(!sendMessageBtn); // inverse the button state i.e. false to true and vice versa
  //         }}
  //       >
  //         Send a message
  //       </button>
  //       {sendMessageBtn ? (
  //         <div>
  //           <input
  //             placeholder="Enter the recipient's address 0x5a..."
  //             type="text"
  //             onChange={(e) => {
  //               setRecipientAddress(e.target.value);
  //             }}
  //           ></input>
  //           <input
  //             placeholder="Enter you're message like 'Hello world'"
  //             type="text"
  //             onChange={(e) => {
  //               setRecipientMessage(e.target.value);
  //             }}
  //           ></input>
  //           <button
  //             onClick={async () => {
  //               if (atm) {
  //                 let tx = await atm.sendMessage(
  //                   recipientAddress,
  //                   recipientMessage
  //                 );
  //                 await tx.wait();
  //               }
  //             }}
  //           >
  //             Send Message
  //           </button>
  //         </div>
  //       ) : (
  //         <div />
  //       )}
  //       <button
  //         onClick={() => {
  //           setReceiveMessageBtn(!receiveMessageBtn);
  //           getAllMessages();
  //         }}
  //       >
  //         See all the received messages
  //       </button>
  //       {receiveMessageBtn ? (
  //         senderList.map((sender, index) => {
  //           return (
  //             <div>
  //               <div>{sender}</div>
  //               <ul>
  //                 {receivedMessagesList[index].map((msg, msgIndex) => {
  //                   return <li key={msgIndex}>{msg}</li>;
  //                 })}
  //               </ul>
  //             </div>
  //           );
  //         })
  //       ) : (
  //         <div />
  //       )}
  //     </div>
  //   );
  // };

  const initUser = () => {
    // Check to see if user has Metamask
    if (!ethWallet) {
      return <p>Please install Metamask in order to use this Chatting Application.</p>;
    }

    // Check to see if user is connected. If not, connect to their account
    if (!account) {
      return (
        <button onClick={connectAccount}>
          Please connect your Metamask wallet
        </button>
      );
    }

    // if (balance == undefined) {
    //   getBalance();
    // }

    return (
      <div>
        <p>Your Account: {account}</p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "10px",
          }}
        >
          <div>
            <button
              onClick={() => {
                setSendMessageBtn(!sendMessageBtn); // inverse the button state i.e. false to true and vice versa
              }}
            >
              Send a message
            </button>
            {sendMessageBtn && (
              <div>
                <input
                  placeholder="Enter the recipient's address 0x5a..."
                  type="text"
                  onChange={(e) => {
                    setRecipientAddress(e.target.value);
                  }}
                ></input>
                <input
                  placeholder="Enter your message like 'Hello world'"
                  type="text"
                  onChange={(e) => {
                    setRecipientMessage(e.target.value);
                  }}
                ></input>
                <button
                  onClick={async () => {
                    if (atm) {
                      let tx = await atm.sendMessage(
                        recipientAddress,
                        recipientMessage
                      );
                      await tx.wait();
                    }
                  }}
                >
                  Send Message
                </button>
              </div>
            )}
          </div>
          <div>
            <button
              onClick={() => {
                setReceiveMessageBtn(!receiveMessageBtn);
                getAllMessages();
              }}
            >
              See all the received messages
            </button>
            {receiveMessageBtn &&
              senderList.map((sender, index) => {
                return (
                  <div key={index}>
                    <div style={{ padding: "15px" }}>{sender}</div>
                    <ul
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyItems: "center",
                      }}
                    >
                      {receivedMessagesList[index].map((msg, msgIndex) => {
                        return <li key={msgIndex}>{msg}</li>;
                      })}
                    </ul>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    getWallet();
  }, []);

  return (
    <main className="container">
      <header>
        <h1>Welcome to the Decentralised Chatting application!</h1>
      </header>
      {initUser()}
      <style jsx>
        {`
          .container {
            text-align: center;
          }
        `}
      </style>
    </main>
  );
}
