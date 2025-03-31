"use client";
import { useState, useEffect } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, TablePagination, TableSortLabel, TextField, Button,Typography,Snackbar, Alert
} from "@mui/material";
import {
  getLocations, createLocation, updateLocation, deleteLocation
} from "./lib/api";
import { debounce } from "lodash";

const DataTable = () => {
  const [data, setData] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState("name");
  const [order, setOrder] = useState("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const [newLocation, setNewLocation] = useState({ name: "", city: "", country: "", province: "" });
  const [editLocation, setEditLocation] = useState(null);
 
  const [loading, setLoading] = useState(false);
const [itemsTotal,setTotalItems] = useState(0)
const [snackbarOpen, setSnackbarOpen] = useState(false);
const [snackbarMessage, setSnackbarMessage] = useState("");
const [snackbarSeverity, setSnackbarSeverity] = useState("success");

const fetchData = async () => {
  setLoading(true);
  try {
    const { data, totalItems } = await getLocations({
      search: searchTerm,
      page: page + 1, // json-server uses 1-based pagination
      limit: rowsPerPage,
      sort: sortBy,
      order,
    });

    console.log("API Response:", data); 

    setData(data); // Only store paginated data
    setTotalItems(totalItems); // Store total number of items
  } catch (error) {
    console.error("Error fetching data:", error);
    setData([]);
  }
  setLoading(false);
};

const handleCreateLocation = async () => {
  if (!newLocation.name || !newLocation.city || !newLocation.country || !newLocation.province) {
    alert("All fields are required!");
    return;
  }

  try {
    await createLocation(newLocation);
    setNewLocation({ name: "", city: "", country: "", province: "" }); 
    fetchData(); 
    showSnackbar("Location added successfully!", "success");
  } catch (error) {
    console.error("Failed to create location:", error);
    showSnackbar("Failed to add location!", "error"); 
  }
};

const showSnackbar = (message, severity = "success") => {
  setSnackbarMessage(message);
  setSnackbarSeverity(severity);
  setSnackbarOpen(true);
};


const handleSearchChange = debounce((value) => {
  setSearchTerm(value); 
}, 300);

useEffect(() => {
  console.log("Fetching data with:", { page, rowsPerPage, searchTerm, sortBy, order });
  fetchData();
}, [page, rowsPerPage, sortBy, order, searchTerm]);

useEffect(() => {
  console.log("Pagination State:", { totalItems: itemsTotal, page, rowsPerPage });
}, [itemsTotal, page, rowsPerPage]);

  const handleSort = (column) => {
    setSortBy(column);
    setOrder(order === "asc" ? "desc" : "asc");
  };

  const handleUpdateLocation = async () => {
    if (!editLocation || !editLocation.name || !editLocation.city || !editLocation.country || !editLocation.province) {
      alert("All fields are required!");
      return;
    }
  
    try {
      await updateLocation(editLocation.id, editLocation);
      setEditLocation(null); 
      fetchData();
      showSnackbar("Location updated successfully!", "success"); 
    } catch (error) {
      console.error("Failed to update location:", error);
      showSnackbar("Failed to update location!", "error"); 
    }
  };
  
  
  const handleDeleteLocation = async (id) => {
    if (!window.confirm("Are you sure you want to delete this location?")) return;
  
    try {
      await deleteLocation(id);
      fetchData(); 
      showSnackbar("Location deleted successfully!", "success"); 
    } catch (error) {
      console.error("Failed to delete location:", error);
      showSnackbar("Failed to delete location!", "error"); 
    }
  };
  
  

  return (
    <div className="w-full min-h-screen bg-gray-100 p-4">
     
      <Snackbar
  open={snackbarOpen}
  autoHideDuration={3000}
  onClose={() => setSnackbarOpen(false)}
  anchorOrigin={{ vertical: "top", horizontal: "right" }}
>
  <Alert
    onClose={() => setSnackbarOpen(false)}
    severity={snackbarSeverity}
    variant="filled"
  >
    {snackbarMessage}
  </Alert>
</Snackbar>

      <TextField
  label="Search..."
  variant="outlined"
  fullWidth
  value={searchInput}
  onChange={(e) => {
    setSearchInput(e.target.value);
    handleSearchChange(e.target.value);
  }}
  className="mb-4"
/>;
     
      <Paper className="p-4 mb-4" style={{display: 'flex',

    flexDirection: 'row',
    justifyContent: 'space-between'}}>
        <h3 className="font-bold text-lg">Add New Location</h3>
        {Object.keys(newLocation).map((key) => (
          <TextField
            key={key}
            label={key.charAt(0).toUpperCase() + key.slice(1)}
            value={newLocation[key]}
            onChange={(e) => setNewLocation({ ...newLocation, [key]: e.target.value })}
           
            margin="dense"
          />
        ))}
       <Button onClick={handleCreateLocation} variant="contained" color="primary">
  Create
</Button>

      </Paper>

      
      {editLocation && (
        <Paper className="p-4 mb-4">
          <h3 className="font-bold text-lg">Edit Location</h3>
          {Object.keys(editLocation).map((key) =>
            key !== "id" ? (
              <TextField
                key={key}
                label={key.charAt(0).toUpperCase() + key.slice(1)}
                value={editLocation[key]}
                onChange={(e) => setEditLocation({ ...editLocation, [key]: e.target.value })}
                fullWidth
                margin="dense"
              />
            ) : null
          )}
          <Button onClick={handleUpdateLocation} variant="contained" color="secondary">
  Update
</Button>

        </Paper>
      )}

    
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {["name", "city", "country", "province"].map((col) => (
                  <TableCell key={col}>
                    <TableSortLabel
                      active={sortBy === col}
                      direction={order}
                      onClick={() => handleSort(col)}
                    >
                      {col.charAt(0).toUpperCase() + col.slice(1)}
                    </TableSortLabel>
                  </TableCell>
                ))}
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">Loading...</TableCell>
                </TableRow>
              ) : data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">No data available</TableCell>
                </TableRow>
              ) : (
                data.map((item, index) => (
                  <TableRow key={item.id || index}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.city}</TableCell>
                    <TableCell>{item.country}</TableCell>
                    <TableCell>{item.province}</TableCell>
                    <TableCell>
                      <Button color="primary" onClick={() => setEditLocation(item)}>Edit</Button>
                      <Button color="secondary" onClick={() => handleDeleteLocation(item.id)}>
  Delete
</Button>

                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

       



<TablePagination
  component="div"
  count={itemsTotal}  
  page={page}
  rowsPerPage={rowsPerPage}
  rowsPerPageOptions={[5, 10, 20]}
  onPageChange={(_, newPage) => setPage(newPage)}  
  onRowsPerPageChange={(e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);  // Reset to first page on rows per page change
  }}
/>


      </Paper>
    </div>
  );
};

export default DataTable;
