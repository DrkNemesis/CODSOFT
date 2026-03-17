// Use the initialMoviesData injected from the Python template
const movies = window.initialMoviesData || [];

// State
let likedMovies = new Set();

// DOM Elements
const browseGrid = document.getElementById('movie-grid');
const recommendationsSection = document.getElementById('recommendations-section');
const recommendationsGrid = document.getElementById('recommendations-grid');
const likedCountEl = document.getElementById('liked-count');
const resetBtn = document.getElementById('reset-btn');

// Initialize
function init() {
    renderMovies(movies, browseGrid);
    
    // Event listener for movie grid
    document.addEventListener('click', (e) => {
        const likeBtn = e.target.closest('.like-btn');
        if (likeBtn) {
            const movieId = parseInt(likeBtn.dataset.id);
            toggleLike(movieId);
        }
    });

    resetBtn.addEventListener('click', () => {
        likedMovies.clear();
        updateUI();
    });
}

function createMovieCardHTML(movie, isLiked, matchScore = null) {
    const genresHTML = movie.genres.map(g => `<span class="genre-tag">${g}</span>`).join('');
    
    const iconClass = isLiked ? 'fa-solid fa-heart' : 'fa-regular fa-heart';
    const buttonText = isLiked ? 'Liked' : 'Like';
    const cardClass = isLiked ? 'movie-card liked' : 'movie-card';
    
    let matchBadgeHTML = '';
    if (matchScore !== null) {
        matchBadgeHTML = `<div class="match-badge"><i class="fa-solid fa-bolt"></i> ${matchScore}% Match</div>`;
    }

    return `
        <div class="${cardClass}" data-id="${movie.id}">
            ${matchBadgeHTML}
            <div class="movie-poster" style="background: ${movie.gradient}">
                <div class="poster-gradient">
                    <i class="fa-solid fa-film"></i>
                </div>
            </div>
            <div class="movie-content">
                <h3 class="movie-title">${movie.title}</h3>
                <div class="movie-genres">
                    ${genresHTML}
                </div>
                <button class="like-btn" data-id="${movie.id}">
                    <i class="${iconClass}"></i> ${buttonText}
                </button>
            </div>
        </div>
    `;
}

function renderMovies(movieList, container, showMatch = false) {
    container.innerHTML = movieList.map(movie => {
        const isLiked = likedMovies.has(movie.id);
        const matchScore = showMatch ? movie.matchScore : null;
        return createMovieCardHTML(movie, isLiked, matchScore);
    }).join('');
}

function toggleLike(movieId) {
    if (likedMovies.has(movieId)) {
        likedMovies.delete(movieId);
    } else {
        likedMovies.add(movieId);
    }
    
    updateUI();
}

// Function to fetch recommendations from the Flask Python API
async function fetchRecommendations() {
    if (likedMovies.size === 0) return [];
    
    try {
        const response = await fetch('/api/recommendations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ liked_movies: Array.from(likedMovies) })
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch recommendations from server');
        }
        
        const recommendations = await response.json();
        return recommendations;
    } catch (error) {
        console.error('Error fetching recommendations:', error);
        return [];
    }
}

async function updateUI() {
    // Update liked count
    likedCountEl.textContent = likedMovies.size;
    
    // Re-render browse grid to update like buttons
    renderMovies(movies, browseGrid);
    
    // Add loading state visually (optional, but good for real API calls)
    if (likedMovies.size > 0 && recommendationsSection.classList.contains('hidden')) {
        recommendationsGrid.innerHTML = '<div style="text-align:center;width:100%;color:var(--text-secondary);padding:20px;">Fetching from Python Server...</div>';
        recommendationsSection.classList.remove('hidden');
    }

    // Now call the Python backend
    const recommendations = await fetchRecommendations();
    
    if (recommendations.length > 0) {
        recommendationsSection.classList.remove('hidden');
        renderMovies(recommendations, recommendationsGrid, true);
    } else {
        recommendationsSection.classList.add('hidden');
    }
}

// Start app
document.addEventListener('DOMContentLoaded', init);
