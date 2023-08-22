import "./Searchbar.css";
import { useState, useEffect } from "react";
import { AiOutlineUser } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";

const Searchbar = ({ onSearchResults }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOption, setSearchOption] = useState("title");
  const storedToken = localStorage.getItem("authToken");
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState("User");

  useEffect(() => {
    const fetchDisplayName = async () => {
      const user = firebase.auth().currentUser;
      if (user) {
        setDisplayName(user.displayName || "User");
      }
    };

    fetchDisplayName();
  }, []);
  const handleOptionChange = (event) => {
    setSearchOption(event.target.value);
  };

  const handleSearch = async (event) => {
    event.preventDefault();

    try {
      const url = `${process.env.REACT_APP_BACKEND_ENDPOINT}/search?searchQuery=${searchQuery}&searchOption=${searchOption}`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      console.log(response);
      const searchResults = await response.json();

      onSearchResults(searchResults); // Pass search results to parent component
    } catch (error) {
      console.error("An error occurred during search:", error);
    }
  };

  return (
    <div className="search-bar">
      <div className="container">
        <form className="search-form">
          <input
            type="search"
            placeholder={`Search by ${searchOption}...`}
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
          />
          <button className="search-btn" type="submit" onClick={handleSearch}>
            Search
          </button>
          <div className="search-options">
            <select value={searchOption} onChange={handleOptionChange}>
              <option value="title">Title</option>
              <option value="label">Label</option>
              <option value="due-date">Due Date</option>
            </select>
          </div>
        </form>
      </div>
      <div className="admin-panel">
        <AiOutlineUser className="admin-icon" />
        <p className="user-name">{displayName}</p>
      </div>
    </div>
  );
};

export default Searchbar;
