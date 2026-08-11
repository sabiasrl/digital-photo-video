/**
 * Language preference: English by default; Italian when browser language is it*.
 * Flag switcher choice is stored in localStorage and respected.
 * Uses relative paths so file:// and any host path work.
 */
(function () {
  var STORAGE_KEY = "dfv-lang";
  var htmlEl = document.documentElement;
  var pageLang = (htmlEl.getAttribute("lang") || "en").slice(0, 2).toLowerCase();
  var redirectOff = htmlEl.getAttribute("data-i18n-redirect") === "off";

  function browserPrefersItalian() {
    var list =
      navigator.languages && navigator.languages.length
        ? navigator.languages
        : navigator.language
          ? [navigator.language]
          : [];
    for (var i = 0; i < list.length; i++) {
      if (String(list[i]).toLowerCase().indexOf("it") === 0) {
        return true;
      }
    }
    return false;
  }

  function getPreferredLang() {
    try {
      var stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "it" || stored === "en") {
        return stored;
      }
    } catch (e) {}
    return browserPrefersItalian() ? "it" : "en";
  }

  function setPreferredLang(lang) {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {}
  }

  function isEnglishPage() {
    var path = window.location.pathname || "";
    var href = window.location.href || "";
    return /(^|\/)en(\/|$)/i.test(path) || /\/en\//i.test(href);
  }

  function isSeoLanding() {
    var path = (window.location.pathname || "") + (window.location.href || "");
    return /fotografo-/i.test(path);
  }

  function pageKind() {
    var path = window.location.pathname || "";
    var href = window.location.href || "";
    if (/gadgets\.html/i.test(path) || /gadgets\.html/i.test(href)) {
      return "gadgets";
    }
    return "home";
  }

  function relativeDest(targetLang, hash) {
    var file = pageKind() === "gadgets" ? "gadgets.html" : "index.html";
    var onEn = isEnglishPage();
    var path;
    if (targetLang === "en") {
      if (isSeoLanding()) {
        path = "../en/" + file;
      } else {
        path = onEn ? file : "en/" + file;
      }
    } else {
      if (onEn) {
        path = "../" + file;
      } else if (isSeoLanding()) {
        path = file === "index.html" ? "../index.html" : "../" + file;
      } else {
        path = file;
      }
    }
    return path + (hash || "");
  }

  function normalizePath(pathname) {
    return String(pathname || "")
      .replace(/\\/g, "/")
      .replace(/\/index\.html$/i, "/")
      .replace(/\/$/, "")
      .toLowerCase();
  }

  var preferred = getPreferredLang();
  if (!redirectOff && preferred !== pageLang) {
    var hash = window.location.hash || "";
    var dest = relativeDest(preferred, hash);
    try {
      var destUrl = new URL(dest, window.location.href);
      if (normalizePath(destUrl.pathname) !== normalizePath(window.location.pathname)) {
        window.location.replace(destUrl.href);
        return;
      }
    } catch (e) {
      window.location.replace(dest);
      return;
    }
  }

  window.DFV_I18N = {
    getPreferredLang: getPreferredLang,
    setPreferredLang: setPreferredLang,
    pageLang: pageLang,
  };

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".lang-btn[data-lang]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var lang = btn.getAttribute("data-lang");
        if (lang === "it" || lang === "en") {
          setPreferredLang(lang);
        }
      });
    });
  });
})();
