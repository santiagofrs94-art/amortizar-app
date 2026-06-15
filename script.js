let saldo = Number(localStorage.getItem("saldo")) || 0;
let totalAmortizado = Number(localStorage.getItem("totalAmortizado")) || 0;
let saldoInicial = Number(localStorage.getItem("saldoInicial")) || 0;

let gastos = JSON.parse(localStorage.getItem("gastos")) || [];
let amortizacoes =
JSON.parse(
localStorage.getItem("amortizacoes")
) || [];
let META_MENSAL =
Number(
    localStorage.getItem("metaMensal")
) || 1500;

// ===== ABAS =====

function mostrarAba(aba) {

    document.getElementById(
        "abaResumo"
    ).style.display = "none";

    document.getElementById(
        "abaGastos"
    ).style.display = "none";

    document.getElementById(
        "abaHistorico"
    ).style.display = "none";

    if (aba === "resumo") {

        document.getElementById(
            "abaResumo"
        ).style.display = "block";
    }

    if (aba === "gastos") {

        document.getElementById(
            "abaGastos"
        ).style.display = "block";
    }

    if (aba === "historico") {

        document.getElementById(
            "abaHistorico"
        ).style.display = "block";
    }
}

mostrarAba("resumo");
atualizarTela();
atualizarListaGastos();
atualizarGrafico();
atualizarHistoricoAmortizacoes();
// ===== AMORTIZAÇÃO =====

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
amortizacoes.push({
    valor: valorAmortizacao,
    saldoRestante: saldo,
    data: new Date().toLocaleDateString("pt-BR")
});
    localStorage.setItem("saldo", saldo);
localStorage.setItem("saldoInicial", saldoInicial);
localStorage.setItem("totalAmortizado", totalAmortizado);

localStorage.setItem(
    "amortizacoes",
    JSON.stringify(amortizacoes)
);
    atualizarTela();
   atualizarHistoricoAmortizacoes(); 
document.getElementById("saldo").value = saldo;
    document.getElementById("amortizacao").value = "";
}

// ===== RESET =====

function reiniciarFinanciamento() {

    if (!confirm("Deseja apagar todos os dados?")) {
        return;
    }

    localStorage.clear();
META_MENSAL = 1500;
    saldo = 0;
    saldoInicial = 0;
    totalAmortizado = 0;
    gastos = [];
amortizacoes = [];
    localStorage.removeItem("amortizacoes");
    atualizarTela();
atualizarListaGastos()
atualizarGrafico();
    atualizarHistoricoAmortizacoes();
}

// ===== GASTOS =====

function registrarGasto() {

    const categoria =
        document.getElementById("categoria").value;

    const valor =
        Number(document.getElementById("valorGasto").value);
const observacao =
    document.getElementById("observacao").value;

const parcelas =
    Number(
        document.getElementById("parcelas").value
    ) || 1;

    if (!categoria || !valor) return;
gastos.push({
    categoria,
    valor,
    observacao,
    parcelas,
    data: new Date().toLocaleDateString("pt-BR")
});
    localStorage.setItem(
        "gastos",
        JSON.stringify(gastos)
    );

atualizarTela();
atualizarListaGastos();
atualizarParcelamentos();
atualizarGrafico();

const mensagem =
    document.getElementById(
        "mensagemSucesso"
    );

mensagem.style.display =
    "block";

setTimeout(() => {

    mensagem.style.display =
        "none";

}, 2000);

document.getElementById(
    "categoria"
).selectedIndex = 0;

document.getElementById(
    "valorGasto"
).value = "";

document.getElementById(
    "observacao"
).value = "";
}
function excluirGasto(indice) {

    gastos.splice(indice, 1);

    localStorage.setItem(
        "gastos",
        JSON.stringify(gastos)
    );
atualizarTela();
atualizarListaGastos();
atualizarGrafico();
    
}

// ===== HISTÓRICO =====

function atualizarListaGastos() {

    const lista =
        document.getElementById("listaGastos");

    const titulo =
        document.getElementById("tituloHistorico");
const ranking =
    document.getElementById(
        "rankingGastos"
    );
    titulo.innerHTML =
        `Histórico de Gastos (${gastos.length})`;
const categorias = {};

gastos.forEach(gasto => {

    if (!categorias[gasto.categoria]) {

        categorias[gasto.categoria] = 0;
    }

    categorias[gasto.categoria] +=
        gasto.valor;
});

const rankingOrdenado =
    Object.entries(categorias)
    .sort(
        (a, b) =>
            b[1] - a[1]
    );

ranking.innerHTML =
    "<h3>🏆 Ranking de Gastos</h3>";

rankingOrdenado.forEach(
    ([categoria, valor]) => {

        ranking.innerHTML += `
            <div style="
                display:flex;
                justify-content:space-between;
                margin-bottom:8px;
                padding:8px;
                background:#f8fafc;
                border-radius:8px;
            ">
                <strong>${categoria}</strong>

                <span>
                    ${valor.toLocaleString(
                        "pt-BR",
                        {
                            style:"currency",
                            currency:"BRL"
                        }
                    )}
                </span>
            </div>
        `;
    }
);
    if (gastos.length === 0) {

        lista.innerHTML =
            "Nenhum gasto registrado.";

        return;
    }

    lista.innerHTML = "";

gastos
.map((gasto, indice) => ({
    gasto,
    indice
}))
.reverse()
.forEach(({ gasto, indice }) => {
        lista.innerHTML += `
        <div class="card">

            <strong>${gasto.categoria}</strong><br>

            R$ ${gasto.valor.toFixed(2)}<br>

    ${gasto.observacao}<br>

${gasto.parcelas > 1
? `💳 ${gasto.parcelas}x de R$ ${(gasto.valor / gasto.parcelas).toFixed(2)}`
: ""
}
<br>

<small>${gasto.data}</small>
            <br><br>

            <button onclick="editarGasto(${indice})">
    ✏️ Editar
</button>

<button onclick="excluirGasto(${indice})">
    🗑️ Excluir
</button>
        </div>
        `;
    });
}

