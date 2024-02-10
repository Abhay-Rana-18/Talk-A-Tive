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
      height={{base: "100%", md: "100%", lg: "100%"}}
      p={{base: 3, md: 3, lg: 3}}
      bg='white'
      w={{base: '100%', md: "66.8%"}}
      borderRadius='lg'
      borderWidth='1px'
      position={{base: 'absolute', md: 'static', lg: 'static'}}
      top={{base: 0}}
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  )
}

export default ChatBox
