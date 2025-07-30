import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import config from "../config";

function FilesList() {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    axios.get(`${config.API_URL}testresults/`)
      .then((res) => setFiles(res.data))
      .catch((err) => console.error("Error fetching test results:", err));
  }, []);

  return (
    <div className="mt-4">
      <h3 className="mb-4">Test Results</h3>
      <Table striped bordered hover>
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
              <td>{file.status}</td>
              <td>{new Date(file.executed_at).toLocaleString()}</td>
              <td>
                {file.file_url ? (
                  <a href={file.file_url} target="_blank" rel="noopener noreferrer">
                    {file.file_name}
                  </a>
                ) : (
                  "No file"
                )}
              </td>
              <td>
                <Button variant="warning" size="sm" as={Link} to={`/edit/${file.id}`}>
                  Edit
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default FilesList;
