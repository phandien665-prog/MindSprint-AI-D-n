function launchBrowser(chromium, options = {}) {
    const launchOptions = {headless: true, ...options};
    if (process.env.TUTOR_BROWSER) {
        launchOptions.executablePath = process.env.TUTOR_BROWSER;
    }
    return chromium.launch(launchOptions);
}

module.exports = {launchBrowser};
