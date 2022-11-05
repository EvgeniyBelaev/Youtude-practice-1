import { Qestion } from './question'
import { createModal, isValid } from './utils'
import { authWithEmailAndPassword, getAuthForm } from './auth'
import './styles.css'


const form = document.getElementById('form')
const modalBtn = document.getElementById('modal-btn')
const input = form.querySelector('#qustion-input')
const submitBtn = form.querySelector('#submit')

window.addEventListener('load', Qestion.renderList)
form.addEventListener('submit', submitFormHandler)
modalBtn.addEventListener('click', openModal)
input.addEventListener('input', () => {
    submitBtn.disabled = !isValid(input.value)
})

function submitFormHandler(event) {
    event.preventDefault()

    if (isValid(input.value)) {
        const question = {
            text: input.value.trim(),
            date: new Date().toJSON()
        }

        submitBtn.disabled = true
        //Async request to server to save question
        Qestion.create(question).then(() => {
            input.value = ''
            input.className = ''
            submitBtn.disabled = false
        })
    }
}

function openModal() {
    createModal('Авторизация', getAuthForm())
    document
        .getElementById('auth-form')
        .addEventListener('submit', authFormHandler, {once: true})
}

function authFormHandler(event) {
    event.preventDefault()

    const btn = event.target.querySelector('button')
    const email =  event.target.querySelector('#email').value
    const password =  event.target.querySelector('#password').value

    btn.disabled = true
    authWithEmailAndPassword(email, password)
        .then(Qestion.fetch)
        .then(renderModalAferAuth)
        .then(() => btn.disabled = false)

}

function renderModalAferAuth(content) {
    if(typeof content === 'string') {
        createModal('Ошибка!', content)
    }else {
        createModal('Список вопросов', Qestion.listToHTML(content))
    }
}