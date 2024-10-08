document.querySelector("#play-button").addEventListener("click", (event) => {
    document.getElementById("div1").style.display = 'none';
    document.getElementById("div2").style.display = 'inline';
})

document.querySelector("#done-button").addEventListener("click", (event) => {
    document.getElementById("div1").style.display = 'inline';
    document.getElementById("div2").style.display = 'none';
})