let allWorks = [];
let categories = [];

// Fonction pour récupérer les données depuis une URL donnée
function fetchData(url) {
  return fetch(url)
    .then(response => response.json())
    .catch(error => console.error('Erreur :', error));
}

// Fonction pour créer un élément de type figure pour un travail
function createFigure(work) {
  const figure = document.createElement('figure');
  const img = document.createElement('img');
  img.src = work.imageUrl;
  img.alt = work.title;
  figure.appendChild(img);
  const figcaption = document.createElement('figcaption');
  figcaption.innerHTML = work.title;
  figure.appendChild(figcaption);
  return figure;
}
// Fonction pour charger les travaux
function loadWorks() {
  fetchData('http://localhost:5678/api/works')
    .then(works => {
      allWorks = works;
      displayWorks();
    });
}
// Fonction pour afficher les travaux en fonction d'une catégorie donnée
function displayWorks(category) {
  const gallery = document.querySelector('.gallery');
  gallery.innerHTML = ''; // Vider la galerie
  let filteredWorks = allWorks;

  // Si une catégorie est fournie et n'est pas 'TOUS', je filtre les travaux par catégorie
  if (category && category !== 'TOUS') {
    filteredWorks = allWorks.filter(work => work.category.name === category);
  }

  // J'itère sur les travaux filtrés et je crée des éléments figure pour chaque travail
  filteredWorks.forEach(work => {
    const figure = createFigure(work);
    gallery.appendChild(figure);
  });
}

// Fonction pour créer un bouton de catégorie
function createCategoryButton(category) {
  const button = document.createElement('button');
  button.innerHTML = category;
  button.classList.add('category-button');
  button.addEventListener('click', function () {
    displayWorks(category);
  });
  return button;
}

// Fonction pour charger les catégories
function loadCategories() {
  fetchData('http://localhost:5678/api/categories')
    .then(categoriesData => {
      categories = ['TOUS', ...categoriesData.map(category => category.name)];
      displayCategories();
    });
}
// Fonction pour afficher les catégories
function displayCategories() {
  const categoryContainer = document.querySelector('.category-container');
  categoryContainer.innerHTML = ''; // Vider le conteneur des catégories
  categories.forEach(category => {
    const button = createCategoryButton(category);
    categoryContainer.appendChild(button);
  });
}

loadCategories();
loadWorks();

//POUR LE LOGOUT
const loginLink = document.querySelector('.login-link');

if (localStorage.getItem('authToken')) {
  loginLink.textContent = 'logout';
  loginLink.href = '#';

  loginLink.addEventListener('click', function (e) {
    e.preventDefault();

    localStorage.removeItem('authToken');
    window.location.reload();
  });
} else {
  loginLink.textContent = 'login';
  loginLink.href = 'login.html';
}

//Barre noir mode édition
const editBar = document.querySelector('#edit-bar');

if (localStorage.getItem('authToken')) {
  editBar.style.display = 'block';
} else {
  editBar.style.display = 'none';
}