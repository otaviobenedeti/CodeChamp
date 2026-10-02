const formCadastro =
  document.getElementById("formCadastro");


if (formCadastro) {

  formCadastro.addEventListener(
    "submit",
    async (event) => {

      event.preventDefault();

      const nome =
        document
          .getElementById("nome")
          .value
          .trim();

      const username =
        document
          .getElementById("username")
          .value
          .trim();

      const email =
        document
          .getElementById("email")
          .value
          .trim();

      const senha =
        document
          .getElementById("senha")
          .value;

      if (!nome || !username || !email || !senha) {
        alert("Preencha todos os campos obrigatórios.");
        return;
      }

      try {

        const resposta = await fetch(
          "http://localhost:3000/user/cadastrar",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json"
            },

            body: JSON.stringify({
              name: nome,
              username: username,
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
            "Erro ao realizar cadastro."
          );

          return;
        }

        alert(
          "Cadastro realizado com sucesso!"
        );

        window.location.href =
          "login.html";

      } catch (erro) {

        console.error(erro);

        alert(
          "Não foi possível conectar ao servidor."
        );
      }
    }
  );
}