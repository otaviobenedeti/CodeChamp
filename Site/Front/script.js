const input = document.getElementById("telefone");

input.addEventListener("input", () => {
  let valor = input.value.replace(/\D/g, "");

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

  input.value = formatado;
});

function toggleSenha() {
    const senha = document.getElementById("senha");

    if (senha.type === "password") {
        senha.type = "text";
    } else {
        senha.type = "password";
    }
}

const input = document.getElementById("countryInput");
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

input.addEventListener("input", () => {

    const code = countries[input.value];

    if(code){

        flag.className = `fi fi-${code}`;

    }

});

const cadastro = document.getElementById("cadastro");

function abrirModal(){

    cadastro.classList.remove("oculto");

}

function fecharModal(){

    cadastro.classList.add("oculto");

}

document.querySelector('#formCad')
.addEventListener('submit', function(e){

    e.preventDefault();

    const codigo = document.getElementById("codigo").value;

    if(codigo.length == 5){

        window.location.href = "x1.html";

    }else{

        alert("Digite um código de 5 dígitos");

    }

});

