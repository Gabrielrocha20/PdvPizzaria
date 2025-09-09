import React, { useState } from "react";
import { FaChevronLeft, FaChevronRight, FaChartBar, FaBox, FaFolder, FaIceCream, FaTag, FaUsers, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
export default function SidebarMenu() {
  const [menuOpen, setMenuOpen] = useState(true);
  const navigate = useNavigate();
  
  const handleNavigate = (path) => {
    console.log(`Navigating to: ${path}`);
    navigate(path)
  };

  const menuItems = [
    { path: "/painel", label: "Painel", icon: FaChartBar },
    { path: "/produtos", label: "Produtos", icon: FaBox },
    { path: "/categorias", label: "Categorias", icon: FaFolder },
    { path: "/sabores", label: "Sabores", icon: FaIceCream },
    { path: "/promocoes", label: "Promoções", icon: FaTag },
    { path: "/clientes", label: "Clientes", icon: FaUsers },
  ];

  return (
    <div style={{ ...styles.sidebar, width: menuOpen ? "280px" : "80px" }}>
      {/* Header do Menu */}
      <div style={styles.menuHeader}>
        {menuOpen && <span style={styles.menuTitle}>Menu</span>}
        <button 
          style={styles.toggleButton} 
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FaChevronLeft /> : <FaChevronRight />}
        </button>
      </div>

      {/* Items do Menu */}
      <div style={styles.menuItems}>
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <button
              key={item.path}
              style={styles.menuItem}
              onClick={() => handleNavigate(item.path)}
              title={!menuOpen ? item.label : ""}
            >
              <IconComponent style={styles.menuIcon} />
              {menuOpen && <span style={styles.menuLabel}>{item.label}</span>}
            </button>
          );
        })}
      </div>

      {/* Botão de Logout */}
      <div style={styles.menuFooter}>
        <button
          style={styles.logoutButton}
          onClick={() => handleNavigate("/")}
          title={!menuOpen ? "Sair" : ""}
        >
          <FaSignOutAlt style={styles.menuIcon} />
          {menuOpen && <span style={styles.menuLabel}>Sair</span>}
        </button>
      </div>
    </div>
  );
}

const styles = {
  sidebar: {
    backgroundColor: "#334155",
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    transition: "width 0.3s ease",
    borderRight: "1px solid #475569",
  },
  menuHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "20px 16px",
    borderBottom: "1px solid #475569",
    minHeight: "60px",
  },
  menuTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#e2e8f0",
  },
  toggleButton: {
    background: "none",
    border: "none",
    color: "#94a3b8",
    fontSize: "16px",
    cursor: "pointer",
    padding: "8px",
    borderRadius: "4px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s ease",
  },
  menuItems: {
    flex: 1,
    padding: "16px 0",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  menuItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px 16px",
    background: "none",
    border: "none",
    color: "#e2e8f0",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    transition: "all 0.2s ease",
    textAlign: "left",
    minHeight: "48px",
  },
  menuIcon: {
    fontSize: "18px",
    color: "#10b981",
    minWidth: "18px",
  },
  menuLabel: {
    fontSize: "14px",
    fontWeight: "500",
  },
  menuFooter: {
    padding: "16px",
    borderTop: "1px solid #475569",
  },
  logoutButton: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px 16px",
    background: "none",
    border: "1px solid #dc2626",
    borderRadius: "6px",
    color: "#dc2626",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    transition: "all 0.2s ease",
    width: "100%",
    textAlign: "left",
    minHeight: "48px",
  },
};