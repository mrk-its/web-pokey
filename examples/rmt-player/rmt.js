const EMPTY_POKEY_REGS = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

const PURE_TABLE = [
    0xF3, 0xE6, 0xD9, 0xCC, 0xC1, 0xB5, 0xAD, 0xA2, 0x99, 0x90, 0x88, 0x80, 0x79, 0x72, 0x6C, 0x66,
    0x60, 0x5B, 0x55, 0x51, 0x4C, 0x48, 0x44, 0x40, 0x3C, 0x39, 0x35, 0x32, 0x2F, 0x2D, 0x2A, 0x28,
    0x25, 0x23, 0x21, 0x1F, 0x1D, 0x1C, 0x1A, 0x18, 0x17, 0x16, 0x14, 0x13, 0x12, 0x11, 0x10, 0x0F,
    0x0E, 0x0D, 0x0C, 0x0B, 0x0A, 0x09, 0x08, 0x07, 0x06, 0x05, 0x04, 0x03, 0x02, 0x01, 0x00, 0x00,
]

const BASS_TABLE_1 = [
    0xBF, 0xB6, 0xAA, 0xA1, 0x98, 0x8F, 0x89, 0x80, 0xF2, 0xE6, 0xDA, 0xCE, 0xBF, 0xB6, 0xAA, 0xA1,
    0x98, 0x8F, 0x89, 0x80, 0x7A, 0x71, 0x6B, 0x65, 0x5F, 0x5C, 0x56, 0x50, 0x4D, 0x47, 0x44, 0x3E,
    0x3C, 0x38, 0x35, 0x32, 0x2F, 0x2D, 0x2A, 0x28, 0x25, 0x23, 0x21, 0x1F, 0x1D, 0x1C, 0x1A, 0x18,
    0x17, 0x16, 0x14, 0x13, 0x12, 0x11, 0x10, 0x0F, 0x0E, 0x0D, 0x0C, 0x0B, 0x0A, 0x09, 0x08, 0x07,
]

const BASS_TABLE_2 = [
    0xFF, 0xF1, 0xE4, 0xD8, 0xCA, 0xC0, 0xB5, 0xAB, 0xA2, 0x99, 0x8E, 0x87, 0x7F, 0x79, 0x73, 0x70,
    0x66, 0x61, 0x5A, 0x55, 0x52, 0x4B, 0x48, 0x43, 0x3F, 0x3C, 0x39, 0x37, 0x33, 0x30, 0x2D, 0x2A,
    0x28, 0x25, 0x24, 0x21, 0x1F, 0x1E, 0x1C, 0x1B, 0x19, 0x17, 0x16, 0x15, 0x13, 0x12, 0x11, 0x10,
    0x0F, 0x0E, 0x0D, 0x0C, 0x0B, 0x0A, 0x09, 0x08, 0x07, 0x06, 0x05, 0x04, 0x03, 0x02, 0x01, 0x00,
]

const BASS_LO = [
    0xF2, 0x33, 0x96, 0xE2, 0x38, 0x8C, 0x00, 0x6A, 0xE8, 0x6A, 0xEF, 0x80, 0x08, 0xAE, 0x46, 0xE6,
    0x95, 0x41, 0xF6, 0xB0, 0x6E, 0x30, 0xF6, 0xBB, 0x84, 0x52, 0x22, 0xF4, 0xC8, 0xA0, 0x7A, 0x55,
    0x34, 0x14, 0xF5, 0xD8, 0xBD, 0xA4, 0x8D, 0x77, 0x60, 0x4E, 0x38, 0x27, 0x15, 0x06, 0xF7, 0xE8,
    0xDB, 0xCF, 0xC3, 0xB8, 0xAC, 0xA2, 0x9A, 0x90, 0x88, 0x7F, 0x78, 0x70, 0x6A, 0x64, 0x5E, 0x00,
]

const BASS_HI = [
    0x0D, 0x0D, 0x0C, 0x0B, 0x0B, 0x0A, 0x0A, 0x09, 0x08, 0x08, 0x07, 0x07, 0x07, 0x06, 0x06, 0x05,
	0x05, 0x05, 0x04, 0x04, 0x04, 0x04, 0x03, 0x03, 0x03, 0x03, 0x03, 0x02, 0x02, 0x02, 0x02, 0x02,
	0x02, 0x02, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x00, 0x00,
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
]

const VIB_TABLE = [
    [0],
    [1, -1, -1, 1],
    [1, 0, -1, -1, 0, 1],
    [1, 1, 0, -1, -1, -1, -1, 0, 1, 1],
]

const noteBaseNames = ['C-', 'C#', 'D-', 'D#', 'E-', 'F-', 'F#', 'G-', 'G#', 'A-', 'A#', 'H-'];
const noteNames = _.times(61,note => `${noteBaseNames[note % 12]}${Math.floor(note/12)+1}`)

