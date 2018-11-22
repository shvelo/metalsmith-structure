
# metalsmith-structure

  A Metalsmith plugin that transforms markdown-generated HTML to be hierarchically structured.

## Installation

    $ npm install metalsmith-structure

## Example

```js
var Metalsmith = require('metalsmith'),
  structure = require('metalsmith-structure');

Metalsmith(__dirname)
  .use(structure({
    headings: ['h1', 'h2', 'h3'] //headings to use for hierarchy, order matters
  }))
  .build();
```

## License

  MIT