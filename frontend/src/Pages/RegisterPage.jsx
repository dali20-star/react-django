import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import config from "../config";
import axios from "axios";

function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${config.API_URL}register/`, { email, password });
      setMsg("Registered successfully. You can now login.");
      setTimeout(() => navigate("/login"), 1500);
    } catch {
      setMsg("Registration failed.");
    }
  };

  return (
    <div className="form-container mt-5">
      <h3 className="mb-4 text-center">Register</h3>
      <Form onSubmit={handleRegister}>
        <Form.Group controlId="email" className="mb-3">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="password" className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <Button type="submit" className="w-100">Register</Button>
        {msg && <Alert className="mt-3">{msg}</Alert>}
      </Form>
    </div>
  );
}

export default RegisterPage;
