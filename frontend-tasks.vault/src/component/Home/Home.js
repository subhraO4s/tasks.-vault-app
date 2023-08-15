import './Home.css';
import Header from '../Header/Header';
import Searchbar from '../Searchbar/Searchbar';
import Body from '../Body/Body';
import Analytics from '../AnalyticsBar/Analytics';
import CalendarBar from '../CalendarBar/CalendarBar';
import Loader from '../Loader/Loader';
import {useState} from 'react';



const Home = () => {
    

    const [searchResults, setSearchResults] = useState([]);
    const [showOnlyFav, setShowOnlyFav] = useState('false');

    const handleSearchResults = (results) => {
        setSearchResults(results);
    };
    const handleShowOnlyFav = (sho) => {
        setShowOnlyFav(sho);
    }
    
    return ( 
        <div className = 'home'>
            <Searchbar onSearchResults={handleSearchResults} />
            <Header onShowOnlyFavorite={handleShowOnlyFav}/>
            <Analytics />
            <CalendarBar /> 
            <Body searchResults={searchResults} showOnlyFav={showOnlyFav}/>
        </div>
     );
}
 
export default Home;