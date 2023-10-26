import { BrowserRouter as Router, Route, Routes, Link, useParams } from "react-router-dom";
import { useState, useEffect } from 'react';
import { db, storage } from './firebase.js';
import { collection, onSnapshot, doc, getDoc, where, query } from 'firebase/firestore';
import Header from './Head';
import './App.css';
import { getDownloadURL, ref } from '@firebase/storage';  // Ensure this line is at the beginning of your file
import VideoPlayer from 'video.js';
import 'video.js/dist/video-js.css';


function App() {
    return (
        <Router>
            <Header />
            <div className="content">
                <Routes>
                    <Route path="/:genre" element={<MoviesByGenre />} />
                    <Route path="/:genre/:slug" element={<MovieDetails />} />
                </Routes>
            </div>
        </Router>
    );
}

const ITEMS_PER_PAGE = 20;

function MoviesByGenre() {
    const [movies, setMovies] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const { genre } = useParams();

    useEffect(() => {
        const filmesCollectionRef = collection(db, 'filmes');
        const genreQuery = query(filmesCollectionRef, where("genre", "==", genre));

        const unsubscribe = onSnapshot(genreQuery, (querySnapshot) => {
            const moviesArray = [];
            querySnapshot.forEach((doc) => {
                moviesArray.push({ id: doc.id, ...doc.data() });
            });
            setMovies(moviesArray);
        }, (error) => {
            console.error("Erro ao buscar filmes do gênero: ", error);
        });

        return () => unsubscribe();
    }, [genre]);

    const totalPages = Math.ceil(movies.length / ITEMS_PER_PAGE);
    
    const displayedMovies = movies.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    return (
        <div>
            <div className="movies-by-genre">
                {displayedMovies.map(movie => (
                    <div className="borda-filme" key={movie.id}>
                        <Link to={`${movie.slug}`}>
                            <div className="movie-lateral">
                                <img src={movie.image} alt={movie.titulo} />
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
            {totalPages > 1 && (
                <div className="pagination">
                    {Array.from({ length: totalPages }).map((_, index) => (
                        <button
                            key={index}
                            className={currentPage === index + 1 ? 'active' : ''}
                            onClick={() => setCurrentPage(index + 1)}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}


function MovieDetails() {
  const [movieDetails, setMovieDetails] = useState(null);
  const [videoURL, setVideoURL] = useState(null);
  const { slug } = useParams();

  useEffect(() => {
      const fetchMovieDetails = async () => {
          const movieDocRef = doc(db, 'filmes', slug);
          const docSnapshot = await getDoc(movieDocRef);

          if (docSnapshot.exists()) {
              const data = docSnapshot.data();
              setMovieDetails({ ...data, id: docSnapshot.id });

              const videoRef = ref(storage, data.url_video); 
              try {
                  const url = await getDownloadURL(videoRef);
                  setVideoURL(url);
              } catch (error) {
                  console.error("Erro ao obter a URL de streaming do vídeo: ", error);
              }
          } else {
              console.log("No such movie!");
          }
      };

      fetchMovieDetails();
  }, [slug]);

  useEffect(() => {
      // Certifique-se de que videoURL está disponível antes de inicializar o player
      if (videoURL) {
          const player = VideoPlayer(document.getElementById('my-video'));
          
          // Certifique-se de destruir o player ao desmontar o componente para evitar vazamentos de memória
          return () => {
              if (player) {
                  player.dispose();
              }
          };
      }
  }, [videoURL]);

  if (!movieDetails) {
    return <div>Carregando...</div>;
}

return (
    <div className="movie-details">
        <div data-vjs-player>
            <video id="my-video" className="video-js vjs-default-skin" controls>
                <source src={videoURL} type="video/mp4" />
                Seu navegador não suporta o elemento de vídeo.
            </video>
        </div>
        <div>
              <div className="borda">
                      <div className="movie-lateral-1">
                          <img src={movieDetails.image} alt={movieDetails.titulo} />
                      </div>
                      <div className="movie-lateral-2">
                          <div className="inline"><h3>Título:</h3><h4>{movieDetails.titulo}</h4></div>
                          <div className="inline"><h3>Gênero:</h3><p>{movieDetails.genre}</p></div>
                          <div className="inline"><h3>IMDb:</h3><p>{movieDetails.IMDb}</p></div>
                          <div className="inline"><h3>Lançamento:</h3><p>{movieDetails.Lançamento}</p></div>
                          <h3>Sinopse:</h3><p>{movieDetails.Sinopse}</p>
                      </div>
              </div>
      </div>
    </div>
);
}

export default App;
