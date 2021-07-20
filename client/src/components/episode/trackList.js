import React, { useLayoutEffect } from 'react';
import EpisodeTimestamp from './timestamp';
import styles from './trackList.module.css';

const trackList = (props) => {
    const trackList = props.tracks.map(track => (
        <li key={track.starttime}
            className={[
                styles.tracklistItem,
                props.currentTrack === track ? styles.tracklistItemCurrent : ''
            ].join(' ')}
            onClick={() => props.selectTrackHandler(track)}
        >
            <div className={styles.trackInfo}>
                <span className={styles.trackTitle}>{track.title}</span>
                <span className={styles.trackArtist}>{track.artist.join(', ')}</span>
            </div>
            <span className={styles.timestamp}>
                <EpisodeTimestamp seconds={track.starttime} />
            </span>
        </li>
    ));

    return (
        <ul className={styles.trackList}>
            {trackList}
        </ul>
    );
}
 
export default trackList;