Vue.directive('tabcontrol', {
    bind: function () {
        var el: HTMLElement = this.el;
        if (el.children.length > 0) {

            var panel = createHTML('div', { role: 'tabpanel', class:'panel panel-default' });
            var headers = createHTML('ul', { role: 'tablist', class: 'nav nav-tabs' });
            var contents = createHTML('div', { class: 'tab-content panel-body' });

            for (var i = 0; i < el.children.length; i++) {
                var item: HTMLUnknownElement = <HTMLUnknownElement>el.children[i];
                var header: string, body: string;
                if (item.getAttribute('header')) {
                    header = item.getAttribute('header');
                    body = item.innerHTML;
                }
                else {
                    var h: HTMLUnknownElement = <HTMLUnknownElement>item.children.item(0);
                    header = h.innerHTML;
                    var c: HTMLUnknownElement = <HTMLUnknownElement>item.children.item(1);
                    body = c.innerHTML;
                }

                var aid = item.attributes.getNamedItem('id');
                var uid = aid != null ? aid.value : guid();
                //var isActive = activeId ? (activeId == uid) : (i == 0);
                var isActive = (i == 0);

                var attrs: any = { role: 'presentation' };
                if (isActive) attrs['class'] = 'active';
                var he = createHTML('li', attrs);
                var heLink = createHTML('a', { href: '#' + uid, role: "tab", 'data-toggle': 'tab' });
                heLink.innerHTML = header;
                he.appendChild(heLink);

                attrs = { role: 'tabpanel', class: 'tab-pane', id: uid };
                if (isActive) attrs['class'] += ' active';
                var ce = createHTML('li', attrs);
                ce.innerHTML = body;

                headers.appendChild(he);
                contents.appendChild(ce);
            }

            panel.appendChild(headers);
            panel.appendChild(contents);
            el.outerHTML = panel.outerHTML;
        }
    }
})
