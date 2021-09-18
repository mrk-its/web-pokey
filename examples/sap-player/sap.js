const EMPTY_POKEY_REGS = [0, 0, 0, 0, 0, 0, 0, 0, 0];

export class SAPPlayer {
    constructor(audio_context, pokey_node) {
        this.audio_context = audio_context
        this.pokey_node = pokey_node
        this.headers = []
        this.data = null
        this.current_frame = 0
        this.frame_cnt = 0
        this.startTime = null
        this.state = "stopped"
        this.latency = 0.05
    }

    seek(pos) {
        this.current_frame = parseInt(pos);
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
            headers_obj[key] = header.substring(key[0].length + 1).trim();       }
        return headers_obj
    }

    load(array_buffer) {
        let data = new Uint8Array(array_buffer);
        var ptr=0;
        while(ptr < 1024) {
            if(
                data[ptr] == 13 && data[ptr + 1] == 10 && (
                    data[ptr + 2] == 13 && data[ptr + 3] == 10 || data[ptr + 2] == 255 && data[ptr + 3] == 255
                )
            ) {
                this.headers = this._parse_headers(data.slice(0, ptr));
                if((this.headers.TYPE || 'R') != "R") {
                    this.error_message = `TYPE: ${this.headers.TYPE} - only R type is supported`
                    console.error(this.error_message);
                    this.data = new Uint8Array();
                } else {
                    this.error_message = ''
                    this.data = data.slice(ptr + 4);
                }
                var is_ntsc = typeof this.headers.NTSC != "undefined"
                var fastplay = parseInt(this.headers.FASTPLAY) || 0;
                if(fastplay) {
                    this.frame_interval = 1 / ((is_ntsc ? 262 * 60 : 312 * 50) / fastplay);
                } else if (is_ntsc) {
                    this.frame_interval = 1 / 60;
                } else {
                    this.frame_interval = 1 / 50;
                }
                this.frame_cnt = Math.floor(this.data.length / 9);
                this.current_frame = 0;
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
        return Array.from(this.data.slice(index * 9, (index + 1) * 9));
    }
    loadCurrentFrame() {
        let regs = Array.from(this.data.slice(this.current_frame * 9, this.current_frame * 9 + 9))
        this._send_regs(regs)
    }
    sendEvent(regs) {
        let event = new Event("sap_player");
        event.data = {
            current_frame: this.current_frame,
            frame_cnt: this.frame_cnt,
            pokey_regs: regs || null,
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
        while(this.startTime + this.current_frame * this.frame_interval < currentTime + this.latency) {
            let regs = this.getPokeyRegs(this.current_frame);
            this._send_regs(regs)
            this.current_frame = (this.current_frame + this.frame_cnt + 1) % this.frame_cnt;
            if(this.current_frame == 0) {
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
            this.startTime = currentTime - this.current_frame * this.frame_interval;
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
        let t = this.startTime != null ? this.startTime + this.current_frame * this.frame_interval : this.getCurrentTime() + this.latency;
        let msg = regs.flatMap((v, i) => [i, v, t])
        this.pokey_node.port.postMessage(msg);
        this.sendEvent(regs)
    }
    stop() {
        this.state = "stopped";
        this.startTime = null;
        this.current_frame = 0;
        this._send_regs(EMPTY_POKEY_REGS)
    }

    prev() {
        if (!this.data.length) return;
        this.pause();
        this.current_frame = (this.current_frame + this.frame_cnt - 1) % this.frame_cnt;
        this.loadCurrentFrame();
    }
    next() {
        if (!this.data.length) return;
        this.pause();
        this.current_frame = (this.current_frame + 1) % this.frame_cnt;
        this.loadCurrentFrame();
    }
}
