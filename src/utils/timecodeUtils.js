export const timeToSeconds = (timeStr) => {
  if (!timeStr || typeof timeStr !== 'string') {
    return 0;
  }

  const match = timeStr.trim().match(/^(\d{2}):(\d{2}):(\d{2})$/);
  if (!match) {
    return 0;
  }

  const [_, hours, minutes, seconds] = match;
  return parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseInt(seconds);
};

export const parseTimecodes = (input) => {
  if (!input || typeof input !== 'string') {
    return [];
  }

  const lines = input.split('\n').filter(line => line.trim() !== '');

  return lines.map((line, index) => {
    const separator = line.includes('–') ? '–' : '-';
    const [start, end] = line.split(separator).map(t => t.trim());

    const startSeconds = timeToSeconds(start);
    const endSeconds = timeToSeconds(end);

    if (startSeconds >= endSeconds) {
      console.warn(`Неверный порядок времени в таймкоде: ${line}`);
    }

    return {
      id: index,
      start,
      end,
      startSeconds,
      endSeconds,
      duration: Math.max(0, endSeconds - startSeconds),
      responses: {
        involvement: '',
        emotion: '',
        intensity: '',
        control: '',
        pleasure: '',
        comment: ''
      }
    };
  }).filter(timecode =>
    // Incorrect timecodes
    timecode.startSeconds > 0 &&
    timecode.endSeconds > 0 &&
    timecode.duration > 0
  );
};
