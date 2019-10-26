var cdnPath = 'https://cdn.ad4game.com';
var charset;
var el = document.createElement('SCRIPT')
    , body = document.body
    , asyncAjsSrc = cdnPath + '/async-ajs.min.js'
    , isAsyncPresent = (function (scripts, asyncAjsSrc) {
        for (var i = 0; i < scripts.length; i++) {
            if (scripts[i].src === asyncAjsSrc) {
                return true;
            }
        }
        return false;
    }(document.getElementsByTagName('SCRIPT'), asyncAjsSrc));
if (!isAsyncPresent) {
    el.type = 'text/javascript';
    el.async = true;
    el.src = asyncAjsSrc;
    if (charset) {
        el.setAttribute('data-a4g-charset', charset);
    }
    body.appendChild(el);
}