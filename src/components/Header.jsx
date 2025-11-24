// src/components/Header.jsx

import {Link} from 'react-router-dom';

export default function Header() {
    return (
        <nav>
            <Link to="/">Home</Link> | <Link to="/about">About</Link> | <Link to="/forum">Forum</Link>
        </nav>
    );
}