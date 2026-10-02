// =====================================================
// PERFIL.JS
// CODECHAMP
// =====================================================


// =====================================================
// QUANDO A PÁGINA CARREGAR
// =====================================================

document.addEventListener("DOMContentLoaded", function () {

    carregarDadosUsuario();

    carregarLinguagens();

    carregarFotoPerfil();

    configurarFotoPerfil();

    configurarBotaoLinguagens();

});



// =====================================================
// 1. CARREGAR DADOS DO USUÁRIO
// =====================================================

function carregarDadosUsuario() {

    const usuarioSalvo =
        localStorage.getItem("usuario");


    if (!usuarioSalvo) {

        console.warn(
            "Nenhum usuário cadastrado encontrado."
        );

        return;
    }


    let usuario;


    try {

        usuario =
            JSON.parse(usuarioSalvo);

    } catch (erro) {

        console.error(
            "Erro ao ler os dados do usuário:",
            erro
        );

        return;
    }



    // =================================================
    // NOME DE USUÁRIO
    // =================================================

    const nomeUsuario =
        usuario.usuario ||
        usuario.username ||
        usuario.nomeUsuario ||
        "Usuário";


    const elementoUsername =
        document.getElementById("username");


    if (elementoUsername) {

        elementoUsername.textContent =
            nomeUsuario;

    }



    // =================================================
    // NOME
    // =================================================

    const nome =
        usuario.nome ||
        usuario.nomeCompleto ||
        usuario.primeiroNome ||
        nomeUsuario;


    const elementoNome =
        document.getElementById("nomeUsuario");


    if (elementoNome) {

        elementoNome.textContent =
            `Olá, ${nome}! 👋`;

    }



    // =================================================
    // PAÍS
    // =================================================

    const pais =
        usuario.pais ||
        usuario.country ||
        "Brasil";


    const elementoPais =
        document.getElementById("nomePais");


    if (elementoPais) {

        elementoPais.textContent =
            pais;

    }



    // =================================================
    // CÓDIGO DO PAÍS
    // =================================================

    let codigoPais =
        usuario.codigoPais ||
        usuario.countryCode ||
        descobrirCodigoPais(pais);


    codigoPais =
        codigoPais.toLowerCase();



    // =================================================
    // BANDEIRA
    // =================================================

    const bandeira =
        document.getElementById("bandeiraPais");


    if (bandeira) {

        bandeira.className = "fi";

        bandeira.classList.add(
            `fi-${codigoPais}`
        );

    }



    // =================================================
    // CÓDIGO DA NACIONALIDADE
    // =================================================

    const codigo =
        document.getElementById("codigoPais");


    if (codigo) {

        codigo.textContent =
            codigoPais.toUpperCase();

    }



    // =================================================
    // EMOJI DA BANDEIRA
    // =================================================

    const emoji =
        document.getElementById("emojiPais");


    if (emoji) {

        emoji.textContent =
            obterEmojiPais(codigoPais);

    }

}



// =====================================================
// 2. DESCOBRIR CÓDIGO DO PAÍS
// =====================================================

function descobrirCodigoPais(pais) {

    const paises = {

        "Brasil": "br",

        "Portugal": "pt",

        "Estados Unidos": "us",

        "EUA": "us",

        "Argentina": "ar",

        "Chile": "cl",

        "México": "mx",

        "Espanha": "es",

        "França": "fr",

        "Itália": "it",

        "Alemanha": "de",

        "Japão": "jp",

        "China": "cn",

        "Canadá": "ca",

        "Reino Unido": "gb",

        "Inglaterra": "gb"

    };


    return paises[pais] || "br";

}



// =====================================================
// 3. EMOJI DA BANDEIRA
// =====================================================

function obterEmojiPais(codigo) {

    const emojis = {

        "br": "🇧🇷",

        "pt": "🇵🇹",

        "us": "🇺🇸",

        "ar": "🇦🇷",

        "cl": "🇨🇱",

        "mx": "🇲🇽",

        "es": "🇪🇸",

        "fr": "🇫🇷",

        "it": "🇮🇹",

        "de": "🇩🇪",

        "jp": "🇯🇵",

        "cn": "🇨🇳",

        "ca": "🇨🇦",

        "gb": "🇬🇧"

    };


    return emojis[
        codigo.toLowerCase()
    ] || "🌎";

}



// =====================================================
// 4. CONFIGURAR BOTÃO DE LINGUAGENS
// =====================================================

function configurarBotaoLinguagens() {

    const botao =
        document.getElementById(
            "botaoSalvarLinguagens"
        );


    if (!botao) {
        return;
    }


    botao.addEventListener(
        "click",
        salvarLinguagens
    );

}



// =====================================================
// 5. SALVAR LINGUAGENS
// =====================================================

