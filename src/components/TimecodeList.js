import React from 'react';
import TimecodeItem from './TimecodeItem';

const TimecodeList = ({ timecodes, activeTimecode, onPlay, updateResponse }) => {
  return (
    <div className="timecode-list">
      {timecodes.map((timecode) => (
        <TimecodeItem
          key={timecode.id}
          timecode={timecode}
          isActive={activeTimecode === timecode.id}
          onPlay={() => onPlay(timecode.id)}
          updateResponse={(field, value) => updateResponse(timecode.id, field, value)}
        />
      ))}
    </div>
  );
};

export default TimecodeList;
