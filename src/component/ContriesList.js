import React from 'react';
import {ApolloClient, InMemoryCache, gql, useQuery} from '@apollo/client';

// initialize a GraphQL client
const client = new ApolloClient({
    cache: new InMemoryCache(),
    uri: 'https://countries.trevorblades.com'
});

// create a component that renders a select input for coutries
export const CountriesList = ({ continent }) => {
    
    const listCountries = (continent) => {
        return gql`
            {
                continent (code: "${continent}") {
                    name
                    code
                    countries	{
                        name
                        code
                    }
                }
            }
        `;
    }

    const {data, loading, error} = useQuery(listCountries(continent), {client});

    if (loading || error) {
        return <p className="error">{error ? error.message : 'Loading...'}</p>;
    }

    return (
        <>
            <h3 className="countries-title">List of Countries: </h3>
            <ul className="countries list">
                {
                    data.continent.countries.map(continent => (
                    <li className="list-item" key={continent.code}>{continent.name}</li>
                    ))
                }
            </ul>
        </>
    );
}
