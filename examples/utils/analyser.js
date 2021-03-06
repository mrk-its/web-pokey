function createAnalyser(audioContext) {
    var analyser = audioContext.createAnalyser();
    analyser.maxDecibels = -24;
    analyser.minDecibels = -80;
    analyser.fftSize = 2048;
    var bufferLength = analyser.frequencyBinCount;
    var dataArray = new Float32Array(bufferLength);
    var freqArray = new Uint8Array(bufferLength);

    var scopeCanvas = document.getElementById("oscilloscope");
    var scopeCanvasCtx = scopeCanvas.getContext("2d");

    // var spectrumCanvas = document.getElementById("spectrum");
    // var spectrumCanvasCtx = spectrumCanvas.getContext("2d");

    var spectrumCanvas = scopeCanvas;
    var spectrumCanvasCtx = scopeCanvasCtx;

    function draw() {
        // analyser.getByteTimeDomainData(dataArray);
        analyser.getFloatTimeDomainData(dataArray);

        scopeCanvasCtx.fillStyle = "rgb(0, 0, 0)";
        scopeCanvasCtx.fillRect(0, 0, scopeCanvas.width, scopeCanvas.height);

        // spectrumCanvasCtx.fillStyle = "rgb(0, 0, 0)";
        // spectrumCanvasCtx.fillRect(0, 0, spectrumCanvas.width, spectrumCanvas.height);
        spectrumCanvasCtx.fillStyle = "rgb(64, 64, 64)";
        for (var i = 0; i < bufferLength; i++) {
            if(freqArray[i]) {
                spectrumCanvasCtx.fillRect(i, spectrumCanvas.height- spectrumCanvas.height * freqArray[i] / 256, 1, spectrumCanvas.height);
            }
        }



        scopeCanvasCtx.lineWidth = 2;
        scopeCanvasCtx.strokeStyle = "rgb(0, 200, 0)";

        scopeCanvasCtx.beginPath();

        var sliceWidth = scopeCanvas.width * 1.0 / bufferLength;
        var x = 0;
        var last_sample = null;
        var offset = null;
        scopeCanvasCtx.moveTo(0, scopeCanvas.height / 2);
        for (var i = 0; i < bufferLength; i++) {
            var v = dataArray[i]
            if(offset == null && last_sample != null && last_sample < 0.0 && v >= 0.0) {
                offset = x;
            }
            var y = scopeCanvas.height / 2 + v * scopeCanvas.height / 2
            if(offset != null && x >= offset) {
                if (x == offset) {
                    scopeCanvasCtx.moveTo(x - offset, y);
                } else {
                    scopeCanvasCtx.lineTo(x - offset, y);
                }
            }

            x += sliceWidth;
            last_sample = v;
        }
        if(offset==null) {
            scopeCanvasCtx.lineTo(scopeCanvas.width, scopeCanvas.height / 2);
        }
        scopeCanvasCtx.stroke();

        analyser.getByteFrequencyData(freqArray);
    }

    return {
        node: analyser,
        draw,
    }
}

export {createAnalyser}
