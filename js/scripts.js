// Exemple : Ajoutez ici votre code JavaScript personnalisé
let bipAudio = null;

document.addEventListener("DOMContentLoaded", function () {
  // Bouton DIRECT principal
  const directBtn = document.querySelector('.btn-direct-volume');
  if (directBtn) {
    const icon = directBtn.querySelector('i');
    directBtn.addEventListener('click', function () {
      if (bipAudio && !bipAudio.paused) {
        bipAudio.pause();
        bipAudio.currentTime = 0;
        bipAudio = null;
        directBtn.classList.remove('playing');
        if (icon) icon.className = 'fas fa-play';
        // Synchronise l'autre bouton si besoin
        updateFooterBtn(false);
        return;
      }
      bipAudio = new Audio('https://ice.creacast.com/bipradio');
      if (volumeSlider) bipAudio.volume = parseFloat(volumeSlider.value);
      bipAudio.play().then(() => {
        directBtn.classList.add('playing');
        if (icon) icon.className = 'fas fa-pause';
        updateFooterBtn(true);
      }).catch(console.error);

      bipAudio.addEventListener('ended', () => {
        directBtn.classList.remove('playing');
        if (icon) icon.className = 'fas fa-play';
        updateFooterBtn(false);
        bipAudio = null;
      });
      bipAudio.addEventListener('pause', () => {
        directBtn.classList.remove('playing');
        if (icon) icon.className = 'fas fa-play';
        updateFooterBtn(false);
      });
    });
  }

  // Bouton play du lecteur audio en pied de page
  const footerBtn = document.querySelector('.btn-direct-footer');
  if (footerBtn) {
    const icon = footerBtn.querySelector('i');
    footerBtn.addEventListener('click', function () {
      if (bipAudio && !bipAudio.paused) {
        bipAudio.pause();
        bipAudio.currentTime = 0;
        bipAudio = null;
        footerBtn.classList.remove('playing');
        if (icon) icon.className = 'fas fa-play';
        // Synchronise l'autre bouton si besoin
        updateDirectBtn(false);
        return;
      }
      bipAudio = new Audio('https://ice.creacast.com/bipradio');
      if (volumeSlider) bipAudio.volume = parseFloat(volumeSlider.value);
      bipAudio.play().then(() => {
        footerBtn.classList.add('playing');
        if (icon) icon.className = 'fas fa-pause';
        updateDirectBtn(true);
      }).catch(console.error);

      bipAudio.addEventListener('ended', () => {
        footerBtn.classList.remove('playing');
        if (icon) icon.className = 'fas fa-play';
        updateDirectBtn(false);
        bipAudio = null;
      });
      bipAudio.addEventListener('pause', () => {
        footerBtn.classList.remove('playing');
        if (icon) icon.className = 'fas fa-play';
        updateDirectBtn(false);
      });
    });
  }

  // Récupère le slider
  const volumeSlider = document.getElementById('volume-slider');

  // Quand le slider change, ajuste le volume du flux direct
  if (volumeSlider) {
    volumeSlider.addEventListener('input', function () {
      if (bipAudio) {
        bipAudio.volume = parseFloat(this.value);
        savePlayerState(!bipAudio.paused, bipAudio.volume);
      }
    });
  }

  // Synchronise le slider avec le volume courant à la lecture
  function syncVolumeSlider() {
    if (volumeSlider && window.bipAudio) {
      volumeSlider.value = window.bipAudio.volume;
    }
  }

  // Quand tu crées bipAudio (au clic sur play), ajoute :
  // bipAudio = new Audio('https://ice.creacast.com/bipradio');
  // bipAudio.volume = parseFloat(volumeSlider.value); // Ajoute cette ligne juste après la création
  // bipAudio.play()...

  // Exemple d'intégration dans ton bouton play :
  /*
  bipAudio = new Audio('https://ice.creacast.com/bipradio');
  bipAudio.volume = parseFloat(volumeSlider.value);
  bipAudio.play().then(() => {
    // ...
  });
  */

  // Si tu veux que le slider se mette à jour si le volume change ailleurs :
  // bipAudio.addEventListener('volumechange', syncVolumeSlider);
  if (volumeSlider) {
    bipAudio.addEventListener('volumechange', function () {
      volumeSlider.value = bipAudio.volume;
    });
  }

  // Synchronisation des deux boutons
  function updateFooterBtn(isPlaying) {
    const btn = document.querySelector('.btn-direct-footer');
    if (!btn) return;
    const icon = btn.querySelector('i');
    if (isPlaying) {
      btn.classList.add('playing');
      if (icon) icon.className = 'fas fa-pause';
    } else {
      btn.classList.remove('playing');
      if (icon) icon.className = 'fas fa-play';
    }
  }
  function updateDirectBtn(isPlaying) {
    const btn = document.querySelector('.btn-direct-volume');
    if (!btn) return;
    const icon = btn.querySelector('i');
    if (isPlaying) {
      btn.classList.add('playing');
      if (icon) icon.className = 'fas fa-pause';
    } else {
      btn.classList.remove('playing');
      if (icon) icon.className = 'fas fa-play';
    }
  }

  // Sauvegarde l'état de lecture et le volume dans localStorage
  function savePlayerState(isPlaying, volume) {
    localStorage.setItem('bip_isPlaying', isPlaying ? '1' : '0');
    localStorage.setItem('bip_volume', volume);
  }

  // Récupère l'état de lecture et le volume
  function getPlayerState() {
    return {
      isPlaying: localStorage.getItem('bip_isPlaying') === '1',
      volume: parseFloat(localStorage.getItem('bip_volume') || '1')
    };
  }

  const playerState = getPlayerState();
  if (playerState.isPlaying) {
    // Prépare l'audio mais ne lance pas play() tout de suite
    bipAudio = new Audio('https://ice.creacast.com/bipradio');
    bipAudio.volume = playerState.volume;
    if (volumeSlider) volumeSlider.value = playerState.volume;

    // Option 1 : Démarre la lecture dès la première interaction utilisateur
    const resumePlayback = () => {
      if (bipAudio.paused) {
        bipAudio.play().catch(() => {});
      }
      document.removeEventListener('click', resumePlayback);
    };
    document.addEventListener('click', resumePlayback);
  }
});

// Redirige vers derniers-episodes.html si on clique sur "Émissions" (hors menu déroulant)
document.getElementById('emissionsDropdown').addEventListener('click', function(e) {
  // Si le menu est déjà ouvert, ne pas rediriger (laisser le dropdown fonctionner)
  const parent = this.closest('.dropdown');
  const menu = parent ? parent.querySelector('.dropdown-menu') : null;
  const isMenuShown = menu && menu.classList.contains('show');
  if (!isMenuShown) {
    window.location.href = 'derniers-episodes.html';
  }
  // Sinon, laisser le dropdown fonctionner normalement
});