const BACKEND_URL = "http://127.0.0.1:8000";

function randomGenerate() {

    const sl = randomInRange(4.3 , 7.9);
    const sw = randomInRange(2.0 , 4.4);
    const pl = randomInRange(1.0 , 6.9);
    const pw = randomInRange(0.1 , 2.5);

    document.getElementById("sl").value = sl;
    document.getElementById("sw").value = sw;
    document.getElementById("pl").value = pl;
    document.getElementById("pw").value = pw;
}

function randomInRange(min, max, decimals = 1) {
    const n = Math.random() * (max - min) + min;
    return parseFloat(n.toFixed(decimals));
}

let testchart = null;


async function predictTest() {
    const sl = document.getElementById("sl").value;
    const sw = document.getElementById("sw").value;
    const pl = document.getElementById("pl").value;
    const pw = document.getElementById("pw").value;

    if (!sl || !sw || !pl || !pw) {
        console.error("Input elements not found");
        return;
    }

    const url = `${BACKEND_URL}/predict?sepal_length=${sl}&sepal_width=${sw}&petal_length=${pl}&petal_width=${pw}`;

    try{
        const response = await fetch(url);
        const data = await response.json();

        document.getElementById("test-result").innerHTML =
        `Prediction: <span class = "text-purple-300">${data.prediction}</span>`;

        const probs = [
            data.probabilities.setosa,
            data.probabilities.versicolor,
            data.probabilities.virginica
        ];

        renderTestChart(probs);

    } catch(error) {
        document.getElementById("test-result").innerHTML = 
        "Error connecting to API";
        console.error(error);
    }
}

function renderTestChart(probabilities) {

    const canvas = document.getElementById("testChart");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    if(testchart) {
        testchart.destroy();
    }

    testchart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: ["Setosa", "Versicolor", "Virginica"],
            datasets: [{
                label: "Prediction probabilities",
                data: probabilities,
                backgroundColor: [
                    "rgba(244,114,182,0.7)",
                    "rgba(129,140,248,0.7)",
                    "rgba(45,212,191,0.7)"
                ]
            }]
        },
        options: {
            animation: {
                duration: 800
            },
            scales: {
                y: {beginAtZero: true, max: 1}
            }
        }
    });
}

function drawChart(values) {
    const ctx = document.getElementById("testChart").getContext("2d");

    if(chart) chart.destroy();

    chart = new chart(ctx, {
        type: "bar",
        data: {
            labels: ["Setosa", "Versicolor", "Virginica"],
            datasets: [
                {
                    label: "Probability",
                    data: values,
                    backgroundColor: [
                        "rgba(255, 99, 200, 0.7)",
                        "rgba(120,120, 255, 0.7)",
                        "rgba(60, 220, 200, 0.7)"
                    ]
                }
            ]
        },
        options: {
            responsive: true,
            animation: {
                duration: 900,
                easing: "easeOutQuart"
            },
            scales: {
                y: {beginAtZero: true, max: 1}
            }
        }
    });
}