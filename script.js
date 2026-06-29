(function () {

  emailjs.init("u7Xtphk5XPAzBXwJc");

  const form = document.getElementById("form-message");
  const status = document.getElementById("status");

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      status.innerHTML = "⏳ Sending...";
      status.style.color = "blue";

      emailjs.sendForm("service_r0q5hie", "template_42wimb8", form).then(
        () => {
          status.innerHTML = "✅ Message sent successfully!";
          status.style.color = "green";
          form.reset();
          setTimeout(() => { status.innerHTML = ""; }, 3000);
        },
        (err) => {
          status.innerHTML = "❌ Failed to send message. Please try again.";
          status.style.color = "red";
          console.error("EmailJS Error:", err);
        }
      );
    });
  }

  const header = document.querySelector("header");
  const navElement = document.querySelector("header nav");

  if (header) {
    window.addEventListener("scroll", () => {
      header.classList.toggle("scrolled", window.scrollY > 50);
    });

    // Sinisiguro nitong mapipili lahat ng hamburger buttons (maging sa desktop o bagong mobile view)
    const toggleBtns = document.querySelectorAll(".mobile-menu-toggle");

    toggleBtns.forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (navElement) {
          navElement.classList.toggle("active");
          console.log("Hamburger menu clicked! Active state:", navElement.classList.contains("active")); 
        } else {
          console.error("Error: Hindi mahanap ang 'header nav' element sa iyong HTML.");
        }
      });
    }); 

    if (navElement) {
      const mobileLinks = navElement.querySelectorAll("ul.nav-links li a");
      mobileLinks.forEach(link => {
        link.addEventListener("click", () => {
          navElement.classList.remove("active");
        });
      });
    }

    document.addEventListener("click", (e) => {
      if (navElement && !header.contains(e.target)) {
        navElement.classList.remove("active");
      }
    });
  }

  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll("header nav ul.nav-links li a");

  function highlightNav() {
    const scrollY = window.scrollY;
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute("id");
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove("active-nav");
          if (link.getAttribute("href") === `#${sectionId}`) {
            link.classList.add("active-nav");
          }
        });
      }
    });
  }

  window.addEventListener("scroll", () => { requestAnimationFrame(highlightNav); });
  highlightNav();

  navLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (href && href.startsWith("#")) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  const zoomableImages = document.querySelectorAll("img[data-zoomable]");
  if (zoomableImages.length > 0) {
    const modal = document.createElement("div");
    modal.className = "img-modal";
    const modalImg = document.createElement("img");
    const closeBtn = document.createElement("span");
    closeBtn.className = "close";
    closeBtn.innerHTML = "&times;";
    modal.appendChild(closeBtn);
    modal.appendChild(modalImg);
    document.body.appendChild(modal);

    zoomableImages.forEach((img) => {
      img.style.cursor = "zoom-in";
      img.addEventListener("click", () => {
        modalImg.src = img.src;
        modal.classList.add("show");
      });
    });

    function closeModal() { modal.classList.remove("show"); }
    closeBtn.addEventListener("click", closeModal);
    modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });
    window.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });
  }

  document.querySelectorAll(".cert-prev, .cert-next").forEach(btn => {
    btn.addEventListener("click", () => {
      const targetId = btn.getAttribute("data-target");
      const container = targetId
        ? document.getElementById(targetId)
        : document.querySelector(".certificates");
      if (!container) return;
      const scrollAmount = 360;
      if (btn.classList.contains("cert-next")) {
        container.scrollBy({ left: scrollAmount, behavior: "smooth" });
      } else {
        container.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      }
    });
  });

  const filmTrack = document.getElementById("filmstripTrack");
  const filmNext = document.getElementById("film-next");
  const filmPrev = document.getElementById("film-prev");
  const filmHint = document.querySelector(".filmstrip-hint");

  if (filmTrack) {
    const frames = Array.from(filmTrack.querySelectorAll(".film-frame"));
    let currentIndex = 0;

    function setActiveImage(index) {
      currentIndex = index;
      frames.forEach(f => f.classList.remove("active"));
      frames[currentIndex].classList.add("active");

      const targetImg = frames[currentIndex].querySelector("img");
      if (targetImg && filmHint) {
        filmHint.innerHTML = targetImg.getAttribute("data-caption") || "";
      }

      const frameWidth = frames[0].offsetWidth;
      const gap = 12;
      const scrollPosition =
        frames[currentIndex].offsetLeft -
        filmTrack.offsetWidth / 2 +
        (frameWidth + gap) / 2;

      filmTrack.scrollTo({ left: scrollPosition, behavior: "smooth" });
    }

    if (filmNext) filmNext.addEventListener("click", () => setActiveImage((currentIndex + 1) % frames.length));
    if (filmPrev) filmPrev.addEventListener("click", () => setActiveImage((currentIndex - 1 + frames.length) % frames.length));
    frames.forEach((frame, index) => frame.addEventListener("click", () => setActiveImage(index)));

    let autoPlay = setInterval(() => setActiveImage((currentIndex + 1) % frames.length), 3000);

    [filmNext, filmPrev, ...frames].forEach(el => {
      if (!el) return;
      el.addEventListener("click", () => {
        clearInterval(autoPlay);
        autoPlay = setInterval(() => setActiveImage((currentIndex + 1) % frames.length), 6000);
      });
    });

    setTimeout(() => setActiveImage(0), 100);
  }

  function createObserver(callback, options = {}) {
    return new IntersectionObserver(callback, {
      threshold: options.threshold || 0.15,
      rootMargin: options.rootMargin || "0px 0px -60px 0px"
    });
  }

  const projectCards = document.querySelectorAll(".project");
  projectCards.forEach((card, i) => {
    const fromLeft = i % 2 === 0;
    card.style.cssText += `
      opacity: 0;
      transform: perspective(800px) rotateY(${fromLeft ? "-25deg" : "25deg"}) translateY(60px) scale(0.92);
      transition: opacity 0.5s cubic-bezier(0.22,1,0.36,1) ${i * 80}ms,
                  transform 0.5s cubic-bezier(0.22,1,0.36,1) ${i * 80}ms;
      will-change: transform, opacity;
    `;
  });

  createObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "perspective(800px) rotateY(0deg) translateY(0) scale(1)";
      }
    });
  }, { threshold: 0.12 }).observe
    ? projectCards.forEach(card => {
        createObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.style.opacity = "1";
              entry.target.style.transform = "perspective(800px) rotateY(0deg) translateY(0) scale(1)";
            }
          });
        }, { threshold: 0.12 }).observe(card);
      })
    : null;

  const heroH3 = document.querySelector(".hero-text h3");
  if (heroH3) {
    const originalText = heroH3.textContent.trim();
    heroH3.textContent = "";
    heroH3.style.borderRight = "2px solid #ffcc00";
    heroH3.style.display = "inline-block";
    heroH3.style.whiteSpace = "nowrap";
    heroH3.style.overflow = "hidden";

    let charIndex = 0;
    function typeWriter() {
      if (charIndex < originalText.length) {
        heroH3.textContent += originalText.charAt(charIndex);
        charIndex++;
        setTimeout(typeWriter, 55);
      } else {
        setTimeout(() => { heroH3.style.borderRight = "none"; }, 1200);
      }
    }
    setTimeout(typeWriter, 900);
  }

  const softTags = document.querySelectorAll(".soft-skills-tags span");
  softTags.forEach((tag, i) => {
    tag.style.cssText += `
      opacity: 0;
      transform: scale(0.5) translateY(10px);
      transition: opacity 0.4s ease ${800 + i * 120}ms, transform 0.4s cubic-bezier(0.34,1.56,0.64,1) ${800 + i * 120}ms;
    `;
    setTimeout(() => {
      tag.style.opacity = "1";
      tag.style.transform = "scale(1) translateY(0)";
    }, 800 + i * 120);
  });

  const socialIcons = document.querySelectorAll(".hero .social-links a");
  socialIcons.forEach((icon, i) => {
    icon.style.cssText += `
      opacity: 0;
      transform: translateY(20px);
      transition: opacity 0.5s ease ${1200 + i * 100}ms, transform 0.5s ease ${1200 + i * 100}ms;
    `;
    setTimeout(() => {
      icon.style.opacity = "1";
      icon.style.transform = "translateY(0)";
    }, 1200 + i * 100);
  });

  const timelineNodes = document.querySelectorAll(".timeline-node");
  timelineNodes.forEach((node, i) => {
    node.style.cssText += `
      opacity: 0;
      transform: translateX(-40px);
      transition: opacity 0.45s ease ${i * 70}ms, transform 0.45s cubic-bezier(0.34,1.56,0.64,1) ${i * 70}ms;
    `;
  });

  const timelineObs = createObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateX(0)";
      }
    });
  }, { threshold: 0.2 });
  timelineNodes.forEach(node => timelineObs.observe(node));

  const certCards = document.querySelectorAll(".certificate-card");
  certCards.forEach((card, i) => {
    card.style.cssText += `
      opacity: 0;
      transform: scale(0.85);
      filter: blur(6px);
      transition: opacity 0.45s ease ${i * 50}ms, transform 0.45s cubic-bezier(0.22,1,0.36,1) ${i * 50}ms, filter 0.45s ease ${i * 50}ms;
    `;
  });

  const certObs = createObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "scale(1)";
        entry.target.style.filter = "blur(0px)";
      }
    });
  }, { threshold: 0.1 });
  certCards.forEach(card => certObs.observe(card));

  const testimonialCards = document.querySelectorAll(".testimonial-card");
  testimonialCards.forEach((card, i) => {
    card.style.cssText += `
      opacity: 0;
      transform: perspective(600px) rotateX(30deg) translateY(40px);
      transition: opacity 0.5s ease ${i * 100}ms, transform 0.5s cubic-bezier(0.22,1,0.36,1) ${i * 100}ms;
      will-change: transform, opacity;
    `;
  });

  const testObs = createObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "perspective(600px) rotateX(0deg) translateY(0)";
      }
    });
  }, { threshold: 0.15 });
  testimonialCards.forEach(card => testObs.observe(card));

  const leftCol = document.querySelector(".left-column .layered-glass-card");
  const rightCol = document.querySelector(".right-column .layered-glass-card");

  if (leftCol) {
    leftCol.style.cssText += `
      opacity: 0;
      transform: translateX(-50px);
      transition: opacity 0.6s cubic-bezier(0.22,1,0.36,1), transform 0.6s cubic-bezier(0.22,1,0.36,1);
    `;
    createObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateX(0)";
        }
      });
    }, { threshold: 0.1 }).observe(leftCol);
  }

  if (rightCol) {
    rightCol.style.cssText += `
      opacity: 0;
      transform: translateX(50px);
      transition: opacity 0.6s cubic-bezier(0.22,1,0.36,1) 0.1s, transform 0.6s cubic-bezier(0.22,1,0.36,1) 0.1s;
    `;
    createObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateX(0)";
        }
      });
    }, { threshold: 0.1 }).observe(rightCol);
  }

  const techTags = document.querySelectorAll(".tech-tags span");
  techTags.forEach((tag, i) => {
    tag.style.cssText += `
      opacity: 0;
      transform: translateY(16px) scale(0.85);
      transition: opacity 0.4s ease ${i * 40}ms, transform 0.4s cubic-bezier(0.34,1.56,0.64,1) ${i * 40}ms;
    `;
  });

  const techObs = createObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0) scale(1)";
      }
    });
  }, { threshold: 0.3 });
  techTags.forEach(tag => techObs.observe(tag));

  const sectionTitles = document.querySelectorAll(
    "#certifications h2, .projects-title, .section-title-center, .contact-title, #resume-split-page h2"
  );
  sectionTitles.forEach(title => {
    title.style.cssText += `
      opacity: 0;
      transform: translateY(30px);
      letter-spacing: 8px;
      transition: opacity 0.7s ease, transform 0.7s ease, letter-spacing 0.7s ease;
    `;
  });

  const titleObs = createObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
        entry.target.style.letterSpacing = "normal";
      }
    });
  }, { threshold: 0.3 });
  sectionTitles.forEach(t => titleObs.observe(t));

  const contactInputs = document.querySelectorAll(".contact-form input, .contact-form textarea, .contact-form button");
  contactInputs.forEach((el, i) => {
    el.style.cssText += `
      opacity: 0;
      transform: translateX(-30px);
      transition: opacity 0.5s ease ${i * 100}ms, transform 0.5s cubic-bezier(0.22,1,0.36,1) ${i * 100}ms;
    `;
  });

  const formObs = createObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateX(0)";
      }
    });
  }, { threshold: 0.2 });
  contactInputs.forEach(el => formObs.observe(el));

  const contactInfoItems = document.querySelectorAll(".contact-info p, .alt-contact-btn");
  contactInfoItems.forEach((el, i) => {
    el.style.cssText += `
      opacity: 0;
      transform: translateX(30px);
      transition: opacity 0.5s ease ${i * 100}ms, transform 0.5s cubic-bezier(0.22,1,0.36,1) ${i * 100}ms;
    `;
  });

  const contactInfoObs = createObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateX(0)";
      }
    });
  }, { threshold: 0.2 });
  contactInfoItems.forEach(el => contactInfoObs.observe(el));

  const badge = document.querySelector(".open-to-work-badge");
  if (badge) {
    badge.style.cssText += `
      opacity: 0;
      transform: scale(0.4) translateY(-10px);
      transition: opacity 0.5s cubic-bezier(0.34,1.56,0.64,1) 400ms,
                  transform 0.5s cubic-bezier(0.34,1.56,0.64,1) 400ms;
    `;
    setTimeout(() => {
      badge.style.opacity = "1";
      badge.style.transform = "scale(1) translateY(0)";
    }, 400);
  }

  const heroImg = document.querySelector(".hero-img img");
  if (heroImg) {
    heroImg.style.cssText += `
      opacity: 0;
      transform: scale(0.85);
      transition: opacity 1s ease 300ms, transform 1s cubic-bezier(0.22,1,0.36,1) 300ms;
    `;
    setTimeout(() => {
      heroImg.style.opacity = "1";
      heroImg.style.transform = "scale(1)";
    }, 300);
  }

  const heroH1 = document.querySelector(".hero-text h1");
  const heroH2 = document.querySelector(".hero-text h2");

  [heroH2, heroH1].forEach((el, i) => {
    if (!el) return;
    el.style.cssText += `
      opacity: 0;
      transform: translateY(40px);
      transition: opacity 0.7s ease ${200 + i * 200}ms, transform 0.7s cubic-bezier(0.22,1,0.36,1) ${200 + i * 200}ms;
    `;
    setTimeout(() => {
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
    }, 200 + i * 200);
  });

  const projLinks = document.querySelectorAll(".project-links");
  projLinks.forEach(links => {
    links.style.cssText += `
      opacity: 0;
      transform: translateY(8px);
      transition: opacity 0.3s ease, transform 0.3s ease;
    `;
    const parent = links.closest(".project");
    if (parent) {
      parent.addEventListener("mouseenter", () => {
        links.style.opacity = "1";
        links.style.transform = "translateY(0)";
      });
      parent.addEventListener("mouseleave", () => {
        links.style.opacity = "0";
        links.style.transform = "translateY(8px)";
      });
    }
  });

  const reveals = document.querySelectorAll(".reveal, .reveal-left, .reveal-right");
  function revealOnScroll() {
    const windowHeight = window.innerHeight;
    reveals.forEach((el) => {
      const top = el.getBoundingClientRect().top;
      if (top < windowHeight - 100) {
        el.classList.add("active");
      } else {
        el.classList.remove("active");
      }
    });
  }
  window.addEventListener("scroll", () => { requestAnimationFrame(revealOnScroll); });
  revealOnScroll();

})();