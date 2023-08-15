import "./Loader.css";

const Loader = () => {
    return ( 
        <div className="loader">
            <div className="lds-roller"><div></div><div></div><div></div><div></div></div>
            Loading...
        </div>
     );
}
 
export default Loader;