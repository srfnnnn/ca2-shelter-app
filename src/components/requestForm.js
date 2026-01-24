import { useState } from "react";
import { requestListing } from "./api";

export default function RequestForm({ shelterId, onRequestSubmitted }) {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !contact || !reason) {
      alert("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      const request = {
        requested_name: name,
        requested_contact: contact,
        reason: reason,
        status: "Pending"
      };
      const res = await requestListing(shelterId, request);
      if (res.success) {
        alert("Request submitted successfully!");
        onRequestSubmitted(); // callback to update parent UI (like changing button to "Pending")
        setName("");
        setContact("");
        setReason("");
      } else {
        alert("Failed to submit request. Try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Error submitting request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="request-form">
      <input
        type="text"
        placeholder="Your Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Contact Number / Email"
        value={contact}
        onChange={(e) => setContact(e.target.value)}
      />
      <textarea
        placeholder="Reason for stay"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
      />
      <button type="submit" disabled={loading}>
        {loading ? "Submitting..." : "Request Stay"}
      </button>
    </form>
  );
}
