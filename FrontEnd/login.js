// Fonction pour récupérer les valeurs des champs de formulaire
function getFormValues() {
  const email = document.querySelector('#email').value;
  const password = document.querySelector('#pass').value;
  return { email, password };
}

function sendLoginInfo(loginData) {
  return fetch('http://localhost:5678/api/users/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(loginData)
  })
  .then(response => {
    if (response.status === 404) {
      return { error: 'email_not_found' };
    }
    return response.json();
  });
}


function handleApiResponse(data, errorMsg) {
  if (data.error) {
    errorMsg.textContent = "Oups, votre identifiant ou votre mot de passe semble incorrect !";
  } else if (data.token) {
    localStorage.setItem('authToken', data.token); // Je sauvegarde le token d'authentification dans le local storage
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
    .then((data) => {
      handleApiResponse(data, errorMsg);
    })
    .catch(err => {
      errorMsg.textContent = "Erreur lors de la connexion. Veuillez réessayer plus tard.";
      console.error('Erreur:', err);
    });
  });
  
});

