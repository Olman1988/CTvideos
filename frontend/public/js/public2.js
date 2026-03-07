
      const nav = document.querySelector(".navbar");
      const menuBtn = document.querySelector(".menu-btn");
      const hero = document.querySelector(".hero");
      const slides = document.querySelectorAll(".hero-slide");
      const prevBtn = document.querySelector(".hero-arrow.prev");
      const nextBtn = document.querySelector(".hero-arrow.next");
      const logoTrack = document.querySelector(".logo-track");
      const logoItems = document.querySelectorAll(".logo-item");
      const categoriesTrack = document.querySelector(".categories-track");
      const categoryCards = document.querySelectorAll(".category-card");
      const dotsContainer = document.querySelector(".carousel-dots");
      const testimonialPrev = document.querySelector(".testimonial-nav.prev");
      const testimonialNext = document.querySelector(".testimonial-nav.next");
      const testimonialText = document.querySelector("#testimonial-text");
      const testimonialAvatar = document.querySelector("#testimonial-avatar");
      const testimonialName = document.querySelector("#testimonial-name");
      const testimonialDots = document.querySelectorAll(".testimonial-dots span");

      menuBtn.addEventListener("click", () => {
        const isOpen = nav.classList.toggle("is-open");
        menuBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
      });

      if (slides.length > 1 && prevBtn && nextBtn) {
        let currentSlide = 0;
        const autoplayMs = 5000;
        let autoplayId = null;

        const showSlide = (index) => {
          slides[currentSlide].classList.remove("is-active");
          currentSlide = (index + slides.length) % slides.length;
          slides[currentSlide].classList.add("is-active");
        };

        const startAutoplay = () => {
          if (autoplayId) return;
          autoplayId = setInterval(() => {
            showSlide(currentSlide + 1);
          }, autoplayMs);
        };

        const stopAutoplay = () => {
          if (!autoplayId) return;
          clearInterval(autoplayId);
          autoplayId = null;
        };

        prevBtn.addEventListener("click", () => {
          showSlide(currentSlide - 1);
        });

        nextBtn.addEventListener("click", () => {
          showSlide(currentSlide + 1);
        });

        if (hero) {
          hero.addEventListener("mouseenter", stopAutoplay);
          hero.addEventListener("mouseleave", startAutoplay);
        }

        startAutoplay();
      }

      if (logoTrack && logoItems.length) {
        let logoIndex = 0;
        let logoTimer = null;
        const logoAutoplayMs = 2500;
        const mediaQuery = window.matchMedia("(max-width: 640px)");

        const ensureClone = () => {
          const existingClone = logoTrack.querySelector(".logo-item[data-clone='true']");
          if (existingClone) return;
          const firstLogo = logoTrack.querySelector(".logo-item");
          if (!firstLogo) return;
          const clone = firstLogo.cloneNode(true);
          clone.dataset.clone = "true";
          logoTrack.appendChild(clone);
        };

        const removeClone = () => {
          const clone = logoTrack.querySelector(".logo-item[data-clone='true']");
          if (clone) {
            clone.remove();
          }
        };

        const startLogoAutoplay = () => {
          if (logoTimer || !mediaQuery.matches) return;
          logoTimer = setInterval(() => {
            const items = logoTrack.querySelectorAll(".logo-item");
            const maxIndex = items.length - 1;
            logoIndex += 1;
            logoTrack.style.transform = `translateX(${-logoIndex * 100}%)`;
            if (logoIndex === maxIndex) {
              const onReset = () => {
                logoTrack.removeEventListener("transitionend", onReset);
                logoTrack.style.transition = "none";
                logoTrack.style.transform = "translateX(0%)";
                logoIndex = 0;
                logoTrack.offsetHeight;
                logoTrack.style.transition = "transform 0.5s ease";
              };
              logoTrack.addEventListener("transitionend", onReset);
            }
          }, logoAutoplayMs);
        };

        const stopLogoAutoplay = () => {
          if (!logoTimer) return;
          clearInterval(logoTimer);
          logoTimer = null;
        };

        const handleLogoMedia = () => {
          stopLogoAutoplay();
          if (mediaQuery.matches) {
            ensureClone();
            logoIndex = 0;
            logoTrack.style.transform = "translateX(0%)";
            logoTrack.style.transition = "transform 0.5s ease";
            startLogoAutoplay();
          } else {
            removeClone();
            logoTrack.style.transition = "";
            logoTrack.style.transform = "";
          }
        };

        mediaQuery.addEventListener("change", handleLogoMedia);
        handleLogoMedia();
      }

      const reactionWraps = document.querySelectorAll(".reaction-wrap");

      reactionWraps.forEach((wrap) => {
        const toggleBtn = wrap.querySelector(".meta-btn.is-like");
        const menu = wrap.querySelector(".reaction-menu");
        const icon = wrap.querySelector(".reaction-icon");
        if (!toggleBtn || !menu || !icon) return;

        const closeMenu = () => {
          wrap.classList.remove("is-open");
          toggleBtn.setAttribute("aria-expanded", "false");
          menu.setAttribute("aria-hidden", "true");
        };

        toggleBtn.addEventListener("click", (event) => {
          event.stopPropagation();
          const isOpen = wrap.classList.toggle("is-open");
          toggleBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
          menu.setAttribute("aria-hidden", isOpen ? "false" : "true");
        });

        menu.addEventListener("click", (event) => {
          const btn = event.target.closest("button");
          if (!btn) return;
          const label = btn.dataset.label || "Reaccion";
          const iconClass = btn.dataset.icon;
          if (iconClass) {
            icon.innerHTML = `<i class=\"${iconClass}\" aria-hidden=\"true\"></i>`;
          }
          toggleBtn.setAttribute("aria-label", label);
          wrap.classList.add("is-selected");
          closeMenu();
        });

        document.addEventListener("click", (event) => {
          if (!wrap.contains(event.target)) {
            closeMenu();
          }
        });
      });

      if (categoriesTrack && categoryCards.length && dotsContainer) {
        let categoryIndex = 0;
        let categoryTimer = null;
        const categoryAutoplayMs = 3500;

        const getVisibleCount = () => {
          const width = window.innerWidth;
          if (width <= 640) return 1;
          if (width <= 1000) return 2;
          return 3;
        };

        const setupDots = () => {
          const visibleCount = getVisibleCount();
          const maxIndex = Math.max(0, categoryCards.length - visibleCount);
          const dotCount = maxIndex + 1;
          dotsContainer.innerHTML = "";
          Array.from({ length: dotCount }, (_, i) => {
            const btn = document.createElement("button");
            btn.type = "button";
            btn.setAttribute("aria-label", `Slide ${i + 1}`);
            dotsContainer.appendChild(btn);
            btn.addEventListener("click", () => {
              categoryIndex = i;
              updateCarousel();
            });
          });
        };

        const updateDots = () => {
          const dots = dotsContainer.querySelectorAll("button");
          dots.forEach((btn, i) => {
            btn.classList.toggle("is-active", i === categoryIndex);
          });
        };

        const updateCarousel = () => {
          const visibleCount = getVisibleCount();
          const maxIndex = Math.max(0, categoryCards.length - visibleCount);
          if (categoryIndex > maxIndex) categoryIndex = 0;
          const cardWidth = categoryCards[0].getBoundingClientRect().width;
          const gap = parseFloat(getComputedStyle(categoriesTrack).gap || "0");
          const offset = (cardWidth + gap) * categoryIndex;
          categoriesTrack.style.transform = `translateX(-${offset}px)`;
          updateDots();
        };

        const startCategoryAutoplay = () => {
          if (categoryTimer) return;
          categoryTimer = setInterval(() => {
            const visibleCount = getVisibleCount();
            const maxIndex = Math.max(0, categoryCards.length - visibleCount);
            if (categoryIndex >= maxIndex) {
              categoryIndex = 0;
            } else {
              categoryIndex += 1;
            }
            updateCarousel();
          }, categoryAutoplayMs);
        };

        setupDots();
        updateCarousel();
        startCategoryAutoplay();
        window.addEventListener("resize", () => {
          setupDots();
          updateCarousel();
        });
      }

      if (testimonialPrev && testimonialNext && testimonialText && testimonialAvatar && testimonialName) {
        const testimonials = [
          {
            text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet iaculis luctus. Mauris lacus mi.",
            name: "Lorem ipsum",
            avatar: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=120&q=80",
          },
          {
            text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet iaculis luctus. Mauris lacus mi, ornare vel nulla.",
            name: "Lorem ipsum",
            avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80",
          },
          {
            text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet iaculis luctus.",
            name: "Lorem ipsum",
            avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80",
          },
        ];

        let testimonialIndex = 0;

        const updateTestimonial = () => {
          const current = testimonials[testimonialIndex];
          testimonialText.style.opacity = "0";
          testimonialName.style.opacity = "0";
          testimonialAvatar.style.opacity = "0";
          setTimeout(() => {
            testimonialText.textContent = current.text;
            testimonialName.textContent = current.name;
            testimonialAvatar.src = current.avatar;
            testimonialText.style.opacity = "1";
            testimonialName.style.opacity = "1";
            testimonialAvatar.style.opacity = "1";
            testimonialDots.forEach((dot, i) => {
              dot.classList.toggle("is-active", i === testimonialIndex);
            });
          }, 150);
        };

        testimonialPrev.addEventListener("click", () => {
          testimonialIndex = (testimonialIndex - 1 + testimonials.length) % testimonials.length;
          updateTestimonial();
        });

        testimonialNext.addEventListener("click", () => {
          testimonialIndex = (testimonialIndex + 1) % testimonials.length;
          updateTestimonial();
        });

        const mobileQuery = window.matchMedia("(max-width: 640px)");
        let testimonialTimer = null;

        const startTestimonialAutoplay = () => {
          if (testimonialTimer) return;
          testimonialTimer = setInterval(() => {
            testimonialIndex = (testimonialIndex + 1) % testimonials.length;
            updateTestimonial();
          }, 4000);
        };

        const stopTestimonialAutoplay = () => {
          if (!testimonialTimer) return;
          clearInterval(testimonialTimer);
          testimonialTimer = null;
        };

        const handleTestimonialMedia = () => {
          stopTestimonialAutoplay();
          if (mobileQuery.matches) {
            startTestimonialAutoplay();
          }
        };

        mobileQuery.addEventListener("change", handleTestimonialMedia);
        handleTestimonialMedia();
      }

      const revealTargets = document.querySelectorAll(
        ".hero, .logo-strip, .cards-section, .about-section, .videos-section, .cta-hero, .fun-section, .categories-section, .testimonials, .site-footer"
      );
      if (revealTargets.length && "IntersectionObserver" in window) {
        const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (prefersReduced) {
          revealTargets.forEach((el) => el.classList.add("is-visible"));
        } else {
          revealTargets.forEach((el) => el.classList.add("reveal"));
          const revealObserver = new IntersectionObserver(
            (entries) => {
              entries.forEach((entry) => {
                if (entry.isIntersecting) {
                  entry.target.classList.add("is-visible");
                  revealObserver.unobserve(entry.target);
                }
              });
            },
            { threshold: 0.2 }
          );
          revealTargets.forEach((el) => revealObserver.observe(el));
        }
      }

      const aboutRing = document.querySelector(".about-ring");
      const aboutDecoration = document.querySelector(".about-decoration");
      if ((aboutRing || aboutDecoration) && "IntersectionObserver" in window) {
        const ringObserver = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              const target = entry.target;
              if (entry.isIntersecting) {
                target.classList.add("is-inview");
              } else {
                target.classList.remove("is-inview");
              }
            });
          },
          { threshold: 0.3 }
        );
        if (aboutRing) ringObserver.observe(aboutRing);
        if (aboutDecoration) ringObserver.observe(aboutDecoration);
      } else {
        if (aboutRing) aboutRing.classList.add("is-inview");
        if (aboutDecoration) aboutDecoration.classList.add("is-inview");
      }
    
