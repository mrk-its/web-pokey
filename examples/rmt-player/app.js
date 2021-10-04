import { createAnalyser } from '../utils/analyser.js'
import { RMTPlayer} from './web-rmt/rmt.js'
const _reg_names = ["audf1", "audc1", "audf2", "audc2", "audf3", "audc3", "audf4", "audc4", "audctl"];
const reg_names = [..._reg_names, ..._reg_names]

function getSampleRate() {
    return parseInt(localStorage.sampleRate2 || 56000)
}

function getFrameRate() {
    return parseInt(localStorage.frameRate || 50)
}

const NOTE_KEYMAP = [
    [90], // 0
    [83], //1
    [88], //2
    [68], //3
    [67], //4
    [86], //5
    [71], //6
    [66], //7
    [72], //8
    [78], //9
    [74], //10
    [77], //11
    [188,81], //12
    [76,50], //13
    [190,87], //14
    [186,51], //15
    [191,69], //16
    [82], //17
    [53], //18
    [84], //19
    [54], //20
    [89], //21
    [55], //22
    [85], //23
    [73], //24
    [57], //25
    [79], //26
    [48], //27
    [80], //28
    [219], //29
    [187], //30
    [221] //31
];

function createNoteKeyMap(kmap) {
    const map = [];
    _.each(kmap, (v,note) => {
        _.each(v, kcode => { map[kcode] = note })
    })
    map[32] = 62; // empty row
    return map;
}

