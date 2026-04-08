import { AudioContext, GainNode } from 'isomorphic-web-audio-api';
import {
  RtlSdrStream,
  RtlSdrSourceNode,
} from '../src/RtlSdrSourceNode.js';

// in browsers, you will need to resume on a user gesture
const context = new AudioContext();

const stream = new RtlSdrStream(context,{
  hardwareFrequency: 91.7e6,
  bufferingDuration: 0.05,
});

await stream.start();

setInterval(() => {
  const now = context.currentTime;
  const grainDuration = 0.5;

  const env = new GainNode(context, { gain: 0 });
  const src = new RtlSdrSourceNode(context, { stream });
  src
		.connect(env)
		.connect(context.destination);

  env.gain.setValueAtTime(0, now);
  env.gain.linearRampToValueAtTime(1, now + grainDuration / 2);
  env.gain.linearRampToValueAtTime(0, now + grainDuration);

	src.detune = -1200;
	src.start(now);
	src.stop(now + 0.5);
}, 0.1 * 1000);
