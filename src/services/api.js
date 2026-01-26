// /**
//  * API Service for Shelters App (React)
//  *
//  * 1) Create `.env` at project root
//  * 2) Set: REACT_APP_API_URL=https://YOUR-BACKEND.onrender.com
//  * 3) Restart `npm start`
//  */

const API_URL = process.env.REACT_APP_API_URL;

function authHeader() { 
  const token = localStorage.getItem("token"); 
  return token ? { Authorization: `Bearer ${token}` } : {}; 
} 
 

export async function login(credentials) {
  return fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
}

// ------------------- LISTINGS -------------------

/** Get all listings */
export async function getListings() {
  const res = await fetch(`${API_URL}/listings`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

/** Get one listing by ID */
export async function getListingById(id) {
  const res = await fetch(`${API_URL}/listings/${id}`);
  if (!res.ok) throw new Error(`Failed to fetch listing ${id}`);
  return res.json();
}

/** Add a new listing (admin) */
export async function addListing(listing) {
  const res = await fetch(`${API_URL}/admin/listings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeader()
    },
    body: JSON.stringify(listing),
  });
  return res.json();
}

/** Update a listing (admin) */
export async function updateListing(id, listing) {
  const res = await fetch(`${API_URL}/admin/listings/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...authHeader()
    },
    body: JSON.stringify(listing),
  });
  return res.json();
}

/** Delete a listing (admin) */
export async function deleteListing(id) {
  const res = await fetch(`${API_URL}/admin/listings/${id}`, {
    method: "DELETE",
    headers: {
      ...authHeader(),
    },
  });
  return res.json();
}

// ------------------- REQUESTS -------------------

/** Submit a request for a listing (user) */
export async function requestListing(id, request) {
  const res = await fetch(`${API_URL}/request/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });
  return res.json();
}

/** Update request status (admin) */
export async function updateRequestStatus(id, status) {
  const res = await fetch(`${API_URL}/admin/request/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...authHeader(),
    },
    body: JSON.stringify({ status }),
  });
  return res.json();
}

// // ------------------- ADMIN LOGIN -------------------

// /** Admin login */
// export async function adminLogin(credentials) {
//   const res = await fetch(`${API_URL}/admin/login`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(credentials),
//   });
//   return res.json();
// }
