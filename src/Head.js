import { Link } from "react-router-dom";
import './header.css';
import logo from './image/logo.svg';

function Header() {
    return (
        <div className='Header'>
          <Link to="/">
            <img src={logo} alt="" className="logo" />
          </Link>
            <Filmes />
        </div>
    );
}

function Filmes() {
    const genres = ['terror', 'comedia', 'infantil'];

    return (
        <div className="filmes">
            {genres.map(genre => (
                <div key={genre} className="genre">
                    <Link to={`/${genre}`}><span>{genre}</span></Link>
                </div>
            ))}
        </div>
    );
}

export default Header;
