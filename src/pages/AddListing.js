import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { addListing } from "../services/api";

function isAdminFromToken(token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload?.role === "admin";
  } catch {
    return false;
  }
}

export default function AddListing() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const isAdmin = token ? isAdminFromToken(token) : false;

  const [values, setValues] = useState({
    listing_type: "Host",
    listing_name: "",
    area: "",
    price: "",
    duration_hours: "",
    rules: "",
    verified: "No",
    listing_pic: "",
  });

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) navigate("/login");
    else if (!isAdmin) navigate("/");
  }, [token, isAdmin, navigate]);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox" && name === "verified") {
      setValues((prev) => ({ ...prev, verified: checked ? "Yes" : "No" }));
      return;
    }

    setValues((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!values.listing_name.trim() || !values.area.trim()) {
      setError("Listing name and area are required.");
      return;
    }

    const durationNumber =
      values.duration_hours === "" ? 0 : Number(values.duration_hours);

    const payload = {
      listing_type: values.listing_type,
      listing_name: values.listing_name.trim(),
      area: values.area.trim(),
      price: values.price === "" ? 0 : Number(values.price),

      duration_hours: durationNumber,
      max_duration: durationNumber, // send both, backend can use either

      rules: values.rules,
      verified: values.verified, // "Yes"/"No"
      status: "Available",
      listing_pic: values.listing_pic?.trim() || "",
    };

    try {
      setBusy(true);
      await addListing(payload);
      navigate("/listings");
    } catch (err) {
      setError(err.message || "Server error - could not add listing");
    } finally {
      setBusy(false);
    }
  }

  if (!token || !isAdmin) return null;

  return (
    <div style={{ maxWidth: 520, margin: "0 auto" }}>
      <h2>Add Listing (Admin)</h2>

      {error && (
        <div
          style={{
            padding: 10,
            marginBottom: 12,
            border: "1px solid #ccc",
            color: "red",
          }}
        >
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
          />
        </label>

        <label>
          Area (Approx)
          <input
            name="area"
            value={values.area}
            onChange={handleChange}
            style={{ display: "block", width: "100%", marginBottom: 10 }}
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
          />
        </label>

        <label>
          Duration (days)
          <input
            type="number"
            name="duration_hours"
            value={values.duration_hours}
            onChange={handleChange}
            style={{ display: "block", width: "100%", marginBottom: 10 }}
          />
        </label>

        <label>
          Rules
          <textarea
            name="rules"
            value={values.rules}
            onChange={handleChange}
            style={{ display: "block", width: "100%", marginBottom: 10 }}
            rows={4}
          />
        </label>

        <label>
          Image (URL)
          <input
            type="text"
            name="listing_pic"
            value={values.listing_pic}
            onChange={handleChange}
            style={{ display: "block", width: "100%", marginBottom: 10 }}
            placeholder="https://example.com/image.jpg"
          />
        </label>

        <label style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 12 }}>
          <input
            type="checkbox"
            name="verified"
            checked={values.verified === "Yes"}
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
