import React, { useEffect } from "react";
import { ChatState } from "../context/ChatProvider";
import SideDrawer from "./missileneous/SideDrawer";
import MyChats from "./missileneous/MyChats";
import ChatBox from "./missileneous/ChatBox";
import { Box } from "@chakra-ui/react";
import { useState } from "react";

const ChatPage = () => {
  const { user } = ChatState();
  const [fetchAgain, setFetchAgain] = useState(false);
  var hgt = window.innerHeight;
  return (
    <div style={{ width: "100%", height: hgt, position: "fixed", top:'0px', overflowY: 'hidden'}}>
      {user && <SideDrawer />}

      <Box className="chatBox">
        {user && <MyChats fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
        {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
      </Box>
    </div>
  );
};

export default ChatPage;