async function init(latencyHint) {
    var latencyHint = parseFloat(localStorage.latencyHint);
    if(!(latencyHint >=0 )) latencyHint = localStorage.latencyHint || "playback";
    let audioContextParams = {
        sampleRate: getSampleRate(),
        latencyHint,
    }
    const audioContext = new AudioContext(audioContextParams)

    console.info("created audioContext with:", audioContextParams)

    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            audioContext.suspend();
        } else {
            audioContext.resume();
        }
    });

    $("#latency").text(audioContext.baseLatency)

    $("select.sample_rate").val(getSampleRate()).change((e) => {
        let val = $(e.target).val()
        localStorage.sampleRate2 = val
        window.location.reload(true)
    })
    $("select[name=fps]").val(getFrameRate()).change(e => {
        let val = parseFloat($(e.target).val())
        localStorage.frameRate = val
        rmt_player.setFrameRate(val)
    })

    await audioContext.audioWorklet.addModule('../../pokey.js')
    const pokeyNode = new AudioWorkletNode(audioContext, 'POKEY', {
        outputChannelCount: [2],
    })
    var analyser = createAnalyser(audioContext);
    analyser.node.connect(audioContext.destination);
    // pokeyNode.connect(audioContext.destination)
    pokeyNode.connect(analyser.node);

    let rmt_player = new RMTPlayer(audioContext, pokeyNode, {frameRate: getFrameRate()});
    window.rmt_player = rmt_player

    function load(buffer) {
        let is_ok = rmt_player.load(buffer);
        if(!is_ok) {
            $("#sap_error").text(rmt_player.error_message);
            return
        }
        let is_stereo = rmt_player.song.n_channels == 8
        $('body').toggleClass("stereo", is_stereo)
        $('#player .title').text(rmt_player.song.name)
        $('#player .details').text(`${is_stereo ? 'stereo' : 'mono'} ${rmt_player.song.songSpeed} / ${rmt_player.song.instrumentFreq}`)
        rmt_player.play()

        let instr_selector = $("#instrument")
        instr_selector.empty()
        for(const instr of rmt_player.instruments) {
            if(instr)
                $("<option>").val(instr.index).text(`${hex2(instr.index)}: ${instr.name}`).appendTo(instr_selector)
        }
        instr_selector.change()
        $("#player .title").text(rmt_player.name)
        $("#sap_error").text(rmt_player.error_message);
    }

    function play_url(url) {
        if(url.startsWith("http://") || url.startsWith("https://")) {
            url = "https://atari.ha.sed.pl/" + url
        }
        fetch(url)
            .then(response => response.arrayBuffer())
            .then(load)
            .then(() => $('input[type=file]').val(''))
            .catch(err => $("#sap_error").text(err))
    }

    function send_regs() {
        audioContext.resume();
        let t = audioContext.currentTime + 0.05;
        let msg = reg_names.map(get_reg).flatMap((v, i) => [i, v, t])
        pokeyNode.port.postMessage(msg);
    }

    function get_reg(name) {
        let input = document.querySelector("#" + name);
        return parseInt(input.value, 16) || 0;
    }

    function set_reg(index, name, value) {
        let input = document.querySelector(`#pokey_${index} .${name}`)
        if(!input) console.log(`#pokey_${index} .${name}`)
        input.value = value
    }
    function hash_changed() {
        let hash = document.location.hash.substring(1);
        if(hash) {
            play_url(hash);
        }
    }

    function hex2(value) {
        if (value < 0) value = 0;
        if (value > 255) value = 255;
        var hex = value.toString(16);
        if (hex.length < 2) {
            hex = "0" + hex;
        }
        return hex;
    }
    $("#latency-hint").change(e => {
        localStorage['latencyHint'] = e.target.value;
    }).val(localStorage['latencyHint'] || 'playback');
    $('#ua').text(window.navigator.userAgent);
    $('#pokeyRegs input').change(send_regs);
    $('body').click(() => {
        audioContext.resume();
    })
    $(window).bind("hashchange", hash_changed);

    function stop_propagation(event) {
        event.preventDefault();
        event.stopPropagation();
    }
    function handle_file(file) {
        file.arrayBuffer()
            .then(load)
            .then(() => document.location.hash = '')
    }
    $('input[type=file]').on("change", event => {
        for(const file of event.target.files) {
            handle_file(file)
        }
    })

    $('html')
      .on("dragover", stop_propagation)
      .on("drop", stop_propagation)
      .on("dragleave", stop_propagation)
      .on("drop", event => {
        let url = event.originalEvent.dataTransfer.getData("text/plain")
        if(url) {
            document.location.hash = url
            return;
        }
        for(const file of event.originalEvent.dataTransfer.files ) {
            $('input[type=file]').val('')
            handle_file(file)
        }
    })

    let gain = $('#player .gain').val(localStorage.volume_db || 0).on('input',
        event => {
            let db = parseFloat(event.target.value)
            let min = parseFloat(event.target.min)
            let gain = db > min ? Math.pow(10, db / 20) : 0
            pokeyNode.parameters.get('gain').value = gain
            localStorage.volume_db = db
            $("span.volume_db").text(`${db.toFixed(1)}dB`)
        }
    ).trigger('input')

    let position_info = $('#player .position-info');

    $('#player .play').click(() => rmt_player.play());
    // $('#player .pause').click(() => sapPlayer.pause());
    $('#player .stop').click(() => rmt_player.stop());
    // $('#player .prev').click(() => sapPlayer.prev());
    // $('#player .next').click(() => sapPlayer.next());

    $(window).bind("rmt_player", event => {
        let data = event.originalEvent.data;
        if(data.pokeyRegs) {
            let regs = Array.from(data.pokeyRegs);
            regs.map(hex2).map((v, i) => {
                set_reg(i < 9 ? '0' : '1', reg_names[i], v);
            })
        }
        position_info.text(`${hex2(data.trackPos)} / ${hex2(data.tracksListPos)}`)
    })

    $("#details > a.toggle").click(e => {
        e.preventDefault()
        $(e.target).parent().toggleClass("hidden")
    })

    function instrument_details(instrument) {
        let size = instrument.table.length + instrument.envelope.length + 12;
        let cont = $('<div>')
        let blocks = [' ', '▂', '▄', '▆', '█']

        let _ef = k => Array.from(instrument.envelope).filter((v, i) => i % 3 == k)

        let vs = _ef(0).map(v => (v & 0xf))
        let v1 = vs.map( v => blocks[Math.min(Math.max(v - 12, 0), 4)]).join("")
        let v2 = vs.map( v => blocks[Math.min(Math.max(v - 8, 0), 4)]).join("")
        let v3 = vs.map( v => blocks[Math.min(Math.max(v - 4, 0), 4)]).join("")
        let v4 = vs.map( v => blocks[Math.min(v, 4)]).join("")


        let volumes = vs.map(v => v.toString(16)).join("")
        let distortions = _ef(1).map(v => (((v >> 1) & 7) * 2).toString(16)).join("")
        let commands = _ef(1).map(v => ((v >> 4) & 7).toString(16)).join("")
        let filters = _ef(1).map(v => v & 128 ? "•" : ".").join("")
        let portas = _ef(1).map(v => v & 1 ? "•" : ".").join("")
        let xs = _ef(2).map(v => (v >> 4).toString(16)).join("")
        let ys = _ef(2).map(v => (v & 0xf).toString(16)).join("")

        let i = instrument
        let h2 = hex2

        $("<pre>").text(`
NAME: ${i.name} (size: ${size} bytes)

 EFFECT: ${'  '         }  ENVELOPE: ${'  '        }   TABLE:
  DELAY: ${h2(i.delay)  }      ELEN: ${h2(i.elen)  }    TLEN: ${h2(i.tlen)}
VIBRATO: ${h2(i.vibrato)}       EGO: ${h2(i.ego)   }     TGO: ${h2(i.tgo)}
 FSHIFT: ${h2(i.fshift) }    VSLIDE: ${h2(i.vslide)}    TSPD: ${h2(i.tspd)}
         ${'  '         }      VMIN: ${h2(i.vmin)  }    TYPE: ${h2(i.ttype)}
 AUDCTL: ${h2(i.audctl) }            ${'  '        }    MODE: ${h2(i.tmode)}
     ${v1}
     ${v2}
     ${v3}
     ${v4}
VOL: ${volumes}
DIS: ${distortions}
CMD: ${commands}
 X/: ${xs}
 Y\\: ${ys}
  F: ${filters}
  P: ${portas}

TABLE OF NOTES: |${instrument.table.map(hex2).join(" ")}|
        `).appendTo(cont)

        return cont;
    }

    let instr_selector = $("#instrument").change(e => {
        let instr_index = parseInt($(e.target).val())
        let instrument = rmt_player.instruments[instr_index]
        instrument_details(instrument).appendTo($("#instrument-details").empty())
    })

    const noteKeyMap = createNoteKeyMap(NOTE_KEYMAP)
    $(window).bind("keydown", event => {
        audioContext.resume();
        let note = noteKeyMap[event.keyCode || event.which];
        if(note >=0 && note < 61) {
            let instr_index = parseInt($("#instrument").val())
            let octave = parseInt($("#octave").val())
            rmt_player.tune(1, instr_index, octave + note, 15)
        }
    })

    let tick = () => {
        rmt_player.tick();
        analyser.draw();
        requestAnimationFrame(tick);
    }
    tick();
    hash_changed()
}

init("playback");