class RMTTrack {
    constructor(index, data) {
        this.index = index
        this.data = data
        this.steps = []
        for(var i=0; i<this.data.length; i++) {
            let note = this.data[i] & 0x3f
            let bits67 = ((this.data[i] & 0xc0) >> 6)
            if(note <= 0x3c) {
                let volume = (this.data[i+1] & 3) | (bits67 << 2)
                let instrument = this.data[i+1] >> 2
                i += 1
                this.steps.push(["note", noteNames[note], note, instrument, volume])
            } else if(note == 0x3d) {
                let volume = (this.data[i+1] & 3) | (bits67 << 2)
                this.steps.push(["vol-only", null, volume])
            } else if(note == 0x3e) {
                let pause = bits67
                if(!pause) {
                    pause = this.data[++i];
                }
                this.steps.push(["pause", pause])
            } else {
                if(bits67 == 0) {
                    this.steps.push(["speed", this.data[++i]])
                } else if(bits67 == 2) {
                    this.steps.push(["goto", this.data[++i]])
                } else if(bits67 == 3) {
                    this.steps.push(["end of track"])
                }
            }
        }
    }
}

class RMTSong {
    constructor(array_buffer) {
        this.tracks = []
        this.instruments = []

        let data = new Uint8Array(array_buffer)
        if(data[0]!=255 || data[1]!=255) {
            throw "invalid format"
        }
        var offs = 2
        var start, end, len
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
            throw "invalid format, no valid blocks"
        }
        console.log(blocks)
        if(blocks.length>1) {
            let decoder = new TextDecoder()
            this.names = decoder.decode(blocks[1].data).split("\0").filter(x => x)
        } else {
            this.names = []
        }

        this.name = this.names[0] || ''

        let rmt_data = blocks[0].data;
        let rmt_offset = blocks[0].offset;
        if(rmt_data[0] != 82 || rmt_data[1] != 77 || rmt_data[2] != 84) {
            throw "invalid format, no RMT header"
        }
        let n_channels = rmt_data[3] - 48
        if(n_channels != 4 && n_channels != 8) {
            throw "invalid format, wrong number of channels"
        }

        let ptr = offs => rmt_data[offs] + rmt_data[offs + 1] * 256 - rmt_offset

        this.n_channels = n_channels
        this.track_length = rmt_data[4] || 256
        this.song_speed = rmt_data[5]
        this.player_freq = rmt_data[6]
        this.format_version = rmt_data[7]

        let instrument_pointers_offs = ptr(8)
        let track_pointers_table_lo = ptr(0xa)
        let track_pointers_table_hi = ptr(0xc)
        let song_track_list = ptr(0xe)

        console.log(this.names, rmt_data, rmt_offset)
        console.log(`n_channels: ${this.n_channels}`)
        console.log(`song_speed: ${this.song_speed}`)
        console.log(`player_freq: ${this.player_freq}`)
        console.log(`format_version: ${this.format_version}`)
        console.log(`song_track_list: ${song_track_list}`)

        let n_tracks = track_pointers_table_hi - track_pointers_table_lo
        let n_instr = (track_pointers_table_lo - instrument_pointers_offs) / 2
        let track_ptr = i => rmt_data[track_pointers_table_hi + i] * 256 + rmt_data[track_pointers_table_lo + i] - rmt_offset

