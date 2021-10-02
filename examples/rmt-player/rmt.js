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

const VOLUME_TAB = [
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01,
	0x00, 0x00, 0x00, 0x00, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x02, 0x02, 0x02, 0x02,
	0x00, 0x00, 0x00, 0x01, 0x01, 0x01, 0x01, 0x01, 0x02, 0x02, 0x02, 0x02, 0x02, 0x03, 0x03, 0x03,
	0x00, 0x00, 0x01, 0x01, 0x01, 0x01, 0x02, 0x02, 0x02, 0x02, 0x03, 0x03, 0x03, 0x03, 0x04, 0x04,
	0x00, 0x00, 0x01, 0x01, 0x01, 0x02, 0x02, 0x02, 0x03, 0x03, 0x03, 0x04, 0x04, 0x04, 0x05, 0x05,
	0x00, 0x00, 0x01, 0x01, 0x02, 0x02, 0x02, 0x03, 0x03, 0x04, 0x04, 0x04, 0x05, 0x05, 0x06, 0x06,
	0x00, 0x00, 0x01, 0x01, 0x02, 0x02, 0x03, 0x03, 0x04, 0x04, 0x05, 0x05, 0x06, 0x06, 0x07, 0x07,
	0x00, 0x01, 0x01, 0x02, 0x02, 0x03, 0x03, 0x04, 0x04, 0x05, 0x05, 0x06, 0x06, 0x07, 0x07, 0x08,
	0x00, 0x01, 0x01, 0x02, 0x02, 0x03, 0x04, 0x04, 0x05, 0x05, 0x06, 0x07, 0x07, 0x08, 0x08, 0x09,
	0x00, 0x01, 0x01, 0x02, 0x03, 0x03, 0x04, 0x05, 0x05, 0x06, 0x07, 0x07, 0x08, 0x09, 0x09, 0x0A,
	0x00, 0x01, 0x01, 0x02, 0x03, 0x04, 0x04, 0x05, 0x06, 0x07, 0x07, 0x08, 0x09, 0x0A, 0x0A, 0x0B,
	0x00, 0x01, 0x02, 0x02, 0x03, 0x04, 0x05, 0x06, 0x06, 0x07, 0x08, 0x09, 0x0A, 0x0A, 0x0B, 0x0C,
	0x00, 0x01, 0x02, 0x03, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0A, 0x0A, 0x0B, 0x0C, 0x0D,
	0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x07, 0x08, 0x09, 0x0A, 0x0B, 0x0C, 0x0D, 0x0E,
	0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0A, 0x0B, 0x0C, 0x0D, 0x0E, 0x0F,
]

const noteBaseNames = ['C-', 'C#', 'D-', 'D#', 'E-', 'F-', 'F#', 'G-', 'G#', 'A-', 'A#', 'H-'];
const noteNames = _.times(61,note => `${noteBaseNames[note % 12]}${Math.floor(note/12)+1}`)


class RMTTrack {
    constructor(index, data, track_length) {
        this.index = index
        this.data = data
        this.steps = []

        var i = 0
        var speed = null

        while(this.steps.length < track_length) {
            let note = this.data[i] & 0x3f
            let bits67 = ((this.data[i] & 0xc0) >> 6)
            i = (i + 1) % this.data.length

            if(note <= 0x3c) {
                let volume = (this.data[i] & 3) << 2 | bits67
                let instrument = this.data[i++] >> 2
                this.steps.push({name: "note", noteName: noteNames[note], note, instrument, volume, speed})
                speed = null;
            } else if(note == 0x3d) {
                let volume = (this.data[i++] & 3) << 2 | bits67
                this.steps.push({name: "note", volume, speed})  // volume only
                speed = null;
            } else if(note == 0x3e) {
                let pause = bits67
                if(!pause) {
                    pause = this.data[i++];
                }
                for(let n=0; n<pause && this.steps.length < track_length; n++) {
                    this.steps.push({name: "pause", speed})
                    speed = null
                }
            } else if(note == 0x3f) {
                if(bits67 == 0) {
                    speed = this.data[i++]
                } else if(bits67 == 2) {
                    i = this.data[i]
                } else if(bits67 == 3) {
                    break;
                }
            }
        }
    }
    getEntry(index) {
        return this.steps[index]
    }
    size() {
        return this.steps.length
    }
}

