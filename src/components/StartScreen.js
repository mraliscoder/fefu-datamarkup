import React, { useState } from 'react';

const StartScreen = ({ onStart, onOpenFile, videoFile }) => {
  const [timecodeInput, setTimecodeInput] = useState("");

  return (
    <div className="start-screen">
      <h1>Разметка данных</h1>

      <div className="form-group">
        <label>Выберите видеофайл:</label>
        <div>
          <button onClick={onOpenFile}>{videoFile ? "Файл выбран" : "Выбрать файл"}</button>
        </div>
      </div>

      <div className="form-group">
        <label>Введите таймкоды (формат 00:15:09 – 00:15:17):</label>
        <textarea
          className="timecodes-input"
          value={timecodeInput}
          onChange={(e) => setTimecodeInput(e.target.value)}
          placeholder="00:15:09 – 00:15:17"
        />
      </div>

      <button
        onClick={() => onStart(timecodeInput)}
        disabled={!videoFile}
      >
        Начать
      </button>
      <div>&copy; {new Date().getFullYear()} <a href="https://edwardcode.net/" target="_blank">Eduard Ilin</a></div>
    </div>
  );
};

export default StartScreen;
