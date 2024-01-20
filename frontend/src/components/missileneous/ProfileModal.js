import { ViewIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  IconButton,
  Image,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useState } from "react";

const ProfileModal = ({ user, setUser, children }) => {
  const [pic, setPic] = useState(user.pic);
  
  // image change handle
  const fileUploadHandle = (e) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (reader.readyState === 2) {
        const url = String(reader.result);
        setPic(url);
      }
    };

    reader.readAsDataURL(e.target.files[0]);
    // console.log(e.target.files);
  }

  // Update profile pic
  const toast = useToast();
  
  const profileUpdate = async() => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const {data} = await axios.put(
        "/api/user/profile/",
        { pic: pic },
        config
      );
      setUser(data);
      // localStorage.setItem("userInfo", JSON.stringify(data));
      console.log(user);
      toast({
        title: "Profile picture updated successfully!",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
    } catch (error) {
      toast({
        title: "Error while updating profile",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
    }
  } 

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton
          display={{ base: "flex" }}
          icon={<ViewIcon />}
          onClick={onOpen}
        />
      )}

      {/* Modal */}

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="40px"
            fontFamily="Work-sans"
            display="flex"
            justifyContent="center"
          >
            {user.name}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="space-between"
          >
            <Image
              borderRadius="full"
              boxSize="150px"
              src={pic}
              alt={user.name}
            />
            <Text
              fontSize={{ base: "28px", md: "30px" }}
              fontFamily="Work sans"
              marginTop="1rem"
            >
              Email: {user.email}
            </Text>
          </ModalBody>

          <ModalFooter>
            <input type="file" accept="image/" name="avatar" onChange={fileUploadHandle}/>

              <Button colorScheme="blue" mr={3} onClick={profileUpdate}>
                Update
              </Button>
              <Button colorScheme="red" mr={3} onClick={onClose}>
                Close
              </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileModal;
