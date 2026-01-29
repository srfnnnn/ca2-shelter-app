import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import RequestForm from "../components/requestForm";

export default function Shelter({ shelter, busy, isAdmin, onDelete }) {
  const [status, setStatus] = useState(shelter.status || "Available");
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="display">
      <h1 className="headline">{shelter.listing_name}</h1>
      <p className="headline">Location: {shelter.area}</p>
      <p className="headline">Price: {shelter.price}</p>
      <p className="headline">Duration (days): {shelter.max_duration}</p>
      <p className="headline">Rules: {shelter.rules}</p>
      <p className="headline">Verification: {shelter.verified}</p>

      {/* guest view */}
      {!isAdmin && status === "Available" && (
        <button className="clickRequest" onClick={() => setShowForm(true)}>
          Request Stay
        </button>
      )}

      {showForm && (
        <RequestForm
          id={shelter.id}
          onClose={() => setShowForm(false)}
          onSuccess={(newStatus) => setStatus(newStatus)}
        />
      )}

      {!isAdmin && (status === "Pending" || status === "Accepted") && (
        <button className="clickRequest" disabled>
          {status === "Pending" ? "Pending" : "Occupied"}
        </button>
      )}

      {/* admin view  */}
      {isAdmin && (
        <div>
          <Link to={`/admin/listings/${shelter.id}`}>
            <button className="clickbuttons">Edit</button>
          </Link>

          <button className="clickbuttons" onClick={() => navigate(`/admin/requests/${shelter.id}`)}>
            View Requests
          </button>

          {isAdmin && onDelete && (
            <button className="clickDelete" disabled={busy} onClick={onDelete}>
              {busy ? "Deleting..." : "Delete"}
            </button>
          )}

        </div>
      )}
    </div>
  );
}

