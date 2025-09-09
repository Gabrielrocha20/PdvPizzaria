import React, { useEffect, useState } from "react";
import { FaUtensils, FaChevronLeft, FaChevronRight, FaChartBar, FaBox, FaFolder, FaIceCream, FaTag, FaUsers, FaSignOutAlt } from "react-icons/fa";
import { useCliente } from "../hook/useCliente";
import { useProduto } from "../hook/useProduto";
import SidebarMenu from "../components/menuPainel";

export default function PainelCadastro() {
  const { clientes, getAllClientes } = useCliente();
  const { produtos, getAllProdutos  } = useProduto();

  const [totalClientes, setTotalClientes] = useState(0);
  const [totalProdutos, setTotalProdutos] = useState(0);

  useEffect(() => {
    // Busca dados do Electron
    getAllClientes();
    getAllProdutos();
  }, []);

  useEffect(() => {
    setTotalClientes(clientes.length);
  }, [clientes]);

  useEffect(() => {
    setTotalProdutos(produtos.length);
  }, [produtos]);

  const handleLogout = () => {
    alert("Você saiu do sistema!");
    // navigate("/aaa"); - use seu navigate original aqui
  };

  return (
    <div style={styles.container}>

      {/* Main Content */}
      <div style={styles.mainContent}>
        <SidebarMenu />

        {/* Right Content */}
        <div style={styles.rightContent}>
          <div style={styles.pageHeader}>
            <h1 style={styles.pageTitle}>Painel de Controle</h1>
            <p style={styles.pageSubtitle}>Visão geral do sistema</p>
          </div>

          <div style={styles.cardsContainer}>
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <div style={styles.cardIcon}>
                  <FaBox />
                </div>
                <div style={styles.cardInfo}>
                  <h2 style={styles.cardTitle}>Produtos Cadastrados</h2>
                  <p style={styles.cardSubtitle}>Total de produtos no sistema</p>
                </div>
              </div>
              <p style={styles.cardNumber}>{totalProdutos}</p>
            </div>

            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <div style={styles.cardIcon}>
                  <FaUsers />
                </div>
                <div style={styles.cardInfo}>
                  <h2 style={styles.cardTitle}>Clientes</h2>
                  <p style={styles.cardSubtitle}>Total de clientes cadastrados</p>
                </div>
              </div>
              <p style={styles.cardNumber}>{totalClientes}</p>
            </div>
          </div>
        </div>
      </div>
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
  rightContent: {
    flex: 1,
    padding: "32px",
    overflow: "auto",
  },
  pageHeader: {
    marginBottom: "32px",
  },
  pageTitle: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#e2e8f0",
    margin: "0 0 8px 0",
  },
  pageSubtitle: {
    fontSize: "16px",
    color: "#94a3b8",
    margin: 0,
  },
  cardsContainer: {
    display: "flex",
    gap: "24px",
    marginBottom: "32px",
  },
  card: {
    flex: 1,
    backgroundColor: "#334155",
    border: "1px solid #475569",
    borderRadius: "12px",
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    transition: "all 0.2s ease",
  },
  cardHeader: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  cardIcon: {
    backgroundColor: "#10b981",
    color: "#ffffff",
    width: "48px",
    height: "48px",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#e2e8f0",
    margin: "0 0 4px 0",
  },
  cardSubtitle: {
    fontSize: "14px",
    color: "#94a3b8",
    margin: 0,
  },
  cardNumber: {
    fontSize: "48px",
    fontWeight: "700",
    color: "#10b981",
    textAlign: "center",
    margin: 0,
  },
  actionsSection: {
    marginTop: "32px",
  },
  sectionTitle: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#e2e8f0",
    marginBottom: "16px",
  },
  actionButtons: {
    display: "flex",
    gap: "16px",
    flexWrap: "wrap",
  },
  actionButton: {
    backgroundColor: "#475569",
    border: "1px solid #64748b",
    borderRadius: "8px",
    padding: "16px 24px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    color: "#e2e8f0",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    transition: "all 0.2s ease",
  },
  actionIcon: {
    fontSize: "16px",
    color: "#10b981",
  },
};
