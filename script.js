document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('myForm');
    const peopleTable = document.getElementById('peopleTable').getElementsByTagName('tbody')[0];

    let editingRow = null;

    function loadPeople() {
        const savedPeople = localStorage.getItem('people');
        if (savedPeople) {
            const peopleList = JSON.parse(savedPeople);
            peopleList.forEach(person => {
                addPersonToTable(person.name, person.dob);
            });
        }
    }

    function addPersonToTable(name, dob) {
        const newRow = peopleTable.insertRow();
        const nameCell = newRow.insertCell(0);
        const dobCell = newRow.insertCell(1);
        const actionsCell = newRow.insertCell(2);

        nameCell.textContent = name;
        dobCell.textContent = dob;

        const editButton = document.createElement('button');
        editButton.textContent = 'Editar';
        editButton.addEventListener('click', () => {
            editPerson(newRow, name, dob);
        });

        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remover';
        removeButton.addEventListener('click', () => {
            removePerson(newRow);
        });

        actionsCell.appendChild(editButton);
        actionsCell.appendChild(removeButton);
    }

    function editPerson(row, name, dob) {
        document.getElementById('name').value = name;
        document.getElementById('dob').value = dob;
        editingRow = row;
    }

    function savePerson(name, dob) {
        let savedPeople = localStorage.getItem('people');
        let peopleList = savedPeople ? JSON.parse(savedPeople) : [];

        if (editingRow) {
            const rowIndex = editingRow.rowIndex - 1;
            peopleList.splice(rowIndex, 1);
        }

        peopleList.push({ name, dob });
        localStorage.setItem('people', JSON.stringify(peopleList));
    }

    function removePerson(row) {
        const rowIndex = row.rowIndex - 1;
        let savedPeople = localStorage.getItem('people');
        let peopleList = savedPeople ? JSON.parse(savedPeople) : [];

        peopleList.splice(rowIndex, 1);
        localStorage.setItem('people', JSON.stringify(peopleList));
        row.remove();
    }

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const nameInput = document.getElementById('name');
        const dobInput = document.getElementById('dob');

        const name = nameInput.value.trim();
        const dob = dobInput.value;

        nameInput.setCustomValidity('');
        dobInput.setCustomValidity('');

        const nameRegex = /^[A-Za-zÀ-ÿ]+$/;
        if (name === '') {
            nameInput.setCustomValidity('O campo Nome não pode estar vazio.');
        } else if (name.length < 3 || name.length > 120) {
            nameInput.setCustomValidity('O Nome deve ter entre 3 e 120 caracteres.');
        } else if (!nameRegex.test(name)) {
            nameInput.setCustomValidity('O Nome deve conter apenas letras.');
        }

        if (!dob) {
            dobInput.setCustomValidity('O campo Data de Nascimento não pode estar vazio.');
        }

        if (form.checkValidity()) {
            if (editingRow) {
                editingRow.cells[0].textContent = name;
                editingRow.cells[1].textContent = dob;
                editingRow = null;
            } else {
                addPersonToTable(name, dob);
            }

            savePerson(name, dob);

            form.reset();
        } else {
            console.log('Existem erros no formulário.');
        }
    });

    loadPeople();
});