import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  useToast,
  FormControl,
  Input,
  Button,
  Box,
  Image,
} from "@chakra-ui/react";
import { ChatState } from "../../context/ChatProvider";
import axios from "axios";
import UserListItem from "../userAvatar/UserListItem";
import UserBadgeItem from "../userAvatar/UserBadgeItem";

import groupLogo from "../../Images/groupChat.png";


const GroupChatModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUser, setSelectedUser] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const [groupDp, setGroupDp] = useState("https://th.bing.com/th/id/OIP.ZJ6uEgOS1u7spbCyC5jxWAHaHa?w=500&h=500&rs=1&pid=ImgDetMain");

  const toast = useToast();

  const { user, chat, setChat } = ChatState();

  // image change handle
  const fileUploadHandle = (e) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (reader.readyState === 2) {
        const url = String(reader.result);
        setGroupDp(url);
        console.log(url);
      }
    };

    reader.readAsDataURL(e.target.files[0]);
    // console.log(e.target.files);
  }


  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/user?search=${query}`, config);
      setSearchResult(data);
      setLoading(false);
      // console.log(data);
    } catch (error) {
      toast({
        title: "Failed to search",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const handleGroup = (userToAdd) => {
    if (selectedUser.includes(userToAdd)) {
      toast({
        title: "User already exists!",
        description:
          "you cannot add the user which is already exist in the gruop",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "bottom-left",
      });
      return;
    }

    // setSelectedUser(...selectedUser, userToAdd);

    setSelectedUser((prevSelectedUser) => {
      // Use spread operator to create a new array by appending userToAdd
      return [...prevSelectedUser, userToAdd];
    });
  };

  const handleDelete = (delUser) => {
    setSelectedUser(selectedUser.filter((usr) => usr._id != delUser._id));
  };


  const handleSubmit = async () => {
    if (!groupChatName || selectedUser.length < 1) {
      toast({
        title: "Incomplete information",
        description: "Please fill the feilds!",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "bottom-left",
      });
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        "api/chat/group",
        {
          name: groupChatName,
          users: JSON.stringify(selectedUser.map((u) => u._id)),
          dp: groupDp,
        },
        config
      );
      console.log(data);

      //  setChat(data, ...chat);

      setChat((prevChat) => {
        // Use spread operator to create a new array by appending userToAdd
        return [...prevChat, data];
      });

      onClose();
      toast({
        title: "New group is created!",
        description: "You have successfully created a new group.",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      return;
    } catch (error) {
      toast({
        title: "Error while creating group!",
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
      <Button onClick={onOpen}>new Group</Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            fontFamily="Work sans"
            display="flex"
            justifyContent="center"
          >
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDir="column" alignItems="center">
            <FormControl>
              {/* Group Logo */}
              <Image src={groupDp} width={100} height={100} margin='auto' borderRadius='50%' />
              <input type="file" accept="image/" name="avatar" onChange={fileUploadHandle}/>

              <Input
                placeholder="Chat Name"
                mb={3}
                mt={5}
                onChange={(e) => {
                  setGroupChatName(e.target.value);
                }}
              />
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add Users eg: John, Rohan, Jane"
                mb={1}
                onChange={(e) => {
                  handleSearch(e.target.value);
                }}
              />
            </FormControl>

            {/* Selected Users */}
            <Box w="100%" display="flex" flexWrap="wrap">
              {selectedUser.length > 0 ? (
                selectedUser.map((u) => (
                  <UserBadgeItem
                    key={u._id}
                    user={u}
                    handleFunction={() => handleDelete(u)}
                  />
                ))
              ) : (
                <></>
              )}
            </Box>

            {/* Rendering Search Users */}
            {loading ? (
              <div>loading...</div>
            ) : (
              searchResult?.slice(0, 4).map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => {
                    handleGroup(user);
                  }}
                />
              ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
              Create Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModal;
