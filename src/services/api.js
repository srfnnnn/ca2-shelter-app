const API_URL = process.env.REACT_APP_API_URL;
console.log("API_URL:", API_URL);

function authHeader() { 
  const token = localStorage.getItem("token"); 
  return token ? { Authorization: `Bearer ${token}` } : {}; 
} 

 

export async function login(credentials) {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
  
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Login failed: ${errText}`);
  }

  const data = await res.json(); // ✅ parse JSON here
  return data;
}

// ------------------- LISTINGS -------------------

/** Get all listings */
export async function getListings() {
  const res = await fetch(`${API_URL}/listings`, {
    headers: authHeader(),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

/** Get one listing by ID */
export async function getListingById(id) {
  const res = await fetch(`${API_URL}/admin/listings/${id}`, {
    headers: {
      ...authHeader(), // include token
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to fetch listing");
  }

  return res.json();
}


//ADDING (ADMIN_ONLY)
export async function addListing(payload) {
  const res = await fetch(`${API_URL}/admin/listings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeader(), 
    },
    body: JSON.stringify(payload),
  });
  return res.json();
}

//EDITING (ADMIN_ONLY)
export async function updateListing(id, payload) {
  const res = await fetch(`${API_URL}/admin/listings/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeader() },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to update listing");
  return data;
}

//DELETE (ADMIN_ONLY)
export async function deleteListing(id) {
  const res = await fetch(`${API_URL}/admin/listings/${id}`, {
    method: "DELETE",
    headers: { ...authHeader() },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to delete listing");
  return data;
}


// ------------------- REQUESTS -------------------

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
  const res = await fetch(`${API_URL}/admin/requests/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...authHeader(),
    },
    body: JSON.stringify({ status }),
  });
  return res.json();
}
