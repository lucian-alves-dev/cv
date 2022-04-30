document.addEventListener("DOMContentLoaded", () => {
    loadContent();
});

document.addEventListener("DOMContentReady", () => {
    initLanguageSelector();
    initThemeSelector();
});

function loadContent()
{
    let allPromises = [];

    for(let frame of document.querySelectorAll("*[data-load]")) {
        let promise = fetch(frame.dataset.load).then(response => response.text())
        .then((html) => {
            frame.innerHTML = html;
        });
        allPromises.push(promise);
    }

    Promise.all(allPromises).then(() => {
        document.dispatchEvent(new Event('DOMContentReady'));
    });
}

function initLanguageSelector()
{
    let navLang = (navigator.language) ? navigator.language.substring(0, 2) : null;
    let userLang = localStorage.getItem('userLang');
    if(userLang) setLanguage(userLang); else if(navLang) setLanguage(navLang);

    for(let el of document.querySelectorAll(".box-lang-selector input[name='language']")) {
        el.addEventListener("click", () => { setLanguage(el.value); });
    }
}

function setLanguage(lang)
{
    let availableLanguages = ['en', 'pt'];
    if(! availableLanguages.includes(lang)) return false;

    document.querySelector('html').lang = lang;
    localStorage.setItem('userLang', lang);

    for(let el of document.querySelectorAll(".box-lang-selector input[name='language']")) {
        el.checked = false;
    }

    let inputLang = document.querySelector(`.box-lang-selector input[name='language'][value='${lang}']`);
    if(inputLang) inputLang.checked = true;

    translate();
}

function translate()
{
    let htmlLang = document.querySelector('html').lang;
    let fileTranslation = `/translations/${htmlLang}.json`;

    fetch(fileTranslation).then((response) => response.json()).then((json) => {
        for(let [key, value] of Object.entries(json)) {
            for(let el of document.querySelectorAll(`*[data-translate='${key}']`)){
                el.innerHTML = value;
            }
        }
    });
}

function initThemeSelector()
{
    let navTheme = (navigator.theme) ? navigator.theme : null;
    let userTheme = localStorage.getItem('userTheme');
    if(userTheme) setTheme(userTheme); else if(navTheme) setTheme(navTheme);

    for(let el of document.querySelectorAll(".box-theme-selector input[name='theme']")) {
        el.addEventListener("click", () => { setTheme(el.value); });
    }
}

function setTheme(theme)
{
    let availableThemes = ['light', 'dark'];
    if(! availableThemes.includes(theme)) return false;

    for(let el of document.querySelectorAll(".box-theme-selector input[name='theme']")) {
        el.checked = false;
    }

    let inputTheme = document.querySelector(`.box-theme-selector input[name='theme'][value='${theme}']`);
    if(inputTheme) inputTheme.checked = true;


    for(let t of availableThemes) {
        document.querySelector('body').classList.remove(t);
    }

    document.querySelector('body').classList.add(theme);
    localStorage.setItem('userTheme', theme);
}