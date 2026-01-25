import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { addListing } from "../services/api"; // import your API function

export default function AddListing({ isAdmin }) {
  const navigate = useNavigate();

  const [values, setValues] = useState({
    listing_type: "Host",
    listing_name: "",
    area: "",
    price: "",
    max_duration: "",
    rules: "",
    verified: 0,
  });

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  // Frontend admin guard
  useEffect(() => {
    if (!isAdmin) {
      alert("You are not authorized to access this page.");
      navigate("/"); // redirect non-admin users
    }
  }, [isAdmin, navigate]);

  // Handle input changes
  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setValues((prev) => ({ ...prev, [name]: checked ? 1 : 0 }));
      return;
    }
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  // Handle form submission
  async function handleSubmit(e) {
    e.preventDefault();
    if (!isAdmin) return; // extra safety

    setError("");

    if (!values.listing_name.trim() || !values.area.trim()) {
      setError("Listing name and area are required.");
      return;
    }

    try {
      setBusy(true);

      // Call api.js function
      const payload = {
        ...values,
        price: values.price === "" ? 0 : Number(values.price),
        max_duration: values.max_duration === "" ? 0 : Number(values.max_duration),
        verified: Number(values.verified),
      };

      const res = await addListing(payload);

      if (!res.success) {
        throw new Error(res.message || "Failed to add listing");
      }

      navigate("/admin/listings"); // redirect to admin page
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ maxWidth: 520, margin: "0 auto" }}>
      <h2>Add Listing (Admin)</h2>

      {error && (
        <div style={{ padding: 10, marginBottom: 12, border: "1px solid #ccc" }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <label>
          Listing Type
          <select
            name="listing_type"
            value={values.listing_type}
            onChange={handleChange}
            style={{ display: "block", width: "100%", marginBottom: 10 }}
          >
            <option value="Host">Host</option>
            <option value="Shelter">Shelter</option>
          </select>
        </label>

        <label>
          Listing Name
          <input
            name="listing_name"
            value={values.listing_name}
            onChange={handleChange}
            style={{ display: "block", width: "100%", marginBottom: 10 }}
            placeholder="e.g. Yishun Community Host Room"
          />
        </label>

        <label>
          Area (Approx)
          <input
            name="area"
            value={values.area}
            onChange={handleChange}
            style={{ display: "block", width: "100%", marginBottom: 10 }}
            placeholder="e.g. Yishun / Woodlands"
          />
        </label>

        <label>
          Price (0 for free)
          <input
            type="number"
            name="price"
            value={values.price}
            onChange={handleChange}
            style={{ display: "block", width: "100%", marginBottom: 10 }}
            placeholder="e.g. 0"
          />
        </label>

        <label>
          Max Duration (days)
          <input
            type="number"
            name="max_duration"
            value={values.max_duration}
            onChange={handleChange}
            style={{ display: "block", width: "100%", marginBottom: 10 }}
            placeholder="e.g. 14"
          />
        </label>

        <label>
          Rules
          <textarea
            name="rules"
            value={values.rules}
            onChange={handleChange}
            style={{ display: "block", width: "100%", marginBottom: 10 }}
            placeholder="e.g. No smoking, curfew 10pm"
            rows={4}
          />
        </label>

        <label style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 12 }}>
          <input
            type="checkbox"
            name="verified"
            checked={Number(values.verified) === 1}
            onChange={handleChange}
          />
          Verified
        </label>

        <button type="submit" disabled={busy} style={{ width: "100%", padding: 10 }}>
          {busy ? "Adding..." : "Add Listing"}
        </button>
      </form>
    </div>
  );
}
