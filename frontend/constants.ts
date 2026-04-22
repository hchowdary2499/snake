import { Track } from './types';

export const GRID_SIZE = 20;
export const GAME_SPEED_MS = 120;

// Using reliable public domain / demo tracks for the "AI Generated" dummy music
export const DUMMY_TRACKS: Track[] = [
  {
    id: 1,
    title: "Neon Horizon",
    artist: "AI Synthwave Gen v1",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    durationStr: "6:12"
  },
  {
    id: 2,
    title: "Cybernetic Pulse",
    artist: "Neural Net Audio",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    durationStr: "7:05"
  },
  {
    id: 3,
    title: "Digital Overdrive",
    artist: "Algo-Rhythm",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    durationStr: "5:44"
  }
];
