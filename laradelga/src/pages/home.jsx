import React, { useState } from "react";
import { FaUtensils, FaCashRegister, FaListAlt, FaFileAlt, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useImpressoraPadrao } from '../hook/useGetImpressoraHook'


export default function Home() {
  const [showCashModal, setShowCashModal] = useState(false);
  const navigate = useNavigate();
  const { impressora} = useImpressoraPadrao();
  
  // Simulação do faturamento do dia
  const dailyRevenue = 1250.75;
  
  const handleNavigate = (path) => {
    console.log(`Navigating to: ${path}`);
    navigate(path)
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.logo}>
            <FaUtensils style={styles.logoIcon} />
            <span style={styles.logoText}>LARADELGA</span>
          </div>
        </div>
        <div style={impressora?.conectada === true ? styles.impressora_text_active : styles.impressora_text_desactive}>{impressora?.nome}</div>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        {/* Left Sidebar */}

        {/* Right Content Area */}
        <div style={styles.rightContent}>
          <div style={styles.moduleGrid}>
            <button 
              style={styles.moduleButton} 
              onClick={() => handleNavigate("/balcao")}
            >
              <FaUtensils style={styles.moduleIcon} />
              <span>Balcão</span>
            </button>

            <button 
              style={styles.moduleButton} 
              onClick={() => setShowCashModal(true)}
            >
              <FaCashRegister style={styles.moduleIcon} />
              <span>Caixa</span>
            </button>

            <button 
              style={styles.moduleButton} 
              onClick={() => handleNavigate("/painel")}
            >
              <FaListAlt style={styles.moduleIcon} />
              <span>Painel</span>
            </button>

            <button style={styles.moduleButton}>
              <FaFileAlt style={styles.moduleIcon} />
              <span>Relatório</span>
            </button>
          </div>

          <div style={styles.welcomeSection}>
            <div style={styles.welcomeIcon}>
              <FaUtensils />
            </div>
            <p style={styles.welcomeText}>
              Selecione um módulo para acessar o sistema
            </p>
          </div>
        </div>
      </div>

      {/* Modal de Faturamento */}
      {showCashModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>Faturamento do Dia</h3>
              <button 
                style={styles.modalCloseBtn}
                onClick={() => setShowCashModal(false)}
              >
                <FaTimes />
              </button>
            </div>
            <div style={styles.modalBody}>
              <p style={styles.revenueAmount}>R$ {dailyRevenue.toFixed(2)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    width: "1004px",
    height: "100vh",
    backgroundColor: "#1e293b",
    color: "#e2e8f0",
    fontFamily: "system-ui, -apple-system, sans-serif",
    display: "flex",
    flexDirection: "column",
  },
  header: {
    height: "60px",
    backgroundColor: "#0f172a",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 20px",
    borderBottom: "1px solid #334155",
  },
  impressoraStatus:{
    textAlign: 'center',
    marginBottom: '30px'
  },
  impressora_text_active: {
    color: '#00ff0d'
  },
  impressora_text_desactive: {
    color: '#ff0000'
  },
  headerLeft: {
    display: "flex",
    alignItems: "center",
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  logoIcon: {
    fontSize: "24px",
    color: "#10b981",
    backgroundColor: "#064e3b",
    padding: "8px",
    borderRadius: "6px",
  },
  logoText: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#e2e8f0",
  },
  headerRight: {
    fontSize: "14px",
    color: "#94a3b8",
  },
  version: {
    fontSize: "14px",
    color: "#94a3b8",
  },
  mainContent: {
    flex: 1,
    display: "flex",
  },
  leftSidebar: {
    width: "280px",
    backgroundColor: "#334155",
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  infoSection: {
    marginBottom: "24px",
  },
  infoTitle: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#e2e8f0",
    marginBottom: "12px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  infoItem: {
    display: "flex",
    justifyContent: "space-between",
    padding: "8px 12px",
    backgroundColor: "#475569",
    borderRadius: "6px",
    fontSize: "14px",
  },
  infoLabel: {
    color: "#94a3b8",
  },
  statusSection: {
    marginBottom: "24px",
  },
  statusItem: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    padding: "12px",
    backgroundColor: "#475569",
    borderRadius: "6px",
  },
  statusLabel: {
    fontSize: "12px",
    color: "#94a3b8",
  },
  statusValue: {
    fontSize: "14px",
    color: "#10b981",
    fontWeight: "600",
  },
  versionInfo: {
    fontSize: "12px",
    color: "#64748b",
    textAlign: "center",
  },
  rightContent: {
    flex: 1,
    padding: "24px",
    display: "flex",
    flexDirection: "column",
  },
  moduleGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "16px",
    marginBottom: "40px",
  },
  moduleButton: {
    backgroundColor: "#475569",
    border: "none",
    borderRadius: "8px",
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "12px",
    color: "#e2e8f0",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    transition: "all 0.2s ease",
    minHeight: "120px",
    justifyContent: "center",
  },
  moduleIcon: {
    fontSize: "32px",
    color: "#10b981",
  },
  welcomeSection: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "16px",
  },
  welcomeIcon: {
    fontSize: "48px",
    color: "#475569",
  },
  welcomeText: {
    fontSize: "14px",
    color: "#64748b",
    textAlign: "center",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: "#334155",
    borderRadius: "8px",
    width: "400px",
    border: "1px solid #475569",
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px",
    borderBottom: "1px solid #475569",
  },
  modalTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#e2e8f0",
    margin: 0,
  },
  modalCloseBtn: {
    background: "none",
    border: "none",
    color: "#94a3b8",
    fontSize: "16px",
    cursor: "pointer",
    padding: "4px",
  },
  modalBody: {
    padding: "24px",
    textAlign: "center",
  },
  revenueAmount: {
    fontSize: "32px",
    fontWeight: "bold",
    color: "#10b981",
    margin: 0,
  },
};