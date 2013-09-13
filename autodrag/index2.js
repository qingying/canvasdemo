KISSY.add('autodrag', function (S, DOM) {
        function autodrag(config) {
            if (!config) {
                config = {};
            }
            this.container = DOM.get(config.container);
            this.items = DOM.query(config.filter);
            this.mode = config.mode;

            this.gapHeight = config.gapHeight || 10;
            this.gapHeight = config.gapHeight || 10;
            this.maxSize = config.maxSize || [300,180];
            this.minSize = config.minSize ||[150, 90];

        }

        autodrag.prototype = {
            setMode:function () {
                var X = DOM.css(this.items[0],'width');
                var Y = DOM.css(this.items[0],'height');
                var K = 5 / 3;
                /*网页截图宽高比*/
                var P = this.items.length + 1;
                /*网页数量*/
                var h;
                /*网页高度*/
                var w;
                /*网页宽度*/
                var t;
                /*t列*/
                var r;
                /*r行*/
                var b = 3;
                /*border*/
                var hAll = [];
                /*所有可能的网页截图高度*/
                for (var i = 2; i < P; i++) {
                    t = i;
                    r = P % t == 0 ? P / t : parseInt(P / t) + 1;
                    hAll[i - 2] = Math.min(X / (K * t), Y / r);
                }
                var temp;
                hAll.sort(function compare(a, b) {
                    return b - a
                });
                h = Math.floor(hAll[0] - this.gapHeight);
                if (h > this.maxSize[1] + b * 2) {
                    h = this.maxSize[1];
                    w = h * K;
                } else if (h < this.minSize[1] + b * 2) {
                    h = this.minSize[1] + b * 2;
                    w = this.minSize[1] * K + b * 2;
                } else {
                    w = h * K;
                }

                t = parseInt(X / (w + this.gapWidth));
                r = P % t == 0 ? parseInt(P / t) : parseInt(P / t) + 1;
                this.itemWidth = w - b * 2;
                this.itemHeight = h - b * 2;
                this.mode = [t, r];
            },

        }
    },
    {
        requires:['dom']
    }
)