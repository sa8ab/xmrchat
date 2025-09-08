import DOMPurify from 'dompurify';

export default defineNuxtPlugin(async (nuxtApp) => {
  let sanitize;

  if (process.server) {
    const { JSDOM } = await import('jsdom');
    sanitize = DOMPurify(new JSDOM('').window).sanitize;
  } else {
    sanitize = DOMPurify.sanitize;
  }

  nuxtApp.provide('sanitize', sanitize);

  nuxtApp.vueApp.directive('sanitize-html', {
    beforeMount(el, binding) {
      el.innerHTML = sanitize(binding.value);
    },
    updated(el, binding) {
      el.innerHTML = sanitize(binding.value);
    }
  });
});
