import React, { useEffect, useState } from "react";
import api from "../utils/axiosConfig"; // Use authenticated axios
import { useParams, useNavigate } from "react-router-dom";
import { Form, Button, Alert, Spinner } from "react-bootstrap";

function EditFilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    test_name: "",
    status: "",
    details: ""
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");

  useEffect(() => {
    const fetchFile = async () => {
      try {
        // Check if user is logged in
        const token = localStorage.getItem('access');
        if (!token) {
          setMessage("Please login to edit files.");
          setMessageType("danger");
          setLoading(false);
          return;
        }

        const res = await api.get(`testresults/${id}/`);
        console.log("Fetched file data:", res.data); // Debug log
        
        setFormData({
          test_name: res.data.test_name || "",
          status: res.data.status || "",
          details: res.data.details || ""
        });
      } catch (err) {
        console.error("Error fetching file:", err);
        if (err.response?.status === 401) {
          setMessage("Authentication failed. Please login again.");
          localStorage.removeItem('access');
          localStorage.removeItem('refresh');
          window.location.href = '/login';
        } else {
          setMessage("Failed to load file data.");
        }
        setMessageType("danger");
      } finally {
        setLoading(false);
      }
    };

    fetchFile();
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      await api.put(`testresults/${id}/`, formData);
      setMessage("File updated successfully!");
      setMessageType("success");
      setTimeout(() => navigate("/files"), 1500);
    } catch (err) {
      console.error("Update error:", err);
      if (err.response?.status === 401) {
        setMessage("Authentication failed. Please login again.");
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        window.location.href = '/login';
      } else if (err.response?.data) {
        const errors = err.response.data;
        let errorMessage = "Update failed: ";
        
        if (typeof errors === 'object') {
          Object.keys(errors).forEach(key => {
            if (Array.isArray(errors[key])) {
              errorMessage += `${key}: ${errors[key].join(', ')} `;
            }
          });
        } else {
          errorMessage = errors.message || "Update failed.";
        }
        
        setMessage(errorMessage);
      } else {
        setMessage("Update failed. Please try again.");
      }
      setMessageType("danger");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="form-container mt-5 text-center">
        <Spinner animation="border" />
        <p>Loading file data...</p>
      </div>
    );
  }

  return (
    <div className="form-container mt-5">
      <h3 className="mb-4 text-center">Edit Test Result</h3>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="test_name" className="mb-3">
          <Form.Label>Test Name</Form.Label>
          <Form.Control
            type="text"
            name="test_name"
            value={formData.test_name}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="status" className="mb-3">
          <Form.Label>Status</Form.Label>
          <Form.Select
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
          >
            <option value="">Select Status</option>
            <option value="PASS">PASS</option>
            <option value="FAIL">FAIL</option>
            <option value="SKIPPED">SKIPPED</option>
          </Form.Select>
        </Form.Group>

        <Form.Group controlId="details" className="mb-3">
          <Form.Label>Details</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="details"
            value={formData.details}
            onChange={handleChange}
          />
        </Form.Group>

        <Button 
          variant="primary" 
          type="submit" 
          className="w-100"
          disabled={saving}
        >
          {saving ? (
            <>
              <Spinner size="sm" animation="border" className="me-2" />
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </Form>
      
      {message && (
        <Alert variant={messageType} className="mt-3 text-center">
          {message}
        </Alert>
      )}
    </div>
  );
}

export default EditFilePage;