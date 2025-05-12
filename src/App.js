import React, { useState, useEffect, useCallback } from 'react';
import StartScreen from './components/StartScreen';
import PlayerScreen from './components/PlayerScreen';
import CacheModal from './components/CacheModal';
import { parseTimecodes } from './utils/timecodeUtils';
import { saveCache, checkCache, loadCache, clearCache } from './utils/cacheUtils';

const App = () => {
  const [videoFile, setVideoFile] = useState(null);
  const [timecodes, setTimecodes] = useState([]);
  const [isStarted, setIsStarted] = useState(false);
  const [showCacheModal, setShowCacheModal] = useState(false);
  const [cacheTimestamp, setCacheTimestamp] = useState(null);
  const [saveIndicator, setSaveIndicator] = useState({ show: false, message: '' });

  const showSaveIndicator = (message) => {
    setSaveIndicator({ show: true, message });
    setTimeout(() => {
      setSaveIndicator({ show: false, message: '' });
    }, 3000);
  };

  useEffect(() => {
    const checkForCache = async () => {
      try {
        const hasCache = await checkCache();
        if (hasCache) {
          const cache = await loadCache();
          if (cache && cache.videoFile && cache.timecodes && cache.timecodes.length > 0) {
            setCacheTimestamp(cache.timestamp);
            setShowCacheModal(true);
          }
        }
      } catch (error) {
        console.error('Ошибка при проверке кэша:', error);
      }
    };

    checkForCache();
  }, []);

  const updateTimecodeResponse = useCallback((id, field, value) => {
    setTimecodes(prevTimecodes => {
      const updatedTimecodes = prevTimecodes.map(code =>
        code.id === id
          ? { ...code, responses: { ...code.responses, [field]: value } }
          : code
      );

      const updatedTimecode = updatedTimecodes.find(code => code.id === id);
      if (updatedTimecode) {
        const { involvement, emotion, intensity, control, pleasure } = updatedTimecode.responses;
        const allRequiredFieldsFilled = involvement && emotion && intensity && control && pleasure;

        if (allRequiredFieldsFilled) {
          saveCache(videoFile, updatedTimecodes).then(success => {
            if (success) {
              showSaveIndicator('Данные сохранены');
            }
          });
        }
      }

      return updatedTimecodes;
    });
  }, [videoFile]);

  const handleStart = (timecodeInput) => {
    const parsedTimecodes = parseTimecodes(timecodeInput);
    if (parsedTimecodes.length > 0) {
      setTimecodes(parsedTimecodes);
      setIsStarted(true);

      saveCache(videoFile, parsedTimecodes);
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

  const exportToXLSX = async () => {
    const exportData = timecodes.map(code => {
      const { start, end, responses } = code;
      const { involvement, emotion, intensity, control, pleasure, comment } = responses;

      return {
        'Таймкод': `${start} - ${end}`,
        'Вовлеченность': involvement || '',
        'Эмоция': emotion || '',
        'Интенсивность': intensity || '',
        'Контроль': control || '',
        'Приятность': pleasure || '',
        'Комментарий': comment || ''
      };
    });

    try {
      const jsonData = JSON.stringify(exportData);
      const success = await window.electron.exportXlsx(jsonData);
      if (success) {
        alert('Данные успешно экспортированы в Excel');
      }
    } catch (error) {
      console.error('Ошибка при экспорте XLSX:', error);
      alert('Ошибка при экспорте данных');
    }
  };

  const exportToCSV = async () => {
    const headers = 'Таймкод;Вовлеченность;Эмоция;Интенсивность;Контроль;Приятность;Комментарий\n';
    const rows = timecodes.map(code => {
      const { start, end, responses } = code;
      const { involvement, emotion, intensity, control, pleasure, comment } = responses;
      return `${start} - ${end};${involvement || ''};${emotion || ''};${intensity || ''};${control || ''};${pleasure || ''};${comment || ''}`;
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

  const handleLoadCache = async () => {
    try {
      const cache = await loadCache();
      if (cache && cache.videoFile && cache.timecodes) {
        setVideoFile(cache.videoFile);
        setTimecodes(cache.timecodes);
        setIsStarted(true);
        setShowCacheModal(false);
        showSaveIndicator('Данные загружены');
      } else {
        alert('Ошибка при загрузке данных из кэша');
        setShowCacheModal(false);
      }
    } catch (error) {
      console.error('Ошибка при загрузке кэша:', error);
      alert('Ошибка при загрузке данных');
      setShowCacheModal(false);
    }
  };

  const handleCancelCache = async () => {
    try {
      await clearCache();
      setShowCacheModal(false);
      showSaveIndicator('Кэш очищен');
    } catch (error) {
      console.error('Ошибка при очистке кэша:', error);
      setShowCacheModal(false);
    }
  };

  return (
    <div className="app-container">
      {showCacheModal && (
        <CacheModal
          onLoad={handleLoadCache}
          onCancel={handleCancelCache}
          cacheTimestamp={cacheTimestamp}
        />
      )}

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
          onExport={exportToXLSX}
        />
      )}

      {saveIndicator.show && (
        <div className="save-indicator">{saveIndicator.message}</div>
      )}
    </div>
  );
};

export default App;