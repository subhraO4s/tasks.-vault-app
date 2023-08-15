import "./LoginPage.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import firebase from '../../../node_modules/firebase/compat/app';
import '../../../node_modules/firebase/compat/auth';

const LoginPage = ({ handleLoginModalClose }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        
        try {
           
            await firebase.auth().signInWithEmailAndPassword(email, password);
            
            const user = firebase.auth().currentUser;
    
            if (user) {
                if (user.emailVerified) {
                    const idToken = await user.getIdToken();
                    localStorage.setItem('authToken', idToken);
                    console.log("Login successful");
                    setMessage("");
                    navigate(`/home`);
                } else {
                    setMessage("Please check your email and verify your email address.");
                }
            }
            
        } catch (error) {
            console.error("Error logging in:", error);
            setMessage("Invalid credentials. Please try again.");
        }
    };

    return ( 
        <div className="login-form-container">
            <div className="login">
                <div>
                    <h2>Log in</h2>
                <div>
                <form onSubmit={handleLogin}>
                    <div className="inputname">
                        <label>Email</label>
                        <input type="Email" name="name" className="Username" placeholder="Email" value={email}
                                onChange={(e) => setEmail(e.target.value)} required/>
                    </div>
                    <div className="inputpassword">
                        <label>Password</label>
                        <input name="password" className="Password" placeholder="Password" type="password" value={password}
                                onChange={(e) => setPassword(e.target.value)} required/>
                    </div>
                    {message && <p className="error-message">{message}</p>}
                    <div className="button">
                        <button type="submit">Log in</button>
                        <button className="login-close-button" onClick={handleLoginModalClose}>
                            Close
                        </button>
                    </div>
                </form>
                </div>
                </div>
                
            </div>
            
        </div>
     );
}
 
export default LoginPage;