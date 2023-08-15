import React, {useState} from 'react';
import firebase from "../../../node_modules/firebase/compat/app";
import "../../../node_modules/firebase/compat/auth";
import "./Header.css" ;
import {AiOutlineHome} from 'react-icons/ai';
import {BiLogOut} from 'react-icons/bi';
import {AiOutlineHeart} from 'react-icons/ai';
import {FcTodoList} from 'react-icons/fc';
import {Link, useNavigate} from 'react-router-dom';

const Header = ({ onShowOnlyFavorite }) => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showOnlyFav, setShowOnlyFav] = useState(false);
  const navigate = useNavigate();

  const reloadHome = () => {
    const user = firebase.auth().currentUser;
    if (user){
      window.location.reload();
    }else{
      navigate('/');
    }
  }

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await firebase.auth().signOut();
      localStorage.removeItem('authToken');
      setIsLoggingOut(false);
      navigate("/"); 
    } catch (error) {
      console.error("Error logging out:", error);
      setIsLoggingOut(false);
    }
  };
  const handleShowOnlyFav = () => {
    setShowOnlyFav(prevShowOnlyFav => !prevShowOnlyFav);
    onShowOnlyFavorite(!showOnlyFav);
  };

  return ( 
    <div className='header'>
      
      <div className='menu-icon'>

        <FcTodoList className='menu'/>

      </div>

      <nav>
        <ul className='ul-item'>

          <li>
          <Link to='/home' onClick={reloadHome}>
            <AiOutlineHome className='icon'/> 
          </Link>
          </li>

          <li>
          <Link to='/home'>
            <AiOutlineHeart className='icon' onClick={handleShowOnlyFav}/> 
          </Link>
          </li>

          <li>
          <Link to='/' onClick={handleLogout} disabled={isLoggingOut}>
            <BiLogOut className='icon'/> 
          </Link>
          </li>

        </ul>
      </nav>

    </div>
   );
}
 
export default Header;