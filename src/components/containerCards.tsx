'use client'

import { useEffect, useState } from "react"
import { Film, People, Planet, Starship } from "@/lib/definitions";
import Cardspeople from "./cardsPeople";
import Cardsfilms from "./cardsFilms";
import Cardsstarships from "./cardsStarships";
import Cardsplanets from "./cardsPlanets";

interface Type {
    type: string;
}

export default function ContainerCards({ type }: Type) {

    let url = '';

    switch (type) {
        case 'people':
            url = 'http://localhost:3002/people';
            break;
        case 'films':
            url = 'http://localhost:3002/films';
            break;
        case 'starships':
            url = 'http://localhost:3002/starships';
            break;
        case 'planets':
            url = 'http://localhost:3002/planets';
            break;
        default:
            break;
    }
    const [responseArray, setResponseArray] = useState<People[]>([]);
    const [responseFilms, setResponseArrayFilms] = useState<Film[]>([]);
    const [responseStarships, setResponseArrayStarships] = useState<Starship[]>([]);
    const [responsePlanets, setResponseArrayPlanets] = useState<Planet[]>([]);

    useEffect(() => {

        const fetchData = async () => {
            try {

                const response = await fetch(url, {
                    method: 'GET',
                });
                if (response.ok) {

                    switch (type) {
                        case 'people':
                            const responsePeople: People[] = await response.json();
                            setResponseArray(responsePeople);
                            break;
                        case 'films':
                            const responseFilms: Film[] = await response.json();
                            setResponseArrayFilms(responseFilms);
                            break;
                        case 'starships':
                            const responseStarships: Starship[] = await response.json();
                            setResponseArrayStarships(responseStarships);
                            break;
                        case 'planets':
                            const responsePlanets: Planet[] = await response.json();
                            setResponseArrayPlanets(responsePlanets);
                            break;
                        default:
                            break;
                    }

                }

            } catch (error) {
                console.error('Error al realizar la petición:', error);
            }
        };

        fetchData();

    }, []);

    return (
        <div>
            {type == "people" ? (
                <div>
                    <Cardspeople />
                </div>      
            ) : type == "films" ? (
                <div>
                    <Cardsfilms />
                </div>
            ) : type == "starships" ? (
                <div>
                    <Cardsstarships />
                </div>
            ) : (
                <div>
                    <Cardsplanets />
                </div>
            )}
        </div>

    )
}