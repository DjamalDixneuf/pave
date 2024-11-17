document.addEventListener('DOMContentLoaded', function() {
    const addMovieForm = document.getElementById('addMovieForm');
    const movieTableBody = document.getElementById('movieTableBody');
    const searchBar = document.getElementById('searchBar');

    let movies = [];
    
    const API_URL = process.env.API_URL || 'http://localhost:3000';

    function displayMovies(moviesToShow) {
        console.log('Affichage des films:', moviesToShow);
        movieTableBody.innerHTML = '';
        moviesToShow.forEach(movie => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${movie.title}</td>
                <td>${movie.genre}</td>
                <td>${movie.duration}</td>
                <td>${movie.releaseYear}</td>
                <td><button onclick="deleteMovie(${movie.id})">Supprimer</button></td>
            `;
            movieTableBody.appendChild(row);
        });
    }

    function addMovie(event) {
    event.preventDefault();
    showLoading();
    const form = event.target;
    const movieData = {
        title: form.title.value.trim(),
        duration: form.duration.value.trim(),
        description: form.description.value.trim(),
        genre: form.genre.value.trim(),
        releaseYear: form.releaseYear.value,
        thumbnailUrl: form.thumbnailUrl.value.trim(),
        videoUrl: form.videoUrl.value.trim()
    };

    fetch(`${API_URL}/movies`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(movieData),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('Success:', data);
        loadMovies();
        form.reset();
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('Erreur lors de l\'ajout du film. Veuillez réessayer.');
    })
    .finally(() => {
        hideLoading();
    });
}

    window.deleteMovie = function(id) {
        fetch(`http://localhost:3000/movies/${id}`, {
            method: 'DELETE',
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            loadMovies();
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }

    function filterMovies() {
        const searchTerm = searchBar.value.toLowerCase();
        const filteredMovies = movies.filter(movie => 
            movie.title.toLowerCase().includes(searchTerm)
        );
        displayMovies(filteredMovies);
    }

    function loadMovies() {
    showLoading();
    fetch(`${API_URL}/movies`)
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        movies = Array.isArray(data) ? data : [];
        displayMovies(movies);
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('Erreur lors du chargement des films. Veuillez réessayer plus tard.');
    })
    .finally(() => {
        hideLoading();
    });
}

    addMovieForm.addEventListener('submit', addMovie);
    searchBar.addEventListener('input', filterMovies);

    loadMovies();
});