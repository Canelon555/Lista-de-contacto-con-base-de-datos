const NAME_REGEX = /^[A-Z][a-z]*[ ][A-Z][a-z ]*$/;
const NUMBER_REGEX = /^[0](412|212|424|426|414|416)[0-9]{7}$/;
const nameInput = document.querySelector('#input-name');
const numberInput = document.querySelector('#input-number');
const formBtn = document.querySelector('#form-btn');
const form = document.querySelector('#form');
const list = document.querySelector('#list');
const closeBtn = document.querySelector('#cerrar-btn');
const user = JSON.parse(localStorage.getItem('user'));

// Validations
let nameValidation = false;
let numberValidation = false;

if (!user) {
  window.location.href = '../index.html';
}

closeBtn.addEventListener('click', async e => {
  localStorage.removeItem('user');
  window.location.href = '../index.html';
});

// Functions
const validateInput = (input, validation) => {
  const infoText = input.parentElement.children[2];
  if (input.value === '') {
    input.classList.remove('incorrect');
    input.classList.remove('correct');
    infoText.classList.remove('show');
  } else if (validation) {
    input.classList.add('correct');
    input.classList.remove('incorrect');
    infoText.classList.remove('show');
  } else {
    input.classList.add('incorrect');
    input.classList.remove('correct');
    infoText.classList.add('show');
  }

  if (nameValidation && numberValidation) {
    formBtn.disabled = false;
  } else {
    formBtn.disabled = true;
  }
}

const validateEditInput = (input, validation, validationEditName, validationEditNumber, btn) => {
  if (validationEditName && validationEditNumber) {
    btn.disabled = false;
  } else {
    btn.disabled = true;
  }
if (input.value === '') {
    input.classList.remove('incorrect');
    input.classList.remove('correct');
  } else if (validation) {
    input.classList.add('correct');
    input.classList.remove('incorrect');
  } else {
    input.classList.add('incorrect');
    input.classList.remove('correct');
  }
}

let contacts = [];

nameInput.addEventListener('input', e => {
  nameValidation = NAME_REGEX.test(nameInput.value);
  validateInput(nameInput, nameValidation);
});

numberInput.addEventListener('input', e => {
  numberValidation = NUMBER_REGEX.test(numberInput.value);
  validateInput(numberInput, numberValidation);
});

form.addEventListener('submit', async e =>{
  e.preventDefault();
  const responseJSON = await fetch("http://localhost:3000/todos",{
    method: "POST" , 
    headers: {
      'Content-type': "application/json"
    },
    body: JSON.stringify({name: nameInput.value, number: numberInput.value, user: user.username}),
  });
  const response = await responseJSON.json()
  const newContact = document.createElement('div');
  newContact.innerHTML = `
  <li class="list-item" id=${response.id}>
  <button class="delete-btn">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="delete-icon"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
  </button>
  <div class="edit-form-inputs-container">
    <input class="edit-input" type="text" value="${response.name, nameInput.value}" readonly>
    <input class="edit-input" type="text" value="${response.number, numberInput.value}" readonly>
  </div>
  <button class="edit-btn">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="edit-icon">
    <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
    </svg>
  </button>
  </li>
  `;
  list.append(newContact);
  nameInput.value = "";
  numberInput.value = "";
  nameValidation = false;
  numberValidation = false;
  validateInput(nameInput);
  validateInput(numberInput);

  localStorage.setItem('contacts', list.innerHTML);
});

list.addEventListener('click', async e => {
  if (e.target.closest('.delete-btn')) {
    const id = e.target.closest('.list-item').id;
    console.log(id);
    await fetch(`http://localhost:3000/todos/${id}`, { method: "DELETE",
    });
    e.target.closest('.list-item').remove();
    localStorage.setItem('contacts', list.innerHTML);
    e.target.parentElement.remove()
  }

  if (e.target.closest('.edit-btn')) {
    const editBtn = e.target.closest('.edit-btn');
    const editName = editBtn.parentElement.children[1].children[0];
    const editNumber = editBtn.parentElement.children[1].children[1];

    let editNameValidation = true;
    let editNumberValidation = true;

    if (!editBtn.classList.contains('editando')) {
      editBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="edit-icon">
      <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
      </svg>
      `
      editBtn.classList.add('editando');
      editName.removeAttribute('readonly');
      editNumber.removeAttribute('readonly');
      editName.classList.add('show-input');
      editNumber.classList.add('show-input');

      editName.addEventListener('input', e => {
        editNameValidation = NAME_REGEX.test(editName.value);
        validateEditInput(editName, editNameValidation, editNameValidation, editNumberValidation, editBtn)
      });

      editNumber.addEventListener('input', e =>{
        editNumberValidation = NUMBER_REGEX.test(editNumber.value);
        validateEditInput(editNumber, editNumberValidation, editNameValidation, editNumberValidation, editBtn)
      });
    } else {
      editBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="edit-icon"><path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
      </svg>`
      
      editBtn.classList.remove('editando');
      editName.setAttribute('readonly', true);
      editNumber.setAttribute('readonly', true);

      editName.setAttribute('value', editName.value);
      editNumber.setAttribute('value', editNumber.value);

      editName.classList.remove('correct');
      editNumber.classList.remove('correct');

      editName.classList.remove('show-input');
      editNumber.classList.remove('show-input');

      localStorage.setItem('contacts', list.innerHTML);

      const contactId = editBtn.parentElement.id;

      const updatedName = editName.value;
      const updatedNumber = editNumber.value;

      await fetch(`http://localhost:3000/todos/${contactId}`, {
        method: "PATCH",
        headers: {
          "Content-type": "application/json"
        },
        body: JSON.stringify({ name: updatedName, number: updatedNumber})
      });
    }
  };
});

const getTodos = async () => {
  const response = await fetch('http://localhost:3000/todos', {method: 'GET'});
  const todos = await response.json();
  const userTodos = todos.filter(todo => todo.user === user.username);
  userTodos.forEach(todo => {
    const listItem = document.createElement('li');
    listItem.innerHTML = `
    <li class="list-item" id=${todo.id}>
    <button class="delete-btn">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="delete-icon"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
      </svg>
    </button>
    <div class="edit-form-inputs-container">
      <input class="edit-input" type="text" value="${todo.name}" readonly>
      <input class="edit-input" type="text" value="${todo.number}" readonly>
    </div>
    <button class="edit-btn">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="edit-icon">
      <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
      </svg>
    </button>
    </li>
    `;
    list.append(listItem);
  });
}
getTodos();

(() => {
const todosLocal = localStorage.getItem('todos');
if (todosLocal) {
const todosArray = JSON.parse(todosLocal);
contacts = todosArray;
getTodos();
}
})();