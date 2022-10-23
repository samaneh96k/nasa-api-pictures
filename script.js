const resultsNav = document.getElementById('resultsNav');
const favoritesNav = document.getElementById('favoritesNav');
const imagesContainer = document.querySelector('.images-container');
const saveConfirmed = document.querySelector('.save-confirmed');
const loader = document.querySelector('.loader');

//NASA Api
const count = 10;
const apiKey='spo1w9LgGV77OkXudVnN1no82xeBSYwMELhfFIEF'
const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`;
let resultArrey = [];
let favorites = {};
//Show
function showContent(page) {
    if (page === 'results') {
        resultsNav.classList.remove('hidden');
        favoritesNav.classList.add('hidden');
    } else {
        favoritesNav.classList.remove('hidden');
        resultsNav.classList.add('hidden');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    loader.classList.add('hidden');
}
function createDom(page) {
    let currentArray = page === 'results' ? resultArrey : Object.values(favorites);
    console.log("currentArray",currentArray)
    currentArray.forEach((result) => {
  
    // Card Container
    const card = document.createElement('div');
    card.classList.add('card');
    // Link
    const link = document.createElement('a');
    link.href = result.hdurl;
    link.title = 'View Full Image';
    link.target = '_blank';
    // Image
    const image = document.createElement('img');
    image.src = result.url;
    image.alt = 'NASA Picture of the Day';
    image.loading = 'lazy';
    image.classList.add('card-img-top');
    // Card Body
    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');
    // Card Title
    const cardTitle = document.createElement('h5');
    cardTitle.classList.add('card-title');
    cardTitle.textContent = result.title;
    // Save Text
    const saveText = document.createElement('p');
    saveText.classList.add('clickable');
    if (page === 'results') {
      saveText.textContent = 'Add To Favorites';
      saveText.setAttribute('onclick', `saveFavorites('${result.url}')`);
    } else {
      saveText.textContent = 'Remove Favorite';
      saveText.setAttribute('onclick', `removeFavorites('${result.url}')`);
    }
    // Card Text
    const cardText = document.createElement('p');
    cardText.textContent = result.explanation;
    // Footer Container
    const footer = document.createElement('small');
    footer.classList.add('text-muted');
    // Date
    const date = document.createElement('strong');
    date.textContent = result.date;
    // Copyright
    const copyrightResult = result.copyright === undefined ? '' : result.copyright;
    const copyright = document.createElement('span');
    copyright.textContent = ` ${copyrightResult}`;
    // Append
    footer.append(date, copyright);
    cardBody.append(cardTitle, saveText, cardText, footer);
    link.appendChild(image);
    card.append(link, cardBody);
      imagesContainer.appendChild(card);

 
        
    })
}
function updateDOM(page) {
    //Get Favorite from LocalStorage
    if (localStorage.getItem("nasaFavorites")) {
        favorites = JSON.parse(localStorage.getItem('nasaFavorites'));
    }
    imagesContainer.textContent = "";
    createDom(page);
    showContent(page);
}
//Get 10 Image from nASA APi
async function getNasaImage() {
    //show Loader
    loader.classList.remove('hidden');
    try {
        const res = await fetch(apiUrl);
        resultArrey = await res.json();
        console.log(resultArrey);
        updateDOM('results');
    } catch (error) {
        console.log(error)
    }
 
}
//add favorites image
function saveFavorites(imageUrl) {
//Loop for select Favorite
    resultArrey.forEach((item) => {
        if (item.url.includes(imageUrl) && !favorites[imageUrl]) {
            favorites[imageUrl] = item;
           
            //Show save Confirmation for 2 Seconds
            saveConfirmed.classList.remove("hidden") ;
            setTimeout(() => {
                saveConfirmed.classList.add("hidden") ;
            }, 2000);
            //set favorites in local storage
            localStorage.setItem('nasaFavorites',JSON.stringify(favorites))
        }
    })
    console.log("saveFavorites")
}
//remove favorite image from Favorites
function removeFavorites(imageUrl) {
    if (favorites[imageUrl]) {
        delete favorites[imageUrl];
        //set favorites in local storage
        localStorage.setItem('nasaFavorites',JSON.stringify(favorites))
        updateDOM('favorites')
    }
}
//On Load
getNasaImage();