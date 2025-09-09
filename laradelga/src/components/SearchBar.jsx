import React, { useState } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";

export default function SearchBar({ query = "", setQuery }) {
  const [localQuery, setLocalQuery] = useState(query);

  const handleChange = (e) => {
    const value = e.target.value;
    setLocalQuery(value);
    if (setQuery) {
      setQuery(value);
    }
  };

  const handleClear = () => {
    setLocalQuery("");
    if (setQuery) {
      setQuery("");
    }
  };

  const currentQuery = query !== undefined ? query : localQuery;

  return (
    <div style={styles.searchContainer}>
      <label style={styles.searchLabel}>Buscar:</label>
      <div style={styles.searchWrapper}>
        <FaSearch style={styles.searchIcon} />
        <input
          type="text"
          placeholder="Buscar produto..."
          value={currentQuery}
          onChange={handleChange}
          style={styles.searchInput}
        />
        {currentQuery && (
          <button
            onClick={handleClear}
            style={styles.clearButton}
            type="button"
          >
            <FaTimes />
          </button>
        )}
      </div>
    </div>
  );
}

const styles = {
  searchContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  searchLabel: {
    fontSize: "12px",
    color: "#94a3b8",
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: "0.025em",
  },
  searchWrapper: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  searchIcon: {
    position: "absolute",
    left: "14px",
    fontSize: "14px",
    color: "#64748b",
    zIndex: 1,
  },
  searchInput: {
    padding: "10px 14px 10px 44px",
    paddingRight: currentQuery => currentQuery ? "44px" : "14px",
    borderRadius: "6px",
    border: "1px solid #475569",
    backgroundColor: "#475569",
    color: "#e2e8f0",
    fontSize: "14px",
    outline: "none",
    transition: "all 0.2s ease",
    width: "280px",
    fontWeight: "400",
  },
  clearButton: {
    position: "absolute",
    right: "14px",
    background: "none",
    border: "none",
    color: "#64748b",
    fontSize: "12px",
    cursor: "pointer",
    padding: "4px",
    borderRadius: "2px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "color 0.2s ease",
  },
};