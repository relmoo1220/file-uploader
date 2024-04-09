import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";

const App = () => {
  const baseUrl = "http://localhost:5000";
  const [jsonData, setJsonData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(jsonData ? jsonData.length / itemsPerPage : 0);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("csvFile", event.target.filePath.files[0]);

    try {
      const response = await axios.post(`${baseUrl}/read-csv`, formData, {
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded / progressEvent.total) * 100
          );
          setUploadProgress(progress);
        },
      });

      setJsonData(response.data);
      setCurrentPage(1);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    // Scroll to top of the page when page changes
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const filteredItems = jsonData
    ? jsonData.filter((item) =>
        Object.values(item).some((value) =>
          value.toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    : [];
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1); // Reset to first page when search query changes
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          name="filePath"
          id="filePath"
          placeholder="Enter file path"
        />
        <button type="submit">Upload</button>
      </form>
      <div>
        <h3>Upload Progress: {uploadProgress}%</h3>
        <progress value={uploadProgress} max={100}></progress>
      </div>
      <br></br>

      {jsonData && (
        <div>
          <span>
            <text>Search: </text>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
            ></input>
          </span>

          <h2>Uploaded CSV Data:</h2>
          <ul>
            {currentItems.map((item, index) => (
              <li key={index}>
                <strong>Post ID:</strong> {item['﻿"postId"']} <br />
                <strong>ID:</strong> {item["id"]} <br />
                <strong>Name:</strong> {item["name"]} <br />
                <strong>Email:</strong> {item["email"]} <br />
                <strong>Body:</strong> {item["body"]} <br />
                <br></br>
              </li>
            ))}
          </ul>
          <div>
            {Array.from({ length: totalPages }, (_, i) => (
              <button key={i + 1} onClick={() => paginate(i + 1)}>
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
