import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Home from "./pages/Home";
import ShelterList from "./pages/shelterList";
import AddShelter from "./pages/AddListing";
import EditShelter from "./pages/EditShelter";
import RequestForm from "./components/RequestForm";
import AdminRequests from "./components/AdminRequest";
import Login from "./pages/Login";
import "./App.css";

export default function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/listings" element={<ShelterList />} />
         <Route path="/login" element={<Login />} />
        <Route path="/admin/listings" element={<AddShelter />} />
        <Route path="/admin/listings/:id" element={<EditShelter />} />
        <Route path="/request/:id" element={<RequestForm />} />
        <Route path="/admin/requests/:listingId" element={<AdminRequests />} />
       
      </Routes>
    </BrowserRouter>
  );
}