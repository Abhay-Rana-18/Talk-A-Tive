import "./App.css";
import Home from "./components/Home";
import ChatPage from "./components/ChatPage";
import { Route, Routes, BrowserRouter, useNavigate } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import ChatProvider from "./context/ChatProvider";

function App() {
  return (
    <ChatProvider>
      <ChakraProvider>
        <div className="App">
          <BrowserRouter>
            <Routes>
              <Route exact path="/" element={<Home />} />
              <Route exact path="/chats" element={<ChatPage />} />
            </Routes>
          </BrowserRouter>
        </div>
      </ChakraProvider>
    </ChatProvider>
  );
}

export default App;
