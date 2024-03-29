(function () {
  function r(e, n, t) {
    function o(i, f) {
      if (!n[i]) {
        if (!e[i]) {
          var c = "function" == typeof require && require;
          if (!f && c) return c(i, !0);
          if (u) return u(i, !0);
          var a = new Error("Cannot find module '" + i + "'");
          throw ((a.code = "MODULE_NOT_FOUND"), a);
        }
        var p = (n[i] = { exports: {} });
        e[i][0].call(
          p.exports,
          function (r) {
            var n = e[i][1][r];
            return o(n || r);
          },
          p,
          p.exports,
          r,
          e,
          n,
          t
        );
      }
      return n[i].exports;
    }
    for (
      var u = "function" == typeof require && require, i = 0;
      i < t.length;
      i++
    )
      o(t[i]);
    return o;
  }
  return r;
})()(
  {
    1: [
      function (require, module, exports) {
        module.exports = after;
        function after(count, callback, err_cb) {
          var bail = false;
          err_cb = err_cb || noop;
          proxy.count = count;
          return count === 0 ? callback() : proxy;
          function proxy(err, result) {
            if (proxy.count <= 0) {
              throw new Error("after called too many times");
            }
            --proxy.count;
            if (err) {
              bail = true;
              callback(err);
              callback = err_cb;
            } else if (proxy.count === 0 && !bail) {
              callback(null, result);
            }
          }
        }
        function noop() {}
      },
      {},
    ],
    2: [
      function (require, module, exports) {
        module.exports = function (arraybuffer, start, end) {
          var bytes = arraybuffer.byteLength;
          start = start || 0;
          end = end || bytes;
          if (arraybuffer.slice) {
            return arraybuffer.slice(start, end);
          }
          if (start < 0) {
            start += bytes;
          }
          if (end < 0) {
            end += bytes;
          }
          if (end > bytes) {
            end = bytes;
          }
          if (start >= bytes || start >= end || bytes === 0) {
            return new ArrayBuffer(0);
          }
          var abv = new Uint8Array(arraybuffer);
          var result = new Uint8Array(end - start);
          for (var i = start, ii = 0; i < end; i++, ii++) {
            result[ii] = abv[i];
          }
          return result.buffer;
        };
      },
      {},
    ],
    3: [
      function (require, module, exports) {
        module.exports = Backoff;
        function Backoff(opts) {
          opts = opts || {};
          this.ms = opts.min || 100;
          this.max = opts.max || 1e4;
          this.factor = opts.factor || 2;
          this.jitter = opts.jitter > 0 && opts.jitter <= 1 ? opts.jitter : 0;
          this.attempts = 0;
        }
        Backoff.prototype.duration = function () {
          var ms = this.ms * Math.pow(this.factor, this.attempts++);
          if (this.jitter) {
            var rand = Math.random();
            var deviation = Math.floor(rand * this.jitter * ms);
            ms =
              (Math.floor(rand * 10) & 1) == 0
                ? ms - deviation
                : ms + deviation;
          }
          return Math.min(ms, this.max) | 0;
        };
        Backoff.prototype.reset = function () {
          this.attempts = 0;
        };
        Backoff.prototype.setMin = function (min) {
          this.ms = min;
        };
        Backoff.prototype.setMax = function (max) {
          this.max = max;
        };
        Backoff.prototype.setJitter = function (jitter) {
          this.jitter = jitter;
        };
      },
      {},
    ],
    4: [
      function (require, module, exports) {
        (function () {
          "use strict";
          var chars =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
          var lookup = new Uint8Array(256);
          for (var i = 0; i < chars.length; i++) {
            lookup[chars.charCodeAt(i)] = i;
          }
          exports.encode = function (arraybuffer) {
            var bytes = new Uint8Array(arraybuffer),
              i,
              len = bytes.length,
              base64 = "";
            for (i = 0; i < len; i += 3) {
              base64 += chars[bytes[i] >> 2];
              base64 += chars[((bytes[i] & 3) << 4) | (bytes[i + 1] >> 4)];
              base64 += chars[((bytes[i + 1] & 15) << 2) | (bytes[i + 2] >> 6)];
              base64 += chars[bytes[i + 2] & 63];
            }
            if (len % 3 === 2) {
              base64 = base64.substring(0, base64.length - 1) + "=";
            } else if (len % 3 === 1) {
              base64 = base64.substring(0, base64.length - 2) + "==";
            }
            return base64;
          };
          exports.decode = function (base64) {
            var bufferLength = base64.length * 0.75,
              len = base64.length,
              i,
              p = 0,
              encoded1,
              encoded2,
              encoded3,
              encoded4;
            if (base64[base64.length - 1] === "=") {
              bufferLength--;
              if (base64[base64.length - 2] === "=") {
                bufferLength--;
              }
            }
            var arraybuffer = new ArrayBuffer(bufferLength),
              bytes = new Uint8Array(arraybuffer);
            for (i = 0; i < len; i += 4) {
              encoded1 = lookup[base64.charCodeAt(i)];
              encoded2 = lookup[base64.charCodeAt(i + 1)];
              encoded3 = lookup[base64.charCodeAt(i + 2)];
              encoded4 = lookup[base64.charCodeAt(i + 3)];
              bytes[p++] = (encoded1 << 2) | (encoded2 >> 4);
              bytes[p++] = ((encoded2 & 15) << 4) | (encoded3 >> 2);
              bytes[p++] = ((encoded3 & 3) << 6) | (encoded4 & 63);
            }
            return arraybuffer;
          };
        })();
      },
      {},
    ],
    5: [
      function (require, module, exports) {
        "use strict";
        exports.byteLength = byteLength;
        exports.toByteArray = toByteArray;
        exports.fromByteArray = fromByteArray;
        var lookup = [];
        var revLookup = [];
        var Arr = typeof Uint8Array !== "undefined" ? Uint8Array : Array;
        var code =
          "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        for (var i = 0, len = code.length; i < len; ++i) {
          lookup[i] = code[i];
          revLookup[code.charCodeAt(i)] = i;
        }
        revLookup["-".charCodeAt(0)] = 62;
        revLookup["_".charCodeAt(0)] = 63;
        function getLens(b64) {
          var len = b64.length;
          if (len % 4 > 0) {
            throw new Error("Invalid string. Length must be a multiple of 4");
          }
          var validLen = b64.indexOf("=");
          if (validLen === -1) validLen = len;
          var placeHoldersLen = validLen === len ? 0 : 4 - (validLen % 4);
          return [validLen, placeHoldersLen];
        }
        function byteLength(b64) {
          var lens = getLens(b64);
          var validLen = lens[0];
          var placeHoldersLen = lens[1];
          return ((validLen + placeHoldersLen) * 3) / 4 - placeHoldersLen;
        }
        function _byteLength(b64, validLen, placeHoldersLen) {
          return ((validLen + placeHoldersLen) * 3) / 4 - placeHoldersLen;
        }
        function toByteArray(b64) {
          var tmp;
          var lens = getLens(b64);
          var validLen = lens[0];
          var placeHoldersLen = lens[1];
          var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen));
          var curByte = 0;
          var len = placeHoldersLen > 0 ? validLen - 4 : validLen;
          for (var i = 0; i < len; i += 4) {
            tmp =
              (revLookup[b64.charCodeAt(i)] << 18) |
              (revLookup[b64.charCodeAt(i + 1)] << 12) |
              (revLookup[b64.charCodeAt(i + 2)] << 6) |
              revLookup[b64.charCodeAt(i + 3)];
            arr[curByte++] = (tmp >> 16) & 255;
            arr[curByte++] = (tmp >> 8) & 255;
            arr[curByte++] = tmp & 255;
          }
          if (placeHoldersLen === 2) {
            tmp =
              (revLookup[b64.charCodeAt(i)] << 2) |
              (revLookup[b64.charCodeAt(i + 1)] >> 4);
            arr[curByte++] = tmp & 255;
          }
          if (placeHoldersLen === 1) {
            tmp =
              (revLookup[b64.charCodeAt(i)] << 10) |
              (revLookup[b64.charCodeAt(i + 1)] << 4) |
              (revLookup[b64.charCodeAt(i + 2)] >> 2);
            arr[curByte++] = (tmp >> 8) & 255;
            arr[curByte++] = tmp & 255;
          }
          return arr;
        }
        function tripletToBase64(num) {
          return (
            lookup[(num >> 18) & 63] +
            lookup[(num >> 12) & 63] +
            lookup[(num >> 6) & 63] +
            lookup[num & 63]
          );
        }
        function encodeChunk(uint8, start, end) {
          var tmp;
          var output = [];
          for (var i = start; i < end; i += 3) {
            tmp =
              ((uint8[i] << 16) & 16711680) +
              ((uint8[i + 1] << 8) & 65280) +
              (uint8[i + 2] & 255);
            output.push(tripletToBase64(tmp));
          }
          return output.join("");
        }
        function fromByteArray(uint8) {
          var tmp;
          var len = uint8.length;
          var extraBytes = len % 3;
          var parts = [];
          var maxChunkLength = 16383;
          for (
            var i = 0, len2 = len - extraBytes;
            i < len2;
            i += maxChunkLength
          ) {
            parts.push(
              encodeChunk(
                uint8,
                i,
                i + maxChunkLength > len2 ? len2 : i + maxChunkLength
              )
            );
          }
          if (extraBytes === 1) {
            tmp = uint8[len - 1];
            parts.push(lookup[tmp >> 2] + lookup[(tmp << 4) & 63] + "==");
          } else if (extraBytes === 2) {
            tmp = (uint8[len - 2] << 8) + uint8[len - 1];
            parts.push(
              lookup[tmp >> 10] +
                lookup[(tmp >> 4) & 63] +
                lookup[(tmp << 2) & 63] +
                "="
            );
          }
          return parts.join("");
        }
      },
      {},
    ],
    6: [
      function (require, module, exports) {
        (function (global) {
          var BlobBuilder =
            global.BlobBuilder ||
            global.WebKitBlobBuilder ||
            global.MSBlobBuilder ||
            global.MozBlobBuilder;
          var blobSupported = (function () {
            try {
              var a = new Blob(["hi"]);
              return a.size === 2;
            } catch (e) {
              return false;
            }
          })();
          var blobSupportsArrayBufferView =
            blobSupported &&
            (function () {
              try {
                var b = new Blob([new Uint8Array([1, 2])]);
                return b.size === 2;
              } catch (e) {
                return false;
              }
            })();
          var blobBuilderSupported =
            BlobBuilder &&
            BlobBuilder.prototype.append &&
            BlobBuilder.prototype.getBlob;
          function mapArrayBufferViews(ary) {
            for (var i = 0; i < ary.length; i++) {
              var chunk = ary[i];
              if (chunk.buffer instanceof ArrayBuffer) {
                var buf = chunk.buffer;
                if (chunk.byteLength !== buf.byteLength) {
                  var copy = new Uint8Array(chunk.byteLength);
                  copy.set(
                    new Uint8Array(buf, chunk.byteOffset, chunk.byteLength)
                  );
                  buf = copy.buffer;
                }
                ary[i] = buf;
              }
            }
          }
          function BlobBuilderConstructor(ary, options) {
            options = options || {};
            var bb = new BlobBuilder();
            mapArrayBufferViews(ary);
            for (var i = 0; i < ary.length; i++) {
              bb.append(ary[i]);
            }
            return options.type ? bb.getBlob(options.type) : bb.getBlob();
          }
          function BlobConstructor(ary, options) {
            mapArrayBufferViews(ary);
            return new Blob(ary, options || {});
          }
          module.exports = (function () {
            if (blobSupported) {
              return blobSupportsArrayBufferView
                ? global.Blob
                : BlobConstructor;
            } else if (blobBuilderSupported) {
              return BlobBuilderConstructor;
            } else {
              return undefined;
            }
          })();
        }.call(
          this,
          typeof global !== "undefined"
            ? global
            : typeof self !== "undefined"
            ? self
            : typeof window !== "undefined"
            ? window
            : {}
        ));
      },
      {},
    ],
    7: [function (require, module, exports) {}, {}],
    8: [
      function (require, module, exports) {
        (function (Buffer) {
          "use strict";
          var base64 = require("base64-js");
          var ieee754 = require("ieee754");
          exports.Buffer = Buffer;
          exports.SlowBuffer = SlowBuffer;
          exports.INSPECT_MAX_BYTES = 50;
          var K_MAX_LENGTH = 2147483647;
          exports.kMaxLength = K_MAX_LENGTH;
          Buffer.TYPED_ARRAY_SUPPORT = typedArraySupport();
          if (
            !Buffer.TYPED_ARRAY_SUPPORT &&
            typeof console !== "undefined" &&
            typeof console.error === "function"
          ) {
            console.error(
              "This browser lacks typed array (Uint8Array) support which is required by " +
                "`buffer` v5.x. Use `buffer` v4.x if you require old browser support."
            );
          }
          function typedArraySupport() {
            try {
              var arr = new Uint8Array(1);
              arr.__proto__ = {
                __proto__: Uint8Array.prototype,
                foo: function () {
                  return 42;
                },
              };
              return arr.foo() === 42;
            } catch (e) {
              return false;
            }
          }
          Object.defineProperty(Buffer.prototype, "parent", {
            enumerable: true,
            get: function () {
              if (!Buffer.isBuffer(this)) return undefined;
              return this.buffer;
            },
          });
          Object.defineProperty(Buffer.prototype, "offset", {
            enumerable: true,
            get: function () {
              if (!Buffer.isBuffer(this)) return undefined;
              return this.byteOffset;
            },
          });
          function createBuffer(length) {
            if (length > K_MAX_LENGTH) {
              throw new RangeError(
                'The value "' + length + '" is invalid for option "size"'
              );
            }
            var buf = new Uint8Array(length);
            buf.__proto__ = Buffer.prototype;
            return buf;
          }
          function Buffer(arg, encodingOrOffset, length) {
            if (typeof arg === "number") {
              if (typeof encodingOrOffset === "string") {
                throw new TypeError(
                  'The "string" argument must be of type string. Received type number'
                );
              }
              return allocUnsafe(arg);
            }
            return from(arg, encodingOrOffset, length);
          }
          if (
            typeof Symbol !== "undefined" &&
            Symbol.species != null &&
            Buffer[Symbol.species] === Buffer
          ) {
            Object.defineProperty(Buffer, Symbol.species, {
              value: null,
              configurable: true,
              enumerable: false,
              writable: false,
            });
          }
          Buffer.poolSize = 8192;
          function from(value, encodingOrOffset, length) {
            if (typeof value === "string") {
              return fromString(value, encodingOrOffset);
            }
            if (ArrayBuffer.isView(value)) {
              return fromArrayLike(value);
            }
            if (value == null) {
              throw TypeError(
                "The first argument must be one of type string, Buffer, ArrayBuffer, Array, " +
                  "or Array-like Object. Received type " +
                  typeof value
              );
            }
            if (
              isInstance(value, ArrayBuffer) ||
              (value && isInstance(value.buffer, ArrayBuffer))
            ) {
              return fromArrayBuffer(value, encodingOrOffset, length);
            }
            if (typeof value === "number") {
              throw new TypeError(
                'The "value" argument must not be of type number. Received type number'
              );
            }
            var valueOf = value.valueOf && value.valueOf();
            if (valueOf != null && valueOf !== value) {
              return Buffer.from(valueOf, encodingOrOffset, length);
            }
            var b = fromObject(value);
            if (b) return b;
            if (
              typeof Symbol !== "undefined" &&
              Symbol.toPrimitive != null &&
              typeof value[Symbol.toPrimitive] === "function"
            ) {
              return Buffer.from(
                value[Symbol.toPrimitive]("string"),
                encodingOrOffset,
                length
              );
            }
            throw new TypeError(
              "The first argument must be one of type string, Buffer, ArrayBuffer, Array, " +
                "or Array-like Object. Received type " +
                typeof value
            );
          }
          Buffer.from = function (value, encodingOrOffset, length) {
            return from(value, encodingOrOffset, length);
          };
          Buffer.prototype.__proto__ = Uint8Array.prototype;
          Buffer.__proto__ = Uint8Array;
          function assertSize(size) {
            if (typeof size !== "number") {
              throw new TypeError('"size" argument must be of type number');
            } else if (size < 0) {
              throw new RangeError(
                'The value "' + size + '" is invalid for option "size"'
              );
            }
          }
          function alloc(size, fill, encoding) {
            assertSize(size);
            if (size <= 0) {
              return createBuffer(size);
            }
            if (fill !== undefined) {
              return typeof encoding === "string"
                ? createBuffer(size).fill(fill, encoding)
                : createBuffer(size).fill(fill);
            }
            return createBuffer(size);
          }
          Buffer.alloc = function (size, fill, encoding) {
            return alloc(size, fill, encoding);
          };
          function allocUnsafe(size) {
            assertSize(size);
            return createBuffer(size < 0 ? 0 : checked(size) | 0);
          }
          Buffer.allocUnsafe = function (size) {
            return allocUnsafe(size);
          };
          Buffer.allocUnsafeSlow = function (size) {
            return allocUnsafe(size);
          };
          function fromString(string, encoding) {
            if (typeof encoding !== "string" || encoding === "") {
              encoding = "utf8";
            }
            if (!Buffer.isEncoding(encoding)) {
              throw new TypeError("Unknown encoding: " + encoding);
            }
            var length = byteLength(string, encoding) | 0;
            var buf = createBuffer(length);
            var actual = buf.write(string, encoding);
            if (actual !== length) {
              buf = buf.slice(0, actual);
            }
            return buf;
          }
          function fromArrayLike(array) {
            var length = array.length < 0 ? 0 : checked(array.length) | 0;
            var buf = createBuffer(length);
            for (var i = 0; i < length; i += 1) {
              buf[i] = array[i] & 255;
            }
            return buf;
          }
          function fromArrayBuffer(array, byteOffset, length) {
            if (byteOffset < 0 || array.byteLength < byteOffset) {
              throw new RangeError('"offset" is outside of buffer bounds');
            }
            if (array.byteLength < byteOffset + (length || 0)) {
              throw new RangeError('"length" is outside of buffer bounds');
            }
            var buf;
            if (byteOffset === undefined && length === undefined) {
              buf = new Uint8Array(array);
            } else if (length === undefined) {
              buf = new Uint8Array(array, byteOffset);
            } else {
              buf = new Uint8Array(array, byteOffset, length);
            }
            buf.__proto__ = Buffer.prototype;
            return buf;
          }
          function fromObject(obj) {
            if (Buffer.isBuffer(obj)) {
              var len = checked(obj.length) | 0;
              var buf = createBuffer(len);
              if (buf.length === 0) {
                return buf;
              }
              obj.copy(buf, 0, 0, len);
              return buf;
            }
            if (obj.length !== undefined) {
              if (typeof obj.length !== "number" || numberIsNaN(obj.length)) {
                return createBuffer(0);
              }
              return fromArrayLike(obj);
            }
            if (obj.type === "Buffer" && Array.isArray(obj.data)) {
              return fromArrayLike(obj.data);
            }
          }
          function checked(length) {
            if (length >= K_MAX_LENGTH) {
              throw new RangeError(
                "Attempt to allocate Buffer larger than maximum " +
                  "size: 0x" +
                  K_MAX_LENGTH.toString(16) +
                  " bytes"
              );
            }
            return length | 0;
          }
          function SlowBuffer(length) {
            if (+length != length) {
              length = 0;
            }
            return Buffer.alloc(+length);
          }
          Buffer.isBuffer = function isBuffer(b) {
            return b != null && b._isBuffer === true && b !== Buffer.prototype;
          };
          Buffer.compare = function compare(a, b) {
            if (isInstance(a, Uint8Array))
              a = Buffer.from(a, a.offset, a.byteLength);
            if (isInstance(b, Uint8Array))
              b = Buffer.from(b, b.offset, b.byteLength);
            if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
              throw new TypeError(
                'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
              );
            }
            if (a === b) return 0;
            var x = a.length;
            var y = b.length;
            for (var i = 0, len = Math.min(x, y); i < len; ++i) {
              if (a[i] !== b[i]) {
                x = a[i];
                y = b[i];
                break;
              }
            }
            if (x < y) return -1;
            if (y < x) return 1;
            return 0;
          };
          Buffer.isEncoding = function isEncoding(encoding) {
            switch (String(encoding).toLowerCase()) {
              case "hex":
              case "utf8":
              case "utf-8":
              case "ascii":
              case "latin1":
              case "binary":
              case "base64":
              case "ucs2":
              case "ucs-2":
              case "utf16le":
              case "utf-16le":
                return true;
              default:
                return false;
            }
          };
          Buffer.concat = function concat(list, length) {
            if (!Array.isArray(list)) {
              throw new TypeError(
                '"list" argument must be an Array of Buffers'
              );
            }
            if (list.length === 0) {
              return Buffer.alloc(0);
            }
            var i;
            if (length === undefined) {
              length = 0;
              for (i = 0; i < list.length; ++i) {
                length += list[i].length;
              }
            }
            var buffer = Buffer.allocUnsafe(length);
            var pos = 0;
            for (i = 0; i < list.length; ++i) {
              var buf = list[i];
              if (isInstance(buf, Uint8Array)) {
                buf = Buffer.from(buf);
              }
              if (!Buffer.isBuffer(buf)) {
                throw new TypeError(
                  '"list" argument must be an Array of Buffers'
                );
              }
              buf.copy(buffer, pos);
              pos += buf.length;
            }
            return buffer;
          };
          function byteLength(string, encoding) {
            if (Buffer.isBuffer(string)) {
              return string.length;
            }
            if (ArrayBuffer.isView(string) || isInstance(string, ArrayBuffer)) {
              return string.byteLength;
            }
            if (typeof string !== "string") {
              throw new TypeError(
                'The "string" argument must be one of type string, Buffer, or ArrayBuffer. ' +
                  "Received type " +
                  typeof string
              );
            }
            var len = string.length;
            var mustMatch = arguments.length > 2 && arguments[2] === true;
            if (!mustMatch && len === 0) return 0;
            var loweredCase = false;
            for (;;) {
              switch (encoding) {
                case "ascii":
                case "latin1":
                case "binary":
                  return len;
                case "utf8":
                case "utf-8":
                  return utf8ToBytes(string).length;
                case "ucs2":
                case "ucs-2":
                case "utf16le":
                case "utf-16le":
                  return len * 2;
                case "hex":
                  return len >>> 1;
                case "base64":
                  return base64ToBytes(string).length;
                default:
                  if (loweredCase) {
                    return mustMatch ? -1 : utf8ToBytes(string).length;
                  }
                  encoding = ("" + encoding).toLowerCase();
                  loweredCase = true;
              }
            }
          }
          Buffer.byteLength = byteLength;
          function slowToString(encoding, start, end) {
            var loweredCase = false;
            if (start === undefined || start < 0) {
              start = 0;
            }
            if (start > this.length) {
              return "";
            }
            if (end === undefined || end > this.length) {
              end = this.length;
            }
            if (end <= 0) {
              return "";
            }
            end >>>= 0;
            start >>>= 0;
            if (end <= start) {
              return "";
            }
            if (!encoding) encoding = "utf8";
            while (true) {
              switch (encoding) {
                case "hex":
                  return hexSlice(this, start, end);
                case "utf8":
                case "utf-8":
                  return utf8Slice(this, start, end);
                case "ascii":
                  return asciiSlice(this, start, end);
                case "latin1":
                case "binary":
                  return latin1Slice(this, start, end);
                case "base64":
                  return base64Slice(this, start, end);
                case "ucs2":
                case "ucs-2":
                case "utf16le":
                case "utf-16le":
                  return utf16leSlice(this, start, end);
                default:
                  if (loweredCase)
                    throw new TypeError("Unknown encoding: " + encoding);
                  encoding = (encoding + "").toLowerCase();
                  loweredCase = true;
              }
            }
          }
          Buffer.prototype._isBuffer = true;
          function swap(b, n, m) {
            var i = b[n];
            b[n] = b[m];
            b[m] = i;
          }
          Buffer.prototype.swap16 = function swap16() {
            var len = this.length;
            if (len % 2 !== 0) {
              throw new RangeError("Buffer size must be a multiple of 16-bits");
            }
            for (var i = 0; i < len; i += 2) {
              swap(this, i, i + 1);
            }
            return this;
          };
          Buffer.prototype.swap32 = function swap32() {
            var len = this.length;
            if (len % 4 !== 0) {
              throw new RangeError("Buffer size must be a multiple of 32-bits");
            }
            for (var i = 0; i < len; i += 4) {
              swap(this, i, i + 3);
              swap(this, i + 1, i + 2);
            }
            return this;
          };
          Buffer.prototype.swap64 = function swap64() {
            var len = this.length;
            if (len % 8 !== 0) {
              throw new RangeError("Buffer size must be a multiple of 64-bits");
            }
            for (var i = 0; i < len; i += 8) {
              swap(this, i, i + 7);
              swap(this, i + 1, i + 6);
              swap(this, i + 2, i + 5);
              swap(this, i + 3, i + 4);
            }
            return this;
          };
          Buffer.prototype.toString = function toString() {
            var length = this.length;
            if (length === 0) return "";
            if (arguments.length === 0) return utf8Slice(this, 0, length);
            return slowToString.apply(this, arguments);
          };
          Buffer.prototype.toLocaleString = Buffer.prototype.toString;
          Buffer.prototype.equals = function equals(b) {
            if (!Buffer.isBuffer(b))
              throw new TypeError("Argument must be a Buffer");
            if (this === b) return true;
            return Buffer.compare(this, b) === 0;
          };
          Buffer.prototype.inspect = function inspect() {
            var str = "";
            var max = exports.INSPECT_MAX_BYTES;
            str = this.toString("hex", 0, max)
              .replace(/(.{2})/g, "$1 ")
              .trim();
            if (this.length > max) str += " ... ";
            return "<Buffer " + str + ">";
          };
          Buffer.prototype.compare = function compare(
            target,
            start,
            end,
            thisStart,
            thisEnd
          ) {
            if (isInstance(target, Uint8Array)) {
              target = Buffer.from(target, target.offset, target.byteLength);
            }
            if (!Buffer.isBuffer(target)) {
              throw new TypeError(
                'The "target" argument must be one of type Buffer or Uint8Array. ' +
                  "Received type " +
                  typeof target
              );
            }
            if (start === undefined) {
              start = 0;
            }
            if (end === undefined) {
              end = target ? target.length : 0;
            }
            if (thisStart === undefined) {
              thisStart = 0;
            }
            if (thisEnd === undefined) {
              thisEnd = this.length;
            }
            if (
              start < 0 ||
              end > target.length ||
              thisStart < 0 ||
              thisEnd > this.length
            ) {
              throw new RangeError("out of range index");
            }
            if (thisStart >= thisEnd && start >= end) {
              return 0;
            }
            if (thisStart >= thisEnd) {
              return -1;
            }
            if (start >= end) {
              return 1;
            }
            start >>>= 0;
            end >>>= 0;
            thisStart >>>= 0;
            thisEnd >>>= 0;
            if (this === target) return 0;
            var x = thisEnd - thisStart;
            var y = end - start;
            var len = Math.min(x, y);
            var thisCopy = this.slice(thisStart, thisEnd);
            var targetCopy = target.slice(start, end);
            for (var i = 0; i < len; ++i) {
              if (thisCopy[i] !== targetCopy[i]) {
                x = thisCopy[i];
                y = targetCopy[i];
                break;
              }
            }
            if (x < y) return -1;
            if (y < x) return 1;
            return 0;
          };
          function bidirectionalIndexOf(
            buffer,
            val,
            byteOffset,
            encoding,
            dir
          ) {
            if (buffer.length === 0) return -1;
            if (typeof byteOffset === "string") {
              encoding = byteOffset;
              byteOffset = 0;
            } else if (byteOffset > 2147483647) {
              byteOffset = 2147483647;
            } else if (byteOffset < -2147483648) {
              byteOffset = -2147483648;
            }
            byteOffset = +byteOffset;
            if (numberIsNaN(byteOffset)) {
              byteOffset = dir ? 0 : buffer.length - 1;
            }
            if (byteOffset < 0) byteOffset = buffer.length + byteOffset;
            if (byteOffset >= buffer.length) {
              if (dir) return -1;
              else byteOffset = buffer.length - 1;
            } else if (byteOffset < 0) {
              if (dir) byteOffset = 0;
              else return -1;
            }
            if (typeof val === "string") {
              val = Buffer.from(val, encoding);
            }
            if (Buffer.isBuffer(val)) {
              if (val.length === 0) {
                return -1;
              }
              return arrayIndexOf(buffer, val, byteOffset, encoding, dir);
            } else if (typeof val === "number") {
              val = val & 255;
              if (typeof Uint8Array.prototype.indexOf === "function") {
                if (dir) {
                  return Uint8Array.prototype.indexOf.call(
                    buffer,
                    val,
                    byteOffset
                  );
                } else {
                  return Uint8Array.prototype.lastIndexOf.call(
                    buffer,
                    val,
                    byteOffset
                  );
                }
              }
              return arrayIndexOf(buffer, [val], byteOffset, encoding, dir);
            }
            throw new TypeError("val must be string, number or Buffer");
          }
          function arrayIndexOf(arr, val, byteOffset, encoding, dir) {
            var indexSize = 1;
            var arrLength = arr.length;
            var valLength = val.length;
            if (encoding !== undefined) {
              encoding = String(encoding).toLowerCase();
              if (
                encoding === "ucs2" ||
                encoding === "ucs-2" ||
                encoding === "utf16le" ||
                encoding === "utf-16le"
              ) {
                if (arr.length < 2 || val.length < 2) {
                  return -1;
                }
                indexSize = 2;
                arrLength /= 2;
                valLength /= 2;
                byteOffset /= 2;
              }
            }
            function read(buf, i) {
              if (indexSize === 1) {
                return buf[i];
              } else {
                return buf.readUInt16BE(i * indexSize);
              }
            }
            var i;
            if (dir) {
              var foundIndex = -1;
              for (i = byteOffset; i < arrLength; i++) {
                if (
                  read(arr, i) ===
                  read(val, foundIndex === -1 ? 0 : i - foundIndex)
                ) {
                  if (foundIndex === -1) foundIndex = i;
                  if (i - foundIndex + 1 === valLength)
                    return foundIndex * indexSize;
                } else {
                  if (foundIndex !== -1) i -= i - foundIndex;
                  foundIndex = -1;
                }
              }
            } else {
              if (byteOffset + valLength > arrLength)
                byteOffset = arrLength - valLength;
              for (i = byteOffset; i >= 0; i--) {
                var found = true;
                for (var j = 0; j < valLength; j++) {
                  if (read(arr, i + j) !== read(val, j)) {
                    found = false;
                    break;
                  }
                }
                if (found) return i;
              }
            }
            return -1;
          }
          Buffer.prototype.includes = function includes(
            val,
            byteOffset,
            encoding
          ) {
            return this.indexOf(val, byteOffset, encoding) !== -1;
          };
          Buffer.prototype.indexOf = function indexOf(
            val,
            byteOffset,
            encoding
          ) {
            return bidirectionalIndexOf(this, val, byteOffset, encoding, true);
          };
          Buffer.prototype.lastIndexOf = function lastIndexOf(
            val,
            byteOffset,
            encoding
          ) {
            return bidirectionalIndexOf(this, val, byteOffset, encoding, false);
          };
          function hexWrite(buf, string, offset, length) {
            offset = Number(offset) || 0;
            var remaining = buf.length - offset;
            if (!length) {
              length = remaining;
            } else {
              length = Number(length);
              if (length > remaining) {
                length = remaining;
              }
            }
            var strLen = string.length;
            if (length > strLen / 2) {
              length = strLen / 2;
            }
            for (var i = 0; i < length; ++i) {
              var parsed = parseInt(string.substr(i * 2, 2), 16);
              if (numberIsNaN(parsed)) return i;
              buf[offset + i] = parsed;
            }
            return i;
          }
          function utf8Write(buf, string, offset, length) {
            return blitBuffer(
              utf8ToBytes(string, buf.length - offset),
              buf,
              offset,
              length
            );
          }
          function asciiWrite(buf, string, offset, length) {
            return blitBuffer(asciiToBytes(string), buf, offset, length);
          }
          function latin1Write(buf, string, offset, length) {
            return asciiWrite(buf, string, offset, length);
          }
          function base64Write(buf, string, offset, length) {
            return blitBuffer(base64ToBytes(string), buf, offset, length);
          }
          function ucs2Write(buf, string, offset, length) {
            return blitBuffer(
              utf16leToBytes(string, buf.length - offset),
              buf,
              offset,
              length
            );
          }
          Buffer.prototype.write = function write(
            string,
            offset,
            length,
            encoding
          ) {
            if (offset === undefined) {
              encoding = "utf8";
              length = this.length;
              offset = 0;
            } else if (length === undefined && typeof offset === "string") {
              encoding = offset;
              length = this.length;
              offset = 0;
            } else if (isFinite(offset)) {
              offset = offset >>> 0;
              if (isFinite(length)) {
                length = length >>> 0;
                if (encoding === undefined) encoding = "utf8";
              } else {
                encoding = length;
                length = undefined;
              }
            } else {
              throw new Error(
                "Buffer.write(string, encoding, offset[, length]) is no longer supported"
              );
            }
            var remaining = this.length - offset;
            if (length === undefined || length > remaining) length = remaining;
            if (
              (string.length > 0 && (length < 0 || offset < 0)) ||
              offset > this.length
            ) {
              throw new RangeError("Attempt to write outside buffer bounds");
            }
            if (!encoding) encoding = "utf8";
            var loweredCase = false;
            for (;;) {
              switch (encoding) {
                case "hex":
                  return hexWrite(this, string, offset, length);
                case "utf8":
                case "utf-8":
                  return utf8Write(this, string, offset, length);
                case "ascii":
                  return asciiWrite(this, string, offset, length);
                case "latin1":
                case "binary":
                  return latin1Write(this, string, offset, length);
                case "base64":
                  return base64Write(this, string, offset, length);
                case "ucs2":
                case "ucs-2":
                case "utf16le":
                case "utf-16le":
                  return ucs2Write(this, string, offset, length);
                default:
                  if (loweredCase)
                    throw new TypeError("Unknown encoding: " + encoding);
                  encoding = ("" + encoding).toLowerCase();
                  loweredCase = true;
              }
            }
          };
          Buffer.prototype.toJSON = function toJSON() {
            return {
              type: "Buffer",
              data: Array.prototype.slice.call(this._arr || this, 0),
            };
          };
          function base64Slice(buf, start, end) {
            if (start === 0 && end === buf.length) {
              return base64.fromByteArray(buf);
            } else {
              return base64.fromByteArray(buf.slice(start, end));
            }
          }
          function utf8Slice(buf, start, end) {
            end = Math.min(buf.length, end);
            var res = [];
            var i = start;
            while (i < end) {
              var firstByte = buf[i];
              var codePoint = null;
              var bytesPerSequence =
                firstByte > 239
                  ? 4
                  : firstByte > 223
                  ? 3
                  : firstByte > 191
                  ? 2
                  : 1;
              if (i + bytesPerSequence <= end) {
                var secondByte, thirdByte, fourthByte, tempCodePoint;
                switch (bytesPerSequence) {
                  case 1:
                    if (firstByte < 128) {
                      codePoint = firstByte;
                    }
                    break;
                  case 2:
                    secondByte = buf[i + 1];
                    if ((secondByte & 192) === 128) {
                      tempCodePoint =
                        ((firstByte & 31) << 6) | (secondByte & 63);
                      if (tempCodePoint > 127) {
                        codePoint = tempCodePoint;
                      }
                    }
                    break;
                  case 3:
                    secondByte = buf[i + 1];
                    thirdByte = buf[i + 2];
                    if (
                      (secondByte & 192) === 128 &&
                      (thirdByte & 192) === 128
                    ) {
                      tempCodePoint =
                        ((firstByte & 15) << 12) |
                        ((secondByte & 63) << 6) |
                        (thirdByte & 63);
                      if (
                        tempCodePoint > 2047 &&
                        (tempCodePoint < 55296 || tempCodePoint > 57343)
                      ) {
                        codePoint = tempCodePoint;
                      }
                    }
                    break;
                  case 4:
                    secondByte = buf[i + 1];
                    thirdByte = buf[i + 2];
                    fourthByte = buf[i + 3];
                    if (
                      (secondByte & 192) === 128 &&
                      (thirdByte & 192) === 128 &&
                      (fourthByte & 192) === 128
                    ) {
                      tempCodePoint =
                        ((firstByte & 15) << 18) |
                        ((secondByte & 63) << 12) |
                        ((thirdByte & 63) << 6) |
                        (fourthByte & 63);
                      if (tempCodePoint > 65535 && tempCodePoint < 1114112) {
                        codePoint = tempCodePoint;
                      }
                    }
                }
              }
              if (codePoint === null) {
                codePoint = 65533;
                bytesPerSequence = 1;
              } else if (codePoint > 65535) {
                codePoint -= 65536;
                res.push(((codePoint >>> 10) & 1023) | 55296);
                codePoint = 56320 | (codePoint & 1023);
              }
              res.push(codePoint);
              i += bytesPerSequence;
            }
            return decodeCodePointsArray(res);
          }
          var MAX_ARGUMENTS_LENGTH = 4096;
          function decodeCodePointsArray(codePoints) {
            var len = codePoints.length;
            if (len <= MAX_ARGUMENTS_LENGTH) {
              return String.fromCharCode.apply(String, codePoints);
            }
            var res = "";
            var i = 0;
            while (i < len) {
              res += String.fromCharCode.apply(
                String,
                codePoints.slice(i, (i += MAX_ARGUMENTS_LENGTH))
              );
            }
            return res;
          }
          function asciiSlice(buf, start, end) {
            var ret = "";
            end = Math.min(buf.length, end);
            for (var i = start; i < end; ++i) {
              ret += String.fromCharCode(buf[i] & 127);
            }
            return ret;
          }
          function latin1Slice(buf, start, end) {
            var ret = "";
            end = Math.min(buf.length, end);
            for (var i = start; i < end; ++i) {
              ret += String.fromCharCode(buf[i]);
            }
            return ret;
          }
          function hexSlice(buf, start, end) {
            var len = buf.length;
            if (!start || start < 0) start = 0;
            if (!end || end < 0 || end > len) end = len;
            var out = "";
            for (var i = start; i < end; ++i) {
              out += toHex(buf[i]);
            }
            return out;
          }
          function utf16leSlice(buf, start, end) {
            var bytes = buf.slice(start, end);
            var res = "";
            for (var i = 0; i < bytes.length; i += 2) {
              res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256);
            }
            return res;
          }
          Buffer.prototype.slice = function slice(start, end) {
            var len = this.length;
            start = ~~start;
            end = end === undefined ? len : ~~end;
            if (start < 0) {
              start += len;
              if (start < 0) start = 0;
            } else if (start > len) {
              start = len;
            }
            if (end < 0) {
              end += len;
              if (end < 0) end = 0;
            } else if (end > len) {
              end = len;
            }
            if (end < start) end = start;
            var newBuf = this.subarray(start, end);
            newBuf.__proto__ = Buffer.prototype;
            return newBuf;
          };
          function checkOffset(offset, ext, length) {
            if (offset % 1 !== 0 || offset < 0)
              throw new RangeError("offset is not uint");
            if (offset + ext > length)
              throw new RangeError("Trying to access beyond buffer length");
          }
          Buffer.prototype.readUIntLE = function readUIntLE(
            offset,
            byteLength,
            noAssert
          ) {
            offset = offset >>> 0;
            byteLength = byteLength >>> 0;
            if (!noAssert) checkOffset(offset, byteLength, this.length);
            var val = this[offset];
            var mul = 1;
            var i = 0;
            while (++i < byteLength && (mul *= 256)) {
              val += this[offset + i] * mul;
            }
            return val;
          };
          Buffer.prototype.readUIntBE = function readUIntBE(
            offset,
            byteLength,
            noAssert
          ) {
            offset = offset >>> 0;
            byteLength = byteLength >>> 0;
            if (!noAssert) {
              checkOffset(offset, byteLength, this.length);
            }
            var val = this[offset + --byteLength];
            var mul = 1;
            while (byteLength > 0 && (mul *= 256)) {
              val += this[offset + --byteLength] * mul;
            }
            return val;
          };
          Buffer.prototype.readUInt8 = function readUInt8(offset, noAssert) {
            offset = offset >>> 0;
            if (!noAssert) checkOffset(offset, 1, this.length);
            return this[offset];
          };
          Buffer.prototype.readUInt16LE = function readUInt16LE(
            offset,
            noAssert
          ) {
            offset = offset >>> 0;
            if (!noAssert) checkOffset(offset, 2, this.length);
            return this[offset] | (this[offset + 1] << 8);
          };
          Buffer.prototype.readUInt16BE = function readUInt16BE(
            offset,
            noAssert
          ) {
            offset = offset >>> 0;
            if (!noAssert) checkOffset(offset, 2, this.length);
            return (this[offset] << 8) | this[offset + 1];
          };
          Buffer.prototype.readUInt32LE = function readUInt32LE(
            offset,
            noAssert
          ) {
            offset = offset >>> 0;
            if (!noAssert) checkOffset(offset, 4, this.length);
            return (
              (this[offset] |
                (this[offset + 1] << 8) |
                (this[offset + 2] << 16)) +
              this[offset + 3] * 16777216
            );
          };
          Buffer.prototype.readUInt32BE = function readUInt32BE(
            offset,
            noAssert
          ) {
            offset = offset >>> 0;
            if (!noAssert) checkOffset(offset, 4, this.length);
            return (
              this[offset] * 16777216 +
              ((this[offset + 1] << 16) |
                (this[offset + 2] << 8) |
                this[offset + 3])
            );
          };
          Buffer.prototype.readIntLE = function readIntLE(
            offset,
            byteLength,
            noAssert
          ) {
            offset = offset >>> 0;
            byteLength = byteLength >>> 0;
            if (!noAssert) checkOffset(offset, byteLength, this.length);
            var val = this[offset];
            var mul = 1;
            var i = 0;
            while (++i < byteLength && (mul *= 256)) {
              val += this[offset + i] * mul;
            }
            mul *= 128;
            if (val >= mul) val -= Math.pow(2, 8 * byteLength);
            return val;
          };
          Buffer.prototype.readIntBE = function readIntBE(
            offset,
            byteLength,
            noAssert
          ) {
            offset = offset >>> 0;
            byteLength = byteLength >>> 0;
            if (!noAssert) checkOffset(offset, byteLength, this.length);
            var i = byteLength;
            var mul = 1;
            var val = this[offset + --i];
            while (i > 0 && (mul *= 256)) {
              val += this[offset + --i] * mul;
            }
            mul *= 128;
            if (val >= mul) val -= Math.pow(2, 8 * byteLength);
            return val;
          };
          Buffer.prototype.readInt8 = function readInt8(offset, noAssert) {
            offset = offset >>> 0;
            if (!noAssert) checkOffset(offset, 1, this.length);
            if (!(this[offset] & 128)) return this[offset];
            return (255 - this[offset] + 1) * -1;
          };
          Buffer.prototype.readInt16LE = function readInt16LE(
            offset,
            noAssert
          ) {
            offset = offset >>> 0;
            if (!noAssert) checkOffset(offset, 2, this.length);
            var val = this[offset] | (this[offset + 1] << 8);
            return val & 32768 ? val | 4294901760 : val;
          };
          Buffer.prototype.readInt16BE = function readInt16BE(
            offset,
            noAssert
          ) {
            offset = offset >>> 0;
            if (!noAssert) checkOffset(offset, 2, this.length);
            var val = this[offset + 1] | (this[offset] << 8);
            return val & 32768 ? val | 4294901760 : val;
          };
          Buffer.prototype.readInt32LE = function readInt32LE(
            offset,
            noAssert
          ) {
            offset = offset >>> 0;
            if (!noAssert) checkOffset(offset, 4, this.length);
            return (
              this[offset] |
              (this[offset + 1] << 8) |
              (this[offset + 2] << 16) |
              (this[offset + 3] << 24)
            );
          };
          Buffer.prototype.readInt32BE = function readInt32BE(
            offset,
            noAssert
          ) {
            offset = offset >>> 0;
            if (!noAssert) checkOffset(offset, 4, this.length);
            return (
              (this[offset] << 24) |
              (this[offset + 1] << 16) |
              (this[offset + 2] << 8) |
              this[offset + 3]
            );
          };
          Buffer.prototype.readFloatLE = function readFloatLE(
            offset,
            noAssert
          ) {
            offset = offset >>> 0;
            if (!noAssert) checkOffset(offset, 4, this.length);
            return ieee754.read(this, offset, true, 23, 4);
          };
          Buffer.prototype.readFloatBE = function readFloatBE(
            offset,
            noAssert
          ) {
            offset = offset >>> 0;
            if (!noAssert) checkOffset(offset, 4, this.length);
            return ieee754.read(this, offset, false, 23, 4);
          };
          Buffer.prototype.readDoubleLE = function readDoubleLE(
            offset,
            noAssert
          ) {
            offset = offset >>> 0;
            if (!noAssert) checkOffset(offset, 8, this.length);
            return ieee754.read(this, offset, true, 52, 8);
          };
          Buffer.prototype.readDoubleBE = function readDoubleBE(
            offset,
            noAssert
          ) {
            offset = offset >>> 0;
            if (!noAssert) checkOffset(offset, 8, this.length);
            return ieee754.read(this, offset, false, 52, 8);
          };
          function checkInt(buf, value, offset, ext, max, min) {
            if (!Buffer.isBuffer(buf))
              throw new TypeError(
                '"buffer" argument must be a Buffer instance'
              );
            if (value > max || value < min)
              throw new RangeError('"value" argument is out of bounds');
            if (offset + ext > buf.length)
              throw new RangeError("Index out of range");
          }
          Buffer.prototype.writeUIntLE = function writeUIntLE(
            value,
            offset,
            byteLength,
            noAssert
          ) {
            value = +value;
            offset = offset >>> 0;
            byteLength = byteLength >>> 0;
            if (!noAssert) {
              var maxBytes = Math.pow(2, 8 * byteLength) - 1;
              checkInt(this, value, offset, byteLength, maxBytes, 0);
            }
            var mul = 1;
            var i = 0;
            this[offset] = value & 255;
            while (++i < byteLength && (mul *= 256)) {
              this[offset + i] = (value / mul) & 255;
            }
            return offset + byteLength;
          };
          Buffer.prototype.writeUIntBE = function writeUIntBE(
            value,
            offset,
            byteLength,
            noAssert
          ) {
            value = +value;
            offset = offset >>> 0;
            byteLength = byteLength >>> 0;
            if (!noAssert) {
              var maxBytes = Math.pow(2, 8 * byteLength) - 1;
              checkInt(this, value, offset, byteLength, maxBytes, 0);
            }
            var i = byteLength - 1;
            var mul = 1;
            this[offset + i] = value & 255;
            while (--i >= 0 && (mul *= 256)) {
              this[offset + i] = (value / mul) & 255;
            }
            return offset + byteLength;
          };
          Buffer.prototype.writeUInt8 = function writeUInt8(
            value,
            offset,
            noAssert
          ) {
            value = +value;
            offset = offset >>> 0;
            if (!noAssert) checkInt(this, value, offset, 1, 255, 0);
            this[offset] = value & 255;
            return offset + 1;
          };
          Buffer.prototype.writeUInt16LE = function writeUInt16LE(
            value,
            offset,
            noAssert
          ) {
            value = +value;
            offset = offset >>> 0;
            if (!noAssert) checkInt(this, value, offset, 2, 65535, 0);
            this[offset] = value & 255;
            this[offset + 1] = value >>> 8;
            return offset + 2;
          };
          Buffer.prototype.writeUInt16BE = function writeUInt16BE(
            value,
            offset,
            noAssert
          ) {
            value = +value;
            offset = offset >>> 0;
            if (!noAssert) checkInt(this, value, offset, 2, 65535, 0);
            this[offset] = value >>> 8;
            this[offset + 1] = value & 255;
            return offset + 2;
          };
          Buffer.prototype.writeUInt32LE = function writeUInt32LE(
            value,
            offset,
            noAssert
          ) {
            value = +value;
            offset = offset >>> 0;
            if (!noAssert) checkInt(this, value, offset, 4, 4294967295, 0);
            this[offset + 3] = value >>> 24;
            this[offset + 2] = value >>> 16;
            this[offset + 1] = value >>> 8;
            this[offset] = value & 255;
            return offset + 4;
          };
          Buffer.prototype.writeUInt32BE = function writeUInt32BE(
            value,
            offset,
            noAssert
          ) {
            value = +value;
            offset = offset >>> 0;
            if (!noAssert) checkInt(this, value, offset, 4, 4294967295, 0);
            this[offset] = value >>> 24;
            this[offset + 1] = value >>> 16;
            this[offset + 2] = value >>> 8;
            this[offset + 3] = value & 255;
            return offset + 4;
          };
          Buffer.prototype.writeIntLE = function writeIntLE(
            value,
            offset,
            byteLength,
            noAssert
          ) {
            value = +value;
            offset = offset >>> 0;
            if (!noAssert) {
              var limit = Math.pow(2, 8 * byteLength - 1);
              checkInt(this, value, offset, byteLength, limit - 1, -limit);
            }
            var i = 0;
            var mul = 1;
            var sub = 0;
            this[offset] = value & 255;
            while (++i < byteLength && (mul *= 256)) {
              if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
                sub = 1;
              }
              this[offset + i] = (((value / mul) >> 0) - sub) & 255;
            }
            return offset + byteLength;
          };
          Buffer.prototype.writeIntBE = function writeIntBE(
            value,
            offset,
            byteLength,
            noAssert
          ) {
            value = +value;
            offset = offset >>> 0;
            if (!noAssert) {
              var limit = Math.pow(2, 8 * byteLength - 1);
              checkInt(this, value, offset, byteLength, limit - 1, -limit);
            }
            var i = byteLength - 1;
            var mul = 1;
            var sub = 0;
            this[offset + i] = value & 255;
            while (--i >= 0 && (mul *= 256)) {
              if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
                sub = 1;
              }
              this[offset + i] = (((value / mul) >> 0) - sub) & 255;
            }
            return offset + byteLength;
          };
          Buffer.prototype.writeInt8 = function writeInt8(
            value,
            offset,
            noAssert
          ) {
            value = +value;
            offset = offset >>> 0;
            if (!noAssert) checkInt(this, value, offset, 1, 127, -128);
            if (value < 0) value = 255 + value + 1;
            this[offset] = value & 255;
            return offset + 1;
          };
          Buffer.prototype.writeInt16LE = function writeInt16LE(
            value,
            offset,
            noAssert
          ) {
            value = +value;
            offset = offset >>> 0;
            if (!noAssert) checkInt(this, value, offset, 2, 32767, -32768);
            this[offset] = value & 255;
            this[offset + 1] = value >>> 8;
            return offset + 2;
          };
          Buffer.prototype.writeInt16BE = function writeInt16BE(
            value,
            offset,
            noAssert
          ) {
            value = +value;
            offset = offset >>> 0;
            if (!noAssert) checkInt(this, value, offset, 2, 32767, -32768);
            this[offset] = value >>> 8;
            this[offset + 1] = value & 255;
            return offset + 2;
          };
          Buffer.prototype.writeInt32LE = function writeInt32LE(
            value,
            offset,
            noAssert
          ) {
            value = +value;
            offset = offset >>> 0;
            if (!noAssert)
              checkInt(this, value, offset, 4, 2147483647, -2147483648);
            this[offset] = value & 255;
            this[offset + 1] = value >>> 8;
            this[offset + 2] = value >>> 16;
            this[offset + 3] = value >>> 24;
            return offset + 4;
          };
          Buffer.prototype.writeInt32BE = function writeInt32BE(
            value,
            offset,
            noAssert
          ) {
            value = +value;
            offset = offset >>> 0;
            if (!noAssert)
              checkInt(this, value, offset, 4, 2147483647, -2147483648);
            if (value < 0) value = 4294967295 + value + 1;
            this[offset] = value >>> 24;
            this[offset + 1] = value >>> 16;
            this[offset + 2] = value >>> 8;
            this[offset + 3] = value & 255;
            return offset + 4;
          };
          function checkIEEE754(buf, value, offset, ext, max, min) {
            if (offset + ext > buf.length)
              throw new RangeError("Index out of range");
            if (offset < 0) throw new RangeError("Index out of range");
          }
          function writeFloat(buf, value, offset, littleEndian, noAssert) {
            value = +value;
            offset = offset >>> 0;
            if (!noAssert) {
              checkIEEE754(
                buf,
                value,
                offset,
                4,
                34028234663852886e22,
                -34028234663852886e22
              );
            }
            ieee754.write(buf, value, offset, littleEndian, 23, 4);
            return offset + 4;
          }
          Buffer.prototype.writeFloatLE = function writeFloatLE(
            value,
            offset,
            noAssert
          ) {
            return writeFloat(this, value, offset, true, noAssert);
          };
          Buffer.prototype.writeFloatBE = function writeFloatBE(
            value,
            offset,
            noAssert
          ) {
            return writeFloat(this, value, offset, false, noAssert);
          };
          function writeDouble(buf, value, offset, littleEndian, noAssert) {
            value = +value;
            offset = offset >>> 0;
            if (!noAssert) {
              checkIEEE754(
                buf,
                value,
                offset,
                8,
                17976931348623157e292,
                -17976931348623157e292
              );
            }
            ieee754.write(buf, value, offset, littleEndian, 52, 8);
            return offset + 8;
          }
          Buffer.prototype.writeDoubleLE = function writeDoubleLE(
            value,
            offset,
            noAssert
          ) {
            return writeDouble(this, value, offset, true, noAssert);
          };
          Buffer.prototype.writeDoubleBE = function writeDoubleBE(
            value,
            offset,
            noAssert
          ) {
            return writeDouble(this, value, offset, false, noAssert);
          };
          Buffer.prototype.copy = function copy(
            target,
            targetStart,
            start,
            end
          ) {
            if (!Buffer.isBuffer(target))
              throw new TypeError("argument should be a Buffer");
            if (!start) start = 0;
            if (!end && end !== 0) end = this.length;
            if (targetStart >= target.length) targetStart = target.length;
            if (!targetStart) targetStart = 0;
            if (end > 0 && end < start) end = start;
            if (end === start) return 0;
            if (target.length === 0 || this.length === 0) return 0;
            if (targetStart < 0) {
              throw new RangeError("targetStart out of bounds");
            }
            if (start < 0 || start >= this.length)
              throw new RangeError("Index out of range");
            if (end < 0) throw new RangeError("sourceEnd out of bounds");
            if (end > this.length) end = this.length;
            if (target.length - targetStart < end - start) {
              end = target.length - targetStart + start;
            }
            var len = end - start;
            if (
              this === target &&
              typeof Uint8Array.prototype.copyWithin === "function"
            ) {
              this.copyWithin(targetStart, start, end);
            } else if (
              this === target &&
              start < targetStart &&
              targetStart < end
            ) {
              for (var i = len - 1; i >= 0; --i) {
                target[i + targetStart] = this[i + start];
              }
            } else {
              Uint8Array.prototype.set.call(
                target,
                this.subarray(start, end),
                targetStart
              );
            }
            return len;
          };
          Buffer.prototype.fill = function fill(val, start, end, encoding) {
            if (typeof val === "string") {
              if (typeof start === "string") {
                encoding = start;
                start = 0;
                end = this.length;
              } else if (typeof end === "string") {
                encoding = end;
                end = this.length;
              }
              if (encoding !== undefined && typeof encoding !== "string") {
                throw new TypeError("encoding must be a string");
              }
              if (
                typeof encoding === "string" &&
                !Buffer.isEncoding(encoding)
              ) {
                throw new TypeError("Unknown encoding: " + encoding);
              }
              if (val.length === 1) {
                var code = val.charCodeAt(0);
                if (
                  (encoding === "utf8" && code < 128) ||
                  encoding === "latin1"
                ) {
                  val = code;
                }
              }
            } else if (typeof val === "number") {
              val = val & 255;
            }
            if (start < 0 || this.length < start || this.length < end) {
              throw new RangeError("Out of range index");
            }
            if (end <= start) {
              return this;
            }
            start = start >>> 0;
            end = end === undefined ? this.length : end >>> 0;
            if (!val) val = 0;
            var i;
            if (typeof val === "number") {
              for (i = start; i < end; ++i) {
                this[i] = val;
              }
            } else {
              var bytes = Buffer.isBuffer(val)
                ? val
                : Buffer.from(val, encoding);
              var len = bytes.length;
              if (len === 0) {
                throw new TypeError(
                  'The value "' + val + '" is invalid for argument "value"'
                );
              }
              for (i = 0; i < end - start; ++i) {
                this[i + start] = bytes[i % len];
              }
            }
            return this;
          };
          var INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g;
          function base64clean(str) {
            str = str.split("=")[0];
            str = str.trim().replace(INVALID_BASE64_RE, "");
            if (str.length < 2) return "";
            while (str.length % 4 !== 0) {
              str = str + "=";
            }
            return str;
          }
          function toHex(n) {
            if (n < 16) return "0" + n.toString(16);
            return n.toString(16);
          }
          function utf8ToBytes(string, units) {
            units = units || Infinity;
            var codePoint;
            var length = string.length;
            var leadSurrogate = null;
            var bytes = [];
            for (var i = 0; i < length; ++i) {
              codePoint = string.charCodeAt(i);
              if (codePoint > 55295 && codePoint < 57344) {
                if (!leadSurrogate) {
                  if (codePoint > 56319) {
                    if ((units -= 3) > -1) bytes.push(239, 191, 189);
                    continue;
                  } else if (i + 1 === length) {
                    if ((units -= 3) > -1) bytes.push(239, 191, 189);
                    continue;
                  }
                  leadSurrogate = codePoint;
                  continue;
                }
                if (codePoint < 56320) {
                  if ((units -= 3) > -1) bytes.push(239, 191, 189);
                  leadSurrogate = codePoint;
                  continue;
                }
                codePoint =
                  (((leadSurrogate - 55296) << 10) | (codePoint - 56320)) +
                  65536;
              } else if (leadSurrogate) {
                if ((units -= 3) > -1) bytes.push(239, 191, 189);
              }
              leadSurrogate = null;
              if (codePoint < 128) {
                if ((units -= 1) < 0) break;
                bytes.push(codePoint);
              } else if (codePoint < 2048) {
                if ((units -= 2) < 0) break;
                bytes.push((codePoint >> 6) | 192, (codePoint & 63) | 128);
              } else if (codePoint < 65536) {
                if ((units -= 3) < 0) break;
                bytes.push(
                  (codePoint >> 12) | 224,
                  ((codePoint >> 6) & 63) | 128,
                  (codePoint & 63) | 128
                );
              } else if (codePoint < 1114112) {
                if ((units -= 4) < 0) break;
                bytes.push(
                  (codePoint >> 18) | 240,
                  ((codePoint >> 12) & 63) | 128,
                  ((codePoint >> 6) & 63) | 128,
                  (codePoint & 63) | 128
                );
              } else {
                throw new Error("Invalid code point");
              }
            }
            return bytes;
          }
          function asciiToBytes(str) {
            var byteArray = [];
            for (var i = 0; i < str.length; ++i) {
              byteArray.push(str.charCodeAt(i) & 255);
            }
            return byteArray;
          }
          function utf16leToBytes(str, units) {
            var c, hi, lo;
            var byteArray = [];
            for (var i = 0; i < str.length; ++i) {
              if ((units -= 2) < 0) break;
              c = str.charCodeAt(i);
              hi = c >> 8;
              lo = c % 256;
              byteArray.push(lo);
              byteArray.push(hi);
            }
            return byteArray;
          }
          function base64ToBytes(str) {
            return base64.toByteArray(base64clean(str));
          }
          function blitBuffer(src, dst, offset, length) {
            for (var i = 0; i < length; ++i) {
              if (i + offset >= dst.length || i >= src.length) break;
              dst[i + offset] = src[i];
            }
            return i;
          }
          function isInstance(obj, type) {
            return (
              obj instanceof type ||
              (obj != null &&
                obj.constructor != null &&
                obj.constructor.name != null &&
                obj.constructor.name === type.name)
            );
          }
          function numberIsNaN(obj) {
            return obj !== obj;
          }
        }.call(this, require("buffer").Buffer));
      },
      { "base64-js": 5, buffer: 8, ieee754: 28 },
    ],
    9: [
      function (require, module, exports) {
        var slice = [].slice;
        module.exports = function (obj, fn) {
          if ("string" == typeof fn) fn = obj[fn];
          if ("function" != typeof fn)
            throw new Error("bind() requires a function");
          var args = slice.call(arguments, 2);
          return function () {
            return fn.apply(obj, args.concat(slice.call(arguments)));
          };
        };
      },
      {},
    ],
    10: [
      function (require, module, exports) {
        if (typeof module !== "undefined") {
          module.exports = Emitter;
        }
        function Emitter(obj) {
          if (obj) return mixin(obj);
        }
        function mixin(obj) {
          for (var key in Emitter.prototype) {
            obj[key] = Emitter.prototype[key];
          }
          return obj;
        }
        Emitter.prototype.on = Emitter.prototype.addEventListener = function (
          event,
          fn
        ) {
          this._callbacks = this._callbacks || {};
          (this._callbacks["$" + event] =
            this._callbacks["$" + event] || []).push(fn);
          return this;
        };
        Emitter.prototype.once = function (event, fn) {
          function on() {
            this.off(event, on);
            fn.apply(this, arguments);
          }
          on.fn = fn;
          this.on(event, on);
          return this;
        };
        Emitter.prototype.off =
          Emitter.prototype.removeListener =
          Emitter.prototype.removeAllListeners =
          Emitter.prototype.removeEventListener =
            function (event, fn) {
              this._callbacks = this._callbacks || {};
              if (0 == arguments.length) {
                this._callbacks = {};
                return this;
              }
              var callbacks = this._callbacks["$" + event];
              if (!callbacks) return this;
              if (1 == arguments.length) {
                delete this._callbacks["$" + event];
                return this;
              }
              var cb;
              for (var i = 0; i < callbacks.length; i++) {
                cb = callbacks[i];
                if (cb === fn || cb.fn === fn) {
                  callbacks.splice(i, 1);
                  break;
                }
              }
              return this;
            };
        Emitter.prototype.emit = function (event) {
          this._callbacks = this._callbacks || {};
          var args = [].slice.call(arguments, 1),
            callbacks = this._callbacks["$" + event];
          if (callbacks) {
            callbacks = callbacks.slice(0);
            for (var i = 0, len = callbacks.length; i < len; ++i) {
              callbacks[i].apply(this, args);
            }
          }
          return this;
        };
        Emitter.prototype.listeners = function (event) {
          this._callbacks = this._callbacks || {};
          return this._callbacks["$" + event] || [];
        };
        Emitter.prototype.hasListeners = function (event) {
          return !!this.listeners(event).length;
        };
      },
      {},
    ],
    11: [
      function (require, module, exports) {
        module.exports = function (a, b) {
          var fn = function () {};
          fn.prototype = b.prototype;
          a.prototype = new fn();
          a.prototype.constructor = a;
        };
      },
      {},
    ],
    12: [
      function (require, module, exports) {
        module.exports = require("./socket");
        module.exports.parser = require("engine.io-parser");
      },
      { "./socket": 13, "engine.io-parser": 23 },
    ],
    13: [
      function (require, module, exports) {
        (function (global) {
          var transports = require("./transports/index");
          var Emitter = require("component-emitter");
          var debug = require("debug")("engine.io-client:socket");
          var index = require("indexof");
          var parser = require("engine.io-parser");
          var parseuri = require("parseuri");
          var parseqs = require("parseqs");
          module.exports = Socket;
          function Socket(uri, opts) {
            if (!(this instanceof Socket)) return new Socket(uri, opts);
            opts = opts || {};
            if (uri && "object" === typeof uri) {
              opts = uri;
              uri = null;
            }
            if (uri) {
              uri = parseuri(uri);
              opts.hostname = uri.host;
              opts.secure = uri.protocol === "https" || uri.protocol === "wss";
              opts.port = uri.port;
              if (uri.query) opts.query = uri.query;
            } else if (opts.host) {
              opts.hostname = parseuri(opts.host).host;
            }
            this.secure =
              null != opts.secure
                ? opts.secure
                : global.location && "https:" === location.protocol;
            if (opts.hostname && !opts.port) {
              opts.port = this.secure ? "443" : "80";
            }
            this.agent = opts.agent || false;
            this.hostname =
              opts.hostname ||
              (global.location ? location.hostname : "localhost");
            this.port =
              opts.port ||
              (global.location && location.port
                ? location.port
                : this.secure
                ? 443
                : 80);
            this.query = opts.query || {};
            if ("string" === typeof this.query)
              this.query = parseqs.decode(this.query);
            this.upgrade = false !== opts.upgrade;
            this.path = (opts.path || "/engine.io").replace(/\/$/, "") + "/";
            this.forceJSONP = !!opts.forceJSONP;
            this.jsonp = false !== opts.jsonp;
            this.forceBase64 = !!opts.forceBase64;
            this.enablesXDR = !!opts.enablesXDR;
            this.timestampParam = opts.timestampParam || "t";
            this.timestampRequests = opts.timestampRequests;
            this.transports = opts.transports || ["polling", "websocket"];
            this.transportOptions = opts.transportOptions || {};
            this.readyState = "";
            this.writeBuffer = [];
            this.prevBufferLen = 0;
            this.policyPort = opts.policyPort || 843;
            this.rememberUpgrade = opts.rememberUpgrade || false;
            this.binaryType = null;
            this.onlyBinaryUpgrades = opts.onlyBinaryUpgrades;
            this.perMessageDeflate =
              false !== opts.perMessageDeflate
                ? opts.perMessageDeflate || {}
                : false;
            if (true === this.perMessageDeflate) this.perMessageDeflate = {};
            if (
              this.perMessageDeflate &&
              null == this.perMessageDeflate.threshold
            ) {
              this.perMessageDeflate.threshold = 1024;
            }
            this.pfx = opts.pfx || null;
            this.key = opts.key || null;
            this.passphrase = opts.passphrase || null;
            this.cert = opts.cert || null;
            this.ca = opts.ca || null;
            this.ciphers = opts.ciphers || null;
            this.rejectUnauthorized =
              opts.rejectUnauthorized === undefined
                ? true
                : opts.rejectUnauthorized;
            this.forceNode = !!opts.forceNode;
            var freeGlobal = typeof global === "object" && global;
            if (freeGlobal.global === freeGlobal) {
              if (
                opts.extraHeaders &&
                Object.keys(opts.extraHeaders).length > 0
              ) {
                this.extraHeaders = opts.extraHeaders;
              }
              if (opts.localAddress) {
                this.localAddress = opts.localAddress;
              }
            }
            this.id = null;
            this.upgrades = null;
            this.pingInterval = null;
            this.pingTimeout = null;
            this.pingIntervalTimer = null;
            this.pingTimeoutTimer = null;
            this.open();
          }
          Socket.priorWebsocketSuccess = false;
          Emitter(Socket.prototype);
          Socket.protocol = parser.protocol;
          Socket.Socket = Socket;
          Socket.Transport = require("./transport");
          Socket.transports = require("./transports/index");
          Socket.parser = require("engine.io-parser");
          Socket.prototype.createTransport = function (name) {
            debug('creating transport "%s"', name);
            var query = clone(this.query);
            query.EIO = parser.protocol;
            query.transport = name;
            var options = this.transportOptions[name] || {};
            if (this.id) query.sid = this.id;
            var transport = new transports[name]({
              query: query,
              socket: this,
              agent: options.agent || this.agent,
              hostname: options.hostname || this.hostname,
              port: options.port || this.port,
              secure: options.secure || this.secure,
              path: options.path || this.path,
              forceJSONP: options.forceJSONP || this.forceJSONP,
              jsonp: options.jsonp || this.jsonp,
              forceBase64: options.forceBase64 || this.forceBase64,
              enablesXDR: options.enablesXDR || this.enablesXDR,
              timestampRequests:
                options.timestampRequests || this.timestampRequests,
              timestampParam: options.timestampParam || this.timestampParam,
              policyPort: options.policyPort || this.policyPort,
              pfx: options.pfx || this.pfx,
              key: options.key || this.key,
              passphrase: options.passphrase || this.passphrase,
              cert: options.cert || this.cert,
              ca: options.ca || this.ca,
              ciphers: options.ciphers || this.ciphers,
              rejectUnauthorized:
                options.rejectUnauthorized || this.rejectUnauthorized,
              perMessageDeflate:
                options.perMessageDeflate || this.perMessageDeflate,
              extraHeaders: options.extraHeaders || this.extraHeaders,
              forceNode: options.forceNode || this.forceNode,
              localAddress: options.localAddress || this.localAddress,
              requestTimeout: options.requestTimeout || this.requestTimeout,
              protocols: options.protocols || void 0,
            });
            return transport;
          };
          function clone(obj) {
            var o = {};
            for (var i in obj) {
              if (obj.hasOwnProperty(i)) {
                o[i] = obj[i];
              }
            }
            return o;
          }
          Socket.prototype.open = function () {
            var transport;
            if (
              this.rememberUpgrade &&
              Socket.priorWebsocketSuccess &&
              this.transports.indexOf("websocket") !== -1
            ) {
              transport = "websocket";
            } else if (0 === this.transports.length) {
              var self = this;
              setTimeout(function () {
                self.emit("error", "No transports available");
              }, 0);
              return;
            } else {
              transport = this.transports[0];
            }
            this.readyState = "opening";
            try {
              transport = this.createTransport(transport);
            } catch (e) {
              this.transports.shift();
              this.open();
              return;
            }
            transport.open();
            this.setTransport(transport);
          };
          Socket.prototype.setTransport = function (transport) {
            debug("setting transport %s", transport.name);
            var self = this;
            if (this.transport) {
              debug("clearing existing transport %s", this.transport.name);
              this.transport.removeAllListeners();
            }
            this.transport = transport;
            transport
              .on("drain", function () {
                self.onDrain();
              })
              .on("packet", function (packet) {
                self.onPacket(packet);
              })
              .on("error", function (e) {
                self.onError(e);
              })
              .on("close", function () {
                self.onClose("transport close");
              });
          };
          Socket.prototype.probe = function (name) {
            debug('probing transport "%s"', name);
            var transport = this.createTransport(name, { probe: 1 });
            var failed = false;
            var self = this;
            Socket.priorWebsocketSuccess = false;
            function onTransportOpen() {
              if (self.onlyBinaryUpgrades) {
                var upgradeLosesBinary =
                  !this.supportsBinary && self.transport.supportsBinary;
                failed = failed || upgradeLosesBinary;
              }
              if (failed) return;
              debug('probe transport "%s" opened', name);
              transport.send([{ type: "ping", data: "probe" }]);
              transport.once("packet", function (msg) {
                if (failed) return;
                if ("pong" === msg.type && "probe" === msg.data) {
                  debug('probe transport "%s" pong', name);
                  self.upgrading = true;
                  self.emit("upgrading", transport);
                  if (!transport) return;
                  Socket.priorWebsocketSuccess = "websocket" === transport.name;
                  debug('pausing current transport "%s"', self.transport.name);
                  self.transport.pause(function () {
                    if (failed) return;
                    if ("closed" === self.readyState) return;
                    debug("changing transport and sending upgrade packet");
                    cleanup();
                    self.setTransport(transport);
                    transport.send([{ type: "upgrade" }]);
                    self.emit("upgrade", transport);
                    transport = null;
                    self.upgrading = false;
                    self.flush();
                  });
                } else {
                  debug('probe transport "%s" failed', name);
                  var err = new Error("probe error");
                  err.transport = transport.name;
                  self.emit("upgradeError", err);
                }
              });
            }
            function freezeTransport() {
              if (failed) return;
              failed = true;
              cleanup();
              transport.close();
              transport = null;
            }
            function onerror(err) {
              var error = new Error("probe error: " + err);
              error.transport = transport.name;
              freezeTransport();
              debug(
                'probe transport "%s" failed because of error: %s',
                name,
                err
              );
              self.emit("upgradeError", error);
            }
            function onTransportClose() {
              onerror("transport closed");
            }
            function onclose() {
              onerror("socket closed");
            }
            function onupgrade(to) {
              if (transport && to.name !== transport.name) {
                debug('"%s" works - aborting "%s"', to.name, transport.name);
                freezeTransport();
              }
            }
            function cleanup() {
              transport.removeListener("open", onTransportOpen);
              transport.removeListener("error", onerror);
              transport.removeListener("close", onTransportClose);
              self.removeListener("close", onclose);
              self.removeListener("upgrading", onupgrade);
            }
            transport.once("open", onTransportOpen);
            transport.once("error", onerror);
            transport.once("close", onTransportClose);
            this.once("close", onclose);
            this.once("upgrading", onupgrade);
            transport.open();
          };
          Socket.prototype.onOpen = function () {
            debug("socket open");
            this.readyState = "open";
            Socket.priorWebsocketSuccess = "websocket" === this.transport.name;
            this.emit("open");
            this.flush();
            if (
              "open" === this.readyState &&
              this.upgrade &&
              this.transport.pause
            ) {
              debug("starting upgrade probes");
              for (var i = 0, l = this.upgrades.length; i < l; i++) {
                this.probe(this.upgrades[i]);
              }
            }
          };
          Socket.prototype.onPacket = function (packet) {
            if (
              "opening" === this.readyState ||
              "open" === this.readyState ||
              "closing" === this.readyState
            ) {
              debug(
                'socket receive: type "%s", data "%s"',
                packet.type,
                packet.data
              );
              this.emit("packet", packet);
              this.emit("heartbeat");
              switch (packet.type) {
                case "open":
                  this.onHandshake(JSON.parse(packet.data));
                  break;
                case "pong":
                  this.setPing();
                  this.emit("pong");
                  break;
                case "error":
                  var err = new Error("server error");
                  err.code = packet.data;
                  this.onError(err);
                  break;
                case "message":
                  this.emit("data", packet.data);
                  this.emit("message", packet.data);
                  break;
              }
            } else {
              debug(
                'packet received with socket readyState "%s"',
                this.readyState
              );
            }
          };
          Socket.prototype.onHandshake = function (data) {
            this.emit("handshake", data);
            this.id = data.sid;
            this.transport.query.sid = data.sid;
            this.upgrades = this.filterUpgrades(data.upgrades);
            this.pingInterval = data.pingInterval;
            this.pingTimeout = data.pingTimeout;
            this.onOpen();
            if ("closed" === this.readyState) return;
            this.setPing();
            this.removeListener("heartbeat", this.onHeartbeat);
            this.on("heartbeat", this.onHeartbeat);
          };
          Socket.prototype.onHeartbeat = function (timeout) {
            clearTimeout(this.pingTimeoutTimer);
            var self = this;
            self.pingTimeoutTimer = setTimeout(function () {
              if ("closed" === self.readyState) return;
              self.onClose("ping timeout");
            }, timeout || self.pingInterval + self.pingTimeout);
          };
          Socket.prototype.setPing = function () {
            var self = this;
            clearTimeout(self.pingIntervalTimer);
            self.pingIntervalTimer = setTimeout(function () {
              debug(
                "writing ping packet - expecting pong within %sms",
                self.pingTimeout
              );
              self.ping();
              self.onHeartbeat(self.pingTimeout);
            }, self.pingInterval);
          };
          Socket.prototype.ping = function () {
            var self = this;
            this.sendPacket("ping", function () {
              self.emit("ping");
            });
          };
          Socket.prototype.onDrain = function () {
            this.writeBuffer.splice(0, this.prevBufferLen);
            this.prevBufferLen = 0;
            if (0 === this.writeBuffer.length) {
              this.emit("drain");
            } else {
              this.flush();
            }
          };
          Socket.prototype.flush = function () {
            if (
              "closed" !== this.readyState &&
              this.transport.writable &&
              !this.upgrading &&
              this.writeBuffer.length
            ) {
              debug("flushing %d packets in socket", this.writeBuffer.length);
              this.transport.send(this.writeBuffer);
              this.prevBufferLen = this.writeBuffer.length;
              this.emit("flush");
            }
          };
          Socket.prototype.write = Socket.prototype.send = function (
            msg,
            options,
            fn
          ) {
            this.sendPacket("message", msg, options, fn);
            return this;
          };
          Socket.prototype.sendPacket = function (type, data, options, fn) {
            if ("function" === typeof data) {
              fn = data;
              data = undefined;
            }
            if ("function" === typeof options) {
              fn = options;
              options = null;
            }
            if ("closing" === this.readyState || "closed" === this.readyState) {
              return;
            }
            options = options || {};
            options.compress = false !== options.compress;
            var packet = { type: type, data: data, options: options };
            this.emit("packetCreate", packet);
            this.writeBuffer.push(packet);
            if (fn) this.once("flush", fn);
            this.flush();
          };
          Socket.prototype.close = function () {
            if ("opening" === this.readyState || "open" === this.readyState) {
              this.readyState = "closing";
              var self = this;
              if (this.writeBuffer.length) {
                this.once("drain", function () {
                  if (this.upgrading) {
                    waitForUpgrade();
                  } else {
                    close();
                  }
                });
              } else if (this.upgrading) {
                waitForUpgrade();
              } else {
                close();
              }
            }
            function close() {
              self.onClose("forced close");
              debug("socket closing - telling transport to close");
              self.transport.close();
            }
            function cleanupAndClose() {
              self.removeListener("upgrade", cleanupAndClose);
              self.removeListener("upgradeError", cleanupAndClose);
              close();
            }
            function waitForUpgrade() {
              self.once("upgrade", cleanupAndClose);
              self.once("upgradeError", cleanupAndClose);
            }
            return this;
          };
          Socket.prototype.onError = function (err) {
            debug("socket error %j", err);
            Socket.priorWebsocketSuccess = false;
            this.emit("error", err);
            this.onClose("transport error", err);
          };
          Socket.prototype.onClose = function (reason, desc) {
            if (
              "opening" === this.readyState ||
              "open" === this.readyState ||
              "closing" === this.readyState
            ) {
              debug('socket close with reason: "%s"', reason);
              var self = this;
              clearTimeout(this.pingIntervalTimer);
              clearTimeout(this.pingTimeoutTimer);
              this.transport.removeAllListeners("close");
              this.transport.close();
              this.transport.removeAllListeners();
              this.readyState = "closed";
              this.id = null;
              this.emit("close", reason, desc);
              self.writeBuffer = [];
              self.prevBufferLen = 0;
            }
          };
          Socket.prototype.filterUpgrades = function (upgrades) {
            var filteredUpgrades = [];
            for (var i = 0, j = upgrades.length; i < j; i++) {
              if (~index(this.transports, upgrades[i]))
                filteredUpgrades.push(upgrades[i]);
            }
            return filteredUpgrades;
          };
        }.call(
          this,
          typeof global !== "undefined"
            ? global
            : typeof self !== "undefined"
            ? self
            : typeof window !== "undefined"
            ? window
            : {}
        ));
      },
      {
        "./transport": 14,
        "./transports/index": 15,
        "component-emitter": 10,
        debug: 21,
        "engine.io-parser": 23,
        indexof: 29,
        parseqs: 32,
        parseuri: 33,
      },
    ],
    14: [
      function (require, module, exports) {
        var parser = require("engine.io-parser");
        var Emitter = require("component-emitter");
        module.exports = Transport;
        function Transport(opts) {
          this.path = opts.path;
          this.hostname = opts.hostname;
          this.port = opts.port;
          this.secure = opts.secure;
          this.query = opts.query;
          this.timestampParam = opts.timestampParam;
          this.timestampRequests = opts.timestampRequests;
          this.readyState = "";
          this.agent = opts.agent || false;
          this.socket = opts.socket;
          this.enablesXDR = opts.enablesXDR;
          this.pfx = opts.pfx;
          this.key = opts.key;
          this.passphrase = opts.passphrase;
          this.cert = opts.cert;
          this.ca = opts.ca;
          this.ciphers = opts.ciphers;
          this.rejectUnauthorized = opts.rejectUnauthorized;
          this.forceNode = opts.forceNode;
          this.extraHeaders = opts.extraHeaders;
          this.localAddress = opts.localAddress;
        }
        Emitter(Transport.prototype);
        Transport.prototype.onError = function (msg, desc) {
          var err = new Error(msg);
          err.type = "TransportError";
          err.description = desc;
          this.emit("error", err);
          return this;
        };
        Transport.prototype.open = function () {
          if ("closed" === this.readyState || "" === this.readyState) {
            this.readyState = "opening";
            this.doOpen();
          }
          return this;
        };
        Transport.prototype.close = function () {
          if ("opening" === this.readyState || "open" === this.readyState) {
            this.doClose();
            this.onClose();
          }
          return this;
        };
        Transport.prototype.send = function (packets) {
          if ("open" === this.readyState) {
            this.write(packets);
          } else {
            throw new Error("Transport not open");
          }
        };
        Transport.prototype.onOpen = function () {
          this.readyState = "open";
          this.writable = true;
          this.emit("open");
        };
        Transport.prototype.onData = function (data) {
          var packet = parser.decodePacket(data, this.socket.binaryType);
          this.onPacket(packet);
        };
        Transport.prototype.onPacket = function (packet) {
          this.emit("packet", packet);
        };
        Transport.prototype.onClose = function () {
          this.readyState = "closed";
          this.emit("close");
        };
      },
      { "component-emitter": 10, "engine.io-parser": 23 },
    ],
    15: [
      function (require, module, exports) {
        (function (global) {
          var XMLHttpRequest = require("xmlhttprequest-ssl");
          var XHR = require("./polling-xhr");
          var JSONP = require("./polling-jsonp");
          var websocket = require("./websocket");
          exports.polling = polling;
          exports.websocket = websocket;
          function polling(opts) {
            var xhr;
            var xd = false;
            var xs = false;
            var jsonp = false !== opts.jsonp;
            if (global.location) {
              var isSSL = "https:" === location.protocol;
              var port = location.port;
              if (!port) {
                port = isSSL ? 443 : 80;
              }
              xd = opts.hostname !== location.hostname || port !== opts.port;
              xs = opts.secure !== isSSL;
            }
            opts.xdomain = xd;
            opts.xscheme = xs;
            xhr = new XMLHttpRequest(opts);
            if ("open" in xhr && !opts.forceJSONP) {
              return new XHR(opts);
            } else {
              if (!jsonp) throw new Error("JSONP disabled");
              return new JSONP(opts);
            }
          }
        }.call(
          this,
          typeof global !== "undefined"
            ? global
            : typeof self !== "undefined"
            ? self
            : typeof window !== "undefined"
            ? window
            : {}
        ));
      },
      {
        "./polling-jsonp": 16,
        "./polling-xhr": 17,
        "./websocket": 19,
        "xmlhttprequest-ssl": 20,
      },
    ],
    16: [
      function (require, module, exports) {
        (function (global) {
          var Polling = require("./polling");
          var inherit = require("component-inherit");
          module.exports = JSONPPolling;
          var rNewline = /\n/g;
          var rEscapedNewline = /\\n/g;
          var callbacks;
          function empty() {}
          function JSONPPolling(opts) {
            Polling.call(this, opts);
            this.query = this.query || {};
            if (!callbacks) {
              if (!global.___eio) global.___eio = [];
              callbacks = global.___eio;
            }
            this.index = callbacks.length;
            var self = this;
            callbacks.push(function (msg) {
              self.onData(msg);
            });
            this.query.j = this.index;
            if (global.document && global.addEventListener) {
              global.addEventListener(
                "beforeunload",
                function () {
                  if (self.script) self.script.onerror = empty;
                },
                false
              );
            }
          }
          inherit(JSONPPolling, Polling);
          JSONPPolling.prototype.supportsBinary = false;
          JSONPPolling.prototype.doClose = function () {
            if (this.script) {
              this.script.parentNode.removeChild(this.script);
              this.script = null;
            }
            if (this.form) {
              this.form.parentNode.removeChild(this.form);
              this.form = null;
              this.iframe = null;
            }
            Polling.prototype.doClose.call(this);
          };
          JSONPPolling.prototype.doPoll = function () {
            var self = this;
            var script = document.createElement("script");
            if (this.script) {
              this.script.parentNode.removeChild(this.script);
              this.script = null;
            }
            script.async = true;
            script.src = this.uri();
            script.onerror = function (e) {
              self.onError("jsonp poll error", e);
            };
            var insertAt = document.getElementsByTagName("script")[0];
            if (insertAt) {
              insertAt.parentNode.insertBefore(script, insertAt);
            } else {
              (document.head || document.body).appendChild(script);
            }
            this.script = script;
            var isUAgecko =
              "undefined" !== typeof navigator &&
              /gecko/i.test(navigator.userAgent);
            if (isUAgecko) {
              setTimeout(function () {
                var iframe = document.createElement("iframe");
                document.body.appendChild(iframe);
                document.body.removeChild(iframe);
              }, 100);
            }
          };
          JSONPPolling.prototype.doWrite = function (data, fn) {
            var self = this;
            if (!this.form) {
              var form = document.createElement("form");
              var area = document.createElement("textarea");
              var id = (this.iframeId = "eio_iframe_" + this.index);
              var iframe;
              form.className = "socketio";
              form.style.position = "absolute";
              form.style.top = "-1000px";
              form.style.left = "-1000px";
              form.target = id;
              form.method = "POST";
              form.setAttribute("accept-charset", "utf-8");
              area.name = "d";
              form.appendChild(area);
              document.body.appendChild(form);
              this.form = form;
              this.area = area;
            }
            this.form.action = this.uri();
            function complete() {
              initIframe();
              fn();
            }
            function initIframe() {
              if (self.iframe) {
                try {
                  self.form.removeChild(self.iframe);
                } catch (e) {
                  self.onError("jsonp polling iframe removal error", e);
                }
              }
              try {
                var html =
                  '<iframe src="javascript:0" name="' + self.iframeId + '">';
                iframe = document.createElement(html);
              } catch (e) {
                iframe = document.createElement("iframe");
                iframe.name = self.iframeId;
                iframe.src = "javascript:0";
              }
              iframe.id = self.iframeId;
              self.form.appendChild(iframe);
              self.iframe = iframe;
            }
            initIframe();
            data = data.replace(rEscapedNewline, "\\\n");
            this.area.value = data.replace(rNewline, "\\n");
            try {
              this.form.submit();
            } catch (e) {}
            if (this.iframe.attachEvent) {
              this.iframe.onreadystatechange = function () {
                if (self.iframe.readyState === "complete") {
                  complete();
                }
              };
            } else {
              this.iframe.onload = complete;
            }
          };
        }.call(
          this,
          typeof global !== "undefined"
            ? global
            : typeof self !== "undefined"
            ? self
            : typeof window !== "undefined"
            ? window
            : {}
        ));
      },
      { "./polling": 18, "component-inherit": 11 },
    ],
    17: [
      function (require, module, exports) {
        (function (global) {
          var XMLHttpRequest = require("xmlhttprequest-ssl");
          var Polling = require("./polling");
          var Emitter = require("component-emitter");
          var inherit = require("component-inherit");
          var debug = require("debug")("engine.io-client:polling-xhr");
          module.exports = XHR;
          module.exports.Request = Request;
          function empty() {}
          function XHR(opts) {
            Polling.call(this, opts);
            this.requestTimeout = opts.requestTimeout;
            this.extraHeaders = opts.extraHeaders;
            if (global.location) {
              var isSSL = "https:" === location.protocol;
              var port = location.port;
              if (!port) {
                port = isSSL ? 443 : 80;
              }
              this.xd =
                opts.hostname !== global.location.hostname ||
                port !== opts.port;
              this.xs = opts.secure !== isSSL;
            }
          }
          inherit(XHR, Polling);
          XHR.prototype.supportsBinary = true;
          XHR.prototype.request = function (opts) {
            opts = opts || {};
            opts.uri = this.uri();
            opts.xd = this.xd;
            opts.xs = this.xs;
            opts.agent = this.agent || false;
            opts.supportsBinary = this.supportsBinary;
            opts.enablesXDR = this.enablesXDR;
            opts.pfx = this.pfx;
            opts.key = this.key;
            opts.passphrase = this.passphrase;
            opts.cert = this.cert;
            opts.ca = this.ca;
            opts.ciphers = this.ciphers;
            opts.rejectUnauthorized = this.rejectUnauthorized;
            opts.requestTimeout = this.requestTimeout;
            opts.extraHeaders = this.extraHeaders;
            return new Request(opts);
          };
          XHR.prototype.doWrite = function (data, fn) {
            var isBinary = typeof data !== "string" && data !== undefined;
            var req = this.request({
              method: "POST",
              data: data,
              isBinary: isBinary,
            });
            var self = this;
            req.on("success", fn);
            req.on("error", function (err) {
              self.onError("xhr post error", err);
            });
            this.sendXhr = req;
          };
          XHR.prototype.doPoll = function () {
            debug("xhr poll");
            var req = this.request();
            var self = this;
            req.on("data", function (data) {
              self.onData(data);
            });
            req.on("error", function (err) {
              self.onError("xhr poll error", err);
            });
            this.pollXhr = req;
          };
          function Request(opts) {
            this.method = opts.method || "GET";
            this.uri = opts.uri;
            this.xd = !!opts.xd;
            this.xs = !!opts.xs;
            this.async = false !== opts.async;
            this.data = undefined !== opts.data ? opts.data : null;
            this.agent = opts.agent;
            this.isBinary = opts.isBinary;
            this.supportsBinary = opts.supportsBinary;
            this.enablesXDR = opts.enablesXDR;
            this.requestTimeout = opts.requestTimeout;
            this.pfx = opts.pfx;
            this.key = opts.key;
            this.passphrase = opts.passphrase;
            this.cert = opts.cert;
            this.ca = opts.ca;
            this.ciphers = opts.ciphers;
            this.rejectUnauthorized = opts.rejectUnauthorized;
            this.extraHeaders = opts.extraHeaders;
            this.create();
          }
          Emitter(Request.prototype);
          Request.prototype.create = function () {
            var opts = {
              agent: this.agent,
              xdomain: this.xd,
              xscheme: this.xs,
              enablesXDR: this.enablesXDR,
            };
            opts.pfx = this.pfx;
            opts.key = this.key;
            opts.passphrase = this.passphrase;
            opts.cert = this.cert;
            opts.ca = this.ca;
            opts.ciphers = this.ciphers;
            opts.rejectUnauthorized = this.rejectUnauthorized;
            var xhr = (this.xhr = new XMLHttpRequest(opts));
            var self = this;
            try {
              debug("xhr open %s: %s", this.method, this.uri);
              xhr.open(this.method, this.uri, this.async);
              try {
                if (this.extraHeaders) {
                  xhr.setDisableHeaderCheck && xhr.setDisableHeaderCheck(true);
                  for (var i in this.extraHeaders) {
                    if (this.extraHeaders.hasOwnProperty(i)) {
                      xhr.setRequestHeader(i, this.extraHeaders[i]);
                    }
                  }
                }
              } catch (e) {}
              if ("POST" === this.method) {
                try {
                  if (this.isBinary) {
                    xhr.setRequestHeader(
                      "Content-type",
                      "application/octet-stream"
                    );
                  } else {
                    xhr.setRequestHeader(
                      "Content-type",
                      "text/plain;charset=UTF-8"
                    );
                  }
                } catch (e) {}
              }
              try {
                xhr.setRequestHeader("Accept", "*/*");
              } catch (e) {}
              if ("withCredentials" in xhr) {
                xhr.withCredentials = true;
              }
              if (this.requestTimeout) {
                xhr.timeout = this.requestTimeout;
              }
              if (this.hasXDR()) {
                xhr.onload = function () {
                  self.onLoad();
                };
                xhr.onerror = function () {
                  self.onError(xhr.responseText);
                };
              } else {
                xhr.onreadystatechange = function () {
                  if (xhr.readyState === 2) {
                    try {
                      var contentType = xhr.getResponseHeader("Content-Type");
                      if (
                        self.supportsBinary &&
                        contentType === "application/octet-stream"
                      ) {
                        xhr.responseType = "arraybuffer";
                      }
                    } catch (e) {}
                  }
                  if (4 !== xhr.readyState) return;
                  if (200 === xhr.status || 1223 === xhr.status) {
                    self.onLoad();
                  } else {
                    setTimeout(function () {
                      self.onError(xhr.status);
                    }, 0);
                  }
                };
              }
              debug("xhr data %s", this.data);
              xhr.send(this.data);
            } catch (e) {
              setTimeout(function () {
                self.onError(e);
              }, 0);
              return;
            }
            if (global.document) {
              this.index = Request.requestsCount++;
              Request.requests[this.index] = this;
            }
          };
          Request.prototype.onSuccess = function () {
            this.emit("success");
            this.cleanup();
          };
          Request.prototype.onData = function (data) {
            this.emit("data", data);
            this.onSuccess();
          };
          Request.prototype.onError = function (err) {
            this.emit("error", err);
            this.cleanup(true);
          };
          Request.prototype.cleanup = function (fromError) {
            if ("undefined" === typeof this.xhr || null === this.xhr) {
              return;
            }
            if (this.hasXDR()) {
              this.xhr.onload = this.xhr.onerror = empty;
            } else {
              this.xhr.onreadystatechange = empty;
            }
            if (fromError) {
              try {
                this.xhr.abort();
              } catch (e) {}
            }
            if (global.document) {
              delete Request.requests[this.index];
            }
            this.xhr = null;
          };
          Request.prototype.onLoad = function () {
            var data;
            try {
              var contentType;
              try {
                contentType = this.xhr.getResponseHeader("Content-Type");
              } catch (e) {}
              if (contentType === "application/octet-stream") {
                data = this.xhr.response || this.xhr.responseText;
              } else {
                data = this.xhr.responseText;
              }
            } catch (e) {
              this.onError(e);
            }
            if (null != data) {
              this.onData(data);
            }
          };
          Request.prototype.hasXDR = function () {
            return (
              "undefined" !== typeof global.XDomainRequest &&
              !this.xs &&
              this.enablesXDR
            );
          };
          Request.prototype.abort = function () {
            this.cleanup();
          };
          Request.requestsCount = 0;
          Request.requests = {};
          if (global.document) {
            if (global.attachEvent) {
              global.attachEvent("onunload", unloadHandler);
            } else if (global.addEventListener) {
              global.addEventListener("beforeunload", unloadHandler, false);
            }
          }
          function unloadHandler() {
            for (var i in Request.requests) {
              if (Request.requests.hasOwnProperty(i)) {
                Request.requests[i].abort();
              }
            }
          }
        }.call(
          this,
          typeof global !== "undefined"
            ? global
            : typeof self !== "undefined"
            ? self
            : typeof window !== "undefined"
            ? window
            : {}
        ));
      },
      {
        "./polling": 18,
        "component-emitter": 10,
        "component-inherit": 11,
        debug: 21,
        "xmlhttprequest-ssl": 20,
      },
    ],
    18: [
      function (require, module, exports) {
        var Transport = require("../transport");
        var parseqs = require("parseqs");
        var parser = require("engine.io-parser");
        var inherit = require("component-inherit");
        var yeast = require("yeast");
        var debug = require("debug")("engine.io-client:polling");
        module.exports = Polling;
        var hasXHR2 = (function () {
          var XMLHttpRequest = require("xmlhttprequest-ssl");
          var xhr = new XMLHttpRequest({ xdomain: false });
          return null != xhr.responseType;
        })();
        function Polling(opts) {
          var forceBase64 = opts && opts.forceBase64;
          if (!hasXHR2 || forceBase64) {
            this.supportsBinary = false;
          }
          Transport.call(this, opts);
        }
        inherit(Polling, Transport);
        Polling.prototype.name = "polling";
        Polling.prototype.doOpen = function () {
          this.poll();
        };
        Polling.prototype.pause = function (onPause) {
          var self = this;
          this.readyState = "pausing";
          function pause() {
            debug("paused");
            self.readyState = "paused";
            onPause();
          }
          if (this.polling || !this.writable) {
            var total = 0;
            if (this.polling) {
              debug("we are currently polling - waiting to pause");
              total++;
              this.once("pollComplete", function () {
                debug("pre-pause polling complete");
                --total || pause();
              });
            }
            if (!this.writable) {
              debug("we are currently writing - waiting to pause");
              total++;
              this.once("drain", function () {
                debug("pre-pause writing complete");
                --total || pause();
              });
            }
          } else {
            pause();
          }
        };
        Polling.prototype.poll = function () {
          debug("polling");
          this.polling = true;
          this.doPoll();
          this.emit("poll");
        };
        Polling.prototype.onData = function (data) {
          var self = this;
          debug("polling got data %s", data);
          var callback = function (packet, index, total) {
            if ("opening" === self.readyState) {
              self.onOpen();
            }
            if ("close" === packet.type) {
              self.onClose();
              return false;
            }
            self.onPacket(packet);
          };
          parser.decodePayload(data, this.socket.binaryType, callback);
          if ("closed" !== this.readyState) {
            this.polling = false;
            this.emit("pollComplete");
            if ("open" === this.readyState) {
              this.poll();
            } else {
              debug('ignoring poll - transport state "%s"', this.readyState);
            }
          }
        };
        Polling.prototype.doClose = function () {
          var self = this;
          function close() {
            debug("writing close packet");
            self.write([{ type: "close" }]);
          }
          if ("open" === this.readyState) {
            debug("transport open - closing");
            close();
          } else {
            debug("transport not open - deferring close");
            this.once("open", close);
          }
        };
        Polling.prototype.write = function (packets) {
          var self = this;
          this.writable = false;
          var callbackfn = function () {
            self.writable = true;
            self.emit("drain");
          };
          parser.encodePayload(packets, this.supportsBinary, function (data) {
            self.doWrite(data, callbackfn);
          });
        };
        Polling.prototype.uri = function () {
          var query = this.query || {};
          var schema = this.secure ? "https" : "http";
          var port = "";
          if (false !== this.timestampRequests) {
            query[this.timestampParam] = yeast();
          }
          if (!this.supportsBinary && !query.sid) {
            query.b64 = 1;
          }
          query = parseqs.encode(query);
          if (
            this.port &&
            (("https" === schema && Number(this.port) !== 443) ||
              ("http" === schema && Number(this.port) !== 80))
          ) {
            port = ":" + this.port;
          }
          if (query.length) {
            query = "?" + query;
          }
          var ipv6 = this.hostname.indexOf(":") !== -1;
          return (
            schema +
            "://" +
            (ipv6 ? "[" + this.hostname + "]" : this.hostname) +
            port +
            this.path +
            query
          );
        };
      },
      {
        "../transport": 14,
        "component-inherit": 11,
        debug: 21,
        "engine.io-parser": 23,
        parseqs: 32,
        "xmlhttprequest-ssl": 20,
        yeast: 51,
      },
    ],
    19: [
      function (require, module, exports) {
        (function (global) {
          var Transport = require("../transport");
          var parser = require("engine.io-parser");
          var parseqs = require("parseqs");
          var inherit = require("component-inherit");
          var yeast = require("yeast");
          var debug = require("debug")("engine.io-client:websocket");
          var BrowserWebSocket = global.WebSocket || global.MozWebSocket;
          var NodeWebSocket;
          if (typeof window === "undefined") {
            try {
              NodeWebSocket = require("ws");
            } catch (e) {}
          }
          var WebSocket = BrowserWebSocket;
          if (!WebSocket && typeof window === "undefined") {
            WebSocket = NodeWebSocket;
          }
          module.exports = WS;
          function WS(opts) {
            var forceBase64 = opts && opts.forceBase64;
            if (forceBase64) {
              this.supportsBinary = false;
            }
            this.perMessageDeflate = opts.perMessageDeflate;
            this.usingBrowserWebSocket = BrowserWebSocket && !opts.forceNode;
            this.protocols = opts.protocols;
            if (!this.usingBrowserWebSocket) {
              WebSocket = NodeWebSocket;
            }
            Transport.call(this, opts);
          }
          inherit(WS, Transport);
          WS.prototype.name = "websocket";
          WS.prototype.supportsBinary = true;
          WS.prototype.doOpen = function () {
            if (!this.check()) {
              return;
            }
            var uri = this.uri();
            var protocols = this.protocols;
            var opts = {
              agent: this.agent,
              perMessageDeflate: this.perMessageDeflate,
            };
            opts.pfx = this.pfx;
            opts.key = this.key;
            opts.passphrase = this.passphrase;
            opts.cert = this.cert;
            opts.ca = this.ca;
            opts.ciphers = this.ciphers;
            opts.rejectUnauthorized = this.rejectUnauthorized;
            if (this.extraHeaders) {
              opts.headers = this.extraHeaders;
            }
            if (this.localAddress) {
              opts.localAddress = this.localAddress;
            }
            try {
              this.ws = this.usingBrowserWebSocket
                ? protocols
                  ? new WebSocket(uri, protocols)
                  : new WebSocket(uri)
                : new WebSocket(uri, protocols, opts);
            } catch (err) {
              return this.emit("error", err);
            }
            if (this.ws.binaryType === undefined) {
              this.supportsBinary = false;
            }
            if (this.ws.supports && this.ws.supports.binary) {
              this.supportsBinary = true;
              this.ws.binaryType = "nodebuffer";
            } else {
              this.ws.binaryType = "arraybuffer";
            }
            this.addEventListeners();
          };
          WS.prototype.addEventListeners = function () {
            var self = this;
            this.ws.onopen = function () {
              self.onOpen();
            };
            this.ws.onclose = function () {
              self.onClose();
            };
            this.ws.onmessage = function (ev) {
              self.onData(ev.data);
            };
            this.ws.onerror = function (e) {
              self.onError("websocket error", e);
            };
          };
          WS.prototype.write = function (packets) {
            var self = this;
            this.writable = false;
            var total = packets.length;
            for (var i = 0, l = total; i < l; i++) {
              (function (packet) {
                parser.encodePacket(
                  packet,
                  self.supportsBinary,
                  function (data) {
                    if (!self.usingBrowserWebSocket) {
                      var opts = {};
                      if (packet.options) {
                        opts.compress = packet.options.compress;
                      }
                      if (self.perMessageDeflate) {
                        var len =
                          "string" === typeof data
                            ? global.Buffer.byteLength(data)
                            : data.length;
                        if (len < self.perMessageDeflate.threshold) {
                          opts.compress = false;
                        }
                      }
                    }
                    try {
                      if (self.usingBrowserWebSocket) {
                        self.ws.send(data);
                      } else {
                        self.ws.send(data, opts);
                      }
                    } catch (e) {
                      debug("websocket closed before onclose event");
                    }
                    --total || done();
                  }
                );
              })(packets[i]);
            }
            function done() {
              self.emit("flush");
              setTimeout(function () {
                self.writable = true;
                self.emit("drain");
              }, 0);
            }
          };
          WS.prototype.onClose = function () {
            Transport.prototype.onClose.call(this);
          };
          WS.prototype.doClose = function () {
            if (typeof this.ws !== "undefined") {
              this.ws.close();
            }
          };
          WS.prototype.uri = function () {
            var query = this.query || {};
            var schema = this.secure ? "wss" : "ws";
            var port = "";
            if (
              this.port &&
              (("wss" === schema && Number(this.port) !== 443) ||
                ("ws" === schema && Number(this.port) !== 80))
            ) {
              port = ":" + this.port;
            }
            if (this.timestampRequests) {
              query[this.timestampParam] = yeast();
            }
            if (!this.supportsBinary) {
              query.b64 = 1;
            }
            query = parseqs.encode(query);
            if (query.length) {
              query = "?" + query;
            }
            var ipv6 = this.hostname.indexOf(":") !== -1;
            return (
              schema +
              "://" +
              (ipv6 ? "[" + this.hostname + "]" : this.hostname) +
              port +
              this.path +
              query
            );
          };
          WS.prototype.check = function () {
            return (
              !!WebSocket &&
              !("__initialize" in WebSocket && this.name === WS.prototype.name)
            );
          };
        }.call(
          this,
          typeof global !== "undefined"
            ? global
            : typeof self !== "undefined"
            ? self
            : typeof window !== "undefined"
            ? window
            : {}
        ));
      },
      {
        "../transport": 14,
        "component-inherit": 11,
        debug: 21,
        "engine.io-parser": 23,
        parseqs: 32,
        ws: 7,
        yeast: 51,
      },
    ],
    20: [
      function (require, module, exports) {
        (function (global) {
          var hasCORS = require("has-cors");
          module.exports = function (opts) {
            var xdomain = opts.xdomain;
            var xscheme = opts.xscheme;
            var enablesXDR = opts.enablesXDR;
            try {
              if (
                "undefined" !== typeof XMLHttpRequest &&
                (!xdomain || hasCORS)
              ) {
                return new XMLHttpRequest();
              }
            } catch (e) {}
            try {
              if (
                "undefined" !== typeof XDomainRequest &&
                !xscheme &&
                enablesXDR
              ) {
                return new XDomainRequest();
              }
            } catch (e) {}
            if (!xdomain) {
              try {
                return new global[["Active"].concat("Object").join("X")](
                  "Microsoft.XMLHTTP"
                );
              } catch (e) {}
            }
          };
        }.call(
          this,
          typeof global !== "undefined"
            ? global
            : typeof self !== "undefined"
            ? self
            : typeof window !== "undefined"
            ? window
            : {}
        ));
      },
      { "has-cors": 27 },
    ],
    21: [
      function (require, module, exports) {
        (function (process) {
          exports = module.exports = require("./debug");
          exports.log = log;
          exports.formatArgs = formatArgs;
          exports.save = save;
          exports.load = load;
          exports.useColors = useColors;
          exports.storage =
            "undefined" != typeof chrome && "undefined" != typeof chrome.storage
              ? chrome.storage.local
              : localstorage();
          exports.colors = [
            "#0000CC",
            "#0000FF",
            "#0033CC",
            "#0033FF",
            "#0066CC",
            "#0066FF",
            "#0099CC",
            "#0099FF",
            "#00CC00",
            "#00CC33",
            "#00CC66",
            "#00CC99",
            "#00CCCC",
            "#00CCFF",
            "#3300CC",
            "#3300FF",
            "#3333CC",
            "#3333FF",
            "#3366CC",
            "#3366FF",
            "#3399CC",
            "#3399FF",
            "#33CC00",
            "#33CC33",
            "#33CC66",
            "#33CC99",
            "#33CCCC",
            "#33CCFF",
            "#6600CC",
            "#6600FF",
            "#6633CC",
            "#6633FF",
            "#66CC00",
            "#66CC33",
            "#9900CC",
            "#9900FF",
            "#9933CC",
            "#9933FF",
            "#99CC00",
            "#99CC33",
            "#CC0000",
            "#CC0033",
            "#CC0066",
            "#CC0099",
            "#CC00CC",
            "#CC00FF",
            "#CC3300",
            "#CC3333",
            "#CC3366",
            "#CC3399",
            "#CC33CC",
            "#CC33FF",
            "#CC6600",
            "#CC6633",
            "#CC9900",
            "#CC9933",
            "#CCCC00",
            "#CCCC33",
            "#FF0000",
            "#FF0033",
            "#FF0066",
            "#FF0099",
            "#FF00CC",
            "#FF00FF",
            "#FF3300",
            "#FF3333",
            "#FF3366",
            "#FF3399",
            "#FF33CC",
            "#FF33FF",
            "#FF6600",
            "#FF6633",
            "#FF9900",
            "#FF9933",
            "#FFCC00",
            "#FFCC33",
          ];
          function useColors() {
            if (
              typeof window !== "undefined" &&
              window.process &&
              window.process.type === "renderer"
            ) {
              return true;
            }
            if (
              typeof navigator !== "undefined" &&
              navigator.userAgent &&
              navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)
            ) {
              return false;
            }
            return (
              (typeof document !== "undefined" &&
                document.documentElement &&
                document.documentElement.style &&
                document.documentElement.style.WebkitAppearance) ||
              (typeof window !== "undefined" &&
                window.console &&
                (window.console.firebug ||
                  (window.console.exception && window.console.table))) ||
              (typeof navigator !== "undefined" &&
                navigator.userAgent &&
                navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) &&
                parseInt(RegExp.$1, 10) >= 31) ||
              (typeof navigator !== "undefined" &&
                navigator.userAgent &&
                navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/))
            );
          }
          exports.formatters.j = function (v) {
            try {
              return JSON.stringify(v);
            } catch (err) {
              return "[UnexpectedJSONParseError]: " + err.message;
            }
          };
          function formatArgs(args) {
            var useColors = this.useColors;
            args[0] =
              (useColors ? "%c" : "") +
              this.namespace +
              (useColors ? " %c" : " ") +
              args[0] +
              (useColors ? "%c " : " ") +
              "+" +
              exports.humanize(this.diff);
            if (!useColors) return;
            var c = "color: " + this.color;
            args.splice(1, 0, c, "color: inherit");
            var index = 0;
            var lastC = 0;
            args[0].replace(/%[a-zA-Z%]/g, function (match) {
              if ("%%" === match) return;
              index++;
              if ("%c" === match) {
                lastC = index;
              }
            });
            args.splice(lastC, 0, c);
          }
          function log() {
            return (
              "object" === typeof console &&
              console.log &&
              Function.prototype.apply.call(console.log, console, arguments)
            );
          }
          function save(namespaces) {
            try {
              if (null == namespaces) {
                exports.storage.removeItem("debug");
              } else {
                exports.storage.debug = namespaces;
              }
            } catch (e) {}
          }
          function load() {
            var r;
            try {
              r = exports.storage.debug;
            } catch (e) {}
            if (!r && typeof process !== "undefined" && "env" in process) {
              r = process.env.DEBUG;
            }
            return r;
          }
          exports.enable(load());
          function localstorage() {
            try {
              return window.localStorage;
            } catch (e) {}
          }
        }.call(this, require("_process")));
      },
      { "./debug": 22, _process: 34 },
    ],
    22: [
      function (require, module, exports) {
        exports =
          module.exports =
          createDebug.debug =
          createDebug["default"] =
            createDebug;
        exports.coerce = coerce;
        exports.disable = disable;
        exports.enable = enable;
        exports.enabled = enabled;
        exports.humanize = require("ms");
        exports.instances = [];
        exports.names = [];
        exports.skips = [];
        exports.formatters = {};
        function selectColor(namespace) {
          var hash = 0,
            i;
          for (i in namespace) {
            hash = (hash << 5) - hash + namespace.charCodeAt(i);
            hash |= 0;
          }
          return exports.colors[Math.abs(hash) % exports.colors.length];
        }
        function createDebug(namespace) {
          var prevTime;
          function debug() {
            if (!debug.enabled) return;
            var self = debug;
            var curr = +new Date();
            var ms = curr - (prevTime || curr);
            self.diff = ms;
            self.prev = prevTime;
            self.curr = curr;
            prevTime = curr;
            var args = new Array(arguments.length);
            for (var i = 0; i < args.length; i++) {
              args[i] = arguments[i];
            }
            args[0] = exports.coerce(args[0]);
            if ("string" !== typeof args[0]) {
              args.unshift("%O");
            }
            var index = 0;
            args[0] = args[0].replace(
              /%([a-zA-Z%])/g,
              function (match, format) {
                if (match === "%%") return match;
                index++;
                var formatter = exports.formatters[format];
                if ("function" === typeof formatter) {
                  var val = args[index];
                  match = formatter.call(self, val);
                  args.splice(index, 1);
                  index--;
                }
                return match;
              }
            );
            exports.formatArgs.call(self, args);
            var logFn = debug.log || exports.log || console.log.bind(console);
            logFn.apply(self, args);
          }
          debug.namespace = namespace;
          debug.enabled = exports.enabled(namespace);
          debug.useColors = exports.useColors();
          debug.color = selectColor(namespace);
          debug.destroy = destroy;
          if ("function" === typeof exports.init) {
            exports.init(debug);
          }
          exports.instances.push(debug);
          return debug;
        }
        function destroy() {
          var index = exports.instances.indexOf(this);
          if (index !== -1) {
            exports.instances.splice(index, 1);
            return true;
          } else {
            return false;
          }
        }
        function enable(namespaces) {
          exports.save(namespaces);
          exports.names = [];
          exports.skips = [];
          var i;
          var split = (typeof namespaces === "string" ? namespaces : "").split(
            /[\s,]+/
          );
          var len = split.length;
          for (i = 0; i < len; i++) {
            if (!split[i]) continue;
            namespaces = split[i].replace(/\*/g, ".*?");
            if (namespaces[0] === "-") {
              exports.skips.push(new RegExp("^" + namespaces.substr(1) + "$"));
            } else {
              exports.names.push(new RegExp("^" + namespaces + "$"));
            }
          }
          for (i = 0; i < exports.instances.length; i++) {
            var instance = exports.instances[i];
            instance.enabled = exports.enabled(instance.namespace);
          }
        }
        function disable() {
          exports.enable("");
        }
        function enabled(name) {
          if (name[name.length - 1] === "*") {
            return true;
          }
          var i, len;
          for (i = 0, len = exports.skips.length; i < len; i++) {
            if (exports.skips[i].test(name)) {
              return false;
            }
          }
          for (i = 0, len = exports.names.length; i < len; i++) {
            if (exports.names[i].test(name)) {
              return true;
            }
          }
          return false;
        }
        function coerce(val) {
          if (val instanceof Error) return val.stack || val.message;
          return val;
        }
      },
      { ms: 31 },
    ],
    23: [
      function (require, module, exports) {
        (function (global) {
          var keys = require("./keys");
          var hasBinary = require("has-binary2");
          var sliceBuffer = require("arraybuffer.slice");
          var after = require("after");
          var utf8 = require("./utf8");
          var base64encoder;
          if (global && global.ArrayBuffer) {
            base64encoder = require("base64-arraybuffer");
          }
          var isAndroid =
            typeof navigator !== "undefined" &&
            /Android/i.test(navigator.userAgent);
          var isPhantomJS =
            typeof navigator !== "undefined" &&
            /PhantomJS/i.test(navigator.userAgent);
          var dontSendBlobs = isAndroid || isPhantomJS;
          exports.protocol = 3;
          var packets = (exports.packets = {
            open: 0,
            close: 1,
            ping: 2,
            pong: 3,
            message: 4,
            upgrade: 5,
            noop: 6,
          });
          var packetslist = keys(packets);
          var err = { type: "error", data: "parser error" };
          var Blob = require("blob");
          exports.encodePacket = function (
            packet,
            supportsBinary,
            utf8encode,
            callback
          ) {
            if (typeof supportsBinary === "function") {
              callback = supportsBinary;
              supportsBinary = false;
            }
            if (typeof utf8encode === "function") {
              callback = utf8encode;
              utf8encode = null;
            }
            var data =
              packet.data === undefined
                ? undefined
                : packet.data.buffer || packet.data;
            if (global.ArrayBuffer && data instanceof ArrayBuffer) {
              return encodeArrayBuffer(packet, supportsBinary, callback);
            } else if (Blob && data instanceof global.Blob) {
              return encodeBlob(packet, supportsBinary, callback);
            }
            if (data && data.base64) {
              return encodeBase64Object(packet, callback);
            }
            var encoded = packets[packet.type];
            if (undefined !== packet.data) {
              encoded += utf8encode
                ? utf8.encode(String(packet.data), { strict: false })
                : String(packet.data);
            }
            return callback("" + encoded);
          };
          function encodeBase64Object(packet, callback) {
            var message = "b" + exports.packets[packet.type] + packet.data.data;
            return callback(message);
          }
          function encodeArrayBuffer(packet, supportsBinary, callback) {
            if (!supportsBinary) {
              return exports.encodeBase64Packet(packet, callback);
            }
            var data = packet.data;
            var contentArray = new Uint8Array(data);
            var resultBuffer = new Uint8Array(1 + data.byteLength);
            resultBuffer[0] = packets[packet.type];
            for (var i = 0; i < contentArray.length; i++) {
              resultBuffer[i + 1] = contentArray[i];
            }
            return callback(resultBuffer.buffer);
          }
          function encodeBlobAsArrayBuffer(packet, supportsBinary, callback) {
            if (!supportsBinary) {
              return exports.encodeBase64Packet(packet, callback);
            }
            var fr = new FileReader();
            fr.onload = function () {
              packet.data = fr.result;
              exports.encodePacket(packet, supportsBinary, true, callback);
            };
            return fr.readAsArrayBuffer(packet.data);
          }
          function encodeBlob(packet, supportsBinary, callback) {
            if (!supportsBinary) {
              return exports.encodeBase64Packet(packet, callback);
            }
            if (dontSendBlobs) {
              return encodeBlobAsArrayBuffer(packet, supportsBinary, callback);
            }
            var length = new Uint8Array(1);
            length[0] = packets[packet.type];
            var blob = new Blob([length.buffer, packet.data]);
            return callback(blob);
          }
          exports.encodeBase64Packet = function (packet, callback) {
            var message = "b" + exports.packets[packet.type];
            if (Blob && packet.data instanceof global.Blob) {
              var fr = new FileReader();
              fr.onload = function () {
                var b64 = fr.result.split(",")[1];
                callback(message + b64);
              };
              return fr.readAsDataURL(packet.data);
            }
            var b64data;
            try {
              b64data = String.fromCharCode.apply(
                null,
                new Uint8Array(packet.data)
              );
            } catch (e) {
              var typed = new Uint8Array(packet.data);
              var basic = new Array(typed.length);
              for (var i = 0; i < typed.length; i++) {
                basic[i] = typed[i];
              }
              b64data = String.fromCharCode.apply(null, basic);
            }
            message += global.btoa(b64data);
            return callback(message);
          };
          exports.decodePacket = function (data, binaryType, utf8decode) {
            if (data === undefined) {
              return err;
            }
            if (typeof data === "string") {
              if (data.charAt(0) === "b") {
                return exports.decodeBase64Packet(data.substr(1), binaryType);
              }
              if (utf8decode) {
                data = tryDecode(data);
                if (data === false) {
                  return err;
                }
              }
              var type = data.charAt(0);
              if (Number(type) != type || !packetslist[type]) {
                return err;
              }
              if (data.length > 1) {
                return { type: packetslist[type], data: data.substring(1) };
              } else {
                return { type: packetslist[type] };
              }
            }
            var asArray = new Uint8Array(data);
            var type = asArray[0];
            var rest = sliceBuffer(data, 1);
            if (Blob && binaryType === "blob") {
              rest = new Blob([rest]);
            }
            return { type: packetslist[type], data: rest };
          };
          function tryDecode(data) {
            try {
              data = utf8.decode(data, { strict: false });
            } catch (e) {
              return false;
            }
            return data;
          }
          exports.decodeBase64Packet = function (msg, binaryType) {
            var type = packetslist[msg.charAt(0)];
            if (!base64encoder) {
              return {
                type: type,
                data: { base64: true, data: msg.substr(1) },
              };
            }
            var data = base64encoder.decode(msg.substr(1));
            if (binaryType === "blob" && Blob) {
              data = new Blob([data]);
            }
            return { type: type, data: data };
          };
          exports.encodePayload = function (packets, supportsBinary, callback) {
            if (typeof supportsBinary === "function") {
              callback = supportsBinary;
              supportsBinary = null;
            }
            var isBinary = hasBinary(packets);
            if (supportsBinary && isBinary) {
              if (Blob && !dontSendBlobs) {
                return exports.encodePayloadAsBlob(packets, callback);
              }
              return exports.encodePayloadAsArrayBuffer(packets, callback);
            }
            if (!packets.length) {
              return callback("0:");
            }
            function setLengthHeader(message) {
              return message.length + ":" + message;
            }
            function encodeOne(packet, doneCallback) {
              exports.encodePacket(
                packet,
                !isBinary ? false : supportsBinary,
                false,
                function (message) {
                  doneCallback(null, setLengthHeader(message));
                }
              );
            }
            map(packets, encodeOne, function (err, results) {
              return callback(results.join(""));
            });
          };
          function map(ary, each, done) {
            var result = new Array(ary.length);
            var next = after(ary.length, done);
            var eachWithIndex = function (i, el, cb) {
              each(el, function (error, msg) {
                result[i] = msg;
                cb(error, result);
              });
            };
            for (var i = 0; i < ary.length; i++) {
              eachWithIndex(i, ary[i], next);
            }
          }
          exports.decodePayload = function (data, binaryType, callback) {
            if (typeof data !== "string") {
              return exports.decodePayloadAsBinary(data, binaryType, callback);
            }
            if (typeof binaryType === "function") {
              callback = binaryType;
              binaryType = null;
            }
            var packet;
            if (data === "") {
              return callback(err, 0, 1);
            }
            var length = "",
              n,
              msg;
            for (var i = 0, l = data.length; i < l; i++) {
              var chr = data.charAt(i);
              if (chr !== ":") {
                length += chr;
                continue;
              }
              if (length === "" || length != (n = Number(length))) {
                return callback(err, 0, 1);
              }
              msg = data.substr(i + 1, n);
              if (length != msg.length) {
                return callback(err, 0, 1);
              }
              if (msg.length) {
                packet = exports.decodePacket(msg, binaryType, false);
                if (err.type === packet.type && err.data === packet.data) {
                  return callback(err, 0, 1);
                }
                var ret = callback(packet, i + n, l);
                if (false === ret) return;
              }
              i += n;
              length = "";
            }
            if (length !== "") {
              return callback(err, 0, 1);
            }
          };
          exports.encodePayloadAsArrayBuffer = function (packets, callback) {
            if (!packets.length) {
              return callback(new ArrayBuffer(0));
            }
            function encodeOne(packet, doneCallback) {
              exports.encodePacket(packet, true, true, function (data) {
                return doneCallback(null, data);
              });
            }
            map(packets, encodeOne, function (err, encodedPackets) {
              var totalLength = encodedPackets.reduce(function (acc, p) {
                var len;
                if (typeof p === "string") {
                  len = p.length;
                } else {
                  len = p.byteLength;
                }
                return acc + len.toString().length + len + 2;
              }, 0);
              var resultArray = new Uint8Array(totalLength);
              var bufferIndex = 0;
              encodedPackets.forEach(function (p) {
                var isString = typeof p === "string";
                var ab = p;
                if (isString) {
                  var view = new Uint8Array(p.length);
                  for (var i = 0; i < p.length; i++) {
                    view[i] = p.charCodeAt(i);
                  }
                  ab = view.buffer;
                }
                if (isString) {
                  resultArray[bufferIndex++] = 0;
                } else {
                  resultArray[bufferIndex++] = 1;
                }
                var lenStr = ab.byteLength.toString();
                for (var i = 0; i < lenStr.length; i++) {
                  resultArray[bufferIndex++] = parseInt(lenStr[i]);
                }
                resultArray[bufferIndex++] = 255;
                var view = new Uint8Array(ab);
                for (var i = 0; i < view.length; i++) {
                  resultArray[bufferIndex++] = view[i];
                }
              });
              return callback(resultArray.buffer);
            });
          };
          exports.encodePayloadAsBlob = function (packets, callback) {
            function encodeOne(packet, doneCallback) {
              exports.encodePacket(packet, true, true, function (encoded) {
                var binaryIdentifier = new Uint8Array(1);
                binaryIdentifier[0] = 1;
                if (typeof encoded === "string") {
                  var view = new Uint8Array(encoded.length);
                  for (var i = 0; i < encoded.length; i++) {
                    view[i] = encoded.charCodeAt(i);
                  }
                  encoded = view.buffer;
                  binaryIdentifier[0] = 0;
                }
                var len =
                  encoded instanceof ArrayBuffer
                    ? encoded.byteLength
                    : encoded.size;
                var lenStr = len.toString();
                var lengthAry = new Uint8Array(lenStr.length + 1);
                for (var i = 0; i < lenStr.length; i++) {
                  lengthAry[i] = parseInt(lenStr[i]);
                }
                lengthAry[lenStr.length] = 255;
                if (Blob) {
                  var blob = new Blob([
                    binaryIdentifier.buffer,
                    lengthAry.buffer,
                    encoded,
                  ]);
                  doneCallback(null, blob);
                }
              });
            }
            map(packets, encodeOne, function (err, results) {
              return callback(new Blob(results));
            });
          };
          exports.decodePayloadAsBinary = function (
            data,
            binaryType,
            callback
          ) {
            if (typeof binaryType === "function") {
              callback = binaryType;
              binaryType = null;
            }
            var bufferTail = data;
            var buffers = [];
            while (bufferTail.byteLength > 0) {
              var tailArray = new Uint8Array(bufferTail);
              var isString = tailArray[0] === 0;
              var msgLength = "";
              for (var i = 1; ; i++) {
                if (tailArray[i] === 255) break;
                if (msgLength.length > 310) {
                  return callback(err, 0, 1);
                }
                msgLength += tailArray[i];
              }
              bufferTail = sliceBuffer(bufferTail, 2 + msgLength.length);
              msgLength = parseInt(msgLength);
              var msg = sliceBuffer(bufferTail, 0, msgLength);
              if (isString) {
                try {
                  msg = String.fromCharCode.apply(null, new Uint8Array(msg));
                } catch (e) {
                  var typed = new Uint8Array(msg);
                  msg = "";
                  for (var i = 0; i < typed.length; i++) {
                    msg += String.fromCharCode(typed[i]);
                  }
                }
              }
              buffers.push(msg);
              bufferTail = sliceBuffer(bufferTail, msgLength);
            }
            var total = buffers.length;
            buffers.forEach(function (buffer, i) {
              callback(
                exports.decodePacket(buffer, binaryType, true),
                i,
                total
              );
            });
          };
        }.call(
          this,
          typeof global !== "undefined"
            ? global
            : typeof self !== "undefined"
            ? self
            : typeof window !== "undefined"
            ? window
            : {}
        ));
      },
      {
        "./keys": 24,
        "./utf8": 25,
        after: 1,
        "arraybuffer.slice": 2,
        "base64-arraybuffer": 4,
        blob: 6,
        "has-binary2": 26,
      },
    ],
    24: [
      function (require, module, exports) {
        module.exports =
          Object.keys ||
          function keys(obj) {
            var arr = [];
            var has = Object.prototype.hasOwnProperty;
            for (var i in obj) {
              if (has.call(obj, i)) {
                arr.push(i);
              }
            }
            return arr;
          };
      },
      {},
    ],
    25: [
      function (require, module, exports) {
        (function (global) {
          (function (root) {
            var freeExports = typeof exports == "object" && exports;
            var freeModule =
              typeof module == "object" &&
              module &&
              module.exports == freeExports &&
              module;
            var freeGlobal = typeof global == "object" && global;
            if (
              freeGlobal.global === freeGlobal ||
              freeGlobal.window === freeGlobal
            ) {
              root = freeGlobal;
            }
            var stringFromCharCode = String.fromCharCode;
            function ucs2decode(string) {
              var output = [];
              var counter = 0;
              var length = string.length;
              var value;
              var extra;
              while (counter < length) {
                value = string.charCodeAt(counter++);
                if (value >= 55296 && value <= 56319 && counter < length) {
                  extra = string.charCodeAt(counter++);
                  if ((extra & 64512) == 56320) {
                    output.push(
                      ((value & 1023) << 10) + (extra & 1023) + 65536
                    );
                  } else {
                    output.push(value);
                    counter--;
                  }
                } else {
                  output.push(value);
                }
              }
              return output;
            }
            function ucs2encode(array) {
              var length = array.length;
              var index = -1;
              var value;
              var output = "";
              while (++index < length) {
                value = array[index];
                if (value > 65535) {
                  value -= 65536;
                  output += stringFromCharCode(((value >>> 10) & 1023) | 55296);
                  value = 56320 | (value & 1023);
                }
                output += stringFromCharCode(value);
              }
              return output;
            }
            function checkScalarValue(codePoint, strict) {
              if (codePoint >= 55296 && codePoint <= 57343) {
                if (strict) {
                  throw Error(
                    "Lone surrogate U+" +
                      codePoint.toString(16).toUpperCase() +
                      " is not a scalar value"
                  );
                }
                return false;
              }
              return true;
            }
            function createByte(codePoint, shift) {
              return stringFromCharCode(((codePoint >> shift) & 63) | 128);
            }
            function encodeCodePoint(codePoint, strict) {
              if ((codePoint & 4294967168) == 0) {
                return stringFromCharCode(codePoint);
              }
              var symbol = "";
              if ((codePoint & 4294965248) == 0) {
                symbol = stringFromCharCode(((codePoint >> 6) & 31) | 192);
              } else if ((codePoint & 4294901760) == 0) {
                if (!checkScalarValue(codePoint, strict)) {
                  codePoint = 65533;
                }
                symbol = stringFromCharCode(((codePoint >> 12) & 15) | 224);
                symbol += createByte(codePoint, 6);
              } else if ((codePoint & 4292870144) == 0) {
                symbol = stringFromCharCode(((codePoint >> 18) & 7) | 240);
                symbol += createByte(codePoint, 12);
                symbol += createByte(codePoint, 6);
              }
              symbol += stringFromCharCode((codePoint & 63) | 128);
              return symbol;
            }
            function utf8encode(string, opts) {
              opts = opts || {};
              var strict = false !== opts.strict;
              var codePoints = ucs2decode(string);
              var length = codePoints.length;
              var index = -1;
              var codePoint;
              var byteString = "";
              while (++index < length) {
                codePoint = codePoints[index];
                byteString += encodeCodePoint(codePoint, strict);
              }
              return byteString;
            }
            function readContinuationByte() {
              if (byteIndex >= byteCount) {
                throw Error("Invalid byte index");
              }
              var continuationByte = byteArray[byteIndex] & 255;
              byteIndex++;
              if ((continuationByte & 192) == 128) {
                return continuationByte & 63;
              }
              throw Error("Invalid continuation byte");
            }
            function decodeSymbol(strict) {
              var byte1;
              var byte2;
              var byte3;
              var byte4;
              var codePoint;
              if (byteIndex > byteCount) {
                throw Error("Invalid byte index");
              }
              if (byteIndex == byteCount) {
                return false;
              }
              byte1 = byteArray[byteIndex] & 255;
              byteIndex++;
              if ((byte1 & 128) == 0) {
                return byte1;
              }
              if ((byte1 & 224) == 192) {
                byte2 = readContinuationByte();
                codePoint = ((byte1 & 31) << 6) | byte2;
                if (codePoint >= 128) {
                  return codePoint;
                } else {
                  throw Error("Invalid continuation byte");
                }
              }
              if ((byte1 & 240) == 224) {
                byte2 = readContinuationByte();
                byte3 = readContinuationByte();
                codePoint = ((byte1 & 15) << 12) | (byte2 << 6) | byte3;
                if (codePoint >= 2048) {
                  return checkScalarValue(codePoint, strict)
                    ? codePoint
                    : 65533;
                } else {
                  throw Error("Invalid continuation byte");
                }
              }
              if ((byte1 & 248) == 240) {
                byte2 = readContinuationByte();
                byte3 = readContinuationByte();
                byte4 = readContinuationByte();
                codePoint =
                  ((byte1 & 7) << 18) | (byte2 << 12) | (byte3 << 6) | byte4;
                if (codePoint >= 65536 && codePoint <= 1114111) {
                  return codePoint;
                }
              }
              throw Error("Invalid UTF-8 detected");
            }
            var byteArray;
            var byteCount;
            var byteIndex;
            function utf8decode(byteString, opts) {
              opts = opts || {};
              var strict = false !== opts.strict;
              byteArray = ucs2decode(byteString);
              byteCount = byteArray.length;
              byteIndex = 0;
              var codePoints = [];
              var tmp;
              while ((tmp = decodeSymbol(strict)) !== false) {
                codePoints.push(tmp);
              }
              return ucs2encode(codePoints);
            }
            var utf8 = {
              version: "2.1.2",
              encode: utf8encode,
              decode: utf8decode,
            };
            if (
              typeof define == "function" &&
              typeof define.amd == "object" &&
              define.amd
            ) {
              define(function () {
                return utf8;
              });
            } else if (freeExports && !freeExports.nodeType) {
              if (freeModule) {
                freeModule.exports = utf8;
              } else {
                var object = {};
                var hasOwnProperty = object.hasOwnProperty;
                for (var key in utf8) {
                  hasOwnProperty.call(utf8, key) &&
                    (freeExports[key] = utf8[key]);
                }
              }
            } else {
              root.utf8 = utf8;
            }
          })(this);
        }.call(
          this,
          typeof global !== "undefined"
            ? global
            : typeof self !== "undefined"
            ? self
            : typeof window !== "undefined"
            ? window
            : {}
        ));
      },
      {},
    ],
    26: [
      function (require, module, exports) {
        (function (Buffer) {
          var isArray = require("isarray");
          var toString = Object.prototype.toString;
          var withNativeBlob =
            typeof Blob === "function" ||
            (typeof Blob !== "undefined" &&
              toString.call(Blob) === "[object BlobConstructor]");
          var withNativeFile =
            typeof File === "function" ||
            (typeof File !== "undefined" &&
              toString.call(File) === "[object FileConstructor]");
          module.exports = hasBinary;
          function hasBinary(obj) {
            if (!obj || typeof obj !== "object") {
              return false;
            }
            if (isArray(obj)) {
              for (var i = 0, l = obj.length; i < l; i++) {
                if (hasBinary(obj[i])) {
                  return true;
                }
              }
              return false;
            }
            if (
              (typeof Buffer === "function" &&
                Buffer.isBuffer &&
                Buffer.isBuffer(obj)) ||
              (typeof ArrayBuffer === "function" &&
                obj instanceof ArrayBuffer) ||
              (withNativeBlob && obj instanceof Blob) ||
              (withNativeFile && obj instanceof File)
            ) {
              return true;
            }
            if (
              obj.toJSON &&
              typeof obj.toJSON === "function" &&
              arguments.length === 1
            ) {
              return hasBinary(obj.toJSON(), true);
            }
            for (var key in obj) {
              if (
                Object.prototype.hasOwnProperty.call(obj, key) &&
                hasBinary(obj[key])
              ) {
                return true;
              }
            }
            return false;
          }
        }.call(this, require("buffer").Buffer));
      },
      { buffer: 8, isarray: 30 },
    ],
    27: [
      function (require, module, exports) {
        try {
          module.exports =
            typeof XMLHttpRequest !== "undefined" &&
            "withCredentials" in new XMLHttpRequest();
        } catch (err) {
          module.exports = false;
        }
      },
      {},
    ],
    28: [
      function (require, module, exports) {
        exports.read = function (buffer, offset, isLE, mLen, nBytes) {
          var e, m;
          var eLen = nBytes * 8 - mLen - 1;
          var eMax = (1 << eLen) - 1;
          var eBias = eMax >> 1;
          var nBits = -7;
          var i = isLE ? nBytes - 1 : 0;
          var d = isLE ? -1 : 1;
          var s = buffer[offset + i];
          i += d;
          e = s & ((1 << -nBits) - 1);
          s >>= -nBits;
          nBits += eLen;
          for (
            ;
            nBits > 0;
            e = e * 256 + buffer[offset + i], i += d, nBits -= 8
          ) {}
          m = e & ((1 << -nBits) - 1);
          e >>= -nBits;
          nBits += mLen;
          for (
            ;
            nBits > 0;
            m = m * 256 + buffer[offset + i], i += d, nBits -= 8
          ) {}
          if (e === 0) {
            e = 1 - eBias;
          } else if (e === eMax) {
            return m ? NaN : (s ? -1 : 1) * Infinity;
          } else {
            m = m + Math.pow(2, mLen);
            e = e - eBias;
          }
          return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
        };
        exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
          var e, m, c;
          var eLen = nBytes * 8 - mLen - 1;
          var eMax = (1 << eLen) - 1;
          var eBias = eMax >> 1;
          var rt = mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0;
          var i = isLE ? 0 : nBytes - 1;
          var d = isLE ? 1 : -1;
          var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0;
          value = Math.abs(value);
          if (isNaN(value) || value === Infinity) {
            m = isNaN(value) ? 1 : 0;
            e = eMax;
          } else {
            e = Math.floor(Math.log(value) / Math.LN2);
            if (value * (c = Math.pow(2, -e)) < 1) {
              e--;
              c *= 2;
            }
            if (e + eBias >= 1) {
              value += rt / c;
            } else {
              value += rt * Math.pow(2, 1 - eBias);
            }
            if (value * c >= 2) {
              e++;
              c /= 2;
            }
            if (e + eBias >= eMax) {
              m = 0;
              e = eMax;
            } else if (e + eBias >= 1) {
              m = (value * c - 1) * Math.pow(2, mLen);
              e = e + eBias;
            } else {
              m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
              e = 0;
            }
          }
          for (
            ;
            mLen >= 8;
            buffer[offset + i] = m & 255, i += d, m /= 256, mLen -= 8
          ) {}
          e = (e << mLen) | m;
          eLen += mLen;
          for (
            ;
            eLen > 0;
            buffer[offset + i] = e & 255, i += d, e /= 256, eLen -= 8
          ) {}
          buffer[offset + i - d] |= s * 128;
        };
      },
      {},
    ],
    29: [
      function (require, module, exports) {
        var indexOf = [].indexOf;
        module.exports = function (arr, obj) {
          if (indexOf) return arr.indexOf(obj);
          for (var i = 0; i < arr.length; ++i) {
            if (arr[i] === obj) return i;
          }
          return -1;
        };
      },
      {},
    ],
    30: [
      function (require, module, exports) {
        var toString = {}.toString;
        module.exports =
          Array.isArray ||
          function (arr) {
            return toString.call(arr) == "[object Array]";
          };
      },
      {},
    ],
    31: [
      function (require, module, exports) {
        var s = 1e3;
        var m = s * 60;
        var h = m * 60;
        var d = h * 24;
        var y = d * 365.25;
        module.exports = function (val, options) {
          options = options || {};
          var type = typeof val;
          if (type === "string" && val.length > 0) {
            return parse(val);
          } else if (type === "number" && isNaN(val) === false) {
            return options.long ? fmtLong(val) : fmtShort(val);
          }
          throw new Error(
            "val is not a non-empty string or a valid number. val=" +
              JSON.stringify(val)
          );
        };
        function parse(str) {
          str = String(str);
          if (str.length > 100) {
            return;
          }
          var match =
            /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(
              str
            );
          if (!match) {
            return;
          }
          var n = parseFloat(match[1]);
          var type = (match[2] || "ms").toLowerCase();
          switch (type) {
            case "years":
            case "year":
            case "yrs":
            case "yr":
            case "y":
              return n * y;
            case "days":
            case "day":
            case "d":
              return n * d;
            case "hours":
            case "hour":
            case "hrs":
            case "hr":
            case "h":
              return n * h;
            case "minutes":
            case "minute":
            case "mins":
            case "min":
            case "m":
              return n * m;
            case "seconds":
            case "second":
            case "secs":
            case "sec":
            case "s":
              return n * s;
            case "milliseconds":
            case "millisecond":
            case "msecs":
            case "msec":
            case "ms":
              return n;
            default:
              return undefined;
          }
        }
        function fmtShort(ms) {
          if (ms >= d) {
            return Math.round(ms / d) + "d";
          }
          if (ms >= h) {
            return Math.round(ms / h) + "h";
          }
          if (ms >= m) {
            return Math.round(ms / m) + "m";
          }
          if (ms >= s) {
            return Math.round(ms / s) + "s";
          }
          return ms + "ms";
        }
        function fmtLong(ms) {
          return (
            plural(ms, d, "day") ||
            plural(ms, h, "hour") ||
            plural(ms, m, "minute") ||
            plural(ms, s, "second") ||
            ms + " ms"
          );
        }
        function plural(ms, n, name) {
          if (ms < n) {
            return;
          }
          if (ms < n * 1.5) {
            return Math.floor(ms / n) + " " + name;
          }
          return Math.ceil(ms / n) + " " + name + "s";
        }
      },
      {},
    ],
    32: [
      function (require, module, exports) {
        exports.encode = function (obj) {
          var str = "";
          for (var i in obj) {
            if (obj.hasOwnProperty(i)) {
              if (str.length) str += "&";
              str += encodeURIComponent(i) + "=" + encodeURIComponent(obj[i]);
            }
          }
          return str;
        };
        exports.decode = function (qs) {
          var qry = {};
          var pairs = qs.split("&");
          for (var i = 0, l = pairs.length; i < l; i++) {
            var pair = pairs[i].split("=");
            qry[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
          }
          return qry;
        };
      },
      {},
    ],
    33: [
      function (require, module, exports) {
        var re =
          /^(?:(?![^:@]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/;
        var parts = [
          "source",
          "protocol",
          "authority",
          "userInfo",
          "user",
          "password",
          "host",
          "port",
          "relative",
          "path",
          "directory",
          "file",
          "query",
          "anchor",
        ];
        module.exports = function parseuri(str) {
          var src = str,
            b = str.indexOf("["),
            e = str.indexOf("]");
          if (b != -1 && e != -1) {
            str =
              str.substring(0, b) +
              str.substring(b, e).replace(/:/g, ";") +
              str.substring(e, str.length);
          }
          var m = re.exec(str || ""),
            uri = {},
            i = 14;
          while (i--) {
            uri[parts[i]] = m[i] || "";
          }
          if (b != -1 && e != -1) {
            uri.source = src;
            uri.host = uri.host
              .substring(1, uri.host.length - 1)
              .replace(/;/g, ":");
            uri.authority = uri.authority
              .replace("[", "")
              .replace("]", "")
              .replace(/;/g, ":");
            uri.ipv6uri = true;
          }
          return uri;
        };
      },
      {},
    ],
    34: [
      function (require, module, exports) {
        var process = (module.exports = {});
        var cachedSetTimeout;
        var cachedClearTimeout;
        function defaultSetTimout() {
          throw new Error("setTimeout has not been defined");
        }
        function defaultClearTimeout() {
          throw new Error("clearTimeout has not been defined");
        }
        (function () {
          try {
            if (typeof setTimeout === "function") {
              cachedSetTimeout = setTimeout;
            } else {
              cachedSetTimeout = defaultSetTimout;
            }
          } catch (e) {
            cachedSetTimeout = defaultSetTimout;
          }
          try {
            if (typeof clearTimeout === "function") {
              cachedClearTimeout = clearTimeout;
            } else {
              cachedClearTimeout = defaultClearTimeout;
            }
          } catch (e) {
            cachedClearTimeout = defaultClearTimeout;
          }
        })();
        function runTimeout(fun) {
          if (cachedSetTimeout === setTimeout) {
            return setTimeout(fun, 0);
          }
          if (
            (cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) &&
            setTimeout
          ) {
            cachedSetTimeout = setTimeout;
            return setTimeout(fun, 0);
          }
          try {
            return cachedSetTimeout(fun, 0);
          } catch (e) {
            try {
              return cachedSetTimeout.call(null, fun, 0);
            } catch (e) {
              return cachedSetTimeout.call(this, fun, 0);
            }
          }
        }
        function runClearTimeout(marker) {
          if (cachedClearTimeout === clearTimeout) {
            return clearTimeout(marker);
          }
          if (
            (cachedClearTimeout === defaultClearTimeout ||
              !cachedClearTimeout) &&
            clearTimeout
          ) {
            cachedClearTimeout = clearTimeout;
            return clearTimeout(marker);
          }
          try {
            return cachedClearTimeout(marker);
          } catch (e) {
            try {
              return cachedClearTimeout.call(null, marker);
            } catch (e) {
              return cachedClearTimeout.call(this, marker);
            }
          }
        }
        var queue = [];
        var draining = false;
        var currentQueue;
        var queueIndex = -1;
        function cleanUpNextTick() {
          if (!draining || !currentQueue) {
            return;
          }
          draining = false;
          if (currentQueue.length) {
            queue = currentQueue.concat(queue);
          } else {
            queueIndex = -1;
          }
          if (queue.length) {
            drainQueue();
          }
        }
        function drainQueue() {
          if (draining) {
            return;
          }
          var timeout = runTimeout(cleanUpNextTick);
          draining = true;
          var len = queue.length;
          while (len) {
            currentQueue = queue;
            queue = [];
            while (++queueIndex < len) {
              if (currentQueue) {
                currentQueue[queueIndex].run();
              }
            }
            queueIndex = -1;
            len = queue.length;
          }
          currentQueue = null;
          draining = false;
          runClearTimeout(timeout);
        }
        process.nextTick = function (fun) {
          var args = new Array(arguments.length - 1);
          if (arguments.length > 1) {
            for (var i = 1; i < arguments.length; i++) {
              args[i - 1] = arguments[i];
            }
          }
          queue.push(new Item(fun, args));
          if (queue.length === 1 && !draining) {
            runTimeout(drainQueue);
          }
        };
        function Item(fun, array) {
          this.fun = fun;
          this.array = array;
        }
        Item.prototype.run = function () {
          this.fun.apply(null, this.array);
        };
        process.title = "browser";
        process.browser = true;
        process.env = {};
        process.argv = [];
        process.version = "";
        process.versions = {};
        function noop() {}
        process.on = noop;
        process.addListener = noop;
        process.once = noop;
        process.off = noop;
        process.removeListener = noop;
        process.removeAllListeners = noop;
        process.emit = noop;
        process.prependListener = noop;
        process.prependOnceListener = noop;
        process.listeners = function (name) {
          return [];
        };
        process.binding = function (name) {
          throw new Error("process.binding is not supported");
        };
        process.cwd = function () {
          return "/";
        };
        process.chdir = function (dir) {
          throw new Error("process.chdir is not supported");
        };
        process.umask = function () {
          return 0;
        };
      },
      {},
    ],
    35: [
      function (require, module, exports) {
        var url = require("./url");
        var parser = require("socket.io-parser");
        var Manager = require("./manager");
        var debug = require("debug")("socket.io-client");
        module.exports = exports = lookup;
        var cache = (exports.managers = {});
        function lookup(uri, opts) {
          if (typeof uri === "object") {
            opts = uri;
            uri = undefined;
          }
          opts = opts || {};
          var parsed = url(uri);
          var source = parsed.source;
          var id = parsed.id;
          var path = parsed.path;
          var sameNamespace = cache[id] && path in cache[id].nsps;
          var newConnection =
            opts.forceNew ||
            opts["force new connection"] ||
            false === opts.multiplex ||
            sameNamespace;
          var io;
          if (newConnection) {
            debug("ignoring socket cache for %s", source);
            io = Manager(source, opts);
          } else {
            if (!cache[id]) {
              debug("new io instance for %s", source);
              cache[id] = Manager(source, opts);
            }
            io = cache[id];
          }
          if (parsed.query && !opts.query) {
            opts.query = parsed.query;
          }
          return io.socket(parsed.path, opts);
        }
        exports.protocol = parser.protocol;
        exports.connect = lookup;
        exports.Manager = require("./manager");
        exports.Socket = require("./socket");
      },
      {
        "./manager": 36,
        "./socket": 38,
        "./url": 39,
        debug: 40,
        "socket.io-parser": 43,
      },
    ],
    36: [
      function (require, module, exports) {
        var eio = require("engine.io-client");
        var Socket = require("./socket");
        var Emitter = require("component-emitter");
        var parser = require("socket.io-parser");
        var on = require("./on");
        var bind = require("component-bind");
        var debug = require("debug")("socket.io-client:manager");
        var indexOf = require("indexof");
        var Backoff = require("backo2");
        var has = Object.prototype.hasOwnProperty;
        module.exports = Manager;
        function Manager(uri, opts) {
          if (!(this instanceof Manager)) return new Manager(uri, opts);
          if (uri && "object" === typeof uri) {
            opts = uri;
            uri = undefined;
          }
          opts = opts || {};
          opts.path = opts.path || "/socket.io";
          this.nsps = {};
          this.subs = [];
          this.opts = opts;
          this.reconnection(opts.reconnection !== false);
          this.reconnectionAttempts(opts.reconnectionAttempts || Infinity);
          this.reconnectionDelay(opts.reconnectionDelay || 1e3);
          this.reconnectionDelayMax(opts.reconnectionDelayMax || 5e3);
          this.randomizationFactor(opts.randomizationFactor || 0.5);
          this.backoff = new Backoff({
            min: this.reconnectionDelay(),
            max: this.reconnectionDelayMax(),
            jitter: this.randomizationFactor(),
          });
          this.timeout(null == opts.timeout ? 2e4 : opts.timeout);
          this.readyState = "closed";
          this.uri = uri;
          this.connecting = [];
          this.lastPing = null;
          this.encoding = false;
          this.packetBuffer = [];
          var _parser = opts.parser || parser;
          this.encoder = new _parser.Encoder();
          this.decoder = new _parser.Decoder();
          this.autoConnect = opts.autoConnect !== false;
          if (this.autoConnect) this.open();
        }
        Manager.prototype.emitAll = function () {
          this.emit.apply(this, arguments);
          for (var nsp in this.nsps) {
            if (has.call(this.nsps, nsp)) {
              this.nsps[nsp].emit.apply(this.nsps[nsp], arguments);
            }
          }
        };
        Manager.prototype.updateSocketIds = function () {
          for (var nsp in this.nsps) {
            if (has.call(this.nsps, nsp)) {
              this.nsps[nsp].id = this.generateId(nsp);
            }
          }
        };
        Manager.prototype.generateId = function (nsp) {
          return (nsp === "/" ? "" : nsp + "#") + this.engine.id;
        };
        Emitter(Manager.prototype);
        Manager.prototype.reconnection = function (v) {
          if (!arguments.length) return this._reconnection;
          this._reconnection = !!v;
          return this;
        };
        Manager.prototype.reconnectionAttempts = function (v) {
          if (!arguments.length) return this._reconnectionAttempts;
          this._reconnectionAttempts = v;
          return this;
        };
        Manager.prototype.reconnectionDelay = function (v) {
          if (!arguments.length) return this._reconnectionDelay;
          this._reconnectionDelay = v;
          this.backoff && this.backoff.setMin(v);
          return this;
        };
        Manager.prototype.randomizationFactor = function (v) {
          if (!arguments.length) return this._randomizationFactor;
          this._randomizationFactor = v;
          this.backoff && this.backoff.setJitter(v);
          return this;
        };
        Manager.prototype.reconnectionDelayMax = function (v) {
          if (!arguments.length) return this._reconnectionDelayMax;
          this._reconnectionDelayMax = v;
          this.backoff && this.backoff.setMax(v);
          return this;
        };
        Manager.prototype.timeout = function (v) {
          if (!arguments.length) return this._timeout;
          this._timeout = v;
          return this;
        };
        Manager.prototype.maybeReconnectOnOpen = function () {
          if (
            !this.reconnecting &&
            this._reconnection &&
            this.backoff.attempts === 0
          ) {
            this.reconnect();
          }
        };
        Manager.prototype.open = Manager.prototype.connect = function (
          fn,
          opts
        ) {
          debug("readyState %s", this.readyState);
          if (~this.readyState.indexOf("open")) return this;
          debug("opening %s", this.uri);
          this.engine = eio(this.uri, this.opts);
          var socket = this.engine;
          var self = this;
          this.readyState = "opening";
          this.skipReconnect = false;
          var openSub = on(socket, "open", function () {
            self.onopen();
            fn && fn();
          });
          var errorSub = on(socket, "error", function (data) {
            debug("connect_error");
            self.cleanup();
            self.readyState = "closed";
            self.emitAll("connect_error", data);
            if (fn) {
              var err = new Error("Connection error");
              err.data = data;
              fn(err);
            } else {
              self.maybeReconnectOnOpen();
            }
          });
          if (false !== this._timeout) {
            var timeout = this._timeout;
            debug("connect attempt will timeout after %d", timeout);
            var timer = setTimeout(function () {
              debug("connect attempt timed out after %d", timeout);
              openSub.destroy();
              socket.close();
              socket.emit("error", "timeout");
              self.emitAll("connect_timeout", timeout);
            }, timeout);
            this.subs.push({
              destroy: function () {
                clearTimeout(timer);
              },
            });
          }
          this.subs.push(openSub);
          this.subs.push(errorSub);
          return this;
        };
        Manager.prototype.onopen = function () {
          debug("open");
          this.cleanup();
          this.readyState = "open";
          this.emit("open");
          var socket = this.engine;
          this.subs.push(on(socket, "data", bind(this, "ondata")));
          this.subs.push(on(socket, "ping", bind(this, "onping")));
          this.subs.push(on(socket, "pong", bind(this, "onpong")));
          this.subs.push(on(socket, "error", bind(this, "onerror")));
          this.subs.push(on(socket, "close", bind(this, "onclose")));
          this.subs.push(on(this.decoder, "decoded", bind(this, "ondecoded")));
        };
        Manager.prototype.onping = function () {
          this.lastPing = new Date();
          this.emitAll("ping");
        };
        Manager.prototype.onpong = function () {
          this.emitAll("pong", new Date() - this.lastPing);
        };
        Manager.prototype.ondata = function (data) {
          this.decoder.add(data);
        };
        Manager.prototype.ondecoded = function (packet) {
          this.emit("packet", packet);
        };
        Manager.prototype.onerror = function (err) {
          debug("error", err);
          this.emitAll("error", err);
        };
        Manager.prototype.socket = function (nsp, opts) {
          var socket = this.nsps[nsp];
          if (!socket) {
            socket = new Socket(this, nsp, opts);
            this.nsps[nsp] = socket;
            var self = this;
            socket.on("connecting", onConnecting);
            socket.on("connect", function () {
              socket.id = self.generateId(nsp);
            });
            if (this.autoConnect) {
              onConnecting();
            }
          }
          function onConnecting() {
            if (!~indexOf(self.connecting, socket)) {
              self.connecting.push(socket);
            }
          }
          return socket;
        };
        Manager.prototype.destroy = function (socket) {
          var index = indexOf(this.connecting, socket);
          if (~index) this.connecting.splice(index, 1);
          if (this.connecting.length) return;
          this.close();
        };
        Manager.prototype.packet = function (packet) {
          debug("writing packet %j", packet);
          var self = this;
          if (packet.query && packet.type === 0)
            packet.nsp += "?" + packet.query;
          if (!self.encoding) {
            self.encoding = true;
            this.encoder.encode(packet, function (encodedPackets) {
              for (var i = 0; i < encodedPackets.length; i++) {
                self.engine.write(encodedPackets[i], packet.options);
              }
              self.encoding = false;
              self.processPacketQueue();
            });
          } else {
            self.packetBuffer.push(packet);
          }
        };
        Manager.prototype.processPacketQueue = function () {
          if (this.packetBuffer.length > 0 && !this.encoding) {
            var pack = this.packetBuffer.shift();
            this.packet(pack);
          }
        };
        Manager.prototype.cleanup = function () {
          debug("cleanup");
          var subsLength = this.subs.length;
          for (var i = 0; i < subsLength; i++) {
            var sub = this.subs.shift();
            sub.destroy();
          }
          this.packetBuffer = [];
          this.encoding = false;
          this.lastPing = null;
          this.decoder.destroy();
        };
        Manager.prototype.close = Manager.prototype.disconnect = function () {
          debug("disconnect");
          this.skipReconnect = true;
          this.reconnecting = false;
          if ("opening" === this.readyState) {
            this.cleanup();
          }
          this.backoff.reset();
          this.readyState = "closed";
          if (this.engine) this.engine.close();
        };
        Manager.prototype.onclose = function (reason) {
          debug("onclose");
          this.cleanup();
          this.backoff.reset();
          this.readyState = "closed";
          this.emit("close", reason);
          if (this._reconnection && !this.skipReconnect) {
            this.reconnect();
          }
        };
        Manager.prototype.reconnect = function () {
          if (this.reconnecting || this.skipReconnect) return this;
          var self = this;
          if (this.backoff.attempts >= this._reconnectionAttempts) {
            debug("reconnect failed");
            this.backoff.reset();
            this.emitAll("reconnect_failed");
            this.reconnecting = false;
          } else {
            var delay = this.backoff.duration();
            debug("will wait %dms before reconnect attempt", delay);
            this.reconnecting = true;
            var timer = setTimeout(function () {
              if (self.skipReconnect) return;
              debug("attempting reconnect");
              self.emitAll("reconnect_attempt", self.backoff.attempts);
              self.emitAll("reconnecting", self.backoff.attempts);
              if (self.skipReconnect) return;
              self.open(function (err) {
                if (err) {
                  debug("reconnect attempt error");
                  self.reconnecting = false;
                  self.reconnect();
                  self.emitAll("reconnect_error", err.data);
                } else {
                  debug("reconnect success");
                  self.onreconnect();
                }
              });
            }, delay);
            this.subs.push({
              destroy: function () {
                clearTimeout(timer);
              },
            });
          }
        };
        Manager.prototype.onreconnect = function () {
          var attempt = this.backoff.attempts;
          this.reconnecting = false;
          this.backoff.reset();
          this.updateSocketIds();
          this.emitAll("reconnect", attempt);
        };
      },
      {
        "./on": 37,
        "./socket": 38,
        backo2: 3,
        "component-bind": 9,
        "component-emitter": 10,
        debug: 40,
        "engine.io-client": 12,
        indexof: 29,
        "socket.io-parser": 43,
      },
    ],
    37: [
      function (require, module, exports) {
        module.exports = on;
        function on(obj, ev, fn) {
          obj.on(ev, fn);
          return {
            destroy: function () {
              obj.removeListener(ev, fn);
            },
          };
        }
      },
      {},
    ],
    38: [
      function (require, module, exports) {
        var parser = require("socket.io-parser");
        var Emitter = require("component-emitter");
        var toArray = require("to-array");
        var on = require("./on");
        var bind = require("component-bind");
        var debug = require("debug")("socket.io-client:socket");
        var parseqs = require("parseqs");
        var hasBin = require("has-binary2");
        module.exports = exports = Socket;
        var events = {
          connect: 1,
          connect_error: 1,
          connect_timeout: 1,
          connecting: 1,
          disconnect: 1,
          error: 1,
          reconnect: 1,
          reconnect_attempt: 1,
          reconnect_failed: 1,
          reconnect_error: 1,
          reconnecting: 1,
          ping: 1,
          pong: 1,
        };
        var emit = Emitter.prototype.emit;
        function Socket(io, nsp, opts) {
          this.io = io;
          this.nsp = nsp;
          this.json = this;
          this.ids = 0;
          this.acks = {};
          this.receiveBuffer = [];
          this.sendBuffer = [];
          this.connected = false;
          this.disconnected = true;
          this.flags = {};
          if (opts && opts.query) {
            this.query = opts.query;
          }
          if (this.io.autoConnect) this.open();
        }
        Emitter(Socket.prototype);
        Socket.prototype.subEvents = function () {
          if (this.subs) return;
          var io = this.io;
          this.subs = [
            on(io, "open", bind(this, "onopen")),
            on(io, "packet", bind(this, "onpacket")),
            on(io, "close", bind(this, "onclose")),
          ];
        };
        Socket.prototype.open = Socket.prototype.connect = function () {
          if (this.connected) return this;
          this.subEvents();
          this.io.open();
          if ("open" === this.io.readyState) this.onopen();
          this.emit("connecting");
          return this;
        };
        Socket.prototype.send = function () {
          var args = toArray(arguments);
          args.unshift("message");
          this.emit.apply(this, args);
          return this;
        };
        Socket.prototype.emit = function (ev) {
          if (events.hasOwnProperty(ev)) {
            emit.apply(this, arguments);
            return this;
          }
          var args = toArray(arguments);
          var packet = {
            type: (
              this.flags.binary !== undefined ? this.flags.binary : hasBin(args)
            )
              ? parser.BINARY_EVENT
              : parser.EVENT,
            data: args,
          };
          packet.options = {};
          packet.options.compress =
            !this.flags || false !== this.flags.compress;
          if ("function" === typeof args[args.length - 1]) {
            debug("emitting packet with ack id %d", this.ids);
            this.acks[this.ids] = args.pop();
            packet.id = this.ids++;
          }
          if (this.connected) {
            this.packet(packet);
          } else {
            this.sendBuffer.push(packet);
          }
          this.flags = {};
          return this;
        };
        Socket.prototype.packet = function (packet) {
          packet.nsp = this.nsp;
          this.io.packet(packet);
        };
        Socket.prototype.onopen = function () {
          debug("transport is open - connecting");
          if ("/" !== this.nsp) {
            if (this.query) {
              var query =
                typeof this.query === "object"
                  ? parseqs.encode(this.query)
                  : this.query;
              debug("sending connect packet with query %s", query);
              this.packet({ type: parser.CONNECT, query: query });
            } else {
              this.packet({ type: parser.CONNECT });
            }
          }
        };
        Socket.prototype.onclose = function (reason) {
          debug("close (%s)", reason);
          this.connected = false;
          this.disconnected = true;
          delete this.id;
          this.emit("disconnect", reason);
        };
        Socket.prototype.onpacket = function (packet) {
          var sameNamespace = packet.nsp === this.nsp;
          var rootNamespaceError =
            packet.type === parser.ERROR && packet.nsp === "/";
          if (!sameNamespace && !rootNamespaceError) return;
          switch (packet.type) {
            case parser.CONNECT:
              this.onconnect();
              break;
            case parser.EVENT:
              this.onevent(packet);
              break;
            case parser.BINARY_EVENT:
              this.onevent(packet);
              break;
            case parser.ACK:
              this.onack(packet);
              break;
            case parser.BINARY_ACK:
              this.onack(packet);
              break;
            case parser.DISCONNECT:
              this.ondisconnect();
              break;
            case parser.ERROR:
              this.emit("error", packet.data);
              break;
          }
        };
        Socket.prototype.onevent = function (packet) {
          var args = packet.data || [];
          debug("emitting event %j", args);
          if (null != packet.id) {
            debug("attaching ack callback to event");
            args.push(this.ack(packet.id));
          }
          if (this.connected) {
            emit.apply(this, args);
          } else {
            this.receiveBuffer.push(args);
          }
        };
        Socket.prototype.ack = function (id) {
          var self = this;
          var sent = false;
          return function () {
            if (sent) return;
            sent = true;
            var args = toArray(arguments);
            debug("sending ack %j", args);
            self.packet({
              type: hasBin(args) ? parser.BINARY_ACK : parser.ACK,
              id: id,
              data: args,
            });
          };
        };
        Socket.prototype.onack = function (packet) {
          var ack = this.acks[packet.id];
          if ("function" === typeof ack) {
            debug("calling ack %s with %j", packet.id, packet.data);
            ack.apply(this, packet.data);
            delete this.acks[packet.id];
          } else {
            debug("bad ack %s", packet.id);
          }
        };
        Socket.prototype.onconnect = function () {
          this.connected = true;
          this.disconnected = false;
          this.emit("connect");
          this.emitBuffered();
        };
        Socket.prototype.emitBuffered = function () {
          var i;
          for (i = 0; i < this.receiveBuffer.length; i++) {
            emit.apply(this, this.receiveBuffer[i]);
          }
          this.receiveBuffer = [];
          for (i = 0; i < this.sendBuffer.length; i++) {
            this.packet(this.sendBuffer[i]);
          }
          this.sendBuffer = [];
        };
        Socket.prototype.ondisconnect = function () {
          debug("server disconnect (%s)", this.nsp);
          this.destroy();
          this.onclose("io server disconnect");
        };
        Socket.prototype.destroy = function () {
          if (this.subs) {
            for (var i = 0; i < this.subs.length; i++) {
              this.subs[i].destroy();
            }
            this.subs = null;
          }
          this.io.destroy(this);
        };
        Socket.prototype.close = Socket.prototype.disconnect = function () {
          if (this.connected) {
            debug("performing disconnect (%s)", this.nsp);
            this.packet({ type: parser.DISCONNECT });
          }
          this.destroy();
          if (this.connected) {
            this.onclose("io client disconnect");
          }
          return this;
        };
        Socket.prototype.compress = function (compress) {
          this.flags.compress = compress;
          return this;
        };
        Socket.prototype.binary = function (binary) {
          this.flags.binary = binary;
          return this;
        };
      },
      {
        "./on": 37,
        "component-bind": 9,
        "component-emitter": 10,
        debug: 40,
        "has-binary2": 26,
        parseqs: 32,
        "socket.io-parser": 43,
        "to-array": 48,
      },
    ],
    39: [
      function (require, module, exports) {
        (function (global) {
          var parseuri = require("parseuri");
          var debug = require("debug")("socket.io-client:url");
          module.exports = url;
          function url(uri, loc) {
            var obj = uri;
            loc = loc || global.location;
            if (null == uri) uri = loc.protocol + "//" + loc.host;
            if ("string" === typeof uri) {
              if ("/" === uri.charAt(0)) {
                if ("/" === uri.charAt(1)) {
                  uri = loc.protocol + uri;
                } else {
                  uri = loc.host + uri;
                }
              }
              if (!/^(https?|wss?):\/\//.test(uri)) {
                debug("protocol-less url %s", uri);
                if ("undefined" !== typeof loc) {
                  uri = loc.protocol + "//" + uri;
                } else {
                  uri = "https://" + uri;
                }
              }
              debug("parse %s", uri);
              obj = parseuri(uri);
            }
            if (!obj.port) {
              if (/^(http|ws)$/.test(obj.protocol)) {
                obj.port = "80";
              } else if (/^(http|ws)s$/.test(obj.protocol)) {
                obj.port = "443";
              }
            }
            obj.path = obj.path || "/";
            var ipv6 = obj.host.indexOf(":") !== -1;
            var host = ipv6 ? "[" + obj.host + "]" : obj.host;
            obj.id = obj.protocol + "://" + host + ":" + obj.port;
            obj.href =
              obj.protocol +
              "://" +
              host +
              (loc && loc.port === obj.port ? "" : ":" + obj.port);
            return obj;
          }
        }.call(
          this,
          typeof global !== "undefined"
            ? global
            : typeof self !== "undefined"
            ? self
            : typeof window !== "undefined"
            ? window
            : {}
        ));
      },
      { debug: 40, parseuri: 33 },
    ],
    40: [
      function (require, module, exports) {
        arguments[4][21][0].apply(exports, arguments);
      },
      { "./debug": 41, _process: 34, dup: 21 },
    ],
    41: [
      function (require, module, exports) {
        arguments[4][22][0].apply(exports, arguments);
      },
      { dup: 22, ms: 31 },
    ],
    42: [
      function (require, module, exports) {
        (function (global) {
          var isArray = require("isarray");
          var isBuf = require("./is-buffer");
          var toString = Object.prototype.toString;
          var withNativeBlob =
            typeof global.Blob === "function" ||
            toString.call(global.Blob) === "[object BlobConstructor]";
          var withNativeFile =
            typeof global.File === "function" ||
            toString.call(global.File) === "[object FileConstructor]";
          exports.deconstructPacket = function (packet) {
            var buffers = [];
            var packetData = packet.data;
            var pack = packet;
            pack.data = _deconstructPacket(packetData, buffers);
            pack.attachments = buffers.length;
            return { packet: pack, buffers: buffers };
          };
          function _deconstructPacket(data, buffers) {
            if (!data) return data;
            if (isBuf(data)) {
              var placeholder = { _placeholder: true, num: buffers.length };
              buffers.push(data);
              return placeholder;
            } else if (isArray(data)) {
              var newData = new Array(data.length);
              for (var i = 0; i < data.length; i++) {
                newData[i] = _deconstructPacket(data[i], buffers);
              }
              return newData;
            } else if (typeof data === "object" && !(data instanceof Date)) {
              var newData = {};
              for (var key in data) {
                newData[key] = _deconstructPacket(data[key], buffers);
              }
              return newData;
            }
            return data;
          }
          exports.reconstructPacket = function (packet, buffers) {
            packet.data = _reconstructPacket(packet.data, buffers);
            packet.attachments = undefined;
            return packet;
          };
          function _reconstructPacket(data, buffers) {
            if (!data) return data;
            if (data && data._placeholder) {
              return buffers[data.num];
            } else if (isArray(data)) {
              for (var i = 0; i < data.length; i++) {
                data[i] = _reconstructPacket(data[i], buffers);
              }
            } else if (typeof data === "object") {
              for (var key in data) {
                data[key] = _reconstructPacket(data[key], buffers);
              }
            }
            return data;
          }
          exports.removeBlobs = function (data, callback) {
            function _removeBlobs(obj, curKey, containingObject) {
              if (!obj) return obj;
              if (
                (withNativeBlob && obj instanceof Blob) ||
                (withNativeFile && obj instanceof File)
              ) {
                pendingBlobs++;
                var fileReader = new FileReader();
                fileReader.onload = function () {
                  if (containingObject) {
                    containingObject[curKey] = this.result;
                  } else {
                    bloblessData = this.result;
                  }
                  if (!--pendingBlobs) {
                    callback(bloblessData);
                  }
                };
                fileReader.readAsArrayBuffer(obj);
              } else if (isArray(obj)) {
                for (var i = 0; i < obj.length; i++) {
                  _removeBlobs(obj[i], i, obj);
                }
              } else if (typeof obj === "object" && !isBuf(obj)) {
                for (var key in obj) {
                  _removeBlobs(obj[key], key, obj);
                }
              }
            }
            var pendingBlobs = 0;
            var bloblessData = data;
            _removeBlobs(bloblessData);
            if (!pendingBlobs) {
              callback(bloblessData);
            }
          };
        }.call(
          this,
          typeof global !== "undefined"
            ? global
            : typeof self !== "undefined"
            ? self
            : typeof window !== "undefined"
            ? window
            : {}
        ));
      },
      { "./is-buffer": 44, isarray: 30 },
    ],
    43: [
      function (require, module, exports) {
        var debug = require("debug")("socket.io-parser");
        var Emitter = require("component-emitter");
        var binary = require("./binary");
        var isArray = require("isarray");
        var isBuf = require("./is-buffer");
        exports.protocol = 4;
        exports.types = [
          "CONNECT",
          "DISCONNECT",
          "EVENT",
          "ACK",
          "ERROR",
          "BINARY_EVENT",
          "BINARY_ACK",
        ];
        exports.CONNECT = 0;
        exports.DISCONNECT = 1;
        exports.EVENT = 2;
        exports.ACK = 3;
        exports.ERROR = 4;
        exports.BINARY_EVENT = 5;
        exports.BINARY_ACK = 6;
        exports.Encoder = Encoder;
        exports.Decoder = Decoder;
        function Encoder() {}
        var ERROR_PACKET = exports.ERROR + '"encode error"';
        Encoder.prototype.encode = function (obj, callback) {
          debug("encoding packet %j", obj);
          if (
            exports.BINARY_EVENT === obj.type ||
            exports.BINARY_ACK === obj.type
          ) {
            encodeAsBinary(obj, callback);
          } else {
            var encoding = encodeAsString(obj);
            callback([encoding]);
          }
        };
        function encodeAsString(obj) {
          var str = "" + obj.type;
          if (
            exports.BINARY_EVENT === obj.type ||
            exports.BINARY_ACK === obj.type
          ) {
            str += obj.attachments + "-";
          }
          if (obj.nsp && "/" !== obj.nsp) {
            str += obj.nsp + ",";
          }
          if (null != obj.id) {
            str += obj.id;
          }
          if (null != obj.data) {
            var payload = tryStringify(obj.data);
            if (payload !== false) {
              str += payload;
            } else {
              return ERROR_PACKET;
            }
          }
          debug("encoded %j as %s", obj, str);
          return str;
        }
        function tryStringify(str) {
          try {
            return JSON.stringify(str);
          } catch (e) {
            return false;
          }
        }
        function encodeAsBinary(obj, callback) {
          function writeEncoding(bloblessData) {
            var deconstruction = binary.deconstructPacket(bloblessData);
            var pack = encodeAsString(deconstruction.packet);
            var buffers = deconstruction.buffers;
            buffers.unshift(pack);
            callback(buffers);
          }
          binary.removeBlobs(obj, writeEncoding);
        }
        function Decoder() {
          this.reconstructor = null;
        }
        Emitter(Decoder.prototype);
        Decoder.prototype.add = function (obj) {
          var packet;
          if (typeof obj === "string") {
            packet = decodeString(obj);
            if (
              exports.BINARY_EVENT === packet.type ||
              exports.BINARY_ACK === packet.type
            ) {
              this.reconstructor = new BinaryReconstructor(packet);
              if (this.reconstructor.reconPack.attachments === 0) {
                this.emit("decoded", packet);
              }
            } else {
              this.emit("decoded", packet);
            }
          } else if (isBuf(obj) || obj.base64) {
            if (!this.reconstructor) {
              throw new Error(
                "got binary data when not reconstructing a packet"
              );
            } else {
              packet = this.reconstructor.takeBinaryData(obj);
              if (packet) {
                this.reconstructor = null;
                this.emit("decoded", packet);
              }
            }
          } else {
            throw new Error("Unknown type: " + obj);
          }
        };
        function decodeString(str) {
          var i = 0;
          var p = { type: Number(str.charAt(0)) };
          if (null == exports.types[p.type]) {
            return error("unknown packet type " + p.type);
          }
          if (
            exports.BINARY_EVENT === p.type ||
            exports.BINARY_ACK === p.type
          ) {
            var buf = "";
            while (str.charAt(++i) !== "-") {
              buf += str.charAt(i);
              if (i == str.length) break;
            }
            if (buf != Number(buf) || str.charAt(i) !== "-") {
              throw new Error("Illegal attachments");
            }
            p.attachments = Number(buf);
          }
          if ("/" === str.charAt(i + 1)) {
            p.nsp = "";
            while (++i) {
              var c = str.charAt(i);
              if ("," === c) break;
              p.nsp += c;
              if (i === str.length) break;
            }
          } else {
            p.nsp = "/";
          }
          var next = str.charAt(i + 1);
          if ("" !== next && Number(next) == next) {
            p.id = "";
            while (++i) {
              var c = str.charAt(i);
              if (null == c || Number(c) != c) {
                --i;
                break;
              }
              p.id += str.charAt(i);
              if (i === str.length) break;
            }
            p.id = Number(p.id);
          }
          if (str.charAt(++i)) {
            var payload = tryParse(str.substr(i));
            var isPayloadValid =
              payload !== false &&
              (p.type === exports.ERROR || isArray(payload));
            if (isPayloadValid) {
              p.data = payload;
            } else {
              return error("invalid payload");
            }
          }
          debug("decoded %s as %j", str, p);
          return p;
        }
        function tryParse(str) {
          try {
            return JSON.parse(str);
          } catch (e) {
            return false;
          }
        }
        Decoder.prototype.destroy = function () {
          if (this.reconstructor) {
            this.reconstructor.finishedReconstruction();
          }
        };
        function BinaryReconstructor(packet) {
          this.reconPack = packet;
          this.buffers = [];
        }
        BinaryReconstructor.prototype.takeBinaryData = function (binData) {
          this.buffers.push(binData);
          if (this.buffers.length === this.reconPack.attachments) {
            var packet = binary.reconstructPacket(this.reconPack, this.buffers);
            this.finishedReconstruction();
            return packet;
          }
          return null;
        };
        BinaryReconstructor.prototype.finishedReconstruction = function () {
          this.reconPack = null;
          this.buffers = [];
        };
        function error(msg) {
          return { type: exports.ERROR, data: "parser error: " + msg };
        }
      },
      {
        "./binary": 42,
        "./is-buffer": 44,
        "component-emitter": 10,
        debug: 45,
        isarray: 30,
      },
    ],
    44: [
      function (require, module, exports) {
        (function (global) {
          module.exports = isBuf;
          var withNativeBuffer =
            typeof global.Buffer === "function" &&
            typeof global.Buffer.isBuffer === "function";
          var withNativeArrayBuffer = typeof global.ArrayBuffer === "function";
          var isView = (function () {
            if (
              withNativeArrayBuffer &&
              typeof global.ArrayBuffer.isView === "function"
            ) {
              return global.ArrayBuffer.isView;
            } else {
              return function (obj) {
                return obj.buffer instanceof global.ArrayBuffer;
              };
            }
          })();
          function isBuf(obj) {
            return (
              (withNativeBuffer && global.Buffer.isBuffer(obj)) ||
              (withNativeArrayBuffer &&
                (obj instanceof global.ArrayBuffer || isView(obj)))
            );
          }
        }.call(
          this,
          typeof global !== "undefined"
            ? global
            : typeof self !== "undefined"
            ? self
            : typeof window !== "undefined"
            ? window
            : {}
        ));
      },
      {},
    ],
    45: [
      function (require, module, exports) {
        arguments[4][21][0].apply(exports, arguments);
      },
      { "./debug": 46, _process: 34, dup: 21 },
    ],
    46: [
      function (require, module, exports) {
        arguments[4][22][0].apply(exports, arguments);
      },
      { dup: 22, ms: 31 },
    ],
    47: [
      function (require, module, exports) {
        (function (setImmediate, clearImmediate) {
          var nextTick = require("process/browser.js").nextTick;
          var apply = Function.prototype.apply;
          var slice = Array.prototype.slice;
          var immediateIds = {};
          var nextImmediateId = 0;
          exports.setTimeout = function () {
            return new Timeout(
              apply.call(setTimeout, window, arguments),
              clearTimeout
            );
          };
          exports.setInterval = function () {
            return new Timeout(
              apply.call(setInterval, window, arguments),
              clearInterval
            );
          };
          exports.clearTimeout = exports.clearInterval = function (timeout) {
            timeout.close();
          };
          function Timeout(id, clearFn) {
            this._id = id;
            this._clearFn = clearFn;
          }
          Timeout.prototype.unref = Timeout.prototype.ref = function () {};
          Timeout.prototype.close = function () {
            this._clearFn.call(window, this._id);
          };
          exports.enroll = function (item, msecs) {
            clearTimeout(item._idleTimeoutId);
            item._idleTimeout = msecs;
          };
          exports.unenroll = function (item) {
            clearTimeout(item._idleTimeoutId);
            item._idleTimeout = -1;
          };
          exports._unrefActive = exports.active = function (item) {
            clearTimeout(item._idleTimeoutId);
            var msecs = item._idleTimeout;
            if (msecs >= 0) {
              item._idleTimeoutId = setTimeout(function onTimeout() {
                if (item._onTimeout) item._onTimeout();
              }, msecs);
            }
          };
          exports.setImmediate =
            typeof setImmediate === "function"
              ? setImmediate
              : function (fn) {
                  var id = nextImmediateId++;
                  var args =
                    arguments.length < 2 ? false : slice.call(arguments, 1);
                  immediateIds[id] = true;
                  nextTick(function onNextTick() {
                    if (immediateIds[id]) {
                      if (args) {
                        fn.apply(null, args);
                      } else {
                        fn.call(null);
                      }
                      exports.clearImmediate(id);
                    }
                  });
                  return id;
                };
          exports.clearImmediate =
            typeof clearImmediate === "function"
              ? clearImmediate
              : function (id) {
                  delete immediateIds[id];
                };
        }.call(
          this,
          require("timers").setImmediate,
          require("timers").clearImmediate
        ));
      },
      { "process/browser.js": 34, timers: 47 },
    ],
    48: [
      function (require, module, exports) {
        module.exports = toArray;
        function toArray(list, index) {
          var array = [];
          index = index || 0;
          for (var i = index || 0; i < list.length; i++) {
            array[i - index] = list[i];
          }
          return array;
        }
      },
      {},
    ],
    49: [
      function (require, module, exports) {
        (function (global, setImmediate) {
          (function (global, factory) {
            typeof exports === "object" && typeof module !== "undefined"
              ? (module.exports = factory())
              : typeof define === "function" && define.amd
              ? define(factory)
              : (global.Vue = factory());
          })(this, function () {
            "use strict";
            var emptyObject = Object.freeze({});
            function isUndef(v) {
              return v === undefined || v === null;
            }
            function isDef(v) {
              return v !== undefined && v !== null;
            }
            function isTrue(v) {
              return v === true;
            }
            function isFalse(v) {
              return v === false;
            }
            function isPrimitive(value) {
              return (
                typeof value === "string" ||
                typeof value === "number" ||
                typeof value === "symbol" ||
                typeof value === "boolean"
              );
            }
            function isObject(obj) {
              return obj !== null && typeof obj === "object";
            }
            var _toString = Object.prototype.toString;
            function toRawType(value) {
              return _toString.call(value).slice(8, -1);
            }
            function isPlainObject(obj) {
              return _toString.call(obj) === "[object Object]";
            }
            function isRegExp(v) {
              return _toString.call(v) === "[object RegExp]";
            }
            function isValidArrayIndex(val) {
              var n = parseFloat(String(val));
              return n >= 0 && Math.floor(n) === n && isFinite(val);
            }
            function toString(val) {
              return val == null
                ? ""
                : typeof val === "object"
                ? JSON.stringify(val, null, 2)
                : String(val);
            }
            function toNumber(val) {
              var n = parseFloat(val);
              return isNaN(n) ? val : n;
            }
            function makeMap(str, expectsLowerCase) {
              var map = Object.create(null);
              var list = str.split(",");
              for (var i = 0; i < list.length; i++) {
                map[list[i]] = true;
              }
              return expectsLowerCase
                ? function (val) {
                    return map[val.toLowerCase()];
                  }
                : function (val) {
                    return map[val];
                  };
            }
            var isBuiltInTag = makeMap("slot,component", true);
            var isReservedAttribute = makeMap("key,ref,slot,slot-scope,is");
            function remove(arr, item) {
              if (arr.length) {
                var index = arr.indexOf(item);
                if (index > -1) {
                  return arr.splice(index, 1);
                }
              }
            }
            var hasOwnProperty = Object.prototype.hasOwnProperty;
            function hasOwn(obj, key) {
              return hasOwnProperty.call(obj, key);
            }
            function cached(fn) {
              var cache = Object.create(null);
              return function cachedFn(str) {
                var hit = cache[str];
                return hit || (cache[str] = fn(str));
              };
            }
            var camelizeRE = /-(\w)/g;
            var camelize = cached(function (str) {
              return str.replace(camelizeRE, function (_, c) {
                return c ? c.toUpperCase() : "";
              });
            });
            var capitalize = cached(function (str) {
              return str.charAt(0).toUpperCase() + str.slice(1);
            });
            var hyphenateRE = /\B([A-Z])/g;
            var hyphenate = cached(function (str) {
              return str.replace(hyphenateRE, "-$1").toLowerCase();
            });
            function polyfillBind(fn, ctx) {
              function boundFn(a) {
                var l = arguments.length;
                return l
                  ? l > 1
                    ? fn.apply(ctx, arguments)
                    : fn.call(ctx, a)
                  : fn.call(ctx);
              }
              boundFn._length = fn.length;
              return boundFn;
            }
            function nativeBind(fn, ctx) {
              return fn.bind(ctx);
            }
            var bind = Function.prototype.bind ? nativeBind : polyfillBind;
            function toArray(list, start) {
              start = start || 0;
              var i = list.length - start;
              var ret = new Array(i);
              while (i--) {
                ret[i] = list[i + start];
              }
              return ret;
            }
            function extend(to, _from) {
              for (var key in _from) {
                to[key] = _from[key];
              }
              return to;
            }
            function toObject(arr) {
              var res = {};
              for (var i = 0; i < arr.length; i++) {
                if (arr[i]) {
                  extend(res, arr[i]);
                }
              }
              return res;
            }
            function noop(a, b, c) {}
            var no = function (a, b, c) {
              return false;
            };
            var identity = function (_) {
              return _;
            };
            function genStaticKeys(modules) {
              return modules
                .reduce(function (keys, m) {
                  return keys.concat(m.staticKeys || []);
                }, [])
                .join(",");
            }
            function looseEqual(a, b) {
              if (a === b) {
                return true;
              }
              var isObjectA = isObject(a);
              var isObjectB = isObject(b);
              if (isObjectA && isObjectB) {
                try {
                  var isArrayA = Array.isArray(a);
                  var isArrayB = Array.isArray(b);
                  if (isArrayA && isArrayB) {
                    return (
                      a.length === b.length &&
                      a.every(function (e, i) {
                        return looseEqual(e, b[i]);
                      })
                    );
                  } else if (!isArrayA && !isArrayB) {
                    var keysA = Object.keys(a);
                    var keysB = Object.keys(b);
                    return (
                      keysA.length === keysB.length &&
                      keysA.every(function (key) {
                        return looseEqual(a[key], b[key]);
                      })
                    );
                  } else {
                    return false;
                  }
                } catch (e) {
                  return false;
                }
              } else if (!isObjectA && !isObjectB) {
                return String(a) === String(b);
              } else {
                return false;
              }
            }
            function looseIndexOf(arr, val) {
              for (var i = 0; i < arr.length; i++) {
                if (looseEqual(arr[i], val)) {
                  return i;
                }
              }
              return -1;
            }
            function once(fn) {
              var called = false;
              return function () {
                if (!called) {
                  called = true;
                  fn.apply(this, arguments);
                }
              };
            }
            var SSR_ATTR = "data-server-rendered";
            var ASSET_TYPES = ["component", "directive", "filter"];
            var LIFECYCLE_HOOKS = [
              "beforeCreate",
              "created",
              "beforeMount",
              "mounted",
              "beforeUpdate",
              "updated",
              "beforeDestroy",
              "destroyed",
              "activated",
              "deactivated",
              "errorCaptured",
            ];
            var config = {
              optionMergeStrategies: Object.create(null),
              silent: false,
              productionTip: "development" !== "production",
              devtools: "development" !== "production",
              performance: false,
              errorHandler: null,
              warnHandler: null,
              ignoredElements: [],
              keyCodes: Object.create(null),
              isReservedTag: no,
              isReservedAttr: no,
              isUnknownElement: no,
              getTagNamespace: noop,
              parsePlatformTagName: identity,
              mustUseProp: no,
              _lifecycleHooks: LIFECYCLE_HOOKS,
            };
            function isReserved(str) {
              var c = (str + "").charCodeAt(0);
              return c === 36 || c === 95;
            }
            function def(obj, key, val, enumerable) {
              Object.defineProperty(obj, key, {
                value: val,
                enumerable: !!enumerable,
                writable: true,
                configurable: true,
              });
            }
            var bailRE = /[^\w.$]/;
            function parsePath(path) {
              if (bailRE.test(path)) {
                return;
              }
              var segments = path.split(".");
              return function (obj) {
                for (var i = 0; i < segments.length; i++) {
                  if (!obj) {
                    return;
                  }
                  obj = obj[segments[i]];
                }
                return obj;
              };
            }
            var hasProto = "__proto__" in {};
            var inBrowser = typeof window !== "undefined";
            var inWeex =
              typeof WXEnvironment !== "undefined" && !!WXEnvironment.platform;
            var weexPlatform = inWeex && WXEnvironment.platform.toLowerCase();
            var UA = inBrowser && window.navigator.userAgent.toLowerCase();
            var isIE = UA && /msie|trident/.test(UA);
            var isIE9 = UA && UA.indexOf("msie 9.0") > 0;
            var isEdge = UA && UA.indexOf("edge/") > 0;
            var isAndroid =
              (UA && UA.indexOf("android") > 0) || weexPlatform === "android";
            var isIOS =
              (UA && /iphone|ipad|ipod|ios/.test(UA)) || weexPlatform === "ios";
            var isChrome = UA && /chrome\/\d+/.test(UA) && !isEdge;
            var nativeWatch = {}.watch;
            var supportsPassive = false;
            if (inBrowser) {
              try {
                var opts = {};
                Object.defineProperty(opts, "passive", {
                  get: function get() {
                    supportsPassive = true;
                  },
                });
                window.addEventListener("test-passive", null, opts);
              } catch (e) {}
            }
            var _isServer;
            var isServerRendering = function () {
              if (_isServer === undefined) {
                if (!inBrowser && !inWeex && typeof global !== "undefined") {
                  _isServer = global["process"].env.VUE_ENV === "server";
                } else {
                  _isServer = false;
                }
              }
              return _isServer;
            };
            var devtools = inBrowser && window.__VUE_DEVTOOLS_GLOBAL_HOOK__;
            function isNative(Ctor) {
              return (
                typeof Ctor === "function" &&
                /native code/.test(Ctor.toString())
              );
            }
            var hasSymbol =
              typeof Symbol !== "undefined" &&
              isNative(Symbol) &&
              typeof Reflect !== "undefined" &&
              isNative(Reflect.ownKeys);
            var _Set;
            if (typeof Set !== "undefined" && isNative(Set)) {
              _Set = Set;
            } else {
              _Set = (function () {
                function Set() {
                  this.set = Object.create(null);
                }
                Set.prototype.has = function has(key) {
                  return this.set[key] === true;
                };
                Set.prototype.add = function add(key) {
                  this.set[key] = true;
                };
                Set.prototype.clear = function clear() {
                  this.set = Object.create(null);
                };
                return Set;
              })();
            }
            var warn = noop;
            var tip = noop;
            var generateComponentTrace = noop;
            var formatComponentName = noop;
            {
              var hasConsole = typeof console !== "undefined";
              var classifyRE = /(?:^|[-_])(\w)/g;
              var classify = function (str) {
                return str
                  .replace(classifyRE, function (c) {
                    return c.toUpperCase();
                  })
                  .replace(/[-_]/g, "");
              };
              warn = function (msg, vm) {
                var trace = vm ? generateComponentTrace(vm) : "";
                if (config.warnHandler) {
                  config.warnHandler.call(null, msg, vm, trace);
                } else if (hasConsole && !config.silent) {
                  console.error("[Vue warn]: " + msg + trace);
                }
              };
              tip = function (msg, vm) {
                if (hasConsole && !config.silent) {
                  console.warn(
                    "[Vue tip]: " + msg + (vm ? generateComponentTrace(vm) : "")
                  );
                }
              };
              formatComponentName = function (vm, includeFile) {
                if (vm.$root === vm) {
                  return "<Root>";
                }
                var options =
                  typeof vm === "function" && vm.cid != null
                    ? vm.options
                    : vm._isVue
                    ? vm.$options || vm.constructor.options
                    : vm || {};
                var name = options.name || options._componentTag;
                var file = options.__file;
                if (!name && file) {
                  var match = file.match(/([^/\\]+)\.vue$/);
                  name = match && match[1];
                }
                return (
                  (name ? "<" + classify(name) + ">" : "<Anonymous>") +
                  (file && includeFile !== false ? " at " + file : "")
                );
              };
              var repeat = function (str, n) {
                var res = "";
                while (n) {
                  if (n % 2 === 1) {
                    res += str;
                  }
                  if (n > 1) {
                    str += str;
                  }
                  n >>= 1;
                }
                return res;
              };
              generateComponentTrace = function (vm) {
                if (vm._isVue && vm.$parent) {
                  var tree = [];
                  var currentRecursiveSequence = 0;
                  while (vm) {
                    if (tree.length > 0) {
                      var last = tree[tree.length - 1];
                      if (last.constructor === vm.constructor) {
                        currentRecursiveSequence++;
                        vm = vm.$parent;
                        continue;
                      } else if (currentRecursiveSequence > 0) {
                        tree[tree.length - 1] = [
                          last,
                          currentRecursiveSequence,
                        ];
                        currentRecursiveSequence = 0;
                      }
                    }
                    tree.push(vm);
                    vm = vm.$parent;
                  }
                  return (
                    "\n\nfound in\n\n" +
                    tree
                      .map(function (vm, i) {
                        return (
                          "" +
                          (i === 0 ? "---\x3e " : repeat(" ", 5 + i * 2)) +
                          (Array.isArray(vm)
                            ? formatComponentName(vm[0]) +
                              "... (" +
                              vm[1] +
                              " recursive calls)"
                            : formatComponentName(vm))
                        );
                      })
                      .join("\n")
                  );
                } else {
                  return "\n\n(found in " + formatComponentName(vm) + ")";
                }
              };
            }
            var uid = 0;
            var Dep = function Dep() {
              this.id = uid++;
              this.subs = [];
            };
            Dep.prototype.addSub = function addSub(sub) {
              this.subs.push(sub);
            };
            Dep.prototype.removeSub = function removeSub(sub) {
              remove(this.subs, sub);
            };
            Dep.prototype.depend = function depend() {
              if (Dep.target) {
                Dep.target.addDep(this);
              }
            };
            Dep.prototype.notify = function notify() {
              var subs = this.subs.slice();
              for (var i = 0, l = subs.length; i < l; i++) {
                subs[i].update();
              }
            };
            Dep.target = null;
            var targetStack = [];
            function pushTarget(_target) {
              if (Dep.target) {
                targetStack.push(Dep.target);
              }
              Dep.target = _target;
            }
            function popTarget() {
              Dep.target = targetStack.pop();
            }
            var VNode = function VNode(
              tag,
              data,
              children,
              text,
              elm,
              context,
              componentOptions,
              asyncFactory
            ) {
              this.tag = tag;
              this.data = data;
              this.children = children;
              this.text = text;
              this.elm = elm;
              this.ns = undefined;
              this.context = context;
              this.fnContext = undefined;
              this.fnOptions = undefined;
              this.fnScopeId = undefined;
              this.key = data && data.key;
              this.componentOptions = componentOptions;
              this.componentInstance = undefined;
              this.parent = undefined;
              this.raw = false;
              this.isStatic = false;
              this.isRootInsert = true;
              this.isComment = false;
              this.isCloned = false;
              this.isOnce = false;
              this.asyncFactory = asyncFactory;
              this.asyncMeta = undefined;
              this.isAsyncPlaceholder = false;
            };
            var prototypeAccessors = { child: { configurable: true } };
            prototypeAccessors.child.get = function () {
              return this.componentInstance;
            };
            Object.defineProperties(VNode.prototype, prototypeAccessors);
            var createEmptyVNode = function (text) {
              if (text === void 0) text = "";
              var node = new VNode();
              node.text = text;
              node.isComment = true;
              return node;
            };
            function createTextVNode(val) {
              return new VNode(undefined, undefined, undefined, String(val));
            }
            function cloneVNode(vnode) {
              var cloned = new VNode(
                vnode.tag,
                vnode.data,
                vnode.children,
                vnode.text,
                vnode.elm,
                vnode.context,
                vnode.componentOptions,
                vnode.asyncFactory
              );
              cloned.ns = vnode.ns;
              cloned.isStatic = vnode.isStatic;
              cloned.key = vnode.key;
              cloned.isComment = vnode.isComment;
              cloned.fnContext = vnode.fnContext;
              cloned.fnOptions = vnode.fnOptions;
              cloned.fnScopeId = vnode.fnScopeId;
              cloned.isCloned = true;
              return cloned;
            }
            var arrayProto = Array.prototype;
            var arrayMethods = Object.create(arrayProto);
            var methodsToPatch = [
              "push",
              "pop",
              "shift",
              "unshift",
              "splice",
              "sort",
              "reverse",
            ];
            methodsToPatch.forEach(function (method) {
              var original = arrayProto[method];
              def(arrayMethods, method, function mutator() {
                var args = [],
                  len = arguments.length;
                while (len--) args[len] = arguments[len];
                var result = original.apply(this, args);
                var ob = this.__ob__;
                var inserted;
                switch (method) {
                  case "push":
                  case "unshift":
                    inserted = args;
                    break;
                  case "splice":
                    inserted = args.slice(2);
                    break;
                }
                if (inserted) {
                  ob.observeArray(inserted);
                }
                ob.dep.notify();
                return result;
              });
            });
            var arrayKeys = Object.getOwnPropertyNames(arrayMethods);
            var shouldObserve = true;
            function toggleObserving(value) {
              shouldObserve = value;
            }
            var Observer = function Observer(value) {
              this.value = value;
              this.dep = new Dep();
              this.vmCount = 0;
              def(value, "__ob__", this);
              if (Array.isArray(value)) {
                var augment = hasProto ? protoAugment : copyAugment;
                augment(value, arrayMethods, arrayKeys);
                this.observeArray(value);
              } else {
                this.walk(value);
              }
            };
            Observer.prototype.walk = function walk(obj) {
              var keys = Object.keys(obj);
              for (var i = 0; i < keys.length; i++) {
                defineReactive(obj, keys[i]);
              }
            };
            Observer.prototype.observeArray = function observeArray(items) {
              for (var i = 0, l = items.length; i < l; i++) {
                observe(items[i]);
              }
            };
            function protoAugment(target, src, keys) {
              target.__proto__ = src;
            }
            function copyAugment(target, src, keys) {
              for (var i = 0, l = keys.length; i < l; i++) {
                var key = keys[i];
                def(target, key, src[key]);
              }
            }
            function observe(value, asRootData) {
              if (!isObject(value) || value instanceof VNode) {
                return;
              }
              var ob;
              if (hasOwn(value, "__ob__") && value.__ob__ instanceof Observer) {
                ob = value.__ob__;
              } else if (
                shouldObserve &&
                !isServerRendering() &&
                (Array.isArray(value) || isPlainObject(value)) &&
                Object.isExtensible(value) &&
                !value._isVue
              ) {
                ob = new Observer(value);
              }
              if (asRootData && ob) {
                ob.vmCount++;
              }
              return ob;
            }
            function defineReactive(obj, key, val, customSetter, shallow) {
              var dep = new Dep();
              var property = Object.getOwnPropertyDescriptor(obj, key);
              if (property && property.configurable === false) {
                return;
              }
              var getter = property && property.get;
              if (!getter && arguments.length === 2) {
                val = obj[key];
              }
              var setter = property && property.set;
              var childOb = !shallow && observe(val);
              Object.defineProperty(obj, key, {
                enumerable: true,
                configurable: true,
                get: function reactiveGetter() {
                  var value = getter ? getter.call(obj) : val;
                  if (Dep.target) {
                    dep.depend();
                    if (childOb) {
                      childOb.dep.depend();
                      if (Array.isArray(value)) {
                        dependArray(value);
                      }
                    }
                  }
                  return value;
                },
                set: function reactiveSetter(newVal) {
                  var value = getter ? getter.call(obj) : val;
                  if (
                    newVal === value ||
                    (newVal !== newVal && value !== value)
                  ) {
                    return;
                  }
                  if ("development" !== "production" && customSetter) {
                    customSetter();
                  }
                  if (setter) {
                    setter.call(obj, newVal);
                  } else {
                    val = newVal;
                  }
                  childOb = !shallow && observe(newVal);
                  dep.notify();
                },
              });
            }
            function set(target, key, val) {
              if (
                "development" !== "production" &&
                (isUndef(target) || isPrimitive(target))
              ) {
                warn(
                  "Cannot set reactive property on undefined, null, or primitive value: " +
                    target
                );
              }
              if (Array.isArray(target) && isValidArrayIndex(key)) {
                target.length = Math.max(target.length, key);
                target.splice(key, 1, val);
                return val;
              }
              if (key in target && !(key in Object.prototype)) {
                target[key] = val;
                return val;
              }
              var ob = target.__ob__;
              if (target._isVue || (ob && ob.vmCount)) {
                "development" !== "production" &&
                  warn(
                    "Avoid adding reactive properties to a Vue instance or its root $data " +
                      "at runtime - declare it upfront in the data option."
                  );
                return val;
              }
              if (!ob) {
                target[key] = val;
                return val;
              }
              defineReactive(ob.value, key, val);
              ob.dep.notify();
              return val;
            }
            function del(target, key) {
              if (
                "development" !== "production" &&
                (isUndef(target) || isPrimitive(target))
              ) {
                warn(
                  "Cannot delete reactive property on undefined, null, or primitive value: " +
                    target
                );
              }
              if (Array.isArray(target) && isValidArrayIndex(key)) {
                target.splice(key, 1);
                return;
              }
              var ob = target.__ob__;
              if (target._isVue || (ob && ob.vmCount)) {
                "development" !== "production" &&
                  warn(
                    "Avoid deleting properties on a Vue instance or its root $data " +
                      "- just set it to null."
                  );
                return;
              }
              if (!hasOwn(target, key)) {
                return;
              }
              delete target[key];
              if (!ob) {
                return;
              }
              ob.dep.notify();
            }
            function dependArray(value) {
              for (var e = void 0, i = 0, l = value.length; i < l; i++) {
                e = value[i];
                e && e.__ob__ && e.__ob__.dep.depend();
                if (Array.isArray(e)) {
                  dependArray(e);
                }
              }
            }
            var strats = config.optionMergeStrategies;
            {
              strats.el = strats.propsData = function (parent, child, vm, key) {
                if (!vm) {
                  warn(
                    'option "' +
                      key +
                      '" can only be used during instance ' +
                      "creation with the `new` keyword."
                  );
                }
                return defaultStrat(parent, child);
              };
            }
            function mergeData(to, from) {
              if (!from) {
                return to;
              }
              var key, toVal, fromVal;
              var keys = Object.keys(from);
              for (var i = 0; i < keys.length; i++) {
                key = keys[i];
                toVal = to[key];
                fromVal = from[key];
                if (!hasOwn(to, key)) {
                  set(to, key, fromVal);
                } else if (isPlainObject(toVal) && isPlainObject(fromVal)) {
                  mergeData(toVal, fromVal);
                }
              }
              return to;
            }
            function mergeDataOrFn(parentVal, childVal, vm) {
              if (!vm) {
                if (!childVal) {
                  return parentVal;
                }
                if (!parentVal) {
                  return childVal;
                }
                return function mergedDataFn() {
                  return mergeData(
                    typeof childVal === "function"
                      ? childVal.call(this, this)
                      : childVal,
                    typeof parentVal === "function"
                      ? parentVal.call(this, this)
                      : parentVal
                  );
                };
              } else {
                return function mergedInstanceDataFn() {
                  var instanceData =
                    typeof childVal === "function"
                      ? childVal.call(vm, vm)
                      : childVal;
                  var defaultData =
                    typeof parentVal === "function"
                      ? parentVal.call(vm, vm)
                      : parentVal;
                  if (instanceData) {
                    return mergeData(instanceData, defaultData);
                  } else {
                    return defaultData;
                  }
                };
              }
            }
            strats.data = function (parentVal, childVal, vm) {
              if (!vm) {
                if (childVal && typeof childVal !== "function") {
                  "development" !== "production" &&
                    warn(
                      'The "data" option should be a function ' +
                        "that returns a per-instance value in component " +
                        "definitions.",
                      vm
                    );
                  return parentVal;
                }
                return mergeDataOrFn(parentVal, childVal);
              }
              return mergeDataOrFn(parentVal, childVal, vm);
            };
            function mergeHook(parentVal, childVal) {
              return childVal
                ? parentVal
                  ? parentVal.concat(childVal)
                  : Array.isArray(childVal)
                  ? childVal
                  : [childVal]
                : parentVal;
            }
            LIFECYCLE_HOOKS.forEach(function (hook) {
              strats[hook] = mergeHook;
            });
            function mergeAssets(parentVal, childVal, vm, key) {
              var res = Object.create(parentVal || null);
              if (childVal) {
                "development" !== "production" &&
                  assertObjectType(key, childVal, vm);
                return extend(res, childVal);
              } else {
                return res;
              }
            }
            ASSET_TYPES.forEach(function (type) {
              strats[type + "s"] = mergeAssets;
            });
            strats.watch = function (parentVal, childVal, vm, key) {
              if (parentVal === nativeWatch) {
                parentVal = undefined;
              }
              if (childVal === nativeWatch) {
                childVal = undefined;
              }
              if (!childVal) {
                return Object.create(parentVal || null);
              }
              {
                assertObjectType(key, childVal, vm);
              }
              if (!parentVal) {
                return childVal;
              }
              var ret = {};
              extend(ret, parentVal);
              for (var key$1 in childVal) {
                var parent = ret[key$1];
                var child = childVal[key$1];
                if (parent && !Array.isArray(parent)) {
                  parent = [parent];
                }
                ret[key$1] = parent
                  ? parent.concat(child)
                  : Array.isArray(child)
                  ? child
                  : [child];
              }
              return ret;
            };
            strats.props =
              strats.methods =
              strats.inject =
              strats.computed =
                function (parentVal, childVal, vm, key) {
                  if (childVal && "development" !== "production") {
                    assertObjectType(key, childVal, vm);
                  }
                  if (!parentVal) {
                    return childVal;
                  }
                  var ret = Object.create(null);
                  extend(ret, parentVal);
                  if (childVal) {
                    extend(ret, childVal);
                  }
                  return ret;
                };
            strats.provide = mergeDataOrFn;
            var defaultStrat = function (parentVal, childVal) {
              return childVal === undefined ? parentVal : childVal;
            };
            function checkComponents(options) {
              for (var key in options.components) {
                validateComponentName(key);
              }
            }
            function validateComponentName(name) {
              if (!/^[a-zA-Z][\w-]*$/.test(name)) {
                warn(
                  'Invalid component name: "' +
                    name +
                    '". Component names ' +
                    "can only contain alphanumeric characters and the hyphen, " +
                    "and must start with a letter."
                );
              }
              if (isBuiltInTag(name) || config.isReservedTag(name)) {
                warn(
                  "Do not use built-in or reserved HTML elements as component " +
                    "id: " +
                    name
                );
              }
            }
            function normalizeProps(options, vm) {
              var props = options.props;
              if (!props) {
                return;
              }
              var res = {};
              var i, val, name;
              if (Array.isArray(props)) {
                i = props.length;
                while (i--) {
                  val = props[i];
                  if (typeof val === "string") {
                    name = camelize(val);
                    res[name] = { type: null };
                  } else {
                    warn("props must be strings when using array syntax.");
                  }
                }
              } else if (isPlainObject(props)) {
                for (var key in props) {
                  val = props[key];
                  name = camelize(key);
                  res[name] = isPlainObject(val) ? val : { type: val };
                }
              } else {
                warn(
                  'Invalid value for option "props": expected an Array or an Object, ' +
                    "but got " +
                    toRawType(props) +
                    ".",
                  vm
                );
              }
              options.props = res;
            }
            function normalizeInject(options, vm) {
              var inject = options.inject;
              if (!inject) {
                return;
              }
              var normalized = (options.inject = {});
              if (Array.isArray(inject)) {
                for (var i = 0; i < inject.length; i++) {
                  normalized[inject[i]] = { from: inject[i] };
                }
              } else if (isPlainObject(inject)) {
                for (var key in inject) {
                  var val = inject[key];
                  normalized[key] = isPlainObject(val)
                    ? extend({ from: key }, val)
                    : { from: val };
                }
              } else {
                warn(
                  'Invalid value for option "inject": expected an Array or an Object, ' +
                    "but got " +
                    toRawType(inject) +
                    ".",
                  vm
                );
              }
            }
            function normalizeDirectives(options) {
              var dirs = options.directives;
              if (dirs) {
                for (var key in dirs) {
                  var def = dirs[key];
                  if (typeof def === "function") {
                    dirs[key] = { bind: def, update: def };
                  }
                }
              }
            }
            function assertObjectType(name, value, vm) {
              if (!isPlainObject(value)) {
                warn(
                  'Invalid value for option "' +
                    name +
                    '": expected an Object, ' +
                    "but got " +
                    toRawType(value) +
                    ".",
                  vm
                );
              }
            }
            function mergeOptions(parent, child, vm) {
              {
                checkComponents(child);
              }
              if (typeof child === "function") {
                child = child.options;
              }
              normalizeProps(child, vm);
              normalizeInject(child, vm);
              normalizeDirectives(child);
              var extendsFrom = child.extends;
              if (extendsFrom) {
                parent = mergeOptions(parent, extendsFrom, vm);
              }
              if (child.mixins) {
                for (var i = 0, l = child.mixins.length; i < l; i++) {
                  parent = mergeOptions(parent, child.mixins[i], vm);
                }
              }
              var options = {};
              var key;
              for (key in parent) {
                mergeField(key);
              }
              for (key in child) {
                if (!hasOwn(parent, key)) {
                  mergeField(key);
                }
              }
              function mergeField(key) {
                var strat = strats[key] || defaultStrat;
                options[key] = strat(parent[key], child[key], vm, key);
              }
              return options;
            }
            function resolveAsset(options, type, id, warnMissing) {
              if (typeof id !== "string") {
                return;
              }
              var assets = options[type];
              if (hasOwn(assets, id)) {
                return assets[id];
              }
              var camelizedId = camelize(id);
              if (hasOwn(assets, camelizedId)) {
                return assets[camelizedId];
              }
              var PascalCaseId = capitalize(camelizedId);
              if (hasOwn(assets, PascalCaseId)) {
                return assets[PascalCaseId];
              }
              var res =
                assets[id] || assets[camelizedId] || assets[PascalCaseId];
              if ("development" !== "production" && warnMissing && !res) {
                warn(
                  "Failed to resolve " + type.slice(0, -1) + ": " + id,
                  options
                );
              }
              return res;
            }
            function validateProp(key, propOptions, propsData, vm) {
              var prop = propOptions[key];
              var absent = !hasOwn(propsData, key);
              var value = propsData[key];
              var booleanIndex = getTypeIndex(Boolean, prop.type);
              if (booleanIndex > -1) {
                if (absent && !hasOwn(prop, "default")) {
                  value = false;
                } else if (value === "" || value === hyphenate(key)) {
                  var stringIndex = getTypeIndex(String, prop.type);
                  if (stringIndex < 0 || booleanIndex < stringIndex) {
                    value = true;
                  }
                }
              }
              if (value === undefined) {
                value = getPropDefaultValue(vm, prop, key);
                var prevShouldObserve = shouldObserve;
                toggleObserving(true);
                observe(value);
                toggleObserving(prevShouldObserve);
              }
              {
                assertProp(prop, key, value, vm, absent);
              }
              return value;
            }
            function getPropDefaultValue(vm, prop, key) {
              if (!hasOwn(prop, "default")) {
                return undefined;
              }
              var def = prop.default;
              if ("development" !== "production" && isObject(def)) {
                warn(
                  'Invalid default value for prop "' +
                    key +
                    '": ' +
                    "Props with type Object/Array must use a factory function " +
                    "to return the default value.",
                  vm
                );
              }
              if (
                vm &&
                vm.$options.propsData &&
                vm.$options.propsData[key] === undefined &&
                vm._props[key] !== undefined
              ) {
                return vm._props[key];
              }
              return typeof def === "function" &&
                getType(prop.type) !== "Function"
                ? def.call(vm)
                : def;
            }
            function assertProp(prop, name, value, vm, absent) {
              if (prop.required && absent) {
                warn('Missing required prop: "' + name + '"', vm);
                return;
              }
              if (value == null && !prop.required) {
                return;
              }
              var type = prop.type;
              var valid = !type || type === true;
              var expectedTypes = [];
              if (type) {
                if (!Array.isArray(type)) {
                  type = [type];
                }
                for (var i = 0; i < type.length && !valid; i++) {
                  var assertedType = assertType(value, type[i]);
                  expectedTypes.push(assertedType.expectedType || "");
                  valid = assertedType.valid;
                }
              }
              if (!valid) {
                warn(
                  'Invalid prop: type check failed for prop "' +
                    name +
                    '".' +
                    " Expected " +
                    expectedTypes.map(capitalize).join(", ") +
                    ", got " +
                    toRawType(value) +
                    ".",
                  vm
                );
                return;
              }
              var validator = prop.validator;
              if (validator) {
                if (!validator(value)) {
                  warn(
                    'Invalid prop: custom validator check failed for prop "' +
                      name +
                      '".',
                    vm
                  );
                }
              }
            }
            var simpleCheckRE = /^(String|Number|Boolean|Function|Symbol)$/;
            function assertType(value, type) {
              var valid;
              var expectedType = getType(type);
              if (simpleCheckRE.test(expectedType)) {
                var t = typeof value;
                valid = t === expectedType.toLowerCase();
                if (!valid && t === "object") {
                  valid = value instanceof type;
                }
              } else if (expectedType === "Object") {
                valid = isPlainObject(value);
              } else if (expectedType === "Array") {
                valid = Array.isArray(value);
              } else {
                valid = value instanceof type;
              }
              return { valid: valid, expectedType: expectedType };
            }
            function getType(fn) {
              var match = fn && fn.toString().match(/^\s*function (\w+)/);
              return match ? match[1] : "";
            }
            function isSameType(a, b) {
              return getType(a) === getType(b);
            }
            function getTypeIndex(type, expectedTypes) {
              if (!Array.isArray(expectedTypes)) {
                return isSameType(expectedTypes, type) ? 0 : -1;
              }
              for (var i = 0, len = expectedTypes.length; i < len; i++) {
                if (isSameType(expectedTypes[i], type)) {
                  return i;
                }
              }
              return -1;
            }
            function handleError(err, vm, info) {
              if (vm) {
                var cur = vm;
                while ((cur = cur.$parent)) {
                  var hooks = cur.$options.errorCaptured;
                  if (hooks) {
                    for (var i = 0; i < hooks.length; i++) {
                      try {
                        var capture =
                          hooks[i].call(cur, err, vm, info) === false;
                        if (capture) {
                          return;
                        }
                      } catch (e) {
                        globalHandleError(e, cur, "errorCaptured hook");
                      }
                    }
                  }
                }
              }
              globalHandleError(err, vm, info);
            }
            function globalHandleError(err, vm, info) {
              if (config.errorHandler) {
                try {
                  return config.errorHandler.call(null, err, vm, info);
                } catch (e) {
                  logError(e, null, "config.errorHandler");
                }
              }
              logError(err, vm, info);
            }
            function logError(err, vm, info) {
              {
                warn("Error in " + info + ': "' + err.toString() + '"', vm);
              }
              if ((inBrowser || inWeex) && typeof console !== "undefined") {
                console.error(err);
              } else {
                throw err;
              }
            }
            var callbacks = [];
            var pending = false;
            function flushCallbacks() {
              pending = false;
              var copies = callbacks.slice(0);
              callbacks.length = 0;
              for (var i = 0; i < copies.length; i++) {
                copies[i]();
              }
            }
            var microTimerFunc;
            var macroTimerFunc;
            var useMacroTask = false;
            if (typeof setImmediate !== "undefined" && isNative(setImmediate)) {
              macroTimerFunc = function () {
                setImmediate(flushCallbacks);
              };
            } else if (
              typeof MessageChannel !== "undefined" &&
              (isNative(MessageChannel) ||
                MessageChannel.toString() ===
                  "[object MessageChannelConstructor]")
            ) {
              var channel = new MessageChannel();
              var port = channel.port2;
              channel.port1.onmessage = flushCallbacks;
              macroTimerFunc = function () {
                port.postMessage(1);
              };
            } else {
              macroTimerFunc = function () {
                setTimeout(flushCallbacks, 0);
              };
            }
            if (typeof Promise !== "undefined" && isNative(Promise)) {
              var p = Promise.resolve();
              microTimerFunc = function () {
                p.then(flushCallbacks);
                if (isIOS) {
                  setTimeout(noop);
                }
              };
            } else {
              microTimerFunc = macroTimerFunc;
            }
            function withMacroTask(fn) {
              return (
                fn._withTask ||
                (fn._withTask = function () {
                  useMacroTask = true;
                  var res = fn.apply(null, arguments);
                  useMacroTask = false;
                  return res;
                })
              );
            }
            function nextTick(cb, ctx) {
              var _resolve;
              callbacks.push(function () {
                if (cb) {
                  try {
                    cb.call(ctx);
                  } catch (e) {
                    handleError(e, ctx, "nextTick");
                  }
                } else if (_resolve) {
                  _resolve(ctx);
                }
              });
              if (!pending) {
                pending = true;
                if (useMacroTask) {
                  macroTimerFunc();
                } else {
                  microTimerFunc();
                }
              }
              if (!cb && typeof Promise !== "undefined") {
                return new Promise(function (resolve) {
                  _resolve = resolve;
                });
              }
            }
            var mark;
            var measure;
            {
              var perf = inBrowser && window.performance;
              if (
                perf &&
                perf.mark &&
                perf.measure &&
                perf.clearMarks &&
                perf.clearMeasures
              ) {
                mark = function (tag) {
                  return perf.mark(tag);
                };
                measure = function (name, startTag, endTag) {
                  perf.measure(name, startTag, endTag);
                  perf.clearMarks(startTag);
                  perf.clearMarks(endTag);
                  perf.clearMeasures(name);
                };
              }
            }
            var initProxy;
            {
              var allowedGlobals = makeMap(
                "Infinity,undefined,NaN,isFinite,isNaN," +
                  "parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent," +
                  "Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl," +
                  "require"
              );
              var warnNonPresent = function (target, key) {
                warn(
                  'Property or method "' +
                    key +
                    '" is not defined on the instance but ' +
                    "referenced during render. Make sure that this property is reactive, " +
                    "either in the data option, or for class-based components, by " +
                    "initializing the property. " +
                    "See: https://vuejs.org/v2/guide/reactivity.html#Declaring-Reactive-Properties.",
                  target
                );
              };
              var hasProxy = typeof Proxy !== "undefined" && isNative(Proxy);
              if (hasProxy) {
                var isBuiltInModifier = makeMap(
                  "stop,prevent,self,ctrl,shift,alt,meta,exact"
                );
                config.keyCodes = new Proxy(config.keyCodes, {
                  set: function set(target, key, value) {
                    if (isBuiltInModifier(key)) {
                      warn(
                        "Avoid overwriting built-in modifier in config.keyCodes: ." +
                          key
                      );
                      return false;
                    } else {
                      target[key] = value;
                      return true;
                    }
                  },
                });
              }
              var hasHandler = {
                has: function has(target, key) {
                  var has = key in target;
                  var isAllowed = allowedGlobals(key) || key.charAt(0) === "_";
                  if (!has && !isAllowed) {
                    warnNonPresent(target, key);
                  }
                  return has || !isAllowed;
                },
              };
              var getHandler = {
                get: function get(target, key) {
                  if (typeof key === "string" && !(key in target)) {
                    warnNonPresent(target, key);
                  }
                  return target[key];
                },
              };
              initProxy = function initProxy(vm) {
                if (hasProxy) {
                  var options = vm.$options;
                  var handlers =
                    options.render && options.render._withStripped
                      ? getHandler
                      : hasHandler;
                  vm._renderProxy = new Proxy(vm, handlers);
                } else {
                  vm._renderProxy = vm;
                }
              };
            }
            var seenObjects = new _Set();
            function traverse(val) {
              _traverse(val, seenObjects);
              seenObjects.clear();
            }
            function _traverse(val, seen) {
              var i, keys;
              var isA = Array.isArray(val);
              if (
                (!isA && !isObject(val)) ||
                Object.isFrozen(val) ||
                val instanceof VNode
              ) {
                return;
              }
              if (val.__ob__) {
                var depId = val.__ob__.dep.id;
                if (seen.has(depId)) {
                  return;
                }
                seen.add(depId);
              }
              if (isA) {
                i = val.length;
                while (i--) {
                  _traverse(val[i], seen);
                }
              } else {
                keys = Object.keys(val);
                i = keys.length;
                while (i--) {
                  _traverse(val[keys[i]], seen);
                }
              }
            }
            var normalizeEvent = cached(function (name) {
              var passive = name.charAt(0) === "&";
              name = passive ? name.slice(1) : name;
              var once$$1 = name.charAt(0) === "~";
              name = once$$1 ? name.slice(1) : name;
              var capture = name.charAt(0) === "!";
              name = capture ? name.slice(1) : name;
              return {
                name: name,
                once: once$$1,
                capture: capture,
                passive: passive,
              };
            });
            function createFnInvoker(fns) {
              function invoker() {
                var arguments$1 = arguments;
                var fns = invoker.fns;
                if (Array.isArray(fns)) {
                  var cloned = fns.slice();
                  for (var i = 0; i < cloned.length; i++) {
                    cloned[i].apply(null, arguments$1);
                  }
                } else {
                  return fns.apply(null, arguments);
                }
              }
              invoker.fns = fns;
              return invoker;
            }
            function updateListeners(on, oldOn, add, remove$$1, vm) {
              var name, def, cur, old, event;
              for (name in on) {
                def = cur = on[name];
                old = oldOn[name];
                event = normalizeEvent(name);
                if (isUndef(cur)) {
                  "development" !== "production" &&
                    warn(
                      'Invalid handler for event "' +
                        event.name +
                        '": got ' +
                        String(cur),
                      vm
                    );
                } else if (isUndef(old)) {
                  if (isUndef(cur.fns)) {
                    cur = on[name] = createFnInvoker(cur);
                  }
                  add(
                    event.name,
                    cur,
                    event.once,
                    event.capture,
                    event.passive,
                    event.params
                  );
                } else if (cur !== old) {
                  old.fns = cur;
                  on[name] = old;
                }
              }
              for (name in oldOn) {
                if (isUndef(on[name])) {
                  event = normalizeEvent(name);
                  remove$$1(event.name, oldOn[name], event.capture);
                }
              }
            }
            function mergeVNodeHook(def, hookKey, hook) {
              if (def instanceof VNode) {
                def = def.data.hook || (def.data.hook = {});
              }
              var invoker;
              var oldHook = def[hookKey];
              function wrappedHook() {
                hook.apply(this, arguments);
                remove(invoker.fns, wrappedHook);
              }
              if (isUndef(oldHook)) {
                invoker = createFnInvoker([wrappedHook]);
              } else {
                if (isDef(oldHook.fns) && isTrue(oldHook.merged)) {
                  invoker = oldHook;
                  invoker.fns.push(wrappedHook);
                } else {
                  invoker = createFnInvoker([oldHook, wrappedHook]);
                }
              }
              invoker.merged = true;
              def[hookKey] = invoker;
            }
            function extractPropsFromVNodeData(data, Ctor, tag) {
              var propOptions = Ctor.options.props;
              if (isUndef(propOptions)) {
                return;
              }
              var res = {};
              var attrs = data.attrs;
              var props = data.props;
              if (isDef(attrs) || isDef(props)) {
                for (var key in propOptions) {
                  var altKey = hyphenate(key);
                  {
                    var keyInLowerCase = key.toLowerCase();
                    if (
                      key !== keyInLowerCase &&
                      attrs &&
                      hasOwn(attrs, keyInLowerCase)
                    ) {
                      tip(
                        'Prop "' +
                          keyInLowerCase +
                          '" is passed to component ' +
                          formatComponentName(tag || Ctor) +
                          ", but the declared prop name is" +
                          ' "' +
                          key +
                          '". ' +
                          "Note that HTML attributes are case-insensitive and camelCased " +
                          "props need to use their kebab-case equivalents when using in-DOM " +
                          'templates. You should probably use "' +
                          altKey +
                          '" instead of "' +
                          key +
                          '".'
                      );
                    }
                  }
                  checkProp(res, props, key, altKey, true) ||
                    checkProp(res, attrs, key, altKey, false);
                }
              }
              return res;
            }
            function checkProp(res, hash, key, altKey, preserve) {
              if (isDef(hash)) {
                if (hasOwn(hash, key)) {
                  res[key] = hash[key];
                  if (!preserve) {
                    delete hash[key];
                  }
                  return true;
                } else if (hasOwn(hash, altKey)) {
                  res[key] = hash[altKey];
                  if (!preserve) {
                    delete hash[altKey];
                  }
                  return true;
                }
              }
              return false;
            }
            function simpleNormalizeChildren(children) {
              for (var i = 0; i < children.length; i++) {
                if (Array.isArray(children[i])) {
                  return Array.prototype.concat.apply([], children);
                }
              }
              return children;
            }
            function normalizeChildren(children) {
              return isPrimitive(children)
                ? [createTextVNode(children)]
                : Array.isArray(children)
                ? normalizeArrayChildren(children)
                : undefined;
            }
            function isTextNode(node) {
              return isDef(node) && isDef(node.text) && isFalse(node.isComment);
            }
            function normalizeArrayChildren(children, nestedIndex) {
              var res = [];
              var i, c, lastIndex, last;
              for (i = 0; i < children.length; i++) {
                c = children[i];
                if (isUndef(c) || typeof c === "boolean") {
                  continue;
                }
                lastIndex = res.length - 1;
                last = res[lastIndex];
                if (Array.isArray(c)) {
                  if (c.length > 0) {
                    c = normalizeArrayChildren(
                      c,
                      (nestedIndex || "") + "_" + i
                    );
                    if (isTextNode(c[0]) && isTextNode(last)) {
                      res[lastIndex] = createTextVNode(last.text + c[0].text);
                      c.shift();
                    }
                    res.push.apply(res, c);
                  }
                } else if (isPrimitive(c)) {
                  if (isTextNode(last)) {
                    res[lastIndex] = createTextVNode(last.text + c);
                  } else if (c !== "") {
                    res.push(createTextVNode(c));
                  }
                } else {
                  if (isTextNode(c) && isTextNode(last)) {
                    res[lastIndex] = createTextVNode(last.text + c.text);
                  } else {
                    if (
                      isTrue(children._isVList) &&
                      isDef(c.tag) &&
                      isUndef(c.key) &&
                      isDef(nestedIndex)
                    ) {
                      c.key = "__vlist" + nestedIndex + "_" + i + "__";
                    }
                    res.push(c);
                  }
                }
              }
              return res;
            }
            function ensureCtor(comp, base) {
              if (
                comp.__esModule ||
                (hasSymbol && comp[Symbol.toStringTag] === "Module")
              ) {
                comp = comp.default;
              }
              return isObject(comp) ? base.extend(comp) : comp;
            }
            function createAsyncPlaceholder(
              factory,
              data,
              context,
              children,
              tag
            ) {
              var node = createEmptyVNode();
              node.asyncFactory = factory;
              node.asyncMeta = {
                data: data,
                context: context,
                children: children,
                tag: tag,
              };
              return node;
            }
            function resolveAsyncComponent(factory, baseCtor, context) {
              if (isTrue(factory.error) && isDef(factory.errorComp)) {
                return factory.errorComp;
              }
              if (isDef(factory.resolved)) {
                return factory.resolved;
              }
              if (isTrue(factory.loading) && isDef(factory.loadingComp)) {
                return factory.loadingComp;
              }
              if (isDef(factory.contexts)) {
                factory.contexts.push(context);
              } else {
                var contexts = (factory.contexts = [context]);
                var sync = true;
                var forceRender = function () {
                  for (var i = 0, l = contexts.length; i < l; i++) {
                    contexts[i].$forceUpdate();
                  }
                };
                var resolve = once(function (res) {
                  factory.resolved = ensureCtor(res, baseCtor);
                  if (!sync) {
                    forceRender();
                  }
                });
                var reject = once(function (reason) {
                  "development" !== "production" &&
                    warn(
                      "Failed to resolve async component: " +
                        String(factory) +
                        (reason ? "\nReason: " + reason : "")
                    );
                  if (isDef(factory.errorComp)) {
                    factory.error = true;
                    forceRender();
                  }
                });
                var res = factory(resolve, reject);
                if (isObject(res)) {
                  if (typeof res.then === "function") {
                    if (isUndef(factory.resolved)) {
                      res.then(resolve, reject);
                    }
                  } else if (
                    isDef(res.component) &&
                    typeof res.component.then === "function"
                  ) {
                    res.component.then(resolve, reject);
                    if (isDef(res.error)) {
                      factory.errorComp = ensureCtor(res.error, baseCtor);
                    }
                    if (isDef(res.loading)) {
                      factory.loadingComp = ensureCtor(res.loading, baseCtor);
                      if (res.delay === 0) {
                        factory.loading = true;
                      } else {
                        setTimeout(function () {
                          if (
                            isUndef(factory.resolved) &&
                            isUndef(factory.error)
                          ) {
                            factory.loading = true;
                            forceRender();
                          }
                        }, res.delay || 200);
                      }
                    }
                    if (isDef(res.timeout)) {
                      setTimeout(function () {
                        if (isUndef(factory.resolved)) {
                          reject("timeout (" + res.timeout + "ms)");
                        }
                      }, res.timeout);
                    }
                  }
                }
                sync = false;
                return factory.loading ? factory.loadingComp : factory.resolved;
              }
            }
            function isAsyncPlaceholder(node) {
              return node.isComment && node.asyncFactory;
            }
            function getFirstComponentChild(children) {
              if (Array.isArray(children)) {
                for (var i = 0; i < children.length; i++) {
                  var c = children[i];
                  if (
                    isDef(c) &&
                    (isDef(c.componentOptions) || isAsyncPlaceholder(c))
                  ) {
                    return c;
                  }
                }
              }
            }
            function initEvents(vm) {
              vm._events = Object.create(null);
              vm._hasHookEvent = false;
              var listeners = vm.$options._parentListeners;
              if (listeners) {
                updateComponentListeners(vm, listeners);
              }
            }
            var target;
            function add(event, fn, once) {
              if (once) {
                target.$once(event, fn);
              } else {
                target.$on(event, fn);
              }
            }
            function remove$1(event, fn) {
              target.$off(event, fn);
            }
            function updateComponentListeners(vm, listeners, oldListeners) {
              target = vm;
              updateListeners(listeners, oldListeners || {}, add, remove$1, vm);
              target = undefined;
            }
            function eventsMixin(Vue) {
              var hookRE = /^hook:/;
              Vue.prototype.$on = function (event, fn) {
                var this$1 = this;
                var vm = this;
                if (Array.isArray(event)) {
                  for (var i = 0, l = event.length; i < l; i++) {
                    this$1.$on(event[i], fn);
                  }
                } else {
                  (vm._events[event] || (vm._events[event] = [])).push(fn);
                  if (hookRE.test(event)) {
                    vm._hasHookEvent = true;
                  }
                }
                return vm;
              };
              Vue.prototype.$once = function (event, fn) {
                var vm = this;
                function on() {
                  vm.$off(event, on);
                  fn.apply(vm, arguments);
                }
                on.fn = fn;
                vm.$on(event, on);
                return vm;
              };
              Vue.prototype.$off = function (event, fn) {
                var this$1 = this;
                var vm = this;
                if (!arguments.length) {
                  vm._events = Object.create(null);
                  return vm;
                }
                if (Array.isArray(event)) {
                  for (var i = 0, l = event.length; i < l; i++) {
                    this$1.$off(event[i], fn);
                  }
                  return vm;
                }
                var cbs = vm._events[event];
                if (!cbs) {
                  return vm;
                }
                if (!fn) {
                  vm._events[event] = null;
                  return vm;
                }
                if (fn) {
                  var cb;
                  var i$1 = cbs.length;
                  while (i$1--) {
                    cb = cbs[i$1];
                    if (cb === fn || cb.fn === fn) {
                      cbs.splice(i$1, 1);
                      break;
                    }
                  }
                }
                return vm;
              };
              Vue.prototype.$emit = function (event) {
                var vm = this;
                {
                  var lowerCaseEvent = event.toLowerCase();
                  if (lowerCaseEvent !== event && vm._events[lowerCaseEvent]) {
                    tip(
                      'Event "' +
                        lowerCaseEvent +
                        '" is emitted in component ' +
                        formatComponentName(vm) +
                        ' but the handler is registered for "' +
                        event +
                        '". ' +
                        "Note that HTML attributes are case-insensitive and you cannot use " +
                        "v-on to listen to camelCase events when using in-DOM templates. " +
                        'You should probably use "' +
                        hyphenate(event) +
                        '" instead of "' +
                        event +
                        '".'
                    );
                  }
                }
                var cbs = vm._events[event];
                if (cbs) {
                  cbs = cbs.length > 1 ? toArray(cbs) : cbs;
                  var args = toArray(arguments, 1);
                  for (var i = 0, l = cbs.length; i < l; i++) {
                    try {
                      cbs[i].apply(vm, args);
                    } catch (e) {
                      handleError(e, vm, 'event handler for "' + event + '"');
                    }
                  }
                }
                return vm;
              };
            }
            function resolveSlots(children, context) {
              var slots = {};
              if (!children) {
                return slots;
              }
              for (var i = 0, l = children.length; i < l; i++) {
                var child = children[i];
                var data = child.data;
                if (data && data.attrs && data.attrs.slot) {
                  delete data.attrs.slot;
                }
                if (
                  (child.context === context || child.fnContext === context) &&
                  data &&
                  data.slot != null
                ) {
                  var name = data.slot;
                  var slot = slots[name] || (slots[name] = []);
                  if (child.tag === "template") {
                    slot.push.apply(slot, child.children || []);
                  } else {
                    slot.push(child);
                  }
                } else {
                  (slots.default || (slots.default = [])).push(child);
                }
              }
              for (var name$1 in slots) {
                if (slots[name$1].every(isWhitespace)) {
                  delete slots[name$1];
                }
              }
              return slots;
            }
            function isWhitespace(node) {
              return (
                (node.isComment && !node.asyncFactory) || node.text === " "
              );
            }
            function resolveScopedSlots(fns, res) {
              res = res || {};
              for (var i = 0; i < fns.length; i++) {
                if (Array.isArray(fns[i])) {
                  resolveScopedSlots(fns[i], res);
                } else {
                  res[fns[i].key] = fns[i].fn;
                }
              }
              return res;
            }
            var activeInstance = null;
            var isUpdatingChildComponent = false;
            function initLifecycle(vm) {
              var options = vm.$options;
              var parent = options.parent;
              if (parent && !options.abstract) {
                while (parent.$options.abstract && parent.$parent) {
                  parent = parent.$parent;
                }
                parent.$children.push(vm);
              }
              vm.$parent = parent;
              vm.$root = parent ? parent.$root : vm;
              vm.$children = [];
              vm.$refs = {};
              vm._watcher = null;
              vm._inactive = null;
              vm._directInactive = false;
              vm._isMounted = false;
              vm._isDestroyed = false;
              vm._isBeingDestroyed = false;
            }
            function lifecycleMixin(Vue) {
              Vue.prototype._update = function (vnode, hydrating) {
                var vm = this;
                if (vm._isMounted) {
                  callHook(vm, "beforeUpdate");
                }
                var prevEl = vm.$el;
                var prevVnode = vm._vnode;
                var prevActiveInstance = activeInstance;
                activeInstance = vm;
                vm._vnode = vnode;
                if (!prevVnode) {
                  vm.$el = vm.__patch__(
                    vm.$el,
                    vnode,
                    hydrating,
                    false,
                    vm.$options._parentElm,
                    vm.$options._refElm
                  );
                  vm.$options._parentElm = vm.$options._refElm = null;
                } else {
                  vm.$el = vm.__patch__(prevVnode, vnode);
                }
                activeInstance = prevActiveInstance;
                if (prevEl) {
                  prevEl.__vue__ = null;
                }
                if (vm.$el) {
                  vm.$el.__vue__ = vm;
                }
                if (
                  vm.$vnode &&
                  vm.$parent &&
                  vm.$vnode === vm.$parent._vnode
                ) {
                  vm.$parent.$el = vm.$el;
                }
              };
              Vue.prototype.$forceUpdate = function () {
                var vm = this;
                if (vm._watcher) {
                  vm._watcher.update();
                }
              };
              Vue.prototype.$destroy = function () {
                var vm = this;
                if (vm._isBeingDestroyed) {
                  return;
                }
                callHook(vm, "beforeDestroy");
                vm._isBeingDestroyed = true;
                var parent = vm.$parent;
                if (
                  parent &&
                  !parent._isBeingDestroyed &&
                  !vm.$options.abstract
                ) {
                  remove(parent.$children, vm);
                }
                if (vm._watcher) {
                  vm._watcher.teardown();
                }
                var i = vm._watchers.length;
                while (i--) {
                  vm._watchers[i].teardown();
                }
                if (vm._data.__ob__) {
                  vm._data.__ob__.vmCount--;
                }
                vm._isDestroyed = true;
                vm.__patch__(vm._vnode, null);
                callHook(vm, "destroyed");
                vm.$off();
                if (vm.$el) {
                  vm.$el.__vue__ = null;
                }
                if (vm.$vnode) {
                  vm.$vnode.parent = null;
                }
              };
            }
            function mountComponent(vm, el, hydrating) {
              vm.$el = el;
              if (!vm.$options.render) {
                vm.$options.render = createEmptyVNode;
                {
                  if (
                    (vm.$options.template &&
                      vm.$options.template.charAt(0) !== "#") ||
                    vm.$options.el ||
                    el
                  ) {
                    warn(
                      "You are using the runtime-only build of Vue where the template " +
                        "compiler is not available. Either pre-compile the templates into " +
                        "render functions, or use the compiler-included build.",
                      vm
                    );
                  } else {
                    warn(
                      "Failed to mount component: template or render function not defined.",
                      vm
                    );
                  }
                }
              }
              callHook(vm, "beforeMount");
              var updateComponent;
              if (
                "development" !== "production" &&
                config.performance &&
                mark
              ) {
                updateComponent = function () {
                  var name = vm._name;
                  var id = vm._uid;
                  var startTag = "vue-perf-start:" + id;
                  var endTag = "vue-perf-end:" + id;
                  mark(startTag);
                  var vnode = vm._render();
                  mark(endTag);
                  measure("vue " + name + " render", startTag, endTag);
                  mark(startTag);
                  vm._update(vnode, hydrating);
                  mark(endTag);
                  measure("vue " + name + " patch", startTag, endTag);
                };
              } else {
                updateComponent = function () {
                  vm._update(vm._render(), hydrating);
                };
              }
              new Watcher(vm, updateComponent, noop, null, true);
              hydrating = false;
              if (vm.$vnode == null) {
                vm._isMounted = true;
                callHook(vm, "mounted");
              }
              return vm;
            }
            function updateChildComponent(
              vm,
              propsData,
              listeners,
              parentVnode,
              renderChildren
            ) {
              {
                isUpdatingChildComponent = true;
              }
              var hasChildren = !!(
                renderChildren ||
                vm.$options._renderChildren ||
                parentVnode.data.scopedSlots ||
                vm.$scopedSlots !== emptyObject
              );
              vm.$options._parentVnode = parentVnode;
              vm.$vnode = parentVnode;
              if (vm._vnode) {
                vm._vnode.parent = parentVnode;
              }
              vm.$options._renderChildren = renderChildren;
              vm.$attrs = parentVnode.data.attrs || emptyObject;
              vm.$listeners = listeners || emptyObject;
              if (propsData && vm.$options.props) {
                toggleObserving(false);
                var props = vm._props;
                var propKeys = vm.$options._propKeys || [];
                for (var i = 0; i < propKeys.length; i++) {
                  var key = propKeys[i];
                  var propOptions = vm.$options.props;
                  props[key] = validateProp(key, propOptions, propsData, vm);
                }
                toggleObserving(true);
                vm.$options.propsData = propsData;
              }
              listeners = listeners || emptyObject;
              var oldListeners = vm.$options._parentListeners;
              vm.$options._parentListeners = listeners;
              updateComponentListeners(vm, listeners, oldListeners);
              if (hasChildren) {
                vm.$slots = resolveSlots(renderChildren, parentVnode.context);
                vm.$forceUpdate();
              }
              {
                isUpdatingChildComponent = false;
              }
            }
            function isInInactiveTree(vm) {
              while (vm && (vm = vm.$parent)) {
                if (vm._inactive) {
                  return true;
                }
              }
              return false;
            }
            function activateChildComponent(vm, direct) {
              if (direct) {
                vm._directInactive = false;
                if (isInInactiveTree(vm)) {
                  return;
                }
              } else if (vm._directInactive) {
                return;
              }
              if (vm._inactive || vm._inactive === null) {
                vm._inactive = false;
                for (var i = 0; i < vm.$children.length; i++) {
                  activateChildComponent(vm.$children[i]);
                }
                callHook(vm, "activated");
              }
            }
            function deactivateChildComponent(vm, direct) {
              if (direct) {
                vm._directInactive = true;
                if (isInInactiveTree(vm)) {
                  return;
                }
              }
              if (!vm._inactive) {
                vm._inactive = true;
                for (var i = 0; i < vm.$children.length; i++) {
                  deactivateChildComponent(vm.$children[i]);
                }
                callHook(vm, "deactivated");
              }
            }
            function callHook(vm, hook) {
              pushTarget();
              var handlers = vm.$options[hook];
              if (handlers) {
                for (var i = 0, j = handlers.length; i < j; i++) {
                  try {
                    handlers[i].call(vm);
                  } catch (e) {
                    handleError(e, vm, hook + " hook");
                  }
                }
              }
              if (vm._hasHookEvent) {
                vm.$emit("hook:" + hook);
              }
              popTarget();
            }
            var MAX_UPDATE_COUNT = 100;
            var queue = [];
            var activatedChildren = [];
            var has = {};
            var circular = {};
            var waiting = false;
            var flushing = false;
            var index = 0;
            function resetSchedulerState() {
              index = queue.length = activatedChildren.length = 0;
              has = {};
              {
                circular = {};
              }
              waiting = flushing = false;
            }
            function flushSchedulerQueue() {
              flushing = true;
              var watcher, id;
              queue.sort(function (a, b) {
                return a.id - b.id;
              });
              for (index = 0; index < queue.length; index++) {
                watcher = queue[index];
                id = watcher.id;
                has[id] = null;
                watcher.run();
                if ("development" !== "production" && has[id] != null) {
                  circular[id] = (circular[id] || 0) + 1;
                  if (circular[id] > MAX_UPDATE_COUNT) {
                    warn(
                      "You may have an infinite update loop " +
                        (watcher.user
                          ? 'in watcher with expression "' +
                            watcher.expression +
                            '"'
                          : "in a component render function."),
                      watcher.vm
                    );
                    break;
                  }
                }
              }
              var activatedQueue = activatedChildren.slice();
              var updatedQueue = queue.slice();
              resetSchedulerState();
              callActivatedHooks(activatedQueue);
              callUpdatedHooks(updatedQueue);
              if (devtools && config.devtools) {
                devtools.emit("flush");
              }
            }
            function callUpdatedHooks(queue) {
              var i = queue.length;
              while (i--) {
                var watcher = queue[i];
                var vm = watcher.vm;
                if (vm._watcher === watcher && vm._isMounted) {
                  callHook(vm, "updated");
                }
              }
            }
            function queueActivatedComponent(vm) {
              vm._inactive = false;
              activatedChildren.push(vm);
            }
            function callActivatedHooks(queue) {
              for (var i = 0; i < queue.length; i++) {
                queue[i]._inactive = true;
                activateChildComponent(queue[i], true);
              }
            }
            function queueWatcher(watcher) {
              var id = watcher.id;
              if (has[id] == null) {
                has[id] = true;
                if (!flushing) {
                  queue.push(watcher);
                } else {
                  var i = queue.length - 1;
                  while (i > index && queue[i].id > watcher.id) {
                    i--;
                  }
                  queue.splice(i + 1, 0, watcher);
                }
                if (!waiting) {
                  waiting = true;
                  nextTick(flushSchedulerQueue);
                }
              }
            }
            var uid$1 = 0;
            var Watcher = function Watcher(
              vm,
              expOrFn,
              cb,
              options,
              isRenderWatcher
            ) {
              this.vm = vm;
              if (isRenderWatcher) {
                vm._watcher = this;
              }
              vm._watchers.push(this);
              if (options) {
                this.deep = !!options.deep;
                this.user = !!options.user;
                this.lazy = !!options.lazy;
                this.sync = !!options.sync;
              } else {
                this.deep = this.user = this.lazy = this.sync = false;
              }
              this.cb = cb;
              this.id = ++uid$1;
              this.active = true;
              this.dirty = this.lazy;
              this.deps = [];
              this.newDeps = [];
              this.depIds = new _Set();
              this.newDepIds = new _Set();
              this.expression = expOrFn.toString();
              if (typeof expOrFn === "function") {
                this.getter = expOrFn;
              } else {
                this.getter = parsePath(expOrFn);
                if (!this.getter) {
                  this.getter = function () {};
                  "development" !== "production" &&
                    warn(
                      'Failed watching path: "' +
                        expOrFn +
                        '" ' +
                        "Watcher only accepts simple dot-delimited paths. " +
                        "For full control, use a function instead.",
                      vm
                    );
                }
              }
              this.value = this.lazy ? undefined : this.get();
            };
            Watcher.prototype.get = function get() {
              pushTarget(this);
              var value;
              var vm = this.vm;
              try {
                value = this.getter.call(vm, vm);
              } catch (e) {
                if (this.user) {
                  handleError(
                    e,
                    vm,
                    'getter for watcher "' + this.expression + '"'
                  );
                } else {
                  throw e;
                }
              } finally {
                if (this.deep) {
                  traverse(value);
                }
                popTarget();
                this.cleanupDeps();
              }
              return value;
            };
            Watcher.prototype.addDep = function addDep(dep) {
              var id = dep.id;
              if (!this.newDepIds.has(id)) {
                this.newDepIds.add(id);
                this.newDeps.push(dep);
                if (!this.depIds.has(id)) {
                  dep.addSub(this);
                }
              }
            };
            Watcher.prototype.cleanupDeps = function cleanupDeps() {
              var this$1 = this;
              var i = this.deps.length;
              while (i--) {
                var dep = this$1.deps[i];
                if (!this$1.newDepIds.has(dep.id)) {
                  dep.removeSub(this$1);
                }
              }
              var tmp = this.depIds;
              this.depIds = this.newDepIds;
              this.newDepIds = tmp;
              this.newDepIds.clear();
              tmp = this.deps;
              this.deps = this.newDeps;
              this.newDeps = tmp;
              this.newDeps.length = 0;
            };
            Watcher.prototype.update = function update() {
              if (this.lazy) {
                this.dirty = true;
              } else if (this.sync) {
                this.run();
              } else {
                queueWatcher(this);
              }
            };
            Watcher.prototype.run = function run() {
              if (this.active) {
                var value = this.get();
                if (value !== this.value || isObject(value) || this.deep) {
                  var oldValue = this.value;
                  this.value = value;
                  if (this.user) {
                    try {
                      this.cb.call(this.vm, value, oldValue);
                    } catch (e) {
                      handleError(
                        e,
                        this.vm,
                        'callback for watcher "' + this.expression + '"'
                      );
                    }
                  } else {
                    this.cb.call(this.vm, value, oldValue);
                  }
                }
              }
            };
            Watcher.prototype.evaluate = function evaluate() {
              this.value = this.get();
              this.dirty = false;
            };
            Watcher.prototype.depend = function depend() {
              var this$1 = this;
              var i = this.deps.length;
              while (i--) {
                this$1.deps[i].depend();
              }
            };
            Watcher.prototype.teardown = function teardown() {
              var this$1 = this;
              if (this.active) {
                if (!this.vm._isBeingDestroyed) {
                  remove(this.vm._watchers, this);
                }
                var i = this.deps.length;
                while (i--) {
                  this$1.deps[i].removeSub(this$1);
                }
                this.active = false;
              }
            };
            var sharedPropertyDefinition = {
              enumerable: true,
              configurable: true,
              get: noop,
              set: noop,
            };
            function proxy(target, sourceKey, key) {
              sharedPropertyDefinition.get = function proxyGetter() {
                return this[sourceKey][key];
              };
              sharedPropertyDefinition.set = function proxySetter(val) {
                this[sourceKey][key] = val;
              };
              Object.defineProperty(target, key, sharedPropertyDefinition);
            }
            function initState(vm) {
              vm._watchers = [];
              var opts = vm.$options;
              if (opts.props) {
                initProps(vm, opts.props);
              }
              if (opts.methods) {
                initMethods(vm, opts.methods);
              }
              if (opts.data) {
                initData(vm);
              } else {
                observe((vm._data = {}), true);
              }
              if (opts.computed) {
                initComputed(vm, opts.computed);
              }
              if (opts.watch && opts.watch !== nativeWatch) {
                initWatch(vm, opts.watch);
              }
            }
            function initProps(vm, propsOptions) {
              var propsData = vm.$options.propsData || {};
              var props = (vm._props = {});
              var keys = (vm.$options._propKeys = []);
              var isRoot = !vm.$parent;
              if (!isRoot) {
                toggleObserving(false);
              }
              var loop = function (key) {
                keys.push(key);
                var value = validateProp(key, propsOptions, propsData, vm);
                {
                  var hyphenatedKey = hyphenate(key);
                  if (
                    isReservedAttribute(hyphenatedKey) ||
                    config.isReservedAttr(hyphenatedKey)
                  ) {
                    warn(
                      '"' +
                        hyphenatedKey +
                        '" is a reserved attribute and cannot be used as component prop.',
                      vm
                    );
                  }
                  defineReactive(props, key, value, function () {
                    if (vm.$parent && !isUpdatingChildComponent) {
                      warn(
                        "Avoid mutating a prop directly since the value will be " +
                          "overwritten whenever the parent component re-renders. " +
                          "Instead, use a data or computed property based on the prop's " +
                          'value. Prop being mutated: "' +
                          key +
                          '"',
                        vm
                      );
                    }
                  });
                }
                if (!(key in vm)) {
                  proxy(vm, "_props", key);
                }
              };
              for (var key in propsOptions) loop(key);
              toggleObserving(true);
            }
            function initData(vm) {
              var data = vm.$options.data;
              data = vm._data =
                typeof data === "function" ? getData(data, vm) : data || {};
              if (!isPlainObject(data)) {
                data = {};
                "development" !== "production" &&
                  warn(
                    "data functions should return an object:\n" +
                      "https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function",
                    vm
                  );
              }
              var keys = Object.keys(data);
              var props = vm.$options.props;
              var methods = vm.$options.methods;
              var i = keys.length;
              while (i--) {
                var key = keys[i];
                {
                  if (methods && hasOwn(methods, key)) {
                    warn(
                      'Method "' +
                        key +
                        '" has already been defined as a data property.',
                      vm
                    );
                  }
                }
                if (props && hasOwn(props, key)) {
                  "development" !== "production" &&
                    warn(
                      'The data property "' +
                        key +
                        '" is already declared as a prop. ' +
                        "Use prop default value instead.",
                      vm
                    );
                } else if (!isReserved(key)) {
                  proxy(vm, "_data", key);
                }
              }
              observe(data, true);
            }
            function getData(data, vm) {
              pushTarget();
              try {
                return data.call(vm, vm);
              } catch (e) {
                handleError(e, vm, "data()");
                return {};
              } finally {
                popTarget();
              }
            }
            var computedWatcherOptions = { lazy: true };
            function initComputed(vm, computed) {
              var watchers = (vm._computedWatchers = Object.create(null));
              var isSSR = isServerRendering();
              for (var key in computed) {
                var userDef = computed[key];
                var getter =
                  typeof userDef === "function" ? userDef : userDef.get;
                if ("development" !== "production" && getter == null) {
                  warn(
                    'Getter is missing for computed property "' + key + '".',
                    vm
                  );
                }
                if (!isSSR) {
                  watchers[key] = new Watcher(
                    vm,
                    getter || noop,
                    noop,
                    computedWatcherOptions
                  );
                }
                if (!(key in vm)) {
                  defineComputed(vm, key, userDef);
                } else {
                  if (key in vm.$data) {
                    warn(
                      'The computed property "' +
                        key +
                        '" is already defined in data.',
                      vm
                    );
                  } else if (vm.$options.props && key in vm.$options.props) {
                    warn(
                      'The computed property "' +
                        key +
                        '" is already defined as a prop.',
                      vm
                    );
                  }
                }
              }
            }
            function defineComputed(target, key, userDef) {
              var shouldCache = !isServerRendering();
              if (typeof userDef === "function") {
                sharedPropertyDefinition.get = shouldCache
                  ? createComputedGetter(key)
                  : userDef;
                sharedPropertyDefinition.set = noop;
              } else {
                sharedPropertyDefinition.get = userDef.get
                  ? shouldCache && userDef.cache !== false
                    ? createComputedGetter(key)
                    : userDef.get
                  : noop;
                sharedPropertyDefinition.set = userDef.set ? userDef.set : noop;
              }
              if (
                "development" !== "production" &&
                sharedPropertyDefinition.set === noop
              ) {
                sharedPropertyDefinition.set = function () {
                  warn(
                    'Computed property "' +
                      key +
                      '" was assigned to but it has no setter.',
                    this
                  );
                };
              }
              Object.defineProperty(target, key, sharedPropertyDefinition);
            }
            function createComputedGetter(key) {
              return function computedGetter() {
                var watcher =
                  this._computedWatchers && this._computedWatchers[key];
                if (watcher) {
                  if (watcher.dirty) {
                    watcher.evaluate();
                  }
                  if (Dep.target) {
                    watcher.depend();
                  }
                  return watcher.value;
                }
              };
            }
            function initMethods(vm, methods) {
              var props = vm.$options.props;
              for (var key in methods) {
                {
                  if (methods[key] == null) {
                    warn(
                      'Method "' +
                        key +
                        '" has an undefined value in the component definition. ' +
                        "Did you reference the function correctly?",
                      vm
                    );
                  }
                  if (props && hasOwn(props, key)) {
                    warn(
                      'Method "' +
                        key +
                        '" has already been defined as a prop.',
                      vm
                    );
                  }
                  if (key in vm && isReserved(key)) {
                    warn(
                      'Method "' +
                        key +
                        '" conflicts with an existing Vue instance method. ' +
                        "Avoid defining component methods that start with _ or $."
                    );
                  }
                }
                vm[key] = methods[key] == null ? noop : bind(methods[key], vm);
              }
            }
            function initWatch(vm, watch) {
              for (var key in watch) {
                var handler = watch[key];
                if (Array.isArray(handler)) {
                  for (var i = 0; i < handler.length; i++) {
                    createWatcher(vm, key, handler[i]);
                  }
                } else {
                  createWatcher(vm, key, handler);
                }
              }
            }
            function createWatcher(vm, expOrFn, handler, options) {
              if (isPlainObject(handler)) {
                options = handler;
                handler = handler.handler;
              }
              if (typeof handler === "string") {
                handler = vm[handler];
              }
              return vm.$watch(expOrFn, handler, options);
            }
            function stateMixin(Vue) {
              var dataDef = {};
              dataDef.get = function () {
                return this._data;
              };
              var propsDef = {};
              propsDef.get = function () {
                return this._props;
              };
              {
                dataDef.set = function (newData) {
                  warn(
                    "Avoid replacing instance root $data. " +
                      "Use nested data properties instead.",
                    this
                  );
                };
                propsDef.set = function () {
                  warn("$props is readonly.", this);
                };
              }
              Object.defineProperty(Vue.prototype, "$data", dataDef);
              Object.defineProperty(Vue.prototype, "$props", propsDef);
              Vue.prototype.$set = set;
              Vue.prototype.$delete = del;
              Vue.prototype.$watch = function (expOrFn, cb, options) {
                var vm = this;
                if (isPlainObject(cb)) {
                  return createWatcher(vm, expOrFn, cb, options);
                }
                options = options || {};
                options.user = true;
                var watcher = new Watcher(vm, expOrFn, cb, options);
                if (options.immediate) {
                  cb.call(vm, watcher.value);
                }
                return function unwatchFn() {
                  watcher.teardown();
                };
              };
            }
            function initProvide(vm) {
              var provide = vm.$options.provide;
              if (provide) {
                vm._provided =
                  typeof provide === "function" ? provide.call(vm) : provide;
              }
            }
            function initInjections(vm) {
              var result = resolveInject(vm.$options.inject, vm);
              if (result) {
                toggleObserving(false);
                Object.keys(result).forEach(function (key) {
                  {
                    defineReactive(vm, key, result[key], function () {
                      warn(
                        "Avoid mutating an injected value directly since the changes will be " +
                          "overwritten whenever the provided component re-renders. " +
                          'injection being mutated: "' +
                          key +
                          '"',
                        vm
                      );
                    });
                  }
                });
                toggleObserving(true);
              }
            }
            function resolveInject(inject, vm) {
              if (inject) {
                var result = Object.create(null);
                var keys = hasSymbol
                  ? Reflect.ownKeys(inject).filter(function (key) {
                      return Object.getOwnPropertyDescriptor(
                        inject,
                        key
                      ).enumerable;
                    })
                  : Object.keys(inject);
                for (var i = 0; i < keys.length; i++) {
                  var key = keys[i];
                  var provideKey = inject[key].from;
                  var source = vm;
                  while (source) {
                    if (
                      source._provided &&
                      hasOwn(source._provided, provideKey)
                    ) {
                      result[key] = source._provided[provideKey];
                      break;
                    }
                    source = source.$parent;
                  }
                  if (!source) {
                    if ("default" in inject[key]) {
                      var provideDefault = inject[key].default;
                      result[key] =
                        typeof provideDefault === "function"
                          ? provideDefault.call(vm)
                          : provideDefault;
                    } else {
                      warn('Injection "' + key + '" not found', vm);
                    }
                  }
                }
                return result;
              }
            }
            function renderList(val, render) {
              var ret, i, l, keys, key;
              if (Array.isArray(val) || typeof val === "string") {
                ret = new Array(val.length);
                for (i = 0, l = val.length; i < l; i++) {
                  ret[i] = render(val[i], i);
                }
              } else if (typeof val === "number") {
                ret = new Array(val);
                for (i = 0; i < val; i++) {
                  ret[i] = render(i + 1, i);
                }
              } else if (isObject(val)) {
                keys = Object.keys(val);
                ret = new Array(keys.length);
                for (i = 0, l = keys.length; i < l; i++) {
                  key = keys[i];
                  ret[i] = render(val[key], key, i);
                }
              }
              if (isDef(ret)) {
                ret._isVList = true;
              }
              return ret;
            }
            function renderSlot(name, fallback, props, bindObject) {
              var scopedSlotFn = this.$scopedSlots[name];
              var nodes;
              if (scopedSlotFn) {
                props = props || {};
                if (bindObject) {
                  if ("development" !== "production" && !isObject(bindObject)) {
                    warn(
                      "slot v-bind without argument expects an Object",
                      this
                    );
                  }
                  props = extend(extend({}, bindObject), props);
                }
                nodes = scopedSlotFn(props) || fallback;
              } else {
                var slotNodes = this.$slots[name];
                if (slotNodes) {
                  if ("development" !== "production" && slotNodes._rendered) {
                    warn(
                      'Duplicate presence of slot "' +
                        name +
                        '" found in the same render tree ' +
                        "- this will likely cause render errors.",
                      this
                    );
                  }
                  slotNodes._rendered = true;
                }
                nodes = slotNodes || fallback;
              }
              var target = props && props.slot;
              if (target) {
                return this.$createElement("template", { slot: target }, nodes);
              } else {
                return nodes;
              }
            }
            function resolveFilter(id) {
              return (
                resolveAsset(this.$options, "filters", id, true) || identity
              );
            }
            function isKeyNotMatch(expect, actual) {
              if (Array.isArray(expect)) {
                return expect.indexOf(actual) === -1;
              } else {
                return expect !== actual;
              }
            }
            function checkKeyCodes(
              eventKeyCode,
              key,
              builtInKeyCode,
              eventKeyName,
              builtInKeyName
            ) {
              var mappedKeyCode = config.keyCodes[key] || builtInKeyCode;
              if (builtInKeyName && eventKeyName && !config.keyCodes[key]) {
                return isKeyNotMatch(builtInKeyName, eventKeyName);
              } else if (mappedKeyCode) {
                return isKeyNotMatch(mappedKeyCode, eventKeyCode);
              } else if (eventKeyName) {
                return hyphenate(eventKeyName) !== key;
              }
            }
            function bindObjectProps(data, tag, value, asProp, isSync) {
              if (value) {
                if (!isObject(value)) {
                  "development" !== "production" &&
                    warn(
                      "v-bind without argument expects an Object or Array value",
                      this
                    );
                } else {
                  if (Array.isArray(value)) {
                    value = toObject(value);
                  }
                  var hash;
                  var loop = function (key) {
                    if (
                      key === "class" ||
                      key === "style" ||
                      isReservedAttribute(key)
                    ) {
                      hash = data;
                    } else {
                      var type = data.attrs && data.attrs.type;
                      hash =
                        asProp || config.mustUseProp(tag, type, key)
                          ? data.domProps || (data.domProps = {})
                          : data.attrs || (data.attrs = {});
                    }
                    if (!(key in hash)) {
                      hash[key] = value[key];
                      if (isSync) {
                        var on = data.on || (data.on = {});
                        on["update:" + key] = function ($event) {
                          value[key] = $event;
                        };
                      }
                    }
                  };
                  for (var key in value) loop(key);
                }
              }
              return data;
            }
            function renderStatic(index, isInFor) {
              var cached = this._staticTrees || (this._staticTrees = []);
              var tree = cached[index];
              if (tree && !isInFor) {
                return tree;
              }
              tree = cached[index] = this.$options.staticRenderFns[index].call(
                this._renderProxy,
                null,
                this
              );
              markStatic(tree, "__static__" + index, false);
              return tree;
            }
            function markOnce(tree, index, key) {
              markStatic(
                tree,
                "__once__" + index + (key ? "_" + key : ""),
                true
              );
              return tree;
            }
            function markStatic(tree, key, isOnce) {
              if (Array.isArray(tree)) {
                for (var i = 0; i < tree.length; i++) {
                  if (tree[i] && typeof tree[i] !== "string") {
                    markStaticNode(tree[i], key + "_" + i, isOnce);
                  }
                }
              } else {
                markStaticNode(tree, key, isOnce);
              }
            }
            function markStaticNode(node, key, isOnce) {
              node.isStatic = true;
              node.key = key;
              node.isOnce = isOnce;
            }
            function bindObjectListeners(data, value) {
              if (value) {
                if (!isPlainObject(value)) {
                  "development" !== "production" &&
                    warn("v-on without argument expects an Object value", this);
                } else {
                  var on = (data.on = data.on ? extend({}, data.on) : {});
                  for (var key in value) {
                    var existing = on[key];
                    var ours = value[key];
                    on[key] = existing ? [].concat(existing, ours) : ours;
                  }
                }
              }
              return data;
            }
            function installRenderHelpers(target) {
              target._o = markOnce;
              target._n = toNumber;
              target._s = toString;
              target._l = renderList;
              target._t = renderSlot;
              target._q = looseEqual;
              target._i = looseIndexOf;
              target._m = renderStatic;
              target._f = resolveFilter;
              target._k = checkKeyCodes;
              target._b = bindObjectProps;
              target._v = createTextVNode;
              target._e = createEmptyVNode;
              target._u = resolveScopedSlots;
              target._g = bindObjectListeners;
            }
            function FunctionalRenderContext(
              data,
              props,
              children,
              parent,
              Ctor
            ) {
              var options = Ctor.options;
              var contextVm;
              if (hasOwn(parent, "_uid")) {
                contextVm = Object.create(parent);
                contextVm._original = parent;
              } else {
                contextVm = parent;
                parent = parent._original;
              }
              var isCompiled = isTrue(options._compiled);
              var needNormalization = !isCompiled;
              this.data = data;
              this.props = props;
              this.children = children;
              this.parent = parent;
              this.listeners = data.on || emptyObject;
              this.injections = resolveInject(options.inject, parent);
              this.slots = function () {
                return resolveSlots(children, parent);
              };
              if (isCompiled) {
                this.$options = options;
                this.$slots = this.slots();
                this.$scopedSlots = data.scopedSlots || emptyObject;
              }
              if (options._scopeId) {
                this._c = function (a, b, c, d) {
                  var vnode = createElement(
                    contextVm,
                    a,
                    b,
                    c,
                    d,
                    needNormalization
                  );
                  if (vnode && !Array.isArray(vnode)) {
                    vnode.fnScopeId = options._scopeId;
                    vnode.fnContext = parent;
                  }
                  return vnode;
                };
              } else {
                this._c = function (a, b, c, d) {
                  return createElement(
                    contextVm,
                    a,
                    b,
                    c,
                    d,
                    needNormalization
                  );
                };
              }
            }
            installRenderHelpers(FunctionalRenderContext.prototype);
            function createFunctionalComponent(
              Ctor,
              propsData,
              data,
              contextVm,
              children
            ) {
              var options = Ctor.options;
              var props = {};
              var propOptions = options.props;
              if (isDef(propOptions)) {
                for (var key in propOptions) {
                  props[key] = validateProp(
                    key,
                    propOptions,
                    propsData || emptyObject
                  );
                }
              } else {
                if (isDef(data.attrs)) {
                  mergeProps(props, data.attrs);
                }
                if (isDef(data.props)) {
                  mergeProps(props, data.props);
                }
              }
              var renderContext = new FunctionalRenderContext(
                data,
                props,
                children,
                contextVm,
                Ctor
              );
              var vnode = options.render.call(
                null,
                renderContext._c,
                renderContext
              );
              if (vnode instanceof VNode) {
                return cloneAndMarkFunctionalResult(
                  vnode,
                  data,
                  renderContext.parent,
                  options
                );
              } else if (Array.isArray(vnode)) {
                var vnodes = normalizeChildren(vnode) || [];
                var res = new Array(vnodes.length);
                for (var i = 0; i < vnodes.length; i++) {
                  res[i] = cloneAndMarkFunctionalResult(
                    vnodes[i],
                    data,
                    renderContext.parent,
                    options
                  );
                }
                return res;
              }
            }
            function cloneAndMarkFunctionalResult(
              vnode,
              data,
              contextVm,
              options
            ) {
              var clone = cloneVNode(vnode);
              clone.fnContext = contextVm;
              clone.fnOptions = options;
              if (data.slot) {
                (clone.data || (clone.data = {})).slot = data.slot;
              }
              return clone;
            }
            function mergeProps(to, from) {
              for (var key in from) {
                to[camelize(key)] = from[key];
              }
            }
            var componentVNodeHooks = {
              init: function init(vnode, hydrating, parentElm, refElm) {
                if (
                  vnode.componentInstance &&
                  !vnode.componentInstance._isDestroyed &&
                  vnode.data.keepAlive
                ) {
                  var mountedNode = vnode;
                  componentVNodeHooks.prepatch(mountedNode, mountedNode);
                } else {
                  var child = (vnode.componentInstance =
                    createComponentInstanceForVnode(
                      vnode,
                      activeInstance,
                      parentElm,
                      refElm
                    ));
                  child.$mount(hydrating ? vnode.elm : undefined, hydrating);
                }
              },
              prepatch: function prepatch(oldVnode, vnode) {
                var options = vnode.componentOptions;
                var child = (vnode.componentInstance =
                  oldVnode.componentInstance);
                updateChildComponent(
                  child,
                  options.propsData,
                  options.listeners,
                  vnode,
                  options.children
                );
              },
              insert: function insert(vnode) {
                var context = vnode.context;
                var componentInstance = vnode.componentInstance;
                if (!componentInstance._isMounted) {
                  componentInstance._isMounted = true;
                  callHook(componentInstance, "mounted");
                }
                if (vnode.data.keepAlive) {
                  if (context._isMounted) {
                    queueActivatedComponent(componentInstance);
                  } else {
                    activateChildComponent(componentInstance, true);
                  }
                }
              },
              destroy: function destroy(vnode) {
                var componentInstance = vnode.componentInstance;
                if (!componentInstance._isDestroyed) {
                  if (!vnode.data.keepAlive) {
                    componentInstance.$destroy();
                  } else {
                    deactivateChildComponent(componentInstance, true);
                  }
                }
              },
            };
            var hooksToMerge = Object.keys(componentVNodeHooks);
            function createComponent(Ctor, data, context, children, tag) {
              if (isUndef(Ctor)) {
                return;
              }
              var baseCtor = context.$options._base;
              if (isObject(Ctor)) {
                Ctor = baseCtor.extend(Ctor);
              }
              if (typeof Ctor !== "function") {
                {
                  warn(
                    "Invalid Component definition: " + String(Ctor),
                    context
                  );
                }
                return;
              }
              var asyncFactory;
              if (isUndef(Ctor.cid)) {
                asyncFactory = Ctor;
                Ctor = resolveAsyncComponent(asyncFactory, baseCtor, context);
                if (Ctor === undefined) {
                  return createAsyncPlaceholder(
                    asyncFactory,
                    data,
                    context,
                    children,
                    tag
                  );
                }
              }
              data = data || {};
              resolveConstructorOptions(Ctor);
              if (isDef(data.model)) {
                transformModel(Ctor.options, data);
              }
              var propsData = extractPropsFromVNodeData(data, Ctor, tag);
              if (isTrue(Ctor.options.functional)) {
                return createFunctionalComponent(
                  Ctor,
                  propsData,
                  data,
                  context,
                  children
                );
              }
              var listeners = data.on;
              data.on = data.nativeOn;
              if (isTrue(Ctor.options.abstract)) {
                var slot = data.slot;
                data = {};
                if (slot) {
                  data.slot = slot;
                }
              }
              installComponentHooks(data);
              var name = Ctor.options.name || tag;
              var vnode = new VNode(
                "vue-component-" + Ctor.cid + (name ? "-" + name : ""),
                data,
                undefined,
                undefined,
                undefined,
                context,
                {
                  Ctor: Ctor,
                  propsData: propsData,
                  listeners: listeners,
                  tag: tag,
                  children: children,
                },
                asyncFactory
              );
              return vnode;
            }
            function createComponentInstanceForVnode(
              vnode,
              parent,
              parentElm,
              refElm
            ) {
              var options = {
                _isComponent: true,
                parent: parent,
                _parentVnode: vnode,
                _parentElm: parentElm || null,
                _refElm: refElm || null,
              };
              var inlineTemplate = vnode.data.inlineTemplate;
              if (isDef(inlineTemplate)) {
                options.render = inlineTemplate.render;
                options.staticRenderFns = inlineTemplate.staticRenderFns;
              }
              return new vnode.componentOptions.Ctor(options);
            }
            function installComponentHooks(data) {
              var hooks = data.hook || (data.hook = {});
              for (var i = 0; i < hooksToMerge.length; i++) {
                var key = hooksToMerge[i];
                hooks[key] = componentVNodeHooks[key];
              }
            }
            function transformModel(options, data) {
              var prop = (options.model && options.model.prop) || "value";
              var event = (options.model && options.model.event) || "input";
              (data.props || (data.props = {}))[prop] = data.model.value;
              var on = data.on || (data.on = {});
              if (isDef(on[event])) {
                on[event] = [data.model.callback].concat(on[event]);
              } else {
                on[event] = data.model.callback;
              }
            }
            var SIMPLE_NORMALIZE = 1;
            var ALWAYS_NORMALIZE = 2;
            function createElement(
              context,
              tag,
              data,
              children,
              normalizationType,
              alwaysNormalize
            ) {
              if (Array.isArray(data) || isPrimitive(data)) {
                normalizationType = children;
                children = data;
                data = undefined;
              }
              if (isTrue(alwaysNormalize)) {
                normalizationType = ALWAYS_NORMALIZE;
              }
              return _createElement(
                context,
                tag,
                data,
                children,
                normalizationType
              );
            }
            function _createElement(
              context,
              tag,
              data,
              children,
              normalizationType
            ) {
              if (isDef(data) && isDef(data.__ob__)) {
                "development" !== "production" &&
                  warn(
                    "Avoid using observed data object as vnode data: " +
                      JSON.stringify(data) +
                      "\n" +
                      "Always create fresh vnode data objects in each render!",
                    context
                  );
                return createEmptyVNode();
              }
              if (isDef(data) && isDef(data.is)) {
                tag = data.is;
              }
              if (!tag) {
                return createEmptyVNode();
              }
              if (
                "development" !== "production" &&
                isDef(data) &&
                isDef(data.key) &&
                !isPrimitive(data.key)
              ) {
                {
                  warn(
                    "Avoid using non-primitive value as key, " +
                      "use string/number value instead.",
                    context
                  );
                }
              }
              if (
                Array.isArray(children) &&
                typeof children[0] === "function"
              ) {
                data = data || {};
                data.scopedSlots = { default: children[0] };
                children.length = 0;
              }
              if (normalizationType === ALWAYS_NORMALIZE) {
                children = normalizeChildren(children);
              } else if (normalizationType === SIMPLE_NORMALIZE) {
                children = simpleNormalizeChildren(children);
              }
              var vnode, ns;
              if (typeof tag === "string") {
                var Ctor;
                ns =
                  (context.$vnode && context.$vnode.ns) ||
                  config.getTagNamespace(tag);
                if (config.isReservedTag(tag)) {
                  vnode = new VNode(
                    config.parsePlatformTagName(tag),
                    data,
                    children,
                    undefined,
                    undefined,
                    context
                  );
                } else if (
                  isDef(
                    (Ctor = resolveAsset(context.$options, "components", tag))
                  )
                ) {
                  vnode = createComponent(Ctor, data, context, children, tag);
                } else {
                  vnode = new VNode(
                    tag,
                    data,
                    children,
                    undefined,
                    undefined,
                    context
                  );
                }
              } else {
                vnode = createComponent(tag, data, context, children);
              }
              if (Array.isArray(vnode)) {
                return vnode;
              } else if (isDef(vnode)) {
                if (isDef(ns)) {
                  applyNS(vnode, ns);
                }
                if (isDef(data)) {
                  registerDeepBindings(data);
                }
                return vnode;
              } else {
                return createEmptyVNode();
              }
            }
            function applyNS(vnode, ns, force) {
              vnode.ns = ns;
              if (vnode.tag === "foreignObject") {
                ns = undefined;
                force = true;
              }
              if (isDef(vnode.children)) {
                for (var i = 0, l = vnode.children.length; i < l; i++) {
                  var child = vnode.children[i];
                  if (
                    isDef(child.tag) &&
                    (isUndef(child.ns) ||
                      (isTrue(force) && child.tag !== "svg"))
                  ) {
                    applyNS(child, ns, force);
                  }
                }
              }
            }
            function registerDeepBindings(data) {
              if (isObject(data.style)) {
                traverse(data.style);
              }
              if (isObject(data.class)) {
                traverse(data.class);
              }
            }
            function initRender(vm) {
              vm._vnode = null;
              vm._staticTrees = null;
              var options = vm.$options;
              var parentVnode = (vm.$vnode = options._parentVnode);
              var renderContext = parentVnode && parentVnode.context;
              vm.$slots = resolveSlots(options._renderChildren, renderContext);
              vm.$scopedSlots = emptyObject;
              vm._c = function (a, b, c, d) {
                return createElement(vm, a, b, c, d, false);
              };
              vm.$createElement = function (a, b, c, d) {
                return createElement(vm, a, b, c, d, true);
              };
              var parentData = parentVnode && parentVnode.data;
              {
                defineReactive(
                  vm,
                  "$attrs",
                  (parentData && parentData.attrs) || emptyObject,
                  function () {
                    !isUpdatingChildComponent &&
                      warn("$attrs is readonly.", vm);
                  },
                  true
                );
                defineReactive(
                  vm,
                  "$listeners",
                  options._parentListeners || emptyObject,
                  function () {
                    !isUpdatingChildComponent &&
                      warn("$listeners is readonly.", vm);
                  },
                  true
                );
              }
            }
            function renderMixin(Vue) {
              installRenderHelpers(Vue.prototype);
              Vue.prototype.$nextTick = function (fn) {
                return nextTick(fn, this);
              };
              Vue.prototype._render = function () {
                var vm = this;
                var ref = vm.$options;
                var render = ref.render;
                var _parentVnode = ref._parentVnode;
                {
                  for (var key in vm.$slots) {
                    vm.$slots[key]._rendered = false;
                  }
                }
                if (_parentVnode) {
                  vm.$scopedSlots =
                    _parentVnode.data.scopedSlots || emptyObject;
                }
                vm.$vnode = _parentVnode;
                var vnode;
                try {
                  vnode = render.call(vm._renderProxy, vm.$createElement);
                } catch (e) {
                  handleError(e, vm, "render");
                  {
                    if (vm.$options.renderError) {
                      try {
                        vnode = vm.$options.renderError.call(
                          vm._renderProxy,
                          vm.$createElement,
                          e
                        );
                      } catch (e) {
                        handleError(e, vm, "renderError");
                        vnode = vm._vnode;
                      }
                    } else {
                      vnode = vm._vnode;
                    }
                  }
                }
                if (!(vnode instanceof VNode)) {
                  if ("development" !== "production" && Array.isArray(vnode)) {
                    warn(
                      "Multiple root nodes returned from render function. Render function " +
                        "should return a single root node.",
                      vm
                    );
                  }
                  vnode = createEmptyVNode();
                }
                vnode.parent = _parentVnode;
                return vnode;
              };
            }
            var uid$3 = 0;
            function initMixin(Vue) {
              Vue.prototype._init = function (options) {
                var vm = this;
                vm._uid = uid$3++;
                var startTag, endTag;
                if (
                  "development" !== "production" &&
                  config.performance &&
                  mark
                ) {
                  startTag = "vue-perf-start:" + vm._uid;
                  endTag = "vue-perf-end:" + vm._uid;
                  mark(startTag);
                }
                vm._isVue = true;
                if (options && options._isComponent) {
                  initInternalComponent(vm, options);
                } else {
                  vm.$options = mergeOptions(
                    resolveConstructorOptions(vm.constructor),
                    options || {},
                    vm
                  );
                }
                {
                  initProxy(vm);
                }
                vm._self = vm;
                initLifecycle(vm);
                initEvents(vm);
                initRender(vm);
                callHook(vm, "beforeCreate");
                initInjections(vm);
                initState(vm);
                initProvide(vm);
                callHook(vm, "created");
                if (
                  "development" !== "production" &&
                  config.performance &&
                  mark
                ) {
                  vm._name = formatComponentName(vm, false);
                  mark(endTag);
                  measure("vue " + vm._name + " init", startTag, endTag);
                }
                if (vm.$options.el) {
                  vm.$mount(vm.$options.el);
                }
              };
            }
            function initInternalComponent(vm, options) {
              var opts = (vm.$options = Object.create(vm.constructor.options));
              var parentVnode = options._parentVnode;
              opts.parent = options.parent;
              opts._parentVnode = parentVnode;
              opts._parentElm = options._parentElm;
              opts._refElm = options._refElm;
              var vnodeComponentOptions = parentVnode.componentOptions;
              opts.propsData = vnodeComponentOptions.propsData;
              opts._parentListeners = vnodeComponentOptions.listeners;
              opts._renderChildren = vnodeComponentOptions.children;
              opts._componentTag = vnodeComponentOptions.tag;
              if (options.render) {
                opts.render = options.render;
                opts.staticRenderFns = options.staticRenderFns;
              }
            }
            function resolveConstructorOptions(Ctor) {
              var options = Ctor.options;
              if (Ctor.super) {
                var superOptions = resolveConstructorOptions(Ctor.super);
                var cachedSuperOptions = Ctor.superOptions;
                if (superOptions !== cachedSuperOptions) {
                  Ctor.superOptions = superOptions;
                  var modifiedOptions = resolveModifiedOptions(Ctor);
                  if (modifiedOptions) {
                    extend(Ctor.extendOptions, modifiedOptions);
                  }
                  options = Ctor.options = mergeOptions(
                    superOptions,
                    Ctor.extendOptions
                  );
                  if (options.name) {
                    options.components[options.name] = Ctor;
                  }
                }
              }
              return options;
            }
            function resolveModifiedOptions(Ctor) {
              var modified;
              var latest = Ctor.options;
              var extended = Ctor.extendOptions;
              var sealed = Ctor.sealedOptions;
              for (var key in latest) {
                if (latest[key] !== sealed[key]) {
                  if (!modified) {
                    modified = {};
                  }
                  modified[key] = dedupe(
                    latest[key],
                    extended[key],
                    sealed[key]
                  );
                }
              }
              return modified;
            }
            function dedupe(latest, extended, sealed) {
              if (Array.isArray(latest)) {
                var res = [];
                sealed = Array.isArray(sealed) ? sealed : [sealed];
                extended = Array.isArray(extended) ? extended : [extended];
                for (var i = 0; i < latest.length; i++) {
                  if (
                    extended.indexOf(latest[i]) >= 0 ||
                    sealed.indexOf(latest[i]) < 0
                  ) {
                    res.push(latest[i]);
                  }
                }
                return res;
              } else {
                return latest;
              }
            }
            function Vue(options) {
              if ("development" !== "production" && !(this instanceof Vue)) {
                warn(
                  "Vue is a constructor and should be called with the `new` keyword"
                );
              }
              this._init(options);
            }
            initMixin(Vue);
            stateMixin(Vue);
            eventsMixin(Vue);
            lifecycleMixin(Vue);
            renderMixin(Vue);
            function initUse(Vue) {
              Vue.use = function (plugin) {
                var installedPlugins =
                  this._installedPlugins || (this._installedPlugins = []);
                if (installedPlugins.indexOf(plugin) > -1) {
                  return this;
                }
                var args = toArray(arguments, 1);
                args.unshift(this);
                if (typeof plugin.install === "function") {
                  plugin.install.apply(plugin, args);
                } else if (typeof plugin === "function") {
                  plugin.apply(null, args);
                }
                installedPlugins.push(plugin);
                return this;
              };
            }
            function initMixin$1(Vue) {
              Vue.mixin = function (mixin) {
                this.options = mergeOptions(this.options, mixin);
                return this;
              };
            }
            function initExtend(Vue) {
              Vue.cid = 0;
              var cid = 1;
              Vue.extend = function (extendOptions) {
                extendOptions = extendOptions || {};
                var Super = this;
                var SuperId = Super.cid;
                var cachedCtors =
                  extendOptions._Ctor || (extendOptions._Ctor = {});
                if (cachedCtors[SuperId]) {
                  return cachedCtors[SuperId];
                }
                var name = extendOptions.name || Super.options.name;
                if ("development" !== "production" && name) {
                  validateComponentName(name);
                }
                var Sub = function VueComponent(options) {
                  this._init(options);
                };
                Sub.prototype = Object.create(Super.prototype);
                Sub.prototype.constructor = Sub;
                Sub.cid = cid++;
                Sub.options = mergeOptions(Super.options, extendOptions);
                Sub["super"] = Super;
                if (Sub.options.props) {
                  initProps$1(Sub);
                }
                if (Sub.options.computed) {
                  initComputed$1(Sub);
                }
                Sub.extend = Super.extend;
                Sub.mixin = Super.mixin;
                Sub.use = Super.use;
                ASSET_TYPES.forEach(function (type) {
                  Sub[type] = Super[type];
                });
                if (name) {
                  Sub.options.components[name] = Sub;
                }
                Sub.superOptions = Super.options;
                Sub.extendOptions = extendOptions;
                Sub.sealedOptions = extend({}, Sub.options);
                cachedCtors[SuperId] = Sub;
                return Sub;
              };
            }
            function initProps$1(Comp) {
              var props = Comp.options.props;
              for (var key in props) {
                proxy(Comp.prototype, "_props", key);
              }
            }
            function initComputed$1(Comp) {
              var computed = Comp.options.computed;
              for (var key in computed) {
                defineComputed(Comp.prototype, key, computed[key]);
              }
            }
            function initAssetRegisters(Vue) {
              ASSET_TYPES.forEach(function (type) {
                Vue[type] = function (id, definition) {
                  if (!definition) {
                    return this.options[type + "s"][id];
                  } else {
                    if (
                      "development" !== "production" &&
                      type === "component"
                    ) {
                      validateComponentName(id);
                    }
                    if (type === "component" && isPlainObject(definition)) {
                      definition.name = definition.name || id;
                      definition = this.options._base.extend(definition);
                    }
                    if (
                      type === "directive" &&
                      typeof definition === "function"
                    ) {
                      definition = { bind: definition, update: definition };
                    }
                    this.options[type + "s"][id] = definition;
                    return definition;
                  }
                };
              });
            }
            function getComponentName(opts) {
              return opts && (opts.Ctor.options.name || opts.tag);
            }
            function matches(pattern, name) {
              if (Array.isArray(pattern)) {
                return pattern.indexOf(name) > -1;
              } else if (typeof pattern === "string") {
                return pattern.split(",").indexOf(name) > -1;
              } else if (isRegExp(pattern)) {
                return pattern.test(name);
              }
              return false;
            }
            function pruneCache(keepAliveInstance, filter) {
              var cache = keepAliveInstance.cache;
              var keys = keepAliveInstance.keys;
              var _vnode = keepAliveInstance._vnode;
              for (var key in cache) {
                var cachedNode = cache[key];
                if (cachedNode) {
                  var name = getComponentName(cachedNode.componentOptions);
                  if (name && !filter(name)) {
                    pruneCacheEntry(cache, key, keys, _vnode);
                  }
                }
              }
            }
            function pruneCacheEntry(cache, key, keys, current) {
              var cached$$1 = cache[key];
              if (cached$$1 && (!current || cached$$1.tag !== current.tag)) {
                cached$$1.componentInstance.$destroy();
              }
              cache[key] = null;
              remove(keys, key);
            }
            var patternTypes = [String, RegExp, Array];
            var KeepAlive = {
              name: "keep-alive",
              abstract: true,
              props: {
                include: patternTypes,
                exclude: patternTypes,
                max: [String, Number],
              },
              created: function created() {
                this.cache = Object.create(null);
                this.keys = [];
              },
              destroyed: function destroyed() {
                var this$1 = this;
                for (var key in this$1.cache) {
                  pruneCacheEntry(this$1.cache, key, this$1.keys);
                }
              },
              mounted: function mounted() {
                var this$1 = this;
                this.$watch("include", function (val) {
                  pruneCache(this$1, function (name) {
                    return matches(val, name);
                  });
                });
                this.$watch("exclude", function (val) {
                  pruneCache(this$1, function (name) {
                    return !matches(val, name);
                  });
                });
              },
              render: function render() {
                var slot = this.$slots.default;
                var vnode = getFirstComponentChild(slot);
                var componentOptions = vnode && vnode.componentOptions;
                if (componentOptions) {
                  var name = getComponentName(componentOptions);
                  var ref = this;
                  var include = ref.include;
                  var exclude = ref.exclude;
                  if (
                    (include && (!name || !matches(include, name))) ||
                    (exclude && name && matches(exclude, name))
                  ) {
                    return vnode;
                  }
                  var ref$1 = this;
                  var cache = ref$1.cache;
                  var keys = ref$1.keys;
                  var key =
                    vnode.key == null
                      ? componentOptions.Ctor.cid +
                        (componentOptions.tag
                          ? "::" + componentOptions.tag
                          : "")
                      : vnode.key;
                  if (cache[key]) {
                    vnode.componentInstance = cache[key].componentInstance;
                    remove(keys, key);
                    keys.push(key);
                  } else {
                    cache[key] = vnode;
                    keys.push(key);
                    if (this.max && keys.length > parseInt(this.max)) {
                      pruneCacheEntry(cache, keys[0], keys, this._vnode);
                    }
                  }
                  vnode.data.keepAlive = true;
                }
                return vnode || (slot && slot[0]);
              },
            };
            var builtInComponents = { KeepAlive: KeepAlive };
            function initGlobalAPI(Vue) {
              var configDef = {};
              configDef.get = function () {
                return config;
              };
              {
                configDef.set = function () {
                  warn(
                    "Do not replace the Vue.config object, set individual fields instead."
                  );
                };
              }
              Object.defineProperty(Vue, "config", configDef);
              Vue.util = {
                warn: warn,
                extend: extend,
                mergeOptions: mergeOptions,
                defineReactive: defineReactive,
              };
              Vue.set = set;
              Vue.delete = del;
              Vue.nextTick = nextTick;
              Vue.options = Object.create(null);
              ASSET_TYPES.forEach(function (type) {
                Vue.options[type + "s"] = Object.create(null);
              });
              Vue.options._base = Vue;
              extend(Vue.options.components, builtInComponents);
              initUse(Vue);
              initMixin$1(Vue);
              initExtend(Vue);
              initAssetRegisters(Vue);
            }
            initGlobalAPI(Vue);
            Object.defineProperty(Vue.prototype, "$isServer", {
              get: isServerRendering,
            });
            Object.defineProperty(Vue.prototype, "$ssrContext", {
              get: function get() {
                return this.$vnode && this.$vnode.ssrContext;
              },
            });
            Object.defineProperty(Vue, "FunctionalRenderContext", {
              value: FunctionalRenderContext,
            });
            Vue.version = "2.5.17";
            var isReservedAttr = makeMap("style,class");
            var acceptValue = makeMap("input,textarea,option,select,progress");
            var mustUseProp = function (tag, type, attr) {
              return (
                (attr === "value" && acceptValue(tag) && type !== "button") ||
                (attr === "selected" && tag === "option") ||
                (attr === "checked" && tag === "input") ||
                (attr === "muted" && tag === "video")
              );
            };
            var isEnumeratedAttr = makeMap(
              "contenteditable,draggable,spellcheck"
            );
            var isBooleanAttr = makeMap(
              "allowfullscreen,async,autofocus,autoplay,checked,compact,controls,declare," +
                "default,defaultchecked,defaultmuted,defaultselected,defer,disabled," +
                "enabled,formnovalidate,hidden,indeterminate,inert,ismap,itemscope,loop,multiple," +
                "muted,nohref,noresize,noshade,novalidate,nowrap,open,pauseonexit,readonly," +
                "required,reversed,scoped,seamless,selected,sortable,translate," +
                "truespeed,typemustmatch,visible"
            );
            var xlinkNS = "http://www.w3.org/1999/xlink";
            var isXlink = function (name) {
              return name.charAt(5) === ":" && name.slice(0, 5) === "xlink";
            };
            var getXlinkProp = function (name) {
              return isXlink(name) ? name.slice(6, name.length) : "";
            };
            var isFalsyAttrValue = function (val) {
              return val == null || val === false;
            };
            function genClassForVnode(vnode) {
              var data = vnode.data;
              var parentNode = vnode;
              var childNode = vnode;
              while (isDef(childNode.componentInstance)) {
                childNode = childNode.componentInstance._vnode;
                if (childNode && childNode.data) {
                  data = mergeClassData(childNode.data, data);
                }
              }
              while (isDef((parentNode = parentNode.parent))) {
                if (parentNode && parentNode.data) {
                  data = mergeClassData(data, parentNode.data);
                }
              }
              return renderClass(data.staticClass, data.class);
            }
            function mergeClassData(child, parent) {
              return {
                staticClass: concat(child.staticClass, parent.staticClass),
                class: isDef(child.class)
                  ? [child.class, parent.class]
                  : parent.class,
              };
            }
            function renderClass(staticClass, dynamicClass) {
              if (isDef(staticClass) || isDef(dynamicClass)) {
                return concat(staticClass, stringifyClass(dynamicClass));
              }
              return "";
            }
            function concat(a, b) {
              return a ? (b ? a + " " + b : a) : b || "";
            }
            function stringifyClass(value) {
              if (Array.isArray(value)) {
                return stringifyArray(value);
              }
              if (isObject(value)) {
                return stringifyObject(value);
              }
              if (typeof value === "string") {
                return value;
              }
              return "";
            }
            function stringifyArray(value) {
              var res = "";
              var stringified;
              for (var i = 0, l = value.length; i < l; i++) {
                if (
                  isDef((stringified = stringifyClass(value[i]))) &&
                  stringified !== ""
                ) {
                  if (res) {
                    res += " ";
                  }
                  res += stringified;
                }
              }
              return res;
            }
            function stringifyObject(value) {
              var res = "";
              for (var key in value) {
                if (value[key]) {
                  if (res) {
                    res += " ";
                  }
                  res += key;
                }
              }
              return res;
            }
            var namespaceMap = {
              svg: "http://www.w3.org/2000/svg",
              math: "http://www.w3.org/1998/Math/MathML",
            };
            var isHTMLTag = makeMap(
              "html,body,base,head,link,meta,style,title," +
                "address,article,aside,footer,header,h1,h2,h3,h4,h5,h6,hgroup,nav,section," +
                "div,dd,dl,dt,figcaption,figure,picture,hr,img,li,main,ol,p,pre,ul," +
                "a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,rtc,ruby," +
                "s,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video," +
                "embed,object,param,source,canvas,script,noscript,del,ins," +
                "caption,col,colgroup,table,thead,tbody,td,th,tr," +
                "button,datalist,fieldset,form,input,label,legend,meter,optgroup,option," +
                "output,progress,select,textarea," +
                "details,dialog,menu,menuitem,summary," +
                "content,element,shadow,template,blockquote,iframe,tfoot"
            );
            var isSVG = makeMap(
              "svg,animate,circle,clippath,cursor,defs,desc,ellipse,filter,font-face," +
                "foreignObject,g,glyph,image,line,marker,mask,missing-glyph,path,pattern," +
                "polygon,polyline,rect,switch,symbol,text,textpath,tspan,use,view",
              true
            );
            var isPreTag = function (tag) {
              return tag === "pre";
            };
            var isReservedTag = function (tag) {
              return isHTMLTag(tag) || isSVG(tag);
            };
            function getTagNamespace(tag) {
              if (isSVG(tag)) {
                return "svg";
              }
              if (tag === "math") {
                return "math";
              }
            }
            var unknownElementCache = Object.create(null);
            function isUnknownElement(tag) {
              if (!inBrowser) {
                return true;
              }
              if (isReservedTag(tag)) {
                return false;
              }
              tag = tag.toLowerCase();
              if (unknownElementCache[tag] != null) {
                return unknownElementCache[tag];
              }
              var el = document.createElement(tag);
              if (tag.indexOf("-") > -1) {
                return (unknownElementCache[tag] =
                  el.constructor === window.HTMLUnknownElement ||
                  el.constructor === window.HTMLElement);
              } else {
                return (unknownElementCache[tag] = /HTMLUnknownElement/.test(
                  el.toString()
                ));
              }
            }
            var isTextInputType = makeMap(
              "text,number,password,search,email,tel,url"
            );
            function query(el) {
              if (typeof el === "string") {
                var selected = document.querySelector(el);
                if (!selected) {
                  "development" !== "production" &&
                    warn("Cannot find element: " + el);
                  return document.createElement("div");
                }
                return selected;
              } else {
                return el;
              }
            }
            function createElement$1(tagName, vnode) {
              var elm = document.createElement(tagName);
              if (tagName !== "select") {
                return elm;
              }
              if (
                vnode.data &&
                vnode.data.attrs &&
                vnode.data.attrs.multiple !== undefined
              ) {
                elm.setAttribute("multiple", "multiple");
              }
              return elm;
            }
            function createElementNS(namespace, tagName) {
              return document.createElementNS(namespaceMap[namespace], tagName);
            }
            function createTextNode(text) {
              return document.createTextNode(text);
            }
            function createComment(text) {
              return document.createComment(text);
            }
            function insertBefore(parentNode, newNode, referenceNode) {
              parentNode.insertBefore(newNode, referenceNode);
            }
            function removeChild(node, child) {
              node.removeChild(child);
            }
            function appendChild(node, child) {
              node.appendChild(child);
            }
            function parentNode(node) {
              return node.parentNode;
            }
            function nextSibling(node) {
              return node.nextSibling;
            }
            function tagName(node) {
              return node.tagName;
            }
            function setTextContent(node, text) {
              node.textContent = text;
            }
            function setStyleScope(node, scopeId) {
              node.setAttribute(scopeId, "");
            }
            var nodeOps = Object.freeze({
              createElement: createElement$1,
              createElementNS: createElementNS,
              createTextNode: createTextNode,
              createComment: createComment,
              insertBefore: insertBefore,
              removeChild: removeChild,
              appendChild: appendChild,
              parentNode: parentNode,
              nextSibling: nextSibling,
              tagName: tagName,
              setTextContent: setTextContent,
              setStyleScope: setStyleScope,
            });
            var ref = {
              create: function create(_, vnode) {
                registerRef(vnode);
              },
              update: function update(oldVnode, vnode) {
                if (oldVnode.data.ref !== vnode.data.ref) {
                  registerRef(oldVnode, true);
                  registerRef(vnode);
                }
              },
              destroy: function destroy(vnode) {
                registerRef(vnode, true);
              },
            };
            function registerRef(vnode, isRemoval) {
              var key = vnode.data.ref;
              if (!isDef(key)) {
                return;
              }
              var vm = vnode.context;
              var ref = vnode.componentInstance || vnode.elm;
              var refs = vm.$refs;
              if (isRemoval) {
                if (Array.isArray(refs[key])) {
                  remove(refs[key], ref);
                } else if (refs[key] === ref) {
                  refs[key] = undefined;
                }
              } else {
                if (vnode.data.refInFor) {
                  if (!Array.isArray(refs[key])) {
                    refs[key] = [ref];
                  } else if (refs[key].indexOf(ref) < 0) {
                    refs[key].push(ref);
                  }
                } else {
                  refs[key] = ref;
                }
              }
            }
            var emptyNode = new VNode("", {}, []);
            var hooks = ["create", "activate", "update", "remove", "destroy"];
            function sameVnode(a, b) {
              return (
                a.key === b.key &&
                ((a.tag === b.tag &&
                  a.isComment === b.isComment &&
                  isDef(a.data) === isDef(b.data) &&
                  sameInputType(a, b)) ||
                  (isTrue(a.isAsyncPlaceholder) &&
                    a.asyncFactory === b.asyncFactory &&
                    isUndef(b.asyncFactory.error)))
              );
            }
            function sameInputType(a, b) {
              if (a.tag !== "input") {
                return true;
              }
              var i;
              var typeA = isDef((i = a.data)) && isDef((i = i.attrs)) && i.type;
              var typeB = isDef((i = b.data)) && isDef((i = i.attrs)) && i.type;
              return (
                typeA === typeB ||
                (isTextInputType(typeA) && isTextInputType(typeB))
              );
            }
            function createKeyToOldIdx(children, beginIdx, endIdx) {
              var i, key;
              var map = {};
              for (i = beginIdx; i <= endIdx; ++i) {
                key = children[i].key;
                if (isDef(key)) {
                  map[key] = i;
                }
              }
              return map;
            }
            function createPatchFunction(backend) {
              var i, j;
              var cbs = {};
              var modules = backend.modules;
              var nodeOps = backend.nodeOps;
              for (i = 0; i < hooks.length; ++i) {
                cbs[hooks[i]] = [];
                for (j = 0; j < modules.length; ++j) {
                  if (isDef(modules[j][hooks[i]])) {
                    cbs[hooks[i]].push(modules[j][hooks[i]]);
                  }
                }
              }
              function emptyNodeAt(elm) {
                return new VNode(
                  nodeOps.tagName(elm).toLowerCase(),
                  {},
                  [],
                  undefined,
                  elm
                );
              }
              function createRmCb(childElm, listeners) {
                function remove() {
                  if (--remove.listeners === 0) {
                    removeNode(childElm);
                  }
                }
                remove.listeners = listeners;
                return remove;
              }
              function removeNode(el) {
                var parent = nodeOps.parentNode(el);
                if (isDef(parent)) {
                  nodeOps.removeChild(parent, el);
                }
              }
              function isUnknownElement$$1(vnode, inVPre) {
                return (
                  !inVPre &&
                  !vnode.ns &&
                  !(
                    config.ignoredElements.length &&
                    config.ignoredElements.some(function (ignore) {
                      return isRegExp(ignore)
                        ? ignore.test(vnode.tag)
                        : ignore === vnode.tag;
                    })
                  ) &&
                  config.isUnknownElement(vnode.tag)
                );
              }
              var creatingElmInVPre = 0;
              function createElm(
                vnode,
                insertedVnodeQueue,
                parentElm,
                refElm,
                nested,
                ownerArray,
                index
              ) {
                if (isDef(vnode.elm) && isDef(ownerArray)) {
                  vnode = ownerArray[index] = cloneVNode(vnode);
                }
                vnode.isRootInsert = !nested;
                if (
                  createComponent(vnode, insertedVnodeQueue, parentElm, refElm)
                ) {
                  return;
                }
                var data = vnode.data;
                var children = vnode.children;
                var tag = vnode.tag;
                if (isDef(tag)) {
                  {
                    if (data && data.pre) {
                      creatingElmInVPre++;
                    }
                    if (isUnknownElement$$1(vnode, creatingElmInVPre)) {
                      warn(
                        "Unknown custom element: <" +
                          tag +
                          "> - did you " +
                          "register the component correctly? For recursive components, " +
                          'make sure to provide the "name" option.',
                        vnode.context
                      );
                    }
                  }
                  vnode.elm = vnode.ns
                    ? nodeOps.createElementNS(vnode.ns, tag)
                    : nodeOps.createElement(tag, vnode);
                  setScope(vnode);
                  {
                    createChildren(vnode, children, insertedVnodeQueue);
                    if (isDef(data)) {
                      invokeCreateHooks(vnode, insertedVnodeQueue);
                    }
                    insert(parentElm, vnode.elm, refElm);
                  }
                  if ("development" !== "production" && data && data.pre) {
                    creatingElmInVPre--;
                  }
                } else if (isTrue(vnode.isComment)) {
                  vnode.elm = nodeOps.createComment(vnode.text);
                  insert(parentElm, vnode.elm, refElm);
                } else {
                  vnode.elm = nodeOps.createTextNode(vnode.text);
                  insert(parentElm, vnode.elm, refElm);
                }
              }
              function createComponent(
                vnode,
                insertedVnodeQueue,
                parentElm,
                refElm
              ) {
                var i = vnode.data;
                if (isDef(i)) {
                  var isReactivated =
                    isDef(vnode.componentInstance) && i.keepAlive;
                  if (isDef((i = i.hook)) && isDef((i = i.init))) {
                    i(vnode, false, parentElm, refElm);
                  }
                  if (isDef(vnode.componentInstance)) {
                    initComponent(vnode, insertedVnodeQueue);
                    if (isTrue(isReactivated)) {
                      reactivateComponent(
                        vnode,
                        insertedVnodeQueue,
                        parentElm,
                        refElm
                      );
                    }
                    return true;
                  }
                }
              }
              function initComponent(vnode, insertedVnodeQueue) {
                if (isDef(vnode.data.pendingInsert)) {
                  insertedVnodeQueue.push.apply(
                    insertedVnodeQueue,
                    vnode.data.pendingInsert
                  );
                  vnode.data.pendingInsert = null;
                }
                vnode.elm = vnode.componentInstance.$el;
                if (isPatchable(vnode)) {
                  invokeCreateHooks(vnode, insertedVnodeQueue);
                  setScope(vnode);
                } else {
                  registerRef(vnode);
                  insertedVnodeQueue.push(vnode);
                }
              }
              function reactivateComponent(
                vnode,
                insertedVnodeQueue,
                parentElm,
                refElm
              ) {
                var i;
                var innerNode = vnode;
                while (innerNode.componentInstance) {
                  innerNode = innerNode.componentInstance._vnode;
                  if (
                    isDef((i = innerNode.data)) &&
                    isDef((i = i.transition))
                  ) {
                    for (i = 0; i < cbs.activate.length; ++i) {
                      cbs.activate[i](emptyNode, innerNode);
                    }
                    insertedVnodeQueue.push(innerNode);
                    break;
                  }
                }
                insert(parentElm, vnode.elm, refElm);
              }
              function insert(parent, elm, ref$$1) {
                if (isDef(parent)) {
                  if (isDef(ref$$1)) {
                    if (ref$$1.parentNode === parent) {
                      nodeOps.insertBefore(parent, elm, ref$$1);
                    }
                  } else {
                    nodeOps.appendChild(parent, elm);
                  }
                }
              }
              function createChildren(vnode, children, insertedVnodeQueue) {
                if (Array.isArray(children)) {
                  {
                    checkDuplicateKeys(children);
                  }
                  for (var i = 0; i < children.length; ++i) {
                    createElm(
                      children[i],
                      insertedVnodeQueue,
                      vnode.elm,
                      null,
                      true,
                      children,
                      i
                    );
                  }
                } else if (isPrimitive(vnode.text)) {
                  nodeOps.appendChild(
                    vnode.elm,
                    nodeOps.createTextNode(String(vnode.text))
                  );
                }
              }
              function isPatchable(vnode) {
                while (vnode.componentInstance) {
                  vnode = vnode.componentInstance._vnode;
                }
                return isDef(vnode.tag);
              }
              function invokeCreateHooks(vnode, insertedVnodeQueue) {
                for (var i$1 = 0; i$1 < cbs.create.length; ++i$1) {
                  cbs.create[i$1](emptyNode, vnode);
                }
                i = vnode.data.hook;
                if (isDef(i)) {
                  if (isDef(i.create)) {
                    i.create(emptyNode, vnode);
                  }
                  if (isDef(i.insert)) {
                    insertedVnodeQueue.push(vnode);
                  }
                }
              }
              function setScope(vnode) {
                var i;
                if (isDef((i = vnode.fnScopeId))) {
                  nodeOps.setStyleScope(vnode.elm, i);
                } else {
                  var ancestor = vnode;
                  while (ancestor) {
                    if (
                      isDef((i = ancestor.context)) &&
                      isDef((i = i.$options._scopeId))
                    ) {
                      nodeOps.setStyleScope(vnode.elm, i);
                    }
                    ancestor = ancestor.parent;
                  }
                }
                if (
                  isDef((i = activeInstance)) &&
                  i !== vnode.context &&
                  i !== vnode.fnContext &&
                  isDef((i = i.$options._scopeId))
                ) {
                  nodeOps.setStyleScope(vnode.elm, i);
                }
              }
              function addVnodes(
                parentElm,
                refElm,
                vnodes,
                startIdx,
                endIdx,
                insertedVnodeQueue
              ) {
                for (; startIdx <= endIdx; ++startIdx) {
                  createElm(
                    vnodes[startIdx],
                    insertedVnodeQueue,
                    parentElm,
                    refElm,
                    false,
                    vnodes,
                    startIdx
                  );
                }
              }
              function invokeDestroyHook(vnode) {
                var i, j;
                var data = vnode.data;
                if (isDef(data)) {
                  if (isDef((i = data.hook)) && isDef((i = i.destroy))) {
                    i(vnode);
                  }
                  for (i = 0; i < cbs.destroy.length; ++i) {
                    cbs.destroy[i](vnode);
                  }
                }
                if (isDef((i = vnode.children))) {
                  for (j = 0; j < vnode.children.length; ++j) {
                    invokeDestroyHook(vnode.children[j]);
                  }
                }
              }
              function removeVnodes(parentElm, vnodes, startIdx, endIdx) {
                for (; startIdx <= endIdx; ++startIdx) {
                  var ch = vnodes[startIdx];
                  if (isDef(ch)) {
                    if (isDef(ch.tag)) {
                      removeAndInvokeRemoveHook(ch);
                      invokeDestroyHook(ch);
                    } else {
                      removeNode(ch.elm);
                    }
                  }
                }
              }
              function removeAndInvokeRemoveHook(vnode, rm) {
                if (isDef(rm) || isDef(vnode.data)) {
                  var i;
                  var listeners = cbs.remove.length + 1;
                  if (isDef(rm)) {
                    rm.listeners += listeners;
                  } else {
                    rm = createRmCb(vnode.elm, listeners);
                  }
                  if (
                    isDef((i = vnode.componentInstance)) &&
                    isDef((i = i._vnode)) &&
                    isDef(i.data)
                  ) {
                    removeAndInvokeRemoveHook(i, rm);
                  }
                  for (i = 0; i < cbs.remove.length; ++i) {
                    cbs.remove[i](vnode, rm);
                  }
                  if (isDef((i = vnode.data.hook)) && isDef((i = i.remove))) {
                    i(vnode, rm);
                  } else {
                    rm();
                  }
                } else {
                  removeNode(vnode.elm);
                }
              }
              function updateChildren(
                parentElm,
                oldCh,
                newCh,
                insertedVnodeQueue,
                removeOnly
              ) {
                var oldStartIdx = 0;
                var newStartIdx = 0;
                var oldEndIdx = oldCh.length - 1;
                var oldStartVnode = oldCh[0];
                var oldEndVnode = oldCh[oldEndIdx];
                var newEndIdx = newCh.length - 1;
                var newStartVnode = newCh[0];
                var newEndVnode = newCh[newEndIdx];
                var oldKeyToIdx, idxInOld, vnodeToMove, refElm;
                var canMove = !removeOnly;
                {
                  checkDuplicateKeys(newCh);
                }
                while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
                  if (isUndef(oldStartVnode)) {
                    oldStartVnode = oldCh[++oldStartIdx];
                  } else if (isUndef(oldEndVnode)) {
                    oldEndVnode = oldCh[--oldEndIdx];
                  } else if (sameVnode(oldStartVnode, newStartVnode)) {
                    patchVnode(
                      oldStartVnode,
                      newStartVnode,
                      insertedVnodeQueue
                    );
                    oldStartVnode = oldCh[++oldStartIdx];
                    newStartVnode = newCh[++newStartIdx];
                  } else if (sameVnode(oldEndVnode, newEndVnode)) {
                    patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue);
                    oldEndVnode = oldCh[--oldEndIdx];
                    newEndVnode = newCh[--newEndIdx];
                  } else if (sameVnode(oldStartVnode, newEndVnode)) {
                    patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue);
                    canMove &&
                      nodeOps.insertBefore(
                        parentElm,
                        oldStartVnode.elm,
                        nodeOps.nextSibling(oldEndVnode.elm)
                      );
                    oldStartVnode = oldCh[++oldStartIdx];
                    newEndVnode = newCh[--newEndIdx];
                  } else if (sameVnode(oldEndVnode, newStartVnode)) {
                    patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue);
                    canMove &&
                      nodeOps.insertBefore(
                        parentElm,
                        oldEndVnode.elm,
                        oldStartVnode.elm
                      );
                    oldEndVnode = oldCh[--oldEndIdx];
                    newStartVnode = newCh[++newStartIdx];
                  } else {
                    if (isUndef(oldKeyToIdx)) {
                      oldKeyToIdx = createKeyToOldIdx(
                        oldCh,
                        oldStartIdx,
                        oldEndIdx
                      );
                    }
                    idxInOld = isDef(newStartVnode.key)
                      ? oldKeyToIdx[newStartVnode.key]
                      : findIdxInOld(
                          newStartVnode,
                          oldCh,
                          oldStartIdx,
                          oldEndIdx
                        );
                    if (isUndef(idxInOld)) {
                      createElm(
                        newStartVnode,
                        insertedVnodeQueue,
                        parentElm,
                        oldStartVnode.elm,
                        false,
                        newCh,
                        newStartIdx
                      );
                    } else {
                      vnodeToMove = oldCh[idxInOld];
                      if (sameVnode(vnodeToMove, newStartVnode)) {
                        patchVnode(
                          vnodeToMove,
                          newStartVnode,
                          insertedVnodeQueue
                        );
                        oldCh[idxInOld] = undefined;
                        canMove &&
                          nodeOps.insertBefore(
                            parentElm,
                            vnodeToMove.elm,
                            oldStartVnode.elm
                          );
                      } else {
                        createElm(
                          newStartVnode,
                          insertedVnodeQueue,
                          parentElm,
                          oldStartVnode.elm,
                          false,
                          newCh,
                          newStartIdx
                        );
                      }
                    }
                    newStartVnode = newCh[++newStartIdx];
                  }
                }
                if (oldStartIdx > oldEndIdx) {
                  refElm = isUndef(newCh[newEndIdx + 1])
                    ? null
                    : newCh[newEndIdx + 1].elm;
                  addVnodes(
                    parentElm,
                    refElm,
                    newCh,
                    newStartIdx,
                    newEndIdx,
                    insertedVnodeQueue
                  );
                } else if (newStartIdx > newEndIdx) {
                  removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx);
                }
              }
              function checkDuplicateKeys(children) {
                var seenKeys = {};
                for (var i = 0; i < children.length; i++) {
                  var vnode = children[i];
                  var key = vnode.key;
                  if (isDef(key)) {
                    if (seenKeys[key]) {
                      warn(
                        "Duplicate keys detected: '" +
                          key +
                          "'. This may cause an update error.",
                        vnode.context
                      );
                    } else {
                      seenKeys[key] = true;
                    }
                  }
                }
              }
              function findIdxInOld(node, oldCh, start, end) {
                for (var i = start; i < end; i++) {
                  var c = oldCh[i];
                  if (isDef(c) && sameVnode(node, c)) {
                    return i;
                  }
                }
              }
              function patchVnode(
                oldVnode,
                vnode,
                insertedVnodeQueue,
                removeOnly
              ) {
                if (oldVnode === vnode) {
                  return;
                }
                var elm = (vnode.elm = oldVnode.elm);
                if (isTrue(oldVnode.isAsyncPlaceholder)) {
                  if (isDef(vnode.asyncFactory.resolved)) {
                    hydrate(oldVnode.elm, vnode, insertedVnodeQueue);
                  } else {
                    vnode.isAsyncPlaceholder = true;
                  }
                  return;
                }
                if (
                  isTrue(vnode.isStatic) &&
                  isTrue(oldVnode.isStatic) &&
                  vnode.key === oldVnode.key &&
                  (isTrue(vnode.isCloned) || isTrue(vnode.isOnce))
                ) {
                  vnode.componentInstance = oldVnode.componentInstance;
                  return;
                }
                var i;
                var data = vnode.data;
                if (
                  isDef(data) &&
                  isDef((i = data.hook)) &&
                  isDef((i = i.prepatch))
                ) {
                  i(oldVnode, vnode);
                }
                var oldCh = oldVnode.children;
                var ch = vnode.children;
                if (isDef(data) && isPatchable(vnode)) {
                  for (i = 0; i < cbs.update.length; ++i) {
                    cbs.update[i](oldVnode, vnode);
                  }
                  if (isDef((i = data.hook)) && isDef((i = i.update))) {
                    i(oldVnode, vnode);
                  }
                }
                if (isUndef(vnode.text)) {
                  if (isDef(oldCh) && isDef(ch)) {
                    if (oldCh !== ch) {
                      updateChildren(
                        elm,
                        oldCh,
                        ch,
                        insertedVnodeQueue,
                        removeOnly
                      );
                    }
                  } else if (isDef(ch)) {
                    if (isDef(oldVnode.text)) {
                      nodeOps.setTextContent(elm, "");
                    }
                    addVnodes(
                      elm,
                      null,
                      ch,
                      0,
                      ch.length - 1,
                      insertedVnodeQueue
                    );
                  } else if (isDef(oldCh)) {
                    removeVnodes(elm, oldCh, 0, oldCh.length - 1);
                  } else if (isDef(oldVnode.text)) {
                    nodeOps.setTextContent(elm, "");
                  }
                } else if (oldVnode.text !== vnode.text) {
                  nodeOps.setTextContent(elm, vnode.text);
                }
                if (isDef(data)) {
                  if (isDef((i = data.hook)) && isDef((i = i.postpatch))) {
                    i(oldVnode, vnode);
                  }
                }
              }
              function invokeInsertHook(vnode, queue, initial) {
                if (isTrue(initial) && isDef(vnode.parent)) {
                  vnode.parent.data.pendingInsert = queue;
                } else {
                  for (var i = 0; i < queue.length; ++i) {
                    queue[i].data.hook.insert(queue[i]);
                  }
                }
              }
              var hydrationBailed = false;
              var isRenderedModule = makeMap(
                "attrs,class,staticClass,staticStyle,key"
              );
              function hydrate(elm, vnode, insertedVnodeQueue, inVPre) {
                var i;
                var tag = vnode.tag;
                var data = vnode.data;
                var children = vnode.children;
                inVPre = inVPre || (data && data.pre);
                vnode.elm = elm;
                if (isTrue(vnode.isComment) && isDef(vnode.asyncFactory)) {
                  vnode.isAsyncPlaceholder = true;
                  return true;
                }
                {
                  if (!assertNodeMatch(elm, vnode, inVPre)) {
                    return false;
                  }
                }
                if (isDef(data)) {
                  if (isDef((i = data.hook)) && isDef((i = i.init))) {
                    i(vnode, true);
                  }
                  if (isDef((i = vnode.componentInstance))) {
                    initComponent(vnode, insertedVnodeQueue);
                    return true;
                  }
                }
                if (isDef(tag)) {
                  if (isDef(children)) {
                    if (!elm.hasChildNodes()) {
                      createChildren(vnode, children, insertedVnodeQueue);
                    } else {
                      if (
                        isDef((i = data)) &&
                        isDef((i = i.domProps)) &&
                        isDef((i = i.innerHTML))
                      ) {
                        if (i !== elm.innerHTML) {
                          if (
                            "development" !== "production" &&
                            typeof console !== "undefined" &&
                            !hydrationBailed
                          ) {
                            hydrationBailed = true;
                            console.warn("Parent: ", elm);
                            console.warn("server innerHTML: ", i);
                            console.warn("client innerHTML: ", elm.innerHTML);
                          }
                          return false;
                        }
                      } else {
                        var childrenMatch = true;
                        var childNode = elm.firstChild;
                        for (var i$1 = 0; i$1 < children.length; i$1++) {
                          if (
                            !childNode ||
                            !hydrate(
                              childNode,
                              children[i$1],
                              insertedVnodeQueue,
                              inVPre
                            )
                          ) {
                            childrenMatch = false;
                            break;
                          }
                          childNode = childNode.nextSibling;
                        }
                        if (!childrenMatch || childNode) {
                          if (
                            "development" !== "production" &&
                            typeof console !== "undefined" &&
                            !hydrationBailed
                          ) {
                            hydrationBailed = true;
                            console.warn("Parent: ", elm);
                            console.warn(
                              "Mismatching childNodes vs. VNodes: ",
                              elm.childNodes,
                              children
                            );
                          }
                          return false;
                        }
                      }
                    }
                  }
                  if (isDef(data)) {
                    var fullInvoke = false;
                    for (var key in data) {
                      if (!isRenderedModule(key)) {
                        fullInvoke = true;
                        invokeCreateHooks(vnode, insertedVnodeQueue);
                        break;
                      }
                    }
                    if (!fullInvoke && data["class"]) {
                      traverse(data["class"]);
                    }
                  }
                } else if (elm.data !== vnode.text) {
                  elm.data = vnode.text;
                }
                return true;
              }
              function assertNodeMatch(node, vnode, inVPre) {
                if (isDef(vnode.tag)) {
                  return (
                    vnode.tag.indexOf("vue-component") === 0 ||
                    (!isUnknownElement$$1(vnode, inVPre) &&
                      vnode.tag.toLowerCase() ===
                        (node.tagName && node.tagName.toLowerCase()))
                  );
                } else {
                  return node.nodeType === (vnode.isComment ? 8 : 3);
                }
              }
              return function patch(
                oldVnode,
                vnode,
                hydrating,
                removeOnly,
                parentElm,
                refElm
              ) {
                if (isUndef(vnode)) {
                  if (isDef(oldVnode)) {
                    invokeDestroyHook(oldVnode);
                  }
                  return;
                }
                var isInitialPatch = false;
                var insertedVnodeQueue = [];
                if (isUndef(oldVnode)) {
                  isInitialPatch = true;
                  createElm(vnode, insertedVnodeQueue, parentElm, refElm);
                } else {
                  var isRealElement = isDef(oldVnode.nodeType);
                  if (!isRealElement && sameVnode(oldVnode, vnode)) {
                    patchVnode(oldVnode, vnode, insertedVnodeQueue, removeOnly);
                  } else {
                    if (isRealElement) {
                      if (
                        oldVnode.nodeType === 1 &&
                        oldVnode.hasAttribute(SSR_ATTR)
                      ) {
                        oldVnode.removeAttribute(SSR_ATTR);
                        hydrating = true;
                      }
                      if (isTrue(hydrating)) {
                        if (hydrate(oldVnode, vnode, insertedVnodeQueue)) {
                          invokeInsertHook(vnode, insertedVnodeQueue, true);
                          return oldVnode;
                        } else {
                          warn(
                            "The client-side rendered virtual DOM tree is not matching " +
                              "server-rendered content. This is likely caused by incorrect " +
                              "HTML markup, for example nesting block-level elements inside " +
                              "<p>, or missing <tbody>. Bailing hydration and performing " +
                              "full client-side render."
                          );
                        }
                      }
                      oldVnode = emptyNodeAt(oldVnode);
                    }
                    var oldElm = oldVnode.elm;
                    var parentElm$1 = nodeOps.parentNode(oldElm);
                    createElm(
                      vnode,
                      insertedVnodeQueue,
                      oldElm._leaveCb ? null : parentElm$1,
                      nodeOps.nextSibling(oldElm)
                    );
                    if (isDef(vnode.parent)) {
                      var ancestor = vnode.parent;
                      var patchable = isPatchable(vnode);
                      while (ancestor) {
                        for (var i = 0; i < cbs.destroy.length; ++i) {
                          cbs.destroy[i](ancestor);
                        }
                        ancestor.elm = vnode.elm;
                        if (patchable) {
                          for (var i$1 = 0; i$1 < cbs.create.length; ++i$1) {
                            cbs.create[i$1](emptyNode, ancestor);
                          }
                          var insert = ancestor.data.hook.insert;
                          if (insert.merged) {
                            for (var i$2 = 1; i$2 < insert.fns.length; i$2++) {
                              insert.fns[i$2]();
                            }
                          }
                        } else {
                          registerRef(ancestor);
                        }
                        ancestor = ancestor.parent;
                      }
                    }
                    if (isDef(parentElm$1)) {
                      removeVnodes(parentElm$1, [oldVnode], 0, 0);
                    } else if (isDef(oldVnode.tag)) {
                      invokeDestroyHook(oldVnode);
                    }
                  }
                }
                invokeInsertHook(vnode, insertedVnodeQueue, isInitialPatch);
                return vnode.elm;
              };
            }
            var directives = {
              create: updateDirectives,
              update: updateDirectives,
              destroy: function unbindDirectives(vnode) {
                updateDirectives(vnode, emptyNode);
              },
            };
            function updateDirectives(oldVnode, vnode) {
              if (oldVnode.data.directives || vnode.data.directives) {
                _update(oldVnode, vnode);
              }
            }
            function _update(oldVnode, vnode) {
              var isCreate = oldVnode === emptyNode;
              var isDestroy = vnode === emptyNode;
              var oldDirs = normalizeDirectives$1(
                oldVnode.data.directives,
                oldVnode.context
              );
              var newDirs = normalizeDirectives$1(
                vnode.data.directives,
                vnode.context
              );
              var dirsWithInsert = [];
              var dirsWithPostpatch = [];
              var key, oldDir, dir;
              for (key in newDirs) {
                oldDir = oldDirs[key];
                dir = newDirs[key];
                if (!oldDir) {
                  callHook$1(dir, "bind", vnode, oldVnode);
                  if (dir.def && dir.def.inserted) {
                    dirsWithInsert.push(dir);
                  }
                } else {
                  dir.oldValue = oldDir.value;
                  callHook$1(dir, "update", vnode, oldVnode);
                  if (dir.def && dir.def.componentUpdated) {
                    dirsWithPostpatch.push(dir);
                  }
                }
              }
              if (dirsWithInsert.length) {
                var callInsert = function () {
                  for (var i = 0; i < dirsWithInsert.length; i++) {
                    callHook$1(dirsWithInsert[i], "inserted", vnode, oldVnode);
                  }
                };
                if (isCreate) {
                  mergeVNodeHook(vnode, "insert", callInsert);
                } else {
                  callInsert();
                }
              }
              if (dirsWithPostpatch.length) {
                mergeVNodeHook(vnode, "postpatch", function () {
                  for (var i = 0; i < dirsWithPostpatch.length; i++) {
                    callHook$1(
                      dirsWithPostpatch[i],
                      "componentUpdated",
                      vnode,
                      oldVnode
                    );
                  }
                });
              }
              if (!isCreate) {
                for (key in oldDirs) {
                  if (!newDirs[key]) {
                    callHook$1(
                      oldDirs[key],
                      "unbind",
                      oldVnode,
                      oldVnode,
                      isDestroy
                    );
                  }
                }
              }
            }
            var emptyModifiers = Object.create(null);
            function normalizeDirectives$1(dirs, vm) {
              var res = Object.create(null);
              if (!dirs) {
                return res;
              }
              var i, dir;
              for (i = 0; i < dirs.length; i++) {
                dir = dirs[i];
                if (!dir.modifiers) {
                  dir.modifiers = emptyModifiers;
                }
                res[getRawDirName(dir)] = dir;
                dir.def = resolveAsset(
                  vm.$options,
                  "directives",
                  dir.name,
                  true
                );
              }
              return res;
            }
            function getRawDirName(dir) {
              return (
                dir.rawName ||
                dir.name + "." + Object.keys(dir.modifiers || {}).join(".")
              );
            }
            function callHook$1(dir, hook, vnode, oldVnode, isDestroy) {
              var fn = dir.def && dir.def[hook];
              if (fn) {
                try {
                  fn(vnode.elm, dir, vnode, oldVnode, isDestroy);
                } catch (e) {
                  handleError(
                    e,
                    vnode.context,
                    "directive " + dir.name + " " + hook + " hook"
                  );
                }
              }
            }
            var baseModules = [ref, directives];
            function updateAttrs(oldVnode, vnode) {
              var opts = vnode.componentOptions;
              if (isDef(opts) && opts.Ctor.options.inheritAttrs === false) {
                return;
              }
              if (isUndef(oldVnode.data.attrs) && isUndef(vnode.data.attrs)) {
                return;
              }
              var key, cur, old;
              var elm = vnode.elm;
              var oldAttrs = oldVnode.data.attrs || {};
              var attrs = vnode.data.attrs || {};
              if (isDef(attrs.__ob__)) {
                attrs = vnode.data.attrs = extend({}, attrs);
              }
              for (key in attrs) {
                cur = attrs[key];
                old = oldAttrs[key];
                if (old !== cur) {
                  setAttr(elm, key, cur);
                }
              }
              if ((isIE || isEdge) && attrs.value !== oldAttrs.value) {
                setAttr(elm, "value", attrs.value);
              }
              for (key in oldAttrs) {
                if (isUndef(attrs[key])) {
                  if (isXlink(key)) {
                    elm.removeAttributeNS(xlinkNS, getXlinkProp(key));
                  } else if (!isEnumeratedAttr(key)) {
                    elm.removeAttribute(key);
                  }
                }
              }
            }
            function setAttr(el, key, value) {
              if (el.tagName.indexOf("-") > -1) {
                baseSetAttr(el, key, value);
              } else if (isBooleanAttr(key)) {
                if (isFalsyAttrValue(value)) {
                  el.removeAttribute(key);
                } else {
                  value =
                    key === "allowfullscreen" && el.tagName === "EMBED"
                      ? "true"
                      : key;
                  el.setAttribute(key, value);
                }
              } else if (isEnumeratedAttr(key)) {
                el.setAttribute(
                  key,
                  isFalsyAttrValue(value) || value === "false"
                    ? "false"
                    : "true"
                );
              } else if (isXlink(key)) {
                if (isFalsyAttrValue(value)) {
                  el.removeAttributeNS(xlinkNS, getXlinkProp(key));
                } else {
                  el.setAttributeNS(xlinkNS, key, value);
                }
              } else {
                baseSetAttr(el, key, value);
              }
            }
            function baseSetAttr(el, key, value) {
              if (isFalsyAttrValue(value)) {
                el.removeAttribute(key);
              } else {
                if (
                  isIE &&
                  !isIE9 &&
                  el.tagName === "TEXTAREA" &&
                  key === "placeholder" &&
                  !el.__ieph
                ) {
                  var blocker = function (e) {
                    e.stopImmediatePropagation();
                    el.removeEventListener("input", blocker);
                  };
                  el.addEventListener("input", blocker);
                  el.__ieph = true;
                }
                el.setAttribute(key, value);
              }
            }
            var attrs = { create: updateAttrs, update: updateAttrs };
            function updateClass(oldVnode, vnode) {
              var el = vnode.elm;
              var data = vnode.data;
              var oldData = oldVnode.data;
              if (
                isUndef(data.staticClass) &&
                isUndef(data.class) &&
                (isUndef(oldData) ||
                  (isUndef(oldData.staticClass) && isUndef(oldData.class)))
              ) {
                return;
              }
              var cls = genClassForVnode(vnode);
              var transitionClass = el._transitionClasses;
              if (isDef(transitionClass)) {
                cls = concat(cls, stringifyClass(transitionClass));
              }
              if (cls !== el._prevClass) {
                el.setAttribute("class", cls);
                el._prevClass = cls;
              }
            }
            var klass = { create: updateClass, update: updateClass };
            var validDivisionCharRE = /[\w).+\-_$\]]/;
            function parseFilters(exp) {
              var inSingle = false;
              var inDouble = false;
              var inTemplateString = false;
              var inRegex = false;
              var curly = 0;
              var square = 0;
              var paren = 0;
              var lastFilterIndex = 0;
              var c, prev, i, expression, filters;
              for (i = 0; i < exp.length; i++) {
                prev = c;
                c = exp.charCodeAt(i);
                if (inSingle) {
                  if (c === 39 && prev !== 92) {
                    inSingle = false;
                  }
                } else if (inDouble) {
                  if (c === 34 && prev !== 92) {
                    inDouble = false;
                  }
                } else if (inTemplateString) {
                  if (c === 96 && prev !== 92) {
                    inTemplateString = false;
                  }
                } else if (inRegex) {
                  if (c === 47 && prev !== 92) {
                    inRegex = false;
                  }
                } else if (
                  c === 124 &&
                  exp.charCodeAt(i + 1) !== 124 &&
                  exp.charCodeAt(i - 1) !== 124 &&
                  !curly &&
                  !square &&
                  !paren
                ) {
                  if (expression === undefined) {
                    lastFilterIndex = i + 1;
                    expression = exp.slice(0, i).trim();
                  } else {
                    pushFilter();
                  }
                } else {
                  switch (c) {
                    case 34:
                      inDouble = true;
                      break;
                    case 39:
                      inSingle = true;
                      break;
                    case 96:
                      inTemplateString = true;
                      break;
                    case 40:
                      paren++;
                      break;
                    case 41:
                      paren--;
                      break;
                    case 91:
                      square++;
                      break;
                    case 93:
                      square--;
                      break;
                    case 123:
                      curly++;
                      break;
                    case 125:
                      curly--;
                      break;
                  }
                  if (c === 47) {
                    var j = i - 1;
                    var p = void 0;
                    for (; j >= 0; j--) {
                      p = exp.charAt(j);
                      if (p !== " ") {
                        break;
                      }
                    }
                    if (!p || !validDivisionCharRE.test(p)) {
                      inRegex = true;
                    }
                  }
                }
              }
              if (expression === undefined) {
                expression = exp.slice(0, i).trim();
              } else if (lastFilterIndex !== 0) {
                pushFilter();
              }
              function pushFilter() {
                (filters || (filters = [])).push(
                  exp.slice(lastFilterIndex, i).trim()
                );
                lastFilterIndex = i + 1;
              }
              if (filters) {
                for (i = 0; i < filters.length; i++) {
                  expression = wrapFilter(expression, filters[i]);
                }
              }
              return expression;
            }
            function wrapFilter(exp, filter) {
              var i = filter.indexOf("(");
              if (i < 0) {
                return '_f("' + filter + '")(' + exp + ")";
              } else {
                var name = filter.slice(0, i);
                var args = filter.slice(i + 1);
                return (
                  '_f("' +
                  name +
                  '")(' +
                  exp +
                  (args !== ")" ? "," + args : args)
                );
              }
            }
            function baseWarn(msg) {
              console.error("[Vue compiler]: " + msg);
            }
            function pluckModuleFunction(modules, key) {
              return modules
                ? modules
                    .map(function (m) {
                      return m[key];
                    })
                    .filter(function (_) {
                      return _;
                    })
                : [];
            }
            function addProp(el, name, value) {
              (el.props || (el.props = [])).push({ name: name, value: value });
              el.plain = false;
            }
            function addAttr(el, name, value) {
              (el.attrs || (el.attrs = [])).push({ name: name, value: value });
              el.plain = false;
            }
            function addRawAttr(el, name, value) {
              el.attrsMap[name] = value;
              el.attrsList.push({ name: name, value: value });
            }
            function addDirective(el, name, rawName, value, arg, modifiers) {
              (el.directives || (el.directives = [])).push({
                name: name,
                rawName: rawName,
                value: value,
                arg: arg,
                modifiers: modifiers,
              });
              el.plain = false;
            }
            function addHandler(el, name, value, modifiers, important, warn) {
              modifiers = modifiers || emptyObject;
              if (
                "development" !== "production" &&
                warn &&
                modifiers.prevent &&
                modifiers.passive
              ) {
                warn(
                  "passive and prevent can't be used together. " +
                    "Passive handler can't prevent default event."
                );
              }
              if (modifiers.capture) {
                delete modifiers.capture;
                name = "!" + name;
              }
              if (modifiers.once) {
                delete modifiers.once;
                name = "~" + name;
              }
              if (modifiers.passive) {
                delete modifiers.passive;
                name = "&" + name;
              }
              if (name === "click") {
                if (modifiers.right) {
                  name = "contextmenu";
                  delete modifiers.right;
                } else if (modifiers.middle) {
                  name = "mouseup";
                }
              }
              var events;
              if (modifiers.native) {
                delete modifiers.native;
                events = el.nativeEvents || (el.nativeEvents = {});
              } else {
                events = el.events || (el.events = {});
              }
              var newHandler = { value: value.trim() };
              if (modifiers !== emptyObject) {
                newHandler.modifiers = modifiers;
              }
              var handlers = events[name];
              if (Array.isArray(handlers)) {
                important
                  ? handlers.unshift(newHandler)
                  : handlers.push(newHandler);
              } else if (handlers) {
                events[name] = important
                  ? [newHandler, handlers]
                  : [handlers, newHandler];
              } else {
                events[name] = newHandler;
              }
              el.plain = false;
            }
            function getBindingAttr(el, name, getStatic) {
              var dynamicValue =
                getAndRemoveAttr(el, ":" + name) ||
                getAndRemoveAttr(el, "v-bind:" + name);
              if (dynamicValue != null) {
                return parseFilters(dynamicValue);
              } else if (getStatic !== false) {
                var staticValue = getAndRemoveAttr(el, name);
                if (staticValue != null) {
                  return JSON.stringify(staticValue);
                }
              }
            }
            function getAndRemoveAttr(el, name, removeFromMap) {
              var val;
              if ((val = el.attrsMap[name]) != null) {
                var list = el.attrsList;
                for (var i = 0, l = list.length; i < l; i++) {
                  if (list[i].name === name) {
                    list.splice(i, 1);
                    break;
                  }
                }
              }
              if (removeFromMap) {
                delete el.attrsMap[name];
              }
              return val;
            }
            function genComponentModel(el, value, modifiers) {
              var ref = modifiers || {};
              var number = ref.number;
              var trim = ref.trim;
              var baseValueExpression = "$$v";
              var valueExpression = baseValueExpression;
              if (trim) {
                valueExpression =
                  "(typeof " +
                  baseValueExpression +
                  " === 'string'" +
                  "? " +
                  baseValueExpression +
                  ".trim()" +
                  ": " +
                  baseValueExpression +
                  ")";
              }
              if (number) {
                valueExpression = "_n(" + valueExpression + ")";
              }
              var assignment = genAssignmentCode(value, valueExpression);
              el.model = {
                value: "(" + value + ")",
                expression: '"' + value + '"',
                callback:
                  "function (" + baseValueExpression + ") {" + assignment + "}",
              };
            }
            function genAssignmentCode(value, assignment) {
              var res = parseModel(value);
              if (res.key === null) {
                return value + "=" + assignment;
              } else {
                return (
                  "$set(" + res.exp + ", " + res.key + ", " + assignment + ")"
                );
              }
            }
            var len;
            var str;
            var chr;
            var index$1;
            var expressionPos;
            var expressionEndPos;
            function parseModel(val) {
              val = val.trim();
              len = val.length;
              if (val.indexOf("[") < 0 || val.lastIndexOf("]") < len - 1) {
                index$1 = val.lastIndexOf(".");
                if (index$1 > -1) {
                  return {
                    exp: val.slice(0, index$1),
                    key: '"' + val.slice(index$1 + 1) + '"',
                  };
                } else {
                  return { exp: val, key: null };
                }
              }
              str = val;
              index$1 = expressionPos = expressionEndPos = 0;
              while (!eof()) {
                chr = next();
                if (isStringStart(chr)) {
                  parseString(chr);
                } else if (chr === 91) {
                  parseBracket(chr);
                }
              }
              return {
                exp: val.slice(0, expressionPos),
                key: val.slice(expressionPos + 1, expressionEndPos),
              };
            }
            function next() {
              return str.charCodeAt(++index$1);
            }
            function eof() {
              return index$1 >= len;
            }
            function isStringStart(chr) {
              return chr === 34 || chr === 39;
            }
            function parseBracket(chr) {
              var inBracket = 1;
              expressionPos = index$1;
              while (!eof()) {
                chr = next();
                if (isStringStart(chr)) {
                  parseString(chr);
                  continue;
                }
                if (chr === 91) {
                  inBracket++;
                }
                if (chr === 93) {
                  inBracket--;
                }
                if (inBracket === 0) {
                  expressionEndPos = index$1;
                  break;
                }
              }
            }
            function parseString(chr) {
              var stringQuote = chr;
              while (!eof()) {
                chr = next();
                if (chr === stringQuote) {
                  break;
                }
              }
            }
            var warn$1;
            var RANGE_TOKEN = "__r";
            var CHECKBOX_RADIO_TOKEN = "__c";
            function model(el, dir, _warn) {
              warn$1 = _warn;
              var value = dir.value;
              var modifiers = dir.modifiers;
              var tag = el.tag;
              var type = el.attrsMap.type;
              {
                if (tag === "input" && type === "file") {
                  warn$1(
                    "<" +
                      el.tag +
                      ' v-model="' +
                      value +
                      '" type="file">:\n' +
                      "File inputs are read only. Use a v-on:change listener instead."
                  );
                }
              }
              if (el.component) {
                genComponentModel(el, value, modifiers);
                return false;
              } else if (tag === "select") {
                genSelect(el, value, modifiers);
              } else if (tag === "input" && type === "checkbox") {
                genCheckboxModel(el, value, modifiers);
              } else if (tag === "input" && type === "radio") {
                genRadioModel(el, value, modifiers);
              } else if (tag === "input" || tag === "textarea") {
                genDefaultModel(el, value, modifiers);
              } else if (!config.isReservedTag(tag)) {
                genComponentModel(el, value, modifiers);
                return false;
              } else {
                warn$1(
                  "<" +
                    el.tag +
                    ' v-model="' +
                    value +
                    '">: ' +
                    "v-model is not supported on this element type. " +
                    "If you are working with contenteditable, it's recommended to " +
                    "wrap a library dedicated for that purpose inside a custom component."
                );
              }
              return true;
            }
            function genCheckboxModel(el, value, modifiers) {
              var number = modifiers && modifiers.number;
              var valueBinding = getBindingAttr(el, "value") || "null";
              var trueValueBinding = getBindingAttr(el, "true-value") || "true";
              var falseValueBinding =
                getBindingAttr(el, "false-value") || "false";
              addProp(
                el,
                "checked",
                "Array.isArray(" +
                  value +
                  ")" +
                  "?_i(" +
                  value +
                  "," +
                  valueBinding +
                  ")>-1" +
                  (trueValueBinding === "true"
                    ? ":(" + value + ")"
                    : ":_q(" + value + "," + trueValueBinding + ")")
              );
              addHandler(
                el,
                "change",
                "var $$a=" +
                  value +
                  "," +
                  "$$el=$event.target," +
                  "$$c=$$el.checked?(" +
                  trueValueBinding +
                  "):(" +
                  falseValueBinding +
                  ");" +
                  "if(Array.isArray($$a)){" +
                  "var $$v=" +
                  (number ? "_n(" + valueBinding + ")" : valueBinding) +
                  "," +
                  "$$i=_i($$a,$$v);" +
                  "if($$el.checked){$$i<0&&(" +
                  genAssignmentCode(value, "$$a.concat([$$v])") +
                  ")}" +
                  "else{$$i>-1&&(" +
                  genAssignmentCode(
                    value,
                    "$$a.slice(0,$$i).concat($$a.slice($$i+1))"
                  ) +
                  ")}" +
                  "}else{" +
                  genAssignmentCode(value, "$$c") +
                  "}",
                null,
                true
              );
            }
            function genRadioModel(el, value, modifiers) {
              var number = modifiers && modifiers.number;
              var valueBinding = getBindingAttr(el, "value") || "null";
              valueBinding = number ? "_n(" + valueBinding + ")" : valueBinding;
              addProp(el, "checked", "_q(" + value + "," + valueBinding + ")");
              addHandler(
                el,
                "change",
                genAssignmentCode(value, valueBinding),
                null,
                true
              );
            }
            function genSelect(el, value, modifiers) {
              var number = modifiers && modifiers.number;
              var selectedVal =
                "Array.prototype.filter" +
                ".call($event.target.options,function(o){return o.selected})" +
                '.map(function(o){var val = "_value" in o ? o._value : o.value;' +
                "return " +
                (number ? "_n(val)" : "val") +
                "})";
              var assignment =
                "$event.target.multiple ? $$selectedVal : $$selectedVal[0]";
              var code = "var $$selectedVal = " + selectedVal + ";";
              code = code + " " + genAssignmentCode(value, assignment);
              addHandler(el, "change", code, null, true);
            }
            function genDefaultModel(el, value, modifiers) {
              var type = el.attrsMap.type;
              {
                var value$1 =
                  el.attrsMap["v-bind:value"] || el.attrsMap[":value"];
                var typeBinding =
                  el.attrsMap["v-bind:type"] || el.attrsMap[":type"];
                if (value$1 && !typeBinding) {
                  var binding = el.attrsMap["v-bind:value"]
                    ? "v-bind:value"
                    : ":value";
                  warn$1(
                    binding +
                      '="' +
                      value$1 +
                      '" conflicts with v-model on the same element ' +
                      "because the latter already expands to a value binding internally"
                  );
                }
              }
              var ref = modifiers || {};
              var lazy = ref.lazy;
              var number = ref.number;
              var trim = ref.trim;
              var needCompositionGuard = !lazy && type !== "range";
              var event = lazy
                ? "change"
                : type === "range"
                ? RANGE_TOKEN
                : "input";
              var valueExpression = "$event.target.value";
              if (trim) {
                valueExpression = "$event.target.value.trim()";
              }
              if (number) {
                valueExpression = "_n(" + valueExpression + ")";
              }
              var code = genAssignmentCode(value, valueExpression);
              if (needCompositionGuard) {
                code = "if($event.target.composing)return;" + code;
              }
              addProp(el, "value", "(" + value + ")");
              addHandler(el, event, code, null, true);
              if (trim || number) {
                addHandler(el, "blur", "$forceUpdate()");
              }
            }
            function normalizeEvents(on) {
              if (isDef(on[RANGE_TOKEN])) {
                var event = isIE ? "change" : "input";
                on[event] = [].concat(on[RANGE_TOKEN], on[event] || []);
                delete on[RANGE_TOKEN];
              }
              if (isDef(on[CHECKBOX_RADIO_TOKEN])) {
                on.change = [].concat(
                  on[CHECKBOX_RADIO_TOKEN],
                  on.change || []
                );
                delete on[CHECKBOX_RADIO_TOKEN];
              }
            }
            var target$1;
            function createOnceHandler(handler, event, capture) {
              var _target = target$1;
              return function onceHandler() {
                var res = handler.apply(null, arguments);
                if (res !== null) {
                  remove$2(event, onceHandler, capture, _target);
                }
              };
            }
            function add$1(event, handler, once$$1, capture, passive) {
              handler = withMacroTask(handler);
              if (once$$1) {
                handler = createOnceHandler(handler, event, capture);
              }
              target$1.addEventListener(
                event,
                handler,
                supportsPassive
                  ? { capture: capture, passive: passive }
                  : capture
              );
            }
            function remove$2(event, handler, capture, _target) {
              (_target || target$1).removeEventListener(
                event,
                handler._withTask || handler,
                capture
              );
            }
            function updateDOMListeners(oldVnode, vnode) {
              if (isUndef(oldVnode.data.on) && isUndef(vnode.data.on)) {
                return;
              }
              var on = vnode.data.on || {};
              var oldOn = oldVnode.data.on || {};
              target$1 = vnode.elm;
              normalizeEvents(on);
              updateListeners(on, oldOn, add$1, remove$2, vnode.context);
              target$1 = undefined;
            }
            var events = {
              create: updateDOMListeners,
              update: updateDOMListeners,
            };
            function updateDOMProps(oldVnode, vnode) {
              if (
                isUndef(oldVnode.data.domProps) &&
                isUndef(vnode.data.domProps)
              ) {
                return;
              }
              var key, cur;
              var elm = vnode.elm;
              var oldProps = oldVnode.data.domProps || {};
              var props = vnode.data.domProps || {};
              if (isDef(props.__ob__)) {
                props = vnode.data.domProps = extend({}, props);
              }
              for (key in oldProps) {
                if (isUndef(props[key])) {
                  elm[key] = "";
                }
              }
              for (key in props) {
                cur = props[key];
                if (key === "textContent" || key === "innerHTML") {
                  if (vnode.children) {
                    vnode.children.length = 0;
                  }
                  if (cur === oldProps[key]) {
                    continue;
                  }
                  if (elm.childNodes.length === 1) {
                    elm.removeChild(elm.childNodes[0]);
                  }
                }
                if (key === "value") {
                  elm._value = cur;
                  var strCur = isUndef(cur) ? "" : String(cur);
                  if (shouldUpdateValue(elm, strCur)) {
                    elm.value = strCur;
                  }
                } else {
                  elm[key] = cur;
                }
              }
            }
            function shouldUpdateValue(elm, checkVal) {
              return (
                !elm.composing &&
                (elm.tagName === "OPTION" ||
                  isNotInFocusAndDirty(elm, checkVal) ||
                  isDirtyWithModifiers(elm, checkVal))
              );
            }
            function isNotInFocusAndDirty(elm, checkVal) {
              var notInFocus = true;
              try {
                notInFocus = document.activeElement !== elm;
              } catch (e) {}
              return notInFocus && elm.value !== checkVal;
            }
            function isDirtyWithModifiers(elm, newVal) {
              var value = elm.value;
              var modifiers = elm._vModifiers;
              if (isDef(modifiers)) {
                if (modifiers.lazy) {
                  return false;
                }
                if (modifiers.number) {
                  return toNumber(value) !== toNumber(newVal);
                }
                if (modifiers.trim) {
                  return value.trim() !== newVal.trim();
                }
              }
              return value !== newVal;
            }
            var domProps = { create: updateDOMProps, update: updateDOMProps };
            var parseStyleText = cached(function (cssText) {
              var res = {};
              var listDelimiter = /;(?![^(]*\))/g;
              var propertyDelimiter = /:(.+)/;
              cssText.split(listDelimiter).forEach(function (item) {
                if (item) {
                  var tmp = item.split(propertyDelimiter);
                  tmp.length > 1 && (res[tmp[0].trim()] = tmp[1].trim());
                }
              });
              return res;
            });
            function normalizeStyleData(data) {
              var style = normalizeStyleBinding(data.style);
              return data.staticStyle ? extend(data.staticStyle, style) : style;
            }
            function normalizeStyleBinding(bindingStyle) {
              if (Array.isArray(bindingStyle)) {
                return toObject(bindingStyle);
              }
              if (typeof bindingStyle === "string") {
                return parseStyleText(bindingStyle);
              }
              return bindingStyle;
            }
            function getStyle(vnode, checkChild) {
              var res = {};
              var styleData;
              if (checkChild) {
                var childNode = vnode;
                while (childNode.componentInstance) {
                  childNode = childNode.componentInstance._vnode;
                  if (
                    childNode &&
                    childNode.data &&
                    (styleData = normalizeStyleData(childNode.data))
                  ) {
                    extend(res, styleData);
                  }
                }
              }
              if ((styleData = normalizeStyleData(vnode.data))) {
                extend(res, styleData);
              }
              var parentNode = vnode;
              while ((parentNode = parentNode.parent)) {
                if (
                  parentNode.data &&
                  (styleData = normalizeStyleData(parentNode.data))
                ) {
                  extend(res, styleData);
                }
              }
              return res;
            }
            var cssVarRE = /^--/;
            var importantRE = /\s*!important$/;
            var setProp = function (el, name, val) {
              if (cssVarRE.test(name)) {
                el.style.setProperty(name, val);
              } else if (importantRE.test(val)) {
                el.style.setProperty(
                  name,
                  val.replace(importantRE, ""),
                  "important"
                );
              } else {
                var normalizedName = normalize(name);
                if (Array.isArray(val)) {
                  for (var i = 0, len = val.length; i < len; i++) {
                    el.style[normalizedName] = val[i];
                  }
                } else {
                  el.style[normalizedName] = val;
                }
              }
            };
            var vendorNames = ["Webkit", "Moz", "ms"];
            var emptyStyle;
            var normalize = cached(function (prop) {
              emptyStyle = emptyStyle || document.createElement("div").style;
              prop = camelize(prop);
              if (prop !== "filter" && prop in emptyStyle) {
                return prop;
              }
              var capName = prop.charAt(0).toUpperCase() + prop.slice(1);
              for (var i = 0; i < vendorNames.length; i++) {
                var name = vendorNames[i] + capName;
                if (name in emptyStyle) {
                  return name;
                }
              }
            });
            function updateStyle(oldVnode, vnode) {
              var data = vnode.data;
              var oldData = oldVnode.data;
              if (
                isUndef(data.staticStyle) &&
                isUndef(data.style) &&
                isUndef(oldData.staticStyle) &&
                isUndef(oldData.style)
              ) {
                return;
              }
              var cur, name;
              var el = vnode.elm;
              var oldStaticStyle = oldData.staticStyle;
              var oldStyleBinding =
                oldData.normalizedStyle || oldData.style || {};
              var oldStyle = oldStaticStyle || oldStyleBinding;
              var style = normalizeStyleBinding(vnode.data.style) || {};
              vnode.data.normalizedStyle = isDef(style.__ob__)
                ? extend({}, style)
                : style;
              var newStyle = getStyle(vnode, true);
              for (name in oldStyle) {
                if (isUndef(newStyle[name])) {
                  setProp(el, name, "");
                }
              }
              for (name in newStyle) {
                cur = newStyle[name];
                if (cur !== oldStyle[name]) {
                  setProp(el, name, cur == null ? "" : cur);
                }
              }
            }
            var style = { create: updateStyle, update: updateStyle };
            function addClass(el, cls) {
              if (!cls || !(cls = cls.trim())) {
                return;
              }
              if (el.classList) {
                if (cls.indexOf(" ") > -1) {
                  cls.split(/\s+/).forEach(function (c) {
                    return el.classList.add(c);
                  });
                } else {
                  el.classList.add(cls);
                }
              } else {
                var cur = " " + (el.getAttribute("class") || "") + " ";
                if (cur.indexOf(" " + cls + " ") < 0) {
                  el.setAttribute("class", (cur + cls).trim());
                }
              }
            }
            function removeClass(el, cls) {
              if (!cls || !(cls = cls.trim())) {
                return;
              }
              if (el.classList) {
                if (cls.indexOf(" ") > -1) {
                  cls.split(/\s+/).forEach(function (c) {
                    return el.classList.remove(c);
                  });
                } else {
                  el.classList.remove(cls);
                }
                if (!el.classList.length) {
                  el.removeAttribute("class");
                }
              } else {
                var cur = " " + (el.getAttribute("class") || "") + " ";
                var tar = " " + cls + " ";
                while (cur.indexOf(tar) >= 0) {
                  cur = cur.replace(tar, " ");
                }
                cur = cur.trim();
                if (cur) {
                  el.setAttribute("class", cur);
                } else {
                  el.removeAttribute("class");
                }
              }
            }
            function resolveTransition(def) {
              if (!def) {
                return;
              }
              if (typeof def === "object") {
                var res = {};
                if (def.css !== false) {
                  extend(res, autoCssTransition(def.name || "v"));
                }
                extend(res, def);
                return res;
              } else if (typeof def === "string") {
                return autoCssTransition(def);
              }
            }
            var autoCssTransition = cached(function (name) {
              return {
                enterClass: name + "-enter",
                enterToClass: name + "-enter-to",
                enterActiveClass: name + "-enter-active",
                leaveClass: name + "-leave",
                leaveToClass: name + "-leave-to",
                leaveActiveClass: name + "-leave-active",
              };
            });
            var hasTransition = inBrowser && !isIE9;
            var TRANSITION = "transition";
            var ANIMATION = "animation";
            var transitionProp = "transition";
            var transitionEndEvent = "transitionend";
            var animationProp = "animation";
            var animationEndEvent = "animationend";
            if (hasTransition) {
              if (
                window.ontransitionend === undefined &&
                window.onwebkittransitionend !== undefined
              ) {
                transitionProp = "WebkitTransition";
                transitionEndEvent = "webkitTransitionEnd";
              }
              if (
                window.onanimationend === undefined &&
                window.onwebkitanimationend !== undefined
              ) {
                animationProp = "WebkitAnimation";
                animationEndEvent = "webkitAnimationEnd";
              }
            }
            var raf = inBrowser
              ? window.requestAnimationFrame
                ? window.requestAnimationFrame.bind(window)
                : setTimeout
              : function (fn) {
                  return fn();
                };
            function nextFrame(fn) {
              raf(function () {
                raf(fn);
              });
            }
            function addTransitionClass(el, cls) {
              var transitionClasses =
                el._transitionClasses || (el._transitionClasses = []);
              if (transitionClasses.indexOf(cls) < 0) {
                transitionClasses.push(cls);
                addClass(el, cls);
              }
            }
            function removeTransitionClass(el, cls) {
              if (el._transitionClasses) {
                remove(el._transitionClasses, cls);
              }
              removeClass(el, cls);
            }
            function whenTransitionEnds(el, expectedType, cb) {
              var ref = getTransitionInfo(el, expectedType);
              var type = ref.type;
              var timeout = ref.timeout;
              var propCount = ref.propCount;
              if (!type) {
                return cb();
              }
              var event =
                type === TRANSITION ? transitionEndEvent : animationEndEvent;
              var ended = 0;
              var end = function () {
                el.removeEventListener(event, onEnd);
                cb();
              };
              var onEnd = function (e) {
                if (e.target === el) {
                  if (++ended >= propCount) {
                    end();
                  }
                }
              };
              setTimeout(function () {
                if (ended < propCount) {
                  end();
                }
              }, timeout + 1);
              el.addEventListener(event, onEnd);
            }
            var transformRE = /\b(transform|all)(,|$)/;
            function getTransitionInfo(el, expectedType) {
              var styles = window.getComputedStyle(el);
              var transitionDelays =
                styles[transitionProp + "Delay"].split(", ");
              var transitionDurations =
                styles[transitionProp + "Duration"].split(", ");
              var transitionTimeout = getTimeout(
                transitionDelays,
                transitionDurations
              );
              var animationDelays = styles[animationProp + "Delay"].split(", ");
              var animationDurations =
                styles[animationProp + "Duration"].split(", ");
              var animationTimeout = getTimeout(
                animationDelays,
                animationDurations
              );
              var type;
              var timeout = 0;
              var propCount = 0;
              if (expectedType === TRANSITION) {
                if (transitionTimeout > 0) {
                  type = TRANSITION;
                  timeout = transitionTimeout;
                  propCount = transitionDurations.length;
                }
              } else if (expectedType === ANIMATION) {
                if (animationTimeout > 0) {
                  type = ANIMATION;
                  timeout = animationTimeout;
                  propCount = animationDurations.length;
                }
              } else {
                timeout = Math.max(transitionTimeout, animationTimeout);
                type =
                  timeout > 0
                    ? transitionTimeout > animationTimeout
                      ? TRANSITION
                      : ANIMATION
                    : null;
                propCount = type
                  ? type === TRANSITION
                    ? transitionDurations.length
                    : animationDurations.length
                  : 0;
              }
              var hasTransform =
                type === TRANSITION &&
                transformRE.test(styles[transitionProp + "Property"]);
              return {
                type: type,
                timeout: timeout,
                propCount: propCount,
                hasTransform: hasTransform,
              };
            }
            function getTimeout(delays, durations) {
              while (delays.length < durations.length) {
                delays = delays.concat(delays);
              }
              return Math.max.apply(
                null,
                durations.map(function (d, i) {
                  return toMs(d) + toMs(delays[i]);
                })
              );
            }
            function toMs(s) {
              return Number(s.slice(0, -1)) * 1e3;
            }
            function enter(vnode, toggleDisplay) {
              var el = vnode.elm;
              if (isDef(el._leaveCb)) {
                el._leaveCb.cancelled = true;
                el._leaveCb();
              }
              var data = resolveTransition(vnode.data.transition);
              if (isUndef(data)) {
                return;
              }
              if (isDef(el._enterCb) || el.nodeType !== 1) {
                return;
              }
              var css = data.css;
              var type = data.type;
              var enterClass = data.enterClass;
              var enterToClass = data.enterToClass;
              var enterActiveClass = data.enterActiveClass;
              var appearClass = data.appearClass;
              var appearToClass = data.appearToClass;
              var appearActiveClass = data.appearActiveClass;
              var beforeEnter = data.beforeEnter;
              var enter = data.enter;
              var afterEnter = data.afterEnter;
              var enterCancelled = data.enterCancelled;
              var beforeAppear = data.beforeAppear;
              var appear = data.appear;
              var afterAppear = data.afterAppear;
              var appearCancelled = data.appearCancelled;
              var duration = data.duration;
              var context = activeInstance;
              var transitionNode = activeInstance.$vnode;
              while (transitionNode && transitionNode.parent) {
                transitionNode = transitionNode.parent;
                context = transitionNode.context;
              }
              var isAppear = !context._isMounted || !vnode.isRootInsert;
              if (isAppear && !appear && appear !== "") {
                return;
              }
              var startClass =
                isAppear && appearClass ? appearClass : enterClass;
              var activeClass =
                isAppear && appearActiveClass
                  ? appearActiveClass
                  : enterActiveClass;
              var toClass =
                isAppear && appearToClass ? appearToClass : enterToClass;
              var beforeEnterHook = isAppear
                ? beforeAppear || beforeEnter
                : beforeEnter;
              var enterHook = isAppear
                ? typeof appear === "function"
                  ? appear
                  : enter
                : enter;
              var afterEnterHook = isAppear
                ? afterAppear || afterEnter
                : afterEnter;
              var enterCancelledHook = isAppear
                ? appearCancelled || enterCancelled
                : enterCancelled;
              var explicitEnterDuration = toNumber(
                isObject(duration) ? duration.enter : duration
              );
              if (
                "development" !== "production" &&
                explicitEnterDuration != null
              ) {
                checkDuration(explicitEnterDuration, "enter", vnode);
              }
              var expectsCSS = css !== false && !isIE9;
              var userWantsControl = getHookArgumentsLength(enterHook);
              var cb = (el._enterCb = once(function () {
                if (expectsCSS) {
                  removeTransitionClass(el, toClass);
                  removeTransitionClass(el, activeClass);
                }
                if (cb.cancelled) {
                  if (expectsCSS) {
                    removeTransitionClass(el, startClass);
                  }
                  enterCancelledHook && enterCancelledHook(el);
                } else {
                  afterEnterHook && afterEnterHook(el);
                }
                el._enterCb = null;
              }));
              if (!vnode.data.show) {
                mergeVNodeHook(vnode, "insert", function () {
                  var parent = el.parentNode;
                  var pendingNode =
                    parent && parent._pending && parent._pending[vnode.key];
                  if (
                    pendingNode &&
                    pendingNode.tag === vnode.tag &&
                    pendingNode.elm._leaveCb
                  ) {
                    pendingNode.elm._leaveCb();
                  }
                  enterHook && enterHook(el, cb);
                });
              }
              beforeEnterHook && beforeEnterHook(el);
              if (expectsCSS) {
                addTransitionClass(el, startClass);
                addTransitionClass(el, activeClass);
                nextFrame(function () {
                  removeTransitionClass(el, startClass);
                  if (!cb.cancelled) {
                    addTransitionClass(el, toClass);
                    if (!userWantsControl) {
                      if (isValidDuration(explicitEnterDuration)) {
                        setTimeout(cb, explicitEnterDuration);
                      } else {
                        whenTransitionEnds(el, type, cb);
                      }
                    }
                  }
                });
              }
              if (vnode.data.show) {
                toggleDisplay && toggleDisplay();
                enterHook && enterHook(el, cb);
              }
              if (!expectsCSS && !userWantsControl) {
                cb();
              }
            }
            function leave(vnode, rm) {
              var el = vnode.elm;
              if (isDef(el._enterCb)) {
                el._enterCb.cancelled = true;
                el._enterCb();
              }
              var data = resolveTransition(vnode.data.transition);
              if (isUndef(data) || el.nodeType !== 1) {
                return rm();
              }
              if (isDef(el._leaveCb)) {
                return;
              }
              var css = data.css;
              var type = data.type;
              var leaveClass = data.leaveClass;
              var leaveToClass = data.leaveToClass;
              var leaveActiveClass = data.leaveActiveClass;
              var beforeLeave = data.beforeLeave;
              var leave = data.leave;
              var afterLeave = data.afterLeave;
              var leaveCancelled = data.leaveCancelled;
              var delayLeave = data.delayLeave;
              var duration = data.duration;
              var expectsCSS = css !== false && !isIE9;
              var userWantsControl = getHookArgumentsLength(leave);
              var explicitLeaveDuration = toNumber(
                isObject(duration) ? duration.leave : duration
              );
              if (
                "development" !== "production" &&
                isDef(explicitLeaveDuration)
              ) {
                checkDuration(explicitLeaveDuration, "leave", vnode);
              }
              var cb = (el._leaveCb = once(function () {
                if (el.parentNode && el.parentNode._pending) {
                  el.parentNode._pending[vnode.key] = null;
                }
                if (expectsCSS) {
                  removeTransitionClass(el, leaveToClass);
                  removeTransitionClass(el, leaveActiveClass);
                }
                if (cb.cancelled) {
                  if (expectsCSS) {
                    removeTransitionClass(el, leaveClass);
                  }
                  leaveCancelled && leaveCancelled(el);
                } else {
                  rm();
                  afterLeave && afterLeave(el);
                }
                el._leaveCb = null;
              }));
              if (delayLeave) {
                delayLeave(performLeave);
              } else {
                performLeave();
              }
              function performLeave() {
                if (cb.cancelled) {
                  return;
                }
                if (!vnode.data.show) {
                  (el.parentNode._pending || (el.parentNode._pending = {}))[
                    vnode.key
                  ] = vnode;
                }
                beforeLeave && beforeLeave(el);
                if (expectsCSS) {
                  addTransitionClass(el, leaveClass);
                  addTransitionClass(el, leaveActiveClass);
                  nextFrame(function () {
                    removeTransitionClass(el, leaveClass);
                    if (!cb.cancelled) {
                      addTransitionClass(el, leaveToClass);
                      if (!userWantsControl) {
                        if (isValidDuration(explicitLeaveDuration)) {
                          setTimeout(cb, explicitLeaveDuration);
                        } else {
                          whenTransitionEnds(el, type, cb);
                        }
                      }
                    }
                  });
                }
                leave && leave(el, cb);
                if (!expectsCSS && !userWantsControl) {
                  cb();
                }
              }
            }
            function checkDuration(val, name, vnode) {
              if (typeof val !== "number") {
                warn(
                  "<transition> explicit " +
                    name +
                    " duration is not a valid number - " +
                    "got " +
                    JSON.stringify(val) +
                    ".",
                  vnode.context
                );
              } else if (isNaN(val)) {
                warn(
                  "<transition> explicit " +
                    name +
                    " duration is NaN - " +
                    "the duration expression might be incorrect.",
                  vnode.context
                );
              }
            }
            function isValidDuration(val) {
              return typeof val === "number" && !isNaN(val);
            }
            function getHookArgumentsLength(fn) {
              if (isUndef(fn)) {
                return false;
              }
              var invokerFns = fn.fns;
              if (isDef(invokerFns)) {
                return getHookArgumentsLength(
                  Array.isArray(invokerFns) ? invokerFns[0] : invokerFns
                );
              } else {
                return (fn._length || fn.length) > 1;
              }
            }
            function _enter(_, vnode) {
              if (vnode.data.show !== true) {
                enter(vnode);
              }
            }
            var transition = inBrowser
              ? {
                  create: _enter,
                  activate: _enter,
                  remove: function remove$$1(vnode, rm) {
                    if (vnode.data.show !== true) {
                      leave(vnode, rm);
                    } else {
                      rm();
                    }
                  },
                }
              : {};
            var platformModules = [
              attrs,
              klass,
              events,
              domProps,
              style,
              transition,
            ];
            var modules = platformModules.concat(baseModules);
            var patch = createPatchFunction({
              nodeOps: nodeOps,
              modules: modules,
            });
            if (isIE9) {
              document.addEventListener("selectionchange", function () {
                var el = document.activeElement;
                if (el && el.vmodel) {
                  trigger(el, "input");
                }
              });
            }
            var directive = {
              inserted: function inserted(el, binding, vnode, oldVnode) {
                if (vnode.tag === "select") {
                  if (oldVnode.elm && !oldVnode.elm._vOptions) {
                    mergeVNodeHook(vnode, "postpatch", function () {
                      directive.componentUpdated(el, binding, vnode);
                    });
                  } else {
                    setSelected(el, binding, vnode.context);
                  }
                  el._vOptions = [].map.call(el.options, getValue);
                } else if (
                  vnode.tag === "textarea" ||
                  isTextInputType(el.type)
                ) {
                  el._vModifiers = binding.modifiers;
                  if (!binding.modifiers.lazy) {
                    el.addEventListener("compositionstart", onCompositionStart);
                    el.addEventListener("compositionend", onCompositionEnd);
                    el.addEventListener("change", onCompositionEnd);
                    if (isIE9) {
                      el.vmodel = true;
                    }
                  }
                }
              },
              componentUpdated: function componentUpdated(el, binding, vnode) {
                if (vnode.tag === "select") {
                  setSelected(el, binding, vnode.context);
                  var prevOptions = el._vOptions;
                  var curOptions = (el._vOptions = [].map.call(
                    el.options,
                    getValue
                  ));
                  if (
                    curOptions.some(function (o, i) {
                      return !looseEqual(o, prevOptions[i]);
                    })
                  ) {
                    var needReset = el.multiple
                      ? binding.value.some(function (v) {
                          return hasNoMatchingOption(v, curOptions);
                        })
                      : binding.value !== binding.oldValue &&
                        hasNoMatchingOption(binding.value, curOptions);
                    if (needReset) {
                      trigger(el, "change");
                    }
                  }
                }
              },
            };
            function setSelected(el, binding, vm) {
              actuallySetSelected(el, binding, vm);
              if (isIE || isEdge) {
                setTimeout(function () {
                  actuallySetSelected(el, binding, vm);
                }, 0);
              }
            }
            function actuallySetSelected(el, binding, vm) {
              var value = binding.value;
              var isMultiple = el.multiple;
              if (isMultiple && !Array.isArray(value)) {
                "development" !== "production" &&
                  warn(
                    '<select multiple v-model="' +
                      binding.expression +
                      '"> ' +
                      "expects an Array value for its binding, but got " +
                      Object.prototype.toString.call(value).slice(8, -1),
                    vm
                  );
                return;
              }
              var selected, option;
              for (var i = 0, l = el.options.length; i < l; i++) {
                option = el.options[i];
                if (isMultiple) {
                  selected = looseIndexOf(value, getValue(option)) > -1;
                  if (option.selected !== selected) {
                    option.selected = selected;
                  }
                } else {
                  if (looseEqual(getValue(option), value)) {
                    if (el.selectedIndex !== i) {
                      el.selectedIndex = i;
                    }
                    return;
                  }
                }
              }
              if (!isMultiple) {
                el.selectedIndex = -1;
              }
            }
            function hasNoMatchingOption(value, options) {
              return options.every(function (o) {
                return !looseEqual(o, value);
              });
            }
            function getValue(option) {
              return "_value" in option ? option._value : option.value;
            }
            function onCompositionStart(e) {
              e.target.composing = true;
            }
            function onCompositionEnd(e) {
              if (!e.target.composing) {
                return;
              }
              e.target.composing = false;
              trigger(e.target, "input");
            }
            function trigger(el, type) {
              var e = document.createEvent("HTMLEvents");
              e.initEvent(type, true, true);
              el.dispatchEvent(e);
            }
            function locateNode(vnode) {
              return vnode.componentInstance &&
                (!vnode.data || !vnode.data.transition)
                ? locateNode(vnode.componentInstance._vnode)
                : vnode;
            }
            var show = {
              bind: function bind(el, ref, vnode) {
                var value = ref.value;
                vnode = locateNode(vnode);
                var transition$$1 = vnode.data && vnode.data.transition;
                var originalDisplay = (el.__vOriginalDisplay =
                  el.style.display === "none" ? "" : el.style.display);
                if (value && transition$$1) {
                  vnode.data.show = true;
                  enter(vnode, function () {
                    el.style.display = originalDisplay;
                  });
                } else {
                  el.style.display = value ? originalDisplay : "none";
                }
              },
              update: function update(el, ref, vnode) {
                var value = ref.value;
                var oldValue = ref.oldValue;
                if (!value === !oldValue) {
                  return;
                }
                vnode = locateNode(vnode);
                var transition$$1 = vnode.data && vnode.data.transition;
                if (transition$$1) {
                  vnode.data.show = true;
                  if (value) {
                    enter(vnode, function () {
                      el.style.display = el.__vOriginalDisplay;
                    });
                  } else {
                    leave(vnode, function () {
                      el.style.display = "none";
                    });
                  }
                } else {
                  el.style.display = value ? el.__vOriginalDisplay : "none";
                }
              },
              unbind: function unbind(el, binding, vnode, oldVnode, isDestroy) {
                if (!isDestroy) {
                  el.style.display = el.__vOriginalDisplay;
                }
              },
            };
            var platformDirectives = { model: directive, show: show };
            var transitionProps = {
              name: String,
              appear: Boolean,
              css: Boolean,
              mode: String,
              type: String,
              enterClass: String,
              leaveClass: String,
              enterToClass: String,
              leaveToClass: String,
              enterActiveClass: String,
              leaveActiveClass: String,
              appearClass: String,
              appearActiveClass: String,
              appearToClass: String,
              duration: [Number, String, Object],
            };
            function getRealChild(vnode) {
              var compOptions = vnode && vnode.componentOptions;
              if (compOptions && compOptions.Ctor.options.abstract) {
                return getRealChild(
                  getFirstComponentChild(compOptions.children)
                );
              } else {
                return vnode;
              }
            }
            function extractTransitionData(comp) {
              var data = {};
              var options = comp.$options;
              for (var key in options.propsData) {
                data[key] = comp[key];
              }
              var listeners = options._parentListeners;
              for (var key$1 in listeners) {
                data[camelize(key$1)] = listeners[key$1];
              }
              return data;
            }
            function placeholder(h, rawChild) {
              if (/\d-keep-alive$/.test(rawChild.tag)) {
                return h("keep-alive", {
                  props: rawChild.componentOptions.propsData,
                });
              }
            }
            function hasParentTransition(vnode) {
              while ((vnode = vnode.parent)) {
                if (vnode.data.transition) {
                  return true;
                }
              }
            }
            function isSameChild(child, oldChild) {
              return oldChild.key === child.key && oldChild.tag === child.tag;
            }
            var Transition = {
              name: "transition",
              props: transitionProps,
              abstract: true,
              render: function render(h) {
                var this$1 = this;
                var children = this.$slots.default;
                if (!children) {
                  return;
                }
                children = children.filter(function (c) {
                  return c.tag || isAsyncPlaceholder(c);
                });
                if (!children.length) {
                  return;
                }
                if ("development" !== "production" && children.length > 1) {
                  warn(
                    "<transition> can only be used on a single element. Use " +
                      "<transition-group> for lists.",
                    this.$parent
                  );
                }
                var mode = this.mode;
                if (
                  "development" !== "production" &&
                  mode &&
                  mode !== "in-out" &&
                  mode !== "out-in"
                ) {
                  warn("invalid <transition> mode: " + mode, this.$parent);
                }
                var rawChild = children[0];
                if (hasParentTransition(this.$vnode)) {
                  return rawChild;
                }
                var child = getRealChild(rawChild);
                if (!child) {
                  return rawChild;
                }
                if (this._leaving) {
                  return placeholder(h, rawChild);
                }
                var id = "__transition-" + this._uid + "-";
                child.key =
                  child.key == null
                    ? child.isComment
                      ? id + "comment"
                      : id + child.tag
                    : isPrimitive(child.key)
                    ? String(child.key).indexOf(id) === 0
                      ? child.key
                      : id + child.key
                    : child.key;
                var data = ((child.data || (child.data = {})).transition =
                  extractTransitionData(this));
                var oldRawChild = this._vnode;
                var oldChild = getRealChild(oldRawChild);
                if (
                  child.data.directives &&
                  child.data.directives.some(function (d) {
                    return d.name === "show";
                  })
                ) {
                  child.data.show = true;
                }
                if (
                  oldChild &&
                  oldChild.data &&
                  !isSameChild(child, oldChild) &&
                  !isAsyncPlaceholder(oldChild) &&
                  !(
                    oldChild.componentInstance &&
                    oldChild.componentInstance._vnode.isComment
                  )
                ) {
                  var oldData = (oldChild.data.transition = extend({}, data));
                  if (mode === "out-in") {
                    this._leaving = true;
                    mergeVNodeHook(oldData, "afterLeave", function () {
                      this$1._leaving = false;
                      this$1.$forceUpdate();
                    });
                    return placeholder(h, rawChild);
                  } else if (mode === "in-out") {
                    if (isAsyncPlaceholder(child)) {
                      return oldRawChild;
                    }
                    var delayedLeave;
                    var performLeave = function () {
                      delayedLeave();
                    };
                    mergeVNodeHook(data, "afterEnter", performLeave);
                    mergeVNodeHook(data, "enterCancelled", performLeave);
                    mergeVNodeHook(oldData, "delayLeave", function (leave) {
                      delayedLeave = leave;
                    });
                  }
                }
                return rawChild;
              },
            };
            var props = extend(
              { tag: String, moveClass: String },
              transitionProps
            );
            delete props.mode;
            var TransitionGroup = {
              props: props,
              render: function render(h) {
                var tag = this.tag || this.$vnode.data.tag || "span";
                var map = Object.create(null);
                var prevChildren = (this.prevChildren = this.children);
                var rawChildren = this.$slots.default || [];
                var children = (this.children = []);
                var transitionData = extractTransitionData(this);
                for (var i = 0; i < rawChildren.length; i++) {
                  var c = rawChildren[i];
                  if (c.tag) {
                    if (
                      c.key != null &&
                      String(c.key).indexOf("__vlist") !== 0
                    ) {
                      children.push(c);
                      map[c.key] = c;
                      (c.data || (c.data = {})).transition = transitionData;
                    } else {
                      var opts = c.componentOptions;
                      var name = opts
                        ? opts.Ctor.options.name || opts.tag || ""
                        : c.tag;
                      warn(
                        "<transition-group> children must be keyed: <" +
                          name +
                          ">"
                      );
                    }
                  }
                }
                if (prevChildren) {
                  var kept = [];
                  var removed = [];
                  for (var i$1 = 0; i$1 < prevChildren.length; i$1++) {
                    var c$1 = prevChildren[i$1];
                    c$1.data.transition = transitionData;
                    c$1.data.pos = c$1.elm.getBoundingClientRect();
                    if (map[c$1.key]) {
                      kept.push(c$1);
                    } else {
                      removed.push(c$1);
                    }
                  }
                  this.kept = h(tag, null, kept);
                  this.removed = removed;
                }
                return h(tag, null, children);
              },
              beforeUpdate: function beforeUpdate() {
                this.__patch__(this._vnode, this.kept, false, true);
                this._vnode = this.kept;
              },
              updated: function updated() {
                var children = this.prevChildren;
                var moveClass = this.moveClass || (this.name || "v") + "-move";
                if (
                  !children.length ||
                  !this.hasMove(children[0].elm, moveClass)
                ) {
                  return;
                }
                children.forEach(callPendingCbs);
                children.forEach(recordPosition);
                children.forEach(applyTranslation);
                this._reflow = document.body.offsetHeight;
                children.forEach(function (c) {
                  if (c.data.moved) {
                    var el = c.elm;
                    var s = el.style;
                    addTransitionClass(el, moveClass);
                    s.transform = s.WebkitTransform = s.transitionDuration = "";
                    el.addEventListener(
                      transitionEndEvent,
                      (el._moveCb = function cb(e) {
                        if (!e || /transform$/.test(e.propertyName)) {
                          el.removeEventListener(transitionEndEvent, cb);
                          el._moveCb = null;
                          removeTransitionClass(el, moveClass);
                        }
                      })
                    );
                  }
                });
              },
              methods: {
                hasMove: function hasMove(el, moveClass) {
                  if (!hasTransition) {
                    return false;
                  }
                  if (this._hasMove) {
                    return this._hasMove;
                  }
                  var clone = el.cloneNode();
                  if (el._transitionClasses) {
                    el._transitionClasses.forEach(function (cls) {
                      removeClass(clone, cls);
                    });
                  }
                  addClass(clone, moveClass);
                  clone.style.display = "none";
                  this.$el.appendChild(clone);
                  var info = getTransitionInfo(clone);
                  this.$el.removeChild(clone);
                  return (this._hasMove = info.hasTransform);
                },
              },
            };
            function callPendingCbs(c) {
              if (c.elm._moveCb) {
                c.elm._moveCb();
              }
              if (c.elm._enterCb) {
                c.elm._enterCb();
              }
            }
            function recordPosition(c) {
              c.data.newPos = c.elm.getBoundingClientRect();
            }
            function applyTranslation(c) {
              var oldPos = c.data.pos;
              var newPos = c.data.newPos;
              var dx = oldPos.left - newPos.left;
              var dy = oldPos.top - newPos.top;
              if (dx || dy) {
                c.data.moved = true;
                var s = c.elm.style;
                s.transform = s.WebkitTransform =
                  "translate(" + dx + "px," + dy + "px)";
                s.transitionDuration = "0s";
              }
            }
            var platformComponents = {
              Transition: Transition,
              TransitionGroup: TransitionGroup,
            };
            Vue.config.mustUseProp = mustUseProp;
            Vue.config.isReservedTag = isReservedTag;
            Vue.config.isReservedAttr = isReservedAttr;
            Vue.config.getTagNamespace = getTagNamespace;
            Vue.config.isUnknownElement = isUnknownElement;
            extend(Vue.options.directives, platformDirectives);
            extend(Vue.options.components, platformComponents);
            Vue.prototype.__patch__ = inBrowser ? patch : noop;
            Vue.prototype.$mount = function (el, hydrating) {
              el = el && inBrowser ? query(el) : undefined;
              return mountComponent(this, el, hydrating);
            };
            if (inBrowser) {
              setTimeout(function () {
                if (config.devtools) {
                  if (devtools) {
                    devtools.emit("init", Vue);
                  } else if (
                    "development" !== "production" &&
                    "development" !== "test" &&
                    isChrome
                  ) {
                    console[console.info ? "info" : "log"](
                      "Download the Vue Devtools extension for a better development experience:\n" +
                        "https://github.com/vuejs/vue-devtools"
                    );
                  }
                }
                if (
                  "development" !== "production" &&
                  "development" !== "test" &&
                  config.productionTip !== false &&
                  typeof console !== "undefined"
                ) {
                  console[console.info ? "info" : "log"](
                    "You are running Vue in development mode.\n" +
                      "Make sure to turn on production mode when deploying for production.\n" +
                      "See more tips at https://vuejs.org/guide/deployment.html"
                  );
                }
              }, 0);
            }
            var defaultTagRE = /\{\{((?:.|\n)+?)\}\}/g;
            var regexEscapeRE = /[-.*+?^${}()|[\]\/\\]/g;
            var buildRegex = cached(function (delimiters) {
              var open = delimiters[0].replace(regexEscapeRE, "\\$&");
              var close = delimiters[1].replace(regexEscapeRE, "\\$&");
              return new RegExp(open + "((?:.|\\n)+?)" + close, "g");
            });
            function parseText(text, delimiters) {
              var tagRE = delimiters ? buildRegex(delimiters) : defaultTagRE;
              if (!tagRE.test(text)) {
                return;
              }
              var tokens = [];
              var rawTokens = [];
              var lastIndex = (tagRE.lastIndex = 0);
              var match, index, tokenValue;
              while ((match = tagRE.exec(text))) {
                index = match.index;
                if (index > lastIndex) {
                  rawTokens.push((tokenValue = text.slice(lastIndex, index)));
                  tokens.push(JSON.stringify(tokenValue));
                }
                var exp = parseFilters(match[1].trim());
                tokens.push("_s(" + exp + ")");
                rawTokens.push({ "@binding": exp });
                lastIndex = index + match[0].length;
              }
              if (lastIndex < text.length) {
                rawTokens.push((tokenValue = text.slice(lastIndex)));
                tokens.push(JSON.stringify(tokenValue));
              }
              return { expression: tokens.join("+"), tokens: rawTokens };
            }
            function transformNode(el, options) {
              var warn = options.warn || baseWarn;
              var staticClass = getAndRemoveAttr(el, "class");
              if ("development" !== "production" && staticClass) {
                var res = parseText(staticClass, options.delimiters);
                if (res) {
                  warn(
                    'class="' +
                      staticClass +
                      '": ' +
                      "Interpolation inside attributes has been removed. " +
                      "Use v-bind or the colon shorthand instead. For example, " +
                      'instead of <div class="{{ val }}">, use <div :class="val">.'
                  );
                }
              }
              if (staticClass) {
                el.staticClass = JSON.stringify(staticClass);
              }
              var classBinding = getBindingAttr(el, "class", false);
              if (classBinding) {
                el.classBinding = classBinding;
              }
            }
            function genData(el) {
              var data = "";
              if (el.staticClass) {
                data += "staticClass:" + el.staticClass + ",";
              }
              if (el.classBinding) {
                data += "class:" + el.classBinding + ",";
              }
              return data;
            }
            var klass$1 = {
              staticKeys: ["staticClass"],
              transformNode: transformNode,
              genData: genData,
            };
            function transformNode$1(el, options) {
              var warn = options.warn || baseWarn;
              var staticStyle = getAndRemoveAttr(el, "style");
              if (staticStyle) {
                {
                  var res = parseText(staticStyle, options.delimiters);
                  if (res) {
                    warn(
                      'style="' +
                        staticStyle +
                        '": ' +
                        "Interpolation inside attributes has been removed. " +
                        "Use v-bind or the colon shorthand instead. For example, " +
                        'instead of <div style="{{ val }}">, use <div :style="val">.'
                    );
                  }
                }
                el.staticStyle = JSON.stringify(parseStyleText(staticStyle));
              }
              var styleBinding = getBindingAttr(el, "style", false);
              if (styleBinding) {
                el.styleBinding = styleBinding;
              }
            }
            function genData$1(el) {
              var data = "";
              if (el.staticStyle) {
                data += "staticStyle:" + el.staticStyle + ",";
              }
              if (el.styleBinding) {
                data += "style:(" + el.styleBinding + "),";
              }
              return data;
            }
            var style$1 = {
              staticKeys: ["staticStyle"],
              transformNode: transformNode$1,
              genData: genData$1,
            };
            var decoder;
            var he = {
              decode: function decode(html) {
                decoder = decoder || document.createElement("div");
                decoder.innerHTML = html;
                return decoder.textContent;
              },
            };
            var isUnaryTag = makeMap(
              "area,base,br,col,embed,frame,hr,img,input,isindex,keygen," +
                "link,meta,param,source,track,wbr"
            );
            var canBeLeftOpenTag = makeMap(
              "colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr,source"
            );
            var isNonPhrasingTag = makeMap(
              "address,article,aside,base,blockquote,body,caption,col,colgroup,dd," +
                "details,dialog,div,dl,dt,fieldset,figcaption,figure,footer,form," +
                "h1,h2,h3,h4,h5,h6,head,header,hgroup,hr,html,legend,li,menuitem,meta," +
                "optgroup,option,param,rp,rt,source,style,summary,tbody,td,tfoot,th,thead," +
                "title,tr,track"
            );
            var attribute =
              /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
            var ncname = "[a-zA-Z_][\\w\\-\\.]*";
            var qnameCapture = "((?:" + ncname + "\\:)?" + ncname + ")";
            var startTagOpen = new RegExp("^<" + qnameCapture);
            var startTagClose = /^\s*(\/?)>/;
            var endTag = new RegExp("^<\\/" + qnameCapture + "[^>]*>");
            var doctype = /^<!DOCTYPE [^>]+>/i;
            var comment = /^<!\--/;
            var conditionalComment = /^<!\[/;
            var IS_REGEX_CAPTURING_BROKEN = false;
            "x".replace(/x(.)?/g, function (m, g) {
              IS_REGEX_CAPTURING_BROKEN = g === "";
            });
            var isPlainTextElement = makeMap("script,style,textarea", true);
            var reCache = {};
            var decodingMap = {
              "&lt;": "<",
              "&gt;": ">",
              "&quot;": '"',
              "&amp;": "&",
              "&#10;": "\n",
              "&#9;": "\t",
            };
            var encodedAttr = /&(?:lt|gt|quot|amp);/g;
            var encodedAttrWithNewLines = /&(?:lt|gt|quot|amp|#10|#9);/g;
            var isIgnoreNewlineTag = makeMap("pre,textarea", true);
            var shouldIgnoreFirstNewline = function (tag, html) {
              return tag && isIgnoreNewlineTag(tag) && html[0] === "\n";
            };
            function decodeAttr(value, shouldDecodeNewlines) {
              var re = shouldDecodeNewlines
                ? encodedAttrWithNewLines
                : encodedAttr;
              return value.replace(re, function (match) {
                return decodingMap[match];
              });
            }
            function parseHTML(html, options) {
              var stack = [];
              var expectHTML = options.expectHTML;
              var isUnaryTag$$1 = options.isUnaryTag || no;
              var canBeLeftOpenTag$$1 = options.canBeLeftOpenTag || no;
              var index = 0;
              var last, lastTag;
              while (html) {
                last = html;
                if (!lastTag || !isPlainTextElement(lastTag)) {
                  var textEnd = html.indexOf("<");
                  if (textEnd === 0) {
                    if (comment.test(html)) {
                      var commentEnd = html.indexOf("--\x3e");
                      if (commentEnd >= 0) {
                        if (options.shouldKeepComment) {
                          options.comment(html.substring(4, commentEnd));
                        }
                        advance(commentEnd + 3);
                        continue;
                      }
                    }
                    if (conditionalComment.test(html)) {
                      var conditionalEnd = html.indexOf("]>");
                      if (conditionalEnd >= 0) {
                        advance(conditionalEnd + 2);
                        continue;
                      }
                    }
                    var doctypeMatch = html.match(doctype);
                    if (doctypeMatch) {
                      advance(doctypeMatch[0].length);
                      continue;
                    }
                    var endTagMatch = html.match(endTag);
                    if (endTagMatch) {
                      var curIndex = index;
                      advance(endTagMatch[0].length);
                      parseEndTag(endTagMatch[1], curIndex, index);
                      continue;
                    }
                    var startTagMatch = parseStartTag();
                    if (startTagMatch) {
                      handleStartTag(startTagMatch);
                      if (shouldIgnoreFirstNewline(lastTag, html)) {
                        advance(1);
                      }
                      continue;
                    }
                  }
                  var text = void 0,
                    rest = void 0,
                    next = void 0;
                  if (textEnd >= 0) {
                    rest = html.slice(textEnd);
                    while (
                      !endTag.test(rest) &&
                      !startTagOpen.test(rest) &&
                      !comment.test(rest) &&
                      !conditionalComment.test(rest)
                    ) {
                      next = rest.indexOf("<", 1);
                      if (next < 0) {
                        break;
                      }
                      textEnd += next;
                      rest = html.slice(textEnd);
                    }
                    text = html.substring(0, textEnd);
                    advance(textEnd);
                  }
                  if (textEnd < 0) {
                    text = html;
                    html = "";
                  }
                  if (options.chars && text) {
                    options.chars(text);
                  }
                } else {
                  var endTagLength = 0;
                  var stackedTag = lastTag.toLowerCase();
                  var reStackedTag =
                    reCache[stackedTag] ||
                    (reCache[stackedTag] = new RegExp(
                      "([\\s\\S]*?)(</" + stackedTag + "[^>]*>)",
                      "i"
                    ));
                  var rest$1 = html.replace(
                    reStackedTag,
                    function (all, text, endTag) {
                      endTagLength = endTag.length;
                      if (
                        !isPlainTextElement(stackedTag) &&
                        stackedTag !== "noscript"
                      ) {
                        text = text
                          .replace(/<!\--([\s\S]*?)-->/g, "$1")
                          .replace(/<!\[CDATA\[([\s\S]*?)]]>/g, "$1");
                      }
                      if (shouldIgnoreFirstNewline(stackedTag, text)) {
                        text = text.slice(1);
                      }
                      if (options.chars) {
                        options.chars(text);
                      }
                      return "";
                    }
                  );
                  index += html.length - rest$1.length;
                  html = rest$1;
                  parseEndTag(stackedTag, index - endTagLength, index);
                }
                if (html === last) {
                  options.chars && options.chars(html);
                  if (
                    "development" !== "production" &&
                    !stack.length &&
                    options.warn
                  ) {
                    options.warn(
                      'Mal-formatted tag at end of template: "' + html + '"'
                    );
                  }
                  break;
                }
              }
              parseEndTag();
              function advance(n) {
                index += n;
                html = html.substring(n);
              }
              function parseStartTag() {
                var start = html.match(startTagOpen);
                if (start) {
                  var match = { tagName: start[1], attrs: [], start: index };
                  advance(start[0].length);
                  var end, attr;
                  while (
                    !(end = html.match(startTagClose)) &&
                    (attr = html.match(attribute))
                  ) {
                    advance(attr[0].length);
                    match.attrs.push(attr);
                  }
                  if (end) {
                    match.unarySlash = end[1];
                    advance(end[0].length);
                    match.end = index;
                    return match;
                  }
                }
              }
              function handleStartTag(match) {
                var tagName = match.tagName;
                var unarySlash = match.unarySlash;
                if (expectHTML) {
                  if (lastTag === "p" && isNonPhrasingTag(tagName)) {
                    parseEndTag(lastTag);
                  }
                  if (canBeLeftOpenTag$$1(tagName) && lastTag === tagName) {
                    parseEndTag(tagName);
                  }
                }
                var unary = isUnaryTag$$1(tagName) || !!unarySlash;
                var l = match.attrs.length;
                var attrs = new Array(l);
                for (var i = 0; i < l; i++) {
                  var args = match.attrs[i];
                  if (
                    IS_REGEX_CAPTURING_BROKEN &&
                    args[0].indexOf('""') === -1
                  ) {
                    if (args[3] === "") {
                      delete args[3];
                    }
                    if (args[4] === "") {
                      delete args[4];
                    }
                    if (args[5] === "") {
                      delete args[5];
                    }
                  }
                  var value = args[3] || args[4] || args[5] || "";
                  var shouldDecodeNewlines =
                    tagName === "a" && args[1] === "href"
                      ? options.shouldDecodeNewlinesForHref
                      : options.shouldDecodeNewlines;
                  attrs[i] = {
                    name: args[1],
                    value: decodeAttr(value, shouldDecodeNewlines),
                  };
                }
                if (!unary) {
                  stack.push({
                    tag: tagName,
                    lowerCasedTag: tagName.toLowerCase(),
                    attrs: attrs,
                  });
                  lastTag = tagName;
                }
                if (options.start) {
                  options.start(tagName, attrs, unary, match.start, match.end);
                }
              }
              function parseEndTag(tagName, start, end) {
                var pos, lowerCasedTagName;
                if (start == null) {
                  start = index;
                }
                if (end == null) {
                  end = index;
                }
                if (tagName) {
                  lowerCasedTagName = tagName.toLowerCase();
                }
                if (tagName) {
                  for (pos = stack.length - 1; pos >= 0; pos--) {
                    if (stack[pos].lowerCasedTag === lowerCasedTagName) {
                      break;
                    }
                  }
                } else {
                  pos = 0;
                }
                if (pos >= 0) {
                  for (var i = stack.length - 1; i >= pos; i--) {
                    if (
                      "development" !== "production" &&
                      (i > pos || !tagName) &&
                      options.warn
                    ) {
                      options.warn(
                        "tag <" + stack[i].tag + "> has no matching end tag."
                      );
                    }
                    if (options.end) {
                      options.end(stack[i].tag, start, end);
                    }
                  }
                  stack.length = pos;
                  lastTag = pos && stack[pos - 1].tag;
                } else if (lowerCasedTagName === "br") {
                  if (options.start) {
                    options.start(tagName, [], true, start, end);
                  }
                } else if (lowerCasedTagName === "p") {
                  if (options.start) {
                    options.start(tagName, [], false, start, end);
                  }
                  if (options.end) {
                    options.end(tagName, start, end);
                  }
                }
              }
            }
            var onRE = /^@|^v-on:/;
            var dirRE = /^v-|^@|^:/;
            var forAliasRE = /([^]*?)\s+(?:in|of)\s+([^]*)/;
            var forIteratorRE = /,([^,\}\]]*)(?:,([^,\}\]]*))?$/;
            var stripParensRE = /^\(|\)$/g;
            var argRE = /:(.*)$/;
            var bindRE = /^:|^v-bind:/;
            var modifierRE = /\.[^.]+/g;
            var decodeHTMLCached = cached(he.decode);
            var warn$2;
            var delimiters;
            var transforms;
            var preTransforms;
            var postTransforms;
            var platformIsPreTag;
            var platformMustUseProp;
            var platformGetTagNamespace;
            function createASTElement(tag, attrs, parent) {
              return {
                type: 1,
                tag: tag,
                attrsList: attrs,
                attrsMap: makeAttrsMap(attrs),
                parent: parent,
                children: [],
              };
            }
            function parse(template, options) {
              warn$2 = options.warn || baseWarn;
              platformIsPreTag = options.isPreTag || no;
              platformMustUseProp = options.mustUseProp || no;
              platformGetTagNamespace = options.getTagNamespace || no;
              transforms = pluckModuleFunction(
                options.modules,
                "transformNode"
              );
              preTransforms = pluckModuleFunction(
                options.modules,
                "preTransformNode"
              );
              postTransforms = pluckModuleFunction(
                options.modules,
                "postTransformNode"
              );
              delimiters = options.delimiters;
              var stack = [];
              var preserveWhitespace = options.preserveWhitespace !== false;
              var root;
              var currentParent;
              var inVPre = false;
              var inPre = false;
              var warned = false;
              function warnOnce(msg) {
                if (!warned) {
                  warned = true;
                  warn$2(msg);
                }
              }
              function closeElement(element) {
                if (element.pre) {
                  inVPre = false;
                }
                if (platformIsPreTag(element.tag)) {
                  inPre = false;
                }
                for (var i = 0; i < postTransforms.length; i++) {
                  postTransforms[i](element, options);
                }
              }
              parseHTML(template, {
                warn: warn$2,
                expectHTML: options.expectHTML,
                isUnaryTag: options.isUnaryTag,
                canBeLeftOpenTag: options.canBeLeftOpenTag,
                shouldDecodeNewlines: options.shouldDecodeNewlines,
                shouldDecodeNewlinesForHref:
                  options.shouldDecodeNewlinesForHref,
                shouldKeepComment: options.comments,
                start: function start(tag, attrs, unary) {
                  var ns =
                    (currentParent && currentParent.ns) ||
                    platformGetTagNamespace(tag);
                  if (isIE && ns === "svg") {
                    attrs = guardIESVGBug(attrs);
                  }
                  var element = createASTElement(tag, attrs, currentParent);
                  if (ns) {
                    element.ns = ns;
                  }
                  if (isForbiddenTag(element) && !isServerRendering()) {
                    element.forbidden = true;
                    "development" !== "production" &&
                      warn$2(
                        "Templates should only be responsible for mapping the state to the " +
                          "UI. Avoid placing tags with side-effects in your templates, such as " +
                          "<" +
                          tag +
                          ">" +
                          ", as they will not be parsed."
                      );
                  }
                  for (var i = 0; i < preTransforms.length; i++) {
                    element = preTransforms[i](element, options) || element;
                  }
                  if (!inVPre) {
                    processPre(element);
                    if (element.pre) {
                      inVPre = true;
                    }
                  }
                  if (platformIsPreTag(element.tag)) {
                    inPre = true;
                  }
                  if (inVPre) {
                    processRawAttrs(element);
                  } else if (!element.processed) {
                    processFor(element);
                    processIf(element);
                    processOnce(element);
                    processElement(element, options);
                  }
                  function checkRootConstraints(el) {
                    {
                      if (el.tag === "slot" || el.tag === "template") {
                        warnOnce(
                          "Cannot use <" +
                            el.tag +
                            "> as component root element because it may " +
                            "contain multiple nodes."
                        );
                      }
                      if (el.attrsMap.hasOwnProperty("v-for")) {
                        warnOnce(
                          "Cannot use v-for on stateful component root element because " +
                            "it renders multiple elements."
                        );
                      }
                    }
                  }
                  if (!root) {
                    root = element;
                    checkRootConstraints(root);
                  } else if (!stack.length) {
                    if (root.if && (element.elseif || element.else)) {
                      checkRootConstraints(element);
                      addIfCondition(root, {
                        exp: element.elseif,
                        block: element,
                      });
                    } else {
                      warnOnce(
                        "Component template should contain exactly one root element. " +
                          "If you are using v-if on multiple elements, " +
                          "use v-else-if to chain them instead."
                      );
                    }
                  }
                  if (currentParent && !element.forbidden) {
                    if (element.elseif || element.else) {
                      processIfConditions(element, currentParent);
                    } else if (element.slotScope) {
                      currentParent.plain = false;
                      var name = element.slotTarget || '"default"';
                      (currentParent.scopedSlots ||
                        (currentParent.scopedSlots = {}))[name] = element;
                    } else {
                      currentParent.children.push(element);
                      element.parent = currentParent;
                    }
                  }
                  if (!unary) {
                    currentParent = element;
                    stack.push(element);
                  } else {
                    closeElement(element);
                  }
                },
                end: function end() {
                  var element = stack[stack.length - 1];
                  var lastNode = element.children[element.children.length - 1];
                  if (
                    lastNode &&
                    lastNode.type === 3 &&
                    lastNode.text === " " &&
                    !inPre
                  ) {
                    element.children.pop();
                  }
                  stack.length -= 1;
                  currentParent = stack[stack.length - 1];
                  closeElement(element);
                },
                chars: function chars(text) {
                  if (!currentParent) {
                    {
                      if (text === template) {
                        warnOnce(
                          "Component template requires a root element, rather than just text."
                        );
                      } else if ((text = text.trim())) {
                        warnOnce(
                          'text "' +
                            text +
                            '" outside root element will be ignored.'
                        );
                      }
                    }
                    return;
                  }
                  if (
                    isIE &&
                    currentParent.tag === "textarea" &&
                    currentParent.attrsMap.placeholder === text
                  ) {
                    return;
                  }
                  var children = currentParent.children;
                  text =
                    inPre || text.trim()
                      ? isTextTag(currentParent)
                        ? text
                        : decodeHTMLCached(text)
                      : preserveWhitespace && children.length
                      ? " "
                      : "";
                  if (text) {
                    var res;
                    if (
                      !inVPre &&
                      text !== " " &&
                      (res = parseText(text, delimiters))
                    ) {
                      children.push({
                        type: 2,
                        expression: res.expression,
                        tokens: res.tokens,
                        text: text,
                      });
                    } else if (
                      text !== " " ||
                      !children.length ||
                      children[children.length - 1].text !== " "
                    ) {
                      children.push({ type: 3, text: text });
                    }
                  }
                },
                comment: function comment(text) {
                  currentParent.children.push({
                    type: 3,
                    text: text,
                    isComment: true,
                  });
                },
              });
              return root;
            }
            function processPre(el) {
              if (getAndRemoveAttr(el, "v-pre") != null) {
                el.pre = true;
              }
            }
            function processRawAttrs(el) {
              var l = el.attrsList.length;
              if (l) {
                var attrs = (el.attrs = new Array(l));
                for (var i = 0; i < l; i++) {
                  attrs[i] = {
                    name: el.attrsList[i].name,
                    value: JSON.stringify(el.attrsList[i].value),
                  };
                }
              } else if (!el.pre) {
                el.plain = true;
              }
            }
            function processElement(element, options) {
              processKey(element);
              element.plain = !element.key && !element.attrsList.length;
              processRef(element);
              processSlot(element);
              processComponent(element);
              for (var i = 0; i < transforms.length; i++) {
                element = transforms[i](element, options) || element;
              }
              processAttrs(element);
            }
            function processKey(el) {
              var exp = getBindingAttr(el, "key");
              if (exp) {
                if ("development" !== "production" && el.tag === "template") {
                  warn$2(
                    "<template> cannot be keyed. Place the key on real elements instead."
                  );
                }
                el.key = exp;
              }
            }
            function processRef(el) {
              var ref = getBindingAttr(el, "ref");
              if (ref) {
                el.ref = ref;
                el.refInFor = checkInFor(el);
              }
            }
            function processFor(el) {
              var exp;
              if ((exp = getAndRemoveAttr(el, "v-for"))) {
                var res = parseFor(exp);
                if (res) {
                  extend(el, res);
                } else {
                  warn$2("Invalid v-for expression: " + exp);
                }
              }
            }
            function parseFor(exp) {
              var inMatch = exp.match(forAliasRE);
              if (!inMatch) {
                return;
              }
              var res = {};
              res.for = inMatch[2].trim();
              var alias = inMatch[1].trim().replace(stripParensRE, "");
              var iteratorMatch = alias.match(forIteratorRE);
              if (iteratorMatch) {
                res.alias = alias.replace(forIteratorRE, "");
                res.iterator1 = iteratorMatch[1].trim();
                if (iteratorMatch[2]) {
                  res.iterator2 = iteratorMatch[2].trim();
                }
              } else {
                res.alias = alias;
              }
              return res;
            }
            function processIf(el) {
              var exp = getAndRemoveAttr(el, "v-if");
              if (exp) {
                el.if = exp;
                addIfCondition(el, { exp: exp, block: el });
              } else {
                if (getAndRemoveAttr(el, "v-else") != null) {
                  el.else = true;
                }
                var elseif = getAndRemoveAttr(el, "v-else-if");
                if (elseif) {
                  el.elseif = elseif;
                }
              }
            }
            function processIfConditions(el, parent) {
              var prev = findPrevElement(parent.children);
              if (prev && prev.if) {
                addIfCondition(prev, { exp: el.elseif, block: el });
              } else {
                warn$2(
                  "v-" +
                    (el.elseif ? 'else-if="' + el.elseif + '"' : "else") +
                    " " +
                    "used on element <" +
                    el.tag +
                    "> without corresponding v-if."
                );
              }
            }
            function findPrevElement(children) {
              var i = children.length;
              while (i--) {
                if (children[i].type === 1) {
                  return children[i];
                } else {
                  if (
                    "development" !== "production" &&
                    children[i].text !== " "
                  ) {
                    warn$2(
                      'text "' +
                        children[i].text.trim() +
                        '" between v-if and v-else(-if) ' +
                        "will be ignored."
                    );
                  }
                  children.pop();
                }
              }
            }
            function addIfCondition(el, condition) {
              if (!el.ifConditions) {
                el.ifConditions = [];
              }
              el.ifConditions.push(condition);
            }
            function processOnce(el) {
              var once$$1 = getAndRemoveAttr(el, "v-once");
              if (once$$1 != null) {
                el.once = true;
              }
            }
            function processSlot(el) {
              if (el.tag === "slot") {
                el.slotName = getBindingAttr(el, "name");
                if ("development" !== "production" && el.key) {
                  warn$2(
                    "`key` does not work on <slot> because slots are abstract outlets " +
                      "and can possibly expand into multiple elements. " +
                      "Use the key on a wrapping element instead."
                  );
                }
              } else {
                var slotScope;
                if (el.tag === "template") {
                  slotScope = getAndRemoveAttr(el, "scope");
                  if ("development" !== "production" && slotScope) {
                    warn$2(
                      'the "scope" attribute for scoped slots have been deprecated and ' +
                        'replaced by "slot-scope" since 2.5. The new "slot-scope" attribute ' +
                        "can also be used on plain elements in addition to <template> to " +
                        "denote scoped slots.",
                      true
                    );
                  }
                  el.slotScope =
                    slotScope || getAndRemoveAttr(el, "slot-scope");
                } else if ((slotScope = getAndRemoveAttr(el, "slot-scope"))) {
                  if ("development" !== "production" && el.attrsMap["v-for"]) {
                    warn$2(
                      "Ambiguous combined usage of slot-scope and v-for on <" +
                        el.tag +
                        "> " +
                        "(v-for takes higher priority). Use a wrapper <template> for the " +
                        "scoped slot to make it clearer.",
                      true
                    );
                  }
                  el.slotScope = slotScope;
                }
                var slotTarget = getBindingAttr(el, "slot");
                if (slotTarget) {
                  el.slotTarget =
                    slotTarget === '""' ? '"default"' : slotTarget;
                  if (el.tag !== "template" && !el.slotScope) {
                    addAttr(el, "slot", slotTarget);
                  }
                }
              }
            }
            function processComponent(el) {
              var binding;
              if ((binding = getBindingAttr(el, "is"))) {
                el.component = binding;
              }
              if (getAndRemoveAttr(el, "inline-template") != null) {
                el.inlineTemplate = true;
              }
            }
            function processAttrs(el) {
              var list = el.attrsList;
              var i, l, name, rawName, value, modifiers, isProp;
              for (i = 0, l = list.length; i < l; i++) {
                name = rawName = list[i].name;
                value = list[i].value;
                if (dirRE.test(name)) {
                  el.hasBindings = true;
                  modifiers = parseModifiers(name);
                  if (modifiers) {
                    name = name.replace(modifierRE, "");
                  }
                  if (bindRE.test(name)) {
                    name = name.replace(bindRE, "");
                    value = parseFilters(value);
                    isProp = false;
                    if (modifiers) {
                      if (modifiers.prop) {
                        isProp = true;
                        name = camelize(name);
                        if (name === "innerHtml") {
                          name = "innerHTML";
                        }
                      }
                      if (modifiers.camel) {
                        name = camelize(name);
                      }
                      if (modifiers.sync) {
                        addHandler(
                          el,
                          "update:" + camelize(name),
                          genAssignmentCode(value, "$event")
                        );
                      }
                    }
                    if (
                      isProp ||
                      (!el.component &&
                        platformMustUseProp(el.tag, el.attrsMap.type, name))
                    ) {
                      addProp(el, name, value);
                    } else {
                      addAttr(el, name, value);
                    }
                  } else if (onRE.test(name)) {
                    name = name.replace(onRE, "");
                    addHandler(el, name, value, modifiers, false, warn$2);
                  } else {
                    name = name.replace(dirRE, "");
                    var argMatch = name.match(argRE);
                    var arg = argMatch && argMatch[1];
                    if (arg) {
                      name = name.slice(0, -(arg.length + 1));
                    }
                    addDirective(el, name, rawName, value, arg, modifiers);
                    if ("development" !== "production" && name === "model") {
                      checkForAliasModel(el, value);
                    }
                  }
                } else {
                  {
                    var res = parseText(value, delimiters);
                    if (res) {
                      warn$2(
                        name +
                          '="' +
                          value +
                          '": ' +
                          "Interpolation inside attributes has been removed. " +
                          "Use v-bind or the colon shorthand instead. For example, " +
                          'instead of <div id="{{ val }}">, use <div :id="val">.'
                      );
                    }
                  }
                  addAttr(el, name, JSON.stringify(value));
                  if (
                    !el.component &&
                    name === "muted" &&
                    platformMustUseProp(el.tag, el.attrsMap.type, name)
                  ) {
                    addProp(el, name, "true");
                  }
                }
              }
            }
            function checkInFor(el) {
              var parent = el;
              while (parent) {
                if (parent.for !== undefined) {
                  return true;
                }
                parent = parent.parent;
              }
              return false;
            }
            function parseModifiers(name) {
              var match = name.match(modifierRE);
              if (match) {
                var ret = {};
                match.forEach(function (m) {
                  ret[m.slice(1)] = true;
                });
                return ret;
              }
            }
            function makeAttrsMap(attrs) {
              var map = {};
              for (var i = 0, l = attrs.length; i < l; i++) {
                if (
                  "development" !== "production" &&
                  map[attrs[i].name] &&
                  !isIE &&
                  !isEdge
                ) {
                  warn$2("duplicate attribute: " + attrs[i].name);
                }
                map[attrs[i].name] = attrs[i].value;
              }
              return map;
            }
            function isTextTag(el) {
              return el.tag === "script" || el.tag === "style";
            }
            function isForbiddenTag(el) {
              return (
                el.tag === "style" ||
                (el.tag === "script" &&
                  (!el.attrsMap.type || el.attrsMap.type === "text/javascript"))
              );
            }
            var ieNSBug = /^xmlns:NS\d+/;
            var ieNSPrefix = /^NS\d+:/;
            function guardIESVGBug(attrs) {
              var res = [];
              for (var i = 0; i < attrs.length; i++) {
                var attr = attrs[i];
                if (!ieNSBug.test(attr.name)) {
                  attr.name = attr.name.replace(ieNSPrefix, "");
                  res.push(attr);
                }
              }
              return res;
            }
            function checkForAliasModel(el, value) {
              var _el = el;
              while (_el) {
                if (_el.for && _el.alias === value) {
                  warn$2(
                    "<" +
                      el.tag +
                      ' v-model="' +
                      value +
                      '">: ' +
                      "You are binding v-model directly to a v-for iteration alias. " +
                      "This will not be able to modify the v-for source array because " +
                      "writing to the alias is like modifying a function local variable. " +
                      "Consider using an array of objects and use v-model on an object property instead."
                  );
                }
                _el = _el.parent;
              }
            }
            function preTransformNode(el, options) {
              if (el.tag === "input") {
                var map = el.attrsMap;
                if (!map["v-model"]) {
                  return;
                }
                var typeBinding;
                if (map[":type"] || map["v-bind:type"]) {
                  typeBinding = getBindingAttr(el, "type");
                }
                if (!map.type && !typeBinding && map["v-bind"]) {
                  typeBinding = "(" + map["v-bind"] + ").type";
                }
                if (typeBinding) {
                  var ifCondition = getAndRemoveAttr(el, "v-if", true);
                  var ifConditionExtra = ifCondition
                    ? "&&(" + ifCondition + ")"
                    : "";
                  var hasElse = getAndRemoveAttr(el, "v-else", true) != null;
                  var elseIfCondition = getAndRemoveAttr(el, "v-else-if", true);
                  var branch0 = cloneASTElement(el);
                  processFor(branch0);
                  addRawAttr(branch0, "type", "checkbox");
                  processElement(branch0, options);
                  branch0.processed = true;
                  branch0.if =
                    "(" + typeBinding + ")==='checkbox'" + ifConditionExtra;
                  addIfCondition(branch0, { exp: branch0.if, block: branch0 });
                  var branch1 = cloneASTElement(el);
                  getAndRemoveAttr(branch1, "v-for", true);
                  addRawAttr(branch1, "type", "radio");
                  processElement(branch1, options);
                  addIfCondition(branch0, {
                    exp: "(" + typeBinding + ")==='radio'" + ifConditionExtra,
                    block: branch1,
                  });
                  var branch2 = cloneASTElement(el);
                  getAndRemoveAttr(branch2, "v-for", true);
                  addRawAttr(branch2, ":type", typeBinding);
                  processElement(branch2, options);
                  addIfCondition(branch0, { exp: ifCondition, block: branch2 });
                  if (hasElse) {
                    branch0.else = true;
                  } else if (elseIfCondition) {
                    branch0.elseif = elseIfCondition;
                  }
                  return branch0;
                }
              }
            }
            function cloneASTElement(el) {
              return createASTElement(el.tag, el.attrsList.slice(), el.parent);
            }
            var model$2 = { preTransformNode: preTransformNode };
            var modules$1 = [klass$1, style$1, model$2];
            function text(el, dir) {
              if (dir.value) {
                addProp(el, "textContent", "_s(" + dir.value + ")");
              }
            }
            function html(el, dir) {
              if (dir.value) {
                addProp(el, "innerHTML", "_s(" + dir.value + ")");
              }
            }
            var directives$1 = { model: model, text: text, html: html };
            var baseOptions = {
              expectHTML: true,
              modules: modules$1,
              directives: directives$1,
              isPreTag: isPreTag,
              isUnaryTag: isUnaryTag,
              mustUseProp: mustUseProp,
              canBeLeftOpenTag: canBeLeftOpenTag,
              isReservedTag: isReservedTag,
              getTagNamespace: getTagNamespace,
              staticKeys: genStaticKeys(modules$1),
            };
            var isStaticKey;
            var isPlatformReservedTag;
            var genStaticKeysCached = cached(genStaticKeys$1);
            function optimize(root, options) {
              if (!root) {
                return;
              }
              isStaticKey = genStaticKeysCached(options.staticKeys || "");
              isPlatformReservedTag = options.isReservedTag || no;
              markStatic$1(root);
              markStaticRoots(root, false);
            }
            function genStaticKeys$1(keys) {
              return makeMap(
                "type,tag,attrsList,attrsMap,plain,parent,children,attrs" +
                  (keys ? "," + keys : "")
              );
            }
            function markStatic$1(node) {
              node.static = isStatic(node);
              if (node.type === 1) {
                if (
                  !isPlatformReservedTag(node.tag) &&
                  node.tag !== "slot" &&
                  node.attrsMap["inline-template"] == null
                ) {
                  return;
                }
                for (var i = 0, l = node.children.length; i < l; i++) {
                  var child = node.children[i];
                  markStatic$1(child);
                  if (!child.static) {
                    node.static = false;
                  }
                }
                if (node.ifConditions) {
                  for (
                    var i$1 = 1, l$1 = node.ifConditions.length;
                    i$1 < l$1;
                    i$1++
                  ) {
                    var block = node.ifConditions[i$1].block;
                    markStatic$1(block);
                    if (!block.static) {
                      node.static = false;
                    }
                  }
                }
              }
            }
            function markStaticRoots(node, isInFor) {
              if (node.type === 1) {
                if (node.static || node.once) {
                  node.staticInFor = isInFor;
                }
                if (
                  node.static &&
                  node.children.length &&
                  !(node.children.length === 1 && node.children[0].type === 3)
                ) {
                  node.staticRoot = true;
                  return;
                } else {
                  node.staticRoot = false;
                }
                if (node.children) {
                  for (var i = 0, l = node.children.length; i < l; i++) {
                    markStaticRoots(node.children[i], isInFor || !!node.for);
                  }
                }
                if (node.ifConditions) {
                  for (
                    var i$1 = 1, l$1 = node.ifConditions.length;
                    i$1 < l$1;
                    i$1++
                  ) {
                    markStaticRoots(node.ifConditions[i$1].block, isInFor);
                  }
                }
              }
            }
            function isStatic(node) {
              if (node.type === 2) {
                return false;
              }
              if (node.type === 3) {
                return true;
              }
              return !!(
                node.pre ||
                (!node.hasBindings &&
                  !node.if &&
                  !node.for &&
                  !isBuiltInTag(node.tag) &&
                  isPlatformReservedTag(node.tag) &&
                  !isDirectChildOfTemplateFor(node) &&
                  Object.keys(node).every(isStaticKey))
              );
            }
            function isDirectChildOfTemplateFor(node) {
              while (node.parent) {
                node = node.parent;
                if (node.tag !== "template") {
                  return false;
                }
                if (node.for) {
                  return true;
                }
              }
              return false;
            }
            var fnExpRE = /^([\w$_]+|\([^)]*?\))\s*=>|^function\s*\(/;
            var simplePathRE =
              /^[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*|\['[^']*?']|\["[^"]*?"]|\[\d+]|\[[A-Za-z_$][\w$]*])*$/;
            var keyCodes = {
              esc: 27,
              tab: 9,
              enter: 13,
              space: 32,
              up: 38,
              left: 37,
              right: 39,
              down: 40,
              delete: [8, 46],
            };
            var keyNames = {
              esc: "Escape",
              tab: "Tab",
              enter: "Enter",
              space: " ",
              up: ["Up", "ArrowUp"],
              left: ["Left", "ArrowLeft"],
              right: ["Right", "ArrowRight"],
              down: ["Down", "ArrowDown"],
              delete: ["Backspace", "Delete"],
            };
            var genGuard = function (condition) {
              return "if(" + condition + ")return null;";
            };
            var modifierCode = {
              stop: "$event.stopPropagation();",
              prevent: "$event.preventDefault();",
              self: genGuard("$event.target !== $event.currentTarget"),
              ctrl: genGuard("!$event.ctrlKey"),
              shift: genGuard("!$event.shiftKey"),
              alt: genGuard("!$event.altKey"),
              meta: genGuard("!$event.metaKey"),
              left: genGuard("'button' in $event && $event.button !== 0"),
              middle: genGuard("'button' in $event && $event.button !== 1"),
              right: genGuard("'button' in $event && $event.button !== 2"),
            };
            function genHandlers(events, isNative, warn) {
              var res = isNative ? "nativeOn:{" : "on:{";
              for (var name in events) {
                res += '"' + name + '":' + genHandler(name, events[name]) + ",";
              }
              return res.slice(0, -1) + "}";
            }
            function genHandler(name, handler) {
              if (!handler) {
                return "function(){}";
              }
              if (Array.isArray(handler)) {
                return (
                  "[" +
                  handler
                    .map(function (handler) {
                      return genHandler(name, handler);
                    })
                    .join(",") +
                  "]"
                );
              }
              var isMethodPath = simplePathRE.test(handler.value);
              var isFunctionExpression = fnExpRE.test(handler.value);
              if (!handler.modifiers) {
                if (isMethodPath || isFunctionExpression) {
                  return handler.value;
                }
                return "function($event){" + handler.value + "}";
              } else {
                var code = "";
                var genModifierCode = "";
                var keys = [];
                for (var key in handler.modifiers) {
                  if (modifierCode[key]) {
                    genModifierCode += modifierCode[key];
                    if (keyCodes[key]) {
                      keys.push(key);
                    }
                  } else if (key === "exact") {
                    var modifiers = handler.modifiers;
                    genModifierCode += genGuard(
                      ["ctrl", "shift", "alt", "meta"]
                        .filter(function (keyModifier) {
                          return !modifiers[keyModifier];
                        })
                        .map(function (keyModifier) {
                          return "$event." + keyModifier + "Key";
                        })
                        .join("||")
                    );
                  } else {
                    keys.push(key);
                  }
                }
                if (keys.length) {
                  code += genKeyFilter(keys);
                }
                if (genModifierCode) {
                  code += genModifierCode;
                }
                var handlerCode = isMethodPath
                  ? "return " + handler.value + "($event)"
                  : isFunctionExpression
                  ? "return (" + handler.value + ")($event)"
                  : handler.value;
                return "function($event){" + code + handlerCode + "}";
              }
            }
            function genKeyFilter(keys) {
              return (
                "if(!('button' in $event)&&" +
                keys.map(genFilterCode).join("&&") +
                ")return null;"
              );
            }
            function genFilterCode(key) {
              var keyVal = parseInt(key, 10);
              if (keyVal) {
                return "$event.keyCode!==" + keyVal;
              }
              var keyCode = keyCodes[key];
              var keyName = keyNames[key];
              return (
                "_k($event.keyCode," +
                JSON.stringify(key) +
                "," +
                JSON.stringify(keyCode) +
                "," +
                "$event.key," +
                "" +
                JSON.stringify(keyName) +
                ")"
              );
            }
            function on(el, dir) {
              if ("development" !== "production" && dir.modifiers) {
                warn("v-on without argument does not support modifiers.");
              }
              el.wrapListeners = function (code) {
                return "_g(" + code + "," + dir.value + ")";
              };
            }
            function bind$1(el, dir) {
              el.wrapData = function (code) {
                return (
                  "_b(" +
                  code +
                  ",'" +
                  el.tag +
                  "'," +
                  dir.value +
                  "," +
                  (dir.modifiers && dir.modifiers.prop ? "true" : "false") +
                  (dir.modifiers && dir.modifiers.sync ? ",true" : "") +
                  ")"
                );
              };
            }
            var baseDirectives = { on: on, bind: bind$1, cloak: noop };
            var CodegenState = function CodegenState(options) {
              this.options = options;
              this.warn = options.warn || baseWarn;
              this.transforms = pluckModuleFunction(
                options.modules,
                "transformCode"
              );
              this.dataGenFns = pluckModuleFunction(options.modules, "genData");
              this.directives = extend(
                extend({}, baseDirectives),
                options.directives
              );
              var isReservedTag = options.isReservedTag || no;
              this.maybeComponent = function (el) {
                return !isReservedTag(el.tag);
              };
              this.onceId = 0;
              this.staticRenderFns = [];
            };
            function generate(ast, options) {
              var state = new CodegenState(options);
              var code = ast ? genElement(ast, state) : '_c("div")';
              return {
                render: "with(this){return " + code + "}",
                staticRenderFns: state.staticRenderFns,
              };
            }
            function genElement(el, state) {
              if (el.staticRoot && !el.staticProcessed) {
                return genStatic(el, state);
              } else if (el.once && !el.onceProcessed) {
                return genOnce(el, state);
              } else if (el.for && !el.forProcessed) {
                return genFor(el, state);
              } else if (el.if && !el.ifProcessed) {
                return genIf(el, state);
              } else if (el.tag === "template" && !el.slotTarget) {
                return genChildren(el, state) || "void 0";
              } else if (el.tag === "slot") {
                return genSlot(el, state);
              } else {
                var code;
                if (el.component) {
                  code = genComponent(el.component, el, state);
                } else {
                  var data = el.plain ? undefined : genData$2(el, state);
                  var children = el.inlineTemplate
                    ? null
                    : genChildren(el, state, true);
                  code =
                    "_c('" +
                    el.tag +
                    "'" +
                    (data ? "," + data : "") +
                    (children ? "," + children : "") +
                    ")";
                }
                for (var i = 0; i < state.transforms.length; i++) {
                  code = state.transforms[i](el, code);
                }
                return code;
              }
            }
            function genStatic(el, state) {
              el.staticProcessed = true;
              state.staticRenderFns.push(
                "with(this){return " + genElement(el, state) + "}"
              );
              return (
                "_m(" +
                (state.staticRenderFns.length - 1) +
                (el.staticInFor ? ",true" : "") +
                ")"
              );
            }
            function genOnce(el, state) {
              el.onceProcessed = true;
              if (el.if && !el.ifProcessed) {
                return genIf(el, state);
              } else if (el.staticInFor) {
                var key = "";
                var parent = el.parent;
                while (parent) {
                  if (parent.for) {
                    key = parent.key;
                    break;
                  }
                  parent = parent.parent;
                }
                if (!key) {
                  "development" !== "production" &&
                    state.warn(
                      "v-once can only be used inside v-for that is keyed. "
                    );
                  return genElement(el, state);
                }
                return (
                  "_o(" +
                  genElement(el, state) +
                  "," +
                  state.onceId++ +
                  "," +
                  key +
                  ")"
                );
              } else {
                return genStatic(el, state);
              }
            }
            function genIf(el, state, altGen, altEmpty) {
              el.ifProcessed = true;
              return genIfConditions(
                el.ifConditions.slice(),
                state,
                altGen,
                altEmpty
              );
            }
            function genIfConditions(conditions, state, altGen, altEmpty) {
              if (!conditions.length) {
                return altEmpty || "_e()";
              }
              var condition = conditions.shift();
              if (condition.exp) {
                return (
                  "(" +
                  condition.exp +
                  ")?" +
                  genTernaryExp(condition.block) +
                  ":" +
                  genIfConditions(conditions, state, altGen, altEmpty)
                );
              } else {
                return "" + genTernaryExp(condition.block);
              }
              function genTernaryExp(el) {
                return altGen
                  ? altGen(el, state)
                  : el.once
                  ? genOnce(el, state)
                  : genElement(el, state);
              }
            }
            function genFor(el, state, altGen, altHelper) {
              var exp = el.for;
              var alias = el.alias;
              var iterator1 = el.iterator1 ? "," + el.iterator1 : "";
              var iterator2 = el.iterator2 ? "," + el.iterator2 : "";
              if (
                "development" !== "production" &&
                state.maybeComponent(el) &&
                el.tag !== "slot" &&
                el.tag !== "template" &&
                !el.key
              ) {
                state.warn(
                  "<" +
                    el.tag +
                    ' v-for="' +
                    alias +
                    " in " +
                    exp +
                    '">: component lists rendered with ' +
                    "v-for should have explicit keys. " +
                    "See https://vuejs.org/guide/list.html#key for more info.",
                  true
                );
              }
              el.forProcessed = true;
              return (
                (altHelper || "_l") +
                "((" +
                exp +
                ")," +
                "function(" +
                alias +
                iterator1 +
                iterator2 +
                "){" +
                "return " +
                (altGen || genElement)(el, state) +
                "})"
              );
            }
            function genData$2(el, state) {
              var data = "{";
              var dirs = genDirectives(el, state);
              if (dirs) {
                data += dirs + ",";
              }
              if (el.key) {
                data += "key:" + el.key + ",";
              }
              if (el.ref) {
                data += "ref:" + el.ref + ",";
              }
              if (el.refInFor) {
                data += "refInFor:true,";
              }
              if (el.pre) {
                data += "pre:true,";
              }
              if (el.component) {
                data += 'tag:"' + el.tag + '",';
              }
              for (var i = 0; i < state.dataGenFns.length; i++) {
                data += state.dataGenFns[i](el);
              }
              if (el.attrs) {
                data += "attrs:{" + genProps(el.attrs) + "},";
              }
              if (el.props) {
                data += "domProps:{" + genProps(el.props) + "},";
              }
              if (el.events) {
                data += genHandlers(el.events, false, state.warn) + ",";
              }
              if (el.nativeEvents) {
                data += genHandlers(el.nativeEvents, true, state.warn) + ",";
              }
              if (el.slotTarget && !el.slotScope) {
                data += "slot:" + el.slotTarget + ",";
              }
              if (el.scopedSlots) {
                data += genScopedSlots(el.scopedSlots, state) + ",";
              }
              if (el.model) {
                data +=
                  "model:{value:" +
                  el.model.value +
                  ",callback:" +
                  el.model.callback +
                  ",expression:" +
                  el.model.expression +
                  "},";
              }
              if (el.inlineTemplate) {
                var inlineTemplate = genInlineTemplate(el, state);
                if (inlineTemplate) {
                  data += inlineTemplate + ",";
                }
              }
              data = data.replace(/,$/, "") + "}";
              if (el.wrapData) {
                data = el.wrapData(data);
              }
              if (el.wrapListeners) {
                data = el.wrapListeners(data);
              }
              return data;
            }
            function genDirectives(el, state) {
              var dirs = el.directives;
              if (!dirs) {
                return;
              }
              var res = "directives:[";
              var hasRuntime = false;
              var i, l, dir, needRuntime;
              for (i = 0, l = dirs.length; i < l; i++) {
                dir = dirs[i];
                needRuntime = true;
                var gen = state.directives[dir.name];
                if (gen) {
                  needRuntime = !!gen(el, dir, state.warn);
                }
                if (needRuntime) {
                  hasRuntime = true;
                  res +=
                    '{name:"' +
                    dir.name +
                    '",rawName:"' +
                    dir.rawName +
                    '"' +
                    (dir.value
                      ? ",value:(" +
                        dir.value +
                        "),expression:" +
                        JSON.stringify(dir.value)
                      : "") +
                    (dir.arg ? ',arg:"' + dir.arg + '"' : "") +
                    (dir.modifiers
                      ? ",modifiers:" + JSON.stringify(dir.modifiers)
                      : "") +
                    "},";
                }
              }
              if (hasRuntime) {
                return res.slice(0, -1) + "]";
              }
            }
            function genInlineTemplate(el, state) {
              var ast = el.children[0];
              if (
                "development" !== "production" &&
                (el.children.length !== 1 || ast.type !== 1)
              ) {
                state.warn(
                  "Inline-template components must have exactly one child element."
                );
              }
              if (ast.type === 1) {
                var inlineRenderFns = generate(ast, state.options);
                return (
                  "inlineTemplate:{render:function(){" +
                  inlineRenderFns.render +
                  "},staticRenderFns:[" +
                  inlineRenderFns.staticRenderFns
                    .map(function (code) {
                      return "function(){" + code + "}";
                    })
                    .join(",") +
                  "]}"
                );
              }
            }
            function genScopedSlots(slots, state) {
              return (
                "scopedSlots:_u([" +
                Object.keys(slots)
                  .map(function (key) {
                    return genScopedSlot(key, slots[key], state);
                  })
                  .join(",") +
                "])"
              );
            }
            function genScopedSlot(key, el, state) {
              if (el.for && !el.forProcessed) {
                return genForScopedSlot(key, el, state);
              }
              var fn =
                "function(" +
                String(el.slotScope) +
                "){" +
                "return " +
                (el.tag === "template"
                  ? el.if
                    ? el.if +
                      "?" +
                      (genChildren(el, state) || "undefined") +
                      ":undefined"
                    : genChildren(el, state) || "undefined"
                  : genElement(el, state)) +
                "}";
              return "{key:" + key + ",fn:" + fn + "}";
            }
            function genForScopedSlot(key, el, state) {
              var exp = el.for;
              var alias = el.alias;
              var iterator1 = el.iterator1 ? "," + el.iterator1 : "";
              var iterator2 = el.iterator2 ? "," + el.iterator2 : "";
              el.forProcessed = true;
              return (
                "_l((" +
                exp +
                ")," +
                "function(" +
                alias +
                iterator1 +
                iterator2 +
                "){" +
                "return " +
                genScopedSlot(key, el, state) +
                "})"
              );
            }
            function genChildren(
              el,
              state,
              checkSkip,
              altGenElement,
              altGenNode
            ) {
              var children = el.children;
              if (children.length) {
                var el$1 = children[0];
                if (
                  children.length === 1 &&
                  el$1.for &&
                  el$1.tag !== "template" &&
                  el$1.tag !== "slot"
                ) {
                  return (altGenElement || genElement)(el$1, state);
                }
                var normalizationType = checkSkip
                  ? getNormalizationType(children, state.maybeComponent)
                  : 0;
                var gen = altGenNode || genNode;
                return (
                  "[" +
                  children
                    .map(function (c) {
                      return gen(c, state);
                    })
                    .join(",") +
                  "]" +
                  (normalizationType ? "," + normalizationType : "")
                );
              }
            }
            function getNormalizationType(children, maybeComponent) {
              var res = 0;
              for (var i = 0; i < children.length; i++) {
                var el = children[i];
                if (el.type !== 1) {
                  continue;
                }
                if (
                  needsNormalization(el) ||
                  (el.ifConditions &&
                    el.ifConditions.some(function (c) {
                      return needsNormalization(c.block);
                    }))
                ) {
                  res = 2;
                  break;
                }
                if (
                  maybeComponent(el) ||
                  (el.ifConditions &&
                    el.ifConditions.some(function (c) {
                      return maybeComponent(c.block);
                    }))
                ) {
                  res = 1;
                }
              }
              return res;
            }
            function needsNormalization(el) {
              return (
                el.for !== undefined ||
                el.tag === "template" ||
                el.tag === "slot"
              );
            }
            function genNode(node, state) {
              if (node.type === 1) {
                return genElement(node, state);
              }
              if (node.type === 3 && node.isComment) {
                return genComment(node);
              } else {
                return genText(node);
              }
            }
            function genText(text) {
              return (
                "_v(" +
                (text.type === 2
                  ? text.expression
                  : transformSpecialNewlines(JSON.stringify(text.text))) +
                ")"
              );
            }
            function genComment(comment) {
              return "_e(" + JSON.stringify(comment.text) + ")";
            }
            function genSlot(el, state) {
              var slotName = el.slotName || '"default"';
              var children = genChildren(el, state);
              var res = "_t(" + slotName + (children ? "," + children : "");
              var attrs =
                el.attrs &&
                "{" +
                  el.attrs
                    .map(function (a) {
                      return camelize(a.name) + ":" + a.value;
                    })
                    .join(",") +
                  "}";
              var bind$$1 = el.attrsMap["v-bind"];
              if ((attrs || bind$$1) && !children) {
                res += ",null";
              }
              if (attrs) {
                res += "," + attrs;
              }
              if (bind$$1) {
                res += (attrs ? "" : ",null") + "," + bind$$1;
              }
              return res + ")";
            }
            function genComponent(componentName, el, state) {
              var children = el.inlineTemplate
                ? null
                : genChildren(el, state, true);
              return (
                "_c(" +
                componentName +
                "," +
                genData$2(el, state) +
                (children ? "," + children : "") +
                ")"
              );
            }
            function genProps(props) {
              var res = "";
              for (var i = 0; i < props.length; i++) {
                var prop = props[i];
                {
                  res +=
                    '"' +
                    prop.name +
                    '":' +
                    transformSpecialNewlines(prop.value) +
                    ",";
                }
              }
              return res.slice(0, -1);
            }
            function transformSpecialNewlines(text) {
              return text
                .replace(/\u2028/g, "\\u2028")
                .replace(/\u2029/g, "\\u2029");
            }
            var prohibitedKeywordRE = new RegExp(
              "\\b" +
                (
                  "do,if,for,let,new,try,var,case,else,with,await,break,catch,class,const," +
                  "super,throw,while,yield,delete,export,import,return,switch,default," +
                  "extends,finally,continue,debugger,function,arguments"
                )
                  .split(",")
                  .join("\\b|\\b") +
                "\\b"
            );
            var unaryOperatorsRE = new RegExp(
              "\\b" +
                "delete,typeof,void".split(",").join("\\s*\\([^\\)]*\\)|\\b") +
                "\\s*\\([^\\)]*\\)"
            );
            var stripStringRE =
              /'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*\$\{|\}(?:[^`\\]|\\.)*`|`(?:[^`\\]|\\.)*`/g;
            function detectErrors(ast) {
              var errors = [];
              if (ast) {
                checkNode(ast, errors);
              }
              return errors;
            }
            function checkNode(node, errors) {
              if (node.type === 1) {
                for (var name in node.attrsMap) {
                  if (dirRE.test(name)) {
                    var value = node.attrsMap[name];
                    if (value) {
                      if (name === "v-for") {
                        checkFor(node, 'v-for="' + value + '"', errors);
                      } else if (onRE.test(name)) {
                        checkEvent(value, name + '="' + value + '"', errors);
                      } else {
                        checkExpression(
                          value,
                          name + '="' + value + '"',
                          errors
                        );
                      }
                    }
                  }
                }
                if (node.children) {
                  for (var i = 0; i < node.children.length; i++) {
                    checkNode(node.children[i], errors);
                  }
                }
              } else if (node.type === 2) {
                checkExpression(node.expression, node.text, errors);
              }
            }
            function checkEvent(exp, text, errors) {
              var stipped = exp.replace(stripStringRE, "");
              var keywordMatch = stipped.match(unaryOperatorsRE);
              if (
                keywordMatch &&
                stipped.charAt(keywordMatch.index - 1) !== "$"
              ) {
                errors.push(
                  "avoid using JavaScript unary operator as property name: " +
                    '"' +
                    keywordMatch[0] +
                    '" in expression ' +
                    text.trim()
                );
              }
              checkExpression(exp, text, errors);
            }
            function checkFor(node, text, errors) {
              checkExpression(node.for || "", text, errors);
              checkIdentifier(node.alias, "v-for alias", text, errors);
              checkIdentifier(node.iterator1, "v-for iterator", text, errors);
              checkIdentifier(node.iterator2, "v-for iterator", text, errors);
            }
            function checkIdentifier(ident, type, text, errors) {
              if (typeof ident === "string") {
                try {
                  new Function("var " + ident + "=_");
                } catch (e) {
                  errors.push(
                    "invalid " +
                      type +
                      ' "' +
                      ident +
                      '" in expression: ' +
                      text.trim()
                  );
                }
              }
            }
            function checkExpression(exp, text, errors) {
              try {
                new Function("return " + exp);
              } catch (e) {
                var keywordMatch = exp
                  .replace(stripStringRE, "")
                  .match(prohibitedKeywordRE);
                if (keywordMatch) {
                  errors.push(
                    "avoid using JavaScript keyword as property name: " +
                      '"' +
                      keywordMatch[0] +
                      '"\n  Raw expression: ' +
                      text.trim()
                  );
                } else {
                  errors.push(
                    "invalid expression: " +
                      e.message +
                      " in\n\n" +
                      "    " +
                      exp +
                      "\n\n" +
                      "  Raw expression: " +
                      text.trim() +
                      "\n"
                  );
                }
              }
            }
            function createFunction(code, errors) {
              try {
                return new Function(code);
              } catch (err) {
                errors.push({ err: err, code: code });
                return noop;
              }
            }
            function createCompileToFunctionFn(compile) {
              var cache = Object.create(null);
              return function compileToFunctions(template, options, vm) {
                options = extend({}, options);
                var warn$$1 = options.warn || warn;
                delete options.warn;
                {
                  try {
                    new Function("return 1");
                  } catch (e) {
                    if (e.toString().match(/unsafe-eval|CSP/)) {
                      warn$$1(
                        "It seems you are using the standalone build of Vue.js in an " +
                          "environment with Content Security Policy that prohibits unsafe-eval. " +
                          "The template compiler cannot work in this environment. Consider " +
                          "relaxing the policy to allow unsafe-eval or pre-compiling your " +
                          "templates into render functions."
                      );
                    }
                  }
                }
                var key = options.delimiters
                  ? String(options.delimiters) + template
                  : template;
                if (cache[key]) {
                  return cache[key];
                }
                var compiled = compile(template, options);
                {
                  if (compiled.errors && compiled.errors.length) {
                    warn$$1(
                      "Error compiling template:\n\n" +
                        template +
                        "\n\n" +
                        compiled.errors
                          .map(function (e) {
                            return "- " + e;
                          })
                          .join("\n") +
                        "\n",
                      vm
                    );
                  }
                  if (compiled.tips && compiled.tips.length) {
                    compiled.tips.forEach(function (msg) {
                      return tip(msg, vm);
                    });
                  }
                }
                var res = {};
                var fnGenErrors = [];
                res.render = createFunction(compiled.render, fnGenErrors);
                res.staticRenderFns = compiled.staticRenderFns.map(function (
                  code
                ) {
                  return createFunction(code, fnGenErrors);
                });
                {
                  if (
                    (!compiled.errors || !compiled.errors.length) &&
                    fnGenErrors.length
                  ) {
                    warn$$1(
                      "Failed to generate render function:\n\n" +
                        fnGenErrors
                          .map(function (ref) {
                            var err = ref.err;
                            var code = ref.code;
                            return err.toString() + " in\n\n" + code + "\n";
                          })
                          .join("\n"),
                      vm
                    );
                  }
                }
                return (cache[key] = res);
              };
            }
            function createCompilerCreator(baseCompile) {
              return function createCompiler(baseOptions) {
                function compile(template, options) {
                  var finalOptions = Object.create(baseOptions);
                  var errors = [];
                  var tips = [];
                  finalOptions.warn = function (msg, tip) {
                    (tip ? tips : errors).push(msg);
                  };
                  if (options) {
                    if (options.modules) {
                      finalOptions.modules = (baseOptions.modules || []).concat(
                        options.modules
                      );
                    }
                    if (options.directives) {
                      finalOptions.directives = extend(
                        Object.create(baseOptions.directives || null),
                        options.directives
                      );
                    }
                    for (var key in options) {
                      if (key !== "modules" && key !== "directives") {
                        finalOptions[key] = options[key];
                      }
                    }
                  }
                  var compiled = baseCompile(template, finalOptions);
                  {
                    errors.push.apply(errors, detectErrors(compiled.ast));
                  }
                  compiled.errors = errors;
                  compiled.tips = tips;
                  return compiled;
                }
                return {
                  compile: compile,
                  compileToFunctions: createCompileToFunctionFn(compile),
                };
              };
            }
            var createCompiler = createCompilerCreator(function baseCompile(
              template,
              options
            ) {
              var ast = parse(template.trim(), options);
              if (options.optimize !== false) {
                optimize(ast, options);
              }
              var code = generate(ast, options);
              return {
                ast: ast,
                render: code.render,
                staticRenderFns: code.staticRenderFns,
              };
            });
            var ref$1 = createCompiler(baseOptions);
            var compileToFunctions = ref$1.compileToFunctions;
            var div;
            function getShouldDecode(href) {
              div = div || document.createElement("div");
              div.innerHTML = href ? '<a href="\n"/>' : '<div a="\n"/>';
              return div.innerHTML.indexOf("&#10;") > 0;
            }
            var shouldDecodeNewlines = inBrowser
              ? getShouldDecode(false)
              : false;
            var shouldDecodeNewlinesForHref = inBrowser
              ? getShouldDecode(true)
              : false;
            var idToTemplate = cached(function (id) {
              var el = query(id);
              return el && el.innerHTML;
            });
            var mount = Vue.prototype.$mount;
            Vue.prototype.$mount = function (el, hydrating) {
              el = el && query(el);
              if (el === document.body || el === document.documentElement) {
                "development" !== "production" &&
                  warn(
                    "Do not mount Vue to <html> or <body> - mount to normal elements instead."
                  );
                return this;
              }
              var options = this.$options;
              if (!options.render) {
                var template = options.template;
                if (template) {
                  if (typeof template === "string") {
                    if (template.charAt(0) === "#") {
                      template = idToTemplate(template);
                      if ("development" !== "production" && !template) {
                        warn(
                          "Template element not found or is empty: " +
                            options.template,
                          this
                        );
                      }
                    }
                  } else if (template.nodeType) {
                    template = template.innerHTML;
                  } else {
                    {
                      warn("invalid template option:" + template, this);
                    }
                    return this;
                  }
                } else if (el) {
                  template = getOuterHTML(el);
                }
                if (template) {
                  if (
                    "development" !== "production" &&
                    config.performance &&
                    mark
                  ) {
                    mark("compile");
                  }
                  var ref = compileToFunctions(
                    template,
                    {
                      shouldDecodeNewlines: shouldDecodeNewlines,
                      shouldDecodeNewlinesForHref: shouldDecodeNewlinesForHref,
                      delimiters: options.delimiters,
                      comments: options.comments,
                    },
                    this
                  );
                  var render = ref.render;
                  var staticRenderFns = ref.staticRenderFns;
                  options.render = render;
                  options.staticRenderFns = staticRenderFns;
                  if (
                    "development" !== "production" &&
                    config.performance &&
                    mark
                  ) {
                    mark("compile end");
                    measure(
                      "vue " + this._name + " compile",
                      "compile",
                      "compile end"
                    );
                  }
                }
              }
              return mount.call(this, el, hydrating);
            };
            function getOuterHTML(el) {
              if (el.outerHTML) {
                return el.outerHTML;
              } else {
                var container = document.createElement("div");
                container.appendChild(el.cloneNode(true));
                return container.innerHTML;
              }
            }
            Vue.compile = compileToFunctions;
            return Vue;
          });
        }.call(
          this,
          typeof global !== "undefined"
            ? global
            : typeof self !== "undefined"
            ? self
            : typeof window !== "undefined"
            ? window
            : {},
          require("timers").setImmediate
        ));
      },
      { timers: 47 },
    ],
    50: [
      function (require, module, exports) {
        (function webpackUniversalModuleDefinition(root, factory) {
          if (typeof exports === "object" && typeof module === "object")
            module.exports = factory();
          else if (typeof define === "function" && define.amd)
            define([], factory);
          else {
            var a = factory();
            for (var i in a)
              (typeof exports === "object" ? exports : root)[i] = a[i];
          }
        })(this, function () {
          return (function (modules) {
            var installedModules = {};
            function __webpack_require__(moduleId) {
              if (installedModules[moduleId]) {
                return installedModules[moduleId].exports;
              }
              var module = (installedModules[moduleId] = {
                i: moduleId,
                l: false,
                exports: {},
              });
              modules[moduleId].call(
                module.exports,
                module,
                module.exports,
                __webpack_require__
              );
              module.l = true;
              return module.exports;
            }
            __webpack_require__.m = modules;
            __webpack_require__.c = installedModules;
            __webpack_require__.d = function (exports, name, getter) {
              if (!__webpack_require__.o(exports, name)) {
                Object.defineProperty(exports, name, {
                  configurable: false,
                  enumerable: true,
                  get: getter,
                });
              }
            };
            __webpack_require__.n = function (module) {
              var getter =
                module && module.__esModule
                  ? function getDefault() {
                      return module["default"];
                    }
                  : function getModuleExports() {
                      return module;
                    };
              __webpack_require__.d(getter, "a", getter);
              return getter;
            };
            __webpack_require__.o = function (object, property) {
              return Object.prototype.hasOwnProperty.call(object, property);
            };
            __webpack_require__.p = "";
            return __webpack_require__((__webpack_require__.s = 2));
          })([
            function (module, __webpack_exports__, __webpack_require__) {
              "use strict";
              var ArrayProto = Array.prototype,
                ObjProto = Object.prototype;
              var slice = ArrayProto.slice,
                toString = ObjProto.toString;
              var util = {};
              util.isArray = function (obj) {
                return Array.isArray(obj);
              };
              var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
              util.isArrayLike = function (obj) {
                if (typeof obj !== "object" || !obj) {
                  return false;
                }
                var length = obj.length;
                return (
                  typeof length === "number" &&
                  length % 1 === 0 &&
                  length >= 0 &&
                  length <= MAX_ARRAY_INDEX
                );
              };
              util.isObject = function (obj) {
                var type = typeof obj;
                return type === "function" || (type === "object" && !!obj);
              };
              util.each = function (obj, callback) {
                var i, len;
                if (util.isArray(obj)) {
                  for (i = 0, len = obj.length; i < len; i++) {
                    if (callback(obj[i], i, obj) === false) {
                      break;
                    }
                  }
                } else {
                  for (i in obj) {
                    if (callback(obj[i], i, obj) === false) {
                      break;
                    }
                  }
                }
                return obj;
              };
              util.each(
                [
                  "Arguments",
                  "Function",
                  "String",
                  "Number",
                  "Date",
                  "RegExp",
                  "Error",
                ],
                function (name) {
                  util["is" + name] = function (obj) {
                    return toString.call(obj) === "[object " + name + "]";
                  };
                }
              );
              util.toArray = function (list, start) {
                start = start || 0;
                var i = list.length - start;
                var ret = new Array(i);
                while (i--) {
                  ret[i] = list[i + start];
                }
                return ret;
              };
              util.toNumber = function (value) {
                if (typeof value !== "string") {
                  return value;
                } else {
                  var parsed = Number(value);
                  return isNaN(parsed) ? value : parsed;
                }
              };
              util.convertArray = function (value) {
                if (util.isArray(value)) {
                  return value;
                } else if (util.isPlainObject(value)) {
                  var keys = Object.keys(value);
                  var i = keys.length;
                  var res = new Array(i);
                  var key;
                  while (i--) {
                    key = keys[i];
                    res[i] = { $key: key, $value: value[key] };
                  }
                  return res;
                } else {
                  return value || [];
                }
              };
              function multiIndex(obj, is) {
                return is.length ? multiIndex(obj[is[0]], is.slice(1)) : obj;
              }
              util.getPath = function (obj, is) {
                return multiIndex(obj, is.split("."));
              };
              var toString = Object.prototype.toString;
              var OBJECT_STRING = "[object Object]";
              util.isPlainObject = function (obj) {
                return toString.call(obj) === OBJECT_STRING;
              };
              __webpack_exports__["a"] = util;
            },
            function (module, __webpack_exports__, __webpack_require__) {
              "use strict";
              var __WEBPACK_IMPORTED_MODULE_0__util_index__ =
                __webpack_require__(0);
              function filterBy(arr, search) {
                var arr =
                  __WEBPACK_IMPORTED_MODULE_0__util_index__["a"].convertArray(
                    arr
                  );
                if (search == null) {
                  return arr;
                }
                if (typeof search === "function") {
                  return arr.filter(search);
                }
                search = ("" + search).toLowerCase();
                var n = 2;
                var keys = Array.prototype.concat.apply(
                  [],
                  __WEBPACK_IMPORTED_MODULE_0__util_index__["a"].toArray(
                    arguments,
                    n
                  )
                );
                var res = [];
                var item, key, val, j;
                for (var i = 0, l = arr.length; i < l; i++) {
                  item = arr[i];
                  val = (item && item.$value) || item;
                  j = keys.length;
                  if (j) {
                    while (j--) {
                      key = keys[j];
                      if (
                        (key === "$key" && contains(item.$key, search)) ||
                        contains(
                          __WEBPACK_IMPORTED_MODULE_0__util_index__[
                            "a"
                          ].getPath(val, key),
                          search
                        )
                      ) {
                        res.push(item);
                        break;
                      }
                    }
                  } else if (contains(item, search)) {
                    res.push(item);
                  }
                }
                return res;
              }
              function contains(val, search) {
                var i;
                if (
                  __WEBPACK_IMPORTED_MODULE_0__util_index__["a"].isPlainObject(
                    val
                  )
                ) {
                  var keys = Object.keys(val);
                  i = keys.length;
                  while (i--) {
                    if (contains(val[keys[i]], search)) {
                      return true;
                    }
                  }
                } else if (
                  __WEBPACK_IMPORTED_MODULE_0__util_index__["a"].isArray(val)
                ) {
                  i = val.length;
                  while (i--) {
                    if (contains(val[i], search)) {
                      return true;
                    }
                  }
                } else if (val != null) {
                  return val.toString().toLowerCase().indexOf(search) > -1;
                }
              }
              __webpack_exports__["a"] = filterBy;
            },
            function (module, __webpack_exports__, __webpack_require__) {
              "use strict";
              Object.defineProperty(__webpack_exports__, "__esModule", {
                value: true,
              });
              var __WEBPACK_IMPORTED_MODULE_0__util_index__ =
                __webpack_require__(0);
              var __WEBPACK_IMPORTED_MODULE_1__string_index__ =
                __webpack_require__(3);
              var __WEBPACK_IMPORTED_MODULE_2__array_index__ =
                __webpack_require__(9);
              var __WEBPACK_IMPORTED_MODULE_3__other_index__ =
                __webpack_require__(13);
              var Vue2Filters = {
                install: function (Vue) {
                  __WEBPACK_IMPORTED_MODULE_0__util_index__["a"].each(
                    __WEBPACK_IMPORTED_MODULE_1__string_index__,
                    function (value, key) {
                      Vue.filter(key, value);
                    }
                  );
                  __WEBPACK_IMPORTED_MODULE_0__util_index__["a"].each(
                    __WEBPACK_IMPORTED_MODULE_3__other_index__,
                    function (value, key) {
                      Vue.filter(key, value);
                    }
                  );
                  Vue.mixin({
                    methods: {
                      limitBy: __WEBPACK_IMPORTED_MODULE_2__array_index__["c"],
                      filterBy: __WEBPACK_IMPORTED_MODULE_2__array_index__["a"],
                      orderBy: __WEBPACK_IMPORTED_MODULE_2__array_index__["d"],
                      find: __WEBPACK_IMPORTED_MODULE_2__array_index__["b"],
                    },
                  });
                },
              };
              __webpack_exports__["default"] = Vue2Filters;
              if (typeof window !== "undefined" && window.Vue) {
                window.Vue.use(Vue2Filters);
              }
            },
            function (module, __webpack_exports__, __webpack_require__) {
              "use strict";
              Object.defineProperty(__webpack_exports__, "__esModule", {
                value: true,
              });
              var __WEBPACK_IMPORTED_MODULE_0__capitalize__ =
                __webpack_require__(4);
              var __WEBPACK_IMPORTED_MODULE_1__uppercase__ =
                __webpack_require__(5);
              var __WEBPACK_IMPORTED_MODULE_2__lowercase__ =
                __webpack_require__(6);
              var __WEBPACK_IMPORTED_MODULE_3__placeholder__ =
                __webpack_require__(7);
              var __WEBPACK_IMPORTED_MODULE_4__truncate__ =
                __webpack_require__(8);
              __webpack_require__.d(
                __webpack_exports__,
                "capitalize",
                function () {
                  return __WEBPACK_IMPORTED_MODULE_0__capitalize__["a"];
                }
              );
              __webpack_require__.d(
                __webpack_exports__,
                "uppercase",
                function () {
                  return __WEBPACK_IMPORTED_MODULE_1__uppercase__["a"];
                }
              );
              __webpack_require__.d(
                __webpack_exports__,
                "lowercase",
                function () {
                  return __WEBPACK_IMPORTED_MODULE_2__lowercase__["a"];
                }
              );
              __webpack_require__.d(
                __webpack_exports__,
                "placeholder",
                function () {
                  return __WEBPACK_IMPORTED_MODULE_3__placeholder__["a"];
                }
              );
              __webpack_require__.d(
                __webpack_exports__,
                "truncate",
                function () {
                  return __WEBPACK_IMPORTED_MODULE_4__truncate__["a"];
                }
              );
            },
            function (module, __webpack_exports__, __webpack_require__) {
              "use strict";
              function capitalize(value) {
                if (!value && value !== 0) return "";
                value = value.toString();
                return value.charAt(0).toUpperCase() + value.slice(1);
              }
              __webpack_exports__["a"] = capitalize;
            },
            function (module, __webpack_exports__, __webpack_require__) {
              "use strict";
              function uppercase(value) {
                return value || value === 0
                  ? value.toString().toUpperCase()
                  : "";
              }
              __webpack_exports__["a"] = uppercase;
            },
            function (module, __webpack_exports__, __webpack_require__) {
              "use strict";
              function lowercase(value) {
                return value || value === 0
                  ? value.toString().toLowerCase()
                  : "";
              }
              __webpack_exports__["a"] = lowercase;
            },
            function (module, __webpack_exports__, __webpack_require__) {
              "use strict";
              function placeholder(input, property) {
                return input === undefined || input === "" || input === null
                  ? property
                  : input;
              }
              __webpack_exports__["a"] = placeholder;
            },
            function (module, __webpack_exports__, __webpack_require__) {
              "use strict";
              function truncate(value, length) {
                length = length || 15;
                if (!value || typeof value !== "string") return "";
                if (value.length <= length) return value;
                return value.substring(0, length) + "...";
              }
              __webpack_exports__["a"] = truncate;
            },
            function (module, __webpack_exports__, __webpack_require__) {
              "use strict";
              var __WEBPACK_IMPORTED_MODULE_0__limitBy__ =
                __webpack_require__(10);
              var __WEBPACK_IMPORTED_MODULE_1__filterBy__ =
                __webpack_require__(1);
              var __WEBPACK_IMPORTED_MODULE_2__orderBy__ =
                __webpack_require__(11);
              var __WEBPACK_IMPORTED_MODULE_3__find__ = __webpack_require__(12);
              __webpack_require__.d(__webpack_exports__, "c", function () {
                return __WEBPACK_IMPORTED_MODULE_0__limitBy__["a"];
              });
              __webpack_require__.d(__webpack_exports__, "a", function () {
                return __WEBPACK_IMPORTED_MODULE_1__filterBy__["a"];
              });
              __webpack_require__.d(__webpack_exports__, "d", function () {
                return __WEBPACK_IMPORTED_MODULE_2__orderBy__["a"];
              });
              __webpack_require__.d(__webpack_exports__, "b", function () {
                return __WEBPACK_IMPORTED_MODULE_3__find__["a"];
              });
            },
            function (module, __webpack_exports__, __webpack_require__) {
              "use strict";
              var __WEBPACK_IMPORTED_MODULE_0__util_index__ =
                __webpack_require__(0);
              function limitBy(arr, n, offset) {
                offset = offset ? parseInt(offset, 10) : 0;
                n = __WEBPACK_IMPORTED_MODULE_0__util_index__["a"].toNumber(n);
                return typeof n === "number"
                  ? arr.slice(offset, offset + n)
                  : arr;
              }
              __webpack_exports__["a"] = limitBy;
            },
            function (module, __webpack_exports__, __webpack_require__) {
              "use strict";
              var __WEBPACK_IMPORTED_MODULE_0__util_index__ =
                __webpack_require__(0);
              function orderBy(arr) {
                var comparator = null;
                var sortKeys;
                arr =
                  __WEBPACK_IMPORTED_MODULE_0__util_index__["a"].convertArray(
                    arr
                  );
                var args = __WEBPACK_IMPORTED_MODULE_0__util_index__[
                  "a"
                ].toArray(arguments, 1);
                var order = args[args.length - 1];
                if (typeof order === "number") {
                  order = order < 0 ? -1 : 1;
                  args = args.length > 1 ? args.slice(0, -1) : args;
                } else {
                  order = 1;
                }
                var firstArg = args[0];
                if (!firstArg) {
                  return arr;
                } else if (typeof firstArg === "function") {
                  comparator = function (a, b) {
                    return firstArg(a, b) * order;
                  };
                } else {
                  sortKeys = Array.prototype.concat.apply([], args);
                  comparator = function (a, b, i) {
                    i = i || 0;
                    return i >= sortKeys.length - 1
                      ? baseCompare(a, b, i)
                      : baseCompare(a, b, i) || comparator(a, b, i + 1);
                  };
                }
                function baseCompare(a, b, sortKeyIndex) {
                  var sortKey = sortKeys[sortKeyIndex];
                  if (sortKey) {
                    if (sortKey !== "$key") {
                      if (
                        __WEBPACK_IMPORTED_MODULE_0__util_index__["a"].isObject(
                          a
                        ) &&
                        "$value" in a
                      )
                        a = a.$value;
                      if (
                        __WEBPACK_IMPORTED_MODULE_0__util_index__["a"].isObject(
                          b
                        ) &&
                        "$value" in b
                      )
                        b = b.$value;
                    }
                    a = __WEBPACK_IMPORTED_MODULE_0__util_index__["a"].isObject(
                      a
                    )
                      ? __WEBPACK_IMPORTED_MODULE_0__util_index__["a"].getPath(
                          a,
                          sortKey
                        )
                      : a;
                    b = __WEBPACK_IMPORTED_MODULE_0__util_index__["a"].isObject(
                      b
                    )
                      ? __WEBPACK_IMPORTED_MODULE_0__util_index__["a"].getPath(
                          b,
                          sortKey
                        )
                      : b;
                  }
                  return a === b ? 0 : a > b ? order : -order;
                }
                return arr.slice().sort(comparator);
              }
              __webpack_exports__["a"] = orderBy;
            },
            function (module, __webpack_exports__, __webpack_require__) {
              "use strict";
              var __WEBPACK_IMPORTED_MODULE_0__filterBy__ =
                __webpack_require__(1);
              function find(arr, search) {
                var array = __WEBPACK_IMPORTED_MODULE_0__filterBy__["a"].apply(
                  this,
                  arguments
                );
                array.splice(1);
                return array;
              }
              __webpack_exports__["a"] = find;
            },
            function (module, __webpack_exports__, __webpack_require__) {
              "use strict";
              Object.defineProperty(__webpack_exports__, "__esModule", {
                value: true,
              });
              var __WEBPACK_IMPORTED_MODULE_0__currency__ =
                __webpack_require__(14);
              var __WEBPACK_IMPORTED_MODULE_1__pluralize__ =
                __webpack_require__(15);
              __webpack_require__.d(
                __webpack_exports__,
                "currency",
                function () {
                  return __WEBPACK_IMPORTED_MODULE_0__currency__["a"];
                }
              );
              __webpack_require__.d(
                __webpack_exports__,
                "pluralize",
                function () {
                  return __WEBPACK_IMPORTED_MODULE_1__pluralize__["a"];
                }
              );
            },
            function (module, __webpack_exports__, __webpack_require__) {
              "use strict";
              function currency(value, symbol, decimals, options) {
                var thousandsSeparator,
                  symbolOnLeft,
                  spaceBetweenAmountAndSymbol;
                var digitsRE = /(\d{3})(?=\d)/g;
                options = options || {};
                value = parseFloat(value);
                if (!isFinite(value) || (!value && value !== 0)) return "";
                symbol = symbol != null ? symbol : "$";
                decimals = decimals != null ? decimals : 2;
                thousandsSeparator =
                  options.thousandsSeparator != null
                    ? options.thousandsSeparator
                    : ",";
                symbolOnLeft =
                  options.symbolOnLeft != null ? options.symbolOnLeft : true;
                spaceBetweenAmountAndSymbol =
                  options.spaceBetweenAmountAndSymbol != null
                    ? options.spaceBetweenAmountAndSymbol
                    : false;
                var stringified = Math.abs(value).toFixed(decimals);
                stringified = options.decimalSeparator
                  ? stringified.replace(".", options.decimalSeparator)
                  : stringified;
                var _int = decimals
                  ? stringified.slice(0, -1 - decimals)
                  : stringified;
                var i = _int.length % 3;
                var head =
                  i > 0
                    ? _int.slice(0, i) +
                      (_int.length > 3 ? thousandsSeparator : "")
                    : "";
                var _float = decimals ? stringified.slice(-1 - decimals) : "";
                symbol = spaceBetweenAmountAndSymbol
                  ? symbolOnLeft
                    ? symbol + " "
                    : " " + symbol
                  : symbol;
                symbol = symbolOnLeft
                  ? symbol +
                    head +
                    _int.slice(i).replace(digitsRE, "$1" + thousandsSeparator) +
                    _float
                  : head +
                    _int.slice(i).replace(digitsRE, "$1" + thousandsSeparator) +
                    _float +
                    symbol;
                var sign = value < 0 ? "-" : "";
                return sign + symbol;
              }
              __webpack_exports__["a"] = currency;
            },
            function (module, __webpack_exports__, __webpack_require__) {
              "use strict";
              var __WEBPACK_IMPORTED_MODULE_0__util_index__ =
                __webpack_require__(0);
              function pluralize(value) {
                var args = __WEBPACK_IMPORTED_MODULE_0__util_index__[
                  "a"
                ].toArray(arguments, 1);
                return args.length > 1
                  ? args[(value % 10) - 1] || args[args.length - 1]
                  : args[0] + (value === 1 ? "" : "s");
              }
              __webpack_exports__["a"] = pluralize;
            },
          ]);
        });
      },
      {},
    ],
    51: [
      function (require, module, exports) {
        "use strict";
        var alphabet =
            "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_".split(
              ""
            ),
          length = 64,
          map = {},
          seed = 0,
          i = 0,
          prev;
        function encode(num) {
          var encoded = "";
          do {
            encoded = alphabet[num % length] + encoded;
            num = Math.floor(num / length);
          } while (num > 0);
          return encoded;
        }
        function decode(str) {
          var decoded = 0;
          for (i = 0; i < str.length; i++) {
            decoded = decoded * length + map[str.charAt(i)];
          }
          return decoded;
        }
        function yeast() {
          var now = encode(+new Date());
          if (now !== prev) return (seed = 0), (prev = now);
          return now + "." + encode(seed++);
        }
        for (; i < length; i++) map[alphabet[i]] = i;
        yeast.encode = encode;
        yeast.decode = decode;
        module.exports = yeast;
      },
      {},
    ],
    52: [
      function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.default = void 0;
        var _vue = _interopRequireDefault(require("vue/dist/vue.js"));
        function _interopRequireDefault(obj) {
          return obj && obj.__esModule ? obj : { default: obj };
        }
        var _default = _vue.default.component("playermap", {
          props: ["id", "username", "position", "wpm", "stat", "status", "me"],
          template:
            '\n    <div :class="[\'player\', \'player-status-\' + status, {\'player-end\': (position === 100) }, {\'player-me\': (id === me)}]">\n      <div class="metadata-wrapper">\n        <div class="userinfo-wrapper">\n          <span>{{ username }}</span>\n        </div>\n        <div class="results-wrapper">\n          <div class="result">\n            {{ wpm }} WPM\n          </div>\n        </div>\n      </div>\n      <div class="payload-wrapper">\n        <div class="payload">\n          <div v-if="stat.endTime" :class="[\'avatar-wrapper\', \'beating\', \'beating-\' + stat.beating]" v-bind:style="{ left: \'calc(\'+ position + \'% - 10px)\' }"></div>\n          <div v-else-if="status === \'play\'">\n            <div class="avatar-wrapper" v-bind:style="{ left: \'calc(\'+ position + \'% - 10px)\' }"></div>\n          </div>\n        </div>\n      </div>\n    </div>\n  ',
        });
        exports.default = _default;
      },
      { "vue/dist/vue.js": 49 },
    ],
    53: [
      function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.default = void 0;
        var _vue = _interopRequireDefault(require("vue/dist/vue.js"));
        function _interopRequireDefault(obj) {
          return obj && obj.__esModule ? obj : { default: obj };
        }
        var _default = _vue.default.component("words", {
          props: ["text"],
          template: '<span ref="word">{{ text }}</span>',
        });
        exports.default = _default;
      },
      { "vue/dist/vue.js": 49 },
    ],
    54: [
      function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        Object.defineProperty(exports, "Words", {
          enumerable: true,
          get: function get() {
            return _Words.default;
          },
        });
        Object.defineProperty(exports, "PlayerMap", {
          enumerable: true,
          get: function get() {
            return _PlayerMap.default;
          },
        });
        var _Words = _interopRequireDefault(require("./Words.js"));
        var _PlayerMap = _interopRequireDefault(require("./PlayerMap.js"));
        function _interopRequireDefault(obj) {
          return obj && obj.__esModule ? obj : { default: obj };
        }
      },
      { "./PlayerMap.js": 52, "./Words.js": 53 },
    ],
    55: [
      function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        Object.defineProperty(exports, "Uppercase", {
          enumerable: true,
          get: function get() {
            return _uppercase.default;
          },
        });
        Object.defineProperty(exports, "Substr", {
          enumerable: true,
          get: function get() {
            return _substr.default;
          },
        });
        var _uppercase = _interopRequireDefault(require("./uppercase.js"));
        var _substr = _interopRequireDefault(require("./substr.js"));
        function _interopRequireDefault(obj) {
          return obj && obj.__esModule ? obj : { default: obj };
        }
      },
      { "./substr.js": 56, "./uppercase.js": 57 },
    ],
    56: [
      function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.default = void 0;
        var _vue = _interopRequireDefault(require("vue/dist/vue.js"));
        function _interopRequireDefault(obj) {
          return obj && obj.__esModule ? obj : { default: obj };
        }
        var _default = _vue.default.filter(
          "substr",
          function (value, lengthMax) {
            var lengthMin =
              arguments.length > 2 && arguments[2] !== undefined
                ? arguments[2]
                : 0;
            return value.substr(lengthMin, lengthMax);
          }
        );
        exports.default = _default;
      },
      { "vue/dist/vue.js": 49 },
    ],
    57: [
      function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.default = void 0;
        var _vue = _interopRequireDefault(require("vue/dist/vue.js"));
        function _interopRequireDefault(obj) {
          return obj && obj.__esModule ? obj : { default: obj };
        }
        var _default = _vue.default.filter("uppercase", function (value) {
          return value.toUpperCase();
        });
        exports.default = _default;
      },
      { "vue/dist/vue.js": 49 },
    ],
    58: [
      function (require, module, exports) {
        "use strict";
        var calcWpm = function calcWpm(allTypedEntries, start, stop) {
          var diff = new Date(Math.abs(new Date(start) - stop));
          var ndiff = (diff.getUTCSeconds() + diff.getUTCMinutes() * 60) / 60;
          if (ndiff < 0.01) return 0;
          return Math.round(allTypedEntries / 5 / ndiff);
        };
        var calcDiffTime = function calcDiffTime(startTime, diffTime) {
          var conditionTime =
            arguments.length > 2 && arguments[2] !== undefined
              ? arguments[2]
              : null;
          var startDiffTime = startTime;
          if (conditionTime === null) {
            conditionTime = startDiffTime;
          }
          if (new Date(conditionTime) - 0 > new Date() - 0) {
            startDiffTime -= diffTime;
          } else {
            startDiffTime += diffTime;
          }
          return startDiffTime;
        };
        var calcDiffRevTime = function calcDiffRevTime(startTime, diffTime) {
          var conditionTime =
            arguments.length > 2 && arguments[2] !== undefined
              ? arguments[2]
              : null;
          var startDiffTime = startTime;
          if (conditionTime === null) {
            conditionTime = startDiffTime;
          }
          if (new Date(conditionTime) - 0 > new Date() - 0) {
            startDiffTime += diffTime;
          } else {
            startDiffTime -= diffTime;
          }
          return startDiffTime;
        };
        var escapeRegExp = function escapeRegExp(string) {
          return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        };
        module.exports = {
          calcWpm: calcWpm,
          calcDiffTime: calcDiffTime,
          calcDiffRevTime: calcDiffRevTime,
          escapeRegExp: escapeRegExp,
        };
      },
      {},
    ],
    59: [
      function (require, module, exports) {
        "use strict";
        var _vue = _interopRequireDefault(require("vue/dist/vue.js"));
        var _vue2Filters = _interopRequireDefault(require("vue2-filters"));
        var _socket = _interopRequireDefault(require("socket.io-client"));
        var _Component = require("./Component");
        var _Filter = require("./Filter");
        var _helpers = require("./helpers.js");
        function _interopRequireDefault(obj) {
          return obj && obj.__esModule ? obj : { default: obj };
        }
        var cio = (0, _socket.default)(window.location.origin);
        var MINIMUM_PLAYERS = 2;
        var WAITING_TIME = 10;
        var WAITING_LEAVE_ENABLE = false;
        var DISABLE_COUNTDOWN = true;
        var DISABLE_CTRL_BUTTON = false;
        var ENABLE_ERROR_POSITION = false;
        cio.heartbeatTimeout = 2e4;
        _vue.default.use(_vue2Filters.default);
        var vue = new _vue.default({
          el: "#game",
          data: {
            index: 0,
            rowTop: 4,
            lobby: null,
            me: null,
            words: null,
            input: null,
            inputCache: null,
            statusCode: 0,
            times: { start: 0, stop: 0, waitingStart: 0, waitingStop: 0 },
            serverTimeDiff: 0,
            now: 0,
            nowWaiting: 0,
            engineInfo: {},
            serverInformation: {},
          },
          computed: {
            countdown: function countdown() {
              if (DISABLE_COUNTDOWN) return false;
              var diff = this.times.start - this.now;
              if (this.statusCode < 2 || diff > 0) {
                return "1:00";
              }
              if (this.statusCode === 3) return "0:00";
              return "0:" + ("0" + new Date(diff).getSeconds()).slice(-2);
            },
            countdownWaiting: function countdownWaiting() {
              if (!this.lobby) return false;
              if (this.statusCode >= 2) return false;
              if (WAITING_LEAVE_ENABLE && this.lobby.players < MINIMUM_PLAYERS)
                return false;
              if (this.times.waitingStart === 0 || this.nowWaiting === 0)
                return false;
              if (this.times.start !== 0) return false;
              var diff = (0, _helpers.calcDiffTime)(
                this.times.waitingStart - this.nowWaiting,
                this.serverTimeDiff,
                this.nowWaiting
              );
              var countNow =
                WAITING_TIME -
                (59 - new Date(diff).getSeconds()).toString().slice(-2);
              if (diff > 0) {
                document.title = "TypeRacer (" + WAITING_TIME + ")";
                return WAITING_TIME.toString();
              }
              if (countNow <= 0) {
                countNow = "Game!";
              }
              document.title = "TypeRacer (" + countNow + ")";
              return countNow;
            },
          },
          watch: {
            statusCode: function statusCode(code) {
              this.lobby.statusCode = code;
              if (this.lobby.statusCode !== 2) {
                cio.emit("lobbyStatus", code);
              }
            },
            "me.position": function mePosition() {
              if (
                this.lobby.statusCode > 1 &&
                this.times.start !== 0 &&
                this.times.waitingStop !== 0 &&
                this.lobby.startedWaitingTime !== null
              ) {
                cio.emit("changePosition", {
                  id: this.me.id,
                  wpm: this.me.wpm,
                  stat: this.me.stat,
                  position: this.me.position,
                });
              }
            },
            "me.stat.beating": function meStatBeating() {
              if (this.lobby.statusCode > 1 && this.times.start !== 0) {
                cio.emit("playerChange", this.me);
              }
            },
            "lobby.players": function lobbyPlayers(players) {
              if (
                players.length >= MINIMUM_PLAYERS &&
                this.lobby.statusCode < 2
              ) {
                if (WAITING_LEAVE_ENABLE) {
                  vue.onStartWaiting(new Date());
                } else if (this.lobby.startedWaitingTime === null) {
                  cio.emit("debug", "No implemented state [lobby.players]");
                }
              }
            },
          },
          mounted: function mounted() {
            this.$el.className = "mounted";
            this.$once("hook:updated", function () {
              if (this.$refs.typeInput) this.$refs.typeInput.focus();
            });
          },
          methods: {
            getMinimumPlayer: function getMinimumPlayer() {
              return MINIMUM_PLAYERS;
            },
            onWillPlayerWpm: function onWillPlayerWpm() {
              var allTypedEntries =
                this.me.stat.keystrokes.correct + this.me.stat.keystrokes.error;
              var startTime = 0;
              if (this.times.start > new Date() - 0) {
                startTime = (0, _helpers.calcDiffRevTime)(
                  this.times.start,
                  this.serverTimeDiff
                );
              } else {
                startTime = (0, _helpers.calcDiffTime)(
                  this.times.start,
                  this.serverTimeDiff
                );
              }
              if (this.me.stat.endTime) {
                var endTime = 0;
                if (this.times.start > new Date() - 0) {
                  endTime = (0, _helpers.calcDiffRevTime)(
                    this.me.stat.endTime,
                    this.serverTimeDiff
                  );
                } else {
                  endTime = (0, _helpers.calcDiffTime)(
                    this.me.stat.endTime,
                    this.serverTimeDiff
                  );
                }
                this.me.wpm = (0, _helpers.calcWpm)(
                  allTypedEntries,
                  startTime,
                  endTime
                );
              } else {
                this.me.wpm = (0, _helpers.calcWpm)(
                  allTypedEntries,
                  startTime,
                  this.now
                );
              }
            },
            onWillElapsedTime: function onWillElapsedTime() {
              var startDiffTime = (0, _helpers.calcDiffTime)(
                this.times.start,
                this.serverTimeDiff
              );
              var startTime = new Date(startDiffTime);
              var endTime = new Date(this.me.stat.endTime);
              var diff = new Date(endTime - startTime);
              var diffSecs = ("0" + diff.getUTCSeconds()).slice(-2);
              var diffMins = ("0" + diff.getUTCMinutes()).slice(-2);
              this.me.stat.elapsedTime = diffMins + ":" + diffSecs;
            },
            update: function update(e) {
              console.log(e);
              if (this.statusCode === 3 || e.target.value === null) return;
              if (this.words[this.index] === undefined && this.statusCode > 1) {
                return cio.emit("onEnd");
              }
              this.input = e.target.value;
              if (
                this.input.trim() !=
                this.words[this.index].text.substr(0, this.input.trim().length)
              ) {
                this.words[this.index].status = "error";
                if (/\S/.test(this.input)) this.me.stat.keystrokes.error++;
              } else {
                this.words[this.index].status = null;
                if (/\S/.test(this.input)) this.me.stat.keystrokes.correct++;
              }
              if (/\S/.test(this.input)) {
                this.me.stat.keystroke++;
                var diff =
                  this.me.stat.keystrokes.error -
                  this.me.stat.keystrokes.correct;
                var res = diff <= 0 ? diff : 0;
                this.me.stat.accuracy = Math.abs(
                  ((res / this.me.stat.keystroke) * 100).toFixed(2)
                );
              }
              if (this.input.indexOf(" ") >= 0) {
                var inputValue = this.input.split(" ");
                var isCorrect = inputValue[0] == this.words[this.index].text;
                if (
                  !ENABLE_ERROR_POSITION &&
                  this.$refs.words[this.index + 1] &&
                  isCorrect
                ) {
                  this.rowTop =
                    4 + -1 * this.$refs.words[this.index + 1].$el.offsetTop;
                } else if (
                  ENABLE_ERROR_POSITION &&
                  this.$refs.words[this.index + 1]
                ) {
                  this.rowTop =
                    4 + -1 * this.$refs.words[this.index + 1].$el.offsetTop;
                }
                if (isCorrect) {
                  this.onCorrect();
                  if (!ENABLE_ERROR_POSITION) this.index++;
                } else {
                  console.log(inputValue[0]);
                  this.onError();
                }
                if (ENABLE_ERROR_POSITION) this.index++;
                this.update({ target: { value: inputValue[1] } });
                this.onWillPlayerWpm();
              }
            },
            send: function send() {},
            updateWaitingTimer: function updateWaitingTimer() {
              this.nowWaiting = new Date() - 0;
            },
            onStartWaiting: function onStartWaiting(startWaitingTime) {
              this.times.waitingStart = new Date(startWaitingTime) - 0;
              if (WAITING_LEAVE_ENABLE && this.statusCode === 1) {
                document.title = "Multiplayer Typing Test";
                clearInterval(this.timerWaiting);
              }
              this.timerWaiting = window.setInterval(
                this.updateWaitingTimer.bind(this),
                100
              );
            },
            onStopWaiting: function onStopWaiting() {
              document.title = "TypeRacer";
              clearInterval(this.timerWaiting);
              this.times.waitingStop = new Date() - 0;
            },
            updateTimer: function updateTimer() {
              this.now = new Date() - 0;
              if (DISABLE_COUNTDOWN) return;
              if (this.times.start + 60 * 1e3 <= this.now) this.onStop();
            },
            onStart: function onStart(startTime, code) {
              this.reset();
              this.onStopWaiting();
              clearInterval(this.timerWaiting);
              this.statusCode = code;
              this.times.start = startTime - 0;
              this.timer = window.setInterval(this.updateTimer.bind(self), 100);
            },
            onEnd: function onEnd(endTime) {
              var _this = this;
              this.me.stat.endTime = endTime - 0;
              this.times.stop = new Date() - 0;
              this.me.stat.beating = this.calcBeating();
              this.onWillPlayerWpm();
              if (!DISABLE_COUNTDOWN) return;
              this.onWillElapsedTime();
              var endedAllPlayer =
                this.lobby.players.filter(function (player) {
                  return (
                    player.id !== _this.me.id && player.stat.endTime === null
                  );
                }).length === 0;
              if (endedAllPlayer) {
                this.onStop();
              }
            },
            onStop: function onStop() {
              this.statusCode = 3;
              clearInterval(this.timer);
              this.times.stop = new Date() - 0;
              this.onWillPlayerWpm();
            },
            onCorrect: function onCorrect() {
              this.me.stat.words.correct++;
              this.words[this.index].status = "complete";
              this.onWillCalcPosition();
            },
            onError: function onError() {
              this.words[this.index].status = "error";
              this.me.stat.words.error++;
              this.onWillCalcPosition();
            },
            onWillCalcPosition: function onWillCalcPosition() {
              var diff = this.me.stat.words.correct;
              diff = !ENABLE_ERROR_POSITION
                ? diff
                : diff + this.me.stat.words.error;
              this.me.position = (diff / this.words.length) * 100;
            },
            newGame: function newGame() {
              cio.emit("newGame", this.me.socketID);
            },
            inputFocus: function inputFocus() {
              if (this.$refs.typeInput) {
                this.$refs.typeInput.focus();
              }
            },
            calcBeating: function calcBeating() {
              return (
                this.lobby.players.filter(function (player, index) {
                  return (
                    player.stat.endTime !== null && player.stat.beating !== 0
                  );
                }).length + 1
              );
            },
            reset: function reset() {
              this.rowTop = 4;
              this.index = 0;
              this.me.position = 0;
              this.me.wpm = 0;
              this.now = 0;
              this.me.stat = {
                accuracy: 0,
                elapsedTime: null,
                endTime: null,
                keystroke: 0,
                keystrokes: { correct: 0, error: 0 },
                speed: 0,
                words: { correct: 0, error: 0 },
                beating: 0,
              };
              this.words.forEach(function (word, index) {
                word.status = null;
              });
              if (this.$refs.typeInput) {
                this.$refs.typeInput.focus();
              }
              this.input = null;
            },
          },
          filters: { Uppercase: _Filter.Uppercase, Substr: _Filter.Substr },
          components: {
            Words: _Component.Words,
            PlayerMap: _Component.PlayerMap,
          },
        });
        cio.on("connect", function (socket) {
          console.log("Connected");
        });
        cio.on("me", function (player) {
          vue.me = player;
          vue.words = player.words;
          vue.index = player.words.filter(function (p) {
            return p.status;
          }).length;
        });
        cio.on("lobby", function (lobby) {
          vue.lobby = lobby;
          if (vue.lobby.startedWaitingTime) {
            vue.onStartWaiting(vue.lobby.startedWaitingTime);
          }
          vue.statusCode = vue.lobby.statusCode;
        });
        cio.on("lobbyChanged", function (lobby, me) {
          vue.lobby = lobby;
        });
        cio.on("newGamed", function () {
          window.location.reload();
        });
        cio.on("time", function (issued) {
          vue.serverTimeDiff = new Date() - issued;
          cio.emit("debug", vue.serverTimeDiff);
        });
        cio.on("onStartedWaitingTime", function (startWaitingTime) {
          vue.onStartWaiting(startWaitingTime);
        });
        cio.on("onStarted", function (startTime, statusCode) {
          vue.onStart(new Date(startTime), statusCode);
        });
        cio.on("onChangedPosition", function (positionInfo) {
          for (var i = 0; i < vue.lobby.players.length; i++) {
            if (vue.lobby.players[i].id !== positionInfo.id) continue;
            vue.lobby.players[i].wpm = positionInfo.wpm;
            vue.lobby.players[i].position = positionInfo.position;
          }
        });
        cio.on("onEnded", function (endTime) {
          cio.emit("playerChange", vue.me);
          vue.onEnd(new Date(endTime));
        });
        cio.on("serverInformation", function (serverInformation) {
          vue.serverInformation = serverInformation;
        });
        cio.on("engineinfo", function (engineinfo) {
          vue.engineInfo = engineinfo;
        });
        cio.on("disconnect", function () {
          console.log("Disconnected");
          window.location.reload();
        });
        if (DISABLE_CTRL_BUTTON) {
          window.addEventListener("keydown", function (e) {
            if (e.ctrlKey || e.metaKey) e.preventDefault();
          });
        }
      },
      {
        "./Component": 54,
        "./Filter": 55,
        "./helpers.js": 58,
        "socket.io-client": 35,
        "vue/dist/vue.js": 49,
        "vue2-filters": 50,
      },
    ],
  },
  {},
  [59]
);
