import React from 'react';

const CacheModal = ({ onLoad, onCancel, cacheTimestamp }) => {
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }).format(date);
    } catch (e) {
      return dateString || 'Неизвестная дата';
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Найдены сохраненные данные</h3>
        </div>
        <div className="modal-body">
          <p>Обнаружены сохраненные данные от {formatDate(cacheTimestamp)}.</p>
          <p>Хотите загрузить их или начать новую сессию?</p>
        </div>
        <div className="modal-footer">
          <button onClick={onLoad} className="load-button">
            Загрузить данные
          </button>
          <button onClick={onCancel} className="cancel-button">
            Начать сначала
          </button>
        </div>
      </div>
    </div>
  );
};

export default CacheModal;