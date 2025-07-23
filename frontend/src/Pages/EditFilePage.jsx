import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Button, Alert } from "react-bootstrap";
import config from "../config";

function EditFilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [fileName, setFileName] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios.get(`${config.API_URL}files/${id}/`)
      .then((res) => setFileName(res.data.file_name))
      .catch((err) => console.error(err));
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.put(`${config.API_URL}files/${id}/`, { file_name: fileName })
      .then(() => {
        setMessage("File updated successfully.");
        setTimeout(() => navigate("/files"), 1000);
      })
      .catch(() => setMessage("Update failed."));
  };

  return (
    <div className="form-container mt-5">
      <h3 className="mb-4 text-center">Edit File</h3>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="fileName" className="mb-3">
          <Form.Label>File Name</Form.Label>
          <Form.Control
            type="text"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
          />
        </Form.Group>
        <Button variant="primary" type="submit" className="w-100">Save</Button>
      </Form>
      {message && <Alert variant="info" className="mt-3 text-center">{message}</Alert>}
    </div>
  );
}

export default EditFilePage;
