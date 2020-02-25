"use strict";

/* foo v1.1.1 */

// prototypes

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};

Element.prototype.remove = function() {
    this.parentElement.removeChild(this);
}
NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
    for(var i = this.length - 1; i >= 0; i--) {
        if(this[i] && this[i].parentElement) {
            this[i].parentElement.removeChild(this[i]);
        }
    }
}

// SELECT

function _(selector, src) {
  if (src === undefined) {
    src = document;
  }
  return src.querySelector(selector);
}
function __(selector) {
  return document.querySelectorAll(selector);
}

// waiting for document to be ready

function ready(callback) {
  // in case the document is already rendered
  if (document.readyState !== 'loading') callback();
  // modern browsers
  else if (document.addEventListener) document.addEventListener('DOMContentLoaded', callback);
  // IE <= 8
  else document.attachEvent('onreadystatechange', function () {
      if (document.readyState === 'complete') callback();
    });
}

// CLASS

function addClass(el, className) {
  if (!el) return;
  if (el.classList)
    el.classList.add(className);
  else
    el.className += ' ' + className;
}
function removeClass(el, className) {
  if (!el) return;
  if (el.classList)
    el.classList.remove(className);
  else
    el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
}
function toggleClass(el, addedClass) {
  if (!el) return;
  if (el.classList.contains(addedClass)) {
    el.classList.remove(addedClass);
  }
  else {
    el.classList.add(addedClass);
  }
};

// SHOW/HIDE

function show(elem) {
  elem.style.display = 'block';
};

// Hide an element
function hide(elem) {
  elem.style.display = 'none';
};


// set the hash
function pushHash(hashName) {
  if (history.pushState) {
    history.pushState(null, null, '#' + hashName);
  } else {
    location.hash = '#' + hashName;
  }
}


// AJAX

function ajax(url, fn, onerror) {
  var request = new XMLHttpRequest();
  request.open('GET', url, true);

  request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
      // Success!
      var data = JSON.parse(request.responseText);
      fn(data);
    } else {
      // We reached our target server, but it returned an error
      if (onerror) onerror(request);
    }
  };
  request.onerror = onerror;
  request.send();
}
