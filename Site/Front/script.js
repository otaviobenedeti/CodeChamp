const telefoneInput = document.getElementById("telefone");

if (telefoneInput) {
  telefoneInput.addEventListener("input", () => {
    let valor = telefoneInput.value.replace(/\D/g, "");

    valor = valor.substring(0, 13);

    let formatado = "";

    if (valor.length > 0) {
      formatado += "+" + valor.substring(0, 2);
    }

    if (valor.length > 2) {
      formatado += " (" + valor.substring(2, 4);
    }

    if (valor.length > 4) {
      formatado += ") " + valor.substring(4, 9);
    }

    if (valor.length > 9) {
      formatado += "-" + valor.substring(9, 13);
    }

    telefoneInput.value = formatado;
  });
}

function toggleSenha() {
  const senha = document.getElementById("senha");

  if (senha) {
    senha.type = senha.type === "password" ? "text" : "password";
  }
}

const countryInput = document.getElementById("countryInput");
const flag = document.getElementById("flag");

const countries = {
  "Brasil": "br",
  "Estados Unidos": "us",
  "Japão": "jp",
  "Canadá": "ca",
  "França": "fr",
  "Alemanha": "de",
  "Portugal": "pt",
  "Argentina": "ar",
  "China": "cn",
  "Coreia do Sul": "kr"
};

if (countryInput && flag) {
  countryInput.addEventListener("input", () => {
    const code = countries[countryInput.value];

    if (code) {
      flag.className = `fi fi-${code}`;
    } else {
      flag.className = "";
    }
  });
}

const cadastro = document.getElementById("cadastro");

function abrirModal() {
  if (cadastro) cadastro.classList.remove("oculto");
}

function fecharModal() {
  if (cadastro) cadastro.classList.add("oculto");
}

// ================= ENVIO PARA O BACKEND =================
const formCad = document.getElementById("formCad");

if (formCad) {
  formCad.addEventListener("submit", async function (e) {
    e.preventDefault();

    const codigo = document.getElementById("codigo").value;
    const telefone = document.getElementById("telefone")?.value || "";
    const senha = document.getElementById("senha")?.value || "";
    const pais = document.getElementById("countryInput")?.value || "";

    if (codigo.length !== 5) {
      alert("Digite um código de 5 dígitos");
      return;
    }

    try {
      const resposta = await fetch("http://localhost:3000/cadastro", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          codigo,
          telefone,
          senha,
          pais
        })
      });

      const dados = await resposta.json();

      if (resposta.ok) {
        alert("Cadastro realizado com sucesso!");
        window.location.href = "x1.html";
      } else {
        alert(dados.erro || "Erro ao cadastrar");
      }

    } catch (erro) {
      console.error(erro);
      alert("Não foi possível conectar ao servidor");
    }
  });
}



