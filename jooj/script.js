document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('myForm');
    const peopleTable = document.getElementById('tabela').getElementsByTagName('tbody')[0];

    let editingRow = null; // Variável para armazenar a linha sendo editada

    // Função para carregar pessoas do localStorage
    function loadPeople() {
        const savedPeople = localStorage.getItem('people');
        if (savedPeople) {
            const peopleList = JSON.parse(savedPeople);
            peopleList.forEach(person => {
                addPersonToTable(person.name, person.dob);
            });
        }
    }

    // Função para adicionar uma pessoa na tabela com botão de edição
    function addPersonToTable(name, dob) {
        const newRow = peopleTable.insertRow();
        const nameCell = newRow.insertCell(0);
        const dobCell = newRow.insertCell(1);
        const actionsCell = newRow.insertCell(2); // Nova célula para ações

        nameCell.textContent = name;
        dobCell.textContent = dob;

        // Botão de edição
        const editButton = document.createElement('button');
        editButton.textContent = 'Editar';
        editButton.addEventListener('click', () => {
            editPerson(newRow, name, dob);
        });
        actionsCell.appendChild(editButton);
    }

    // Função para carregar os dados da pessoa no formulário para edição
    function editPerson(row, name, dob) {
        document.getElementById('name').value = name;
        document.getElementById('dob').value = dob;
        editingRow = row; // Armazena a linha sendo editada
    }

    // Função que salva uma pessoa no localStorage (inclui edição)
    function savePerson(name, dob) {
        let savedPeople = localStorage.getItem('people');
        let peopleList = savedPeople ? JSON.parse(savedPeople) : [];

        // Se estiver editando, remove a pessoa antiga
        if (editingRow) {
            const rowIndex = editingRow.rowIndex - 1; // Ajusta para o índice correto da tabela
            peopleList.splice(rowIndex, 1);
        }

        // Adiciona a nova ou editada pessoa
        peopleList.push({ name, dob });
        localStorage.setItem('people', JSON.stringify(peopleList));
    }

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const nameInput = document.getElementById('name');
        const dobInput = document.getElementById('dob');

        const name = nameInput.value.trim();
        const dob = dobInput.value;

        // Limpa as mensagens de erro personalizadas
        nameInput.setCustomValidity('');
        dobInput.setCustomValidity('');

        // Validações personalizadas
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
                // Atualiza a linha na tabela
                editingRow.cells[0].textContent = name;
                editingRow.cells[1].textContent = dob;
                editingRow = null; // Reseta a edição
            } else {
                // Adiciona uma nova pessoa à tabela
                addPersonToTable(name, dob);
            }

            // Salva a pessoa no localStorage
            savePerson(name, dob);

            // Limpa o formulário
            form.reset();
        } else {
            console.log('Existem erros no formulário.');
        }
    });

    // Carrega as pessoas salvas ao iniciar a página
    loadPeople();
});