/** Swaps a [data-video] poster for an inline player when its play button is pressed. Nothing autoplays on load. */
export function initVideo(): void {
  document.querySelectorAll<HTMLElement>('[data-video]').forEach((frame) => {
    const src = frame.dataset.video;
    const button = frame.querySelector<HTMLButtonElement>('[data-video-play]');
    if (!src || !button) return;

    button.addEventListener('click', () => {
      const video = document.createElement('video');
      video.className = 'video__player';
      video.src = src;
      video.controls = true;
      video.playsInline = true;
      video.setAttribute('aria-label', button.getAttribute('aria-label') ?? 'Video');

      frame.append(video);
      frame.classList.add('is-playing');
      video.focus();
      void video.play().catch(() => {
        // Playback blocked: the native controls stay available.
      });
    });
  });
}
