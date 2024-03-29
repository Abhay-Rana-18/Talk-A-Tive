import React, { useState } from "react";

import {
  FormControl,
  FormLabel,
  InputGroup,
  Button,
  Input,
  InputRightElement,
  useToast,
  Text,
} from "@chakra-ui/react";
import { Stack, HStack, VStack } from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ChatState } from "../../context/ChatProvider";

const Login = () => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [pic, setPic] = useState();
  const [loading, setLoading] = useState(false);
  const {setUser} = ChatState();

  // a alert of chakra-ui
  const toast = useToast();

  const handleClick = () => {
    setShow(!show);
  };

  const postDetails = (pics) => {};

  const submitHandler = async () => {
    setLoading(true);
    if (!email || !password) {
      toast({
        title: "Please fill all the fields.",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }

    try {
      const config = {
        Headers: {
          "Content-type": "appllication/json",
        },
      };
      const { data } = await axios.post(
        "/api/user/login",
        { email, password },
        config
      );
      localStorage.setItem("userInfo", JSON.stringify(data));
      setUser(JSON.parse(localStorage.getItem("userInfo")));
      if (data) {
        toast({
          title: "Login sucessful!",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }

      navigate("/chats");
      setLoading(false);
    } catch (error) {
      toast({
        title: "Login failed",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      navigate("/chats");
    }
  };

  return (
    <VStack spacing="5px">
      <FormControl>
        <FormLabel fontSize="15px">Email: </FormLabel>
        <Input
          size="sm"
          type="email"
          value={email}
          placeholder="Enter your email"
          style={{ border: "1px solid black" }}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
      </FormControl>

      <FormControl>
        <FormLabel fontSize="15px">Password: </FormLabel>
        <InputGroup>
          <Input
            size="sm"
            type={show ? "text" : "password"}
            value={password}
            placeholder="Enter your password"
            style={{ border: "1px solid black" }}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <InputRightElement width="3rem" className="show">
            <Button size="xs" onClick={handleClick}>
              <Text fontSize="xs">{show ? "hide" : "show"}</Text>
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <Button
        size="sm"
        colorScheme="blue"
        width="100%"
        style={{ marginTop: "20px" }}
        isLoading={loading}
        onClick={submitHandler}
      >
        Login
      </Button>

      {/* <Button
        size="sm"
        variant="solid"
        colorScheme="red"
        width="100%"
        style={{ marginTop: "0px" }}
        onClick={() => {
          setEmail("guest@example.com");
          setPassword("12345");
        }}
      >
        Login with guest credentials
      </Button> */}
    </VStack>
  );
};

export default Login;