function salvarLinguagens() {

    const selecionadas =
        document.querySelectorAll(
            'input[name="linguagem"]:checked'
        );


    const linguagens = [];


    selecionadas.forEach(
        function (linguagem) {

            linguagens.push(
                linguagem.value
            );

        }
    );



    // Não permite salvar vazio

    if (linguagens.length === 0) {

        alert(
            "Escolha pelo menos uma linguagem."
        );

        return;
    }



    // Salvar linguagens

    localStorage.setItem(
        "linguagensFavoritas",
        JSON.stringify(linguagens)
    );



    // Atualizar tela

    mostrarLinguagens();


    alert(
        "Linguagens salvas com sucesso!"
    );

}



// =====================================================
// 6. CARREGAR LINGUAGENS
// =====================================================

function carregarLinguagens() {

    mostrarLinguagens();

}



// =====================================================
// 7. MOSTRAR LINGUAGENS
// =====================================================

function mostrarLinguagens() {

    const linguagensSalvas =
        JSON.parse(
            localStorage.getItem(
                "linguagensFavoritas"
            )
        ) || [];


    const container =
        document.getElementById(
            "linguagensSelecionadas"
        );


    if (!container) {
        return;
    }


    container.innerHTML = "";



    // =================================================
    // MARCAR OS CHECKBOXES SALVOS
    // =================================================

    const inputs =
        document.querySelectorAll(
            'input[name="linguagem"]'
        );


    inputs.forEach(
        function (input) {

            input.checked =
                linguagensSalvas.includes(
                    input.value
                );

        }
    );



    // =================================================
    // MOSTRAR LINGUAGENS SALVAS
    // =================================================

    linguagensSalvas.forEach(
        function (linguagem) {

            const elemento =
                document.createElement("div");


            elemento.classList.add(
                "selected-language"
            );


            elemento.textContent =
                "💻 " + linguagem;


            container.appendChild(
                elemento
            );

        }
    );



    // =================================================
    // ATUALIZAR QUANTIDADE
    // =================================================

    atualizarQuantidadeLinguagens(
        linguagensSalvas.length
    );

}



// =====================================================
// 8. ATUALIZAR QUANTIDADE DE LINGUAGENS
// =====================================================

function atualizarQuantidadeLinguagens(
    quantidade
) {

    const quantidadeLateral =
        document.getElementById(
            "quantidadeLinguagens"
        );


    if (quantidadeLateral) {

        quantidadeLateral.textContent =
            quantidade;

    }



    const quantidadeCard =
        document.getElementById(
            "totalLinguagens"
        );


    if (quantidadeCard) {

        quantidadeCard.textContent =
            quantidade;

    }

}



// =====================================================
// 9. CONFIGURAR FOTO DE PERFIL
// =====================================================

function configurarFotoPerfil() {

    const input =
        document.getElementById(
            "inputFotoPerfil"
        );


    const botaoRemover =
        document.getElementById(
            "botaoRemoverFoto"
        );


    const foto =
        document.getElementById(
            "fotoPerfil"
        );


    const avatarPadrao =
        document.getElementById(
            "avatarPadrao"
        );


    if (!input) {
        return;
    }



    // =================================================
    // CLICAR NA FOTO PARA ALTERAR
    // =================================================

    if (foto) {

        foto.addEventListener(
            "click",
            function () {

                // Limpa o input antes de abrir
                // a galeria novamente
                input.value = "";

                input.click();

            }
        );

    }



    // =================================================
    // CLICAR NO AVATAR PADRÃO
    // =================================================

    if (avatarPadrao) {

        avatarPadrao.addEventListener(
            "click",
            function () {

                input.value = "";

                input.click();

            }
        );

    }



    // =================================================
    // ESCOLHER OU TROCAR FOTO
    // =================================================

    input.addEventListener(
        "change",
        function (evento) {

            const arquivo =
                evento.target.files[0];


            // Nenhuma imagem escolhida

            if (!arquivo) {
                return;
            }



            // =================================================
            // VERIFICAR SE É UMA IMAGEM
            // =================================================

            if (
                !arquivo.type.startsWith(
                    "image/"
                )
            ) {

                alert(
                    "Escolha uma imagem válida."
                );

                input.value = "";

                return;
            }



            // =================================================
            // TAMANHO MÁXIMO: 5 MB
            // =================================================

            const tamanhoMaximo =
                5 * 1024 * 1024;


            if (
                arquivo.size >
                tamanhoMaximo
            ) {

                alert(
                    "A imagem deve ter no máximo 5 MB."
                );

                input.value = "";

                return;
            }



            // =================================================
            // LER A IMAGEM
            // =================================================

            const leitor =
                new FileReader();


            leitor.onload =
                function (e) {

                    const imagem =
                        e.target.result;



                    // Mostrar nova imagem

                    mostrarFotoPerfil(
                        imagem
                    );



                    // Salvar nova imagem

                    try {

                        localStorage.setItem(
                            "fotoPerfil",
                            imagem
                        );

                    } catch (erro) {

                        console.error(
                            "Erro ao salvar a foto:",
                            erro
                        );

                        alert(
                            "Não foi possível salvar a foto. Ela pode ser muito grande."
                        );

                        return;
                    }



                    // Alterar texto do botão

                    atualizarBotaoFoto();



                    // IMPORTANTE:
                    // limpar o input permite escolher
                    // a mesma foto novamente

                    input.value = "";



                    alert(
                        "Foto de perfil atualizada com sucesso!"
                    );

                };



            leitor.onerror =
                function () {

                    alert(
                        "Não foi possível carregar a imagem."
                    );

                    input.value = "";

                };



            leitor.readAsDataURL(
                arquivo
            );

        }
    );



    // =================================================
    // BOTÃO REMOVER FOTO
    // =================================================

    if (botaoRemover) {

        botaoRemover.addEventListener(
            "click",
            removerFotoPerfil
        );

    }

}



