import {
  Box,
  Button,
  Tooltip,
  Text,
  Menu,
  MenuButton,
  MenuList,
  Avatar,
  MenuItem,
  MenuDivider,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Input,
  useToast,
  Spinner,
  Badge,
  CloseButton,
} from "@chakra-ui/react";

// import Badge from "@mui/material/Badge";

import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import React, { useEffect, useState } from "react";
import { ChatState } from "../../context/ChatProvider";
import ProfileModal from "./ProfileModal";
import { useNavigate } from "react-router-dom";
import axios, { Axios } from "axios";
import ChatLoading from "./ChatLoading";
import UserListItem from "../userAvatar/UserListItem";
import { getSender } from "../config/chatLogic";

const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState();
  const [loading, setLoading] = useState(false);
  const [loadingChats, setLoadingChats] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [nChat, setNChat] = useState();

  const {
    user,
    setUser,
    setSelectedChat,
    chat,
    setChat,
    notification,
    setNotification,
  } = ChatState();
  const navigate = useNavigate();

  useEffect(() => {
    getNotifications();
  }, []);

  const getNotifications = async () => {
    try {
      setLoading(true);
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/user/notiGet`, config);
      setLoading(false);
      console.log(data);
      setNotification(data);
    } catch (error) {}
  };

  const removeNotification = async (noti) => {
    if (!noti) {
      return;
    }

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `/api/user/notiRemove`,
        { msgId: noti._id },
        config
      );
    } catch (error) {
      toast({
        title: "Error while removing notification!",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  const removeAll = async () => {
    setNotification([]);
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
    
      const { data } = await axios.put(`/api/user/removeAll`, {}, config);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
    
  };

  const LogOutHandler = () => {
    setSelectedChat("");
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  const toast = useToast();
  const SearchByEnter = (e) => {
    if (e.key==="Enter") {
      handleSearch();
    }
  }

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please search someone",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "bottom-left",
      });
      return;
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`/api/user?search=${search}`, config);
      setSearchResult(data);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error occured",
        description: "Failed to load the search result",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom-left",
      });
      setLoading(false);
    }
  };

  const accessChat = async (userID) => {
    try {
      setLoadingChats(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post("/api/chat/", { userID }, config);
      console.log("Hello");

      if (chat.find((c) => c._id === data._id)) {
        setSelectedChat(data);
      } else {
        setChat([data, ...chat]);
        setSelectedChat(data);
      } 
      setLoadingChats(false);
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

  return (
    <>
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth="5px"
      >
        <Tooltip label="Search users to chat" hasArrow placement="bottom-end">
          <Button variant="ghost" onClick={onOpen}>
            <i className="fas fa-search" aria-hidden="true"></i>
            <Text display={{ base: "none", md: "flex" }} px="4">
              Search User
            </Text>
          </Button>
        </Tooltip>

        <Text
          fontSize="2xl"
          width="max-content"
          fontFamily="Work sans"
          textAlign="center"
        >
          Talk-A-Tive
        </Text>
        <div>
          <Menu>
            <MenuButton p={1}>
              <BellIcon fontSize="2xl" m={1} />
              {notification.length > 0 && (
                <Badge className="badge">{notification.length}</Badge>
              )}
            </MenuButton>

            <MenuList
              pl={3}
              height="50vh"
              overflowY="scroll"
              width={{ base: "60vw", md: "25vw", lg: "25vw" }}
            >
              {notification.length == 0 && "no new messages"}
              {notification.map((noti) => (
                <MenuItem
                  key={noti._id}
                  onClick={() => {
                    setSelectedChat(noti.chat);
                    setNotification(notification.filter((n) => n !== noti));
                    removeNotification(noti);
                  }}
                >
                  {noti.chat.isGroupChat
                    ? `New message in ${noti.chat.chatName}`
                    : `New message from ${getSender(user, noti.chat.users)}`}
                </MenuItem>
              ))}
              <Button
                colorScheme="red"
                variant="outline"
                size="sm"
                className="removeAll"
                onClick={() => {
                  removeAll();
                }}
              >
                remove all
              </Button>
              {/* <CloseButton /> */}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              <Avatar
                size="sm"
                cursor="pointer"
                name={user.name}
                src={user.pic}
              />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user} setUser={setUser}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>
              <MenuItem onClick={LogOutHandler}>Log out</MenuItem>
            </MenuList>
          </Menu>
        </div>

        {/* Side Drawer */}
        <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>Search Users</DrawerHeader>

            <DrawerBody>
              <Box display="flex" pb={2}>
                <Input
                  placeholder="search here..."
                  mr={2}
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                  }}
                />
                <Button onKeyDown={SearchByEnter} onClick={handleSearch}>
                  GO
                </Button>
              </Box>

              {loading ? (
                <ChatLoading />
              ) : (
                searchResult?.map((usr) => (
                  <UserListItem
                    key={usr._id}
                    user={usr}

                    handleFunction={() => {
                      accessChat(usr._id);
                      onClose();
                    }}
                  />
                ))
              )}
              {loadingChats && <Spinner ml="auto" display="flex" />}
            </DrawerBody>

            {/* <DrawerFooter>
              <Button variant="outline" mr={3} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="blue">Save</Button>
            </DrawerFooter> */}
          </DrawerContent>
        </Drawer>
      </Box>
    </>
  );
};

export default SideDrawer;
