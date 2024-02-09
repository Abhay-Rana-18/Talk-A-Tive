import React, { useEffect, useState } from "react";
import { ChatState } from "../../context/ChatProvider";
import { Avatar, Box, Button, Stack, Text, useToast } from "@chakra-ui/react";
import axios from "axios";
import { AddIcon } from "@chakra-ui/icons";
import ChatLoading from "./ChatLoading";
import { getSender, getSenderFull } from "../config/chatLogic";
import GroupChatModal from "./GroupChatModal";
import groupLogo from "../../Images/groupChat.png";

const MyChats = ({ fetchAgain, setFetchAgain }) => {
  const ch = window.screen.width<500 ? 20 : 23;
  const desc = window.screen.width<500 ? 23 : 30;
  // const [loggedUser, setLoggedUser] = useState();
  const { selectedChat, setSelectedChat, chat, setChat, user } = ChatState();
  const toast = useToast();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get("/api/chat/", config);
      const filteredData = data.filter((c) => {
        if (c.latestMessage || c.isGroupChat) {
          return c;
        }
      });
      setChat(filteredData);
      // console.log(data);
    } catch (error) {
      toast({
        title: "Error while fetching the chat",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  useEffect(() => {
    // setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain]);

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: "100%", md: "33%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work sans"
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        My Chats
        <GroupChatModal>
          <Button
            display="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>

      <Box
        display="flex"
        flexDir="column"
        p={3}
        bg="white"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {chat ? (
          <Stack className="hideScroll">
            {chat.map((c) => (
              <Box
                onClick={() => setSelectedChat(c)}
                cursor="pointer"
                bg={
                  selectedChat == c
                    ? "rgb(200, 255, 202)"
                    : "rgb(242, 242, 242)"
                }
                color={selectedChat == c ? "black" : "black"}
                px={3}
                py={2}
                borderRadius="lg"
                key={c._id}
                display="flex"
              >
                {/* {getCount(c)} */}
                <Avatar
                  src={c.isGroupChat ? c.dp : getSenderFull(user, c.users).pic}
                  size="md"
                  cursor="pointer"
                />
                <Box>
                  <Text marginLeft={3} className="chatTitle">
                    {c.isGroupChat
                      ? c.chatName.length > ch
                        ? `${c.chatName.substring(0, ch)}...`
                        : c.chatName
                      : getSender(user, c.users).length > ch
                      ? `${getSender(user, c.users).substring(0, ch)}...`
                      : getSender(user, c.users)}
                  </Text>

                  <Text marginLeft={3} fontSize={14} fontFamily="revert">
                    {c.latestMessage &&
                      (c.latestMessage.content.length > desc
                        ? `${c.latestMessage.content.substring(0, desc)}...`
                        : c.latestMessage.content)}
                  </Text>
                </Box>
                {c.latestMessage && (
                  <span className="timeInChat">{c.latestMessage.time}</span>
                )}
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
