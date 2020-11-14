'use strict';

var cheerio = require('cheerio');

function renderer(data, options) {
    var _this = this
    return new Promise(function(resolve, reject) {
        _this.log.debug("render data.path", data.path);

        const $ = cheerio.load(data.text, {
            ignoreWhitespace: false,
            xmlMode: false,
            lowerCaseTags: false,
            decodeEntities: true,
        });

        var script = "<script>if(document.getElementsByClassName('tc-tiddler-body')) \
{ document.getElementsByClassName('page')[0].className += ' wiki' } </script>";

        resolve(script + cheerio.html($('.tc-tiddler-body'), {decodeEntities: false}));
      });
}

function convert(data, hexo) {
    return new Promise((resolve, reject) => {
        var config = hexo.config;
        if (config.org.daemonize) {
            emacs.client(hexo, data, resolve);
        }
        else {
            emacs.process(hexo, data, resolve);
        }
    });
}

module.exports = renderer;
