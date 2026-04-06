let probChart = null;
let importanceChart =  null;

const BACKEND_URL = "https://iris-backend-production-bfcd.up.railway.app";

async function predict() {

    const sl = document.getElementById("sepal_length").value;
    const sw = document.getElementById("sepal_width").value;
    const pl = document.getElementById("petal_length").value;
    const pw = document.getElementById("petal_width").value;

    if([sl, sw, pl, pw].some((v) => isNaN(v))) {

        const resEl = document.getElementById("result");
        if (reslEl) resEl.innerHTML = "Please fill all fields with numeric values.";
        return;
    }

    const url = `${BACKEND_URL}/predict?sepal_length=${sl}&sepal_width=${sw}&petal_length=${pl}&petal_width=${pw}`;

    try {

    const response = await fetch(url);
    const data = await response.json();

    const resEl = document.getElementById("result");
    if (resEl){
        resEl.innerHTML = `Prediction: <b>${data.prediction}</b>`;
    }

    const probs = [
        data.probabilities.setosa,
        data.probabilities.versicolor,
        data.probabilities.virginica,
    ];

    renderProbChart(probs);
    updateExplanationPanel(data.feature_importance, {sl, sw, pl, pw});

    } catch (error) {
        const resEl = document.getElementById("result");
        if (resEl) resEl.innerHTML = "Error connecting to API";
        console.error(error);
    }
}

    function renderProbChart(probabilities) {
        const canvas = document.getElementById("probChart");
        if (!canvas) return;

        const ctx = canvas.getContext("2d");

        if (probChart) {
            probChart.destroy()
            probChart = null;
        }

        probChart = new Chart(ctx, {
            type: "bar",
            data: {
                labels: ["Setosa", "Versicolor", "Virginica"],
                datasets: [{
                    label: "Prediction Probabilities",
                    data: probabilities,
                    backgroundColor: [
                        "rgba(244, 114, 182, 0.7)",
                        "rgba(129, 140, 248, 0.7)",
                        "rgba(45, 212, 191, 0.7)"
                    ],
                    borderColor: [
                        "rgba(244, 114, 182, 1)",
                        "rgba(129, 140, 248, 1)",
                        "rgba(45, 212, 191, 1)"
                    ],
                    borderWidth: 1,
                }],
    },
    options: {
        responsive: true,
        animation: {
            duration: 800,
            easing: "easeOutQuart",
        },
        scales: {
            y: { 
                beginAtZero: true,
                max: 1,
                ticks: {
                    callback: (value) => value.toFixed(1),
                },
            },
        },
        plugins: {
            legend: {
                labels: {
                    color: "#e5e7eb",
                },
            },
            tooltip: {
                callbacks: {
                    label: (ctx) => {
                        const v = ctx.parsed.y || 0;
                        return `${(v * 100).toFixed(1)}%`;
                      },
          },
        },
      },
    },
  });
}

function renderImportanceChart (featureImportance) {
    const canvas = document.getElementById("importanceChart");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (importanceChart) importanceChart.destroy();
    
    const labels =  ["Sepal length", "Sepal width", "Petal length", "Petal width"];
    const values = [
        featureImportance.sepal_length,
        featureImportance.sepal_width,
        featureImportance.petal_length,
        featureImportance.petal_width,
    ];
    
    importanceChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels,
            datasets: [
                {
                    label: "Relative importance",
                    data: values,
                    backgroundColor: "rgba(94, 234, 212, 0.7)",
                    borderColor: "rgba(94, 234, 212, 1)",
                    borderWidth: 1,
                },
            ],
        },
        options: {
            indexAxis: "y",
            responsive: true,
            animation: {
                duration: 900,
                easing: "easeOutQuart",
            },
            scales: {
                x: {
                    beginAtZero: true,
                    max: 1,
                    ticks: {
                        callback: (value) => (value * 100).toFixed(0) + "%",
                    },
                },
            },
            plugins: {
                legend: {
                    display: false,
                },
                tooltip: {
                    callbacks: {
                        label: (ctx) => {
                            const v = ctx.parsed.x || 0;
                            return `${(v * 100).toFixed(1)}% contribution`;
                        },
                    },
                },
            },
        },
    });
}

function updateExplanationPanel(featureImportance, inputs) {
    if (!featureImportance) return;

    renderImportanceChart(featureImportance);
    
    const expDiv = document.getElementById("explanation");
    if (!expDiv) return;

    const entries = [
        ["Sepal length", featureImportance.sepal_length],
        ["Sepal width", featureImportance.sepal_width],
        ["petal length", featureImportance.petal_length],
        ["petal width", featureImportance.petal_width],
    ];

    entries.sort((a, b) => b[1] - a[1]);
    const top = entries[0];

    const percent = (v) => (v * 100).toFixed(1) + "%";

    expDiv.innerHTML = ` <p class="mb-2 text-sm"> 
    The model considered <b>${top[0]}<b> the most influential feature for this prediction.
    </p>
    <ul class="text-xs space-y-1">
        ${entries
            .map(
                ([name, value]) => `
        <li>• <b>${name}</b>: ${percent(value)} of the total influence</li>
      `
            )
            .join("")}
            </ul>
    `;
}


function randomInRange(min, max, decimals = 1) {
    const n = Math.random() * (max - min) + min;
    return parseFloat(n.toFixed(decimals));
}

function randomFill() {
    const sl = randomInRange(4.3, 7.9);
    const sw = randomInRange(2.0, 4.4);
    const pl = randomInRange(1.0, 6.9);
    const pw = randomInRange(0.1, 2.5);
    
    const slEl = document.getElementById("sepal_length");
    const swEl = document.getElementById("sepal_width");
    const plEl = document.getElementById("petal_length");
    const pwEl = document.getElementById("petal_width");

    if (slEl) slEl.value = sl;
    if (swEl) swEl.value = sw;
    if (plEl) plEl.value = pl;
    if (pwEl) pwEl.value = pw;
}

window.predict = predict;
window.randomFill = randomFill;



