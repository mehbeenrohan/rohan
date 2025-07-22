import { Pane } from 'https://cdn.skypack.dev/tweakpane@4.0.4';

const config = {
  theme: 'system',
};

const ctrl = new Pane({
  title: 'Config',
  expanded: true,
});

const update = () => {
  document.documentElement.dataset.theme = config.theme;
};

const sync = (event) => {
  if (
    !document.startViewTransition ||
    event.target.controller.view.labelElement.innerText !== 'Theme'
  ) {
    return update();
  }
  document.startViewTransition(() => update());
};

ctrl.addBinding(config, 'theme', {
  label: 'Theme',
  options: {
    System: 'system',
    Light: 'light',
    Dark: 'dark',
  },
});

ctrl.on('change', sync);
update();

// Initialize the list interaction
function initializeListInteraction() {
  const list = document.querySelector('ul');
  if (!list) {
    console.warn('No UL element found for list interaction');
    return;
  }

  const items = list.querySelectorAll('li');
  
  const setIndex = (event) => {
    const closest = event.target.closest('li');
    if (closest) {
      const index = [...items].indexOf(closest);
      const cols = new Array(list.children.length)
        .fill()
        .map((_, i) => {
          items[i].dataset.active = (index === i).toString();
          return index === i ? '10fr' : '1fr';
        })
        .join(' ');
      list.style.setProperty('grid-template-columns', cols);
    }
  };

  list.addEventListener('focus', setIndex, true);
  list.addEventListener('click', setIndex);
  list.addEventListener('pointermove', setIndex);

  const resync = () => {
    const w = Math.max(
      ...[...items].map((i) => {
        return i.offsetWidth;
      })
    );
    list.style.setProperty('--article-width', w);
  };

  window.addEventListener('resize', resync);
  resync();
}

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
  initializeListInteraction();
});

// If you're using this as a module, export any necessary components
// export { config, ctrl };