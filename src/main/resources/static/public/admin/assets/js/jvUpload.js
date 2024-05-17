(function (factory) {
    if (typeof define === "function" && define.amd) {
        define(["jquery"], factory)
    } else {
        factory(jQuery)
    }
}(function ($, undefined) {
    var uuid = 0, slice = Array.prototype.slice, _cleanData = $.cleanData;
    $.cleanData = function (elems) {
        for (var i = 0, elem; (elem = elems[i]) != null; i++) {
            try {
                $(elem).triggerHandler("remove")
            } catch (e) {
            }
        }
        _cleanData(elems)
    };
    $.widget = function (name, base, prototype) {
        var fullName, existingConstructor, constructor, basePrototype, proxiedPrototype = {},
            namespace = name.split(".")[0];
        name = name.split(".")[1];
        fullName = namespace + "-" + name;
        if (!prototype) {
            prototype = base;
            base = $.Widget
        }
        $.expr[":"][fullName.toLowerCase()] = function (elem) {
            return !!$.data(elem, fullName)
        };
        $[namespace] = $[namespace] || {};
        existingConstructor = $[namespace][name];
        constructor = $[namespace][name] = function (options, element) {
            if (!this._createWidget) {
                return new constructor(options, element)
            }
            if (arguments.length) {
                this._createWidget(options, element)
            }
        };
        $.extend(constructor, existingConstructor, {
            version: prototype.version,
            _proto: $.extend({}, prototype),
            _childConstructors: []
        });
        basePrototype = new base();
        basePrototype.options = $.widget.extend({}, basePrototype.options);
        $.each(prototype, function (prop, value) {
            if (!$.isFunction(value)) {
                proxiedPrototype[prop] = value;
                return
            }
            proxiedPrototype[prop] = (function () {
                var _super = function () {
                    return base.prototype[prop].apply(this, arguments)
                }, _superApply = function (args) {
                    return base.prototype[prop].apply(this, args)
                };
                return function () {
                    var __super = this._super, __superApply = this._superApply, returnValue;
                    this._super = _super;
                    this._superApply = _superApply;
                    returnValue = value.apply(this, arguments);
                    this._super = __super;
                    this._superApply = __superApply;
                    return returnValue
                }
            })()
        });
        constructor.prototype = $.widget.extend(basePrototype, {widgetEventPrefix: existingConstructor ? basePrototype.widgetEventPrefix : name}, proxiedPrototype, {
            constructor: constructor,
            namespace: namespace,
            widgetName: name,
            widgetFullName: fullName
        });
        if (existingConstructor) {
            $.each(existingConstructor._childConstructors, function (i, child) {
                var childPrototype = child.prototype;
                $.widget(childPrototype.namespace + "." + childPrototype.widgetName, constructor, child._proto)
            });
            delete existingConstructor._childConstructors
        } else {
            base._childConstructors.push(constructor)
        }
        $.widget.bridge(name, constructor)
    };
    $.widget.extend = function (target) {
        var input = slice.call(arguments, 1), inputIndex = 0, inputLength = input.length, key, value;
        for (; inputIndex < inputLength; inputIndex++) {
            for (key in input[inputIndex]) {
                value = input[inputIndex][key];
                if (input[inputIndex].hasOwnProperty(key) && value !== undefined) {
                    if ($.isPlainObject(value)) {
                        target[key] = $.isPlainObject(target[key]) ? $.widget.extend({}, target[key], value) : $.widget.extend({}, value)
                    } else {
                        target[key] = value
                    }
                }
            }
        }
        return target
    };
    $.widget.bridge = function (name, object) {
        var fullName = object.prototype.widgetFullName || name;
        $.fn[name] = function (options) {
            var isMethodCall = typeof options === "string", args = slice.call(arguments, 1), returnValue = this;
            options = !isMethodCall && args.length ? $.widget.extend.apply(null, [options].concat(args)) : options;
            if (isMethodCall) {
                this.each(function () {
                    var methodValue, instance = $.data(this, fullName);
                    if (!instance) {
                        return $.error("cannot call methods on " + name + " prior to initialization; " + "attempted to call method '" + options + "'")
                    }
                    if (!$.isFunction(instance[options]) || options.charAt(0) === "_") {
                        return $.error("no such method '" + options + "' for " + name + " widget instance")
                    }
                    methodValue = instance[options].apply(instance, args);
                    if (methodValue !== instance && methodValue !== undefined) {
                        returnValue = methodValue && methodValue.jquery ? returnValue.pushStack(methodValue.get()) : methodValue;
                        return !1
                    }
                })
            } else {
                this.each(function () {
                    var instance = $.data(this, fullName);
                    if (instance) {
                        instance.option(options || {})._init()
                    } else {
                        $.data(this, fullName, new object(options, this))
                    }
                })
            }
            return returnValue
        }
    };
    $.Widget = function () {
    };
    $.Widget._childConstructors = [];
    $.Widget.prototype = {
        widgetName: "widget",
        widgetEventPrefix: "",
        defaultElement: "<div>",
        options: {disabled: !1, create: null},
        _createWidget: function (options, element) {
            element = $(element || this.defaultElement || this)[0];
            this.element = $(element);
            this.uuid = uuid++;
            this.eventNamespace = "." + this.widgetName + this.uuid;
            this.options = $.widget.extend({}, this.options, this._getCreateOptions(), options);
            this.bindings = $();
            this.hoverable = $();
            this.focusable = $();
            if (element !== this) {
                $.data(element, this.widgetFullName, this);
                this._on(!0, this.element, {
                    remove: function (event) {
                        if (event.target === element) {
                            this.destroy()
                        }
                    }
                });
                this.document = $(element.style ? element.ownerDocument : element.document || element);
                this.window = $(this.document[0].defaultView || this.document[0].parentWindow)
            }
            this._create();
            this._trigger("create", null, this._getCreateEventData());
            this._init()
        },
        _getCreateOptions: $.noop,
        _getCreateEventData: $.noop,
        _create: $.noop,
        _init: $.noop,
        destroy: function () {
            this._destroy();
            this.element.unbind(this.eventNamespace).removeData(this.widgetName).removeData(this.widgetFullName).removeData($.camelCase(this.widgetFullName));
            this.widget().unbind(this.eventNamespace).removeAttr("aria-disabled").removeClass(this.widgetFullName + "-disabled " + "ui-state-disabled");
            this.bindings.unbind(this.eventNamespace);
            this.hoverable.removeClass("ui-state-hover");
            this.focusable.removeClass("ui-state-focus")
        },
        _destroy: $.noop,
        widget: function () {
            return this.element
        },
        option: function (key, value) {
            var options = key, parts, curOption, i;
            if (arguments.length === 0) {
                return $.widget.extend({}, this.options)
            }
            if (typeof key === "string") {
                options = {};
                parts = key.split(".");
                key = parts.shift();
                if (parts.length) {
                    curOption = options[key] = $.widget.extend({}, this.options[key]);
                    for (i = 0; i < parts.length - 1; i++) {
                        curOption[parts[i]] = curOption[parts[i]] || {};
                        curOption = curOption[parts[i]]
                    }
                    key = parts.pop();
                    if (value === undefined) {
                        return curOption[key] === undefined ? null : curOption[key]
                    }
                    curOption[key] = value
                } else {
                    if (value === undefined) {
                        return this.options[key] === undefined ? null : this.options[key]
                    }
                    options[key] = value
                }
            }
            this._setOptions(options);
            return this
        },
        _setOptions: function (options) {
            var key;
            for (key in options) {
                this._setOption(key, options[key])
            }
            return this
        },
        _setOption: function (key, value) {
            this.options[key] = value;
            if (key === "disabled") {
                this.widget().toggleClass(this.widgetFullName + "-disabled ui-state-disabled", !!value).attr("aria-disabled", value);
                this.hoverable.removeClass("ui-state-hover");
                this.focusable.removeClass("ui-state-focus")
            }
            return this
        },
        enable: function () {
            return this._setOption("disabled", !1)
        },
        disable: function () {
            return this._setOption("disabled", !0)
        },
        _on: function (suppressDisabledCheck, element, handlers) {
            var delegateElement, instance = this;
            if (typeof suppressDisabledCheck !== "boolean") {
                handlers = element;
                element = suppressDisabledCheck;
                suppressDisabledCheck = !1
            }
            if (!handlers) {
                handlers = element;
                element = this.element;
                delegateElement = this.widget()
            } else {
                element = delegateElement = $(element);
                this.bindings = this.bindings.add(element)
            }
            $.each(handlers, function (event, handler) {
                function handlerProxy() {
                    if (!suppressDisabledCheck && (instance.options.disabled === !0 || $(this).hasClass("ui-state-disabled"))) {
                        return
                    }
                    return (typeof handler === "string" ? instance[handler] : handler).apply(instance, arguments)
                }

                if (typeof handler !== "string") {
                    handlerProxy.guid = handler.guid = handler.guid || handlerProxy.guid || $.guid++
                }
                var match = event.match(/^(\w+)\s*(.*)$/), eventName = match[1] + instance.eventNamespace,
                    selector = match[2];
                if (selector) {
                    delegateElement.delegate(selector, eventName, handlerProxy)
                } else {
                    element.bind(eventName, handlerProxy)
                }
            })
        },
        _off: function (element, eventName) {
            eventName = (eventName || "").split(" ").join(this.eventNamespace + " ") + this.eventNamespace;
            element.unbind(eventName).undelegate(eventName)
        },
        _delay: function (handler, delay) {
            function handlerProxy() {
                return (typeof handler === "string" ? instance[handler] : handler).apply(instance, arguments)
            }

            var instance = this;
            return setTimeout(handlerProxy, delay || 0)
        },
        _hoverable: function (element) {
            this.hoverable = this.hoverable.add(element);
            this._on(element, {
                mouseenter: function (event) {
                    $(event.currentTarget).addClass("ui-state-hover")
                }, mouseleave: function (event) {
                    $(event.currentTarget).removeClass("ui-state-hover")
                }
            })
        },
        _focusable: function (element) {
            this.focusable = this.focusable.add(element);
            this._on(element, {
                focusin: function (event) {
                    $(event.currentTarget).addClass("ui-state-focus")
                }, focusout: function (event) {
                    $(event.currentTarget).removeClass("ui-state-focus")
                }
            })
        },
        _trigger: function (type, event, data) {
            var prop, orig, callback = this.options[type];
            data = data || {};
            event = $.Event(event);
            event.type = (type === this.widgetEventPrefix ? type : this.widgetEventPrefix + type).toLowerCase();
            event.target = this.element[0];
            orig = event.originalEvent;
            if (orig) {
                for (prop in orig) {
                    if (!(prop in event)) {
                        event[prop] = orig[prop]
                    }
                }
            }
            this.element.trigger(event, data);
            return !($.isFunction(callback) && callback.apply(this.element[0], [event].concat(data)) === !1 || event.isDefaultPrevented())
        }
    };
    $.each({show: "fadeIn", hide: "fadeOut"}, function (method, defaultEffect) {
        $.Widget.prototype["_" + method] = function (element, options, callback) {
            if (typeof options === "string") {
                options = {effect: options}
            }
            var hasOptions,
                effectName = !options ? method : options === !0 || typeof options === "number" ? defaultEffect : options.effect || defaultEffect;
            options = options || {};
            if (typeof options === "number") {
                options = {duration: options}
            }
            hasOptions = !$.isEmptyObject(options);
            options.complete = callback;
            if (options.delay) {
                element.delay(options.delay)
            }
            if (hasOptions && $.effects && $.effects.effect[effectName]) {
                element[method](options)
            } else if (effectName !== method && element[effectName]) {
                element[effectName](options.duration, options.easing, callback)
            } else {
                element.queue(function (next) {
                    $(this)[method]();
                    if (callback) {
                        callback.call(element[0])
                    }
                    next()
                })
            }
        }
    })
}));
(function (factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory)
    } else {
        factory(window.jQuery)
    }
}(function ($) {
    'use strict';
    var counter = 0;
    $.ajaxTransport('iframe', function (options) {
        if (options.async) {
            var form, iframe, addParamChar;
            return {
                send: function (_, completeCallback) {
                    form = $('<form style="display:none;"></form>');
                    form.attr('accept-charset', options.formAcceptCharset);
                    addParamChar = /\?/.test(options.url) ? '&' : '?';
                    if (options.type === 'DELETE') {
                        options.url = options.url + addParamChar + '_method=DELETE';
                        options.type = 'POST'
                    } else if (options.type === 'PUT') {
                        options.url = options.url + addParamChar + '_method=PUT';
                        options.type = 'POST'
                    } else if (options.type === 'PATCH') {
                        options.url = options.url + addParamChar + '_method=PATCH';
                        options.type = 'POST'
                    }
                    iframe = $('<iframe src="javascript:false;" name="iframe-transport-' + (counter += 1) + '"></iframe>').bind('load', function () {
                        var fileInputClones,
                            paramNames = $.isArray(options.paramName) ? options.paramName : [options.paramName];
                        iframe.unbind('load').bind('load', function () {
                            var response;
                            try {
                                response = iframe.contents();
                                if (!response.length || !response[0].firstChild) {
                                    throw new Error()
                                }
                            } catch (e) {
                                response = undefined
                            }
                            completeCallback(200, 'success', {'iframe': response});
                            $('<iframe src="javascript:false;"></iframe>').appendTo(form);
                            form.remove()
                        });
                        form.prop('target', iframe.prop('name')).prop('action', options.url).prop('method', options.type);
                        if (options.formData) {
                            $.each(options.formData, function (index, field) {
                                $('<input type="hidden"/>').prop('name', field.name).val(field.value).appendTo(form)
                            })
                        }
                        if (options.fileInput && options.fileInput.length && options.type === 'POST') {
                            fileInputClones = options.fileInput.clone();
                            options.fileInput.after(function (index) {
                                return fileInputClones[index]
                            });
                            if (options.paramName) {
                                options.fileInput.each(function (index) {
                                    $(this).prop('name', paramNames[index] || options.paramName)
                                })
                            }
                            form.append(options.fileInput).prop('enctype', 'multipart/form-data').prop('encoding', 'multipart/form-data')
                        }
                        form.submit();
                        if (fileInputClones && fileInputClones.length) {
                            options.fileInput.each(function (index, input) {
                                var clone = $(fileInputClones[index]);
                                $(input).prop('name', clone.prop('name'));
                                clone.replaceWith(input)
                            })
                        }
                    });
                    form.append(iframe).appendTo(document.body)
                }, abort: function () {
                    if (iframe) {
                        iframe.unbind('load').prop('src', 'javascript'.concat(':false;'))
                    }
                    if (form) {
                        form.remove()
                    }
                }
            }
        }
    });
    $.ajaxSetup({
        converters: {
            'iframe text': function (iframe) {
                return iframe && $(iframe[0].body).text()
            }, 'iframe json': function (iframe) {
                return iframe && $.parseJSON($(iframe[0].body).text())
            }, 'iframe html': function (iframe) {
                return iframe && $(iframe[0].body).html()
            }, 'iframe script': function (iframe) {
                return iframe && $.globalEval($(iframe[0].body).text())
            }
        }
    })
}));
(function (factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define(['jquery', 'jquery.ui.widget'], factory)
    } else {
        factory(window.jQuery)
    }
}(function ($) {
    'use strict';
    $.support.xhrFileUpload = !!(window.XMLHttpRequestUpload && window.FileReader);
    $.support.xhrFormDataFileUpload = !!window.FormData;
    $.widget('blueimp.fileupload', {
        options: {
            dropZone: $(document),
            pasteZone: $(document),
            fileInput: undefined,
            replaceFileInput: !0,
            paramName: undefined,
            singleFileUploads: !0,
            limitMultiFileUploads: undefined,
            sequentialUploads: !1,
            limitConcurrentUploads: undefined,
            forceIframeTransport: !1,
            redirect: undefined,
            redirectParamName: undefined,
            postMessage: undefined,
            multipart: !0,
            maxChunkSize: undefined,
            uploadedBytes: undefined,
            recalculateProgress: !0,
            progressInterval: 100,
            bitrateInterval: 500,
            autoUpload: !0,
            messages: {uploadedBytes: 'Uploaded bytes exceed file size'},
            i18n: function (message, context) {
                message = this.messages[message] || message.toString();
                if (context) {
                    $.each(context, function (key, value) {
                        message = message.replace('{' + key + '}', value)
                    })
                }
                return message
            },
            formData: function (form) {
                return form.serializeArray()
            },
            add: function (e, data) {
                if (data.autoUpload || (data.autoUpload !== !1 && $(this).fileupload('option', 'autoUpload'))) {
                    data.process().done(function () {
                        data.submit()
                    })
                }
            },
            processData: !1,
            contentType: !1,
            cache: !1
        },
        _specialOptions: ['fileInput', 'dropZone', 'pasteZone', 'multipart', 'forceIframeTransport'],
        _BitrateTimer: function () {
            this.timestamp = ((Date.now) ? Date.now() : (new Date()).getTime());
            this.loaded = 0;
            this.bitrate = 0;
            this.getBitrate = function (now, loaded, interval) {
                var timeDiff = now - this.timestamp;
                if (!this.bitrate || !interval || timeDiff > interval) {
                    this.bitrate = (loaded - this.loaded) * (1000 / timeDiff) * 8;
                    this.loaded = loaded;
                    this.timestamp = now
                }
                return this.bitrate
            }
        },
        _isXHRUpload: function (options) {
            return !options.forceIframeTransport && ((!options.multipart && $.support.xhrFileUpload) || $.support.xhrFormDataFileUpload)
        },
        _getFormData: function (options) {
            var formData;
            if (typeof options.formData === 'function') {
                return options.formData(options.form)
            }
            if ($.isArray(options.formData)) {
                return options.formData
            }
            if ($.type(options.formData) === 'object') {
                formData = [];
                $.each(options.formData, function (name, value) {
                    formData.push({name: name, value: value})
                });
                return formData
            }
            return []
        },
        _getTotal: function (files) {
            var total = 0;
            $.each(files, function (index, file) {
                total += file.size || 1
            });
            return total
        },
        _initProgressObject: function (obj) {
            var progress = {loaded: 0, total: 0, bitrate: 0};
            if (obj._progress) {
                $.extend(obj._progress, progress)
            } else {
                obj._progress = progress
            }
        },
        _initResponseObject: function (obj) {
            var prop;
            if (obj._response) {
                for (prop in obj._response) {
                    if (obj._response.hasOwnProperty(prop)) {
                        delete obj._response[prop]
                    }
                }
            } else {
                obj._response = {}
            }
        },
        _onProgress: function (e, data) {
            if (e.lengthComputable) {
                var now = ((Date.now) ? Date.now() : (new Date()).getTime()), loaded;
                if (data._time && data.progressInterval && (now - data._time < data.progressInterval) && e.loaded !== e.total) {
                    return
                }
                data._time = now;
                loaded = Math.floor(e.loaded / e.total * (data.chunkSize || data._progress.total)) + (data.uploadedBytes || 0);
                this._progress.loaded += (loaded - data._progress.loaded);
                this._progress.bitrate = this._bitrateTimer.getBitrate(now, this._progress.loaded, data.bitrateInterval);
                data._progress.loaded = data.loaded = loaded;
                data._progress.bitrate = data.bitrate = data._bitrateTimer.getBitrate(now, loaded, data.bitrateInterval);
                this._trigger('progress', e, data);
                this._trigger('progressall', e, this._progress)
            }
        },
        _initProgressListener: function (options) {
            var that = this, xhr = options.xhr ? options.xhr() : $.ajaxSettings.xhr();
            if (xhr.upload) {
                $(xhr.upload).bind('progress', function (e) {
                    var oe = e.originalEvent;
                    e.lengthComputable = oe.lengthComputable;
                    e.loaded = oe.loaded;
                    e.total = oe.total;
                    that._onProgress(e, options)
                });
                options.xhr = function () {
                    return xhr
                }
            }
        },
        _isInstanceOf: function (type, obj) {
            return Object.prototype.toString.call(obj) === '[object ' + type + ']'
        },
        _initXHRData: function (options) {
            var that = this, formData, file = options.files[0],
                multipart = options.multipart || !$.support.xhrFileUpload, paramName = options.paramName[0];
            options.headers = options.headers || {};
            if (options.contentRange) {
                options.headers['Content-Range'] = options.contentRange
            }
            if (!multipart) {
                options.headers['Content-Disposition'] = 'attachment; filename="' + encodeURI(file.name) + '"';
                options.contentType = file.type;
                options.data = options.blob || file
            } else if ($.support.xhrFormDataFileUpload) {
                if (options.postMessage) {
                    formData = this._getFormData(options);
                    if (options.blob) {
                        formData.push({name: paramName, value: options.blob})
                    } else {
                        $.each(options.files, function (index, file) {
                            formData.push({name: options.paramName[index] || paramName, value: file})
                        })
                    }
                } else {
                    if (that._isInstanceOf('FormData', options.formData)) {
                        formData = options.formData
                    } else {
                        formData = new FormData();
                        $.each(this._getFormData(options), function (index, field) {
                            formData.append(field.name, field.value)
                        })
                    }
                    if (options.blob) {
                        options.headers['Content-Disposition'] = 'attachment; filename="' + encodeURI(file.name) + '"';
                        formData.append(paramName, options.blob, file.name)
                    } else {
                        $.each(options.files, function (index, file) {
                            if (that._isInstanceOf('File', file) || that._isInstanceOf('Blob', file)) {
                                formData.append(options.paramName[index] || paramName, file, file.name)
                            }
                        })
                    }
                }
                options.data = formData
            }
            options.blob = null
        },
        _initIframeSettings: function (options) {
            options.dataType = 'iframe ' + (options.dataType || '');
            options.formData = this._getFormData(options);
            if (options.redirect && $('<a></a>').prop('href', options.url).prop('host') !== location.host) {
                options.formData.push({name: options.redirectParamName || 'redirect', value: options.redirect})
            }
        },
        _initDataSettings: function (options) {
            if (this._isXHRUpload(options)) {
                if (!this._chunkedUpload(options, !0)) {
                    if (!options.data) {
                        this._initXHRData(options)
                    }
                    this._initProgressListener(options)
                }
                if (options.postMessage) {
                    options.dataType = 'postmessage ' + (options.dataType || '')
                }
            } else {
                this._initIframeSettings(options)
            }
        },
        _getParamName: function (options) {
            var fileInput = $(options.fileInput), paramName = options.paramName;
            if (!paramName) {
                paramName = [];
                fileInput.each(function () {
                    var input = $(this), name = input.prop('name') || 'files[]',
                        i = (input.prop('files') || [1]).length;
                    while (i) {
                        paramName.push(name);
                        i -= 1
                    }
                });
                if (!paramName.length) {
                    paramName = [fileInput.prop('name') || 'files[]']
                }
            } else if (!$.isArray(paramName)) {
                paramName = [paramName]
            }
            return paramName
        },
        _initFormSettings: function (options) {
            if (!options.form || !options.form.length) {
                options.form = $(options.fileInput.prop('form'));
                if (!options.form.length) {
                    options.form = $(this.options.fileInput.prop('form'))
                }
            }
            options.paramName = this._getParamName(options);
            if (!options.url) {
                options.url = options.form.prop('action') || location.href
            }
            options.type = (options.type || options.form.prop('method') || '').toUpperCase();
            if (options.type !== 'POST' && options.type !== 'PUT' && options.type !== 'PATCH') {
                options.type = 'POST'
            }
            if (!options.formAcceptCharset) {
                options.formAcceptCharset = options.form.attr('accept-charset')
            }
        },
        _getAJAXSettings: function (data) {
            var options = $.extend({}, this.options, data);
            this._initFormSettings(options);
            this._initDataSettings(options);
            return options
        },
        _getDeferredState: function (deferred) {
            if (deferred.state) {
                return deferred.state()
            }
            if (deferred.isResolved()) {
                return 'resolved'
            }
            if (deferred.isRejected()) {
                return 'rejected'
            }
            return 'pending'
        },
        _enhancePromise: function (promise) {
            promise.success = promise.done;
            promise.error = promise.fail;
            promise.complete = promise.always;
            return promise
        },
        _getXHRPromise: function (resolveOrReject, context, args) {
            var dfd = $.Deferred(), promise = dfd.promise();
            context = context || this.options.context || promise;
            if (resolveOrReject === !0) {
                dfd.resolveWith(context, args)
            } else if (resolveOrReject === !1) {
                dfd.rejectWith(context, args)
            }
            promise.abort = dfd.promise;
            return this._enhancePromise(promise)
        },
        _addConvenienceMethods: function (e, data) {
            var that = this, getPromise = function (data) {
                return $.Deferred().resolveWith(that, [data]).promise()
            };
            data.process = function (resolveFunc, rejectFunc) {
                if (resolveFunc || rejectFunc) {
                    data._processQueue = this._processQueue = (this._processQueue || getPromise(this)).pipe(resolveFunc, rejectFunc)
                }
                return this._processQueue || getPromise(this)
            };
            data.submit = function () {
                if (this.state() !== 'pending') {
                    data.jqXHR = this.jqXHR = (that._trigger('submit', e, this) !== !1) && that._onSend(e, this)
                }
                return this.jqXHR || that._getXHRPromise()
            };
            data.abort = function () {
                if (this.jqXHR) {
                    return this.jqXHR.abort()
                }
                return that._getXHRPromise()
            };
            data.state = function () {
                if (this.jqXHR) {
                    return that._getDeferredState(this.jqXHR)
                }
                if (this._processQueue) {
                    return that._getDeferredState(this._processQueue)
                }
            };
            data.progress = function () {
                return this._progress
            };
            data.response = function () {
                return this._response
            }
        },
        _getUploadedBytes: function (jqXHR) {
            var range = jqXHR.getResponseHeader('Range'), parts = range && range.split('-'),
                upperBytesPos = parts && parts.length > 1 && parseInt(parts[1], 10);
            return upperBytesPos && upperBytesPos + 1
        },
        _chunkedUpload: function (options, testOnly) {
            var that = this, file = options.files[0], fs = file.size,
                ub = options.uploadedBytes = options.uploadedBytes || 0, mcs = options.maxChunkSize || fs,
                slice = file.slice || file.webkitSlice || file.mozSlice, dfd = $.Deferred(), promise = dfd.promise(),
                jqXHR, upload;
            if (!(this._isXHRUpload(options) && slice && (ub || mcs < fs)) || options.data) {
                return !1
            }
            if (testOnly) {
                return !0
            }
            if (ub >= fs) {
                file.error = options.i18n('uploadedBytes');
                return this._getXHRPromise(!1, options.context, [null, 'error', file.error])
            }
            upload = function () {
                var o = $.extend({}, options), currentLoaded = o._progress.loaded;
                o.blob = slice.call(file, ub, ub + mcs, file.type);
                o.chunkSize = o.blob.size;
                o.contentRange = 'bytes ' + ub + '-' + (ub + o.chunkSize - 1) + '/' + fs;
                that._initXHRData(o);
                that._initProgressListener(o);
                jqXHR = ((that._trigger('chunksend', null, o) !== !1 && $.ajax(o)) || that._getXHRPromise(!1, o.context)).done(function (result, textStatus, jqXHR) {
                    ub = that._getUploadedBytes(jqXHR) || (ub + o.chunkSize);
                    if (o._progress.loaded === currentLoaded) {
                        that._onProgress($.Event('progress', {
                            lengthComputable: !0,
                            loaded: ub - o.uploadedBytes,
                            total: ub - o.uploadedBytes
                        }), o)
                    }
                    options.uploadedBytes = o.uploadedBytes = ub;
                    o.result = result;
                    o.textStatus = textStatus;
                    o.jqXHR = jqXHR;
                    that._trigger('chunkdone', null, o);
                    that._trigger('chunkalways', null, o);
                    if (ub < fs) {
                        upload()
                    } else {
                        dfd.resolveWith(o.context, [result, textStatus, jqXHR])
                    }
                }).fail(function (jqXHR, textStatus, errorThrown) {
                    o.jqXHR = jqXHR;
                    o.textStatus = textStatus;
                    o.errorThrown = errorThrown;
                    that._trigger('chunkfail', null, o);
                    that._trigger('chunkalways', null, o);
                    dfd.rejectWith(o.context, [jqXHR, textStatus, errorThrown])
                })
            };
            this._enhancePromise(promise);
            promise.abort = function () {
                return jqXHR.abort()
            };
            upload();
            return promise
        },
        _beforeSend: function (e, data) {
            if (this._active === 0) {
                this._trigger('start');
                this._bitrateTimer = new this._BitrateTimer();
                this._progress.loaded = this._progress.total = 0;
                this._progress.bitrate = 0
            }
            this._initResponseObject(data);
            this._initProgressObject(data);
            data._progress.loaded = data.loaded = data.uploadedBytes || 0;
            data._progress.total = data.total = this._getTotal(data.files) || 1;
            data._progress.bitrate = data.bitrate = 0;
            this._active += 1;
            this._progress.loaded += data.loaded;
            this._progress.total += data.total
        },
        _onDone: function (result, textStatus, jqXHR, options) {
            var total = options._progress.total, response = options._response;
            if (options._progress.loaded < total) {
                this._onProgress($.Event('progress', {lengthComputable: !0, loaded: total, total: total}), options)
            }
            response.result = options.result = result;
            response.textStatus = options.textStatus = textStatus;
            response.jqXHR = options.jqXHR = jqXHR;
            this._trigger('done', null, options)
        },
        _onFail: function (jqXHR, textStatus, errorThrown, options) {
            var response = options._response;
            if (options.recalculateProgress) {
                this._progress.loaded -= options._progress.loaded;
                this._progress.total -= options._progress.total
            }
            response.jqXHR = options.jqXHR = jqXHR;
            response.textStatus = options.textStatus = textStatus;
            response.errorThrown = options.errorThrown = errorThrown;
            this._trigger('fail', null, options)
        },
        _onAlways: function (jqXHRorResult, textStatus, jqXHRorError, options) {
            this._trigger('always', null, options)
        },
        _onSend: function (e, data) {
            if (!data.submit) {
                this._addConvenienceMethods(e, data)
            }
            var that = this, jqXHR, aborted, slot, pipe, options = that._getAJAXSettings(data), send = function () {
                that._sending += 1;
                options._bitrateTimer = new that._BitrateTimer();
                jqXHR = jqXHR || (((aborted || that._trigger('send', e, options) === !1) && that._getXHRPromise(!1, options.context, aborted)) || that._chunkedUpload(options) || $.ajax(options)).done(function (result, textStatus, jqXHR) {
                    that._onDone(result, textStatus, jqXHR, options)
                }).fail(function (jqXHR, textStatus, errorThrown) {
                    that._onFail(jqXHR, textStatus, errorThrown, options)
                }).always(function (jqXHRorResult, textStatus, jqXHRorError) {
                    that._onAlways(jqXHRorResult, textStatus, jqXHRorError, options);
                    that._sending -= 1;
                    that._active -= 1;
                    if (options.limitConcurrentUploads && options.limitConcurrentUploads > that._sending) {
                        var nextSlot = that._slots.shift();
                        while (nextSlot) {
                            if (that._getDeferredState(nextSlot) === 'pending') {
                                nextSlot.resolve();
                                break
                            }
                            nextSlot = that._slots.shift()
                        }
                    }
                    if (that._active === 0) {
                        that._trigger('stop')
                    }
                });
                return jqXHR
            };
            this._beforeSend(e, options);
            if (this.options.sequentialUploads || (this.options.limitConcurrentUploads && this.options.limitConcurrentUploads <= this._sending)) {
                if (this.options.limitConcurrentUploads > 1) {
                    slot = $.Deferred();
                    this._slots.push(slot);
                    pipe = slot.pipe(send)
                } else {
                    pipe = (this._sequence = this._sequence.pipe(send, send))
                }
                pipe.abort = function () {
                    aborted = [undefined, 'abort', 'abort'];
                    if (!jqXHR) {
                        if (slot) {
                            slot.rejectWith(options.context, aborted)
                        }
                        return send()
                    }
                    return jqXHR.abort()
                };
                return this._enhancePromise(pipe)
            }
            return send()
        },
        _onAdd: function (e, data) {
            var that = this, result = !0, options = $.extend({}, this.options, data),
                limit = options.limitMultiFileUploads, paramName = this._getParamName(options), paramNameSet,
                paramNameSlice, fileSet, i;
            if (!(options.singleFileUploads || limit) || !this._isXHRUpload(options)) {
                fileSet = [data.files];
                paramNameSet = [paramName]
            } else if (!options.singleFileUploads && limit) {
                fileSet = [];
                paramNameSet = [];
                for (i = 0; i < data.files.length; i += limit) {
                    fileSet.push(data.files.slice(i, i + limit));
                    paramNameSlice = paramName.slice(i, i + limit);
                    if (!paramNameSlice.length) {
                        paramNameSlice = paramName
                    }
                    paramNameSet.push(paramNameSlice)
                }
            } else {
                paramNameSet = paramName
            }
            data.originalFiles = data.files;
            $.each(fileSet || data.files, function (index, element) {
                var newData = $.extend({}, data);
                newData.files = fileSet ? element : [element];
                newData.paramName = paramNameSet[index];
                that._initResponseObject(newData);
                that._initProgressObject(newData);
                that._addConvenienceMethods(e, newData);
                result = that._trigger('add', e, newData);
                return result
            });
            return result
        },
        _replaceFileInput: function (input) {
            var inputClone = input.clone(!0);
            $('<form></form>').append(inputClone)[0].reset();
            input.after(inputClone).detach();
            $.cleanData(input.unbind('remove'));
            this.options.fileInput = this.options.fileInput.map(function (i, el) {
                if (el === input[0]) {
                    return inputClone[0]
                }
                return el
            });
            if (input[0] === this.element[0]) {
                this.element = inputClone
            }
        },
        _handleFileTreeEntry: function (entry, path) {
            var that = this, dfd = $.Deferred(), errorHandler = function (e) {
                if (e && !e.entry) {
                    e.entry = entry
                }
                dfd.resolve([e])
            }, dirReader;
            path = path || '';
            if (entry.isFile) {
                if (entry._file) {
                    entry._file.relativePath = path;
                    dfd.resolve(entry._file)
                } else {
                    entry.file(function (file) {
                        file.relativePath = path;
                        dfd.resolve(file)
                    }, errorHandler)
                }
            } else if (entry.isDirectory) {
                dirReader = entry.createReader();
                dirReader.readEntries(function (entries) {
                    that._handleFileTreeEntries(entries, path + entry.name + '/').done(function (files) {
                        dfd.resolve(files)
                    }).fail(errorHandler)
                }, errorHandler)
            } else {
                dfd.resolve([])
            }
            return dfd.promise()
        },
        _handleFileTreeEntries: function (entries, path) {
            var that = this;
            return $.when.apply($, $.map(entries, function (entry) {
                return that._handleFileTreeEntry(entry, path)
            })).pipe(function () {
                return Array.prototype.concat.apply([], arguments)
            })
        },
        _getDroppedFiles: function (dataTransfer) {
            dataTransfer = dataTransfer || {};
            var items = dataTransfer.items;
            if (items && items.length && (items[0].webkitGetAsEntry || items[0].getAsEntry)) {
                return this._handleFileTreeEntries($.map(items, function (item) {
                    var entry;
                    if (item.webkitGetAsEntry) {
                        entry = item.webkitGetAsEntry();
                        if (entry) {
                            entry._file = item.getAsFile()
                        }
                        return entry
                    }
                    return item.getAsEntry()
                }))
            }
            return $.Deferred().resolve($.makeArray(dataTransfer.files)).promise()
        },
        _getSingleFileInputFiles: function (fileInput) {
            fileInput = $(fileInput);
            var entries = fileInput.prop('webkitEntries') || fileInput.prop('entries'), files, value;
            if (entries && entries.length) {
                return this._handleFileTreeEntries(entries)
            }
            files = $.makeArray(fileInput.prop('files'));
            if (!files.length) {
                value = fileInput.prop('value');
                if (!value) {
                    return $.Deferred().resolve([]).promise()
                }
                files = [{name: value.replace(/^.*\\/, '')}]
            } else if (files[0].name === undefined && files[0].fileName) {
                $.each(files, function (index, file) {
                    file.name = file.fileName;
                    file.size = file.fileSize
                })
            }
            return $.Deferred().resolve(files).promise()
        },
        _getFileInputFiles: function (fileInput) {
            if (!(fileInput instanceof $) || fileInput.length === 1) {
                return this._getSingleFileInputFiles(fileInput)
            }
            return $.when.apply($, $.map(fileInput, this._getSingleFileInputFiles)).pipe(function () {
                return Array.prototype.concat.apply([], arguments)
            })
        },
        _onChange: function (e) {
            var that = this, data = {fileInput: $(e.target), form: $(e.target.form)};
            this._getFileInputFiles(data.fileInput).always(function (files) {
                data.files = files;
                if (that.options.replaceFileInput) {
                    that._replaceFileInput(data.fileInput)
                }
                if (that._trigger('change', e, data) !== !1) {
                    that._onAdd(e, data)
                }
            })
        },
        _onPaste: function (e) {
            var items = e.originalEvent && e.originalEvent.clipboardData && e.originalEvent.clipboardData.items,
                data = {files: []};
            if (items && items.length) {
                $.each(items, function (index, item) {
                    var file = item.getAsFile && item.getAsFile();
                    if (file) {
                        data.files.push(file)
                    }
                });
                if (this._trigger('paste', e, data) === !1 || this._onAdd(e, data) === !1) {
                    return !1
                }
            }
        },
        _onDrop: function (e) {
            var that = this, dataTransfer = e.dataTransfer = e.originalEvent && e.originalEvent.dataTransfer, data = {};
            if (dataTransfer && dataTransfer.files && dataTransfer.files.length) {
                e.preventDefault();
                this._getDroppedFiles(dataTransfer).always(function (files) {
                    data.files = files;
                    if (that._trigger('drop', e, data) !== !1) {
                        that._onAdd(e, data)
                    }
                })
            }
        },
        _onDragOver: function (e) {
            var dataTransfer = e.dataTransfer = e.originalEvent && e.originalEvent.dataTransfer;
            if (dataTransfer) {
                if (this._trigger('dragover', e) === !1) {
                    return !1
                }
                if ($.inArray('Files', dataTransfer.types) !== -1) {
                    dataTransfer.dropEffect = 'copy';
                    e.preventDefault()
                }
            }
        },
        _initEventHandlers: function () {
            if (this._isXHRUpload(this.options)) {
                this._on(this.options.dropZone, {dragover: this._onDragOver, drop: this._onDrop});
                this._on(this.options.pasteZone, {paste: this._onPaste})
            }
            this._on(this.options.fileInput, {change: this._onChange})
        },
        _destroyEventHandlers: function () {
            this._off(this.options.dropZone, 'dragover drop');
            this._off(this.options.pasteZone, 'paste');
            this._off(this.options.fileInput, 'change')
        },
        _setOption: function (key, value) {
            var reinit = $.inArray(key, this._specialOptions) !== -1;
            if (reinit) {
                this._destroyEventHandlers()
            }
            this._super(key, value);
            if (reinit) {
                this._initSpecialOptions();
                this._initEventHandlers()
            }
        },
        _initSpecialOptions: function () {
            var options = this.options;
            if (options.fileInput === undefined) {
                options.fileInput = this.element.is('input[type="file"]') ? this.element : this.element.find('input[type="file"]')
            } else if (!(options.fileInput instanceof $)) {
                options.fileInput = $(options.fileInput)
            }
            if (!(options.dropZone instanceof $)) {
                options.dropZone = $(options.dropZone)
            }
            if (!(options.pasteZone instanceof $)) {
                options.pasteZone = $(options.pasteZone)
            }
        },
        _getRegExp: function (str) {
            var parts = str.split('/'), modifiers = parts.pop();
            parts.shift();
            return new RegExp(parts.join('/'), modifiers)
        },
        _isRegExpOption: function (key, value) {
            return key !== 'url' && $.type(value) === 'string' && /^\/.*\/[igm]{0,3}$/.test(value)
        },
        _initDataAttributes: function () {
            var that = this, options = this.options;
            $.each($(this.element[0].cloneNode(!1)).data(), function (key, value) {
                if (that._isRegExpOption(key, value)) {
                    value = that._getRegExp(value)
                }
                options[key] = value
            })
        },
        _create: function () {
            this._initDataAttributes();
            this._initSpecialOptions();
            this._slots = [];
            this._sequence = this._getXHRPromise(!0);
            this._sending = this._active = 0;
            this._initProgressObject(this);
            this._initEventHandlers()
        },
        active: function () {
            return this._active
        },
        progress: function () {
            return this._progress
        },
        add: function (data) {
            var that = this;
            if (!data || this.options.disabled) {
                return
            }
            if (data.fileInput && !data.files) {
                this._getFileInputFiles(data.fileInput).always(function (files) {
                    data.files = files;
                    that._onAdd(null, data)
                })
            } else {
                data.files = $.makeArray(data.files);
                this._onAdd(null, data)
            }
        },
        send: function (data) {
            if (data && !this.options.disabled) {
                if (data.fileInput && !data.files) {
                    var that = this, dfd = $.Deferred(), promise = dfd.promise(), jqXHR, aborted;
                    promise.abort = function () {
                        aborted = !0;
                        if (jqXHR) {
                            return jqXHR.abort()
                        }
                        dfd.reject(null, 'abort', 'abort');
                        return promise
                    };
                    this._getFileInputFiles(data.fileInput).always(function (files) {
                        if (aborted) {
                            return
                        }
                        data.files = files;
                        jqXHR = that._onSend(null, data).then(function (result, textStatus, jqXHR) {
                            dfd.resolve(result, textStatus, jqXHR)
                        }, function (jqXHR, textStatus, errorThrown) {
                            dfd.reject(jqXHR, textStatus, errorThrown)
                        })
                    });
                    return this._enhancePromise(promise)
                }
                data.files = $.makeArray(data.files);
                if (data.files.length) {
                    return this._onSend(null, data)
                }
            }
            return this._getXHRPromise(!1, data && data.context)
        }
    })
}));
var context = '';
jQuery(document).ready(function () {


    $('#fileupload').fileupload({
        change : function (e, data) {
            if(data.files.length>1){
                alert("لطفا یک به یک بارگزاری کنید");
                return false;
            }
        },
        maxFileSize: 20000000,
        maxFileCount: 1,
        acceptFileTypes: /(\.|\/)(jpe?g)$/i,

        dataType: 'json',
        done: function (e, data) {
            $.each(data.result.files, function (index, file) {
                $('<p/>').text(file.name).appendTo('#files')
            })
        },
        add: function (e, data) {
            $('.selectFileTd').hide();
            data.submit()
        },
        progressall: function (e, data) {
            var progress = parseInt(data.loaded / data.total * 100, 10);
            $('#progress .progress-bar').css('width', progress + '%')
        }
    }).on('fileuploaddone', function (e, data) {
        $('#progress .progress-bar').css('width', '0%');

        $('#SimpleUploadModal').modal('hide');
        $('#uploadModal').modal('hide');
        $("img").each(function(){
            $(this).attr("src", $(this).attr("src") + '?' + Math.random() );
        });


        //console.log(">"+$("#refresh").val().length);

        if ($("#refresh").val().length>0) {
            var isRefresh = $("#refresh").val();
            //console.log(isRefresh);
            if (isRefresh=="ok") {
                location.reload();
            }
        }
        getFolderFiles();
    }).on('fileuploadfail', function (e, data) {
        $('#progress .progress-bar').css('width', '0%');
        var responseText = jQuery.parseJSON(data.jqXHR.responseText);
        alert(responseText.exception + "-" + responseText.message)
    })
});

