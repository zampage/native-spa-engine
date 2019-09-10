import { HTMLComponent } from '../engine.js';

const dom = `
	<button (click)="onClick" name="test">Change it</button>
	Greetings {{name}}!
`;

export class GreetComponent extends HTMLComponent {
	static get observedAttributes() {
		return ['person'];
	}

	constructor() {
		super(dom);
	}

	inputPerson(next) {
		this.name = next;
	}

	onClick() {
		this.name = this.name.split('').reverse().join('');
	}
}