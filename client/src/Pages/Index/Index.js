import { useState } from "react"
import { useNavigate } from "react-router-dom";
export default function Index() {
    const navigate = useNavigate();

    const [ url, setUrl ] = useState();
    
    const onChange = (v) => {
        setUrl(v.target.value);
    }
    const findUrl = () => {
        navigate(url);
    }
    
    return (
        <div>
            <input onChange={onChange} type="text"/>
            <button onClick={findUrl}>Find</button>
        </div>
    )
}