// =====================================================
// 10. MOSTRAR FOTO DE PERFIL
// =====================================================

function mostrarFotoPerfil(
    imagem
) {

    const foto =
        document.getElementById(
            "fotoPerfil"
        );


    const avatarPadrao =
        document.getElementById(
            "avatarPadrao"
        );


    if (!foto) {
        return;
    }



    // =================================================
    // COLOCAR IMAGEM
    // =================================================

    foto.src =
        imagem;



    // =================================================
    // MOSTRAR IMAGEM
    // =================================================

    foto.style.display =
        "block";



    // =================================================
    // ESCONDER AVATAR PADRÃO
    // =================================================

    if (avatarPadrao) {

        avatarPadrao.style.display =
            "none";

    }



    // =================================================
    // ATUALIZAR BOTÃO
    // =================================================

    atualizarBotaoFoto();

}



// =====================================================
// 11. ATUALIZAR BOTÃO DA FOTO
// =====================================================

function atualizarBotaoFoto() {

    const botao =
        document.getElementById(
            "botaoFoto"
        );


    if (!botao) {
        return;
    }


    const fotoSalva =
        localStorage.getItem(
            "fotoPerfil"
        );


    if (fotoSalva) {

        botao.textContent =
            "🔄 Trocar foto";

    } else {

        botao.textContent =
            "📷 Escolher foto";

    }

}



// =====================================================
// 12. CARREGAR FOTO SALVA
// =====================================================

function carregarFotoPerfil() {

    const foto =
        document.getElementById(
            "fotoPerfil"
        );


    const avatarPadrao =
        document.getElementById(
            "avatarPadrao"
        );


    const fotoSalva =
        localStorage.getItem(
            "fotoPerfil"
        );


    // =================================================
    // SE EXISTIR FOTO SALVA
    // =================================================

    if (fotoSalva) {

        mostrarFotoPerfil(
            fotoSalva
        );

    } else {

        // Não existe foto salva

        if (foto) {

            foto.src = "";

            foto.style.display =
                "none";

        }


        if (avatarPadrao) {

            avatarPadrao.style.display =
                "block";

        }


        atualizarBotaoFoto();

    }

}



// =====================================================
// 13. REMOVER FOTO
// =====================================================

function removerFotoPerfil() {

    const fotoSalva =
        localStorage.getItem(
            "fotoPerfil"
        );


    // =================================================
    // NÃO EXISTE FOTO
    // =================================================

    if (!fotoSalva) {

        alert(
            "Você ainda não possui uma foto de perfil."
        );

        return;
    }



    // =================================================
    // CONFIRMAÇÃO
    // =================================================

    const confirmar =
        confirm(
            "Tem certeza que deseja remover sua foto de perfil?"
        );


    if (!confirmar) {
        return;
    }



    // =================================================
    // APAGAR FOTO DO LOCALSTORAGE
    // =================================================

    localStorage.removeItem(
        "fotoPerfil"
    );



    // =================================================
    // PEGAR ELEMENTOS
    // =================================================

    const foto =
        document.getElementById(
            "fotoPerfil"
        );


    const avatarPadrao =
        document.getElementById(
            "avatarPadrao"
        );



    // =================================================
    // ESCONDER FOTO
    // =================================================

    if (foto) {

        foto.src = "";

        foto.style.display =
            "none";

    }



    // =================================================
    // MOSTRAR AVATAR PADRÃO
    // =================================================

    if (avatarPadrao) {

        avatarPadrao.style.display =
            "block";

    }



    // =================================================
    // ATUALIZAR BOTÃO
    // =================================================

    atualizarBotaoFoto();



    // =================================================
    // LIMPAR INPUT
    // =================================================

    const input =
        document.getElementById(
            "inputFotoPerfil"
        );


    if (input) {

        input.value = "";

    }



    alert(
        "Foto de perfil removida."
    );

}