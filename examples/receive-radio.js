import { AudioContext } from 'isomorphic-web-audio-api';

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

const src = new RtlSdrSourceNode(context, { stream });
src.connect(context.destination);
src.start();