'use client'

import { useEffect } from "react"

export default function Peoples() {
    
    useEffect(() => {

        const fetchData = async () => {
            try {
             
              const response = await fetch('http://localhost:3002/people', {
                  method: 'GET',
              });
              if(response.ok){
                const responseData = await response.json();
                console.log(responseData);
              }
              
            } catch (error) {
              console.error('Error al realizar la petición:', error);
            }
          };

        fetchData();

    },[]);

    return(
        <div>
            
        </div>
    )
}