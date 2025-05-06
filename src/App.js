import React, { useState } from 'react';
import StartScreen from './components/StartScreen';
import PlayerScreen from './components/PlayerScreen';
import { parseTimecodes } from './utils/timecodeUtils';

const App = () => {
  const [videoFile, setVideoFile] = useState(null);
  const [timecodes, setTimecodes] = useState([]);
  const [isStarted, setIsStarted] = useState(false);

  const handleStart = (timecodeInput) => {
    const parsedTimecodes = parseTimecodes(timecodeInput);

    if (parsedTimecodes.length > 0) {
      setTimecodes(parsedTimecodes);
      setIsStarted(true);
    } else {
      alert('Пожалуйста, введите корректные таймкоды');
    }
  };

  const handleOpenFile = async () => {
    try {
      const filePath = await window.electron.openFile();
      if (filePath) {
        setVideoFile(filePath);
      }
    } catch (error) {
      console.error('Ошибка при открытии файла:', error);
    }
  };

  const updateTimecodeResponse = React.useCallback((id, field, value) => {
    setTimecodes(prevTimecodes =>
      prevTimecodes.map(code =>
        code.id === id
          ? { ...code, responses: { ...code.responses, [field]: value } }
          : code
      )
    );
  }, []);

  const exportToCSV = async () => {
    const headers = 'Таймкод;Вовлеченность;Эмоция;Интенсивность;Контроль;Приятность;Комментарий\n';

    const rows = timecodes.map(code => {
      const { start, end, responses } = code;
      const { involvement, emotion, intensity, control, pleasure, comment } = responses;
      return `${start} - ${end};${involvement};${emotion};${intensity};${control};${pleasure};${comment}`;
    }).join('\n');

    const csvContent = headers + rows;

    try {
      const success = await window.electron.exportCsv(csvContent);
      if (success) {
        alert('Данные успешно экспортированы');
      }
    } catch (error) {
      console.error('Ошибка при экспорте CSV:', error);
      alert('Ошибка при экспорте данных');
    }
  };

  return (
    <div className="app-container">
      {!isStarted ? (
        <StartScreen
          onStart={handleStart}
          onOpenFile={handleOpenFile}
          videoFile={videoFile}
        />
      ) : (
        <PlayerScreen
          videoFile={videoFile}
          timecodes={timecodes}
          updateTimecodeResponse={updateTimecodeResponse}
          onExport={exportToCSV}
        />
      )}
    </div>
  );
};

export default App;
