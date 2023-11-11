import { useNavigate } from "react-router-dom";
import './Header.css'
export default function Header() {
    const navigate = useNavigate();
    
    const ctaRedirect = () => {
        navigate('/room')
    }

    const githubRedirect = () => {
        window.location.replace('https://github.com/fulopmilan')
    }

    const homeRedirect = () => {
        navigate('/')
    }

    return (
        <div id="header">
            <div id="header-left" className="clickable" onClick={homeRedirect}>
                <img id="header-left-picture" src="/images/github.png" alt=""/>
                <h1 id="header-left-title">Quarantine-tflix</h1>
            </div>
            <div id="header-right">
                <h3 id="header-right-github" className="clickable" onClick={githubRedirect}>github</h3>
                <button id="header-right-cta" className="clickable" onClick={ctaRedirect}>
                    join room
                </button>
            </div>
        </div>
    )
}