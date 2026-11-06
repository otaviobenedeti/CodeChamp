(() => {
    'use strict';

    const $ = (id) => document.getElementById(id);
    const DURACAO = 20;

    const DESAFIOS = [
        {
            categoria: 'JavaScript',
            pergunta: 'Qual operador compara valor e tipo ao mesmo tempo?',
            codigo: '5 ___ "5"',
            opcoes: ['==', '===', '=', '!=='],
            correta: 1,
            explicacao: 'O operador === compara valor e tipo.'
        },
        {
            categoria: 'HTML',
            pergunta: 'Qual atributo define o destino de um link?',
            codigo: '<a ___="pagina.html">Abrir</a>',
            opcoes: ['src', 'href', 'link', 'target'],
            correta: 1,
            explicacao: 'O atributo href informa o endereço do link.'
        },
        {
            categoria: 'CSS',
            pergunta: 'Qual propriedade muda a cor do texto?',
            codigo: '.titulo { ___: gold; }',
            opcoes: ['font-color', 'text-color', 'color', 'background'],
            correta: 2,
            explicacao: 'A propriedade color define a cor do texto.'
        },
        {
            categoria: 'JavaScript',
            pergunta: 'O que este código imprime?',
            codigo: 'console.log(2 + "3");',
            opcoes: ['5', '23', 'NaN', 'Erro'],
            correta: 1,
            explicacao: 'Com texto, o + concatena e forma "23".'
        },
        {
            categoria: 'JavaScript',
            pergunta: 'Qual palavra cria uma variável que pode receber novo valor?',
            codigo: '___ pontos = 10;\npontos = 20;',
            opcoes: ['const', 'let', 'static', 'define'],
            correta: 1,
            explicacao: 'let declara uma variável que pode mudar.'
        }
    ];

    const TELAS = ['telaSelecao', 'telaJogo', 'telaResumo'];
    const JOGO = {
        indice: 0,
        pontos: 0,
        restantes: DURACAO,
        intervalo: null,
        bloqueado: false
    };

    function mostrarTela(id) {
        TELAS.forEach((tela) => {
            $(tela).hidden = tela !== id;
        });
        window.scrollTo(0, 0);
    }

    function pararCronometro() {
        if (JOGO.intervalo) {
            clearInterval(JOGO.intervalo);
        }
        JOGO.intervalo = null;
    }

    function desenharCronometro() {
        $('tempo').textContent = JOGO.restantes;
        $('barraTempo').style.width = `${Math.max(0, JOGO.restantes / DURACAO * 100)}%`;
        $('timerWrap').classList.toggle('urgente', JOGO.restantes <= 5);
    }

    function iniciarJogo() {
        pararCronometro();
        JOGO.indice = 0;
        JOGO.pontos = 0;
        JOGO.restantes = DURACAO;
        $('pontos').textContent = JOGO.pontos;
        mostrarTela('telaJogo');
        carregarDesafio();
    }

    function carregarDesafio() {
        pararCronometro();
        JOGO.bloqueado = false;
        JOGO.restantes = DURACAO;

        const desafio = DESAFIOS[JOGO.indice];
        $('progresso').textContent = `Desafio ${JOGO.indice + 1} de ${DESAFIOS.length}`;
        $('categoria').textContent = desafio.categoria;
        $('pergunta').textContent = desafio.pergunta;
        $('codigo').textContent = desafio.codigo;
        $('feedback').textContent = '';
        $('feedback').className = 'feedback';
        $('timerWrap').classList.remove('urgente');
        desenharCronometro();

        const respostas = $('respostas');
        respostas.replaceChildren();

        desafio.opcoes.forEach((opcao, indice) => {
            const botao = document.createElement('button');
            botao.type = 'button';
            botao.className = 'btn sec resposta';
            botao.textContent = `${String.fromCharCode(65 + indice)}. ${opcao}`;
            botao.addEventListener('click', () => responder(indice, botao));
            respostas.appendChild(botao);
        });

        JOGO.intervalo = setInterval(() => {
            JOGO.restantes -= 1;
            desenharCronometro();

            if (JOGO.restantes <= 0) {
                encerrarDesafio(false, null);
            }
        }, 1000);
    }

    function responder(escolha, botao) {
        if (JOGO.bloqueado) {
            return;
        }

        const desafio = DESAFIOS[JOGO.indice];
        if (escolha === desafio.correta) {
            botao.classList.add('correta');
            encerrarDesafio(true, desafio.explicacao);
        } else {
            botao.classList.add('errada');
            encerrarDesafio(false, 'Resposta incorreta. A bomba avançou para o próximo desafio.');
        }
    }

    function encerrarDesafio(acertou, mensagem) {
        if (JOGO.bloqueado) {
            return;
        }

        JOGO.bloqueado = true;
        pararCronometro();

        [...$('respostas').children].forEach((botao, indice) => {
            botao.disabled = true;
            if (indice === DESAFIOS[JOGO.indice].correta) {
                botao.classList.add('correta');
            }
        });

        if (acertou) {
            JOGO.pontos += 100 + JOGO.restantes * 5;
            $('pontos').textContent = JOGO.pontos;
        }

        $('feedback').textContent = mensagem || 'O tempo acabou! A resposta correta está destacada.';
        $('feedback').classList.add(acertou ? 'ok' : 'erro');

        window.setTimeout(() => {
            JOGO.indice += 1;
            if (JOGO.indice >= DESAFIOS.length) {
                finalizarJogo();
            } else {
                carregarDesafio();
            }
        }, 1400);
    }

    function finalizarJogo() {
        pararCronometro();
        $('iconeResultado').textContent = '🎉';
        $('tituloResultado').textContent = 'Bomba desarmada!';
        $('textoResultado').textContent = 'Mandou bem! Você completou todos os desafios.';
        $('pontosFinais').textContent = JOGO.pontos;
        mostrarTela('telaResumo');
    }

    $('btnComecar').addEventListener('click', iniciarJogo);
    $('btnJogarNovamente').addEventListener('click', iniciarJogo);
})();
