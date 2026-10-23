(() => {
    'use strict';
    const $ = s => document.querySelector(s);
    const LANG = { html: 'HTML', css: 'CSS', js: 'JavaScript' };
    const PTS = { 'Fácil': 10, 'Médio': 20 };
    const TEMPO = 180;

    /* ---------- Helpers de validação (HTML e CSS) ---------- */
    const parseHTML = c => new DOMParser().parseFromString(c, 'text/html'); // não executa scripts
    const count = (c, re) => (c.match(re) || []).length;
    function parseCSS(code) {
        code = code.replace(/\/\*[\s\S]*?\*\//g, '');
        const rules = []; const re = /([^{}]+)\{([^{}]*)\}/g; let m;
        while ((m = re.exec(code))) {
            const decls = {};
            m[2].split(';').forEach(d => { const i = d.indexOf(':'); if (i > 0) decls[d.slice(0, i).trim().toLowerCase()] = d.slice(i + 1).trim(); });
            rules.push({ sel: m[1].trim(), decls });
        }
        return { balanced: count(code, /{/g) === count(code, /}/g) && count(code, /{/g) > 0, rules };
    }
    const decl = (c, sel, prop) => (parseCSS(c).rules.find(r => r.sel === sel) || { decls: {} }).decls[prop];

    /* ---------- DESAFIOS (adicione novos aqui) ----------
       HTML/CSS: t = [['nome do teste', codigo => boolean]]
       JS:       t = [['nome do teste', 'expressão que deve ser verdadeira']]  (botao = elemento falso) */
    const CH = [
        {
            id: 'h1', lang: 'html', nivel: 'Fácil', nome: 'Parágrafo aberto',
            desc: 'Uma tag <p> nunca foi fechada. Feche-a corretamente.', esp: 'Dois parágrafos, cada um com <p> e </p>.',
            dica: 'Toda tag que abre precisa de uma tag que fecha, com uma barra: </p>.',
            exp: 'Faltava o </p> do primeiro parágrafo.',
            code: '<h1>Bem-vindo ao CodeChamp</h1>\n<p>Aprenda programando jogando.\n<p>Boa sorte!</p>',
            t: [['Há 2 parágrafos', c => count(c, /<p[\s>]/gi) === 2], ['Todos os <p> foram fechados', c => count(c, /<\/p>/gi) === 2], ['Textos preservados', c => /Aprenda programando jogando/.test(c) && /Boa sorte!/.test(c)]]
        },
        {
            id: 'h2', lang: 'html', nivel: 'Fácil', nome: 'Botão de enviar',
            desc: 'O botão deveria ser do tipo "submit", mas o nome do atributo está errado.', esp: '<button type="submit">Enviar</button>',
            dica: 'Confira a escrita do nome do atributo antes do sinal de =.', exp: 'O atributo correto é type, não tipe.',
            code: '<form>\n  <button tipe="submit">Enviar</button>\n</form>',
            t: [['Botão existe', c => !!parseHTML(c).querySelector('form button')], ['type="submit"', c => (parseHTML(c).querySelector('button') || { getAttribute: () => null }).getAttribute('type') === 'submit'], ['Texto "Enviar"', c => (parseHTML(c).querySelector('button') || {}).textContent?.trim() === 'Enviar']]
        },
        {
            id: 'h3', lang: 'html', nivel: 'Fácil', nome: 'Imagem sem src',
            desc: 'A imagem não aparece porque o atributo que informa o endereço dela está errado.', esp: '<img src="trofeu.png" alt="Troféu">',
            dica: 'O atributo que indica o arquivo da imagem tem 3 letras: s _ _ .', exp: 'O atributo é src, e estava escrito scr.',
            code: '<img scr="trofeu.png" alt="Troféu">',
            t: [['Possui src="trofeu.png"', c => (parseHTML(c).querySelector('img') || { getAttribute: () => null }).getAttribute('src') === 'trofeu.png'], ['Mantém o alt', c => !!(parseHTML(c).querySelector('img') || { getAttribute: () => '' }).getAttribute('alt')]]
        },
        {
            id: 'h4', lang: 'html', nivel: 'Médio', nome: 'Estrutura básica',
            desc: 'Falta o doctype e o <head> com um <title> nesta página.', esp: 'Doctype, <head> com <title> preenchido e <body> com o <h1>.',
            dica: 'Comece com <!DOCTYPE html> e crie <head><title>…</title></head> antes do <body>.', exp: 'Toda página precisa de doctype e head com title.',
            code: '<html>\n<body>\n  <h1>Olá, mundo!</h1>\n</body>\n</html>',
            t: [['Começa com <!DOCTYPE html>', c => /^\s*<!doctype html>/i.test(c)], ['<head> com <title> preenchido', c => /<head>[\s\S]*<title>[^<]+<\/title>[\s\S]*<\/head>/i.test(c)], ['<h1> dentro do <body>', c => !!parseHTML(c).querySelector('body h1')]]
        },
        {
            id: 'c1', lang: 'css', nivel: 'Fácil', nome: 'Cor inexistente',
            desc: 'O título deveria ser vermelho, mas a cor foi escrita errado.', esp: '.titulo { color: red; }',
            dica: 'Em inglês, vermelho tem só 3 letras.', exp: '"reed" não é uma cor; o valor é red.',
            code: '.titulo {\n  color: reed;\n}',
            t: [['Regra .titulo existe', c => decl(c, '.titulo', 'color') !== undefined], ['Cor é vermelha válida', c => /^(red|#f00|#ff0000|rgb\(\s*255\s*,\s*0\s*,\s*0\s*\))$/i.test(decl(c, '.titulo', 'color') || '')]]
        },
        {
            id: 'c2', lang: 'css', nivel: 'Fácil', nome: 'Seletor de classe',
            desc: 'O elemento é <h1 class="titulo">, mas o estilo não é aplicado.', esp: '.titulo { color: gold; }',
            dica: 'Seletores de classe começam com um caractere especial.', exp: 'Classes usam ponto: .titulo.',
            code: 'titulo {\n  color: gold;\n}',
            t: [['Seletor .titulo', c => decl(c, '.titulo', 'color') !== undefined], ['Cor gold mantida', c => decl(c, '.titulo', 'color') === 'gold']]
        },
        {
            id: 'c3', lang: 'css', nivel: 'Fácil', nome: 'Alinhamento do texto',
            desc: 'O texto da caixa deveria ficar centralizado.', esp: '.caixa { text-align: center; }',
            dica: '"middle" não existe para text-align. Qual é a palavra em inglês para centro?', exp: 'O valor correto é center.',
            code: '.caixa {\n  text-align: middle;\n  padding: 12px;\n}',
            t: [['text-align: center', c => decl(c, '.caixa', 'text-align') === 'center'], ['padding preservado', c => decl(c, '.caixa', 'padding') === '12px']]
        },
        {
            id: 'c4', lang: 'css', nivel: 'Médio', nome: 'Ponto e vírgula e chave',
            desc: 'A regra está com um ponto e vírgula e uma chave faltando.', esp: '.caixa { background: purple; padding: 10px; }',
            dica: 'Cada declaração termina com ; e cada regra termina com }.', exp: 'Faltavam o ; depois de purple e a chave de fechamento.',
            code: '.caixa {\n  background: purple\n  padding: 10px;\n',
            t: [['Chaves balanceadas', c => parseCSS(c).balanced], ['background: purple', c => decl(c, '.caixa', 'background') === 'purple'], ['padding: 10px', c => decl(c, '.caixa', 'padding') === '10px']]
        },
        {
            id: 'j1', lang: 'js', nivel: 'Fácil', nome: 'Declaração de variável',
            desc: 'A idade deve aumentar em 1, mas a declaração da variável está incorreta.', esp: 'idade deve valer 11 no final.',
            dica: 'Para uma variável que muda de valor, use let.', exp: '"variavel" não existe em JavaScript; use let.',
            code: 'variavel idade = 10;\nidade = idade + 1;',
            t: [['idade === 11', 'idade === 11']]
        },
        {
            id: 'j2', lang: 'js', nivel: 'Fácil', nome: 'Operador matemático',
            desc: 'A função dobro deveria multiplicar o número por 2.', esp: 'dobro(4) = 8, dobro(0) = 0, dobro(5) = 10.',
            dica: 'Dobrar é multiplicar, não somar.', exp: 'Era necessário usar * em vez de +.',
            code: 'function dobro(n) {\n  return n + 2;\n}',
            t: [['dobro(4) === 8', 'dobro(4)===8'], ['dobro(0) === 0', 'dobro(0)===0'], ['dobro(5) === 10', 'dobro(5)===10']]
        },
        {
            id: 'j3', lang: 'js', nivel: 'Fácil', nome: 'Condição if',
            desc: 'ehMaior(n) deve retornar true quando n for 18 ou mais.', esp: 'ehMaior(17)=false, ehMaior(18)=true, ehMaior(30)=true.',
            dica: 'Um único = atribui valor. Para comparar, use outro operador.', exp: 'Use n >= 18 (comparação) em vez de n = 18 (atribuição).',
            code: 'function ehMaior(n) {\n  if (n = 18) {\n    return true;\n  }\n  return false;\n}',
            t: [['ehMaior(17) === false', 'ehMaior(17)===false'], ['ehMaior(18) === true', 'ehMaior(18)===true'], ['ehMaior(30) === true', 'ehMaior(30)===true']]
        },
        {
            id: 'j4', lang: 'js', nivel: 'Médio', nome: 'Função sem retorno',
            desc: 'A função soma calcula o resultado, mas devolve undefined.', esp: 'soma(2, 3) = 5 e soma(-1, 1) = 0.',
            dica: 'Falta uma palavra-chave que devolve o valor ao final da função.', exp: 'Era preciso usar return a + b;',
            code: 'function soma(a, b) {\n  a + b;\n}',
            t: [['soma(2,3) === 5', 'soma(2,3)===5'], ['soma(-1,1) === 0', 'soma(-1,1)===0']]
        },
        {
            id: 'j5', lang: 'js', nivel: 'Médio', nome: 'Evento de clique',
            desc: 'Ao clicar no botão, o texto deveria virar "Clicado!", mas o nome do evento está errado. (botao já existe.)', esp: 'Após o clique, botao.texto === "Clicado!".',
            dica: 'O nome do evento é "click", com C, L, I, C e K.', exp: 'O evento correto é "click", não "clik".',
            code: 'botao.addEventListener("clik", function () {\n  botao.texto = "Clicado!";\n});',
            t: [['Clique altera o texto', '(botao.click(), botao.texto==="Clicado!")']]
        },
        {
            id: 'j6', lang: 'js', nivel: 'Médio', nome: 'Último item do array',
            desc: 'Queremos pegar a última fruta, mas o resultado vem undefined.', esp: 'ultima deve ser "uva".',
            dica: 'Índices começam em 0, então o último é length menos algo.', exp: 'O último índice é frutas.length - 1.',
            code: 'const frutas = ["maçã", "banana", "uva"];\nconst ultima = frutas[frutas.length];',
            t: [['ultima === "uva"', 'ultima==="uva"']]
        }
    ];

    /* ---------- Estado e persistência local ---------- */
    let P = { solved: {}, attempts: 0, hits: 0 };
    try { P = Object.assign(P, JSON.parse(localStorage.getItem('codechamp_codepuzzle')) || {}); } catch (e) { }
    const save = () => { try { localStorage.setItem('codechamp_codepuzzle', JSON.stringify(P)); } catch (e) { } };
    const F = { lang: 'todos', nivel: 'todos' };
    const S = { c: null, hints: 0, wrong: 0, done: false, timer: null, left: TEMPO };
    const score = () => Object.values(P.solved).reduce((a, b) => a + b, 0);

    /* ---------- Telas ---------- */
    const telas = ['telaSelecao', 'telaJogo', 'telaResumo'];
    function mostrar(id) { telas.forEach(t => $('#' + t).hidden = t !== id); stopTimer(); window.scrollTo(0, 0); if (id === 'telaSelecao') renderSel(); if (id === 'telaResumo') renderResumo(); }
    const statBox = items => items.map(([v, l]) => `<div class="stat"><b>${v}</b><small>${l}</small></div>`).join('');
    const aprov = () => P.attempts ? Math.round(P.hits / P.attempts * 100) + '%' : '—';
    function statsHTML() { return statBox([[score(), 'Pontos'], [Object.keys(P.solved).length + '/' + CH.length, 'Resolvidos'], [P.hits, 'Acertos'], [aprov(), 'Aproveitamento']]); }

    function renderSel() {
        $('#statsTopo').innerHTML = statsHTML();
        const lista = CH.filter(c => (F.lang === 'todos' || c.lang === F.lang) && (F.nivel === 'todos' || c.nivel === F.nivel));
        const g = $('#grade'); g.innerHTML = '';
        if (!lista.length) { g.textContent = 'Nenhum desafio com esses filtros.'; return; }
        lista.forEach(c => {
            const b = document.createElement('button');
            b.className = 'card' + (P.solved[c.id] !== undefined ? ' feito' : '');
            b.innerHTML = `<div class="selos"><span class="selo ${c.lang}">${LANG[c.lang]}</span><span class="selo">${c.nivel}</span><span class="selo ouro">${PTS[c.nivel]} pts</span></div><h3></h3><p></p>`;
            b.querySelector('h3').textContent = (P.solved[c.id] !== undefined ? '✔ ' : '') + c.nome;
            b.querySelector('p').textContent = c.desc;
            b.onclick = () => abrir(c.id);
            g.appendChild(b);
        });
    }
    function renderResumo() {
        const n = Object.keys(P.solved).length;
        $('#statsResumo').innerHTML = statBox([[score(), 'Pontos'], [n + '/' + CH.length, 'Desafios resolvidos'], [P.hits + '/' + P.attempts, 'Acertos / envios'], [aprov(), 'Aproveitamento'], [Math.round(n / CH.length * 100) + '%', 'Progresso total']]);
    }

    /* ---------- Editor ---------- */
    const ed = $('#ed'), gut = $('#gutter');
    function gutter() { const n = ed.value.split('\n').length; gut.textContent = Array.from({ length: n }, (_, i) => i + 1).join('\n'); gut.scrollTop = ed.scrollTop; }
    ed.addEventListener('input', gutter);
    ed.addEventListener('scroll', () => gut.scrollTop = ed.scrollTop);

    function formatar(code, lang) {
        const linhas = code.split('\n').map(l => l.trim());
        let d = 0, vazio = false;
        return linhas.map(l => {
            if (!l) { if (vazio) return null; vazio = true; return ''; } vazio = false;
            let ind, net;
            if (lang === 'html') {
                const o = (l.match(/<(?!\/|!)([a-z][a-z0-9]*)\b[^>]*>/gi) || []).filter(t => !/^<(br|img|hr|input|meta|link)\b/i.test(t) && !/\/>$/.test(t)).length;
                net = o - count(l, /<\/[a-z]/gi); ind = d - (/^<\//.test(l) ? 1 : 0);
            } else { net = count(l, /[{[]/g) - count(l, /[}\]]/g); ind = d - (/^[}\]]/.test(l) ? 1 : 0); }
            ind = Math.max(0, ind); d = Math.max(0, d + net);
            return '  '.repeat(ind) + l;
        }).filter(l => l !== null).join('\n').trim();
    }

    /* ---------- Execução de testes ---------- */
    function workerFn() {
        onmessage = e => {
            const { code, tests } = e.data;
            const results = tests.map(([nome, expr]) => {
                try {
                    const botao = { l: {}, texto: '', addEventListener(t, f) { (this.l[t] = this.l[t] || []).push(f); }, click() { (this.l.click || []).forEach(f => f()); } };
                    const fn = new Function('botao', code + '\n;return !!(' + expr + ');');
                    return { nome, ok: fn(botao) === true };
                } catch (err) { return { nome, ok: false, erro: err.name + ': ' + err.message }; }
            });
            postMessage(results);
        };
    }
    function rodarJS(code, tests) {
        return new Promise(res => {
            let w;
            try { w = new Worker(URL.createObjectURL(new Blob(['(' + workerFn.toString() + ')()'], { type: 'text/javascript' }))); }
            catch (e) { return res([{ nome: 'Ambiente de execução', ok: false, erro: 'Seu navegador bloqueou o Web Worker: ' + e.message }]); }
            const to = setTimeout(() => { w.terminate(); res([{ nome: 'Tempo de execução', ok: false, erro: 'O código demorou demais (possível loop infinito).' }]); }, 2000);
            w.onmessage = e => { clearTimeout(to); w.terminate(); res(e.data); };
            w.onerror = e => { clearTimeout(to); w.terminate(); res([{ nome: 'Erro no código', ok: false, erro: e.message }]); };
            w.postMessage({ code, tests });
        });
    }
    async function testar() {
        const c = S.c, code = ed.value;
        if (c.lang === 'js') return rodarJS(code, c.t);
        return c.t.map(([nome, fn]) => { let ok = false; try { ok = !!fn(code); } catch (e) { } return { nome, ok }; });
    }

    /* ---------- Output ---------- */
    function out(linhas) { const o = $('#out'); o.innerHTML = ''; linhas.forEach(([t, cls]) => { const d = document.createElement('div'); d.className = 'l ' + cls; d.textContent = t; o.appendChild(d); }); }
    function relatorio(res) {
        const l = res.map(r => [(r.ok ? '✔ ' : '✘ ') + r.nome + (r.erro ? ' — ' + r.erro : ''), r.ok ? 'ok' : 'erro']);
        const p = res.filter(r => r.ok).length;
        l.push([`${p} de ${res.length} testes passaram.`, p === res.length ? 'ok' : 'info']);
        return l;
    }

    /* ---------- Jogo ---------- */
    function abrir(id) {
        const c = CH.find(x => x.id === id);
        Object.assign(S, { c, hints: 0, wrong: 0, done: false });
        $('#jNome').textContent = c.nome;
        $('#jLang').textContent = LANG[c.lang]; $('#jLang').className = 'selo ' + c.lang;
        $('#jNivel').textContent = c.nivel; $('#jPts').textContent = PTS[c.nivel] + ' pts';
        $('#jDesc').textContent = c.desc; $('#jEsp').textContent = c.esp;
        $('#jDica').hidden = true; $('#fimBox').hidden = true;
        ['btnTeste', 'btnSubmit', 'btnDica'].forEach(b => $('#' + b).disabled = false);
        ed.value = c.code; gutter();
        out([['Edite o código e clique em "Executar teste" ou "Submeter".', 'info']]);
        progresso(); mostrar('telaJogo'); ed.scrollTop = 0;
        if ($('#chkTempo').checked) startTimer();
    }
    function progresso() { const n = Object.keys(P.solved).length; $('#jBarra').style.width = (n / CH.length * 100) + '%'; $('#jProg').textContent = `${n}/${CH.length} desafios — ${score()} pontos`; }
    function startTimer() {
        S.left = TEMPO; $('#jTempoBox').hidden = false; tick();
        S.timer = setInterval(() => { S.left--; tick(); if (S.left <= 0) fimTempo(); }, 1000);
    }
    function tick() { const m = Math.floor(S.left / 60), s = S.left % 60; $('#jTempo').textContent = m + ':' + String(s).padStart(2, '0'); $('#jTempoBox').classList.toggle('baixo', S.left <= 30); }
    function stopTimer() { clearInterval(S.timer); S.timer = null; $('#jTempoBox').hidden = true; }
    function fimTempo() {
        clearInterval(S.timer); S.done = true;
        ['btnTeste', 'btnSubmit'].forEach(b => $('#' + b).disabled = true);
        out([['⏰ Tempo esgotado! Nenhum ponto foi concedido neste desafio.', 'erro'], ['Dica: use "Resetar" para tentar de novo sem cronômetro ou escolha outro desafio.', 'info']]);
        $('#fimBox').hidden = false;
    }
    $('#btnTeste').onclick = async () => { out([['Executando…', 'info']]); out(relatorio(await testar())); };
    $('#btnSubmit').onclick = async () => {
        if (S.done) return;
        const res = await testar(), ok = res.every(r => r.ok), c = S.c;
        P.attempts++;
        const linhas = relatorio(res);
        if (ok) {
            P.hits++; S.done = true; stopTimer();
            const base = PTS[c.nivel], ganho = Math.max(Math.ceil(base / 2), base - S.hints * 3 - S.wrong * 2);
            if (P.solved[c.id] === undefined) { P.solved[c.id] = ganho; linhas.push([`🎉 Correto! +${ganho} pontos.`, 'ouro']); }
            else linhas.push(['🎉 Correto! (desafio já concluído antes, sem pontos extras)', 'ouro']);
            linhas.push(['Explicação: ' + c.exp, 'info']);
            $('#fimBox').hidden = false;
        } else {
            S.wrong++;
            linhas.push(['Ainda não está certo. Releia o resultado esperado ou peça uma dica — tentar de novo custa pouco!', 'erro']);
        }
        save(); progresso(); out(linhas);
    };
    $('#btnDica').onclick = () => { if (!S.hints) S.hints = 1; const d = $('#jDica'); d.textContent = '💡 ' + S.c.dica; d.hidden = false; };
    $('#btnReset').onclick = () => { ed.value = S.c.code; gutter(); out([['Código restaurado para o original do desafio.', 'info']]); };
    $('#btnFormat').onclick = () => { ed.value = formatar(ed.value, S.c.lang); gutter(); out([['Código formatado (a lógica não foi alterada).', 'info']]); };
    $('#btnVoltar').onclick = $('#btnOutro').onclick = $('#btnOutro2').onclick = () => mostrar('telaSelecao');
    $('#btnProx').onclick = () => abrir(CH[(CH.indexOf(S.c) + 1) % CH.length].id);
    $('#btnResumo').onclick = () => mostrar('telaResumo');
    $('#btnRetry').onclick = () => { P = { solved: {}, attempts: 0, hits: 0 }; save(); mostrar('telaSelecao'); };
    document.querySelectorAll('.chip').forEach(b => b.onclick = () => {
        F[b.dataset.f] = b.dataset.v;
        document.querySelectorAll(`.chip[data-f="${b.dataset.f}"]`).forEach(x => x.classList.toggle('ativo', x === b));
        renderSel();
    });
    renderSel();
})();