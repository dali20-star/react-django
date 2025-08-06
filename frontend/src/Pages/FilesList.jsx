import React, { useEffect, useState } from "react";
import api from "../utils/axiosConfig"; // Use authenticated axios
import { Table, Button, Alert, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";

function FilesList() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchFiles = async () => {
    try {
      setLoading(true);
      setError("");
      
      const res = await api.get('testresults/');
      console.log("Fetched files:", res.data); // Debug log
      
      // Handle both paginated and non-paginated responses
      if (res.data.results) {
        setFiles(res.data.results); // Paginated response
      } else if (Array.isArray(res.data)) {
        setFiles(res.data); // Direct array response
      } else {
        setFiles([]);
      }
    } catch (err) {
      console.error("Error fetching test results:", err);
      if (err.response?.status === 401) {
        setError("Please login to view files.");
        // Redirect to login if not authenticated
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        window.location.href = '/login';
      } else {
        setError("Failed to load test results. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('access');
    if (!token) {
      setError("Please login to view files.");
      setLoading(false);
      return;
    }

    fetchFiles();
  }, []);

  // Function to refresh the list (you can call this after upload)
  const refreshFiles = () => {
    fetchFiles();
  };

  if (loading) {
    return (
      <div className="mt-4 text-center">
        <Spinner animation="border" />
        <p>Loading test results...</p>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Test Results</h3>
        <Button variant="outline-primary" onClick={refreshFiles}>
          Refresh
        </Button>
      </div>

      {error && (
        <Alert variant="danger" className="mb-3">
          {error}
        </Alert>
      )}

      {files.length === 0 && !error ? (
        <Alert variant="info">
          No test results found. <Link to="/upload">Upload your first test</Link>
        </Alert>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Test Name</th>
              <th>Status</th>
              <th>Executed At</th>
              <th>File</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {files.map((file) => (
              <tr key={file.id}>
                <td>{file.id}</td>
                <td>{file.test_name}</td>
                <td>
                  <span className={`badge ${
                    file.status === 'PASS' ? 'bg-success' : 
                    file.status === 'FAIL' ? 'bg-danger' : 
                    'bg-warning'
                  }`}>
                    {file.status}
                  </span>
                </td>
                <td>{new Date(file.executed_at).toLocaleString()}</td>
                <td>
                  {file.test_file ? (
                    <a 
                      href={file.test_file} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="btn btn-sm btn-outline-primary"
                    >
                      Download
                    </a>
                  ) : (
                    <span className="text-muted">No file</span>
                  )}
                </td>
                <td>
                  <Button 
                    variant="warning" 
                    size="sm" 
                    as={Link} 
                    to={`/edit/${file.id}`}
                  >
                    Edit
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}

export default FilesList;
