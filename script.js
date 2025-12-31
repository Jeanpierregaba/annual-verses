// Variable globale pour stocker les données des versets
let versesData = null;

function generateRandomVerse() {
    fetch('verses.json')
    .then(response => response.json())
    .then(data => {
        
        // Chargement du fichier JSON
        versesData = data;

        // Vérifier que les données sont valides
        if (!versesData || !versesData.verses || versesData.verses.length === 0) {
            console.error('Aucun verset disponible dans le fichier JSON');
            return;
        }

        // Récupérer un verset aléatoirement
        const randomIndex = Math.floor(Math.random() * versesData.verses.length);
        const randomVerse = versesData.verses[randomIndex];

        // Vérifier que le verset est valide
        if (!randomVerse || !randomVerse.reference || !randomVerse.text) {
            console.error('Verset invalide récupéré');
            return;
        }

        // Afficher la référence dans une balise h1
        const referenceElement = document.getElementById('reference');
        if (referenceElement) {
            referenceElement.innerText = randomVerse.reference;
        }

        // Afficher le texte du verset dans une balise p
        const verseElement = document.getElementById('text');
        if (verseElement) {
            verseElement.innerText = randomVerse.text;
        }
    })
    .catch(error => console.error('Erreur lors du chargement du fichier JSON :', error));
}

// Ne pas charger les versets au démarrage - ils seront chargés quand l'utilisateur clique sur "Découvrir"
// generateRandomVerse();

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
    
    const loadingContainer = document.getElementById('loadingContainer');
    const loadingText = document.getElementById('loadingText');
    const reference = document.getElementById('reference');
    const text = document.getElementById('text');
    const introVerse = document.getElementById('introVerse');
    
    // Afficher le container de chargement
    if (loadingContainer) {
        loadingContainer.classList.remove('hidden');
    }
    if (loadingText) {
        loadingText.innerText = 'Chargement...';
    }

    // Masquer les éléments du résultat
    text.classList.add('hidden');
    reference.classList.add('hidden');
    introVerse.classList.add('hidden');
    const downloadButton = document.getElementById('downloadButton');
    if (downloadButton) {
        downloadButton.classList.add('hidden');
    }

    // Générer le verset
    generateRandomVerse();

    // Messages de chargement progressifs
    const loadingMessages = [
        'Chargement...',
        'Préparation de votre verset...',
        'Presque terminé...'
    ];
    
    let messageIndex = 0;
    const messageInterval = setInterval(() => {
        if (messageIndex < loadingMessages.length - 1) {
            messageIndex++;
            if (loadingText) {
                loadingText.innerText = loadingMessages[messageIndex];
            }
        }
    }, 1000);

    setTimeout(() => {
        clearInterval(messageInterval);
        
        // Masquer le container de chargement avec fade out et scale
        if (loadingContainer) {
            loadingContainer.style.animation = 'fadeOutScale 0.5s ease-out forwards';
            setTimeout(() => {
                loadingContainer.classList.add('hidden');
                loadingContainer.style.animation = '';
            }, 500);
        }

        // Afficher les résultats avec animations séquentielles
        setTimeout(() => {
            introVerse.classList.remove('hidden');
        }, 200);
        
        setTimeout(() => {
            reference.classList.remove('hidden');
        }, 400);
        
        setTimeout(() => {
            text.classList.remove('hidden');
        }, 600);
        
        setTimeout(() => {
            if (downloadButton) {
                downloadButton.classList.remove('hidden');
            }
        }, 800);
    }, 3000);
}

// Les fonctions d'animation ne sont plus nécessaires car l'animation est gérée par CSS

function downloadImage(){
    // Récupérer la reference généré
    const referenceElement = document.getElementById('reference');
    const textElement = document.getElementById('text');
    const canvas = document.getElementById('canvas');
    const backgroundImage = document.getElementById('backgroundImage');

    if (!referenceElement || !textElement || !canvas || !backgroundImage) {
        console.error('Éléments manquants pour le téléchargement');
        return;
    }

    const reference = referenceElement.innerText;
    const text = textElement.innerText;
    const ctx = canvas.getContext('2d');

    // Attendre que l'image soit chargée avant de dessiner
    if (backgroundImage.complete) {
        drawOnCanvas();
    } else {
        backgroundImage.onload = drawOnCanvas;
    }

    function drawOnCanvas() {
        // Définir la taille du canvas sur celle de l'image de fond
        canvas.width = backgroundImage.width;
        canvas.height = backgroundImage.height;

        // Dessiner l'image de fond sur le canvas
        ctx.drawImage(backgroundImage, 0, 0);

        // Dessiner le texte sur le canvas
        ctx.font = 'bold 45px Urbanist';
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
        ctx.font = 'bold 80px Urbanist';
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
}