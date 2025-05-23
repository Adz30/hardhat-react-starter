import { useEffect, useState } from 'react'
import { Container } from 'react-bootstrap'
import { BrowserProvider, formatUnits, getAddress } from 'ethers'

// Components
import Navigation from './Navigation'
import Loading from './Loading'

// ABIs: Import your contract ABIs here
import TOKEN_ABI from './abis/Token.json'

// Config: Import your network config here
import config from './config.json'

function App() {
  const [account, setAccount] = useState(null)
  const [balance, setBalance] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  const loadBlockchainData = async () => {
    try {
      // Initiate provider
      const provider = new BrowserProvider(window.ethereum)

      // Fetch accounts
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
      const account = getAddress(accounts[0])
      setAccount(account)

      // Fetch account balance
      let balance = await provider.getBalance(account)
      balance = formatUnits(balance, 18)
      setBalance(balance)

      setIsLoading(false)
    } catch (error) {
      console.error('Error loading blockchain data:', error)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (isLoading) {
      loadBlockchainData()
    }
  }, [isLoading])

  return (
    <Container>
      <Navigation account={account} />

      <h1 className='my-4 text-center'>React Hardhat Template</h1>

      {isLoading ? (
        <Loading />
      ) : (
        <>
          <p className='text-center'>
            <strong>Your ETH Balance:</strong> {balance} ETH
          </p>
          <p className='text-center'>Edit App.js to add your code here.</p>
        </>
      )}
    </Container>
  )
}

export default App
