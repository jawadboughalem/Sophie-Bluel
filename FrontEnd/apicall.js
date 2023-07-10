let allWorks = [];
let categories = [];
let worksData = [];


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
      worksData = works;
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
    if (category === 'TOUS') {
    button.classList.add('all-category-button');
    button.classList.add('all-category-text');
  } else {
    button.classList.add('category-button');
  }
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

const editBar = document.querySelector('#edit-bar');
const editButton1 = document.querySelector('.editorBtn1 #btnModifier1');
const editButton2 = document.querySelector('.editorBtn2 #btnModifier2');

if (localStorage.getItem('authToken')) {
  editBar.style.display = 'block';
  editButton1.style.display = 'flex';
  editButton2.style.display = 'flex';
} else {
  editBar.style.display = 'none';
  editButton1.style.display = 'none';
  editButton2.style.display = 'none';
}

// POUR LA MODAL

let modal = null

const openModal = function (e) {
  e.preventDefault()
  if (modal !== null) return
  const target = document.querySelector('#modal')
  target.style.display = null
  target.removeAttribute('aria-hidden')
  target.setAttribute('aria-modal', 'true')
  modal = target
  modal.addEventListener('click', closeModal)
  modal.querySelector('.js-modal-close').addEventListener('click', closeModal)
  modal.querySelector('.modal-wrapper').addEventListener('click', stopPropagation)
  
  // Utilisation des données stockées dans worksData
  let galleryModal = document.getElementById('gallery-modal');
  galleryModal.innerHTML = ""; 
  worksData.map(work => {
    let workElement = document.createElement('div');
    workElement.classList.add('work-element');
    workElement.innerHTML = `
      <div class="work-img">
        <img src="${work.imageUrl}" alt="${work.title}"/>
        <button class="edit-button">Éditer</button>
        <i class="fa fa-trash trash-icon"></i> <!-- Ajout de l'icône de la poubelle ici -->
      </div>`;
    galleryModal.appendChild(workElement);
  });
}

const closeModal = function(e) {
  if (modal === null) return
  e.preventDefault()
  modal.style.display = "none"
  modal.setAttribute('aria-hidden', 'true')
  modal.removeAttribute('aria-modal')
  modal.removeEventListener('click', closeModal)
  modal.querySelector('.js-modal-close').removeEventListener('click', closeModal)
  modal.querySelector('.modal-wrapper').removeEventListener('click', stopPropagation)
  modal = null
}

const stopPropagation = function (e) {
  e.stopPropagation()
}

document.querySelectorAll('.modal-close-btn').forEach(btn => {
  btn.addEventListener('click', closeModal);
});

document.querySelectorAll('.js-modal').forEach(a => { 
  a.addEventListener('click', openModal)
})

window.addEventListener('keydown', function (e) {
  if (e.key === "Escape" || e.key === "Esc") {
    closeModal(e)
  }
})

document.getElementById('modal-add-btn').addEventListener('click', function() {
  document.getElementById('modal-add').style.display = "block";
});

document.getElementById('modal-close-btn').addEventListener('click', function() {
  document.getElementById('modal-add').style.display = "none";
});

