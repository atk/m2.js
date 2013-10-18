/* m² 0.0.1 - modular JS micro framework (c) 2013 by Alex Kloss */
!function (p, d, q, g, j, a, c, e, r) {
/*
	Initialisation:
	- instantiation with "new" if necessary
	- DOM queries vs. other functions (handled via "i"nit method)

	m([DOM query, Array, DOM node, onready callback function], [opt: DOM query base])
*/
m = function (q, b) { return this instanceof m ? q + '' === q ? m(b || d).find(q) : this.i(q) : new m(q, b) }
m[p] = {
	// basic length
	length: 0,
	// initialisation for everything but functions or DOM queries
	i: function (q) { q && a.push.apply(this, q.nodeType ? [q] : /^f/.test(typeof q) ? m(d).r(q) : q.length ? q : []) },
	// DOMready
	r: function (f) { (function t(){ /c/.test(d.readyState) ? f() : setTimeout(t, 99) })(); return this },
	// Iterator
	each: function (a) {
		return m.each(this, a)
	},
	// Filtering m(...).filter([function returning either true to keep the node or something like an Array to replace it])
	filter: function (f, r) {
		r = []
		this.each(function (n, i, c, o) {
			c = f ? f.call(n,n,i) : !0
			c = c === !0 ? [n] : c || []
			for (o = c.length; o--; i < 0 && r.push(n))
				for (n = c[o], i = r.length; i-- && n !== r[i];);
		})
		r.reverse()
		return a.push.apply(o = new m([]), r), o
	},
	// DOM (sub)query
	find: function (c, b, s, n, o, x) {
		try {
			return this.filter(function (n){ return n[q](c) })
		} catch (e) {
			s = []
			o = this
			n = o.filter()
			r.lastIndex = 1;
			(' '+c+',').replace(r, function (_, a, b, c, d, e, f) {
				_ && (a == ',' ? (n.each(function (n) { s.push(n) }), n = o.filter()) : (a = m.s[b == ':' ? c : b == '[' ? d || b : a ? a : b]) ? (a = a.call(n, c, d, e, f)) ? (n = n.filter(a)) : (x = 'filter call failed') : (x = 'no matching filter found'))
				if (x) throw x;
			})
			return m(s).filter();
		}
	},	
	// DOM event binding
	on: function (t, c, h) {
		this.each(function (n, e, h, a) {
			n = m(n), e = n.attr('data-events')
			e || (e = {	handler: (h = function (e, r) { return m[p].each.call(n.attr('data-events')[t] || [], function (c) { 
				r = c.call(n[0], e || window.event) === !1 && r 
			}), !r }) }, n[0][a = 'addEventListener'] ? n[0][a](t, h) : n[0].attachEvent('on' + t, h))
			e[t] = e[t] || []
			e[t].push(c)
			n.attr('data-events', e)
		});
	},
	// DOM event unbinding
	off: function (t, c) {
		this.each(function (n, e, r) {
			n = m(n), e = n.attr('data-events') || {}
			c ? m[p].filter.call(e[t], function () { return this != c }) : e[t] = []
			if (!e[t] || !e[t].length) n[0][r = 'removeEventListener'] ? n[0][r](t, e.handler) : n[0].detachEvent('on' + t, e.handler)
			n.attr('data-events', e)
		})
	},
	// read/write HTML
	html : function(h, u){ return h === u ? this[0].innerHTML : this.each(function (n) { n.innerHTML = h }) },
	// get/set Attributes
	attr: function(k, v, u){
		if (v === u && '' + k !== (k || '')) {
			for (v in k) this.attr(v, k[v])
			return this
		}
		return k !== u && v !== u ? this.each(function () { this.setAttribute(k, this[k] = v); }) : this[0] ?
		  	this[0][k] || this[0].getAttribute(k) || '' : ''
	},
	// get/set CSS attributes
	css: function(k, v){
		if (!v && '' + k !== (k || '')) {
			for (v in k) this.css(v, k[v])
			return this
		}
		return k && v ? this.each(function () { this.style[k] = v; }) : !this[0] ? '' :
		  	this[0][v='currentStyle'] ? this[0][v][k] : window.getComputedStyle(this[0])[k] || this[0].style[k]
	},
	// has/add/remove/toggle class names (convenience functions below)
	cls: function (v, n, t, c, r) {
		t = this[0],
		r = t[c = 'className'].replace(eval('/\\b'+n+'\\b/g'), '')
		return 'has' == v ? r != t[c] : (t[c] = { add: 1, toggle: r == t[c] }[v] ? r + ' ' + n : r, this)
	},
	// convenient AJAX loading
	load: function (u, t, c) {
		t = this,
		c = function (h) {
			h = this.responseText
			t.each(function (n) { n.innerHTML = h })
		}
		m.ajax(u.url ? (u.callback = c, u) : { url: u, callback: c });
	},
	// this makes most development consoles interpret the output as Array
	splice: a.splice
}
// class name convenience functions
'has add remove toggle'.replace(/\w+/g, function(x) {
	if (x) m[p][x+'Class'] = function (c) { return this.cls(x, c) }
})
// Selector functions: each returns a function that will be used to filter the output (re-use where possible and reasonable)
m.s = {
	'[': function (k, c, v, i) {
		v = c ? new RegExp((({ '^=': '^', '~=': '(^|\\s)', '=': '^', '!=': '^', '|=': '^' })[c] || '') +
			((v || '').replace(/[.+*()]/g, '\\\1') || '.+') +
			(({ '$=': '$', '=': '$', '!=': '$', '~=': '(\\s|$)', '|=': '(-|$)' })[c] || ''), i) : /.+/;
		return function(n){ return !!(v.test(n[k] || n.getAttribute(k)) ^ (c == '!=')) };
	},
	'nth-of-type': function (n, s, i, c, l) {
		c = c == 'odd' ? '2n+1' : c == 'even' ? '2n+0' : c;
		/(\d+)(n\+(\d*)|)/.test(c) && (i = RegExp.$1, s = RegExp.$3);
		return function (t, c) {
			for (t = this.parentNode[g](n || this.nodeName), c = l ? t.length - i + s : i - s; l ? (c -= s >= 0) : (c += s < t.length);) if (t[c] == this) return !0
		}
	},
	'nth-last-of-type': function (n, s, i, c) { return t.s['nth-of-type'](c, s, i, n, 1) },
	'nth-child': function (_, a, b, c) { return t.s['nth-of-type'](c,0,0,'*') },
	'nth-last-child': function (_, a, b, c) { return t.s['nth-last-of-type'](c,0,0,'*') },
	'first-child': function () { return function(){ return this.parentNode[g]('*')[0] == this } },
	'last-child': function () { return function(n){ return n=this.parentNode[g]('*'), n[n.length-1] == this } },
	'first-of-type': function () { return function(){ return this.parentNode[g](this.nodeName)[0] == this } },
	'last-of-type': function () { return function(n){ return n=this.parentNode[g](this.nodeName), n[n.length-1] == this } },
	'only-child': function () { return function(){ return this.parentNode[g]('*').length == 1 } },
	'only-of-type': function () { return function(){ return this.parentNode[g](this.nodeName).length == 1 } },
	empty: function () { return function () { return !this.childNodes.length } },
	target: function (t) { return this['[']('id', '=', /^#(.+)$/.test(location.search) ? RegExp.$1 : '#') },
	lang: function () { return this['[']('lang', '|=', l, 'i') },
	enabled: function () { return function () { return !this.disabled } },
	disabled: function () { return function () { return this.disabled } },
	checked: function () { return function () { return this.checked } },
	not: function (_, a, b, n) { return n = t(n), function (l) { for (l = 0; n[l];) if (n[l++] == this) return !1; return !0 } },
	root: function() { return function(n){ return n == d.documentElement } },
	has: function(_, a, b, q) { return function(n){ return t(n).find(q).length > 0 } },
	contains: function (a, t, r, c) {
		t = function(n, r){ return n ? (n.nodeType == 3 && r.push(n.data), t(n.firstChild, r), t(n.nextSibling, r)) : r }
		return function(n) { return !!~t(n, r = []).join('').indexOf(c) }
	},
	hidden: function () { return function (n) { return !n.offsetWidth*n.offsetHeight } },
	visible: function () { return function (n) { return !!n.offsetWidth*n.offsetHeight } },
	odd: function() { return t.s['nth-child']('odd') },
	even: function() { return t.s['nth-child']('even') },
	eq: function(_, a, b, i) { i|=0; return function(){ return !i-- } },
	first: function() { return t.s.eq(0) },
	last: function() { return t.s.eq(this.length-1) },
	seq: function(_, i, l, s) { return s = s.split(','), s[1] = s[1] || this.length, function(n, i){ return i >= s[0] && i <= s[1] } },
	gt: function(_, a, b, i) { return t.s.seq(''+i) },
	lt: function(_, a, b, i) { return t.s.seq('0,'+i) },
	'#': function (n) { return function (t){ return t.id === n } },
	'.': function (n) { return t.s['[']('className', '*=', n) },
	'': function (n) { return t.s['[']('nodeName', '=', n, 'i') },
	'*': function () { return function (n) { return n[g]('*') } },
	'>': function () { return function (n, r, c) {
		for (r = [], n = n.childNodes, c = 0; n[c]; c++) n[c].nodeType == 1 && r.push(n[c]);
		return r }
	},
	'+': function () { return function (n) { for (;n = n.nextSibling;) if (n[c].nodeType == 1) return n } },
	'~': function () { return function (n, r) {
		for (r = []; n = n.nextSibling; n[c].nodeType == 1 && r.push(n));
		return r }
	}
}
// extra selectors
m.s[' '] = m.s['*']
'checkbox file image password radio reset submit text'.replace(/\w+/g, function (x) {
	if (x) m.s[x] = function() { return m.s['[']('type', '=', x, 'i') }
});
// Iterator: m.each([object/array], [callback])
m.each = function (a, b, c, d) {
	if (a instanceof Array || a instanceof m) for (c = 0, d = a.length; c < d; ++c) b.call(a[c], a[c], c, a);
	else for (c in a) b.call(a[c], a[c], c, a);
	return a
}
/* Ajax: 
	m.ajax({ 
		url: '[required: url string]', 
		method: '[optional: get*|post|head]', 
		callback: [optional: function],
		user: [optional: username string],
		password: [optional: password string],
		data: [optional: data string]
	}) 
	returns RequestObject for synchronous or asynchronous use (latter only if callback is specified)
*/
m.ajax = function (o, x) {
	x = new XMLHttpRequest()
	x.open(o.method || 'get', o.url, o.callback && (x.onreadystatechange = o.callback), o.user, o.password)
	x.send(o.data)
	return x
}
/* JSONp:
	m.jsonp({
		url: '[required: url string]',
		callback: [optional: callback function],
		"_": '[optional: callback name - do not use unless you know what you are doing]'
	})
*/
m.jsonp = function (o, h, s) {
	h = d[g]('head')[0],
	s = d.createElement(j),
	o.callback && (this[o._ = o._ || j + 0 | i++ * new Date()] = function(){
		h.removeChild(s)
		o.callback.apply(this, arguments)
		delete this[[]._]
	}),
	s.src = o.url.replace(/\??$/, o._),
	h.appendChild(s)
	return s
}
/* Cookie
   	m.cookie([required:cookie name string]) // returns cookie if set or ''
   	m.cookie({
		name: '[required: cookie name string]',
		value: '[required: cookie value string]',
		date: [optional: Date() object or time in milliseconds until expiry],
		domain: '[optional: domain string]',
		path: '[optional: path string]',
		extra: '[optional: extra string, e.g. "secure"]'
   	}) // sets cookie based on object
*/
m[c] = function (o) {
	if ('' + o === o)
		return (new RegExp('(^|[ ;])'+e(o)+'=([^;]+)')).test(d[c]) && unescape(RegExp.$2);
	o && o.name && o.value && (d[c] = e(o.name) + '=' + e(o.value) +
		(o.date ? ('; expires=' + (o.date instanceof Date ? o.date : new Date(new Date() * 1 + o.date)).toGMTString()) : '') +
		(o.domain ? ('; domain=' + o.domain) : '') +
		(o.path ? '; path=' + o.path : '') +
		(o.extra || '') + ';')
}
}(
	'prototype',
	document,
	'querySelectorAll',
	'getElementsByTagName',
	'script',
	[],
	'cookie',
	escape,
	/* 
		CSS3 Selector RegExp (matches a-f)

		a=[>~* +,] (traversal),
		b=[[#.:[]""] (marker: id, class, attr, pseudo, tag if empty),
		c=name,
		d="(" for pseudo, comparison for attr,
		e=attribute value
		f=pseudo value
	*/
	/\s*([,>~* +])\s*|([#.:[]?)([0-9A-Za-z-_]+)(?:([*\|\~\^\$!]?=)([^\]]+)\]|\(([^)]*)\)|)/g
);
