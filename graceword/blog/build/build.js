'use strict';

/**
 * GraceWord 博客构建入口 —— 委托给共享引擎 shared/build/blog-builder.js。
 * 环境变量：SITE_URL / NOINDEX=1 / OUT_DIR（同旧 build.js）。
 */
const builder = require('../../../shared/build/blog-builder.js');
const config = require('./graceword-config.js');

builder.build(config);
