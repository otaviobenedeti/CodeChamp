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

    const questao = (pergunta, codigo, opcoes, correta, explicacao) => ({ categoria: '', pergunta, codigo, opcoes, correta, explicacao });
    const QUESTOES_POR_LINGUAGEM = {
        Python: [
            questao('Qual comando exibe uma mensagem no terminal?', '___("Olá")', ['echo("Olá")', 'print("Olá")', 'console.log("Olá")', 'show("Olá")'], 1, 'print() exibe valores no terminal.'),
            questao('Qual função retorna a quantidade de elementos de uma lista?', 'numeros = [2, 4, 6]\nquantidade = ___(numeros)', ['size(numeros)', 'length(numeros)', 'len(numeros)', 'count(numeros)'], 2, 'len() retorna o tamanho de uma lista.'),
            questao('Qual palavra inicia a definição de uma função?', '___ somar(a, b):\n    return a + b', ['function', 'def', 'fun', 'func'], 1, 'Em Python, funções são declaradas com def.'),
            questao('Qual operador faz divisão inteira, descartando a parte decimal?', '7 ___ 2  # resultado: 3', ['/', '//', '%', '**'], 1, 'O operador // faz divisão inteira em Python.'),
            questao('Qual estrutura percorre os valores de uma lista?', '___ item in itens:\n    print(item)', ['foreach', 'for', 'loop', 'repeat'], 1, 'O laço for percorre os elementos de uma lista.')
        ],
        Java: [
            questao('Qual método imprime uma linha no console?', 'System.out.___("Olá");', ['printLine', 'println', 'writeLine', 'log'], 1, 'System.out.println() imprime uma linha.'),
            questao('Qual método é o ponto de entrada convencional de um programa Java?', 'public static void ___(String[] args)', ['run', 'start', 'main', 'init'], 2, 'A execução convencional começa em main.'),
            questao('Qual método compara o conteúdo de duas Strings?', 'texto1.___(texto2)', ['compare', 'equals', 'same', 'match'], 1, 'equals() compara o conteúdo de Strings.'),
            questao('Como obter o tamanho de um array chamado valores?', 'valores.___', ['size()', 'length', 'count', 'len()'], 1, 'Arrays Java expõem o tamanho pela propriedade length.'),
            questao('Qual palavra impede que uma variável receba outro valor?', '___ int idade = 18;', ['static', 'final', 'const', 'fixed'], 1, 'A palavra final impede nova atribuição à variável.')
        ],
        JavaScript: [
            questao('Qual operador compara valor e tipo ao mesmo tempo?', '5 ___ "5"', ['==', '===', '=', '!=='], 1, 'O operador === compara valor e tipo.'),
            questao('Qual palavra declara uma variável que pode receber outro valor?', '___ pontos = 10;\npontos = 20;', ['const', 'let', 'static', 'define'], 1, 'let permite reatribuir a variável.'),
            questao('Qual comando escreve uma mensagem no console?', '___("Olá");', ['print', 'console.log', 'echo', 'write'], 1, 'console.log() escreve no console.'),
            questao('Como obter a quantidade de elementos do array itens?', 'itens.___', ['size()', 'length', 'count', 'len()'], 1, 'Arrays JavaScript usam a propriedade length.'),
            questao('Qual método transforma cada elemento de um array?', 'numeros.___((n) => n * 2)', ['filter', 'map', 'reduceBy', 'change'], 1, 'map() cria um novo array transformando cada elemento.')
        ],
        'C++': [
            questao('Qual objeto é usado para exibir texto no terminal?', '___ << "Olá";', ['cout', 'print', 'console', 'output'], 0, 'std::cout envia texto para a saída padrão.'),
            questao('Qual diretiva inclui recursos de entrada e saída?', '#include <___>', ['stdio', 'iostream', 'console', 'input'], 1, 'iostream fornece cout e cin.'),
            questao('Como obter a quantidade de elementos de um vector chamado valores?', 'valores.___()', ['length', 'size', 'count', 'len'], 1, 'vector oferece o método size().'),
            questao('Qual valor indica normalmente que main terminou com sucesso?', 'return ___;', ['true', '0', '1', 'null'], 1, 'Em C++, return 0 indica término bem-sucedido.'),
            questao('Qual operador testa se dois valores são iguais?', 'if (a ___ b)', ['=', '==', '===', '!='], 1, 'O operador == testa igualdade.')
        ],
        'C#': [
            questao('Qual método escreve uma linha no console?', 'Console.___("Olá");', ['PrintLine', 'WriteLine', 'println', 'log'], 1, 'Console.WriteLine() escreve uma linha.'),
            questao('Qual diretiva importa o namespace padrão de Console?', '___ System;', ['include', 'using', 'import', 'package'], 1, 'Em C#, usa-se using System;.'),
            questao('Qual propriedade informa quantos itens há em uma List chamada itens?', 'itens.___', ['Length', 'Count', 'Size', 'Length()'], 1, 'List<T> fornece a propriedade Count.'),
            questao('Qual palavra declara um método sem valor de retorno?', 'public ___ Mostrar()', ['null', 'void', 'empty', 'static'], 1, 'void indica que o método não retorna valor.'),
            questao('Qual operador compara dois valores para igualdade?', 'if (a ___ b)', ['=', '==', '===', '<>'], 1, 'O operador == compara os valores.')
        ],
        TypeScript: [
            questao('Como declarar uma variável idade com tipo numérico?', 'let idade: ___ = 18;', ['int', 'number', 'numeric', 'NumberType'], 1, 'TypeScript usa number como tipo numérico.'),
            questao('Qual palavra declara uma constante?', '___ nome: string = "Ana";', ['let', 'const', 'var!', 'static'], 1, 'const declara um vínculo que não será reatribuído.'),
            questao('Qual método escreve uma mensagem no console?', 'console.___("Olá");', ['print', 'log', 'write', 'echo'], 1, 'console.log() escreve no console.'),
            questao('Qual tipo representa uma lista de números?', 'let valores: ___ = [1, 2, 3];', ['number[]', 'int-list', 'Array<number[]>', 'numbers'], 0, 'number[] representa um array de números.'),
            questao('Como indicar que uma função retorna um booleano?', 'function ativo(): ___ { return true; }', ['bool', 'boolean', 'truth', 'logical'], 1, 'O tipo boolean representa true ou false.')
        ],
        SQL: [
            questao('Qual comando consulta dados de uma tabela?', '___ nome, email FROM usuarios;', ['GET', 'SELECT', 'FETCH TABLE', 'READ'], 1, 'SELECT consulta colunas de uma tabela.'),
            questao('Qual cláusula filtra linhas pelo valor de uma coluna?', 'SELECT * FROM usuarios ___ idade >= 18;', ['FILTER', 'WHERE', 'HAVING BY', 'MATCH'], 1, 'WHERE filtra as linhas antes do agrupamento.'),
            questao('Qual cláusula ordena os resultados pelo nome?', 'SELECT * FROM usuarios ___ nome ASC;', ['SORT BY', 'ORDER BY', 'GROUP BY', 'ARRANGE'], 1, 'ORDER BY organiza os resultados.'),
            questao('Qual função agrega linhas para contar registros?', 'SELECT cliente_id, ___(*) FROM pedidos GROUP BY cliente_id;', ['SUM', 'COUNT', 'TOTAL', 'LENGTH'], 1, 'COUNT(*) conta as linhas de cada grupo.'),
            questao('Qual comando altera dados existentes em uma tabela?', '___ usuarios SET ativo = 1 WHERE id = 3;', ['CHANGE', 'UPDATE', 'ALTER', 'MODIFY ROW'], 1, 'UPDATE altera linhas existentes.')
        ]
    };

    const TELAS = ['telaSelecao', 'telaJogo', 'telaResumo'];
    const JOGO = {
        indice: 0,
        pontos: 0,
        restantes: DURACAO,
        intervalo: null,
        bloqueado: false,
        desafios: []
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
        JOGO.desafios = QUESTOES_POR_LINGUAGEM[$('linguagem').value];
        $('pontos').textContent = JOGO.pontos;
        mostrarTela('telaJogo');
        carregarDesafio();
    }

    function carregarDesafio() {
        pararCronometro();
        JOGO.bloqueado = false;
        JOGO.restantes = DURACAO;

        const desafio = JOGO.desafios[JOGO.indice];
        $('progresso').textContent = `Desafio ${JOGO.indice + 1} de ${JOGO.desafios.length}`;
        $('categoria').textContent = $('linguagem').value;
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

        const desafio = JOGO.desafios[JOGO.indice];
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
            if (indice === JOGO.desafios[JOGO.indice].correta) {
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
            if (JOGO.indice >= JOGO.desafios.length) {
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

    $('btnComecar').addEventListener('click', () => {
        if (document.querySelector('input[name="modoBomb"]:checked').value === 'quiz') iniciarJogo();
    });
    $('btnJogarNovamente').addEventListener('click', () => {
        if (document.querySelector('input[name="modoBomb"]:checked').value === 'quiz') mostrarTela('telaSelecao');
    });
})();
