const artikler = [
  // artikler her
]

const annonser = [
  // annonser her
]

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