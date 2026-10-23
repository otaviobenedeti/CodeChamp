(() => {
    'use strict';
    const $ = s => document.querySelector(s);
    
    const LANG = { html: 'HTML', css: 'CSS', js: 'JavaScript' };
    
    const BASE = { 'Fácil': 15, 'Médio': 30, 'Difícil': 50 };
    
    const TEMPO = { 'Fácil': 300, 'Médio': 480, 'Difícil': 720 };
    
    const NC = { 'Fácil': 'n1', 'Médio': 'n2', 'Difícil': 'n3' };
    
    const ORD = { 'Fácil': 1, 'Médio': 2, 'Difícil': 3 };
    
    const pts = c => Math.round(BASE[c.nivel] * (c.tam === 'Grande' ? 1.5 : 1));

    /* ---------- Helpers de validação ---------- */
    const count = (c, re) => (c.match(re) || []).length;
    
    const parseHTML = c => new DOMParser().parseFromString(c, 'text/html'); // não executa scripts
    
    const Q = (c, s) => parseHTML(c).querySelector(s);
    
    const QA = (c, s) => parseHTML(c).querySelectorAll(s).length;
    
    const txt = (c, s) => ((Q(c, s) || {}).textContent || '').trim();
    
    const attr = (c, s, a) => ((Q(c, s) || { getAttribute: () => '' }).getAttribute(a)) || '';
    
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
    const rd = (c, s) => (parseCSS(c).rules.find(r => r.sel === s) || { decls: {} }).decls;
    const bg = (c, s) => { const d = rd(c, s); return d.background || d['background-color'] || ''; };
    const BRANCO = /^(white|#fff|#ffffff)$/i, ROXO = /^(purple|#6a0dad|#8b2be2|rebeccapurple)$/i;

    /* ---------- DESAFIOS (adicione novos aqui) ----------
       Campos: id, lang, nivel (Fácil|Médio|Difícil), tam (Pequeno|Grande), nome, desc, ini (código inicial), dica, exp
       HTML/CSS: t = [['requisito', codigo => boolean]]
       JS:       t = [['requisito', 'expressão que deve ser verdadeira']]  */
    const CH = [
        /* ===== HTML ===== */
        {
            id: 'm1', lang: 'html', nivel: 'Fácil', tam: 'Pequeno', nome: 'Meu primeiro título',
            desc: 'Crie uma página simples com um título principal e um parágrafo de apresentação.',
            ini: '<!-- Escreva seu HTML aqui -->\n', dica: 'Use <h1>…</h1> e <p>…</p>.', exp: 'Um <h1> e um <p> com texto.',
            t: [['Um <h1> com texto', c => txt(c, 'h1') !== ''], ['Um <p> com texto', c => txt(c, 'p') !== '']]
        },
        {
            id: 'm2', lang: 'html', nivel: 'Fácil', tam: 'Grande', nome: 'Cartão de perfil',
            desc: 'Monte um cartão de perfil: nome, foto, uma frase sobre você, lista de hobbies e um link para a página inicial.',
            ini: '<!-- Cartão de perfil -->\n', dica: 'Hobbies vão em <ul> com <li>. A foto usa <img src="…" alt="…">.', exp: 'h1, img com src e alt, p, ul com 3 li e um link.',
            t: [['<h1> com o nome', c => txt(c, 'h1') !== ''], ['<img> com src e alt preenchidos', c => attr(c, 'img', 'src') !== '' && attr(c, 'img', 'alt') !== ''], ['Um <p> com texto', c => txt(c, 'p') !== ''], ['Lista <ul> com pelo menos 3 <li>', c => QA(c, 'ul li') >= 3], ['Um link <a href="home.html"> com texto', c => attr(c, 'a', 'href') === 'home.html' && txt(c, 'a') !== '']]
        },
        {
            id: 'm3', lang: 'html', nivel: 'Médio', tam: 'Pequeno', nome: 'Formulário de login',
            desc: 'Crie um formulário de login com e-mail, senha e botão de enviar, usando rótulos acessíveis.',
            ini: '<!-- Formulário de login -->\n', dica: 'Use <label for="x"> ligado a <input id="x">. O e-mail deve ter type="email" e required.', exp: 'form com label, input email required, input password e button submit.',
            t: [['Existe um <form>', c => QA(c, 'form') === 1], ['Input type="email" com required', c => !!Q(c, 'input[type=email][required]')], ['Input type="password"', c => !!Q(c, 'input[type=password]')], ['Pelo menos 2 <label> com texto', c => [...parseHTML(c).querySelectorAll('label')].filter(l => l.textContent.trim()).length >= 2], ['Botão type="submit" com texto', c => !!Q(c, 'button[type=submit]') && txt(c, 'button[type=submit]') !== '']]
        },
        {
            id: 'm4', lang: 'html', nivel: 'Médio', tam: 'Grande', nome: 'Página completa',
            desc: 'Crie uma página HTML5 completa com cabeçalho e menu, conteúdo principal e rodapé.',
            ini: '', dica: 'Estrutura: doctype, html, head (meta charset + title), body (header > nav, main > section, footer).', exp: 'Estrutura semântica completa.',
            t: [['Começa com <!DOCTYPE html>', c => /^\s*<!doctype html>/i.test(c)], ['<head> com <meta charset> e <title> preenchido', c => !!Q(c, 'head meta[charset]') && txt(c, 'head title') !== ''], ['<header> com <nav> e 3 links (<a>)', c => QA(c, 'header nav a') >= 3], ['<main> com <section> contendo <h2> e <p>', c => !!Q(c, 'main section h2') && !!Q(c, 'main section p')], ['<footer> com texto', c => txt(c, 'footer') !== '']]
        },
        {
            id: 'm5', lang: 'html', nivel: 'Difícil', tam: 'Grande', nome: 'Tabela e formulário',
            desc: 'Crie uma tabela de notas (3 colunas, cabeçalho e pelo menos 3 linhas de dados) e, abaixo, um formulário com um <select> e um campo de texto com label ligado.',
            ini: '', dica: 'Tabela: <table><thead><tr><th>…, <tbody><tr><td>… Label: <label for="nome"> + <input id="nome">.', exp: 'table com thead/tbody e form com select e label for.',
            t: [['<thead> com 3 <th>', c => QA(c, 'table thead th') >= 3], ['<tbody> com pelo menos 3 linhas', c => QA(c, 'table tbody tr') >= 3], ['Cada linha do <tbody> tem 3 <td>', c => { const l = [...parseHTML(c).querySelectorAll('tbody tr')]; return l.length > 0 && l.every(r => r.querySelectorAll('td').length === 3); }], ['<select> com pelo menos 3 <option>', c => QA(c, 'select option') >= 3], ['<label for> ligado a um elemento com esse id', c => { const d = parseHTML(c); return [...d.querySelectorAll('label[for]')].some(l => d.getElementById(l.getAttribute('for'))); }]]
        },
        /* ===== CSS ===== */
        {
            id: 'm6', lang: 'css', nivel: 'Fácil', tam: 'Pequeno', nome: 'Botão estilizado',
            desc: 'Estilize o elemento <button class="botao">: fundo roxo, texto branco, cantos arredondados e espaçamento interno.',
            ini: '', dica: 'Propriedades: background, color, border-radius, padding.', exp: 'Regra .botao com as 4 propriedades.',
            t: [['.botao com fundo roxo (purple, #6A0DAD ou #8B2BE2)', c => ROXO.test(bg(c, '.botao'))], ['Texto branco (color)', c => BRANCO.test(rd(c, '.botao').color || '')], ['border-radius definido', c => !!rd(c, '.botao')['border-radius']], ['padding definido', c => !!rd(c, '.botao').padding]]
        },
        {
            id: 'm7', lang: 'css', nivel: 'Fácil', tam: 'Pequeno', nome: 'Centralizar com Flexbox',
            desc: 'Centralize o conteúdo de <div class="centro"> na horizontal e na vertical, ocupando 100vh de altura.',
            ini: '', dica: 'display: flex + justify-content + align-items.', exp: 'Flexbox com justify-content e align-items: center.',
            t: [['display: flex', c => rd(c, '.centro').display === 'flex'], ['justify-content: center', c => rd(c, '.centro')['justify-content'] === 'center'], ['align-items: center', c => rd(c, '.centro')['align-items'] === 'center'], ['Altura definida (height ou min-height)', c => !!(rd(c, '.centro').height || rd(c, '.centro')['min-height'])]]
        },
        {
            id: 'm8', lang: 'css', nivel: 'Médio', tam: 'Pequeno', nome: 'Card com hover',
            desc: 'Estilize <div class="card">: cantos arredondados (mínimo 8px), espaçamento interno e sombra. Ao passar o mouse, ele deve subir um pouco.',
            ini: '', dica: 'Use box-shadow e .card:hover { transform: translateY(-4px); }', exp: 'Regra .card e regra .card:hover com transform.',
            t: [['border-radius de pelo menos 8px', c => parseFloat(rd(c, '.card')['border-radius']) >= 8], ['padding definido', c => !!rd(c, '.card').padding], ['box-shadow definido', c => !!rd(c, '.card')['box-shadow']], ['.card:hover com transform', c => !!rd(c, '.card:hover').transform]]
        },
        {
            id: 'm9', lang: 'css', nivel: 'Médio', tam: 'Grande', nome: 'Galeria em Grid',
            desc: 'Crie o layout de <div class="grade"> com itens <div class="item">: 3 colunas iguais, espaço entre os itens, e cada item com fundo e espaçamento.',
            ini: '', dica: 'display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;', exp: 'CSS Grid com 3 colunas e gap.',
            t: [['.grade com display: grid', c => rd(c, '.grade').display === 'grid'], ['3 colunas (repeat(3, …) ou três valores)', c => /^repeat\(\s*3\s*,/.test(rd(c, '.grade')['grid-template-columns'] || '') || /^\S+\s+\S+\s+\S+$/.test(rd(c, '.grade')['grid-template-columns'] || '')], ['gap definido', c => !!(rd(c, '.grade').gap || rd(c, '.grade')['grid-gap'])], ['.item com fundo', c => bg(c, '.item') !== ''], ['.item com padding', c => !!rd(c, '.item').padding]]
        },
        {
            id: 'm10', lang: 'css', nivel: 'Difícil', tam: 'Grande', nome: 'Tema com variáveis',
            desc: 'Crie um tema com variáveis CSS em :root (pelo menos 2) e use-as em body, .titulo (com font-size) e no botão .btn. O .btn:hover deve mudar o fundo.',
            ini: '', dica: '--cor-fundo: #0D0014; e depois background: var(--cor-fundo);', exp: 'Variáveis em :root usadas com var().',
            t: [[':root com pelo menos 2 variáveis (--nome)', c => Object.keys(rd(c, ':root')).filter(k => k.startsWith('--')).length >= 2], ['body usa var(...) no fundo', c => /var\(--/.test(bg(c, 'body'))], ['.btn usa var(...) no fundo', c => /var\(--/.test(bg(c, '.btn'))], ['.btn:hover altera o fundo', c => bg(c, '.btn:hover') !== ''], ['.titulo com font-size', c => !!rd(c, '.titulo')['font-size']]]
        },
        /* ===== JAVASCRIPT ===== */
        {
            id: 'm11', lang: 'js', nivel: 'Fácil', tam: 'Pequeno', nome: 'Par e soma',
            desc: 'Crie ehPar(n), que retorna true se n for par, e somaArray(arr), que retorna a soma dos números do array.',
            ini: '// Escreva as funções ehPar e somaArray\n', dica: 'Use n % 2 e um laço (ou reduce) para somar.', exp: 'n % 2 === 0 e acumulador.',
            t: [['ehPar(4) é true', 'ehPar(4)===true'], ['ehPar(7) é false', 'ehPar(7)===false'], ['somaArray([1,2,3]) é 6', 'somaArray([1,2,3])===6'], ['somaArray([]) é 0', 'somaArray([])===0']]
        },
        {
            id: 'm12', lang: 'js', nivel: 'Fácil', tam: 'Pequeno', nome: 'Inverter texto',
            desc: 'Crie inverterTexto(texto), que devolve o texto de trás para frente.',
            ini: '// Escreva a função inverterTexto\n', dica: 'split(""), reverse() e join("") resolvem; ou use um laço.', exp: 'texto.split("").reverse().join("").',
            t: [['"abc" vira "cba"', 'inverterTexto("abc")==="cba"'], ['"" continua ""', 'inverterTexto("")===""'], ['"CodeChamp" vira "pmahCedoC"', 'inverterTexto("CodeChamp")==="pmahCedoC"']]
        },
        {
            id: 'm13', lang: 'js', nivel: 'Médio', tam: 'Pequeno', nome: 'Fatorial e vogais',
            desc: 'Crie fatorial(n) e contarVogais(texto) (maiúsculas e minúsculas contam; ignore acentos).',
            ini: '// Escreva as funções fatorial e contarVogais\n', dica: 'fatorial(0) é 1. Para as vogais, percorra o texto em minúsculo e confira em "aeiou".', exp: 'Laço ou recursão; includes em "aeiou".',
            t: [['fatorial(5) é 120', 'fatorial(5)===120'], ['fatorial(0) é 1', 'fatorial(0)===1'], ['contarVogais("CodeChamp") é 3', 'contarVogais("CodeChamp")===3'], ['contarVogais("AEIOU") é 5', 'contarVogais("AEIOU")===5'], ['contarVogais("xyz") é 0', 'contarVogais("xyz")===0']]
        },
        {
            id: 'm14', lang: 'js', nivel: 'Médio', tam: 'Pequeno', nome: 'Palíndromo',
            desc: 'Crie ehPalindromo(texto): true se o texto é igual de trás para frente, ignorando espaços e diferença entre maiúsculas e minúsculas.',
            ini: '// Escreva a função ehPalindromo\n', dica: 'Normalize: toLowerCase() e remova espaços com replace(/\\s/g, "").', exp: 'Normalizar e comparar com o inverso.',
            t: [['"arara" é palíndromo', 'ehPalindromo("arara")===true'], ['"Ame a ema" é palíndromo', 'ehPalindromo("Ame a ema")===true'], ['"codigo" não é', 'ehPalindromo("codigo")===false']]
        },
        {
            id: 'm15', lang: 'js', nivel: 'Difícil', tam: 'Pequeno', nome: 'Primos e Fibonacci',
            desc: 'Crie ehPrimo(n) e fibonacci(n), que devolve um array com os n primeiros números da sequência (começando em 0, 1).',
            ini: '', dica: 'Primo: maior que 1 e sem divisores até a raiz de n. Fibonacci: cada termo é a soma dos dois anteriores.', exp: 'Laço até Math.sqrt(n); array acumulando os termos.',
            t: [['ehPrimo(2) e ehPrimo(17) são true', 'ehPrimo(2)===true&&ehPrimo(17)===true'], ['ehPrimo(1) e ehPrimo(21) são false', 'ehPrimo(1)===false&&ehPrimo(21)===false'], ['fibonacci(7) = [0,1,1,2,3,5,8]', 'JSON.stringify(fibonacci(7))==="[0,1,1,2,3,5,8]"'], ['fibonacci(1) = [0]', 'JSON.stringify(fibonacci(1))==="[0]"']]
        },
        {
            id: 'm16', lang: 'js', nivel: 'Médio', tam: 'Grande', nome: 'Carrinho de compras',
            desc: 'Crie criarCarrinho(), que retorna um objeto com: adicionar(nome, preco, qtd), remover(nome), total() e itens(). Adicionar o mesmo nome de novo soma a quantidade.',
            ini: '', dica: 'Guarde os itens num array (ou objeto) dentro da função e retorne os métodos.', exp: 'Closure com lista de itens; total soma preco * qtd.',
            t: [['Carrinho vazio tem total 0', 'criarCarrinho().total()===0'], ['total() soma preço × quantidade', '(()=>{const c=criarCarrinho();c.adicionar("Livro",30,2);c.adicionar("Caneta",5,3);return c.total()===75})()'], ['Mesmo item soma a quantidade', '(()=>{const c=criarCarrinho();c.adicionar("A",10,1);c.adicionar("A",10,2);return c.itens().length===1&&c.total()===30})()'], ['remover() tira o item', '(()=>{const c=criarCarrinho();c.adicionar("A",10,1);c.adicionar("B",20,1);c.remover("A");return c.total()===20&&c.itens().length===1})()']]
        },
        {
            id: 'm17', lang: 'js', nivel: 'Difícil', tam: 'Grande', nome: 'Estatísticas e palavras',
            desc: 'Crie estatisticas(arr), que retorna {min, max, media, mediana}, e contarPalavras(frase), que retorna um objeto com a contagem de cada palavra (minúsculas, sem pontuação).',
            ini: '', dica: 'Mediana: ordene uma cópia com sort((a,b)=>a-b); se o tamanho for par, tire a média dos dois do meio. Palavras: toLowerCase() e match(/[a-zà-ú]+/g).', exp: 'Ordenação numérica e objeto contador.',
            t: [['[4,1,3,2]: min 1, max 4, média 2.5, mediana 2.5', '(()=>{const e=estatisticas([4,1,3,2]);return e.min===1&&e.max===4&&e.media===2.5&&e.mediana===2.5})()'], ['Mediana de [5,1,9] é 5', 'estatisticas([5,1,9]).mediana===5'], ['Média de [7] é 7', 'estatisticas([7]).media===7'], ['"Oi oi, mundo! Mundo mundo." → oi:2, mundo:3', '(()=>{const r=contarPalavras("Oi oi, mundo! Mundo mundo.");return r.oi===2&&r.mundo===3})()'], ['Frase vazia gera objeto vazio', 'Object.keys(contarPalavras("")).length===0']]
        }
    ];

    /* ---------- Estado e persistência local ---------- */
    let P = { solved: {}, attempts: 0, hits: 0 };
    try { P = Object.assign(P, JSON.parse(localStorage.getItem('codechamp_maratona')) || {}); } catch (e) { }
    const save = () => { try { localStorage.setItem('codechamp_maratona', JSON.stringify(P)); } catch (e) { } };
    const F = { lang: 'todos', nivel: 'todos', tam: 'todos' };
    const S = { c: null, hints: 0, wrong: 0, done: false, timer: null, left: 0 };
    const score = () => Object.values(P.solved).reduce((a, b) => a + b, 0);

    /* ---------- Telas ---------- */
    const telas = ['telaSelecao', 'telaJogo', 'telaResumo'];
    function mostrar(id) { telas.forEach(t => $('#' + t).hidden = t !== id); stopTimer(); window.scrollTo(0, 0); if (id === 'telaSelecao') renderSel(); if (id === 'telaResumo') renderResumo(); }
    const statBox = items => items.map(([v, l]) => `<div class="stat"><b>${v}</b><small>${l}</small></div>`).join('');
    const aprov = () => P.attempts ? Math.round(P.hits / P.attempts * 100) + '%' : '—';
    function renderSel() {
        $('#statsTopo').innerHTML = statBox([[score(), 'Pontos'], [Object.keys(P.solved).length + '/' + CH.length, 'Resolvidos'], [P.hits, 'Acertos'], [aprov(), 'Aproveitamento']]);
        const lista = CH.filter(c => (F.lang === 'todos' || c.lang === F.lang) && (F.nivel === 'todos' || c.nivel === F.nivel) && (F.tam === 'todos' || c.tam === F.tam))
            .sort((a, b) => ORD[a.nivel] - ORD[b.nivel]);
        const g = $('#grade'); g.innerHTML = '';
        if (!lista.length) { g.textContent = 'Nenhum desafio com esses filtros.'; return; }
        lista.forEach(c => {
            const b = document.createElement('button');
            b.className = 'card' + (P.solved[c.id] !== undefined ? ' feito' : '');
            b.innerHTML = `<div class="selos"><span class="selo ${c.lang}">${LANG[c.lang]}</span><span class="selo ${NC[c.nivel]}">${c.nivel}</span><span class="selo tam">${c.tam}</span><span class="selo ouro">${pts(c)} pts</span></div><h3></h3><p></p>`;
            b.querySelector('h3').textContent = (P.solved[c.id] !== undefined ? '✔ ' : '') + c.nome;
            b.querySelector('p').textContent = c.desc;
            b.onclick = () => abrir(c.id);
            g.appendChild(b);
        });
    }
    function renderResumo() {
        const n = Object.keys(P.solved).length;
        $('#statsResumo').innerHTML = statBox([[score(), 'Pontos'], [n + '/' + CH.length, 'Desafios resolvidos'], [P.hits + '/' + P.attempts, 'Acertos / envios'], [aprov(), 'Aproveitamento'], [Math.round(n / CH.length * 100) + '%', 'Progresso total']]);
        $('#statsNivel').innerHTML = statBox(Object.keys(BASE).map(nv => [CH.filter(c => c.nivel === nv && P.solved[c.id] !== undefined).length + '/' + CH.filter(c => c.nivel === nv).length, nv]));
    }

    /* ---------- Editor ---------- */
    const ed = $('#ed'), gut = $('#gutter');
    let livre = false;
    function gutter() { const n = ed.value.split('\n').length; gut.textContent = Array.from({ length: n }, (_, i) => i + 1).join('\n'); gut.scrollTop = ed.scrollTop; }
    const ins = t => { ed.setRangeText(t, ed.selectionStart, ed.selectionEnd, 'end'); gutter(); };
    ed.addEventListener('input', gutter);
    ed.addEventListener('scroll', () => gut.scrollTop = ed.scrollTop);
    ed.addEventListener('blur', () => livre = false);
    ed.addEventListener('keydown', e => {
        if (e.key === 'Escape') { livre = true; return; }
        if (e.key === 'Tab' && !e.shiftKey && !livre) { e.preventDefault(); ins('  '); }
        else if (e.key === 'Enter' && !e.ctrlKey && !e.metaKey && !e.altKey) {
            e.preventDefault();
            const ant = ed.value.slice(0, ed.selectionStart), lin = ant.slice(ant.lastIndexOf('\n') + 1);
            ins('\n' + lin.match(/^\s*/)[0] + (S.c.lang !== 'html' && /[{[(]\s*$/.test(lin) ? '  ' : ''));
        }
    });
    function formatar(code, lang) {
        let d = 0, vazio = false;
        return code.split('\n').map(l => l.trim()).map(l => {
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
            postMessage(tests.map(([nome, expr]) => {
                try { return { nome, ok: new Function(code + '\n;return !!(' + expr + ');')() === true }; }
                catch (err) { return { nome, ok: false, erro: err.name + ': ' + err.message }; }
            }));
        };
    }
    function rodarJS(code, tests) {
        return new Promise(res => {
            let w;
            try { w = new Worker(URL.createObjectURL(new Blob(['(' + workerFn.toString() + ')()'], { type: 'text/javascript' }))); }
            catch (e) { return res([{ nome: 'Ambiente de execução', ok: false, erro: 'Seu navegador bloqueou o Web Worker: ' + e.message }]); }
            const to = setTimeout(() => { w.terminate(); res([{ nome: 'Tempo de execução', ok: false, erro: 'O código demorou demais (possível loop infinito).' }]); }, 3000);
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
        $('#jNivel').textContent = c.nivel; $('#jNivel').className = 'selo ' + NC[c.nivel];
        $('#jTam').textContent = c.tam; $('#jPts').textContent = pts(c) + ' pts';
        $('#jDesc').textContent = c.desc;
        $('#jReq').innerHTML = ''; c.t.forEach(([n]) => { const li = document.createElement('li'); li.textContent = n; $('#jReq').appendChild(li); });
        $('#jDica').hidden = true; $('#fimBox').hidden = true;
        ['btnTeste', 'btnSubmit', 'btnDica'].forEach(b => $('#' + b).disabled = false);
        ed.value = c.ini; gutter(); ed.scrollTop = 0;
        out([['Escreva o código do zero e clique em "Executar teste" ou "Submeter".', 'info']]);
        progresso(); mostrar('telaJogo');
        if ($('#chkTempo').checked) startTimer(TEMPO[c.nivel]);
    }
    function progresso() { const n = Object.keys(P.solved).length; $('#jBarra').style.width = (n / CH.length * 100) + '%'; $('#jProg').textContent = `${n}/${CH.length} desafios — ${score()} pontos`; }
    function startTimer(seg) {
        S.left = seg; $('#jTempoBox').hidden = false; tick();
        S.timer = setInterval(() => { S.left--; tick(); if (S.left <= 0) fimTempo(); }, 1000);
    }
    function tick() { const m = Math.floor(S.left / 60), s = S.left % 60; $('#jTempo').textContent = m + ':' + String(s).padStart(2, '0'); $('#jTempoBox').classList.toggle('baixo', S.left <= 30); }
    function stopTimer() { clearInterval(S.timer); S.timer = null; $('#jTempoBox').hidden = true; }
    function fimTempo() {
        clearInterval(S.timer); S.done = true;
        ['btnTeste', 'btnSubmit'].forEach(b => $('#' + b).disabled = true);
        out([['⏰ Tempo esgotado! Nenhum ponto foi concedido neste desafio.', 'erro'], ['Use "Resetar" e tente sem cronômetro, ou escolha outro desafio.', 'info']]);
        $('#fimBox').hidden = false;
    }
    $('#btnTeste').onclick = async () => { out([['Executando…', 'info']]); out(relatorio(await testar())); };
    $('#btnSubmit').onclick = async () => {
        if (S.done) return;
        const res = await testar(), ok = res.every(r => r.ok), c = S.c, linhas = relatorio(res);
        P.attempts++;
        if (ok) {
            P.hits++; S.done = true; stopTimer();
            const base = pts(c), ganho = Math.max(Math.ceil(base / 2), base - S.hints * 5 - S.wrong * 2);
            if (P.solved[c.id] === undefined) { P.solved[c.id] = ganho; linhas.push([`🏁 Desafio concluído! +${ganho} pontos.`, 'ouro']); }
            else linhas.push(['🏁 Correto! (já concluído antes, sem pontos extras)', 'ouro']);
            linhas.push(['Ideia da solução: ' + c.exp, 'info']);
            $('#fimBox').hidden = false;
        } else { S.wrong++; linhas.push(['Ainda não está completo. Confira os requisitos ao lado ou peça uma dica.', 'erro']); }
        save(); progresso(); out(linhas);
    };
    $('#btnDica').onclick = () => { if (!S.hints) S.hints = 1; const d = $('#jDica'); d.textContent = '💡 ' + S.c.dica; d.hidden = false; };
    $('#btnReset').onclick = () => { ed.value = S.c.ini; gutter(); out([['Editor limpo: voltou ao código inicial.', 'info']]); };
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