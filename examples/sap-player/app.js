import { createAnalyser } from '../utils/analyser.js'
import { SAPPlayer} from './sap.js'
const _reg_names = ["audf1", "audc1", "audf2", "audc2", "audf3", "audc3", "audf4", "audc4", "audctl"];
const reg_names = [..._reg_names, ..._reg_names]

function get_sample_rate() {
    return parseInt(localStorage.sampleRate2 || 56000)
}

async function init(latencyHint) {
    var latencyHint = parseFloat(localStorage.latencyHint);
    if(!(latencyHint >=0 )) latencyHint = localStorage.latencyHint || "playback";
    let audioContextParams = {
        sampleRate: get_sample_rate(),
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

    $("select.sample_rate").val(get_sample_rate()).change((e) => {
        let val = $(e.target).val()
        localStorage.sampleRate2 = val
        window.location.reload(true)
    })

    await audioContext.audioWorklet.addModule('../../pokey.js')
    const pokeyNode = new AudioWorkletNode(audioContext, 'POKEY', {
        outputChannelCount: [2],
    })
    var analyser = createAnalyser(audioContext);
    analyser.node.connect(audioContext.destination);
    // pokeyNode.connect(audioContext.destination)
    pokeyNode.connect(analyser.node);

    let sapPlayer = new SAPPlayer(audioContext, pokeyNode);
    window.sapPlayer = sapPlayer;

    function load_sap(buffer) {
        let is_ok = sapPlayer.load(buffer);
        if(!is_ok) {
            $("#sap_error").text(sapPlayer.error_message);
            return
        }
        let title_parts = [
            sapPlayer.headers.AUTHOR, sapPlayer.headers.NAME
        ].filter((x) => x)
        $("#player .title").text(title_parts.join(" / "))
        $("body").toggleClass("stereo", is_ok && sapPlayer.headers.STEREO || false)
        $("#sap_error").text(sapPlayer.error_message);
        $("#sap_headers").text(sapPlayer.raw_headers);
    }

    function play_url(url) {
        if(url.startsWith("http://") || url.startsWith("https://")) {
            url = "https://atari.ha.sed.pl/" + url
        }
        fetch(url)
            .then(response => response.arrayBuffer())
            .then(load_sap)
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
        sapPlayer.audio_context.resume();
    })
    $(window).bind("hashchange", hash_changed);

    function stop_propagation(event) {
        event.preventDefault();
        event.stopPropagation();
    }
    function handle_file(file) {
        file.arrayBuffer()
            .then(load_sap)
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

    let seek = $('#player .seek').bind('input', event => sapPlayer.seek(event.target.value));
    let gain = $('#player .gain').val(localStorage.volume_db || 0).on('input',
        event => {
            let db = parseFloat(event.target.value)
            let min = parseFloat(event.target.min)
            let gain = db > min ? Math.pow(10, db / 20) : 0
            console.log("gain", db, "db (", gain, ")")
            sapPlayer.pokeyNode.parameters.get('gain').value = gain
            localStorage.volume_db = db
            $("span.volume_db").text(`${db.toFixed(1)}dB`)
        }
    ).trigger('input')

    let position_info = $('#player .position-info');

    $('#player .play').click(() => sapPlayer.play());
    $('#player .pause').click(() => sapPlayer.pause());
    $('#player .stop').click(() => sapPlayer.stop());
    $('#player .prev').click(() => sapPlayer.prev());
    $('#player .next').click(() => sapPlayer.next());

    $(window).bind("sap_player", event => {
        let data = event.originalEvent.data;
        if(data.pokeyRegs) {
            let regs = Array.from(data.pokeyRegs);
            regs.map(hex2).map((v, i) => {
                set_reg(i < 9 ? '0' : '1', reg_names[i], v);
            })
        }
        seek[0].max = data.frame_cnt > 0 ? data.frame_cnt - 1 : 0;
        seek.val(data.currentFrame);
        position_info.text(`${data.currentFrame} / ${data.frame_cnt}`)
    })

    $("#details").click(e => {
        e.preventDefault()
        $(e.target).parent().toggleClass("hidden")
    })

    let tick = () => {
        sapPlayer.tick();
        analyser.draw();
        requestAnimationFrame(tick);
    }
    tick();
    hash_changed();
}

init("playback");
