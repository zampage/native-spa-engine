export function Module(...components) {
	components.forEach(component => {
		const name = component.name.split(/(?=[A-Z])/)
			.map(part => part.toLowerCase())
			.join('-');
		customElements.define(name, component);
	});
}

export class HTMLComponent extends HTMLElement {
	constructor(dom, ...args) {
		super(args);

		// attach shadow DOM
		this.dom = this.attachShadow({mode: 'open'});

		// parse DOM
		this.dom.innerHTML = Engine.parseDom(this, dom);

		// parse EventListeners
		Engine.parseListener(this);
	}

	attributeChangedCallback(name, prev, next) {
		let fncName = name[0].toUpperCase() + name.slice(1);
		this['input' + fncName](next, prev);
	}
}

export class Engine {
	static parseDom(component, dom) {
		// init binding object
		component._binding = {};

		// keep ids of matches for reference
		const ids = {};
	
		// reg exp for {{name}}
		const regexp = /[{]{2}[^{]+[}]{2}/g;
	
		// find and replace
		dom = dom.replace(regexp, (match, idx) => {
	
			// get name and id
			const name = match.slice(2, match.length - 2);
			let id = name + idx;
	
			if (component.hasOwnProperty(name)) {
				// name exists
				// just replace id with id of existing
				id = ids[name];
			} else {
				// name is new
				// save id
				ids[name] = id;
	
				// bind getter/setter for this name
				component._binding[id] = '';
				Object.defineProperty(component, name, {
					get: () => component._binding[id],
					set: (val) => {
						// update value in bindings and in element
						component._binding[id] = val;
						component.dom.querySelectorAll('#' + id).forEach(span => span.innerText = val);
					}
				});
			}
	
			// create element, add id to it and return it
			const span = document.createElement('span');
			span.id = id;
			return span.outerHTML;
		});
	
		// return parsed dom
		return dom;
	}

	static parseListener(component) {
		// find all elements
		component.dom.querySelectorAll('*').forEach(element => {

			// get all attributes
			const attrs = element.attributes;
			for(let i = 0; i < attrs.length; i++) {
				const attr = attrs[i];

				// find all attributes with (name) syntax
				const regexp = /^\(.+\)$/;
				if (attr.name.match(regexp)) {

					// add event to element
					const evtName = attr.name.slice(1, attr.name.length - 1);
					element.addEventListener(evtName, event => {
						component[attr.value](event);
					});
				}
			}
		});
	}
}