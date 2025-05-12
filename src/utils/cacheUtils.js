export const saveCache = async (videoFile, timecodes) => {
  try {
    const cacheData = {
      videoFile,
      timecodes,
      timestamp: new Date().toISOString()
    };

    return await window.electron.saveCache(JSON.stringify(cacheData));
  } catch (error) {
    console.error('Ошибка при сохранении кэша:', error);
    return false;
  }
};

export const checkCache = async () => {
  try {
    return await window.electron.checkCache();
  } catch (error) {
    console.error('Ошибка при проверке кэша:', error);
    return false;
  }
};

export const loadCache = async () => {
  try {
    const cacheData = await window.electron.loadCache();
    if (cacheData) {
      return JSON.parse(cacheData);
    }
    return null;
  } catch (error) {
    console.error('Ошибка при загрузке кэша:', error);
    return null;
  }
};

export const clearCache = async () => {
  try {
    return await window.electron.clearCache();
  } catch (error) {
    console.error('Ошибка при очистке кэша:', error);
    return false;
  }
};