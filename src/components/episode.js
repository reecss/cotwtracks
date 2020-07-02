import React from 'react';

const episode = (props) => {
    return ( <h1>Episode {props.match.params.episode}</h1> );
}
 
export default episode;