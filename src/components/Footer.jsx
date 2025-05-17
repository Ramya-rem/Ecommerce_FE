import { FaInstagram, FaFacebook, FaTwitter } from "react-icons/fa"
import "../styles/Footer.css"

const Footer = () => {
  return (
    <footer className="footer">
    <div className="footer-container">
      <div className="footer-grid">
        <div className="footer-column">
          <h3>About</h3>
          <ul>
            <li>
              <a href="#">Our Story</a>
            </li>
            <li>
              <a href="#">Locations</a>
            </li>
            <li>
              <a href="#">Careers</a>
            </li>
          </ul>
        </div>
        <div className="footer-column">
          <h3>Contact</h3>
          <ul>
            <li>
              <a href="#">Help Center</a>
            </li>
            <li>
              <a href="#">Email Us</a>
            </li>
            <li>
              <a href="#">FAQ</a>
            </li>
          </ul>
        </div>
        <div className="footer-column">
          <h3>Terms</h3>
          <ul>
            <li>
              <a href="#">Privacy Policy</a>
            </li>
            <li>
              <a href="#">Terms of Service</a>
            </li>
            <li>
              <a href="#">Shipping Policy</a>
            </li>
          </ul>
        </div>
        <div className="footer-column">
          <h3>Follow Us</h3>
          <div className="social-icons">
            <a href="#" className="social-icon">
              <FaInstagram />
            </a>
            <a href="#" className="social-icon">
              <FaFacebook />
            </a>
            <a href="#" className="social-icon">
              <FaTwitter />
            </a>
          </div>
        </div>
      </div>
      <div className="footer-divider"></div>
      <div className="footer-copyright">
        <p>© 2025 Crave & Conquer. All rights reserved.</p>
      </div>
    </div>
  </footer>
  )
}

export default Footer
  