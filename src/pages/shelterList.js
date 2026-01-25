import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Shelter from "../components/Shelters";
import { getListings, deleteListing } from "../services/api";

export default function Shade({ isAdmin = false }) {
  const [shelters, setShelters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null);

  const location = useLocation();

  async function fetchShelters() {
    try {
      setLoading(true);
      const data = await getListings();
      setShelters(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load shelters.");
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
    await deleteListing(id); // your API function
    setShelters(prev => prev.filter(s => s.id !== id));
  } catch (err) {
    console.error(err);
    setError("Failed to delete listing.");
  } finally {
    setBusyId(null);
  }
}


  useEffect(() => {
    fetchShelters();
  }, [location]);


  if (loading) return <p>Loading shelters...</p>;

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
              isAdmin={isAdmin}                  // <-- pass admin flag
              onDelete={isAdmin ? () => handleDelete(shelter.id) : null} // only admins can delete
            />
          ))}
        </div>
      )}
    </main>
  );
}
