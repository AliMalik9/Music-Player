// Sample music data (Add your song files in the array below)
const songs = [
  {
    name: "La Calin",
    artist: "Serhat Durmus",
    file: "music/la-calin.mp3",
    img: "img/la-calin.png",
  },
  {
    name: "Never Known",
    artist: "MR TOUT LE MONDE",
    file: "music/never-known.mp3",
    img: "img/never-known.png",
  },
  {
    name: "Gumaan",
    artist: "Young Stunners",
    file: "music/gumaan.mp3",
    img: "img/gumaan.png",
  },
  {
    name: "Shor",
    artist: "Mooroo, Umair, Talha Anjum",
    file: "music/shor.mp3",
    img: "img/shor.png",
  },
  {
    name: "Toxic",
    artist: "BoyWithUke",
    file: "music/toxic.mp3",
    img: "img/toxic.png",
  },
  {
    name: "Tu Azma",
    artist: "Garvit, Juno",
    file: "music/tu-azma.mp3",
    img: "img/tu-azma.png",
  },
  {
    name: "Nahin Milta",
    artist: "Bayaan",
    file: "music/nahin-milta.mp3",
    img: "img/nahin-milta.png",
  },
  // Add more songs here
];

// State variables
let currentSongIndex = null;
let isPlaying = false;
const audio = new Audio();
audio.volume = 0.5;

// DOM Elements
const playButton = document.querySelector('.controls button:nth-child(2)');
const playIcon = "􀊄"; // Play icon
const pauseIcon = "􀊆"; // Pause icon
const volumeButton = document.querySelector('.volume button');
const toolbarTitle = document.querySelector('.toolbar .music h3');
const toolbarArtist = document.querySelector('.toolbar .music p');
const toolbarImage = document.querySelector('.toolbar .music img');
const volumeBar = document.querySelector('.volumeBar');
const volumeRunner = document.querySelector('.volumeRunner');
const forwardButton = document.querySelector('.controls button:nth-child(3)');
const backwardButton = document.querySelector('.controls button:nth-child(1)');
const startTime = document.querySelector('.startTime');
const endTime = document.querySelector('.endTime');
const progressBar = document.querySelector('.progressBar');
const progressRunner = document.querySelector('.runner');

// Add songs to the song list dynamically
const songListElement = document.querySelector('.song-list');
songs.forEach((song, index) => {
  const songElement = document.createElement('div');
  songElement.classList.add('song');
  songElement.innerHTML = `
    <div class="img">
      <button>􀊄</button>
      <img src="${song.img}" alt="">
    </div>
    <div class="details">
      <h3>${song.name}</h3>
      <p>${song.artist}</p>
    </div>
  `;
  songListElement.appendChild(songElement);

  // Add event listener to play the song when the card is clicked
  songElement.addEventListener('click', () => playSelectedSong(index));
});

// Event Listeners
playButton.addEventListener('click', togglePlay);
volumeButton.addEventListener('click', toggleMute);
volumeBar.addEventListener('click', setVolume);
volumeRunner.addEventListener('mousedown', startVolumeDrag);
forwardButton.addEventListener('click', nextSong);
backwardButton.addEventListener('click', previousSong);
progressBar.addEventListener('mousedown', startProgressDrag);
audio.addEventListener('timeupdate', updateProgress);

// Toggle play/pause
function togglePlay() {
  if (isPlaying) {
    audio.pause();
    playButton.textContent = playIcon;
    const currentSongElement = document.querySelector('.song.playing');
    if (currentSongElement) {
      currentSongElement.classList.remove('playing');
      currentSongElement.querySelector('button').textContent = playIcon; // Change button back to play
    }
  } else {
    audio.play();
    playButton.textContent = pauseIcon;
    const currentSongElement = document.querySelectorAll('.song')[currentSongIndex];
    if (currentSongElement) {
      currentSongElement.classList.add('playing');
      currentSongElement.querySelector('button').textContent = pauseIcon; // Change button to pause
    }
  }
  isPlaying = !isPlaying;
}

// Toggle mute/unmute
function toggleMute() {
  audio.muted = !audio.muted;
  volumeButton.textContent = audio.muted ? "􀊢" : "􀊦"; // Mute/unmute icon
}

