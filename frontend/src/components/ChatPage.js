import React from "react";
import { ChatState } from "../context/ChatProvider";
import SideDrawer from "./missileneous/SideDrawer";
import MyChats from "./missileneous/MyChats";
import ChatBox from "./missileneous/ChatBox";
import { Box } from "@chakra-ui/react";
import { useState } from "react";

const ChatPage = () => {
  const { user } = ChatState();
  const [fetchAgain, setFetchAgain] = useState(false);
  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawer />}

      <Box className="chatBox">
        {user && <MyChats fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
        {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
      </Box>
    </div>
  );
};

export default ChatPage;
