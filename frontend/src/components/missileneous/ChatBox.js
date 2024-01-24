import { Box } from '@chakra-ui/react'
import React from 'react'
import { ChatState } from '../../context/ChatProvider'
import SingleChat from '../SingleChat';

const ChatBox = ({fetchAgain, setFetchAgain}) => {
  const {selectedChat} = ChatState();
  return (
    <Box
      display={{base: selectedChat ? "flex" : "none", md: "flex"}}
      alignItems='center'
      flexDir='column'
      height={{base: "93%", md: "100%", lg: "100%"}}
      p={{base: 2, md: 3, lg: 3}}
      bg='white'
      w={{base: '100%', md: "68%"}}
      borderRadius='lg'
      borderWidth='1px'
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  )
}

export default ChatBox