// file manager script start
jQuery(document).ready(function () {


    $('body').on('click', 'ul.tree label', function () {
        var folderId = $(this).attr("data-folder-id");
        //getFolderFiles(folderId);
        $('ul.tree label').removeClass('selectLabel');
        var background = $(this).addClass("selectLabel");

        var folderInput = $('#selected-folder').val(folderId);
        //console.log('selected folder : ' + folderInput.val());
        getFolderFiles();
        //get folder list
    });

    $('body').on('dblclick', '.file-thumbnail', function () {
        var fileId = $(this).attr("data-file-id");
        var fileExtention = $(this).attr("data-file-extention");
        if (fileExtention == 'jpg') {
            var url = '/get-file?fileId=' + fileId;
            $.getJSON(url, function (file) {

                var folderpath = file.docFolder.folderPath;
                folderpath = folderpath.replace(/-/g, '/');

                $('#image-preview-tag').attr('src', '/download/' + folderpath + '/' + file.fileName);
                $('#image-preview-modal').modal('show');
            });
        }
        //console.log('double click : ' + fileId);
    });


    $('body').on('click', '.deleteFileButton', function () {
        var val = $(this).attr("data-file-id");

        //console.log('button click : ' + val);
    });

    $('body').on('click', '.fileCheckBox', function () {

        // $('.fileCheckBox').removeAttr('checked');
        // $(this).attr('checked' , 'checked');
        // //console.log('cc = ' +  $(this).attr('checked' , 'checked'));

    });

    $('body').on('click', '.openUploadModal', function (event) {
        var folderId = $('#selected-folder').val();
        $("#folderId").val(folderId);
        //console.log('' + $("#folderId").val(folderId));
        $('#uploadModal').modal('show')
    });

    $('body').on('click', '.openSimpleUploadModal', function (event) {
        var url = $(this).data("url");
        var id = $(this).data("uid");
        var refresh = $(this).data("refresh");
        $("#fileupload").attr("action",url);
        $("#fileuploadId").val(id);
        $("#refresh").val(refresh);
        $('#SimpleUploadModal').modal('show')
    });

    $('body').on('click', '.btn-copy-url', function (event) {
        event.preventDefault();
        var fileDiv = $(this).closest('.file-thumbnail');
        var fileLink = fileDiv.attr('data-file-link');
        var fileId = fileDiv.attr('data-file-id');

        copyToClipboard(fileLink);
        setSelectedImageSrc(fileId);
        $('#document-manager').modal('hide');

    });

    $('body').on('click', '.delete-file-confirm-close', function (event) {
        $('#delete-file-confirm').modal('hide');
    });

    $('body').on('click', '.btn-preview-file', function (event) {
        var fileId = $(this).closest('.file-thumbnail').attr("data-file-id");
        //console.log('fileId : ' + fileId);
        var fileExtention = $(this).closest('.file-thumbnail').attr("data-file-extention");
        var fileLink = $(this).closest('.file-thumbnail').attr("data-file-link");
        filePreview(fileId, fileExtention, fileLink);

    });

    $('body').on('click', '.btn-delete-file', function (event) {

        var fileId = $(this).closest('.file-thumbnail').attr("data-file-id");
        deleteFile(fileId);
        //console.log('fileExtention : ' + fileId);
    });
});

