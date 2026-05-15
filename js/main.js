(function () {
  var mqMobile = window.matchMedia("(max-width: 899px)");
  var menuToggle = document.getElementById("nav-menu-toggle");
  var menuLabel = document.querySelector('label[for="nav-menu-toggle"]');
  var nav = document.querySelector(".site-nav");
  var backdrop = document.getElementById("nav-backdrop");
  var brand = document.querySelector(".brand");

  function isMobileNav() {
    return mqMobile.matches;
  }

  function syncMenuFromCheckbox() {
    if (!menuToggle || !menuLabel) {
      return;
    }
    var open = menuToggle.checked;
    menuLabel.setAttribute("aria-expanded", open ? "true" : "false");
    if (backdrop) {
      backdrop.setAttribute("aria-hidden", open ? "false" : "true");
    }
  }

  function closeMenu() {
    if (menuToggle) {
      menuToggle.checked = false;
      syncMenuFromCheckbox();
    }
  }

  if (menuToggle && menuLabel) {
    menuToggle.addEventListener("change", syncMenuFromCheckbox);
  }

  if (nav && menuToggle) {
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function (ev) {
        if (!isMobileNav()) {
          return;
        }
        var href = link.getAttribute("href");
        if (!href || href === "#") {
          closeMenu();
          return;
        }
        var hash = "";
        var sameDoc = false;
        try {
          var resolved = new URL(href, window.location.href);
          hash = resolved.hash;
          if (!hash) {
            closeMenu();
            return;
          }
          var cur = new URL(window.location.href);
          if (resolved.origin !== cur.origin) {
            closeMenu();
            return;
          }
          var norm = function (pathname) {
            var p = pathname.replace(/\/index\.html$/i, "/");
            if (p !== "/" && p.endsWith("/")) {
              p = p.slice(0, -1);
            }
            return p || "/";
          };
          sameDoc = norm(resolved.pathname) === norm(cur.pathname);
        } catch (e) {
          closeMenu();
          return;
        }
        if (!sameDoc) {
          closeMenu();
          return;
        }
        var id = decodeURIComponent(hash.slice(1));
        var target = document.getElementById(id);
        if (!target) {
          closeMenu();
          return;
        }
        ev.preventDefault();
        closeMenu();
        var scrollToTarget = function () {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
          if (history.replaceState) {
            history.replaceState(null, "", hash);
          }
        };
        requestAnimationFrame(function () {
          requestAnimationFrame(scrollToTarget);
        });
      });
    });
  }

  window.addEventListener("resize", function () {
    if (window.matchMedia("(min-width: 900px)").matches) {
      closeMenu();
    }
  });

  if (backdrop && menuToggle) {
    backdrop.addEventListener("click", function () {
      if (isMobileNav()) {
        closeMenu();
      }
    });
  }

  if (brand && menuToggle) {
    brand.addEventListener("click", function () {
      if (isMobileNav() && menuToggle.checked) {
        closeMenu();
      }
    });
  }

  document.addEventListener("keydown", function (ev) {
    if (ev.key === "Escape" && menuToggle && menuToggle.checked && isMobileNav()) {
      closeMenu();
      if (menuLabel) {
        menuLabel.focus();
      }
    }
  });

  syncMenuFromCheckbox();
})();
