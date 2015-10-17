/// <reference path="../../scripts/typings/vue/vue.d.ts" />
 
module RSComponents {

	export class VTabPanel extends Vue {
		constructor(options: any) {
			var init = {
				template: '#VTabPanel',
			};
			$.extend(options, init);

			var myAId = options.el.attributes.getNamedItem('id');
			var myId = myAId ? myAId.value : 'rstab' + guid();

			var el: HTMLElement = options.el;
			if (el.children.length > 0) {

				var activeId = HASH.get(myId);

				var panel = createHTML('div', { role: 'tabpanel' });
				var headers = createHTML('ul', { role: 'tablist', class: 'nav nav-tabs' });
				var contents = createHTML('div', { class: 'tab-content panel-body' });

				for (var i = 0; i < el.children.length; i++) {
					var item: HTMLUnknownElement = <HTMLUnknownElement>el.children[i];
					var h: HTMLUnknownElement = <HTMLUnknownElement>item.children.item(0);
					var c: HTMLUnknownElement = <HTMLUnknownElement>item.children.item(1);

					var aid = item.attributes.getNamedItem('id');
					var uid = aid != null ? aid.value : guid();
					//var isActive = activeId ? (activeId == uid) : (i == 0);
					var isActive = (i == 0);

					var attrs: any = { role: 'presentation' };
					if (isActive) attrs['class'] = 'active';
					var he = createHTML('li', attrs);
					var heLink = createHTML('a', { href: '#' + uid, role: "tab", 'data-toggle': 'tab' });
					heLink.innerHTML = h.innerHTML;
					he.appendChild(heLink);

					attrs = { role: 'tabpanel', class: 'tab-pane', id: uid };
					if (isActive) attrs['class'] += ' active';
					var ce = createHTML('li', attrs);
					ce.innerHTML = c.innerHTML;

					headers.appendChild(he);
					contents.appendChild(ce);
				}

				panel.appendChild(headers);
				panel.appendChild(contents);
				options.template = panel.outerHTML;
			}
			super(options);

			var activate = (key, value:string) => { $('a[href="#' + value + '"]', options.el).tab('show'); };
			HASH.on(myId, activate);
			$(document).ready(() => { activate(null, HASH.get(myId)); });
			$('a[data-toggle="tab"]', options.el).on('shown.bs.tab', function (e) { HASH.set(myId, e.target.attributes.getNamedItem('href').value.substr(1)); })
		}

	}
	Vue.component('rs-tabpanel', VTabPanel);
}
