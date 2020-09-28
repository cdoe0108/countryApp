import React, { useState } from 'react';
import '../styles.css';
import { ContinentList } from './ContinentList'
import { CountriesList } from './ContriesList'

const DEFAULT_CONTINENT_CODE = 'AF'

function App() {
    const [selContinent, setSelContinent] = useState(DEFAULT_CONTINENT_CODE)
    const getCountries = continent => {
        setSelContinent(continent)
    }
    return (
        <div className="container">
        <header className="header">
            Trevorblades
        </header>
        <div className="content-wrapper">
            <ContinentList getCountries={getCountries} defaultVal={DEFAULT_CONTINENT_CODE}/>
            <CountriesList continent={selContinent}/>
        </div>
        </div>
    );
}

export default App;
