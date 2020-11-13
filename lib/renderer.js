'use strict';

var cheerio = require('cheerio');
var util = require('hexo-util');
var os = require('os');
var iconv = require('iconv-lite');
var jsonfile = require('jsonfile');
var md5 = require('md5');
var fs = require('fs-extra');
var tmp = require('tmp');
var path = require('path');
var highlight = util.highlight;

const { resolve } = require('path');

function get_content(elem){
    elem('h1.title').remove();
    var r = "";
    var to_export = ['div#preamble', 'div#content', 'div#postamble'];
    for(var i=0;i<to_export.length;i++){
        var item = elem(to_export[i]);
        // http://stackoverflow.com/questions/31044/is-there-an-exists-function-for-jquery
        if(item.length){
            r += item.html();
        }
    }
    return r;
}

function render_html(html, config) {
    return new Promise((reslove, reject) => {

        // for use 'htmlize' to syntax highlight code block
        if (config.org.htmlize)
            reslove(html);

        // for use 'highlight.js' to syntax highlight code block (default)
        config.highlight = config.highlight || {};
        var $ = cheerio.load(html, {
            ignoreWhitespace: false,
            xmlMode: false,
            lowerCaseTags: false,
            decodeEntities: true
        });


        $('pre.src').each(function() {
            var text; // await highlight code text
            var lang = 'unknown';
            var code = $(this);
            var class_str = code.attr('class');
            if (class_str.startsWith('src src-')) {
                lang = class_str.substring('src src-'.length);
            }
            // In ox-hexml.el, I return the line-number with code text, we need to remove first-line to
            // get line-number info

            // remove first line
            var lines = code.text().split('\n');

            var firstLine = parseInt(lines[0]) + 1;

            var gutter;// = config.org.line_number;
            if (config.org.line_number)
                gutter = true;
            else {
                gutter = (firstLine == 0) ? false : true;
            }

            // remove first line
            lines.splice(0,1);
            // remove newline
            text = lines.join('\n').replace(/\n$/g,'');

            // USE hexo.utils to render highlight.js code block
            $(this).replaceWith( highlight(text, {
                gutter: gutter,
                autoDetect: config.highlight.auto_detect,
                firstLine: firstLine,
                lang: lang
            }));
        });

        //reslove(get_content($));
        reslove($.html({decodeEntities: false}));
    });
}

function renderer(data, options) {
    var _this = this
    return new Promise(function(resolve, reject) {
        _this.log.info("render data.path", data.path);

        const $ = cheerio.load(data.text, {
            ignoreWhitespace: false,
            xmlMode: false,
            lowerCaseTags: false,
            decodeEntities: false,
        });

        resolve($('.tc-tiddler-body').html());
        //resolve($.html())
        //resolve(data.text);
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
