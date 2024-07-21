import "./App.css";
import React from "react";
import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import SignUp from "./componennts/SignUp";
import SignIn from "./componennts/SignIn";
import Home from "./componennts/HomePage";

const initialUsers = [
  {
    username: "yenkel",
    password: "Yenkel@23",
  },
];

function App() {
  const [users, setUsers] = useState(initialUsers);
  const [currentUser, setCurrentUser] = useState();

  const navigate = useNavigate();

  const addUser = (newUser) => {
    setUsers((prevUsers) => [...prevUsers, newUser]);
  };


  //sign coponennts
  const signin = (username, password) => {
    const existingUser = users.find(
      (user) => user.username === username && user.password === password
    );
    if (!existingUser) {
      alert("User not found");
    } else {
      setCurrentUser(existingUser);
      navigate("/" + existingUser.username);
    }
  };

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<SignUp addUser={addUser} />} />
        <Route path="/SignUp" element={<SignUp currentUser={currentUser} />} />
        <Route path="/SignIn" element={<SignIn signin={signin} />} />
        <Route path="/HomePage" element={<Home Home={Home} />} />
      </Routes>
    </div>
  );
}

export default App;