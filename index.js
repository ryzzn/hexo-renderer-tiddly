'use strict';
var renderer = require('./lib/renderer');
var read_info = require('./lib/read-info');

hexo.config.tid = Object.assign({
  emacs: 'emacs',
  emacsclient: 'emacsclient',   // user should not setup this if renderer work correctly
  common: '#+OPTIONS: toc:nil num:nil\n#+BIND: org-html-postamble nil',
  export_cfg: "(progn (package-initialize)(require 'org) (require 'org-clock) (require 'ox))", // FIXME: why not remove this ?
  cachedir: './hexo-org-cache/',
  clean_cache: false,            // enable this to make 'hexo clean' also clean the cache
  theme: '',
  user_config: '',
  htmlize: false,
  line_number: false,
  daemonize: true,              // set false to disable use emacs server
  debug: false
}, hexo.config.tid);

var Func = renderer.bind(hexo)
Func.disableNunjucks = true
hexo.extend.renderer.register('tidhtml', 'html', Func, false);
hexo.extend.filter.register('before_post_render', read_info);
