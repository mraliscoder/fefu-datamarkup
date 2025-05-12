import React, { useState } from 'react';

const TimecodeItem = ({ timecode, isActive, onPlay, updateResponse }) => {
  const { start, end, responses } = timecode;
  const [isExpanded, setIsExpanded] = useState(isActive);

  const filledFields = Object.values(responses).filter(val => val && val !== "").length - (responses.comment ? 1 : 0);
  const totalFields = 5;
  const progressPercentage = Math.floor((filledFields / totalFields) * 100);

  return (
    <div className={`timecode-item ${isActive ? 'active' : ''} ${isExpanded ? 'expanded' : 'collapsed'}`}>
      <div className="timecode-header" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="timecode-title">
          <strong>{start} – {end}</strong>
          <div className="expand-icon">{isExpanded ? '▼' : '-'}</div>
        </div>

        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      {isExpanded && (
        <>
          <div className="timecode-buttons">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPlay();
              }}
              className="play-button"
            >
              <span className="play-icon">▶</span> Воспроизвести
            </button>
          </div>

          <div className="timecode-form">
            <div className="form-group">
              <label>1. Насколько Вы чувствовали себя вовлеченным в игру? (1 - совсем нет, 7 - очень сильно)</label>
              <div className="rating-selector">
                {[1, 2, 3, 4, 5, 6, 7].map(value => (
                  <button
                    key={value}
                    className={`rating-button ${responses.involvement == value ? 'active' : ''}`}
                    onClick={() => updateResponse('involvement', String(value))}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>2. Напишите эмоцию, точно описывающее Ваше состояние в этот момент</label>
              <input
                type="text"
                className="form-control"
                value={responses.emotion || ""}
                onChange={(e) => updateResponse('emotion', e.target.value)}
                placeholder="Введите эмоцию"
              />
            </div>

            <div className="form-group">
              <label>3. Насколько сильно Вас это эмоционально затронуло? (1 - не затронуло, 7 - сильно затронуло)</label>
              <div className="rating-selector">
                {[1, 2, 3, 4, 5, 6, 7].map(value => (
                  <button
                    key={value}
                    className={`rating-button ${responses.intensity == value ? 'active' : ''}`}
                    onClick={() => updateResponse('intensity', String(value))}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>4. Чувствовали ли Вы контроль над ситуацией? (1 - совсем нет, 7 - в полной мере)</label>
              <div className="rating-selector">
                {[1, 2, 3, 4, 5, 6, 7].map(value => (
                  <button
                    key={value}
                    className={`rating-button ${responses.control == value ? 'active' : ''}`}
                    onClick={() => updateResponse('control', String(value))}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>5. Было ли это приятно или неприятно? (1 - крайне неприятно, 7 - очень приятно)</label>
              <div className="rating-selector">
                {[1, 2, 3, 4, 5, 6, 7].map(value => (
                  <button
                    key={value}
                    className={`rating-button ${responses.pleasure == value ? 'active' : ''}`}
                    onClick={() => updateResponse('pleasure', String(value))}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>6. Комментарий</label>
              <textarea
                className="form-control"
                value={responses.comment || ""}
                onChange={(e) => updateResponse('comment', e.target.value)}
                placeholder="Введите комментарий (необязательно)"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TimecodeItem;
