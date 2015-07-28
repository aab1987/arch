function CSSScanner(e) {
    this.init(e)
}

function CSSParser(e) {
    this.mToken = null, this.mLookAhead = null, this.mScanner = new CSSScanner(e), this.mPreserveWS = !0, this.mPreserveComments = !0, this.mPreservedTokens = [], this.mError = null
}

function jscsspToken(e, t, n) {
    this.type = e, this.value = t, this.unit = n
}

function jscsspStylesheet() {
    this.cssRules = [], this.variables = {}
}

function jscsspCharsetRule() {
    this.type = kJscsspCHARSET_RULE, this.encoding = null, this.parsedCssText = null, this.parentStyleSheet = null, this.parentRule = null
}

function jscsspErrorRule(e) {
    this.error = e ? e : "INVALID", this.type = kJscsspUNKNOWN_RULE, this.parsedCssText = null, this.parentStyleSheet = null, this.parentRule = null
}

function jscsspComment() {
    this.type = kJscsspCOMMENT, this.parsedCssText = null, this.parentStyleSheet = null, this.parentRule = null
}

function jscsspWhitespace() {
    this.type = kJscsspWHITE_SPACE, this.parsedCssText = null, this.parentStyleSheet = null, this.parentRule = null
}

function jscsspImportRule() {
    this.type = kJscsspIMPORT_RULE, this.parsedCssText = null, this.href = null, this.media = [], this.parentStyleSheet = null, this.parentRule = null
}

function jscsspNamespaceRule() {
    this.type = kJscsspNAMESPACE_RULE, this.parsedCssText = null, this.prefix = null, this.url = null, this.parentStyleSheet = null, this.parentRule = null
}

function jscsspDeclaration() {
    this.type = kJscsspSTYLE_DECLARATION, this.property = null, this.values = [], this.valueText = null, this.priority = null, this.parsedCssText = null, this.parentStyleSheet = null, this.parentRule = null
}

function jscsspFontFaceRule() {
    this.type = kJscsspFONT_FACE_RULE, this.parsedCssText = null, this.descriptors = [], this.parentStyleSheet = null, this.parentRule = null
}

function jscsspKeyframesRule() {
    this.type = kJscsspKEYFRAMES_RULE, this.parsedCssText = null, this.cssRules = [], this.name = null, this.parentStyleSheet = null, this.parentRule = null
}

function jscsspKeyframeRule() {
    this.type = kJscsspKEYFRAME_RULE, this.parsedCssText = null, this.declarations = [], this.keyText = null, this.parentStyleSheet = null, this.parentRule = null
}

function jscsspMediaRule() {
    this.type = kJscsspMEDIA_RULE, this.parsedCssText = null, this.cssRules = [], this.media = [], this.parentStyleSheet = null, this.parentRule = null
}

function jscsspStyleRule() {
    this.type = kJscsspSTYLE_RULE, this.parsedCssText = null, this.declarations = [], this.mSelectorText = null, this.parentStyleSheet = null, this.parentRule = null
}

function jscsspPageRule() {
    this.type = kJscsspPAGE_RULE, this.parsedCssText = null, this.pageSelector = null, this.declarations = [], this.parentStyleSheet = null, this.parentRule = null
}

function jscsspVariablesRule() {
    this.type = kJscsspVARIABLES_RULE, this.parsedCssText = null, this.declarations = [], this.parentStyleSheet = null, this.parentRule = null, this.media = null
}

function jscsspVariable(e, t) {
    this.value = "", this.type = e, this.name = null, this.parentRule = null, this.parentStyleSheet = t
}

function ParseURL(e) {
    var t = {};
    t.protocol = "", t.user = "", t.password = "", t.host = "", t.port = "", t.path = "", t.query = "";
    for (var n = "PROTOCOL", i = 0, r = !1; i < e.length;)
        if ("PROTOCOL" == n) ":" == e.charAt(i) ? (n = "AFTER_PROTOCOL", i++) : "/" == e.charAt(i) && 0 == t.protocol.length() ? n = PATH : t.protocol += e.charAt(i++);
        else if ("AFTER_PROTOCOL" == n) {
        if ("/" != e.charAt(i)) throw new ParseException("Protocol shell be separated with 2 slashes");
        r ? (r = !1, n = "USER") : r = !0, i++
    } else "USER" == n ? "/" == e.charAt(i) ? (t.host = t.user, t.user = "", n = "PATH") : "?" == e.charAt(i) ? (t.host = t.user, t.user = "", n = "QUERY", i++) : ":" == e.charAt(i) ? (n = "PASSWORD", i++) : "@" == e.charAt(i) ? (n = "HOST", i++) : t.user += e.charAt(i++) : "PASSWORD" == n ? "/" == e.charAt(i) ? (t.host = t.user, t.port = t.password, t.user = "", t.password = "", n = "PATH") : "?" == e.charAt(i) ? (t.host = t.user, t.port = t.password, t.user = "", t.password = "", n = "QUERY", i++) : "@" == e.charAt(i) ? (n = "HOST", i++) : t.password += e.charAt(i++) : "HOST" == n ? "/" == e.charAt(i) ? n = "PATH" : ":" == e.charAt(i) ? (n = "PORT", i++) : "?" == e.charAt(i) ? (n = "QUERY", i++) : t.host += e.charAt(i++) : "PORT" == n ? "/" == e.charAt(i) ? n = "PATH" : "?" == e.charAt(i) ? (n = "QUERY", i++) : t.port += e.charAt(i++) : "PATH" == n ? "?" == e.charAt(i) ? (n = "QUERY", i++) : t.path += e.charAt(i++) : "QUERY" == n && (t.query += e.charAt(i++));
    if ("PROTOCOL" == n) t.host = t.protocol, t.protocol = "http";
    else {
        if ("AFTER_PROTOCOL" == n) throw new ParseException("Invalid url");
        "USER" == n ? (t.host = t.user, t.user = "") : "PASSWORD" == n && (t.host = t.user, t.port = t.password, t.user = "", t.password = "")
    }
    return t
}

function ParseException(e) {
    this.description = e
}

function CountLF(e) {
    var t = e.match(/\n/g);
    return t ? t.length + 1 : 1
}

function FilterLinearGradientForOutput(e, t) {
    if ("generic" == t) return e.substr(5);
    if ("webkit" == t) return e.replace(/\-moz\-/g, "-webkit-");
    if ("webkit20110101" != t) return "";
    var n = CssInspector.parseBackgroundImages(e)[0],
        i = !1,
        r = "-webkit-gradient(linear, ",
        s = "position" in n.value ? n.value.position.toLowerCase() : "",
        o = "angle" in n.value ? n.value.angle.toLowerCase() : "";
    if (o) {
        var a = o.match(/^([0-9\-\.\\+]+)([a-z]*)/),
            o = parseFloat(a[1]),
            l = a[2];
        switch (l) {
            case "grad":
                o = 90 * o / 100;
                break;
            case "rad":
                o = 180 * o / Math.PI
        }
        for (; 0 > o;) o += 360;
        for (; o >= 360;) o -= 360
    }
    var u = [],
        c = [];
    if ("" != s)
        if ("center" == s && (s = "center center"), u = s.split(" "), "" == o && 0 != o) {
            switch (u[0]) {
                case "left":
                    c.push("right");
                    break;
                case "center":
                    c.push("center");
                    break;
                case "right":
                    c.push("left");
                    break;
                default:
                    var a = u[0].match(/^([0-9\-\.\\+]+)([a-z]*)/),
                        p = parseFloat(a[0]),
                        l = a[1];
                    "%" == l ? c.push(100 - p + "%") : i = !0
            }
            if (!i) switch (u[1]) {
                case "top":
                    c.push("bottom");
                    break;
                case "center":
                    c.push("center");
                    break;
                case "bottom":
                    c.push("top");
                    break;
                default:
                    var a = u[1].match(/^([0-9\-\.\\+]+)([a-z]*)/),
                        p = parseFloat(a[0]),
                        l = a[1];
                    "%" == l ? c.push(100 - p + "%") : i = !0
            }
        } else switch (o) {
            case 0:
                c.push("right"), c.push(u[1]);
                break;
            case 90:
                c.push(u[0]), c.push("top");
                break;
            case 180:
                c.push("left"), c.push(u[1]);
                break;
            case 270:
                c.push(u[0]), c.push("bottom");
                break;
            default:
                i = !0
        } else switch ("" == o && (o = 270), o) {
            case 0:
                u = ["left", "center"], c = ["right", "center"];
                break;
            case 90:
                u = ["center", "bottom"], c = ["center", "top"];
                break;
            case 180:
                u = ["right", "center"], c = ["left", "center"];
                break;
            case 270:
                u = ["center", "top"], c = ["center", "bottom"];
                break;
            default:
                i = !0
        }
        if (i) return "";
    r += u.join(" ") + ", " + c.join(" "), n.value.stops[0].position || (n.value.stops[0].position = "0%"), n.value.stops[n.value.stops.length - 1].position || (n.value.stops[n.value.stops.length - 1].position = "100%");
    for (var d = 0, h = 0; h < n.value.stops.length && !i; h++) {
        var f = n.value.stops[h];
        if (f.position) {
            if (-1 == f.position.indexOf("%")) {
                i = !0;
                break
            }
        } else {
            for (var m = h + 1; m < n.value.stops.length && !n.value.stops[m].position;) m++;
            for (var g = parseFloat(n.value.stops[m].position) - d, b = h; m > b; b++) n.value.stops[b].position = d + g * (b - h + 1) / (m - h + 1) + "%"
        }
        d = parseFloat(f.position), r += ", color-stop(" + parseFloat(d) / 100 + ", " + f.color + ")"
    }
    return i ? "" : r + ")"
}

function FilterRadialGradientForOutput(e, t) {
    if ("generic" == t) return e.substr(5);
    if ("webkit" == t) return e.replace(/\-moz\-/g, "-webkit-");
    if ("webkit20110101" != t) return "";
    var n = CssInspector.parseBackgroundImages(e)[0],
        i = "shape" in n.value ? n.value.shape : "",
        r = "size" in n.value ? n.value.size : "";
    if ("circle" != i || "farthest-corner" != r && "cover" != r) return "";
    if (!(!(n.value.stops.length < 2) && "position" in n.value.stops[0] && n.value.stops[n.value.stops.length - 1].position && "position" in n.value.stops[0] && n.value.stops[n.value.stops.length - 1].position)) return "";
    for (var s = 0; s < n.value.stops.length; s++) {
        var o = n.value.stops[s];
        if ("position" in o && o.position && -1 == o.position.indexOf("px")) return ""
    }
    var a = "-webkit-gradient(radial, ",
        l = "position" in n.value ? n.value.position : "center center";
    a += l + ", " + parseFloat(n.value.stops[0].position) + ", ", a += l + ", " + parseFloat(n.value.stops[n.value.stops.length - 1].position);
    for (var u = parseFloat(n.value.stops[0].position), s = 0; s < n.value.stops.length; s++) {
        var o = n.value.stops[s];
        if (!("position" in o && o.position)) {
            for (var c = s + 1; c < n.value.stops.length && !n.value.stops[c].position;) c++;
            for (var p = parseFloat(n.value.stops[c].position) - u, d = s; c > d; d++) n.value.stops[d].position = u + p * (d - s + 1) / (c - s + 1) + "px"
        }
        u = parseFloat(o.position);
        var h = (u - parseFloat(n.value.stops[0].position)) / (parseFloat(n.value.stops[n.value.stops.length - 1].position) - parseFloat(n.value.stops[0].position));
        a += ", color-stop(" + h + ", " + o.color + ")"
    }
    return a += ")"
}

function FilterRepeatingGradientForOutput(e, t) {
        return "generic" == t ? e.substr(5) : "webkit" == t ? e.replace(/\-moz\-/g, "-webkit-") : ""
    }! function(e, t) {
        "object" == typeof module && "object" == typeof module.exports ? module.exports = e.document ? t(e, !0) : function(e) {
            if (!e.document) throw new Error("jQuery requires a window with a document");
            return t(e)
        } : t(e)
    }("undefined" != typeof window ? window : this, function(e, t) {
        function n(e) {
            var t = e.length,
                n = rt.type(e);
            return "function" === n || rt.isWindow(e) ? !1 : 1 === e.nodeType && t ? !0 : "array" === n || 0 === t || "number" == typeof t && t > 0 && t - 1 in e
        }

        function i(e, t, n) {
            if (rt.isFunction(t)) return rt.grep(e, function(e, i) {
                return !!t.call(e, i, e) !== n
            });
            if (t.nodeType) return rt.grep(e, function(e) {
                return e === t !== n
            });
            if ("string" == typeof t) {
                if (dt.test(t)) return rt.filter(t, e, n);
                t = rt.filter(t, e)
            }
            return rt.grep(e, function(e) {
                return rt.inArray(e, t) >= 0 !== n
            })
        }

        function r(e, t) {
            do e = e[t]; while (e && 1 !== e.nodeType);
            return e
        }

        function s(e) {
            var t = yt[e] = {};
            return rt.each(e.match(kt) || [], function(e, n) {
                t[n] = !0
            }), t
        }

        function o() {
            ft.addEventListener ? (ft.removeEventListener("DOMContentLoaded", a, !1), e.removeEventListener("load", a, !1)) : (ft.detachEvent("onreadystatechange", a), e.detachEvent("onload", a))
        }

        function a() {
            (ft.addEventListener || "load" === event.type || "complete" === ft.readyState) && (o(), rt.ready())
        }

        function l(e, t, n) {
            if (void 0 === n && 1 === e.nodeType) {
                var i = "data-" + t.replace(xt, "-$1").toLowerCase();
                if (n = e.getAttribute(i), "string" == typeof n) {
                    try {
                        n = "true" === n ? !0 : "false" === n ? !1 : "null" === n ? null : +n + "" === n ? +n : Et.test(n) ? rt.parseJSON(n) : n
                    } catch (r) {}
                    rt.data(e, t, n)
                } else n = void 0
            }
            return n
        }

        function u(e) {
            var t;
            for (t in e)
                if (("data" !== t || !rt.isEmptyObject(e[t])) && "toJSON" !== t) return !1;
            return !0
        }

        function c(e, t, n, i) {
            if (rt.acceptData(e)) {
                var r, s, o = rt.expando,
                    a = e.nodeType,
                    l = a ? rt.cache : e,
                    u = a ? e[o] : e[o] && o;
                if (u && l[u] && (i || l[u].data) || void 0 !== n || "string" != typeof t) return u || (u = a ? e[o] = J.pop() || rt.guid++ : o), l[u] || (l[u] = a ? {} : {
                    toJSON: rt.noop
                }), ("object" == typeof t || "function" == typeof t) && (i ? l[u] = rt.extend(l[u], t) : l[u].data = rt.extend(l[u].data, t)), s = l[u], i || (s.data || (s.data = {}), s = s.data), void 0 !== n && (s[rt.camelCase(t)] = n), "string" == typeof t ? (r = s[t], null == r && (r = s[rt.camelCase(t)])) : r = s, r
            }
        }

        function p(e, t, n) {
            if (rt.acceptData(e)) {
                var i, r, s = e.nodeType,
                    o = s ? rt.cache : e,
                    a = s ? e[rt.expando] : rt.expando;
                if (o[a]) {
                    if (t && (i = n ? o[a] : o[a].data)) {
                        rt.isArray(t) ? t = t.concat(rt.map(t, rt.camelCase)) : t in i ? t = [t] : (t = rt.camelCase(t), t = t in i ? [t] : t.split(" ")), r = t.length;
                        for (; r--;) delete i[t[r]];
                        if (n ? !u(i) : !rt.isEmptyObject(i)) return
                    }(n || (delete o[a].data, u(o[a]))) && (s ? rt.cleanData([e], !0) : nt.deleteExpando || o != o.window ? delete o[a] : o[a] = null)
                }
            }
        }

        function d() {
            return !0
        }

        function h() {
            return !1
        }

        function f() {
            try {
                return ft.activeElement
            } catch (e) {}
        }

        function m(e) {
            var t = jt.split("|"),
                n = e.createDocumentFragment();
            if (n.createElement)
                for (; t.length;) n.createElement(t.pop());
            return n
        }

        function g(e, t) {
            var n, i, r = 0,
                s = typeof e.getElementsByTagName !== Tt ? e.getElementsByTagName(t || "*") : typeof e.querySelectorAll !== Tt ? e.querySelectorAll(t || "*") : void 0;
            if (!s)
                for (s = [], n = e.childNodes || e; null != (i = n[r]); r++) !t || rt.nodeName(i, t) ? s.push(i) : rt.merge(s, g(i, t));
            return void 0 === t || t && rt.nodeName(e, t) ? rt.merge([e], s) : s
        }

        function b(e) {
            Rt.test(e.type) && (e.defaultChecked = e.checked)
        }

        function v(e, t) {
            return rt.nodeName(e, "table") && rt.nodeName(11 !== t.nodeType ? t : t.firstChild, "tr") ? e.getElementsByTagName("tbody")[0] || e.appendChild(e.ownerDocument.createElement("tbody")) : e
        }

        function k(e) {
            return e.type = (null !== rt.find.attr(e, "type")) + "/" + e.type, e
        }

        function y(e) {
            var t = Yt.exec(e.type);
            return t ? e.type = t[1] : e.removeAttribute("type"), e
        }

        function S(e, t) {
            for (var n, i = 0; null != (n = e[i]); i++) rt._data(n, "globalEval", !t || rt._data(t[i], "globalEval"))
        }

        function w(e, t) {
            if (1 === t.nodeType && rt.hasData(e)) {
                var n, i, r, s = rt._data(e),
                    o = rt._data(t, s),
                    a = s.events;
                if (a) {
                    delete o.handle, o.events = {};
                    for (n in a)
                        for (i = 0, r = a[n].length; r > i; i++) rt.event.add(t, n, a[n][i])
                }
                o.data && (o.data = rt.extend({}, o.data))
            }
        }

        function T(e, t) {
            var n, i, r;
            if (1 === t.nodeType) {
                if (n = t.nodeName.toLowerCase(), !nt.noCloneEvent && t[rt.expando]) {
                    r = rt._data(t);
                    for (i in r.events) rt.removeEvent(t, i, r.handle);
                    t.removeAttribute(rt.expando)
                }
                "script" === n && t.text !== e.text ? (k(t).text = e.text, y(t)) : "object" === n ? (t.parentNode && (t.outerHTML = e.outerHTML), nt.html5Clone && e.innerHTML && !rt.trim(t.innerHTML) && (t.innerHTML = e.innerHTML)) : "input" === n && Rt.test(e.type) ? (t.defaultChecked = t.checked = e.checked, t.value !== e.value && (t.value = e.value)) : "option" === n ? t.defaultSelected = t.selected = e.defaultSelected : ("input" === n || "textarea" === n) && (t.defaultValue = e.defaultValue)
            }
        }

        function E(t, n) {
            var i, r = rt(n.createElement(t)).appendTo(n.body),
                s = e.getDefaultComputedStyle && (i = e.getDefaultComputedStyle(r[0])) ? i.display : rt.css(r[0], "display");
            return r.detach(), s
        }

        function x(e) {
            var t = ft,
                n = Zt[e];
            return n || (n = E(e, t), "none" !== n && n || (Qt = (Qt || rt("<iframe frameborder='0' width='0' height='0'/>")).appendTo(t.documentElement), t = (Qt[0].contentWindow || Qt[0].contentDocument).document, t.write(), t.close(), n = E(e, t), Qt.detach()), Zt[e] = n), n
        }

        function I(e, t) {
            return {
                get: function() {
                    var n = e();
                    if (null != n) return n ? void delete this.get : (this.get = t).apply(this, arguments)
                }
            }
        }

        function _(e, t) {
            if (t in e) return t;
            for (var n = t.charAt(0).toUpperCase() + t.slice(1), i = t, r = hn.length; r--;)
                if (t = hn[r] + n, t in e) return t;
            return i
        }

        function C(e, t) {
            for (var n, i, r, s = [], o = 0, a = e.length; a > o; o++) i = e[o], i.style && (s[o] = rt._data(i, "olddisplay"), n = i.style.display, t ? (s[o] || "none" !== n || (i.style.display = ""), "" === i.style.display && Ct(i) && (s[o] = rt._data(i, "olddisplay", x(i.nodeName)))) : (r = Ct(i), (n && "none" !== n || !r) && rt._data(i, "olddisplay", r ? n : rt.css(i, "display"))));
            for (o = 0; a > o; o++) i = e[o], i.style && (t && "none" !== i.style.display && "" !== i.style.display || (i.style.display = t ? s[o] || "" : "none"));
            return e
        }

        function N(e, t, n) {
            var i = un.exec(t);
            return i ? Math.max(0, i[1] - (n || 0)) + (i[2] || "px") : t
        }

        function R(e, t, n, i, r) {
            for (var s = n === (i ? "border" : "content") ? 4 : "width" === t ? 1 : 0, o = 0; 4 > s; s += 2) "margin" === n && (o += rt.css(e, n + _t[s], !0, r)), i ? ("content" === n && (o -= rt.css(e, "padding" + _t[s], !0, r)), "margin" !== n && (o -= rt.css(e, "border" + _t[s] + "Width", !0, r))) : (o += rt.css(e, "padding" + _t[s], !0, r), "padding" !== n && (o += rt.css(e, "border" + _t[s] + "Width", !0, r)));
            return o
        }

        function D(e, t, n) {
            var i = !0,
                r = "width" === t ? e.offsetWidth : e.offsetHeight,
                s = en(e),
                o = nt.boxSizing && "border-box" === rt.css(e, "boxSizing", !1, s);
            if (0 >= r || null == r) {
                if (r = tn(e, t, s), (0 > r || null == r) && (r = e.style[t]), rn.test(r)) return r;
                i = o && (nt.boxSizingReliable() || r === e.style[t]), r = parseFloat(r) || 0
            }
            return r + R(e, t, n || (o ? "border" : "content"), i, s) + "px"
        }

        function A(e, t, n, i, r) {
            return new A.prototype.init(e, t, n, i, r)
        }

        function P() {
            return setTimeout(function() {
                fn = void 0
            }), fn = rt.now()
        }

        function L(e, t) {
            var n, i = {
                    height: e
                },
                r = 0;
            for (t = t ? 1 : 0; 4 > r; r += 2 - t) n = _t[r], i["margin" + n] = i["padding" + n] = e;
            return t && (i.opacity = i.width = e), i
        }

        function O(e, t, n) {
            for (var i, r = (yn[t] || []).concat(yn["*"]), s = 0, o = r.length; o > s; s++)
                if (i = r[s].call(n, t, e)) return i
        }

        function j(e, t, n) {
            var i, r, s, o, a, l, u, c, p = this,
                d = {},
                h = e.style,
                f = e.nodeType && Ct(e),
                m = rt._data(e, "fxshow");
            n.queue || (a = rt._queueHooks(e, "fx"), null == a.unqueued && (a.unqueued = 0, l = a.empty.fire, a.empty.fire = function() {
                a.unqueued || l()
            }), a.unqueued++, p.always(function() {
                p.always(function() {
                    a.unqueued--, rt.queue(e, "fx").length || a.empty.fire()
                })
            })), 1 === e.nodeType && ("height" in t || "width" in t) && (n.overflow = [h.overflow, h.overflowX, h.overflowY], u = rt.css(e, "display"), c = "none" === u ? rt._data(e, "olddisplay") || x(e.nodeName) : u, "inline" === c && "none" === rt.css(e, "float") && (nt.inlineBlockNeedsLayout && "inline" !== x(e.nodeName) ? h.zoom = 1 : h.display = "inline-block")), n.overflow && (h.overflow = "hidden", nt.shrinkWrapBlocks() || p.always(function() {
                h.overflow = n.overflow[0], h.overflowX = n.overflow[1], h.overflowY = n.overflow[2]
            }));
            for (i in t)
                if (r = t[i], gn.exec(r)) {
                    if (delete t[i], s = s || "toggle" === r, r === (f ? "hide" : "show")) {
                        if ("show" !== r || !m || void 0 === m[i]) continue;
                        f = !0
                    }
                    d[i] = m && m[i] || rt.style(e, i)
                } else u = void 0;
            if (rt.isEmptyObject(d)) "inline" === ("none" === u ? x(e.nodeName) : u) && (h.display = u);
            else {
                m ? "hidden" in m && (f = m.hidden) : m = rt._data(e, "fxshow", {}), s && (m.hidden = !f), f ? rt(e).show() : p.done(function() {
                    rt(e).hide()
                }), p.done(function() {
                    var t;
                    rt._removeData(e, "fxshow");
                    for (t in d) rt.style(e, t, d[t])
                });
                for (i in d) o = O(f ? m[i] : 0, i, p), i in m || (m[i] = o.start, f && (o.end = o.start, o.start = "width" === i || "height" === i ? 1 : 0))
            }
        }

        function F(e, t) {
            var n, i, r, s, o;
            for (n in e)
                if (i = rt.camelCase(n), r = t[i], s = e[n], rt.isArray(s) && (r = s[1], s = e[n] = s[0]), n !== i && (e[i] = s, delete e[n]), o = rt.cssHooks[i], o && "expand" in o) {
                    s = o.expand(s), delete e[i];
                    for (n in s) n in e || (e[n] = s[n], t[n] = r)
                } else t[i] = r
        }

        function H(e, t, n) {
            var i, r, s = 0,
                o = kn.length,
                a = rt.Deferred().always(function() {
                    delete l.elem
                }),
                l = function() {
                    if (r) return !1;
                    for (var t = fn || P(), n = Math.max(0, u.startTime + u.duration - t), i = n / u.duration || 0, s = 1 - i, o = 0, l = u.tweens.length; l > o; o++) u.tweens[o].run(s);
                    return a.notifyWith(e, [u, s, n]), 1 > s && l ? n : (a.resolveWith(e, [u]), !1)
                },
                u = a.promise({
                    elem: e,
                    props: rt.extend({}, t),
                    opts: rt.extend(!0, {
                        specialEasing: {}
                    }, n),
                    originalProperties: t,
                    originalOptions: n,
                    startTime: fn || P(),
                    duration: n.duration,
                    tweens: [],
                    createTween: function(t, n) {
                        var i = rt.Tween(e, u.opts, t, n, u.opts.specialEasing[t] || u.opts.easing);
                        return u.tweens.push(i), i
                    },
                    stop: function(t) {
                        var n = 0,
                            i = t ? u.tweens.length : 0;
                        if (r) return this;
                        for (r = !0; i > n; n++) u.tweens[n].run(1);
                        return t ? a.resolveWith(e, [u, t]) : a.rejectWith(e, [u, t]), this
                    }
                }),
                c = u.props;
            for (F(c, u.opts.specialEasing); o > s; s++)
                if (i = kn[s].call(u, e, c, u.opts)) return i;
            return rt.map(c, O, u), rt.isFunction(u.opts.start) && u.opts.start.call(e, u), rt.fx.timer(rt.extend(l, {
                elem: e,
                anim: u,
                queue: u.opts.queue
            })), u.progress(u.opts.progress).done(u.opts.done, u.opts.complete).fail(u.opts.fail).always(u.opts.always)
        }

        function M(e) {
            return function(t, n) {
                "string" != typeof t && (n = t, t = "*");
                var i, r = 0,
                    s = t.toLowerCase().match(kt) || [];
                if (rt.isFunction(n))
                    for (; i = s[r++];) "+" === i.charAt(0) ? (i = i.slice(1) || "*", (e[i] = e[i] || []).unshift(n)) : (e[i] = e[i] || []).push(n)
            }
        }

        function U(e, t, n, i) {
            function r(a) {
                var l;
                return s[a] = !0, rt.each(e[a] || [], function(e, a) {
                    var u = a(t, n, i);
                    return "string" != typeof u || o || s[u] ? o ? !(l = u) : void 0 : (t.dataTypes.unshift(u), r(u), !1)
                }), l
            }
            var s = {},
                o = e === qn;
            return r(t.dataTypes[0]) || !s["*"] && r("*")
        }

        function z(e, t) {
            var n, i, r = rt.ajaxSettings.flatOptions || {};
            for (i in t) void 0 !== t[i] && ((r[i] ? e : n || (n = {}))[i] = t[i]);
            return n && rt.extend(!0, e, n), e
        }

        function W(e, t, n) {
            for (var i, r, s, o, a = e.contents, l = e.dataTypes;
                "*" === l[0];) l.shift(), void 0 === r && (r = e.mimeType || t.getResponseHeader("Content-Type"));
            if (r)
                for (o in a)
                    if (a[o] && a[o].test(r)) {
                        l.unshift(o);
                        break
                    }
            if (l[0] in n) s = l[0];
            else {
                for (o in n) {
                    if (!l[0] || e.converters[o + " " + l[0]]) {
                        s = o;
                        break
                    }
                    i || (i = o)
                }
                s = s || i
            }
            return s ? (s !== l[0] && l.unshift(s), n[s]) : void 0
        }

        function B(e, t, n, i) {
            var r, s, o, a, l, u = {},
                c = e.dataTypes.slice();
            if (c[1])
                for (o in e.converters) u[o.toLowerCase()] = e.converters[o];
            for (s = c.shift(); s;)
                if (e.responseFields[s] && (n[e.responseFields[s]] = t), !l && i && e.dataFilter && (t = e.dataFilter(t, e.dataType)), l = s, s = c.shift())
                    if ("*" === s) s = l;
                    else if ("*" !== l && l !== s) {
                if (o = u[l + " " + s] || u["* " + s], !o)
                    for (r in u)
                        if (a = r.split(" "), a[1] === s && (o = u[l + " " + a[0]] || u["* " + a[0]])) {
                            o === !0 ? o = u[r] : u[r] !== !0 && (s = a[0], c.unshift(a[1]));
                            break
                        }
                if (o !== !0)
                    if (o && e["throws"]) t = o(t);
                    else try {
                        t = o(t)
                    } catch (p) {
                        return {
                            state: "parsererror",
                            error: o ? p : "No conversion from " + l + " to " + s
                        }
                    }
            }
            return {
                state: "success",
                data: t
            }
        }

        function q(e, t, n, i) {
            var r;
            if (rt.isArray(t)) rt.each(t, function(t, r) {
                n || Jn.test(e) ? i(e, r) : q(e + "[" + ("object" == typeof r ? t : "") + "]", r, n, i)
            });
            else if (n || "object" !== rt.type(t)) i(e, t);
            else
                for (r in t) q(e + "[" + r + "]", t[r], n, i)
        }

        function V() {
            try {
                return new e.XMLHttpRequest
            } catch (t) {}
        }

        function X() {
            try {
                return new e.ActiveXObject("Microsoft.XMLHTTP")
            } catch (t) {}
        }

        function Y(e) {
            return rt.isWindow(e) ? e : 9 === e.nodeType ? e.defaultView || e.parentWindow : !1
        }
        var J = [],
            G = J.slice,
            $ = J.concat,
            K = J.push,
            Q = J.indexOf,
            Z = {},
            et = Z.toString,
            tt = Z.hasOwnProperty,
            nt = {},
            it = "1.11.1",
            rt = function(e, t) {
                return new rt.fn.init(e, t)
            },
            st = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,
            ot = /^-ms-/,
            at = /-([\da-z])/gi,
            lt = function(e, t) {
                return t.toUpperCase()
            };
        rt.fn = rt.prototype = {
            jquery: it,
            constructor: rt,
            selector: "",
            length: 0,
            toArray: function() {
                return G.call(this)
            },
            get: function(e) {
                return null != e ? 0 > e ? this[e + this.length] : this[e] : G.call(this)
            },
            pushStack: function(e) {
                var t = rt.merge(this.constructor(), e);
                return t.prevObject = this, t.context = this.context, t
            },
            each: function(e, t) {
                return rt.each(this, e, t)
            },
            map: function(e) {
                return this.pushStack(rt.map(this, function(t, n) {
                    return e.call(t, n, t)
                }))
            },
            slice: function() {
                return this.pushStack(G.apply(this, arguments))
            },
            first: function() {
                return this.eq(0)
            },
            last: function() {
                return this.eq(-1)
            },
            eq: function(e) {
                var t = this.length,
                    n = +e + (0 > e ? t : 0);
                return this.pushStack(n >= 0 && t > n ? [this[n]] : [])
            },
            end: function() {
                return this.prevObject || this.constructor(null)
            },
            push: K,
            sort: J.sort,
            splice: J.splice
        }, rt.extend = rt.fn.extend = function() {
            var e, t, n, i, r, s, o = arguments[0] || {},
                a = 1,
                l = arguments.length,
                u = !1;
            for ("boolean" == typeof o && (u = o, o = arguments[a] || {}, a++), "object" == typeof o || rt.isFunction(o) || (o = {}), a === l && (o = this, a--); l > a; a++)
                if (null != (r = arguments[a]))
                    for (i in r) e = o[i], n = r[i], o !== n && (u && n && (rt.isPlainObject(n) || (t = rt.isArray(n))) ? (t ? (t = !1, s = e && rt.isArray(e) ? e : []) : s = e && rt.isPlainObject(e) ? e : {}, o[i] = rt.extend(u, s, n)) : void 0 !== n && (o[i] = n));
            return o
        }, rt.extend({
            expando: "jQuery" + (it + Math.random()).replace(/\D/g, ""),
            isReady: !0,
            error: function(e) {
                throw new Error(e)
            },
            noop: function() {},
            isFunction: function(e) {
                return "function" === rt.type(e)
            },
            isArray: Array.isArray || function(e) {
                return "array" === rt.type(e)
            },
            isWindow: function(e) {
                return null != e && e == e.window
            },
            isNumeric: function(e) {
                return !rt.isArray(e) && e - parseFloat(e) >= 0
            },
            isEmptyObject: function(e) {
                var t;
                for (t in e) return !1;
                return !0
            },
            isPlainObject: function(e) {
                var t;
                if (!e || "object" !== rt.type(e) || e.nodeType || rt.isWindow(e)) return !1;
                try {
                    if (e.constructor && !tt.call(e, "constructor") && !tt.call(e.constructor.prototype, "isPrototypeOf")) return !1
                } catch (n) {
                    return !1
                }
                if (nt.ownLast)
                    for (t in e) return tt.call(e, t);
                for (t in e);
                return void 0 === t || tt.call(e, t)
            },
            type: function(e) {
                return null == e ? e + "" : "object" == typeof e || "function" == typeof e ? Z[et.call(e)] || "object" : typeof e
            },
            globalEval: function(t) {
                t && rt.trim(t) && (e.execScript || function(t) {
                    e.eval.call(e, t)
                })(t)
            },
            camelCase: function(e) {
                return e.replace(ot, "ms-").replace(at, lt)
            },
            nodeName: function(e, t) {
                return e.nodeName && e.nodeName.toLowerCase() === t.toLowerCase()
            },
            each: function(e, t, i) {
                var r, s = 0,
                    o = e.length,
                    a = n(e);
                if (i) {
                    if (a)
                        for (; o > s && (r = t.apply(e[s], i), r !== !1); s++);
                    else
                        for (s in e)
                            if (r = t.apply(e[s], i), r === !1) break
                } else if (a)
                    for (; o > s && (r = t.call(e[s], s, e[s]), r !== !1); s++);
                else
                    for (s in e)
                        if (r = t.call(e[s], s, e[s]), r === !1) break; return e
            },
            trim: function(e) {
                return null == e ? "" : (e + "").replace(st, "")
            },
            makeArray: function(e, t) {
                var i = t || [];
                return null != e && (n(Object(e)) ? rt.merge(i, "string" == typeof e ? [e] : e) : K.call(i, e)), i
            },
            inArray: function(e, t, n) {
                var i;
                if (t) {
                    if (Q) return Q.call(t, e, n);
                    for (i = t.length, n = n ? 0 > n ? Math.max(0, i + n) : n : 0; i > n; n++)
                        if (n in t && t[n] === e) return n
                }
                return -1
            },
            merge: function(e, t) {
                for (var n = +t.length, i = 0, r = e.length; n > i;) e[r++] = t[i++];
                if (n !== n)
                    for (; void 0 !== t[i];) e[r++] = t[i++];
                return e.length = r, e
            },
            grep: function(e, t, n) {
                for (var i, r = [], s = 0, o = e.length, a = !n; o > s; s++) i = !t(e[s], s), i !== a && r.push(e[s]);
                return r
            },
            map: function(e, t, i) {
                var r, s = 0,
                    o = e.length,
                    a = n(e),
                    l = [];
                if (a)
                    for (; o > s; s++) r = t(e[s], s, i), null != r && l.push(r);
                else
                    for (s in e) r = t(e[s], s, i), null != r && l.push(r);
                return $.apply([], l)
            },
            guid: 1,
            proxy: function(e, t) {
                var n, i, r;
                return "string" == typeof t && (r = e[t], t = e, e = r), rt.isFunction(e) ? (n = G.call(arguments, 2), i = function() {
                    return e.apply(t || this, n.concat(G.call(arguments)))
                }, i.guid = e.guid = e.guid || rt.guid++, i) : void 0
            },
            now: function() {
                return +new Date
            },
            support: nt
        }), rt.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(e, t) {
            Z["[object " + t + "]"] = t.toLowerCase()
        });
        var ut = function(e) {
            function t(e, t, n, i) {
                var r, s, o, a, l, u, p, h, f, m;
                if ((t ? t.ownerDocument || t : U) !== A && D(t), t = t || A, n = n || [], !e || "string" != typeof e) return n;
                if (1 !== (a = t.nodeType) && 9 !== a) return [];
                if (L && !i) {
                    if (r = vt.exec(e))
                        if (o = r[1]) {
                            if (9 === a) {
                                if (s = t.getElementById(o), !s || !s.parentNode) return n;
                                if (s.id === o) return n.push(s), n
                            } else if (t.ownerDocument && (s = t.ownerDocument.getElementById(o)) && H(t, s) && s.id === o) return n.push(s), n
                        } else {
                            if (r[2]) return Z.apply(n, t.getElementsByTagName(e)), n;
                            if ((o = r[3]) && S.getElementsByClassName && t.getElementsByClassName) return Z.apply(n, t.getElementsByClassName(o)), n
                        }
                    if (S.qsa && (!O || !O.test(e))) {
                        if (h = p = M, f = t, m = 9 === a && e, 1 === a && "object" !== t.nodeName.toLowerCase()) {
                            for (u = x(e), (p = t.getAttribute("id")) ? h = p.replace(yt, "\\$&") : t.setAttribute("id", h), h = "[id='" + h + "'] ", l = u.length; l--;) u[l] = h + d(u[l]);
                            f = kt.test(e) && c(t.parentNode) || t, m = u.join(",")
                        }
                        if (m) try {
                            return Z.apply(n, f.querySelectorAll(m)), n
                        } catch (g) {} finally {
                            p || t.removeAttribute("id")
                        }
                    }
                }
                return _(e.replace(lt, "$1"), t, n, i)
            }

            function n() {
                function e(n, i) {
                    return t.push(n + " ") > w.cacheLength && delete e[t.shift()], e[n + " "] = i
                }
                var t = [];
                return e
            }

            function i(e) {
                return e[M] = !0, e
            }

            function r(e) {
                var t = A.createElement("div");
                try {
                    return !!e(t)
                } catch (n) {
                    return !1
                } finally {
                    t.parentNode && t.parentNode.removeChild(t), t = null
                }
            }

            function s(e, t) {
                for (var n = e.split("|"), i = e.length; i--;) w.attrHandle[n[i]] = t
            }

            function o(e, t) {
                var n = t && e,
                    i = n && 1 === e.nodeType && 1 === t.nodeType && (~t.sourceIndex || J) - (~e.sourceIndex || J);
                if (i) return i;
                if (n)
                    for (; n = n.nextSibling;)
                        if (n === t) return -1;
                return e ? 1 : -1
            }

            function a(e) {
                return function(t) {
                    var n = t.nodeName.toLowerCase();
                    return "input" === n && t.type === e
                }
            }

            function l(e) {
                return function(t) {
                    var n = t.nodeName.toLowerCase();
                    return ("input" === n || "button" === n) && t.type === e
                }
            }

            function u(e) {
                return i(function(t) {
                    return t = +t, i(function(n, i) {
                        for (var r, s = e([], n.length, t), o = s.length; o--;) n[r = s[o]] && (n[r] = !(i[r] = n[r]))
                    })
                })
            }

            function c(e) {
                return e && typeof e.getElementsByTagName !== Y && e
            }

            function p() {}

            function d(e) {
                for (var t = 0, n = e.length, i = ""; n > t; t++) i += e[t].value;
                return i
            }

            function h(e, t, n) {
                var i = t.dir,
                    r = n && "parentNode" === i,
                    s = W++;
                return t.first ? function(t, n, s) {
                    for (; t = t[i];)
                        if (1 === t.nodeType || r) return e(t, n, s)
                } : function(t, n, o) {
                    var a, l, u = [z, s];
                    if (o) {
                        for (; t = t[i];)
                            if ((1 === t.nodeType || r) && e(t, n, o)) return !0
                    } else
                        for (; t = t[i];)
                            if (1 === t.nodeType || r) {
                                if (l = t[M] || (t[M] = {}), (a = l[i]) && a[0] === z && a[1] === s) return u[2] = a[2];
                                if (l[i] = u, u[2] = e(t, n, o)) return !0
                            }
                }
            }

            function f(e) {
                return e.length > 1 ? function(t, n, i) {
                    for (var r = e.length; r--;)
                        if (!e[r](t, n, i)) return !1;
                    return !0
                } : e[0]
            }

            function m(e, n, i) {
                for (var r = 0, s = n.length; s > r; r++) t(e, n[r], i);
                return i
            }

            function g(e, t, n, i, r) {
                for (var s, o = [], a = 0, l = e.length, u = null != t; l > a; a++)(s = e[a]) && (!n || n(s, i, r)) && (o.push(s), u && t.push(a));
                return o
            }

            function b(e, t, n, r, s, o) {
                return r && !r[M] && (r = b(r)), s && !s[M] && (s = b(s, o)), i(function(i, o, a, l) {
                    var u, c, p, d = [],
                        h = [],
                        f = o.length,
                        b = i || m(t || "*", a.nodeType ? [a] : a, []),
                        v = !e || !i && t ? b : g(b, d, e, a, l),
                        k = n ? s || (i ? e : f || r) ? [] : o : v;
                    if (n && n(v, k, a, l), r)
                        for (u = g(k, h), r(u, [], a, l), c = u.length; c--;)(p = u[c]) && (k[h[c]] = !(v[h[c]] = p));
                    if (i) {
                        if (s || e) {
                            if (s) {
                                for (u = [], c = k.length; c--;)(p = k[c]) && u.push(v[c] = p);
                                s(null, k = [], u, l)
                            }
                            for (c = k.length; c--;)(p = k[c]) && (u = s ? tt.call(i, p) : d[c]) > -1 && (i[u] = !(o[u] = p))
                        }
                    } else k = g(k === o ? k.splice(f, k.length) : k), s ? s(null, o, k, l) : Z.apply(o, k)
                })
            }

            function v(e) {
                for (var t, n, i, r = e.length, s = w.relative[e[0].type], o = s || w.relative[" "], a = s ? 1 : 0, l = h(function(e) {
                        return e === t
                    }, o, !0), u = h(function(e) {
                        return tt.call(t, e) > -1
                    }, o, !0), c = [function(e, n, i) {
                        return !s && (i || n !== C) || ((t = n).nodeType ? l(e, n, i) : u(e, n, i))
                    }]; r > a; a++)
                    if (n = w.relative[e[a].type]) c = [h(f(c), n)];
                    else {
                        if (n = w.filter[e[a].type].apply(null, e[a].matches), n[M]) {
                            for (i = ++a; r > i && !w.relative[e[i].type]; i++);
                            return b(a > 1 && f(c), a > 1 && d(e.slice(0, a - 1).concat({
                                value: " " === e[a - 2].type ? "*" : ""
                            })).replace(lt, "$1"), n, i > a && v(e.slice(a, i)), r > i && v(e = e.slice(i)), r > i && d(e))
                        }
                        c.push(n)
                    }
                return f(c)
            }

            function k(e, n) {
                var r = n.length > 0,
                    s = e.length > 0,
                    o = function(i, o, a, l, u) {
                        var c, p, d, h = 0,
                            f = "0",
                            m = i && [],
                            b = [],
                            v = C,
                            k = i || s && w.find.TAG("*", u),
                            y = z += null == v ? 1 : Math.random() || .1,
                            S = k.length;
                        for (u && (C = o !== A && o); f !== S && null != (c = k[f]); f++) {
                            if (s && c) {
                                for (p = 0; d = e[p++];)
                                    if (d(c, o, a)) {
                                        l.push(c);
                                        break
                                    }
                                u && (z = y)
                            }
                            r && ((c = !d && c) && h--, i && m.push(c))
                        }
                        if (h += f, r && f !== h) {
                            for (p = 0; d = n[p++];) d(m, b, o, a);
                            if (i) {
                                if (h > 0)
                                    for (; f--;) m[f] || b[f] || (b[f] = K.call(l));
                                b = g(b)
                            }
                            Z.apply(l, b), u && !i && b.length > 0 && h + n.length > 1 && t.uniqueSort(l)
                        }
                        return u && (z = y, C = v), m
                    };
                return r ? i(o) : o
            }
            var y, S, w, T, E, x, I, _, C, N, R, D, A, P, L, O, j, F, H, M = "sizzle" + -new Date,
                U = e.document,
                z = 0,
                W = 0,
                B = n(),
                q = n(),
                V = n(),
                X = function(e, t) {
                    return e === t && (R = !0), 0
                },
                Y = "undefined",
                J = 1 << 31,
                G = {}.hasOwnProperty,
                $ = [],
                K = $.pop,
                Q = $.push,
                Z = $.push,
                et = $.slice,
                tt = $.indexOf || function(e) {
                    for (var t = 0, n = this.length; n > t; t++)
                        if (this[t] === e) return t;
                    return -1
                },
                nt = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",
                it = "[\\x20\\t\\r\\n\\f]",
                rt = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",
                st = rt.replace("w", "w#"),
                ot = "\\[" + it + "*(" + rt + ")(?:" + it + "*([*^$|!~]?=)" + it + "*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + st + "))|)" + it + "*\\]",
                at = ":(" + rt + ")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|" + ot + ")*)|.*)\\)|)",
                lt = new RegExp("^" + it + "+|((?:^|[^\\\\])(?:\\\\.)*)" + it + "+$", "g"),
                ut = new RegExp("^" + it + "*," + it + "*"),
                ct = new RegExp("^" + it + "*([>+~]|" + it + ")" + it + "*"),
                pt = new RegExp("=" + it + "*([^\\]'\"]*?)" + it + "*\\]", "g"),
                dt = new RegExp(at),
                ht = new RegExp("^" + st + "$"),
                ft = {
                    ID: new RegExp("^#(" + rt + ")"),
                    CLASS: new RegExp("^\\.(" + rt + ")"),
                    TAG: new RegExp("^(" + rt.replace("w", "w*") + ")"),
                    ATTR: new RegExp("^" + ot),
                    PSEUDO: new RegExp("^" + at),
                    CHILD: new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + it + "*(even|odd|(([+-]|)(\\d*)n|)" + it + "*(?:([+-]|)" + it + "*(\\d+)|))" + it + "*\\)|)", "i"),
                    bool: new RegExp("^(?:" + nt + ")$", "i"),
                    needsContext: new RegExp("^" + it + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + it + "*((?:-\\d)?\\d*)" + it + "*\\)|)(?=[^-]|$)", "i")
                },
                mt = /^(?:input|select|textarea|button)$/i,
                gt = /^h\d$/i,
                bt = /^[^{]+\{\s*\[native \w/,
                vt = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,
                kt = /[+~]/,
                yt = /'|\\/g,
                St = new RegExp("\\\\([\\da-f]{1,6}" + it + "?|(" + it + ")|.)", "ig"),
                wt = function(e, t, n) {
                    var i = "0x" + t - 65536;
                    return i !== i || n ? t : 0 > i ? String.fromCharCode(i + 65536) : String.fromCharCode(i >> 10 | 55296, 1023 & i | 56320)
                };
            try {
                Z.apply($ = et.call(U.childNodes), U.childNodes), $[U.childNodes.length].nodeType
            } catch (Tt) {
                Z = {
                    apply: $.length ? function(e, t) {
                        Q.apply(e, et.call(t))
                    } : function(e, t) {
                        for (var n = e.length, i = 0; e[n++] = t[i++];);
                        e.length = n - 1
                    }
                }
            }
            S = t.support = {}, E = t.isXML = function(e) {
                var t = e && (e.ownerDocument || e).documentElement;
                return t ? "HTML" !== t.nodeName : !1
            }, D = t.setDocument = function(e) {
                var t, n = e ? e.ownerDocument || e : U,
                    i = n.defaultView;
                return n !== A && 9 === n.nodeType && n.documentElement ? (A = n, P = n.documentElement, L = !E(n), i && i !== i.top && (i.addEventListener ? i.addEventListener("unload", function() {
                    D()
                }, !1) : i.attachEvent && i.attachEvent("onunload", function() {
                    D()
                })), S.attributes = r(function(e) {
                    return e.className = "i", !e.getAttribute("className")
                }), S.getElementsByTagName = r(function(e) {
                    return e.appendChild(n.createComment("")), !e.getElementsByTagName("*").length
                }), S.getElementsByClassName = bt.test(n.getElementsByClassName) && r(function(e) {
                    return e.innerHTML = "<div class='a'></div><div class='a i'></div>", e.firstChild.className = "i", 2 === e.getElementsByClassName("i").length
                }), S.getById = r(function(e) {
                    return P.appendChild(e).id = M, !n.getElementsByName || !n.getElementsByName(M).length
                }), S.getById ? (w.find.ID = function(e, t) {
                    if (typeof t.getElementById !== Y && L) {
                        var n = t.getElementById(e);
                        return n && n.parentNode ? [n] : []
                    }
                }, w.filter.ID = function(e) {
                    var t = e.replace(St, wt);
                    return function(e) {
                        return e.getAttribute("id") === t
                    }
                }) : (delete w.find.ID, w.filter.ID = function(e) {
                    var t = e.replace(St, wt);
                    return function(e) {
                        var n = typeof e.getAttributeNode !== Y && e.getAttributeNode("id");
                        return n && n.value === t
                    }
                }), w.find.TAG = S.getElementsByTagName ? function(e, t) {
                    return typeof t.getElementsByTagName !== Y ? t.getElementsByTagName(e) : void 0
                } : function(e, t) {
                    var n, i = [],
                        r = 0,
                        s = t.getElementsByTagName(e);
                    if ("*" === e) {
                        for (; n = s[r++];) 1 === n.nodeType && i.push(n);
                        return i
                    }
                    return s
                }, w.find.CLASS = S.getElementsByClassName && function(e, t) {
                    return typeof t.getElementsByClassName !== Y && L ? t.getElementsByClassName(e) : void 0
                }, j = [], O = [], (S.qsa = bt.test(n.querySelectorAll)) && (r(function(e) {
                    e.innerHTML = "<select msallowclip=''><option selected=''></option></select>", e.querySelectorAll("[msallowclip^='']").length && O.push("[*^$]=" + it + "*(?:''|\"\")"), e.querySelectorAll("[selected]").length || O.push("\\[" + it + "*(?:value|" + nt + ")"), e.querySelectorAll(":checked").length || O.push(":checked")
                }), r(function(e) {
                    var t = n.createElement("input");
                    t.setAttribute("type", "hidden"), e.appendChild(t).setAttribute("name", "D"), e.querySelectorAll("[name=d]").length && O.push("name" + it + "*[*^$|!~]?="), e.querySelectorAll(":enabled").length || O.push(":enabled", ":disabled"), e.querySelectorAll("*,:x"), O.push(",.*:")
                })), (S.matchesSelector = bt.test(F = P.matches || P.webkitMatchesSelector || P.mozMatchesSelector || P.oMatchesSelector || P.msMatchesSelector)) && r(function(e) {
                    S.disconnectedMatch = F.call(e, "div"), F.call(e, "[s!='']:x"), j.push("!=", at)
                }), O = O.length && new RegExp(O.join("|")), j = j.length && new RegExp(j.join("|")), t = bt.test(P.compareDocumentPosition), H = t || bt.test(P.contains) ? function(e, t) {
                    var n = 9 === e.nodeType ? e.documentElement : e,
                        i = t && t.parentNode;
                    return e === i || !(!i || 1 !== i.nodeType || !(n.contains ? n.contains(i) : e.compareDocumentPosition && 16 & e.compareDocumentPosition(i)))
                } : function(e, t) {
                    if (t)
                        for (; t = t.parentNode;)
                            if (t === e) return !0;
                    return !1
                }, X = t ? function(e, t) {
                    if (e === t) return R = !0, 0;
                    var i = !e.compareDocumentPosition - !t.compareDocumentPosition;
                    return i ? i : (i = (e.ownerDocument || e) === (t.ownerDocument || t) ? e.compareDocumentPosition(t) : 1, 1 & i || !S.sortDetached && t.compareDocumentPosition(e) === i ? e === n || e.ownerDocument === U && H(U, e) ? -1 : t === n || t.ownerDocument === U && H(U, t) ? 1 : N ? tt.call(N, e) - tt.call(N, t) : 0 : 4 & i ? -1 : 1)
                } : function(e, t) {
                    if (e === t) return R = !0, 0;
                    var i, r = 0,
                        s = e.parentNode,
                        a = t.parentNode,
                        l = [e],
                        u = [t];
                    if (!s || !a) return e === n ? -1 : t === n ? 1 : s ? -1 : a ? 1 : N ? tt.call(N, e) - tt.call(N, t) : 0;
                    if (s === a) return o(e, t);
                    for (i = e; i = i.parentNode;) l.unshift(i);
                    for (i = t; i = i.parentNode;) u.unshift(i);
                    for (; l[r] === u[r];) r++;
                    return r ? o(l[r], u[r]) : l[r] === U ? -1 : u[r] === U ? 1 : 0
                }, n) : A
            }, t.matches = function(e, n) {
                return t(e, null, null, n)
            }, t.matchesSelector = function(e, n) {
                if ((e.ownerDocument || e) !== A && D(e), n = n.replace(pt, "='$1']"), !(!S.matchesSelector || !L || j && j.test(n) || O && O.test(n))) try {
                    var i = F.call(e, n);
                    if (i || S.disconnectedMatch || e.document && 11 !== e.document.nodeType) return i
                } catch (r) {}
                return t(n, A, null, [e]).length > 0
            }, t.contains = function(e, t) {
                return (e.ownerDocument || e) !== A && D(e), H(e, t)
            }, t.attr = function(e, t) {
                (e.ownerDocument || e) !== A && D(e);
                var n = w.attrHandle[t.toLowerCase()],
                    i = n && G.call(w.attrHandle, t.toLowerCase()) ? n(e, t, !L) : void 0;
                return void 0 !== i ? i : S.attributes || !L ? e.getAttribute(t) : (i = e.getAttributeNode(t)) && i.specified ? i.value : null
            }, t.error = function(e) {
                throw new Error("Syntax error, unrecognized expression: " + e)
            }, t.uniqueSort = function(e) {
                var t, n = [],
                    i = 0,
                    r = 0;
                if (R = !S.detectDuplicates, N = !S.sortStable && e.slice(0), e.sort(X), R) {
                    for (; t = e[r++];) t === e[r] && (i = n.push(r));
                    for (; i--;) e.splice(n[i], 1)
                }
                return N = null, e
            }, T = t.getText = function(e) {
                var t, n = "",
                    i = 0,
                    r = e.nodeType;
                if (r) {
                    if (1 === r || 9 === r || 11 === r) {
                        if ("string" == typeof e.textContent) return e.textContent;
                        for (e = e.firstChild; e; e = e.nextSibling) n += T(e)
                    } else if (3 === r || 4 === r) return e.nodeValue
                } else
                    for (; t = e[i++];) n += T(t);
                return n
            }, w = t.selectors = {
                cacheLength: 50,
                createPseudo: i,
                match: ft,
                attrHandle: {},
                find: {},
                relative: {
                    ">": {
                        dir: "parentNode",
                        first: !0
                    },
                    " ": {
                        dir: "parentNode"
                    },
                    "+": {
                        dir: "previousSibling",
                        first: !0
                    },
                    "~": {
                        dir: "previousSibling"
                    }
                },
                preFilter: {
                    ATTR: function(e) {
                        return e[1] = e[1].replace(St, wt), e[3] = (e[3] || e[4] || e[5] || "").replace(St, wt), "~=" === e[2] && (e[3] = " " + e[3] + " "), e.slice(0, 4)
                    },
                    CHILD: function(e) {
                        return e[1] = e[1].toLowerCase(), "nth" === e[1].slice(0, 3) ? (e[3] || t.error(e[0]), e[4] = +(e[4] ? e[5] + (e[6] || 1) : 2 * ("even" === e[3] || "odd" === e[3])), e[5] = +(e[7] + e[8] || "odd" === e[3])) : e[3] && t.error(e[0]), e
                    },
                    PSEUDO: function(e) {
                        var t, n = !e[6] && e[2];
                        return ft.CHILD.test(e[0]) ? null : (e[3] ? e[2] = e[4] || e[5] || "" : n && dt.test(n) && (t = x(n, !0)) && (t = n.indexOf(")", n.length - t) - n.length) && (e[0] = e[0].slice(0, t), e[2] = n.slice(0, t)), e.slice(0, 3))
                    }
                },
                filter: {
                    TAG: function(e) {
                        var t = e.replace(St, wt).toLowerCase();
                        return "*" === e ? function() {
                            return !0
                        } : function(e) {
                            return e.nodeName && e.nodeName.toLowerCase() === t
                        }
                    },
                    CLASS: function(e) {
                        var t = B[e + " "];
                        return t || (t = new RegExp("(^|" + it + ")" + e + "(" + it + "|$)")) && B(e, function(e) {
                            return t.test("string" == typeof e.className && e.className || typeof e.getAttribute !== Y && e.getAttribute("class") || "")
                        })
                    },
                    ATTR: function(e, n, i) {
                        return function(r) {
                            var s = t.attr(r, e);
                            return null == s ? "!=" === n : n ? (s += "", "=" === n ? s === i : "!=" === n ? s !== i : "^=" === n ? i && 0 === s.indexOf(i) : "*=" === n ? i && s.indexOf(i) > -1 : "$=" === n ? i && s.slice(-i.length) === i : "~=" === n ? (" " + s + " ").indexOf(i) > -1 : "|=" === n ? s === i || s.slice(0, i.length + 1) === i + "-" : !1) : !0
                        }
                    },
                    CHILD: function(e, t, n, i, r) {
                        var s = "nth" !== e.slice(0, 3),
                            o = "last" !== e.slice(-4),
                            a = "of-type" === t;
                        return 1 === i && 0 === r ? function(e) {
                            return !!e.parentNode
                        } : function(t, n, l) {
                            var u, c, p, d, h, f, m = s !== o ? "nextSibling" : "previousSibling",
                                g = t.parentNode,
                                b = a && t.nodeName.toLowerCase(),
                                v = !l && !a;
                            if (g) {
                                if (s) {
                                    for (; m;) {
                                        for (p = t; p = p[m];)
                                            if (a ? p.nodeName.toLowerCase() === b : 1 === p.nodeType) return !1;
                                        f = m = "only" === e && !f && "nextSibling"
                                    }
                                    return !0
                                }
                                if (f = [o ? g.firstChild : g.lastChild], o && v) {
                                    for (c = g[M] || (g[M] = {}), u = c[e] || [], h = u[0] === z && u[1], d = u[0] === z && u[2], p = h && g.childNodes[h]; p = ++h && p && p[m] || (d = h = 0) || f.pop();)
                                        if (1 === p.nodeType && ++d && p === t) {
                                            c[e] = [z, h, d];
                                            break
                                        }
                                } else if (v && (u = (t[M] || (t[M] = {}))[e]) && u[0] === z) d = u[1];
                                else
                                    for (;
                                        (p = ++h && p && p[m] || (d = h = 0) || f.pop()) && ((a ? p.nodeName.toLowerCase() !== b : 1 !== p.nodeType) || !++d || (v && ((p[M] || (p[M] = {}))[e] = [z, d]), p !== t)););
                                return d -= r, d === i || d % i === 0 && d / i >= 0
                            }
                        }
                    },
                    PSEUDO: function(e, n) {
                        var r, s = w.pseudos[e] || w.setFilters[e.toLowerCase()] || t.error("unsupported pseudo: " + e);
                        return s[M] ? s(n) : s.length > 1 ? (r = [e, e, "", n], w.setFilters.hasOwnProperty(e.toLowerCase()) ? i(function(e, t) {
                            for (var i, r = s(e, n), o = r.length; o--;) i = tt.call(e, r[o]), e[i] = !(t[i] = r[o])
                        }) : function(e) {
                            return s(e, 0, r)
                        }) : s
                    }
                },
                pseudos: {
                    not: i(function(e) {
                        var t = [],
                            n = [],
                            r = I(e.replace(lt, "$1"));
                        return r[M] ? i(function(e, t, n, i) {
                            for (var s, o = r(e, null, i, []), a = e.length; a--;)(s = o[a]) && (e[a] = !(t[a] = s))
                        }) : function(e, i, s) {
                            return t[0] = e, r(t, null, s, n), !n.pop()
                        }
                    }),
                    has: i(function(e) {
                        return function(n) {
                            return t(e, n).length > 0
                        }
                    }),
                    contains: i(function(e) {
                        return function(t) {
                            return (t.textContent || t.innerText || T(t)).indexOf(e) > -1
                        }
                    }),
                    lang: i(function(e) {
                        return ht.test(e || "") || t.error("unsupported lang: " + e), e = e.replace(St, wt).toLowerCase(),
                            function(t) {
                                var n;
                                do
                                    if (n = L ? t.lang : t.getAttribute("xml:lang") || t.getAttribute("lang")) return n = n.toLowerCase(), n === e || 0 === n.indexOf(e + "-");
                                while ((t = t.parentNode) && 1 === t.nodeType);
                                return !1
                            }
                    }),
                    target: function(t) {
                        var n = e.location && e.location.hash;
                        return n && n.slice(1) === t.id
                    },
                    root: function(e) {
                        return e === P
                    },
                    focus: function(e) {
                        return e === A.activeElement && (!A.hasFocus || A.hasFocus()) && !!(e.type || e.href || ~e.tabIndex)
                    },
                    enabled: function(e) {
                        return e.disabled === !1
                    },
                    disabled: function(e) {
                        return e.disabled === !0
                    },
                    checked: function(e) {
                        var t = e.nodeName.toLowerCase();
                        return "input" === t && !!e.checked || "option" === t && !!e.selected
                    },
                    selected: function(e) {
                        return e.parentNode && e.parentNode.selectedIndex, e.selected === !0
                    },
                    empty: function(e) {
                        for (e = e.firstChild; e; e = e.nextSibling)
                            if (e.nodeType < 6) return !1;
                        return !0
                    },
                    parent: function(e) {
                        return !w.pseudos.empty(e)
                    },
                    header: function(e) {
                        return gt.test(e.nodeName)
                    },
                    input: function(e) {
                        return mt.test(e.nodeName)
                    },
                    button: function(e) {
                        var t = e.nodeName.toLowerCase();
                        return "input" === t && "button" === e.type || "button" === t
                    },
                    text: function(e) {
                        var t;
                        return "input" === e.nodeName.toLowerCase() && "text" === e.type && (null == (t = e.getAttribute("type")) || "text" === t.toLowerCase())
                    },
                    first: u(function() {
                        return [0]
                    }),
                    last: u(function(e, t) {
                        return [t - 1]
                    }),
                    eq: u(function(e, t, n) {
                        return [0 > n ? n + t : n]
                    }),
                    even: u(function(e, t) {
                        for (var n = 0; t > n; n += 2) e.push(n);
                        return e
                    }),
                    odd: u(function(e, t) {
                        for (var n = 1; t > n; n += 2) e.push(n);
                        return e
                    }),
                    lt: u(function(e, t, n) {
                        for (var i = 0 > n ? n + t : n; --i >= 0;) e.push(i);
                        return e
                    }),
                    gt: u(function(e, t, n) {
                        for (var i = 0 > n ? n + t : n; ++i < t;) e.push(i);
                        return e
                    })
                }
            }, w.pseudos.nth = w.pseudos.eq;
            for (y in {
                    radio: !0,
                    checkbox: !0,
                    file: !0,
                    password: !0,
                    image: !0
                }) w.pseudos[y] = a(y);
            for (y in {
                    submit: !0,
                    reset: !0
                }) w.pseudos[y] = l(y);
            return p.prototype = w.filters = w.pseudos, w.setFilters = new p, x = t.tokenize = function(e, n) {
                var i, r, s, o, a, l, u, c = q[e + " "];
                if (c) return n ? 0 : c.slice(0);
                for (a = e, l = [], u = w.preFilter; a;) {
                    (!i || (r = ut.exec(a))) && (r && (a = a.slice(r[0].length) || a), l.push(s = [])), i = !1, (r = ct.exec(a)) && (i = r.shift(), s.push({
                        value: i,
                        type: r[0].replace(lt, " ")
                    }), a = a.slice(i.length));
                    for (o in w.filter) !(r = ft[o].exec(a)) || u[o] && !(r = u[o](r)) || (i = r.shift(), s.push({
                        value: i,
                        type: o,
                        matches: r
                    }), a = a.slice(i.length));
                    if (!i) break
                }
                return n ? a.length : a ? t.error(e) : q(e, l).slice(0)
            }, I = t.compile = function(e, t) {
                var n, i = [],
                    r = [],
                    s = V[e + " "];
                if (!s) {
                    for (t || (t = x(e)), n = t.length; n--;) s = v(t[n]), s[M] ? i.push(s) : r.push(s);
                    s = V(e, k(r, i)), s.selector = e
                }
                return s
            }, _ = t.select = function(e, t, n, i) {
                var r, s, o, a, l, u = "function" == typeof e && e,
                    p = !i && x(e = u.selector || e);
                if (n = n || [], 1 === p.length) {
                    if (s = p[0] = p[0].slice(0), s.length > 2 && "ID" === (o = s[0]).type && S.getById && 9 === t.nodeType && L && w.relative[s[1].type]) {
                        if (t = (w.find.ID(o.matches[0].replace(St, wt), t) || [])[0], !t) return n;
                        u && (t = t.parentNode), e = e.slice(s.shift().value.length)
                    }
                    for (r = ft.needsContext.test(e) ? 0 : s.length; r-- && (o = s[r], !w.relative[a = o.type]);)
                        if ((l = w.find[a]) && (i = l(o.matches[0].replace(St, wt), kt.test(s[0].type) && c(t.parentNode) || t))) {
                            if (s.splice(r, 1), e = i.length && d(s), !e) return Z.apply(n, i), n;
                            break
                        }
                }
                return (u || I(e, p))(i, t, !L, n, kt.test(e) && c(t.parentNode) || t), n
            }, S.sortStable = M.split("").sort(X).join("") === M, S.detectDuplicates = !!R, D(), S.sortDetached = r(function(e) {
                return 1 & e.compareDocumentPosition(A.createElement("div"))
            }), r(function(e) {
                return e.innerHTML = "<a href='#'></a>", "#" === e.firstChild.getAttribute("href")
            }) || s("type|href|height|width", function(e, t, n) {
                return n ? void 0 : e.getAttribute(t, "type" === t.toLowerCase() ? 1 : 2)
            }), S.attributes && r(function(e) {
                return e.innerHTML = "<input/>", e.firstChild.setAttribute("value", ""), "" === e.firstChild.getAttribute("value")
            }) || s("value", function(e, t, n) {
                return n || "input" !== e.nodeName.toLowerCase() ? void 0 : e.defaultValue
            }), r(function(e) {
                return null == e.getAttribute("disabled")
            }) || s(nt, function(e, t, n) {
                var i;
                return n ? void 0 : e[t] === !0 ? t.toLowerCase() : (i = e.getAttributeNode(t)) && i.specified ? i.value : null
            }), t
        }(e);
        rt.find = ut, rt.expr = ut.selectors, rt.expr[":"] = rt.expr.pseudos, rt.unique = ut.uniqueSort, rt.text = ut.getText, rt.isXMLDoc = ut.isXML, rt.contains = ut.contains;
        var ct = rt.expr.match.needsContext,
            pt = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,
            dt = /^.[^:#\[\.,]*$/;
        rt.filter = function(e, t, n) {
            var i = t[0];
            return n && (e = ":not(" + e + ")"), 1 === t.length && 1 === i.nodeType ? rt.find.matchesSelector(i, e) ? [i] : [] : rt.find.matches(e, rt.grep(t, function(e) {
                return 1 === e.nodeType
            }))
        }, rt.fn.extend({
            find: function(e) {
                var t, n = [],
                    i = this,
                    r = i.length;
                if ("string" != typeof e) return this.pushStack(rt(e).filter(function() {
                    for (t = 0; r > t; t++)
                        if (rt.contains(i[t], this)) return !0
                }));
                for (t = 0; r > t; t++) rt.find(e, i[t], n);
                return n = this.pushStack(r > 1 ? rt.unique(n) : n), n.selector = this.selector ? this.selector + " " + e : e, n
            },
            filter: function(e) {
                return this.pushStack(i(this, e || [], !1))
            },
            not: function(e) {
                return this.pushStack(i(this, e || [], !0))
            },
            is: function(e) {
                return !!i(this, "string" == typeof e && ct.test(e) ? rt(e) : e || [], !1).length
            }
        });
        var ht, ft = e.document,
            mt = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,
            gt = rt.fn.init = function(e, t) {
                var n, i;
                if (!e) return this;
                if ("string" == typeof e) {
                    if (n = "<" === e.charAt(0) && ">" === e.charAt(e.length - 1) && e.length >= 3 ? [null, e, null] : mt.exec(e), !n || !n[1] && t) return !t || t.jquery ? (t || ht).find(e) : this.constructor(t).find(e);
                    if (n[1]) {
                        if (t = t instanceof rt ? t[0] : t, rt.merge(this, rt.parseHTML(n[1], t && t.nodeType ? t.ownerDocument || t : ft, !0)), pt.test(n[1]) && rt.isPlainObject(t))
                            for (n in t) rt.isFunction(this[n]) ? this[n](t[n]) : this.attr(n, t[n]);
                        return this
                    }
                    if (i = ft.getElementById(n[2]), i && i.parentNode) {
                        if (i.id !== n[2]) return ht.find(e);
                        this.length = 1, this[0] = i
                    }
                    return this.context = ft, this.selector = e, this
                }
                return e.nodeType ? (this.context = this[0] = e, this.length = 1, this) : rt.isFunction(e) ? "undefined" != typeof ht.ready ? ht.ready(e) : e(rt) : (void 0 !== e.selector && (this.selector = e.selector, this.context = e.context), rt.makeArray(e, this))
            };
        gt.prototype = rt.fn, ht = rt(ft);
        var bt = /^(?:parents|prev(?:Until|All))/,
            vt = {
                children: !0,
                contents: !0,
                next: !0,
                prev: !0
            };
        rt.extend({
            dir: function(e, t, n) {
                for (var i = [], r = e[t]; r && 9 !== r.nodeType && (void 0 === n || 1 !== r.nodeType || !rt(r).is(n));) 1 === r.nodeType && i.push(r), r = r[t];
                return i
            },
            sibling: function(e, t) {
                for (var n = []; e; e = e.nextSibling) 1 === e.nodeType && e !== t && n.push(e);
                return n
            }
        }), rt.fn.extend({
            has: function(e) {
                var t, n = rt(e, this),
                    i = n.length;
                return this.filter(function() {
                    for (t = 0; i > t; t++)
                        if (rt.contains(this, n[t])) return !0
                })
            },
            closest: function(e, t) {
                for (var n, i = 0, r = this.length, s = [], o = ct.test(e) || "string" != typeof e ? rt(e, t || this.context) : 0; r > i; i++)
                    for (n = this[i]; n && n !== t; n = n.parentNode)
                        if (n.nodeType < 11 && (o ? o.index(n) > -1 : 1 === n.nodeType && rt.find.matchesSelector(n, e))) {
                            s.push(n);
                            break
                        }
                return this.pushStack(s.length > 1 ? rt.unique(s) : s)
            },
            index: function(e) {
                return e ? "string" == typeof e ? rt.inArray(this[0], rt(e)) : rt.inArray(e.jquery ? e[0] : e, this) : this[0] && this[0].parentNode ? this.first().prevAll().length : -1
            },
            add: function(e, t) {
                return this.pushStack(rt.unique(rt.merge(this.get(), rt(e, t))))
            },
            addBack: function(e) {
                return this.add(null == e ? this.prevObject : this.prevObject.filter(e))
            }
        }), rt.each({
            parent: function(e) {
                var t = e.parentNode;
                return t && 11 !== t.nodeType ? t : null
            },
            parents: function(e) {
                return rt.dir(e, "parentNode")
            },
            parentsUntil: function(e, t, n) {
                return rt.dir(e, "parentNode", n)
            },
            next: function(e) {
                return r(e, "nextSibling")
            },
            prev: function(e) {
                return r(e, "previousSibling")
            },
            nextAll: function(e) {
                return rt.dir(e, "nextSibling")
            },
            prevAll: function(e) {
                return rt.dir(e, "previousSibling")
            },
            nextUntil: function(e, t, n) {
                return rt.dir(e, "nextSibling", n)
            },
            prevUntil: function(e, t, n) {
                return rt.dir(e, "previousSibling", n)
            },
            siblings: function(e) {
                return rt.sibling((e.parentNode || {}).firstChild, e)
            },
            children: function(e) {
                return rt.sibling(e.firstChild)
            },
            contents: function(e) {
                return rt.nodeName(e, "iframe") ? e.contentDocument || e.contentWindow.document : rt.merge([], e.childNodes)
            }
        }, function(e, t) {
            rt.fn[e] = function(n, i) {
                var r = rt.map(this, t, n);
                return "Until" !== e.slice(-5) && (i = n), i && "string" == typeof i && (r = rt.filter(i, r)), this.length > 1 && (vt[e] || (r = rt.unique(r)), bt.test(e) && (r = r.reverse())), this.pushStack(r)
            }
        });
        var kt = /\S+/g,
            yt = {};
        rt.Callbacks = function(e) {
            e = "string" == typeof e ? yt[e] || s(e) : rt.extend({}, e);
            var t, n, i, r, o, a, l = [],
                u = !e.once && [],
                c = function(s) {
                    for (n = e.memory && s, i = !0, o = a || 0, a = 0, r = l.length, t = !0; l && r > o; o++)
                        if (l[o].apply(s[0], s[1]) === !1 && e.stopOnFalse) {
                            n = !1;
                            break
                        }
                    t = !1, l && (u ? u.length && c(u.shift()) : n ? l = [] : p.disable())
                },
                p = {
                    add: function() {
                        if (l) {
                            var i = l.length;
                            ! function s(t) {
                                rt.each(t, function(t, n) {
                                    var i = rt.type(n);
                                    "function" === i ? e.unique && p.has(n) || l.push(n) : n && n.length && "string" !== i && s(n)
                                })
                            }(arguments), t ? r = l.length : n && (a = i, c(n))
                        }
                        return this
                    },
                    remove: function() {
                        return l && rt.each(arguments, function(e, n) {
                            for (var i;
                                (i = rt.inArray(n, l, i)) > -1;) l.splice(i, 1), t && (r >= i && r--, o >= i && o--)
                        }), this
                    },
                    has: function(e) {
                        return e ? rt.inArray(e, l) > -1 : !(!l || !l.length)
                    },
                    empty: function() {
                        return l = [], r = 0, this
                    },
                    disable: function() {
                        return l = u = n = void 0, this
                    },
                    disabled: function() {
                        return !l
                    },
                    lock: function() {
                        return u = void 0, n || p.disable(), this
                    },
                    locked: function() {
                        return !u
                    },
                    fireWith: function(e, n) {
                        return !l || i && !u || (n = n || [], n = [e, n.slice ? n.slice() : n], t ? u.push(n) : c(n)), this
                    },
                    fire: function() {
                        return p.fireWith(this, arguments), this
                    },
                    fired: function() {
                        return !!i
                    }
                };
            return p
        }, rt.extend({
            Deferred: function(e) {
                var t = [
                        ["resolve", "done", rt.Callbacks("once memory"), "resolved"],
                        ["reject", "fail", rt.Callbacks("once memory"), "rejected"],
                        ["notify", "progress", rt.Callbacks("memory")]
                    ],
                    n = "pending",
                    i = {
                        state: function() {
                            return n
                        },
                        always: function() {
                            return r.done(arguments).fail(arguments), this
                        },
                        then: function() {
                            var e = arguments;
                            return rt.Deferred(function(n) {
                                rt.each(t, function(t, s) {
                                    var o = rt.isFunction(e[t]) && e[t];
                                    r[s[1]](function() {
                                        var e = o && o.apply(this, arguments);
                                        e && rt.isFunction(e.promise) ? e.promise().done(n.resolve).fail(n.reject).progress(n.notify) : n[s[0] + "With"](this === i ? n.promise() : this, o ? [e] : arguments)
                                    })
                                }), e = null
                            }).promise()
                        },
                        promise: function(e) {
                            return null != e ? rt.extend(e, i) : i
                        }
                    },
                    r = {};
                return i.pipe = i.then, rt.each(t, function(e, s) {
                    var o = s[2],
                        a = s[3];
                    i[s[1]] = o.add, a && o.add(function() {
                        n = a
                    }, t[1 ^ e][2].disable, t[2][2].lock), r[s[0]] = function() {
                        return r[s[0] + "With"](this === r ? i : this, arguments), this
                    }, r[s[0] + "With"] = o.fireWith
                }), i.promise(r), e && e.call(r, r), r
            },
            when: function(e) {
                var t, n, i, r = 0,
                    s = G.call(arguments),
                    o = s.length,
                    a = 1 !== o || e && rt.isFunction(e.promise) ? o : 0,
                    l = 1 === a ? e : rt.Deferred(),
                    u = function(e, n, i) {
                        return function(r) {
                            n[e] = this, i[e] = arguments.length > 1 ? G.call(arguments) : r, i === t ? l.notifyWith(n, i) : --a || l.resolveWith(n, i)
                        }
                    };
                if (o > 1)
                    for (t = new Array(o), n = new Array(o), i = new Array(o); o > r; r++) s[r] && rt.isFunction(s[r].promise) ? s[r].promise().done(u(r, i, s)).fail(l.reject).progress(u(r, n, t)) : --a;
                return a || l.resolveWith(i, s), l.promise()
            }
        });
        var St;
        rt.fn.ready = function(e) {
            return rt.ready.promise().done(e), this
        }, rt.extend({
            isReady: !1,
            readyWait: 1,
            holdReady: function(e) {
                e ? rt.readyWait++ : rt.ready(!0)
            },
            ready: function(e) {
                if (e === !0 ? !--rt.readyWait : !rt.isReady) {
                    if (!ft.body) return setTimeout(rt.ready);
                    rt.isReady = !0, e !== !0 && --rt.readyWait > 0 || (St.resolveWith(ft, [rt]), rt.fn.triggerHandler && (rt(ft).triggerHandler("ready"), rt(ft).off("ready")))
                }
            }
        }), rt.ready.promise = function(t) {
            if (!St)
                if (St = rt.Deferred(), "complete" === ft.readyState) setTimeout(rt.ready);
                else if (ft.addEventListener) ft.addEventListener("DOMContentLoaded", a, !1), e.addEventListener("load", a, !1);
            else {
                ft.attachEvent("onreadystatechange", a), e.attachEvent("onload", a);
                var n = !1;
                try {
                    n = null == e.frameElement && ft.documentElement
                } catch (i) {}
                n && n.doScroll && ! function r() {
                    if (!rt.isReady) {
                        try {
                            n.doScroll("left")
                        } catch (e) {
                            return setTimeout(r, 50)
                        }
                        o(), rt.ready()
                    }
                }()
            }
            return St.promise(t)
        };
        var wt, Tt = "undefined";
        for (wt in rt(nt)) break;
        nt.ownLast = "0" !== wt, nt.inlineBlockNeedsLayout = !1, rt(function() {
                var e, t, n, i;
                n = ft.getElementsByTagName("body")[0], n && n.style && (t = ft.createElement("div"), i = ft.createElement("div"), i.style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px", n.appendChild(i).appendChild(t), typeof t.style.zoom !== Tt && (t.style.cssText = "display:inline;margin:0;border:0;padding:1px;width:1px;zoom:1", nt.inlineBlockNeedsLayout = e = 3 === t.offsetWidth, e && (n.style.zoom = 1)), n.removeChild(i))
            }),
            function() {
                var e = ft.createElement("div");
                if (null == nt.deleteExpando) {
                    nt.deleteExpando = !0;
                    try {
                        delete e.test
                    } catch (t) {
                        nt.deleteExpando = !1
                    }
                }
                e = null
            }(), rt.acceptData = function(e) {
                var t = rt.noData[(e.nodeName + " ").toLowerCase()],
                    n = +e.nodeType || 1;
                return 1 !== n && 9 !== n ? !1 : !t || t !== !0 && e.getAttribute("classid") === t
            };
        var Et = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
            xt = /([A-Z])/g;
        rt.extend({
            cache: {},
            noData: {
                "applet ": !0,
                "embed ": !0,
                "object ": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"
            },
            hasData: function(e) {
                return e = e.nodeType ? rt.cache[e[rt.expando]] : e[rt.expando], !!e && !u(e)
            },
            data: function(e, t, n) {
                return c(e, t, n)
            },
            removeData: function(e, t) {
                return p(e, t)
            },
            _data: function(e, t, n) {
                return c(e, t, n, !0)
            },
            _removeData: function(e, t) {
                return p(e, t, !0)
            }
        }), rt.fn.extend({
            data: function(e, t) {
                var n, i, r, s = this[0],
                    o = s && s.attributes;
                if (void 0 === e) {
                    if (this.length && (r = rt.data(s), 1 === s.nodeType && !rt._data(s, "parsedAttrs"))) {
                        for (n = o.length; n--;) o[n] && (i = o[n].name, 0 === i.indexOf("data-") && (i = rt.camelCase(i.slice(5)), l(s, i, r[i])));
                        rt._data(s, "parsedAttrs", !0)
                    }
                    return r
                }
                return "object" == typeof e ? this.each(function() {
                    rt.data(this, e)
                }) : arguments.length > 1 ? this.each(function() {
                    rt.data(this, e, t)
                }) : s ? l(s, e, rt.data(s, e)) : void 0
            },
            removeData: function(e) {
                return this.each(function() {
                    rt.removeData(this, e)
                })
            }
        }), rt.extend({
            queue: function(e, t, n) {
                var i;
                return e ? (t = (t || "fx") + "queue", i = rt._data(e, t), n && (!i || rt.isArray(n) ? i = rt._data(e, t, rt.makeArray(n)) : i.push(n)), i || []) : void 0
            },
            dequeue: function(e, t) {
                t = t || "fx";
                var n = rt.queue(e, t),
                    i = n.length,
                    r = n.shift(),
                    s = rt._queueHooks(e, t),
                    o = function() {
                        rt.dequeue(e, t)
                    };
                "inprogress" === r && (r = n.shift(), i--), r && ("fx" === t && n.unshift("inprogress"), delete s.stop, r.call(e, o, s)), !i && s && s.empty.fire()
            },
            _queueHooks: function(e, t) {
                var n = t + "queueHooks";
                return rt._data(e, n) || rt._data(e, n, {
                    empty: rt.Callbacks("once memory").add(function() {
                        rt._removeData(e, t + "queue"), rt._removeData(e, n)
                    })
                })
            }
        }), rt.fn.extend({
            queue: function(e, t) {
                var n = 2;
                return "string" != typeof e && (t = e, e = "fx", n--), arguments.length < n ? rt.queue(this[0], e) : void 0 === t ? this : this.each(function() {
                    var n = rt.queue(this, e, t);
                    rt._queueHooks(this, e), "fx" === e && "inprogress" !== n[0] && rt.dequeue(this, e)
                })
            },
            dequeue: function(e) {
                return this.each(function() {
                    rt.dequeue(this, e)
                })
            },
            clearQueue: function(e) {
                return this.queue(e || "fx", [])
            },
            promise: function(e, t) {
                var n, i = 1,
                    r = rt.Deferred(),
                    s = this,
                    o = this.length,
                    a = function() {
                        --i || r.resolveWith(s, [s])
                    };
                for ("string" != typeof e && (t = e, e = void 0), e = e || "fx"; o--;) n = rt._data(s[o], e + "queueHooks"), n && n.empty && (i++, n.empty.add(a));
                return a(), r.promise(t)
            }
        });
        var It = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,
            _t = ["Top", "Right", "Bottom", "Left"],
            Ct = function(e, t) {
                return e = t || e, "none" === rt.css(e, "display") || !rt.contains(e.ownerDocument, e)
            },
            Nt = rt.access = function(e, t, n, i, r, s, o) {
                var a = 0,
                    l = e.length,
                    u = null == n;
                if ("object" === rt.type(n)) {
                    r = !0;
                    for (a in n) rt.access(e, t, a, n[a], !0, s, o)
                } else if (void 0 !== i && (r = !0, rt.isFunction(i) || (o = !0), u && (o ? (t.call(e, i), t = null) : (u = t, t = function(e, t, n) {
                        return u.call(rt(e), n)
                    })), t))
                    for (; l > a; a++) t(e[a], n, o ? i : i.call(e[a], a, t(e[a], n)));
                return r ? e : u ? t.call(e) : l ? t(e[0], n) : s
            },
            Rt = /^(?:checkbox|radio)$/i;
        ! function() {
            var e = ft.createElement("input"),
                t = ft.createElement("div"),
                n = ft.createDocumentFragment();
            if (t.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>", nt.leadingWhitespace = 3 === t.firstChild.nodeType, nt.tbody = !t.getElementsByTagName("tbody").length, nt.htmlSerialize = !!t.getElementsByTagName("link").length, nt.html5Clone = "<:nav></:nav>" !== ft.createElement("nav").cloneNode(!0).outerHTML, e.type = "checkbox", e.checked = !0, n.appendChild(e), nt.appendChecked = e.checked, t.innerHTML = "<textarea>x</textarea>", nt.noCloneChecked = !!t.cloneNode(!0).lastChild.defaultValue, n.appendChild(t), t.innerHTML = "<input type='radio' checked='checked' name='t'/>", nt.checkClone = t.cloneNode(!0).cloneNode(!0).lastChild.checked, nt.noCloneEvent = !0, t.attachEvent && (t.attachEvent("onclick", function() {
                    nt.noCloneEvent = !1
                }), t.cloneNode(!0).click()), null == nt.deleteExpando) {
                nt.deleteExpando = !0;
                try {
                    delete t.test
                } catch (i) {
                    nt.deleteExpando = !1
                }
            }
        }(),
        function() {
            var t, n, i = ft.createElement("div");
            for (t in {
                    submit: !0,
                    change: !0,
                    focusin: !0
                }) n = "on" + t, (nt[t + "Bubbles"] = n in e) || (i.setAttribute(n, "t"), nt[t + "Bubbles"] = i.attributes[n].expando === !1);
            i = null
        }();
        var Dt = /^(?:input|select|textarea)$/i,
            At = /^key/,
            Pt = /^(?:mouse|pointer|contextmenu)|click/,
            Lt = /^(?:focusinfocus|focusoutblur)$/,
            Ot = /^([^.]*)(?:\.(.+)|)$/;
        rt.event = {
            global: {},
            add: function(e, t, n, i, r) {
                var s, o, a, l, u, c, p, d, h, f, m, g = rt._data(e);
                if (g) {
                    for (n.handler && (l = n, n = l.handler, r = l.selector), n.guid || (n.guid = rt.guid++), (o = g.events) || (o = g.events = {}), (c = g.handle) || (c = g.handle = function(e) {
                            return typeof rt === Tt || e && rt.event.triggered === e.type ? void 0 : rt.event.dispatch.apply(c.elem, arguments)
                        }, c.elem = e), t = (t || "").match(kt) || [""], a = t.length; a--;) s = Ot.exec(t[a]) || [], h = m = s[1], f = (s[2] || "").split(".").sort(), h && (u = rt.event.special[h] || {}, h = (r ? u.delegateType : u.bindType) || h, u = rt.event.special[h] || {}, p = rt.extend({
                        type: h,
                        origType: m,
                        data: i,
                        handler: n,
                        guid: n.guid,
                        selector: r,
                        needsContext: r && rt.expr.match.needsContext.test(r),
                        namespace: f.join(".")
                    }, l), (d = o[h]) || (d = o[h] = [], d.delegateCount = 0, u.setup && u.setup.call(e, i, f, c) !== !1 || (e.addEventListener ? e.addEventListener(h, c, !1) : e.attachEvent && e.attachEvent("on" + h, c))), u.add && (u.add.call(e, p), p.handler.guid || (p.handler.guid = n.guid)), r ? d.splice(d.delegateCount++, 0, p) : d.push(p), rt.event.global[h] = !0);
                    e = null
                }
            },
            remove: function(e, t, n, i, r) {
                var s, o, a, l, u, c, p, d, h, f, m, g = rt.hasData(e) && rt._data(e);
                if (g && (c = g.events)) {
                    for (t = (t || "").match(kt) || [""], u = t.length; u--;)
                        if (a = Ot.exec(t[u]) || [], h = m = a[1], f = (a[2] || "").split(".").sort(), h) {
                            for (p = rt.event.special[h] || {}, h = (i ? p.delegateType : p.bindType) || h, d = c[h] || [], a = a[2] && new RegExp("(^|\\.)" + f.join("\\.(?:.*\\.|)") + "(\\.|$)"), l = s = d.length; s--;) o = d[s], !r && m !== o.origType || n && n.guid !== o.guid || a && !a.test(o.namespace) || i && i !== o.selector && ("**" !== i || !o.selector) || (d.splice(s, 1), o.selector && d.delegateCount--, p.remove && p.remove.call(e, o));
                            l && !d.length && (p.teardown && p.teardown.call(e, f, g.handle) !== !1 || rt.removeEvent(e, h, g.handle), delete c[h])
                        } else
                            for (h in c) rt.event.remove(e, h + t[u], n, i, !0);
                    rt.isEmptyObject(c) && (delete g.handle, rt._removeData(e, "events"))
                }
            },
            trigger: function(t, n, i, r) {
                var s, o, a, l, u, c, p, d = [i || ft],
                    h = tt.call(t, "type") ? t.type : t,
                    f = tt.call(t, "namespace") ? t.namespace.split(".") : [];
                if (a = c = i = i || ft, 3 !== i.nodeType && 8 !== i.nodeType && !Lt.test(h + rt.event.triggered) && (h.indexOf(".") >= 0 && (f = h.split("."), h = f.shift(), f.sort()), o = h.indexOf(":") < 0 && "on" + h, t = t[rt.expando] ? t : new rt.Event(h, "object" == typeof t && t), t.isTrigger = r ? 2 : 3, t.namespace = f.join("."), t.namespace_re = t.namespace ? new RegExp("(^|\\.)" + f.join("\\.(?:.*\\.|)") + "(\\.|$)") : null, t.result = void 0, t.target || (t.target = i), n = null == n ? [t] : rt.makeArray(n, [t]), u = rt.event.special[h] || {}, r || !u.trigger || u.trigger.apply(i, n) !== !1)) {
                    if (!r && !u.noBubble && !rt.isWindow(i)) {
                        for (l = u.delegateType || h, Lt.test(l + h) || (a = a.parentNode); a; a = a.parentNode) d.push(a), c = a;
                        c === (i.ownerDocument || ft) && d.push(c.defaultView || c.parentWindow || e)
                    }
                    for (p = 0;
                        (a = d[p++]) && !t.isPropagationStopped();) t.type = p > 1 ? l : u.bindType || h, s = (rt._data(a, "events") || {})[t.type] && rt._data(a, "handle"), s && s.apply(a, n), s = o && a[o], s && s.apply && rt.acceptData(a) && (t.result = s.apply(a, n), t.result === !1 && t.preventDefault());
                    if (t.type = h, !r && !t.isDefaultPrevented() && (!u._default || u._default.apply(d.pop(), n) === !1) && rt.acceptData(i) && o && i[h] && !rt.isWindow(i)) {
                        c = i[o], c && (i[o] = null), rt.event.triggered = h;
                        try {
                            i[h]()
                        } catch (m) {}
                        rt.event.triggered = void 0, c && (i[o] = c)
                    }
                    return t.result
                }
            },
            dispatch: function(e) {
                e = rt.event.fix(e);
                var t, n, i, r, s, o = [],
                    a = G.call(arguments),
                    l = (rt._data(this, "events") || {})[e.type] || [],
                    u = rt.event.special[e.type] || {};
                if (a[0] = e, e.delegateTarget = this, !u.preDispatch || u.preDispatch.call(this, e) !== !1) {
                    for (o = rt.event.handlers.call(this, e, l), t = 0;
                        (r = o[t++]) && !e.isPropagationStopped();)
                        for (e.currentTarget = r.elem, s = 0;
                            (i = r.handlers[s++]) && !e.isImmediatePropagationStopped();)(!e.namespace_re || e.namespace_re.test(i.namespace)) && (e.handleObj = i, e.data = i.data, n = ((rt.event.special[i.origType] || {}).handle || i.handler).apply(r.elem, a), void 0 !== n && (e.result = n) === !1 && (e.preventDefault(), e.stopPropagation()));
                    return u.postDispatch && u.postDispatch.call(this, e), e.result
                }
            },
            handlers: function(e, t) {
                var n, i, r, s, o = [],
                    a = t.delegateCount,
                    l = e.target;
                if (a && l.nodeType && (!e.button || "click" !== e.type))
                    for (; l != this; l = l.parentNode || this)
                        if (1 === l.nodeType && (l.disabled !== !0 || "click" !== e.type)) {
                            for (r = [], s = 0; a > s; s++) i = t[s], n = i.selector + " ", void 0 === r[n] && (r[n] = i.needsContext ? rt(n, this).index(l) >= 0 : rt.find(n, this, null, [l]).length), r[n] && r.push(i);
                            r.length && o.push({
                                elem: l,
                                handlers: r
                            })
                        }
                return a < t.length && o.push({
                    elem: this,
                    handlers: t.slice(a)
                }), o
            },
            fix: function(e) {
                if (e[rt.expando]) return e;
                var t, n, i, r = e.type,
                    s = e,
                    o = this.fixHooks[r];
                for (o || (this.fixHooks[r] = o = Pt.test(r) ? this.mouseHooks : At.test(r) ? this.keyHooks : {}), i = o.props ? this.props.concat(o.props) : this.props, e = new rt.Event(s), t = i.length; t--;) n = i[t], e[n] = s[n];
                return e.target || (e.target = s.srcElement || ft), 3 === e.target.nodeType && (e.target = e.target.parentNode), e.metaKey = !!e.metaKey, o.filter ? o.filter(e, s) : e
            },
            props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),
            fixHooks: {},
            keyHooks: {
                props: "char charCode key keyCode".split(" "),
                filter: function(e, t) {
                    return null == e.which && (e.which = null != t.charCode ? t.charCode : t.keyCode), e
                }
            },
            mouseHooks: {
                props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
                filter: function(e, t) {
                    var n, i, r, s = t.button,
                        o = t.fromElement;
                    return null == e.pageX && null != t.clientX && (i = e.target.ownerDocument || ft, r = i.documentElement, n = i.body, e.pageX = t.clientX + (r && r.scrollLeft || n && n.scrollLeft || 0) - (r && r.clientLeft || n && n.clientLeft || 0), e.pageY = t.clientY + (r && r.scrollTop || n && n.scrollTop || 0) - (r && r.clientTop || n && n.clientTop || 0)), !e.relatedTarget && o && (e.relatedTarget = o === e.target ? t.toElement : o), e.which || void 0 === s || (e.which = 1 & s ? 1 : 2 & s ? 3 : 4 & s ? 2 : 0), e
                }
            },
            special: {
                load: {
                    noBubble: !0
                },
                focus: {
                    trigger: function() {
                        if (this !== f() && this.focus) try {
                            return this.focus(), !1
                        } catch (e) {}
                    },
                    delegateType: "focusin"
                },
                blur: {
                    trigger: function() {
                        return this === f() && this.blur ? (this.blur(), !1) : void 0
                    },
                    delegateType: "focusout"
                },
                click: {
                    trigger: function() {
                        return rt.nodeName(this, "input") && "checkbox" === this.type && this.click ? (this.click(), !1) : void 0
                    },
                    _default: function(e) {
                        return rt.nodeName(e.target, "a")
                    }
                },
                beforeunload: {
                    postDispatch: function(e) {
                        void 0 !== e.result && e.originalEvent && (e.originalEvent.returnValue = e.result)
                    }
                }
            },
            simulate: function(e, t, n, i) {
                var r = rt.extend(new rt.Event, n, {
                    type: e,
                    isSimulated: !0,
                    originalEvent: {}
                });
                i ? rt.event.trigger(r, null, t) : rt.event.dispatch.call(t, r), r.isDefaultPrevented() && n.preventDefault()
            }
        }, rt.removeEvent = ft.removeEventListener ? function(e, t, n) {
            e.removeEventListener && e.removeEventListener(t, n, !1)
        } : function(e, t, n) {
            var i = "on" + t;
            e.detachEvent && (typeof e[i] === Tt && (e[i] = null), e.detachEvent(i, n))
        }, rt.Event = function(e, t) {
            return this instanceof rt.Event ? (e && e.type ? (this.originalEvent = e, this.type = e.type, this.isDefaultPrevented = e.defaultPrevented || void 0 === e.defaultPrevented && e.returnValue === !1 ? d : h) : this.type = e, t && rt.extend(this, t), this.timeStamp = e && e.timeStamp || rt.now(), void(this[rt.expando] = !0)) : new rt.Event(e, t)
        }, rt.Event.prototype = {
            isDefaultPrevented: h,
            isPropagationStopped: h,
            isImmediatePropagationStopped: h,
            preventDefault: function() {
                var e = this.originalEvent;
                this.isDefaultPrevented = d, e && (e.preventDefault ? e.preventDefault() : e.returnValue = !1)
            },
            stopPropagation: function() {
                var e = this.originalEvent;
                this.isPropagationStopped = d, e && (e.stopPropagation && e.stopPropagation(), e.cancelBubble = !0)
            },
            stopImmediatePropagation: function() {
                var e = this.originalEvent;
                this.isImmediatePropagationStopped = d, e && e.stopImmediatePropagation && e.stopImmediatePropagation(), this.stopPropagation()
            }
        }, rt.each({
            mouseenter: "mouseover",
            mouseleave: "mouseout",
            pointerenter: "pointerover",
            pointerleave: "pointerout"
        }, function(e, t) {
            rt.event.special[e] = {
                delegateType: t,
                bindType: t,
                handle: function(e) {
                    var n, i = this,
                        r = e.relatedTarget,
                        s = e.handleObj;
                    return (!r || r !== i && !rt.contains(i, r)) && (e.type = s.origType, n = s.handler.apply(this, arguments), e.type = t), n
                }
            }
        }), nt.submitBubbles || (rt.event.special.submit = {
            setup: function() {
                return rt.nodeName(this, "form") ? !1 : void rt.event.add(this, "click._submit keypress._submit", function(e) {
                    var t = e.target,
                        n = rt.nodeName(t, "input") || rt.nodeName(t, "button") ? t.form : void 0;
                    n && !rt._data(n, "submitBubbles") && (rt.event.add(n, "submit._submit", function(e) {
                        e._submit_bubble = !0
                    }), rt._data(n, "submitBubbles", !0))
                })
            },
            postDispatch: function(e) {
                e._submit_bubble && (delete e._submit_bubble, this.parentNode && !e.isTrigger && rt.event.simulate("submit", this.parentNode, e, !0))
            },
            teardown: function() {
                return rt.nodeName(this, "form") ? !1 : void rt.event.remove(this, "._submit")
            }
        }), nt.changeBubbles || (rt.event.special.change = {
            setup: function() {
                return Dt.test(this.nodeName) ? (("checkbox" === this.type || "radio" === this.type) && (rt.event.add(this, "propertychange._change", function(e) {
                    "checked" === e.originalEvent.propertyName && (this._just_changed = !0)
                }), rt.event.add(this, "click._change", function(e) {
                    this._just_changed && !e.isTrigger && (this._just_changed = !1), rt.event.simulate("change", this, e, !0)
                })), !1) : void rt.event.add(this, "beforeactivate._change", function(e) {
                    var t = e.target;
                    Dt.test(t.nodeName) && !rt._data(t, "changeBubbles") && (rt.event.add(t, "change._change", function(e) {
                        !this.parentNode || e.isSimulated || e.isTrigger || rt.event.simulate("change", this.parentNode, e, !0)
                    }), rt._data(t, "changeBubbles", !0))
                })
            },
            handle: function(e) {
                var t = e.target;
                return this !== t || e.isSimulated || e.isTrigger || "radio" !== t.type && "checkbox" !== t.type ? e.handleObj.handler.apply(this, arguments) : void 0
            },
            teardown: function() {
                return rt.event.remove(this, "._change"), !Dt.test(this.nodeName)
            }
        }), nt.focusinBubbles || rt.each({
            focus: "focusin",
            blur: "focusout"
        }, function(e, t) {
            var n = function(e) {
                rt.event.simulate(t, e.target, rt.event.fix(e), !0)
            };
            rt.event.special[t] = {
                setup: function() {
                    var i = this.ownerDocument || this,
                        r = rt._data(i, t);
                    r || i.addEventListener(e, n, !0), rt._data(i, t, (r || 0) + 1)
                },
                teardown: function() {
                    var i = this.ownerDocument || this,
                        r = rt._data(i, t) - 1;
                    r ? rt._data(i, t, r) : (i.removeEventListener(e, n, !0), rt._removeData(i, t))
                }
            }
        }), rt.fn.extend({
            on: function(e, t, n, i, r) {
                var s, o;
                if ("object" == typeof e) {
                    "string" != typeof t && (n = n || t, t = void 0);
                    for (s in e) this.on(s, t, n, e[s], r);
                    return this
                }
                if (null == n && null == i ? (i = t, n = t = void 0) : null == i && ("string" == typeof t ? (i = n, n = void 0) : (i = n, n = t, t = void 0)), i === !1) i = h;
                else if (!i) return this;
                return 1 === r && (o = i, i = function(e) {
                    return rt().off(e), o.apply(this, arguments)
                }, i.guid = o.guid || (o.guid = rt.guid++)), this.each(function() {
                    rt.event.add(this, e, i, n, t)
                })
            },
            one: function(e, t, n, i) {
                return this.on(e, t, n, i, 1)
            },
            off: function(e, t, n) {
                var i, r;
                if (e && e.preventDefault && e.handleObj) return i = e.handleObj, rt(e.delegateTarget).off(i.namespace ? i.origType + "." + i.namespace : i.origType, i.selector, i.handler), this;
                if ("object" == typeof e) {
                    for (r in e) this.off(r, t, e[r]);
                    return this
                }
                return (t === !1 || "function" == typeof t) && (n = t, t = void 0), n === !1 && (n = h), this.each(function() {
                    rt.event.remove(this, e, n, t)
                })
            },
            trigger: function(e, t) {
                return this.each(function() {
                    rt.event.trigger(e, t, this)
                })
            },
            triggerHandler: function(e, t) {
                var n = this[0];
                return n ? rt.event.trigger(e, t, n, !0) : void 0
            }
        });
        var jt = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
            Ft = / jQuery\d+="(?:null|\d+)"/g,
            Ht = new RegExp("<(?:" + jt + ")[\\s/>]", "i"),
            Mt = /^\s+/,
            Ut = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
            zt = /<([\w:]+)/,
            Wt = /<tbody/i,
            Bt = /<|&#?\w+;/,
            qt = /<(?:script|style|link)/i,
            Vt = /checked\s*(?:[^=]|=\s*.checked.)/i,
            Xt = /^$|\/(?:java|ecma)script/i,
            Yt = /^true\/(.*)/,
            Jt = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,
            Gt = {
                option: [1, "<select multiple='multiple'>", "</select>"],
                legend: [1, "<fieldset>", "</fieldset>"],
                area: [1, "<map>", "</map>"],
                param: [1, "<object>", "</object>"],
                thead: [1, "<table>", "</table>"],
                tr: [2, "<table><tbody>", "</tbody></table>"],
                col: [2, "<table><tbody></tbody><colgroup>", "</colgroup></table>"],
                td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
                _default: nt.htmlSerialize ? [0, "", ""] : [1, "X<div>", "</div>"]
            },
            $t = m(ft),
            Kt = $t.appendChild(ft.createElement("div"));
        Gt.optgroup = Gt.option, Gt.tbody = Gt.tfoot = Gt.colgroup = Gt.caption = Gt.thead, Gt.th = Gt.td, rt.extend({
            clone: function(e, t, n) {
                var i, r, s, o, a, l = rt.contains(e.ownerDocument, e);
                if (nt.html5Clone || rt.isXMLDoc(e) || !Ht.test("<" + e.nodeName + ">") ? s = e.cloneNode(!0) : (Kt.innerHTML = e.outerHTML, Kt.removeChild(s = Kt.firstChild)), !(nt.noCloneEvent && nt.noCloneChecked || 1 !== e.nodeType && 11 !== e.nodeType || rt.isXMLDoc(e)))
                    for (i = g(s), a = g(e), o = 0; null != (r = a[o]); ++o) i[o] && T(r, i[o]);
                if (t)
                    if (n)
                        for (a = a || g(e), i = i || g(s), o = 0; null != (r = a[o]); o++) w(r, i[o]);
                    else w(e, s);
                return i = g(s, "script"), i.length > 0 && S(i, !l && g(e, "script")), i = a = r = null, s
            },
            buildFragment: function(e, t, n, i) {
                for (var r, s, o, a, l, u, c, p = e.length, d = m(t), h = [], f = 0; p > f; f++)
                    if (s = e[f], s || 0 === s)
                        if ("object" === rt.type(s)) rt.merge(h, s.nodeType ? [s] : s);
                        else if (Bt.test(s)) {
                    for (a = a || d.appendChild(t.createElement("div")), l = (zt.exec(s) || ["", ""])[1].toLowerCase(), c = Gt[l] || Gt._default, a.innerHTML = c[1] + s.replace(Ut, "<$1></$2>") + c[2], r = c[0]; r--;) a = a.lastChild;
                    if (!nt.leadingWhitespace && Mt.test(s) && h.push(t.createTextNode(Mt.exec(s)[0])), !nt.tbody)
                        for (s = "table" !== l || Wt.test(s) ? "<table>" !== c[1] || Wt.test(s) ? 0 : a : a.firstChild, r = s && s.childNodes.length; r--;) rt.nodeName(u = s.childNodes[r], "tbody") && !u.childNodes.length && s.removeChild(u);
                    for (rt.merge(h, a.childNodes), a.textContent = ""; a.firstChild;) a.removeChild(a.firstChild);
                    a = d.lastChild
                } else h.push(t.createTextNode(s));
                for (a && d.removeChild(a), nt.appendChecked || rt.grep(g(h, "input"), b), f = 0; s = h[f++];)
                    if ((!i || -1 === rt.inArray(s, i)) && (o = rt.contains(s.ownerDocument, s), a = g(d.appendChild(s), "script"), o && S(a), n))
                        for (r = 0; s = a[r++];) Xt.test(s.type || "") && n.push(s);
                return a = null, d
            },
            cleanData: function(e, t) {
                for (var n, i, r, s, o = 0, a = rt.expando, l = rt.cache, u = nt.deleteExpando, c = rt.event.special; null != (n = e[o]); o++)
                    if ((t || rt.acceptData(n)) && (r = n[a], s = r && l[r])) {
                        if (s.events)
                            for (i in s.events) c[i] ? rt.event.remove(n, i) : rt.removeEvent(n, i, s.handle);
                        l[r] && (delete l[r], u ? delete n[a] : typeof n.removeAttribute !== Tt ? n.removeAttribute(a) : n[a] = null, J.push(r))
                    }
            }
        }), rt.fn.extend({
            text: function(e) {
                return Nt(this, function(e) {
                    return void 0 === e ? rt.text(this) : this.empty().append((this[0] && this[0].ownerDocument || ft).createTextNode(e))
                }, null, e, arguments.length)
            },
            append: function() {
                return this.domManip(arguments, function(e) {
                    if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
                        var t = v(this, e);
                        t.appendChild(e)
                    }
                })
            },
            prepend: function() {
                return this.domManip(arguments, function(e) {
                    if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
                        var t = v(this, e);
                        t.insertBefore(e, t.firstChild)
                    }
                })
            },
            before: function() {
                return this.domManip(arguments, function(e) {
                    this.parentNode && this.parentNode.insertBefore(e, this)
                })
            },
            after: function() {
                return this.domManip(arguments, function(e) {
                    this.parentNode && this.parentNode.insertBefore(e, this.nextSibling)
                })
            },
            remove: function(e, t) {
                for (var n, i = e ? rt.filter(e, this) : this, r = 0; null != (n = i[r]); r++) t || 1 !== n.nodeType || rt.cleanData(g(n)), n.parentNode && (t && rt.contains(n.ownerDocument, n) && S(g(n, "script")), n.parentNode.removeChild(n));
                return this
            },
            empty: function() {
                for (var e, t = 0; null != (e = this[t]); t++) {
                    for (1 === e.nodeType && rt.cleanData(g(e, !1)); e.firstChild;) e.removeChild(e.firstChild);
                    e.options && rt.nodeName(e, "select") && (e.options.length = 0)
                }
                return this
            },
            clone: function(e, t) {
                return e = null == e ? !1 : e, t = null == t ? e : t, this.map(function() {
                    return rt.clone(this, e, t)
                })
            },
            html: function(e) {
                return Nt(this, function(e) {
                    var t = this[0] || {},
                        n = 0,
                        i = this.length;
                    if (void 0 === e) return 1 === t.nodeType ? t.innerHTML.replace(Ft, "") : void 0;
                    if (!("string" != typeof e || qt.test(e) || !nt.htmlSerialize && Ht.test(e) || !nt.leadingWhitespace && Mt.test(e) || Gt[(zt.exec(e) || ["", ""])[1].toLowerCase()])) {
                        e = e.replace(Ut, "<$1></$2>");
                        try {
                            for (; i > n; n++) t = this[n] || {}, 1 === t.nodeType && (rt.cleanData(g(t, !1)), t.innerHTML = e);
                            t = 0
                        } catch (r) {}
                    }
                    t && this.empty().append(e)
                }, null, e, arguments.length)
            },
            replaceWith: function() {
                var e = arguments[0];
                return this.domManip(arguments, function(t) {
                    e = this.parentNode, rt.cleanData(g(this)), e && e.replaceChild(t, this)
                }), e && (e.length || e.nodeType) ? this : this.remove()
            },
            detach: function(e) {
                return this.remove(e, !0)
            },
            domManip: function(e, t) {
                e = $.apply([], e);
                var n, i, r, s, o, a, l = 0,
                    u = this.length,
                    c = this,
                    p = u - 1,
                    d = e[0],
                    h = rt.isFunction(d);
                if (h || u > 1 && "string" == typeof d && !nt.checkClone && Vt.test(d)) return this.each(function(n) {
                    var i = c.eq(n);
                    h && (e[0] = d.call(this, n, i.html())), i.domManip(e, t)
                });
                if (u && (a = rt.buildFragment(e, this[0].ownerDocument, !1, this), n = a.firstChild, 1 === a.childNodes.length && (a = n), n)) {
                    for (s = rt.map(g(a, "script"), k), r = s.length; u > l; l++) i = a, l !== p && (i = rt.clone(i, !0, !0), r && rt.merge(s, g(i, "script"))), t.call(this[l], i, l);
                    if (r)
                        for (o = s[s.length - 1].ownerDocument, rt.map(s, y), l = 0; r > l; l++) i = s[l], Xt.test(i.type || "") && !rt._data(i, "globalEval") && rt.contains(o, i) && (i.src ? rt._evalUrl && rt._evalUrl(i.src) : rt.globalEval((i.text || i.textContent || i.innerHTML || "").replace(Jt, "")));
                    a = n = null
                }
                return this
            }
        }), rt.each({
            appendTo: "append",
            prependTo: "prepend",
            insertBefore: "before",
            insertAfter: "after",
            replaceAll: "replaceWith"
        }, function(e, t) {
            rt.fn[e] = function(e) {
                for (var n, i = 0, r = [], s = rt(e), o = s.length - 1; o >= i; i++) n = i === o ? this : this.clone(!0), rt(s[i])[t](n), K.apply(r, n.get());
                return this.pushStack(r)
            }
        });
        var Qt, Zt = {};
        ! function() {
            var e;
            nt.shrinkWrapBlocks = function() {
                if (null != e) return e;
                e = !1;
                var t, n, i;
                return n = ft.getElementsByTagName("body")[0], n && n.style ? (t = ft.createElement("div"), i = ft.createElement("div"), i.style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px", n.appendChild(i).appendChild(t), typeof t.style.zoom !== Tt && (t.style.cssText = "-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:1px;width:1px;zoom:1", t.appendChild(ft.createElement("div")).style.width = "5px", e = 3 !== t.offsetWidth), n.removeChild(i), e) : void 0
            }
        }();
        var en, tn, nn = /^margin/,
            rn = new RegExp("^(" + It + ")(?!px)[a-z%]+$", "i"),
            sn = /^(top|right|bottom|left)$/;
        e.getComputedStyle ? (en = function(e) {
                return e.ownerDocument.defaultView.getComputedStyle(e, null)
            }, tn = function(e, t, n) {
                var i, r, s, o, a = e.style;
                return n = n || en(e), o = n ? n.getPropertyValue(t) || n[t] : void 0, n && ("" !== o || rt.contains(e.ownerDocument, e) || (o = rt.style(e, t)), rn.test(o) && nn.test(t) && (i = a.width, r = a.minWidth, s = a.maxWidth, a.minWidth = a.maxWidth = a.width = o, o = n.width, a.width = i, a.minWidth = r, a.maxWidth = s)), void 0 === o ? o : o + ""
            }) : ft.documentElement.currentStyle && (en = function(e) {
                return e.currentStyle
            }, tn = function(e, t, n) {
                var i, r, s, o, a = e.style;
                return n = n || en(e), o = n ? n[t] : void 0, null == o && a && a[t] && (o = a[t]), rn.test(o) && !sn.test(t) && (i = a.left, r = e.runtimeStyle, s = r && r.left, s && (r.left = e.currentStyle.left), a.left = "fontSize" === t ? "1em" : o, o = a.pixelLeft + "px", a.left = i, s && (r.left = s)), void 0 === o ? o : o + "" || "auto"
            }),
            function() {
                function t() {
                    var t, n, i, r;
                    n = ft.getElementsByTagName("body")[0], n && n.style && (t = ft.createElement("div"), i = ft.createElement("div"), i.style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px", n.appendChild(i).appendChild(t), t.style.cssText = "-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;display:block;margin-top:1%;top:1%;border:1px;padding:1px;width:4px;position:absolute", s = o = !1, l = !0, e.getComputedStyle && (s = "1%" !== (e.getComputedStyle(t, null) || {}).top, o = "4px" === (e.getComputedStyle(t, null) || {
                        width: "4px"
                    }).width, r = t.appendChild(ft.createElement("div")), r.style.cssText = t.style.cssText = "-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:0", r.style.marginRight = r.style.width = "0", t.style.width = "1px", l = !parseFloat((e.getComputedStyle(r, null) || {}).marginRight)), t.innerHTML = "<table><tr><td></td><td>t</td></tr></table>", r = t.getElementsByTagName("td"), r[0].style.cssText = "margin:0;border:0;padding:0;display:none", a = 0 === r[0].offsetHeight, a && (r[0].style.display = "", r[1].style.display = "none", a = 0 === r[0].offsetHeight), n.removeChild(i))
                }
                var n, i, r, s, o, a, l;
                n = ft.createElement("div"), n.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>", r = n.getElementsByTagName("a")[0], i = r && r.style, i && (i.cssText = "float:left;opacity:.5", nt.opacity = "0.5" === i.opacity, nt.cssFloat = !!i.cssFloat, n.style.backgroundClip = "content-box", n.cloneNode(!0).style.backgroundClip = "", nt.clearCloneStyle = "content-box" === n.style.backgroundClip, nt.boxSizing = "" === i.boxSizing || "" === i.MozBoxSizing || "" === i.WebkitBoxSizing, rt.extend(nt, {
                    reliableHiddenOffsets: function() {
                        return null == a && t(), a
                    },
                    boxSizingReliable: function() {
                        return null == o && t(), o
                    },
                    pixelPosition: function() {
                        return null == s && t(), s
                    },
                    reliableMarginRight: function() {
                        return null == l && t(), l
                    }
                }))
            }(), rt.swap = function(e, t, n, i) {
                var r, s, o = {};
                for (s in t) o[s] = e.style[s], e.style[s] = t[s];
                r = n.apply(e, i || []);
                for (s in t) e.style[s] = o[s];
                return r
            };
        var on = /alpha\([^)]*\)/i,
            an = /opacity\s*=\s*([^)]*)/,
            ln = /^(none|table(?!-c[ea]).+)/,
            un = new RegExp("^(" + It + ")(.*)$", "i"),
            cn = new RegExp("^([+-])=(" + It + ")", "i"),
            pn = {
                position: "absolute",
                visibility: "hidden",
                display: "block"
            },
            dn = {
                letterSpacing: "0",
                fontWeight: "400"
            },
            hn = ["Webkit", "O", "Moz", "ms"];
        rt.extend({
            cssHooks: {
                opacity: {
                    get: function(e, t) {
                        if (t) {
                            var n = tn(e, "opacity");
                            return "" === n ? "1" : n
                        }
                    }
                }
            },
            cssNumber: {
                columnCount: !0,
                fillOpacity: !0,
                flexGrow: !0,
                flexShrink: !0,
                fontWeight: !0,
                lineHeight: !0,
                opacity: !0,
                order: !0,
                orphans: !0,
                widows: !0,
                zIndex: !0,
                zoom: !0
            },
            cssProps: {
                "float": nt.cssFloat ? "cssFloat" : "styleFloat"
            },
            style: function(e, t, n, i) {
                if (e && 3 !== e.nodeType && 8 !== e.nodeType && e.style) {
                    var r, s, o, a = rt.camelCase(t),
                        l = e.style;
                    if (t = rt.cssProps[a] || (rt.cssProps[a] = _(l, a)), o = rt.cssHooks[t] || rt.cssHooks[a], void 0 === n) return o && "get" in o && void 0 !== (r = o.get(e, !1, i)) ? r : l[t];
                    if (s = typeof n, "string" === s && (r = cn.exec(n)) && (n = (r[1] + 1) * r[2] + parseFloat(rt.css(e, t)), s = "number"), null != n && n === n && ("number" !== s || rt.cssNumber[a] || (n += "px"), nt.clearCloneStyle || "" !== n || 0 !== t.indexOf("background") || (l[t] = "inherit"), !(o && "set" in o && void 0 === (n = o.set(e, n, i))))) try {
                        l[t] = n
                    } catch (u) {}
                }
            },
            css: function(e, t, n, i) {
                var r, s, o, a = rt.camelCase(t);
                return t = rt.cssProps[a] || (rt.cssProps[a] = _(e.style, a)), o = rt.cssHooks[t] || rt.cssHooks[a], o && "get" in o && (s = o.get(e, !0, n)), void 0 === s && (s = tn(e, t, i)), "normal" === s && t in dn && (s = dn[t]), "" === n || n ? (r = parseFloat(s), n === !0 || rt.isNumeric(r) ? r || 0 : s) : s
            }
        }), rt.each(["height", "width"], function(e, t) {
            rt.cssHooks[t] = {
                get: function(e, n, i) {
                    return n ? ln.test(rt.css(e, "display")) && 0 === e.offsetWidth ? rt.swap(e, pn, function() {
                        return D(e, t, i)
                    }) : D(e, t, i) : void 0
                },
                set: function(e, n, i) {
                    var r = i && en(e);
                    return N(e, n, i ? R(e, t, i, nt.boxSizing && "border-box" === rt.css(e, "boxSizing", !1, r), r) : 0)
                }
            }
        }), nt.opacity || (rt.cssHooks.opacity = {
            get: function(e, t) {
                return an.test((t && e.currentStyle ? e.currentStyle.filter : e.style.filter) || "") ? .01 * parseFloat(RegExp.$1) + "" : t ? "1" : ""
            },
            set: function(e, t) {
                var n = e.style,
                    i = e.currentStyle,
                    r = rt.isNumeric(t) ? "alpha(opacity=" + 100 * t + ")" : "",
                    s = i && i.filter || n.filter || "";
                n.zoom = 1, (t >= 1 || "" === t) && "" === rt.trim(s.replace(on, "")) && n.removeAttribute && (n.removeAttribute("filter"), "" === t || i && !i.filter) || (n.filter = on.test(s) ? s.replace(on, r) : s + " " + r)
            }
        }), rt.cssHooks.marginRight = I(nt.reliableMarginRight, function(e, t) {
            return t ? rt.swap(e, {
                display: "inline-block"
            }, tn, [e, "marginRight"]) : void 0
        }), rt.each({
            margin: "",
            padding: "",
            border: "Width"
        }, function(e, t) {
            rt.cssHooks[e + t] = {
                expand: function(n) {
                    for (var i = 0, r = {}, s = "string" == typeof n ? n.split(" ") : [n]; 4 > i; i++) r[e + _t[i] + t] = s[i] || s[i - 2] || s[0];
                    return r
                }
            }, nn.test(e) || (rt.cssHooks[e + t].set = N)
        }), rt.fn.extend({
            css: function(e, t) {
                return Nt(this, function(e, t, n) {
                    var i, r, s = {},
                        o = 0;
                    if (rt.isArray(t)) {
                        for (i = en(e), r = t.length; r > o; o++) s[t[o]] = rt.css(e, t[o], !1, i);
                        return s
                    }
                    return void 0 !== n ? rt.style(e, t, n) : rt.css(e, t)
                }, e, t, arguments.length > 1)
            },
            show: function() {
                return C(this, !0)
            },
            hide: function() {
                return C(this)
            },
            toggle: function(e) {
                return "boolean" == typeof e ? e ? this.show() : this.hide() : this.each(function() {
                    Ct(this) ? rt(this).show() : rt(this).hide()
                })
            }
        }), rt.Tween = A, A.prototype = {
            constructor: A,
            init: function(e, t, n, i, r, s) {
                this.elem = e, this.prop = n, this.easing = r || "swing", this.options = t, this.start = this.now = this.cur(), this.end = i, this.unit = s || (rt.cssNumber[n] ? "" : "px")
            },
            cur: function() {
                var e = A.propHooks[this.prop];
                return e && e.get ? e.get(this) : A.propHooks._default.get(this)
            },
            run: function(e) {
                var t, n = A.propHooks[this.prop];
                return this.pos = t = this.options.duration ? rt.easing[this.easing](e, this.options.duration * e, 0, 1, this.options.duration) : e, this.now = (this.end - this.start) * t + this.start, this.options.step && this.options.step.call(this.elem, this.now, this), n && n.set ? n.set(this) : A.propHooks._default.set(this), this
            }
        }, A.prototype.init.prototype = A.prototype, A.propHooks = {
            _default: {
                get: function(e) {
                    var t;
                    return null == e.elem[e.prop] || e.elem.style && null != e.elem.style[e.prop] ? (t = rt.css(e.elem, e.prop, ""), t && "auto" !== t ? t : 0) : e.elem[e.prop]
                },
                set: function(e) {
                    rt.fx.step[e.prop] ? rt.fx.step[e.prop](e) : e.elem.style && (null != e.elem.style[rt.cssProps[e.prop]] || rt.cssHooks[e.prop]) ? rt.style(e.elem, e.prop, e.now + e.unit) : e.elem[e.prop] = e.now
                }
            }
        }, A.propHooks.scrollTop = A.propHooks.scrollLeft = {
            set: function(e) {
                e.elem.nodeType && e.elem.parentNode && (e.elem[e.prop] = e.now)
            }
        }, rt.easing = {
            linear: function(e) {
                return e
            },
            swing: function(e) {
                return .5 - Math.cos(e * Math.PI) / 2
            }
        }, rt.fx = A.prototype.init, rt.fx.step = {};
        var fn, mn, gn = /^(?:toggle|show|hide)$/,
            bn = new RegExp("^(?:([+-])=|)(" + It + ")([a-z%]*)$", "i"),
            vn = /queueHooks$/,
            kn = [j],
            yn = {
                "*": [function(e, t) {
                    var n = this.createTween(e, t),
                        i = n.cur(),
                        r = bn.exec(t),
                        s = r && r[3] || (rt.cssNumber[e] ? "" : "px"),
                        o = (rt.cssNumber[e] || "px" !== s && +i) && bn.exec(rt.css(n.elem, e)),
                        a = 1,
                        l = 20;
                    if (o && o[3] !== s) {
                        s = s || o[3], r = r || [], o = +i || 1;
                        do a = a || ".5", o /= a, rt.style(n.elem, e, o + s); while (a !== (a = n.cur() / i) && 1 !== a && --l)
                    }
                    return r && (o = n.start = +o || +i || 0, n.unit = s, n.end = r[1] ? o + (r[1] + 1) * r[2] : +r[2]), n
                }]
            };
        rt.Animation = rt.extend(H, {
                tweener: function(e, t) {
                    rt.isFunction(e) ? (t = e, e = ["*"]) : e = e.split(" ");
                    for (var n, i = 0, r = e.length; r > i; i++) n = e[i], yn[n] = yn[n] || [], yn[n].unshift(t)
                },
                prefilter: function(e, t) {
                    t ? kn.unshift(e) : kn.push(e)
                }
            }), rt.speed = function(e, t, n) {
                var i = e && "object" == typeof e ? rt.extend({}, e) : {
                    complete: n || !n && t || rt.isFunction(e) && e,
                    duration: e,
                    easing: n && t || t && !rt.isFunction(t) && t
                };
                return i.duration = rt.fx.off ? 0 : "number" == typeof i.duration ? i.duration : i.duration in rt.fx.speeds ? rt.fx.speeds[i.duration] : rt.fx.speeds._default, (null == i.queue || i.queue === !0) && (i.queue = "fx"), i.old = i.complete, i.complete = function() {
                    rt.isFunction(i.old) && i.old.call(this), i.queue && rt.dequeue(this, i.queue)
                }, i
            }, rt.fn.extend({
                fadeTo: function(e, t, n, i) {
                    return this.filter(Ct).css("opacity", 0).show().end().animate({
                        opacity: t
                    }, e, n, i)
                },
                animate: function(e, t, n, i) {
                    var r = rt.isEmptyObject(e),
                        s = rt.speed(t, n, i),
                        o = function() {
                            var t = H(this, rt.extend({}, e), s);
                            (r || rt._data(this, "finish")) && t.stop(!0)
                        };
                    return o.finish = o, r || s.queue === !1 ? this.each(o) : this.queue(s.queue, o)
                },
                stop: function(e, t, n) {
                    var i = function(e) {
                        var t = e.stop;
                        delete e.stop, t(n)
                    };
                    return "string" != typeof e && (n = t, t = e, e = void 0), t && e !== !1 && this.queue(e || "fx", []), this.each(function() {
                        var t = !0,
                            r = null != e && e + "queueHooks",
                            s = rt.timers,
                            o = rt._data(this);
                        if (r) o[r] && o[r].stop && i(o[r]);
                        else
                            for (r in o) o[r] && o[r].stop && vn.test(r) && i(o[r]);
                        for (r = s.length; r--;) s[r].elem !== this || null != e && s[r].queue !== e || (s[r].anim.stop(n), t = !1, s.splice(r, 1));
                        (t || !n) && rt.dequeue(this, e)
                    })
                },
                finish: function(e) {
                    return e !== !1 && (e = e || "fx"), this.each(function() {
                        var t, n = rt._data(this),
                            i = n[e + "queue"],
                            r = n[e + "queueHooks"],
                            s = rt.timers,
                            o = i ? i.length : 0;
                        for (n.finish = !0, rt.queue(this, e, []), r && r.stop && r.stop.call(this, !0), t = s.length; t--;) s[t].elem === this && s[t].queue === e && (s[t].anim.stop(!0), s.splice(t, 1));
                        for (t = 0; o > t; t++) i[t] && i[t].finish && i[t].finish.call(this);
                        delete n.finish
                    })
                }
            }), rt.each(["toggle", "show", "hide"], function(e, t) {
                var n = rt.fn[t];
                rt.fn[t] = function(e, i, r) {
                    return null == e || "boolean" == typeof e ? n.apply(this, arguments) : this.animate(L(t, !0), e, i, r)
                }
            }), rt.each({
                slideDown: L("show"),
                slideUp: L("hide"),
                slideToggle: L("toggle"),
                fadeIn: {
                    opacity: "show"
                },
                fadeOut: {
                    opacity: "hide"
                },
                fadeToggle: {
                    opacity: "toggle"
                }
            }, function(e, t) {
                rt.fn[e] = function(e, n, i) {
                    return this.animate(t, e, n, i)
                }
            }), rt.timers = [], rt.fx.tick = function() {
                var e, t = rt.timers,
                    n = 0;
                for (fn = rt.now(); n < t.length; n++) e = t[n], e() || t[n] !== e || t.splice(n--, 1);
                t.length || rt.fx.stop(), fn = void 0
            }, rt.fx.timer = function(e) {
                rt.timers.push(e), e() ? rt.fx.start() : rt.timers.pop()
            }, rt.fx.interval = 13, rt.fx.start = function() {
                mn || (mn = setInterval(rt.fx.tick, rt.fx.interval))
            }, rt.fx.stop = function() {
                clearInterval(mn), mn = null
            }, rt.fx.speeds = {
                slow: 600,
                fast: 200,
                _default: 400
            }, rt.fn.delay = function(e, t) {
                return e = rt.fx ? rt.fx.speeds[e] || e : e, t = t || "fx", this.queue(t, function(t, n) {
                    var i = setTimeout(t, e);
                    n.stop = function() {
                        clearTimeout(i)
                    }
                })
            },
            function() {
                var e, t, n, i, r;
                t = ft.createElement("div"), t.setAttribute("className", "t"), t.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>", i = t.getElementsByTagName("a")[0], n = ft.createElement("select"), r = n.appendChild(ft.createElement("option")), e = t.getElementsByTagName("input")[0], i.style.cssText = "top:1px", nt.getSetAttribute = "t" !== t.className, nt.style = /top/.test(i.getAttribute("style")), nt.hrefNormalized = "/a" === i.getAttribute("href"), nt.checkOn = !!e.value, nt.optSelected = r.selected, nt.enctype = !!ft.createElement("form").enctype, n.disabled = !0, nt.optDisabled = !r.disabled, e = ft.createElement("input"), e.setAttribute("value", ""), nt.input = "" === e.getAttribute("value"), e.value = "t", e.setAttribute("type", "radio"), nt.radioValue = "t" === e.value
            }();
        var Sn = /\r/g;
        rt.fn.extend({
            val: function(e) {
                var t, n, i, r = this[0]; {
                    if (arguments.length) return i = rt.isFunction(e), this.each(function(n) {
                        var r;
                        1 === this.nodeType && (r = i ? e.call(this, n, rt(this).val()) : e, null == r ? r = "" : "number" == typeof r ? r += "" : rt.isArray(r) && (r = rt.map(r, function(e) {
                            return null == e ? "" : e + ""
                        })), t = rt.valHooks[this.type] || rt.valHooks[this.nodeName.toLowerCase()], t && "set" in t && void 0 !== t.set(this, r, "value") || (this.value = r))
                    });
                    if (r) return t = rt.valHooks[r.type] || rt.valHooks[r.nodeName.toLowerCase()], t && "get" in t && void 0 !== (n = t.get(r, "value")) ? n : (n = r.value, "string" == typeof n ? n.replace(Sn, "") : null == n ? "" : n)
                }
            }
        }), rt.extend({
            valHooks: {
                option: {
                    get: function(e) {
                        var t = rt.find.attr(e, "value");
                        return null != t ? t : rt.trim(rt.text(e))
                    }
                },
                select: {
                    get: function(e) {
                        for (var t, n, i = e.options, r = e.selectedIndex, s = "select-one" === e.type || 0 > r, o = s ? null : [], a = s ? r + 1 : i.length, l = 0 > r ? a : s ? r : 0; a > l; l++)
                            if (n = i[l], !(!n.selected && l !== r || (nt.optDisabled ? n.disabled : null !== n.getAttribute("disabled")) || n.parentNode.disabled && rt.nodeName(n.parentNode, "optgroup"))) {
                                if (t = rt(n).val(), s) return t;
                                o.push(t)
                            }
                        return o
                    },
                    set: function(e, t) {
                        for (var n, i, r = e.options, s = rt.makeArray(t), o = r.length; o--;)
                            if (i = r[o], rt.inArray(rt.valHooks.option.get(i), s) >= 0) try {
                                i.selected = n = !0
                            } catch (a) {
                                i.scrollHeight
                            } else i.selected = !1;
                        return n || (e.selectedIndex = -1), r
                    }
                }
            }
        }), rt.each(["radio", "checkbox"], function() {
            rt.valHooks[this] = {
                set: function(e, t) {
                    return rt.isArray(t) ? e.checked = rt.inArray(rt(e).val(), t) >= 0 : void 0
                }
            }, nt.checkOn || (rt.valHooks[this].get = function(e) {
                return null === e.getAttribute("value") ? "on" : e.value
            })
        });
        var wn, Tn, En = rt.expr.attrHandle,
            xn = /^(?:checked|selected)$/i,
            In = nt.getSetAttribute,
            _n = nt.input;
        rt.fn.extend({
            attr: function(e, t) {
                return Nt(this, rt.attr, e, t, arguments.length > 1)
            },
            removeAttr: function(e) {
                return this.each(function() {
                    rt.removeAttr(this, e)
                })
            }
        }), rt.extend({
            attr: function(e, t, n) {
                var i, r, s = e.nodeType;
                if (e && 3 !== s && 8 !== s && 2 !== s) return typeof e.getAttribute === Tt ? rt.prop(e, t, n) : (1 === s && rt.isXMLDoc(e) || (t = t.toLowerCase(), i = rt.attrHooks[t] || (rt.expr.match.bool.test(t) ? Tn : wn)), void 0 === n ? i && "get" in i && null !== (r = i.get(e, t)) ? r : (r = rt.find.attr(e, t), null == r ? void 0 : r) : null !== n ? i && "set" in i && void 0 !== (r = i.set(e, n, t)) ? r : (e.setAttribute(t, n + ""), n) : void rt.removeAttr(e, t))
            },
            removeAttr: function(e, t) {
                var n, i, r = 0,
                    s = t && t.match(kt);
                if (s && 1 === e.nodeType)
                    for (; n = s[r++];) i = rt.propFix[n] || n, rt.expr.match.bool.test(n) ? _n && In || !xn.test(n) ? e[i] = !1 : e[rt.camelCase("default-" + n)] = e[i] = !1 : rt.attr(e, n, ""), e.removeAttribute(In ? n : i)
            },
            attrHooks: {
                type: {
                    set: function(e, t) {
                        if (!nt.radioValue && "radio" === t && rt.nodeName(e, "input")) {
                            var n = e.value;
                            return e.setAttribute("type", t), n && (e.value = n), t
                        }
                    }
                }
            }
        }), Tn = {
            set: function(e, t, n) {
                return t === !1 ? rt.removeAttr(e, n) : _n && In || !xn.test(n) ? e.setAttribute(!In && rt.propFix[n] || n, n) : e[rt.camelCase("default-" + n)] = e[n] = !0, n
            }
        }, rt.each(rt.expr.match.bool.source.match(/\w+/g), function(e, t) {
            var n = En[t] || rt.find.attr;
            En[t] = _n && In || !xn.test(t) ? function(e, t, i) {
                var r, s;
                return i || (s = En[t], En[t] = r, r = null != n(e, t, i) ? t.toLowerCase() : null, En[t] = s), r
            } : function(e, t, n) {
                return n ? void 0 : e[rt.camelCase("default-" + t)] ? t.toLowerCase() : null
            }
        }), _n && In || (rt.attrHooks.value = {
            set: function(e, t, n) {
                return rt.nodeName(e, "input") ? void(e.defaultValue = t) : wn && wn.set(e, t, n)
            }
        }), In || (wn = {
            set: function(e, t, n) {
                var i = e.getAttributeNode(n);
                return i || e.setAttributeNode(i = e.ownerDocument.createAttribute(n)), i.value = t += "", "value" === n || t === e.getAttribute(n) ? t : void 0
            }
        }, En.id = En.name = En.coords = function(e, t, n) {
            var i;
            return n ? void 0 : (i = e.getAttributeNode(t)) && "" !== i.value ? i.value : null
        }, rt.valHooks.button = {
            get: function(e, t) {
                var n = e.getAttributeNode(t);
                return n && n.specified ? n.value : void 0
            },
            set: wn.set
        }, rt.attrHooks.contenteditable = {
            set: function(e, t, n) {
                wn.set(e, "" === t ? !1 : t, n)
            }
        }, rt.each(["width", "height"], function(e, t) {
            rt.attrHooks[t] = {
                set: function(e, n) {
                    return "" === n ? (e.setAttribute(t, "auto"), n) : void 0
                }
            }
        })), nt.style || (rt.attrHooks.style = {
            get: function(e) {
                return e.style.cssText || void 0
            },
            set: function(e, t) {
                return e.style.cssText = t + ""
            }
        });
        var Cn = /^(?:input|select|textarea|button|object)$/i,
            Nn = /^(?:a|area)$/i;
        rt.fn.extend({
            prop: function(e, t) {
                return Nt(this, rt.prop, e, t, arguments.length > 1)
            },
            removeProp: function(e) {
                return e = rt.propFix[e] || e, this.each(function() {
                    try {
                        this[e] = void 0, delete this[e]
                    } catch (t) {}
                })
            }
        }), rt.extend({
            propFix: {
                "for": "htmlFor",
                "class": "className"
            },
            prop: function(e, t, n) {
                var i, r, s, o = e.nodeType;
                if (e && 3 !== o && 8 !== o && 2 !== o) return s = 1 !== o || !rt.isXMLDoc(e), s && (t = rt.propFix[t] || t, r = rt.propHooks[t]), void 0 !== n ? r && "set" in r && void 0 !== (i = r.set(e, n, t)) ? i : e[t] = n : r && "get" in r && null !== (i = r.get(e, t)) ? i : e[t]
            },
            propHooks: {
                tabIndex: {
                    get: function(e) {
                        var t = rt.find.attr(e, "tabindex");
                        return t ? parseInt(t, 10) : Cn.test(e.nodeName) || Nn.test(e.nodeName) && e.href ? 0 : -1
                    }
                }
            }
        }), nt.hrefNormalized || rt.each(["href", "src"], function(e, t) {
            rt.propHooks[t] = {
                get: function(e) {
                    return e.getAttribute(t, 4)
                }
            }
        }), nt.optSelected || (rt.propHooks.selected = {
            get: function(e) {
                var t = e.parentNode;
                return t && (t.selectedIndex, t.parentNode && t.parentNode.selectedIndex), null
            }
        }), rt.each(["tabIndex", "readOnly", "maxLength", "cellSpacing", "cellPadding", "rowSpan", "colSpan", "useMap", "frameBorder", "contentEditable"], function() {
            rt.propFix[this.toLowerCase()] = this
        }), nt.enctype || (rt.propFix.enctype = "encoding");
        var Rn = /[\t\r\n\f]/g;
        rt.fn.extend({
            addClass: function(e) {
                var t, n, i, r, s, o, a = 0,
                    l = this.length,
                    u = "string" == typeof e && e;
                if (rt.isFunction(e)) return this.each(function(t) {
                    rt(this).addClass(e.call(this, t, this.className))
                });
                if (u)
                    for (t = (e || "").match(kt) || []; l > a; a++)
                        if (n = this[a], i = 1 === n.nodeType && (n.className ? (" " + n.className + " ").replace(Rn, " ") : " ")) {
                            for (s = 0; r = t[s++];) i.indexOf(" " + r + " ") < 0 && (i += r + " ");
                            o = rt.trim(i), n.className !== o && (n.className = o)
                        }
                return this
            },
            removeClass: function(e) {
                var t, n, i, r, s, o, a = 0,
                    l = this.length,
                    u = 0 === arguments.length || "string" == typeof e && e;
                if (rt.isFunction(e)) return this.each(function(t) {
                    rt(this).removeClass(e.call(this, t, this.className))
                });
                if (u)
                    for (t = (e || "").match(kt) || []; l > a; a++)
                        if (n = this[a], i = 1 === n.nodeType && (n.className ? (" " + n.className + " ").replace(Rn, " ") : "")) {
                            for (s = 0; r = t[s++];)
                                for (; i.indexOf(" " + r + " ") >= 0;) i = i.replace(" " + r + " ", " ");
                            o = e ? rt.trim(i) : "", n.className !== o && (n.className = o)
                        }
                return this
            },
            toggleClass: function(e, t) {
                var n = typeof e;
                return "boolean" == typeof t && "string" === n ? t ? this.addClass(e) : this.removeClass(e) : this.each(rt.isFunction(e) ? function(n) {
                    rt(this).toggleClass(e.call(this, n, this.className, t), t)
                } : function() {
                    if ("string" === n)
                        for (var t, i = 0, r = rt(this), s = e.match(kt) || []; t = s[i++];) r.hasClass(t) ? r.removeClass(t) : r.addClass(t);
                    else(n === Tt || "boolean" === n) && (this.className && rt._data(this, "__className__", this.className), this.className = this.className || e === !1 ? "" : rt._data(this, "__className__") || "")
                })
            },
            hasClass: function(e) {
                for (var t = " " + e + " ", n = 0, i = this.length; i > n; n++)
                    if (1 === this[n].nodeType && (" " + this[n].className + " ").replace(Rn, " ").indexOf(t) >= 0) return !0;
                return !1
            }
        }), rt.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "), function(e, t) {
            rt.fn[t] = function(e, n) {
                return arguments.length > 0 ? this.on(t, null, e, n) : this.trigger(t)
            }
        }), rt.fn.extend({
            hover: function(e, t) {
                return this.mouseenter(e).mouseleave(t || e)
            },
            bind: function(e, t, n) {
                return this.on(e, null, t, n)
            },
            unbind: function(e, t) {
                return this.off(e, null, t)
            },
            delegate: function(e, t, n, i) {
                return this.on(t, e, n, i)
            },
            undelegate: function(e, t, n) {
                return 1 === arguments.length ? this.off(e, "**") : this.off(t, e || "**", n)
            }
        });
        var Dn = rt.now(),
            An = /\?/,
            Pn = /(,)|(\[|{)|(}|])|"(?:[^"\\\r\n]|\\["\\\/bfnrt]|\\u[\da-fA-F]{4})*"\s*:?|true|false|null|-?(?!0\d)\d+(?:\.\d+|)(?:[eE][+-]?\d+|)/g;
        rt.parseJSON = function(t) {
            if (e.JSON && e.JSON.parse) return e.JSON.parse(t + "");
            var n, i = null,
                r = rt.trim(t + "");
            return r && !rt.trim(r.replace(Pn, function(e, t, r, s) {
                return n && t && (i = 0), 0 === i ? e : (n = r || t, i += !s - !r, "")
            })) ? Function("return " + r)() : rt.error("Invalid JSON: " + t)
        }, rt.parseXML = function(t) {
            var n, i;
            if (!t || "string" != typeof t) return null;
            try {
                e.DOMParser ? (i = new DOMParser, n = i.parseFromString(t, "text/xml")) : (n = new ActiveXObject("Microsoft.XMLDOM"), n.async = "false", n.loadXML(t))
            } catch (r) {
                n = void 0
            }
            return n && n.documentElement && !n.getElementsByTagName("parsererror").length || rt.error("Invalid XML: " + t), n
        };
        var Ln, On, jn = /#.*$/,
            Fn = /([?&])_=[^&]*/,
            Hn = /^(.*?):[ \t]*([^\r\n]*)\r?$/gm,
            Mn = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
            Un = /^(?:GET|HEAD)$/,
            zn = /^\/\//,
            Wn = /^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/,
            Bn = {},
            qn = {},
            Vn = "*/".concat("*");
        try {
            On = location.href
        } catch (Xn) {
            On = ft.createElement("a"), On.href = "", On = On.href
        }
        Ln = Wn.exec(On.toLowerCase()) || [], rt.extend({
            active: 0,
            lastModified: {},
            etag: {},
            ajaxSettings: {
                url: On,
                type: "GET",
                isLocal: Mn.test(Ln[1]),
                global: !0,
                processData: !0,
                async: !0,
                contentType: "application/x-www-form-urlencoded; charset=UTF-8",
                accepts: {
                    "*": Vn,
                    text: "text/plain",
                    html: "text/html",
                    xml: "application/xml, text/xml",
                    json: "application/json, text/javascript"
                },
                contents: {
                    xml: /xml/,
                    html: /html/,
                    json: /json/
                },
                responseFields: {
                    xml: "responseXML",
                    text: "responseText",
                    json: "responseJSON"
                },
                converters: {
                    "* text": String,
                    "text html": !0,
                    "text json": rt.parseJSON,
                    "text xml": rt.parseXML
                },
                flatOptions: {
                    url: !0,
                    context: !0
                }
            },
            ajaxSetup: function(e, t) {
                return t ? z(z(e, rt.ajaxSettings), t) : z(rt.ajaxSettings, e)
            },
            ajaxPrefilter: M(Bn),
            ajaxTransport: M(qn),
            ajax: function(e, t) {
                function n(e, t, n, i) {
                    var r, c, b, v, y, w = t;
                    2 !== k && (k = 2, a && clearTimeout(a), u = void 0, o = i || "", S.readyState = e > 0 ? 4 : 0, r = e >= 200 && 300 > e || 304 === e, n && (v = W(p, S, n)), v = B(p, v, S, r), r ? (p.ifModified && (y = S.getResponseHeader("Last-Modified"), y && (rt.lastModified[s] = y), y = S.getResponseHeader("etag"), y && (rt.etag[s] = y)), 204 === e || "HEAD" === p.type ? w = "nocontent" : 304 === e ? w = "notmodified" : (w = v.state, c = v.data, b = v.error, r = !b)) : (b = w, (e || !w) && (w = "error", 0 > e && (e = 0))), S.status = e, S.statusText = (t || w) + "", r ? f.resolveWith(d, [c, w, S]) : f.rejectWith(d, [S, w, b]), S.statusCode(g), g = void 0, l && h.trigger(r ? "ajaxSuccess" : "ajaxError", [S, p, r ? c : b]), m.fireWith(d, [S, w]), l && (h.trigger("ajaxComplete", [S, p]), --rt.active || rt.event.trigger("ajaxStop")))
                }
                "object" == typeof e && (t = e, e = void 0), t = t || {};
                var i, r, s, o, a, l, u, c, p = rt.ajaxSetup({}, t),
                    d = p.context || p,
                    h = p.context && (d.nodeType || d.jquery) ? rt(d) : rt.event,
                    f = rt.Deferred(),
                    m = rt.Callbacks("once memory"),
                    g = p.statusCode || {},
                    b = {},
                    v = {},
                    k = 0,
                    y = "canceled",
                    S = {
                        readyState: 0,
                        getResponseHeader: function(e) {
                            var t;
                            if (2 === k) {
                                if (!c)
                                    for (c = {}; t = Hn.exec(o);) c[t[1].toLowerCase()] = t[2];
                                t = c[e.toLowerCase()]
                            }
                            return null == t ? null : t
                        },
                        getAllResponseHeaders: function() {
                            return 2 === k ? o : null
                        },
                        setRequestHeader: function(e, t) {
                            var n = e.toLowerCase();
                            return k || (e = v[n] = v[n] || e, b[e] = t), this
                        },
                        overrideMimeType: function(e) {
                            return k || (p.mimeType = e), this
                        },
                        statusCode: function(e) {
                            var t;
                            if (e)
                                if (2 > k)
                                    for (t in e) g[t] = [g[t], e[t]];
                                else S.always(e[S.status]);
                            return this
                        },
                        abort: function(e) {
                            var t = e || y;
                            return u && u.abort(t), n(0, t), this
                        }
                    };
                if (f.promise(S).complete = m.add, S.success = S.done, S.error = S.fail, p.url = ((e || p.url || On) + "").replace(jn, "").replace(zn, Ln[1] + "//"), p.type = t.method || t.type || p.method || p.type, p.dataTypes = rt.trim(p.dataType || "*").toLowerCase().match(kt) || [""], null == p.crossDomain && (i = Wn.exec(p.url.toLowerCase()), p.crossDomain = !(!i || i[1] === Ln[1] && i[2] === Ln[2] && (i[3] || ("http:" === i[1] ? "80" : "443")) === (Ln[3] || ("http:" === Ln[1] ? "80" : "443")))), p.data && p.processData && "string" != typeof p.data && (p.data = rt.param(p.data, p.traditional)), U(Bn, p, t, S), 2 === k) return S;
                l = p.global, l && 0 === rt.active++ && rt.event.trigger("ajaxStart"), p.type = p.type.toUpperCase(), p.hasContent = !Un.test(p.type), s = p.url, p.hasContent || (p.data && (s = p.url += (An.test(s) ? "&" : "?") + p.data, delete p.data), p.cache === !1 && (p.url = Fn.test(s) ? s.replace(Fn, "$1_=" + Dn++) : s + (An.test(s) ? "&" : "?") + "_=" + Dn++)), p.ifModified && (rt.lastModified[s] && S.setRequestHeader("If-Modified-Since", rt.lastModified[s]), rt.etag[s] && S.setRequestHeader("If-None-Match", rt.etag[s])), (p.data && p.hasContent && p.contentType !== !1 || t.contentType) && S.setRequestHeader("Content-Type", p.contentType), S.setRequestHeader("Accept", p.dataTypes[0] && p.accepts[p.dataTypes[0]] ? p.accepts[p.dataTypes[0]] + ("*" !== p.dataTypes[0] ? ", " + Vn + "; q=0.01" : "") : p.accepts["*"]);
                for (r in p.headers) S.setRequestHeader(r, p.headers[r]);
                if (p.beforeSend && (p.beforeSend.call(d, S, p) === !1 || 2 === k)) return S.abort();
                y = "abort";
                for (r in {
                        success: 1,
                        error: 1,
                        complete: 1
                    }) S[r](p[r]);
                if (u = U(qn, p, t, S)) {
                    S.readyState = 1, l && h.trigger("ajaxSend", [S, p]), p.async && p.timeout > 0 && (a = setTimeout(function() {
                        S.abort("timeout")
                    }, p.timeout));
                    try {
                        k = 1, u.send(b, n)
                    } catch (w) {
                        if (!(2 > k)) throw w;
                        n(-1, w)
                    }
                } else n(-1, "No Transport");
                return S
            },
            getJSON: function(e, t, n) {
                return rt.get(e, t, n, "json")
            },
            getScript: function(e, t) {
                return rt.get(e, void 0, t, "script")
            }
        }), rt.each(["get", "post"], function(e, t) {
            rt[t] = function(e, n, i, r) {
                return rt.isFunction(n) && (r = r || i, i = n, n = void 0), rt.ajax({
                    url: e,
                    type: t,
                    dataType: r,
                    data: n,
                    success: i
                })
            }
        }), rt.each(["ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend"], function(e, t) {
            rt.fn[t] = function(e) {
                return this.on(t, e)
            }
        }), rt._evalUrl = function(e) {
            return rt.ajax({
                url: e,
                type: "GET",
                dataType: "script",
                async: !1,
                global: !1,
                "throws": !0
            })
        }, rt.fn.extend({
            wrapAll: function(e) {
                if (rt.isFunction(e)) return this.each(function(t) {
                    rt(this).wrapAll(e.call(this, t))
                });
                if (this[0]) {
                    var t = rt(e, this[0].ownerDocument).eq(0).clone(!0);
                    this[0].parentNode && t.insertBefore(this[0]), t.map(function() {
                        for (var e = this; e.firstChild && 1 === e.firstChild.nodeType;) e = e.firstChild;
                        return e
                    }).append(this)
                }
                return this
            },
            wrapInner: function(e) {
                return this.each(rt.isFunction(e) ? function(t) {
                    rt(this).wrapInner(e.call(this, t))
                } : function() {
                    var t = rt(this),
                        n = t.contents();
                    n.length ? n.wrapAll(e) : t.append(e)
                })
            },
            wrap: function(e) {
                var t = rt.isFunction(e);
                return this.each(function(n) {
                    rt(this).wrapAll(t ? e.call(this, n) : e)
                })
            },
            unwrap: function() {
                return this.parent().each(function() {
                    rt.nodeName(this, "body") || rt(this).replaceWith(this.childNodes)
                }).end()
            }
        }), rt.expr.filters.hidden = function(e) {
            return e.offsetWidth <= 0 && e.offsetHeight <= 0 || !nt.reliableHiddenOffsets() && "none" === (e.style && e.style.display || rt.css(e, "display"))
        }, rt.expr.filters.visible = function(e) {
            return !rt.expr.filters.hidden(e)
        };
        var Yn = /%20/g,
            Jn = /\[\]$/,
            Gn = /\r?\n/g,
            $n = /^(?:submit|button|image|reset|file)$/i,
            Kn = /^(?:input|select|textarea|keygen)/i;
        rt.param = function(e, t) {
            var n, i = [],
                r = function(e, t) {
                    t = rt.isFunction(t) ? t() : null == t ? "" : t, i[i.length] = encodeURIComponent(e) + "=" + encodeURIComponent(t)
                };
            if (void 0 === t && (t = rt.ajaxSettings && rt.ajaxSettings.traditional), rt.isArray(e) || e.jquery && !rt.isPlainObject(e)) rt.each(e, function() {
                r(this.name, this.value)
            });
            else
                for (n in e) q(n, e[n], t, r);
            return i.join("&").replace(Yn, "+")
        }, rt.fn.extend({
            serialize: function() {
                return rt.param(this.serializeArray())
            },
            serializeArray: function() {
                return this.map(function() {
                    var e = rt.prop(this, "elements");
                    return e ? rt.makeArray(e) : this
                }).filter(function() {
                    var e = this.type;
                    return this.name && !rt(this).is(":disabled") && Kn.test(this.nodeName) && !$n.test(e) && (this.checked || !Rt.test(e))
                }).map(function(e, t) {
                    var n = rt(this).val();
                    return null == n ? null : rt.isArray(n) ? rt.map(n, function(e) {
                        return {
                            name: t.name,
                            value: e.replace(Gn, "\r\n")
                        }
                    }) : {
                        name: t.name,
                        value: n.replace(Gn, "\r\n")
                    }
                }).get()
            }
        }), rt.ajaxSettings.xhr = void 0 !== e.ActiveXObject ? function() {
            return !this.isLocal && /^(get|post|head|put|delete|options)$/i.test(this.type) && V() || X()
        } : V;
        var Qn = 0,
            Zn = {},
            ei = rt.ajaxSettings.xhr();
        e.ActiveXObject && rt(e).on("unload", function() {
            for (var e in Zn) Zn[e](void 0, !0)
        }), nt.cors = !!ei && "withCredentials" in ei, ei = nt.ajax = !!ei, ei && rt.ajaxTransport(function(e) {
            if (!e.crossDomain || nt.cors) {
                var t;
                return {
                    send: function(n, i) {
                        var r, s = e.xhr(),
                            o = ++Qn;
                        if (s.open(e.type, e.url, e.async, e.username, e.password), e.xhrFields)
                            for (r in e.xhrFields) s[r] = e.xhrFields[r];
                        e.mimeType && s.overrideMimeType && s.overrideMimeType(e.mimeType), e.crossDomain || n["X-Requested-With"] || (n["X-Requested-With"] = "XMLHttpRequest");
                        for (r in n) void 0 !== n[r] && s.setRequestHeader(r, n[r] + "");
                        s.send(e.hasContent && e.data || null), t = function(n, r) {
                            var a, l, u;
                            if (t && (r || 4 === s.readyState))
                                if (delete Zn[o], t = void 0, s.onreadystatechange = rt.noop, r) 4 !== s.readyState && s.abort();
                                else {
                                    u = {}, a = s.status, "string" == typeof s.responseText && (u.text = s.responseText);
                                    try {
                                        l = s.statusText
                                    } catch (c) {
                                        l = ""
                                    }
                                    a || !e.isLocal || e.crossDomain ? 1223 === a && (a = 204) : a = u.text ? 200 : 404
                                }
                            u && i(a, l, u, s.getAllResponseHeaders())
                        }, e.async ? 4 === s.readyState ? setTimeout(t) : s.onreadystatechange = Zn[o] = t : t()
                    },
                    abort: function() {
                        t && t(void 0, !0)
                    }
                }
            }
        }), rt.ajaxSetup({
            accepts: {
                script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
            },
            contents: {
                script: /(?:java|ecma)script/
            },
            converters: {
                "text script": function(e) {
                    return rt.globalEval(e), e
                }
            }
        }), rt.ajaxPrefilter("script", function(e) {
            void 0 === e.cache && (e.cache = !1), e.crossDomain && (e.type = "GET", e.global = !1)
        }), rt.ajaxTransport("script", function(e) {
            if (e.crossDomain) {
                var t, n = ft.head || rt("head")[0] || ft.documentElement;
                return {
                    send: function(i, r) {
                        t = ft.createElement("script"), t.async = !0, e.scriptCharset && (t.charset = e.scriptCharset), t.src = e.url, t.onload = t.onreadystatechange = function(e, n) {
                            (n || !t.readyState || /loaded|complete/.test(t.readyState)) && (t.onload = t.onreadystatechange = null, t.parentNode && t.parentNode.removeChild(t), t = null, n || r(200, "success"))
                        }, n.insertBefore(t, n.firstChild)
                    },
                    abort: function() {
                        t && t.onload(void 0, !0)
                    }
                }
            }
        });
        var ti = [],
            ni = /(=)\?(?=&|$)|\?\?/;
        rt.ajaxSetup({
            jsonp: "callback",
            jsonpCallback: function() {
                var e = ti.pop() || rt.expando + "_" + Dn++;
                return this[e] = !0, e
            }
        }), rt.ajaxPrefilter("json jsonp", function(t, n, i) {
            var r, s, o, a = t.jsonp !== !1 && (ni.test(t.url) ? "url" : "string" == typeof t.data && !(t.contentType || "").indexOf("application/x-www-form-urlencoded") && ni.test(t.data) && "data");
            return a || "jsonp" === t.dataTypes[0] ? (r = t.jsonpCallback = rt.isFunction(t.jsonpCallback) ? t.jsonpCallback() : t.jsonpCallback, a ? t[a] = t[a].replace(ni, "$1" + r) : t.jsonp !== !1 && (t.url += (An.test(t.url) ? "&" : "?") + t.jsonp + "=" + r), t.converters["script json"] = function() {
                return o || rt.error(r + " was not called"), o[0]
            }, t.dataTypes[0] = "json", s = e[r], e[r] = function() {
                o = arguments
            }, i.always(function() {
                e[r] = s, t[r] && (t.jsonpCallback = n.jsonpCallback, ti.push(r)), o && rt.isFunction(s) && s(o[0]), o = s = void 0
            }), "script") : void 0
        }), rt.parseHTML = function(e, t, n) {
            if (!e || "string" != typeof e) return null;
            "boolean" == typeof t && (n = t, t = !1), t = t || ft;
            var i = pt.exec(e),
                r = !n && [];
            return i ? [t.createElement(i[1])] : (i = rt.buildFragment([e], t, r), r && r.length && rt(r).remove(), rt.merge([], i.childNodes))
        };
        var ii = rt.fn.load;
        rt.fn.load = function(e, t, n) {
            if ("string" != typeof e && ii) return ii.apply(this, arguments);
            var i, r, s, o = this,
                a = e.indexOf(" ");
            return a >= 0 && (i = rt.trim(e.slice(a, e.length)), e = e.slice(0, a)), rt.isFunction(t) ? (n = t, t = void 0) : t && "object" == typeof t && (s = "POST"), o.length > 0 && rt.ajax({
                url: e,
                type: s,
                dataType: "html",
                data: t
            }).done(function(e) {
                r = arguments, o.html(i ? rt("<div>").append(rt.parseHTML(e)).find(i) : e)
            }).complete(n && function(e, t) {
                o.each(n, r || [e.responseText, t, e])
            }), this
        }, rt.expr.filters.animated = function(e) {
            return rt.grep(rt.timers, function(t) {
                return e === t.elem
            }).length
        };
        var ri = e.document.documentElement;
        rt.offset = {
            setOffset: function(e, t, n) {
                var i, r, s, o, a, l, u, c = rt.css(e, "position"),
                    p = rt(e),
                    d = {};
                "static" === c && (e.style.position = "relative"), a = p.offset(), s = rt.css(e, "top"), l = rt.css(e, "left"), u = ("absolute" === c || "fixed" === c) && rt.inArray("auto", [s, l]) > -1, u ? (i = p.position(), o = i.top, r = i.left) : (o = parseFloat(s) || 0, r = parseFloat(l) || 0), rt.isFunction(t) && (t = t.call(e, n, a)), null != t.top && (d.top = t.top - a.top + o), null != t.left && (d.left = t.left - a.left + r), "using" in t ? t.using.call(e, d) : p.css(d)
            }
        }, rt.fn.extend({
            offset: function(e) {
                if (arguments.length) return void 0 === e ? this : this.each(function(t) {
                    rt.offset.setOffset(this, e, t)
                });
                var t, n, i = {
                        top: 0,
                        left: 0
                    },
                    r = this[0],
                    s = r && r.ownerDocument;
                if (s) return t = s.documentElement, rt.contains(t, r) ? (typeof r.getBoundingClientRect !== Tt && (i = r.getBoundingClientRect()), n = Y(s), {
                    top: i.top + (n.pageYOffset || t.scrollTop) - (t.clientTop || 0),
                    left: i.left + (n.pageXOffset || t.scrollLeft) - (t.clientLeft || 0)
                }) : i
            },
            position: function() {
                if (this[0]) {
                    var e, t, n = {
                            top: 0,
                            left: 0
                        },
                        i = this[0];
                    return "fixed" === rt.css(i, "position") ? t = i.getBoundingClientRect() : (e = this.offsetParent(), t = this.offset(), rt.nodeName(e[0], "html") || (n = e.offset()), n.top += rt.css(e[0], "borderTopWidth", !0), n.left += rt.css(e[0], "borderLeftWidth", !0)), {
                        top: t.top - n.top - rt.css(i, "marginTop", !0),
                        left: t.left - n.left - rt.css(i, "marginLeft", !0)
                    }
                }
            },
            offsetParent: function() {
                return this.map(function() {
                    for (var e = this.offsetParent || ri; e && !rt.nodeName(e, "html") && "static" === rt.css(e, "position");) e = e.offsetParent;
                    return e || ri
                })
            }
        }), rt.each({
            scrollLeft: "pageXOffset",
            scrollTop: "pageYOffset"
        }, function(e, t) {
            var n = /Y/.test(t);
            rt.fn[e] = function(i) {
                return Nt(this, function(e, i, r) {
                    var s = Y(e);
                    return void 0 === r ? s ? t in s ? s[t] : s.document.documentElement[i] : e[i] : void(s ? s.scrollTo(n ? rt(s).scrollLeft() : r, n ? r : rt(s).scrollTop()) : e[i] = r)
                }, e, i, arguments.length, null)
            }
        }), rt.each(["top", "left"], function(e, t) {
            rt.cssHooks[t] = I(nt.pixelPosition, function(e, n) {
                return n ? (n = tn(e, t), rn.test(n) ? rt(e).position()[t] + "px" : n) : void 0
            })
        }), rt.each({
            Height: "height",
            Width: "width"
        }, function(e, t) {
            rt.each({
                padding: "inner" + e,
                content: t,
                "": "outer" + e
            }, function(n, i) {
                rt.fn[i] = function(i, r) {
                    var s = arguments.length && (n || "boolean" != typeof i),
                        o = n || (i === !0 || r === !0 ? "margin" : "border");
                    return Nt(this, function(t, n, i) {
                        var r;
                        return rt.isWindow(t) ? t.document.documentElement["client" + e] : 9 === t.nodeType ? (r = t.documentElement, Math.max(t.body["scroll" + e], r["scroll" + e], t.body["offset" + e], r["offset" + e], r["client" + e])) : void 0 === i ? rt.css(t, n, o) : rt.style(t, n, i, o)
                    }, t, s ? i : void 0, s, null)
                }
            })
        }), rt.fn.size = function() {
            return this.length
        }, rt.fn.andSelf = rt.fn.addBack, "function" == typeof define && define.amd && define("jquery", [], function() {
            return rt
        });
        var si = e.jQuery,
            oi = e.$;
        return rt.noConflict = function(t) {
            return e.$ === rt && (e.$ = oi), t && e.jQuery === rt && (e.jQuery = si), rt
        }, typeof t === Tt && (e.jQuery = e.$ = rt), rt
    }),
    function(e, t) {
        e.rails !== t && e.error("jquery-ujs has already been loaded!");
        var n, i = e(document);
        e.rails = n = {
            linkClickSelector: "a[data-confirm], a[data-method], a[data-remote], a[data-disable-with], a[data-disable]",
            buttonClickSelector: "button[data-remote]:not(form button), button[data-confirm]:not(form button)",
            inputChangeSelector: "select[data-remote], input[data-remote], textarea[data-remote]",
            formSubmitSelector: "form",
            formInputClickSelector: "form input[type=submit], form input[type=image], form button[type=submit], form button:not([type]), input[type=submit][form], input[type=image][form], button[type=submit][form], button[form]:not([type])",
            disableSelector: "input[data-disable-with]:enabled, button[data-disable-with]:enabled, textarea[data-disable-with]:enabled, input[data-disable]:enabled, button[data-disable]:enabled, textarea[data-disable]:enabled",
            enableSelector: "input[data-disable-with]:disabled, button[data-disable-with]:disabled, textarea[data-disable-with]:disabled, input[data-disable]:disabled, button[data-disable]:disabled, textarea[data-disable]:disabled",
            requiredInputSelector: "input[name][required]:not([disabled]),textarea[name][required]:not([disabled])",
            fileInputSelector: "input[type=file]",
            linkDisableSelector: "a[data-disable-with], a[data-disable]",
            buttonDisableSelector: "button[data-remote][data-disable-with], button[data-remote][data-disable]",
            CSRFProtection: function(t) {
                var n = e('meta[name="csrf-token"]').attr("content");
                n && t.setRequestHeader("X-CSRF-Token", n)
            },
            refreshCSRFTokens: function() {
                var t = e("meta[name=csrf-token]").attr("content"),
                    n = e("meta[name=csrf-param]").attr("content");
                e('form input[name="' + n + '"]').val(t)
            },
            fire: function(t, n, i) {
                var r = e.Event(n);
                return t.trigger(r, i), r.result !== !1
            },
            confirm: function(e) {
                return confirm(e)
            },
            ajax: function(t) {
                return e.ajax(t)
            },
            href: function(e) {
                return e.attr("href")
            },
            handleRemote: function(i) {
                var r, s, o, a, l, u, c, p;
                if (n.fire(i, "ajax:before")) {
                    if (a = i.data("cross-domain"), l = a === t ? null : a, u = i.data("with-credentials") || null, c = i.data("type") || e.ajaxSettings && e.ajaxSettings.dataType, i.is("form")) {
                        r = i.attr("method"), s = i.attr("action"), o = i.serializeArray();
                        var d = i.data("ujs:submit-button");
                        d && (o.push(d), i.data("ujs:submit-button", null))
                    } else i.is(n.inputChangeSelector) ? (r = i.data("method"), s = i.data("url"), o = i.serialize(), i.data("params") && (o = o + "&" + i.data("params"))) : i.is(n.buttonClickSelector) ? (r = i.data("method") || "get", s = i.data("url"), o = i.serialize(), i.data("params") && (o = o + "&" + i.data("params"))) : (r = i.data("method"), s = n.href(i), o = i.data("params") || null);
                    return p = {
                        type: r || "GET",
                        data: o,
                        dataType: c,
                        beforeSend: function(e, r) {
                            return r.dataType === t && e.setRequestHeader("accept", "*/*;q=0.5, " + r.accepts.script), n.fire(i, "ajax:beforeSend", [e, r]) ? void i.trigger("ajax:send", e) : !1
                        },
                        success: function(e, t, n) {
                            i.trigger("ajax:success", [e, t, n])
                        },
                        complete: function(e, t) {
                            i.trigger("ajax:complete", [e, t])
                        },
                        error: function(e, t, n) {
                            i.trigger("ajax:error", [e, t, n])
                        },
                        crossDomain: l
                    }, u && (p.xhrFields = {
                        withCredentials: u
                    }), s && (p.url = s), n.ajax(p)
                }
                return !1
            },
            handleMethod: function(i) {
                var r = n.href(i),
                    s = i.data("method"),
                    o = i.attr("target"),
                    a = e("meta[name=csrf-token]").attr("content"),
                    l = e("meta[name=csrf-param]").attr("content"),
                    u = e('<form method="post" action="' + r + '"></form>'),
                    c = '<input name="_method" value="' + s + '" type="hidden" />';
                l !== t && a !== t && (c += '<input name="' + l + '" value="' + a + '" type="hidden" />'), o && u.attr("target", o), u.hide().append(c).appendTo("body"), u.submit()
            },
            formElements: function(t, n) {
                return t.is("form") ? e(t[0].elements).filter(n) : t.find(n)
            },
            disableFormElements: function(t) {
                n.formElements(t, n.disableSelector).each(function() {
                    n.disableFormElement(e(this))
                })
            },
            disableFormElement: function(e) {
                var n, i;
                n = e.is("button") ? "html" : "val", i = e.data("disable-with"), e.data("ujs:enable-with", e[n]()), i !== t && e[n](i), e.prop("disabled", !0)
            },
            enableFormElements: function(t) {
                n.formElements(t, n.enableSelector).each(function() {
                    n.enableFormElement(e(this))
                })
            },
            enableFormElement: function(e) {
                var t = e.is("button") ? "html" : "val";
                e.data("ujs:enable-with") && e[t](e.data("ujs:enable-with")), e.prop("disabled", !1)
            },
            allowAction: function(e) {
                var t, i = e.data("confirm"),
                    r = !1;
                return i ? (n.fire(e, "confirm") && (r = n.confirm(i), t = n.fire(e, "confirm:complete", [r])), r && t) : !0
            },
            blankInputs: function(t, n, i) {
                var r, s, o = e(),
                    a = n || "input,textarea",
                    l = t.find(a);
                return l.each(function() {
                    if (r = e(this), s = r.is("input[type=checkbox],input[type=radio]") ? r.is(":checked") : r.val(), !s == !i) {
                        if (r.is("input[type=radio]") && l.filter('input[type=radio]:checked[name="' + r.attr("name") + '"]').length) return !0;
                        o = o.add(r)
                    }
                }), o.length ? o : !1
            },
            nonBlankInputs: function(e, t) {
                return n.blankInputs(e, t, !0)
            },
            stopEverything: function(t) {
                return e(t.target).trigger("ujs:everythingStopped"), t.stopImmediatePropagation(), !1
            },
            disableElement: function(e) {
                var i = e.data("disable-with");
                e.data("ujs:enable-with", e.html()), i !== t && e.html(i), e.bind("click.railsDisable", function(e) {
                    return n.stopEverything(e)
                })
            },
            enableElement: function(e) {
                e.data("ujs:enable-with") !== t && (e.html(e.data("ujs:enable-with")), e.removeData("ujs:enable-with")), e.unbind("click.railsDisable")
            }
        }, n.fire(i, "rails:attachBindings") && (e.ajaxPrefilter(function(e, t, i) {
            e.crossDomain || n.CSRFProtection(i)
        }), i.delegate(n.linkDisableSelector, "ajax:complete", function() {
            n.enableElement(e(this))
        }), i.delegate(n.buttonDisableSelector, "ajax:complete", function() {
            n.enableFormElement(e(this))
        }), i.delegate(n.linkClickSelector, "click.rails", function(i) {
            var r = e(this),
                s = r.data("method"),
                o = r.data("params"),
                a = i.metaKey || i.ctrlKey;
            if (!n.allowAction(r)) return n.stopEverything(i);
            if (!a && r.is(n.linkDisableSelector) && n.disableElement(r), r.data("remote") !== t) {
                if (a && (!s || "GET" === s) && !o) return !0;
                var l = n.handleRemote(r);
                return l === !1 ? n.enableElement(r) : l.error(function() {
                    n.enableElement(r)
                }), !1
            }
            return r.data("method") ? (n.handleMethod(r), !1) : void 0
        }), i.delegate(n.buttonClickSelector, "click.rails", function(t) {
            var i = e(this);
            if (!n.allowAction(i)) return n.stopEverything(t);
            i.is(n.buttonDisableSelector) && n.disableFormElement(i);
            var r = n.handleRemote(i);
            return r === !1 ? n.enableFormElement(i) : r.error(function() {
                n.enableFormElement(i)
            }), !1
        }), i.delegate(n.inputChangeSelector, "change.rails", function(t) {
            var i = e(this);
            return n.allowAction(i) ? (n.handleRemote(i), !1) : n.stopEverything(t)
        }), i.delegate(n.formSubmitSelector, "submit.rails", function(i) {
            var r, s, o = e(this),
                a = o.data("remote") !== t;
            if (!n.allowAction(o)) return n.stopEverything(i);
            if (o.attr("novalidate") == t && (r = n.blankInputs(o, n.requiredInputSelector), r && n.fire(o, "ajax:aborted:required", [r]))) return n.stopEverything(i);
            if (a) {
                if (s = n.nonBlankInputs(o, n.fileInputSelector)) {
                    setTimeout(function() {
                        n.disableFormElements(o)
                    }, 13);
                    var l = n.fire(o, "ajax:aborted:file", [s]);
                    return l || setTimeout(function() {
                        n.enableFormElements(o)
                    }, 13), l
                }
                return n.handleRemote(o), !1
            }
            setTimeout(function() {
                n.disableFormElements(o)
            }, 13)
        }), i.delegate(n.formInputClickSelector, "click.rails", function(t) {
            var i = e(this);
            if (!n.allowAction(i)) return n.stopEverything(t);
            var r = i.attr("name"),
                s = r ? {
                    name: r,
                    value: i.val()
                } : null;
            i.closest("form").data("ujs:submit-button", s)
        }), i.delegate(n.formSubmitSelector, "ajax:send.rails", function(t) {
            this == t.target && n.disableFormElements(e(this))
        }), i.delegate(n.formSubmitSelector, "ajax:complete.rails", function(t) {
            this == t.target && n.enableFormElements(e(this))
        }), e(function() {
            n.refreshCSRFTokens()
        }))
    }(jQuery),
    function() {
        var e, t, n, i, r, s, o, a, l, u, c, p, d, h, f, m, g, b, v, k, y, S, w, T, E, x, I, _, C, N, R, D, A, P, L, O, j, F, H, M, U, z, W, B, q, V, X, Y, J, G, $, K, Q, Z, et, tt, nt = [].indexOf || function(e) {
                for (var t = 0, n = this.length; n > t; t++)
                    if (t in this && this[t] === e) return t;
                return -1
            },
            it = {}.hasOwnProperty,
            rt = function(e, t) {
                function n() {
                    this.constructor = e
                }
                for (var i in t) it.call(t, i) && (e[i] = t[i]);
                return n.prototype = t.prototype, e.prototype = new n, e.__super__ = t.prototype, e
            },
            st = [].slice,
            ot = function(e, t) {
                return function() {
                    return e.apply(t, arguments)
                }
            };
        P = {}, d = 10, $ = !1, H = null, v = null, D = null, U = null, et = null, i = {
            BEFORE_CHANGE: "page:before-change",
            FETCH: "page:fetch",
            RECEIVE: "page:receive",
            CHANGE: "page:change",
            UPDATE: "page:update",
            LOAD: "page:load",
            RESTORE: "page:restore",
            BEFORE_UNLOAD: "page:before-unload",
            EXPIRE: "page:expire"
        }, T = function(e) {
            var t;
            return e = new n(e), V(), p(), null != H && H.start(), $ && (t = K(e.absolute)) ? (E(t), x(e, null, !1)) : x(e, J)
        }, K = function(e) {
            var t;
            return t = P[e], t && !t.transitionCacheDisabled ? t : void 0
        }, y = function(e) {
            return null == e && (e = !0), $ = e
        }, k = function(e) {
            return null == e && (e = !0), u ? e ? null != H ? H : H = new s("html") : (null != H && H.uninstall(), H = null) : void 0
        }, x = function(e, t, n) {
            return null == n && (n = !0), Q(i.FETCH, {
                url: e.absolute
            }), null != et && et.abort(), et = new XMLHttpRequest, et.open("GET", e.withoutHashForIE10compatibility(), !0), et.setRequestHeader("Accept", "text/html, application/xhtml+xml, application/xml"), et.setRequestHeader("X-XHR-Referer", U), et.onload = function() {
                var n;
                return Q(i.RECEIVE, {
                    url: e.absolute
                }), (n = F()) ? (z(e), W(), h.apply(null, w(n)), A(), "function" == typeof t && t(), Q(i.LOAD)) : document.location.href = b() || e.absolute
            }, H && n && (et.onprogress = function() {
                return function(e) {
                    var t;
                    return t = e.lengthComputable ? e.loaded / e.total * 100 : H.value + (100 - H.value) / 10, H.advanceTo(t)
                }
            }(this)), et.onloadend = function() {
                return et = null
            }, et.onerror = function() {
                return document.location.href = e.absolute
            }, et.send()
        }, E = function(e) {
            return null != et && et.abort(), h(e.title, e.body), M(e), Q(i.RESTORE)
        }, p = function() {
            var e;
            return e = new n(v.url), P[e.absolute] = {
                url: e.relative,
                body: document.body,
                title: document.title,
                positionY: window.pageYOffset,
                positionX: window.pageXOffset,
                cachedAt: (new Date).getTime(),
                transitionCacheDisabled: null != document.querySelector("[data-no-transition-cache]")
            }, m(d)
        }, O = function(e) {
            return null == e && (e = d), /^[\d]+$/.test(e) ? d = parseInt(e) : void 0
        }, m = function(e) {
            var t, n, r, s, o, a;
            for (r = Object.keys(P), t = r.map(function(e) {
                    return P[e].cachedAt
                }).sort(function(e, t) {
                    return t - e
                }), a = [], s = 0, o = r.length; o > s; s++) n = r[s], P[n].cachedAt <= t[e] && (Q(i.EXPIRE, P[n]), a.push(delete P[n]));
            return a
        }, h = function(t, n, r, s) {
            return Q(i.BEFORE_UNLOAD), document.title = t, document.documentElement.replaceChild(n, document.body), null != r && e.update(r), G(), s && S(), v = window.history.state, null != H && H.done(), Q(i.CHANGE), Q(i.UPDATE)
        }, S = function() {
            var e, t, n, i, r, s, o, a, l, u, c, p;
            for (s = Array.prototype.slice.call(document.body.querySelectorAll('script:not([data-turbolinks-eval="false"])')), o = 0, l = s.length; l > o; o++)
                if (r = s[o], "" === (c = r.type) || "text/javascript" === c) {
                    for (t = document.createElement("script"), p = r.attributes, a = 0, u = p.length; u > a; a++) e = p[a], t.setAttribute(e.name, e.value);
                    r.hasAttribute("async") || (t.async = !1), t.appendChild(document.createTextNode(r.innerHTML)), i = r.parentNode, n = r.nextSibling, i.removeChild(r), i.insertBefore(t, n)
                }
        }, X = function(e) {
            return e.innerHTML = e.innerHTML.replace(/<noscript[\S\s]*?<\/noscript>/gi, ""), e
        }, G = function() {
            var e, t;
            return e = (t = document.querySelectorAll("input[autofocus], textarea[autofocus]"))[t.length - 1], e && document.activeElement !== e ? e.focus() : void 0
        }, z = function(e) {
            return (e = new n(e)).absolute !== U ? window.history.pushState({
                turbolinks: !0,
                url: e.absolute
            }, "", e.absolute) : void 0
        }, W = function() {
            var e, t;
            return (e = et.getResponseHeader("X-XHR-Redirected-To")) ? (e = new n(e), t = e.hasNoHash() ? document.location.hash : "", window.history.replaceState(window.history.state, "", e.href + t)) : void 0
        }, b = function() {
            var e;
            return null != (e = et.getResponseHeader("Location")) && new n(e).crossOrigin() ? e : void 0
        }, V = function() {
            return U = document.location.href
        }, q = function() {
            return window.history.replaceState({
                turbolinks: !0,
                url: document.location.href
            }, "", document.location.href)
        }, B = function() {
            return v = window.history.state
        }, A = function() {
            var e;
            return navigator.userAgent.match(/Firefox/) && !(e = new n).hasNoHash() ? (window.history.replaceState(v, "", e.withoutHash()), document.location.hash = e.hash) : void 0
        }, M = function(e) {
            return window.scrollTo(e.positionX, e.positionY)
        }, J = function() {
            return document.location.hash ? document.location.href = document.location.href : window.scrollTo(0, 0)
        }, f = function(e) {
            var t, n, i;
            if (null == e || "object" != typeof e) return e;
            t = new e.constructor;
            for (n in e) i = e[n], t[n] = f(i);
            return t
        }, j = function(e) {
            var t, n;
            return t = (null != (n = document.cookie.match(new RegExp(e + "=(\\w+)"))) ? n[1].toUpperCase() : void 0) || "", document.cookie = e + "=; expires=Thu, 01-Jan-70 00:00:01 GMT; path=/", t
        }, Q = function(e, t) {
            var n;
            return "undefined" != typeof Prototype && Event.fire(document, e, t, !0), n = document.createEvent("Events"), t && (n.data = t), n.initEvent(e, !0, !0), document.dispatchEvent(n)
        }, L = function(e) {
            return !Q(i.BEFORE_CHANGE, {
                url: e
            })
        }, F = function() {
            var e, t, n, i, r, s;
            return t = function() {
                var e;
                return 400 <= (e = et.status) && 600 > e
            }, s = function() {
                var e;
                return null != (e = et.getResponseHeader("Content-Type")) && e.match(/^(?:text\/html|application\/xhtml\+xml|application\/xml)(?:;|$)/)
            }, i = function(e) {
                var t, n, i, r, s;
                for (r = e.querySelector("head").childNodes, s = [], n = 0, i = r.length; i > n; n++) t = r[n], null != ("function" == typeof t.getAttribute ? t.getAttribute("data-turbolinks-track") : void 0) && s.push(t.getAttribute("src") || t.getAttribute("href"));
                return s
            }, e = function(e) {
                var t;
                return D || (D = i(document)), t = i(e), t.length !== D.length || r(t, D).length !== D.length
            }, r = function(e, t) {
                var n, i, r, s, o;
                for (e.length > t.length && (s = [t, e], e = s[0], t = s[1]), o = [], i = 0, r = e.length; r > i; i++) n = e[i], nt.call(t, n) >= 0 && o.push(n);
                return o
            }, !t() && s() && (n = g(et.responseText), n && !e(n)) ? n : void 0
        }, w = function(t) {
            var n;
            return n = t.querySelector("title"), [null != n ? n.textContent : void 0, X(t.querySelector("body")), e.get(t).token, "runScripts"]
        }, e = {
            get: function(e) {
                var t;
                return null == e && (e = document), {
                    node: t = e.querySelector('meta[name="csrf-token"]'),
                    token: null != t && "function" == typeof t.getAttribute ? t.getAttribute("content") : void 0
                }
            },
            update: function(e) {
                var t;
                return t = this.get(), null != t.token && null != e && t.token !== e ? t.node.setAttribute("content", e) : void 0
            }
        }, g = function(e) {
            var t;
            return t = document.documentElement.cloneNode(), t.innerHTML = e, t.head = t.querySelector("head"), t.body = t.querySelector("body"), t
        }, n = function() {
            function e(t) {
                return this.original = null != t ? t : document.location.href, this.original.constructor === e ? this.original : void this._parse()
            }
            return e.prototype.withoutHash = function() {
                return this.href.replace(this.hash, "").replace("#", "")
            }, e.prototype.withoutHashForIE10compatibility = function() {
                return this.withoutHash()
            }, e.prototype.hasNoHash = function() {
                return 0 === this.hash.length
            }, e.prototype.crossOrigin = function() {
                return this.origin !== (new e).origin
            }, e.prototype._parse = function() {
                var e;
                return (null != this.link ? this.link : this.link = document.createElement("a")).href = this.original, e = this.link, this.href = e.href, this.protocol = e.protocol, this.host = e.host, this.hostname = e.hostname, this.port = e.port, this.pathname = e.pathname, this.search = e.search, this.hash = e.hash, this.origin = [this.protocol, "//", this.hostname].join(""), 0 !== this.port.length && (this.origin += ":" + this.port), this.relative = [this.pathname, this.search, this.hash].join(""), this.absolute = this.href
            }, e
        }(), r = function(e) {
            function t(e) {
                return this.link = e, this.link.constructor === t ? this.link : (this.original = this.link.href, this.originalElement = this.link, this.link = this.link.cloneNode(!1), void t.__super__.constructor.apply(this, arguments))
            }
            return rt(t, e), t.HTML_EXTENSIONS = ["html"], t.allowExtensions = function() {
                var e, n, i, r;
                for (n = 1 <= arguments.length ? st.call(arguments, 0) : [], i = 0, r = n.length; r > i; i++) e = n[i], t.HTML_EXTENSIONS.push(e);
                return t.HTML_EXTENSIONS
            }, t.prototype.shouldIgnore = function() {
                return this.crossOrigin() || this._anchored() || this._nonHtml() || this._optOut() || this._target()
            }, t.prototype._anchored = function() {
                return (this.hash.length > 0 || "#" === this.href.charAt(this.href.length - 1)) && this.withoutHash() === (new n).withoutHash()
            }, t.prototype._nonHtml = function() {
                return this.pathname.match(/\.[a-z]+$/g) && !this.pathname.match(new RegExp("\\.(?:" + t.HTML_EXTENSIONS.join("|") + ")?$", "g"))
            }, t.prototype._optOut = function() {
                var e, t;
                for (t = this.originalElement; !e && t !== document;) e = null != t.getAttribute("data-no-turbolink"), t = t.parentNode;
                return e
            }, t.prototype._target = function() {
                return 0 !== this.link.target.length
            }, t
        }(n), t = function() {
            function e(e) {
                this.event = e, this.event.defaultPrevented || (this._extractLink(), this._validForTurbolinks() && (L(this.link.absolute) || Z(this.link.href), this.event.preventDefault()))
            }
            return e.installHandlerLast = function(t) {
                return t.defaultPrevented ? void 0 : (document.removeEventListener("click", e.handle, !1), document.addEventListener("click", e.handle, !1))
            }, e.handle = function(t) {
                return new e(t)
            }, e.prototype._extractLink = function() {
                var e;
                for (e = this.event.target; e.parentNode && "A" !== e.nodeName;) e = e.parentNode;
                return "A" === e.nodeName && 0 !== e.href.length ? this.link = new r(e) : void 0
            }, e.prototype._validForTurbolinks = function() {
                return null != this.link && !(this.link.shouldIgnore() || this._nonStandardClick())
            }, e.prototype._nonStandardClick = function() {
                return this.event.which > 1 || this.event.metaKey || this.event.ctrlKey || this.event.shiftKey || this.event.altKey
            }, e
        }(), s = function() {
            function e(e) {
                this.elementSelector = e, this._trickle = ot(this._trickle, this), this.value = 0, this.opacity = 1, this.content = "", this.speed = 300, this.install()
            }
            var t;
            return t = "turbolinks-progress-bar", e.prototype.install = function() {
                return this.element = document.querySelector(this.elementSelector), this.element.classList.add(t), this.styleElement = document.createElement("style"), document.head.appendChild(this.styleElement), this._updateStyle()
            }, e.prototype.uninstall = function() {
                return this.element.classList.remove(t), document.head.removeChild(this.styleElement)
            }, e.prototype.start = function() {
                return this.advanceTo(5)
            }, e.prototype.advanceTo = function(e) {
                var t;
                if (e > (t = this.value) && 100 >= t) {
                    if (this.value = e, this._updateStyle(), 100 === this.value) return this._stopTrickle();
                    if (this.value > 0) return this._startTrickle()
                }
            }, e.prototype.done = function() {
                return this.value > 0 ? (this.advanceTo(100), this._reset()) : void 0
            }, e.prototype._reset = function() {
                return setTimeout(function(e) {
                    return function() {
                        return e.opacity = 0, e._updateStyle()
                    }
                }(this), this.speed / 2), setTimeout(function(e) {
                    return function() {
                        return e.value = 0, e.opacity = 1, e._withSpeed(0, function() {
                            return e._updateStyle(!0)
                        })
                    }
                }(this), this.speed)
            }, e.prototype._startTrickle = function() {
                return this.trickling ? void 0 : (this.trickling = !0, setTimeout(this._trickle, this.speed))
            }, e.prototype._stopTrickle = function() {
                return delete this.trickling
            }, e.prototype._trickle = function() {
                return this.trickling ? (this.advanceTo(this.value + Math.random() / 2), setTimeout(this._trickle, this.speed)) : void 0
            }, e.prototype._withSpeed = function(e, t) {
                var n, i;
                return n = this.speed, this.speed = e, i = t(), this.speed = n, i
            }, e.prototype._updateStyle = function(e) {
                return null == e && (e = !1), e && this._changeContentToForceRepaint(), this.styleElement.textContent = this._createCSSRule()
            }, e.prototype._changeContentToForceRepaint = function() {
                return this.content = "" === this.content ? " " : ""
            }, e.prototype._createCSSRule = function() {
                return "" + this.elementSelector + "." + t + "::before {\n  content: '" + this.content + "';\n  position: fixed;\n  top: 0;\n  left: 0;\n  z-index: 2000;\n  background-color: #0076ff;\n  height: 3px;\n  opacity: " + this.opacity + ";\n  width: " + this.value + "%;\n  transition: width " + this.speed + "ms ease-out, opacity " + this.speed / 2 + "ms ease-in;\n  transform: translate3d(0,0,0);\n}"
            }, e
        }(), c = function(e) {
            return setTimeout(e, 500)
        }, C = function() {
            return document.addEventListener("DOMContentLoaded", function() {
                return Q(i.CHANGE), Q(i.UPDATE)
            }, !0)
        }, R = function() {
            return "undefined" != typeof jQuery ? jQuery(document).on("ajaxSuccess", function(e, t) {
                return jQuery.trim(t.responseText) ? Q(i.UPDATE) : void 0
            }) : void 0
        }, N = function(e) {
            var t, i;
            return (null != (i = e.state) ? i.turbolinks : void 0) ? (t = P[new n(e.state.url).absolute]) ? (p(), E(t)) : Z(e.target.location.href) : void 0
        }, _ = function() {
            return q(), B(), document.addEventListener("click", t.installHandlerLast, !0), window.addEventListener("hashchange", function() {
                return q(), B()
            }, !1), c(function() {
                return window.addEventListener("popstate", N, !1)
            })
        }, I = void 0 !== window.history.state || navigator.userAgent.match(/Firefox\/2[6|7]/), l = window.history && window.history.pushState && window.history.replaceState && I, o = !navigator.userAgent.match(/CriOS\//), Y = "GET" === (tt = j("request_method")) || "" === tt, u = l && o && Y, a = document.addEventListener && document.createEvent, a && (C(), R()), u ? (Z = T, _()) : Z = function(e) {
            return document.location.href = e
        }, this.Turbolinks = {
            visit: Z,
            pagesCached: O,
            enableTransitionCache: y,
            enableProgressBar: k,
            allowLinkExtensions: r.allowExtensions,
            supported: u,
            EVENTS: f(i)
        }
    }.call(this), window.Modernizr = function(e, t, n) {
        function i(e) {
            f.cssText = e
        }

        function r(e, t) {
            return typeof e === t
        }
        var s, o, a, l = "2.6.2",
            u = {},
            c = !0,
            p = t.documentElement,
            d = "modernizr",
            h = t.createElement(d),
            f = h.style,
            m = ({}.toString, " -webkit- -moz- -o- -ms- ".split(" ")),
            g = {},
            b = [],
            v = b.slice,
            k = function(e, n, i, r) {
                var s, o, a, l, u = t.createElement("div"),
                    c = t.body,
                    h = c || t.createElement("body");
                if (parseInt(i, 10))
                    for (; i--;) a = t.createElement("div"), a.id = r ? r[i] : d + (i + 1), u.appendChild(a);
                return s = ["&#173;", '<style id="s', d, '">', e, "</style>"].join(""), u.id = d, (c ? u : h).innerHTML += s, h.appendChild(u), c || (h.style.background = "", h.style.overflow = "hidden", l = p.style.overflow, p.style.overflow = "hidden", p.appendChild(h)), o = n(u, e), c ? u.parentNode.removeChild(u) : (h.parentNode.removeChild(h), p.style.overflow = l), !!o
            },
            y = {}.hasOwnProperty;
        a = r(y, "undefined") || r(y.call, "undefined") ? function(e, t) {
            return t in e && r(e.constructor.prototype[t], "undefined")
        } : function(e, t) {
            return y.call(e, t)
        }, Function.prototype.bind || (Function.prototype.bind = function(e) {
            var t = this;
            if ("function" != typeof t) throw new TypeError;
            var n = v.call(arguments, 1),
                i = function() {
                    if (this instanceof i) {
                        var r = function() {};
                        r.prototype = t.prototype;
                        var s = new r,
                            o = t.apply(s, n.concat(v.call(arguments)));
                        return Object(o) === o ? o : s
                    }
                    return t.apply(e, n.concat(v.call(arguments)))
                };
            return i
        }), g.touch = function() {
            var n;
            return "ontouchstart" in e || e.DocumentTouch && t instanceof DocumentTouch ? n = !0 : k(["@media (", m.join("touch-enabled),("), d, ")", "{#modernizr{top:9px;position:absolute}}"].join(""), function(e) {
                n = 9 === e.offsetTop
            }), n
        };
        for (var S in g) a(g, S) && (o = S.toLowerCase(), u[o] = g[S](), b.push((u[o] ? "" : "no-") + o));
        return u.addTest = function(e, t) {
                if ("object" == typeof e)
                    for (var i in e) a(e, i) && u.addTest(i, e[i]);
                else {
                    if (e = e.toLowerCase(), u[e] !== n) return u;
                    t = "function" == typeof t ? t() : t, "undefined" != typeof c && c && (p.className += " " + (t ? "" : "no-") + e), u[e] = t
                }
                return u
            }, i(""), h = s = null,
            function(e, t) {
                function n(e, t) {
                    var n = e.createElement("p"),
                        i = e.getElementsByTagName("head")[0] || e.documentElement;
                    return n.innerHTML = "x<style>" + t + "</style>", i.insertBefore(n.lastChild, i.firstChild)
                }

                function i() {
                    var e = b.elements;
                    return "string" == typeof e ? e.split(" ") : e
                }

                function r(e) {
                    var t = g[e[f]];
                    return t || (t = {}, m++, e[f] = m, g[m] = t), t
                }

                function s(e, n, i) {
                    if (n || (n = t), c) return n.createElement(e);
                    i || (i = r(n));
                    var s;
                    return s = i.cache[e] ? i.cache[e].cloneNode() : h.test(e) ? (i.cache[e] = i.createElem(e)).cloneNode() : i.createElem(e), s.canHaveChildren && !d.test(e) ? i.frag.appendChild(s) : s
                }

                function o(e, n) {
                    if (e || (e = t), c) return e.createDocumentFragment();
                    n = n || r(e);
                    for (var s = n.frag.cloneNode(), o = 0, a = i(), l = a.length; l > o; o++) s.createElement(a[o]);
                    return s
                }

                function a(e, t) {
                    t.cache || (t.cache = {}, t.createElem = e.createElement, t.createFrag = e.createDocumentFragment, t.frag = t.createFrag()), e.createElement = function(n) {
                        return b.shivMethods ? s(n, e, t) : t.createElem(n)
                    }, e.createDocumentFragment = Function("h,f", "return function(){var n=f.cloneNode(),c=n.createElement;h.shivMethods&&(" + i().join().replace(/\w+/g, function(e) {
                        return t.createElem(e), t.frag.createElement(e), 'c("' + e + '")'
                    }) + ");return n}")(b, t.frag)
                }

                function l(e) {
                    e || (e = t);
                    var i = r(e);
                    return b.shivCSS && !u && !i.hasCSS && (i.hasCSS = !!n(e, "article,aside,figcaption,figure,footer,header,hgroup,nav,section{display:block}mark{background:#FF0;color:#000}")), c || a(e, i), e
                }
                var u, c, p = e.html5 || {},
                    d = /^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i,
                    h = /^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i,
                    f = "_html5shiv",
                    m = 0,
                    g = {};
                ! function() {
                    try {
                        var e = t.createElement("a");
                        e.innerHTML = "<xyz></xyz>", u = "hidden" in e, c = 1 == e.childNodes.length || function() {
                            t.createElement("a");
                            var e = t.createDocumentFragment();
                            return "undefined" == typeof e.cloneNode || "undefined" == typeof e.createDocumentFragment || "undefined" == typeof e.createElement
                        }()
                    } catch (n) {
                        u = !0, c = !0
                    }
                }();
                var b = {
                    elements: p.elements || "abbr article aside audio bdi canvas data datalist details figcaption figure footer header hgroup mark meter nav output progress section summary time video",
                    shivCSS: p.shivCSS !== !1,
                    supportsUnknownElements: c,
                    shivMethods: p.shivMethods !== !1,
                    type: "default",
                    shivDocument: l,
                    createElement: s,
                    createDocumentFragment: o
                };
                e.html5 = b, l(t)
            }(this, t), u._version = l, u._prefixes = m, u.testStyles = k, p.className = p.className.replace(/(^|\s)no-js(\s|$)/, "$1$2") + (c ? " js " + b.join(" ") : ""), u
    }(this, this.document),
    function(e, t, n) {
        function i(e) {
            return "[object Function]" == g.call(e)
        }

        function r(e) {
            return "string" == typeof e
        }

        function s() {}

        function o(e) {
            return !e || "loaded" == e || "complete" == e || "uninitialized" == e
        }

        function a() {
            var e = b.shift();
            v = 1, e ? e.t ? f(function() {
                ("c" == e.t ? d.injectCss : d.injectJs)(e.s, 0, e.a, e.x, e.e, 1)
            }, 0) : (e(), a()) : v = 0
        }

        function l(e, n, i, r, s, l, u) {
            function c(t) {
                if (!h && o(p.readyState) && (k.r = h = 1, !v && a(), p.onload = p.onreadystatechange = null, t)) {
                    "img" != e && f(function() {
                        S.removeChild(p)
                    }, 50);
                    for (var i in I[n]) I[n].hasOwnProperty(i) && I[n][i].onload()
                }
            }
            var u = u || d.errorTimeout,
                p = t.createElement(e),
                h = 0,
                g = 0,
                k = {
                    t: i,
                    s: n,
                    e: s,
                    a: l,
                    x: u
                };
            1 === I[n] && (g = 1, I[n] = []), "object" == e ? p.data = n : (p.src = n, p.type = e), p.width = p.height = "0", p.onerror = p.onload = p.onreadystatechange = function() {
                c.call(this, g)
            }, b.splice(r, 0, k), "img" != e && (g || 2 === I[n] ? (S.insertBefore(p, y ? null : m), f(c, u)) : I[n].push(p))
        }

        function u(e, t, n, i, s) {
            return v = 0, t = t || "j", r(e) ? l("c" == t ? T : w, e, t, this.i++, n, i, s) : (b.splice(this.i++, 0, e), 1 == b.length && a()), this
        }

        function c() {
            var e = d;
            return e.loader = {
                load: u,
                i: 0
            }, e
        }
        var p, d, h = t.documentElement,
            f = e.setTimeout,
            m = t.getElementsByTagName("script")[0],
            g = {}.toString,
            b = [],
            v = 0,
            k = "MozAppearance" in h.style,
            y = k && !!t.createRange().compareNode,
            S = y ? h : m.parentNode,
            h = e.opera && "[object Opera]" == g.call(e.opera),
            h = !!t.attachEvent && !h,
            w = k ? "object" : h ? "script" : "img",
            T = h ? "script" : w,
            E = Array.isArray || function(e) {
                return "[object Array]" == g.call(e)
            },
            x = [],
            I = {},
            _ = {
                timeout: function(e, t) {
                    return t.length && (e.timeout = t[0]), e
                }
            };
        d = function(e) {
            function t(e) {
                var t, n, i, e = e.split("!"),
                    r = x.length,
                    s = e.pop(),
                    o = e.length,
                    s = {
                        url: s,
                        origUrl: s,
                        prefixes: e
                    };
                for (n = 0; o > n; n++) i = e[n].split("="), (t = _[i.shift()]) && (s = t(s, i));
                for (n = 0; r > n; n++) s = x[n](s);
                return s
            }

            function o(e, r, s, o, a) {
                var l = t(e),
                    u = l.autoCallback;
                l.url.split(".").pop().split("?").shift(), l.bypass || (r && (r = i(r) ? r : r[e] || r[o] || r[e.split("/").pop().split("?")[0]]), l.instead ? l.instead(e, r, s, o, a) : (I[l.url] ? l.noexec = !0 : I[l.url] = 1, s.load(l.url, l.forceCSS || !l.forceJS && "css" == l.url.split(".").pop().split("?").shift() ? "c" : n, l.noexec, l.attrs, l.timeout), (i(r) || i(u)) && s.load(function() {
                    c(), r && r(l.origUrl, a, o), u && u(l.origUrl, a, o), I[l.url] = 2
                })))
            }

            function a(e, t) {
                function n(e, n) {
                    if (e) {
                        if (r(e)) n || (p = function() {
                            var e = [].slice.call(arguments);
                            d.apply(this, e), h()
                        }), o(e, p, t, 0, u);
                        else if (Object(e) === e)
                            for (l in a = function() {
                                    var t, n = 0;
                                    for (t in e) e.hasOwnProperty(t) && n++;
                                    return n
                                }(), e) e.hasOwnProperty(l) && (!n && !--a && (i(p) ? p = function() {
                                var e = [].slice.call(arguments);
                                d.apply(this, e), h()
                            } : p[l] = function(e) {
                                return function() {
                                    var t = [].slice.call(arguments);
                                    e && e.apply(this, t), h()
                                }
                            }(d[l])), o(e[l], p, t, l, u))
                    } else !n && h()
                }
                var a, l, u = !!e.test,
                    c = e.load || e.both,
                    p = e.callback || s,
                    d = p,
                    h = e.complete || s;
                n(u ? e.yep : e.nope, !!c), c && n(c)
            }
            var l, u, p = this.yepnope.loader;
            if (r(e)) o(e, 0, p, 0);
            else if (E(e))
                for (l = 0; l < e.length; l++) u = e[l], r(u) ? o(u, 0, p, 0) : E(u) ? d(u) : Object(u) === u && a(u, p);
            else Object(e) === e && a(e, p)
        }, d.addPrefix = function(e, t) {
            _[e] = t
        }, d.addFilter = function(e) {
            x.push(e)
        }, d.errorTimeout = 1e4, null == t.readyState && t.addEventListener && (t.readyState = "loading", t.addEventListener("DOMContentLoaded", p = function() {
            t.removeEventListener("DOMContentLoaded", p, 0), t.readyState = "complete"
        }, 0)), e.yepnope = c(), e.yepnope.executeStack = a, e.yepnope.injectJs = function(e, n, i, r, l, u) {
            var c, p, h = t.createElement("script"),
                r = r || d.errorTimeout;
            h.src = e;
            for (p in i) h.setAttribute(p, i[p]);
            n = u ? a : n || s, h.onreadystatechange = h.onload = function() {
                !c && o(h.readyState) && (c = 1, n(), h.onload = h.onreadystatechange = null)
            }, f(function() {
                c || (c = 1, n(1))
            }, r), l ? h.onload() : m.parentNode.insertBefore(h, m)
        }, e.yepnope.injectCss = function(e, n, i, r, o, l) {
            var u, r = t.createElement("link"),
                n = l ? a : n || s;
            r.href = e, r.rel = "stylesheet", r.type = "text/css";
            for (u in i) r.setAttribute(u, i[u]);
            o || (m.parentNode.insertBefore(r, m), f(n, 0))
        }
    }(this, document), Modernizr.load = function() {
        yepnope.apply(window, [].slice.call(arguments, 0))
    },
    function(e) {
        "use strict";

        function t(e) {
            return new RegExp("(^|\\s+)" + e + "(\\s+|$)")
        }

        function n(e, t) {
            var n = i(e, t) ? s : r;
            n(e, t)
        }
        var i, r, s;
        "classList" in document.documentElement ? (i = function(e, t) {
            return e.classList.contains(t)
        }, r = function(e, t) {
            e.classList.add(t)
        }, s = function(e, t) {
            e.classList.remove(t)
        }) : (i = function(e, n) {
            return t(n).test(e.className)
        }, r = function(e, t) {
            i(e, t) || (e.className = e.className + " " + t)
        }, s = function(e, n) {
            e.className = e.className.replace(t(n), " ")
        });
        var o = {
            hasClass: i,
            addClass: r,
            removeClass: s,
            toggleClass: n,
            has: i,
            add: r,
            remove: s,
            toggle: n
        };
        "function" == typeof define && define.amd ? define(o) : e.classie = o
    }(window);
var kCHARSET_RULE_MISSING_SEMICOLON = "Missing semicolon at the end of @charset rule",
    kCHARSET_RULE_CHARSET_IS_STRING = "The charset in the @charset rule should be a string",
    kCHARSET_RULE_MISSING_WS = "Missing mandatory whitespace after @charset",
    kIMPORT_RULE_MISSING_URL = "Missing URL in @import rule",
    kURL_EOF = "Unexpected end of stylesheet",
    kURL_WS_INSIDE = "Multiple tokens inside a url() notation",
    kVARIABLES_RULE_POSITION = "@variables rule invalid at this position in the stylesheet",
    kIMPORT_RULE_POSITION = "@import rule invalid at this position in the stylesheet",
    kNAMESPACE_RULE_POSITION = "@namespace rule invalid at this position in the stylesheet",
    kCHARSET_RULE_CHARSET_SOF = "@charset rule invalid at this position in the stylesheet",
    kUNKNOWN_AT_RULE = "Unknow @-rule",
    kENGINES = ["webkit", "presto", "trident", "generic"],
    kCSS_VENDOR_VALUES = {
        "-moz-box": {
            webkit: "-webkit-box",
            presto: "",
            trident: "",
            generic: "box"
        },
        "-moz-inline-box": {
            webkit: "-webkit-inline-box",
            presto: "",
            trident: "",
            generic: "inline-box"
        },
        "-moz-initial": {
            webkit: "",
            presto: "",
            trident: "",
            generic: "initial"
        },
        "-moz-linear-gradient": {
            webkit20110101: FilterLinearGradientForOutput,
            webkit: FilterLinearGradientForOutput,
            presto: "",
            trident: "",
            generic: FilterLinearGradientForOutput
        },
        "-moz-radial-gradient": {
            webkit20110101: FilterRadialGradientForOutput,
            webkit: FilterRadialGradientForOutput,
            presto: "",
            trident: "",
            generic: FilterRadialGradientForOutput
        },
        "-moz-repeating-linear-gradient": {
            webkit20110101: "",
            webkit: FilterRepeatingGradientForOutput,
            presto: "",
            trident: "",
            generic: FilterRepeatingGradientForOutput
        },
        "-moz-repeating-radial-gradient": {
            webkit20110101: "",
            webkit: FilterRepeatingGradientForOutput,
            presto: "",
            trident: "",
            generic: FilterRepeatingGradientForOutput
        }
    },
    kCSS_VENDOR_PREFIXES = {
        lastUpdate: 1304175007,
        properties: [{
            gecko: "",
            webkit: "",
            presto: "",
            trident: "-ms-accelerator",
            status: "P"
        }, {
            gecko: "",
            webkit: "",
            presto: "-wap-accesskey",
            trident: "",
            status: ""
        }, {
            gecko: "-moz-animation",
            webkit: "-webkit-animation",
            presto: "",
            trident: "",
            status: "WD"
        }, {
            gecko: "-moz-animation-delay",
            webkit: "-webkit-animation-delay",
            presto: "",
            trident: "",
            status: "WD"
        }, {
            gecko: "-moz-animation-direction",
            webkit: "-webkit-animation-direction",
            presto: "",
            trident: "",
            status: "WD"
        }, {
            gecko: "-moz-animation-duration",
            webkit: "-webkit-animation-duration",
            presto: "",
            trident: "",
            status: "WD"
        }, {
            gecko: "-moz-animation-fill-mode",
            webkit: "-webkit-animation-fill-mode",
            presto: "",
            trident: "",
            status: "ED"
        }, {
            gecko: "-moz-animation-iteration-count",
            webkit: "-webkit-animation-iteration-count",
            presto: "",
            trident: "",
            status: "WD"
        }, {
            gecko: "-moz-animation-name",
            webkit: "-webkit-animation-name",
            presto: "",
            trident: "",
            status: "WD"
        }, {
            gecko: "-moz-animation-play-state",
            webkit: "-webkit-animation-play-state",
            presto: "",
            trident: "",
            status: "WD"
        }, {
            gecko: "-moz-animation-timing-function",
            webkit: "-webkit-animation-timing-function",
            presto: "",
            trident: "",
            status: "WD"
        }, {
            gecko: "-moz-appearance",
            webkit: "-webkit-appearance",
            presto: "",
            trident: "",
            status: "CR"
        }, {
            gecko: "",
            webkit: "-webkit-backface-visibility",
            presto: "",
            trident: "",
            status: "WD"
        }, {
            gecko: "background-clip",
            webkit: "-webkit-background-clip",
            presto: "background-clip",
            trident: "background-clip",
            status: "WD"
        }, {
            gecko: "",
            webkit: "-webkit-background-composite",
            presto: "",
            trident: "",
            status: ""
        }, {
            gecko: "-moz-background-inline-policy",
            webkit: "",
            presto: "",
            trident: "",
            status: "P"
        }, {
            gecko: "background-origin",
            webkit: "-webkit-background-origin",
            presto: "background-origin",
            trident: "background-origin",
            status: "WD"
        }, {
            gecko: "",
            webkit: "background-position-x",
            presto: "",
            trident: "-ms-background-position-x",
            status: ""
        }, {
            gecko: "",
            webkit: "background-position-y",
            presto: "",
            trident: "-ms-background-position-y",
            status: ""
        }, {
            gecko: "background-size",
            webkit: "-webkit-background-size",
            presto: "background-size",
            trident: "background-size",
            status: "WD"
        }, {
            gecko: "",
            webkit: "",
            presto: "",
            trident: "-ms-behavior",
            status: ""
        }, {
            gecko: "-moz-binding",
            webkit: "",
            presto: "",
            trident: "",
            status: "P"
        }, {
            gecko: "",
            webkit: "",
            presto: "",
            trident: "-ms-block-progression",
            status: ""
        }, {
            gecko: "",
            webkit: "-webkit-border-after",
            presto: "",
            trident: "",
            status: "ED"
        }, {
            gecko: "",
            webkit: "-webkit-border-after-color",
            presto: "",
            trident: "",
            status: "ED"
        }, {
            gecko: "",
            webkit: "-webkit-border-after-style",
            presto: "",
            trident: "",
            status: "ED"
        }, {
            gecko: "",
            webkit: "-webkit-border-after-width",
            presto: "",
            trident: "",
            status: "ED"
        }, {
            gecko: "",
            webkit: "-webkit-border-before",
            presto: "",
            trident: "",
            status: "ED"
        }, {
            gecko: "",
            webkit: "-webkit-border-before-color",
            presto: "",
            trident: "",
            status: "ED"
        }, {
            gecko: "",
            webkit: "-webkit-border-before-style",
            presto: "",
            trident: "",
            status: "ED"
        }, {
            gecko: "",
            webkit: "-webkit-border-before-width",
            presto: "",
            trident: "",
            status: "ED"
        }, {
            gecko: "-moz-border-bottom-colors",
            webkit: "",
            presto: "",
            trident: "",
            status: "P"
        }, {
            gecko: "border-bottom-left-radius",
            webkit: "-webkit-border-bottom-left-radius",
            presto: "border-bottom-left-radius",
            trident: "border-bottom-left-radius",
            status: "WD"
        }, {
            gecko: "",
            webkit: "-webkit-border-bottom-left-radius = border-bottom-left-radius",
            presto: "",
            trident: "",
            status: ""
        }, {
            gecko: "border-bottom-right-radius",
            webkit: "-webkit-border-bottom-right-radius",
            presto: "border-bottom-right-radius",
            trident: "border-bottom-right-radius",
            status: "WD"
        }, {
            gecko: "",
            webkit: "-webkit-border-bottom-right-radius = border-bottom-right-radius",
            presto: "",
            trident: "",
            status: ""
        }, {
            gecko: "-moz-border-end",
            webkit: "-webkit-border-end",
            presto: "",
            trident: "",
            status: "ED"
        }, {
            gecko: "-moz-border-end-color",
            webkit: "-webkit-border-end-color",
            presto: "",
            trident: "",
            status: "ED"
        }, {
            gecko: "-moz-border-end-style",
            webkit: "-webkit-border-end-style",
            presto: "",
            trident: "",
            status: "ED"
        }, {
            gecko: "-moz-border-end-width",
            webkit: "-webkit-border-end-width",
            presto: "",
            trident: "",
            status: "ED"
        }, {
            gecko: "",
            webkit: "-webkit-border-fit",
            presto: "",
            trident: "",
            status: ""
        }, {
            gecko: "",
            webkit: "-webkit-border-horizontal-spacing",
            presto: "",
            trident: "",
            status: ""
        }, {
            gecko: "-moz-border-image",
            webkit: "-webkit-border-image",
            presto: "-o-border-image",
            trident: "",
            status: "WD"
        }, {
            gecko: "-moz-border-left-colors",
            webkit: "",
            presto: "",
            trident: "",
            status: "P"
        }, {
            gecko: "border-radius",
            webkit: "-webkit-border-radius",
            presto: "border-radius",
            trident: "border-radius",
            status: "WD"
        }, {
            gecko: "-moz-border-right-colors",
            webkit: "",
            presto: "",
            trident: "",
            status: "P"
        }, {
            gecko: "-moz-border-start",
            webkit: "-webkit-border-start",
            presto: "",
            trident: "",
            status: "ED"
        }, {
            gecko: "-moz-border-start-color",
            webkit: "-webkit-border-start-color",
            presto: "",
            trident: "",
            status: "ED"
        }, {
            gecko: "-moz-border-start-style",
            webkit: "-webkit-border-start-style",
            presto: "",
            trident: "",
            status: "ED"
        }, {
            gecko: "-moz-border-start-width",
            webkit: "-webkit-border-start-width",
            presto: "",
            trident: "",
            status: "ED"
        }, {
            gecko: "-moz-border-top-colors",
            webkit: "",
            presto: "",
            trident: "",
            status: "P"
        }, {
            gecko: "border-top-left-radius",
            webkit: "-webkit-border-top-left-radius",
            presto: "border-top-left-radius",
            trident: "border-top-left-radius",
            status: "WD"
        }, {
            gecko: "",
            webkit: "-webkit-border-top-left-radius = border-top-left-radius",
            presto: "",
            trident: "",
            status: ""
        }, {
            gecko: "border-top-right-radius",
            webkit: "-webkit-border-top-right-radius",
            presto: "border-top-right-radius",
            trident: "border-top-right-radius",
            status: "WD"
        }, {
            gecko: "",
            webkit: "-webkit-border-top-right-radius = border-top-right-radius",
            presto: "",
            trident: "",
            status: ""
        }, {
            gecko: "",
            webkit: "-webkit-border-vertical-spacing",
            presto: "",
            trident: "",
            status: ""
        }, {
            gecko: "-moz-box-align",
            webkit: "-webkit-box-align",
            presto: "",
            trident: "-ms-box-align",
            status: "WD"
        }, {
            gecko: "-moz-box-direction",
            webkit: "-webkit-box-direction",
            presto: "",
            trident: "-ms-box-direction",
            status: "WD"
        }, {
            gecko: "-moz-box-flex",
            webkit: "-webkit-box-flex",
            presto: "",
            trident: "-ms-box-flex",
            status: "WD"
        }, {
            gecko: "",
            webkit: "-webkit-box-flex-group",
            presto: "",
            trident: "",
            status: "WD"
        }, {
            gecko: "",
            webkit: "",
            presto: "",
            trident: "-ms-box-line-progression",
            status: ""
        }, {
            gecko: "",
            webkit: "-webkit-box-lines",
            presto: "",
            trident: "-ms-box-lines",
            status: "WD"
        }, {
            gecko: "-moz-box-ordinal-group",
            webkit: "-webkit-box-ordinal-group",
            presto: "",
            trident: "-ms-box-ordinal-group",
            status: "WD"
        }, {
            gecko: "-moz-box-orient",
            webkit: "-webkit-box-orient",
            presto: "",
            trident: "-ms-box-orient",
            status: "WD"
        }, {
            gecko: "-moz-box-pack",
            webkit: "-webkit-box-pack",
            presto: "",
            trident: "-ms-box-pack",
            status: "WD"
        }, {
            gecko: "",
            webkit: "-webkit-box-reflect",
            presto: "",
            trident: "",
            status: ""
        }, {
            gecko: "box-shadow",
            webkit: "-webkit-box-shadow",
            presto: "box-shadow",
            trident: "box-shadow",
            status: "WD"
        }, {
            gecko: "-moz-box-sizing",
            webkit: "box-sizing",
            presto: "box-sizing",
            trident: "",
            status: "CR"
        }, {
            gecko: "",
            webkit: "-webkit-box-sizing = box-sizing",
            presto: "",
            trident: "",
            status: ""
        }, {
            gecko: "",
            webkit: "-epub-caption-side = caption-side",
            presto: "",
            trident: "",
            status: ""
        }, {
            gecko: "",
            webkit: "-webkit-color-correction",
            presto: "",
            trident: "",
            status: ""
        }, {
            gecko: "",
            webkit: "-webkit-column-break-after",
            presto: "",
            trident: "",
            status: ""
        }, {
            gecko: "",
            webkit: "-webkit-column-break-before",
            presto: "",
            trident: "",
            status: ""
        }, {
            gecko: "",
            webkit: "-webkit-column-break-inside",
            presto: "",
            trident: "",
            status: ""
        }, {
            gecko: "-moz-column-count",
            webkit: "-webkit-column-count",
            presto: "column-count",
            trident: "column-count",
            status: "CR"
        }, {
            gecko: "-moz-column-gap",
            webkit: "-webkit-column-gap",
            presto: "column-gap",
            trident: "column-gap",
            status: "CR"
        }, {
            gecko: "-moz-column-rule",
            webkit: "-webkit-column-rule",
            presto: "column-rule",
            trident: "column-rule",
            status: "CR"
        }, {
            gecko: "-moz-column-rule-color",
            webkit: "-webkit-column-rule-color",
            presto: "column-rule-color",
            trident: "column-rule-color",
            status: "CR"
        }, {
            gecko: "-moz-column-rule-style",
            webkit: "-webkit-column-rule-style",
            presto: "column-rule-style",
            trident: "column-rule-style",
            status: "CR"
        }, {
            gecko: "-moz-column-rule-width",
            webkit: "-webkit-column-rule-width",
            presto: "column-rule-width",
            trident: "column-rule-width",
            status: "CR"
        }, {
            gecko: "",
            webkit: "-webkit-column-span",
            presto: "column-span",
            trident: "column-span",
            status: "CR"
        }, {
            gecko: "-moz-column-width",
            webkit: "-webkit-column-width",
            presto: "column-width",
            trident: "column-width",
            status: "CR"
        }, {
            gecko: "",
            webkit: "-webkit-columns",
            presto: "columns",
            trident: "columns",
            status: "CR"
        }, {
            gecko: "",
            webkit: "-webkit-dashboard-region",
            presto: "-apple-dashboard-region",
            trident: "",
            status: ""
        }, {
            gecko: "filter",
            webkit: "",
            presto: "filter",
            trident: "-ms-filter",
            status: ""
        }, {
            gecko: "-moz-float-edge",
            webkit: "",
            presto: "",
            trident: "",
            status: "P"
        }, {
            gecko: "",
            webkit: "",
            presto: "-o-focus-opacity",
            trident: "",
            status: ""
        }, {
            gecko: "-moz-font-feature-settings",
            webkit: "",
            presto: "",
            trident: "",
            status: ""
        }, {
            gecko: "-moz-font-language-override",
            webkit: "",
            presto: "",
            trident: "",
            status: ""
        }, {
            gecko: "",
            webkit: "-webkit-font-size-delta",
            presto: "",
            trident: "",
            status: ""
        }, {
            gecko: "",
            webkit: "-webkit-font-smoothing",
            presto: "",
            trident: "",
            status: ""
        }, {
            gecko: "-moz-force-broken-image-icon",
            webkit: "",
            presto: "",
            trident: "",
            status: ""
        }, {
            gecko: "",
            webkit: "",
            presto: "",
            trident: "-ms-grid-column",
            status: "WD"
        }, {
            gecko: "",
            webkit: "",
            presto: "",
            trident: "-ms-grid-column-align",
            status: "WD"
        }, {
            gecko: "",
            webkit: "",
            presto: "",
            trident: "-ms-grid-column-span",
            status: "WD"
        }, {
            gecko: "",
            webkit: "",
            presto: "",
            trident: "-ms-grid-columns",
            status: "WD"
        }, {
            gecko: "",
            webkit: "",
            presto: "",
            trident: "-ms-grid-layer",
            status: "WD"
        }, {
            gecko: "",
            webkit: "",
            presto: "",
            trident: "-ms-grid-row",
            status: "WD"
        }, {
            gecko: "",
            webkit: "",
            presto: "",
            trident: "-ms-grid-row-align",
            status: "WD"
        }, {
            gecko: "",
            webkit: "",
            presto: "",
            trident: "-ms-grid-row-span",
            status: "WD"
        }, {
            gecko: "",
            webkit: "",
            presto: "",
            trident: "-ms-grid-rows",
            status: "WD"
        }, {
            gecko: "",
            webkit: "-webkit-highlight",
            presto: "",
            trident: "",
            status: ""
        }, {
            gecko: "",
            webkit: "-webkit-hyphenate-character",
            presto: "",
            trident: "",
            status: "WD"
        }, {
            gecko: "",
            webkit: "-webkit-hyphenate-limit-after",
            presto: "",
            trident: "",
            status: ""
        }, {
            gecko: "",
            webkit: "-webkit-hyphenate-limit-before",
            presto: "",
            trident: "",
            status: ""
        }, {
            gecko: "",
            webkit: "-webkit-hyphens",
            presto: "",
            trident: "",
            status: "WD"
        }, {
            gecko: "",
            webkit: "-epub-hyphens = -webkit-hyphens",
            presto: "",
            trident: "",
            status: ""
        }, {
            gecko: "-moz-image-region",
            webkit: "",
            presto: "",
            trident: "",
            status: "P"
        }, {
            gecko: "ime-mode",
            webkit: "",
            presto: "",
            trident: "-ms-ime-mode",
            status: ""
        }, {
            gecko: "",
            webkit: "",
            presto: "-wap-input-format",
            trident: "",
            status: ""
        }, {
            gecko: "",
            webkit: "",
            presto: "-wap-input-required",
            trident: "",
            status: ""
        }, {
            gecko: "",
            webkit: "",
            presto: "",
            trident: "-ms-interpolation-mode",
            status: ""
        }, {
            gecko: "",
            webkit: "",
            presto: "-xv-interpret-as",
            trident: "",
            status: ""
        }, {
            gecko: "",
            webkit: "",
            presto: "",
            trident: "-ms-layout-flow",
            status: ""
        }, {
            gecko: "",
            webkit: "",
            presto: "",
            trident: "-ms-layout-grid",
            status: ""
        }, {
            gecko: "",
            webkit: "",
            presto: "",
            trident: "-ms-layout-grid-char",
            status: ""
        }, {
            gecko: "",
            webkit: "",
            presto: "",
            trident: "-ms-layout-grid-line",
            status: ""
        }, {
            gecko: "",
            webkit: "",
            presto: "",
            trident: "-ms-layout-grid-mode",
            status: ""
        }, {
            gecko: "",
            webkit: "",
            presto: "",
            trident: "-ms-layout-grid-type",
            status: ""
        }, {
            gecko: "",
            webkit: "-webkit-line-box-contain",
            presto: "",
            trident: "",
            status: ""
        }, {
            gecko: "",
            webkit: "-webkit-line-break",
            presto: "",
            trident: "-ms-line-break",
            status: ""
        }, {
            gecko: "",
            webkit: "-webkit-line-clamp",
            presto: "",
            trident: "",
            status: ""
        }, {
            gecko: "",
            webkit: "",
            presto: "",
            trident: "-ms-line-grid-mode",
            status: ""
        }, {
            gecko: "",
            webkit: "",
            presto: "-o-link",
            trident: "",
            status: ""
        }, {
            gecko: "",
            webkit: "",
            presto: "-o-link-source",
            trident: "",
            status: ""
        }, {
            gecko: "",
            webkit: "-webkit-locale",
            presto: "",
            trident: "",
            status: ""
        }, {
            gecko: "",
            webkit: "-webkit-logical-height",
            presto: "",
            trident: "",
            status: "ED"
        }, {
            gecko: "",
            webkit: "-webkit-logical-width",
            presto: "",
            trident: "",
            status: "ED"
        }, {
            gecko: "",
            webkit: "-webkit-margin-after",
            presto: "",
            trident: "",
            status: "ED"
        }, {
            gecko: "",
            webkit: "-webkit-margin-after-collapse",
            presto: "",
            trident: "",
            status: ""
        }, {
            gecko: "",
            webkit: "-webkit-margin-before",
            presto: "",
            trident: "",
            status: "ED"
        }, {
            gecko: "",
            webkit: "-webkit-margin-before-collapse",
            presto: "",
            trident: "",
            status: ""
        }, {
            gecko: "",
            webkit: "-webkit-margin-bottom-collapse",
            presto: "",
            trident: "",
            status: ""
        }, {
            gecko: "",
            webkit: "-webkit-margin-collapse",
            presto: "",
            trident: "",
            status: ""
        }, {
            gecko: "-moz-margin-end",
            webkit: "-webkit-margin-end",
            presto: "",
            trident: "",
            status: "ED"
        }, {
            gecko: "-moz-margin-start",
            webkit: "-webkit-margin-start",
            presto: "",
            trident: "",
            status: "ED"
        }, {
            gecko: "",
            webkit: "-webkit-margin-top-collapse",
            presto: "",
            trident: "",
            status: ""
        }, {
            gecko: "",
            webkit: "-webkit-marquee",
            presto: "",
            trident: "",
            status: ""
        }, {
            gecko: "",
            webkit: "",
            presto: "-wap-marquee-dir",
            trident: "",
            status: ""
        }, {
            gecko: "",
            webkit: "-webkit-marquee-direction",
            presto: "",
            trident: "",
            status: "WD"
        }, {
            gecko: "",
            webkit: "-webkit-marquee-increment",
            presto: "",
            trident: "",
            status: ""
        }, {
            gecko: "",
            webkit: "",
            presto: "-wap-marquee-loop",
            trident: "",
            status: "WD"
        }, {
            gecko: "",
            webkit: "-webkit-marquee-repetition",
            presto: "",
            trident: "",
            status: ""
        }, {
            gecko: "",
            webkit: "-webkit-marquee-speed",
            presto: "-wap-marquee-speed",
            trident: "",
            status: "WD"
        }, {
            gecko: "",
            webkit: "-webkit-marquee-style",
            presto: "-wap-marquee-style",
            trident: "",
            status: "WD"
        }, {
            gecko: "mask",
            webkit: "-webkit-mask",
            presto: "mask",
            trident: "",
            status: ""
        }, {
            gecko: "",
            webkit: "-webkit-mask-attachment",
            presto: "",
            trident: "",
            status: ""
        }, {
            gecko: "",
            webkit: "-webkit-mask-box-image",
            presto: "",
            trident: "",
            status: ""
        }, {
            gecko: "",
            webkit: "-webkit-mask-clip",
            presto: "",
            trident: "",
            status: ""
        }, {
            gecko: "",
            webkit: "-webkit-mask-composite",
            presto: "",
            trident: "",
            status: ""
        }, {
            gecko: "",
            webkit: "-webkit-mask-image",
            presto: "",
            trident: "",
            status: ""
        }, {
            gecko: "",
            webkit: "-webkit-mask-origin",
            presto: "",
            trident: "",
            status: ""
        }, {
            gecko: "",
            webkit: "-webkit-mask-position",
            presto: "",
            trident: "",
            status: ""
        }, {
            gecko: "",
            webkit: "-webkit-mask-position-x",
            presto: "",
            trident: "",
            status: ""
        }, {
            gecko: "",
            webkit: "-webkit-mask-position-y",
            presto: "",
            trident: "",
            status: ""
        }, {
            gecko: "",
            webkit: "-webkit-mask-repeat",
            presto: "",
            trident: "",
            status: ""
        }, {
            gecko: "",
            webkit: "-webkit-mask-repeat-x",
            presto: "",
            trident: "",
            status: ""
        }, {
            gecko: "",
            webkit: "-webkit-mask-repeat-y",
            presto: "",
            trident: "",
            status: ""
        }, {
            gecko: "",
            webkit: "-webkit-mask-size",
            presto: "",
            trident: "",
            status: ""
        }, {
            gecko: "",
            webkit: "-webkit-match-nearest-mail-blockquote-color",
            presto: "",
            trident: "",
            status: ""
        }, {
            gecko: "",
            webkit: "-webkit-max-logical-height",
            presto: "",
            trident: "",
            status: ""
        }, {
            gecko: "",
            webkit: "-webkit-max-logical-width",
            presto: "",
            trident: "",
            status: "ED"
        }, {
            gecko: "",
            webkit: "-webkit-min-logical-height",
            presto: "",
            trident: "",
            status: "ED"
        }, {
            gecko: "",
            webkit: "-webkit-min-logical-width",
            presto: "",
            trident: "",
            status: "ED"
        }, {
            gecko: "",
            webkit: "",
            presto: "-o-mini-fold",
            trident: "",
            status: ""
        }, {
            gecko: "",
            webkit: "-webkit-nbsp-mode",
            presto: "",
            trident: "",
            status: "P"
        }, {
            gecko: "",
            webkit: "",
            presto: "-o-object-fit",
            trident: "",
            status: "ED"
        }, {
            gecko: "",
            webkit: "",
            presto: "-o-object-position",
            trident: "",
            status: "ED"
        }, {
            gecko: "opacity",
            webkit: "-webkit-opacity",
            presto: "opacity",
            trident: "opacity",
            status: "WD"
        }, {
            gecko: "",
            webkit: "-webkit-opacity = opacity",
            presto: "",
            trident: "",
            status: ""
        }, {
            gecko: "-moz-outline-radius",
            webkit: "",
            presto: "",
            trident: "",
            status: "P"
        }, {
            gecko: "-moz-outline-radius-bottomleft",
            webkit: "",
            presto: "",
            trident: "",
            status: "P"
        }, {
            gecko: "-moz-outline-radius-bottomright",
            webkit: "",
            presto: "",
            trident: "",
            status: "P"
        }, {
            gecko: "-moz-outline-radius-topleft",
            webkit: "",
            presto: "",
            trident: "",
            status: "P"
        }, {
            gecko: "-moz-outline-radius-topright",
            webkit: "",
            presto: "",
            trident: "",
            status: "P"
        }, {
            gecko: "overflow-x",
            webkit: "overflow-x",
            presto: "overflow-x",
            trident: "-ms-overflow-x",
            status: "WD"
        }, {
            gecko: "overflow-y",
            webkit: "overflow-y",
            presto: "overflow-y",
            trident: "-ms-overflow-y",
            status: "WD"
        }, {
            gecko: "",
            webkit: "-webkit-padding-after",
            presto: "",
            trident: "",
            status: "ED"
        }, {
            gecko: "",
            webkit: "-webkit-padding-before",
            presto: "",
            trident: "",
            status: "ED"
        }, {
            gecko: "-moz-padding-end",
            webkit: "-webkit-padding-end",
            presto: "",
            trident: "",
            status: "ED"
        }, {
            gecko: "-moz-padding-start",
            webkit: "-webkit-padding-start",
            presto: "",
            trident: "",
            status: "ED"
        }, {
            gecko: "",
            webkit: "-webkit-perspective",
            presto: "",
            trident: "",
            status: "WD"
        }, {
            gecko: "",
            webkit: "-webkit-perspective-origin",
            presto: "",
            trident: "",
            status: "WD"
        }, {
            gecko: "",
            webkit: "-webkit-perspective-origin-x",
            presto: "",
            trident: "",
            status: ""
        }, {
            gecko: "",
            webkit: "-webkit-perspective-origin-y",
            presto: "",
            trident: "",
            status: ""
        }, {
            gecko: "",
            webkit: "",
            presto: "-xv-phonemes",
            trident: "",
            status: ""
        }, {
            gecko: "",
            webkit: "-webkit-rtl-ordering",
            presto: "",
            trident: "",
            status: "P"
        }, {
            gecko: "-moz-script-level",
            webkit: "",
            presto: "",
            trident: "",
            status: ""
        }, {
            gecko: "-moz-script-min-size",
            webkit: "",
            presto: "",
            trident: "",
            status: ""
        }, {
            gecko: "-moz-script-size-multiplier",
            webkit: "",
            presto: "",
            trident: "",
            status: ""
        }, {
            gecko: "",
            webkit: "",
            presto: "scrollbar-3dlight-color",
            trident: "-ms-scrollbar-3dlight-color",
            status: "P"
        }, {
            gecko: "",
            webkit: "",
            presto: "scrollbar-arrow-color",
            trident: "-ms-scrollbar-arrow-color",
            status: "P"
        }, {
            gecko: "",
            webkit: "",
            presto: "scrollbar-base-color",
            trident: "-ms-scrollbar-base-color",
            status: "P"
        }, {
            gecko: "",
            webkit: "",
            presto: "scrollbar-darkshadow-color",
            trident: "-ms-scrollbar-darkshadow-color",
            status: "P"
        }, {
            gecko: "",
            webkit: "",
            presto: "scrollbar-face-color",
            trident: "-ms-scrollbar-face-color",
            status: "P"
        }, {
            gecko: "",
            webkit: "",
            presto: "scrollbar-highlight-color",
            trident: "-ms-scrollbar-highlight-color",
            status: "P"
        }, {
            gecko: "",
            webkit: "",
            presto: "scrollbar-shadow-color",
            trident: "-ms-scrollbar-shadow-color",
            status: "P"
        }, {
            gecko: "",
            webkit: "",
            presto: "scrollbar-track-color",
            trident: "-ms-scrollbar-track-color",
            status: "P"
        }, {
            gecko: "-moz-stack-sizing",
            webkit: "",
            presto: "",
            trident: "",
            status: "P"
        }, {
            gecko: "",
            webkit: "-webkit-svg-shadow",
            presto: "",
            trident: "",
            status: ""
        }, {
            gecko: "-moz-tab-size",
            webkit: "",
            presto: "-o-tab-size",
            trident: "",
            status: ""
        }, {
            gecko: "",
            webkit: "",
            presto: "-o-table-baseline",
            trident: "",
            status: ""
        }, {
            gecko: "",
            webkit: "-webkit-tap-highlight-color",
            presto: "",
            trident: "",
            status: "P"
        }, {
            gecko: "",
            webkit: "",
            presto: "",
            trident: "-ms-text-align-last",
            status: "WD"
        }, {
            gecko: "",
            webkit: "",
            presto: "",
            trident: "-ms-text-autospace",
            status: "WD"
        }, {
            gecko: "-moz-text-blink",
            webkit: "",
            presto: "",
            trident: "",
            status: ""
        }, {
            gecko: "",
            webkit: "-webkit-text-combine",
            presto: "",
            trident: "",
            status: ""
        }, {
            gecko: "",
            webkit: "-epub-text-combine = -webkit-text-combine",
            presto: "",
            trident: "",
            status: ""
        }, {
            gecko: "-moz-text-decoration-color",
            webkit: "",
            presto: "",
            trident: "",
            status: ""
        }, {
            gecko: "-moz-text-decoration-line",
            webkit: "",
            presto: "",
            trident: "",
            status: ""
        }, {
            gecko: "-moz-text-decoration-style",
            webkit: "",
            presto: "",
            trident: "",
            status: ""
        }, {
            gecko: "",
            webkit: "-webkit-text-decorations-in-effect",
            presto: "",
            trident: "",
            status: ""
        }, {
            gecko: "",
            webkit: "-webkit-text-emphasis",
            presto: "",
            trident: "",
            status: ""
        }, {
            gecko: "",
            webkit: "-epub-text-emphasis = -webkit-text-emphasis",
            presto: "",
            trident: "",
            status: ""
        }, {
            gecko: "",
            webkit: "-webkit-text-emphasis-color",
            presto: "",
            trident: "",
            status: ""
        }, {
            gecko: "",
            webkit: "-epub-text-emphasis-color = -webkit-text-emphasis-color",
            presto: "",
            trident: "",
            status: ""
        }, {
            gecko: "",
            webkit: "-webkit-text-emphasis-position",
            presto: "",
            trident: "",
            status: ""
        }, {
            gecko: "",
            webkit: "-webkit-text-emphasis-style",
            presto: "",
            trident: "",
            status: ""
        }, {
            gecko: "",
            webkit: "-epub-text-emphasis-style = -webkit-text-emphasis-style",
            presto: "",
            trident: "",
            status: ""
        }, {
            gecko: "",
            webkit: "-webkit-text-fill-color",
            presto: "",
            trident: "",
            status: "P"
        }, {
            gecko: "",
            webkit: "",
            presto: "",
            trident: "-ms-text-justify",
            status: "WD"
        }, {
            gecko: "",
            webkit: "",
            presto: "",
            trident: "-ms-text-kashida-space",
            status: "P"
        }, {
            gecko: "",
            webkit: "-webkit-text-orientation",
            presto: "",
            trident: "",
            status: ""
        }, {
            gecko: "",
            webkit: "-epub-text-orientation = -webkit-text-orientation",
            presto: "",
            trident: "",
            status: ""
        }, {
            gecko: "",
            webkit: "text-overflow",
            presto: "text-overflow",
            trident: "-ms-text-overflow",
            status: "WD"
        }, {
            gecko: "",
            webkit: "-webkit-text-security",
            presto: "",
            trident: "",
            status: "P"
        }, {
            gecko: "",
            webkit: "-webkit-text-size-adjust",
            presto: "",
            trident: "-ms-text-size-adjust",
            status: ""
        }, {
            gecko: "",
            webkit: "-webkit-text-stroke",
            presto: "",
            trident: "",
            status: "P"
        }, {
            gecko: "",
            webkit: "-webkit-text-stroke-color",
            presto: "",
            trident: "",
            status: "P"
        }, {
            gecko: "",
            webkit: "-webkit-text-stroke-width",
            presto: "",
            trident: "",
            status: "P"
        }, {
            gecko: "",
            webkit: "-epub-text-transform = text-transform",
            presto: "",
            trident: "",
            status: ""
        }, {
            gecko: "",
            webkit: "",
            presto: "",
            trident: "-ms-text-underline-position",
            status: "P"
        }, {
            gecko: "",
            webkit: "-webkit-touch-callout",
            presto: "",
            trident: "",
            status: "P"
        }, {
            gecko: "-moz-transform",
            webkit: "-webkit-transform",
            presto: "-o-transform",
            trident: "-ms-transform",
            status: "WD"
        }, {
            gecko: "-moz-transform-origin",
            webkit: "-webkit-transform-origin",
            presto: "-o-transform-origin",
            trident: "-ms-transform-origin",
            status: "WD"
        }, {
            gecko: "",
            webkit: "-webkit-transform-origin-x",
            presto: "",
            trident: "",
            status: "P"
        }, {
            gecko: "",
            webkit: "-webkit-transform-origin-y",
            presto: "",
            trident: "",
            status: "P"
        }, {
            gecko: "",
            webkit: "-webkit-transform-origin-z",
            presto: "",
            trident: "",
            status: "P"
        }, {
            gecko: "",
            webkit: "-webkit-transform-style",
            presto: "",
            trident: "",
            status: "WD"
        }, {
            gecko: "-moz-transition",
            webkit: "-webkit-transition",
            presto: "-o-transition",
            trident: "",
            status: "WD"
        }, {
            gecko: "-moz-transition-delay",
            webkit: "-webkit-transition-delay",
            presto: "-o-transition-delay",
            trident: "",
            status: "WD"
        }, {
            gecko: "-moz-transition-duration",
            webkit: "-webkit-transition-duration",
            presto: "-o-transition-duration",
            trident: "",
            status: "WD"
        }, {
            gecko: "-moz-transition-property",
            webkit: "-webkit-transition-property",
            presto: "-o-transition-property",
            trident: "",
            status: "WD"
        }, {
            gecko: "-moz-transition-timing-function",
            webkit: "-webkit-transition-timing-function",
            presto: "-o-transition-timing-function",
            trident: "",
            status: "WD"
        }, {
            gecko: "",
            webkit: "-webkit-user-drag",
            presto: "",
            trident: "",
            status: "P"
        }, {
            gecko: "-moz-user-focus",
            webkit: "",
            presto: "",
            trident: "",
            status: "P"
        }, {
            gecko: "-moz-user-input",
            webkit: "",
            presto: "",
            trident: "",
            status: "P"
        }, {
            gecko: "-moz-user-modify",
            webkit: "-webkit-user-modify",
            presto: "",
            trident: "",
            status: "P"
        }, {
            gecko: "-moz-user-select",
            webkit: "-webkit-user-select",
            presto: "",
            trident: "",
            status: "P"
        }, {
            gecko: "",
            webkit: "",
            presto: "-xv-voice-balance",
            trident: "",
            status: ""
        }, {
            gecko: "",
            webkit: "",
            presto: "-xv-voice-duration",
            trident: "",
            status: ""
        }, {
            gecko: "",
            webkit: "",
            presto: "-xv-voice-pitch",
            trident: "",
            status: ""
        }, {
            gecko: "",
            webkit: "",
            presto: "-xv-voice-pitch-range",
            trident: "",
            status: ""
        }, {
            gecko: "",
            webkit: "",
            presto: "-xv-voice-rate",
            trident: "",
            status: ""
        }, {
            gecko: "",
            webkit: "",
            presto: "-xv-voice-stress",
            trident: "",
            status: ""
        }, {
            gecko: "",
            webkit: "",
            presto: "-xv-voice-volume",
            trident: "",
            status: ""
        }, {
            gecko: "-moz-window-shadow",
            webkit: "",
            presto: "",
            trident: "",
            status: "P"
        }, {
            gecko: "",
            webkit: "word-break",
            presto: "",
            trident: "-ms-word-break",
            status: "WD"
        }, {
            gecko: "",
            webkit: "-epub-word-break = word-break",
            presto: "",
            trident: "",
            status: ""
        }, {
            gecko: "word-wrap",
            webkit: "word-wrap",
            presto: "word-wrap",
            trident: "-ms-word-wrap",
            status: "WD"
        }, {
            gecko: "",
            webkit: "-webkit-writing-mode",
            presto: "writing-mode",
            trident: "-ms-writing-mode",
            status: "ED"
        }, {
            gecko: "",
            webkit: "-epub-writing-mode = -webkit-writing-mode",
            presto: "",
            trident: "",
            status: ""
        }, {
            gecko: "",
            webkit: "zoom",
            presto: "",
            trident: "-ms-zoom",
            status: ""
        }]
    },
    kCSS_PREFIXED_VALUE = [{
        gecko: "-moz-box",
        webkit: "-moz-box",
        presto: "",
        trident: "",
        generic: "box"
    }],
    CssInspector = {
        mVENDOR_PREFIXES: null,
        kEXPORTS_FOR_GECKO: !0,
        kEXPORTS_FOR_WEBKIT: !0,
        kEXPORTS_FOR_PRESTO: !0,
        kEXPORTS_FOR_TRIDENT: !0,
        cleanPrefixes: function() {
            this.mVENDOR_PREFIXES = null
        },
        prefixesForProperty: function(e) {
            if (!this.mVENDOR_PREFIXES) {
                this.mVENDOR_PREFIXES = {};
                for (var t = 0; t < kCSS_VENDOR_PREFIXES.properties.length; t++) {
                    var n = kCSS_VENDOR_PREFIXES.properties[t];
                    if (n.gecko && (n.webkit || n.presto || n.trident)) {
                        var i = {};
                        this.kEXPORTS_FOR_GECKO && (i[n.gecko] = !0), this.kEXPORTS_FOR_WEBKIT && n.webkit && (i[n.webkit] = !0), this.kEXPORTS_FOR_PRESTO && n.presto && (i[n.presto] = !0), this.kEXPORTS_FOR_TRIDENT && n.trident && (i[n.trident] = !0), this.mVENDOR_PREFIXES[n.gecko] = [];
                        for (var r in i) this.mVENDOR_PREFIXES[n.gecko].push(r)
                    }
                }
            }
            return e in this.mVENDOR_PREFIXES ? this.mVENDOR_PREFIXES[e].sort() : null
        },
        parseColorStop: function(e, t) {
            var n = e.parseColor(t),
                i = "";
            return n ? (t = e.getToken(!0, !0), (t.isPercentage() || t.isDimensionOfUnit("cm") || t.isDimensionOfUnit("mm") || t.isDimensionOfUnit("in") || t.isDimensionOfUnit("pc") || t.isDimensionOfUnit("px") || t.isDimensionOfUnit("em") || t.isDimensionOfUnit("ex") || t.isDimensionOfUnit("pt")) && (i = t.value, t = e.getToken(!0, !0)), {
                color: n,
                position: i
            }) : null
        },
        parseGradient: function(e, t) {
            var n = {
                isRepeating: !1
            };
            if (t.isNotNull() && (t.isFunction("-moz-linear-gradient(") || t.isFunction("-moz-radial-gradient(") || t.isFunction("-moz-repeating-linear-gradient(") || t.isFunction("-moz-repeating-radial-gradient("))) {
                (t.isFunction("-moz-radial-gradient(") || t.isFunction("-moz-repeating-radial-gradient(")) && (n.isRadial = !0), (t.isFunction("-moz-repeating-linear-gradient(") || t.isFunction("-moz-repeating-radial-gradient(")) && (n.isRepeating = !0), t = e.getToken(!0, !0);
                var i = !1,
                    r = !1,
                    s = !1;
                if (t.isAngle() && (n.angle = t.value, i = !0, s = !0, t = e.getToken(!0, !0)), (t.isLength() || t.isIdent("top") || t.isIdent("center") || t.isIdent("bottom") || t.isIdent("left") || t.isIdent("right")) && (i = !0, (t.isLength() || t.isIdent("left") || t.isIdent("right")) && (r = !0), n.position = t.value, t = e.getToken(!0, !0)), i) {
                    if (!s && t.isAngle() ? (n.angle = t.value, s = !0, t = e.getToken(!0, !0)) : (t.isLength() || r && (t.isIdent("top") || t.isIdent("center") || t.isIdent("bottom")) || !r && (t.isLength() || t.isIdent("top") || t.isIdent("center") || t.isIdent("bottom") || t.isIdent("left") || t.isIdent("right"))) && (n.position = "position" in n ? n.position + " " : "", n.position += t.value, t = e.getToken(!0, !0)), !s && t.isAngle() && (n.angle = t.value, s = !0, t = e.getToken(!0, !0)), !t.isSymbol(",")) return null;
                    t = e.getToken(!0, !0)
                }
                if (n.isRadial) {
                    if ((t.isIdent("circle") || t.isIdent("ellipse")) && (n.shape = t.value, t = e.getToken(!0, !0)), (t.isIdent("closest-side") || t.isIdent("closest-corner") || t.isIdent("farthest-side") || t.isIdent("farthest-corner") || t.isIdent("contain") || t.isIdent("cover")) && (n.size = t.value, t = e.getToken(!0, !0)), "shape" in n || !t.isIdent("circle") && !t.isIdent("ellipse") || (n.shape = t.value, t = e.getToken(!0, !0)), ("shape" in n || "size" in n) && !t.isSymbol(",")) return null;
                    ("shape" in n || "size" in n) && (t = e.getToken(!0, !0))
                }
                var o = this.parseColorStop(e, t);
                if (!o) return null;
                if (t = e.currentToken(), !t.isSymbol(",")) return null;
                t = e.getToken(!0, !0);
                var a = this.parseColorStop(e, t);
                if (!a) return null;
                for (t = e.currentToken(), t.isSymbol(",") && (t = e.getToken(!0, !0)), n.stops = [o, a]; !t.isSymbol(")");) {
                    var l = this.parseColorStop(e, t);
                    if (!l) return null;
                    if (t = e.currentToken(), !t.isSymbol(")") && !t.isSymbol(",")) return null;
                    t.isSymbol(",") && (t = e.getToken(!0, !0)), n.stops.push(l)
                }
                return n
            }
            return null
        },
        parseBoxShadows: function(e) {
            var t = new CSSParser;
            t._init(), t.mPreserveWS = !1, t.mPreserveComments = !1, t.mPreservedTokens = [], t.mScanner.init(e);
            for (var n = [], i = t.getToken(!0, !0), r = "", s = "0px", o = "0px", a = "0px", l = "0px", u = !1; i.isNotNull();)
                if (i.isIdent("none")) n.push({
                    none: !0
                }), i = t.getToken(!0, !0);
                else {
                    if (i.isIdent("inset") && (u = !0, i = t.getToken(!0, !0)), !(i.isPercentage() || i.isDimensionOfUnit("cm") || i.isDimensionOfUnit("mm") || i.isDimensionOfUnit("in") || i.isDimensionOfUnit("pc") || i.isDimensionOfUnit("px") || i.isDimensionOfUnit("em") || i.isDimensionOfUnit("ex") || i.isDimensionOfUnit("pt"))) return [];
                    var o = i.value;
                    if (i = t.getToken(!0, !0), !u && i.isIdent("inset") && (u = !0, i = t.getToken(!0, !0)), !(i.isPercentage() || i.isDimensionOfUnit("cm") || i.isDimensionOfUnit("mm") || i.isDimensionOfUnit("in") || i.isDimensionOfUnit("pc") || i.isDimensionOfUnit("px") || i.isDimensionOfUnit("em") || i.isDimensionOfUnit("ex") || i.isDimensionOfUnit("pt"))) return [];
                    var o = i.value;
                    if (i = t.getToken(!0, !0), !u && i.isIdent("inset") && (u = !0, i = t.getToken(!0, !0)), i.isPercentage() || i.isDimensionOfUnit("cm") || i.isDimensionOfUnit("mm") || i.isDimensionOfUnit("in") || i.isDimensionOfUnit("pc") || i.isDimensionOfUnit("px") || i.isDimensionOfUnit("em") || i.isDimensionOfUnit("ex") || i.isDimensionOfUnit("pt")) {
                        var s = i.value;
                        i = t.getToken(!0, !0)
                    }
                    if (!u && i.isIdent("inset") && (u = !0, i = t.getToken(!0, !0)), i.isPercentage() || i.isDimensionOfUnit("cm") || i.isDimensionOfUnit("mm") || i.isDimensionOfUnit("in") || i.isDimensionOfUnit("pc") || i.isDimensionOfUnit("px") || i.isDimensionOfUnit("em") || i.isDimensionOfUnit("ex") || i.isDimensionOfUnit("pt")) {
                        var l = i.value;
                        i = t.getToken(!0, !0)
                    }
                    if (!u && i.isIdent("inset") && (u = !0, i = t.getToken(!0, !0)), i.isFunction("rgb(") || i.isFunction("rgba(") || i.isFunction("hsl(") || i.isFunction("hsla(") || i.isSymbol("#") || i.isIdent()) {
                        var r = t.parseColor(i);
                        i = t.getToken(!0, !0)
                    }
                    if (!u && i.isIdent("inset") && (u = !0, i = t.getToken(!0, !0)), n.push({
                            none: !1,
                            color: r,
                            offsetX: o,
                            offsetY: a,
                            blurRadius: s,
                            spreadRadius: l
                        }), !i.isSymbol(",")) return i.isNotNull() ? [] : n;
                    u = !1, r = "", s = "0px", l = "0px", o = "0px", a = "0px", i = t.getToken(!0, !0)
                }
            return n
        },
        parseTextShadows: function(e) {
            var t = new CSSParser;
            t._init(), t.mPreserveWS = !1, t.mPreserveComments = !1, t.mPreservedTokens = [], t.mScanner.init(e);
            for (var n = [], i = t.getToken(!0, !0), r = "", s = "0px", o = "0px", a = "0px"; i.isNotNull();)
                if (i.isIdent("none")) n.push({
                    none: !0
                }), i = t.getToken(!0, !0);
                else {
                    if (i.isFunction("rgb(") || i.isFunction("rgba(") || i.isFunction("hsl(") || i.isFunction("hsla(") || i.isSymbol("#") || i.isIdent()) {
                        var r = t.parseColor(i);
                        i = t.getToken(!0, !0)
                    }
                    if (!(i.isPercentage() || i.isDimensionOfUnit("cm") || i.isDimensionOfUnit("mm") || i.isDimensionOfUnit("in") || i.isDimensionOfUnit("pc") || i.isDimensionOfUnit("px") || i.isDimensionOfUnit("em") || i.isDimensionOfUnit("ex") || i.isDimensionOfUnit("pt"))) return [];
                    var o = i.value;
                    if (i = t.getToken(!0, !0), !(i.isPercentage() || i.isDimensionOfUnit("cm") || i.isDimensionOfUnit("mm") || i.isDimensionOfUnit("in") || i.isDimensionOfUnit("pc") || i.isDimensionOfUnit("px") || i.isDimensionOfUnit("em") || i.isDimensionOfUnit("ex") || i.isDimensionOfUnit("pt"))) return [];
                    var a = i.value;
                    if (i = t.getToken(!0, !0), i.isPercentage() || i.isDimensionOfUnit("cm") || i.isDimensionOfUnit("mm") || i.isDimensionOfUnit("in") || i.isDimensionOfUnit("pc") || i.isDimensionOfUnit("px") || i.isDimensionOfUnit("em") || i.isDimensionOfUnit("ex") || i.isDimensionOfUnit("pt")) {
                        var s = i.value;
                        i = t.getToken(!0, !0)
                    }
                    if (!r && (i.isFunction("rgb(") || i.isFunction("rgba(") || i.isFunction("hsl(") || i.isFunction("hsla(") || i.isSymbol("#") || i.isIdent())) {
                        var r = t.parseColor(i);
                        i = t.getToken(!0, !0)
                    }
                    if (n.push({
                            none: !1,
                            color: r,
                            offsetX: o,
                            offsetY: a,
                            blurRadius: s
                        }), !i.isSymbol(",")) return i.isNotNull() ? [] : n;
                    r = "", s = "0px", o = "0px", a = "0px", i = t.getToken(!0, !0)
                }
            return n
        },
        parseBackgroundImages: function(e) {
            var t = new CSSParser;
            t._init(), t.mPreserveWS = !1, t.mPreserveComments = !1, t.mPreservedTokens = [], t.mScanner.init(e);
            for (var n = [], i = t.getToken(!0, !0); i.isNotNull();) {
                if (i.isFunction("url(")) {
                    i = t.getToken(!0, !0);
                    var r = t.parseURL(i);
                    n.push({
                        type: "image",
                        value: "url(" + r
                    }), i = t.getToken(!0, !0)
                } else {
                    if (!(i.isFunction("-moz-linear-gradient(") || i.isFunction("-moz-radial-gradient(") || i.isFunction("-moz-repeating-linear-gradient(") || i.isFunction("-moz-repeating-radial-gradient("))) return null;
                    var s = this.parseGradient(t, i);
                    n.push({
                        type: s.isRadial ? "radial-gradient" : "linear-gradient",
                        value: s
                    }), i = t.getToken(!0, !0)
                }
                if (i.isSymbol(",") && (i = t.getToken(!0, !0), !i.isNotNull())) return null
            }
            return n
        },
        serializeGradient: function(e) {
            var t = e.isRadial ? e.isRepeating ? "-moz-repeating-radial-gradient(" : "-moz-radial-gradient(" : e.isRepeating ? "-moz-repeating-linear-gradient(" : "-moz-linear-gradient(";
            (e.angle || e.position) && (t += (e.angle ? e.angle + " " : "") + (e.position ? e.position : "") + ", "), e.isRadial && (e.shape || e.size) && (t += (e.shape ? e.shape : "") + " " + (e.size ? e.size : "") + ", ");
            for (var n = 0; n < e.stops.length; n++) {
                var i = e.stops[n];
                t += i.color + (i.position ? " " + i.position : ""), n != e.stops.length - 1 && (t += ", ")
            }
            return t += ")"
        },
        parseBorderImage: function(e) {
            var t = new CSSParser;
            t._init(), t.mPreserveWS = !1, t.mPreserveComments = !1, t.mPreservedTokens = [], t.mScanner.init(e);
            var n = {
                    url: "",
                    offsets: [],
                    widths: [],
                    sizes: []
                },
                i = t.getToken(!0, !0);
            if (!i.isFunction("url(")) return null;
            i = t.getToken(!0, !0);
            var r = t.parseURL(i);
            if (!r) return null;
            if (n.url = r.substr(0, r.length - 1).trim(), ('"' == n.url[0] && '"' == n.url[n.url.length - 1] || "'" == n.url[0] && "'" == n.url[n.url.length - 1]) && (n.url = n.url.substr(1, n.url.length - 2)), i = t.getToken(!0, !0), !i.isNumber() && !i.isPercentage()) return null;
            n.offsets.push(i.value);
            var s;
            for (s = 0; 3 > s && (i = t.getToken(!0, !0), i.isNumber() || i.isPercentage()); s++) n.offsets.push(i.value);
            if (3 == s && (i = t.getToken(!0, !0)), i.isSymbol("/")) {
                if (i = t.getToken(!0, !0), !(i.isDimension() || i.isNumber("0") || i.isIdent() && i.value in t.kBORDER_WIDTH_NAMES)) return null;
                n.widths.push(i.value);
                for (var s = 0; 3 > s && (i = t.getToken(!0, !0), i.isDimension() || i.isNumber("0") || i.isIdent() && i.value in t.kBORDER_WIDTH_NAMES); s++) n.widths.push(i.value);
                3 == s && (i = t.getToken(!0, !0))
            }
            for (var s = 0; 2 > s; s++) {
                if (!(i.isIdent("stretch") || i.isIdent("repeat") || i.isIdent("round"))) return i.isNotNull() ? null : n;
                n.sizes.push(i.value), i = t.getToken(!0, !0)
            }
            return i.isNotNull() ? null : n
        },
        parseMediaQuery: function(e) {
            var t = {
                    width: !0,
                    "min-width": !0,
                    "max-width": !0,
                    height: !0,
                    "min-height": !0,
                    "max-height": !0,
                    "device-width": !0,
                    "min-device-width": !0,
                    "max-device-width": !0,
                    "device-height": !0,
                    "min-device-height": !0,
                    "max-device-height": !0,
                    orientation: !0,
                    "aspect-ratio": !0,
                    "min-aspect-ratio": !0,
                    "max-aspect-ratio": !0,
                    "device-aspect-ratio": !0,
                    "min-device-aspect-ratio": !0,
                    "max-device-aspect-ratio": !0,
                    color: !0,
                    "min-color": !0,
                    "max-color": !0,
                    "color-index": !0,
                    "min-color-index": !0,
                    "max-color-index": !0,
                    monochrome: !0,
                    "min-monochrome": !0,
                    "max-monochrome": !0,
                    resolution: !0,
                    "min-resolution": !0,
                    "max-resolution": !0,
                    scan: !0,
                    grid: !0
                },
                n = new CSSParser;
            n._init(), n.mPreserveWS = !1, n.mPreserveComments = !1, n.mPreservedTokens = [], n.mScanner.init(e);
            var i = {
                    amplifier: "",
                    medium: "",
                    constraints: []
                },
                r = n.getToken(!0, !0);
            if (r.isIdent("all") || r.isIdent("aural") || r.isIdent("braille") || r.isIdent("handheld") || r.isIdent("print") || r.isIdent("projection") || r.isIdent("screen") || r.isIdent("tty") || r.isIdent("tv")) i.medium = r.value, r = n.getToken(!0, !0);
            else if (r.isIdent("not") || r.isIdent("only")) {
                if (i.amplifier = r.value, r = n.getToken(!0, !0), !(r.isIdent("all") || r.isIdent("aural") || r.isIdent("braille") || r.isIdent("handheld") || r.isIdent("print") || r.isIdent("projection") || r.isIdent("screen") || r.isIdent("tty") || r.isIdent("tv"))) return null;
                i.medium = r.value, r = n.getToken(!0, !0)
            }
            if (i.medium) {
                if (!r.isNotNull()) return i;
                if (!r.isIdent("and")) return null;
                r = n.getToken(!0, !0)
            }
            for (; r.isSymbol("(");) {
                if (r = n.getToken(!0, !0), !(r.isIdent() && r.value in t)) return null;
                var s = r.value;
                if (r = n.getToken(!0, !0), r.isSymbol(":")) {
                    r = n.getToken(!0, !0);
                    for (var o = []; !r.isSymbol(")");) o.push(r.value), r = n.getToken(!0, !0);
                    if (!r.isSymbol(")")) return null;
                    if (i.constraints.push({
                            constraint: s,
                            value: o
                        }), r = n.getToken(!0, !0), !r.isNotNull()) return i;
                    if (!r.isIdent("and")) return null;
                    r = n.getToken(!0, !0)
                } else {
                    if (!r.isSymbol(")")) return null;
                    if (i.constraints.push({
                            constraint: s,
                            value: null
                        }), r = n.getToken(!0, !0), !r.isNotNull()) return i;
                    if (!r.isIdent("and")) return null;
                    r = n.getToken(!0, !0)
                }
            }
            return i
        }
    },
    CSS_ESCAPE = "\\",
    IS_HEX_DIGIT = 1,
    START_IDENT = 2,
    IS_IDENT = 4,
    IS_WHITESPACE = 8,
    W = IS_WHITESPACE,
    I = IS_IDENT,
    S = START_IDENT,
    SI = IS_IDENT | START_IDENT,
    XI = IS_IDENT | IS_HEX_DIGIT,
    XSI = IS_IDENT | START_IDENT | IS_HEX_DIGIT;
CSSScanner.prototype = {
    kLexTable: [0, 0, 0, 0, 0, 0, 0, 0, 0, W, W, 0, W, W, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, W, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, I, 0, 0, XI, XI, XI, XI, XI, XI, XI, XI, XI, XI, 0, 0, 0, 0, 0, 0, 0, XSI, XSI, XSI, XSI, XSI, XSI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, 0, S, 0, 0, SI, 0, XSI, XSI, XSI, XSI, XSI, XSI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI],
    kHexValues: {
        0: 0,
        1: 1,
        2: 2,
        3: 3,
        4: 4,
        5: 5,
        6: 6,
        7: 7,
        8: 8,
        9: 9,
        a: 10,
        b: 11,
        c: 12,
        d: 13,
        e: 14,
        f: 15
    },
    mString: "",
    mPos: 0,
    mPreservedPos: [],
    init: function(e) {
        this.mString = e, this.mPos = 0, this.mPreservedPos = []
    },
    getCurrentPos: function() {
        return this.mPos
    },
    getAlreadyScanned: function() {
        return this.mString.substr(0, this.mPos)
    },
    preserveState: function() {
        this.mPreservedPos.push(this.mPos)
    },
    restoreState: function() {
        this.mPreservedPos.length && (this.mPos = this.mPreservedPos.pop())
    },
    forgetState: function() {
        this.mPreservedPos.length && this.mPreservedPos.pop()
    },
    read: function() {
        return this.mPos < this.mString.length ? this.mString.charAt(this.mPos++) : -1
    },
    peek: function() {
        return this.mPos < this.mString.length ? this.mString.charAt(this.mPos) : -1
    },
    isHexDigit: function(e) {
        var t = e.charCodeAt(0);
        return 256 > t && 0 != (this.kLexTable[t] & IS_HEX_DIGIT)
    },
    isIdentStart: function(e) {
        var t = e.charCodeAt(0);
        return t >= 256 || 0 != (this.kLexTable[t] & START_IDENT)
    },
    startsWithIdent: function(e, t) {
        e.charCodeAt(0);
        return this.isIdentStart(e) || "-" == e && this.isIdentStart(t)
    },
    isIdent: function(e) {
        var t = e.charCodeAt(0);
        return t >= 256 || 0 != (this.kLexTable[t] & IS_IDENT)
    },
    isSymbol: function(e) {
        var t = e.charCodeAt(0);
        return 1 != (this.kLexTable[t] & IS_IDENT)
    },
    pushback: function() {
        this.mPos--
    },
    nextHexValue: function() {
        var e = this.read();
        if (-1 == e || !this.isHexDigit(e)) return new jscsspToken(jscsspToken.NULL_TYPE, null);
        var t = e;
        for (e = this.read(); - 1 != e && this.isHexDigit(e);) t += e, e = this.read();
        return -1 != e && this.pushback(), new jscsspToken(jscsspToken.HEX_TYPE, t)
    },
    gatherEscape: function() {
        var e = this.peek();
        if (-1 == e) return "";
        if (this.isHexDigit(e)) {
            for (var t = 0, n = 0; 6 > n; n++) {
                if (e = this.read(), !this.isHexDigit(e)) {
                    if (this.isHexDigit(e) || this.isWhiteSpace(e)) break;
                    this.pushback();
                    break
                }
                t = 16 * t + this.kHexValues[e.toLowerCase()]
            }
            return 6 == n && (e = this.peek(), this.isWhiteSpace(e) && this.read()), String.fromCharCode(t)
        }
        return e = this.read(), "\n" != e ? e : ""
    },
    gatherIdent: function(e) {
        var t = "";
        if (t += e == CSS_ESCAPE ? this.gatherEscape() : e, e = this.read(), this.mMediaQueryMode)
            for (; - 1 != e && "{" != e && "," != e;) t += e, e = this.read();
        else
            for (; - 1 != e && (this.isIdent(e) || e == CSS_ESCAPE);) t += e == CSS_ESCAPE ? this.gatherEscape() : e, e = this.read();
        return -1 != e && this.pushback(), this.mMediaQueryMode = !1, t
    },
    parseIdent: function(e) {
        var t = this.gatherIdent(e),
            n = this.peek();
        return "(" == n ? (t += this.read(), new jscsspToken(jscsspToken.FUNCTION_TYPE, t)) : new jscsspToken(jscsspToken.IDENT_TYPE, t)
    },
    isDigit: function(e) {
        return e >= "0" && "9" >= e
    },
    parseComment: function(e) {
        for (var t = e; - 1 != (e = this.read());)
            if (t += e, "*" == e) {
                if (e = this.read(), -1 == e) break;
                if ("/" == e) {
                    t += e;
                    break
                }
                this.pushback()
            }
        return new jscsspToken(jscsspToken.COMMENT_TYPE, t)
    },
    parseNumber: function(e) {
        for (var t = e, n = !1; - 1 != (e = this.read());)
            if ("." == e) {
                if (n) break;
                t += e, n = !0
            } else {
                if (!this.isDigit(e)) break;
                t += e
            }
        if (-1 != e && this.startsWithIdent(e, this.peek())) {
            var i = this.gatherIdent(e);
            return t += i, new jscsspToken(jscsspToken.DIMENSION_TYPE, t, i)
        }
        return "%" == e ? (t += "%", new jscsspToken(jscsspToken.PERCENTAGE_TYPE, t)) : (-1 != e && this.pushback(), new jscsspToken(jscsspToken.NUMBER_TYPE, t))
    },
    parseString: function(e) {
        for (var t, n = e, i = e; - 1 != (t = this.read());) {
            if (t == e && i != CSS_ESCAPE) {
                n += t;
                break
            }
            if (t == CSS_ESCAPE) {
                if (t = this.peek(), -1 == t) break;
                "\n" == t || "\r" == t || "\f" == t ? (d = t, t = this.read(), "\r" == d && (t = this.peek(), "\n" == t && (t = this.read()))) : (n += this.gatherEscape(), t = this.peek())
            } else {
                if ("\n" == t || "\r" == t || "\f" == t) break;
                n += t
            }
            i = t
        }
        return new jscsspToken(jscsspToken.STRING_TYPE, n)
    },
    isWhiteSpace: function(e) {
        var t = e.charCodeAt(0);
        return 256 > t && 0 != (this.kLexTable[t] & IS_WHITESPACE)
    },
    eatWhiteSpace: function(e) {
        for (var t = e; - 1 != (e = this.read()) && this.isWhiteSpace(e);) t += e;
        return -1 != e && this.pushback(), t
    },
    parseAtKeyword: function(e) {
        return new jscsspToken(jscsspToken.ATRULE_TYPE, this.gatherIdent(e))
    },
    nextToken: function() {
        var e = this.read();
        if (-1 == e) return new jscsspToken(jscsspToken.NULL_TYPE, null);
        if (this.startsWithIdent(e, this.peek())) return this.parseIdent(e);
        if ("@" == e) {
            var t = this.read();
            if (-1 != t) {
                var n = this.peek();
                if (this.pushback(), this.startsWithIdent(t, n)) return this.parseAtKeyword(e)
            }
        }
        if ("." == e || "+" == e || "-" == e) {
            var t = this.peek();
            if (this.isDigit(t)) return this.parseNumber(e);
            if ("." == t && "." != e) {
                firstChar = this.read();
                var i = this.peek();
                if (this.pushback(), this.isDigit(i)) return this.parseNumber(e)
            }
        }
        if (this.isDigit(e)) return this.parseNumber(e);
        if ("'" == e || '"' == e) return this.parseString(e);
        if (this.isWhiteSpace(e)) {
            var r = this.eatWhiteSpace(e);
            return new jscsspToken(jscsspToken.WHITESPACE_TYPE, r)
        }
        if ("|" == e || "~" == e || "^" == e || "$" == e || "*" == e) {
            var t = this.read();
            if ("=" == t) switch (e) {
                case "~":
                    return new jscsspToken(jscsspToken.INCLUDES_TYPE, "~=");
                case "|":
                    return new jscsspToken(jscsspToken.DASHMATCH_TYPE, "|=");
                case "^":
                    return new jscsspToken(jscsspToken.BEGINSMATCH_TYPE, "^=");
                case "$":
                    return new jscsspToken(jscsspToken.ENDSMATCH_TYPE, "$=");
                case "*":
                    return new jscsspToken(jscsspToken.CONTAINSMATCH_TYPE, "*=")
            } else -1 != t && this.pushback()
        }
        return "/" == e && "*" == this.peek() ? this.parseComment(e) : new jscsspToken(jscsspToken.SYMBOL_TYPE, e)
    }
}, CSSParser.prototype = {
    _init: function() {
        this.mToken = null, this.mLookAhead = null, this.mMediaQueryMode = !1
    },
    kINHERIT: "inherit",
    kBORDER_WIDTH_NAMES: {
        thin: !0,
        medium: !0,
        thick: !0
    },
    kBORDER_STYLE_NAMES: {
        none: !0,
        hidden: !0,
        dotted: !0,
        dashed: !0,
        solid: !0,
        "double": !0,
        groove: !0,
        ridge: !0,
        inset: !0,
        outset: !0
    },
    kCOLOR_NAMES: {
        transparent: !0,
        black: !0,
        silver: !0,
        gray: !0,
        white: !0,
        maroon: !0,
        red: !0,
        purple: !0,
        fuchsia: !0,
        green: !0,
        lime: !0,
        olive: !0,
        yellow: !0,
        navy: !0,
        blue: !0,
        teal: !0,
        aqua: !0,
        aliceblue: !0,
        antiquewhite: !0,
        aqua: !0,
        aquamarine: !0,
        azure: !0,
        beige: !0,
        bisque: !0,
        black: !0,
        blanchedalmond: !0,
        blue: !0,
        blueviolet: !0,
        brown: !0,
        burlywood: !0,
        cadetblue: !0,
        chartreuse: !0,
        chocolate: !0,
        coral: !0,
        cornflowerblue: !0,
        cornsilk: !0,
        crimson: !0,
        cyan: !0,
        darkblue: !0,
        darkcyan: !0,
        darkgoldenrod: !0,
        darkgray: !0,
        darkgreen: !0,
        darkgrey: !0,
        darkkhaki: !0,
        darkmagenta: !0,
        darkolivegreen: !0,
        darkorange: !0,
        darkorchid: !0,
        darkred: !0,
        darksalmon: !0,
        darkseagreen: !0,
        darkslateblue: !0,
        darkslategray: !0,
        darkslategrey: !0,
        darkturquoise: !0,
        darkviolet: !0,
        deeppink: !0,
        deepskyblue: !0,
        dimgray: !0,
        dimgrey: !0,
        dodgerblue: !0,
        firebrick: !0,
        floralwhite: !0,
        forestgreen: !0,
        fuchsia: !0,
        gainsboro: !0,
        ghostwhite: !0,
        gold: !0,
        goldenrod: !0,
        gray: !0,
        green: !0,
        greenyellow: !0,
        grey: !0,
        honeydew: !0,
        hotpink: !0,
        indianred: !0,
        indigo: !0,
        ivory: !0,
        khaki: !0,
        lavender: !0,
        lavenderblush: !0,
        lawngreen: !0,
        lemonchiffon: !0,
        lightblue: !0,
        lightcoral: !0,
        lightcyan: !0,
        lightgoldenrodyellow: !0,
        lightgray: !0,
        lightgreen: !0,
        lightgrey: !0,
        lightpink: !0,
        lightsalmon: !0,
        lightseagreen: !0,
        lightskyblue: !0,
        lightslategray: !0,
        lightslategrey: !0,
        lightsteelblue: !0,
        lightyellow: !0,
        lime: !0,
        limegreen: !0,
        linen: !0,
        magenta: !0,
        maroon: !0,
        mediumaquamarine: !0,
        mediumblue: !0,
        mediumorchid: !0,
        mediumpurple: !0,
        mediumseagreen: !0,
        mediumslateblue: !0,
        mediumspringgreen: !0,
        mediumturquoise: !0,
        mediumvioletred: !0,
        midnightblue: !0,
        mintcream: !0,
        mistyrose: !0,
        moccasin: !0,
        navajowhite: !0,
        navy: !0,
        oldlace: !0,
        olive: !0,
        olivedrab: !0,
        orange: !0,
        orangered: !0,
        orchid: !0,
        palegoldenrod: !0,
        palegreen: !0,
        paleturquoise: !0,
        palevioletred: !0,
        papayawhip: !0,
        peachpuff: !0,
        peru: !0,
        pink: !0,
        plum: !0,
        powderblue: !0,
        purple: !0,
        red: !0,
        rosybrown: !0,
        royalblue: !0,
        saddlebrown: !0,
        salmon: !0,
        sandybrown: !0,
        seagreen: !0,
        seashell: !0,
        sienna: !0,
        silver: !0,
        skyblue: !0,
        slateblue: !0,
        slategray: !0,
        slategrey: !0,
        snow: !0,
        springgreen: !0,
        steelblue: !0,
        tan: !0,
        teal: !0,
        thistle: !0,
        tomato: !0,
        turquoise: !0,
        violet: !0,
        wheat: !0,
        white: !0,
        whitesmoke: !0,
        yellow: !0,
        yellowgreen: !0,
        activeborder: !0,
        activecaption: !0,
        appworkspace: !0,
        background: !0,
        buttonface: !0,
        buttonhighlight: !0,
        buttonshadow: !0,
        buttontext: !0,
        captiontext: !0,
        graytext: !0,
        highlight: !0,
        highlighttext: !0,
        inactiveborder: !0,
        inactivecaption: !0,
        inactivecaptiontext: !0,
        infobackground: !0,
        infotext: !0,
        menu: !0,
        menutext: !0,
        scrollbar: !0,
        threeddarkshadow: !0,
        threedface: !0,
        threedhighlight: !0,
        threedlightshadow: !0,
        threedshadow: !0,
        window: !0,
        windowframe: !0,
        windowtext: !0
    },
    kLIST_STYLE_TYPE_NAMES: {
        decimal: !0,
        "decimal-leading-zero": !0,
        "lower-roman": !0,
        "upper-roman": !0,
        georgian: !0,
        armenian: !0,
        "lower-latin": !0,
        "lower-alpha": !0,
        "upper-latin": !0,
        "upper-alpha": !0,
        "lower-greek": !0,
        disc: !0,
        circle: !0,
        square: !0,
        none: !0,
        box: !0,
        check: !0,
        diamond: !0,
        hyphen: !0,
        "lower-armenian": !0,
        "cjk-ideographic": !0,
        "ethiopic-numeric": !0,
        hebrew: !0,
        "japanese-formal": !0,
        "japanese-informal": !0,
        "simp-chinese-formal": !0,
        "simp-chinese-informal": !0,
        syriac: !0,
        tamil: !0,
        "trad-chinese-formal": !0,
        "trad-chinese-informal": !0,
        "upper-armenian": !0,
        "arabic-indic": !0,
        binary: !0,
        bengali: !0,
        cambodian: !0,
        khmer: !0,
        devanagari: !0,
        gujarati: !0,
        gurmukhi: !0,
        kannada: !0,
        "lower-hexadecimal": !0,
        lao: !0,
        malayalam: !0,
        mongolian: !0,
        myanmar: !0,
        octal: !0,
        oriya: !0,
        persian: !0,
        urdu: !0,
        telugu: !0,
        tibetan: !0,
        "upper-hexadecimal": !0,
        afar: !0,
        "ethiopic-halehame-aa-et": !0,
        "ethiopic-halehame-am-et": !0,
        "amharic-abegede": !0,
        "ehiopic-abegede-am-et": !0,
        "cjk-earthly-branch": !0,
        "cjk-heavenly-stem": !0,
        ethiopic: !0,
        "ethiopic-abegede": !0,
        "ethiopic-abegede-gez": !0,
        "hangul-consonant": !0,
        hangul: !0,
        "hiragana-iroha": !0,
        hiragana: !0,
        "katakana-iroha": !0,
        katakana: !0,
        "lower-norwegian": !0,
        oromo: !0,
        "ethiopic-halehame-om-et": !0,
        sidama: !0,
        "ethiopic-halehame-sid-et": !0,
        somali: !0,
        "ethiopic-halehame-so-et": !0,
        tigre: !0,
        "ethiopic-halehame-tig": !0,
        "tigrinya-er-abegede": !0,
        "ethiopic-abegede-ti-er": !0,
        "tigrinya-et": !0,
        "ethiopic-halehame-ti-et": !0,
        "upper-greek": !0,
        asterisks: !0,
        footnotes: !0,
        "circled-decimal": !0,
        "circled-lower-latin": !0,
        "circled-upper-latin": !0,
        "dotted-decimal": !0,
        "double-circled-decimal": !0,
        "filled-circled-decimal": !0,
        "parenthesised-decimal": !0,
        "parenthesised-lower-latin": !0
    },
    reportError: function(e) {
        this.mError = e
    },
    consumeError: function() {
        var e = this.mError;
        return this.mError = null, e
    },
    currentToken: function() {
        return this.mToken
    },
    getHexValue: function() {
        return this.mToken = this.mScanner.nextHexValue(), this.mToken
    },
    getToken: function(e, t) {
        if (this.mLookAhead) return this.mToken = this.mLookAhead, this.mLookAhead = null, this.mToken;
        for (this.mToken = this.mScanner.nextToken(); this.mToken && (e && this.mToken.isWhiteSpace() || t && this.mToken.isComment());) this.mToken = this.mScanner.nextToken();
        return this.mToken
    },
    lookAhead: function(e, t) {
        var n = this.mToken;
        this.mScanner.preserveState();
        var i = this.getToken(e, t);
        return this.mScanner.restoreState(), this.mToken = n, i
    },
    ungetToken: function() {
        this.mLookAhead = this.mToken
    },
    addUnknownAtRule: function(e, t) {
        for (var n = CountLF(this.mScanner.getAlreadyScanned()), i = [], r = this.getToken(!1, !1); r.isNotNull() && (t += r.value, !r.isSymbol(";") || i.length);) {
            if (r.isSymbol("{") || r.isSymbol("(") || r.isSymbol("[") || "function" == r.type) i.push(r.isFunction() ? "(" : r.value);
            else if ((r.isSymbol("}") || r.isSymbol(")") || r.isSymbol("]")) && i.length) {
                var s = i[i.length - 1];
                if ((r.isSymbol("}") && "{" == s || r.isSymbol(")") && "(" == s || r.isSymbol("]") && "[" == s) && (i.pop(), !i.length && r.isSymbol("}"))) break
            }
            r = this.getToken(!1, !1)
        }
        this.addUnknownRule(e, t, n)
    },
    addUnknownRule: function(e, t, n) {
        var i = this.consumeError(),
            r = new jscsspErrorRule(i);
        r.currentLine = n, r.parsedCssText = t, r.parentStyleSheet = e, e.cssRules.push(r)
    },
    addWhitespace: function(e, t) {
        var n = new jscsspWhitespace;
        n.parsedCssText = t, n.parentStyleSheet = e, e.cssRules.push(n)
    },
    addComment: function(e, t) {
        var n = new jscsspComment;
        n.parsedCssText = t, n.parentStyleSheet = e, e.cssRules.push(n)
    },
    parseCharsetRule: function(e, t) {
        var n = e.value,
            i = this.getToken(!1, !1);
        if (n += i.value, i.isWhiteSpace(" "))
            if (i = this.getToken(!1, !1), n += i.value, i.isString()) {
                var r = i.value;
                if (i = this.getToken(!1, !1), n += i.value, i.isSymbol(";")) {
                    var s = new jscsspCharsetRule;
                    return s.encoding = r, s.parsedCssText = n, s.parentStyleSheet = t, t.cssRules.push(s), !0
                }
                this.reportError(kCHARSET_RULE_MISSING_SEMICOLON)
            } else this.reportError(kCHARSET_RULE_CHARSET_IS_STRING);
        else this.reportError(kCHARSET_RULE_MISSING_WS);
        return this.addUnknownAtRule(t, n), !1
    },
    parseImportRule: function(e, t) {
        var n = CountLF(this.mScanner.getAlreadyScanned()),
            i = e.value;
        this.preserveState();
        var r = this.getToken(!0, !0),
            s = [],
            o = "";
        if (r.isString()) o = r.value, i += " " + o;
        else if (r.isFunction("url(")) {
            r = this.getToken(!0, !0);
            var a = this.parseURL(r);
            a && (o = "url(" + a, i += " " + o)
        } else this.reportError(kIMPORT_RULE_MISSING_URL);
        if (o) {
            for (r = this.getToken(!0, !0); r.isIdent() && (i += " " + r.value, s.push(r.value), r = this.getToken(!0, !0));) {
                if (!r.isSymbol(",")) {
                    if (r.isSymbol(";")) break;
                    break
                }
                i += ",", r = this.getToken(!0, !0)
            }
            if (s.length || s.push("all"), r.isSymbol(";")) {
                i += ";", this.forgetState();
                var l = new jscsspImportRule;
                return l.currentLine = n, l.parsedCssText = i, l.href = o, l.media = s, l.parentStyleSheet = t, t.cssRules.push(l), !0
            }
        }
        return this.restoreState(), this.addUnknownAtRule(t, "@import"), !1
    },
    parseVariablesRule: function(e, t) {
        var n = CountLF(this.mScanner.getAlreadyScanned()),
            i = e.value,
            r = [],
            s = !1;
        this.preserveState(), e = this.getToken(!0, !0);
        for (var o = [], a = !1; e.isNotNull();) {
            if (e.isIdent())
                if (a = !0, i += " " + e.value, o.push(e.value), e = this.getToken(!0, !0), e.isSymbol(",")) i += ",";
                else {
                    if (!e.isSymbol("{")) {
                        e.type = jscsspToken.NULL_TYPE;
                        break
                    }
                    this.ungetToken()
                } else {
                if (e.isSymbol("{")) break;
                if (a) {
                    e.type = jscsspToken.NULL_TYPE;
                    break
                }
            }
            e = this.getToken(!0, !0)
        }
        if (e.isSymbol("{"))
            for (i += " {", e = this.getToken(!0, !0);;) {
                if (!e.isNotNull()) {
                    s = !0;
                    break
                }
                if (e.isSymbol("}")) {
                    i += "}", s = !0;
                    break
                }
                var l = this.parseDeclaration(e, r, !0, !1, t);
                i += (l && r.length ? " " : "") + l, e = this.getToken(!0, !1)
            }
        if (s) {
            this.forgetState();
            var u = new jscsspVariablesRule;
            return u.currentLine = n, u.parsedCssText = i, u.declarations = r, u.media = o, u.parentStyleSheet = t, t.cssRules.push(u), !0
        }
        return this.restoreState(), !1
    },
    parseNamespaceRule: function(e, t) {
        var n = CountLF(this.mScanner.getAlreadyScanned()),
            i = e.value;
        this.preserveState();
        var r = this.getToken(!0, !0);
        if (r.isNotNull()) {
            var s = "",
                o = "";
            if (r.isIdent() && (s = r.value, i += " " + s, r = this.getToken(!0, !0)), r) {
                var a = !1;
                if (r.isString()) a = !0, o = r.value, i += " " + o;
                else if (r.isFunction("url(")) {
                    r = this.getToken(!0, !0);
                    var l = this.parseURL(r);
                    l && (o += "url(" + l, a = !0, i += " " + l)
                }
            }
            if (a && (r = this.getToken(!0, !0), r.isSymbol(";"))) {
                i += ";", this.forgetState();
                var u = new jscsspNamespaceRule;
                return u.currentLine = n, u.parsedCssText = i, u.prefix = s, u.url = o, u.parentStyleSheet = t, t.cssRules.push(u), !0
            }
        }
        return this.restoreState(), this.addUnknownAtRule(t, "@namespace"), !1
    },
    parseFontFaceRule: function(e, t) {
        var n = CountLF(this.mScanner.getAlreadyScanned()),
            i = e.value,
            r = !1,
            s = [];
        this.preserveState();
        var o = this.getToken(!0, !0);
        if (o.isNotNull() && o.isSymbol("{")) {
            i += " " + o.value;
            for (var o = this.getToken(!0, !1);;) {
                if (o.isSymbol("}")) {
                    i += "}", r = !0;
                    break
                }
                var a = this.parseDeclaration(o, s, !1, !1, t);
                i += (a && s.length ? " " : "") + a, o = this.getToken(!0, !1)
            }
        }
        if (r) {
            this.forgetState();
            var l = new jscsspFontFaceRule;
            return l.currentLine = n, l.parsedCssText = i, l.descriptors = s, l.parentStyleSheet = t, t.cssRules.push(l), !0
        }
        return this.restoreState(), !1
    },
    parsePageRule: function(e, t) {
        var n = CountLF(this.mScanner.getAlreadyScanned()),
            i = e.value,
            r = !1,
            s = [];
        this.preserveState();
        var o = this.getToken(!0, !0),
            a = "";
        if ((o.isSymbol(":") || o.isIdent()) && (o.isSymbol(":") && (a = ":", o = this.getToken(!1, !1)), o.isIdent() && (a += o.value, i += " " + a, o = this.getToken(!0, !0))), o.isNotNull() && o.isSymbol("{")) {
            i += " " + o.value;
            for (var o = this.getToken(!0, !1);;) {
                if (o.isSymbol("}")) {
                    i += "}", r = !0;
                    break
                }
                var l = this.parseDeclaration(o, s, !0, !0, t);
                i += (l && s.length ? " " : "") + l, o = this.getToken(!0, !1)
            }
        }
        if (r) {
            this.forgetState();
            var u = new jscsspPageRule;
            return u.currentLine = n, u.parsedCssText = i, u.pageSelector = a, u.declarations = s, u.parentStyleSheet = t, t.cssRules.push(u), !0
        }
        return this.restoreState(), !1
    },
    parseDefaultPropertyValue: function(e, t, n, i, r) {
        for (var s = "", o = [], a = []; e.isNotNull();) {
            if ((e.isSymbol(";") || e.isSymbol("}") || e.isSymbol("!")) && !o.length) {
                e.isSymbol("}") && this.ungetToken();
                break
            }
            if (e.isIdent(this.kINHERIT)) {
                if (a.length) return "";
                s = this.kINHERIT;
                var l = new jscsspVariable(kJscsspINHERIT_VALUE, r);
                a.push(l), e = this.getToken(!0, !0);
                break
            }
            if (e.isSymbol("{") || e.isSymbol("(") || e.isSymbol("[")) o.push(e.value);
            else if ((e.isSymbol("}") || e.isSymbol("]")) && o.length) {
                var u = o[o.length - 1];
                (e.isSymbol("}") && "{" == u || e.isSymbol(")") && "(" == u || e.isSymbol("]") && "[" == u) && o.pop()
            }
            if (e.isFunction())
                if (e.isFunction("var(")) {
                    if (e = this.getToken(!0, !0), !e.isIdent()) return "";
                    var c = e.value;
                    if (e = this.getToken(!0, !0), !e.isSymbol(")")) return "";
                    var l = new jscsspVariable(kJscsspVARIABLE_VALUE, r);
                    s += "var(" + c + ")", l.name = c, a.push(l)
                } else {
                    var p = e.value;
                    e = this.getToken(!1, !0);
                    var d = this.parseFunctionArgument(e);
                    if (!d) return "";
                    s += p + d;
                    var l = new jscsspVariable(kJscsspPRIMITIVE_VALUE, r);
                    l.value = p + d, a.push(l)
                } else if (e.isSymbol("#")) {
                var h = this.parseColor(e);
                if (!h) return "";
                s += h;
                var l = new jscsspVariable(kJscsspPRIMITIVE_VALUE, r);
                l.value = h, a.push(l)
            } else if (e.isWhiteSpace() || e.isSymbol(",")) s += e.value;
            else {
                var l = new jscsspVariable(kJscsspPRIMITIVE_VALUE, r);
                l.value = e.value, a.push(l), s += e.value
            }
            e = this.getToken(!1, !0)
        }
        return a.length && s ? (this.forgetState(), t.push(this._createJscsspDeclarationFromValuesArray(i, a, s)), s) : ""
    },
    parseMarginOrPaddingShorthand: function(e, t, n, i) {
        for (var r = null, s = null, o = null, a = null, l = [];;) {
            if (!e.isNotNull()) break;
            if (e.isSymbol(";") || n && e.isSymbol("!") || e.isSymbol("}")) {
                e.isSymbol("}") && this.ungetToken();
                break
            }
            if (!l.length && e.isIdent(this.kINHERIT)) {
                l.push(e.value), e = this.getToken(!0, !0);
                break
            }
            if (!(e.isDimension() || e.isNumber("0") || e.isPercentage() || e.isIdent("auto"))) return "";
            l.push(e.value), e = this.getToken(!0, !0)
        }
        var u = l.length;
        switch (u) {
            case 1:
                r = l[0], s = r, o = r, a = r;
                break;
            case 2:
                r = l[0], s = r, o = l[1], a = o;
                break;
            case 3:
                r = l[0], o = l[1], a = o, s = l[2];
                break;
            case 4:
                r = l[0], a = l[1], s = l[2], o = l[3];
                break;
            default:
                return ""
        }
        return this.forgetState(), t.push(this._createJscsspDeclarationFromValue(i + "-top", r)), t.push(this._createJscsspDeclarationFromValue(i + "-right", a)), t.push(this._createJscsspDeclarationFromValue(i + "-bottom", s)), t.push(this._createJscsspDeclarationFromValue(i + "-left", o)), r + " " + a + " " + s + " " + o
    },
    parseBorderColorShorthand: function(e, t, n) {
        for (var i = null, r = null, s = null, o = null, a = [];;) {
            if (!e.isNotNull()) break;
            if (e.isSymbol(";") || n && e.isSymbol("!") || e.isSymbol("}")) {
                e.isSymbol("}") && this.ungetToken();
                break
            }
            if (!a.length && e.isIdent(this.kINHERIT)) {
                a.push(e.value), e = this.getToken(!0, !0);
                break
            }
            var l = this.parseColor(e);
            if (!l) return "";
            a.push(l), e = this.getToken(!0, !0)
        }
        var u = a.length;
        switch (u) {
            case 1:
                i = a[0], r = i, s = i, o = i;
                break;
            case 2:
                i = a[0], r = i, s = a[1], o = s;
                break;
            case 3:
                i = a[0], s = a[1], o = s, r = a[2];
                break;
            case 4:
                i = a[0], o = a[1], r = a[2], s = a[3];
                break;
            default:
                return ""
        }
        return this.forgetState(), t.push(this._createJscsspDeclarationFromValue("border-top-color", i)), t.push(this._createJscsspDeclarationFromValue("border-right-color", o)), t.push(this._createJscsspDeclarationFromValue("border-bottom-color", r)), t.push(this._createJscsspDeclarationFromValue("border-left-color", s)), i + " " + o + " " + r + " " + s
    },
    parseCueShorthand: function(e, t, n) {
        for (var i = "", r = "", s = [], s = [];;) {
            if (!e.isNotNull()) break;
            if (e.isSymbol(";") || n && e.isSymbol("!") || e.isSymbol("}")) {
                e.isSymbol("}") && this.ungetToken();
                break
            }
            if (!s.length && e.isIdent(this.kINHERIT)) s.push(e.value);
            else if (e.isIdent("none")) s.push(e.value);
            else {
                if (!e.isFunction("url(")) return "";
                var e = this.getToken(!0, !0),
                    o = this.parseURL(e);
                if (!o) return "";
                s.push("url(" + o)
            }
            e = this.getToken(!0, !0)
        }
        var a = s.length;
        switch (a) {
            case 1:
                i = s[0], r = i;
                break;
            case 2:
                i = s[0], r = s[1];
                break;
            default:
                return ""
        }
        return this.forgetState(), aDecl.push(this._createJscsspDeclarationFromValue("cue-before", i)), aDecl.push(this._createJscsspDeclarationFromValue("cue-after", r)), i + " " + r
    },
    parsePauseShorthand: function(e, t, n) {
        for (var i = "", r = "", s = [], s = [];;) {
            if (!e.isNotNull()) break;
            if (e.isSymbol(";") || n && e.isSymbol("!") || e.isSymbol("}")) {
                e.isSymbol("}") && this.ungetToken();
                break
            }
            if (!s.length && e.isIdent(this.kINHERIT)) s.push(e.value);
            else {
                if (!(e.isDimensionOfUnit("ms") || e.isDimensionOfUnit("s") || e.isPercentage() || e.isNumber("0"))) return "";
                s.push(e.value)
            }
            e = this.getToken(!0, !0)
        }
        var o = s.length;
        switch (o) {
            case 1:
                i = s[0], r = i;
                break;
            case 2:
                i = s[0], r = s[1];
                break;
            default:
                return ""
        }
        return this.forgetState(), aDecl.push(this._createJscsspDeclarationFromValue("pause-before", i)), aDecl.push(this._createJscsspDeclarationFromValue("pause-after", r)), i + " " + r
    },
    parseBorderWidthShorthand: function(e, t, n) {
        for (var i = null, r = null, s = null, o = null, a = [];;) {
            if (!e.isNotNull()) break;
            if (e.isSymbol(";") || n && e.isSymbol("!") || e.isSymbol("}")) {
                e.isSymbol("}") && this.ungetToken();
                break
            }
            if (!a.length && e.isIdent(this.kINHERIT)) a.push(e.value);
            else {
                if (!(e.isDimension() || e.isNumber("0") || e.isIdent() && e.value in this.kBORDER_WIDTH_NAMES)) return "";
                a.push(e.value)
            }
            e = this.getToken(!0, !0)
        }
        var l = a.length;
        switch (l) {
            case 1:
                i = a[0], r = i, s = i, o = i;
                break;
            case 2:
                i = a[0], r = i, s = a[1], o = s;
                break;
            case 3:
                i = a[0], s = a[1], o = s, r = a[2];
                break;
            case 4:
                i = a[0], o = a[1], r = a[2], s = a[3];
                break;
            default:
                return ""
        }
        return this.forgetState(), t.push(this._createJscsspDeclarationFromValue("border-top-width", i)), t.push(this._createJscsspDeclarationFromValue("border-right-width", o)), t.push(this._createJscsspDeclarationFromValue("border-bottom-width", r)), t.push(this._createJscsspDeclarationFromValue("border-left-width", s)), i + " " + o + " " + r + " " + s
    },
    parseBorderStyleShorthand: function(e, t, n) {
        for (var i = null, r = null, s = null, o = null, a = [];;) {
            if (!e.isNotNull()) break;
            if (e.isSymbol(";") || n && e.isSymbol("!") || e.isSymbol("}")) {
                e.isSymbol("}") && this.ungetToken();
                break
            }
            if (!a.length && e.isIdent(this.kINHERIT)) a.push(e.value);
            else {
                if (!(e.isIdent() && e.value in this.kBORDER_STYLE_NAMES)) return "";
                a.push(e.value)
            }
            e = this.getToken(!0, !0)
        }
        var l = a.length;
        switch (l) {
            case 1:
                i = a[0], r = i, s = i, o = i;
                break;
            case 2:
                i = a[0], r = i, s = a[1], o = s;
                break;
            case 3:
                i = a[0], s = a[1], o = s, r = a[2];
                break;
            case 4:
                i = a[0], o = a[1], r = a[2], s = a[3];
                break;
            default:
                return ""
        }
        return this.forgetState(), t.push(this._createJscsspDeclarationFromValue("border-top-style", i)), t.push(this._createJscsspDeclarationFromValue("border-right-style", o)), t.push(this._createJscsspDeclarationFromValue("border-bottom-style", r)), t.push(this._createJscsspDeclarationFromValue("border-left-style", s)), i + " " + o + " " + r + " " + s
    },
    parseBorderEdgeOrOutlineShorthand: function(e, t, n, i) {
        function r(e, t, n, i, r, s) {
            t.push(e._createJscsspDeclarationFromValue(n + "-width", i)), t.push(e._createJscsspDeclarationFromValue(n + "-style", r)), t.push(e._createJscsspDeclarationFromValue(n + "-color", s))
        }
        for (var s = null, o = null, a = null;;) {
            if (!e.isNotNull()) break;
            if (e.isSymbol(";") || n && e.isSymbol("!") || e.isSymbol("}")) {
                e.isSymbol("}") && this.ungetToken();
                break
            }
            if (s || o || a || !e.isIdent(this.kINHERIT))
                if (!s && (e.isDimension() || e.isIdent() && e.value in this.kBORDER_WIDTH_NAMES || e.isNumber("0"))) s = e.value;
                else if (!o && e.isIdent() && e.value in this.kBORDER_STYLE_NAMES) o = e.value;
            else {
                var l = "outline" == i && e.isIdent("invert") ? "invert" : this.parseColor(e);
                if (a || !l) return "";
                a = l
            } else s = this.kINHERIT, o = this.kINHERIT, a = this.kINHERIT;
            e = this.getToken(!0, !0)
        }
        return this.forgetState(), s = s ? s : "medium", o = o ? o : "none", a = a ? a : "-moz-initial", "border" == i ? (r(this, t, "border-top", s, o, a), r(this, t, "border-right", s, o, a), r(this, t, "border-bottom", s, o, a), r(this, t, "border-left", s, o, a)) : r(this, t, i, s, o, a), s + " " + o + " " + a
    },
    parseBackgroundShorthand: function(e, t, n) {
        for (var i = {
                left: !0,
                right: !0
            }, r = {
                top: !0,
                bottom: !0
            }, s = {
                left: !0,
                right: !0,
                top: !0,
                bottom: !0,
                center: !0
            }, o = null, a = null, l = null, u = null, c = null;;) {
            if (!e.isNotNull()) break;
            if (e.isSymbol(";") || n && e.isSymbol("!") || e.isSymbol("}")) {
                e.isSymbol("}") && this.ungetToken();
                break
            }
            if (o || a || l || u || c || !e.isIdent(this.kINHERIT))
                if (l || !e.isIdent("scroll") && !e.isIdent("fixed")) {
                    if (!c && (e.isIdent() && e.value in s || e.isDimension() || e.isNumber("0") || e.isPercentage()))
                        if (c = e.value, e = this.getToken(!0, !0), e.isDimension() || e.isNumber("0") || e.isPercentage()) c += " " + e.value;
                        else if (e.isIdent() && e.value in s) {
                        if (c in i && e.value in i || c in r && e.value in r) return "";
                        c += " " + e.value
                    } else this.ungetToken(), c += " center";
                    else if (!a && (e.isIdent("repeat") || e.isIdent("repeat-x") || e.isIdent("repeat-y") || e.isIdent("no-repeat"))) a = e.value;
                    else if (u || !e.isFunction("url(") && !e.isIdent("none"))
                        if (!u && (e.isFunction("-moz-linear-gradient(") || e.isFunction("-moz-radial-gradient(") || e.isFunction("-moz-repeating-linear-gradient(") || e.isFunction("-moz-repeating-radial-gradient("))) {
                            var p = CssInspector.parseGradient(this, e);
                            if (!p) return "";
                            u = CssInspector.serializeGradient(p)
                        } else {
                            var d = this.parseColor(e);
                            if (o || !d) return "";
                            o = d
                        } else if (u = e.value, e.isFunction("url(")) {
                        e = this.getToken(!0, !0);
                        var h = this.parseURL(e);
                        if (!h) return "";
                        u += h
                    }
                } else l = e.value;
            else o = this.kINHERIT, a = this.kINHERIT, l = this.kINHERIT, u = this.kINHERIT, c = this.kINHERIT;
            e = this.getToken(!0, !0)
        }
        return this.forgetState(), o = o ? o : "transparent", u = u ? u : "none", a = a ? a : "repeat", l = l ? l : "scroll", c = c ? c : "top left", t.push(this._createJscsspDeclarationFromValue("background-color", o)), t.push(this._createJscsspDeclarationFromValue("background-image", u)), t.push(this._createJscsspDeclarationFromValue("background-repeat", a)), t.push(this._createJscsspDeclarationFromValue("background-attachment", l)), t.push(this._createJscsspDeclarationFromValue("background-position", c)), o + " " + u + " " + a + " " + l + " " + c
    },
    parseListStyleShorthand: function(e, t, n) {
        for (var i = {
                inside: !0,
                outside: !0
            }, r = null, s = null, o = null;;) {
            if (!e.isNotNull()) break;
            if (e.isSymbol(";") || n && e.isSymbol("!") || e.isSymbol("}")) {
                e.isSymbol("}") && this.ungetToken();
                break
            }
            if (r || s || o || !e.isIdent(this.kINHERIT)) {
                if (!r && e.isIdent() && e.value in this.kLIST_STYLE_TYPE_NAMES) r = e.value;
                else if (!s && e.isIdent() && e.value in i) s = e.value;
                else if (!o && e.isFunction("url")) {
                    e = this.getToken(!0, !0);
                    var a = this.parseURL(e);
                    if (!a) return "";
                    o = "url(" + a
                } else if (!e.isIdent("none")) return ""
            } else r = this.kINHERIT, s = this.kINHERIT, o = this.kINHERIT;
            e = this.getToken(!0, !0)
        }
        return this.forgetState(), r = r ? r : "none", o = o ? o : "none", s = s ? s : "outside", t.push(this._createJscsspDeclarationFromValue("list-style-type", r)), t.push(this._createJscsspDeclarationFromValue("list-style-position", s)), t.push(this._createJscsspDeclarationFromValue("list-style-image", o)), r + " " + s + " " + o
    },
    parseFontShorthand: function(e, t, n) {
        for (var i = {
                italic: !0,
                oblique: !0
            }, r = {
                "small-caps": !0
            }, s = {
                bold: !0,
                bolder: !0,
                lighter: !0,
                100: !0,
                200: !0,
                300: !0,
                400: !0,
                500: !0,
                600: !0,
                700: !0,
                800: !0,
                900: !0
            }, o = {
                "xx-small": !0,
                "x-small": !0,
                small: !0,
                medium: !0,
                large: !0,
                "x-large": !0,
                "xx-large": !0,
                larger: !0,
                smaller: !0
            }, a = {
                caption: !0,
                icon: !0,
                menu: !0,
                "message-box": !0,
                "small-caption": !0,
                "status-bar": !0
            }, l = {
                serif: !0,
                "sans-serif": !0,
                cursive: !0,
                fantasy: !0,
                monospace: !0
            }, u = null, c = null, p = null, d = null, h = null, f = "", m = null, g = [], b = 0;;) {
            if (!e.isNotNull()) break;
            if (e.isSymbol(";") || n && e.isSymbol("!") || e.isSymbol("}")) {
                e.isSymbol("}") && this.ungetToken();
                break
            }
            if (u || c || p || d || h || f || m || !e.isIdent(this.kINHERIT)) {
                if (!m && e.isIdent() && e.value in a) {
                    m = e.value;
                    break
                }
                if (!u && e.isIdent() && e.value in i) u = e.value;
                else if (!c && e.isIdent() && e.value in r) c = e.value;
                else if (!p && (e.isIdent() || e.isNumber()) && e.value in s) p = e.value;
                else if (!d && (e.isIdent() && e.value in o || e.isDimension() || e.isPercentage())) {
                    d = e.value;
                    var e = this.getToken(!1, !1);
                    if (e.isSymbol("/")) {
                        if (e = this.getToken(!1, !1), h || !(e.isDimension() || e.isNumber() || e.isPercentage())) return "";
                        h = e.value
                    } else this.ungetToken()
                } else if (e.isIdent("normal")) {
                    if (b++, b > 3) return ""
                } else {
                    if (f || !e.isString() && !e.isIdent()) return "";
                    for (var v = !1;;) {
                        if (!e.isNotNull()) break;
                        if (e.isSymbol(";") || n && e.isSymbol("!") || e.isSymbol("}")) {
                            this.ungetToken();
                            break
                        }
                        if (e.isIdent() && e.value in l) {
                            var k = new jscsspVariable(kJscsspPRIMITIVE_VALUE, null);
                            k.value = e.value, g.push(k), f += e.value;
                            break
                        }
                        if (e.isString() || e.isIdent()) {
                            var k = new jscsspVariable(kJscsspPRIMITIVE_VALUE, null);
                            k.value = e.value, g.push(k), f += e.value, v = !1
                        } else {
                            if (v || !e.isSymbol(",")) return "";
                            f += ", ", v = !0
                        }
                        e = this.getToken(!0, !0)
                    }
                }
            } else u = this.kINHERIT, c = this.kINHERIT, p = this.kINHERIT, d = this.kINHERIT, h = this.kINHERIT, f = this.kINHERIT, m = this.kINHERIT;
            e = this.getToken(!0, !0)
        }
        return this.forgetState(), m ? (t.push(this._createJscsspDeclarationFromValue("font", m)), m) : (u = u ? u : "normal", c = c ? c : "normal", p = p ? p : "normal", d = d ? d : "medium", h = h ? h : "normal", f = f ? f : "-moz-initial", t.push(this._createJscsspDeclarationFromValue("font-style", u)), t.push(this._createJscsspDeclarationFromValue("font-variant", c)), t.push(this._createJscsspDeclarationFromValue("font-weight", p)), t.push(this._createJscsspDeclarationFromValue("font-size", d)), t.push(this._createJscsspDeclarationFromValue("line-height", h)), t.push(this._createJscsspDeclarationFromValuesArray("font-family", g, f)), u + " " + c + " " + p + " " + d + "/" + h + " " + f)
    },
    _createJscsspDeclaration: function(e, t) {
        var n = new jscsspDeclaration;
        return n.property = e, n.value = this.trim11(t), n.parsedCssText = e + ": " + t + ";", n
    },
    _createJscsspDeclarationFromValue: function(e, t) {
        var n = new jscsspDeclaration;
        n.property = e;
        var i = new jscsspVariable(kJscsspPRIMITIVE_VALUE, null);
        return i.value = t, n.values = [i], n.valueText = t, n.parsedCssText = e + ": " + t + ";", n
    },
    _createJscsspDeclarationFromValuesArray: function(e, t, n) {
        var i = new jscsspDeclaration;
        return i.property = e, i.values = t, i.valueText = n, i.parsedCssText = e + ": " + n + ";", i
    },
    parseURL: function(e) {
        var t = "";
        if (e.isString()) t += e.value, e = this.getToken(!0, !0);
        else
            for (;;) {
                if (!e.isNotNull()) return this.reportError(kURL_EOF), "";
                if (e.isWhiteSpace() && (nextToken = this.lookAhead(!0, !0), !nextToken.isSymbol(")"))) {
                    this.reportError(kURL_WS_INSIDE), e = this.currentToken();
                    break
                }
                if (e.isSymbol(")")) break;
                t += e.value, e = this.getToken(!1, !1)
            }
        return e.isSymbol(")") ? t + ")" : ""
    },
    parseFunctionArgument: function(e) {
        var t = "";
        if (e.isString()) t += e.value, e = this.getToken(!0, !0);
        else
            for (var n = 1;;) {
                if (!e.isNotNull()) return "";
                if ((e.isFunction() || e.isSymbol("(")) && n++, e.isSymbol(")") && (n--, !n)) break;
                t += e.value, e = this.getToken(!1, !1)
            }
        return e.isSymbol(")") ? t + ")" : ""
    },
    parseColor: function(e) {
        var t = "";
        if (e.isFunction("rgb(") || e.isFunction("rgba(")) {
            t = e.value;
            var n = e.isFunction("rgba(");
            if (e = this.getToken(!0, !0), !e.isNumber() && !e.isPercentage()) return "";
            if (t += e.value, e = this.getToken(!0, !0), !e.isSymbol(",")) return "";
            if (t += ", ", e = this.getToken(!0, !0), !e.isNumber() && !e.isPercentage()) return "";
            if (t += e.value, e = this.getToken(!0, !0), !e.isSymbol(",")) return "";
            if (t += ", ", e = this.getToken(!0, !0), !e.isNumber() && !e.isPercentage()) return "";
            if (t += e.value, n) {
                if (e = this.getToken(!0, !0), !e.isSymbol(",")) return "";
                if (t += ", ", e = this.getToken(!0, !0), !e.isNumber()) return "";
                t += e.value
            }
            if (e = this.getToken(!0, !0), !e.isSymbol(")")) return "";
            t += e.value
        } else if (e.isFunction("hsl(") || e.isFunction("hsla(")) {
            t = e.value;
            var i = e.isFunction("hsla(");
            if (e = this.getToken(!0, !0), !e.isNumber()) return "";
            if (t += e.value, e = this.getToken(!0, !0), !e.isSymbol(",")) return "";
            if (t += ", ", e = this.getToken(!0, !0), !e.isPercentage()) return "";
            if (t += e.value, e = this.getToken(!0, !0), !e.isSymbol(",")) return "";
            if (t += ", ", e = this.getToken(!0, !0), !e.isPercentage()) return "";
            if (t += e.value, i) {
                if (e = this.getToken(!0, !0), !e.isSymbol(",")) return "";
                if (t += ", ", e = this.getToken(!0, !0), !e.isNumber()) return "";
                t += e.value
            }
            if (e = this.getToken(!0, !0), !e.isSymbol(")")) return "";
            t += e.value
        } else if (e.isIdent() && e.value in this.kCOLOR_NAMES) t = e.value;
        else if (e.isSymbol("#")) {
            if (e = this.getHexValue(), !e.isHex()) return "";
            var r = e.value.length;
            if (3 != r && 6 != r) return "";
            if (e.value.match(/[a-fA-F0-9]/g).length != r) return "";
            t = "#" + e.value
        }
        return t
    },
    parseDeclaration: function(e, t, n, i, r) {
        this.preserveState();
        var s = [];
        if (e.isIdent()) {
            var o = e.value.toLowerCase(),
                a = this.getToken(!0, !0);
            if (a.isSymbol(":")) {
                var a = this.getToken(!0, !0),
                    l = "",
                    u = [];
                if (i) switch (o) {
                    case "background":
                        l = this.parseBackgroundShorthand(a, u, n);
                        break;
                    case "margin":
                    case "padding":
                        l = this.parseMarginOrPaddingShorthand(a, u, n, o);
                        break;
                    case "border-color":
                        l = this.parseBorderColorShorthand(a, u, n);
                        break;
                    case "border-style":
                        l = this.parseBorderStyleShorthand(a, u, n);
                        break;
                    case "border-width":
                        l = this.parseBorderWidthShorthand(a, u, n);
                        break;
                    case "border-top":
                    case "border-right":
                    case "border-bottom":
                    case "border-left":
                    case "border":
                    case "outline":
                        l = this.parseBorderEdgeOrOutlineShorthand(a, u, n, o);
                        break;
                    case "cue":
                        l = this.parseCueShorthand(a, u, n);
                        break;
                    case "pause":
                        l = this.parsePauseShorthand(a, u, n);
                        break;
                    case "font":
                        l = this.parseFontShorthand(a, u, n);
                        break;
                    case "list-style":
                        l = this.parseListStyleShorthand(a, u, n);
                        break;
                    default:
                        l = this.parseDefaultPropertyValue(a, u, n, o, r)
                } else l = this.parseDefaultPropertyValue(a, u, n, o, r);
                if (a = this.currentToken(), l) {
                    var c = !1;
                    if (a.isSymbol("!")) {
                        if (a = this.getToken(!0, !0), !a.isIdent("important")) return "";
                        if (c = !0, a = this.getToken(!0, !0), !a.isSymbol(";") && !a.isSymbol("}")) return "";
                        a.isSymbol("}") && this.ungetToken()
                    } else if (a.isNotNull() && !a.isSymbol(";") && !a.isSymbol("}")) return "";
                    for (var p = 0; p < u.length; p++) u[p].priority = c, t.push(u[p]);
                    return o + ": " + l + ";"
                }
            }
        } else if (e.isComment()) {
            if (this.mPreserveComments) {
                this.forgetState();
                var d = new jscsspComment;
                d.parsedCssText = e.value, t.push(d)
            }
            return e.value
        }
        this.restoreState();
        var h = e.value;
        s = [];
        for (var a = this.getToken(!1, !1); a.isNotNull();) {
            if (h += a.value, (a.isSymbol(";") || a.isSymbol("}")) && !s.length) {
                a.isSymbol("}") && this.ungetToken();
                break
            }
            if (a.isSymbol("{") || a.isSymbol("(") || a.isSymbol("[") || a.isFunction()) s.push(a.isFunction() ? "(" : a.value);
            else if ((a.isSymbol("}") || a.isSymbol(")") || a.isSymbol("]")) && s.length) {
                var f = s[s.length - 1];
                (a.isSymbol("}") && "{" == f || a.isSymbol(")") && "(" == f || a.isSymbol("]") && "[" == f) && s.pop()
            }
            a = this.getToken(!1, !1)
        }
        return ""
    },
    parseKeyframesRule: function(e, t) {
        var n = CountLF(this.mScanner.getAlreadyScanned()),
            i = e.value,
            r = !1,
            s = new jscsspKeyframesRule;
        s.currentLine = n, this.preserveState();
        for (var o = this.getToken(!0, !0), a = !1; o.isNotNull();) {
            if (!o.isIdent()) {
                if (o.isSymbol("{")) {
                    a || (o.type = jscsspToken.NULL_TYPE);
                    break
                }
                o.type = jscsspToken.NULL_TYPE;
                break
            }
            if (a = !0, i += " " + o.value, s.name = o.value, o = this.getToken(!0, !0), !o.isSymbol("{")) {
                o.type = jscsspToken.NULL_TYPE;
                break
            }
            this.ungetToken(), o = this.getToken(!0, !0)
        }
        if (o.isSymbol("{") && s.name)
            for (i += " { ", o = this.getToken(!0, !1); o.isNotNull();) {
                if (o.isComment() && this.mPreserveComments) {
                    i += " " + o.value;
                    var l = new jscsspComment;
                    l.parsedCssText = o.value, s.cssRules.push(l)
                } else {
                    if (o.isSymbol("}")) {
                        r = !0;
                        break
                    }
                    var u = this.parseKeyframeRule(o, s, !0);
                    u && (i += u)
                }
                o = this.getToken(!0, !1)
            }
        return r ? (this.forgetState(), s.currentLine = n, s.parsedCssText = i, t.cssRules.push(s), !0) : (this.restoreState(), !1)
    },
    parseKeyframeRule: function(e, t) {
        var n = CountLF(this.mScanner.getAlreadyScanned());
        this.preserveState();
        for (var i = e, r = ""; i.isNotNull();) {
            if (!i.isIdent() && !i.isPercentage()) {
                r = "";
                break
            }
            if (i.isIdent() && !i.isIdent("from") && !i.isIdent("to")) {
                r = "";
                break
            }
            if (r += i.value, i = this.getToken(!0, !0), i.isSymbol("{")) {
                this.ungetToken();
                break
            }
            if (!i.isSymbol(",")) {
                r = "";
                break
            }
            r += ", ", i = this.getToken(!0, !0)
        }
        var s = !1,
            o = [];
        if (r) {
            var a = r;
            if (i = this.getToken(!0, !0), i.isSymbol("{"))
                for (a += " { ", i = this.getToken(!0, !1);;) {
                    if (!i.isNotNull()) {
                        s = !0;
                        break
                    }
                    if (i.isSymbol("}")) {
                        a += "}", s = !0;
                        break
                    }
                    var l = this.parseDeclaration(i, o, !0, !0, t);
                    a += (l && o.length ? " " : "") + l, i = this.getToken(!0, !1)
                }
        }
        if (s) {
            var u = new jscsspKeyframeRule;
            return u.currentLine = n, u.parsedCssText = a, u.declarations = o, u.keyText = r, u.parentRule = t, t.cssRules.push(u), a
        }
        return this.restoreState(), a = this.currentToken().value, this.addUnknownAtRule(t, a), ""
    },
    parseMediaRule: function(e, t) {
        this.mScanner.mMediaQueryMode = !0;
        var n = CountLF(this.mScanner.getAlreadyScanned()),
            i = e.value,
            r = !1,
            s = new jscsspMediaRule;
        s.currentLine = n, this.preserveState();
        for (var o = this.getToken(!0, !0), a = !1; o.isNotNull();) {
            if (o.isIdent())
                if (a = !0, i += " " + o.value, s.media.push(o.value), o = this.getToken(!0, !0), o.isSymbol(",")) i += ",";
                else {
                    if (!o.isSymbol("{")) {
                        o.type = jscsspToken.NULL_TYPE;
                        break
                    }
                    this.ungetToken()
                } else {
                if (o.isSymbol("{")) break;
                if (a) {
                    o.type = jscsspToken.NULL_TYPE;
                    break
                }
            }
            o = this.getToken(!0, !0)
        }
        if (o.isSymbol("{") && s.media.length)
            for (i += " { ", o = this.getToken(!0, !1); o.isNotNull();) {
                if (o.isComment() && this.mPreserveComments) {
                    i += " " + o.value;
                    var l = new jscsspComment;
                    l.parsedCssText = o.value, s.cssRules.push(l)
                } else {
                    if (o.isSymbol("}")) {
                        r = !0;
                        break
                    }
                    var u = this.parseStyleRule(o, s, !0);
                    u && (i += u)
                }
                o = this.getToken(!0, !1)
            }
        return r ? (this.forgetState(), s.parsedCssText = i, t.cssRules.push(s), !0) : (this.restoreState(), !1)
    },
    trim11: function(e) {
        e = e.replace(/^\s+/, "");
        for (var t = e.length - 1; t >= 0; t--)
            if (/\S/.test(e.charAt(t))) {
                e = e.substring(0, t + 1);
                break
            }
        return e
    },
    parseStyleRule: function(e, t, n) {
        var i = CountLF(this.mScanner.getAlreadyScanned());
        this.preserveState();
        var r = this.parseSelector(e, !1),
            s = !1,
            o = [];
        if (r) {
            r = this.trim11(r.selector);
            var a = r,
                l = this.getToken(!0, !0);
            if (l.isSymbol("{")) {
                a += " { ";
                for (var l = this.getToken(!0, !1);;) {
                    if (!l.isNotNull()) {
                        s = !0;
                        break
                    }
                    if (l.isSymbol("}")) {
                        a += "}", s = !0;
                        break
                    }
                    var u = this.parseDeclaration(l, o, !0, !0, t);
                    a += (u && o.length ? " " : "") + u, l = this.getToken(!0, !1)
                }
            }
        }
        if (s) {
            var c = new jscsspStyleRule;
            return c.currentLine = i, c.parsedCssText = a, c.declarations = o, c.mSelectorText = r, n ? c.parentRule = t : c.parentStyleSheet = t, t.cssRules.push(c), a
        }
        return this.restoreState(), a = this.currentToken().value, this.addUnknownAtRule(t, a), ""
    },
    parseSelector: function(e, t) {
        for (var n = "", i = {
                a: 0,
                b: 0,
                c: 0,
                d: 0
            }, r = !0, s = e, o = !1, a = !1;;) {
            if (!s.isNotNull()) return t ? {
                selector: n,
                specificity: i
            } : "";
            if (!t && s.isSymbol("{")) {
                o = !a, o && this.ungetToken();
                break
            }
            if (s.isSymbol(",")) n += s.value, r = !0, a = !1, s = this.getToken(!1, !0);
            else if (a || !(s.isWhiteSpace() || s.isSymbol(">") || s.isSymbol("+") || s.isSymbol("~"))) {
                var l = this.parseSimpleSelector(s, r, !0);
                if (!l) break;
                n += l.selector, i.b += l.specificity.b, i.c += l.specificity.c, i.d += l.specificity.d, r = !1, a = !1, s = this.getToken(!1, !0)
            } else {
                if (s.isWhiteSpace()) {
                    n += " ";
                    var u = this.lookAhead(!0, !0);
                    if (!u.isNotNull()) return t ? {
                        selector: n,
                        specificity: i
                    } : "";
                    (u.isSymbol(">") || u.isSymbol("+") || u.isSymbol("~")) && (s = this.getToken(!0, !0), n += s.value + " ", a = !0)
                } else n += s.value, a = !0;
                r = !0, s = this.getToken(!0, !0)
            }
        }
        return o ? {
            selector: n,
            specificity: i
        } : ""
    },
    isPseudoElement: function(e) {
        switch (e) {
            case "first-letter":
            case "first-line":
            case "before":
            case "after":
            case "marker":
                return !0;
            default:
                return !1
        }
    },
    parseSimpleSelector: function(e, t, n) {
        var i = "",
            r = {
                a: 0,
                b: 0,
                c: 0,
                d: 0
            };
        if (t && (e.isSymbol("*") || e.isSymbol("|") || e.isIdent())) {
            if (e.isSymbol("*") || e.isIdent()) {
                i += e.value;
                var s = e.isIdent();
                if (e = this.getToken(!1, !0), e.isSymbol("|")) {
                    if (i += e.value, e = this.getToken(!1, !0), !e.isIdent() && !e.isSymbol("*")) return null;
                    i += e.value, e.isIdent() && r.d++
                } else this.ungetToken(), s && r.d++
            } else if (e.isSymbol("|")) {
                if (i += e.value, e = this.getToken(!1, !0), !e.isIdent() && !e.isSymbol("*")) return null;
                i += e.value, e.isIdent() && r.d++
            }
        } else if (e.isSymbol(".") || e.isSymbol("#")) {
            var o = e.isSymbol(".");
            if (i += e.value, e = this.getToken(!1, !0), !e.isIdent()) return null;
            i += e.value, o ? r.c++ : r.b++
        } else if (e.isSymbol(":"))
            if (i += e.value, e = this.getToken(!1, !0), e.isSymbol(":") && (i += e.value, e = this.getToken(!1, !0)), e.isIdent()) i += e.value, this.isPseudoElement(e.value) ? r.d++ : r.c++;
            else {
                if (!e.isFunction()) return null;
                if (i += e.value, e.isFunction(":not(")) {
                    if (!n) return null;
                    e = this.getToken(!0, !0);
                    var a = this.parseSimpleSelector(e, t, !1);
                    if (!a) return null;
                    if (i += a.selector, e = this.getToken(!0, !0), !e.isSymbol(")")) return null;
                    i += ")", r.c++
                } else {
                    for (;;) {
                        if (e = this.getToken(!1, !0), e.isSymbol(")")) {
                            i += ")";
                            break
                        }
                        i += e.value
                    }
                    r.c++
                }
            } else if (e.isSymbol("[")) {
            if (i += "[", e = this.getToken(!0, !0), e.isIdent() || e.isSymbol("*")) {
                i += e.value; {
                    this.getToken(!0, !0)
                }
                if (e.isSymbol("|")) {
                    if (i += "|", e = this.getToken(!0, !0), !e.isIdent()) return null;
                    i += e.value
                } else this.ungetToken()
            } else {
                if (!e.isSymbol("|")) return null;
                if (i += "|", e = this.getToken(!0, !0), !e.isIdent()) return null;
                i += e.value
            }
            if (e = this.getToken(!0, !0), e.isIncludes() || e.isDashmatch() || e.isBeginsmatch() || e.isEndsmatch() || e.isContainsmatch() || e.isSymbol("=")) {
                if (i += e.value, e = this.getToken(!0, !0), !e.isString() && !e.isIdent()) return null;
                if (i += e.value, e = this.getToken(!0, !0), !e.isSymbol("]")) return null;
                i += e.value, r.c++
            } else {
                if (!e.isSymbol("]")) return null;
                i += e.value, r.c++
            }
        } else if (e.isWhiteSpace()) {
            var l = this.lookAhead(!0, !0);
            if (l.isSymbol("{")) return ""
        }
        return i ? {
            selector: i,
            specificity: r
        } : null
    },
    preserveState: function() {
        this.mPreservedTokens.push(this.currentToken()), this.mScanner.preserveState()
    },
    restoreState: function() {
        this.mPreservedTokens.length && (this.mScanner.restoreState(), this.mToken = this.mPreservedTokens.pop())
    },
    forgetState: function() {
        this.mPreservedTokens.length && (this.mScanner.forgetState(), this.mPreservedTokens.pop())
    },
    parse: function(e, t, n) {
        if (!e) return null;
        this.mPreserveWS = t, this.mPreserveComments = n, this.mPreservedTokens = [], this.mScanner.init(e);
        var i = new jscsspStylesheet,
            r = this.getToken(!1, !1);
        if (r.isNotNull()) {
            r.isAtRule("@charset") && (this.parseCharsetRule(r, i), r = this.getToken(!1, !1));
            for (var s = !1, o = !1, a = !1;;) {
                if (!r.isNotNull()) break;
                if (r.isWhiteSpace()) t && this.addWhitespace(i, r.value);
                else if (r.isComment()) this.mPreserveComments && this.addComment(i, r.value);
                else if (r.isAtRule()) r.isAtRule("@variables") ? o || s ? (this.reportError(kVARIABLES_RULE_POSITION), this.addUnknownAtRule(i, r.value)) : this.parseVariablesRule(r, i) : r.isAtRule("@import") ? s || a ? (this.reportError(kIMPORT_RULE_POSITION), this.addUnknownAtRule(i, r.value)) : o = this.parseImportRule(r, i) : r.isAtRule("@namespace") ? s ? (this.reportError(kNAMESPACE_RULE_POSITION), this.addUnknownAtRule(i, r.value)) : a = this.parseNamespaceRule(r, i) : r.isAtRule("@font-face") ? this.parseFontFaceRule(r, i) ? s = !0 : this.addUnknownAtRule(i, r.value) : r.isAtRule("@page") ? this.parsePageRule(r, i) ? s = !0 : this.addUnknownAtRule(i, r.value) : r.isAtRule("@media") ? this.parseMediaRule(r, i) ? s = !0 : this.addUnknownAtRule(i, r.value) : r.isAtRule("@keyframes") ? this.parseKeyframesRule(r, i) || this.addUnknownAtRule(i, r.value) : r.isAtRule("@charset") ? (this.reportError(kCHARSET_RULE_CHARSET_SOF), this.addUnknownAtRule(i, r.value)) : (this.reportError(kUNKNOWN_AT_RULE), this.addUnknownAtRule(i, r.value));
                else {
                    var l = this.parseStyleRule(r, i, !1);
                    l && (s = !0)
                }
                r = this.getToken(!1)
            }
            return i
        }
    }
}, jscsspToken.NULL_TYPE = 0, jscsspToken.WHITESPACE_TYPE = 1, jscsspToken.STRING_TYPE = 2, jscsspToken.COMMENT_TYPE = 3, jscsspToken.NUMBER_TYPE = 4, jscsspToken.IDENT_TYPE = 5, jscsspToken.FUNCTION_TYPE = 6, jscsspToken.ATRULE_TYPE = 7, jscsspToken.INCLUDES_TYPE = 8, jscsspToken.DASHMATCH_TYPE = 9, jscsspToken.BEGINSMATCH_TYPE = 10, jscsspToken.ENDSMATCH_TYPE = 11, jscsspToken.CONTAINSMATCH_TYPE = 12, jscsspToken.SYMBOL_TYPE = 13, jscsspToken.DIMENSION_TYPE = 14, jscsspToken.PERCENTAGE_TYPE = 15, jscsspToken.HEX_TYPE = 16, jscsspToken.prototype = {
    isNotNull: function() {
        return this.type
    },
    _isOfType: function(e, t) {
        return this.type == e && (!t || this.value.toLowerCase() == t)
    },
    isWhiteSpace: function(e) {
        return this._isOfType(jscsspToken.WHITESPACE_TYPE, e)
    },
    isString: function() {
        return this._isOfType(jscsspToken.STRING_TYPE)
    },
    isComment: function() {
        return this._isOfType(jscsspToken.COMMENT_TYPE)
    },
    isNumber: function(e) {
        return this._isOfType(jscsspToken.NUMBER_TYPE, e)
    },
    isSymbol: function(e) {
        return this._isOfType(jscsspToken.SYMBOL_TYPE, e)
    },
    isIdent: function(e) {
        return this._isOfType(jscsspToken.IDENT_TYPE, e)
    },
    isFunction: function(e) {
        return this._isOfType(jscsspToken.FUNCTION_TYPE, e)
    },
    isAtRule: function(e) {
        return this._isOfType(jscsspToken.ATRULE_TYPE, e)
    },
    isIncludes: function() {
        return this._isOfType(jscsspToken.INCLUDES_TYPE)
    },
    isDashmatch: function() {
        return this._isOfType(jscsspToken.DASHMATCH_TYPE)
    },
    isBeginsmatch: function() {
        return this._isOfType(jscsspToken.BEGINSMATCH_TYPE)
    },
    isEndsmatch: function() {
        return this._isOfType(jscsspToken.ENDSMATCH_TYPE)
    },
    isContainsmatch: function() {
        return this._isOfType(jscsspToken.CONTAINSMATCH_TYPE)
    },
    isSymbol: function(e) {
        return this._isOfType(jscsspToken.SYMBOL_TYPE, e)
    },
    isDimension: function() {
        return this._isOfType(jscsspToken.DIMENSION_TYPE)
    },
    isPercentage: function() {
        return this._isOfType(jscsspToken.PERCENTAGE_TYPE)
    },
    isHex: function() {
        return this._isOfType(jscsspToken.HEX_TYPE)
    },
    isDimensionOfUnit: function(e) {
        return this.isDimension() && this.unit == e
    },
    isLength: function() {
        return this.isPercentage() || this.isDimensionOfUnit("cm") || this.isDimensionOfUnit("mm") || this.isDimensionOfUnit("in") || this.isDimensionOfUnit("pc") || this.isDimensionOfUnit("px") || this.isDimensionOfUnit("em") || this.isDimensionOfUnit("ex") || this.isDimensionOfUnit("pt")
    },
    isAngle: function() {
        return this.isDimensionOfUnit("deg") || this.isDimensionOfUnit("rad") || this.isDimensionOfUnit("grad")
    }
};
var kJscsspUNKNOWN_RULE = 0,
    kJscsspSTYLE_RULE = 1,
    kJscsspCHARSET_RULE = 2,
    kJscsspIMPORT_RULE = 3,
    kJscsspMEDIA_RULE = 4,
    kJscsspFONT_FACE_RULE = 5,
    kJscsspPAGE_RULE = 6,
    kJscsspKEYFRAMES_RULE = 7,
    kJscsspKEYFRAME_RULE = 8,
    kJscsspNAMESPACE_RULE = 100,
    kJscsspCOMMENT = 101,
    kJscsspWHITE_SPACE = 102,
    kJscsspVARIABLES_RULE = 200,
    kJscsspSTYLE_DECLARATION = 1e3,
    gTABS = "";
jscsspStylesheet.prototype = {
    insertRule: function(e, t) {
        try {
            this.cssRules.splice(t, 1, e)
        } catch (n) {}
    },
    deleteRule: function(e) {
        try {
            this.cssRules.splice(e)
        } catch (t) {}
    },
    cssText: function() {
        for (var e = "", t = 0; t < this.cssRules.length; t++) e += this.cssRules[t].cssText() + "\n";
        return e
    },
    resolveVariables: function(e) {
        function t(e, t) {
            for (var n = 0; n < e.length; n++)
                if (t == e[n]) return !0;
            return !1
        }
        for (var n = 0; n < this.cssRules.length; n++) {
            var i = this.cssRules[n];
            if (i.type == kJscsspSTYLE_RULE || i.type == kJscsspIMPORT_RULE) break;
            if (i.type == kJscsspVARIABLES_RULE && (!i.media.length || t(i.media, e)))
                for (var r = 0; r < i.declarations.length; r++) {
                    for (var s = "", o = 0; o < i.declarations[r].values.length; o++) s += (o ? " " : "") + i.declarations[r].values[o].value;
                    this.variables[i.declarations[r].property] = s
                }
        }
    }
}, jscsspCharsetRule.prototype = {
    cssText: function() {
        return "@charset " + this.encoding + ";"
    },
    setCssText: function(e) {
        var t = {
                cssRules: []
            },
            n = new CSSParser(e),
            i = n.getToken(!1, !1);
        if (i.isAtRule("@charset") && n.parseCharsetRule(i, t)) {
            var r = t.cssRules[0];
            return this.encoding = r.encoding, void(this.parsedCssText = r.parsedCssText)
        }
        throw DOMException.SYNTAX_ERR
    }
}, jscsspErrorRule.prototype = {
    cssText: function() {
        return this.parsedCssText
    }
}, jscsspComment.prototype = {
    cssText: function() {
        return this.parsedCssText
    },
    setCssText: function(e) {
        var t = new CSSParser(e),
            n = t.getToken(!0, !1);
        if (!n.isComment()) throw DOMException.SYNTAX_ERR;
        this.parsedCssText = n.value
    }
}, jscsspWhitespace.prototype = {
    cssText: function() {
        return this.parsedCssText
    }
}, jscsspImportRule.prototype = {
    cssText: function() {
        var e = this.media.join(", ");
        return "@import " + this.href + (e && "all" != e ? e + " " : "") + ";"
    },
    setCssText: function(e) {
        var t = {
                cssRules: []
            },
            n = new CSSParser(e),
            i = n.getToken(!0, !0);
        if (i.isAtRule("@import") && n.parseImportRule(i, t)) {
            var r = t.cssRules[0];
            return this.href = r.href, this.media = r.media, void(this.parsedCssText = r.parsedCssText)
        }
        throw DOMException.SYNTAX_ERR
    }
}, jscsspNamespaceRule.prototype = {
    cssText: function() {
        return "@namespace " + (this.prefix ? this.prefix + " " : "") + this.url + ";"
    },
    setCssText: function(e) {
        var t = {
                cssRules: []
            },
            n = new CSSParser(e),
            i = n.getToken(!0, !0);
        if (i.isAtRule("@namespace") && n.parseNamespaceRule(i, t)) {
            var r = t.cssRules[0];
            return this.url = r.url, this.prefix = r.prefix, void(this.parsedCssText = r.parsedCssText)
        }
        throw DOMException.SYNTAX_ERR
    }
}, jscsspDeclaration.prototype = {
    kCOMMA_SEPARATED: {
        cursor: !0,
        "font-family": !0,
        "voice-family": !0,
        "background-image": !0
    },
    kUNMODIFIED_COMMA_SEPARATED_PROPERTIES: {
        "text-shadow": !0,
        "box-shadow": !0,
        "-moz-transition": !0,
        "-moz-transition-property": !0,
        "-moz-transition-duration": !0,
        "-moz-transition-timing-function": !0,
        "-moz-transition-delay": !0
    },
    cssText: function() {
        var e = CssInspector.prefixesForProperty(this.property);
        if (this.property in this.kUNMODIFIED_COMMA_SEPARATED_PROPERTIES) {
            if (e) {
                for (var t = "", n = 0; n < e.length; n++) {
                    var i = e[n];
                    t += (n ? gTABS : "") + i + ": ", t += this.valueText + (this.priority ? " !important" : "") + ";", t += e.length > 1 && n != e.length - 1 ? "\n" : ""
                }
                return t
            }
            return this.property + ": " + this.valueText + (this.priority ? " !important" : "") + ";"
        }
        if (e) {
            for (var t = "", n = 0; n < e.length; n++) {
                var i = e[n];
                t += (n ? gTABS : "") + i + ": ";
                for (var r = (i in this.kCOMMA_SEPARATED ? ", " : " "), s = 0; s < this.values.length; s++) {
                    if (null == this.values[s].cssText()) return null;
                    t += (s ? r : "") + this.values[s].cssText()
                }
                t += (this.priority ? " !important" : "") + ";" + (e.length > 1 && n != e.length - 1 ? "\n" : "")
            }
            return t
        }
        for (var t = this.property + ": ", r = (this.property in this.kCOMMA_SEPARATED ? ", " : " "), o = {
                webkit: !1,
                presto: !1,
                trident: !1,
                generic: !1
            }, s = 0; s < this.values.length; s++) {
            var a = this.values[s].cssText();
            if (null == a) return null;
            var l = a.indexOf("("),
                u = a;
            if (-1 != l && (u = a.substr(0, l)), u in kCSS_VENDOR_VALUES)
                for (var c in kCSS_VENDOR_VALUES[u]) o[c] = o[c] || "" != kCSS_VENDOR_VALUES[u][c];
            t += (s ? r : "") + a
        }
        t += (this.priority ? " !important" : "") + ";";
        for (var c in o)
            if (o[c]) {
                for (var p = "\n" + gTABS + this.property + ": ", s = 0; s < this.values.length; s++) {
                    var a = this.values[s].cssText();
                    if (null == a) return null;
                    var l = a.indexOf("("),
                        u = a;
                    if (-1 != l && (u = a.substr(0, l)), u in kCSS_VENDOR_VALUES && (functor = kCSS_VENDOR_VALUES[u][c], functor && (a = "string" == typeof functor ? functor : functor(a, c), !a))) {
                        p = null;
                        break
                    }
                    p += (s ? r : "") + a
                }
                t += p ? p + ";" : "\n" + gTABS + "/* Impossible to translate property " + this.property + " for " + c + " */"
            }
        return t
    },
    setCssText: function(e) {
        var t = [],
            n = new CSSParser(e),
            i = n.getToken(!0, !0);
        if (n.parseDeclaration(i, t, !0, !0, null) && t.length && t[0].type == kJscsspSTYLE_DECLARATION) {
            var r = t.cssRules[0];
            return this.property = r.property, this.value = r.value, this.priority = r.priority, void(this.parsedCssText = newRule.parsedCssText)
        }
        throw DOMException.SYNTAX_ERR
    }
}, jscsspFontFaceRule.prototype = {
    cssText: function() {
        var e = gTABS + "@font-face {\n",
            t = gTABS;
        gTABS += "  ";
        for (var n = 0; n < this.descriptors.length; n++) e += gTABS + this.descriptors[n].cssText() + "\n";
        return gTABS = t, e + gTABS + "}"
    },
    setCssText: function(e) {
        var t = {
                cssRules: []
            },
            n = new CSSParser(e),
            i = n.getToken(!0, !0);
        if (i.isAtRule("@font-face") && n.parseFontFaceRule(i, t)) {
            var r = t.cssRules[0];
            return this.descriptors = r.descriptors, void(this.parsedCssText = r.parsedCssText)
        }
        throw DOMException.SYNTAX_ERR
    }
}, jscsspKeyframesRule.prototype = {
    cssText: function() {
        var e = gTABS + "@keyframes " + this.name + " {\n",
            t = gTABS;
        gTABS += "  ";
        for (var n = 0; n < this.cssRules.length; n++) e += gTABS + this.cssRules[n].cssText() + "\n";
        return gTABS = t, e += gTABS + "}\n"
    },
    setCssText: function(e) {
        var t = {
                cssRules: []
            },
            n = new CSSParser(e),
            i = n.getToken(!0, !0);
        if (i.isAtRule("@keyframes") && n.parseKeyframesRule(i, t)) {
            var r = t.cssRules[0];
            return this.cssRules = r.cssRules, this.name = r.name, void(this.parsedCssText = r.parsedCssText)
        }
        throw DOMException.SYNTAX_ERR
    }
}, jscsspKeyframeRule.prototype = {
    cssText: function() {
        var e = this.keyText + " {\n",
            t = gTABS;
        gTABS += "  ";
        for (var n = 0; n < this.declarations.length; n++) {
            var i = this.declarations[n].cssText();
            i && (e += gTABS + this.declarations[n].cssText() + "\n")
        }
        return gTABS = t, e + gTABS + "}"
    },
    setCssText: function(e) {
        var t = {
                cssRules: []
            },
            n = new CSSParser(e),
            i = n.getToken(!0, !0);
        if (!i.isNotNull() && n.parseKeyframeRule(i, t, !1)) {
            var r = t.cssRules[0];
            return this.keyText = r.keyText, this.declarations = r.declarations, void(this.parsedCssText = r.parsedCssText)
        }
        throw DOMException.SYNTAX_ERR
    }
}, jscsspMediaRule.prototype = {
    cssText: function() {
        var e = gTABS + "@media " + this.media.join(", ") + " {\n",
            t = gTABS;
        gTABS += "  ";
        for (var n = 0; n < this.cssRules.length; n++) e += gTABS + this.cssRules[n].cssText() + "\n";
        return gTABS = t, e + gTABS + "}"
    },
    setCssText: function(e) {
        var t = {
                cssRules: []
            },
            n = new CSSParser(e),
            i = n.getToken(!0, !0);
        if (i.isAtRule("@media") && n.parseMediaRule(i, t)) {
            var r = t.cssRules[0];
            return this.cssRules = r.cssRules, this.media = r.media, void(this.parsedCssText = r.parsedCssText)
        }
        throw DOMException.SYNTAX_ERR
    }
}, jscsspStyleRule.prototype = {
    cssText: function() {
        var e = this.mSelectorText + " {\n",
            t = gTABS;
        gTABS += "  ";
        for (var n = 0; n < this.declarations.length; n++) {
            var i = this.declarations[n].cssText();
            i && (e += gTABS + this.declarations[n].cssText() + "\n")
        }
        return gTABS = t, e + gTABS + "}"
    },
    setCssText: function(e) {
        var t = {
                cssRules: []
            },
            n = new CSSParser(e),
            i = n.getToken(!0, !0);
        if (!i.isNotNull() && n.parseStyleRule(i, t, !1)) {
            var r = t.cssRules[0];
            return this.mSelectorText = r.mSelectorText, this.declarations = r.declarations, void(this.parsedCssText = r.parsedCssText)
        }
        throw DOMException.SYNTAX_ERR
    },
    selectorText: function() {
        return this.mSelectorText
    },
    setSelectorText: function(e) {
        var t = new CSSParser(e),
            n = t.getToken(!0, !0);
        if (!n.isNotNull()) {
            var i = t.parseSelector(n, !0);
            if (i) return void(this.mSelectorText = i.selector)
        }
        throw DOMException.SYNTAX_ERR
    }
}, jscsspPageRule.prototype = {
    cssText: function() {
        var e = gTABS + "@page " + (this.pageSelector ? this.pageSelector + " " : "") + "{\n",
            t = gTABS;
        gTABS += "  ";
        for (var n = 0; n < this.declarations.length; n++) e += gTABS + this.declarations[n].cssText() + "\n";
        return gTABS = t, e + gTABS + "}"
    },
    setCssText: function(e) {
        var t = {
                cssRules: []
            },
            n = new CSSParser(e),
            i = n.getToken(!0, !0);
        if (i.isAtRule("@page") && n.parsePageRule(i, t)) {
            var r = t.cssRules[0];
            return this.pageSelector = r.pageSelector, this.declarations = r.declarations, void(this.parsedCssText = r.parsedCssText)
        }
        throw DOMException.SYNTAX_ERR
    }
}, jscsspVariablesRule.prototype = {
    cssText: function() {
        var e = gTABS + "@variables " + (this.media.length ? this.media.join(", ") + " " : "") + "{\n",
            t = gTABS;
        gTABS += "  ";
        for (var n = 0; n < this.declarations.length; n++) e += gTABS + this.declarations[n].cssText() + "\n";
        return gTABS = t, e + gTABS + "}"
    },
    setCssText: function(e) {
        var t = {
                cssRules: []
            },
            n = new CSSParser(e),
            i = n.getToken(!0, !0);
        if (i.isAtRule("@variables") && n.parseVariablesRule(i, t)) {
            var r = t.cssRules[0];
            return this.declarations = r.declarations, void(this.parsedCssText = r.parsedCssText)
        }
        throw DOMException.SYNTAX_ERR
    }
};
var kJscsspINHERIT_VALUE = 0,
    kJscsspPRIMITIVE_VALUE = 1,
    kJscsspVARIABLE_VALUE = 4;
jscsspVariable.prototype = {
        cssText: function() {
            return this.type == kJscsspVARIABLE_VALUE ? this.resolveVariable(this.name, this.parentRule, this.parentStyleSheet) : this.value
        },
        setCssText: function(e) {
            if (this.type == kJscsspVARIABLE_VALUE) throw DOMException.SYNTAX_ERR;
            this.value = e
        },
        resolveVariable: function(e, t, n) {
            return e.toLowerCase() in n.variables ? n.variables[e.toLowerCase()] : null
        }
    },
    function(e) {
        var t = {
            _ie: function() {
                for (var e, t = 3, n = document.createElement("div"), i = n.getElementsByTagName("i"); n.innerHTML = "<!--[if gt IE " + ++t + "]><i></i><![endif]-->", i[0];);
                return t > 4 ? t : e
            }(),
            _svg_cache: {},
            _create_svg_element: function(e, t) {
                var n = "http://www.w3.org/2000/svg",
                    i = document.createElementNS(n, e);
                for (key in t) i.setAttributeNS(null, key, t[key]);
                return i
            },
            _create_svg: function(e, t) {
                var n = "http://www.w3.org/2000/svg",
                    i = document.createElementNS(n, "svg");
                i.setAttributeNS(null, "width", "0"), i.setAttributeNS(null, "height", "0"), i.setAttributeNS(null, "style", "position:absolute");
                var r = document.createElementNS(n, "filter");
                r.setAttributeNS(null, "id", e), i.appendChild(r);
                for (var s = 0; s < t.length; s++) r.appendChild(t[s]);
                return i
            },
            _pending_stylesheets: 0,
            _stylesheets: [],
            _development_mode: function() {
                return "localhost" === location.hostname || -1 !== location.hostname.search(/.local$/) || -1 !== location.hostname.search(/\d+\.\d+\.\d+\.\d+/) ? (e.console && console.log("Detected localhost or IP address. Assuming you are a developer. Caching of stylesheets is disabled."), !0) : (e.console && console.log("Caching of stylesheets is enabled. You need to refresh twice to see any changes."), !1)
            }(),
            // process_stylesheets: function() {
            //     var n = [];
            //     e.setTimeout(function() {
            //         if (e.XMLHttpRequest) var t = new XMLHttpRequest;
            //         else if (e.ActiveXObject) var t = new ActiveXObject("Microsoft.XMLHTTP");
            //         t.open("GET", e.polyfilter_scriptpath + "htc/sepia.htc", !0), t.onreadystatechange = function() {
            //             4 == n.readyState && 200 != n.status && alert('The configured path \r\rvar polyfilter_scriptpath = "' + e.polyfilter_scriptpath + '"\r\rseems wrong!\r\rConfigure the polyfill\'s correct absolute(!) script path before referencing the css-filters-polyfill.js, like so:\r\rvar polyfilter_scriptpath = "/js/css-filters-polyfill/";\r\rLeaving IE dead in the water is no option. You damn Mac user... ;)')
            //         };
            //         try {
            //             t.send(null)
            //         } catch (i) {}
            //     }, 2e3);
            //     for (var i = document.querySelectorAll ? document.querySelectorAll('style,link[rel="stylesheet"]') : document.getElementsByTagName("*"), r = 0; r < i.length; r++) ! function(n) {
            //         switch (i[n].nodeName) {
            //             default: break;
            //             case "STYLE":
            //                     t._stylesheets.push({
            //                     media: i[n].media || "all",
            //                     content: i[n].innerHTML
            //                 });
            //                 break;
            //             case "LINK":
            //                     if ("stylesheet" === i[n].rel) {
            //                     var r = t._stylesheets.length;
            //                     t._stylesheets.push({
            //                         media: i[n].media || "all"
            //                     }), t._pending_stylesheets++;
            //                     var s = i[n].href;
            //                     !t._development_mode && e.localStorage && e.localStorage.getItem("polyfilter_" + s) && (t._pending_stylesheets--, t._stylesheets[r].content = localStorage.getItem("polyfilter_" + s), 0 === t._pending_stylesheets && t.process());
            //                     try {
            //                         if (e.XMLHttpRequest) var o = new XMLHttpRequest;
            //                         else if (e.ActiveXObject) var o = new ActiveXObject("Microsoft.XMLHTTP");
            //                         o.open("GET", s, !0), o.onreadystatechange = function() {
            //                             if (4 === o.readyState)
            //                                 if (0 === o.status) e.console && console.log("Could not fetch external CSS via HTTP-Request " + s + ". Probably because of cross origin."), t._stylesheets[r].content || (t._pending_stylesheets--, t._stylesheets[r].content = o.responseText, 0 === t._pending_stylesheets && t.process());
            //                                 else if (t._stylesheets[r].content || (t._pending_stylesheets--, t._stylesheets[r].content = o.responseText, 0 === t._pending_stylesheets && t.process()), !t._development_mode && e.localStorage) try {
            //                                 e.localStorage.setItem("polyfilter_" + s, t._stylesheets[r].content)
            //                             } catch (n) {
            //                                 e.console && console.log("Local storage quota have been exceeded. Caching of stylesheet " + s + " is not possible")
            //                             }
            //                         };
            //                         try {
            //                             o.send(null)
            //                         } catch (a) {
            //                             e.console && console.log("Could not fetch external CSS via HTTP-Request " + s + ". Are you maybe testing using the file://-protocol?"), t._stylesheets[r].content || (t._pending_stylesheets--, 0 === t._pending_stylesheets && t.process())
            //                         }
            //                     } catch (a) {}
            //                 }
            //         }
            //     }(r);
            //     0 === this._pending_stylesheets && this.process()
            // },
            _processDeclarations: function(e) {
                var n = "";
                for (var i in e.declarations) {
                    var r = e.declarations[i];
                    if ("filter" === r.property) {
                        if (document.querySelectorAll)
                            for (var s = document.querySelectorAll(e.mSelectorText), i = 0; i < s.length; i++) s[i].style.polyfilterStore = r.valueText;
                        var o = r.valueText,
                            a = o.split(/\)\s+/),
                            l = {
                                filtersW3C: [],
                                filtersWebKit: [],
                                filtersSVG: [],
                                filtersIE: [],
                                behaviorsIE: []
                            };
                        for (idx in a) {
                            var u = a[idx] + ")";
                            currentproperties = t.convert(u);
                            for (key in currentproperties) "undefined" != typeof l[key] && (l[key] = l[key].concat(currentproperties[key]))
                        }
                        if (n += e.mSelectorText + "{", l.filtersW3C.length > 0) {
                            {
                                webkitFilter = mozFilter = oFilter = msFilter = l.filtersW3C.join(" ")
                            }
                            l.filtersWebKit && l.filtersWebKit.length > 0 && (webkitFilter = l.filtersWebKit.join(" ")), "undefined" == typeof this._ie && (n += "-ms-filter:" + msFilter + ";"), n += "-webkit-filter:" + webkitFilter + ";", n += "-moz-filter:" + mozFilter + ";", n += "-o-filter:" + oFilter + ";"
                        }
                        if (l.filtersSVG.length > 0)
                            if ("none" != l.filtersSVG[0]) {
                                var c = o.replace(/[^a-z0-9]/g, "");
                                if ("undefined" == typeof this._svg_cache[c])
                                    if (this._svg_cache[c] = this._create_svg(c, l.filtersSVG), "undefined" == typeof XMLSerializer) document.body.appendChild(this._svg_cache[c]);
                                    else {
                                        var p = new XMLSerializer,
                                            d = p.serializeToString(this._svg_cache[c]); - 1 != d.search("SourceGraphic") && document.body.appendChild(this._svg_cache[c])
                                    }
                                if ("undefined" == typeof XMLSerializer) n += "filter: url(#" + c + ")";
                                else {
                                    var p = new XMLSerializer,
                                        d = p.serializeToString(this._svg_cache[c]);
                                    n += -1 != d.search("SourceGraphic") ? "filter: url(#" + c + ")" : "filter: url('data:image/svg+xml;utf8," + d + "#" + c + "')"
                                }
                            } else n += "filter: none;";
                        if ("undefined" != typeof this._ie) {
                            if (l.filtersIE.length > 0) {
                                var h = l.filtersIE.join(" ");
                                n += "filter:" + h + ";"
                            }
                            if (l.behaviorsIE.length > 0) {
                                var f = l.behaviorsIE.join(" ");
                                n += "behavior:" + f + ";"
                            }
                        }
                        n += "}\r\n"
                    }
                }
                return n
            },

            process: function() {
                for (var e = new CSSParser, n = 0; n < this._stylesheets.length; n++) {
                    var i = "",
                        r = e.parse(this._stylesheets[n].content, !1, !0);
                    if (null !== r)
                        for (var s in r.cssRules) {
                            var o = r.cssRules[s];
                            switch (o.type) {
                                default: break;
                                case 1:
                                        i += this._processDeclarations(o);
                                    break;
                                case 4:
                                        i += "@media " + o.media.join(",") + "{";
                                    for (var a in o.cssRules) {
                                        var l = o.cssRules[a];
                                        i += this._processDeclarations(l)
                                    }
                                    i += "}"
                            }
                        }
                    var u = document.createElement("style");
                    u.setAttribute("media", this._stylesheets[n].media), "undefined" == typeof t._ie ? (u.innerHTML = i, document.getElementsByTagName("head")[0].appendChild(u)) : (document.getElementsByTagName("head")[0].appendChild(u), u.styleSheet.cssText = i)
                }
            },
            init: function() {
                Object.defineProperty && Object.defineProperty(CSSStyleDeclaration.prototype, "polyfilter", {
                    get: function() {
                        return this.polyfilterStore
                    },
                    set: function(e) {
                        values = e.split(/\)\s+/);
                        var n = {
                            filtersW3C: [],
                            filtersWebKit: [],
                            filtersSVG: [],
                            filtersIE: [],
                            behaviorsIE: []
                        };
                        for (idx in values) {
                            var i = values[idx] + ")";
                            currentproperties = t.convert(i);
                            for (key in currentproperties) "undefined" != typeof n[key] && (n[key] = n[key].concat(currentproperties[key]))
                        }
                        if (n.filtersW3C.length > 0 && ("undefined" == typeof t._ie && (this.msFilter = n.filtersW3C.join(" ")), this.webkitFilter = this.mozFilter = this.oFilter = n.filtersW3C.join(" ")), n.filtersWebKit.length > 0 && (this.webkitFilter = n.filtersWebKit.join(" ")), n.filtersSVG.length > 0)
                            if ("none" != n.filtersSVG[0]) {
                                var r = e.replace(/[^a-z0-9]/g, "");
                                if ("undefined" == typeof t._svg_cache[r])
                                    if (t._svg_cache[r] = t._create_svg(r, n.filtersSVG), "undefined" == typeof XMLSerializer) document.body.appendChild(t._svg_cache[r]);
                                    else {
                                        var s = new XMLSerializer,
                                            o = s.serializeToString(t._svg_cache[r]); - 1 != o.search("SourceGraphic") && document.body.appendChild(t._svg_cache[r])
                                    }
                                if ("undefined" == typeof XMLSerializer) this.filter = "url(#" + r + ")";
                                else {
                                    var s = new XMLSerializer,
                                        o = s.serializeToString(t._svg_cache[r]);
                                    this.filter = -1 != o.search("SourceGraphic") ? "url(#" + r + ")" : "url('data:image/svg+xml;utf8," + o + "#" + r + "')"
                                }
                            } else this.filter = "none";
                            "undefined" != typeof t._ie && (this.filter = n.filtersIE.length > 0 ? n.filtersIE.join(" ") : "", this.behavior = n.behaviorsIE.length > 0 ? n.behaviorsIE.join(" ") : ""), this.polyfilterStore = e
                    }
                })
            },
            convert: function(e) {
                var t = e.match(/none/i);
                if (null !== t) var n = this.filters.none();
                var t = e.match(/(grayscale)\(([0-9\.]+)\)/i);
                if (null !== t) var i = parseFloat(t[2], 10),
                    n = this.filters.grayscale(i);
                var t = e.match(/(sepia)\(([0-9\.]+)\)/i);
                if (null !== t) var i = parseFloat(t[2], 10),
                    n = this.filters.sepia(i);
                var t = e.match(/(blur)\(([0-9]+)[px]*\)/i);
                if (null !== t) var i = parseInt(t[2], 10),
                    n = this.filters.blur(i);
                var t = e.match(/(invert)\(([0-9\.]+)\)/i);
                if (null !== t) var i = parseFloat(t[2], 10),
                    n = this.filters.invert(i);
                var t = e.match(/(brightness)\(([0-9\.]+)%\)/i);
                if (null !== t) var i = parseFloat(t[2], 10),
                    n = this.filters.brightness(i);
                var t = e.match(/(drop\-shadow)\(([0-9]+)[px]*\s+([0-9]+)[px]*\s+([0-9]+)[px]*\s+([#0-9]+)\)/i);
                if (null !== t) var r = parseInt(t[2], 10),
                    s = parseInt(t[3], 10),
                    o = parseInt(t[4], 10),
                    a = t[5],
                    n = this.filters.dropShadow(r, s, o, a);
                return n
            },
            filters: {
                none: function() {
                    var e = {};
                    return "undefined" == typeof t._ie ? (e.filtersW3C = ["none"], e.filtersSVG = ["none"]) : e.filtersIE = ["none"], e
                },
                grayscale: function(e) {
                    e = e || 0;
                    var n = {};
                    if ("undefined" == typeof t._ie) {
                        n.filtersW3C = ["grayscale(" + e + ")"];
                        var i = t._create_svg_element("feColorMatrix", {
                            type: "matrix",
                            values: .2126 + .7874 * (1 - e) + " " + (.7152 - .7152 * (1 - e)) + " " + (.0722 - .0722 * (1 - e)) + " 0 0 " + (.2126 - .2126 * (1 - e)) + " " + (.7152 + .2848 * (1 - e)) + " " + (.0722 - .0722 * (1 - e)) + " 0 0 " + (.2126 - .2126 * (1 - e)) + " " + (.7152 - .7152 * (1 - e)) + " " + (.0722 + .9278 * (1 - e)) + " 0 0 0 0 0 1 0"
                        });
                        n.filtersSVG = [i]
                    } else n.filtersIE = e >= .5 ? ["gray"] : [];
                    return n
                },
                sepia: function(e) {
                    e = e || 0;
                    var n = {};
                    if ("undefined" == typeof t._ie) {
                        n.filtersW3C = ["sepia(" + e + ")"];
                        var i = t._create_svg_element("feColorMatrix", {
                            type: "matrix",
                            values: .393 + .607 * (1 - e) + " " + (.769 - .769 * (1 - e)) + " " + (.189 - .189 * (1 - e)) + " 0 0 " + (.349 - .349 * (1 - e)) + " " + (.686 + .314 * (1 - e)) + " " + (.168 - .168 * (1 - e)) + " 0 0 " + (.272 - .272 * (1 - e)) + " " + (.534 - .534 * (1 - e)) + " " + (.131 + .869 * (1 - e)) + " 0 0 0 0 0 1 0"
                        });
                        n.filtersSVG = [i]
                    } else n.filtersIE = e >= .5 ? ["gray", "progid:DXImageTransform.Microsoft.Light()"] : [], n.behaviorsIE = e >= .5 ? ['url("' + t.scriptpath + 'htc/sepia.htc")'] : [];
                    return n
                },
                blur: function(e) {
                    e = Math.round(e) || 0;
                    var n = {};
                    if ("undefined" == typeof t._ie) {
                        n.filtersW3C = ["blur(" + e + "px)"];
                        var i = t._create_svg_element("feGaussianBlur", {
                            "in": "SourceGraphic",
                            stdDeviation: e
                        });
                        n.filtersSVG = [i]
                    } else n.filtersIE = ["progid:DXImageTransform.Microsoft.Blur(pixelradius=" + e + ")"];
                    return n
                },
                invert: function(e) {
                    e = e || 0;
                    var n = {};
                    if ("undefined" == typeof t._ie) {
                        n.filtersW3C = ["invert(" + e + ")"];
                        var i = t._create_svg_element("feComponentTransfer", {}),
                            r = t._create_svg_element("feFuncR", {
                                type: "table",
                                tableValues: e + " " + (1 - e)
                            });
                        i.appendChild(r);
                        var r = t._create_svg_element("feFuncG", {
                            type: "table",
                            tableValues: e + " " + (1 - e)
                        });
                        i.appendChild(r);
                        var r = t._create_svg_element("feFuncB", {
                            type: "table",
                            tableValues: e + " " + (1 - e)
                        });
                        i.appendChild(r), n.filtersSVG = [i]
                    } else n.filtersIE = e >= .5 ? ["invert"] : [];
                    return n
                },
                brightness: function(e) {
                    e = e || 0;
                    var n = {};
                    if ("undefined" == typeof t._ie) {
                        n.filtersW3C = ["brightness(" + e + "%)"], n.filtersWebKit = ["brightness(" + (e - 100) + "%)"];
                        var i = t._create_svg_element("feComponentTransfer", {}),
                            r = t._create_svg_element("feFuncR", {
                                type: "linear",
                                slope: e / 100
                            });
                        i.appendChild(r);
                        var r = t._create_svg_element("feFuncG", {
                            type: "linear",
                            slope: e / 100
                        });
                        i.appendChild(r);
                        var r = t._create_svg_element("feFuncB", {
                            type: "linear",
                            slope: e / 100
                        });
                        i.appendChild(r), n.filtersSVG = [i]
                    } else n.filtersIE = ["progid:DXImageTransform.Microsoft.Light()"], n.behaviorsIE = ['url("' + t.scriptpath + 'htc/brightness.htc")'];
                    return n
                },
                dropShadow: function(e, n, i, r) {
                    e = Math.round(e) || 0, n = Math.round(n) || 0, i = Math.round(i) || 0, r = r || "#000000";
                    var s = {};
                    if ("undefined" == typeof t._ie) {
                        s.filtersW3C = ["drop-shadow(" + e + "px " + n + "px " + i + "px " + r + ")"];
                        var o = t._create_svg_element("feGaussianBlur", {
                                "in": "SourceAlpha",
                                stdDeviation: i
                            }),
                            a = t._create_svg_element("feOffset", {
                                dx: e + 1,
                                dy: n + 1,
                                result: "offsetblur"
                            }),
                            l = t._create_svg_element("feFlood", {
                                "flood-color": r
                            }),
                            u = t._create_svg_element("feComposite", {
                                in2: "offsetblur",
                                operator: "in"
                            }),
                            c = t._create_svg_element("feMerge", {}),
                            p = t._create_svg_element("feMergeNode", {});
                        c.appendChild(p);
                        var p = t._create_svg_element("feMergeNode", {
                            "in": "SourceGraphic"
                        });
                        c.appendChild(p), s.filtersSVG = [o, a, l, u, c]
                    } else s.filtersIE = ["progid:DXImageTransform.Microsoft.Glow(color=" + r + ",strength=0)", "progid:DXImageTransform.Microsoft.Shadow(color=" + r + ",strength=0)"], s.behaviorsIE = ['url("' + t.scriptpath + 'htc/drop-shadow.htc")'];
                    return s
                }
            }
        };
        e.jQuery ? e.jQuery(document).ready(function() {
            t.process_stylesheets()
        }) : e.contentLoaded ? contentLoaded(e, function() {
            t.process_stylesheets()
        }) : e.addEventListener ? document.addEventListener("DOMContentLoaded", function() {
            t.process_stylesheets()
        }, !1) : e.attachEvent && e.attachEvent("onload", function() {
            t.process_stylesheets()
        }), t.init()
    }(window);
var ModalEffects = function() {
    function e() {
        var e = document.querySelector(".md-overlay");
        [].slice.call(document.querySelectorAll(".md-trigger")).forEach(function(t) {
            function n(e) {
                classie.remove(r, "md-show"), e && classie.remove(document.documentElement, "md-perspective")
            }

            function i() {
                n(classie.has(t, "md-setperspective"))
            }
            var r = document.querySelector("#" + t.getAttribute("data-modal")),
                s = r.querySelector(".md-close");
            t.addEventListener("click", function() {
                classie.add(r, "md-show"), e.removeEventListener("click", i), e.addEventListener("click", i), classie.has(t, "md-setperspective") && setTimeout(function() {
                    classie.add(document.documentElement, "md-perspective")
                }, 25)
            }), s.addEventListener("click", function(e) {
                e.stopPropagation(), i()
            })
        })
    }
    e()
}();
! function(e, t) {
    "function" == typeof define && define.amd ? define(t) : "object" == typeof exports ? module.exports = t() : e.NProgress = t()
}(this, function() {
    function e(e, t, n) {
        return t > e ? t : e > n ? n : e
    }

    function t(e) {
        return 100 * (-1 + e)
    }

    function n(e, n, i) {
        var r;
        return r = "translate3d" === u.positionUsing ? {
            transform: "translate3d(" + t(e) + "%,0,0)"
        } : "translate" === u.positionUsing ? {
            transform: "translate(" + t(e) + "%,0)"
        } : {
            "margin-left": t(e) + "%"
        }, r.transition = "all " + n + "ms " + i, r
    }

    function i(e, t) {
        var n = "string" == typeof e ? e : o(e);
        return n.indexOf(" " + t + " ") >= 0
    }

    function r(e, t) {
        var n = o(e),
            r = n + t;
        i(n, t) || (e.className = r.substring(1))
    }

    function s(e, t) {
        var n, r = o(e);
        i(e, t) && (n = r.replace(" " + t + " ", " "), e.className = n.substring(1, n.length - 1))
    }

    function o(e) {
        return (" " + (e.className || "") + " ").replace(/\s+/gi, " ")
    }

    function a(e) {
        e && e.parentNode && e.parentNode.removeChild(e)
    }
    var l = {};
    l.version = "0.1.6";
    var u = l.settings = {
        minimum: .08,
        easing: "ease",
        positionUsing: "",
        speed: 200,
        trickle: !0,
        trickleRate: .02,
        trickleSpeed: 800,
        showSpinner: !0,
        barSelector: '[role="bar"]',
        spinnerSelector: '[role="spinner"]',
        parent: "body",
        template: '<div class="bar" role="bar"><div class="peg"></div></div><div class="spinner" role="spinner"><div class="spinner-icon"></div></div>'
    };
    l.configure = function(e) {
            var t, n;
            for (t in e) n = e[t], void 0 !== n && e.hasOwnProperty(t) && (u[t] = n);
            return this
        }, l.status = null, l.set = function(t) {
            var i = l.isStarted();
            t = e(t, u.minimum, 1), l.status = 1 === t ? null : t;
            var r = l.render(!i),
                s = r.querySelector(u.barSelector),
                o = u.speed,
                a = u.easing;
            return r.offsetWidth, c(function(e) {
                "" === u.positionUsing && (u.positionUsing = l.getPositioningCSS()), p(s, n(t, o, a)), 1 === t ? (p(r, {
                    transition: "none",
                    opacity: 1
                }), r.offsetWidth, setTimeout(function() {
                    p(r, {
                        transition: "all " + o + "ms linear",
                        opacity: 0
                    }), setTimeout(function() {
                        l.remove(), e()
                    }, o)
                }, o)) : setTimeout(e, o)
            }), this
        }, l.isStarted = function() {
            return "number" == typeof l.status
        }, l.start = function() {
            l.status || l.set(0);
            var e = function() {
                setTimeout(function() {
                    l.status && (l.trickle(), e())
                }, u.trickleSpeed)
            };
            return u.trickle && e(), this
        }, l.done = function(e) {
            return e || l.status ? l.inc(.3 + .5 * Math.random()).set(1) : this
        }, l.inc = function(t) {
            var n = l.status;
            return n ? ("number" != typeof t && (t = (1 - n) * e(Math.random() * n, .1, .95)), n = e(n + t, 0, .994), l.set(n)) : l.start()
        }, l.trickle = function() {
            return l.inc(Math.random() * u.trickleRate)
        },
        function() {
            var e = 0,
                t = 0;
            l.promise = function(n) {
                return n && "resolved" != n.state() ? (0 == t && l.start(), e++, t++, n.always(function() {
                    t--, 0 == t ? (e = 0, l.done()) : l.set((e - t) / e)
                }), this) : this
            }
        }(), l.render = function(e) {
            if (l.isRendered()) return document.getElementById("nprogress");
            r(document.documentElement, "nprogress-busy");
            var n = document.createElement("div");
            n.id = "nprogress", n.innerHTML = u.template;
            var i, s = n.querySelector(u.barSelector),
                o = e ? "-100" : t(l.status || 0),
                c = document.querySelector(u.parent);
            return p(s, {
                transition: "all 0 linear",
                transform: "translate3d(" + o + "%,0,0)"
            }), u.showSpinner || (i = n.querySelector(u.spinnerSelector), i && a(i)), c != document.body && r(c, "nprogress-custom-parent"), c.appendChild(n), n
        }, l.remove = function() {
            s(document.documentElement, "nprogress-busy"), s(document.querySelector(u.parent), "nprogress-custom-parent");
            var e = document.getElementById("nprogress");
            e && a(e)
        }, l.isRendered = function() {
            return !!document.getElementById("nprogress")
        }, l.getPositioningCSS = function() {
            var e = document.body.style,
                t = "WebkitTransform" in e ? "Webkit" : "MozTransform" in e ? "Moz" : "msTransform" in e ? "ms" : "OTransform" in e ? "O" : "";
            return t + "Perspective" in e ? "translate3d" : t + "Transform" in e ? "translate" : "margin"
        };
    var c = function() {
            function e() {
                var n = t.shift();
                n && n(e)
            }
            var t = [];
            return function(n) {
                t.push(n), 1 == t.length && e()
            }
        }(),
        p = function() {
            function e(e) {
                return e.replace(/^-ms-/, "ms-").replace(/-([\da-z])/gi, function(e, t) {
                    return t.toUpperCase()
                })
            }

            function t(e) {
                var t = document.body.style;
                if (e in t) return e;
                for (var n, i = r.length, s = e.charAt(0).toUpperCase() + e.slice(1); i--;)
                    if (n = r[i] + s, n in t) return n;
                return e
            }

            function n(n) {
                return n = e(n), s[n] || (s[n] = t(n))
            }

            function i(e, t, i) {
                t = n(t), e.style[t] = i
            }
            var r = ["Webkit", "O", "Moz", "ms"],
                s = {};
            return function(e, t) {
                var n, r, s = arguments;
                if (2 == s.length)
                    for (n in t) r = t[n], void 0 !== r && t.hasOwnProperty(n) && i(e, n, r);
                else i(e, s[1], s[2])
            }
        }();
    return l
}),
function() {
    this.GoogleAnalytics = function() {
        function e() {}
        return e.load = function() {
            var t, n;
            return window._gaq = [], window._gaq.push(["_setAccount", e.analyticsId()]), n = document.createElement("script"), n.type = "text/javascript", n.async = !0, n.src = ("https:" === document.location.protocol ? "https://ssl" : "http://www") + ".google-analytics.com/ga.js", t = document.getElementsByTagName("script")[0], t.parentNode.insertBefore(n, t), "undefined" != typeof Turbolinks && Turbolinks.supported ? document.addEventListener("page:change", function() {
                return e.trackPageview()
            }, !0) : e.trackPageview()
        }, e.trackPageview = function(t) {
            return e.isLocalRequest() ? void 0 : (window._gaq.push(t ? ["_trackPageview", t] : ["_trackPageview"]), window._gaq.push(["_trackPageLoadTime"]))
        }, e.isLocalRequest = function() {
            return e.documentDomainIncludes("local")
        }, e.documentDomainIncludes = function(e) {
            return -1 !== document.domain.indexOf(e)
        }, e.analyticsId = function() {
            return "UA-50334106-1"
        }, e
    }(), GoogleAnalytics.load()
}.call(this), $(window).bind("scroll", function() {
    $(window).scrollTop() >= 50 ? $("#top-navigation").addClass("hidden") : $("#top-navigation").removeClass("hidden")
}), $(window).bind("scroll", function() {
    var e = $("#about").offset().top,
        t = $("#about").hasClass("without-menu") ? 0 : 72;
    $(window).scrollTop() >= e - t ? ($("#floating-navigation").addClass("fixed"), $("#about").addClass("without-menu")) : ($("#floating-navigation").removeClass("fixed"), $("#about").removeClass("without-menu"))
}), NProgress.configure({
    showSpinner: !1
}), $(document).on("page:fetch", function() {
    console.log("Start fetching..."), NProgress.start()
}), $(document).on("page:change", function() {
    console.log("Done fetching..."), NProgress.done()
}), $(document).on("page:restore", function() {
    console.log("Restoring..."), NProgress.remove()
});
