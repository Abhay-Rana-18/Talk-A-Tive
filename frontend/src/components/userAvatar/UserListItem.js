import { Avatar, Box, Text } from "@chakra-ui/react";
import React from "react";

const UserListItem = (user) => {
    
  return (
    <Box
      onClick={user.handleFunction}
      cursor="pointer"
      bg="rgb(239, 239, 239)"
      _hover={{
        bg: "rgb(231, 230, 255)",
      }}
      w="100%"
      display="flex"
      alignItems="center"
      color="black"
      px={3}
      py={2}
      mb={2}
      borderRadius="lg"
    >
      <Avatar
        mr={2}
        size="sm"
        cursor="pointer"
        name={user.name}
        src={user.user.pic}
      />
      <Box>
        <Text>{user.user.name}</Text>
        <Text fontSize="xs">
          <b>Email: </b>
          {user.user.email}
        </Text>
      </Box>
    </Box>
  );
};

export default UserListItem;
