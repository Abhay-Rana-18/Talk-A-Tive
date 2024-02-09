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
    <div style={{overflowY: 'scroll'}}>
      <Container maxW="xl" centerContent >
        <Box
          d="flex"
          justifyContent="center"
          p="10px 14px"
          width={{base: "100%", md: "500px", lg: "700px"}}
          m="20px 0 0px 0"
          textAlign='center'
          borderRadius="lg"
          borderWidth="1px"
          className="titleBox"
        >
          <Text fontSize={{ base: "2xl", md: "2xl", lg: "3xl" }} px={5}>Talk-A-Tive</Text>
        </Box>

        <Box
          d="flex"
          justifyContent="center"
          w="35vw"
          p="10px 20px"
          m="10px 0 0px 0"
          width={{base: "100%", md: "500px", lg: "700px"}}
          borderRadius="lg"
          borderWidth="1px"
          className="titleBox"
        >
          <Tabs variant="soft-rounded" colorScheme="blue">
            <TabList>
              <Tab width="50%"  fontSize={{ base: "15px", md: "16px", lg: "20px" }}>Login</Tab>
              <Tab width="50%" fontSize={{ base: "15px", md: "16px", lg: "20px" }}>Sign Up</Tab>
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