$('#create-folder-submit').click(function () {
    var folderName = $('#new-folder-name').val();
    var parrentId = $('#selected-folder').val();
    //console.log('folderName : ' + folderName + ' - parrentId :' + parrentId);
    $.post("/_secure/createFolder", {"folderName": folderName, "parentFolderId": parrentId}, function (data) {
        var folderId = $('#selected-folder').val();//selected-folder v=3
        var liId = "li" + folderId;
        var currentLi = $('#' + liId);
        var liHtml = '<li class="tree-li" id="li' + data.id + '"><label for="folder-'
            + data.id + '" data-folder-id="'
            + data.id + '">'
            + data.folderName + '</label><input type="checkbox" id="folder-'
            + data.id + '" /></li>';

if(folderId == -1 ){

   if($('#root-folders').has('ul').length){
       $('#root-folders').find('ul').append(liHtml);
   }else{
       $('#root-folders').append('<ul>'+liHtml+'</ul>');
   }
}
else{
    if (currentLi.children('ul').length > 0) {
        var liHtml = '<li class="tree-li" id="li'
            + data.id + '"><label for="folder-'
            + data.id + '" data-folder-id="'
            + data.id + '">'
            + data.folderName + '</label><input type="checkbox" id="folder-'
            + data.id + '" /></li>';

        var oll = currentLi.children('ul');
        oll.append(liHtml);
        //console.log('has ul');
    } else {
        var liHtml = '<ul><li><label for="folder-' + data.id + '" data-folder-id="' + data.id + '">' + data.folderName + '</label></li></ul>';
        currentLi.append(liHtml);
        //console.log('has not ul');
    }
}

        //console.log('return folder : ' + data.folderName);
        $('#create-folder-close').click();
    });

});

