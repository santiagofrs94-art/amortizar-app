
let saldo = Number(localStorage.getItem("saldo")) || 0;
let totalAmortizado = Number(localStorage.getItem("totalAmortizado")) || 0;

atualizarTela();

function amortizar() {

    const saldoInformado =
        Number(document.getElementById("saldo").value);

    const valorAmortizacao =
        Number(document.getElementById("amortizacao").value);

    if (saldo === 0 && saldoInformado > 0) {
        saldo = saldoInformado;
    }

    saldo -= valorAmortizacao;

    totalAmortizado += valorAmortizacao;

    localStorage.setItem("saldo", saldo);
    localStorage.setItem("totalAmortizado", totalAmortizado);

    atualizarTela();

    document.getElementById("amortizacao").value = "";
}

function atualizarTela() {

    document.getElementById("saldoAtual").innerHTML =
        saldo.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });
const saldoInicial = 150295;

const percentual =
((totalAmortizado / saldoInicial) * 100).toFixed(2);

document.getElementById("percentualQuitado").innerHTML =
percentual + "%";

document.getElementById("barraQuitacao").value =
percentual;
    document.getElementById("totalAmortizado").innerHTML =
        totalAmortizado.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });
}
function reiniciarFinanciamento() {

    localStorage.removeItem("saldo");
    localStorage.removeItem("totalAmortizado");

    saldo = 0;
    totalAmortizado = 0;

    atualizarTela();

    document.getElementById("saldo").value = "";
    document.getElementById("amortizacao").value = "";
}
