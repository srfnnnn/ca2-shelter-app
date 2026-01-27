import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

export default function AdminRequests() {
  const { id } = useParams(); // match URL param
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetch(`https://c219-shelterwebappservice.onrender.com/admin/requests/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setRequests(data.requests);
        else alert(data.message || "Failed to fetch requests");
      })
      .catch(err => alert("Error: " + err.message));
  }, [id]);

  return (
    <div>
      <h2>Requests for Listing {id}</h2>
      <Link to="/listings">Back to Listings</Link>
      <ul>
        {requests.length === 0 && <li>No requests yet.</li>}
        {requests.map(r => (
          <li key={r.id}>
            <strong>Shelter:</strong> {r.listing_name} <br />
            <strong>Name:</strong> {r.requested_name || "N/A"} <br />
            <strong>Contact:</strong> {r.requested_contact || "N/A"} <br />
            <strong>Reason:</strong> {r.reason || "N/A"} <br />
            <strong>Status:</strong> {r.status || "Available"}
          </li>
        ))}
      </ul>
    </div>
  );
}