        for(var i=0; i < n_tracks; i++) {
            let start = track_ptr(i)
            let end = i < n_tracks -1 ? track_ptr(i+1) : this.song_track_list;
            this.tracks.push(new RMTTrack(i, rmt_data.subarray(start, end)))
        }
        for(var i=0; i<n_instr; i++) {
            let instr_offs = ptr(instrument_pointers_offs + i*2)
            if(instr_offs > 0) {
                this.instruments.push(new RMTInstrument(i, this.names[i+1] || '', rmt_data.subarray(instr_offs)))
            } else {
                this.instruments.push(null)
            }
        }
        console.log(this.instruments)
        console.log(this.tracks)
    }
}

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
    constructor(instrument, note, channel) {
        this.instrument = instrument
        this.eff_delay = instrument.delay
        this.note = note
        this.outnote = note
        this.channel = channel
        this.epos = 0
        this.tpos = 0
        this.is_repeating = false
        this.volume = 15
        this.tcnt = 0
        this.vib_table = VIB_TABLE[instrument.vibrato]
        this.vib_index = 0
        this.shiftfrq = 0
        this.filter = 1
    }
    play(player) {
        let env_idx = this.epos * 3
        let envelope = this.instrument.envelope
        let env_lvol = envelope[env_idx] & 0xf
        var env_dist = ((envelope[env_idx + 1] >> 1) & 7) * 2
        let env_cmd = (envelope[env_idx + 1] >> 4) & 7
        let env_filter = (envelope[env_idx + 1] >> 7) & 1
        let env_xy = envelope[env_idx + 2]

        this.env_dist = env_dist
        this.env_filter = env_filter

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
                env_dist = 0xc
                freq_table = BASS_TABLE_1
                break;
        }
        var audf = null
        var note = null
        var audc = Math.round(env_lvol * this.volume / 15) | (env_dist << 4)

        if(this.is_repeating) {
            this.volume = Math.max(this.instrument.vmin, this.volume - (this.instrument.vslide / 255))
        }

        this.epos += 1
        if(this.epos >= envelope.length / 3) {
            this.epos = this.instrument.ego
            this.is_repeating = true
        }

        if(this.eff_delay) {
            if(this.eff_delay == 1) {
                this.shiftfrq += this.vib_table[this.vib_index] + this.instrument.fshift
                this.vib_index = (this.vib_index + 1) % this.vib_table.length
            } else {
                this.eff_delay -= 1
            }
        }

        var frqaddcmd2 = 0

        switch(env_cmd) {
            case 0:
                note = (this.note + env_xy) & 0xff
            case 1:
                audf = env_xy
                break;
            case 2:
                frqaddcmd2 = env_xy
                note = this.note
                break;
            case 3:
                this.note = (this.note + env_xy) & 0xff
                note = this.note
            case 4:
                this.shiftfrq += env_xy
                note = this.note
                break
            case 5:
                // TODO portamento
                note = this.note
                break
            case 6:
                this.filter += env_xy
                // TODO filter
                note = this.note
                break
            case 7:
                if(env_xy == 0x80) {
                    audc |= 0x10  // volume only
                } else {
                    this.note = env_xy
                }
                note = this.note
                break
            default:
                console.warn("unknown command")
                1 / 0
        }
        if(note != null) {
            if(this.instrument.ttype == 0) { // notes
                note = (note + this.instrument.table[this.tpos]) & 0xff
                if(note > 61) {
                    note = 63
                    audc = 0
                }
                this.outnote = note
                audf = (freq_table[note] + frqaddcmd2 + this.shiftfrq) & 0xff
            } else {
                if(note >= 61) {
                    note = 63
                    audc = 0
                }
                audf = (freq_table[note] + frqaddcmd2 + this.instrument.table[this.tpos] + this.shiftfrq) & 0xff
            }
        }
        player.pokey_regs[this.channel * 2] = audf
        player.pokey_regs[this.channel * 2 + 1] = audc
        player.audctl |= this.instrument.audctl

        this.tcnt = (this.tcnt + 1) % this.instrument.tspd
        if(!this.tcnt) {
            this.tpos += 1
            if(this.tpos >= this.instrument.table.length) {
                this.tpos = this.instrument.tgo
            }
        }
    }

    post_play(player) {
        if(this.channel == 0 || this.channel == 1) {
            let next_ch = this.channel + 2
            if(this.env_filter && player.pokey_regs[this.channel * 2 + 1] & 0xf) {
                player.pokey_regs[next_ch * 2] = (player.pokey_regs[this.channel * 2] + this.filter) & 0xff
                player.new_audctl |= (this.channel == 0 ? 4 : 2)
            }
        }
        if(this.channel == 1 && (this.audctl == this.new_audctl) || this.channel == 3) {
            if((this.env_dist == 6) && (player.pokey_regs[this.channel * 2 + 1] & 0xf) ) {
                player.pokey_regs[(this.channel - 1) * 2] = BASS_LO[this.outnote]
                player.pokey_regs[this.channel * 2] = BASS_HI[this.outnote]
                if(this.channel == 1) {
                    player.new_audctl |= (this.channel == 1 ? 0x50 : 0x28)
                }
                if((player.pokey_regs[(this.channel - 1) * 2 + 1] & 0x10) == 0) { // audc[ch-1]
                    player.pokey_regs[(this.channel - 1) * 2 + 1] = 0
                }
            }
        }

    }
}

export class RMTPlayer {
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

    load(buffer) {
        this.stop();
        let song = new RMTSong(buffer)

        console.log(song.name, song.instruments, song.tracks)
        this.instruments = song.instruments
        this.current_tone = []
        return true
    }

    tune(instr, note) {
        this.current_tone[1] = new RMTTune(this.instruments[instr], note, 1, PURE_TABLE)
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
            this.audctl = 0
            for(var i=0; i<4; i++) {
                if(this.current_tone[i]) {
                    this.current_tone[i].play(this)
                }
            }
            this.new_audctl = this.audctl
            for(var i=0; i<4; i++) {
                if(this.current_tone[i]) {
                    this.current_tone[i].post_play(this)
                }
            }
            this.pokey_regs[8] = this.new_audctl

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
