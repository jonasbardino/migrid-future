function inherit(e, t) {
    "use strict";
    var i = function() {};
    i.prototype = t.prototype, e.prototype = new i, e.uber = t.prototype, e.prototype.constructor = e
}
if ("undefined" == typeof ogs) var ogs = {};
ogs.namespace = function(e) {
    "use strict";
    var t, i = e.split("."),
        r = ogs;
    for ("ogs" === i[0] && (i = i.slice(1)), t = 0; t < i.length; t += 1) "undefined" == typeof r[i[t]] && (r[i[t]] = {}), r = r[i[t]];
    return r
};
var vgl = ogs.namespace("gl");
Object.size = function(e) {
    "use strict";
    var t = 0,
        i = null;
    for (i in e) e.hasOwnProperty(i) && t++;
    return t
}, vgl.GL = {
    ColorBufferBit: 16384,
    DepthBufferBit: 256
};
var m_globalModifiedTime = 0;
vgl.timestamp = function() {
    "use strict";
    if (!(this instanceof vgl.timestamp)) return new vgl.timestamp;
    var e = 0;
    this.modified = function() {
        ++m_globalModifiedTime, e = m_globalModifiedTime
    }, this.getMTime = function() {
        return e
    }
}, vgl.object = function() {
    "use strict";
    if (!(this instanceof vgl.object)) return new vgl.object;
    var e = vgl.timestamp();
    return e.modified(), this.modified = function() {
        e.modified()
    }, this.getMTime = function() {
        return e.getMTime()
    }, this
}, vgl.event = function() {
    "use strict";
    return this instanceof vgl.event ? (vgl.object.call(this), this) : new vgl.event
}, inherit(vgl.event, vgl.object), vgl.event.keyPress = "vgl.event.keyPress", vgl.event.mousePress = "vgl.event.mousePress", vgl.event.mouseRelease = "vgl.event.mouseRelease", vgl.event.contextMenu = "vgl.event.contextMenu", vgl.event.configure = "vgl.event.configure", vgl.event.enable = "vgl.event.enable", vgl.event.mouseWheel = "vgl.event.mouseWheel", vgl.event.keyRelease = "vgl.event.keyRelease", vgl.event.middleButtonPress = "vgl.event.middleButtonPress", vgl.event.startInteraction = "vgl.event.startInteraction", vgl.event.enter = "vgl.event.enter", vgl.event.rightButtonPress = "vgl.event.rightButtonPress", vgl.event.middleButtonRelease = "vgl.event.middleButtonRelease", vgl.event.char = "vgl.event.char", vgl.event.disable = "vgl.event.disable", vgl.event.endInteraction = "vgl.event.endInteraction", vgl.event.mouseMove = "vgl.event.mouseMove", vgl.event.mouseOut = "vgl.event.mouseOut", vgl.event.expose = "vgl.event.expose", vgl.event.timer = "vgl.event.timer", vgl.event.leftButtonPress = "vgl.event.leftButtonPress", vgl.event.leave = "vgl.event.leave", vgl.event.rightButtonRelease = "vgl.event.rightButtonRelease", vgl.event.leftButtonRelease = "vgl.event.leftButtonRelease", vgl.event.click = "vgl.event.click", vgl.event.dblClick = "vgl.event.dblClick", vgl.boundingObject = function() {
    "use strict";
    if (!(this instanceof vgl.boundingObject)) return new vgl.boundingObject;
    vgl.object.call(this);
    var e = [0, 0, 0, 0, 0, 0],
        t = vgl.timestamp(),
        i = vgl.timestamp();
    return t.modified(), i.modified(), this.bounds = function() {
        return e
    }, this.hasValidBounds = function(e) {
        return e[0] == Number.MAX_VALUE || e[1] == -Number.MAX_VALUE || e[2] == Number.MAX_VALUE || e[3] == -Number.MAX_VALUE || e[4] == Number.MAX_VALUE || e[5] == -Number.MAX_VALUE ? !1 : !0
    }, this.setBounds = function(i, r, n, o, a, l) {
        return this.hasValidBounds([i, r, n, o, a, l]) ? (e[0] = i, e[1] = r, e[2] = n, e[3] = o, e[4] = a, e[5] = l, this.modified(), t.modified(), !0) : void 0
    }, this.resetBounds = function() {
        e[0] = Number.MAX_VALUE, e[1] = -Number.MAX_VALUE, e[2] = Number.MAX_VALUE, e[3] = -Number.MAX_VALUE, e[4] = Number.MAX_VALUE, e[5] = -Number.MAX_VALUE, this.modified()
    }, this.computeBounds = function() {}, this.computeBoundsTimestamp = function() {
        return t
    }, this.boundsDirtyTimestamp = function() {
        return i
    }, this.resetBounds(), this
}, vgl.boundingObject.ReferenceFrame = {
    Relative: 0,
    Absolute: 1
}, inherit(vgl.boundingObject, vgl.object), vgl.node = function() {
    "use strict";
    if (!(this instanceof vgl.node)) return new vgl.node;
    vgl.boundingObject.call(this);
    var e = null,
        t = null,
        i = !0,
        r = !1;
    return this.accept = function(e) {
        e.visit(this)
    }, this.material = function() {
        return t
    }, this.setMaterial = function(e) {
        return e !== t ? (t = e, this.modified(), !0) : !1
    }, this.visible = function() {
        return i
    }, this.setVisible = function(e) {
        return e !== i ? (i = e, this.modified(), !0) : !1
    }, this.parent = function() {
        return e
    }, this.setParent = function(t) {
        return t !== e ? (null !== e && e.removeChild(this), e = t, this.modified(), !0) : !1
    }, this.overlay = function() {
        return r
    }, this.setOverlay = function(e) {
        return r !== e ? (r = e, this.modified(), !0) : !1
    }, this.ascend = function() {}, this.traverse = function() {}, this.boundsModified = function() {
        this.boundsDirtyTimestamp().modified(), null !== e && e.boundsModified()
    }, this
}, inherit(vgl.node, vgl.boundingObject), vgl.groupNode = function() {
    "use strict";
    if (!(this instanceof vgl.groupNode)) return new vgl.groupNode;
    vgl.node.call(this);
    var e = [];
    return this.b_setVisible = this.setVisible, this.setVisible = function(t) {
        var i;
        if (this.b_setVisible(t) !== !0) return !1;
        for (i = 0; i < e.length; ++i) e[i].setVisible(t);
        return !0
    }, this.addChild = function(t) {
        return t instanceof vgl.node && -1 === e.indexOf(t) ? (t.setParent(this), e.push(t), this.boundsDirtyTimestamp().modified(), !0) : !1
    }, this.removeChild = function(t) {
        if (t.parent() === this) {
            var i = e.indexOf(t);
            return e.splice(i, 1), this.boundsDirtyTimestamp().modified(), !0
        }
    }, this.removeChildren = function() {
        var t;
        for (t = 0; t < e.length; ++t) this.removeChild(e[t]);
        this.modified()
    }, this.children = function() {
        return e
    }, this.hasChild = function(t) {
        var i = 0,
            r = !1;
        for (i = 0; i < e.length; i++)
            if (e[i] === t) {
                r = !0;
                break
            }
        return r
    }, this.accept = function(e) {
        e.visit(this)
    }, this.traverse = function(e) {
        switch (e.type()) {
            case e.UpdateVisitor:
                this.traverseChildrenAndUpdateBounds(e);
                break;
            case e.CullVisitor:
                this.traverseChildren(e)
        }
    }, this.traverseChildrenAndUpdateBounds = function(t) {
        var i;
        if (this.m_parent && this.boundsDirtyTimestamp().getMTime() > this.computeBoundsTimestamp().getMTime() && this.m_parent.boundsDirtyTimestamp.modified(), this.computeBounds(), t.mode() === t.TraverseAllChildren)
            for (i = 0; i < e.length(); ++i) e[i].accept(t), this.updateBounds(e[i]);
        this.computeBoundsTimestamp().modified()
    }, this.traverseChildren = function(t) {
        var i;
        if (t.mode() === vgl.vesVisitor.TraverseAllChildren)
            for (i = 0; i < e.length(); ++i) e[i].accept(t)
    }, this.computeBounds = function() {
        var t = 0;
        if (!(this.computeBoundsTimestamp().getMTime() > this.boundsDirtyTimestamp().getMTime()))
            for (t = 0; t < e.length; ++t) this.updateBounds(e[t])
    }, this.updateBounds = function(e) {
        if (!e.overlay()) {
            e.computeBounds();
            var t, i = this.bounds(),
                r = e.bounds(),
                n = 0,
                o = 0;
            for (t = 0; 3 > t; ++t) n = 2 * t, o = 2 * t + 1, r[n] < i[n] && (i[n] = r[n]), r[o] > i[o] && (i[o] = r[o]);
            this.setBounds(i[0], i[1], i[2], i[3], i[4], i[5])
        }
    }, this
}, inherit(vgl.groupNode, vgl.node), vgl.actor = function() {
    "use strict";
    if (!(this instanceof vgl.actor)) return new vgl.actor;
    vgl.node.call(this);
    var e = mat4.create(),
        t = vgl.boundingObject.ReferenceFrame.Relative,
        i = null;
    return this.matrix = function() {
        return e
    }, this.setMatrix = function(t) {
        t !== e && (e = t, this.modified())
    }, this.referenceFrame = function() {
        return t
    }, this.setReferenceFrame = function(e) {
        return e !== t ? (t = e, this.modified(), !0) : !1
    }, this.mapper = function() {
        return i
    }, this.setMapper = function(e) {
        e !== i && (i = e, this.boundsModified())
    }, this.accept = function() {}, this.ascend = function() {}, this.computeLocalToWorldMatrix = function() {}, this.computeWorldToLocalMatrix = function() {}, this.computeBounds = function() {
        if (null === i || void 0 === i) return void this.resetBounds();
        var t, r, n, o, a = this.computeBoundsTimestamp();
        (this.boundsDirtyTimestamp().getMTime() > a.getMTime() || i.boundsDirtyTimestamp().getMTime() > a.getMTime()) && (i.computeBounds(), t = i.bounds(), r = [t[0], t[2], t[4]], n = [t[1], t[3], t[5]], vec3.transformMat4(r, r, e), vec3.transformMat4(n, n, e), o = [r[0] > n[0] ? n[0] : r[0], r[0] > n[0] ? r[0] : n[0], r[1] > n[1] ? n[1] : r[1], r[1] > n[1] ? r[1] : n[1], r[2] > n[2] ? n[2] : r[2], r[2] > n[2] ? r[2] : n[2]], this.setBounds(o[0], o[1], o[2], o[3], o[4], o[5]), a.modified())
    }, this
}, inherit(vgl.actor, vgl.node), vgl.freezeObject = function(e) {
    "use strict";
    var t = Object.freeze(e);
    return "undefined" == typeof t && (t = function(e) {
        return e
    }), t
}, vgl.defaultValue = function(e, t) {
    "use strict";
    return "undefined" != typeof e ? e : t
}, vgl.defaultValue.EMPTY_OBJECT = vgl.freezeObject({}), vgl.geojsonReader = function() {
    "use strict";
    if (!(this instanceof vgl.geojsonReader)) return new vgl.geojsonReader;
    return this.readScalars = function(e, t, i, r) {
        var n = null,
            o = null,
            a = null,
            l = null,
            s = null;
        "values" === this.m_scalarFormat && 4 === e.length ? (o = e[3], n = t.sourceData(vgl.vertexAttributeKeys.Scalar), n || (n = new vgl.sourceDataSf, this.m_scalarRange && n.setScalarRange(this.m_scalarRange[0], this.m_scalarRange[1]), void 0 !== i && (n.data().length = i), t.addSource(n)), void 0 === i ? n.pushBack(o) : n.insertAt(r, o)) : "rgb" === this.m_scalarFormat && 6 === e.length && (n = t.sourceData(vgl.vertexAttributeKeys.Color), n || (n = new vgl.sourceDataC3fv, void 0 !== i && (n.length = 3 * i), t.addSource(n)), a = e[3], l = e[4], s = e[5], void 0 === i ? n.pushBack([a, l, s]) : n.insertAt(r, [a, l, s]))
    }, this.readPoint = function(e) {
        var t = new vgl.geometryData,
            i = new vgl.points,
            r = new vgl.sourceDataP3fv,
            n = new Uint16Array(1),
            o = null,
            a = null,
            l = null,
            s = null;
        for (t.addSource(r), s = 0; 1 > s; s++) n[s] = s, o = e[0], a = e[1], l = 0, e.length > 2 && (l = e[2]), r.pushBack([o, a, l]), this.readScalars(e, t);
        return i.setIndices(n), t.addPrimitive(i), t.setName("aPoint"), t
    }, this.readMultiPoint = function(e) {
        var t, i = new vgl.geometryData,
            r = new vgl.points,
            n = new vgl.sourceDataP3fv,
            o = new Uint16Array(e.length),
            a = 0,
            l = e.length,
            s = null,
            u = null,
            c = null;
        for (n.data().length = 3 * l, t = 0; t < e.length; t++) o[t] = t, s = e[t][0], u = e[t][1], c = 0, e[t].length > 2 && (c = e[t][2]), n.insertAt(a, [s, u, c]), this.readScalars(e[t], i, l, a), a++;
        return r.setIndices(o), i.addPrimitive(r), i.addSource(n), i.setName("manyPoints"), i
    }, this.readLineString = function(e) {
        var t = new vgl.geometryData,
            i = new vgl.lineStrip,
            r = new vgl.sourceDataP3fv,
            n = [],
            o = null,
            a = null,
            l = null,
            s = null;
        for (i.setIndicesPerPrimitive(e.length), o = 0; o < e.length; o++) n.push(o), a = e[o][0], l = e[o][1], s = 0, e[o].length > 2 && (s = e[o][2]), r.pushBack([a, l, s]), this.readScalars(e[o], t);
        return i.setIndices(n), t.addPrimitive(i), t.addSource(r), t.setName("aLineString"), t
    }, this.readMultiLineString = function(e) {
        var t = new vgl.geometryData,
            i = new vgl.sourceDataP3fv,
            r = 0,
            n = 2 * e.length,
            o = null,
            a = null,
            l = null,
            s = null,
            u = null,
            c = null,
            h = null,
            d = null;
        for (i.data().length = 3 * n, a = 0; a < e.length; a++) {
            for (c = [], h = new vgl.lineStrip, d = e[a].length, h.setIndicesPerPrimitive(d), o = 0; d > o; o++) c.push(r), l = e[a][o][0], s = e[a][o][1], u = 0, e[a][o].length > 2 && (u = e[a][o][2]), i.insertAt(r, [l, s, u]), this.readScalars(e[a][o], t, 2 * n, r), r++;
            h.setIndices(c), t.addPrimitive(h)
        }
        return t.setName("aMultiLineString"), t.addSource(i), t
    }, this.readPolygon = function(e) {
        var t = new vgl.geometryData,
            i = new vgl.sourceDataP3fv,
            r = null,
            n = null,
            o = null,
            a = e[0].length,
            l = 1,
            s = null,
            u = null,
            c = null;
        for (s = 0; a > s; s++) r = e[0][s][0], n = e[0][s][1], o = 0, e[0][s].length > 2 && (o = e[0][s][2]), i.pushBack([r, n, o]), this.readScalars(e[0][s], t), s > 1 && (u = new Uint16Array([0, l, s]), c = new vgl.triangles, c.setIndices(u), t.addPrimitive(c), l = s);
        return t.setName("POLY"), t.addSource(i), t
    }, this.readMultiPolygon = function(e) {
        var t = new vgl.geometryData,
            i = new vgl.sourceDataP3fv,
            r = 0,
            n = e.length,
            o = 0,
            a = 3 * n,
            l = new vgl.triangles,
            s = [],
            u = null,
            c = null,
            h = null,
            d = null,
            g = null,
            v = null,
            f = null,
            m = null,
            p = null,
            b = !1,
            x = 0;
        for (i.data().length = 3 * n, c = 0; n > c; c++)
            for (v = e[c][0].length, f = r, m = r + 1, p = [!1, !1, !1], u = 0; v > u; u++) h = e[c][0][u][0], d = e[c][0][u][1], g = 0, e[c][0][u].length > 2 && (g = e[c][0][u][2]), b = !1, h > 180 && (b = !0, h -= 360), 0 === u ? p[0] = b : p[1 + (u - 1) % 2] = b, i.insertAt(o, [h, d, g]), this.readScalars(e[c][0][u], t, a, o), o++, u > 1 && (p[0] === p[1] && p[1] === p[2] && (s[3 * x + 0] = f, s[3 * x + 1] = m, s[3 * x + 2] = r, x++), m = r), r++;
        return l.setIndices(s), t.addPrimitive(l), t.setName("aMultiPoly"), t.addSource(i), t
    }, this.readGJObjectInt = function(e) {
        if (!e.hasOwnProperty("type")) return null;
        e.properties && e.properties.ScalarFormat && "values" === e.properties.ScalarFormat && (this.m_scalarFormat = "values", e.properties.ScalarRange && (this.m_scalarRange = e.properties.ScalarRange)), e.properties && e.properties.ScalarFormat && "rgb" === e.properties.ScalarFormat && (this.m_scalarFormat = "rgb");
        var t, i = e.type,
            r = null,
            n = null,
            o = null;
        switch (i) {
            case "Point":
                t = this.readPoint(e.coordinates);
                break;
            case "MultiPoint":
                t = this.readMultiPoint(e.coordinates);
                break;
            case "LineString":
                t = this.readLineString(e.coordinates);
                break;
            case "MultiLineString":
                t = this.readMultiLineString(e.coordinates);
                break;
            case "Polygon":
                t = this.readPolygon(e.coordinates);
                break;
            case "MultiPolygon":
                t = this.readMultiPolygon(e.coordinates);
                break;
            case "GeometryCollection":
                for (n = [], o = 0; o < e.geometries.length; o++) r = this.readGJObject(e.geometries[o]), n.push(r);
                t = n;
                break;
            case "Feature":
                r = this.readGJObject(e.geometry), t = r;
                break;
            case "FeatureCollection":
                for (n = [], o = 0; o < e.features.length; o++) r = this.readGJObject(e.features[o]), n.push(r);
                t = n;
                break;
            default:
                console.log("Don't understand type " + i), t = null
        }
        return t
    }, this.readGJObject = function(e) {
        var t;
        return t = this.readGJObjectInt(e)
    }, this.linearizeGeoms = function(e, t) {
        var i = null;
        if ("[object Array]" === Object.prototype.toString.call(t))
            for (i = 0; i < t.length; i++) this.linearizeGeoms(e, t[i]);
        else e.push(t)
    }, this.readGeomObject = function(e) {
        var t, i = [];
        return t = this.readGJObject(e), this.linearizeGeoms(i, t), i
    }, this.getPrimitives = function(e) {
        if (!e) return [];
        var t = JSON.parse(e),
            i = this.readGJObject(t),
            r = [];
        return this.m_scalarFormat = "none", this.m_scalarRange = null, this.linearizeGeoms(r, i), {
            geoms: r,
            scalarFormat: this.m_scalarFormat,
            scalarRange: this.m_scalarRange
        }
    }, this
}, vgl.data = function() {
    "use strict";
    return this instanceof vgl.data ? void(this.type = function() {}) : new vgl.data
}, vgl.data.raster = 0, vgl.data.point = 1, vgl.data.lineString = 2, vgl.data.polygon = 3, vgl.data.geometry = 10;
var vertexAttributeKeys = {
    Position: 0,
    Normal: 1,
    TextureCoordinate: 2,
    Color: 3,
    Scalar: 4
};
vgl.primitive = function() {
    "use strict";
    if (!(this instanceof vgl.primitive)) return new vgl.primitive;
    var e = 0,
        t = 0,
        i = 0,
        r = null;
    return this.indices = function() {
        return r
    }, this.createIndices = function() {
        r = new Uint16Array
    }, this.numberOfIndices = function() {
        return r.length
    }, this.sizeInBytes = function() {
        return r.length * Uint16Array.BYTES_PER_ELEMENT
    }, this.primitiveType = function() {
        return t
    }, this.setPrimitiveType = function(e) {
        t = e
    }, this.indicesPerPrimitive = function() {
        return e
    }, this.setIndicesPerPrimitive = function(t) {
        e = t
    }, this.indicesValueType = function() {
        return i
    }, this.setIndicesValueType = function(e) {
        i = e
    }, this.setIndices = function(e) {
        r = new Uint16Array(e)
    }, this
}, vgl.triangleStrip = function() {
    "use strict";
    return this instanceof vgl.triangleStrip ? (vgl.primitive.call(this), this.setPrimitiveType(gl.TRIANGLE_STRIP), this.setIndicesValueType(gl.UNSIGNED_SHORT), this.setIndicesPerPrimitive(3), this) : new vgl.triangleStrip
}, inherit(vgl.triangleStrip, vgl.primitive), vgl.triangles = function() {
    "use strict";
    return this instanceof vgl.triangles ? (vgl.primitive.call(this), this.setPrimitiveType(gl.TRIANGLES), this.setIndicesValueType(gl.UNSIGNED_SHORT), this.setIndicesPerPrimitive(3), this) : new vgl.triangles
}, inherit(vgl.triangles, vgl.primitive), vgl.lines = function() {
    "use strict";
    return this instanceof vgl.lines ? (vgl.primitive.call(this), this.setPrimitiveType(gl.LINES), this.setIndicesValueType(gl.UNSIGNED_SHORT), this.setIndicesPerPrimitive(2), this) : new vgl.lines
}, inherit(vgl.lines, vgl.primitive), vgl.lineStrip = function() {
    "use strict";
    return this instanceof vgl.lineStrip ? (vgl.primitive.call(this), this.setPrimitiveType(gl.LINE_STRIP), this.setIndicesValueType(gl.UNSIGNED_SHORT), this.setIndicesPerPrimitive(2), this) : new vgl.lineStrip
}, inherit(vgl.lineStrip, vgl.primitive), vgl.points = function() {
    "use strict";
    return this instanceof vgl.points ? (vgl.primitive.call(this), this.setPrimitiveType(gl.POINTS), this.setIndicesValueType(gl.UNSIGNED_SHORT), this.setIndicesPerPrimitive(1), this) : new vgl.points
}, inherit(vgl.points, vgl.primitive), vgl.vertexDataP3f = function() {
    "use strict";
    return this instanceof vgl.vertexDataP3f ? (this.m_position = [], this) : new vgl.vertexDataP3f
}, vgl.vertexDataP3N3f = function() {
    "use strict";
    return this instanceof vgl.vertexDataP3N3f ? (this.m_position = [], this.m_normal = [], this) : new vgl.vertexDataP3N3f
}, vgl.vertexDataP3T3f = function() {
    "use strict";
    return this instanceof vgl.vertexDataP3T3f ? (this.m_position = [], this.m_texCoordinate = [], this) : new vgl.vertexDataP3T3f
}, vgl.sourceData = function() {
    "use strict";
    if (!(this instanceof vgl.sourceData)) return new vgl.sourceData;
    var e = {},
        t = [],
        i = function() {
            this.m_numberOfComponents = 0, this.m_dataType = 0, this.m_dataTypeSize = 0, this.m_normalized = !1, this.m_stride = 0, this.m_offset = 0
        };
    return this.data = function() {
        return t
    }, this.getData = function() {
        return data()
    }, this.setData = function(e) {
        return e instanceof Array ? void(t = e.slice(0)) : void console.log("[error] Requires array")
    }, this.addAttribute = function(t, r, n, o, a, l, s) {
        if (!e.hasOwnProperty(t)) {
            var u = new i;
            u.m_dataType = r, u.m_dataTypeSize = n, u.m_offset = o, u.m_stride = a, u.m_numberOfComponents = l, u.m_normalized = s, e[t] = u
        }
    }, this.sizeOfArray = function() {
        return Object.size(t)
    }, this.lengthOfArray = function() {
        return t.length
    }, this.sizeInBytes = function() {
        var e, t = 0,
            i = this.keys();
        for (e = 0; e < i.length(); ++e) t += this.numberOfComponents(i[e]) * this.sizeOfAttributeDataType(i[e]);
        return t *= this.sizeOfArray()
    }, this.hasKey = function(t) {
        return e.hasOwnProperty(t)
    }, this.keys = function() {
        return Object.keys(e)
    }, this.numberOfAttributes = function() {
        return Object.size(e)
    }, this.attributeNumberOfComponents = function(t) {
        return e.hasOwnProperty(t) ? e[t].m_numberOfComponents : 0
    }, this.normalized = function(t) {
        return e.hasOwnProperty(t) ? e[t].m_normalized : !1
    }, this.sizeOfAttributeDataType = function(t) {
        return e.hasOwnProperty(t) ? e[t].m_dataTypeSize : 0
    }, this.attributeDataType = function(t) {
        return e.hasOwnProperty(t) ? e[t].m_dataType : void 0
    }, this.attributeOffset = function(t) {
        return e.hasOwnProperty(t) ? e[t].m_offset : 0
    }, this.attributeStride = function(t) {
        return e.hasOwnProperty(t) ? e[t].m_stride : 0
    }, this.pushBack = function() {}, this.insert = function(e) {
        var i;
        if (e.length)
            for (i = 0; i < e.length; i++) t[t.length] = e[i];
        else t[t.length] = e
    }, this.insertAt = function(e, i) {
        var r;
        if (i.length)
            for (r = 0; r < i.length; r++) t[e * i.length + r] = i[r];
        else t[e] = i
    }, this
}, vgl.sourceDataP3T3f = function() {
    "use strict";
    return this instanceof vgl.sourceDataP3T3f ? (vgl.sourceData.call(this), this.addAttribute(vgl.vertexAttributeKeys.Position, gl.FLOAT, 4, 0, 24, 3, !1), this.addAttribute(vgl.vertexAttributeKeys.TextureCoordinate, gl.FLOAT, 4, 12, 24, 3, !1), this.pushBack = function(e) {
        this.insert(e.m_position), this.insert(e.m_texCoordinate)
    }, this) : new vgl.sourceDataP3T3f
}, inherit(vgl.sourceDataP3T3f, vgl.sourceData), vgl.sourceDataP3N3f = function() {
    "use strict";
    return this instanceof vgl.sourceDataP3N3f ? (vgl.sourceData.call(this), this.addAttribute(vgl.vertexAttributeKeys.Position, gl.FLOAT, 4, 0, 24, 3, !1), this.addAttribute(vgl.vertexAttributeKeys.Normal, gl.FLOAT, 4, 12, 24, 3, !1), this.pushBack = function(e) {
        this.insert(e.m_position), this.insert(e.m_normal)
    }, this) : new vgl.sourceDataP3N3f
}, inherit(vgl.sourceDataP3N3f, vgl.sourceData), vgl.sourceDataP3fv = function() {
    "use strict";
    return this instanceof vgl.sourceDataP3fv ? (vgl.sourceData.call(this), this.addAttribute(vgl.vertexAttributeKeys.Position, gl.FLOAT, 4, 0, 12, 3, !1), this.pushBack = function(e) {
        this.insert(e)
    }, this) : new vgl.sourceDataP3fv
}, inherit(vgl.sourceDataP3fv, vgl.sourceData), vgl.sourceDataT2fv = function() {
    "use strict";
    return this instanceof vgl.sourceDataT2fv ? (vgl.sourceData.call(this), this.addAttribute(vgl.vertexAttributeKeys.TextureCoordinate, gl.FLOAT, 4, 0, 8, 2, !1), this.pushBack = function(e) {
        this.insert(e)
    }, this) : new vgl.sourceDataT2fv
}, inherit(vgl.sourceDataT2fv, vgl.sourceData), vgl.sourceDataC3fv = function() {
    "use strict";
    return this instanceof vgl.sourceDataC3fv ? (vgl.sourceData.call(this), this.addAttribute(vgl.vertexAttributeKeys.Color, gl.FLOAT, 4, 0, 12, 3, !1), this.pushBack = function(e) {
        this.insert(e)
    }, this) : new vgl.sourceDataC3fv
}, inherit(vgl.sourceDataC3fv, vgl.sourceData), vgl.sourceDataSf = function() {
    "use strict";
    if (!(this instanceof vgl.sourceDataSf)) return new vgl.sourceDataSf;
    var e = null,
        t = null,
        i = null,
        r = null;
    return vgl.sourceData.call(this), this.addAttribute(vgl.vertexAttributeKeys.Scalar, gl.FLOAT, 4, 0, 4, 1, !1), this.pushBack = function(i) {
        (null === t || i > t) && (t = i), (null === e || e > i) && (e = i), this.data()[this.data().length] = i
    }, this.insertAt = function(i, r) {
        (null === t || r > t) && (t = r), (null === e || e > r) && (e = r), this.data()[i] = r
    }, this.scalarRange = function() {
        return null === i || null === r ? [e, t] : [i, r]
    }, this.setScalarRange = function(e, t) {
        i = e, r = t
    }, this
}, inherit(vgl.sourceDataSf, vgl.sourceData), vgl.sourceDataDf = function() {
    "use strict";
    if (!(this instanceof vgl.sourceDataDf)) return new vgl.sourceDataDf;
    return vgl.sourceData.call(this), this.addAttribute(vgl.vertexAttributeKeys.Scalar, gl.FLOAT, 4, 0, 4, 1, !1), this.pushBack = function(e) {
        this.data()[this.data().length] = e
    }, this.insertAt = function(e, t) {
        this.data()[e] = t
    }, this
}, inherit(vgl.sourceDataDf, vgl.sourceData), vgl.geometryData = function() {
    "use strict";
    if (!(this instanceof vgl.geometryData)) return vgl.geometryData();
    vgl.data.call(this);
    var e = "",
        t = [],
        i = [],
        r = [0, 0, 0, 0, 0, 0],
        n = vgl.timestamp(),
        o = vgl.timestamp();
    return this.type = function() {
        return vgl.data.geometry
    }, this.name = function() {
        return e
    }, this.setName = function(t) {
        e = t
    }, this.addSource = function(e) {
        return -1 === i.indexOf(e) ? (i.push(e), e.hasKey(vgl.vertexAttributeKeys.Position) && o.modified(), !0) : !1
    }, this.source = function(e) {
        return e < i.length ? i[e] : 0
    }, this.numberOfSources = function() {
        return i.length
    }, this.sourceData = function(e) {
        var t;
        for (t = 0; t < i.length; ++t)
            if (i[t].hasKey(e)) return i[t];
        return null
    }, this.addPrimitive = function(e) {
        return t.push(e), !0
    }, this.primitive = function(e) {
        return e < t.length ? t[e] : null
    }, this.numberOfPrimitives = function() {
        return t.length
    }, this.bounds = function() {
        return o.getMTime() > n.getMTime() && this.computeBounds(), r
    }, this.resetBounds = function() {
        r[0] = 0, r[1] = 0, r[2] = 0, r[3] = 0, r[4] = 0, r[5] = 0
    }, this.setBounds = function(e, t, i, o, a, l) {
        return r[0] = e, r[1] = t, r[2] = i, r[3] = o, r[4] = a, r[5] = l, n.modified(), !0
    }, this.computeBounds = function() {
        if (o.getMTime() > n.getMTime()) {
            var e, t, i = vgl.vertexAttributeKeys.Position,
                a = this.sourceData(i),
                l = a.data(),
                s = a.attributeNumberOfComponents(i),
                u = a.attributeStride(i),
                c = a.attributeOffset(i),
                h = a.sizeOfAttributeDataType(i),
                d = l.length,
                g = 0,
                v = 0,
                f = null;
            for (u /= h, c /= h, this.resetBounds(), e = c; d > e; e += u)
                for (t = 0; s > t; ++t) f = l[e + t], g = 2 * t, v = 2 * t + 1, e === c ? (r[g] = f, r[v] = f) : (f > r[v] && (r[v] = f), f < r[g] && (r[g] = f));
            n.modified()
        }
    }, this.findClosestVertex = function(e) {
        var t, i, r, n, o, a, l, s = vgl.vertexAttributeKeys.Position,
            u = this.sourceData(s),
            c = u.sizeOfAttributeDataType(s),
            h = u.attributeNumberOfComponents(s),
            d = u.data(),
            g = u.attributeStride(s) / c,
            v = u.attributeOffset(s) / c,
            f = Number.MAX_VALUE,
            m = null;
        for (3 !== h && console.log("[warning] Find closest vertex assumes threecomponent vertex "), e.z || (e = {
                x: e.x,
                y: e.y,
                z: 0
            }), t = v, l = 0; t < d.length; t += g, l++) i = [d[t], d[t + 1], d[t + 2]], r = i[0] - e.x, n = i[1] - e.y, o = i[2] - e.z, a = Math.sqrt(r * r + n * n + o * o), f > a && (f = a, m = l);
        return m
    }, this.getPosition = function(e) {
        var t = vgl.vertexAttributeKeys.Position,
            i = this.sourceData(t),
            r = i.sizeOfAttributeDataType(t),
            n = i.attributeNumberOfComponents(t),
            o = i.data(),
            a = i.attributeStride(t) / r,
            l = i.attributeOffset(t) / r;
        return 3 !== n && console.log("[warning] getPosition assumes three component data"), [o[l + e * a], o[l + e * a + 1], o[l + e * a + 2]]
    }, this.getScalar = function(e) {
        var t, i, r, n, o, a = vgl.vertexAttributeKeys.Scalar,
            l = this.sourceData(a);
        return l ? (t = l.attributeNumberOfComponents(a), i = l.sizeOfAttributeDataType(a), r = l.data(), n = l.attributeStride(a) / i, o = l.attributeOffset(a) / i, e * n + o >= r.length && console.log("access out of bounds in getScalar"), r[e * n + o]) : null
    }, this
}, inherit(vgl.geometryData, vgl.data), vgl.mapper = function() {
    "use strict";

    function e() {
        var e;
        for (e = 0; e < l.length; ++e) gl.deleteBuffer(l[e])
    }

    function t() {
        if (a) {
            var e, t, i, r, n, o, c = a.numberOfSources(),
                h = null;
            for (e = 0; c > e; ++e) {
                for (h = gl.createBuffer(), gl.bindBuffer(gl.ARRAY_BUFFER, h), gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(a.source(e).data()), gl.STATIC_DRAW), r = a.source(e).keys(), n = [], t = 0; t < r.length; ++t) n.push(r[t]);
                s[e] = n, l[e] = h
            }
            for (o = a.numberOfPrimitives(), i = 0; o > i; ++i) h = gl.createBuffer(), gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, h), gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, a.primitive(i).indices(), gl.STATIC_DRAW), l[e++] = h;
            u.modified()
        }
    }

    function i() {
        s = {}, l = []
    }

    function r() {
        e(), i(), t(), n = !1
    }
    if (!(this instanceof vgl.mapper)) return new vgl.mapper;
    vgl.boundingObject.call(this);
    var n = !0,
        o = [0, 1, 1],
        a = null,
        l = [],
        s = {},
        u = vgl.timestamp();
    return this.computeBounds = function() {
        if (null === a || "undefined" == typeof a) return void this.resetBounds();
        var e = this.computeBoundsTimestamp(),
            t = this.boundsDirtyTimestamp(),
            i = null;
        t.getMTime() > e.getMTime() && (i = a.bounds(), this.setBounds(i[0], i[1], i[2], i[3], i[4], i[5]), e.modified())
    }, this.color = function() {
        return o
    }, this.setColor = function(e, t, i) {
        o[0] = e, o[1] = t, o[2] = i, this.modified()
    }, this.geometryData = function() {
        return a
    }, this.setGeometryData = function(e) {
        a !== e && (a = e, this.modified(), this.boundsDirtyTimestamp().modified())
    }, this.render = function(e) {
        this.getMTime() > u.getMTime() && r(e), gl.vertexAttrib3fv(vgl.vertexAttributeKeys.Color, this.color());
        var t, i = 0,
            n = 0,
            o = null,
            c = null;
        for (t in s)
            if (s.hasOwnProperty(t)) {
                for (gl.bindBuffer(gl.ARRAY_BUFFER, l[i]), n = 0; n < s[t].length; ++n) e.m_material.bindVertexData(e, s[t][n]);
                ++i
            }
        for (o = a.numberOfPrimitives(), n = 0; o > n; ++n) gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, l[i++]), c = a.primitive(n), gl.drawElements(c.primitiveType(), c.numberOfIndices(), c.indicesValueType(), 0)
    }, this
}, inherit(vgl.mapper, vgl.boundingObject), vgl.groupMapper = function() {
    "use strict";
    if (!(this instanceof vgl.groupMapper)) return new vgl.groupMapper;
    vgl.mapper.call(this);
    var e = vgl.timestamp(),
        t = [],
        i = [];
    return this.geometryData = function(e) {
        return void 0 !== e && e < i.length ? i[e] : i.length > 0 ? i[0] : null
    }, this.setGeometryData = function(e) {
        (1 !== i.length || i[0] !== e) && (i = [], i.push(e), this.modified())
    }, this.geometryDataArray = function() {
        return i
    }, this.setGeometryDataArray = function(e) {
        if (e instanceof Array) {
            if (i !== e) return i = [], i = e, this.modified(), !0
        } else console.log("[error] Requies array of geometry data");
        return !1
    }, this.computeBounds = function() {
        if (null === i || void 0 === i) return void this.resetBounds();
        var e = this.computeBoundsTimestamp(),
            t = this.boundsDirtyTimestamp(),
            r = this.bounds(),
            n = null,
            o = null;
        if (t.getMTime() > e.getMTime()) {
            for (o = 0; o < i.length; ++o) n = i[o].bounds(), r[0] > n[0] && (r[0] = n[0]), r[1] < n[1] && (r[1] = n[1]), r[2] > n[2] && (r[2] = n[2]), r[3] < n[3] && (r[3] = n[3]), r[4] > n[4] && (r[4] = n[4]), r[5] < n[5] && (r[5] = n[5]);
            this.modified(), e.modified()
        }
    }, this.render = function(r) {
        var n = null;
        if (this.getMTime() > e.getMTime()) {
            for (n = 0; n < i.length; ++n) t.push(vgl.mapper()), t[n].setGeometryData(i[n]);
            e.modified()
        }
        for (n = 0; n < t.length; ++n) t[n].render(r)
    }, this
}, inherit(vgl.groupMapper, vgl.mapper), vgl.materialAttributeType = {
    Undefined: 0,
    ShaderProgram: 1,
    Texture: 2,
    Blend: 3,
    Depth: 4
}, vgl.materialAttribute = function(e) {
    "use strict";
    if (!(this instanceof vgl.materialAttribute)) return new vgl.materialAttribute;
    vgl.object.call(this);
    var t = e,
        i = !0;
    return this.type = function() {
        return t
    }, this.enabled = function() {
        return i
    }, this.setup = function() {
        return !1
    }, this.bind = function() {
        return !1
    }, this.undoBind = function() {
        return !1
    }, this.setupVertexData = function() {
        return !1
    }, this.bindVertexData = function() {
        return !1
    }, this.undoBindVertexData = function() {
        return !1
    }, this
}, inherit(vgl.materialAttribute, vgl.object), vgl.blendFunction = function(e, t) {
    "use strict";
    if (!(this instanceof vgl.blendFunction)) return new vgl.blendFunction(e, t);
    var i = e,
        r = t;
    return this.apply = function() {
        gl.blendFuncSeparate(i, r, gl.ONE, gl.ONE_MINUS_SRC_ALPHA)
    }, this
}, vgl.blend = function() {
    "use strict";
    if (!(this instanceof vgl.blend)) return new vgl.blend;
    vgl.materialAttribute.call(this, vgl.materialAttributeType.Blend);
    var e = !1,
        t = vgl.blendFunction(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    return this.bind = function(i) {
        return e = gl.isEnabled(gl.BLEND), this.enabled() ? (gl.enable(gl.BLEND), t.apply(i)) : gl.disable(gl.BLEND), !0
    }, this.undoBind = function() {
        return e ? gl.enable(gl.BLEND) : gl.disable(gl.BLEND), !0
    }, this
}, inherit(vgl.blend, vgl.materialAttribute), vgl.material = function() {
    "use strict";
    if (!(this instanceof vgl.material)) return new vgl.material;
    vgl.object.call(this);
    var e = new vgl.shaderProgram,
        t = 100,
        i = {},
        r = {};
    return this.binNumber = function() {
        return t
    }, this.setBinNumber = function(e) {
        t = e, this.modified()
    }, this.exists = function(e) {
        return e.type() === vgl.materialAttribute.Texture ? i.hasOwnProperty(e) : r.hasOwnProperty(e)
    }, this.uniform = function(t) {
        return e ? e.uniform(t) : null
    }, this.attribute = function(e) {
        return r.hasOwnProperty(e) ? r[e] : i.hasOwnProperty(e) ? i[e] : null
    }, this.setAttribute = function(t) {
        return t.type() === vgl.materialAttributeType.Texture && i[t.textureUnit()] !== t ? (i[t.textureUnit()] = t, this.modified(), !0) : r[t.type()] === t ? !1 : (t.type() === vgl.materialAttributeType.ShaderProgram && (e = t), r[t.type()] = t, this.modified(), !0)
    }, this.addAttribute = function(t) {
        return this.exists(t) ? !1 : t.type() === vgl.materialAttributeType.Texture ? (i[t.textureUnit()] = t, this.modified(), !0) : (t.type() === vgl.materialAttributeType.ShaderProgram && (e = t), r[t.type()] = t, this.modified(), !0)
    }, this.shaderProgram = function() {
        return e
    }, this.render = function(e) {
        this.bind(e)
    }, this.remove = function(e) {
        this.undoBind(e)
    }, this.bind = function(e) {
        var t = null;
        for (t in r) r.hasOwnProperty(t) && r[t].bind(e);
        for (t in i) i.hasOwnProperty(t) && i[t].bind(e)
    }, this.undoBind = function(e) {
        var t = null;
        for (t in r) r.hasOwnProperty(t) && r[t].undoBind(e);
        for (t in i) i.hasOwnProperty(t) && i[t].undoBind(e)
    }, this.bindVertexData = function(e, t) {
        var i = null;
        for (i in r) r.hasOwnProperty(i) && r[i].bindVertexData(e, t)
    }, this.undoBindVertexData = function(e, t) {
        var i = null;
        for (i in r) r.hasOwnProperty(i) && r.undoBindVertexData(e, t)
    }, this
}, vgl.material.RenderBin = {
    Base: 0,
    Default: 100,
    Opaque: 100,
    Transparent: 1e3,
    Overlay: 1e4
}, inherit(vgl.material, vgl.object), vgl.renderState = function() {
    "use strict";
    this.m_modelViewMatrix = mat4.create(), this.m_normalMatrix = mat4.create(), this.m_projectionMatrix = null, this.m_material = null, this.m_mapper = null
}, vgl.renderer = function() {
    "use strict";
    if (!(this instanceof vgl.renderer)) return new vgl.renderer;
    vgl.object.call(this);
    var e = new vgl.groupNode,
        t = new vgl.camera,
        i = null,
        r = 0,
        n = 0,
        o = 0,
        a = 0,
        l = !0,
        s = !0,
        u = 0,
        c = !0;
    return t.addChild(e), this.width = function() {
        return o
    }, this.height = function() {
        return a
    }, this.layer = function() {
        return u
    }, this.setLayer = function(e) {
        u = e, this.modified()
    }, this.isResizable = function() {
        return l
    }, this.setResizable = function(e) {
        l = e
    }, this.backgroundColor = function() {
        return t.clearColor()
    }, this.setBackgroundColor = function(e, i, r, n) {
        t.setClearColor(e, i, r, n), this.modified()
    }, this.sceneRoot = function() {
        return e
    }, this.camera = function() {
        return t
    }, this.render = function() {
        var i, l, u, c = null,
            h = [],
            d = mat4.create(),
            g = null;
        for (gl.enable(gl.DEPTH_TEST), gl.depthFunc(gl.LEQUAL), t.clearMask() & vgl.GL.ColorBufferBit && (g = t.clearColor(), gl.clearColor(g[0], g[1], g[2], g[3])), t.clearMask() & vgl.GL.DepthBufferBit && gl.clearDepth(t.clearDepth()), gl.clear(t.clearMask()), gl.viewport(r, n, o, a), l = new vgl.renderState, u = e.children(), u.length > 0 && s && (this.resetCamera(), s = !1), i = 0; i < u.length; ++i) c = u[i], c.computeBounds(), c.visible() && h.push([c.material().binNumber(), c]);
        for (h.sort(function(e, t) {
                return e[0] - t[0]
            }), i = 0; i < h.length; ++i) c = h[i][1], c.referenceFrame() === vgl.boundingObject.ReferenceFrame.Relative ? (mat4.multiply(l.m_modelViewMatrix, t.viewMatrix(), c.matrix()), l.m_projectionMatrix = t.projectionMatrix()) : (l.m_modelViewMatrix = c.matrix(), l.m_projectionMatrix = mat4.create(), mat4.ortho(l.m_projectionMatrix, 0, o, 0, a, -1, 1)), mat4.invert(d, l.m_modelViewMatrix), mat4.transpose(l.m_normalMatrix, d), l.m_material = c.material(), l.m_mapper = c.mapper(), l.m_material.render(l), l.m_mapper.render(l), l.m_material.remove(l)
    }, this.resetCamera = function() {
        t.computeBounds();
        var e = t.directionOfProjection(),
            i = t.bounds(),
            r = [(i[0] + i[1]) / 2, (i[2] + i[3]) / 2, (i[4] + i[5]) / 2],
            n = [i[1] - i[0], i[3] - i[2], i[5] - i[4]],
            o = 0,
            a = t.viewAspect(),
            l = t.viewAngle(),
            s = null,
            u = null;
        o = n[0] > n[1] ? n[0] > n[2] ? n[0] / 2 : n[2] / 2 : n[1] > n[2] ? n[1] / 2 : n[2] / 2, l = a >= 1 ? 2 * Math.atan(Math.tan(.5 * l) / a) : 2 * Math.atan(Math.tan(.5 * l) * a), s = o / Math.sin(.5 * l), u = t.viewUpDirection(), Math.abs(vec3.dot(u, e)) > .999 && t.setViewUpDirection(-u[2], u[0], u[1]), t.setFocalPoint(r[0], r[1], r[2]), t.setPosition(r[0] + s * -e[0], r[1] + s * -e[1], r[2] + s * -e[2]), this.resetCameraClippingRange(i)
    }, this.hasValidBounds = function(e) {
        return e[0] == Number.MAX_VALUE || e[1] == -Number.MAX_VALUE || e[2] == Number.MAX_VALUE || e[3] == -Number.MAX_VALUE || e[4] == Number.MAX_VALUE || e[5] == -Number.MAX_VALUE ? !1 : !0
    }, this.resetCameraClippingRange = function(e) {
        if ("undefined" == typeof e && (t.computeBounds(), e = t.bounds()), this.hasValidBounds(e)) {
            var r = t.viewPlaneNormal(),
                n = t.position(),
                o = -r[0],
                a = -r[1],
                l = -r[2],
                s = -(o * n[0] + a * n[1] + l * n[2]),
                u = vec2.create(),
                h = null,
                d = null,
                g = null,
                v = null;
            if (c) {
                for (u[0] = o * e[0] + a * e[2] + l * e[4] + s, u[1] = 1e-18, v = 0; 2 > v; v++)
                    for (g = 0; 2 > g; g++)
                        for (d = 0; 2 > d; d++) h = o * e[d] + a * e[2 + g] + l * e[4 + v] + s, u[0] = h < u[0] ? h : u[0], u[1] = h > u[1] ? h : u[1];
                u[0] < 0 && (u[0] = 0), u[0] = .99 * u[0] - .5 * (u[1] - u[0]), u[1] = 1.01 * u[1] + .5 * (u[1] - u[0]), u[0] = u[0] >= u[1] ? .01 * u[1] : u[0], i || (i = .01, null !== gl && gl.getParameter(gl.DEPTH_BITS) > 16 && (i = .001)), u[0] < i * u[1] && (u[0] = i * u[1]), t.setClippingRange(u[0], u[1])
            }
        }
    }, this.resize = function(e, t) {
        this.positionAndResize(r, n, e, t)
    }, this.positionAndResize = function(e, i, r, n) {
        (0 > e || 0 > i || 0 > r || 0 > n) && console.log("[error] Invalid position and resize values", e, i, r, n), l && (o = r, a = n, t.setViewAspect(o / a), this.modified())
    }, this.addActor = function(t) {
        return t instanceof vgl.actor ? (e.addChild(t), this.modified(), !0) : !1
    }, this.hasActor = function(t) {
        return e.hasChild(t)
    }, this.addActors = function(t) {
        var i = null;
        if (t instanceof Array) {
            for (i = 0; i < t.length; ++i) e.addChild(t[i]);
            this.modified()
        }
    }, this.removeActor = function(t) {
        return -1 !== e.children().indexOf(t) ? (e.removeChild(t), this.modified(), !0) : !1
    }, this.removeActors = function(t) {
        if (!(t instanceof Array)) return !1;
        var i;
        for (i = 0; i < t.length; ++i) e.removeChild(t[i]);
        return this.modified(), !0
    }, this.removeAllActors = function() {
        return e.removeChildren()
    }, this.worldToDisplay = function(e, t, i, r, n) {
        var o = mat4.create(),
            a = null,
            l = null,
            s = null,
            u = null,
            c = null;
        return mat4.multiply(o, i, t), c = vec4.create(), vec4.transformMat4(c, e, o), 0 !== c[3] && (c[0] = c[0] / c[3], c[1] = c[1] / c[3], c[2] = c[2] / c[3], c[3] = 1), a = (c[0] + 1) / 2 * r, l = (1 - c[1]) / 2 * n, s = c[2], u = c[3], vec4.fromValues(a, l, s, u)
    }, this.displayToWorld = function(e, t, i, r, n) {
        var o = 2 * e[0] / r - 1,
            a = -(2 * e[1] / n) + 1,
            l = e[2],
            s = mat4.create(),
            u = null;
        return mat4.multiply(s, i, t), mat4.invert(s, s), u = vec4.fromValues(o, a, l, 1), vec4.transformMat4(u, u, s), 0 !== u[3] && (u[0] = u[0] / u[3], u[1] = u[1] / u[3], u[2] = u[2] / u[3], u[3] = 1), u
    }, this.focusDisplayPoint = function() {
        var e = t.focalPoint(),
            i = vec4.fromValues(e[0], e[1], e[2], 1);
        return this.worldToDisplay(i, t.viewMatrix(), t.projectionMatrix(), o, a)
    }, this.resetScene = function() {
        return s
    }, this.setResetScene = function(e) {
        s !== e && (s = e, this.modified())
    }, this.resetClippingRange = function() {
        return c
    }, this.setResetClippingRange = function(e) {
        c !== e && (c = e, this.modified())
    }, this
}, inherit(vgl.renderer, vgl.object);
var gl = null;
vgl.renderWindow = function(e) {
    "use strict";
    if (!(this instanceof vgl.renderWindow)) return new vgl.renderWindow(e);
    vgl.object.call(this);
    var t = 0,
        i = 0,
        r = 400,
        n = 400,
        o = e,
        a = null,
        l = [];
    return this.windowSize = function() {
        return [r, n]
    }, this.setWindowSize = function(e, t) {
        return r !== e || n !== t ? (r = e, n = t, this.modified(), !0) : !1
    }, this.windowPosition = function() {
        return [t, i]
    }, this.setWindowPosition = function(e, r) {
        return t !== e || i !== r ? (t = e, i = r, this.modified(), !0) : !1
    }, this.renderers = function() {
        return l
    }, this.activeRenderer = function() {
        return a
    }, this.addRenderer = function(e) {
        return this.hasRenderer(e) === !1 ? (l.push(e), null === a && (a = e), 0 !== e.layer() && e.camera().setClearMask(vgl.GL.DepthBufferBit), this.modified(), !0) : !1
    }, this.removeRenderer = function(e) {
        var t = l.indexOf(e);
        return -1 !== t ? (a === e && (a = null), l.splice(t, 1), this.modified(), !0) : !1
    }, this.getRenderer = function(e) {
        return e < l.length ? l[e] : (console.log("[WARNING] Out of index array"), null)
    }, this.hasRenderer = function(e) {
        var t;
        for (t = 0; t < l.length; ++t)
            if (e === l[t]) return !0;
        return !1
    }, this.resize = function(e, r) {
        this.positionAndResize(t, i, e, r), this.modified()
    }, this.positionAndResize = function(e, o, a, s) {
        t = e, i = o, r = a, n = s;
        var u;
        for (u = 0; u < l.length; ++u) l[u].positionAndResize(t, i, r, n);
        this.modified()
    }, this.createWindow = function() {
        gl = null;
        try {
            gl = o.getContext("webgl") || o.getContext("experimental-webgl");
            var e;
            for (e = 0; e < l.length; ++e)(l[e].width() > r || 0 === l[e].width() || l[e].height() > n || 0 === l[e].height()) && l[e].resize(t, i, r, n);
            return !0
        } catch (a) {}
        return gl || console("[ERROR] Unable to initialize WebGL. Your browser may not support it."), !1
    }, this.deleteWindow = function() {}, this.render = function() {
        var e;
        for (l.sort(function(e, t) {
                return e.layer() - t.layer()
            }), e = 0; e < l.length; ++e) l[e].render()
    }, this.focusDisplayPoint = function() {
        return a.focusDisplayPoint()
    }, this.displayToWorld = function(e, t, i, o) {
        o = void 0 === o ? o = a : o;
        var l = o.camera();
        return i || (i = o.focusDisplayPoint()), o.displayToWorld(vec4.fromValues(e, t, i[2], 1), l.viewMatrix(), l.projectionMatrix(), r, n)
    }, this.worldToDisplay = function(e, t, i, o) {
        o = void 0 === o ? o = a : o;
        var l = o.camera();
        return o.worldToDisplay(vec4.fromValues(e, t, i, 1), l.viewMatrix(), l.projectionMatrix(), r, n)
    }, this
}, inherit(vgl.renderWindow, vgl.object), vgl.camera = function() {
    "use strict";
    if (!(this instanceof vgl.camera)) return new vgl.camera;
    vgl.groupNode.call(this);
    var e = 30 * Math.PI / 180,
        t = vec4.fromValues(0, 0, 1, 1),
        i = vec4.fromValues(0, 0, 0, 1),
        r = vec3.fromValues(0, 0, 0),
        n = vec4.fromValues(0, 1, 0, 0),
        o = vec4.fromValues(1, 0, 0, 0),
        a = .01,
        l = 1e4,
        s = 1,
        u = vec4.fromValues(0, 0, -1, 0),
        c = vec4.fromValues(0, 0, 1, 0),
        h = mat4.create(),
        d = mat4.create(),
        g = vgl.timestamp(),
        v = vgl.timestamp(),
        f = -1,
        m = 1,
        p = 1,
        b = -1,
        x = !0,
        w = !0,
        y = !0,
        A = !1,
        T = [1, 1, 1, 1],
        S = 1,
        M = vgl.GL.ColorBufferBit | vgl.GL.DepthBufferBit;
    return this.viewAngle = function() {
        return e
    }, this.setViewAngleDegrees = function(t) {
        e = Math.PI * t / 180, this.modified()
    }, this.setViewAngle = function(t) {
        y && (e = t, this.modified())
    }, this.position = function() {
        return t
    }, this.setPosition = function(e, i, r) {
        x && (t = vec4.fromValues(e, i, r, 1), this.modified())
    }, this.focalPoint = function() {
        return i
    }, this.setFocalPoint = function(e, t, r) {
        w && x && (i = vec4.fromValues(e, t, r, 1), this.modified())
    }, this.viewUpDirection = function() {
        return n
    }, this.setViewUpDirection = function(e, t, i) {
        n = vec4.fromValues(e, t, i, 0), this.modified()
    }, this.centerOfRotation = function() {
        return r
    }, this.setCenterOfRotation = function(e) {
        r = e, this.modified()
    }, this.clippingRange = function() {
        return [a, l]
    }, this.setClippingRange = function(e, t) {
        a = e, l = t, this.modified()
    }, this.viewAspect = function() {
        return s
    }, this.setViewAspect = function(e) {
        s = e, this.modified()
    }, this.enableScale = function() {
        return y
    }, this.setEnableScale = function(e) {
        return e !== y ? (y = e, this.modified(), !0) : y
    }, this.enableRotation = function() {
        return w
    }, this.setEnableRotation = function(e) {
        return e !== w ? (w = e, this.modified(), !0) : w
    }, this.enableTranslation = function() {
        return x
    }, this.setEnableTranslation = function(e) {
        return e !== x ? (x = e, this.modified(), !0) : x
    }, this.isEnabledParallelProjection = function() {
        return A
    }, this.enableParallelProjection = function(e) {
        return e !== A ? (A = e, this.modified(), !0) : A
    }, this.setEnnableParallelProjection = function() {
        return enableParallelProjection()
    }, this.setParallelProjection = function(e, t, i, r) {
        f = e, m = t, p = i, b = r, this.modified()
    }, this.directionOfProjection = function() {
        return this.computeDirectionOfProjection(), u
    }, this.viewPlaneNormal = function() {
        return this.computeViewPlaneNormal(), c
    }, this.viewMatrix = function() {
        return this.computeViewMatrix()
    }, this.projectionMatrix = function() {
        return this.computeProjectionMatrix()
    }, this.clearMask = function() {
        return M
    }, this.setClearMask = function(e) {
        M = e, this.modified()
    }, this.clearColor = function() {
        return T
    }, this.setClearColor = function(e, t, i, r) {
        T[0] = e, T[1] = t, T[2] = i, T[3] = r, this.modified()
    }, this.clearDepth = function() {
        return S
    }, this.setClearDepth = function(e) {
        S = e, this.modified()
    }, this.computeDirectionOfProjection = function() {
        vec3.subtract(u, i, t), vec3.normalize(u, u), this.modified()
    }, this.computeViewPlaneNormal = function() {
        c[0] = -u[0], c[1] = -u[1], c[2] = -u[2]
    }, this.zoom = function(e, r) {
        0 !== e && x && (e *= vec3.distance(i, t), r ? (t[0] = t[0] + e * r[0], t[1] = t[1] + e * r[1], t[2] = t[2] + e * r[2]) : (r = u, t[0] = i[0] - e * r[0], t[1] = i[1] - e * r[1], t[2] = i[2] - e * r[2]), this.modified())
    }, this.pan = function(e, r, n) {
        x && (t[0] += e, t[1] += r, t[2] += n, i[0] += e, i[1] += r, i[2] += n, this.modified())
    }, this.computeOrthogonalAxes = function() {
        this.computeDirectionOfProjection(), vec3.cross(o, u, n), vec3.normalize(o, o), this.modified()
    }, this.rotate = function(e, a) {
        if (w) {
            e = .5 * e * (Math.PI / 180), a = .5 * a * (Math.PI / 180);
            var l = mat4.create(),
                s = new vec3.create;
            mat4.identity(l), s[0] = -r[0], s[1] = -r[1], s[2] = -r[2], mat4.translate(l, l, r), mat4.rotate(l, l, e, n), mat4.rotate(l, l, a, o), mat4.translate(l, l, s), vec4.transformMat4(t, t, l), vec4.transformMat4(i, i, l), vec4.transformMat4(n, n, l), vec4.normalize(n, n), this.computeOrthogonalAxes(), this.modified()
        }
    }, this.computeViewMatrix = function() {
        return g.getMTime() < this.getMTime() && (mat4.lookAt(h, t, i, n), g.modified()), h
    }, this.computeProjectionMatrix = function() {
        return v.getMTime() < this.getMTime() && (A ? (console.log("paralle projection"), mat4.ortho(d, f, m, b, p, a, l)) : mat4.perspective(d, e, s, a, l), v.modified()), d
    }, this.computeDirectionOfProjection(), this
}, inherit(vgl.camera, vgl.groupNode), vgl.interactorStyle = function() {
    "use strict";
    if (!(this instanceof vgl.interactorStyle)) return new vgl.interactorStyle;
    vgl.object.call(this);
    var e = this,
        t = null;
    return this.viewer = function() {
        return t
    }, this.setViewer = function(i) {
        i !== t && (t = i, $(t).on(vgl.event.mousePress, e.handleMouseDown), $(t).on(vgl.event.mouseRelease, e.handleMouseUp), $(t).on(vgl.event.mouseMove, e.handleMouseMove), $(t).on(vgl.event.mouseOut, e.handleMouseOut), $(t).on(vgl.event.mouseWheel, e.handleMouseWheel), $(t).on(vgl.event.keyPress, e.handleKeyPress), $(t).on(vgl.event.mouseContextMenu, e.handleContextMenu), $(t).on(vgl.event.click, e.handleClick), $(t).on(vgl.event.dblClick, e.handleDoubleClick), this.modified())
    }, this.handleMouseDown = function() {
        return !0
    }, this.handleMouseUp = function() {
        return !0
    }, this.handleMouseMove = function() {
        return !0
    }, this.handleMouseOut = function() {
        return !0
    }, this.handleMouseWheel = function() {
        return !0
    }, this.handleClick = function() {
        return !0
    }, this.handleDoubleClick = function() {
        return !0
    }, this.handleKeyPress = function() {
        return !0
    }, this.handleContextMenu = function() {
        return !0
    }, this.reset = function() {
        return !0
    }, this
}, inherit(vgl.interactorStyle, vgl.object), vgl.trackballInteractorStyle = function() {
    "use strict";
    if (!(this instanceof vgl.trackballInteractorStyle)) return new vgl.trackballInteractorStyle;
    vgl.interactorStyle.call(this);
    var e, t = this,
        i = !1,
        r = !1,
        n = !1,
        o = {
            x: 0,
            y: 0
        },
        a = {
            x: 0,
            y: 0
        };
    return this.handleMouseMove = function(l) {
        var s, u, c, h, d, g, v, f, m, p, b, f, x, w = (t.viewer().canvas(), t.viewer().renderWindow().windowSize()[0]),
            y = t.viewer().renderWindow().windowSize()[1],
            A = t.viewer().renderWindow().activeRenderer(),
            T = A.camera(),
            f = t.viewer().relMouseCoords(l);
        return e = !1, o = {
            x: 0,
            y: 0
        }, f.x < 0 || f.x > w ? (o.x = 0, e = !0) : o.x = f.x, f.y < 0 || f.y > y ? (o.y = 0, e = !0) : o.y = f.y, e !== !0 ? (s = T.focalPoint(), c = vec4.fromValues(s[0], s[1], s[2], 1), u = A.worldToDisplay(c, T.viewMatrix(), T.projectionMatrix(), w, y), h = vec4.fromValues(o.x, o.y, u[2], 1), d = vec4.fromValues(a.x, a.y, u[2], 1), g = A.displayToWorld(h, T.viewMatrix(), T.projectionMatrix(), w, y), v = A.displayToWorld(d, T.viewMatrix(), T.projectionMatrix(), w, y), m = g[0] - v[0], p = g[1] - v[1], b = g[2] - v[2], n && (T.pan(-m, -p, -b), t.viewer().render()), i && (T.rotate(a.x - o.x, a.y - o.y), A.resetCameraClippingRange(), t.viewer().render()), r && (x = 2 * (o.y - a.y) / y, T.zoom(x > 0 ? 1 - Math.abs(x) : 1 + Math.abs(x)), A.resetCameraClippingRange(), t.viewer().render()), a.x = o.x, a.y = o.y, !1) : void 0
    }, this.handleMouseDown = function(e) {
        var o;
        return 0 === e.button && (i = !0), 1 === e.button && (n = !0), 2 === e.button && (r = !0), o = t.view.relMouseCoords(e), a.x = o.x < 0 ? 0 : o.x, a.y = o.y < 0 ? 0 : o.y, !1
    }, this.handleMouseUp = function(e) {
        return 0 === e.button && (i = !1), 1 === e.button && (n = !1), 2 === e.button && (r = !1), !1
    }, this.handleMouseWheel = function(e) {
        var i = t.viewer().renderWindow().activeRenderer(),
            r = i.camera();
        return r.zoom(e.originalEvent.wheelDelta < 0 ? .9 : 1.1), i.resetCameraClippingRange(), t.viewer().render(), !0
    }, this
}, inherit(vgl.trackballInteractorStyle, vgl.interactorStyle), vgl.pvwInteractorStyle = function() {
    "use strict";

    function e() {
        r.resetCameraClippingRange(), x.viewer().render()
    }
    if (!(this instanceof vgl.pvwInteractorStyle)) return new vgl.pvwInteractorStyle;
    vgl.trackballInteractorStyle.call(this);
    var t, i, r, n, o, a, l, s, u, c, h, d, g, v, f, m, p, b, x = this,
        w = !1,
        y = !1,
        A = !1,
        T = {
            x: 0,
            y: 0
        };
    return this.handleMouseMove = function(S) {
        var M = [],
            P = null,
            D = [],
            C = null;
        for (t = x.viewer().renderWindow().windowSize()[0], i = x.viewer().renderWindow().windowSize()[1], r = x.viewer().renderWindow().activeRenderer(), n = r.camera(), o = !1, a = x.viewer().relMouseCoords(S), l = {
                x: 0,
                y: 0
            }, M = x.viewer().renderWindow().renderers(), P = 0; P < M.length; ++P) r !== M[P] && D.push(M[P].camera());
        if (a.x < 0 || a.x > t ? (l.x = 0, o = !0) : l.x = a.x, a.y < 0 || a.y > i ? (l.y = 0, o = !0) : l.y = a.y, o !== !0) {
            if (s = n.focalPoint(), u = vec4.fromValues(s[0], s[1], s[2], 1), c = r.worldToDisplay(u, n.viewMatrix(), n.projectionMatrix(), t, i), h = vec4.fromValues(l.x, l.y, c[2], 1), d = vec4.fromValues(T.x, T.y, c[2], 1), g = r.displayToWorld(h, n.viewMatrix(), n.projectionMatrix(), t, i), v = r.displayToWorld(d, n.viewMatrix(), n.projectionMatrix(), t, i), f = g[0] - v[0], m = g[1] - v[1], p = g[2] - v[2], A && (n.pan(-f, -m, -p), e()), w) {
                for (C = [T.x - l.x, T.y - l.y], n.rotate(C[0], C[1]), P = 0; P < D.length; ++P) D[P].rotate(C[0], C[1]);
                for (P = 0; P < M.length; ++P) M[P].resetCameraClippingRange();
                e()
            }
            return y && (b = 2 * (l.y - T.y) / i, n.zoom(b > 0 ? 1 - Math.abs(b) : 1 + Math.abs(b)), e()), T.x = l.x, T.y = l.y, !1
        }
    }, this.handleMouseDown = function(e) {
        return 0 === e.button && (w = !0), 1 === e.button && (A = !0), 2 === e.button && (y = !0), a = x.viewer().relMouseCoords(e), T.x = a.x < 0 ? 0 : a.x, T.y = a.y < 0 ? 0 : a.y, !1
    }, this.handleMouseUp = function(e) {
        x.viewer().canvas();
        return 0 === e.button && (w = !1), 1 === e.button && (A = !1), 2 === e.button && (y = !1), !1
    }, this
}, inherit(vgl.pvwInteractorStyle, vgl.trackballInteractorStyle), vgl.viewer = function(e) {
    "use strict";
    if (!(this instanceof vgl.viewer)) return new vgl.viewer(e);
    vgl.object.call(this);
    var t = this,
        i = e,
        r = !0,
        n = null,
        o = vgl.renderer(),
        a = vgl.renderWindow(i);
    return this.canvas = function() {
        return i
    }, this.renderWindow = function() {
        return a
    }, this.init = function() {
        null !== a ? a.createWindow() : console.log("[ERROR] No render window attached")
    }, this.interactorStyle = function() {
        return n
    }, this.setInteractorStyle = function(e) {
        e !== n && (n = e, n.setViewer(this), this.modified())
    }, this.handleMouseDown = function(e) {
        if (r === !0) {
            var i = $.event.fix(e || window.event);
            2 === e.button && i.preventDefault(), i.state = "down", i.type = vgl.event.mousePress, $(t).trigger(i)
        }
        return !0
    }, this.handleMouseUp = function(e) {
        if (r === !0) {
            var i = $.event.fix(e || window.event);
            i.preventDefault(), i.state = "up", i.type = vgl.event.mouseRelease, $(t).trigger(i)
        }
        return !0
    }, this.handleMouseMove = function(e) {
        if (r === !0) {
            var i = $.event.fix(e || window.event);
            i.preventDefault(), i.type = vgl.event.mouseMove, $(t).trigger(i)
        }
        return !0
    }, this.handleMouseWheel = function(e) {
        if (r === !0) {
            var i = $.event.fix(e || window.event);
            i.preventDefault(), i.type = vgl.event.mouseWheel, $(t).trigger(i)
        }
        return !0
    }, this.handleMouseOut = function(e) {
        if (r === !0) {
            var i = $.event.fix(e || window.event);
            i.preventDefault(), i.type = vgl.event.mouseOut, $(t).trigger(i)
        }
        return !0
    }, this.handleKeyPress = function(e) {
        if (r === !0) {
            var i = $.event.fix(e || window.event);
            i.preventDefault(), i.type = vgl.event.keyPress, $(t).trigger(i)
        }
        return !0
    }, this.handleContextMenu = function(e) {
        if (r === !0) {
            var i = $.event.fix(e || window.event);
            i.preventDefault(), i.type = vgl.event.contextMenu, $(t).trigger(i)
        }
        return !1
    }, this.handleClick = function(e) {
        if (r === !0) {
            var i = $.event.fix(e || window.event);
            i.preventDefault(), i.type = vgl.event.click, $(t).trigger(i)
        }
        return !1
    }, this.handleDoubleClick = function(e) {
        if (r === !0) {
            var i = $.event.fix(e || window.event);
            i.preventDefault(), i.type = vgl.event.dblClick, $(t).trigger(i)
        }
        return !1
    }, this.relMouseCoords = function(e) {
        if (void 0 === e.pageX || void 0 === e.pageY) throw "Missing attributes pageX and pageY on the event";
        var t = 0,
            r = 0,
            n = 0,
            o = 0,
            a = i;
        do t += a.offsetLeft - a.scrollLeft, r += a.offsetTop - a.scrollTop; while (a = a.offsetParent);
        return n = e.pageX - t, o = e.pageY - r, {
            x: n,
            y: o
        }
    }, this.render = function() {
        a.render()
    }, this.bindEventHandlers = function() {
        $(i).on("mousedown", this.handleMouseDown), $(i).on("mouseup", this.handleMouseUp), $(i).on("mousemove", this.handleMouseMove), $(i).on("mousewheel", this.handleMouseWheel), $(i).on("contextmenu", this.handleContextMenu)
    }, this.unbindEventHandlers = function() {
        $(i).off("mousedown", this.handleMouseDown), $(i).off("mouseup", this.handleMouseUp), $(i).off("mousemove", this.handleMouseMove), $(i).off("mousewheel", this.handleMouseWheel), $(i).off("contextmenu", this.handleContextMenu)
    }, this._init = function() {
        this.bindEventHandlers(), a.addRenderer(o)
    }, this._init(), this
}, inherit(vgl.viewer, vgl.object), vgl.shader = function(e) {
    "use strict";
    if (!(this instanceof vgl.shader)) return new vgl.shader(e);
    vgl.object.call(this);
    var t = null,
        i = vgl.timestamp(),
        r = e,
        n = "";
    this.shaderHandle = function() {
        return t
    }, this.shaderType = function() {
        return r
    }, this.shaderSource = function() {
        return n
    }, this.setShaderSource = function(e) {
        n = e, this.modified()
    }, this.compile = function() {
        return this.getMTime() < i.getMTime() ? t : (gl.deleteShader(t), t = gl.createShader(r), gl.shaderSource(t, n), gl.compileShader(t), gl.getShaderParameter(t, gl.COMPILE_STATUS) ? (i.modified(), t) : (console.log("[ERROR] An error occurred compiling the shaders: " + gl.getShaderInfoLog(t)), console.log(n), gl.deleteShader(t), null))
    }, this.attachShader = function(e) {
        gl.attachShader(e, t)
    }
}, inherit(vgl.shader, vgl.object), vgl.shaderProgram = function() {
    "use strict";
    if (!(this instanceof vgl.shaderProgram)) return new vgl.shaderProgram;
    vgl.materialAttribute.call(this, vgl.materialAttributeType.ShaderProgram);
    var e = 0,
        t = vgl.timestamp(),
        i = [],
        r = [],
        n = {},
        o = {},
        a = {};
    return this.queryUniformLocation = function(t) {
        return gl.getUniformLocation(e, t)
    }, this.queryAttributeLocation = function(t) {
        return gl.getAttribLocation(e, t)
    }, this.addShader = function(e) {
        if (i.indexOf(e) > -1) return !1;
        var t;
        for (t = 0; t < i.length; ++t) i[t].shaderType() === e.shaderType() && i.splice(i.indexOf(e), 1);
        return i.push(e), this.modified(), !0
    }, this.addUniform = function(e) {
        return r.indexOf(e) > -1 ? !1 : (r.push(e), void this.modified())
    }, this.addVertexAttribute = function(e, t) {
        n[t] = e, this.modified()
    }, this.uniformLocation = function(e) {
        return o[e]
    }, this.attributeLocation = function(e) {
        return a[e]
    }, this.uniform = function(e) {
        var t;
        for (t = 0; t < r.length; ++t)
            if (r[t].name() === e) return r[t];
        return null
    }, this.updateUniforms = function() {
        var e;
        for (e = 0; e < r.length; ++e) r[e].callGL(o[r[e].name()])
    }, this.link = function() {
        return gl.linkProgram(e), gl.getProgramParameter(e, gl.LINK_STATUS) ? !0 : (console.log("[ERROR] Unable to initialize the shader program."), !1)
    }, this.use = function() {
        gl.useProgram(e)
    }, this.cleanUp = function() {
        this.deleteVertexAndFragment(), this.deleteProgram()
    }, this.deleteProgram = function() {
        gl.deleteProgram(e)
    }, this.deleteVertexAndFragment = function() {
        var e;
        for (e = 0; e < i.length; ++e) gl.deleteShader(i[e].shaderHandle())
    }, this.bind = function(n) {
        var o = 0;
        if (0 === e || t.getMTime() < this.getMTime()) {
            if (e = gl.createProgram(), 0 === e) return console.log("[ERROR] Cannot create Program Object"), !1;
            for (o = 0; o < i.length; ++o) i[o].compile(), i[o].attachShader(e);
            this.bindAttributes(), this.link() || (console.log("[ERROR] Failed to link Program"), this.cleanUp()), this.use(), this.bindUniforms(), t.modified()
        } else this.use();
        for (o = 0; o < r.length; ++o) r[o].update(n, this);
        this.updateUniforms()
    }, this.undoBind = function() {}, this.bindVertexData = function(e, t) {
        n.hasOwnProperty(t) && n[t].bindVertexData(e, t)
    }, this.undoBindVertexData = function(e, t) {
        n.hasOwnProperty(t) && n[t].undoBindVertexData(e, t)
    }, this.bindUniforms = function() {
        var e;
        for (e = 0; e < r.length; ++e) o[r[e].name()] = this.queryUniformLocation(r[e].name())
    }, this.bindAttributes = function() {
        var t, i;
        for (t in n) i = n[t].name(), gl.bindAttribLocation(e, t, i), a[i] = t
    }, this
}, inherit(vgl.shaderProgram, vgl.materialAttribute), vgl.texture = function() {
    "use strict";

    function e() {
        switch (i.m_textureUnit) {
            case 0:
                gl.activeTexture(gl.TEXTURE0);
                break;
            case 1:
                gl.activeTexture(gl.TEXTURE1);
                break;
            case 2:
                gl.activeTexture(gl.TEXTURE2);
                break;
            case 3:
                gl.activeTexture(gl.TEXTURE3);
                break;
            case 4:
                gl.activeTexture(gl.TEXTURE4);
                break;
            case 5:
                gl.activeTexture(gl.TEXTURE5);
                break;
            case 6:
                gl.activeTexture(gl.TEXTURE6);
                break;
            case 7:
                gl.activeTexture(gl.TEXTURE7);
                break;
            case 8:
                gl.activeTexture(gl.TEXTURE8);
                break;
            case 9:
                gl.activeTexture(gl.TEXTURE9);
                break;
            case 10:
                gl.activeTexture(gl.TEXTURE10);
                break;
            case 11:
                gl.activeTexture(gl.TEXTURE11);
                break;
            case 12:
                gl.activeTexture(gl.TEXTURE12);
                break;
            case 13:
                gl.activeTexture(gl.TEXTURE13);
                break;
            case 14:
                gl.activeTexture(gl.TEXTURE14);
                break;
            case 15:
                gl.activeTexture(gl.TEXTURE15);
                break;
            default:
                throw "[error] Texture unit " + this.m_textureUnit + " is not supported"
        }
    }
    if (!(this instanceof vgl.texture)) return new vgl.texture;
    vgl.materialAttribute.call(this, vgl.materialAttributeType.Texture), this.m_width = 0, this.m_height = 0, this.m_depth = 0, this.m_textureHandle = null, this.m_textureUnit = 0, this.m_pixelFormat = null, this.m_pixelDataType = null, this.m_internalFormat = null, this.m_image = null;
    var t = vgl.timestamp(),
        i = this;
    return this.setup = function() {
        e(), gl.deleteTexture(this.m_textureHandle), this.m_textureHandle = gl.createTexture(), gl.bindTexture(gl.TEXTURE_2D, this.m_textureHandle), gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR), gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR), gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE), gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE), gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1), gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, !0), null !== this.m_image ? (this.updateDimensions(), this.computeInternalFormatUsingImage(), gl.texImage2D(gl.TEXTURE_2D, 0, this.m_internalFormat, this.m_pixelFormat, this.m_pixelDataType, this.m_image)) : gl.texImage2D(gl.TEXTURE_2D, 0, this.m_internalFormat, this.m_pixelFormat, this.m_pixelDataType, null), gl.bindTexture(gl.TEXTURE_2D, null), t.modified()
    }, this.bind = function(i) {
        this.getMTime() > t.getMTime() && this.setup(i), e(), gl.bindTexture(gl.TEXTURE_2D, this.m_textureHandle)
    }, this.undoBind = function() {
        gl.bindTexture(gl.TEXTURE_2D, null)
    }, this.image = function() {
        return this.m_image
    }, this.setImage = function(e) {
        return null !== e ? (this.m_image = e, this.updateDimensions(), this.modified(), !0) : !1
    }, this.textureUnit = function() {
        return this.m_textureUnit
    }, this.setTextureUnit = function(e) {
        return this.m_textureUnit === e ? !1 : (this.m_textureUnit = e, this.modified(), !0)
    }, this.width = function() {
        return this.m_width
    }, this.setWidth = function(e) {
        return null === this.m_image ? !1 : (this.m_width = e, this.modified(), !0)
    }, this.depth = function() {
        return this.m_depth
    }, this.setDepth = function(e) {
        return null === this.m_image ? !1 : (this.m_depth = e, this.modified(), !0)
    }, this.textureHandle = function() {
        return this.m_textureHandle
    }, this.internalFormat = function() {
        return this.m_internalFormat
    }, this.setInternalFormat = function(e) {
        return this.m_internalFormat !== e ? (this.m_internalFormat = e, this.modified(), !0) : !1
    }, this.pixelFormat = function() {
        return this.m_pixelFormat
    }, this.setPixelFormat = function(e) {
        return null === this.m_image ? !1 : (this.m_pixelFormat = e, this.modified(), !0)
    }, this.pixelDataType = function() {
        return this.m_pixelDataType
    }, this.setPixelDataType = function(e) {
        return null === this.m_image ? !1 : (this.m_pixelDataType = e, this.modified(), !0)
    }, this.computeInternalFormatUsingImage = function() {
        this.m_internalFormat = gl.RGBA, this.m_pixelFormat = gl.RGBA, this.m_pixelDataType = gl.UNSIGNED_BYTE
    }, this.updateDimensions = function() {
        null !== this.m_image && (this.m_width = this.m_image.width, this.m_height = this.m_image.height, this.m_depth = 0)
    }, this
}, inherit(vgl.texture, vgl.materialAttribute), vgl.lookupTable = function() {
    "use strict";
    if (!(this instanceof vgl.lookupTable)) return new vgl.lookupTable;
    vgl.texture.call(this);
    var e = vgl.timestamp(),
        t = [0, 0];
    return this.m_colorTable = [.07514311, .468049805, 1, 1, .247872569, .498782363, 1, 1, .339526309, .528909511, 1, 1, .409505078, .558608486, 1, 1, .468487184, .588057293, 1, 1, .520796675, .617435078, 1, 1, .568724526, .646924167, 1, 1, .613686735, .676713218, 1, 1, .656658579, .707001303, 1, 1, .698372844, .738002964, 1, 1, .739424025, .769954435, 1, 1, .780330104, .803121429, 1, 1, .821573924, .837809045, 1, 1, .863634967, .874374691, 1, 1, .907017747, .913245283, 1, 1, .936129275, .938743558, .983038586, 1, .943467973, .943498599, .943398095, 1, .990146732, .928791426, .917447482, 1, 1, .88332677, .861943246, 1, 1, .833985467, .803839606, 1, 1, .788626485, .750707739, 1, 1, .746206642, .701389973, 1, 1, .70590052, .654994046, 1, 1, .667019783, .610806959, 1, 1, .6289553, .568237474, 1, 1, .591130233, .526775617, 1, 1, .552955184, .485962266, 1, 1, .513776083, .445364274, 1, 1, .472800903, .404551679, 1, 1, .428977855, .363073592, 1, 1, .380759558, .320428137, 1, .961891484, .313155629, .265499262, 1, .916482116, .236630659, .209939162, 1].map(function(e) {
        return 255 * e
    }), this.setup = function() {
        0 === this.textureUnit() ? gl.activeTexture(gl.TEXTURE0) : 1 === this.textureUnit() && gl.activeTexture(gl.TEXTURE1), gl.deleteTexture(this.m_textureHandle), this.m_textureHandle = gl.createTexture(), gl.bindTexture(gl.TEXTURE_2D, this.m_textureHandle), gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR), gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR), gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE), gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE), gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1), this.m_width = this.m_colorTable.length / 4, this.m_height = 1, this.m_depth = 0, gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.m_width, this.m_height, this.m_depth, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(this.m_colorTable)), gl.bindTexture(gl.TEXTURE_2D, null), e.modified()
    }, this.colorTable = function() {
        return this.m_colorTable
    }, this.setColorTable = function(e) {
        return this.m_colorTable === e ? !1 : (this.m_colorTable = e, this.modified(), !0)
    }, this.range = function() {
        return t
    }, this.setRange = function(e) {
        return t === e ? !1 : (t = e, this.modified(), !0)
    }, this.updateRange = function(e) {
        e instanceof Array || console.log("[error] Invalid data type for range. Requires array [min,max]"), e[0] < t[0] && (t[0] = e[0], this.modified()), e[1] > t[1] && (t[1] = e[1], this.modified())
    }, this
}, inherit(vgl.lookupTable, vgl.texture), vgl.uniform = function(e, t) {
    "use strict";
    if (!(this instanceof vgl.uniform)) return new vgl.uniform;
    this.getTypeNumberOfComponents = function(e) {
        switch (e) {
            case gl.FLOAT:
            case gl.INT:
            case gl.BOOL:
                return 1;
            case gl.FLOAT_VEC2:
            case gl.INT_VEC2:
            case gl.BOOL_VEC2:
                return 2;
            case gl.FLOAT_VEC3:
            case gl.INT_VEC3:
            case gl.BOOLT_VEC3:
                return 3;
            case gl.FLOAT_VEC4:
            case gl.INT_VEC4:
            case gl.BOOL_VEC4:
                return 4;
            case gl.FLOAT_MAT3:
                return 9;
            case gl.FLOAT_MAT4:
                return 16;
            default:
                return 0
        }
    };
    var i = e,
        r = t,
        n = [];
    return n.length = this.getTypeNumberOfComponents(i), this.name = function() {
        return r
    }, this.type = function() {
        return i
    }, this.get = function() {
        return n
    }, this.set = function(e) {
        var t = 0;
        if (16 === n.length)
            for (t = 0; 16 > t; ++t) n[t] = e[t];
        else if (9 === n.length)
            for (t = 0; 9 > t; ++t) n[t] = e[t];
        else if (4 === n.length)
            for (t = 0; 4 > t; ++t) n[t] = e[t];
        else if (3 === n.length)
            for (t = 0; 3 > t; ++t) n[t] = e[t];
        else if (2 === n.length)
            for (t = 0; 2 > t; ++t) n[t] = e[t];
        else n[0] = e
    }, this.callGL = function(e) {
        if (!(this.m_numberElements < 1)) switch (i) {
            case gl.BOOL:
            case gl.INT:
                gl.uniform1iv(e, n);
                break;
            case gl.FLOAT:
                gl.uniform1fv(e, n);
                break;
            case gl.FLOAT_VEC2:
                gl.uniform2fv(e, n);
                break;
            case gl.FLOAT_VEC3:
                gl.uniform3fv(e, n);
                break;
            case gl.FLOAT_VEC4:
                gl.uniform4fv(e, n);
                break;
            case gl.FLOAT_MAT3:
                gl.uniformMatrix3fv(e, gl.FALSE, n);
                break;
            case gl.FLOAT_MAT4:
                gl.uniformMatrix4fv(e, gl.FALSE, n)
        }
    }, this.update = function() {}, this
}, vgl.modelViewUniform = function(e) {
    "use strict";
    return this instanceof vgl.modelViewUniform ? (0 === e.length && (e = "modelViewMatrix"), vgl.uniform.call(this, gl.FLOAT_MAT4, e), this.set(mat4.create()), this.update = function(e) {
        this.set(e.m_modelViewMatrix)
    }, this) : new vgl.modelViewUniform(e)
}, inherit(vgl.modelViewUniform, vgl.uniform), vgl.projectionUniform = function(e) {
    "use strict";
    return this instanceof vgl.projectionUniform ? (0 === e.length && (e = "projectionMatrix"), vgl.uniform.call(this, gl.FLOAT_MAT4, e), this.set(mat4.create()), this.update = function(e) {
        this.set(e.m_projectionMatrix)
    }, this) : new vgl.projectionUniform(e)
}, inherit(vgl.projectionUniform, vgl.uniform), vgl.floatUniform = function(e, t) {
    "use strict";
    return this instanceof vgl.floatUniform ? (0 === e.length && (e = "floatUniform"), t = void 0 === t ? 1 : t, vgl.uniform.call(this, gl.FLOAT, e), void this.set(t)) : new vgl.floatUniform(e, t)
}, inherit(vgl.floatUniform, vgl.uniform), vgl.normalMatrixUniform = function(e) {
    "use strict";
    return this instanceof vgl.normalMatrixUniform ? (0 === e.length && (e = "normalMatrix"), vgl.uniform.call(this, gl.FLOAT_MAT4, e), this.set(mat4.create()), this.update = function(e) {
        this.set(e.m_normalMatrix)
    }, this) : new vgl.normalMatrixUniform(e)
}, inherit(vgl.normalMatrixUniform, vgl.uniform), vgl.vertexAttributeKeys = {
    Position: 0,
    Normal: 1,
    TextureCoordinate: 2,
    Color: 3,
    Scalar: 4,
    Scalar2: 5,
    Scalar3: 6,
    Scalar4: 7,
    Scalar5: 8,
    Scalar6: 9,
    Scalar7: 10,
    CountAttributeIndex: 11
}, vgl.vertexAttribute = function(e) {
    "use strict";
    if (!(this instanceof vgl.vertexAttribute)) return new vgl.vertexAttribute(e);
    var t = e;
    this.name = function() {
        return t
    }, this.bindVertexData = function(e, i) {
        var r = e.m_mapper.geometryData(),
            n = r.sourceData(i),
            o = e.m_material.shaderProgram();
        gl.vertexAttribPointer(o.attributeLocation(t), n.attributeNumberOfComponents(i), n.attributeDataType(i), n.normalized(i), n.attributeStride(i), n.attributeOffset(i)), gl.enableVertexAttribArray(o.attributeLocation(t))
    }, this.undoBindVertexData = function(e) {
        var i = e.m_material.shaderProgram();
        gl.disableVertexAttribArray(i.attributeLocation(t))
    }
}, vgl.source = function() {
    "use strict";
    return this instanceof vgl.source ? (vgl.object.call(this), this.create = function() {}, this) : new vgl.source
}, inherit(vgl.source, vgl.object), vgl.planeSource = function() {
    "use strict";
    if (!(this instanceof vgl.planeSource)) return new vgl.planeSource;
    vgl.source.call(this);
    var e = [0, 0, 0],
        t = [1, 0, 0],
        i = [0, 1, 0],
        r = [0, 0, 1],
        n = 1,
        o = 1,
        a = null;
    this.setOrigin = function(t, i, r) {
        e[0] = t, e[1] = i, e[2] = r
    }, this.setPoint1 = function(e, i, r) {
        t[0] = e, t[1] = i, t[2] = r
    }, this.setPoint2 = function(e, t, r) {
        i[0] = e, i[1] = t, i[2] = r
    }, this.create = function() {
        a = new vgl.geometryData;
        var l, s, u, c, h, d, g, v = [],
            f = [],
            m = [],
            p = [],
            b = [],
            x = 0,
            w = 0,
            y = 0,
            A = 0,
            T = [],
            S = [],
            M = [],
            P = [],
            D = [],
            C = null,
            _ = null,
            R = null;
        for (v.length = 3, f.length = 2, m.length = 3, p.length = 3, b.length = 3, l = 0; 3 > l; l++) m[l] = t[l] - e[l], p[l] = i[l] - e[l];
        for (h = (n + 1) * (o + 1), d = n * o * 2, T.length = 3 * h, S.length = 3 * h, P.length = 2 * h, D.length = h, u = 0, l = 0; o + 1 > l; l++)
            for (f[1] = l / o, s = 0; n + 1 > s; s++) {
                for (f[0] = s / n, c = 0; 3 > c; c++) v[c] = e[c] + f[0] * m[c] + f[1] * p[c];
                T[x++] = v[0], T[x++] = v[1], T[x++] = v[2], M[y++] = 1, M[y++] = 1, M[y++] = 1, S[w++] = r[0], S[w++] = r[1], S[w++] = r[2], P[A++] = f[0], P[A++] = f[1]
            }
        for (l = 0; o > l; l++)
            for (s = 0; n > s; s++) b[0] = s + l * (n + 1), b[1] = b[0] + 1, b[2] = b[0] + n + 2, b[3] = b[0] + n + 1;
        for (l = 0; h > l; ++l) D[l] = l;
        return C = new vgl.triangleStrip, C.setIndices(D), _ = vgl.sourceDataP3fv(), _.pushBack(T), R = vgl.sourceDataC3fv(), R.pushBack(M), g = vgl.sourceDataT2fv(), g.pushBack(P), a.addSource(_), a.addSource(R), a.addSource(g), a.addPrimitive(C), a
    }
}, inherit(vgl.planeSource, vgl.source), vgl.pointSource = function() {
    "use strict";
    if (!(this instanceof vgl.pointSource)) return new vgl.pointSource;
    vgl.source.call(this);
    var e = this,
        t = [],
        i = [],
        r = [],
        n = [],
        o = null;
    this.getPositions = function() {
        return t
    }, this.setPositions = function(i) {
        i instanceof Array ? t = i : console.log("[ERROR] Invalid data type for positions. Array is required."), e.modified()
    }, this.getColors = function() {
        return i
    }, this.setColors = function(t) {
        t instanceof Array ? i = t : console.log("[ERROR] Invalid data type for colors. Array is required."), e.modified()
    }, this.getSize = function() {
        return n
    }, this.setSize = function(e) {
        n = e, this.modified()
    }, this.setTextureCoordinates = function(t) {
        t instanceof Array ? r = t : console.log("[ERROR] Invalid data type for texture coordinates. Array is required."), e.modified()
    }, this.create = function() {
        if (o = new vgl.geometryData, t.length % 3 !== 0) return void console.log("[ERROR] Invalid length of the points array");
        var e, a, l, s, u, c = t.length / 3,
            h = 0,
            d = [];
        for (d.length = c, h = 0; c > h; ++h) d[h] = h;
        if (u = vgl.sourceDataDf(), c !== n.length)
            for (h = 0; c > h; ++h) u.pushBack(n);
        else u.setData(n);
        return o.addSource(u), e = new vgl.points, e.setIndices(d), a = vgl.sourceDataP3fv(), a.pushBack(t), o.addSource(a), i.length > 0 && i.length === t.length ? (l = vgl.sourceDataC3fv(), l.pushBack(i), o.addSource(l)) : i.length > 0 && i.length !== t.length && console.log("[ERROR] Number of colors are different than number of points"), r.length > 0 && r.length === t.length ? (s = vgl.sourceDataT2fv(), s.pushBack(r), o.addSource(s)) : r.length > 0 && r.length / 2 !== t.length / 3 && console.log("[ERROR] Number of texture coordinates are different than number of points"), o.addPrimitive(e), o
    }
}, inherit(vgl.pointSource, vgl.source), vgl.lineSource = function(e, t) {
    "use strict";
    if (!(this instanceof vgl.lineSource)) return new vgl.lineSource;
    vgl.source.call(this);
    var i = e,
        r = t;
    this.setPositions = function(e) {
        return e instanceof Array ? (i = e, this.modified(), !0) : (console.log("[ERROR] Invalid data type for positions. Array is required."), !1)
    }, this.setColors = function(e) {
        return e instanceof Array ? (r = e, this.modified(), !0) : (console.log("[ERROR] Invalid data type for colors. Array is required."), !1)
    }, this.create = function() {
        if (!i) return void console.log("[error] Invalid positions");
        if (i.length % 3 !== 0) return void console.log("[error] Line source requires 3d points");
        if (i.length % 3 !== 0) return void console.log("[ERROR] Invalid length of the points array");
        var e, t, n, o, a = new vgl.geometryData,
            l = i.length / 3,
            s = [];
        for (s.length = l, e = 0; l > e; ++e) s[e] = e;
        return t = new vgl.lines, t.setIndices(s), n = vgl.sourceDataP3fv(), n.pushBack(i), a.addSource(n), r && r.length > 0 && r.length === i.length ? (o = vgl.sourceDataC3fv(), o.pushBack(r), a.addSource(o)) : r && r.length > 0 && r.length !== i.length && console.log("[error] Number of colors are different than number of points"), a.addPrimitive(t), a
    }
}, inherit(vgl.lineSource, vgl.source), vgl.utils = function() {
    "use strict";
    return this instanceof vgl.utils ? (vgl.object.call(this), this) : new vgl.utils
}, inherit(vgl.utils, vgl.object), vgl.utils.computePowerOfTwo = function(e, t) {
    "use strict";
    for (t = t || 1; e > t;) t *= 2;
    return t
}, vgl.utils.createTextureVertexShader = function() {
    "use strict";
    var e = ["attribute vec3 vertexPosition;", "attribute vec3 textureCoord;", "uniform mediump float pointSize;", "uniform mat4 modelViewMatrix;", "uniform mat4 projectionMatrix;", "varying highp vec3 iTextureCoord;", "void main(void)", "{", "gl_PointSize = pointSize;", "gl_Position = projectionMatrix * modelViewMatrix * vec4(vertexPosition, 1.0);", " iTextureCoord = textureCoord;", "}"].join("\n"),
        t = new vgl.shader(gl.VERTEX_SHADER);
    return t.setShaderSource(e), t
}, vgl.utils.createTextureFragmentShader = function() {
    "use strict";
    var e = ["varying highp vec3 iTextureCoord;", "uniform sampler2D sampler2d;", "uniform mediump float opacity;", "void main(void) {", "gl_FragColor = vec4(texture2D(sampler2d, vec2(iTextureCoord.s, iTextureCoord.t)).xyz, opacity);", "}"].join("\n"),
        t = new vgl.shader(gl.FRAGMENT_SHADER);
    return t.setShaderSource(e), t
}, vgl.utils.createRgbaTextureFragmentShader = function() {
    "use strict";
    var e = ["varying highp vec3 iTextureCoord;", "uniform sampler2D sampler2d;", "void main(void) {", "gl_FragColor = vec4(texture2D(sampler2d, vec2(iTextureCoord.s, iTextureCoord.t)).xyzw);", "}"].join("\n"),
        t = new vgl.shader(gl.FRAGMENT_SHADER);
    return t.setShaderSource(e), t
}, vgl.utils.createVertexShader = function() {
    "use strict";
    var e = ["attribute vec3 vertexPosition;", "attribute vec3 vertexColor;", "uniform mediump float pointSize;", "uniform mat4 modelViewMatrix;", "uniform mat4 projectionMatrix;", "varying mediump vec3 iVertexColor;", "varying highp vec3 iTextureCoord;", "void main(void)", "{", "gl_PointSize = pointSize;", "gl_Position = projectionMatrix * modelViewMatrix * vec4(vertexPosition, 1.0);", " iVertexColor = vertexColor;", "}"].join("\n"),
        t = new vgl.shader(gl.VERTEX_SHADER);
    return t.setShaderSource(e), t
}, vgl.utils.createPointVertexShader = function() {
    "use strict";
    var e = ["attribute vec3 vertexPosition;", "attribute vec3 vertexColor;", "attribute float vertexSize;", "uniform mat4 modelViewMatrix;", "uniform mat4 projectionMatrix;", "varying mediump vec3 iVertexColor;", "varying highp vec3 iTextureCoord;", "void main(void)", "{", "gl_PointSize =  vertexSize;", "gl_Position = projectionMatrix * modelViewMatrix * vec4(vertexPosition, 1.0);", " iVertexColor = vertexColor;", "}"].join("\n"),
        t = new vgl.shader(gl.VERTEX_SHADER);
    return t.setShaderSource(e), t
}, vgl.utils.createVertexShaderSolidColor = function() {
    "use strict";
    var e = ["attribute vec3 vertexPosition;", "uniform mediump float pointSize;", "uniform mat4 modelViewMatrix;", "uniform mat4 projectionMatrix;", "void main(void)", "{", "gl_PointSize = pointSize;", "gl_Position = projectionMatrix * modelViewMatrix * vec4(vertexPosition, 1.0);", "}"].join("\n"),
        t = new vgl.shader(gl.VERTEX_SHADER);
    return t.setShaderSource(e), t
}, vgl.utils.createVertexShaderColorMap = function() {
    "use strict";
    var e = ["attribute vec3 vertexPosition;", "attribute float vertexScalar;", "uniform mediump float pointSize;", "uniform mat4 modelViewMatrix;", "uniform mat4 projectionMatrix;", "uniform float lutMin;", "uniform float lutMax;", "varying mediump float iVertexScalar;", "void main(void)", "{", "gl_PointSize = pointSize;", "gl_Position = projectionMatrix * modelViewMatrix * vec4(vertexPosition, 1.0);", "iVertexScalar = (vertexScalar-lutMin)/(lutMax-lutMin);", "}"].join("\n"),
        t = new vgl.shader(gl.VERTEX_SHADER);
    return t.setShaderSource(e), t
}, vgl.utils.createFragmentShader = function() {
    "use strict";
    var e = ["varying mediump vec3 iVertexColor;", "uniform mediump float opacity;", "void main(void) {", "gl_FragColor = vec4(iVertexColor, opacity);", "}"].join("\n"),
        t = new vgl.shader(gl.FRAGMENT_SHADER);
    return t.setShaderSource(e), t
}, vgl.utils.createPhongVertexShader = function() {
    "use strict";
    var e = ["attribute highp vec3 vertexPosition;", "attribute mediump vec3 vertexNormal;", "attribute mediump vec3 vertexColor;", "uniform highp mat4 projectionMatrix;", "uniform mat4 modelViewMatrix;", "uniform mat4 normalMatrix;", "varying highp vec4 varPosition;", "varying mediump vec3 varNormal;", "varying mediump vec3 iVertexColor;", "void main(void)", "{", "varPosition = modelViewMatrix * vec4(vertexPosition, 1.0);", "gl_Position = projectionMatrix * varPosition;", "varNormal = vec3(normalMatrix * vec4(vertexNormal, 0.0));", "iVertexColor = vertexColor;", "}"].join("\n"),
        t = new vgl.shader(gl.VERTEX_SHADER);
    return t.setShaderSource(e), t
}, vgl.utils.createPhongFragmentShader = function() {
    "use strict";
    var e = ["precision mediump float;", "varying vec3 varNormal;", "varying vec4 varPosition;", "varying mediump vec3 iVertexColor;", "const vec3 lightPos = vec3(0.0, 0.0,10000.0);", "const vec3 ambientColor = vec3(0.01, 0.01, 0.01);", "const vec3 specColor = vec3(1.0, 1.0, 1.0);", "void main() {", "vec3 normal = normalize(varNormal);", "vec3 lightDir = normalize(lightPos);", "vec3 reflectDir = -reflect(lightDir, normal);", "vec3 viewDir = normalize(-varPosition.xyz);", "float lambertian = max(dot(lightDir,normal), 0.0);", "float specular = 0.0;", "if(lambertian > 0.0) {", "float specAngle = max(dot(reflectDir, viewDir), 0.0);", "specular = pow(specAngle, 64.0);", "}", "gl_FragColor = vec4(ambientColor +", "lambertian*iVertexColor +", "specular*specColor, 1.0);", "}"].join("\n"),
        t = new vgl.shader(gl.FRAGMENT_SHADER);
    return t.setShaderSource(e), t
}, vgl.utils.createFragmentShaderSolidColor = function(e, t) {
    "use strict";
    var i = ["uniform mediump float opacity;", "void main(void) {", "gl_FragColor = vec4(" + t[0] + "," + t[1] + "," + t[2] + ", opacity);", "}"].join("\n"),
        r = new vgl.shader(gl.FRAGMENT_SHADER);
    return r.setShaderSource(i), r
}, vgl.utils.createFragmentShaderColorMap = function() {
    "use strict";
    var e = ["varying mediump float iVertexScalar;", "uniform sampler2D sampler2d;", "uniform mediump float opacity;", "void main(void) {", "gl_FragColor = vec4(texture2D(sampler2d, vec2(iVertexScalar, 0.0)).xyz, opacity);", "}"].join("\n"),
        t = new vgl.shader(gl.FRAGMENT_SHADER);
    return t.setShaderSource(e), t
}, vgl.utils.createPointSpritesVertexShader = function() {
    "use strict";
    var e = ["attribute vec3 vertexPosition;", "attribute vec3 vertexColor;", "uniform mediump vec2 pointSize;", "uniform mat4 modelViewMatrix;", "uniform mat4 projectionMatrix;", "uniform float height;", "varying mediump vec3 iVertexColor;", "varying highp float iVertexScalar;", "void main(void)", "{", "mediump float realPointSize = pointSize.y;", "if (pointSize.x > pointSize.y) {", "  realPointSize = pointSize.x;}", "gl_PointSize = realPointSize ;", "iVertexScalar = vertexPosition.z;", "gl_Position = projectionMatrix * modelViewMatrix * vec4(vertexPosition.xy, height, 1.0);", " iVertexColor = vertexColor;", "}"].join("\n"),
        t = new vgl.shader(gl.VERTEX_SHADER);
    return t.setShaderSource(e), t
}, vgl.utils.createPointSpritesFragmentShader = function() {
    "use strict";
    var e = ["varying mediump vec3 iVertexColor;", "varying highp float iVertexScalar;", "uniform sampler2D opacityLookup;", "uniform highp float lutMin;", "uniform highp float lutMax;", "uniform sampler2D scalarsToColors;", "uniform int useScalarsToColors;", "uniform int useVertexColors;", "uniform mediump vec2 pointSize;", "uniform mediump float vertexColorWeight;", "void main(void) {", "mediump vec2 realTexCoord;", "if (pointSize.x > pointSize.y) {", "  realTexCoord = vec2(1.0, pointSize.y/pointSize.x) * gl_PointCoord;", "} else {", "  realTexCoord = vec2(pointSize.x/pointSize.y, 1.0) * gl_PointCoord;", "}", "highp float texOpacity = texture2D(opacityLookup, realTexCoord).w;", "if (useScalarsToColors == 1) {", "  gl_FragColor = vec4(texture2D(scalarsToColors, vec2((iVertexScalar - lutMin)/(lutMax - lutMin), 0.0)).xyz, texOpacity);", "} else if (useVertexColors == 1) {", "  gl_FragColor = vec4(iVertexColor, texOpacity);", "} else {", "  gl_FragColor = vec4(texture2D(opacityLookup, realTexCoord).xyz, texOpacity);", "}}"].join("\n"),
        t = new vgl.shader(gl.FRAGMENT_SHADER);
    return t.setShaderSource(e), t
}, vgl.utils.createTextureMaterial = function(e) {
    "use strict";
    var t = new vgl.material,
        i = new vgl.blend,
        r = new vgl.shaderProgram,
        n = vgl.utils.createTextureVertexShader(gl),
        o = null,
        a = new vgl.vertexAttribute("vertexPosition"),
        l = new vgl.vertexAttribute("textureCoord"),
        s = new vgl.floatUniform("pointSize", 5),
        u = new vgl.modelViewUniform("modelViewMatrix"),
        c = new vgl.projectionUniform("projectionMatrix"),
        h = new vgl.uniform(gl.INT, "sampler2d"),
        d = null;
    return h.set(0), r.addVertexAttribute(a, vgl.vertexAttributeKeys.Position), r.addVertexAttribute(l, vgl.vertexAttributeKeys.TextureCoordinate), r.addUniform(s), r.addUniform(u), r.addUniform(c), e ? o = vgl.utils.createRgbaTextureFragmentShader(gl) : (o = vgl.utils.createTextureFragmentShader(gl), d = new vgl.floatUniform("opacity", 1), r.addUniform(d)), r.addShader(o), r.addShader(n), t.addAttribute(r), t.addAttribute(i), t
}, vgl.utils.createGeometryMaterial = function() {
    "use strict";
    var e = new vgl.material,
        t = new vgl.blend,
        i = new vgl.shaderProgram,
        r = 5,
        n = .5,
        o = vgl.utils.createVertexShader(gl),
        a = vgl.utils.createFragmentShader(gl),
        l = new vgl.vertexAttribute("vertexPosition"),
        s = new vgl.vertexAttribute("vertexColor"),
        u = new vgl.floatUniform("pointSize", r),
        c = new vgl.floatUniform("opacity", n),
        h = new vgl.modelViewUniform("modelViewMatrix"),
        d = new vgl.projectionUniform("projectionMatrix");
    return i.addVertexAttribute(l, vgl.vertexAttributeKeys.Position), i.addVertexAttribute(s, vgl.vertexAttributeKeys.Color), i.addUniform(u), i.addUniform(c), i.addUniform(h), i.addUniform(d), i.addShader(a), i.addShader(o), e.addAttribute(i), e.addAttribute(t), e
}, vgl.utils.createPointGeometryMaterial = function(e) {
    "use strict";
    var t = new vgl.material,
        i = new vgl.blend,
        r = new vgl.shaderProgram,
        e = void 0 === e ? 1 : e,
        n = vgl.utils.createPointVertexShader(gl),
        o = vgl.utils.createFragmentShader(gl),
        a = new vgl.vertexAttribute("vertexPosition"),
        l = new vgl.vertexAttribute("vertexColor"),
        s = new vgl.vertexAttribute("vertexSize"),
        u = new vgl.floatUniform("opacity", e),
        c = new vgl.modelViewUniform("modelViewMatrix"),
        h = new vgl.projectionUniform("projectionMatrix");
    return r.addVertexAttribute(a, vgl.vertexAttributeKeys.Position), r.addVertexAttribute(l, vgl.vertexAttributeKeys.Color), r.addVertexAttribute(s, vgl.vertexAttributeKeys.Scalar), r.addUniform(u), r.addUniform(c), r.addUniform(h), r.addShader(o), r.addShader(n), t.addAttribute(r), t.addAttribute(i), t
}, vgl.utils.createPhongMaterial = function() {
    "use strict";
    var e = new vgl.material,
        t = new vgl.blend,
        i = new vgl.shaderProgram,
        r = vgl.utils.createPhongVertexShader(gl),
        n = vgl.utils.createPhongFragmentShader(gl),
        o = new vgl.vertexAttribute("vertexPosition"),
        a = new vgl.vertexAttribute("vertexNormal"),
        l = new vgl.vertexAttribute("vertexColor"),
        s = new vgl.floatUniform("opacity", 1),
        u = new vgl.modelViewUniform("modelViewMatrix"),
        c = new vgl.normalMatrixUniform("normalMatrix"),
        h = new vgl.projectionUniform("projectionMatrix");
    return i.addVertexAttribute(o, vgl.vertexAttributeKeys.Position), i.addVertexAttribute(a, vgl.vertexAttributeKeys.Normal), i.addVertexAttribute(l, vgl.vertexAttributeKeys.Color), i.addUniform(s), i.addUniform(u), i.addUniform(h), i.addUniform(c), i.addShader(n), i.addShader(r), e.addAttribute(i), e.addAttribute(t), e
}, vgl.utils.createColorMaterial = function() {
    "use strict";
    var e = new vgl.material,
        t = new vgl.blend,
        i = new vgl.shaderProgram,
        r = vgl.utils.createVertexShader(gl),
        n = vgl.utils.createFragmentShader(gl),
        o = new vgl.vertexAttribute("vertexPosition"),
        a = new vgl.vertexAttribute("textureCoord"),
        l = new vgl.vertexAttribute("vertexColor"),
        s = new vgl.floatUniform("pointSize", 5),
        u = new vgl.floatUniform("opacity", .5),
        c = new vgl.modelViewUniform("modelViewMatrix"),
        h = new vgl.projectionUniform("projectionMatrix");
    return i.addVertexAttribute(o, vgl.vertexAttributeKeys.Position), i.addVertexAttribute(l, vgl.vertexAttributeKeys.Color), i.addVertexAttribute(a, vgl.vertexAttributeKeys.TextureCoordinate), i.addUniform(s), i.addUniform(u), i.addUniform(c), i.addUniform(h), i.addShader(n), i.addShader(r), e.addAttribute(i), e.addAttribute(t), e
}, vgl.utils.createColorMappedMaterial = function(e) {
    "use strict";
    e || (e = new vgl.lookupTable);
    var t = e.range(),
        i = new vgl.material,
        r = new vgl.blend,
        n = new vgl.shaderProgram,
        o = vgl.utils.createVertexShaderColorMap(gl, t[0], t[1]),
        a = vgl.utils.createFragmentShaderColorMap(gl),
        l = new vgl.vertexAttribute("vertexPosition"),
        s = new vgl.vertexAttribute("vertexScalar"),
        u = new vgl.floatUniform("pointSize", 5),
        c = new vgl.floatUniform("opacity", .5),
        h = new vgl.floatUniform("lutMin", t[0]),
        d = new vgl.floatUniform("lutMax", t[1]),
        g = new vgl.modelViewUniform("modelViewMatrix"),
        v = new vgl.projectionUniform("projectionMatrix"),
        f = new vgl.uniform(gl.FLOAT, "sampler2d"),
        m = e;
    return f.set(0), n.addVertexAttribute(l, vgl.vertexAttributeKeys.Position), n.addVertexAttribute(s, vgl.vertexAttributeKeys.Scalar), n.addUniform(u), n.addUniform(c), n.addUniform(h), n.addUniform(d), n.addUniform(g), n.addUniform(v), n.addShader(a), n.addShader(o), i.addAttribute(n), i.addAttribute(r), i.addAttribute(m), i
}, vgl.utils.updateColorMappedMaterial = function(e, t) {
    "use strict";
    if (!e) return void console.log("[warning] Invalid material. Nothing to update.");
    if (!t) return void console.log("[warning] Invalid lookup table. Nothing to update.");
    var i = e.shaderProgram().uniform("lutMin"),
        r = e.shaderProgram().uniform("lutMax");
    i.set(t.range()[0]), r.set(t.range()[1]), e.setAttribute(t)
}, vgl.utils.createSolidColorMaterial = function(e) {
    "use strict";
    e || (e = [1, 1, 1]);
    var t = new vgl.material,
        i = new vgl.blend,
        r = new vgl.shaderProgram,
        n = vgl.utils.createVertexShaderSolidColor(gl),
        o = vgl.utils.createFragmentShaderSolidColor(gl, e),
        a = new vgl.vertexAttribute("vertexPosition"),
        l = new vgl.floatUniform("pointSize", 5),
        s = new vgl.floatUniform("opacity", 1),
        u = new vgl.modelViewUniform("modelViewMatrix"),
        c = new vgl.projectionUniform("projectionMatrix");
    return r.addVertexAttribute(a, vgl.vertexAttributeKeys.Position), r.addUniform(l), r.addUniform(s), r.addUniform(u), r.addUniform(c), r.addShader(o), r.addShader(n), t.addAttribute(r), t.addAttribute(i), t
}, vgl.utils.createPointSpritesMaterial = function(e, t) {
    "use strict";
    var i = void 0 === t ? [0, 1] : t.range(),
        r = new vgl.material,
        n = new vgl.blend,
        o = new vgl.shaderProgram,
        a = vgl.utils.createPointSpritesVertexShader(gl),
        l = vgl.utils.createPointSpritesFragmentShader(gl),
        s = new vgl.vertexAttribute("vertexPosition"),
        u = new vgl.vertexAttribute("vertexColor"),
        c = new vgl.floatUniform("height", 0),
        h = new vgl.floatUniform("vertexColorWeight", 0),
        d = new vgl.floatUniform("lutMin", i[0]),
        g = new vgl.floatUniform("lutMax", i[1]),
        v = new vgl.modelViewUniform("modelViewMatrix"),
        f = new vgl.projectionUniform("projectionMatrix"),
        m = new vgl.uniform(gl.INT, "opacityLookup"),
        p = new vgl.uniform(gl.INT, "scalarsToColors"),
        b = new vgl.uniform(gl.INT, "useScalarsToColors"),
        x = new vgl.uniform(gl.INT, "useVertexColors"),
        w = new vgl.uniform(gl.FLOAT_VEC2, "pointSize"),
        y = new vgl.texture;
    return m.set(0), p.set(1), b.set(0), x.set(0), w.set([1, 1]), o.addVertexAttribute(s, vgl.vertexAttributeKeys.Position), o.addVertexAttribute(u, vgl.vertexAttributeKeys.Color), o.addUniform(c), o.addUniform(h), o.addUniform(v), o.addUniform(f), o.addUniform(m), o.addUniform(x), o.addUniform(b), o.addUniform(w), o.addShader(l), o.addShader(a), r.addAttribute(o), r.addAttribute(n), t && (o.addUniform(p), b.set(1), o.addUniform(d), o.addUniform(g), t.setTextureUnit(1), r.addAttribute(t)), y.setImage(e), y.setTextureUnit(0), r.addAttribute(y), r
}, vgl.utils.createPlane = function(e, t, i, r, n, o, a, l, s) {
    "use strict";
    var u = new vgl.mapper,
        c = new vgl.planeSource,
        h = vgl.utils.createGeometryMaterial(),
        d = new vgl.actor;
    return c.setOrigin(e, t, i), c.setPoint1(r, n, o), c.setPoint2(a, l, s), u.setGeometryData(c.create()), d.setMapper(u), d.setMaterial(h), d
}, vgl.utils.createTexturePlane = function(e, t, i, r, n, o, a, l, s, u) {
    "use strict";
    var c = new vgl.mapper,
        h = new vgl.planeSource,
        d = vgl.utils.createTextureMaterial(u),
        g = new vgl.actor;
    return h.setOrigin(e, t, i), h.setPoint1(r, n, o), h.setPoint2(a, l, s), c.setGeometryData(h.create()), g.setMapper(c), g.setMaterial(d), g
}, vgl.utils.createPoints = function(e, t, i, r, n) {
    "use strict";
    if (!e) return console.log("[ERROR] Cannot create points without positions"), null;
    var n = void 0 === n ? 1 : n,
        o = new vgl.mapper,
        a = new vgl.pointSource,
        l = vgl.utils.createPointGeometryMaterial(n),
        s = new vgl.actor;
    return a.setPositions(e), i && a.setColors(i), r && a.setTextureCoordinates(r), a.setSize(t ? t : 1), o.setGeometryData(a.create()), s.setMapper(o), s.setMaterial(l), s
}, vgl.utils.createPointSprites = function(e, t, i, r) {
    "use strict";
    if (!e) return console.log("[ERROR] Point sprites requires an image"), null;
    if (!t) return console.log("[ERROR] Cannot create points without positions"), null;
    var n = new vgl.mapper,
        o = new vgl.pointSource,
        a = vgl.utils.createPointSpritesMaterial(e),
        l = new vgl.actor;
    return o.setPositions(t), i && o.setColors(i), r && o.setTextureCoordinates(r), n.setGeometryData(o.create()), l.setMapper(n), l.setMaterial(a), l
}, vgl.utils.createLines = function(e, t) {
    "use strict";
    if (!e) return console.log("[ERROR] Cannot create points without positions"), null;
    var i = new vgl.mapper,
        r = new vgl.lineSource,
        n = vgl.utils.createGeometryMaterial(),
        o = new vgl.actor;
    return r.setPositions(e), t && r.setColors(t), i.setGeometryData(r.create()), o.setMapper(i), o.setMaterial(n), o
}, vgl.utils.createColorLegend = function(e, t, i, r, n, o, a) {
    "use strict";

    function l(e, t, i) {
        if (!t) return void console.log("[error] Create labels requires positions (x,y,z) array");
        if (t.length % 3 !== 0) return void console.log("[error] Create labels require positions array contain 3d points");
        if (!i) return void console.log("[error] Create labels requires Valid range");
        var r, n = null,
            o = vgl.utils.computePowerOfTwo(48),
            a = 0,
            l = [],
            s = [],
            u = [],
            c = [],
            h = t[6] - t[0],
            d = 4;
        for (s.length = 3, u.length = 3, c.length = 3, r = 0; 2 > r; ++r) a = r * (t.length - 3), s[0] = t[a] - h, s[1] = t[a + 1] - 2 * h, s[2] = t[a + 2], u[0] = t[a] + h, u[1] = s[1], u[2] = s[2], c[0] = s[0], c[1] = t[1], c[2] = s[2], n = vgl.utils.createTexturePlane(s[0], s[1], s[2], u[0], u[1], u[2], c[0], c[1], c[2], !0), n.setReferenceFrame(vgl.boundingObject.ReferenceFrame.Absolute), n.material().setBinNumber(vgl.material.RenderBin.Overlay), n.material().addAttribute(vgl.utils.create2DTexture(i[r].toFixed(2).toString(), 12, null)), l.push(n);
        return s[0] = .5 * (t[0] + t[t.length - 3] - o), s[1] = t[1] + d, s[2] = t[2], u[0] = s[0] + o, u[1] = s[1], u[2] = s[2], c[0] = s[0], c[1] = s[1] + o, c[2] = s[2], n = vgl.utils.createTexturePlane(s[0], s[1], s[2], u[0], u[1], u[2], c[0], c[1], c[2], !0), n.setReferenceFrame(vgl.boundingObject.ReferenceFrame.Absolute), n.material().setBinNumber(vgl.material.RenderBin.Overlay), n.material().addAttribute(vgl.utils.create2DTexture(e, 24, null)), l.push(n), l
    }

    function s(e, t, i, r, n, o, a, s, u, c, h, d, g, v) {
        var f = u - o,
            m = null,
            p = f / d,
            b = [],
            x = [];
        for (m = 0; d >= m; ++m) b.push(o + p * m), b.push(a), b.push(s), b.push(o + p * m), b.push(a + v), b.push(s);
        return x = x.concat(l(e, b, t.range()))
    }
    if (!t) return console.log("[error] Invalid lookup table"), [];
    var u = i[0] + r,
        c = i[1],
        h = 0,
        d = i[0],
        g = i[1] + n,
        v = 0,
        f = [],
        m = null,
        p = null,
        b = vgl.groupNode();
    return m = vgl.utils.createTexturePlane(i[0], i[1], i[2], u, c, h, d, g, v, !0), p = m.material(), p.addAttribute(t), m.setMaterial(p), b.addChild(m), m.material().setBinNumber(vgl.material.RenderBin.Overlay), m.setReferenceFrame(vgl.boundingObject.ReferenceFrame.Absolute), f.push(m), f = f.concat(s(e, t, i[0], i[1], i[1], d, c, h, u, c, h, o, a, 5, 3))
}, vgl.utils.create2DTexture = function(e, t, i, r, n, o, a) {
    "use strict";
    var l = document.getElementById("textRendering"),
        s = null,
        u = vgl.texture();
    return r = r || "sans-serif", n = n || "center", o = o || "bottom", "undefined" == typeof a && (a = !0), l || (l = document.createElement("canvas")), s = l.getContext("2d"), l.setAttribute("id", "textRendering"), l.style.display = "none", l.height = vgl.utils.computePowerOfTwo(8 * t), l.width = l.height, s.fillStyle = "rgba(0, 0, 0, 0)", s.fillRect(0, 0, s.canvas.width, s.canvas.height), s.fillStyle = "rgba(200, 85, 10, 1.0)", s.textAlign = n, s.textBaseline = o, s.font = 4 * t + "px " + r, a && (s.font = "bold " + s.font), s.fillText(e, l.width / 2, l.height / 2, l.width), u.setImage(l), u.updateDimensions(), u
}, vgl.picker = function() {
    "use strict";
    if (!(this instanceof vgl.picker)) return new vgl.picker;
    vgl.object.call(this);
    var e = [];
    return this.getActors = function() {
        return e
    }, this.pick = function(t, i, r) {
        if ("undefined" == typeof t) return 0;
        if ("undefined" == typeof i) return 0;
        if ("undefined" == typeof r) return 0;
        e = [];
        var n, o, a, l, s, u, c, h, d, g, v, f = r.camera(),
            m = r.width(),
            p = r.height(),
            b = f.focalPoint(),
            x = vec4.fromValues(b[0], b[1], b[2], 1),
            w = r.worldToDisplay(x, f.viewMatrix(), f.projectionMatrix(), m, p),
            y = vec4.fromValues(t, i, w[2], 1),
            A = r.displayToWorld(y, f.viewMatrix(), f.projectionMatrix(), m, p),
            T = f.position(),
            S = [];
        for (a = 0; 3 > a; ++a) S[a] = A[a] - T[a];
        for (n = r.sceneRoot().children(), o = 0, a = 0; a < n.length; ++a)
            if (v = n[a], v.visible() === !0) {
                if (l = v.bounds(), S[0] >= 0 ? (s = (l[0] - T[0]) / S[0], u = (l[1] - T[0]) / S[0]) : (s = (l[1] - T[0]) / S[0], u = (l[0] - T[0]) / S[0]), S[1] >= 0 ? (c = (l[2] - T[1]) / S[1], h = (l[3] - T[1]) / S[1]) : (c = (l[3] - T[1]) / S[1], h = (l[2] - T[1]) / S[1]), s > h || c > u) continue;
                if (c > s && (s = c), u > h && (u = h), S[2] >= 0 ? (d = (l[4] - T[2]) / S[2], g = (l[5] - T[2]) / S[2]) : (d = (l[5] - T[2]) / S[2], g = (l[4] - T[2]) / S[2]), s > g || d > u) continue;
                d > s && (s = d), u > g && (u = g), e[o++] = v
            }
        return o
    }, this
}, inherit(vgl.picker, vgl.object), vgl.shapefileReader = function() {
    "use strict";
    if (!(this instanceof vgl.shapefileReader)) return new vgl.shapefileReader;
    var e = this,
        t = 0,
        i = 1,
        r = 5,
        n = 3;
    return this.int8 = function(e, t) {
        return e.charCodeAt(t)
    }, this.bint32 = function(e, t) {
        return ((255 & e.charCodeAt(t)) << 24) + ((255 & e.charCodeAt(t + 1)) << 16) + ((255 & e.charCodeAt(t + 2)) << 8) + (255 & e.charCodeAt(t + 3))
    }, this.lint32 = function(e, t) {
        return ((255 & e.charCodeAt(t + 3)) << 24) + ((255 & e.charCodeAt(t + 2)) << 16) + ((255 & e.charCodeAt(t + 1)) << 8) + (255 & e.charCodeAt(t))
    }, this.bint16 = function(e, t) {
        return ((255 & e.charCodeAt(t)) << 8) + (255 & e.charCodeAt(t + 1))
    }, this.lint16 = function(e, t) {
        return ((255 & e.charCodeAt(t + 1)) << 8) + (255 & e.charCodeAt(t))
    }, this.ldbl64 = function(e, t) {
        var i = 255 & e.charCodeAt(t),
            r = 255 & e.charCodeAt(t + 1),
            n = 255 & e.charCodeAt(t + 2),
            o = 255 & e.charCodeAt(t + 3),
            a = 255 & e.charCodeAt(t + 4),
            l = 255 & e.charCodeAt(t + 5),
            s = 255 & e.charCodeAt(t + 6),
            u = 255 & e.charCodeAt(t + 7),
            c = 1 - 2 * (u >> 7),
            h = ((127 & u) << 4) + ((240 & s) >> 4) - 1023,
            d = (15 & s) * Math.pow(2, 48) + l * Math.pow(2, 40) + a * Math.pow(2, 32) + o * Math.pow(2, 24) + n * Math.pow(2, 16) + r * Math.pow(2, 8) + i;
        return c * (1 + d * Math.pow(2, -52)) * Math.pow(2, h)
    }, this.lfloat32 = function(e, t) {
        var i = 255 & e.charCodeAt(t),
            r = 255 & e.charCodeAt(t + 1),
            n = 255 & e.charCodeAt(t + 2),
            o = 255 & e.charCodeAt(t + 3),
            a = 1 - 2 * (o >> 7),
            l = ((127 & o) << 1) + ((254 & n) >> 7) - 127,
            s = (127 & n) * Math.pow(2, 16) + r * Math.pow(2, 8) + i;
        return a * (1 + s * Math.pow(2, -23)) * Math.pow(2, l)
    }, this.str = function(e, t, i) {
        for (var r = [], n = t; t + i > n;) {
            var o = e[n];
            if (0 === o.charCodeAt(0)) break;
            r.push(o), n++
        }
        return r.join("")
    }, this.readHeader = function(e) {
        var t = this.bint32(e, 0),
            i = this.bint32(e, 24),
            r = this.lint32(e, 28),
            n = this.lint32(e, 32),
            o = this.ldbl64(e, 36),
            a = this.ldbl64(e, 44),
            l = this.ldbl64(e, 52),
            s = this.ldbl64(e, 60);
        return {
            code: t,
            length: i,
            version: r,
            shapetype: n,
            bounds: new Box(vect(o, a), vect(l, s))
        }
    }, this.loadShx = function(t) {
        for (var i = [], r = function(r) {
                return i.push(2 * e.bint32(t, r)), r + 8
            }, n = 100; n < t.length;) n = r(n);
        return i
    }, this.Shapefile = function(e) {
        var t = e.path;
        $.ajax({
            url: t + ".shx",
            mimeType: "text/plain; charset=x-user-defined",
            success: function(i) {
                var r = this.loadShx(i);
                $.ajax({
                    url: t + ".shp",
                    mimeType: "text/plain; charset=x-user-defined",
                    success: function(i) {
                        $.ajax({
                            url: t + ".dbf",
                            mimeType: "text/plain; charset=x-user-defined",
                            success: function(t) {
                                var n = this.loadShp(i, t, r, e);
                                e.success(n)
                            }
                        })
                    }
                })
            }
        })
    }, this.localShapefile = function(t) {
        var i = t.shx,
            r = t.shp,
            n = t.dbf,
            o = new FileReader;
        o.onloadend = function() {
            var i = e.loadShx(o.result),
                a = new FileReader;
            a.onloadend = function() {
                var r = a.result,
                    o = new FileReader;
                o.onloadend = function() {
                    var n = o.result,
                        a = e.loadShp(r, n, i, t);
                    t.success(a)
                }, o.readAsBinaryString(n)
            }, a.readAsBinaryString(r)
        }, o.readAsBinaryString(i)
    }, this.loadDBF = function(t) {
        var i = function(i) {
                var r = e.str(t, i, 10),
                    n = e.str(t, i + 11, 1),
                    o = e.int8(t, i + 16);
                return {
                    name: r,
                    type: n,
                    length: o
                }
            },
            r = e.int8(t, 0);
        if (4 == r) throw "Level 7 dBASE not supported";
        for (var n = (e.int8(t, 1), e.int8(t, 2), e.int8(t, 3), e.lint32(t, 4)), o = e.lint16(t, 8), a = e.lint16(t, 10), l = 32, s = 32, u = l, c = []; o - 1 > u;) c.push(i(u)), u += s;
        for (var h = [], d = o; o + n * a > d;) {
            var g = e.str(t, d, 1);
            if ("*" == g) d += a;
            else {
                d++;
                for (var v = {}, f = 0; f < c.length; f++) {
                    var m, p = c[f];
                    "C" == p.type ? m = e.str(t, d, p.length).trim() : "N" == p.type && (m = parseFloat(e.str(t, d, p.length))), d += p.length, v[p.name] = m
                }
                h.push(v)
            }
        }
        return h
    }, this.loadShp = function(o, a, l) {
        for (var s = [], u = function(t, i, r) {
                for (var n = [], a = r - 1; a >= i; a--) {
                    var l = e.ldbl64(o, t + 16 * a),
                        s = e.ldbl64(o, t + 16 * a + 8);
                    n.push([l, s])
                }
                return n
            }, c = function(a) {
                var l = (e.bint32(o, a), e.bint32(o, a + 4), a + 8),
                    c = e.lint32(o, l);
                if (c == t) console.log("NULL Shape");
                else if (c == i) {
                    var h = e.ldbl64(o, l + 4),
                        d = e.ldbl64(o, l + 12);
                    s.push({
                        type: "Point",
                        attr: {},
                        geom: [
                            [h, d]
                        ]
                    })
                } else if (c == r) {
                    for (var g = e.lint32(o, l + 36), v = e.lint32(o, l + 40), f = a + 52, m = a + 52 + 4 * g, p = [], b = 0; g > b; b++) {
                        var x, w = e.lint32(o, f + 4 * b);
                        x = g > b + 1 ? e.lint32(o, f + 4 * (b + 1)) : v;
                        var y = u(m, w, x);
                        p.push(y)
                    }
                    s.push({
                        type: "Polygon",
                        attr: {},
                        geom: [p]
                    })
                } else {
                    if (c != n) throw "Not Implemented: " + c;
                    for (var g = e.lint32(o, l + 36), v = e.lint32(o, l + 40), f = a + 52, m = a + 52 + 4 * g, p = [], b = 0; g > b; b++) {
                        var x, w = e.lint32(o, f + 4 * b);
                        x = g > b + 1 ? e.lint32(o, f + 4 * (b + 1)) : v;
                        var y = u(m, w, x);
                        p.push(y)
                    }
                    s.push({
                        type: "Polyline",
                        attr: {},
                        geom: [p]
                    })
                }
            }, h = this.loadDBF(a), d = 0; d < l.length; d++) {
            var g = l[d];
            c(g)
        }
        for (var v = [], d = 0; d < s.length; d++) {
            var f = s[d];
            f.attr = h[d], v.push(f)
        }
        return v
    }, this
}, vgl.vtkReader = function() {
    "use strict";
    if (!(this instanceof vgl.vtkReader)) return new vgl.vtkReader;
    var e = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "+", "/"],
        t = [],
        i = {},
        r = 0,
        n = null,
        o = null,
        a = -1,
        l = "",
        s = 0,
        u = 0,
        c = null,
        h = 0;
    if (0 === t.length)
        for (h = 0; h < e.length; h++) t[e[h]] = h;
    return this.ntos = function(e) {
        var t;
        return t = e.toString(16), 1 === t.length && (t = "0" + t), t = "%" + t, unescape(t)
    }, this.readReverseBase64 = function() {
        var e;
        if (!l) return a;
        for (;;) {
            if (s >= l.length) return a;
            if (e = l.charAt(s), s++, t[e]) return t[e];
            if ("A" === e) return 0
        }
        return a
    }, this.decode64 = function(e) {
        var t = "",
            i = new Array(4),
            r = !1;
        for (l = e, s = 0; !r && (i[0] = this.readReverseBase64()) !== a && (i[1] = this.readReverseBase64()) !== a;) i[2] = this.readReverseBase64(), i[3] = this.readReverseBase64(), t += this.ntos(i[0] << 2 & 255 | i[1] >> 4), i[2] !== a ? (t += this.ntos(i[1] << 4 & 255 | i[2] >> 2), i[3] !== a ? t += this.ntos(i[2] << 6 & 255 | i[3]) : r = !0) : r = !0;
        return t
    }, this.readNumber = function(e) {
        var t = e[u++] + (e[u++] << 8) + (e[u++] << 16) + (e[u++] << 24);
        return t
    }, this.readF3Array = function(e, t) {
        var i, r = 4 * e * 3,
            n = new Int8Array(r),
            o = null;
        for (i = 0; r > i; i++) n[i] = t[u++];
        return o = new Float32Array(n.buffer)
    }, this.readColorArray = function(e, t, i) {
        var r, n = 0,
            o = new Array(3 * e);
        for (r = 0; e > r; r++) o[n++] = t[u++] / 255, o[n++] = t[u++] / 255, o[n++] = t[u++] / 255, u++;
        i.insert(o)
    }, this.parseObject = function(e) {
        var t, i, r, n, o, a, l, s, d, g, v, f = new vgl.geometryData,
            m = vgl.mapper(),
            p = [],
            b = null,
            x = null,
            w = null,
            y = null;
        for (x = atob(e.data), h = 0; h < x.length; h++) p[h] = 255 & x.charCodeAt(h);
        if (u = 0, t = this.readNumber(p), b = String.fromCharCode(p[u++]), f.setName(b), "L" === b) w = this.parseLineData(f, p), y = vgl.utils.createGeometryMaterial();
        else if ("M" === b) w = this.parseMeshData(f, p), y = vgl.utils.createPhongMaterial();
        else if ("P" === b) w = this.parsePointData(f, p), y = vgl.utils.createGeometryMaterial();
        else {
            if ("C" === b) {
                for (r = this.parseColorMapData(f, p, t), l = [], h = 0; h < r.colors.length; h++) l.push(r.colors[h][1]), l.push(r.colors[h][2]), l.push(r.colors[h][3]), l.push(255 * r.colors[h][0]);
                return a = new vgl.lookupTable, a.setColorTable(l), s = c.renderWindow().windowSize(), d = r.size[0] * s[0], g = r.size[1] * s[1], v = [r.position[0] * s[0], (1 - r.position[1]) * s[1], 0], v[1] = v[1] - g, g = 30, vgl.utils.createColorLegend(r.title, a, v, d, g, 3, 0)
            }
            console.log("Ignoring unrecognized encoded data type " + b)
        }
        return m.setGeometryData(f), e.hasTransparency && (n = y.shaderProgram(), o = n.uniform("opacity"), n.addUniform(new vgl.floatUniform("opacity", .5)), y.setBinNumber(1e3)), i = vgl.actor(), i.setMapper(m), i.setMaterial(y), i.setMatrix(mat4.transpose(mat4.create(), w)), [i]
    }, this.parseLineData = function(e, t) {
        var i, r, n, o, a, l, s, c, h = null,
            d = null,
            g = null,
            v = mat4.create(),
            f = null,
            m = 0;
        for (r = this.readNumber(t), f = new Array(3 * r), h = new vgl.sourceDataP3fv, n = this.readF3Array(r, t), c = 0; r > c; c++) f[m++] = n[3 * c], f[m++] = n[3 * c + 1], f[m++] = n[3 * c + 2];
        for (h.insert(f), e.addSource(h), d = new vgl.sourceDataC3fv, this.readColorArray(r, t, d), e.addSource(d), g = new vgl.lines, e.addPrimitive(g), i = this.readNumber(t), o = new Int8Array(2 * i), c = 0; 2 * i > c; c++) o[c] = t[u++];
        for (a = new Uint16Array(o.buffer), g.setIndices(a), g.setPrimitiveType(gl.LINES), l = 64, o = new Int8Array(l), c = 0; l > c; c++) o[c] = t[u++];
        return s = new Float32Array(o.buffer), mat4.copy(v, s), v
    }, this.parseMeshData = function(e, t) {
        var i, r, n, o, a, l, s, c, h, d = null,
            g = null,
            v = null,
            f = mat4.create(),
            m = null,
            p = null,
            b = 0;
        for (r = this.readNumber(t), p = new Array(6 * r), d = new vgl.sourceDataP3N3f, n = this.readF3Array(r, t), v = this.readF3Array(r, t), c = 0; r > c; c++) p[b++] = n[3 * c], p[b++] = n[3 * c + 1], p[b++] = n[3 * c + 2], p[b++] = v[3 * c], p[b++] = v[3 * c + 1], p[b++] = v[3 * c + 2];
        for (d.insert(p), e.addSource(d), g = new vgl.sourceDataC3fv, this.readColorArray(r, t, g), e.addSource(g), o = [], m = new vgl.triangles, i = this.readNumber(t), o = new Int8Array(2 * i), c = 0; 2 * i > c; c++) o[c] = t[u++];
        for (a = new Uint16Array(o.buffer), m.setIndices(a), e.addPrimitive(m), l = 64, o = new Int8Array(l), c = 0; l > c; c++) o[c] = t[u++];
        return s = new Float32Array(o.buffer), mat4.copy(f, s), h = null, f
    }, this.parsePointData = function(e, t) {
        var i, r, n, o, a, l, s = mat4.create(),
            c = null,
            d = null,
            g = null,
            v = null,
            f = 0;
        for (i = this.readNumber(t), v = new Array(3 * i), c = new vgl.sourceDataP3fv, r = this.readF3Array(i, t), n = new Uint16Array(i), h = 0; i > h; h++) n[h] = h, v[f++] = r[3 * h], v[f++] = r[3 * h + 1], v[f++] = r[3 * h + 2];
        for (c.insert(v), e.addSource(c), d = new vgl.sourceDataC3fv, this.readColorArray(i, t, d), e.addSource(d), g = new vgl.points, g.setIndices(n), e.addPrimitive(g), a = 64, o = new Int8Array(a), h = 0; a > h; h++) o[h] = t[u++];
        return l = new Float32Array(o.buffer), mat4.copy(s, l), s
    }, this.parseColorMapData = function(e, t, i) {
        var r, n, o, a, l, s = {};
        for (s.numOfColors = i, n = 8, r = new Int8Array(n), a = 0; n > a; a++) r[a] = t[u++];
        for (s.position = new Float32Array(r.buffer), n = 8, r = new Int8Array(n), a = 0; n > a; a++) r[a] = t[u++];
        for (s.size = new Float32Array(r.buffer), s.colors = [], l = 0; l < s.numOfColors; l++) {
            for (r = new Int8Array(4), a = 0; 4 > a; a++) r[a] = t[u++];
            o = [new Float32Array(r.buffer)[0], t[u++], t[u++], t[u++]], s.colors[l] = o
        }
        for (s.orientation = t[u++], s.numOfLabels = t[u++], s.title = ""; u < t.length;) s.title += String.fromCharCode(t[u++]);
        return s
    }, this.parseSceneMetadata = function(e, t) {
        var i, r, a, l = n.Renderers[t],
            s = e.camera();
        r = (l.size[0] - l.origin[0]) * o.width, a = (l.size[1] - l.origin[1]) * o.height, e.resize(r, a), s.setCenterOfRotation([l.LookAt[1], l.LookAt[2], l.LookAt[3]]), s.setViewAngleDegrees(l.LookAt[0]), s.setPosition(l.LookAt[7], l.LookAt[8], l.LookAt[9]), s.setFocalPoint(l.LookAt[1], l.LookAt[2], l.LookAt[3]), s.setViewUpDirection(l.LookAt[4], l.LookAt[5], l.LookAt[6]), 0 === t ? (i = l.Background1, e.setBackgroundColor(i[0], i[1], i[2], 1)) : e.setResizable(!1), e.setLayer(t)
    }, this.initScene = function() {
        var e, t;
        if (null === n) return c;
        for (t = n.Renderers.length - 1; t >= 0; t--) e = this.getRenderer(t), this.parseSceneMetadata(e, t);
        return c
    }, this.createViewer = function(e) {
        var t;
        return null === c && (o = e, c = vgl.viewer(e), c.init(), i[0] = c.renderWindow().activeRenderer(), c.renderWindow().resize(e.width, e.height), t = vgl.pvwInteractorStyle(), c.setInteractorStyle(t)), c
    }, this.deleteViewer = function() {
        i = {}, c = null
    }, this.updateCanvas = function(e) {
        return o = e, c.renderWindow().resize(e.width, e.height), c
    }, this.numObjects = function() {
        return r
    }, this.getRenderer = function(e) {
        var t;
        return t = i[e], (null === t || "undefined" == typeof t) && (t = new vgl.renderer, t.setResetScene(!1), t.setResetClippingRange(!1), c.renderWindow().addRenderer(t), 0 !== e && t.camera().setClearMask(vgl.GL.DepthBufferBit), i[e] = t), t
    }, this.setVtkScene = function(e) {
        n = e
    }, this
};