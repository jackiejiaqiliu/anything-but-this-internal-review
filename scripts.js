// =============================
// CUSTOM CURSOR (FIXED)
// =============================

const cursor = document.querySelector('.cursor__ball');

function clamp(value, min, max) {
  return Math.max(min, Math.min(value, max));
}

function restoreCursorPosition() {
  const storedPosition = JSON.parse(localStorage.getItem('cursorPosition'));
  if (storedPosition) {
    const { x, y } = storedPosition;
    gsap.set(cursor, { x: x - 20, y: y - 20 });
  } else {
    gsap.set(cursor, { x: window.innerWidth / 2 - 20, y: window.innerHeight / 2 - 20 });
  }
  cursor.style.display = 'block';
  gsap.to(cursor, { opacity: 1, duration: 0.2 });
}

function saveCursorPosition(x, y) {
  localStorage.setItem('cursorPosition', JSON.stringify({ x, y }));
}

document.addEventListener('DOMContentLoaded', () => {
  restoreCursorPosition();
});

document.body.addEventListener('mousemove', (e) => {
  const x = clamp(e.clientX, 0, window.innerWidth);
  const y = clamp(e.clientY, 0, window.innerHeight);
  gsap.to(cursor, { x: x - 20, y: y - 20, duration: 0.3 });
  saveCursorPosition(x, y);
});

document.body.addEventListener('mouseleave', () => {
  gsap.to(cursor, { opacity: 0, duration: 0.15 });
});

document.body.addEventListener('mouseenter', (e) => {
  const x = clamp(e.clientX, 0, window.innerWidth);
  const y = clamp(e.clientY, 0, window.innerHeight);
  gsap.to(cursor, { opacity: 1, x: x - 20, y: y - 20, duration: 0.15 });
});

document.querySelectorAll("a").forEach((el) => {
  el.addEventListener("mouseenter", () => {
    gsap.to(cursor, { scale: 0.6, duration: 0.2 });
  });
  el.addEventListener("mouseleave", () => {
    gsap.to(cursor, { scale: 1, duration: 0.2 });
  });
});

// =============================
// HIDE CURSOR WHEN ENTERING IFRAME
// =============================
const iframe = document.querySelector('iframe');

if (iframe) {
  iframe.addEventListener('mouseenter', () => {
    gsap.to(cursor, { opacity: 0, duration: 0.2 });
  });

  iframe.addEventListener('mouseleave', () => {
    gsap.to(cursor, { opacity: 1, duration: 0.2 });
  });
}

// =============================
// TWO COLUMNS SCROLLING
// =============================
window.addEventListener('load', function() {
  const left = document.querySelector('.left');
  const right = document.querySelector('.right');
  const container = document.querySelector('.two-columns');
  const header = document.querySelector('header');
  
  if (!left || !right || !container) return;
  
  const headerHeight = header ? header.offsetHeight : 0;
  const leftHeight = left.scrollHeight;
  const rightHeight = right.scrollHeight;
  
  let shorter, longer;
  if (leftHeight < rightHeight) {
    shorter = left;
    longer = right;
  } else {
    shorter = right;
    longer = left;
  }
  
  container.style.minHeight = Math.max(leftHeight, rightHeight) + 'px';
  shorter.style.position = 'sticky';
  shorter.style.top = headerHeight + 'px';
  shorter.style.alignSelf = 'start';
});

