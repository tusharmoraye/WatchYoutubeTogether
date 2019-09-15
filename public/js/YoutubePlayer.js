import { sendPlayerStatus } from './eventUtils';

export default class YoutubePlayer {
    constructor() {
        this.player = null;
        this.lastStatus = null;
        this.secondLastStatus = null;
		this.isUpdated = false;
		this.videoId = null;
		this.isStartedBySelf = true;
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
        if (!this.isUpdated && this.lastStatus !== YT.PlayerState.BUFFERING && (event.data == YT.PlayerState.PLAYING || event.data == YT.PlayerState.PAUSED)) {
            sendPlayerStatus(event.data, this.player.getCurrentTime());
        } else if (this.lastStatus === -1 && event.data === YT.PlayerState.BUFFERING) {
			if(this.isStartedBySelf) 
				sendPlayerStatus(YT.PlayerState.PLAYING, 0);
			else 
				this.isStartedBySelf = true;
        } else if (this.secondLastStatus === YT.PlayerState.PAUSED && this.lastStatus === YT.PlayerState.BUFFERING && event.data === YT.PlayerState.PLAYING) {
            sendPlayerStatus(event.data, this.player.getCurrentTime());
        }
        this.secondLastStatus = this.lastStatus;
        this.lastStatus = event.data;
        this.isUpdated = false;
    }

    cueVideoById(videoId) {
		if(this.videoId === videoId) return;
		this.videoId = videoId;
        const timer = setInterval(() => {
            if (this.player && typeof this.player.cueVideoById === 'function') {
                this.player.cueVideoById(this.videoId);
                clearTimer();
            }
        }, 500);
        const clearTimer = () => clearInterval(timer);
    }

    changePlayerStatus(data) {
		const timer = setInterval(() => {
            if (this.player && this.player.getPlayerState() != undefined && YT) {
				const playerState = this.player.getPlayerState();
				if(playerState === YT.PlayerState.CUED || playerState === -1) {
					this.isStartedBySelf = false;
					this.player.playVideo();
					const timer = setInterval(() => {
						if(this.player.getPlayerState() != YT.PlayerState.PLAYING) return;
						this.player.seekTo(data.time, true);
						if (data.status === YT.PlayerState.PLAYING) this.player.playVideo();
						else if (data.status === YT.PlayerState.PAUSED) this.player.pauseVideo();
						clearTimer();
					}, 500);
					const clearTimer = () => clearInterval(timer);
				} else {
					this.player.seekTo(data.time, true);
					if (data.status === YT.PlayerState.PLAYING) this.player.playVideo();
					else if (data.status === YT.PlayerState.PAUSED) this.player.pauseVideo();
				}
				this.isUpdated = true;
				clearTimer();
			}
        }, 500);
        const clearTimer = () => clearInterval(timer);
	}
	
	broadcastPlayerState() {
		if(this.player && YT) {
			const playerState = this.player.getPlayerState();
			if(playerState === YT.PlayerState.PLAYING || playerState === YT.PlayerState.PAUSED)
				sendPlayerStatus(playerState, this.player.getCurrentTime());
		}
	}
}