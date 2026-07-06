(() => {
  const DEFAULTS = {
    enabled: true,
    targetLanguage: 'zh',
    sourceLanguage: 'auto',
    endpoint: 'https://libretranslate.com/translate'
  };

  const EXCLUDED_TAGS = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEXTAREA', 'INPUT', 'SELECT', 'OPTION', 'CODE', 'PRE']);
  const translatedNodes = new WeakSet();
  const cache = new Map();
  let settings = { ...DEFAULTS };
  let pending = false;

  const getStorage = () => new Promise((resolve) => {
    chrome.storage.sync.get(DEFAULTS, resolve);
  });

  const isTranslatableText = (text) => {
    const value = text.replace(/\s+/g, ' ').trim();
    return value.length > 1 && /[\p{L}\p{N}]/u.test(value);
  };

  const shouldSkipNode = (node) => {
    const parent = node.parentElement;
    if (!parent || EXCLUDED_TAGS.has(parent.tagName)) return true;
    if (parent.closest('[contenteditable="true"], [data-auto-translator-skip]')) return true;
    return translatedNodes.has(node) || !isTranslatableText(node.nodeValue || '');
  };

  const collectTextNodes = () => {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        return shouldSkipNode(node) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
      }
    });

    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    return nodes;
  };

  const translateText = async (text) => {
    const normalized = text.replace(/\s+/g, ' ').trim();
    const key = `${settings.sourceLanguage}:${settings.targetLanguage}:${normalized}`;
    if (cache.has(key)) return cache.get(key);

    const response = await fetch(settings.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        q: normalized,
        source: settings.sourceLanguage,
        target: settings.targetLanguage,
        format: 'text'
      })
    });

    if (!response.ok) {
      throw new Error(`Translation request failed: ${response.status}`);
    }

    const data = await response.json();
    const translated = data.translatedText || normalized;
    cache.set(key, translated);
    return translated;
  };

  const translatePage = async () => {
    if (!settings.enabled || pending || !document.body) return;
    pending = true;

    const nodes = collectTextNodes();
    for (const node of nodes) {
      if (shouldSkipNode(node)) continue;
      const original = node.nodeValue;
      try {
        node.nodeValue = await translateText(original);
        translatedNodes.add(node);
      } catch (error) {
        console.warn('[Auto Page Translator]', error);
        break;
      }
    }

    pending = false;
  };

  const debouncedTranslate = () => {
    window.clearTimeout(debouncedTranslate.timer);
    debouncedTranslate.timer = window.setTimeout(translatePage, 500);
  };

  const init = async () => {
    settings = await getStorage();
    await translatePage();

    const observer = new MutationObserver(debouncedTranslate);
    observer.observe(document.body, { childList: true, subtree: true });

    chrome.storage.onChanged.addListener((changes, area) => {
      if (area !== 'sync') return;
      for (const [key, change] of Object.entries(changes)) {
        settings[key] = change.newValue;
      }
      debouncedTranslate();
    });
  };

  init();
})();
