import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Home() {
  const [shelter, setShelter] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {

    document.title = "Temporary Shelter App";

    fetch("https://c219-shelterwebappservice.onrender.com/listings")
      .then((res) => res.json())
      .then((data) => {
        setShelter(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching shelter listing:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="home">
      <div className="headerHome">
        <h1>Find a safe and welcoming place to stay, even if it’s just for a short time.</h1>
        <p>Explore available temporary shelters near you and get the support you need, when you need it.</p>
      </div>

      {token && (
        <div className="add">
          <Link to="/admin/listings" className="addbutton">
            Add new listing
          </Link>
        </div>
      )}

      <h1 className="title">Temporary shelters</h1>

      <div className="cards">

        {loading && <p className="loading">Loading listings...</p>}

        {!loading && shelter.length === 0 && <p>No listing found. Add one to get started!</p>}

        {!loading &&
          shelter.map((s) => (
            <div className="card" key={s.id}>
              <img src={s.listing_pic} alt={s.listing_name} />

              <h3>{s.listing_type}</h3>
              <h3>{s.listing_name}</h3>
              <h3>Location: {s.area}</h3>
              <h5>Price: {s.price}</h5>

              {/* FIX: support both field names */}
              <p>Duration (days): {s.max_duration ?? s.duration_hours}</p>

              <p>Rules: {s.rules}</p>
              <p>Verification: {s.verified}</p>
            </div>
          ))}
      </div>
    </div>
  );
}
