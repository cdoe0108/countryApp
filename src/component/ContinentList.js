import React, { useState } from 'react';
import {ApolloClient, InMemoryCache, gql, useQuery} from '@apollo/client';

// initialize a GraphQL client
const client = new ApolloClient({
    cache: new InMemoryCache(),
    uri: 'https://countries.trevorblades.com'
});

// write a GraphQL query that asks for names and codes for all countries
const LIST_CONTINENTS = gql`
    {
        continents {
            name
            code
        }
    }
`;


// create a component that renders a select input for coutries
export const ContinentList = ({ getCountries, defaultVal }) => {
    const [isSelected, setIsSelected] = useState(defaultVal)
    const {data, loading, error} = useQuery(LIST_CONTINENTS, {client});

    if (loading || error) {
        return <p className="error">{error ? error.message : 'Loading...'}</p>;
    }

    const handleClick = item => {
        setIsSelected(item)
        getCountries(item)
    }

    return (
        <>
            <h3 className="continent-title">Select Continent to display Countries</h3>
            <ul className="list">
            {
                data.continents.map(continent => (
                <li className={continent.code === isSelected ? 'list-item active' : 'list-item'} onClick={() => handleClick(continent.code)} key={continent.code}>{continent.name}</li>
                ))
            }
            </ul>
        </>
    );
}
