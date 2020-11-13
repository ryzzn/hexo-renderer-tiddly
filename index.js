'use strict';
var renderer = require('./lib/renderer');
var read_info = require('./lib/read-info');
const exec = require("child_process").execSync;

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

function generate_tidhtml() {
  hexo.log.info("begin generate tidhtml file");
  var result = exec("cd $HOME/Documents/wiki/main && sh build.sh")
  hexo.log.info(result.toString('utf-8').trimEnd());
  hexo.log.info("generate tidhtml done\n")
}

var Func = renderer.bind(hexo)
Func.disableNunjucks = true
hexo.extend.renderer.register('tidhtml', 'html', Func, false);
hexo.extend.filter.register('before_post_render', read_info);
hexo.extend.filter.register('after_init', () => {
  // regenerate tidhtml only if in this mode:
  //   hexo s
  //   hexo server
  //   hexo render
  //   hexo generator
  //   hexo g
  if (process.argv.indexOf('render') > 0 || process.argv.indexOf('generate') > 0 || process.argv.indexOf('g') > 0) {
    // start emacs server
    generate_tidhtml();
  }
});