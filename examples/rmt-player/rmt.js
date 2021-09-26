const EMPTY_POKEY_REGS = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

const PURE_TABLE = [
    0xF3, 0xE6, 0xD9, 0xCC, 0xC1, 0xB5, 0xAD, 0xA2, 0x99, 0x90, 0x88, 0x80, 0x79, 0x72, 0x6C, 0x66,
    0x60, 0x5B, 0x55, 0x51, 0x4C, 0x48, 0x44, 0x40, 0x3C, 0x39, 0x35, 0x32, 0x2F, 0x2D, 0x2A, 0x28,
    0x25, 0x23, 0x21, 0x1F, 0x1D, 0x1C, 0x1A, 0x18, 0x17, 0x16, 0x14, 0x13, 0x12, 0x11, 0x10, 0x0F,
    0x0E, 0x0D, 0x0C, 0x0B, 0x0A, 0x09, 0x08, 0x07, 0x06, 0x05, 0x04, 0x03, 0x02, 0x01, 0x00, 0x00,
]

const BASS_TABLE_1 = [
    0x7F, 0x79, 0x73, 0x6C, 0x66, 0x60, 0x5A, 0x55, 0xF2, 0xE6, 0xD7, 0xCB, 0xBF, 0xB6, 0xAA, 0xA1,
    0x98, 0x8F, 0x89, 0x80, 0x7A, 0x71, 0x6B, 0x65, 0x5F, 0x5C, 0x56, 0x50, 0x4D, 0x47, 0x44, 0x41,
    0x3E, 0x38, 0x35, 0x32, 0x2F, 0x2D, 0x2A, 0x29, 0x26, 0x23, 0x21, 0x20, 0x1D, 0x1C, 0x1A, 0x18,
    0x17, 0x16, 0x14, 0x13, 0x12, 0x11, 0x10, 0x0F, 0x0E, 0x0D, 0x0C, 0x0B, 0x0A, 0x09, 0x08, 0x07,
]

const BASS_TABLE_2 = [
    0xFF, 0xF3, 0xE4, 0xD9, 0xCD, 0xC1, 0xB5, 0xAB, 0xA2, 0x99, 0x8E, 0x87, 0x7F, 0x79, 0x73, 0x6C,
    0x66, 0x60, 0x5A, 0x55, 0x51, 0x4C, 0x48, 0x43, 0x3F, 0x3C, 0x39, 0x37, 0x33, 0x30, 0x2D, 0x2A,
    0x28, 0x25, 0x24, 0x21, 0x1F, 0x1E, 0x1C, 0x1B, 0x19, 0x47, 0x16, 0x15, 0x3E, 0x12, 0x35, 0x10,
    0x0F, 0x0E, 0x0D, 0x0C, 0x0B, 0x0A, 0x09, 0x08, 0x07, 0x06, 0x05, 0x04, 0x03, 0x02, 0x01, 0x00,
]

class RMTInstrument {
    constructor(index, name, data) {
        this.index = index
        this.name = name
        let tend = data[0]
        let trep = data[1]
        let eend = data[2]
        let erep = data[3]
        this.tspd = (data[4] & 0x3f) + 1
        this.tmode = (data[4] >> 6) & 1
        this.ttype = (data[4] >> 7) & 1
        this.audctl = data[5]
        this.vslide = data[6]
        this.vmin = data[7]
        this.delay = data[8]
        this.vibrato = data[9]
        this.fshift = data[0xa]
        this.table = data.subarray(0xc, tend + 1)
        this.envelope = data.subarray(tend + 1, eend + 3 )
        this.tlen = tend - 12 + 1
        this.tgo = trep - 12
        this.elen = ((eend + 3) - (tend + 1)) / 3
        this.ego = (erep - (tend + 1)) / 3
    }
}

