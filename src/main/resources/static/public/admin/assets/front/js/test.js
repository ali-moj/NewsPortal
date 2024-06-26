/*
    JQuery Advanced News Ticker 1.0.11 (20/02/14)
    created by risq
    website (docs & demos) : http://risq.github.io/jquery-advanced-news-ticker/
*/
(function (b, k, l, m) {
    function g(a, f) {
        this.element = a;
        this.$el = b(a);
        this.options = b.extend({}, c, f);
        this._defaults = c;
        this._name = d;
        this.moveInterval;
        this.moving = this.paused = this.state = 0;
        (this.$el.is("ul") || this.$el.is("ol")) && this.init()
    }

    var d = "newsTicker", c = {
        row_height: 20,
        max_rows: 3,
        speed: 400,
        duration: 2500,
        direction: "up",
        autostart: 1,
        pauseOnHover: 1,
        nextButton: null,
        prevButton: null,
        startButton: null,
        stopButton: null,
        hasMoved: function () {
        },
        movingUp: function () {
        },
        movingDown: function () {
        },
        start: function () {
        },
        stop: function () {
        },
        pause: function () {
        },
        unpause: function () {
        }
    };
    g.prototype = {
        init: function () {
            this.$el.height(this.options.row_height * this.options.max_rows).css({overflow: "hidden"});
            this.checkSpeed();
            this.options.nextButton && "undefined" !== typeof this.options.nextButton[0] && this.options.nextButton.click(function (a) {
                this.moveNext();
                this.resetInterval()
            }.bind(this));
            this.options.prevButton && "undefined" !== typeof this.options.prevButton[0] && this.options.prevButton.click(function (a) {
                this.movePrev();
                this.resetInterval()
            }.bind(this));
            this.options.stopButton && "undefined" !== typeof this.options.stopButton[0] && this.options.stopButton.click(function (a) {
                this.stop()
            }.bind(this));
            this.options.startButton && "undefined" !== typeof this.options.startButton[0] && this.options.startButton.click(function (a) {
                this.start()
            }.bind(this));
            this.options.pauseOnHover && this.$el.hover(function () {
                this.state && this.pause()
            }.bind(this), function () {
                this.state && this.unpause()
            }.bind(this));
            this.options.autostart && this.start()
        }, start: function () {
            this.state || (this.state =
                1, this.resetInterval(), this.options.start())
        }, stop: function () {
            this.state && (clearInterval(this.moveInterval), this.state = 0, this.options.stop())
        }, resetInterval: function () {
            this.state && (clearInterval(this.moveInterval), this.moveInterval = setInterval(function () {
                this.move()
            }.bind(this), this.options.duration))
        }, move: function () {
            this.paused || this.moveNext()
        }, moveNext: function () {
            "down" === this.options.direction ? this.moveDown() : "up" === this.options.direction && this.moveUp()
        }, movePrev: function () {
            "down" === this.options.direction ?
                this.moveUp() : "up" === this.options.direction && this.moveDown()
        }, pause: function () {
            this.paused || (this.paused = 1);
            this.options.pause()
        }, unpause: function () {
            this.paused && (this.paused = 0);
            this.options.unpause()
        }, moveDown: function () {
            this.moving || (this.moving = 1, this.options.movingDown(), this.$el.children("li:last").detach().prependTo(this.$el).css("marginTop", "-" + this.options.row_height + "px").animate({marginTop: "0px"}, this.options.speed, function () {
                this.moving = 0;
                this.options.hasMoved()
            }.bind(this)))
        }, moveUp: function () {
            if (!this.moving) {
                this.moving =
                    1;
                this.options.movingUp();
                var a = this.$el.children("li:first");
                a.animate({marginTop: "-" + this.options.row_height + "px"}, this.options.speed, function () {
                    a.detach().css("marginTop", "0").appendTo(this.$el);
                    this.moving = 0;
                    this.options.hasMoved()
                }.bind(this))
            }
        }, updateOption: function (a, b) {
            "undefined" !== typeof this.options[a] && (this.options[a] = b, "duration" == a || "speed" == a) && (this.checkSpeed(), this.resetInterval())
        }, add: function (a) {
            this.$el.append(b("<li>").html(a))
        }, getState: function () {
            return paused ? 2 : this.state
        },
        checkSpeed: function () {
            this.options.duration < this.options.speed + 25 && (this.options.speed = this.options.duration - 25)
        }, destroy: function () {
            this._destroy()
        }
    };
    b.fn[d] = function (a) {
        var f = arguments;
        return this.each(function () {
            var c = b(this), e = b.data(this, "plugin_" + d), h = "object" === typeof a && a;
            e || c.data("plugin_" + d, e = new g(this, h));
            "string" === typeof a && e[a].apply(e, Array.prototype.slice.call(f, 1))
        })
    }
})(jQuery, window, document);