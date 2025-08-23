import React from 'react';
import PropTypes from 'prop-types';

// Helper to prevent rendering invalid dates
const formatDate = (dateString) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? null : date.toLocaleDateString('ko-KR');
};

const SummaryBox = ({ keyInfo, isLoading }) => {
  if (isLoading) {
    return (
      <div style={styles.container}>
        <p style={styles.loadingText}>🔍 AI가 핵심 정보를 분석 중입니다...</p>
      </div>
    );
  }

  if (!keyInfo) {
    return null; // Don't render anything if there's no info
  }

  const hasContent = Object.values(keyInfo).some(value => value !== null && value !== '' && (!Array.isArray(value) || value.length > 0));

  if (!hasContent) {
    return null; // Don't render if all fields are empty or null
  }

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>✨ 한눈에 보는 핵심 정보</h3>
      <div style={styles.grid}>
        {formatDate(keyInfo.date) && (
          <div style={styles.infoItem}>
            <span style={styles.icon}>🗓️</span>
            <div>
              <p style={styles.label}>날짜</p>
              <p style={styles.value}>{formatDate(keyInfo.date)}</p>
            </div>
          </div>
        )}
        {keyInfo.time && (
          <div style={styles.infoItem}>
            <span style={styles.icon}>⏰</span>
            <div>
              <p style={styles.label}>시간</p>
              <p style={styles.value}>{keyInfo.time}</p>
            </div>
          </div>
        )}
        {keyInfo.location && (
          <div style={styles.infoItem}>
            <span style={styles.icon}>📍</span>
            <div>
              <p style={styles.label}>장소</p>
              <p style={styles.value}>{keyInfo.location}</p>
            </div>
          </div>
        )}
        {keyInfo.cost && (
          <div style={styles.infoItem}>
            <span style={styles.icon}>💰</span>
            <div>
              <p style={styles.label}>비용</p>
              <p style={styles.value}>{keyInfo.cost}</p>
            </div>
          </div>
        )}
        {keyInfo.target && (
          <div style={styles.infoItem}>
            <span style={styles.icon}>👥</span>
            <div>
              <p style={styles.label}>대상</p>
              <p style={styles.value}>{keyInfo.target}</p>
            </div>
          </div>
        )}
        {formatDate(keyInfo.deadline) && (
          <div style={styles.infoItem}>
            <span style={styles.icon}>🔔</span>
            <div>
              <p style={styles.label}>회신 기한</p>
              <p style={styles.value}>{formatDate(keyInfo.deadline)}</p>
            </div>
          </div>
        )}
      </div>
      {keyInfo.items && keyInfo.items.length > 0 && (
        <div style={{...styles.infoItem, ...styles.fullWidth}}>
          <span style={styles.icon}>🎒</span>
          <div>
            <p style={styles.label}>준비물</p>
            <p style={styles.value}>{keyInfo.items.join(', ')}</p>
          </div>
        </div>
      )}
    </div>
  );
};

SummaryBox.propTypes = {
  keyInfo: PropTypes.shape({
    date: PropTypes.string,
    time: PropTypes.string,
    location: PropTypes.string,
    cost: PropTypes.string,
    items: PropTypes.arrayOf(PropTypes.string),
    target: PropTypes.string,
    deadline: PropTypes.string,
  }),
  isLoading: PropTypes.bool,
};

const styles = {
  container: {
    fontFamily: 'sans-serif',
    backgroundColor: '#f0f7ff',
    border: '1px solid #b3d7ff',
    borderRadius: '12px',
    padding: '20px',
    margin: '20px 0',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
  },
  title: {
    marginTop: '0',
    marginBottom: '16px',
    color: '#005a9e',
    fontSize: '1.2em',
    fontWeight: 'bold',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
  },
  infoItem: {
    display: 'flex',
    alignItems: 'flex-start',
    backgroundColor: '#ffffff',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #e0e0e0',
  },
  icon: {
    fontSize: '1.8em',
    marginRight: '12px',
    lineHeight: '1',
  },
  label: {
    margin: '0 0 4px 0',
    fontSize: '0.9em',
    color: '#555',
    fontWeight: 'bold',
  },
  value: {
    margin: '0',
    fontSize: '1em',
    color: '#333',
  },
  fullWidth: {
    gridColumn: '1 / -1',
  },
  loadingText: {
    color: '#005a9e',
    textAlign: 'center',
    fontSize: '1.1em',
  },
};

export default SummaryBox;