$('#create-new-folder').click(function () {
    var folderId = $('#selected-folder').val();
    if (folderId === '') {
        $('.errorContentُSmall').text('Klasör seçilmedi');
        $('#file-manager-error-modal').modal('show');
    }
    else {
        $('#create-folder-modal').modal('show');
    }
});

$('#create-folder-close').click(function () {
    $('#create-folder-modal').modal('hide');
});

$('#create-folder-modal-x').click(function () {
    $('#create-folder-modal').modal('hide');
});

$('#document-manager-modal-x').click(function () {

    $('#document-manager').modal('hide');
});

$('#upload-file-button').click(function () {

    var folderId = $('#selected-folder').val();
    if (folderId === '') {
        $('.errorContentُSmall').text('Klasör seçilmedi');
        $('#file-manager-error-modal').modal('show');
    }
    else if (folderId === '-1') {
        $('.errorContentُSmall').text('Klasör seçilmedi');
        $('#file-manager-error-modal').modal('show');
    }
    else {
        var folderId = $('#selected-folder').val();
        $("#folderId").val(folderId);
        $('#uploadModal').modal('show');
    }

});

$('#uploadModal-x').click(function () {
    $('#uploadModal').modal('hide');
});

$('#audio-media-player-x').click(function () {
    $('#audio-media-player').modal('hide');
});

