(function ($, window, undefined) {
    'use strict';
    $.fn.backstretch = function (images, options) {
        if (images === undefined || images.length === 0) {
            $.error("No images were supplied for Backstretch")
        }
        if ($(window).scrollTop() === 0) {
            window.scrollTo(0, 0)
        }
        return this.each(function () {
            var $this = $(this), obj = $this.data('backstretch');
            if (obj) {
                if (typeof images == 'string' && typeof obj[images] == 'function') {
                    obj[images](options);
                    return
                }
                options = $.extend(obj.options, options);
                obj.destroy(!0)
            }
            obj = new Backstretch(this, images, options);
            $this.data('backstretch', obj)
        })
    };
    $.backstretch = function (images, options) {
        return $('body').backstretch(images, options).data('backstretch')
    };
    $.expr[':'].backstretch = function (elem) {
        return $(elem).data('backstretch') !== undefined
    };
    $.fn.backstretch.defaults = {centeredX: !0, centeredY: !0, duration: 5000, fade: 0};
    var styles = {
        wrap: {
            left: 0,
            top: 0,
            overflow: 'hidden',
            margin: 0,
            padding: 0,
            height: '100%',
            width: '100%',
            zIndex: -999999
        },
        img: {
            position: 'absolute',
            display: 'none',
            margin: 0,
            padding: 0,
            border: 'none',
            width: 'auto',
            height: 'auto',
            maxHeight: 'none',
            maxWidth: 'none',
            zIndex: -999999
        }
    };
    var Backstretch = function (container, images, options) {
        this.options = $.extend({}, $.fn.backstretch.defaults, options || {});
        this.images = $.isArray(images) ? images : [images];
        $.each(this.images, function () {
            $('<img />')[0].src = this
        });
        this.isBody = container === document.body;
        this.$container = $(container);
        this.$root = this.isBody ? supportsFixedPosition ? $(window) : $(document) : this.$container;
        var $existing = this.$container.children(".backstretch").first();
        this.$wrap = $existing.length ? $existing : $('<div class="backstretch"></div>').css(styles.wrap).appendTo(this.$container);
        if (!this.isBody) {
            var position = this.$container.css('position'), zIndex = this.$container.css('zIndex');
            this.$container.css({
                position: position === 'static' ? 'relative' : position,
                zIndex: zIndex === 'auto' ? 0 : zIndex,
                background: 'none'
            });
            this.$wrap.css({zIndex: -999998})
        }
        this.$wrap.css({position: this.isBody && supportsFixedPosition ? 'fixed' : 'absolute'});
        this.index = 0;
        this.show(this.index);
        $(window).on('resize.backstretch', $.proxy(this.resize, this)).on('orientationchange.backstretch', $.proxy(function () {
            if (this.isBody && window.pageYOffset === 0) {
                window.scrollTo(0, 1);
                this.resize()
            }
        }, this))
    };
    Backstretch.prototype = {
        resize: function () {
            try {
                var bgCSS = {left: 0, top: 0}, rootWidth = this.isBody ? this.$root.width() : this.$root.innerWidth(),
                    bgWidth = rootWidth,
                    rootHeight = this.isBody ? (window.innerHeight ? window.innerHeight : this.$root.height()) : this.$root.innerHeight(),
                    bgHeight = bgWidth / this.$img.data('ratio'), bgOffset;
                if (bgHeight >= rootHeight) {
                    bgOffset = (bgHeight - rootHeight) / 2;
                    if (this.options.centeredY) {
                        bgCSS.top = '-' + bgOffset + 'px'
                    }
                } else {
                    bgHeight = rootHeight;
                    bgWidth = bgHeight * this.$img.data('ratio');
                    bgOffset = (bgWidth - rootWidth) / 2;
                    if (this.options.centeredX) {
                        bgCSS.left = '-' + bgOffset + 'px'
                    }
                }
                this.$wrap.css({width: rootWidth, height: rootHeight}).find('img:not(.deleteable)').css({
                    width: bgWidth,
                    height: bgHeight
                }).css(bgCSS)
            } catch (err) {
            }
            return this
        }, show: function (newIndex) {
            if (Math.abs(newIndex) > this.images.length - 1) {
                return
            }
            var self = this, oldImage = self.$wrap.find('img').addClass('deleteable'),
                evtOptions = {relatedTarget: self.$container[0]};
            self.$container.trigger($.Event('backstretch.before', evtOptions), [self, newIndex]);
            this.index = newIndex;
            clearInterval(self.interval);
            self.$img = $('<img />').css(styles.img).bind('load', function (e) {
                var imgWidth = this.width || $(e.target).width(), imgHeight = this.height || $(e.target).height();
                $(this).data('ratio', imgWidth / imgHeight);
                $(this).fadeIn(self.options.speed || self.options.fade, function () {
                    oldImage.remove();
                    if (!self.paused) {
                        self.cycle()
                    }
                    $(['after', 'show']).each(function () {
                        self.$container.trigger($.Event('backstretch.' + this, evtOptions), [self, newIndex])
                    })
                });
                self.resize()
            }).appendTo(self.$wrap);
            self.$img.attr('src', self.images[newIndex]);
            return self
        }, next: function () {
            return this.show(this.index < this.images.length - 1 ? this.index + 1 : 0)
        }, prev: function () {
            return this.show(this.index === 0 ? this.images.length - 1 : this.index - 1)
        }, pause: function () {
            this.paused = !0;
            return this
        }, resume: function () {
            this.paused = !1;
            this.next();
            return this
        }, cycle: function () {
            if (this.images.length > 1) {
                clearInterval(this.interval);
                this.interval = setInterval($.proxy(function () {
                    if (!this.paused) {
                        this.next()
                    }
                }, this), this.options.duration)
            }
            return this
        }, destroy: function (preserveBackground) {
            $(window).off('resize.backstretch orientationchange.backstretch');
            clearInterval(this.interval);
            if (!preserveBackground) {
                this.$wrap.remove()
            }
            this.$container.removeData('backstretch')
        }
    };
    var supportsFixedPosition = (function () {
        var ua = navigator.userAgent, platform = navigator.platform, wkmatch = ua.match(/AppleWebKit\/([0-9]+)/),
            wkversion = !!wkmatch && wkmatch[1], ffmatch = ua.match(/Fennec\/([0-9]+)/),
            ffversion = !!ffmatch && ffmatch[1], operammobilematch = ua.match(/Opera Mobi\/([0-9]+)/),
            omversion = !!operammobilematch && operammobilematch[1], iematch = ua.match(/MSIE ([0-9]+)/),
            ieversion = !!iematch && iematch[1];
        return !(((platform.indexOf("iPhone") > -1 || platform.indexOf("iPad") > -1 || platform.indexOf("iPod") > -1) && wkversion && wkversion < 534) || (window.operamini && ({}).toString.call(window.operamini) === "[object OperaMini]") || (operammobilematch && omversion < 7458) || (ua.indexOf("Android") > -1 && wkversion && wkversion < 533) || (ffversion && ffversion < 6) || ("palmGetResource" in window && wkversion && wkversion < 534) || (ua.indexOf("MeeGo") > -1 && ua.indexOf("NokiaBrowser/8.5.0") > -1) || (ieversion && ieversion <= 6))
    }())
}(jQuery, window));
var Login = function () {
    var handleLogin = function () {
        $('.login-form').validate({
            errorElement: 'span',
            errorClass: 'help-block',
            focusInvalid: !1,
            rules: {username: {required: !0}, password: {required: !0}, remember: {required: !1}},
            messages: {username: {required: "Username is required."}, password: {required: "Password is required."}},
            invalidHandler: function (event, validator) {
                $('.alert-danger', $('.login-form')).show()
            },
            highlight: function (element) {
                $(element).closest('.form-group').addClass('has-error')
            },
            success: function (label) {
                label.closest('.form-group').removeClass('has-error');
                label.remove()
            },
            errorPlacement: function (error, element) {
                error.insertAfter(element.closest('.input-icon'))
            },
            submitHandler: function (form) {
                form.submit()
            }
        });
        $('.login-form input').keypress(function (e) {
            if (e.which == 13) {
                if ($('.login-form').validate().form()) {
                    $('.login-form').submit()
                }
                return !1
            }
        })
    }
    var handleForgetPassword = function () {
        $('.forget-form').validate({
            errorElement: 'span',
            errorClass: 'help-block',
            focusInvalid: !1,
            ignore: "",
            rules: {email: {required: !0, email: !0}},
            messages: {email: {required: "Email is required."}},
            invalidHandler: function (event, validator) {
            },
            highlight: function (element) {
                $(element).closest('.form-group').addClass('has-error')
            },
            success: function (label) {
                label.closest('.form-group').removeClass('has-error');
                label.remove()
            },
            errorPlacement: function (error, element) {
                error.insertAfter(element.closest('.input-icon'))
            },
            submitHandler: function (form) {
                form.submit()
            }
        });
        $('.forget-form input').keypress(function (e) {
            if (e.which == 13) {
                if ($('.forget-form').validate().form()) {
                    $('.forget-form').submit()
                }
                return !1
            }
        });
        jQuery('#forget-password').click(function () {
            jQuery('.login-form').hide();
            jQuery('.forget-form').show()
        });
        jQuery('#back-btn').click(function () {
            jQuery('.login-form').show();
            jQuery('.forget-form').hide()
        })
    }
    var handleRegister = function () {
        function format(state) {
            if (!state.id) return state.text;
            return "<img class='flag' src='../../assets/global/img/flags/" + state.id.toLowerCase() + ".png'/>&nbsp;&nbsp;" + state.text
        }

        $("#select2_sample4").select2({
            placeholder: '<i class="fa fa-map-marker"></i>&nbsp;Select a Country',
            allowClear: !0,
            formatResult: format,
            formatSelection: format,
            escapeMarkup: function (m) {
                return m
            }
        });
        $('#select2_sample4').change(function () {
            $('.register-form').validate().element($(this))
        });
        $('.register-form').validate({
            errorElement: 'span',
            errorClass: 'help-block',
            focusInvalid: !1,
            ignore: "",
            rules: {
                fullname: {required: !0},
                email: {required: !0, email: !0},
                address: {required: !0},
                city: {required: !0},
                country: {required: !0},
                username: {required: !0},
                password: {required: !0},
                rpassword: {equalTo: "#register_password"},
                tnc: {required: !0}
            },
            messages: {tnc: {required: "Please accept TNC first."}},
            invalidHandler: function (event, validator) {
            },
            highlight: function (element) {
                $(element).closest('.form-group').addClass('has-error')
            },
            success: function (label) {
                label.closest('.form-group').removeClass('has-error');
                label.remove()
            },
            errorPlacement: function (error, element) {
                if (element.attr("name") == "tnc") {
                    error.insertAfter($('#register_tnc_error'))
                } else if (element.closest('.input-icon').size() === 1) {
                    error.insertAfter(element.closest('.input-icon'))
                } else {
                    error.insertAfter(element)
                }
            },
            submitHandler: function (form) {
                form.submit()
            }
        });
        $('.register-form input').keypress(function (e) {
            if (e.which == 13) {
                if ($('.register-form').validate().form()) {
                    $('.register-form').submit()
                }
                return !1
            }
        });
        jQuery('#register-btn').click(function () {
            jQuery('.login-form').hide();
            jQuery('.register-form').show()
        });
        jQuery('#register-back-btn').click(function () {
            jQuery('.login-form').show();
            jQuery('.register-form').hide()
        })
    }
    return {
        init: function () {
            handleLogin();
            handleForgetPassword();
            handleRegister()
        }
    }
}()

/*Part3 Slides*/
jQuery(document).ready(function () {
    jQuery.backstretch([

            "/public/admin/assets/img/Login-1.jpg",
            "/public/admin/assets/img/Login-2.jpg",
            "/public/admin/assets/img/Login-3.jpg",
            "/public/admin/assets/img/Login-4.jpg",
        ], {
            fade: 1000,
            duration: 8000
        }
    );
});