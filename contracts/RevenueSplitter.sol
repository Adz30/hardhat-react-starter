// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract RevenueSplitter {
    mapping(address => uint256) public recipients; // recipient => percentage
    address[] public recipientList;
    uint256 public totalPercentage;

    event RecipientAdded(address indexed recipient, uint256 percentage);
    event FundsDistributed(uint256 totalAmount);

    // Add a recipient with a share percentage
    function addRecipient(address _recipient, uint256 _percentage) external {
        require(_recipient != address(0), "Invalid address");
        require(_percentage > 0, "Percentage must be > 0");
        require(recipients[_recipient] == 0, "Recipient already added");
        require(totalPercentage + _percentage <= 100, "Total exceeds 100%");

        recipients[_recipient] = _percentage;
        recipientList.push(_recipient);
        totalPercentage += _percentage;

        emit RecipientAdded(_recipient, _percentage);
    }

    // Receive Ether
    receive() external payable {}

    // Distribute the contract's balance based on percentages
    function distribute() external {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to distribute");

        for (uint256 i = 0; i < recipientList.length; i++) {
            address recipient = recipientList[i];
            uint256 share = (balance * recipients[recipient]) / 100;
            if (share > 0) {
                (bool success, ) = recipient.call{value: share}("");
                require(success, "Transfer failed");
            }
        }

        emit FundsDistributed(balance);
    }

    // View helper for front-end
    function getRecipients() external view returns (address[] memory) {
        return recipientList;
    }
}
