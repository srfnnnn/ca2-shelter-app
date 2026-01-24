import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { requestListing, deleteListing } from "./api";

export default function Shelter({ shelter, busy, isAdmin }) {
  const [status, setStatus] = useState(shelter.status || "Available"); // Available, Pending, Accepted, Occupied
  const [loading, setLoading] = useState(false);

  // Handle user requesting a stay
  const handleRequest = async () => {
    setLoading(true);
    try {
      const request = {
        name: "John Doe", // Normally fetched from logged-in user
        contact: "12345678",
        reason: "Temporary stay",
        duration: "2 nights",
        status: "Pending"
      };
      const res = await requestListing(shelter.id, request);
      if (res.success) {
        setStatus("Pending"); // Update UI
        alert("Request submitted! Waiting for approval.");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to submit request.");
    } finally {
      setLoading(false);
    }
  };

  // Admin delete function
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this listing?")) return;
    try {
      await deleteListing(shelter.id);
      alert("Listing deleted!");
    } catch (err) {
      console.error(err);
      alert("Failed to delete listing.");
    }
  };

  return (
    <div className="display">
      <h1 className="headline">{shelter.listing_name}</h1>
      <p className="headline">Location: {shelter.area}</p>
      <p className="headline">Price: {shelter.price}</p>
      <p className="headline">Duration: {shelter.max_duration}</p>
      <p className="headline">Rules: {shelter.rules}</p>
      <p className="headline">Verification: {shelter.verified}</p>
      <p className="headline">Status: {status}</p>

      {/* User view: Request button */}
      {!isAdmin && status === "Available" && (
        <button className="clickRequest" onClick={handleRequest} disabled={loading || busy}>
          {loading ? "Submitting..." : "Request Stay"}
        </button>
      )}

      {/* If status is Accepted or Occupied, show Occupied */}
      {!isAdmin && (status === "Pending" || status === "Accepted") && (
        <button className="clickRequest" disabled>
          {status === "Pending" ? "Pending" : "Occupied"}
        </button>
      )}

      {/* Admin view: Edit/Delete */}
      {isAdmin && (
        <>
          <Link to={`/edit/${shelter.id}`}>
            <button className="clickEdit" disabled={busy}>Edit</button>
          </Link>
          <button className="clickDelete" disabled={busy} onClick={handleDelete}>
            Delete
          </button>
        </>
      )}
    </div>
  );
}
