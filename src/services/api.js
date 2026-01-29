const API_URL = process.env.REACT_APP_API_URL;

//FOR ADMIN - PROTECTS DATA 
function authHeader() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function parseResponse(res) {
  const text = await res.text();
  try {
    const json = text ? JSON.parse(text) : {};
    return { ok: res.ok, status: res.status, data: json, raw: text };
  } catch {
    return { ok: res.ok, status: res.status, data: null, raw: text };
  }
}

// AUTH
export async function login(credentials) {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  const p = await parseResponse(res);
  if (!p.ok) throw new Error(p.data?.message || p.raw || `Login failed (HTTP ${p.status})`);
  return p.data;
}

// LISTINGS (public)
export async function getListings() {
  const res = await fetch(`${API_URL}/listings`);
  const p = await parseResponse(res);
  if (!p.ok) throw new Error(p.data?.message || p.raw || `Failed to load listings (HTTP ${p.status})`);
  return p.data;
}

// LISTINGS (admin)
export async function addListing(payload) {
  const res = await fetch(`${API_URL}/admin/listings`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeader() },
    body: JSON.stringify(payload),
  });

  const p = await parseResponse(res);
  if (!p.ok) throw new Error(p.data?.message || p.raw || `Could not add listing (HTTP ${p.status})`);
  return p.data;
}

//
export async function getListingById(id) {
  const res = await fetch(`${API_URL}/admin/listings/${id}`, {
    headers: { ...authHeader() },
  });

  const p = await parseResponse(res);
  if (!p.ok) throw new Error(p.data?.message || p.raw || `Failed to fetch listing (HTTP ${p.status})`);
  return p.data;
}

export async function updateListing(id, payload) {
  const res = await fetch(`${API_URL}/admin/listings/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeader() },
    body: JSON.stringify(payload),
  });

  const p = await parseResponse(res);
  if (!p.ok) throw new Error(p.data?.message || p.raw || `Failed to update listing (HTTP ${p.status})`);
  return p.data;
}

//DELETE LISTING (ADMIN)
export async function deleteListing(id) {
  const res = await fetch(`${API_URL}/admin/listings/${id}`, {
    method: "DELETE",
    headers: { ...authHeader() },
  });

  const p = await parseResponse(res);
  if (!p.ok) throw new Error(p.data?.message || p.raw || `Failed to delete listing (HTTP ${p.status})`);
  return p.data;
}

// REQUEST (guest)
export async function requestListing(id, request) {
  const res = await fetch(`${API_URL}/request/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });

  const p = await parseResponse(res);
  if (!p.ok) throw new Error(p.data?.message || p.raw || `Request failed (HTTP ${p.status})`);
  return p.data;
}

// ADMIN TO VIEW REQUEST STAY APPLICATION
export async function updateRequestStatus(id, status) {
  const res = await fetch(`${API_URL}/admin/requests/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeader() },
    body: JSON.stringify({ status }),
  });

  const p = await parseResponse(res);
  if (!p.ok) throw new Error(p.data?.message || p.raw || `Failed to update request (HTTP ${p.status})`);
  return p.data;
}
