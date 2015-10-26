Vue.directive('tabcontrol', {
    bind: function () {
        var el = this.el;
        var myAId = el.attributes.getNamedItem('id');
        var myId = myAId ? myAId.value : 'TAB' + guid();
        if (el.children.length > 0) {
            var panel = createHTML('div', { role: 'tabpanel', class: 'panel panel-default' });
            var headers = createHTML('ul', { role: 'tablist', class: 'nav nav-tabs' });
            var contents = createHTML('div', { class: 'tab-content panel-body' });
            for (var i = 0; i < el.children.length; i++) {
                var item = el.children[i];
                var header, body;
                if (item.getAttribute('header')) {
                    header = item.getAttribute('header');
                    body = item.innerHTML;
                }
                else {
                    var h = item.children.item(0);
                    header = h.innerHTML;
                    var c = item.children.item(1);
                    body = c.innerHTML;
                }
                var aid = item.attributes.getNamedItem('id');
                var uid = aid != null ? aid.value : 'tabItem-' + myId + '-' + i;
                var isActive = (i == 0);
                var attrs = { role: 'presentation' };
                if (isActive)
                    attrs['class'] = 'active';
                var he = createHTML('li', attrs);
                var heLink = createHTML('a', { href: '#' + uid, role: "tab", 'data-toggle': 'tab' });
                heLink.innerHTML = header;
                he.appendChild(heLink);
                attrs = { role: 'tabpanel', class: 'tab-pane', id: uid };
                if (isActive)
                    attrs['class'] += ' active';
                var ce = createHTML('li', attrs);
                ce.innerHTML = body;
                headers.appendChild(he);
                contents.appendChild(ce);
            }
            panel.appendChild(headers);
            panel.appendChild(contents);
            //el.innerHTML = panel.outerHTML; //this doesn't work with IE!!
            while (el.childNodes.length > 0)
                el.removeChild(el.childNodes[0]);
            el.appendChild(panel);
        }
        var activate = function (previous, current) {
            var tab = current.kv[myId];
            if (tab)
                $('a[href="#' + tab + '"]', el).tab('show');
        };
        HASH.on(activate);
        $(document).ready(function () { activate(null, HASH.value()); });
        $('a[data-toggle="tab"]', el).on('shown.bs.tab', function (e) {
            HASH.set(myId, e.target.attributes.getNamedItem('href').value.substr(1));
        });
    }
});
