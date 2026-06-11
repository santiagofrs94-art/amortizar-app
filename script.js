let saldo = Number(localStorage.getItem("saldo")) || 0;
let totalAmortizado = Number(localStorage.getItem("totalAmortizado")) || 0;
let saldoInicial = Number(localStorage.getItem("saldoInicial")) || 0;

let gastos = JSON.parse(localStorage.getItem("gastos")) || [];

const META_MENSAL = 1500;

atualizarTela();
atualizarListaGastos();

function amortizar() {

    const saldoInformado =
        Number(document.getElementById("saldo").value);

    const valorAmortizacao =
        Number(document.getElementById("amortizacao").value);

    if (!valorAmortizacao) return;

    if (saldo === 0 && saldoInformado > 0) {

        saldo = saldoInformado;
        saldoInicial = saldoInformado;
    }

    saldo -= valorAmortizacao;

    if (saldo < 0) saldo = 0;

    totalAmortizado += valorAmortizacao;

    localStorage.setItem("saldo", saldo);
    localStorage.setItem("saldoInicial", saldoInicial);
    localStorage.setItem("totalAmortizado", totalAmortizado);

    atualizarTela();

    document.getElementById("amortizacao").value = "";
}

function reiniciarFinanciamento() {

    if (!confirm("Deseja realmente apagar todos os dados?")) {
        return;
    }

    localStorage.clear();

    saldo = 0;
    saldoInicial = 0;
    totalAmortizado = 0;
    gastos = [];

    atualizarTela();
    atualizarListaGastos();

    document.getElementById("saldo").value = "";
    document.getElementById("amortizacao").value = "";
}

function registrarGasto() {

    const categoria =
        document.getElementById("categoria").value;

    const valor =
        Number(document.getElementById("valorGasto").value);

    const observacao =
        document.getElementById("observacao").value;

    if (!categoria || !valor) return;

    gastos.push({
        categoria,
        valor,
        observacao,
        data: new Date().toLocaleDateString("pt-BR")
    });

    localStorage.setItem(
        "gastos",
        JSON.stringify(gastos)
    );

    atualizarListaGastos();
    atualizarTela();

    document.getElementById("categoria").value = "";
    document.getElementById("valorGasto").value = "";
    document.getElementById("observacao").value = "";
}

function excluirGasto(indice) {

    gastos.splice(indice, 1);

    localStorage.setItem(
        "gastos",
        JSON.stringify(gastos)
    );

    atualizarListaGastos();
    atualizarTela();
}

function atualizarListaGastos() {

    const lista =
        document.getElementById("listaGastos");

    const titulo =
        document.getElementById(
            "tituloHistorico"
        );

    if (titulo) {

        titulo.innerHTML =
            `Histórico de Gastos (${gastos.length})`;
    }

    if (gastos.length === 0) {

        lista.innerHTML =
            "Nenhum gasto registrado.";

        return;
    }

    lista.innerHTML = "";

    gastos.forEach((gasto, indice) => {

        lista.innerHTML += `
        <div style="
            border:1px solid #ddd;
            padding:10px;
            margin-bottom:10px;
            border-radius:8px;
        ">
            <strong>${gasto.categoria}</strong><br>

            R$ ${gasto.valor.toLocaleString(
                "pt-BR",
                {
                    minimumFractionDigits:2
                }
            )}<br>

            ${gasto.observacao}<br>

            <small>${gasto.data}</small><br><br>

            <button onclick="excluirGasto(${indice})">
                Excluir
            </button>
        </div>
        `;
    });
}

function atualizarTela() {

    document.getElementById(
        "saldoAtual"
    ).innerHTML =
        saldo.toLocaleString(
            "pt-BR",
            {
                style:"currency",
                currency:"BRL"
            }
        );

    document.getElementById(
        "totalAmortizado"
    ).innerHTML =
        totalAmortizado.toLocaleString(
            "pt-BR",
            {
                style:"currency",
                currency:"BRL"
            }
        );

    let percentual = 0;

    if (saldoInicial > 0) {

        percentual =
            (totalAmortizado / saldoInicial) * 100;
    }

    document.getElementById(
        "percentualQuitado"
    ).innerHTML =
        percentual.toFixed(2) + "%";

    document.getElementById(
        "barraQuitacao"
    ).value =
        percentual;

    let totalGastos = gastos.reduce(
        (soma, gasto) =>
            soma + gasto.valor,
        0
    );

    document.getElementById(
        "totalGastos"
    ).innerHTML =
        totalGastos.toLocaleString(
            "pt-BR",
            {
                style:"currency",
                currency:"BRL"
            }
        );

    document.getElementById(
        "economiaLiquida"
    ).innerHTML =
        (totalAmortizado - totalGastos)
        .toLocaleString(
            "pt-BR",
            {
                style:"currency",
                currency:"BRL"
            }
        );

    document.getElementById(
        "metaMensal"
    ).innerHTML =
        META_MENSAL.toLocaleString(
            "pt-BR",
            {
                style:"currency",
                currency:"BRL"
            }
        );

    const restanteMeta =
        META_MENSAL - totalGastos;

    document.getElementById(
        "restanteMeta"
    ).innerHTML =
        restanteMeta.toLocaleString(
            "pt-BR",
            {
                style:"currency",
                currency:"BRL"
            }
        );

    const percentualMeta =
        (totalGastos / META_MENSAL) * 100;

    document.getElementById(
        "percentualMeta"
    ).innerHTML =
        percentualMeta.toFixed(1) + "%";

    document.getElementById(
        "barraMeta"
    ).value =
        Math.min(percentualMeta, 100);
}
