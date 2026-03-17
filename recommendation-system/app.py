from typing import List, Dict, Any
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

# Mock database of movies with explicitly defined structure for the type checker
MOVIES: List[Dict[str, Any]] = [
    { "id": 1, "title": "Inception", "genres": ["Sci-Fi", "Action", "Thriller"], "gradient": "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)" },
    { "id": 2, "title": "The Dark Knight", "genres": ["Action", "Crime", "Drama"], "gradient": "linear-gradient(135deg, #434343 0%, #000000 100%)" },
    { "id": 3, "title": "Interstellar", "genres": ["Sci-Fi", "Drama", "Adventure"], "gradient": "linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)" },
    { "id": 4, "title": "The Matrix", "genres": ["Sci-Fi", "Action"], "gradient": "linear-gradient(135deg, #000000 0%, #0f9b0f 100%)" },
    { "id": 5, "title": "Avengers: Endgame", "genres": ["Action", "Sci-Fi", "Adventure"], "gradient": "linear-gradient(135deg, #870000 0%, #190a05 100%)" },
    { "id": 6, "title": "Parasite", "genres": ["Thriller", "Drama", "Comedy"], "gradient": "linear-gradient(135deg, #232526 0%, #414345 100%)" },
    { "id": 7, "title": "Joker", "genres": ["Drama", "Crime", "Thriller"], "gradient": "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)" },
    { "id": 8, "title": "Toy Story", "genres": ["Animation", "Comedy", "Family"], "gradient": "linear-gradient(135deg, #fceabb 0%, #f8b500 100%)" },
    { "id": 9, "title": "Spirited Away", "genres": ["Animation", "Fantasy", "Family"], "gradient": "linear-gradient(135deg, #a8c0ff 0%, #3f2b96 100%)" },
    { "id": 10, "title": "Gladiator", "genres": ["Action", "Drama", "Adventure"], "gradient": "linear-gradient(135deg, #e65c00 0%, #F9D423 100%)" },
    { "id": 11, "title": "The Godfather", "genres": ["Crime", "Drama"], "gradient": "linear-gradient(135deg, #141E30 0%, #243B55 100%)" },
    { "id": 12, "title": "Pulp Fiction", "genres": ["Crime", "Drama", "Thriller"], "gradient": "linear-gradient(135deg, #f12711 0%, #f5af19 100%)" },
    { "id": 13, "title": "Into the Spider-Verse", "genres": ["Animation", "Action", "Adventure"], "gradient": "linear-gradient(135deg, #ff4b1f 0%, #1fddff 100%)" },
    { "id": 14, "title": "Knives Out", "genres": ["Comedy", "Crime", "Drama"], "gradient": "linear-gradient(135deg, #3E5151 0%, #DECBA4 100%)" },
    { "id": 15, "title": "Mad Max: Fury Road", "genres": ["Action", "Sci-Fi", "Adventure"], "gradient": "linear-gradient(135deg, #FF4E50 0%, #F9D423 100%)" }
]

@app.route('/')
def index():
    """Serve the main UI and pass the initial movie list."""
    return render_template('index.html', movies=MOVIES)

@app.route('/api/recommendations', methods=['POST'])
def get_recommendations():
    """Calculate and return recommendations based on liked movies."""
    data = request.get_json()
    if data is None:
        return jsonify([])
        
    liked_movie_ids = data.get('liked_movies', [])
    
    if not liked_movie_ids:
        return jsonify([])

    # 1. Build the user profile (tally up favorite genres)
    user_profile: Dict[str, int] = {}
    for movie in MOVIES:
        movie_id = movie.get('id')
        if movie_id in liked_movie_ids:
            genres = movie.get('genres', [])
            for genre in genres:
                user_profile[genre] = user_profile.get(genre, 0) + 1
                
    if not user_profile:
        return jsonify([])

    max_profile_score = max(user_profile.values())
    if max_profile_score == 0:
        max_profile_score = 1

    # 2. Score unliked movies
    recommendations: List[Dict[str, Any]] = []
    for movie in MOVIES:
        movie_id = movie.get('id')
        if movie_id not in liked_movie_ids:
            score = 0
            genres: List[str] = movie.get('genres', []) # type: ignore
            for genre in genres:
                if genre in user_profile:
                    val = user_profile.get(genre, 0)
                    score += int(val) # type: ignore
            
            if score > 0:
                # Calculate match percentage
                match_percentage: float = 0.0
                if len(genres) > 0:
                    score_float = float(score) # type: ignore
                    max_score_float = float(max_profile_score)
                    len_genres_float = float(len(genres))
                    calc = (score_float / (max_score_float * len_genres_float)) * 100.0
                    match_percentage = round(calc)
                    match_percentage = min(match_percentage, 98.0) # type: ignore
                
                recommend_movie = movie.copy()
                recommend_movie['matchScore'] = match_percentage + 1
                recommend_movie['rawScore'] = score
                recommendations.append(recommend_movie)

    # 3. Sort by score descending and return top 4
    recommendations.sort(key=lambda x: (float(x.get('rawScore', 0)), float(x.get('matchScore', 0))), reverse=True)
    top_recommendations = recommendations[0:4] # type: ignore
    
    # Clean up the output to send to frontend
    for movie in top_recommendations:
        movie.pop('rawScore', None)
        
    return jsonify(top_recommendations)

if __name__ == '__main__':
    app.run(debug=False)
