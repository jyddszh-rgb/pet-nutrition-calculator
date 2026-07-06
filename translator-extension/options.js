const DEFAULTS = {
  enabled: true,
  targetLanguage: 'zh',
  sourceLanguage: 'auto',
  endpoint: 'https://libretranslate.com/translate'
};

const fields = {
  enabled: document.querySelector('#enabled'),
  sourceLanguage: document.querySelector('#sourceLanguage'),
  targetLanguage: document.querySelector('#targetLanguage'),
  endpoint: document.querySelector('#endpoint'),
  status: document.querySelector('#status')
};

chrome.storage.sync.get(DEFAULTS, (settings) => {
  fields.enabled.checked = settings.enabled;
  fields.sourceLanguage.value = settings.sourceLanguage;
  fields.targetLanguage.value = settings.targetLanguage;
  fields.endpoint.value = settings.endpoint;
});

document.querySelector('#save').addEventListener('click', () => {
  chrome.storage.sync.set({
    enabled: fields.enabled.checked,
    sourceLanguage: fields.sourceLanguage.value.trim() || DEFAULTS.sourceLanguage,
    targetLanguage: fields.targetLanguage.value.trim() || DEFAULTS.targetLanguage,
    endpoint: fields.endpoint.value.trim() || DEFAULTS.endpoint
  }, () => {
    fields.status.textContent = '设置已保存，刷新网页后生效。';
    window.setTimeout(() => { fields.status.textContent = ''; }, 2500);
  });
});
