
var assert = require('assert');
var Metalsmith = require('metalsmith');
var markdown = require('metalsmith-markdown');
var structure = require('..');

describe('metalsmith-structure', function () {
  it('should parse heading hierarchy from HTML', function (done) {
    Metalsmith('test/fixture')
      .use(markdown())
      .use(structure())
      .build(function (err, files) {
        if (err) return done(err);
        assert.deepEqual(files['index.html'].headings, [{
          id: 'section-1',
          tag: 'h1',
          text: 'Section 1',
          priority: 0,
          children: [
            { id: 'section-1-1', tag: 'h2', text: 'Section 1.1', priority: 1 },
            {
              id: 'section-1-2',
              tag: 'h2',
              text: 'Section 1.2',
              priority: 1,
              children:
                [{
                  id: 'section-1-2-1',
                  tag: 'h3',
                  text: 'Section 1.2.1',
                  priority: 2
                },
                {
                  id: 'section-1-2-2',
                  tag: 'h3',
                  text: 'Section 1.2.2',
                  priority: 2
                }]
            },
            {
              id: 'section-1-3',
              tag: 'h2',
              text: 'Section 1.3',
              priority: 1,
              children:
                [{
                  id: 'section-1-3-1',
                  tag: 'h3',
                  text: 'Section 1.3.1',
                  priority: 2
                }]
            }]
        },
        {
          id: 'section-2',
          tag: 'h1',
          text: 'Section 2',
          priority: 0,
          children:
            [{ id: 'section-2-1', tag: 'h2', text: 'Section 2.1', priority: 1 },
            {
              id: 'section-2-1-1',
              tag: 'h2',
              text: 'Section 2.1.1',
              priority: 1
            },
            { id: 'section-2-2', tag: 'h2', text: 'Section 2.2', priority: 1 },
            {
              id: 'section-2-2-1',
              tag: 'h2',
              text: 'Section 2.2.1',
              priority: 1
            }]
        },
        { id: 'section-3', tag: 'h1', text: 'Section 3', priority: 0 }]);
        done();
      });
  });
});
