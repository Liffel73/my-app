import { useState, useEffect} from 'react';
import {db} from './firebase.js';

    export default function Filmes(){
        const [filmes, setFilmes] = useState([]);

        useEffect(() => {
            db.collection('filmes').onSnapshot((snap) => {
                setFilmes(snap.docs);
            })
        }, [])
        
        
        return(
            <div className="dilmes">
                 <h2>teste</h2>
              {
                filmes?.map(function(val){
                    const data = val.data(); // Extracting the data from the document snapshot
                    return (
                        <div key={val.id}> {/* It's good practice to add a 'key' prop to dynamic elements */}
                            <h2>teste</h2>
                            <p>{data.slug}</p> {/* Now accessing 'slug' from the data */}
                        </div>
                    )
                })
                }
            </div>
        )
    }