class RMTTune {
    constructor(instrument, note, channel, freq_table) {
        this.instrument = instrument
        this.note = note
        this.channel = channel
        this.freq_table = freq_table
        this.epos = 0
        this.tpos = 0
        this.is_repeating = false
        this.volume = 15
        this.fshift = 0
        this.tcnt = 0
    }
    play(pokey_regs) {
        let env_idx = this.epos * 3
        let envelope = this.instrument.envelope
        let env_lvol = envelope[env_idx] & 0xf
        var env_dist = ((envelope[env_idx + 1] >> 1) & 7) * 2
        let env_cmd = (envelope[env_idx + 1] >> 4) & 7
        let env_filter = (envelope[env_idx + 1] >> 7) & 1
        let env_xy = envelope[env_idx + 2]


        var freq_table = PURE_TABLE
        switch(env_dist) {
            case 0xc:
                freq_table = BASS_TABLE_1
                break
            case 0xe:
                freq_table = BASS_TABLE_2
                env_dist = 0xc
                break
            case 0x6:
                console.warn("distortion 6 not supported yet")
                env_dist = 0xc
                freq_table = BASS_TABLE_1
                break;
        }
        var audf = null
        var note = null
        var audc = Math.round(env_lvol * this.volume / 15) | (env_dist << 4)
        switch(env_cmd) {
            case 0:
            case 3:
                note = (this.note + env_xy) & 0xff
            case 1:
                audf = env_xy
                break;
            case 2:
                audf = (freq_table[note] + env_xy) & 0xff
                break;
            case 4:
                this.fshift += env_xy
                audf = freq_table[note]
                break
            case 7:
                if(env_xy == 0x80) {
                    audc |= 0x10  // volume only
                } else {
                    note = env_xy
                }
            default:
        }
        if(note != null) {
            if(this.instrument.ttype == 0) { // notes
                note = (note + this.instrument.table[this.tpos]) & 0xff
            }
            if(note < 0) {
                note = 0
                audc &= 0xf0
            } else if(note > 0x3d) {
                note = 0x3d
                audc &= 0xf0
            }
            audf = freq_table[note]
            if(env_cmd == 3 || env_cmd == 7) {
                this.note = note // should we store clamped value here?
            }
        }

        pokey_regs[8] = this.instrument.audctl
        if(audf != null) {
            if(this.instrument.ttype == 1) { // frequencies
                audf = (audf + this.instrument.table[this.tpos]) & 0xff
            }
            pokey_regs[this.channel * 2] = audf
        }
        pokey_regs[this.channel * 2 + 1] = audc


        if(this.is_repeating) {
            this.volume = Math.max(this.instrument.vmin, this.volume - (this.instrument.vslide / 255))
        }

        this.epos += 1
        if(this.epos >= envelope.length / 3) {
            this.epos = this.instrument.ego
            this.is_repeating = true
        }

        this.tcnt = (this.tcnt + 1) % this.instrument.tspd
        if(!this.tcnt) {
            this.tpos += 1
            if(this.tpos >= this.instrument.table.length) {
                this.tpos = this.instrument.tgo
            }
        }
    }
}

export class RMTSong {
    constructor(audio_context, pokey_node) {
        this.audio_context = audio_context
        this.pokey_node = pokey_node
        this.current_frame = 0
        this.startTime = null
        this.state = "stopped"
        this.latency = 0.05
        this.pokey_regs = [0, 0, 0, 0, 0, 0, 0, 0, 0]
        this.frame_interval = 0.02
    }

    seek(pos) {
        this.current_frame = parseInt(pos);
        let is_playing = this.state == "playing"
        this.pause();
        this.startTime = null;
        if(is_playing) this.play();
    }