class RMTSong {
    constructor(array_buffer) {
        this.tracks = []
        this.instruments = []
        this.track_lists = []

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
        if(blocks.length>1) {
            let decoder = new TextDecoder()
            console.log("HERE", blocks[1].data, decoder.decode(blocks[1].data))
            this.names = decoder.decode(blocks[1].data).split("\0")
        } else {
            this.names = []
        }

        this.name = this.names[0] || 'no name'

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
        this.instrument_freq = rmt_data[6]
        this.format_version = rmt_data[7]

        let instrument_pointers_offs = ptr(8)
        let track_pointers_table_lo = ptr(0xa)
        let track_pointers_table_hi = ptr(0xc)
        let song_track_list = ptr(0xe)

        console.info(this.names, rmt_data, rmt_offset)
        console.info(`n_channels: ${this.n_channels}`)
        console.info(`song_speed: ${this.song_speed}`)
        console.info(`instrument_freq: ${this.instrument_freq}`)
        console.info(`format_version: ${this.format_version}`)
        console.info(`song_track_list: ${song_track_list}`)

        console.log(`instrument_pointers_offs: ${instrument_pointers_offs}`)
        console.log(`track_pointers_table_lo: ${track_pointers_table_lo}`)
        console.log(`track_pointers_table_hi: ${track_pointers_table_hi}`)
        console.log(`song_track_list ${song_track_list}`)

        let n_tracks = track_pointers_table_hi - track_pointers_table_lo
        console.log(`n_tracks: ${n_tracks}`)
        let n_instr = (track_pointers_table_lo - instrument_pointers_offs) / 2
        let track_ptr = i => rmt_data[track_pointers_table_hi + i] * 256 + rmt_data[track_pointers_table_lo + i] - rmt_offset
        for(var i=0; i < n_tracks; i++) {
            let start = track_ptr(i)
            let end = i < n_tracks - 1 ? track_ptr(i+1) : song_track_list;
            if(end < 0) end = song_track_list
            console.log(`track #${i}, ${start}, ${end}`)
            if(start >= 0 && end > start) {
                this.tracks[i] = new RMTTrack(i, rmt_data.subarray(start, end), this.track_length)
            }
        }
        let empty_track = new RMTTrack(255, new Uint8Array([0x3e + 0x40]), this.track_length)
        for(var i=n_tracks; i<256; i++) {
            this.tracks[i] = empty_track
        }
        let instr_name_offs = 1;
        for(var i=0; i<n_instr; i++) {
            let instr_offs = ptr(instrument_pointers_offs + i*2)
            console.log(`${i} - ${instr_offs}`)
            if(instr_offs > 0) {
                this.instruments[i] = new RMTInstrument(i, this.names[instr_name_offs++] || '', rmt_data.subarray(instr_offs))
            }
        }
        for(var i = song_track_list; i < rmt_data.length; i += this.n_channels) {
            this.track_lists.push(rmt_data.subarray(i, i + this.n_channels))
        }
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
        this.vmin = data[7] >> 4  // bits 7-4, what about remaining ones?
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
    constructor(channel, note, instrument) {
        this.instrument = instrument
        this.eff_delay = instrument.delay
        this.note = note
        this.outnote = note
        this.channel = channel < 4 ? channel : channel
        this.regs_offset = channel < 4 ? 0 : 9
        this.epos = 0
        this.tpos = 0
        this.is_repeating = false

        this.tcnt = 0
        this.vib_table = VIB_TABLE[instrument.vibrato]
        this.vib_index = 0
        this.shiftfrq = 0
        this.filter = 1
        this.pokey_idx = channel < 4 ? 0 : 1
    }

    play(player) {
        let env_idx = this.epos * 3
        let envelope = this.instrument.envelope
        let env_lvol = envelope[env_idx] & 0xf
        let env_rvol = envelope[env_idx] >> 4
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

        let vol = this.channel < 4 ? env_lvol : env_rvol
        var audc = VOLUME_TAB[player.getChannelVolume(this.channel) << 4 | vol] | (env_dist << 4)
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
                    audc |= 0xf0  // volume only
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
        player.setPokeyAudf(this.channel, audf)
        player.setPokeyAudc(this.channel, audc)
        player.updatePokeyAudctl(this.pokey_idx, this.instrument.audctl)

        this.tcnt = (this.tcnt + 1) % this.instrument.tspd
        if(!this.tcnt) {
            this.tpos += 1
            if(this.tpos >= this.instrument.table.length) {
                this.tpos = this.instrument.tgo
            }
        }
    }

    postPlay(player, prev_audctl) {
        let pokey_channel = this.channel % 4
        if(pokey_channel < 2) {
            let next_ch = this.channel + 2
            if(this.env_filter && player.getPokeyAudc(this.channel) & 0xf) {
                player.setPokeyAudf(next_ch, (player.getPokeyAudf(this.channel) + this.filter) & 0xff)
                player.updatePokeyAudctl(this.pokey_idx, pokey_channel == 0 ? 4 : 2)
            }
        }
        if(pokey_channel == 1 && (player.getPokeyAudctl(this.pokey_idx) == prev_audctl) || pokey_channel == 3) {
            if((this.env_dist == 6) && (player.getPokeyAudc(this.channel) & 0xf) ) {
                player.setPokeyAudf((this.channel - 1), BASS_LO[this.outnote])
                player.setPokeyAudf(this.channel, BASS_HI[this.outnote])
                player.updatePokeyAudctl(this.pokey_idx, pokey_channel == 1 ? 0x50 : 0x28)
                if((player.getPokeyAudc(this.channel - 1) & 0x10) == 0) { // audc[ch-1]
                    player.setPokeyAudc(this.channel - 1, 0)
                }
            }
        }
    }
}

function hex2(v) {
    return (v >> 4).toString(16) + (v & 15).toString(16)
}

function lalign(txt, width) {
    return `${txt}       `.substring(0, width)
}

export class RMTPlayer {
    constructor(audio_context, pokey_node) {
        this.audio_context = audio_context
        this.pokey_node = pokey_node
        this.current_frame = 0
        this.startTime = null
        this.state = "stopped"
        this.latency = 0.05
        this.pokey_regs = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        this.frame_rate = 50
        this.frame_interval = 1 / this.frame_rate
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
        let song = this.song = new RMTSong(buffer)
        this.song_speed = song.song_speed
        this.instruments = song.instruments
        this.frame_interval = 1 / this.frame_rate / this.song.instrument_freq

        console.log(song.name, song.instruments, song.tracks, song.track_lists)
        return true
    }

