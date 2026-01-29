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
    listing_pic: "",  
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
      navigate("/listings"); // go back to listing page
    } catch (err) {
      console.error(err);
      setError("Failed to update listing ");
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <p className="loading">Loading listing...</p>;

  return (
    <main>
      <h1 className="title">Edit Listing</h1>

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
          Duration (days):
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

        <label>
          Image 
          <input
          type="text"
          name="listing_pic"
          value={listing.listing_pic || ""}
          onChange={handleChange}
          style={{ display: "block", width: "100%", marginBottom: 10 }}
          placeholder="e.g. https://example.com/image.jpg"
          />
        </label>

        <button type="submit" disabled={busy}>
          {busy ? "Updating..." : "Update Listing"}
        </button>
      </form>
    </main>
  );
}
