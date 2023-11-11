import { useNavigate } from "react-router-dom";
import './Index.css'
export default function Index() {
    const navigate = useNavigate();
    
    const ctaRedirect = () => {
        navigate('room')
    }

    return (
        <div id="index" style={{backgroundImage: "url(/images/background.png)"}}>
            <div id="content">
                <h1 id="index-title">Watch Media with your friends, from home, no effort.</h1>
                <p id="index-description">Create a new room and invite your friends! <br/> Are you ready to try it out?</p>
                <div id="index-cta" className="clickable" onClick={ctaRedirect}>
                    hop on
                </div>
            </div>
            <div id="background-gradient"></div>
   
        </div>
    )
}