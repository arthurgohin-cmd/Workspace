import * as THREE from './vendor/three.module.min.js';

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

gsap.registerPlugin(ScrollTrigger);

/* ============================================================
   Preloader
============================================================ */
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  setTimeout(() => preloader.classList.add('is-hidden'), 500);
});

/* ============================================================
   Nav: solid on scroll + mobile menu
============================================================ */
const nav = document.getElementById('nav');
const navBurger = document.getElementById('navBurger');
const navMobile = document.getElementById('navMobile');

ScrollTrigger.create({
  start: 60,
  onUpdate: (self) => nav.classList.toggle('nav--solid', self.scroll() > 60),
});

navBurger.addEventListener('click', () => navMobile.classList.toggle('is-open'));
navMobile.querySelectorAll('a').forEach((a) =>
  a.addEventListener('click', () => navMobile.classList.remove('is-open'))
);

/* ============================================================
   Hero reveal
============================================================ */
gsap.to('.hero .reveal-line', {
  opacity: 1,
  y: 0,
  duration: 1.1,
  ease: 'power3.out',
  stagger: 0.12,
  delay: 0.6,
});

/* ============================================================
   Three.js hero scene — abstract architectural wireframe
============================================================ */
const canvas = document.getElementById('hero-canvas');
const hero = document.querySelector('.hero');

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, hero.clientWidth / hero.clientHeight, 0.1, 100);
camera.position.set(0, 1.4, 9);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(hero.clientWidth, hero.clientHeight);

const bronze = 0xd9bd8d;
const structure = new THREE.Group();
scene.add(structure);

// Layered "building" volumes made of edge-only wireframes
const volumeDefs = [
  { w: 3.2, h: 4.4, d: 2.2, x: -1.6, y: -0.2, z: 0, o: 0.55 },
  { w: 2.0, h: 2.6, d: 2.0, x: 1.6, y: -1.1, z: 0.8, o: 0.35 },
  { w: 1.3, h: 5.6, d: 1.3, x: 2.6, y: 0.6, z: -1.4, o: 0.4 },
];
volumeDefs.forEach((v) => {
  const geo = new THREE.BoxGeometry(v.w, v.h, v.d);
  const edges = new THREE.EdgesGeometry(geo);
  const mat = new THREE.LineBasicMaterial({ color: bronze, transparent: true, opacity: v.o });
  const line = new THREE.LineSegments(edges, mat);
  line.position.set(v.x, v.y, v.z);
  structure.add(line);
});

// Floor grid / horizon plane
const grid = new THREE.GridHelper(30, 30, 0x2a3140, 0x1a1f27);
grid.position.y = -2.6;
scene.add(grid);

// Particle field
const particleCount = window.innerWidth < 700 ? 220 : 500;
const positions = new Float32Array(particleCount * 3);
for (let i = 0; i < particleCount; i++) {
  positions[i * 3] = (Math.random() - 0.5) * 26;
  positions[i * 3 + 1] = Math.random() * 10 - 2;
  positions[i * 3 + 2] = (Math.random() - 0.5) * 20 - 4;
}
const particleGeo = new THREE.BufferGeometry();
particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
const particleMat = new THREE.PointsMaterial({ color: 0xf6f3ec, size: 0.02, transparent: true, opacity: 0.5 });
const particles = new THREE.Points(particleGeo, particleMat);
scene.add(particles);

let mouseX = 0, mouseY = 0;
window.addEventListener('mousemove', (e) => {
  mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
  mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
});

let heroVisible = true;
const heroObserver = new IntersectionObserver(
  ([entry]) => (heroVisible = entry.isIntersecting),
  { threshold: 0 }
);
heroObserver.observe(hero);

const clock = new THREE.Clock();
function animate() {
  requestAnimationFrame(animate);
  if (!heroVisible) return;
  const t = clock.getElapsedTime();

  structure.rotation.y = t * 0.05 + mouseX * 0.15;
  structure.rotation.x = mouseY * 0.05;
  particles.rotation.y = t * 0.01;

  camera.position.x += (mouseX * 0.6 - camera.position.x) * 0.02;
  camera.position.y += (1.4 - mouseY * 0.3 - camera.position.y) * 0.02;
  camera.lookAt(0, 0, 0);

  renderer.render(scene, camera);
}
if (!reduceMotion) animate();
else {
  renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
  camera.aspect = hero.clientWidth / hero.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(hero.clientWidth, hero.clientHeight);
});

// Fade hero canvas as user scrolls into the walkthrough
gsap.to('#hero-canvas', {
  opacity: 0.15,
  scrollTrigger: {
    trigger: '.hero',
    start: 'top top',
    end: 'bottom top',
    scrub: true,
  },
});

/* ============================================================
   Walkthrough — pinned scroll "visite"
============================================================ */
const frames = gsap.utils.toArray('.walk__frame');
const dots = gsap.utils.toArray('.walk__progress i');

ScrollTrigger.create({
  trigger: '.walk',
  start: 'top top',
  end: 'bottom bottom',
  onUpdate: (self) => {
    const idx = Math.min(frames.length - 1, Math.max(0, Math.floor(self.progress * frames.length)));
    frames.forEach((f, i) => f.classList.toggle('is-active', i === idx));
    dots.forEach((d, i) => d.classList.toggle('is-active', i === idx));
  },
});

/* ============================================================
   Stats count-up
============================================================ */
document.querySelectorAll('.stats__num').forEach((el) => {
  const target = parseInt(el.dataset.count, 10);
  ScrollTrigger.create({
    trigger: el,
    start: 'top 85%',
    once: true,
    onEnter: () => {
      const obj = { val: 0 };
      gsap.to(obj, {
        val: target,
        duration: 1.8,
        ease: 'power2.out',
        onUpdate: () => (el.textContent = Math.floor(obj.val).toLocaleString('fr-FR')),
      });
    },
  });
});

/* ============================================================
   Section reveals (fade/slide up on scroll)
============================================================ */
gsap.utils.toArray('.section-head, .card, .process__item, .about__media, .about__content').forEach((el) => {
  gsap.fromTo(
    el,
    { opacity: 0, y: 36 },
    {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%' },
    }
  );
});

/* ============================================================
   Card 3D tilt
============================================================ */
document.querySelectorAll('.card').forEach((card) => {
  card.addEventListener('mousemove', (e) => {
    const r = card.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    gsap.to(card, {
      rotateY: px * 10,
      rotateX: py * -10,
      duration: 0.4,
      ease: 'power2.out',
      transformPerspective: 800,
    });
  });
  card.addEventListener('mouseleave', () => {
    gsap.to(card, { rotateY: 0, rotateX: 0, duration: 0.6, ease: 'power3.out' });
  });
});

/* ============================================================
   Contact form (no backend — demo submission)
============================================================ */
const form = document.getElementById('contactForm');
const note = document.getElementById('formNote');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  note.textContent = 'Merci, votre message a bien été envoyé. Nous revenons vers vous sous 24 à 48h.';
  form.reset();
});
