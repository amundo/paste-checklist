import { parseChecklist } from "./parse-checklist.js"


class PasteChecklist extends HTMLElement {
  #tasks = [] 

  constructor() {
    super()
    this.innerHTML = `
      <textarea></textarea>
      <output></output>
    `
    this.listen()
  }

  async fetch(url) {
    let response = await fetch(url)
    let data = await response.json()
    this.data = data
  }

  connectedCallback() {

  }

  static get observedAttributes() {
    return ["src"]
  }

  attributeChangedCallback(attribute, oldValue, newValue) {
    if (attribute == "src") {
      this.fetch(newValue)
    }
  }

  get data(){
    return this.#tasks
  }

  set data(tasks){
    if(typeof tasks == 'string'){
      let plaintext = tasks
      this.#tasks = this.parseChecklist(plaintext)
    } else if (Array.isArray(tasks)) {
      this.#tasks = tasks
    }
    this.render(this.#tasks)
  }

  renderTask(task) {
    let li = document.createElement('li');
    li.innerHTML = `<label><input type="checkbox" value="${task.task}" /> ${task.task}</label>`;
    let input = li.querySelector('input');
    input.checked = task.done;
    return li;
  }

  render(tasks=this.#tasks) {
    let ol = tasks.reduce((ol, task) => {
      let li = this.renderTask(task)
      ol.appendChild(li)
      return ol
    }, document.createElement('ol'))

    this.querySelector('output')
      .innerHTML = ''

    this.querySelector('output')
      .appendChild(ol)

  }
  
  read(){
    this.querySelectorAll('input[type=checkbox]')
    .forEach((checkbox) => {
      const taskText = checkbox.value;
      const matchingTask = this.#tasks.find(task => task.task === taskText);
      if (matchingTask) {
        matchingTask.done = checkbox.checked;
      }
    });
  }

  listen() {
    this.addEventListener('change', event => {
      if(event.target.matches('input[type=checkbox]')){
        this.read()
      }
    })

    this.addEventListener('paste', event => {
      if(event.target.matches('textarea')){
        let plaintext = event.clipboardData.getData('text/plain')
        let tasks = parseChecklist(plaintext)
        tasks = tasks.map(task => ({done: false, task}))
        this.data = tasks
      }
    })
  }
}

export { PasteChecklist }
customElements.define('paste-checklist', PasteChecklist)
