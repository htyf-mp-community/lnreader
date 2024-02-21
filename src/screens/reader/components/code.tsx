export const jsCode = `
class Reader {
  constructor() {
    this.percentage =
      showScrollPercentage && document.getElementById('reader-percentage');
    this.paddingTop = parseInt(
      getComputedStyle(document.querySelector('html')).getPropertyValue(
        'padding-top',
      ),
    );
    this.chapter = document.querySelector('chapter');
    this.chapterHeight = this.chapter.scrollHeight + this.paddingTop;
    this.layoutHeight = window.innerHeight;
    this.pluginId = this.chapter.getAttribute('data-plugin-id');
    this.novelId = this.chapter.getAttribute('data-novel-id');
    this.chapterId = this.chapter.getAttribute('data-chapter-id');
    this.saveProgressInterval = setInterval(
      () =>
        this.post({
          type: 'save',
          data: parseInt(
            ((window.scrollY + this.layoutHeight) / this.chapterHeight) * 100,
          ),
        }),
      autoSaveInterval,
    );
  }

  refresh = () => {
    this.chapterHeight = this.chapter.scrollHeight + this.paddingTop;
  };
  post = obj => window.ReactNativeWebView.postMessage(JSON.stringify(obj));
}
class ScrollHandler {
  constructor(reader) {
    this.reader = reader;
    this.$ = document.getElementById('ScrollBar');
    this.$.innerHTML = \`
        <div class="scrollbar-item scrollbar-text d-none" id="scrollbar-percentage">
          0
        </div>
        <div class="scrollbar-item" id="scrollbar-slider">
          <div id="scrollbar-track">
          </div>
          <div id="scrollbar-progress">
            <div id="scrollbar-thumb-wrapper"> 
              <div id="scrollbar-thumb"></div>
            </div>
          </div>
        </div>
        <div class="scrollbar-item scrollbar-text">
          100
        </div>
      \`;
    this.percentage = this.$.querySelector('#scrollbar-percentage');
    this.progress = this.$.querySelector('#scrollbar-progress');
    this.thumb = this.$.querySelector('#scrollbar-thumb-wrapper');
    this.slider = this.$.querySelector('#scrollbar-slider');
    this.sliderHeight = this.slider.clientHeight;
    this.sliderOffsetY = this.slider.offsetTop + this.$.offsetTop;
    this.lock = false;
    this.visible = false; // scrollbar
    window.onscroll = () => !this.lock && this.update();
    this.thumb.ontouchstart = () => (this.lock = true);
    this.thumb.ontouchend = () => (this.lock = false);
    this.thumb.ontouchmove = e => {
      const ratio =
        (e.changedTouches[0].clientY - this.sliderOffsetY) / this.sliderHeight;
      this.update(ratio < 0 ? 0 : ratio);
    };
  }
  update = ratio => {
    if (ratio === undefined) {
      ratio =
        (window.scrollY + this.reader.layoutHeight) / this.reader.chapterHeight;
    }
    if (ratio > 1) {
      ratio = 1;
    }
    const percentage = parseInt(ratio * 100);
    if (this.visible) {
      this.progress.style.height = percentage + '%';
      this.percentage.innerText = percentage;
    }
    if (this.lock) {
      window.scrollTo({
        top: this.reader.chapterHeight * ratio - this.reader.layoutHeight,
        behavior: 'instant',
      });
    }
    if (this.reader.percentage) {
      this.reader.percentage.innerText = percentage + '%';
    }
  };
  refresh = () => {
    this.sliderHeight = this.slider.clientHeight;
    this.sliderOffsetY = this.slider.offsetTop + this.$.offsetTop;
  };
  hide = () => {
    this.$.classList.add('d-none');
    this.visible = false;
  };
  show = () => {
    this.reader.refresh();
    this.visible = true;
    this.$.classList.remove('d-none');
    this.refresh();
    this.update();
  };
}

class SwipeHandler {
  constructor(reader) {
    this.reader = reader;
    this.initialX = null;
    this.initialY = null;
    if (swipeGestures) {
      this.enable();
    }
  }

  touchStartHandler = e => {
    this.initialX = e.changedTouches[0].screenX;
    this.initialY = e.changedTouches[0].screenY;
  };

  touchEndHandler = e => {
    let diffX = e.changedTouches[0].screenX - this.initialX;
    let diffY = e.changedTouches[0].screenY - this.initialY;
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 10) {
      e.preventDefault();
      this.reader.post({ type: diffX < 0 ? 'next' : 'prev' });
    }
  };

  enable = () => {
    document.addEventListener('touchstart', this.touchStartHandler);
    document.addEventListener('touchend', this.touchEndHandler);
  };

  disable = () => {
    document.removeEventListener('touchstart', this.touchStartHandler);
    document.removeEventListener('touchend', this.touchEndHandler);
  };
}

class TextToSpeech {
  constructor(reader) {
    this.reader = reader;
    this.elements = this.reader.chapter.querySelectorAll('t-t-s');
    this.previous = null;
  }
  play = index => {
    if (index >= 0 && index < this.elements.length) {
      if (this.previous !== null) {
        this.unhighlight(this.previous);
      }
      this.highlight(index);
      this.previous = index;
    }
  };

  highlight = index => {
    if (index >= 0 && index < this.elements.length) {
      this.elements[index].classList.add('tts-highlight');
    }
  };

  unhighlight = index => {
    if (index >= 0 && index < this.elements.length) {
      this.elements[index].classList.remove('tts-highlight');
    }
  };
}

var reader = new Reader();
var scrollHandler = new ScrollHandler(reader);
var swipeHandler = new SwipeHandler(reader);
var tts = new TextToSpeech(reader);

`

