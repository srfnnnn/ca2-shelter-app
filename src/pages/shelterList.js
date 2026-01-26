// import { useEffect, useState } from "react";
// import { useLocation } from "react-router-dom";
// import Shelter from "../components/Shelters";
// import { getListings, deleteListing } from "../services/api";

// export default function ShelterList() {
//   const [shelters, setShelters] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [busyId, setBusyId] = useState(null);

//   const location = useLocation();

//   // Determine if the logged-in user is an admin
//   const userStr = localStorage.getItem("user");
//   const user = userStr ? JSON.parse(userStr) : null;
//   const isAdmin = user?.role === "admin";


//   async function fetchShelters() {
//     try {
//       setLoading(true);
//       const data = await getListings();
//       setShelters(data);
//     } catch (err) {
//       console.error(err);
//       setError("Failed to load shelters.");
//     } finally {
//       setLoading(false);
//     }
//   }

//   async function handleDelete(id) {
//   const confirmed = window.confirm(
//     "Are you sure you want to delete this listing? This action cannot be undone."
//   );
//   if (!confirmed) return;

//   try {
//     setBusyId(id);
//     await deleteListing(id); // your API function

//     setShelters(prev => prev.filter(s => s.id !== id));
//   } catch (err) {
//     console.error(err);
//     setError("Failed to delete listing.");
//   } finally {
//     setBusyId(null);
//   }
// }


//   useEffect(() => {
//     fetchShelters();
//   }, []);


//   if (loading) return <p>Loading shelters...</p>;

//   return (
//     <main>
//       <h1 className="title">
//         {isAdmin ? "Manage Shelter Listings" : "Available Shelters"}
//       </h1>

//       {error && <p style={{ color: "red" }}>{error}</p>}

//       {shelters.length === 0 ? (
//         <p>No shelter listings found.</p>
//       ) : (
//         <div className="shelter-list">
//           {shelters.map((shelter) => (
//             <Shelter
//               key={shelter.id}
//               shelter={shelter}
//               busy={busyId === shelter.id}
//               isAdmin={isAdmin}                  // <-- pass admin flag
//               user={user}
//               onDelete={isAdmin ? () => handleDelete(shelter.id) : null} // only admins can delete
//             />
//           ))}
//         </div>
//       )}
//     </main>
//   );
// }

import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Shelter from "../components/Shelters";
import { getListings, deleteListing } from "../services/api";

export default function ShelterList() {
  const [shelters, setShelters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null);

  const location = useLocation();

  // Only check if admin is logged in via token
  const token = localStorage.getItem("token");
  const isAdmin = !!token; // admin is logged in if token exists

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
              isAdmin={isAdmin} // only show edit/delete if admin
              onDelete={isAdmin ? () => handleDelete(shelter.id) : null}
            />
          ))}
        </div>
      )}
    </main>
  );
}
