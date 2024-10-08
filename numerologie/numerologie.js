function nombre(chaîne) {
    let somme = 0
    for (let i=0; i < chaîne.length; i++) {
        somme += chaîne.charCodeAt(i)
    }
    return somme
}

// console.log(nombre("cou"))
// console.log(nombre("coucou"))
// for (let c of "cou") { 
//     console.log(c + " : " + nombre(c))
// }

function somme(nombre) {
    let somme = 0
    chaîne = String(nombre)
    for (let i=0; i < chaîne.length ; i++) {
        somme += parseInt(chaîne.charAt(i))
    }
    return somme
}

// console.log(somme(132))
// console.log(somme(4))
// console.log("4".charCodeAt(0))
// console.log("4".charAt(0))
// console.log(typeof "4".charAt(0))
// console.log(parseInt("4".charAt(0)))
// console.log(typeof parseInt("4".charAt(0)))

function chiffreAssocie(chaîne) {
    valeur = nombre(chaîne)
    while (valeur > 9) {
        valeur = somme(valeur)
    }
    return valeur
}

// console.log(nombre("coucou"))
// console.log(chiffreAssocie("coucou"))

document.querySelector("#form-button").addEventListener("click", (event) => {
    let chaîne = document.querySelector("#form-input").value;
    let chiffre = chiffreAssocie(chaîne);
    document.querySelector("#chiffre").textContent = chiffre;
    event.preventDefault();
})