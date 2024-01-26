import React from "react";
import ScrollableFeed from "react-scrollable-feed";
import { ChatState } from "../context/ChatProvider";
import {
  isSameSender,
  isLastMessage,
  isSameSenderMargin,
  isSameUser,
} from "./config/chatLogic";

import { Avatar, Box, Tooltip } from "@chakra-ui/react";

const ScrollableChat = ({ messages }) => {
  const { user, selectedChat } = ChatState();
  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => (
          <div style={{ display: "flex" }} key={m._id}>
            {(isSameSender(messages, m, i, user._id) ||
              isLastMessage(messages, i, user._id)) &&
              selectedChat.isGroupChat && (
                <Tooltip
                  label={m.sender.name}
                  placement="bottom-start"
                  hasArrow
                >
                  <Avatar
                    mt="7px"
                    mr={1}
                    size="sm"
                    cursor="pointer"
                    name={m.sender.name}
                    src={m.sender.src}
                  />
                </Tooltip>
              )}
            <span
              style={{
                backgroundColor: `${
                  m.sender._id === user._id
                    ? "rgb(201, 252, 192)"
                    : "rgb(254, 213, 255)"
                }`,
                color: "black",
                borderRadius: "20px",
                padding: "5px 15px",
                paddingRight: "20px",
                maxWidth: "75%",
                marginRight: "8px",
                marginLeft: isSameSenderMargin(
                  messages,
                  m,
                  i,
                  user._id,
                  selectedChat
                ),
                marginTop: isSameUser(messages, m, i, user._id)
                  ? "3px"
                  : "15px",
              }}
            >
              {m.content}
              {m.content.length < 15 ? (
                <span className="smTime">{m.time}</span>
              ) : (
                <Box display="flex" height={1} margin={1}>
                  <span className="time">{m.time}</span>
                </Box>
              )}
            </span>
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
