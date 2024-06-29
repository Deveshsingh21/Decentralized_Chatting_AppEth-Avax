// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract Chat {
    mapping(address => mapping(address => string[]))
        public recipientToSenderToMessage; // address1 : {address2 : msg}
    // 'msg' sent by address2 to address 1
    mapping(address => address[]) public recipientToSenders;

    function isSenderInArray(
        address _sender,
        address _recipient
    ) private view returns (bool) {
        bool isSender = false;
        for (uint i = 0; i < recipientToSenders[_recipient].length; i++) {
            if (recipientToSenders[_recipient][i] == _sender) {
                isSender = true;
                break;
            }
        }

        return isSender;
    }

    function sendMessage(address _recipient, string memory _message) external {
        if (!isSenderInArray(msg.sender, _recipient)) {
            recipientToSenders[_recipient].push(msg.sender);
        }
        recipientToSenderToMessage[_recipient][msg.sender].push(_message);
    }

    function getMessages()
        external
        view
        returns (address[] memory, string[][] memory)
    {
        address[] memory senders = recipientToSenders[msg.sender];
        string[][] memory messages = new string[][](senders.length);

        for (uint i = 0; i < senders.length; i++) {
            messages[i] = recipientToSenderToMessage[msg.sender][senders[i]];
        }

        return (senders, messages);
    }
}