export const cssCode = `
html {
  scroll-behavior: smooth;
  overflow-x: hidden;
  padding-top: var(--StatusBar-currentHeight);
  word-wrap: break-word;
}

body {
  padding-left: var(--readerSettings-padding);
  padding-right: var(--readerSettings-padding);
  padding-bottom: 40px;

  font-size: var(--readerSettings-textSize);
  color: var(--readerSettings-textColor);
  text-align: var(--readerSettings-textAlign);
  line-height: var(--readerSettings-lineHeight);
  font-family: var(--readerSettings-fontFamily);
}

chapter {
  display: block;
}

hr {
  margin-top: 20px;
  margin-bottom: 20px;
}

a {
  color: var(--theme-primary);
}

img {
  display: block;
  width: auto;
  height: auto;
  max-width: 100%;
}

.nextButton,
.infoText {
  width: 100%;
  border-radius: 50px;
  border-width: 1;
  color: var(--theme-onPrimary);
  background-color: var(--theme-primary);
  font-family: var(--readerSettings-fontFamily);
  font-size: 16px;
  border-width: 0;
}

.nextButton {
  min-height: 40px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  padding: 0 16px;
}

.infoText {
  background-color: transparent;
  text-align: center;
  border: none;
  margin: 0px;
  color: inherit;
  padding-top: 16px;
  padding-bottom: 16px;
}

.chapterCtn {
  min-height: var(--chapterCtn-height);
  margin-bottom: auto;
}

.d-none {
  display: none;
}

#ScrollBar {
  position: fixed;
  right: 5vw;
  top: 27.5vh;
  height: 45vh;
  width: 2.4rem;
  border-radius: 1.2rem;
  background-color: var(--theme-surface-0-9);
  touch-action: none;
  font-size: 16;
}

.scrollbar-item {
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--theme-onSurface);
}

.scrollbar-item.scrollbar-text {
  height: 12.5%;
}

.scrollbar-item#scrollbar-slider {
  height: 75%;
  align-items: unset;
}

#scrollbar-track {
  width: 0.1rem;
  height: 100%;
  background-color: var(--theme-outline);
}

#scrollbar-progress {
  width: 0.1rem;
  height: 0;
  background-color: var(--theme-primary);
  transform: translateX(-0.1rem);
}

#scrollbar-thumb-wrapper {
  position: relative;
  top: 100%;
  height: 2rem;
  width: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: translate(-0.95rem, -1rem);
}

#scrollbar-thumb {
  top: 100%;
  height: 1rem;
  width: 1rem;
  border-radius: 100%;
  background-color: var(--theme-primary);
}

#reader-percentage {
  position: fixed;
  padding-top: 0.5rem;
  min-height: 2rem;
  width: 100%;
  background-color: var(--readerSettings-theme);
  color: var(--readerSettings-textColor);
  bottom: 0;
  left: 0;
  right: 0;
  font-size: 1rem;
  text-align: center;
}

t-t-s.tts-highlight {
  color: var(--theme-onSecondary);
  background-color: var(--theme-secondary);
}

`