import React from "react";
import { BrowserRouter, Routes, Route} from "react-router-dom";
import UserCard from "./components/UserCard";
import MainPage from "./components/MainPage";
import UserProfile from "./components/UserProfile";
import JobForm from "./components/JobForm";
import EmailList from "./components/EmailList";

export default function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UserCard />} />
        <Route path="/profile/:userId" element={<UserProfile/>}/>
        <Route path="/job/:userId" element={<JobForm/>}/>
        <Route path="/main/:userId" element={<MainPage />} />
        <Route path="/emails/:userId" element={<EmailList />} />
      </Routes>
    </BrowserRouter>
  );
}
