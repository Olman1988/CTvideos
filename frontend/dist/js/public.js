
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
        ".hero, .logo-strip, .cards-section, .about-section, .videos-section, .cta-hero, .fun-section, .categories-section, .testimonials, .site-footer, .profile-detail, .profile-summary, .profile-friends, .profile-invite, .profile-videos, .profile-lists, .profile-badges, .profile-favorites, .profile-avatars, .about-hero, .about-split, .about-gallery, .about-steps"
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

      const a11yWidget = document.querySelector(".a11y-widget");
      if (a11yWidget) {
        const toggle = a11yWidget.querySelector(".a11y-toggle");
        const panel = a11yWidget.querySelector(".a11y-panel");
        const buttons = a11yWidget.querySelectorAll(".a11y-item");
        const storageKey = "a11ySettings";
        const settings = {
          scale: 1,
          contrast: false,
          links: false,
          motion: false,
          grayscale: false,
          dark: false,
        };
        let ttsUtterance = null;
        let ttsActive = false;

        const loadSettings = () => {
          const stored = localStorage.getItem(storageKey);
          if (!stored) return;
          try {
            const parsed = JSON.parse(stored);
            if (parsed && typeof parsed === "object") {
              settings.scale = Number(parsed.scale) || 1;
              settings.contrast = Boolean(parsed.contrast);
              settings.links = Boolean(parsed.links);
              settings.motion = Boolean(parsed.motion);
              settings.grayscale = Boolean(parsed.grayscale);
              settings.dark = Boolean(parsed.dark);
            }
          } catch (error) {
            console.warn("No se pudo leer accesibilidad", error);
          }
        };

        const saveSettings = () => {
          localStorage.setItem(storageKey, JSON.stringify(settings));
        };

        const applySettings = () => {
          const safeScale = Math.min(1.3, Math.max(0.9, settings.scale));
          settings.scale = Number(safeScale.toFixed(2));
          document.documentElement.style.zoom = settings.scale;
          document.body.classList.toggle("a11y-contrast", settings.contrast);
          document.body.classList.toggle("a11y-links", settings.links);
          document.body.classList.toggle("a11y-reduce-motion", settings.motion);
          document.body.classList.toggle("a11y-grayscale", settings.grayscale);
          document.body.classList.toggle("a11y-dark", settings.dark);

          buttons.forEach((btn) => {
            const action = btn.dataset.action;
            if (!action) return;
            if (action === "contrast") {
              btn.setAttribute("aria-pressed", settings.contrast ? "true" : "false");
              btn.classList.toggle("is-active", settings.contrast);
            }
            if (action === "links") {
              btn.setAttribute("aria-pressed", settings.links ? "true" : "false");
              btn.classList.toggle("is-active", settings.links);
            }
            if (action === "motion") {
              btn.setAttribute("aria-pressed", settings.motion ? "true" : "false");
              btn.classList.toggle("is-active", settings.motion);
            }
            if (action === "grayscale") {
              btn.setAttribute("aria-pressed", settings.grayscale ? "true" : "false");
              btn.classList.toggle("is-active", settings.grayscale);
            }
            if (action === "theme") {
              btn.setAttribute("aria-pressed", settings.dark ? "true" : "false");
              btn.classList.toggle("is-active", settings.dark);
            }
            if (action === "tts") {
              btn.setAttribute("aria-pressed", ttsActive ? "true" : "false");
              btn.classList.toggle("is-active", ttsActive);
            }
          });
        };

        const setOpen = (open) => {
          a11yWidget.classList.toggle("is-open", open);
          if (toggle) {
            toggle.setAttribute("aria-expanded", open ? "true" : "false");
          }
          if (panel) {
            panel.setAttribute("aria-hidden", open ? "false" : "true");
          }
        };

        loadSettings();
        applySettings();

        if (toggle) {
          toggle.addEventListener("click", () => {
            const isOpen = a11yWidget.classList.contains("is-open");
            setOpen(!isOpen);
          });
        }

        buttons.forEach((btn) => {
          btn.addEventListener("click", () => {
            const action = btn.dataset.action;
            if (!action) return;
            if (action === "font-increase") {
              settings.scale += 0.1;
            } else if (action === "font-decrease") {
              settings.scale -= 0.1;
            } else if (action === "font-reset") {
              settings.scale = 1;
            } else if (action === "contrast") {
              settings.contrast = !settings.contrast;
            } else if (action === "links") {
              settings.links = !settings.links;
            } else if (action === "motion") {
              settings.motion = !settings.motion;
            } else if (action === "grayscale") {
              settings.grayscale = !settings.grayscale;
            } else if (action === "theme") {
              settings.dark = !settings.dark;
            } else if (action === "tts") {
              if (!("speechSynthesis" in window)) {
                alert("Tu navegador no soporta lectura automatica.");
                return;
              }
              if (ttsActive) {
                window.speechSynthesis.cancel();
                ttsActive = false;
              } else {
                const clone = document.body.cloneNode(true);
                const widgetClone = clone.querySelector(".a11y-widget");
                if (widgetClone) widgetClone.remove();
                const text = clone.innerText.replace(/\s+/g, " ").trim();
                if (!text) return;
                ttsUtterance = new SpeechSynthesisUtterance(text);
                ttsUtterance.lang = "es-CR";
                ttsUtterance.rate = 1;
                ttsUtterance.onend = () => {
                  ttsActive = false;
                  applySettings();
                };
                ttsUtterance.onerror = () => {
                  ttsActive = false;
                  applySettings();
                };
                ttsActive = true;
                window.speechSynthesis.cancel();
                window.speechSynthesis.speak(ttsUtterance);
              }
            } else if (action === "reset") {
              settings.scale = 1;
              settings.contrast = false;
              settings.links = false;
              settings.motion = false;
              settings.grayscale = false;
              settings.dark = false;
              if ("speechSynthesis" in window) {
                window.speechSynthesis.cancel();
              }
              ttsActive = false;
            }
            applySettings();
            saveSettings();
          });
        });

        document.addEventListener("click", (event) => {
          if (!a11yWidget.classList.contains("is-open")) return;
          if (!a11yWidget.contains(event.target)) {
            setOpen(false);
          }
        });

        document.addEventListener("keydown", (event) => {
          if (event.key === "Escape") {
            setOpen(false);
          }
        });
      }

      const videoDirectory = document.querySelector("[data-video-directory]");

      if (videoDirectory) {
        const searchInput = videoDirectory.querySelector("#video-list-search");
        const categorySelect = videoDirectory.querySelector("#video-list-category");
        const schoolSelect = videoDirectory.querySelector("#video-list-school");
        const sortSelect = videoDirectory.querySelector("#video-list-sort");
        const resetBtn = videoDirectory.querySelector("#video-list-reset");
        const grid = videoDirectory.querySelector("#video-list-grid");
        const emptyState = videoDirectory.querySelector("#video-list-empty");
        const countEl = videoDirectory.querySelector("#video-list-count");
        const activeFiltersEl = videoDirectory.querySelector("#video-list-active-filters");
        const orderLabelEl = videoDirectory.querySelector("#video-list-order-label");
        const viewCardsBtn = videoDirectory.querySelector("#video-view-cards");
        const viewListBtn = videoDirectory.querySelector("#video-view-list");

        if (
          searchInput &&
          categorySelect &&
          schoolSelect &&
          sortSelect &&
          resetBtn &&
          grid &&
          emptyState &&
          countEl &&
          activeFiltersEl &&
          orderLabelEl &&
          viewCardsBtn &&
          viewListBtn
        ) {
          const cards = Array.from(grid.querySelectorAll(".video-directory-card"));
          const viewButtons = [viewCardsBtn, viewListBtn];
          const viewStorageKey = "cetav_video_directory_view";

          cards.forEach((card, index) => {
            card.dataset.index = String(index);
          });

          const normalizeText = (value) =>
            (value || "")
              .toLowerCase()
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
              .trim();

          const getSelectedLabel = (select) => {
            const selected = select.options[select.selectedIndex];
            return selected ? selected.textContent.trim() : "";
          };

          const escapeHtml = (value) =>
            String(value)
              .replace(/&/g, "&amp;")
              .replace(/</g, "&lt;")
              .replace(/>/g, "&gt;")
              .replace(/"/g, "&quot;")
              .replace(/'/g, "&#39;");

          const renderActiveFilters = () => {
            const chips = [];
            const query = searchInput.value.trim();
            const categoryLabel = getSelectedLabel(categorySelect);
            const schoolLabel = getSelectedLabel(schoolSelect);
            const sortLabel = getSelectedLabel(sortSelect);

            if (query) {
              chips.push(`<span class="video-directory-active-filter"><strong>Busqueda:</strong> ${escapeHtml(query)}</span>`);
            }
            if (categorySelect.value) {
              chips.push(`<span class="video-directory-active-filter"><strong>Categoria:</strong> ${escapeHtml(categoryLabel)}</span>`);
            }
            if (schoolSelect.value) {
              chips.push(`<span class="video-directory-active-filter"><strong>Centro:</strong> ${escapeHtml(schoolLabel)}</span>`);
            }

            activeFiltersEl.innerHTML = chips.join("");
            orderLabelEl.textContent = `Orden: ${sortLabel || "Mas recientes"}`;
          };

          const setViewMode = (mode) => {
            const nextMode = mode === "list" ? "list" : "cards";
            grid.classList.toggle("is-list", nextMode === "list");
            viewButtons.forEach((btn) => {
              const isActive = btn.dataset.view === nextMode;
              btn.classList.toggle("is-active", isActive);
              btn.setAttribute("aria-pressed", isActive ? "true" : "false");
            });
            try {
              window.localStorage.setItem(viewStorageKey, nextMode);
            } catch (error) {
              /* ignore storage errors */
            }
          };

          const sortCards = (list, sortType) => {
            const sorted = [...list];

            if (sortType === "views") {
              sorted.sort((a, b) => Number(b.dataset.views || 0) - Number(a.dataset.views || 0));
              return sorted;
            }

            if (sortType === "name-desc") {
              sorted.sort((a, b) => {
                const nameA = a.dataset.title || "";
                const nameB = b.dataset.title || "";
                return nameB.localeCompare(nameA, "es", { sensitivity: "base" });
              });
              return sorted;
            }

            sorted.sort((a, b) => {
              const dateA = Date.parse(a.dataset.date || "1970-01-01");
              const dateB = Date.parse(b.dataset.date || "1970-01-01");
              if (dateB !== dateA) return dateB - dateA;
              return Number(a.dataset.index || 0) - Number(b.dataset.index || 0);
            });

            return sorted;
          };

          const renderDirectory = () => {
            const query = normalizeText(searchInput.value);
            const category = categorySelect.value;
            const school = schoolSelect.value;
            const sortType = sortSelect.value;

            const filtered = cards.filter((card) => {
              const title = normalizeText(card.dataset.title);
              const searchBlob = normalizeText(card.dataset.search || card.textContent);
              const matchesText = !query || title.includes(query) || searchBlob.includes(query);
              const matchesCategory = !category || card.dataset.category === category;
              const matchesSchool = !school || card.dataset.school === school;
              return matchesText && matchesCategory && matchesSchool;
            });

            const sorted = sortCards(filtered, sortType);

            grid.innerHTML = "";
            sorted.forEach((card) => {
              grid.appendChild(card);
            });

            countEl.textContent = String(sorted.length);
            emptyState.hidden = sorted.length !== 0;
            grid.hidden = sorted.length === 0;
            renderActiveFilters();
          };

          searchInput.addEventListener("input", renderDirectory);
          categorySelect.addEventListener("change", renderDirectory);
          schoolSelect.addEventListener("change", renderDirectory);
          sortSelect.addEventListener("change", renderDirectory);
          viewButtons.forEach((btn) => {
            btn.addEventListener("click", () => {
              setViewMode(btn.dataset.view || "cards");
            });
          });

          resetBtn.addEventListener("click", () => {
            searchInput.value = "";
            categorySelect.value = "";
            schoolSelect.value = "";
            sortSelect.value = "recent";
            renderDirectory();
            searchInput.focus();
          });

          let initialViewMode = "cards";
          try {
            initialViewMode = window.localStorage.getItem(viewStorageKey) || "cards";
          } catch (error) {
            initialViewMode = "cards";
          }
          setViewMode(initialViewMode);
          renderDirectory();
        }
      }

      const avatarPicker = document.querySelector("[data-avatar-picker]");

      if (avatarPicker) {
        const avatarGrid = avatarPicker.querySelector("#avatar-grid");
        const avatarCountEl = avatarPicker.querySelector("#avatar-gallery-count");
        const emptyEl = avatarPicker.querySelector("#avatar-grid-empty");
        const previewShell = avatarPicker.querySelector("#avatar-preview-shell");
        const previewImage = avatarPicker.querySelector("#avatar-preview-image");
        const previewName = avatarPicker.querySelector("#avatar-preview-name");
        const previewStyle = avatarPicker.querySelector("#avatar-preview-style");
        const previewBadge = avatarPicker.querySelector("#avatar-preview-badge");
        const saveBtn = avatarPicker.querySelector("#avatar-save-btn");
        const statusEl = avatarPicker.querySelector("#avatar-picker-status");
        const filterChips = Array.from(avatarPicker.querySelectorAll("[data-avatar-chip]"));
        const avatarButtons = Array.from(avatarPicker.querySelectorAll(".avatar-card-btn"));
        const avatarItems = Array.from(avatarPicker.querySelectorAll(".avatar-card-item"));

        if (
          avatarGrid &&
          avatarCountEl &&
          emptyEl &&
          previewShell &&
          previewImage &&
          previewName &&
          previewStyle &&
          previewBadge &&
          saveBtn &&
          statusEl &&
          filterChips.length &&
          avatarButtons.length
        ) {
          const applySelectedAvatar = (btn, markDirty = true) => {
            avatarButtons.forEach((item) => {
              const isSelected = item === btn;
              item.classList.toggle("is-selected", isSelected);
              item.setAttribute("aria-pressed", isSelected ? "true" : "false");
            });

            previewName.textContent = btn.dataset.avatarName || "Avatar";
            previewStyle.textContent = btn.dataset.avatarStyle || "Estilo";
            previewBadge.textContent = btn.dataset.avatarBadge || "Disponible";

            previewShell.style.setProperty("--avatar-grad-a", btn.dataset.avatarGradA || "#8f5cab");
            previewShell.style.setProperty("--avatar-grad-b", btn.dataset.avatarGradB || "#f2b733");
            previewShell.style.setProperty("--avatar-glow", btn.dataset.avatarGlow || "rgba(143,92,171,0.28)");
            previewImage.style.filter = btn.dataset.avatarFilter || "none";

            if (markDirty) {
              statusEl.textContent = "Avatar seleccionado. Presiona Guardar avatar para confirmar.";
              statusEl.classList.remove("is-success");
            }
          };

          const setActiveFilter = (value) => {
            const nextValue = value || "all";

            filterChips.forEach((chip) => {
              const isActive = (chip.dataset.avatarChip || "all") === nextValue;
              chip.classList.toggle("is-active", isActive);
              chip.setAttribute("aria-pressed", isActive ? "true" : "false");
            });

            let visibleCount = 0;

            avatarItems.forEach((item) => {
              const groups = (item.dataset.avatarGroup || "")
                .split(/\s+/)
                .filter(Boolean);
              const matches = nextValue === "all" || groups.includes(nextValue);
              item.hidden = !matches;
              if (matches) visibleCount += 1;
            });

            avatarCountEl.textContent = String(visibleCount);
            emptyEl.hidden = visibleCount !== 0;
            avatarGrid.hidden = visibleCount === 0;
          };

          filterChips.forEach((chip) => {
            chip.addEventListener("click", () => {
              setActiveFilter(chip.dataset.avatarChip || "all");
            });
          });

          avatarButtons.forEach((btn) => {
            btn.addEventListener("click", () => {
              applySelectedAvatar(btn, true);
            });
          });

          saveBtn.addEventListener("click", () => {
            const selected = avatarPicker.querySelector(".avatar-card-btn.is-selected");
            const selectedName = selected?.dataset.avatarName || "Avatar";
            statusEl.textContent = `Avatar "${selectedName}" guardado correctamente.`;
            statusEl.classList.add("is-success");
          });

          const initialSelected = avatarPicker.querySelector(".avatar-card-btn.is-selected") || avatarButtons[0];
          if (initialSelected) {
            applySelectedAvatar(initialSelected, false);
          }
          setActiveFilter("all");
        }
      }

      const publishToggles = document.querySelectorAll(".publish-toggle");

      if (publishToggles.length) {
        publishToggles.forEach((toggle) => {
          toggle.addEventListener("click", () => {
            const isOn = toggle.classList.toggle("is-on");
            toggle.setAttribute("aria-pressed", isOn ? "true" : "false");
          });
        });
      }
    