    tune(channel, note, instr, volume) {
        let instrument = this.instruments[instr]
        if(instrument) {
            this.channel_tone[channel] = new RMTTune(channel, note, instrument)
        }
        this.channel_volume[channel] = (volume << 8) | 0x7f
    }

    getChannelVolume(channel) {
        let vol = this.channel_volume[channel]
        return isFinite(vol) ? vol >> 8 : 15
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

    loadTracks() {
        var track_list
        while(true) {
            track_list = this.song.track_lists[this.tracks_list_pos]
            if(track_list[0] != 0xfe) break;
            console.log("goto", track_list[1])
            this.tracks_list_pos = track_list[1]
        }
        this.current_tracks = Array.from(track_list).map( track_idx => {
            return this.song.tracks[track_idx]
        })
        this.current_tracks_size = this.current_tracks.reduce(
            (size, track) => Math.min(size, track.size()),
            this.song.track_length
        )
        console.info(this.current_tracks_size, this.current_tracks)
    }

    loadTracksEntries() {
        // load this.track_pos entries
        let entries = this.current_tracks.map(track => track.getEntry(this.track_pos))
        let entry_txt = entries.map((e) => {
            return (
                lalign(e.noteName || '-', 3)
                + ' '
                + (isFinite(e.instrument) && hex2(e.instrument) || '--')
                + ' '
                + (isFinite(e.volume) && e.volume.toString(16).toUpperCase() || '-')
            )
        }).join(" | ")
        console.log(`#${hex2(this.track_pos)} ${entry_txt}`)
        _.each(entries, (e, channel) => {
            if(e.speed) {
                this.song_speed = e.speed
            }
            if(e.name == "note") {
                // it may be volume-only note
                // with undefined note && instrument
                this.tune(channel, e.note, e.instrument, e.volume)
            }
        })
    }

    fillBuffer() {
        if(this.state != "playing") {
            return;
        }

        let currentTime = this.getCurrentTime();
        while(this.startTime + this.current_frame * this.frame_interval < currentTime + this.latency) {
            this.instr_pos += 1
            if(this.instr_pos >= this.song_speed * this.song.instrument_freq) {
                this.instr_pos = 0
                this.track_pos += 1
                if(this.track_pos >= this.current_tracks_size) {
                    this.track_pos = 0
                    if(!this.repeat_track) {
                        this.tracks_list_pos = (this.tracks_list_pos + 1) % this.song.track_lists.length
                        this.loadTracks()
                    }
                }
                this.loadTracksEntries()
            }
            this.step()
            this.current_frame += 1
            this.sendEvent(this.pokey_regs);
            if(this.current_frame == 0) {
                this.startTime = currentTime;
                return;
            }
        }
    }

    fadeVolume(tone) {
        if(tone.is_repeating) {
            let v = this.channel_volume[tone.channel] >> 8
            if(v && v > tone.instrument.vmin) {
                this.channel_volume[tone.channel] -= tone.instrument.vslide
            }
        }
    }

    step() {
        let n_channels = this.song.n_channels;
        this.setPokeyAudctl(0, 0)
        if(n_channels > 4) {
            this.setPokeyAudctl(1, 0)
        }
        for(var i=0; i<n_channels; i++) {
            let tone = this.channel_tone[i]
            if(tone) {
                tone.play(this)
                this.fadeVolume(tone)
            }
        }
        let prev_audctl = this.getPokeyAudctl(0)
        let prev_audctl_r
        if(n_channels > 4)
            prev_audctl_r = this.getPokeyAudctl(1)
        for(var i=0; i<n_channels; i++) {
            if(this.channel_tone[i]) {
                this.channel_tone[i].postPlay(this, i < 4 ? prev_audctl : prev_audctl_r)
            }
        }
        this.sendRegs(this.pokey_regs)
    }

    getCurrentTime() {
        return this.audio_context.currentTime;
    }

    play() {
        this.loadTracks()
        this.loadTracksEntries()

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

    setPokeyAudctl(pokey_idx, value) {
        this.pokey_regs[9 * pokey_idx + 8] = value
    }

    updatePokeyAudctl(pokey_idx, value) {
        this.pokey_regs[9 * pokey_idx + 8] |= value
    }

    getPokeyAudctl(pokey_idx, value) {
        return this.pokey_regs[9 * pokey_idx + 8]
    }

    setPokeyAudf(channel, value) {
        let offs = channel < 4 ? 0 : 9
        channel = channel & 3
        this.pokey_regs[offs + channel * 2] = value
    }

    getPokeyAudf(channel) {
        let offs = channel < 4 ? 0 : 9
        channel = channel & 3
        return this.pokey_regs[offs + channel * 2]
    }

    setPokeyAudc(channel, value) {
        let offs = channel < 4 ? 0 : 9
        channel = channel & 3
        this.pokey_regs[offs + channel * 2 + 1] = value
    }

    getPokeyAudc(channel) {
        let offs = channel < 4 ? 0 : 9
        channel = channel & 3
        return this.pokey_regs[offs + channel * 2 + 1]
    }

    sendRegs(regs) {
        let t = this.startTime != null ? this.startTime + this.current_frame * this.frame_interval : this.getCurrentTime() + this.latency;
        let n_regs = this.song && this.song.n_channels == 4 ? 9 : 18
        let msg = regs.slice(0, n_regs).flatMap((v, i) => [i < 9 ? i : i - 9 + 16, v, t])
        this.pokey_node.port.postMessage(msg);
        this.sendEvent(regs)
    }
    stop() {
        this.state = "stopped";
        this.startTime = null;

        this.instr_pos = 0
        this.track_pos = 0

        this.channel_tone = []
        this.channel_volume = []

        // for debugging
        this.tracks_list_pos = 0
        this.repeat_track = false

        this.current_frame = 0;
        for(var i=0; i<this.pokey_regs.length; i++) {
            this.pokey_regs[i] = 0;
        }
        this.sendRegs(EMPTY_POKEY_REGS)
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
