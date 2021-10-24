const equationInput = document.querySelector("#equation-input");
const equationRender = document.querySelector("#equation");
const inputForm = document.querySelector("#input-form");
const graphContainer = document.querySelector(".plot-graph");
const plotRender = document.querySelector("#plot");
const number = document.querySelector("#number");
const nextButton = document.querySelector("#next");
const guess = document.querySelector("#initial-guess");
const numberX = document.querySelector("#number-x");
var fn
var dfn
var nextX
var num

equationInput.addEventListener('input', updateEquation);
inputForm.addEventListener("submit", onSubmit);
nextButton.addEventListener("click", next);

function updateEquation() {
    equationInput.value = equationInput.value.replace("root", "sqrt")
    equationRender.innerText = "`"+equationInput.value+"=0`";
    MathJax.typeset()
    try {
        console.log(nerdamer(equationInput.value).toString());
    } catch (err) {
        equationRender.innerText = '수식 오류';
        console.log("에러 발생");
        //console.log(err);
    }
}

function onSubmit(event) {
    event.preventDefault();
    num = 1
    number.innerText = '#'+String(num)
    graphContainer.classList.remove("hidden");
    number.classList.remove("hidden");
    fn = nerdamer(equationInput.value).toString()
    dfn = nerdamer('('+nerdamer(nerdamer.diff(equationInput.value, 'x').toString(), {x: guess.value}).toString()+')*(x-'+guess.value+')+('+nerdamer(equationInput.value, {x: guess.value}).toString()+')').toString()
    nextX = Number(guess.value) - Number(nerdamer('('+nerdamer(equationInput.value).toString()+')/('+nerdamer.diff(equationInput.value, 'x').toString()+')', {x: guess.value}).evaluate().text())
    numberX.innerText = 'x='+String(nextX)+'\n반올림: '+String(Math.round(nextX * 1000000) / 1000000)
    functionPlot({
        target: "#plot",
        width: 790,
        height: 370,
        data: [
            { fn: fn.replace(/e/gi, 'exp(1)').replace(/pi/gi, 'PI') },
            { fn: dfn.replace(/e/gi, 'exp(1)').replace(/pi/gi, 'PI') },
            {
                points: [
                    [nextX, Number(nerdamer(fn, {x: nextX}).evaluate().text())]
                ],
                fnType: 'points',
                graphType: 'scatter'
            }
        ],
        annotations: [{
            x: nextX
        }]
    })
}

function next() {
    num += 1
    number.innerText = '#'+String(num)
    dfn = nerdamer('('+nerdamer(nerdamer.diff(fn, 'x').toString(), {x: nextX}).toString()+')*(x-'+nextX+')+('+nerdamer(fn, {x: nextX}).toString()+')').toString()
    nextX = Number(nextX) - Number(nerdamer('('+nerdamer(fn).toString()+')/('+nerdamer.diff(fn, 'x').toString()+')', {x: nextX}).evaluate().text())
    numberX.innerText = 'x='+String(nextX)+'\n반올림: '+String(Math.round(nextX * 1000000) / 1000000)
    functionPlot({
        target: "#plot",
        width: 790,
        height: 370,
        data: [
            { fn: fn.replace(/e/gi, 'exp(1)').replace(/pi/gi, 'PI') },
            { fn: dfn.replace(/e/gi, 'exp(1)').replace(/pi/gi, 'PI') },
            {
                points: [
                    [nextX, Number(nerdamer(fn, {x: nextX}).evaluate().text())]
                ],
                fnType: 'points',
                graphType: 'scatter'
            }
        ],
        annotations: [{
            x: nextX
        }]
    })
    console.log(Math.round(nextX * 1000000) / 1000000)
}

function optimize() {
    equationInput.value = nerdamer(equationInput.value).toString();
    equationRender.innerText = "`"+equationInput.value+"=0`";
    MathJax.typeset();
}