import { useState } from "react"
import { useNavigate } from "react-router-dom";
export default function CreateRoom() {
    const navigate = useNavigate();

    const [ url, setUrl ] = useState();
    
    const onUrlChange = (v) => {
        setUrl(v.target.value);
    }
    const findUrl = () => {
        navigate(url);
    }
    
    return (
        <div>
            <input onChange={onUrlChange} type="text"/>
            <button onClick={findUrl}>Find</button>
        </div>
    )
}