    load(array_buffer) {
        this.stop();
        let data = new Uint8Array(array_buffer)
        if(data[0]!=255 || data[1]!=255) {
            return this._error("invalid format")
        }
        var offs = 2;
        var start, end, len;
        var blocks = []
        while(offs < data.length - 4) {
            start = data[offs] + 256 * data[offs + 1]
            offs += 2
            end = data[offs] + 256 * data[offs + 1] + 1
            offs += 2
            len = end - start
            let block_data = data.subarray(offs, offs + len)
            blocks.push({offset: start, data: block_data})
            offs += len;
        }
        if(blocks.length == 0) {
            return this._error("invalid format, no valid blocks")
        }
        console.log(blocks)
        if(blocks.length>1) {
            let decoder = new TextDecoder()
            this.names = decoder.decode(blocks[1].data).split("\0").filter(x => x)
        } else {
            this.names = []
        }
        let rmt_data = blocks[0].data;
        let rmt_offset = blocks[0].offset;
        if(rmt_data[0] != 82 || rmt_data[1] != 77 || rmt_data[2] != 84) {
            return this._error("invalid format, no RMT header")
        }
        let n_channels = rmt_data[3] - 48
        if(n_channels != 4 && n_channels != 8) {
            return this._error("invalid format, wrong number of channels")
        }

        let ptr = offs => rmt_data[offs] + rmt_data[offs + 1] * 256 - rmt_offset

        this.n_channels = n_channels
        this.track_length = rmt_data[4] || 256
        this.song_speed = rmt_data[5]
        this.player_freq = rmt_data[6]
        this.format_version = rmt_data[7]
        this.instrument_pointers_offs = ptr(8)
        this.track_pointers_table_lo = ptr(0xa)
        this.track_pointers_table_hi = ptr(0xc)
        this.song_track_list = ptr(0xe)
        this.name = this.names[0] || ''

        console.log(this.names, rmt_data, rmt_offset)
        console.log(`n_channels: ${this.n_channels}`)
        console.log(`song_speed: ${this.song_speed}`)
        console.log(`player_freq: ${this.player_freq}`)
        console.log(`format_version: ${this.format_version}`)
        console.log(`instrument_pointers_offset: ${this.instrument_pointers_offs}`)
        console.log(`track_pointers_table_lo: ${this.track_pointers_table_lo}`)
        console.log(`track_pointers_table_hi: ${this.track_pointers_table_hi}`)
        console.log(`song_track_list: ${this.song_track_list}`)

        let n_instr = (this.track_pointers_table_lo - this.instrument_pointers_offs) / 2
        this.instruments = []
        for(var i=0; i<n_instr; i++) {
            let instr_offs = ptr(this.instrument_pointers_offs + i*2)
            if(instr_offs > 0) {
                this.instruments.push(new RMTInstrument(i, this.names[i+1] || '', rmt_data.subarray(instr_offs)))
            } else {
                this.instruments.push(null)
            }
        }
        console.log(this.instruments)
        this.current_tone = null

        return true
    }

    tune(instr, note) {
        this.current_tone = new RMTTune(this.instruments[instr], note, 0, PURE_TABLE)
    }

    _hex2(v) {
        let t = '0' + v.toString(16);
        return t.slice(t.length - 2);
    }

    _error(text) {
        this.error_message = text
        console.error(text)
        return false
    }

    sendEvent(regs) {
        let event = new Event("rmt_player");
        event.data = {
            current_frame: this.current_frame,
            frame_cnt: this.current_frame,
            pokey_regs: regs || null,
            state: this.state,
        }
        window.dispatchEvent(event);
    }
    tick() {
        this.fillBuffer()
    }
    fillBuffer() {
        if(this.state != "playing") {
            return;
        }
        let currentTime = this.getCurrentTime();
        while(this.startTime + this.current_frame * this.frame_interval < currentTime + this.latency) {
            if(this.current_tone) {
                this.current_tone.play(this.pokey_regs)
            }
            this._send_regs(this.pokey_regs)
            this.current_frame += 1
            this.sendEvent(this.pokey_regs);
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
        let msg = regs.slice().flatMap((v, i) => [i < 9 ? i : i - 9 + 16, v, t])
        this.pokey_node.port.postMessage(msg);
        this.sendEvent(regs)
    }
    stop() {
        this.state = "stopped";
        this.startTime = null;
        this.current_frame = 0;
        this.current_tone = null;
        for(var i=0; i<this.pokey_regs.length; i++) {
            this.pokey_regs[i] = 0;
        }
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
