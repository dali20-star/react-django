import React from "react";
import { Card } from "react-bootstrap";

function Home() {
  return (
    <Card className="text-center">
      <Card.Body>
        <Card.Title>Welcome to the Test File Manager</Card.Title>
        <Card.Text>Upload and manage your test files easily.</Card.Text>
      </Card.Body>
    </Card>
  );
}

export default Home;
