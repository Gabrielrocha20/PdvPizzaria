import React, { useState, useEffect } from "react";

export default function Message({ type = "success", message, onClose }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (message) {
      setVisible(true);
      // some sozinho depois de 5s
      const timer = setTimeout(() => {
        handleClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleClose = () => {
    setVisible(false);
    if (onClose) onClose();
  };

  if (!visible || !message) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: "1rem",
        right: "1rem",
        padding: "1rem 1.5rem",
        borderRadius: "0.5rem",
        color: "white",
        backgroundColor: type === "error" ? "#DC2626" : "#16A34A",
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        boxShadow: "0 4px 6px rgba(0,0,0,0.2)",
        zIndex: 1000,
        minWidth: "250px",
        justifyContent: "space-between",
      }}
    >
      <span>{message}</span>
      <button
        onClick={handleClose}
        style={{
          background: "transparent",
          border: "none",
          color: "white",
          fontWeight: "bold",
          fontSize: "1rem",
          cursor: "pointer",
        }}
      >
        ✖
      </button>
    </div>
  );
}
