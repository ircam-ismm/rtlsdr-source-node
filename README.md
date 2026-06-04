# RTL-SDR Source Node

Integrate FM radio stream from [RTL-SDR dongle](https://www.rtl-sdr.com/rtl-sdr-quick-start-guide/) into an [audio graph](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Using_Web_Audio_API#audio_graphs) using [@jtarrio/webrtlsdr](github.com/jtarrio/webrtlsdr) and [@jtarrio/signals](github.com/jtarrio/signals).

## Requirements 

>[!IMPORTANT]  
>In order to receive FM radio signal, this library must be used together with an RTL-SDR dongle and a relevant antenna.

We used [RTL-SDR Blog v4 dongle](https://www.passion-radio.fr/cles-rtl-sdr/r828d-v4-2402.html) to develop this tool but any RTL2832U demodulator should work. 

To achieve best signal reception, the antenna should be of appropriated length depending on the frequency you want to demodulate. You will find detailed documentation (in French) on the link below, pages 80 to 84 (http://f6kgl.f5kff.free.fr/cours_radio.pdf).


## Installation & Usage

Turning RTL-SDR into an audio node makes it usable both for browser and node environments. Our implementation makes it also versatile for creative usages (e.g. connect radio stream with audio effects, use radio signal in a granular engine).

Install our package in your application with the following command:
`npm install --save @ircam/rtlsdr-source-node`

>[!NOTE]
> RtlSdr-source-node library provides two classes. 
> `RtlSdrStream` is used to access the dongle and create a stream with the demodulated signal. Use this class to access parameters related to radio demodulation (tuning frequency, stereo or mono demodulation). [See below for detailed documentation](#documentation)
>
> `RtlSdrSourceNode` receives samples from the `RtlSdrStream` and play them. Its usage is similar to an [AudioBufferSourceNode](https://developer.mozilla.org/en-US/docs/Web/API/AudioBufferSourceNode).
`RtlSdrSourceNode` can be instanciated on the fly, allowing complex buffer manipulation (e.g. granular synthesis). 

### First steps

```js
import { RtlSdrStream, RtlSdrSourceNode } from '@ircam/rtlsdr-source-node';

const audioContext = new AudioContext();
const stream = new RtlSdrStream(audioContext);
const src = new RtlSdrSourceNode(context, { stream });

src.connect(audioContext.destination);
src.start();

```

## Documentation

![architecture](https://github.com/ircam-ismm/rtlsdr-source-node/blob/main/doc/RtlSdrSourceNode_architecture.png)

### RtlSdrStream
> used to access the dongle and create a stream with the demodulated signal

The `RtlSdrStream` is instanciated with the following default constructor (arg1: audioContext, arg2: set of parameters)
```js
const stream = new RtlSdrStream(audioContext, {
	hardwareFrequency = 91.7e6, // Tuning frequency (Hz)
    stereo = false, // Stereo or mono demodulation
    bufferingDuration = 0.05, // Safety time before first play to avoid click.
    buffersPerSecond = 20, // Number of samples to process per second.
    downsamplerTaps = 151, // Number of taps for the downsampler filter. Must be an odd number
    rfTaps = 151, // Number of taps for the RF filter. Must be an odd number.
    audioTaps = 41, // Number of taps for the audio filter. Must be an odd number.
    deemphasizerTc = 50 // The time constant for the deemphasizer, in microseconds. This should be 75 for the US and South Korea, 50 everywhere else.
});
```

`RtlSdrStream` implements the following parameters: 
```js
// Read and modify parameters
console.log(stream.stereo);
stream.stereo = true;

console.log(stream.hardwareFrequency);
stream.hardwareFrequency = 100e6

// Read only parameters
console.log(stream.buffersPerSecond);
console.log(stream.bufferingDuration);

```

`RtlSdrStream` implements the following methods: 
```js
// methods
stream.start();
stream.stop();
```

### RtlSdrSourceNode
> receive samples from the `RtlSdrStream` and play them.

The `RtlSdrSourceNode` is instanciated with the following default constructor (arg1: audioContext, arg2: stream)
```js
const src = new RtlSdrSourceNode(audioContext, { stream });
```

`RtlSdrSourceNode` implements the following parameters: 
```js
// Read and modify parameters
console.log(src.detune);
src.detune = -300;

console.log(src.playbackRate);
src.playbackRate = 0.5;
```

`RtlSdrSourceNode` implements the following methods: 
```js
// methods
src.start();
src.stop();

src.connect(destination);
src.disconnect();
```


## Example

### Receive radio

This example receives FM radio and plays it over audioContext.destination in Node.

```js
node ./examples/receiveRadio.js
```

### Browser

This example receives FM radio and plays it over audioContext.destination in a webpage.

```js
cd ./examples/browser 
npm install
npm run dev
```

### Half-speed radio

This example receives FM radio and plays it half speed over audioContext.destination in Node.

```js
node ./examples/half-speed-radio.js
```

### Granular radio

This example receives FM radio and plays it as a granular synthesis

```js
node ./examples/granular-radio.js
```

## Embedded devices

You may have to reduce downsamplerTaps and rfTaps parameters in order to run this library on a single-board computer.

## Latency consideration

You may try to reduce bufferingDuration and increase bufferPerSecond parameters in order to reduce latency. 
We carried out some tests and achieved a total latency of 169 ms with optimal reception quality on a single-board computer.

## Emetteur
As part of this research project, we also tested several methods of transmitting an FM signal.

### HackHF One

Using an [HackRF One](https://www.passion-radio.fr/emetteur-sdr/hackrf-sdr-75.html) and [GNURadio](https://www.gnuradio.org/).
We tried the method proposed by Phutinyane et al. in the paper ‘AN-SDR-Based Multi-Channel FM Transmitter’

### Tetsuo Kogawa

On his [website](https://anarchy.translocal.jp/radio/micro/howtosimplestTX.html), Japanese artist Tetsuo Kogawa proposes a simple implementation of an FM transmitter. 

### RaspberryPi

Christophe Jacquet mades a [library](github.com/ChristopheJacquet/PiFmRds) to generates an FM modulation, with RDS datas using the Raspberry Pi.

## Licence

[BSD-3-Clause](./LICENSE.md)
