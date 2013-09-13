/**
 * Created with JetBrains WebStorm.
 * User: qingying.pt
 * Date: 12-10-8
 * Time: 下午2:40
 * To change this template use File | Settings | File Templates.
 */
var data = [];
for (var i = 1; i <= 5; i++) {
    var obj = {
        title:i + "我的首页 新浪微博-随时随地分享身边的新鲜事儿",
        url:"http://weibo.com/",
        id:i
    };
    data.push(obj);
}
var S = KISSY, DOM = S.DOM, Event = S.Event;
/*重新定位节点顺序*/
function sortnum() {
    var eleDrags = DOM.query('.draglist');
    for (var i = 0; i < eleDrags.length; i++) {
        DOM.attr(eleDrags[i], 'data-num', i);
    }
}

function MakeQuickAcessPages(data) {
    this.data = data;
    this.setMode();
    this.decorate();
}
MakeQuickAcessPages.prototype = {
    maxSize:[300, 180],
    minSize:[150, 90],
    length:data.length,
    mode_:[],
    itemWidth:0,
    itemHeight:0,
    gapWidth:30,
    gapHeight:30,
    dataLength:this.data.length,
    Container:DOM.get('.J_dragbox'),
    items:[],
    get showWidth() {
        return DOM.viewportWidth() * 0.8;
    },
    get showHeight() {
        return DOM.viewportHeight() * 0.8;
    },
    set mode(arr) {
        if (this.mode_.toString() != arr.toString()) {
            console.log('false');
            this.mode_ = arr;
            this.resetLayout();
        }
    },
    get mode() {
        return this.mode_;
    },
    setMode:function (p) {
        var X = this.showWidth;
        var Y = this.showHeight;
        var K = 5 / 3;
        /*网页截图宽高比*/
        var P = this.dataLength + 1;
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
    clearContainer:function () {
        this.Container.innerHTML = '';
    },
    decorate:function () {
        var tempNodes = document.createDocumentFragment();
        for (var i = 0; i < this.dataLength; i++) {
            var item = this.makeItem(this.data[i]);
            this.positionItem(i, item, true);
            this.items.push(item);
            tempNodes.appendChild(item);
        }
        var addnode = this.makeAddItem();
        addnode.addEventListener('click', this.onAddPage.bind(this));
        this.positionItem(this.dataLength, addnode, true);

        tempNodes.appendChild(addnode);

        this.Container.appendChild(tempNodes);
        var self = this;
        setTimeout(function () {
            self.bindDrag(self.Container);
            self.layout();
        }, 0);

        sortnum();
    },
    makeItem:function (obj) {
        var node = document.createElement('div');
        var itemInner = '<a class="title"><p>' + obj.title + '</p></a>';
        node.id = obj.id;
        node.className = 'draglist thumbnailContainer';
        node.innerHTML = itemInner;

        var removeNode = document.createElement('a');
        removeNode.className = 'remove';
        removeNode.addEventListener('click', this.onRemove.bind(this));

        node.appendChild(removeNode);
        return node;
    },
    makeAddItem:function () {
        var node = document.createElement('div');

        var addCanvas = document.createElement('canvas');
        var addc = addCanvas.getContext('2d');
        addc.beginPath();
        addc.moveTo(0, 20);
        addc.lineTo(600, 20);
        addc.lineTo(600, 60);
        addc.lineTo(0, 60);
        addc.closePath();
        addc.fillStyle = 'rgba(0,0,0,0.1)';
        addc.fill();
        addc.beginPath();
        addc.moveTo(300, 0);
        addc.lineTo(340, 0);
        addc.lineTo(340, 600);
        addc.lineTo(300, 600);
        addc.closePath();

        addc.fillStyle = 'rgba(0,0,0,0.1)';
        addc.fill();

        node.className = 'addPage thumbnailContainer';
        node.appendChild(addCanvas);
        return node;
    },
    resetLayout:function () {
        sortnum();
        this.layout();
    },
    layout:function () {
        var eleDrags = DOM.query('.draglist');
        for (var i = 0; i < eleDrags.length; i++) {
            this.positionItem(i, eleDrags[i]);
        }
        var addItem = DOM.get('.addPage');
        this.positionItem(this.dataLength, addItem);
    },
    positionItem:function (index, el, bl) {
        var x = this.mode[0], y = this.mode[1];
        var width = this.showWidth;
        var height = this.showHeight,
            gapWidth = bl ? this.gapWidth + 20 : this.gapWidth,
            gapHeight = bl ? this.gapHeight + 20 : this.gapHeight,
            leftspace = (width - (this.itemWidth + gapWidth) * x) / 2,
            topspace = (height - (this.itemHeight + gapHeight) * y) / 2;
        leftspace = leftspace < this.gapWidth / 2 ? gapWidth / 2 : leftspace;
        topspace = topspace < this.gapHeight / 2 ? gapHeight / 2 : topspace;
        var xi = parseInt(index / x), yi = index % x;
        DOM.css(el, 'width', this.itemWidth);
        DOM.css(el, 'height', this.itemHeight);
        DOM.css(el, 'left', leftspace + (this.itemWidth + gapWidth) * yi);
        DOM.css(el, 'top', topspace + (this.itemHeight + gapHeight) * xi);
    },
    bindDrag:function (item) {
        var self = this;
        KISSY.use("node,dd", function (S, Node, DD) {

            var DDM = DD.DDM,
                DraggableDelegate = DD.DraggableDelegate,
                DroppableDelegate = DD.DroppableDelegate,
                Draggable = DD.Draggable,
                Droppable = DD.Droppable,
                Scroll = DD.Scroll,
                Proxy = DD.Proxy;

            var proxy = new Proxy({
                /**
                 * 如何产生替代节点
                 * @param drag 当前拖对象
                 */
                node:function (drag) {
                    var n = S.one(drag.get("dragNode")[0].cloneNode(true));
                    n.attr("id", S.guid("ks-dd-proxy"));
                    n.css("opacity", 0.8);
                    return n;
                },
                // 主体位置不跟随 proxy
                moveOnEnd:false,
                // 每次 proxy 都重新生成
                destroyOnEnd:true
            });
            var dragDelegate = new DraggableDelegate({
                container:item,
                handlers:['.draglist'],
                selector:'.draglist',
                move:true
            });
            proxy.attach(dragDelegate);

            var dropDelegate = new DroppableDelegate({
                container:item,
                selector:'.draglist'
            });

            dragDelegate.on("dragstart", function (ev) {
                var drag = ev.drag;
                var dragNode = drag.get("dragNode");
                DOM.css(dragNode[0], 'opacity', 0);
                var proxyNode = DOM.get('.ks-dd-proxy', self.Container);
                proxyNode.style.webkitTransition = 'none';

            });
            dragDelegate.on("dragover", function (ev) {
                console.log('over');
                var drag = ev.drag;
                var drop = ev.drop;
                var dragNode = drag.get("dragNode"),
                    dropNode = drop.get("node");
                var proxyNode = DOM.get('.ks-dd-proxy', self.Container);
                proxyNode.style.webkitTransition = 'none';
                var dropleft = parseInt(dropNode[0].style.left.match(/(\d*)/)[1]);
                var droptop = parseInt(dropNode[0].style.top.match(/(\d*)/)[1]);
                var middleDropX = dropleft + dropNode.width() / 2;
                var middleDropY = droptop + dropNode.height() / 2;
                var left = proxyNode.offsetLeft + proxyNode.offsetWidth;
                var top = proxyNode.offsetTop + proxyNode.offsetHeight;
                var dragIndex = parseInt(DOM.attr(dragNode[0], 'data-num'));
                var dropIndex = parseInt(DOM.attr(dropNode, 'data-num'));


                //                console.log('left'+left);
                //                console.log('middleleft'+middleDropX);
                //                console.log('top'+top);
                //                console.log('middleTop'+middleDropY);
                //                console.log('proxyL'+proxyNode.offsetLeft);
                //                console.log('proxyT'+proxyNode.offsetTop);

                if (dragIndex < dropIndex && left > middleDropX && top > middleDropY) {
                    var next = dropNode.next();
                    if (next && next[0] == dragNode[0]) {
                    } else {
                        //                        console.log('after');
                        //                        console.log('left'+left);
                        //                        console.log('middleleft'+middleDropX);
                        //                        console.log('top'+top);
                        //                        console.log('middleTop'+middleDropY);
                        //                        console.log('proxyL'+proxyNode.offsetLeft);
                        //                        console.log('proxyT'+proxyNode.offsetTop);
                        //                        console.log('drag'+dragIndex);
                        //                        console.log('drop'+dropIndex);
                        //                        console.log('**************************');
                        dragNode.insertAfter(dropNode);
                        self.changeMiddleElementPosition(dragIndex, dropIndex, 'after');

                    }
                }
                if (dragIndex > dropIndex && proxyNode.offsetLeft < middleDropX && proxyNode.offsetTop < middleDropY) {

                    var prev = dropNode.prev();
                    if (prev && prev[0] == dragNode[0]) {
                    } else {
                        //                        console.log('before');
                        //                        console.log('left'+left);
                        //                         console.log('middleleft'+middleDropX);
                        //                         console.log('top'+top);
                        //                         console.log('middleTop'+middleDropY);
                        //                         console.log('proxyL'+proxyNode.offsetLeft);
                        //                         console.log('proxyT'+proxyNode.offsetTop);
                        //                        console.log('drag'+dragIndex);
                        //                        console.log('drop'+dropIndex);
                        //                        console.log('**************************');
                        dragNode.insertBefore(dropNode);
                        self.changeMiddleElementPosition(dropIndex, dragIndex, 'before');
                    }
                }
            });

            dragDelegate.on("dragdrophit dragdropmiss", function (ev) {
                var drag = ev.drag,
                    dragNode = drag.get("dragNode");
                dragNode[0].style.opacity = 1;
                console.log('************');
                console.log(dragNode[0].id);
                console.log(DOM.attr(dragNode[0], 'data-num'));
                sortnum();
            });
            var s = new Scroll({
                node:item
            });

            s.attach(dragDelegate);

            var container = S.one(item);
            container.unselectable();
        });
    },
    changeMiddleElementPosition:function (start, end, type) {
        var eleDrags = DOM.query('.draglist');
        console.log(type);
        for (var i = start; i <= end; i++) {
            eleDrags[i].style.webkitTransition = 'all .5s ease-in-out';
            this.positionItem(i, eleDrags[i]);
            console.log(i);
        }
        console.log('*****************');
        sortnum();
    },
    onAddPage:function () {
//        alert('add a page');
        this.addPage({title:'this is a new page', url:'http://taobao.com', id:this.dataLength + 1});
    },
    addPage:function (data) {
        var addItem = DOM.get('.addPage');
        addItem.style.opacity = '0';
        addItem.style.webkitTransition = 'none';
        this.dataLength++;
        var newNode = this.makeItem(data);
        this.positionItem(this.dataLength - 1, newNode);
        this.positionItem(this.dataLength, addItem);
        this.Container.insertBefore(newNode, addItem);
        this.setMode();
        addItem.style.webkitTransition = 'all .5s ease-in-out';
        addItem.style.opacity = '1';
    },
    onRemove:function (ev) {
        var removeItem = DOM.parent(ev.target, '.draglist');
//        alert('delete the page which id is ' + removeItem.id);
        this.removePage(removeItem.id);
    },
    removePage:function (id) {
        this.dataLength--;
        var node = DOM.get('#' + id);
        if (node) {
            DOM.remove(node);
        }
        this.resetLayout();
        this.setMode();
    },
    movePage:function (id, targetIndex) {
        if (DOM.attr('#' + id, 'data-num') != targetIndex) {
            var moveNode = DOM.get('#' + id);
            var newNode = moveNode.cloneNode(true);
            var currentIndex = parseInt(DOM.attr(moveNode, 'data-num'));
            var type;
            this.Container.removeChild(moveNode);
            this.Container.insertBefore(newNode, this.Container.childNodes[targetIndex]);
            if (currentIndex > targetIndex) {
                type = 'after';
                this.changeMiddleElementPosition(targetIndex - 1, currentIndex, type);
            } else {
                type = 'before';
                this.changeMiddleElementPosition(currentIndex, targetIndex - 1, type);
            }
        }
    },
    showMask:function () {
        if (DOM.get('#J_pageMask')) {
            DOM.get('#J_pageMask').style.display = 'block';
            return false;
        }
        var mask = document.createElement('div');
        mask.className += ' mask';
        mask.id = 'J_pageMask';
        document.body.appendChild(mask);
    },
    hideMask:function () {
        if (DOM.get('#J_pageMask')) {
            DOM.get('#J_pageMask').style.display = 'none';
        }
    },
    showAddPagePop:function () {

    },
    showMakePagePop:function () {

    }
};
var aa = new MakeQuickAcessPages(data);
Event.on(window, 'resize', function () {
    aa.setMode();
    aa.resetLayout();
});
