import axios from "axios";

const API_URL = "http://localhost:5002/locations";

export const getLocations = async ({ search = "", page = 1, limit = 10, sort = "name", order = "asc" }) => {
  try {
    const response = await axios.get(`${API_URL}`);

    let data = response.data;

    // Manual search filter
    if (search) {
      data = data.filter((item) =>
        Object.values(item).some((value) =>
          value.toString().toLowerCase().includes(search.toLowerCase())
        )
      );
    }

    // Sorting
    data = data.sort((a, b) =>
      order === "asc" ? a[sort].localeCompare(b[sort]) : b[sort].localeCompare(a[sort])
    );

    // Pagination
    const totalItems = data.length;
    const paginatedData = data.slice((page - 1) * limit, page * limit);

    return { data: paginatedData, totalItems };
  } catch (error) {
    console.error("Error fetching locations:", error);
    throw error;
  }
};


// Fetch a single location by ID
export const getLocationById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching location ${id}:`, error);
    throw error;
  }
};

// Create a new location
export const createLocation = async (location) => {
  try {
    const response = await axios.post(API_URL, location, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating location:", error);
    throw error;
  }
};

// Update an existing location
export const updateLocation = async (id, location) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, location, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating location ${id}:`, error);
    throw error;
  }
};

// Delete a location
export const deleteLocation = async (id) => {
  try {
    await axios.delete(`${API_URL}/${id}`);
  } catch (error) {
    console.error(`Error deleting location ${id}:`, error);
    throw error;
  }
};
