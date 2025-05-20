Hardhat-React Boilerplate
This boilerplate has everything you need to start building a modern Web3 project with a React front end and a Hardhat smart contract backend.

Features
Hardhat development environment

Ethers.js v6 integration

React.js front end with Tailwind CSS and Bootstrap for styling

Sample smart contract and tests

Pre-configured deployment and testing scripts

Getting Started
Prerequisites
Node.js (v16+ recommended)

npm or yarn

Metamask or another Web3 wallet for testing frontend interactions

--------------------------------------------------
git clone https://github.com/Adz30/hardhat-react-starter.git
cd hardhat-react-starter

npm install

in another tab in your terminal 
npx hardhat node

in another tab in your terminal 
npm run start


to run test in your terminal run npx hardhat test
to compile in your terminal run npx hardhat compile 
to deploy to localhost run npx run scripts/deploy.js --network localhost
to deploy to sepolia populate the env file then run npx run scripts/deploy.js --network sepolia
