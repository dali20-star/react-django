import React, { useState } from "react";
import axios from "axios";
import { Container, Form, Button, Alert, Spinner } from "react-bootstrap";
import config from "../config";

function FileUpload() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage("");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a file before uploading.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);
      await axios.post(`${config.API_URL}upload/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage("File uploaded successfully!");
      setFile(null);
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Container className="mt-5">
      <h3 className="mb-4">Upload Test File</h3>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formFile" className="mb-3">
          <Form.Label>Select file to upload</Form.Label>
          <Form.Control type="file" onChange={handleFileChange} />
        </Form.Group>
        {uploading ? (
          <Button variant="primary" disabled>
            <Spinner size="sm" animation="border" className="me-2" />
            Uploading...
          </Button>
        ) : (
          <Button variant="primary" type="submit">Upload</Button>
        )}
      </Form>
      {message && <Alert variant="success" className="mt-3">{message}</Alert>}
      {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
    </Container>
  );
}

export default FileUpload;
