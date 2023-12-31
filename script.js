function generateRandomVerse() {
    fetch('verses.json')
    .then(response => response.json())
    .then(data => {
        
        // Chargement du fichier JSON
        versesData = data;

        // Récupérer un verset aléatoirement
        const randomIndex = Math.floor(Math.random() * versesData.verses.length);
        const randomVerse = versesData.verses[randomIndex];

        // Afficher la référence dans une balise h1
        const referenceElement = document.getElementById('reference');
        referenceElement.innerText = randomVerse.reference;

        // Afficher le texte du verset dans une balise p
        const verseElement = document.getElementById('text');
        verseElement.innerText = randomVerse.text;

        // Afficher le verset généré
        document.getElementById('generatedVerse').innerText = randomVerse;
    })
    .catch(error => console.error('Erreur lors du chargement du fichier JSON :', error));
}

// Appel initial pour charger les versets
generateRandomVerse();

// Ajoutez des fonctions pour gérer les pages du modal
let currentPageIndex = 0;

function openModal() {
    // Réinitialisez l'indice de page lorsque le modal est ouvert
    currentPageIndex = 0;
    const pages = document.querySelectorAll('.modal-page');
    pages.forEach((page, index) => {
        if (index === currentPageIndex) {
            page.classList.add('active');
        } else {
            page.classList.remove('active');
        }

    });
    document.getElementById('modal').style.display = 'block';
}

function openModal() {
    document.getElementById('modal').style.display = 'block';
}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
}

function showNextPage() {
    const pages = document.querySelectorAll('.modal-page');
    if (currentPageIndex < pages.length - 1) {
        pages[currentPageIndex].classList.remove('active');
        currentPageIndex++;
        pages[currentPageIndex].classList.add('active');
    }
}

function showPreviousPage() {
    const pages = document.querySelectorAll('.modal-page');
    if (currentPageIndex > 0) {
        pages[currentPageIndex].classList.remove('active');
        currentPageIndex--;
        pages[currentPageIndex].classList.add('active');
    }
}

function startLoading() {
    showNextPage();
    generateRandomVerse();

    const loadingText = document.getElementById('loadingText');
    const reference = document.getElementById('reference');
    const text = document.getElementById('text');
    const introVerse = document.getElementById('introVerse');
    loadingText.innerText = 'Chargement...';

    startLoadingAnimation();

    text.classList.add('hidden');
    reference.classList.add('hidden');
    downloadButton.classList.add('hidden');

    setTimeout(() => {
        stopLoadingAnimation();

        //Masquez le texte de chargement
        loadingText.classList.add('hidden');
        text.classList.remove('hidden');
        reference.classList.remove('hidden');
        downloadButton.classList.remove('hidden');
        introVerse.classList.remove('hidden');
    }, 3000);
}

// Ajoutez une fonction pour démarrer l'animation de chargement
function startLoadingAnimation() {
    const loadingText = document.getElementById('loadingText');
    loadingText.style.animation = 'loadingAnimation 1.5s infinite';
}

// Ajoutez une fonction pour arrêter l'animation de chargement
function stopLoadingAnimation() {
    const loadingText = document.getElementById('loadingText');
    loadingText.style.animation = 'none';
}

function downloadImage(){
    // Récupérer la reference généré
    const reference = document.getElementById('reference').innerText;

    //Récupérer le texte
    const text = document.getElementById('text').innerText;

    // Récupérer le canvas et son contexte
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    // Récupérer l'image de fond
    const backgroundImage = document.getElementById('backgroundImage');

    // Définir la taille du canvas sur celle de l'image de fond
    canvas.width = backgroundImage.width;
    canvas.height = backgroundImage.height;

    // Dessiner l'image de fond sur le canvas
    ctx.drawImage(backgroundImage, 0, 0);

    // Dessiner le texte sur le canvas
    ctx.font = 'bold 45px Roboto';
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    //Retour à la ligne
    const texte = text;
    const maxWidth = 900;
    const lineHeight = 50;

    let words = texte.split(' ');
    let line = '';
    let y = (canvas.height / 2) + 75;

    for (let i = 0; i < words.length; i++) {
        let testLine = line + words[i] + ' ';
        let testWidth = ctx.measureText(testLine).width;
        if (testWidth > maxWidth && i > 0) {
            ctx.fillText(line, canvas.width / 2, y);
            line = words[i] + ' ';
            y += lineHeight;
        } else {
            line = testLine;
        }
    }
    ctx.fillText(line, canvas.width / 2, y);

    // Dessiner la reference sur le canvas
    ctx.font = 'bold 80px Roboto';
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(reference, canvas.width / 2, 490);

    // Récupérer l'URL de données du canvas
    const imageDataURL = canvas.toDataURL('image/png');

    // Créer un lien de téléchargement
    const downloadLink = document.createElement('a');
    downloadLink.href = imageDataURL;
    downloadLink.download = 'Mon-Verset-Annuel.png';

    // Ajouter le lien au document et déclencher le téléchargement
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

}