function setSelectedImageSrc(fileId) {
    var url = '/_secure/get-file?fileId=' + fileId;
    $.getJSON(url, function (file) {
        var folderpath = file.docFolder.folderPath;
        folderpath = folderpath.replace(/-/g, '/');
        $('.SelectedFileGoHere').attr('src', '/download/' + folderpath + '/' + file.fileName);
        $('#document-manager').modal('hide');
    });
}

function copyToClipboard(val) {
    var returnId = $('#return-id').val();
    if(returnId === 'base64'){
        $('#document-manager').modal('hide');
        //console.log(val);
        selectetEditor.insertContent('<div class="center-block"><img src="' + val + '" class="img-news-content"  /></div> ');
    } else{

        $('#' + returnId).val(val);
       var imageSrc =  $('#image-preview').attr('src' , val);

    }
}

function getFolderFiles() {
    var folderId = $('#selected-folder').val();
    $('#file-list-div').empty();
    if (folderId === "-1")
        return;

    if (folderId  === undefined)
        return;

    var url = '/_secure/folderFiles?folderId=' + folderId;
    $.getJSON(url, function (files) {
        $.each(files, function (key, file) {
            var fileDiv = createFileTumbnsil(file);
            $('#file-list-div').append(fileDiv);
            //console.log(file.fileName);
        });
    });
}

