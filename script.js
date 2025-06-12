let playlists = [];

fetch('data.json')
  .then(response => {
    if (!response.ok) {
      throw new Error('Failed to load playlist data');
    }
    return response.json();
  })
  .then(data => {
    playlists = data;
    renderPlaylists();
  })
  .catch(error => {
    console.error('Error loading playlists:', error);
  });

// Function to render playlist tiles
function renderPlaylists() {
  const container = document.createElement('div');
  container.className = 'playlist-grid';

  /**
  // Restore the "Liked Songs" and "Liked Playlists" tiles
  const likedSongsTile = document.createElement('div');
  likedSongsTile.className = 'playlist-tile';
  likedSongsTile.innerHTML = `
    <img src="images/disk.gif" alt="Liked Songs">
    <h3>Liked Songs</h3>
    <p>Your favorite songs in one place.</p>
  `.trim();
  likedSongsTile.addEventListener('click', () => {
    const modal = document.getElementById('playlist-modal');
    const content = document.getElementById('modal-playlist-content');
    //const likedSongs = JSON.parse(localStorage.getItem('liked-songs')) || [];
    content.innerHTML = `
      <h2>Liked Songs</h2>
      <div class="modal-tracks">
        ${likedSongs.map((track, index) => `
          <div class="modal-track" style="position: relative;">
            <h4>Track ${index + 1} - "${track.title}"</h4>
            <p><strong>Artist:</strong> ${track.artist}</p>
            <p><strong>Duration:</strong> ${track.duration}</p>
            <p><strong>From Playlist:</strong> ${track.playlistTitle}</p>
            <audio id="liked-audio-${index}" src="${track.src}" style="display:none;"></audio>
            <button class="global-play-btn" data-audio-id="liked-audio-${index}" data-track-title="${track.title}" style="position: absolute; right: 20px; top: 50%; transform: translateY(-50%); font-size: 1.2em;">&#9658;</button>
          </div>
        `).join('')}
      </div>
    `;
    modal.style.display = 'flex';
  });

  const likedPlaylistsTile = document.createElement('div');
  likedPlaylistsTile.className = 'playlist-tile';
  likedPlaylistsTile.innerHTML = `
    <img src="images/tama.gif" alt="Liked Playlists">
    <h3>Liked Playlists</h3>
    <p>Playlists you've shown love to.</p>
  `;
  likedPlaylistsTile.addEventListener('click', () => {
    const modal = document.getElementById('playlist-modal');
    const content = document.getElementById('modal-playlist-content');
    const likedPlaylists = JSON.parse(localStorage.getItem('liked-playlists')) || [];
    const likedPlaylistsData = playlists.filter(p => likedPlaylists.includes(p.id));
    content.innerHTML = `
      <h2>Liked Playlists</h2>
      <div class="playlist-grid">
        ${likedPlaylistsData.map(p => `
          <div class="playlist-tile">
            <img src="${p.image}" alt="${p.title}">
            <h3>${p.title}</h3>
            <p>${p.description}</p>
            <div class="playlist-author">By ${p.author}</div>
          </div>
        `).join('')}
      </div>
    `;
    modal.style.display = 'flex';
  });

  container.appendChild(likedSongsTile);
  container.appendChild(likedPlaylistsTile);
  **/

  playlists.forEach((playlist, index) => {
    const tile = document.createElement('div');
    tile.className = 'playlist-tile';

    const storedLikes = localStorage.getItem(`likes-${playlist.id}`);
    const storedUserLikes = localStorage.getItem(`user-likes-${playlist.id}`);
    let defaultLikes = [5, 8, 12, 3, 10, 0]; // Example defaults, last one is 0
    const likeCount = storedLikes ? parseInt(storedLikes) : defaultLikes[index % defaultLikes.length];
    const userLikes = storedUserLikes ? parseInt(storedUserLikes) : 0;

    tile.innerHTML = `
      <img src="${playlist.image}" alt="${playlist.title}">
      <h3>${playlist.title}</h3>
      <p>${playlist.description}</p>
      <div class="playlist-author">By ${playlist.author}</div>
      <div class="playlist-likes" id="likes-${playlist.id}">${likeCount} Likes</div>
      <button class="like-btn" data-id="${playlist.id}" data-user-likes="${userLikes}">
        <span class="heart-icon">${userLikes ? '❤️' : '🤍'}</span>
      </button>
    `;

    container.appendChild(tile);

    tile.addEventListener('click', () => {
      const modal = document.getElementById('playlist-modal');
      const content = document.getElementById('modal-playlist-content');
      content.innerHTML = `
        <div class="modal-content-layout">
          <div class="modal-info">
            <h2>${playlist.title}</h2>
            <img src="${playlist.image}" alt="${playlist.title}" style="width:100%; border-radius:10px;">
            <p>${playlist.description}</p>
            <p><strong>Author:</strong> ${playlist.author}</p>
          </div>
          <div class="modal-tracks">
            <button class="shuffle-btn" style="align-self: flex-end; background-color: #ffe6fa; border: none; padding: 8px 16px; border-radius: 10px; font-weight: bold; cursor: pointer; margin-bottom: 15px;">🔀 Shuffle</button>
            <div class="track-list">
              ${playlist.tracks && playlist.tracks.length > 0 ? playlist.tracks.map((track, index) => `
                <div class="modal-track" style="position: relative;">
                  <h4>Track ${index + 1} - "${track.title}"</h4>
                  <p><strong>Artist:</strong> ${track.artist}</p>
                  <p><strong>Duration:</strong> ${track.duration}</p>
                  <audio id="audio-${playlist.id}-${index}" src="${track.src}" style="display:none;"></audio>
                  <button class="global-play-btn" data-audio-id="audio-${playlist.id}-${index}" data-track-title="${track.title}" style="position: absolute; right: 20px; top: 50%; transform: translateY(-50%); font-size: 1.2em;">&#9658;</button>
                </div>
              `).join('') : ''}
            </div>
          </div>
        </div>
        <div id="modal-now-playing" style="margin-top: 30px; border-top: 1px solid #ddd; padding-top: 20px; font-size: 1em; color: #5e2d50; display: flex; justify-content: space-between; align-items: center;">
          <span id="now-playing-title">Nothing playing</span>
          <button id="now-playing-toggle" style="padding: 6px 12px; border-radius: 10px; border: none; background-color: #ffe6fa; font-weight: bold; cursor: pointer;">⏸ Pause</button>
        </div>
      `;
      modal.style.display = 'flex';

      // Add shuffle button logic
      const shuffleButton = content.querySelector('.shuffle-btn');
      const trackList = content.querySelector('.track-list');
      shuffleButton.addEventListener('click', () => {
        const shuffledTracks = [...playlist.tracks].sort(() => Math.random() - 0.5);
        trackList.innerHTML = shuffledTracks.map((track, index) => `
          <div class="modal-track" style="position: relative;">
            <h4>Track ${index + 1} - "${track.title}"</h4>
            <p><strong>Artist:</strong> ${track.artist}</p>
            <p><strong>Duration:</strong> ${track.duration}</p>
            <audio id="audio-${playlist.id}-${index}" src="${track.src}" style="display:none;"></audio>
            <button class="global-play-btn" data-audio-id="audio-${playlist.id}-${index}" data-track-title="${track.title}" style="position: absolute; right: 20px; top: 50%; transform: translateY(-50%); font-size: 1.2em;">&#9658;</button>
          </div>
        `).join('');
        // Re-attach global play listeners after shuffle
        attachGlobalPlayListeners(content);
      });

      function attachGlobalPlayListeners(content) {
        document.getElementById('modal-now-playing').style.display = 'none';

        const globalButtons = content.querySelectorAll('.global-play-btn');
        const nowPlayingTitle = document.getElementById('now-playing-title');
        const nowPlayingToggle = document.getElementById('now-playing-toggle');
        let currentAudio = null;

        globalButtons.forEach(button => {
          button.addEventListener('click', () => {
            const audioId = button.getAttribute('data-audio-id');
            const title = button.getAttribute('data-track-title');
            const audio = document.getElementById(audioId);
            if (!audio.src) {
              const track = playlist.tracks.find(t => `audio-${playlist.id}-${playlist.tracks.indexOf(t)}` === audioId);
              if (track) audio.src = track.src;
            }

            if (currentAudio && currentAudio !== audio) {
              currentAudio.pause();
              currentAudio.currentTime = 0;
            }

            if (audio.paused) {
              audio.play();
              document.getElementById('modal-now-playing').style.display = 'flex';
              nowPlayingTitle.textContent = `Now Playing: ${title}`;
              nowPlayingToggle.innerHTML = '⏸';
              currentAudio = audio;
              button.innerHTML = '<img src="images/sound.gif" alt="sound" style="width: 40px; height: 40px;">';
            } else {
              audio.pause();
              nowPlayingTitle.textContent = `Paused: ${title}`;
              nowPlayingToggle.innerHTML = '&#9658;';
              button.innerHTML = '&#9658;';
            }
          });
        });

        nowPlayingToggle.addEventListener('click', () => {
          if (!currentAudio) return;

          const trackButton = [...globalButtons].find(btn => btn.getAttribute('data-audio-id') === currentAudio.id);

          if (nowPlayingToggle.innerHTML.includes('⏸')) {
            currentAudio.pause();
            nowPlayingToggle.innerHTML = '&#9658;';
            nowPlayingTitle.textContent = `Paused: ${trackButton ? trackButton.getAttribute('data-track-title') : currentAudio.getAttribute('src')}`;
            if (trackButton) trackButton.innerHTML = '&#9658;';
          } else {
            currentAudio.play();
            nowPlayingToggle.innerHTML = '⏸';
            nowPlayingTitle.textContent = `Now Playing: ${trackButton ? trackButton.getAttribute('data-track-title') : currentAudio.getAttribute('src')}`;
            if (trackButton) trackButton.innerHTML = '<img src="images/sound.gif" alt="sound" style="width: 40px; height: 40px;">';
          }
        });
      }
      attachGlobalPlayListeners(content);
    });
  });

  // document.body.appendChild(container);
  const root = document.getElementById('playlist-root');
  if (root) {
    root.appendChild(container);
  }

  document.querySelectorAll('.like-btn').forEach(button => {
    button.addEventListener('click', (event) => {
      event.stopPropagation();
      const id = button.getAttribute('data-id');
      const countEl = document.getElementById(`likes-${id}`);

      let userLikes = parseInt(button.getAttribute('data-user-likes')) || 0;
      let displayLikes = parseInt(countEl.textContent.match(/\d+/)) || 0;

      if (userLikes === 0) {
        userLikes = 1;
        displayLikes++;
      } else {
        userLikes = 0;
        displayLikes = Math.max(0, displayLikes - 1);
      }

      button.setAttribute('data-user-likes', userLikes);
      localStorage.setItem(`user-likes-${id}`, userLikes);
      localStorage.setItem(`likes-${id}`, displayLikes);
      countEl.textContent = `${displayLikes} Likes`;
      button.querySelector('.heart-icon').textContent = userLikes ? '❤️' : '🤍';

      /**
      //let likedPlaylists = JSON.parse(localStorage.getItem('liked-playlists')) || [];
      //if (userLikes === 1) {
        //if (!likedPlaylists.includes(id)) {
          //likedPlaylists.push(id);
        //}
      //} else {
        //likedPlaylists = likedPlaylists.filter(pid => pid !== id);
      //}
      //localStorage.setItem('liked-playlists', JSON.stringify(likedPlaylists));

      // Update Liked Songs in localStorage
      //let likedSongs = JSON.parse(localStorage.getItem('liked-songs')) || [];
      //const playlist = playlists.find(p => p.id === id);
      //if (userLikes === 1 && playlist && playlist.tracks) {
        //playlist.tracks.forEach(track => {
          //const uniqueId = `${playlist.id}-${track.title}`;
          //if (!likedSongs.some(song => song.id === uniqueId)) {
            //likedSongs.push({
              //id: uniqueId,
              /**title: track.title,
              artist: track.artist,
              duration: track.duration,
              src: track.src,
              playlistTitle: playlist.title
            });
          }
        });
      } else if (userLikes === 0 && playlist && playlist.tracks) {
        likedSongs = likedSongs.filter(song => !playlist.tracks.some(track => song.id === `${playlist.id}-${track.title}`));
      }
      localStorage.setItem('liked-songs', JSON.stringify(likedSongs));
      **/
    });
  });

  // Enhanced search/filter UI and logic
  // Replace the .search-container inner HTML as requested
  const searchContainer = document.querySelector('.search-container');
  if (searchContainer) {
    searchContainer.innerHTML = `
      <input type="text" placeholder="Search playlists..." />
      <button id="search-btn" class="search-button">Search</button>
      <button id="clear-btn" class="clear-button">Clear</button>
    `;
  }
  const searchInput = document.querySelector('.search-container input[type="text"]');
  const searchBtn = document.getElementById('search-btn');
  const clearBtn = document.getElementById('clear-btn');

  function filterPlaylists() {
    const query = searchInput.value.toLowerCase();
    const allTiles = document.querySelectorAll('.playlist-grid .playlist-tile');
    allTiles.forEach(tile => {
      const title = tile.querySelector('h3')?.textContent.toLowerCase() || '';
      const description = tile.querySelector('p')?.textContent.toLowerCase() || '';
      const author = tile.querySelector('.playlist-author')?.textContent.toLowerCase() || '';
      const matches = title.includes(query) || description.includes(query) || author.includes(query);
      tile.style.display = matches ? 'block' : 'none';
    });
  }

  if (searchInput) {
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') filterPlaylists();
    });
    if (searchBtn) {
      searchBtn.addEventListener('click', filterPlaylists);
    }
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        searchInput.value = '';
        const allTiles = document.querySelectorAll('.playlist-grid .playlist-tile');
        allTiles.forEach(tile => tile.style.display = 'block');
      });
    }
  }
}


// Run on DOM load
// document.addEventListener('DOMContentLoaded', renderPlaylists);

const modal = document.createElement('div');
modal.id = 'playlist-modal';
modal.style.display = 'none';
modal.innerHTML = `
  <div class="modal-content">
    <span class="close-button">&times;</span>
    <div id="modal-playlist-content"></div>
  </div>
`;
document.body.appendChild(modal);



document.addEventListener('click', (e) => {
  const modal = document.getElementById('playlist-modal');
  if (e.target.classList.contains('close-button') || e.target === modal) {
    modal.style.display = 'none';
  }
});
