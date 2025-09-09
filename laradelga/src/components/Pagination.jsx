import React from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function Pagination({ currentPage = 1, totalPages = 5, onPageChange }) {
  const handlePageChange = (page) => {
    if (onPageChange) {
      onPageChange(page);
    }
    console.log(`Changing to page: ${page}`);
  };

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];
    let l;

    for (let i = Math.max(2, currentPage - delta);
         i <= Math.min(totalPages - 1, currentPage + delta);
         i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  if (totalPages <= 1) return null;

  return (
    <div style={styles.pagination}>
      {/* Botão Anterior */}
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        style={{
          ...styles.pageButton,
          ...(currentPage === 1 ? styles.disabledButton : {}),
        }}
      >
        <FaChevronLeft style={styles.buttonIcon} />
        Anterior
      </button>

      {/* Números das páginas */}
      <div style={styles.pageNumbers}>
        {getVisiblePages().map((page, index) => (
          <button
            key={index}
            onClick={() => typeof page === 'number' ? handlePageChange(page) : null}
            disabled={typeof page !== 'number'}
            style={{
              ...styles.pageNumberButton,
              ...(page === currentPage ? styles.activePageButton : {}),
              ...(typeof page !== 'number' ? styles.dotsButton : {}),
            }}
          >
            {page}
          </button>
        ))}
      </div>

      {/* Botão Próximo */}
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        style={{
          ...styles.pageButton,
          ...(currentPage === totalPages ? styles.disabledButton : {}),
        }}
      >
        Próximo
        <FaChevronRight style={styles.buttonIcon} />
      </button>
    </div>
  );
}

const styles = {
  pagination: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: "24px",
    padding: "16px 0",
    borderTop: "1px solid #475569",
  },
  pageButton: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 16px",
    borderRadius: "6px",
    border: "1px solid #475569",
    backgroundColor: "#475569",
    color: "#e2e8f0",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    transition: "all 0.2s ease",
  },
  disabledButton: {
    backgroundColor: "#334155",
    color: "#64748b",
    cursor: "not-allowed",
    borderColor: "#334155",
  },
  buttonIcon: {
    fontSize: "12px",
  },
  pageNumbers: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
  },
  pageNumberButton: {
    padding: "8px 12px",
    borderRadius: "6px",
    border: "1px solid #475569",
    backgroundColor: "transparent",
    color: "#e2e8f0",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    transition: "all 0.2s ease",
    minWidth: "40px",
    height: "40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  activePageButton: {
    backgroundColor: "#10b981",
    borderColor: "#10b981",
    color: "#ffffff",
  },
  dotsButton: {
    cursor: "default",
    border: "none",
    backgroundColor: "transparent",
    color: "#64748b",
  },
};