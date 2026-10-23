const formCadastro = document.getElementById("formCadastro");

if (formCadastro) {
    formCadastro.addEventListener("submit", async (event) => {
        event.preventDefault();

        const nome = document.getElementById("nome").value.trim();
        const username = document.getElementById("username").value.trim();
        const email = document.getElementById("email").value.trim();
        const avatarUrl = document.getElementById("avatarUrl").value.trim();
        const senha = document.getElementById("senha").value;

        if (!nome || !username || !email || !senha) {
            alert("Preencha todos os campos obrigatórios.");
            return;
        }

        console.log("Iniciando cadastro...");
        console.log("Nome:", nome);
        console.log("Username:", username);
        console.log("Email:", email);

        try {
            const resposta = await fetch("http://localhost:3000/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: nome,
                    username: username,
                    email: email,
                    avatarUrl: avatarUrl || null,
                    password: senha
                })
            });

            const texto = await resposta.text();

            console.log("Status HTTP:", resposta.status);
            console.log("Resposta do servidor:", texto);

            let dados = {};

            if (texto.trim()) {
                try {
                    dados = JSON.parse(texto);
                } catch (erro) {
                    console.error("Erro ao interpretar JSON:", erro);
                    alert("O servidor retornou uma resposta inválida.");
                    return;
                }
            }

            if (!resposta.ok) {
                alert(
                    dados.erro ||
                    dados.message ||
                    "Erro ao realizar cadastro."
                );
                return;
            }

            alert("Cadastro realizado com sucesso!");

            window.location.href = "login.html";

        } catch (erro) {
            console.error("Erro na requisição de cadastro:", erro);

            alert(
                "Não foi possível conectar ao servidor. Verifique se o backend está funcionando."
            );
        }
    });
}
