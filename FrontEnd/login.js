// Fonction pour récupérer les valeurs des champs de formulaire
function getFormValues() {
  const email = document.querySelector('#email').value;
  const password = document.querySelector('#pass').value;
  return { email, password };
}

// Fonction pour envoyer les informations de connexion à l'API
function sendLoginInfo(loginData) {
  return fetch('http://localhost:5678/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginData)
  })
  .then(response => response.json());
}

// Fonction pour vérifier si le token est bien sauvegardé dans le localStorage
function verifyToken() {
  const token = localStorage.getItem('authToken');
  if (token) {
      console.log('Le token a été correctement sauvegardé dans le localStorage.');
  } else {
      console.log('Aucun token trouvé dans le localStorage.');
  }
}

// Fonction pour gérer la réponse de l'API
function handleApiResponse(data, errorMsg) {
  if (data.error) {
      errorMsg.textContent = "Oups, votre identifiant ou votre mot de passe semble incorrecte !";
  } else {
      localStorage.setItem('authToken', data.token); // Je sauvegarde le token d'authentification dans le local storage
      verifyToken(); // Je vérifie le token après l'avoir sauvegardé
      window.location.href = 'index.html'; // Redirige vers la page d’accueil
  }
}

document.addEventListener('DOMContentLoaded', function() {
  const form = document.querySelector('#login-form');
  const errorMsg = document.querySelector('.errorMsg');

  form.addEventListener('submit', function(e) {
      e.preventDefault();

      const loginData = getFormValues();
      sendLoginInfo(loginData)
      .then(data => handleApiResponse(data, errorMsg))
      .catch(err => {
          errorMsg.textContent = "Erreur lors de la connexion. Veuillez réessayer plus tard.";
          console.error('Erreur:', err);
      });
  });
});