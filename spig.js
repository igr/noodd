const { Spig } = require('spignite');

Spig.hello();

// PAGES

Spig
  .on('/**/*.{md,njk,pug}')

  ._('INIT')
  .pageMeta()
  .pageLinks()

  ._('RENDER')
  .render()
  .applyTemplate()
  .htmlMinify()
;


Spig
  .on('/**/*.js')

  ._('RENDER')
  .js()
;

Spig
  .on('/**/*.css')

  ._('INIT')
  .assetLinks()
;


// IMAGES

Spig
  .on('/**/*.{png,jpg,gif}')

  ._('INIT')
  .assetLinks()
;


Spig.run();