function getFileType(file) {

    var imageSrc = '/public/admin/assets/img/filetype/tumb-unknown.png';
    var videoTypes = ['webm', 'mkv', 'flv', 'vob', 'ogv', 'ogg', 'drc', 'gifv', 'mng', 'avi', 'MTS', 'M2TS', 'mov', 'qt', 'wmv', 'wmv', 'rm', 'rmvb', 'asf', 'amv', 'mp4', 'm4v', 'mp2', 'mpeg', 'mpe', 'mpv', 'm2v', 'm4v', 'svi', '3gp', '3g2', 'mxf', 'roq', 'nsv', 'flv', 'f4v', 'f4p', 'f4a', 'f4b'];

    var audioTypes = ['3gp', 'aa', 'aac', 'aax', 'act', 'aiff', 'amr', 'ape', 'au', 'awb', 'dct', 'dss', 'flac', 'gsm', 'iklax', 'ivs', 'm4a', 'm4b', 'm4p', 'mmf', 'mp3', 'mpc', 'msv', 'nsf', 'ogg', 'oga', 'mogg', 'opus', 'ra', 'rm', 'raw', 'sln', 'tta', 'vox', 'wav', 'wma', 'wv', 'webm', '8svx'];

    var imageTypes = ['jpeg', 'jpg', 'tiff', 'gif', 'bmp', 'png', 'svg'];
    var officeType = ['doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx'];

    if (imageTypes.includes(file.fileExtension)) {
        if (file.fileExtension === 'jpg') {
            var folderpath = file.docFolder.folderPath;
            folderpath = folderpath.replace(/-/g, '/');
            //console.log('folderPath ' + folderpath);
            imageSrc = '/download/' + folderpath + '/medium_' + file.fileName;
        }
        else {
            var folderpath = file.docFolder.folderPath;
            folderpath = folderpath.replace(/-/g, '/');
            imageSrc = '/download/' + folderpath + '/' + file.fileName;
        }
    }
    if (audioTypes.includes(file.fileExtension)) {
        imageSrc = '/public/admin/assets/img/filetype/tumb-music.png';
    }
    if (officeType.includes(file.fileExtension)) {
        imageSrc = '/public/admin/assets/img/filetype/tumb-office.png';
    }
    if (videoTypes.includes(file.fileExtension)) {
        imageSrc = '/public/admin/assets/img/filetype/tumb-video.png';
    }
    if (file.fileExtension === 'pdf') {
        imageSrc = '/public/admin/assets/img/filetype/tumb-pdf.png';
    }
    return imageSrc;
}

