import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Home() {
  const [shelter, setShelter] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
        <h1>Manage all your cards in one secure place.</h1>
        <p>Track spending, organize cards, and stay in control of your finances with ease</p>
      </div>

      <div className="add">
        <Link to="/addShelter" className="addbutton">Add new listing</Link>
      </div>

      <h1 className="title">Temporary shelters</h1>

      {/* listing Section */}
      <div className="cards">

        {loading && <p>Loading listings...</p>}

        {!loading && shelter.length === 0 && (
          <p>No lisitng found. Add one to get started!</p>
        )}

        {!loading &&
          shelter.map((shelter) => (
            <div className="card" key={shelter.id}>
              {/* <img
              src={shelter.card_pic}
              alt={shelter.card_name}
              className="card-image"
              /> */}

              <h3>{shelter.listing_type}</h3>

              <h3>{shelter.listing_name}</h3>
              <h3>Location: {shelter.area}</h3>
              <h5>Price: {shelter.price}</h5>
              <p>Duration: {shelter.duration_hours}</p>
              <p>Rules: {shelter.rules}</p>
              <p>Verification: {shelter.verified}</p>
            </div>
          ))}
      </div>

    </div>


  );
}