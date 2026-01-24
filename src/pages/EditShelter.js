import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getListingById, updateListing } from "./api";

export default function EditShelter() {
  const { id } = useParams(); // get the shelter ID from URL
  const navigate = useNavigate();

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch shelter data on load
  useEffect(() => {
    async function fetchListing() {
      try {
        const data = await getListingById(id);
        setListing(data);
      } catch (err) {
        console.error(err);
        alert("Failed to load listing.");
      } finally {
        setLoading(false);
      }
    }
    fetchListing();
  }, [id]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updatedListing = {
        listing_name: listing.listing_name,
        area: listing.area,
        price: listing.price,
        max_duration: listing.max_duration,
        rules: listing.rules,
        verified: listing.verified
      };
      const res = await updateListing(id, updatedListing);
      if (res.success) {
        alert("Listing updated successfully!");
        navigate("/admin"); // redirect to admin dashboard
      } else {
        alert("Failed to update listing.");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating listing.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!listing) return <p>Listing not found.</p>;

  return (
    <div className="edit-shelter">
      <h1>Edit Shelter</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Listing Name"
          value={listing.listing_name}
          onChange={(e) => setListing({ ...listing, listing_name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Area"
          value={listing.area}
          onChange={(e) => setListing({ ...listing, area: e.target.value })}
        />
        <input
          type="text"
          placeholder="Price"
          value={listing.price}
          onChange={(e) => setListing({ ...listing, price: e.target.value })}
        />
        <input
          type="text"
          placeholder="Max Duration"
          value={listing.max_duration}
          onChange={(e) => setListing({ ...listing, max_duration: e.target.value })}
        />
        <textarea
          placeholder="Rules"
          value={listing.rules}
          onChange={(e) => setListing({ ...listing, rules: e.target.value })}
        />
        <select
          value={listing.verified}
          onChange={(e) => setListing({ ...listing, verified: e.target.value })}
        >
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
        <button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Update Listing"}
        </button>
      </form>
    </div>
  );
}
