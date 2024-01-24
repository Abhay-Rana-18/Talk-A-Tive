import React, { useEffect, useState } from "react";
import { ChatState } from "../context/ChatProvider";
import Lottie from "react-lottie";
import {
  Box,
  FormControl,
  IconButton,
  Image,
  Input,
  InputGroup,
  Spinner,
  Text,
  Toast,
  useToast,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { getSender, getSenderFull } from "./config/chatLogic";
import ProfileModal from "./missileneous/ProfileModal";
import UpdateGroupChatModel from "./missileneous/UpdateGroupChatModel";
import axios from "axios";
import ScrollableChat from "./ScrollableChat";
import msgImage from "../Images/send-message.png";
import msgAudio  from "../Images/msg.mp3";

import animationData from "../Animations/typing.json";

// socket.io
import { io } from "socket.io-client";
import ProfileModal2 from "./missileneous/ProfileModal2";

const ENDPOINT = "http://localhost:3000";
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState();

  const { user, selectedChat, setSelectedChat, notification, setNotification } =
    ChatState();
  const toast = useToast();

  const [socketConnected, setsocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const fetchAllMessages = async () => {
    if (!selectedChat) {
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,

        config
      );
      setMessages(data);
      setLoading(false);

      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast({
        title: "Error while fetching the message!",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  // useEffect for socket.io
  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => {
      setsocketConnected(true);
    });
    socket.on("typing", () => {
      setIsTyping(true);
    });
    socket.on("stop typing", () => {
      setIsTyping(false);
    });
  }, []);

  useEffect(() => {
    fetchAllMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  console.log(notification);

  useEffect(() => {
    socket.on("message received", (newMessageReceived) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id != newMessageReceived.chat._id
      ) {
        // give notification
        if (!notification.includes(newMessageReceived)) {
          setNotification([...notification, newMessageReceived]);
          handleCount(
            newMessageReceived.chat,
            newMessageReceived.chat.count + 1
          );
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageReceived]);
      }
    });
  });

  const handleCount = async (chat, cnt) => {
    if (!chat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.put(
        "/api/chat/count/",
        { chatId: chat._id, count: cnt },
        config
      );

      // setFetchAgain(!fetchAgain);
    } catch (error) {
      toast({
        title: "Error while setting count!",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  const onEnter = (e) => {
    var screenWidth = window.screen.width;
    if (e.key == "Enter") {
      sendMessage();
    }
  }

  const sendMessage = async () => {
    let audio = new Audio(msgAudio);
    const now = new Date();
    let hour = now.getHours();
    if (hour == 0) {
      hour = 12;
    }

    let min = now.getMinutes();

    if (newMessage) {
      socket.emit("stop typping", selectedChat._id);
      try {
        setNewMessage("");
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        let a = "pm";
        if (hour < 12) {
          a = "am";
        }
        const { data } = await axios.post(
          "/api/message/",
          {
            content: newMessage,
            chatId: selectedChat._id,
            time:
              hour > 12 ? `${hour - 12}:${min} ${a}` : `${hour}:${min} ${a}`,
          },
          config
        );

        socket.emit("new message", data);
        audio.play();
        setMessages([...messages, data]);
      } catch (error) {
        toast({
          title: "Error while sending the message!",
          description: error.message,
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    // Typing indicator logic
    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTIme = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTIme;

      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };
  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "20px", md: "25px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {!selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users)}
                <ProfileModal2 user={getSenderFull(user, selectedChat.users)} />
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModel
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchAllMessages={fetchAllMessages}
                />
              </>
            )}
          </Text>

          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={{ base: 0, md: 3, lg: 3 }}
            // bg="rgb(232, 232, 232)"
            className="chatBg"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {/* Messages */}
            {loading ? (
              <Spinner
                size="xl"
                w={10}
                h={10}
                margin="auto"
                alignSelf="center"
              />
            ) : (
              <div className="messages">
                <ScrollableChat messages={messages} />
              </div>
            )}

            <FormControl isRequired onKeyDown={onEnter} mt={3}>
              {isTyping ? (
                <div>
                  <Lottie
                    options={defaultOptions}
                    width={70}
                    style={{ marginBottom: 15, marginLeft: 0 }}
                  />
                </div>
              ) : (
                <></>
              )}
              <InputGroup>
                <Input
                  bg="white"
                  placeholder="Enter a message..."
                  mx={{ base: 1, md: 0, lg: 0 }}
                  mb={{ base: 2, md: 0, lg: 0 }}
                  width={{ base: "95%", md: "100%", lg: "100%" }}
                  onChange={typingHandler}
                  value={newMessage}
                />
                <Box bg="white" marginLeft={{base: "-2px", md: "5px", lg: "5px"}} marginRight={{base: 1, md: 0}} paddingX={2} height={{base: "2.4rem", md: "auto", lg: "auto"}} onClick={sendMessage}>
                  <Image src={msgImage} alt="->" className="msgImage" />
                </Box>
              </InputGroup>
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          h="100%"
        >
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click on the user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
