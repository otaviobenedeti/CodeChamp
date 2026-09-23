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
    senha.type =
      senha.type === "password"
        ? "text"
        : "password";
  }
}


const countryInput =
  document.getElementById("countryInput");

const flag =
  document.getElementById("flag");

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

    const code =
      countries[countryInput.value];

    if (code) {
      flag.className = `fi fi-${code}`;
    } else {
      flag.className = "";
    }

  });
}