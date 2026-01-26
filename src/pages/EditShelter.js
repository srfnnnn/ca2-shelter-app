// import { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { getListingById, updateListing } from "../services/api";

// export default function EditShelter() {
//   const { id } = useParams(); // get the shelter ID from URL
//   const navigate = useNavigate();

//   const [listing, setListing] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);

//   // Fetch shelter data on load
//   useEffect(() => {
//     async function fetchListing() {
//       try {
//         const data = await getListingById(id);
//         setListing(data);
//       } catch (err) {
//         console.error(err);
//         alert("Failed to load listing.");
//       } finally {
//         setLoading(false);
//       }
//     }
//     fetchListing();
//   }, [id]);

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSaving(true);
//     try {
//       const updatedListing = {
//         listing_name: listing.listing_name,
//         area: listing.area,
//         price: listing.price,
//         max_duration: listing.max_duration,
//         rules: listing.rules,
//         verified: listing.verified
//       };
//       const res = await updateListing(id, updatedListing);
//       if (res.success) {
//         alert("Listing updated successfully!");
//         navigate("/admin"); // redirect to admin dashboard
//       } else {
//         alert("Failed to update listing.");
//       }
//     } catch (err) {
//       console.error(err);
//       alert("Error updating listing.");
//     } finally {
//       setSaving(false);
//     }
//   };

//   if (loading) return <p>Loading...</p>;
//   if (!listing) return <p>Listing not found.</p>;

//   return (
//     <div className="edit-shelter">
//       <h1>Edit Shelter</h1>
//       <form onSubmit={handleSubmit}>
//         <input
//           type="text"
//           placeholder="Listing Name"
//           value={listing.listing_name}
//           onChange={(e) => setListing({ ...listing, listing_name: e.target.value })}
//         />
//         <input
//           type="text"
//           placeholder="Area"
//           value={listing.area}
//           onChange={(e) => setListing({ ...listing, area: e.target.value })}
//         />
//         <input
//           type="text"
//           placeholder="Price"
//           value={listing.price}
//           onChange={(e) => setListing({ ...listing, price: e.target.value })}
//         />
//         <input
//           type="text"
//           placeholder="Max Duration"
//           value={listing.max_duration}
//           onChange={(e) => setListing({ ...listing, max_duration: e.target.value })}
//         />
//         <textarea
//           placeholder="Rules"
//           value={listing.rules}
//           onChange={(e) => setListing({ ...listing, rules: e.target.value })}
//         />
//         <select
//           value={listing.verified}
//           onChange={(e) => setListing({ ...listing, verified: e.target.value })}
//         >
//           <option value="Yes">Yes</option>
//           <option value="No">No</option>
//         </select>
//         <button type="submit" disabled={saving}>
//           {saving ? "Saving..." : "Update Listing"}
//         </button>
//       </form>
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getListingById, updateListing } from "../services/api";

export default function EditShelter() {
  const { id } = useParams(); // gets :id from URL
  const navigate = useNavigate();

  const [listing, setListing] = useState({
    listing_name: "",
    area: "",
    price: "",
    max_duration: "",
    rules: "",
    verified: "No",
    status: "Available",
  });

  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  // Check if admin is logged in
  const token = localStorage.getItem("token");
  if (!token) {
    // redirect guests or users to login page
    navigate("/login");
  }

  // Fetch current listing data
  useEffect(() => {
    async function fetchListing() {
      try {
        const data = await getListingById(id); // existing API function
        setListing(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load listing ");
      } finally {
        setLoading(false);
      }
    }

    fetchListing();
  }, [id]);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setListing((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");

    try {
      await updateListing(id, listing); // PUT /admin/listings/:id with token
      alert("Listing updated successfully!");
      navigate("/listing"); // go back to listing page
    } catch (err) {
      console.error(err);
      setError("Failed to update listing ");
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <p>Loading listing...</p>;

  return (
    <main>
      <h1>Edit Listing</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            name="listing_name"
            value={listing.listing_name}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Area:
          <input
            name="area"
            value={listing.area}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Price:
          <input
            name="price"
            type="number"
            value={listing.price}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Max Duration:
          <input
            name="max_duration"
            type="number"
            value={listing.max_duration}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Rules:
          <textarea
            name="rules"
            value={listing.rules}
            onChange={handleChange}
          />
        </label>

        <label>
          Verified:
          <select
            name="verified"
            value={listing.verified}
            onChange={handleChange}
          >
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </label>

        <label>
          Status:
          <select
            name="status"
            value={listing.status}
            onChange={handleChange}
          >
            <option value="Available">Available</option>
            <option value="Pending">Pending</option>
            <option value="Accepted">Accepted</option>
            <option value="Occupied">Occupied</option>
          </select>
        </label>

        <button type="submit" disabled={busy}>
          {busy ? "Updating..." : "Update Listing"}
        </button>
      </form>
    </main>
  );
}
