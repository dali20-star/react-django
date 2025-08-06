import React, { useState } from "react";
import api from "../utils/axiosConfig"; // Use configured axios instead
import { Container, Form, Button, Alert, Spinner } from "react-bootstrap";

function FileUpload() {
  const [testName, setTestName] = useState("");
  const [status, setStatus] = useState("PASS");
  const [details, setDetails] = useState("");
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if user is logged in
    const token = localStorage.getItem('access');
    if (!token) {
      setError("Please login to upload files.");
      return;
    }

    if (!file || !testName || !status) {
      setError("All fields are required.");
      return;
    }

    const formData = new FormData();
    formData.append("test_name", testName);
    formData.append("status", status);
    formData.append("details", details);
    formData.append("test_file", file);
    // Remove the hardcoded uploaded_by_id - backend will set it automatically

    try {
      setUploading(true);
      setError("");
      
      await api.post('testresults/', formData, {
        headers: { 
          "Content-Type": "multipart/form-data"
        },
      });
      
      setMessage("Test uploaded successfully!");
      setTestName("");
      setStatus("PASS");
      setDetails("");
      setFile(null);
      setError("");
    } catch (err) {
      console.error("Upload error:", err);
      if (err.response?.status === 401) {
        setError("Authentication failed. Please login again.");
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        window.location.href = '/login';
      } else if (err.response?.data) {
        setError(`Upload failed: ${JSON.stringify(err.response.data)}`);
      } else {
        setError("Upload failed. Please try again.");
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <Container className="mt-5">
      <h3 className="mb-4">Upload New Test Result</h3>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Test Name</Form.Label>
          <Form.Control
            type="text"
            value={testName}
            onChange={(e) => setTestName(e.target.value)}
            required
          />
        </Form.Group>
        
        <Form.Group className="mb-3">
          <Form.Label>Status</Form.Label>
          <Form.Select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
          >
            <option value="PASS">PASS</option>
            <option value="FAIL">FAIL</option>
            <option value="SKIPPED">SKIPPED</option>
          </Form.Select>
        </Form.Group>
        
        <Form.Group className="mb-3">
          <Form.Label>Details</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={details}
            onChange={(e) => setDetails(e.target.value)}
          />
        </Form.Group>
        
        <Form.Group controlId="formFile" className="mb-3">
          <Form.Label>Test File</Form.Label>
          <Form.Control
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            required
          />
        </Form.Group>
        
        <Button variant="primary" type="submit" disabled={uploading}>
          {uploading ? (
            <>
              <Spinner size="sm" animation="border" className="me-2" />
              Uploading...
            </>
          ) : (
            "Upload Test"
          )}
        </Button>
      </Form>
      
      {message && <Alert variant="success" className="mt-3">{message}</Alert>}
      {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
    </Container>
  );
}

export default FileUpload;
