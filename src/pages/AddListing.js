import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { addListing } from "../services/api";

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

  // Check login & admin
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    if (isAdmin === false) {
      navigate("/");
    }
  }, [isAdmin, navigate]);

  // Show loading if admin status unknown
  if (isAdmin === null) return <p>Checking permissions...</p>;
  if (isAdmin === false) return <p>You are not authorized to access this page.</p>;

  // Handle input changes
  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    }));
  }

  // Handle form submit
  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    // Basic validation
    if (!values.listing_name.trim() || !values.area.trim()) {
      setError("Listing name and area are required.");
      return;
    }

    try {
      setBusy(true);

      const payload = {
        ...values,
        listing_name: values.listing_name.trim(),
        area: values.area.trim(),
        price: values.price === "" ? 0 : Number(values.price),
        max_duration: values.max_duration === "" ? 0 : Number(values.max_duration),
        verified: Number(values.verified),
        status: "active", 
        listing_pic: values.listing_pic?.trim() || "",

      };

      console.log("Submitting payload:", payload);

      const response = await addListing(payload);
      console.log("Response from backend:", response);

      navigate("/listings"); // redirect on success
    } catch (err) {
      console.error("Error adding listing:", err);
      setError(err.message || "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ maxWidth: 520, margin: "0 auto" }}>
      <h2>Add Listing (Admin)</h2>

      {error && (
        <div style={{ padding: 10, marginBottom: 12, border: "1px solid #ccc", color: "red" }}>
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

        <label>
          Image 
          <input
          type="text"
          name="listing_pic"
          value={values.listing_pic || ""}
          onChange={handleChange}
          style={{ display: "block", width: "100%", marginBottom: 10 }}
          placeholder="e.g. https://example.com/image.jpg"
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
