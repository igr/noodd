const { Spig } = require('spignite');

Spig.hello();

// PAGES

Spig
  .on('/**/*.{md,njk,pug}')
  .watchSite()

  ._('INIT')
  .pageMeta()
  .pageLinks()

  ._('RENDER')
  .render()
  .applyTemplate()
  .htmlMinify()
;

// IMAGES

Spig
  .on('/**/*.{png,jpg,gif}')

  ._('INIT')
  .assetLinks()
;


Spig.run();
