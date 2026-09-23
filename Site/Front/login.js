const formLogin =
    document.getElementById("formLogin");


if (formLogin) {

    formLogin.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();

            const email =
                document
                    .getElementById("email")
                    .value
                    .trim();

            const senha =
                document
                    .getElementById("senha")
                    .value;

            if (!email || !senha) {
                alert(
                    "Preencha o email e a senha."
                );
                return;
            }

            try {

                const resposta = await fetch(
                    "http://localhost:3000/user/login",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({
                            email: email,
                            password: senha
                        })
                    }
                );

                const dados =
                    await resposta.json();

                if (!resposta.ok) {

                    alert(
                        dados.erro ||
                        "Email ou senha incorretos."
                    );

                    return;
                }

                localStorage.setItem(
                    "usuario",
                    JSON.stringify(dados.user)
                );

                alert(
                    "Login realizado com sucesso!"
                );

                window.location.href =
                    "home.html";

            } catch (erro) {

                console.error(erro);

                alert(
                    "Não foi possível conectar ao servidor."
                );
            }
        }
    );
}