// ===== RESUMO =====

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

    let percentualQuitado = 0;

    if (saldoInicial > 0) {

        percentualQuitado =
            (totalAmortizado / saldoInicial) * 100;
    }

    document.getElementById(
        "percentualQuitado"
    ).innerHTML =
        percentualQuitado.toFixed(2) + "%";
let totalGastos = 0;

gastos.forEach(gasto => {

    if (
        gasto.parcelas &&
        gasto.parcelas > 1
    ) {

        totalGastos +=
            gasto.valor /
            gasto.parcelas;

    } else {

        totalGastos += gasto.valor;

    }

});
let compromissoMensal = 0;

gastos.forEach(gasto => {

    if (
        gasto.parcelas &&
        gasto.parcelas > 1
    ) {

        compromissoMensal +=
            gasto.valor /
            gasto.parcelas;

    }

});    
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
    "compromissoMensal"
).innerHTML =
    compromissoMensal
    .toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
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
    let grafico = null;

function atualizarGrafico() {

    const canvas =
        document.getElementById(
            "graficoGastos"
        );

    if (!canvas) return;

    let acumulado = 0;

    const labels = [];
    const valores = [];

    gastos.forEach((gasto) => {

        acumulado += gasto.valor;

        labels.push(
            gasto.data
        );

        valores.push(
            acumulado
        );
    });

    if (grafico) {

        grafico.destroy();
    }

    grafico = new Chart(
        canvas,
        {
            type: "line",

            data: {

                labels,

                datasets: [
                    {
                        label:
                        "Gastos Acumulados",

                        data: valores,

                        borderWidth: 3,

                        tension: 0.35,

                        fill: true
                    }
                ]
            },

            options: {
                responsive: true
            }
        }
    );
}

window.onload = () => {
atualizarTela();
atualizarListaGastos();
atualizarGrafico();
atualizarParcelamentos();    
};

function editarGasto(indice) {

    const novoValor = prompt(
        "Novo valor:",
        gastos[indice].valor
    );

    if (novoValor === null) return;

    const novaObservacao = prompt(
        "Nova observação:",
        gastos[indice].observacao
    );

    if (novaObservacao === null) return;

    const novaData = prompt(
        "Nova data (dd/mm/aaaa):",
        gastos[indice].data
    );

    if (novaData === null) return;

    gastos[indice].valor =
        Number(novoValor);

    gastos[indice].observacao =
        novaObservacao;

    gastos[indice].data =
        novaData;

    localStorage.setItem(
        "gastos",
        JSON.stringify(gastos)
    );

    atualizarTela();
    atualizarListaGastos();
    atualizarGrafico();
}
function atualizarHistoricoAmortizacoes() {

    const historico =
        document.getElementById("historicoAmortizacoes");

    if (!historico) return;

    if (amortizacoes.length === 0) {

        historico.innerHTML =
            "Nenhuma amortização registrada.";

        return;
    }

    historico.innerHTML = "";

    amortizacoes
        .slice()
        .reverse()
        .forEach(item => {

            historico.innerHTML += `
<div style="margin-bottom:10px;padding:8px;border:1px solid #ddd;border-radius:8px;">
    <strong>Amortização:</strong>
    R$ ${item.valor.toFixed(2)}
    <br>

    <strong>Saldo restante:</strong>
    R$ ${item.saldoRestante.toFixed(2)}
    <br>

    <small>${item.data}</small>

    <br><br>

    <button onclick="editarAmortizacao(${amortizacoes.indexOf(item)})">
        ✏️ Editar
    </button>

    <button onclick="excluirAmortizacao(${amortizacoes.indexOf(item)})">
        🗑️ Excluir
    </button>
</div>
`;
        });}

}

function salvarMeta() {

    const novaMeta =
        Number(
            document.getElementById(
                "novaMeta"
            ).value
        );

    if (!novaMeta) return;

    META_MENSAL = novaMeta;

    localStorage.setItem(
        "metaMensal",
        META_MENSAL
    );

    atualizarTela();

    document.getElementById(
        "novaMeta"
    ).value = "";

    alert(
        "Meta atualizada para R$ " +
        META_MENSAL
    );
}
           
function atualizarParcelamentos() {

    const lista =
        document.getElementById(
            "listaParcelamentos"
        );

    if (!lista) return;

    const parcelados =
        gastos.filter(
            gasto =>
                gasto.parcelas &&
                gasto.parcelas > 1
        );

    if (parcelados.length === 0) {

        lista.innerHTML =
            "Nenhum parcelamento ativo.";

        return;
    }

    lista.innerHTML = "";

    parcelados.forEach(gasto => {

        lista.innerHTML += `
        <div style="
            padding:10px;
            margin-bottom:10px;
            border:1px solid #ddd;
            border-radius:10px;
        ">

            <strong>
                ${gasto.observacao}
            </strong>

            <br>

            💳 ${gasto.parcelas}x de
            R$ ${(gasto.valor / gasto.parcelas).toFixed(2)}

        </div>
        `;
    });
}
