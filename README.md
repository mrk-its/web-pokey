# Web POKEY
Emulates 8-bit Atari POKEY chip as WebAudio component (implemented as AudioWorkletProcessor)

## Features:

  * 4 channels, 15kHz / 64kHz / 1.77Mhz clock
  * 16-bit linked channels
  * 4 / 5 / 9 / 17 bit poly noise generators
  * high-pass filters
  * volume-only mode
  * Second POKEY (stereo) emulation

## Usage

This library only provides POKEY AudioWorkletProcessor, initialization of AudioContext / loading of POKEY module / creating AudioWorkletNode is your job (take a look on included examples). For now only 48000 sample rate is supported. To enable stereo (second POKEY) provide `outputChannelCount: [2]` parameter to POKEY AudioWorkletNode.

Example initialization (with stereo):

    const audioContext = new AudioContext({
        sampleRate: 48000,
    })
    await audioContext.audioWorklet.addModule('../../pokey.js');
    const pokeyNode = new AudioWorkletNode(audioContext, 'POKEY', {
        outputChannelCount: [2],
    })
    pokeyNode.connect(audioContext.destination)

To set values of POKEY registers create js array of floats as follows:

    let msg = [reg_index1, reg_value1, timestamp1, reg_index2, reg_value2, timestamp2, ...]

and send it to POKEY with:

    pokeyNode.port.postMessage(msg)

Single array defines values of one or more registers, lenght of array must be multiple of 3 (and minimum length of 3).
For stereo, second pokey registers have indices from 0x10 .. 0x1f

Timestamp define when POKEY register needs to be updated (AudioContext time is used for scheduling these updates. It starts from `0.0`, current time may be accessed via `audioContext.currentTime`). If timestamp is less or equal `audioContext.currentTime` (for example timestamp=0) register will be updated as soon as possible.



## Live examples:
  * [Basic](https://mrk.sed.pl/web-pokey/examples/basic/)
  * [Self Test](https://mrk.sed.pl/web-pokey/examples/self-test/)
  * [Pokey Regs](https://mrk.sed.pl/web-pokey/examples/pokey-regs/)
  * [SAP player](https://mrk.sed.pl/web-pokey/examples/sap-player/)
    - [Fred](https://mrk.sed.pl/web-pokey/examples/sap-player/#https://atarionline.pl/forum/?PostBackAction=Download&AttachmentID=16742)
    - [Lasermania](https://mrk.sed.pl/web-pokey/examples/sap-player/#https://atarionline.pl/forum/?PostBackAction=Download&AttachmentID=16743)
    - [Zybex](https://mrk.sed.pl/web-pokey/examples/sap-player/#https://atarionline.pl/forum/?PostBackAction=Download&AttachmentID=16744)
