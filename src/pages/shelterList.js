import { useEffect, useState } from "react";
import Shelter from "../components/Shelters";
import { getListings, deleteListing } from "../services/api";

export default function ShelterList() {
  const [shelters, setShelters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null);

  // Only check if admin is logged in via token
  const token = localStorage.getItem("token");
  const isAdmin = token && JSON.parse(atob(token.split(".")[1])).role === "admin";


  async function fetchShelters() {
    try {
      setLoading(true);
      const data = await getListings(); // public API, no auth needed for guests
      setShelters(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load shelters: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this listing? This action cannot be undone."
    );
    if (!confirmed) return;

    try {
      setBusyId(id);
      await deleteListing(id); // API uses token for auth
      setShelters(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      console.error(err);
      setError("Failed to delete listing: " + err.message);
    } finally {
      setBusyId(null);
    }
  }

  useEffect(() => {
    fetchShelters();
  }, []); // fetch once on mount

  if (loading) return <p className="loading">Loading shelters...</p>;

  return (
    <main>
      <h1 className="title">
        {isAdmin ? "Manage Shelter Listings" : "Available Shelters"}
      </h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {shelters.length === 0 ? (
        <p>No shelter listings found.</p>
      ) : (
        <div className="shelter-list">
          {shelters.map((shelter) => (
            <Shelter
              key={shelter.id}
              shelter={shelter}
              busy={busyId === shelter.id}
              isAdmin={isAdmin} // only show edit/delete if admin
              onDelete={isAdmin ? () => handleDelete(shelter.id) : null}
            />
          ))}
        </div>
      )}
    </main>
  );
}
