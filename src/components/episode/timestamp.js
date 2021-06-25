import React from 'react';

const secondsToHms = (seconds, forceHours = false) => {
    seconds = Number(seconds);
    let h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    let m = Math.floor(seconds % 3600 / 60).toString().padStart(2, '0');
    let s = Math.floor(seconds % 3600 % 60).toString().padStart(2, '0');
    let timestamp = '';

    if (h > 0 || forceHours) {
        timestamp = `${h}:`;
    }

    timestamp = `${timestamp}${m}:${s}`;

    return timestamp;
}

const episodeTimestamp = (props) => {
    return ( secondsToHms(props.seconds, props.forceHours) );
}
 
export default episodeTimestamp;