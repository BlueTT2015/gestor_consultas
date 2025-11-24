import {Link} from 'react-router-dom';


export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer>
            <p>medhub@gmail.com | +351 923 124 687 | Portugal | &copy; {currentYear}</p>
        </footer>
    );
}