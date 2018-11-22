
# metalsmith-structure [![npm version](https://badge.fury.io/js/metalsmith-structure.svg)](https://badge.fury.io/js/metalsmith-structure)

A Metalsmith plugin that transforms markdown-generated HTML to be hierarchically structured and extracts heading hierarchy for navigation.  
Useful for generating a table of contents for your pages, or making your sections collapsible.

## Installation

```sh
$ npm install --save metalsmith-structure
```

## Example

```js
var Metalsmith = require('metalsmith'),
  markdown = require('metalsmith-markdown'),
  structure = require('metalsmith-structure');

Metalsmith(__dirname)
  .use(markdown())
  .use(structure({
    // All of these options are optional
    headings: ['h1', 'h2', 'h3'],
    divId: '%s-content',
    divAttrs: {
      class: 'generated-div',
      'data-collapse': 'collapse'
    }
  }))
  .build();
```

## Options

`metalsmith-structure` takes a single options object which supports the following options:

- `headings` - an array of heading tags to use, you can use this to ignore certain heading levels,  
by default this is set to `['h1', 'h2', 'h3']`, meaning that lower-level headings, such as `h4` and `h5` will be ignored.  
The order of these tags matter as it is used to determine hierarchical level.
- `divId` - Format for generated div `id`s, default is `%s-content`, so `heading-1` will produce `heading-1-content`, `%s` will be replaced by the heading id.
- `divAttrs` - Optional object containing additional HTML attributes for generated `div`s, for example `{ class: 'collapse' }`

## Output

`metalsmith-structure` transforms the generated HTML so it contains `div`s that group the content based on headings.  
For example, starting from the following markdown: 

```markdown
# Heading 1
## Heading 1.1
Content 1.1
# Heading 2
Content 2
```

The end result will be:

```html
<h1>Heading 1</h1>
<div id="heading-1-content">
  <h2 id="heading-1-1">Heading 1.1</h2>
  <div id="heading-1-1-content">
    Content 1.1
  </div>
</div>
<h1 id="heading-2">Heading 2</h1>
<div id="heading-2-content">
  Content 2
</div>
```

`metalsmith-structure` also adds a `headings` array to the metadata, which can be used to render navigation.

For the above document, the `headings` array will look like this:

```javascript
[
  {
    id: 'heading-1',
    priority: 0, //lower number means higher priority
    tag: 'h1',
    text: 'Heading 1', 
    children: [
      {
        id: 'heading-1-1',
        priority: 1,
        tag: 'h2',
        text: 'Heading 1.1'
      }
    ]
  },
  {
    id: 'heading-2',
    priority: 0,
    tag: 'h1',
    text: 'Heading 2'
  }
]
```

## License

  This project uses the MIT License, see [LICENSE](LICENSE) for more information.
