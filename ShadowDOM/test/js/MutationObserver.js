/*
 * Copyright 2013 The Polymer Authors. All rights reserved.
 * Use of this source code is goverened by a BSD-style
 * license that can be found in the LICENSE file.
 */

suite('MutationObserver', function() {

  var wrap = ShadowDOMPolyfill.wrap;
  var addedNodes = [], removedNodes = [];
  var div;

  function newValue() {
    return Date.now();
  }

  setup(function() {
    addedNodes = [];
    removedNodes = [];
  });

  teardown(function() {
    addedNodes = undefined;
    removedNodes = undefined;
    if (div) {
      if (div.parentNode)
        div.parentNode.removeChild(div);
      div = undefined;
    }
  });

  function mergeRecords(records) {
    records.forEach(function(record) {
      if (record.addedNodes)
        addedNodes.push.apply(addedNodes, record.addedNodes);
      if (record.removedNodes)
        removedNodes.push.apply(removedNodes, record.removedNodes);
    });
  }

  test('target', function(done) {
    if (!window.MutationObserver) {
      done();
      return;
    }

    var div = document.createElement('div');

    var mo = new MutationObserver(function(records, observer) {
      assert.equal(this, mo);
      assert.equal(observer, mo);
      assert.equal(records[0].type, 'attributes');
      assert.equal(records[0].target, div);
      mo.disconnect();
      done();
    });
    mo.observe(div, {
      attributes: true
    });
    div.setAttribute('a', newValue());
  });

  test('addedNodes', function(done) {
    if (!window.MutationObserver) {
      done();
      return;
    }

    div = document.body.appendChild(document.createElement('div'));

    var mo = new MutationObserver(function(records, observer) {
      mergeRecords(records);
      assert.equal(records[0].type, 'childList');
      assert.equal(records[0].target, div);
      assert.equal(addedNodes.length, 2);
      assert.equal(addedNodes[0], a);
      assert.equal(addedNodes[1], b);
      mo.disconnect();
      done();
    });
    mo.observe(div, {
      childList: true
    });
    div.innerHTML = '<a></a><b></b>';
    var a = div.firstChild;
    var b = div.lastChild;
  });

  test('addedNodes siblings', function(done) {
    if (!window.MutationObserver) {
      done();
      return;
    }

    div = document.body.appendChild(document.createElement('div'));

    var mo = new MutationObserver(function(records, observer) {
      mergeRecords(records);
      assert.equal(records.length, 1);
      assert.equal(records[0].type, 'childList');
      assert.equal(records[0].target, div);
      assert.equal(addedNodes.length, 1);
      assert.equal(addedNodes[0], c);
      assert.equal(records[0].previousSibling, a);
      assert.equal(records[0].nextSibling, b);
      mo.disconnect();
      done();
    });
    div.innerHTML = '<a></a><b></b>';
    var a = div.firstChild;
    var b = div.lastChild;

    mo.observe(div, {
      childList: true
    });

    var c = document.createElement('c');
    div.insertBefore(c, b);

  });

  test('removedNodes', function(done) {
    if (!window.MutationObserver) {
      done();
      return;
    }

    div = document.body.appendChild(document.createElement('div'));

    var mo = new MutationObserver(function(records, observer) {
      mergeRecords(records);
      assert.equal(records[0].type, 'childList');
      assert.equal(records[0].target, div);
      assert.equal(addedNodes.length, 2);
      assert.equal(addedNodes[0], c);
      assert.equal(addedNodes[1], d);
      assert.equal(removedNodes.length, 2);
      assert.equal(removedNodes[0], a);
      assert.equal(removedNodes[1], b);
      mo.disconnect();
      done();
    });

    div.innerHTML = '<a></a><b></b>';
    var a = div.firstChild;
    var b = div.lastChild;

    mo.observe(div, {
      childList: true
    });

    div.innerHTML = '<c></c><d></d>';
    var c = div.firstChild;
    var d = div.lastChild;
  });

  test('removedNodes siblings', function(done) {
    if (!window.MutationObserver) {
      done();
      return;
    }

    div = document.body.appendChild(document.createElement('div'));

    var mo = new MutationObserver(function(records, observer) {
      mergeRecords(records);
      assert.equal(records.length, 1);
      assert.equal(records[0].type, 'childList');
      assert.equal(removedNodes.length, 1);
      assert.equal(records[0].previousSibling, a);
      assert.equal(records[0].nextSibling, c);
      mo.disconnect();
      done();
    });

    div.innerHTML = '<a></a><b></b><c></c>';
    var a = div.firstChild;
    var b = a.nextSibling;
    var c = div.lastChild;

    mo.observe(div, {
      childList: true
    });

    div.removeChild(b);
  });

  test('observe document', function(done) {
    if (!window.MutationObserver) {
      done();
      return;
    }

    var mo = new MutationObserver(function(records, observer) {
      assert.equal(this, mo);
      assert.equal(observer, mo);
      assert.equal(records[0].type, 'attributes');
      assert.equal(records[0].target, wrap(document).body);
      mo.disconnect();
      done();
    });
    mo.observe(document, {
      attributes: true,
      subtree: true
    });

    document.body.setAttribute('a', newValue());
  });

  test('observe document.body', function(done) {
    if (!window.MutationObserver) {
      done();
      return;
    }

    var mo = new MutationObserver(function(records, observer) {
      assert.equal(this, mo);
      assert.equal(observer, mo);
      assert.equal(records[0].type, 'attributes');
      assert.equal(records[0].target, wrap(document).body);
      mo.disconnect();
      done();
    });
    mo.observe(document.body, {
      attributes: true
    });

    document.body.setAttribute('a', newValue());
  });

  test('observe document.head', function(done) {
    if (!window.MutationObserver) {
      done();
      return;
    }

    var mo = new MutationObserver(function(records, observer) {
      assert.equal(this, mo);
      assert.equal(observer, mo);
      assert.equal(records[0].type, 'attributes');
      assert.equal(records[0].target, wrap(document).head);
      mo.disconnect();
      done();
    });
    mo.observe(document.head, {
      attributes: true
    });

    document.head.setAttribute('a', newValue());
  });

});
