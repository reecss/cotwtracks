import React, { Component } from 'react';
import ReactPlayer from 'react-player/lazy';
import TrackList from './episode/trackList';

const episodes = {
    303: {
        episode_number: 303,
        url: 'https://www.monstercat.com/podcast/303/COTW303.mp3',
        image: 'http://www.monstercat.com/podcast/303/cover.jpg',
        name: 'three oh three',
        tracks: [
			{ "timestamp": 45, "artist": "Aero Chord", "name": "The 90s" },
			{ "timestamp": 267, "artist": "CloudNone & Drowsy", "name": "Miss Being Happy [Instinct Spotlight]" },
			{ "timestamp": 438, "artist": "SMLE", "name": "Found A Reason" },
			{ "timestamp": 584, "artist": "Stonebank", "name": "Lift You Up (ft. EMEL)" },
			{ "timestamp": 897, "artist": "SLANDER & Said The Sky", "name": "Potions (ft. JT Roach) [Stonebank Remix]" },
			{ "timestamp": 1089, "artist": "MUZZ", "name": "Start Again" },
			{ "timestamp": 1330, "artist": "Pixel Terror & DYSON", "name": "Dilemma" },
			{ "timestamp": 1477, "artist": "Gammer & Darren Styles", "name": "DYSYLM [Uncaged Spotlight]" },
			{ "timestamp": 1646, "artist": "Gareth Emery & Standerwick", "name": "Saving Light (ft. HALIENE) [Hixxy Remix]" },
			{ "timestamp": 1886, "artist": "REAPER", "name": "BARRICADE" },
			{ "timestamp": 2062, "artist": "Stonebank & Elizaveta", "name": "SOS" },
			{ "timestamp": 2290, "artist": "Pixel Terror", "name": "Origins (ft. EMELINE)" },
			{ "timestamp": 2456, "artist": "Julian Calor", "name": "Monster (ft. Trove)" },
			{ "timestamp": 2661, "artist": "KUURO", "name": "Swarm" },
			{ "timestamp": 2812, "artist": "Aiobahn & RudeLies", "name": "Motivation (ft. Kris Kiss)" },
			{ "timestamp": 2977, "artist": "Tokyo Machine & YAKO", "name": "BAD BOY" },
			{ "timestamp": 3165, "artist": "Rogue", "name": "Move Me" },
			{ "timestamp": 3393, "artist": "WRLD & Richard Caddock", "name": "See You [Community Pick]" }
		] 
    }
}

class Episode extends Component {
    state = {
        pip: false,
        playing: false,
        seeking: false,
        controls: true,
        volume: 0.8,
        muted: false,
        played: 0,
        loaded: 0,
        duration: 0,
        playbackRate: 1.0,
        loop: false,
        episode: episodes[this.props.match.params.episode],
        currentTrack: null,
    }

    seekToTrack = track => {
        this.player.seekTo(track.timestamp);
    }

    handleSeekMouseDown = e => {
        this.setState({ seeking: true })
    }

    handleSeekChange = e => {
        this.setState({ played: parseFloat(e.target.value) })
    }

    handleSeekMouseUp = e => {
        this.setState({ seeking: false })
        this.player.seekTo(parseFloat(e.target.value))
    }

    handleProgress = state => {
        if (this.state.seeking) {
            // todo: highlight track that would play at current seek position
            return;
        }

        this.updateCurrentTrack();
    }

    updateCurrentTrack = () => {
        const currentTime = this.player.getCurrentTime();

        const currentTrack = this.state.episode.tracks.find((track, index, tracks) => {
            if (typeof tracks[index+1] !== 'undefined') {
                // If there is a next track, check current timestamp is between the
                // start time of this track and next track
                let nextTrackTimestamp = tracks[index+1].timestamp;

                return (currentTime >= track.timestamp && currentTime < nextTrackTimestamp);
            }
            else {
                // If we're only checking the last track of the show, just check
                // the timestamp vs start time
                return currentTime >= track.timestamp;
            }
        }, this);

        this.setState({ currentTrack: currentTrack });
    }

    ref = player => {
        this.player = player
    }

    render() { 
        return (
            <React.Fragment>
                <h1>Episode {this.state.episode.episode_number} - {this.state.episode.name} </h1>
                <TrackList tracks={this.state.episode.tracks}
                    currentTrack={this.state.currentTrack}
                    selectTrackHandler={this.seekToTrack}/>
                <ReactPlayer
                    ref={this.ref}
                    url={this.state.episode.url}
                    controls={true}
                    config={{
                        file: {
                            forceAudio: true,
                        }
                    }}
                    onProgress={this.handleProgress}
                />
                <input
                    type='range' min={0} max={0.999999} step='any'
                    value={this.state.played}
                    onMouseDown={this.handleSeekMouseDown}
                    onChange={this.handleSeekChange}
                    onMouseUp={this.handleSeekMouseUp}
                />
            </React.Fragment>
          );
    }
}
 
export default Episode;