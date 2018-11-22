
var cheerio = require('cheerio'),
  extname = require('path').extname;

/**
 * Expose `plugin`.
 */
module.exports = plugin;

/**
 * Transform HTML files to have hierarchy structure based on headers.
 *
 * @param {object} [options] Plugin options
 * @param {array} [options.headings = ['h1', 'h2', 'h3']] Heading tags to use for structure, default is h1, h2, h3
 */
function plugin(options) {
  var defaults = {
    headings: ['h1', 'h2', 'h3'],
    divId: '%s-content',
    divAttrs: {}
  };
  options = Object.assign(defaults, options);

  return function (files, metalsmith, done) {
    Object.keys(files).forEach(function (file) {
      if ('.html' != extname(file)) return;

      var data = files[file],
        contents = data.contents.toString(),
        $ = cheerio.load(contents);
      data.headings = [];

      $(options.headings.join(',')).each(function (element, index) {
        if ($(this).attr('id') == '') $(this).attr('id', 'heading-' + index)
        var parents = null,
          parent = null,
          childContent = null,
          heading = {
            id: $(this).attr('id'),
            tag: $(this)[0].name,
            text: $(this).text()
          };

        heading.priority = options.headings.indexOf(heading.tag);

        if (heading.priority > 0 && data.headings.length) {
          parents = findParents(data.headings, heading);

          if (parents && parents.length) {
            parent = parents[parents.length - 1];
            parent.children = parent.children || [];
            parent.children.push(heading);
          }
        } else {
          data.headings.push(heading);
        }

        childContent = $(this).nextUntil(options.headings.slice(0, heading.priority + 1).join(','));
        if (childContent.length) {
          var div = $("<div></div>");
          div.attr('id', options.divId.replace('%s', heading.id));
          div.append(childContent);
          div.attr(options.divAttrs);

          $(this).after(div);
        }
      });

      data.contents = Buffer.from($.html(), 'utf8');
    });

    done();
  };
}

function findParents(headings, heading) {
  var results = [];

  headings.forEach(function (h) {
    if (h.priority < heading.priority) {
      results.push(h);
    }
    
    if (h.children) {
      results = results.concat(findParents(h.children, heading));
    }
  });

  return results;
}