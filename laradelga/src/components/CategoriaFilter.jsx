import React from "react";
import { FaChevronDown } from "react-icons/fa";

export default function CategoriaFilter({ categorias = [], selected, setSelected }) {
  // Dados de exemplo para demonstração
  const exemploCategories = categorias.length > 0 ? categorias : [
    { id: 1, nome: "Pizza Salgada" },
    { id: 2, nome: "Pizza Doce" },
    { id: 3, nome: "Bebidas" },
    { id: 4, nome: "Sobremesas" },
  ];

  return (
    <div style={styles.filterContainer}>
      <label style={styles.filterLabel}>Categoria:</label>
      <div style={styles.selectWrapper}>
        <select
          value={selected || ""}
          onChange={(e) => setSelected(e.target.value)}
          style={styles.filterSelect}
        >
          <option value="">Todas Categorias</option>
          {exemploCategories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nome}
            </option>
          ))}
        </select>
        <FaChevronDown style={styles.selectIcon} />
      </div>
    </div>
  );
}

const styles = {
  filterContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  filterLabel: {
    fontSize: "12px",
    color: "#94a3b8",
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: "0.025em",
  },
  selectWrapper: {
    position: "relative",
    display: "inline-block",
  },
  filterSelect: {
    appearance: "none",
    padding: "10px 40px 10px 14px",
    borderRadius: "6px",
    border: "1px solid #475569",
    backgroundColor: "#475569",
    color: "#e2e8f0",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    outline: "none",
    transition: "all 0.2s ease",
    minWidth: "180px",
  },
  selectIcon: {
    position: "absolute",
    right: "14px",
    top: "50%",
    transform: "translateY(-50%)",
    fontSize: "12px",
    color: "#94a3b8",
    pointerEvents: "none",
  },
};