function deleteFile(fileId) {
    var url = '/_secure/delete-file?fileId=' + fileId;
    $.post(url, function (resualt) {
        if (resualt) {
            getFolderFiles();
        }
    });

}

/*filemanager Tumbnail*/
function createFileTumbnsil(file) {
    var folderpath = file.docFolder.folderPath;
    folderpath = folderpath.replace(/-/g, '/');
    var imageSrc = getFileType(file);
    var fileDiv = '<div   class="w-25 file-thumbnail  " data-file-id="' +
        file.id +
        '" data-file-extention="' + file.fileExtension + '" data-file-link="' +
        "/download/" + folderpath + '/' + file.fileName + '"  >';

    fileDiv += '<div class="panel panel-default pull-left fix-panel-content" >';

    fileDiv += '<div class="panel-heading">';
    fileDiv += '<div class="row">';
    fileDiv += ' <div class="btn-group pull-right" role="group" aria-label="">';
    fileDiv += '<button type="button" class="btn btn-link btn-xs btn-copy-url" data-toggle="tooltip" data-placement="top" title="" data-original-title="Copy Link"><i class="fa fa-copy fa-fw fa-lg text-gray-lighter"></i></button>';
    fileDiv += '<button type="button" class="btn btn-link btn-xs btn-preview-file" data-toggle="tooltip" data-placement="top" title="" data-original-title="preview"><i class="fa fa- fa-search-plus fa-fw fa-lg text-gray-lighter"></i></button>';
    fileDiv += '<button type="button" class="btn btn-link btn-xs btn-delete-file" data-toggle="tooltip" data-placement="top" title="" data-original-title="Delete"><i class="fa fa-trash-o fa-fw fa-lg text-gray-lighter"></i></button>';
    fileDiv += '</div>';

    fileDiv += '<span class="panel-title filemaneger-size fontEn "  >' + file.fileSize + '</span>';
    fileDiv += '</div>';
    fileDiv += '</div>';

    fileDiv += '<div class="     ">';

    fileDiv += '<img class="img-responsive   filemaneger-image" src="' + imageSrc + '" />';
    fileDiv += '</div>';
    fileDiv += '<div class="panel-footer  text-gray-light text-left">';
    fileDiv += '<p class="text-center fontEn filemaneger-filename"   >' + file.fileName + '</p>';

    fileDiv += '</div>';
    fileDiv += '</div>';
    return fileDiv;
}

