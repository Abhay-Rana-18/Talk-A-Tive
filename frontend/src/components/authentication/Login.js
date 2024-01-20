import React, { useState } from "react";

import {
  FormControl,
  FormLabel,
  InputGroup,
  Button,
  Input,
  InputRightElement,
  useToast,
} from "@chakra-ui/react";
import { Stack, HStack, VStack } from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [pic, setPic] = useState();
  const [loading, setLoading] = useState(false);

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
      if (data) {
        toast({
          title: "Login sucessful!",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }

      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      navigate("/chats");
    } catch (error) {
      toast({
        title: "Login failed",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      navigate("/chats")
    }
  };

  return (
    <VStack spacing="5px">
      {/* <FormControl>
        <FormLabel>Name: </FormLabel>
        <Input
          placeholder="Enter your name"
          style={{ border: "1px solid black" }}
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
      </FormControl> */}

      <FormControl>
        <FormLabel>Email: </FormLabel>
        <Input
          type="email"
          placeholder="Enter your email"
          style={{ border: "1px solid black" }}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
      </FormControl>

      <FormControl>
        <FormLabel>Password: </FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            placeholder="Enter your password"
            style={{ border: "1px solid black" }}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "hide" : "show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <Button
        colorScheme="blue"
        width="100%"
        style={{ marginTop: "20px" }}
        isLoading={loading}
        onClick={submitHandler}
      >
        Login
      </Button>

      <Button
        variant="solid"
        colorScheme="red"
        width="100%"
        style={{ marginTop: "0px" }}
        onClick={() => {
          setEmail("guest@example.com");
          setPassword("12345");
          submitHandler();
        }}
      >
        Login with guest credentials
      </Button>
    </VStack>
  );
};

export default Login;
