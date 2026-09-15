import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CustomEase } from 'gsap/CustomEase';
import { registerEases } from './tokens';
import { initLenis } from './lenis';
import { initHeader, initMobileNav } from './header';
import { initHero } from './hero';
import { initReveal } from './reveal';
import { initCounters } from './counters';
import { initParallax } from './parallax';
import { initProcess } from './process';
import { initCarousels } from './carousel';
import { initVideo } from './video';
import { initAccordions } from './accordion';
import { initQuoteForm } from './form';

// Plugins are registered once, here, for the whole site.
gsap.registerPlugin(ScrollTrigger, CustomEase);
ScrollTrigger.config({ ignoreMobileResize: true });
registerEases();

// Mirrors the class set inline in Layout.astro before first paint.
const story = document.documentElement.classList.contains('motion-ok');
const lenis = story ? initLenis() : null;

initHeader({ lenis, story });
initMobileNav({ lenis, story });
initHero({ lenis, story });
initReveal({ story });
initCounters({ story });
initParallax({ story });
initProcess({ story });
initCarousels({ story });
initVideo();
initAccordions();
initQuoteForm();
