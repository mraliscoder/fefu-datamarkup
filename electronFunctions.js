const { app, dialog } = require('electron');
const fs = require('fs');
const path = require('path');

const getCachePath = () => {
  return path.join(app.getPath('userData'), 'videoAnnotationCache.json');
};

const checkCacheExists = () => {
  const cachePath = getCachePath();
  return fs.existsSync(cachePath);
};

const saveCacheFile = (cacheData) => {
  const cachePath = getCachePath();

  try {
    fs.writeFileSync(cachePath, cacheData, 'utf-8');
    return true;
  } catch (error) {
    console.error('Ошибка при сохранении кэша:', error);
    return false;
  }
};

const loadCacheFile = () => {
  const cachePath = getCachePath();

  if (!fs.existsSync(cachePath)) {
    return null;
  }

  try {
    return fs.readFileSync(cachePath, 'utf-8');
  } catch (error) {
    console.error('Ошибка при загрузке кэша:', error);
    return null;
  }
};

const clearCacheFile = () => {
  const cachePath = getCachePath();

  if (!fs.existsSync(cachePath)) {
    return true;
  }

  try {
    fs.unlinkSync(cachePath);
    return true;
  } catch (error) {
    console.error('Ошибка при удалении кэша:', error);
    return false;
  }
};

module.exports = {
  checkCacheExists,
  saveCacheFile,
  loadCacheFile,
  clearCacheFile
};