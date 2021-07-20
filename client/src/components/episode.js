import React, { Component } from 'react';
import ReactPlayer from 'react-player/lazy';
import TrackList from './episode/trackList';

const TRACK_TYPE_CURRENT = 'current';
const TRACK_TYPE_NEXT = 'next';
const TRACK_TYPE_PREV = 'prev';

class Episode extends Component {
    state = {
        isLoaded: false,
        error: null,
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
        episode: null,
        currentTrack: null,
    }

    componentDidMount() {
        fetch(`/api/episodes/${this.props.match.params.episode}`)
            .then(res => res.json())
            .then(
                (result) => {
                    console.log(result);
                    this.setState({ 
                        isLoaded: true,
                        episode: result
                    });

                    this.setupMediaSession();
                },
                (error) => {
                    this.setState({ 
                        isLoaded: true,
                        error: error
                    });
                    console.error(error);
                }
            );
    }

    setupMediaSession = () => {
        if ("mediaSession" in navigator) {
            window.navigator.mediaSession.setActionHandler('previoustrack', () => {
                const currentTime = this.player.getCurrentTime();

                // we're more than 3 seconds into the track, so skip to the start of the current song
                if (currentTime >= this.state.currentTrack.starttime + 3) {
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
        this.player.seekTo(track.starttime);
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
        const currentTrackIndex = this.state.episode.tracklist.indexOf(this.state.currentTrack)

        switch (type) {
            case TRACK_TYPE_CURRENT:
                return this.state.currentTrack;
            case TRACK_TYPE_PREV:
                return this.state.episode.tracklist[currentTrackIndex-1] || undefined;
            case TRACK_TYPE_NEXT:
                return this.state.episode.tracklist[currentTrackIndex+1] || undefined;
            default:
                return undefined;
        }
    }

    updateCurrentTrack = () => {
        const currentTime = this.player.getCurrentTime();

        const currentTrack = this.state.episode.tracklist.find((track, index, tracklist) => {
            if (typeof tracklist[index+1] !== 'undefined') {
                // If there is a next track, check current timestamp is between the
                // start time of this track and next track
                let nextTrackTimestamp = tracklist[index+1].starttime;

                return (currentTime >= track.starttime && currentTime < nextTrackTimestamp);
            }
            else {
                // If we're only checking the last track of the show, just check
                // the timestamp vs start time
                return currentTime >= track.starttime;
            }
        }, this);

        if (typeof currentTrack !== 'undefined' && currentTrack !== this.state.currentTrack) {
            this.setState({ currentTrack: currentTrack });

            if ("mediaSession" in navigator) {
                window.navigator.mediaSession.metadata = new window.MediaMetadata({
                    title: this.state.currentTrack.title,
                    artist: this.state.currentTrack.artist.join(', '),
                    album: this.state.episode.title,
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
        if (this.state.error != null) {
            return (
                <p>{this.state.error.message}</p>
            )
        }
        else {
            if (!this.state.isLoaded) {
                return (
                    <div>Loading...</div>
                )
            }
            else {
                return (
                    <React.Fragment>
                        <h1>{this.state.episode.title} </h1>
                        <div style={{display: 'flex'}}>
                            <img src={this.state.episode.image} style={{maxWidth: '200px'}} />
                            <div>
                                <p>{this.state.currentTrack != null ? this.state.currentTrack.title : 'Call of the Wild'}</p>
                                <p>{this.state.currentTrack != null ? this.state.currentTrack.artist.join(', ') : 'Monstercat'}</p>
                            </div>
                        </div>
                        <TrackList tracks={this.state.episode.tracklist}
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
    }
}
 
export default Episode;