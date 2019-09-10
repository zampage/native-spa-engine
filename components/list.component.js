import { HTMLComponent } from "../engine.js";

const dom = `
    <style>
        h3 {
            border-bottom: 1px solid gray;
        }
    </style>

    <h3>Todo List</h3>
    <form (submit)="onSubmit">
        <input type="text" name="item">
        <button type="submit">+</button>
    </form>

    <ul></ul>
`;

export class ListComponent extends HTMLComponent {
    constructor() {
        super(dom);
    }

    onSubmit(event) {
        // prevent page reload
        event.preventDefault();

        // get input field and list
        const input = this.dom.querySelector('input');
        const ul = this.dom.querySelector('ul');

        // create new list item
        const li = document.createElement('li');
        li.innerText = input.value;
        ul.append(li);

        // reset input value
        input.value = '';
    }
}