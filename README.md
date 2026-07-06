# Pet nutritional requirements calculator

This Python program calculates the daily nutritional requirements for pets and outputs the right combination of wet and dry food based on pet's weight. Created for cats and dogs, based on the nutritional labels of both of my pets. 

*Code can be adapted if user uploads their own nutritional information and adjusts the code to work with their own measures (e.g. cups, scoops, etc).*

- Linear regression was used to allow for dynamic calculation of cat food requirements based on cat's weight
- User-defined prompts were used so that user can enter specific parameters, such as weight, diet type, etc.
- Functions written to simplify arithmetic calculations; nested 'if' statements handle branching logic for combination diet

## Auto Page Translator browser extension

This repository also includes a Chrome/Edge-compatible Manifest V3 browser extension in `translator-extension/` that automatically translates visible page text.

### Features

- Automatically scans text nodes on loaded pages and translates them into the configured target language.
- Watches for dynamically added content and translates it after a short debounce.
- Skips scripts, styles, form fields, code blocks, and elements marked with `data-auto-translator-skip`.
- Stores extension settings with `chrome.storage.sync`.
- Lets users configure whether translation is enabled, the source language, target language, and LibreTranslate-compatible endpoint.

### Local installation

1. Open `chrome://extensions` or `edge://extensions`.
2. Enable developer mode.
3. Choose **Load unpacked**.
4. Select the `translator-extension/` directory.
5. Open the extension options page to set your target language and translation endpoint.

The default endpoint is `https://libretranslate.com/translate`. For production or private use, configure a trusted self-hosted LibreTranslate-compatible endpoint to control quota, latency, and privacy.
