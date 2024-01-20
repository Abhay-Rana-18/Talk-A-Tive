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

const SignUp = () => {
  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [pic, setPic] = useState();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // a alert of chakra-ui
  const toast = useToast();

  const handleClick = () => {
    setShow(!show);
  };
  const handleClick2 = () => {
    setShow2(!show2);
  };

  const postDetails = (pics) => {
    setLoading(true);
    if (pics === undefined) {
      toast({
        title: "Please select an image.",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    if (
      pics.type === "image/jpeg" ||
      pics.type === "image/png" ||
      pics.type === "image/jpg"
    ) {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "chat-app");
      data.append("cloud_name", "dwlezv6pr");
      fetch("https://api.cloudinary.com/v1_1/dwlezv6pr/image/upload/", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString());
          setLoading(false);
          console.log(data.url.toString());
        })
        .catch((err) => {
          console.log(data);
          setLoading(false);
        });
    } else {
      toast({
        title: "Please select an image.",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
  };
  const submitHandler = async () => {
    setLoading(true);
    if (!name || !email || !password || !confirmPassword) {
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

    if (password != confirmPassword) {
      toast({
        title: "Password does not match!",
        status: "error",
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
        "/api/user",
        { name, email, password, pic },
        config
      );
      toast({
        title: "Registration sucessful!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });

      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      navigate("/chats");
    } catch (error) {
      toast({
        title: "Registration failed",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };

  return (
    <VStack spacing="5px">
      <FormControl>
        <FormLabel fontSize='15px'>Name: </FormLabel>
        <Input
          size="sm"
          placeholder="Enter your name"
          onChange={(e) => {
            setName(e.target.value);
          }}
          style={{ border: "1px solid black" }}
        />
      </FormControl>

      <FormControl>
        <FormLabel fontSize='15px'>Email: </FormLabel>
        <Input
          size='sm'
          type="email"
          placeholder="Enter your email"
          style={{ border: "1px solid black" }}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
      </FormControl>

      <FormControl>
        <FormLabel fontSize='15px'>Password: </FormLabel>
        <InputGroup>
          <Input
            size='sm'
            type={show ? "text" : "password"}
            placeholder="Enter your password"
            style={{ border: "1px solid black" }}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <InputRightElement width="3rem" className="show">
            <Button size="xs" onClick={handleClick}>
              <Text fontSize='xs'>{show ? "hide" : "show"}</Text>
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl>
        <FormLabel fontSize='15px'>Confirm Password: </FormLabel>
        <InputGroup>
          <Input
            size='sm'
            type={show2 ? "text" : "password"}
            placeholder="Enter your password"
            style={{ border: "1px solid black" }}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
            }}
          />
          <InputRightElement width="3rem" className="show">
            <Button size="xs" onClick={handleClick}>
              <Text fontSize='xs'>{show ? "hide" : "show"}</Text>
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl>
        <FormLabel fontSize='15px'>Upload your picture: </FormLabel>
        <Input
          size='sm'
          type="file"
          accept="image/*"
          style={{ border: "1px solid black" }}
          onChange={(e) => {
            postDetails(e.target.files[0]);
          }}
        />
      </FormControl>
      <Button
        size='sm'
        colorScheme="blue"
        width="100%"
        style={{ marginTop: "10px" }}
        onClick={submitHandler}
        isLoading={loading}
      >
        Sign up
      </Button>
    </VStack>
  );
};

export default SignUp;
