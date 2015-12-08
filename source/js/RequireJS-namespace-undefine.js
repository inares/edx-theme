// https://github.com/edx/edx-platform/blob/337eabbb00fdf580522b07752905854d701c3795/common/static/js/RequireJS-namespace-undefine.js

window.RequireJS = window.RequireJS || {};
RequireJS.requirejs = RequireJS.requirejs || window.requirejs;
RequireJS.require = RequireJS.require || window.require;
RequireJS.define = RequireJS.define || window.define;

window.require = undefined;
window.define = undefined;
window.requirejs = undefined;