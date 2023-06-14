// Fonction pour récupérer les données à partir d'une URL
function fetchData(url) {
  return fetch(url)
    .then(response => response.json())
    .catch(error => console.error('Error:', error));
}

// Fonction pour créer une figure HTML basée sur les données d'une œuvre
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

// Fonction pour afficher les œuvres dans la galerie
function displayWorks(category) {
  fetchData('http://localhost:5678/api/works')
    .then(works => {
      const gallery = document.querySelector('.gallery');
      gallery.innerHTML = ''; // vide la galerie
      let filteredWorks = works;
      if (category && category !== 'TOUS') {
        filteredWorks = works.filter(work => work.category.name === category);
      }
      for (let i = 0; i < filteredWorks.length; i++) {
        const figure = createFigure(filteredWorks[i]);
        gallery.appendChild(figure);
      }
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

  button.addEventListener('click', function() {
    displayWorks(category);
  });

  return button;
}


// Fonction pour afficher les catégories
function displayCategories() {
  fetchData('http://localhost:5678/api/categories')
    .then(categoriesData => {
      const categoryContainer = document.querySelector('.category-container');
      categoryContainer.innerHTML = ''; // vide le container des catégories
      const categories = ['TOUS']; // on ajoute la catégorie TOUS au début
      for (let i = 0; i < categoriesData.length; i++) {
        if (!categories.includes(categoriesData[i].name)) {
          categories.push(categoriesData[i].name);
        }
      }
      for (let i = 0; i < categories.length; i++) {
        const button = createCategoryButton(categories[i]);
        categoryContainer.appendChild(button);
      }
    });
}

// Affichage initial des catégories et des œuvres
displayCategories();
displayWorks();

