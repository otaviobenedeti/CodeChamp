(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const DURATION = 45;
  const BANKS = {
    logica: [
      { task: 'Implemente uma função que receba um número e devolva true quando ele for par e false quando for ímpar.', sample: 'Exemplo: ehPar(8) → true | ehPar(5) → false', hint: 'Use o operador de resto da divisão por 2.', test: c => /%\s*2/.test(c) && /(return|=>|bool|boolean|select)/i.test(c) },
      { task: 'Implemente uma função que some todos os números de uma lista e devolva o total.', sample: 'Exemplo: somar([2, 3, 4]) → 9', hint: 'Percorra os valores com um laço ou use uma função de redução.', test: c => /(for|while|reduce|foreach|sum\s*\(|sum\s*=|\+\=)/i.test(c) && /(return|print|select|=>)/i.test(c) },
      { task: 'Implemente uma função que devolva o maior entre dois números recebidos.', sample: 'Exemplo: maior(3, 9) → 9', hint: 'Compare os valores ou use uma função de máximo.', test: c => /(if|\?|max\s*\(|Math\.max|when)/i.test(c) && /(return|=>|print)/i.test(c) }
    ],
    estruturas: [
      { task: 'Crie uma função que conte quantas vezes um valor aparece em uma lista.', sample: 'Exemplo: contar([1, 2, 2, 3], 2) → 2', hint: 'Percorra a lista e incremente um contador quando encontrar o valor.', test: c => /(for|while|foreach|filter|count\s*\()/i.test(c) && /(count|contador|total|length)/i.test(c) },
      { task: 'Implemente uma função que inverta a ordem dos elementos de uma lista.', sample: 'Exemplo: inverter([1, 2, 3]) → [3, 2, 1]', hint: 'Use índices, uma estrutura auxiliar ou o método de inversão da linguagem.', test: c => /(reverse|reversed|\[::-1\]|push|add\s*\()/i.test(c) && /(return|=>|print)/i.test(c) },
      { task: 'Implemente uma busca que devolva a posição de um valor na lista, ou -1 se ele não existir.', sample: 'Exemplo: buscar([4, 8, 9], 8) → 1', hint: 'Percorra os índices e devolva -1 quando terminar sem encontrar.', test: c => /(for|while|indexof|index\s*\(|find\s*\()/i.test(c) && /-1/.test(c) }
    ],
    banco: [
      { task: 'Escreva uma consulta que selecione nome e email dos usuários com idade maior que 18.', sample: 'Tabela: usuarios(id, nome, email, idade)', hint: 'Use SELECT, FROM e WHERE.', test: c => /select\s+.*nome.*email/i.test(c) && /from\s+usuarios/i.test(c) && /where\s+.*idade\s*>\s*18/i.test(c) },
      { task: 'Escreva uma consulta que conte quantos pedidos existem para cada cliente.', sample: 'Tabela: pedidos(id, cliente_id, valor)', hint: 'Agrupe por cliente_id e conte os registros.', test: c => /count\s*\(/i.test(c) && /group\s+by\s+cliente_id/i.test(c) && /from\s+pedidos/i.test(c) },
      { task: 'Escreva uma consulta que aumente em 10% o preço do produto de id 7.', sample: 'Tabela: produtos(id, nome, preco)', hint: 'Use UPDATE, SET e WHERE.', test: c => /update\s+produtos/i.test(c) && /set\s+preco\s*=\s*preco\s*\*\s*1\.1/i.test(c) && /where\s+id\s*=\s*7/i.test(c) }
    ]
  };
  const game = { index: 0, points: 0, seconds: DURATION, timer: null, locked: false, tasks: [] };
  const screens = ['telaSelecao', 'telaJogo', 'telaResumo'];
  function show(id) { screens.forEach(screen => { $(screen).hidden = screen !== id; }); window.scrollTo(0, 0); }
  function stopTimer() { clearInterval(game.timer); game.timer = null; }
  function drawTimer() {
    $('tempo').textContent = game.seconds;
    $('barraTempo').style.width = `${Math.max(0, game.seconds / DURATION * 100)}%`;
    $('timerWrap').classList.toggle('urgente', game.seconds <= 10);
  }
  function start() {
    if (document.querySelector('input[name="modoBomb"]:checked').value !== 'codigo') return;
    stopTimer(); game.index = 0; game.points = 0;
    game.tasks = [...BANKS[$('materia').value]].sort(() => Math.random() - 0.5);
    $('pontos').textContent = '0'; $('linguagemAtual').textContent = $('linguagem').value;
    show('telaJogo'); loadTask();
  }
  function loadTask() {
    stopTimer(); game.locked = false; game.seconds = DURATION;
    const task = game.tasks[game.index];
    $('progresso').textContent = `Desafio ${game.index + 1} de ${game.tasks.length}`;
    $('categoria').textContent = $('materia').selectedOptions[0].textContent;
    $('pergunta').textContent = task.task; $('codigo').textContent = task.sample;
    $('respostaCodigo').value = ''; $('respostaCodigo').placeholder = `Dica: ${task.hint}`;
    $('feedback').textContent = ''; $('feedback').className = 'feedback'; $('btnEnviarCodigo').disabled = false;
    drawTimer(); $('respostaCodigo').focus();
    game.timer = setInterval(() => { game.seconds -= 1; drawTimer(); if (game.seconds <= 0) finish(false, 'O tempo acabou! A bomba avançou para o próximo desafio.'); }, 1000);
  }
  function submit() {
    if (game.locked) return;
    const code = $('respostaCodigo').value.trim();
    if (!code) { $('feedback').textContent = 'Escreva seu código antes de enviar.'; $('feedback').className = 'feedback erro'; return; }
    const task = game.tasks[game.index];
    finish(task.test(code), task.test(code) ? 'Solução aceita pelos critérios do desafio!' : `Ainda falta atender aos critérios. Dica: ${task.hint}`);
  }
  function finish(correct, message) {
    if (game.locked) return;
    game.locked = true; stopTimer(); $('btnEnviarCodigo').disabled = true;
    if (correct) { game.points += 100 + game.seconds * 5; $('pontos').textContent = game.points; }
    $('feedback').textContent = message; $('feedback').classList.add(correct ? 'ok' : 'erro');
    setTimeout(() => { game.index += 1; if (game.index >= game.tasks.length) finishGame(); else loadTask(); }, 1500);
  }
  function finishGame() {
    stopTimer(); $('iconeResultado').textContent = '🎉'; $('tituloResultado').textContent = 'Desafio concluído!';
    $('textoResultado').textContent = `Você concluiu os desafios de ${$('materia').selectedOptions[0].textContent} em ${$('linguagem').value}.`;
    $('pontosFinais').textContent = game.points; show('telaResumo');
  }
  $('btnComecar').addEventListener('click', start);
  $('btnEnviarCodigo').addEventListener('click', submit);
  $('btnJogarNovamente').addEventListener('click', () => {
    if (document.querySelector('input[name="modoBomb"]:checked').value === 'codigo') show('telaSelecao');
  });
  $('linguagem').addEventListener('change', () => { $('linguagemAtual').textContent = $('linguagem').value; });
  function updateMode() {
    const isCode = document.querySelector('input[name="modoBomb"]:checked').value === 'codigo';
    $('configMateria').hidden = !isCode;
    $('areaCodigo').hidden = !isCode;
    $('respostas').hidden = isCode;
    $('tempoModo').textContent = isCode ? '45s' : '20s';
    $('quantidadeModo').textContent = isCode ? '3' : '5';
    $('descricaoQuantidade').textContent = isCode ? 'Desafios por matéria' : 'Desafios por partida';
    $('instrucaoModo').textContent = isCode
      ? 'Escreva uma solução para o desafio da matéria escolhida e envie antes que o cronômetro chegue a zero.'
      : 'Escolha a resposta correta antes que o cronômetro chegue a zero.';
  }
  document.querySelectorAll('input[name="modoBomb"]').forEach(input => input.addEventListener('change', updateMode));
  updateMode();
})();
