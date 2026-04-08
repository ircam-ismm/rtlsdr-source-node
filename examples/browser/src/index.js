import { html, render } from 'lit';
import '@ircam/sc-components';
import resumeAudioContext from '../lib/resume-audio-context.js';
import { AudioContext } from 'isomorphic-web-audio-api';
import {
  RtlSdrStream,
  RtlSdrSourceNode,
} from '../../../src/RtlSdrSourceNode.js';

// in browsers, you will need to resume on a user gesture
const context = new AudioContext();
await resumeAudioContext(context);

let stream;

try {
  stream = new RtlSdrStream(context,{
    hardwareFrequency: 91.7e6,
    bufferingDuration: 0.05,
  });
} catch (err) {  
  render(html`
    <h1>RtlSdr radio demo</h1>
    <p>${err.message}</p>
  `, document.body);
}

if (stream) {
  await stream.start();  

  const src = new RtlSdrSourceNode(context, { stream });
  src.connect(context.destination);
  src.start();


  render(html`
    <h1>radio demo</h1>
  `, document.body);
}

