// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title EduNexusPaymentLedger
 * @dev Stores hashes of student fee payments for immutable verification.
 */
contract EduNexusPaymentLedger {
    struct PaymentRecord {
        bytes32 paymentHash;
        uint256 amount;
        string currency;
        uint256 timestamp;
        bool exists;
    }

    mapping(string => PaymentRecord) public payments; // paymentId => Record
    
    event PaymentRecorded(string indexed paymentId, bytes32 paymentHash, uint256 timestamp);

    address public owner;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only admin can record payments");
        _;
    }

    function recordPayment(string memory _paymentId, uint256 _amount, string memory _currency) public onlyOwner {
        require(!payments[_paymentId].exists, "Payment already recorded");
        
        bytes32 _hash = keccak256(abi.encodePacked(_paymentId, _amount, _currency, block.timestamp));
        
        payments[_paymentId] = PaymentRecord({
            paymentHash: _hash,
            amount: _amount,
            currency: _currency,
            timestamp: block.timestamp,
            exists: true
        });

        emit PaymentRecorded(_paymentId, _hash, block.timestamp);
    }

    function verifyPayment(string memory _paymentId) public view returns (bool, uint256, uint256) {
        require(payments[_paymentId].exists, "Payment not found");
        return (true, payments[_paymentId].amount, payments[_paymentId].timestamp);
    }
}
