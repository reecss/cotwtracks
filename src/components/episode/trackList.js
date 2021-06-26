import React, { useLayoutEffect } from 'react';
import EpisodeTimestamp from './timestamp';
import styles from './trackList.module.css';

const trackList = (props) => {
    const trackList = props.tracks.map(track => (
        <li key={track.timestamp}
            className={`${props.currentTrack === track ? styles.tracklistItemCurrent : ''}`}
            onClick={() => props.selectTrackHandler(track)}>
            <EpisodeTimestamp seconds={track.timestamp} />: {track.artist} - {track.name}
        </li>
    ));

    return (
        <ul className={styles.trackList}>
            {trackList}
        </ul>
    );
}
 
export default trackList;