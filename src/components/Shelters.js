// import { useState } from "react";
// import { Link } from "react-router-dom";
// import { requestListing } from "../services/api";

// export default function Shelter({ shelter, busy, isAdmin, onDelete }) {
//   const [status, setStatus] = useState(shelter.status || "Available"); // Available, Pending, Accepted, Occupied
//   const [requesting, setRequesting] = useState(false);

//   // Handle user requesting a stay
//   const handleRequest = async () => {
//     setRequesting(true);
//     try {
//       const res = await requestListing(shelter.id); // API handles the actual request creation
//       if (res.success) {
//         setStatus("Pending"); // Update UI
//         alert("Request submitted! Waiting for approval.");
//       }
//     } catch (err) {
//       console.error(err);
//       alert("Failed to submit request.");
//     } finally {
//       setRequesting(false);
//     }
//   };

//   return (
//     <div className="display">
//       <h1 className="headline">{shelter.listing_name}</h1>
//       <p className="headline">Location: {shelter.area}</p>
//       <p className="headline">Price: {shelter.price}</p>
//       <p className="headline">Duration: {shelter.max_duration}</p>
//       <p className="headline">Rules: {shelter.rules}</p>
//       <p className="headline">Verification: {shelter.verified}</p>

//       {/* User view: Request button */}
//       {!isAdmin && status === "Available" && (
//         <button
//           className="clickRequest"
//           onClick={handleRequest}
//           disabled={requesting || busy}
//         >
//           {requesting ? "Submitting..." : "Request Stay"}
//         </button>
//       )}

//       {/* If status is Pending or Accepted, show status */}
//       {!isAdmin && (status === "Pending" || status === "Accepted") && (
//         <button className="clickRequest" disabled>
//           {status === "Pending" ? "Pending" : "Occupied"}
//         </button>
//       )}

//       {/* Admin view: Edit/Delete */}
//       {isAdmin && (
//         <div>
//           <Link to={`/edit/${shelter.id}`}>
//             <button className="clickEdit" disabled={busy}>
//               Edit
//             </button>
//           </Link>
//           {onDelete && (
//             <button className="clickDelete" disabled={busy} onClick={onDelete}>
//               {busy ? "Deleting..." : "Delete"}
//             </button>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }

import { useState } from "react";
import { Link } from "react-router-dom";
import { requestListing } from "../services/api";

export default function Shelter({ shelter, busy, isAdmin, onDelete }) {
  const [status, setStatus] = useState(shelter.status || "Available");
  const [requesting, setRequesting] = useState(false);

  const handleRequest = async () => {
    setRequesting(true);
    try {
      const res = await requestListing(shelter.id, {}); // anonymous request
      if (res.success) {
        setStatus("Pending");
        alert("Request submitted! Waiting for approval.");
      } else {
        alert("Failed to submit request: " + (res.message || "Unknown error"));
      }
    } catch (err) {
      console.error(err);
      alert("Failed to submit request: " + err.message);
    } finally {
      setRequesting(false);
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

      {/* Guest view */}
      {!isAdmin && status === "Available" && (
        <button
          className="clickRequest"
          onClick={handleRequest}
          disabled={requesting || busy}
        >
          {requesting ? "Submitting..." : "Request Stay"}
        </button>
      )}

      {!isAdmin && (status === "Pending" || status === "Accepted") && (
        <button className="clickRequest" disabled>
          {status === "Pending" ? "Pending" : "Occupied"}
        </button>
      )}

      {/* Admin view */}
      {isAdmin && (
        <div>
          {/* <Link to={`/edit/${shelter.id}`}>
            <button className="clickEdit" disabled={busy}>
              Edit
            </button>
          </Link> */}
          <Link to={`/admin/listings/${shelter.id}`}>
            <button>Edit</button>
          </Link>
          {onDelete && (
            <button className="clickDelete" disabled={busy} onClick={onDelete}>
              {busy ? "Deleting..." : "Delete"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

