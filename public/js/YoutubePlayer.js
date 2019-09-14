import { sendPlayerStatus } from './eventUtils';

export default class YoutubePlayer {
    constructor() {
        this.player = null;
        this.lastStatus = null;
        this.secondLastStatus = null;
        this.isUpdated = false;
        this.onYoutubePlayerReady = this.onYoutubePlayerReady.bind(this);
        this.onPlayerStateChange = this.onPlayerStateChange.bind(this);
    }

    onYoutubePlayerReady() {
        this.player = new YT.Player('player', {
            height: '400',
            width: '100%',
            events: {
                'onStateChange': this.onPlayerStateChange
            },
        });
    }

    onPlayerStateChange(event) {
        console.log(event);
        if (!this.isUpdated && this.lastStatus !== YT.PlayerState.BUFFERING && (event.data == YT.PlayerState.PLAYING || event.data == YT.PlayerState.PAUSED)) {
            sendPlayerStatus(event.data, this.player.getCurrentTime());
        } else if (this.lastStatus === -1 && event.data === YT.PlayerState.BUFFERING) {
            sendPlayerStatus(YT.PlayerState.PLAYING, 0);
        } else if (this.secondLastStatus === YT.PlayerState.PAUSED && this.lastStatus === YT.PlayerState.BUFFERING && event.data === YT.PlayerState.PLAYING) {
            sendPlayerStatus(event.data, this.player.getCurrentTime());
        }
        this.secondLastStatus = this.lastStatus;
        this.lastStatus = event.data;
        this.isUpdated = false;
    }

    stopVideo() {
        this.player.stopVideo();
    }

    cueVideoById(videoId) {
        const timer = setInterval(() => {
            console.log('inside interval', this.player, this.player.cueVideoById);
            if (this.player && typeof this.player.cueVideoById === 'function') {
                console.log('inside interval if');
                this.player.cueVideoById(videoId);
                clearTimer();
            }
        }, 500);
        const clearTimer = () => clearInterval(timer);
    }

    changePlayerStatus(data) {
        console.log("status ", data);
        if (data.status === YT.PlayerState.PLAYING) this.player.playVideo();
        else if (data.status === YT.PlayerState.PAUSED) this.player.pauseVideo();
        this.player.seekTo(data.time, true);
        this.isUpdated = true;
    }
}