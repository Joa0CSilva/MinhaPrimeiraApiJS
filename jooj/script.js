document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('myForm');
    const peopleTable = document.getElementById('tabela').getElementsByTagName('tbody')[0];

    // Função para carregar pessoas do localStorage
    function loadPeople() {
        const savedPeople = localStorage.getItem('people');
        if (savedPeople) {
            const peopleList = JSON.parse(savedPeople); // Converte de volta para um array de objetos
            peopleList.forEach(person => {
                addPersonToTable(person.name, person.dob);
            });
        }
    }

    // Função para adicionar uma pessoa na tabela
    function addPersonToTable(name, dob) {
        const newRow = peopleTable.insertRow();
        const nameCell = newRow.insertCell(0);
        const dobCell = newRow.insertCell(1);
        nameCell.textContent = name;
        dobCell.textContent = dob;
    }

    // Carrega as pessoas salvas ao iniciar a página
    loadPeople();

    // Função que salva uma pessoa no localStorage
    function savePerson(name, dob) {
        const savedPeople = localStorage.getItem('people');
        const peopleList = savedPeople ? JSON.parse(savedPeople) : []; // Converte ou cria uma lista nova
        peopleList.push({ name, dob }); // Adiciona nova pessoa
        localStorage.setItem('people', JSON.stringify(peopleList)); // Salva a lista atualizada
    }

    form.addEventListener('submit', (event) => {
        event.preventDefault(); // Evita o envio do formulário

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

        // Se o formulário for válido, salva os dados e adiciona à tabela
        if (form.checkValidity()) {
            console.log('Nome:', name);
            console.log('Data de Nascimento:', dob);

            // Adiciona a pessoa à tabela
            addPersonToTable(name, dob);

            // Salva a pessoa no localStorage
            savePerson(name, dob);

            // Limpa o formulário
            form.reset();
        } else {
            console.log('Existem erros no formulário.');
        }
    });
});