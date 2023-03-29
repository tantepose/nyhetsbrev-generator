const artikler = [
  "https://www.kode24.no/artikkel/kron-slar-tilbake-mot-app-kritikken-fra-shortcut-han-bommer/78883070",
  "https://www.kode24.no/artikkel/norges-darligste-apper-bruker-samme-teknologi-se-listene/78845369",
  "https://www.kode24.no/artikkel/kron-slar-tilbake-mot-app-kritikken-fra-shortcut-han-bommer/78883070",
  "https://www.kode24.no/artikkel/norges-darligste-apper-bruker-samme-teknologi-se-listene/78845369",
  "https://www.kode24.no/artikkel/kron-slar-tilbake-mot-app-kritikken-fra-shortcut-han-bommer/78883070",
  "https://www.kode24.no/artikkel/norges-darligste-apper-bruker-samme-teknologi-se-listene/78845369",
  "https://www.kode24.no/artikkel/kron-slar-tilbake-mot-app-kritikken-fra-shortcut-han-bommer/78883070",
  "https://www.kode24.no/artikkel/norges-darligste-apper-bruker-samme-teknologi-se-listene/78845369"
]

const annonser = [
"https://www.kode24.no/jobb/vi-vokser-og-trenger-flere-dyktige-java-utviklere-og-arkitekter-bli-med-pa-vart-vinnende-lag/78055202",
"https://www.kode24.no/jobb/penetrasjonstester/78605653",
"https://www.kode24.no/jobb/security-engineer/78605795",
"https://www.kode24.no/jobb/plattformutvikler-data/78606097",
"https://www.kode24.no/jobb/kubernetes-plattformutvikler/78606138",
"https://www.kode24.no/jobb/plattformutvikler-azure/78606218",
"https://www.kode24.no/jobb/vil-du-jobbe-med-moderne-teknologier-i-et-spennende-selskap/78863561",
"https://www.kode24.no/jobb/systemutvikler/78882754",
"https://www.kode24.no/jobb/trivelige-folk-med-lidenskap-for-faget/78876673"
]

// *********************************************************
// *********************************************************
// *********************************************************

const cheerio = require('cheerio') // navigere HTML
const axios = require('axios') // gjøre kallene (bør byttes med fetch)
const fs = require('fs'); // lagre fila

// idiotisk å ha seperate funksjoner for artikler og annonser
skrapArtikler(artikler) 
  .then(artikler => lagArtikkelHTML(artikler))

skrapAnnonser(annonser)
  .then(annonser => lagAnnonseHTML(annonser))

async function skrapArtikler(adresser) {
  const artikler = []
  
  for (const [index, adresse] of adresser.entries()) {
    console.log("🔍📰 skraper artikkel #" + index + "...")

    const respons = await axios.get(adresse)
    const $ = cheerio.load(respons.data)
    
    const tittel = $('h1').first().text() // tittel er første h1
    const ingress = $('.standfirst').text() // ingress har klassen standfirst
    
    artikler.push({ adresse: adresse, tittel: tittel, ingress: ingress })
  }
  
  return artikler
}

async function skrapAnnonser(adresser) {
  const annonser = []
  
  for (const [index, adresse] of adresser.entries()) {
    console.log("🔍💰 skraper annonse #" + index + "...")

    const respons = await axios.get(adresse)
    const $ = cheerio.load(respons.data)
    
    const selskap = $('.firstname').text() // selskapet har klassen firstname
    const tittel = $('h1').first().text() // tittel er første h1
    
    annonser.push({ adresse: adresse, tittel: tittel, selskap: selskap })
  }
  
  return annonser
}

function lagArtikkelHTML (artikler) {
    console.log("✍ 📰 lager HTML...")
    
    let HTML = ""
    for (const artikkel of artikler) {
        HTML +=
        
          `<p><a href=${artikkel.adresse}>${artikkel.tittel}</a></br> \n` + 
          `${artikkel.ingress}</p> \n` +
          `</br>`
    }

    console.log("💾📰 lagrer fil...")
    fs.writeFile('artikler.html', HTML, () => {
        console.log('✨📰 artikler.html klar!');
      });
}

function lagAnnonseHTML (annonser) {
  console.log("✍ 💰 lager HTML...")
  
  let HTML = "<ul> \n"
  for (const annonse of annonser) {
      HTML +=
        `<li>${annonse.selskap}: <a href=${annonse.adresse}>${annonse.tittel}</a></li> \n`
  }
  HTML += "</ul>"

  console.log("💾💰 lagrer fil...")
  fs.writeFile('annonser.html', HTML, () => {
      console.log('✨💰 annonser.html klar!');
    });
}