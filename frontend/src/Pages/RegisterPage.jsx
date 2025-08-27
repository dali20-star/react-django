import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import config from "../config";
import axios from "axios";

function RegisterPage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    phone_number: "",
    password: "",
    password_confirm: ""
  });
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setMsg("");
    
    try {
      const res = await axios.post(`${config.API_URL}auth/register/`, formData);
      
      // Store tokens returned from backend
      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);
      
      setMsg("Registered successfully! Redirecting...");
      setMsgType("success");
      setTimeout(() => navigate("/"), 1500);
    } catch (error) {
      if (error.response?.data) {
        const errors = error.response.data;
        let errorMessage = "";
        
        // Handle field-specific errors
        Object.keys(errors).forEach(key => {
          if (Array.isArray(errors[key])) {
            errorMessage += `${key}: ${errors[key].join(', ')} `;
          }
        });
        
        setMsg(errorMessage || "Registration failed.");
      } else {
        setMsg("Network error. Please try again.");
      }
      setMsgType("danger");
    }
  };

  return (
    <div className="form-container mt-5">
      <h3 className="mb-4 text-center">Register</h3>
      <Form onSubmit={handleRegister}>
        <Form.Group controlId="username" className="mb-3">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            name="username"
            required
            value={formData.username}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group controlId="email" className="mb-3">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group controlId="first_name" className="mb-3">
          <Form.Label>First Name</Form.Label>
          <Form.Control
            type="text"
            name="first_name"
            required
            value={formData.first_name}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group controlId="last_name" className="mb-3">
          <Form.Label>Last Name</Form.Label>
          <Form.Control
            type="text"
            name="last_name"
            required
            value={formData.last_name}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group controlId="phone_number" className="mb-3">
          <Form.Label>Phone Number</Form.Label>
          <Form.Control
            type="tel"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group controlId="password" className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            name="password"
            required
            value={formData.password}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group controlId="password_confirm" className="mb-3">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            name="password_confirm"
            required
            value={formData.password_confirm}
            onChange={handleChange}
          />
        </Form.Group>

        <Button type="submit" className="w-100">Register</Button>
        
        {msg && (
          <Alert variant={msgType === "success" ? "success" : "danger"} className="mt-3">
            {msg}
          </Alert>
        )}
      </Form>
    </div>
  );
}

export default RegisterPage;