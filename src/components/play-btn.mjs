import './play-btn.css';

export default class PlayBtn extends HTMLElement {

  #audio;

  constructor() {
    super();
  }

  connectedCallback() {
    // create shadow dom root
    // this._root = this.attachShadow({mode: 'open'});
    this.render();
  }

  disconnectedCallback() {

  }

  render() {
    if (!this.isConnected) return;
    const progress = this.getAttribute('progress') || 1.0;
    this.innerHTML = `
    <svg class="play-btn__svg" 
        viewBox="0 0 25 25"
        width="100%" 
        height="100%" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg">
      <circle 
        class="play-btn__bgr" 
        cx="12.5" 
        cy="12.5" 
        r="11.5" 
        progress="${progress}"
        style="stroke-dashoffset: ${72 - 72 * progress}" />
      <path class="play-btn__play" d="M19 12.5L9 18L9 7L19 12.5Z"/>
      <g class="play-btn__pause">
        <rect x="9" y="7" width="2" height="11" />
        <rect x="14" y="7" width="2" height="11" />
      </g>
    </svg>
    `;

    this.addEventListener("click", this._onClicked)
  }

  _onClicked(e) {
    if (this.hasAttribute('playing') || this.hasAttribute('loading')) {
      this.pause();
    } else {
      this.play();
    }
  }

  play() {
    if (!this.#audio) {
      this.#audio = new Audio(this.getAttribute('src'));
      this.#audio.addEventListener('playing', (e) => this._onPlayBackEvent(e));
      this.#audio.addEventListener('error', (e) => this._onPlayBackEvent(e));
      this.#audio.addEventListener('pause', (e) => this._onPlayBackEvent(e));
      this.#audio.addEventListener('timeupdate', (e) => this._onTimeUpdate(e));
      this.toggleAttribute('loading', true);
    }
    this.#audio.play();
  }

  pause() {
    if (this.#audio) {
      this.#audio.pause();
    }
  }

  _onPlayBackEvent(e) {
    this.toggleAttribute('playing', false);
    this.toggleAttribute('loading', false);
    this.toggleAttribute('errored', false);
    switch (e.type) {
      case 'playing':
        return this.toggleAttribute('playing', true);
      case 'error':
        return this.toggleAttribute('errored', true);
      case 'pause':
        return;
    }
  }

  _onTimeUpdate(e) {
    // add extra frames to updates
    for (let i = 0; i < 10; i++) {
      setTimeout(() => {
        const progress = this.#audio.currentTime / this.#audio.duration;
        this.setAttribute('progress', progress.toString());
      }, 50 * i)
    }
  }

  static get observedAttributes() {
    return ['progress'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue && this.isConnected) {
      if (name === 'progress') {
        // propagate attribute to inner svg elements
        const circle = this.querySelector('circle.play-btn__bgr');
        if (circle != null) {
          circle.style.strokeDashoffset = (72 - 72 * newValue).toString();
        }
      }
    }
  }
}
