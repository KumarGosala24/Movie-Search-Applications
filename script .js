const API_KEY = 'b9b503a26e3804f747a092434119ebde';  // Your API Key
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/w500';
const moviesContainer = document.getElementById('moviesContainer');
const movieModal = document.getElementById('movieModal');
const modalDetails = document.getElementById('modalDetails');
const closeModalBtn = document.getElementById('closeModal');

// Fetch movies based on search query
async function fetchMovies(query = '') {
    try {
        const url = query
            ? `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}`
            : `${BASE_URL}/movie/popular?api_key=${API_KEY}`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        const data = await response.json();
        displayMovies(data.results);
    } catch (error) {
        console.error('Error fetching movies:', error);
        moviesContainer.innerHTML = '<p>Error loading movies. Please try again.</p>';
    }
}

// Display the movie results in the container
function displayMovies(movies) {
    moviesContainer.innerHTML = '';  // Clear previous results
    
    if (movies.length === 0) {
        moviesContainer.innerHTML = '<p>No results found.</p>';
        return;
    }

    // Loop through each movie and display it in a card
    movies.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.classList.add('movie-card');
        
        // Add fallback for missing poster
        const posterSrc = movie.poster_path 
            ? `${IMG_URL}${movie.poster_path}` 
            : 'https://via.placeholder.com/500x750.png?text=No+Image';
        
        movieCard.innerHTML = `
            <img src="${posterSrc}" alt="${movie.title}" onerror="this.src='https://via.placeholder.com/500x750.png?text=Image+Not+Found'">
            <h3>${movie.title}</h3>
            <button onclick="showDetails(${movie.id})">View Details</button>
        `;
        moviesContainer.appendChild(movieCard);
    });
}

// Show movie details in the modal
async function showDetails(movieId) {
    try {
        const response = await fetch(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}`);
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        const movie = await response.json();

        modalDetails.innerHTML = `
            <h2>${movie.title}</h2>
            <img src="${IMG_URL}${movie.backdrop_path}" alt="${movie.title}" class="modal-backdrop">
            <p><strong>Overview:</strong> ${movie.overview}</p>
            <p><strong>Release Date:</strong> ${movie.release_date}</p>
            <p><strong>Rating:</strong> ${movie.vote_average}/10</p>
        `;

        movieModal.classList.remove('hidden');
    } catch (error) {
        console.error('Error fetching movie details:', error);
        modalDetails.innerHTML = '<p>Unable to load movie details. Please try again.</p>';
    }
}

// Close modal when close button is clicked
closeModalBtn.addEventListener('click', () => {
    movieModal.classList.add('hidden');
});

// Close modal when clicking outside the modal content
movieModal.addEventListener('click', (e) => {
    if (e.target === movieModal) {
        movieModal.classList.add('hidden');
    }
});

// Listen for user input in the search field and fetch results
const searchInput = document.getElementById('searchInput');
searchInput.addEventListener('keyup', (e) => {
    const query = e.target.value.trim();
    fetchMovies(query);
});

// Initial load - fetch popular movies when the page loads
fetchMovies();