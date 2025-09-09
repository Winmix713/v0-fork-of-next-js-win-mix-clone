document.addEventListener('DOMContentLoaded', function () {
  const navToggleButton = document.querySelector('[data-nav-toggle]');
  const nav = document.querySelector('[data-nav]');
  if (navToggleButton && nav) {
    navToggleButton.addEventListener('click', function () {
      const isOpen = nav.getAttribute('data-open') === 'true';
      nav.setAttribute('data-open', String(!isOpen));
      navToggleButton.setAttribute('aria-expanded', String(!isOpen));
    });
  }

  const contactForm = document.querySelector('form[data-contact-form]');
  if (contactForm) {
    contactForm.addEventListener('submit', function (event) {
      event.preventDefault();
      const formData = new FormData(contactForm);
      const name = String(formData.get('name') || '').trim();
      const email = String(formData.get('email') || '').trim();
      const message = String(formData.get('message') || '').trim();
      if (!name || !email || !message) {
        alert('Kérjük, tölts ki minden mezőt.');
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        alert('Kérjük, érvényes email címet adj meg.');
        return;
      }
      alert('Köszönjük az üzenetet! Hamarosan jelentkezünk.');
      contactForm.reset();
    });
  }
});
