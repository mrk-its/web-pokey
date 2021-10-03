const EMPTY_POKEY_REGS = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

export class SAPPlayer {
    constructor(audio_context, pokeyNode) {
        this.audio_context = audio_context
        this.pokeyNode = pokeyNode
        this.headers = []
        this.data = null
        this.currentFrame = 0
        this.frame_cnt = 0
        this.startTime = null
        this.state = "stopped"
        this.latency = 0.05
    }

    seek(pos) {
        this.currentFrame = parseInt(pos);
        let is_playing = this.state == "playing"
        this.pause();
        this.startTime = null;
        if(is_playing) this.play();
    }

    _parse_headers(headers_data) {
        let decoder = new TextDecoder();
        this.raw_headers = decoder.decode(headers_data)
        let headers = this.raw_headers.split("\n")
        let headers_obj = {}
        for(let header of headers) {
            let key = header.split(" ", 1);
            headers_obj[key] = header.substring(key[0].length + 1).trim() || true;
        }
        return headers_obj
    }

    load(array_buffer) {
        this.stop();
        let data = new Uint8Array(array_buffer);
        var ptr=0;
        while(ptr < 1024) {
            if(
                data[ptr] == 13 && data[ptr + 1] == 10 && (
                    data[ptr + 2] == 13 && data[ptr + 3] == 10 || data[ptr + 2] == 255 && data[ptr + 3] == 255
                )
            ) {
                let headers = this._parse_headers(data.slice(0, ptr));
                console.info(headers);
                if((headers.TYPE || 'R') != "R") {
                    this.error_message = `TYPE: ${this.headers.TYPE} - only R type is supported`
                    console.error(this.error_message);
                    return false
                } else {
                    this.error_message = ''
                    this.data = data.slice(ptr + 4);
                }
                this.headers = headers
                var is_ntsc = typeof this.headers.NTSC != "undefined"
                var fastplay = parseInt(this.headers.FASTPLAY) || 0;
                if(fastplay) {
                    this.frameInterval = 1 / ((is_ntsc ? 262 * 60 : 312 * 50) / fastplay);
                } else if (is_ntsc) {
                    this.frameInterval = 1 / 60;
                } else {
                    this.frameInterval = 1 / 50;
                }
                this.frame_size = (this.headers.STEREO ? 18 : 9)
                this.frame_cnt = Math.floor(this.data.length / this.frame_size);
                this.currentFrame = 0;
                this.sendEvent();
                let is_ok = this.data.length > 0;
                return is_ok;
            }
            ptr++;
        }
        this.error_message = "invalid file format"
        return false;
    }
    getPokeyRegs(index) {
        return Array.from(this.data.slice(index * this.frame_size, (index + 1) * this.frame_size));
    }
    loadCurrentFrame() {
        this._send_regs(this.getPokeyRegs(this.currentFrame))
    }
    sendEvent(regs) {
        let event = new Event("sap_player");
        event.data = {
            currentFrame: this.currentFrame,
            frame_cnt: this.frame_cnt,
            pokeyRegs: regs || null,
            state: this.state,
        }
        window.dispatchEvent(event);
    }
    tick() {
        this.fillBuffer()
    }
    fillBuffer() {
        if(!this.frame_cnt || this.state != "playing") {
            return;
        }
        let currentTime = this.getCurrentTime();
        while(this.startTime + this.currentFrame * this.frameInterval < currentTime + this.latency) {
            let regs = this.getPokeyRegs(this.currentFrame);
            this._send_regs(regs)
            this.currentFrame = (this.currentFrame + this.frame_cnt + 1) % this.frame_cnt;
            if(this.currentFrame == 0) {
                this.startTime = currentTime;
                return;
            }
        }
    }
    getCurrentTime() {
        return this.audio_context.currentTime;
    }
    play() {
        let currentTime = this.getCurrentTime();
        if(this.startTime == null) {
            this.startTime = currentTime - this.currentFrame * this.frameInterval;
        }
        this.state = "playing";
        this.fillBuffer();
    }
    pause() {
        this.state = "paused";
        this.interval = null;
        this.startTime = null;
        this.loadCurrentFrame();
    }
    _send_regs(regs) {
        let t = this.startTime != null ? this.startTime + this.currentFrame * this.frameInterval : this.getCurrentTime() + this.latency;
        let msg = regs.slice().flatMap((v, i) => [i < 9 ? i : i - 9 + 16, v, t])
        this.pokeyNode.port.postMessage(msg);
        this.sendEvent(regs)
    }
    stop() {
        this.state = "stopped";
        this.startTime = null;
        this.currentFrame = 0;
        this._send_regs(EMPTY_POKEY_REGS)
    }

    prev() {
        if (!this.data.length) return;
        this.pause();
        this.currentFrame = (this.currentFrame + this.frame_cnt - 1) % this.frame_cnt;
        this.loadCurrentFrame();
    }
    next() {
        if (!this.data.length) return;
        this.pause();
        this.currentFrame = (this.currentFrame + 1) % this.frame_cnt;
        this.loadCurrentFrame();
    }
}