// Play selected song from the list
function playSelectedSong(index) {
  // If the same song is clicked again, stop it and reset the button to play icon
  if (currentSongIndex === index && isPlaying) {
    audio.pause();
    isPlaying = false;
    playButton.textContent = playIcon;
    const currentSongElement = document.querySelectorAll('.song')[currentSongIndex];
    currentSongElement.classList.remove('playing');
    currentSongElement.querySelector('button').textContent = playIcon; // Set button to play icon
    return;
  }

  // Reset the previous playing song button and remove the hover effect
  if (currentSongIndex !== null) {
    const previousSong = document.querySelectorAll('.song')[currentSongIndex];
    previousSong.classList.remove('playing');
    previousSong.querySelector('button').textContent = playIcon; // Set to play icon
  }

  // Set the new current song
  currentSongIndex = index;
  audio.src = songs[currentSongIndex].file;
  audio.currentTime = 0;
  updateToolbar();

  // Play the new song
  audio.play();
  isPlaying = true;

  // Update the play button and hover state for the current song
  const currentSong = document.querySelectorAll('.song')[index];
  currentSong.classList.add('playing');
  currentSong.querySelector('button').textContent = pauseIcon; // Set to pause icon
  playButton.textContent = pauseIcon;
}

// Update toolbar details
function updateToolbar() {
  toolbarTitle.textContent = songs[currentSongIndex].name;
  toolbarArtist.textContent = songs[currentSongIndex].artist;
  toolbarImage.src = songs[currentSongIndex].img;
}

// Set volume
function setVolume(e) {
  const rect = volumeBar.getBoundingClientRect();
  const newVolume = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1);
  updateVolume(newVolume);
}

function updateVolume(newVolume) {
  audio.volume = newVolume;
  volumeRunner.style.width = `${newVolume * 100}%`;
}

// Start volume drag
function startVolumeDrag(e) {
  volumeRunner.classList.add('dragging');
  document.addEventListener('mousemove', onVolumeDrag);
  document.addEventListener('mouseup', stopVolumeDrag);
}

function onVolumeDrag(e) {
  const rect = volumeBar.getBoundingClientRect();
  const newVolume = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1);
  updateVolume(newVolume);
}

function stopVolumeDrag() {
  document.removeEventListener('mousemove', onVolumeDrag);
  document.removeEventListener('mouseup', stopVolumeDrag);
  volumeRunner.classList.remove('dragging');
}

// Start progress drag
function startProgressDrag(e) {
  isDragging = true;
  progressRunner.classList.add('dragging');
  document.addEventListener('mousemove', onProgressDrag);
  document.addEventListener('mouseup', stopProgressDrag);
}

function onProgressDrag(e) {
  const rect = progressBar.getBoundingClientRect();
  const newTime = Math.min(Math.max((e.clientX - rect.left) / rect.width * audio.duration, 0), audio.duration);
  updateProgressBar(newTime);
}

function stopProgressDrag(e) {
  document.removeEventListener('mousemove', onProgressDrag);
  document.removeEventListener('mouseup', stopProgressDrag);
  isDragging = false;
  setProgress(e); // Set the progress when the drag ends
  progressRunner.classList.remove('dragging');
}

// Update progress bar visually during drag
function updateProgressBar(newTime) {
  if (isDragging) {
    const progressPercent = (newTime / audio.duration) * 100;
    progressRunner.style.width = `${progressPercent}%`;
    startTime.textContent = formatTime(newTime);
  }
}

// Set progress (scrubbing)
function setProgress(e) {
  const rect = progressBar.getBoundingClientRect();
  const newTime = Math.min(Math.max((e.clientX - rect.left) / rect.width * audio.duration, 0), audio.duration);
  audio.currentTime = newTime;
}

// Update progress bar and time
function updateProgress() {
  if (!isDragging) {
    const progressPercent = (audio.currentTime / audio.duration) * 100;
    progressRunner.style.width = `${progressPercent}%`;
    startTime.textContent = formatTime(audio.currentTime);
    endTime.textContent = formatTime(audio.duration);
  }
}

// Format time in MM:SS
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}

// Go to next song and play automatically
function nextSong() {
  currentSongIndex = (currentSongIndex + 1) % songs.length;
  audio.src = songs[currentSongIndex].file;
  audio.currentTime = 0;
  updateToolbar();
  audio.play(); // Automatically play the song
  playButton.textContent = pauseIcon; // Update play button icon
  isPlaying = true;
}

// Go to previous song and play automatically
function previousSong() {
  currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
  audio.src = songs[currentSongIndex].file;
  audio.currentTime = 0;
  updateToolbar();
  audio.play(); // Automatically play the song
  playButton.textContent = pauseIcon; // Update play button icon
  isPlaying = true;
}

// Initial setup
updateToolbar();
