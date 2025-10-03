const alunos = [];

document.addEventListener('DOMContentLoaded', inicializar);

function inicializar() {
  const input = getElement('nomeAluno');
  input.addEventListener('keypress', handleEnterKey);
  input.focus();
}

function handleEnterKey(event) {
  if (event.key === 'Enter') adicionarAluno();
}

function adicionarAluno() {
  const input = getElement('nomeAluno');
  const nome = input.value.trim();

  if (!isValidName(nome)) {
    showNotification('Por favor, digite um nome válido.', 'error');
    input.focus();
    return;
  }

  if (isDuplicate(nome)) {
    showNotification('Este aluno já está presente na lista!', 'warning');
    clearInput(input);
    return;
  }

  const aluno = createStudent(nome);
  alunos.push(aluno);
  renderTable();
  clearInput(input);
  showNotification('Aluno adicionado com sucesso!', 'success');
}

function createStudent(nome) {
  const now = new Date();
  return {
    nome,
    data: now.toLocaleDateString('pt-BR'),
    horario: now.toLocaleTimeString('pt-BR')
  };
}

function isValidName(nome) {
  return nome && nome.length >= 2 && /^[a-zA-ZÀ-ÿ\s]+$/.test(nome);
}

function isDuplicate(nome) {
  return alunos.some(aluno => 
    aluno.nome.toLowerCase() === nome.toLowerCase()
  );
}

function clearInput(input) {
  input.value = '';
  input.focus();
}

function renderTable() {
  const tbody = getElement('#tabelaAlunos tbody');
  tbody.innerHTML = '';
  
  alunos.forEach((aluno, index) => {
    tbody.appendChild(createTableRow(aluno, index));
  });
  
  updateCounter();
}

function createTableRow(aluno, index) {
  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td>${index + 1}</td>
    <td>${aluno.nome}</td>
    <td>${aluno.data}</td>
    <td>${aluno.horario}</td>
    <td><button onclick="removerAluno(${index})">Remover</button></td>
  `;
  return tr;
}

function updateCounter() {
  const counter = document.getElementById('totalAlunos');
  if (counter) counter.textContent = alunos.length;
}

function removerAluno(index) {
  if (!confirm('Tem certeza que deseja remover este aluno?')) return;
  
  alunos.splice(index, 1);
  renderTable();
}

function getElement(selector) {
  const element = selector.startsWith('#') || selector.startsWith('.') 
    ? document.querySelector(selector)
    : document.getElementById(selector);
  
  if (!element) throw new Error(`Elemento não encontrado: ${selector}`);
  return element;
}