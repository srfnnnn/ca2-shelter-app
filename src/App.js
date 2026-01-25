import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Home from "./pages/Home";
import ShelterList from "./pages/shelterList";
import AddShelter from "./pages/AddListing";
import EditShelter from "./pages/EditShelter";
import AdminLogin from "./pages/AdminLogin";
import "./App.css";

export default function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/listings" element={<ShelterList />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin/listings" element={<AddShelter />} />
        <Route path="/admin/listings/:id" element={<EditShelter />} />
       
      </Routes>
    </BrowserRouter>
  );
}