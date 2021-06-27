import React, { Component } from 'react';
import ReactPlayer from 'react-player/lazy';
import TrackList from './episode/trackList';

const episodes = {
    302: {
        episode_number: 302,
        url: 'https://www.monstercat.com/podcast/302/COTW302.mp3',
        image: 'https://www.monstercat.com/podcast/302/cover.jpg',
        name: 'three oh two',
        tracks: [
            { "timestamp": 0, "artist": "Monstercat", "name": "Call of the Wild 302"},
            { "timestamp": 45, "artist": "Dexter King & Aaron Richards", "name": "Heartless"},
            { "timestamp": 244, "artist": "Justin OH", "name": "Rearview Mirror" },
            { "timestamp": 400, "artist": "Sabai", "name": "Million Days (ft. Hoang & Claire Ridgely)" },
            { "timestamp": 588, "artist": "Throttle", "name": "Heroes (ft. NICOLOSI) [Instinct Spotlight]" },
            { "timestamp": 800, "artist": "Disero & FTKS", "name": "About Us (ft. Winter)" },
            { "timestamp": 975, "artist": "Vicetone", "name": "Walk Thru Fire (ft. Merōn)" },
            { "timestamp": 1166, "artist": "CloudNone & Direct", "name": "Margarita" },
            { "timestamp": 1380, "artist": "FWLR", "name": "Hot VIP (ft. dyl)" },
            { "timestamp": 1528, "artist": "Dexter King & Alexis Donn", "name": "Only You" },
            { "timestamp": 1711, "artist": "Dexter King", "name": "Get To Know You (ft. Aviella)" },
            { "timestamp": 1891, "artist": "Julian Calor", "name": "Arp of Astronomical Wisdom" },
            { "timestamp": 2089, "artist": "inverness & Amelia Moore", "name": "Toxic [Monstercat Exclusive]" },
            { "timestamp": 2234, "artist": "FWLR", "name": "Bust It Out" },
            { "timestamp": 2422, "artist": "Nonsens & Ericka Jane", "name": "We All" },
            { "timestamp": 2610, "artist": "Terry Zhong", "name": "Night Cap (ft. Will Jay)" },
            { "timestamp": 2820, "artist": "Gareth Emery", "name": "Somebody (ft. Kovic)" },
            { "timestamp": 3023, "artist": "Vicetone", "name": "I Feel Human (ft. BullySongs)" },
            { "timestamp": 3199, "artist": "Bad Computer", "name": "2U" },
            { "timestamp": 3391, "artist": "Stonebank & EMEL", "name": "Time [Uncaged Spotlight]" },
        ]
    },
    303: {
        episode_number: 303,
        url: 'https://www.monstercat.com/podcast/303/COTW303.mp3',
        image: 'https://www.monstercat.com/podcast/303/cover.jpg',
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

const TRACK_TYPE_CURRENT = 'current';
const TRACK_TYPE_NEXT = 'next';
const TRACK_TYPE_PREV = 'prev';

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

    componentDidMount() {
        if ("mediaSession" in navigator) {
            window.navigator.mediaSession.setActionHandler('previoustrack', () => {
                const currentTime = this.player.getCurrentTime();

                // we're more than 3 seconds into the track, so skip to the start of the current song
                if (currentTime >= this.state.currentTrack.timestamp + 3) {
                    this.seekToTrack(this.state.currentTrack);
                }
                // if we're less than 3 seconds in, skip back to the previous song
                else {
                    let prevTrack = this.getPrevTrack();

                    if (typeof prevTrack !== 'undefined') {
                        this.seekToTrack(prevTrack);
                    }
                }
            });

            window.navigator.mediaSession.setActionHandler('nexttrack', () => {
                let nextTrack = this.getNextTrack();

                if (typeof nextTrack !== 'undefined') {
                    this.seekToTrack(nextTrack);
                }
            });
        }
    }

    handleSeek = () => {
        this.updateCurrentTrack();
    }

    seekToTrack = track => {
        this.player.seekTo(track.timestamp);
    }

    handleProgress = state => {
        if (this.state.seeking) {
            // todo: highlight track that would play at current seek position
            return;
        }

        this.updateCurrentTrack();
    }

    getCurrentTrack = () => {
        return this.getTrack(TRACK_TYPE_CURRENT);
    }

    getPrevTrack = () => {
        return this.getTrack(TRACK_TYPE_PREV);
    }

    getNextTrack = () => {
        return this.getTrack(TRACK_TYPE_NEXT);
    }

    getTrack = (type) => {
        const currentTrackIndex = this.state.episode.tracks.indexOf(this.state.currentTrack)

        switch (type) {
            case TRACK_TYPE_CURRENT:
                return this.state.currentTrack;
            case TRACK_TYPE_PREV:
                return this.state.episode.tracks[currentTrackIndex-1] || undefined;
            case TRACK_TYPE_NEXT:
                return this.state.episode.tracks[currentTrackIndex+1] || undefined;
            default:
                return undefined;
        }
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

        if (typeof currentTrack !== 'undefined' && currentTrack !== this.state.currentTrack) {
            this.setState({ currentTrack: currentTrack });

            if ("mediaSession" in navigator) {
                window.navigator.mediaSession.metadata = new window.MediaMetadata({
                    title: this.state.currentTrack.name,
                    artist: this.state.currentTrack.artist,
                    album: this.state.episode.name,
                    artwork: [
                        {src: this.state.episode.image, sizes: '256x256', type: 'image/jpeg'},
                        {src: this.state.episode.image, sizes: '512x512', type: 'image/jpeg'}
                    ]
                });
            }
        }
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
                    onSeek={this.handleSeek}
                    onProgress={this.handleProgress}
                    onPlay={this.handlePlay}
                    onPause={this.handlePause}
                />
            </React.Fragment>
          );
    }
}
 
export default Episode;