document.addEventListener('DOMContentLoaded', () => {
    const video      = document.getElementById('hero-video');
    const muteBtn    = document.getElementById('mute-btn');
    const playBtn    = document.getElementById('play-pause-btn');
    const changeBtn  = document.getElementById('change-video-btn');
    const fileInput  = document.getElementById('local-video-input');
    muteBtn.addEventListener('click', () => {
        video.muted = !video.muted;
        muteBtn.textContent = video.muted ? '🔇' : '🔊';
    });
    const updatePlayUI = (isPlaying) => {
        playBtn.textContent = isPlaying ? '⏸️' : '▶️';
    };
    playBtn.addEventListener('click', () => {
        if (video.paused) {
            video.play();
        } else {
            video.pause();
        }
    });
    video.addEventListener('play',  () => updatePlayUI(true));
    video.addEventListener('pause', () => updatePlayUI(false));
    changeBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            video.src = url;
            video.muted = false;
            muteBtn.textContent = '🔊';
            video.play().catch(()=>{});
        }
    });
    const progressFill = document.getElementById('progress-fill');
    video.addEventListener('timeupdate', () => {
        if (video.duration) {
            const percent = (video.currentTime / video.duration) * 100;
            progressFill.style.width = `${percent}%`;
        }
    });
    video.addEventListener('error', (e) => {
        console.error('خطأ في تحميل الفيديو:', e);
        alert('الملف غير متاح أو غير مدعوم. يرجى اختيار ملف آخر.');
    });
});
const userData = JSON.parse(localStorage.getItem('userData'));
if (userData) {
  console.log('الاسم:', userData.name);
  console.log('الإيميل:', userData.email);
  console.log('الهاتف:', userData.phone);
  console.log('العمر:', userData.age);
  console.log('المدينة:', userData.city);
}