// =============================
// ABOUT / LIST VIEW TRANSITIONS
// =============================
document.addEventListener('DOMContentLoaded', function () {
  const aboutBtn = document.getElementById('aboutBtn');
  const listViewBtn = document.getElementById('listViewBtn');
  const logoContainer = document.querySelector('.logo-container');
  const aboutContent = document.querySelector('.about-content');
  const listViewContent = document.querySelector('.list-view-content');
  const indexMain = document.querySelector('.index-main');
  const indexBody = document.body;

  if (!aboutBtn || !listViewBtn || !logoContainer) return;

  let isAboutOpen = false;
  let isListViewOpen = false;

  // About button
  aboutBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (isListViewOpen) {
      closeListView();
      setTimeout(() => openAbout(), 400);
    } else if (!isAboutOpen) openAbout();
    else closeAbout();
  });

  // List button
  listViewBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (isAboutOpen) {
      closeAbout();
      setTimeout(() => openListView(), 400);
    } else if (!isListViewOpen) openListView();
    else closeListView();
  });

  function openAbout() {
    isAboutOpen = true;
    indexMain.classList.add('about-open');
    
    if (listViewBtn)
      gsap.to(listViewBtn, { opacity: 0, duration: 0.3, onComplete: () => listViewBtn.classList.add('hidden') });
    aboutBtn.textContent = 'back';

    requestAnimationFrame(() => {
      const rect = logoContainer.getBoundingClientRect();
      const centerY = rect.top + rect.height / 2;
      const isMobile = window.matchMedia("(max-width: 865px)").matches;
      const targetY = isMobile ? 100 : 150; // Lower target for desktop to avoid header overlap

      const translateY = targetY - centerY;
      const targetScale = isMobile ? 0.8 : 0.5;

      gsap.to(logoContainer, {
        scale: targetScale,
        y: translateY,
        duration: 1,
        ease: "power3.inOut",
      });
    });

    if (aboutContent) {
      gsap.to(aboutContent, {
        opacity: 1,
        duration: 0.6,
        delay: 0.6,
        onStart: () => {
          aboutContent.style.pointerEvents = 'auto';
          // Check if content needs scrolling and switch footer
          setTimeout(() => {
            const contentBottom = aboutContent.getBoundingClientRect().bottom;
            const windowHeight = window.innerHeight;
            if (contentBottom > windowHeight - 50) {
              indexBody.classList.add('scrollable');
            }
          }, 100);
        },
      });
    }
  }

  function closeAbout() {
    isAboutOpen = false;
    indexMain.classList.remove('about-open');
    indexBody.classList.remove('scrollable');
    
    aboutBtn.textContent = 'about';
    if (aboutContent)
      gsap.to(aboutContent, {
        opacity: 0,
        duration: 0.4,
        onComplete: () => (aboutContent.style.pointerEvents = 'none'),
      });
    gsap.to(logoContainer, { 
      scale: 1, 
      y: 0, 
      duration: 1, 
      delay: 0.2, 
      ease: 'power3.inOut',
      clearProps: 'transform' // Clear inline transform after animation
    });
    if (listViewBtn) {
      listViewBtn.classList.remove('hidden');
      gsap.to(listViewBtn, { opacity: 1, duration: 0.3, delay: 0.6 });
    }
  }

  function openListView() {
    isListViewOpen = true;
    indexMain.classList.add('list-open');
    
    if (aboutBtn)
      gsap.to(aboutBtn, { opacity: 0, duration: 0.3, onComplete: () => aboutBtn.classList.add('hidden') });
    listViewBtn.textContent = 'back';

    requestAnimationFrame(() => {
      const rect = logoContainer.getBoundingClientRect();
      const centerY = rect.top + rect.height / 2;
      const isMobile = window.matchMedia('(max-width: 865px)').matches;
      const targetY = isMobile ? 100 : 150; // Lower target for desktop to avoid header overlap
      const translateY = targetY - centerY;
      const targetScale = isMobile ? 0.8 : 0.5;

      gsap.to(logoContainer, {
        scale: targetScale,
        y: translateY,
        duration: 1,
        ease: 'power3.inOut',
      });
    });

    if (listViewContent) {
      gsap.to(listViewContent, {
        opacity: 1,
        duration: 0.6,
        delay: 0.6,
        onStart: () => {
          listViewContent.style.pointerEvents = 'auto';
          // Check if content needs scrolling and switch footer
          setTimeout(() => {
            const contentBottom = listViewContent.getBoundingClientRect().bottom;
            const windowHeight = window.innerHeight;
            if (contentBottom > windowHeight - 50) {
              indexBody.classList.add('scrollable');
            }
          }, 100);
        },
      });
    }
  }

  function closeListView() {
    isListViewOpen = false;
    indexMain.classList.remove('list-open');
    indexBody.classList.remove('scrollable');
    
    listViewBtn.textContent = 'artworks';
    if (listViewContent)
      gsap.to(listViewContent, {
        opacity: 0,
        duration: 0.4,
        onComplete: () => (listViewContent.style.pointerEvents = 'none'),
      });
    gsap.to(logoContainer, { 
      scale: 1, 
      y: 0, 
      duration: 1, 
      delay: 0.2, 
      ease: 'power3.inOut',
      clearProps: 'transform' // Clear inline transform after animation
    });
    if (aboutBtn) {
      aboutBtn.classList.remove('hidden');
      gsap.to(aboutBtn, { opacity: 1, duration: 0.3, delay: 0.6 });
    }
  }
});