/**
 * Asterisk-installer.
 */
"use strict";
var Menu = require('./Menu');
var data = require("./data.json");
var menu = new Menu( data ).run();
