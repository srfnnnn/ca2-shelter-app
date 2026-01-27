import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { requestListing } from "../services/api";

export default function RequestForm({ id, onClose, onSuccess }) {
  const navigate = useNavigate(); 
  const [requestedName, setRequestedName] = useState('');
  const [requestedContact, setRequestedContact] = useState('');
  const [reason, setReason] = useState('');
  const [requesting, setRequesting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setRequesting(true);
    try {
      const data = await requestListing(id, {
        requested_name: requestedName,
        requested_contact: requestedContact,
        reason
      });

      if (!data.success) throw new Error(data.message || 'Request failed');

      alert(data.message);

      // Notify parent to update status
      if (onSuccess) onSuccess("Pending");

      // Redirect back to listings page
      navigate("/listings"); // <-- redirect

      // Optionally close the form
      if (onClose) onClose();

    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setRequesting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="request-form">
      <input
        value={requestedName}
        onChange={e => setRequestedName(e.target.value)}
        placeholder="Your Name"
        required
      />
      <input
        value={requestedContact}
        onChange={e => setRequestedContact(e.target.value)}
        placeholder="Contact Info"
        required
      />
      <textarea
        value={reason}
        onChange={e => setReason(e.target.value)}
        placeholder="Reason"
        required
      />
      <button type="submit" disabled={requesting}>
        {requesting ? 'Submitting...' : 'Submit Request'}
      </button>
      <button type="button" onClick={onClose} disabled={requesting}>
        Cancel
      </button>
    </form>
  );
}
