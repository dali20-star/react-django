import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import config from "../config";

function FilesList() {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    axios.get(`${config.API_URL}files/`)
      .then((res) => setFiles(res.data))
      .catch((err) => console.error("Error fetching files:", err));
  }, []);

  return (
    <div className="mt-4">
      <h3 className="mb-4">Uploaded Files</h3>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>File Name</th>
            <th>Upload Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {files.map((file) => (
            <tr key={file.id}>
              <td>{file.id}</td>
              <td>{file.file_name}</td>
              <td>{new Date(file.upload_date).toLocaleString()}</td>
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
