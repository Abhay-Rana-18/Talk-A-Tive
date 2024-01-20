import "./App.css";
import { Button, ButtonGroup } from "@chakra-ui/react";
import Home from "./components/Home";
import ChatPage from "./components/ChatPage";
import { Route, Routes, BrowserRouter } from "react-router-dom";



function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element ={<Home />} />
          <Route exact path="/chats" element ={<ChatPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