function filePreview(fileId, fileExtention, fileLink) {

    var videoTypes = ['webm', 'mkv', 'flv', 'vob', 'ogv', 'ogg', 'drc', 'gifv', 'mng', 'avi', 'MTS', 'M2TS', 'mov', 'qt', 'wmv', 'wmv', 'rm', 'rmvb', 'asf', 'amv', 'mp4', 'm4v', 'mp2', 'mpeg', 'mpe', 'mpv', 'm2v', 'm4v', 'svi', '3gp', '3g2', 'mxf', 'roq', 'nsv', 'flv', 'f4v', 'f4p', 'f4a', 'f4b'];

    var audioTypes = ['3gp', 'aa', 'aac', 'aax', 'act', 'aiff', 'amr', 'ape', 'au', 'awb', 'dct', 'dss', 'flac', 'gsm', 'iklax', 'ivs', 'm4a', 'm4b', 'm4p', 'mmf', 'mp3', 'mpc', 'msv', 'nsf', 'ogg', 'oga', 'mogg', 'opus', 'ra', 'rm', 'raw', 'sln', 'tta', 'vox', 'wav', 'wma', 'wv', 'webm', '8svx'];

    var imageTypes = ['jpeg', 'jpg', 'tiff', 'gif', 'bmp', 'png', 'svg'];

    if (imageTypes.includes(fileExtention)) {
        var url = '/_secure/get-file?fileId=' + fileId;
        $.getJSON(url, function (file) {
            var folderpath = file.docFolder.folderPath;
            folderpath = folderpath.replace(/-/g, '/');
            $('#image-preview-tag').attr('src', '/download/' + folderpath + '/' + file.fileName);
            $('#image-preview-modal').modal('show');
        });
    }
    else if (audioTypes.includes(fileExtention)) {
        fileLink = fileLink.replace('/download/', '/getAudio/');
        $('#audio-media-src').attr('src', fileLink);
        $('#audio-media-player').modal('show');
    }
}

// file manager script finish