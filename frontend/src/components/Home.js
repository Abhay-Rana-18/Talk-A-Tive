import {
  Container,
  Box,
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import Login from "./authentication/Login";
import SignUp from "./authentication/SignUp";
import { useNavigate } from "react-router-dom";


const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("userInfo");
    if (user) {
      navigate("/chats");
    }
  }, [navigate]);

  return (
    <div>
      <Container maxW="xl" centerContent >
        <Box
          d="flex"
          justifyContent="center"
          p="10px 140px"
          m="20px 0 0px 0"
          borderRadius="lg"
          borderWidth="1px"
          className="titleBox"
        >
          <Text fontSize="2xl" px={5}>Talk-A-Tive</Text>
        </Box>

        <Box
          d="flex"
          justifyContent="center"
          w="35vw"
          p="10px 20px"
          m="10px 0 0px 0"
          borderRadius="lg"
          borderWidth="1px"
          className="titleBox"
        >
          <Tabs variant="soft-rounded" colorScheme="blue">
            <TabList>
              <Tab width="50%">Login</Tab>
              <Tab width="50%">Sign Up</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Login />
              </TabPanel>
              <TabPanel>
                <SignUp />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Container>
    </div>
  );
};

export default Home;
