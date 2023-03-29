const cheerio = require('cheerio') // navigere HTML
const axios = require('axios') // gjøre kallene
const fs = require('fs'); // lagre fila

const adresser = [
  "https://www.kode24.no/artikkel/kron-slar-tilbake-mot-app-kritikken-fra-shortcut-han-bommer/78883070",
  "https://www.kode24.no/artikkel/norges-darligste-apper-bruker-samme-teknologi-se-listene/78845369",
  "https://www.kode24.no/artikkel/kron-slar-tilbake-mot-app-kritikken-fra-shortcut-han-bommer/78883070",
  "https://www.kode24.no/artikkel/norges-darligste-apper-bruker-samme-teknologi-se-listene/78845369",
  "https://www.kode24.no/artikkel/kron-slar-tilbake-mot-app-kritikken-fra-shortcut-han-bommer/78883070",
  "https://www.kode24.no/artikkel/norges-darligste-apper-bruker-samme-teknologi-se-listene/78845369",
  "https://www.kode24.no/artikkel/kron-slar-tilbake-mot-app-kritikken-fra-shortcut-han-bommer/78883070",
  "https://www.kode24.no/artikkel/norges-darligste-apper-bruker-samme-teknologi-se-listene/78845369"
]

skrap(adresser) 
  .then(artikler => lagHTML(artikler))

async function skrap(adresser) {
  const artikler = []
  
  for (const [index, adresse] of adresser.entries()) {
    console.log("🔍 skraper adresse #" + index + "...")

    const respons = await axios.get(adresse)
    const $ = cheerio.load(respons.data)
    
    const tittel = $('h1').first().text() // tittel er første h1
    const ingress = $('.standfirst').text() // ingress har klassen standfirst
    
    artikler.push({ adresse: adresse, tittel: tittel, ingress: ingress })
  }
  
  return artikler
}

function lagHTML (artikler) {
    console.log("✍  lager HTML...")
    
    let HTML = ""
    for (const artikkel of artikler) {
        HTML +=
        `<a href=${artikkel.adresse}>${artikkel.tittel}</a> \n` + 
        `<p>${artikkel.ingress}</p> \n` +
        `</br> \n \n`
    }

    lagreHTML(HTML)
}

function lagreHTML (HTML) {
    console.log("💾 lagrer fil...")
    fs.writeFile('index.html', HTML, (error) => {
        if (error) throw error;
        console.log('✨ index.html klar!');
      });
}