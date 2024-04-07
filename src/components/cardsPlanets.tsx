import { useEffect, useState } from "react";
import { Planet } from "@/lib/definitions";
import { Input } from "./ui/input";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/16/solid";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./ui/select";


export default function Cardsplanets() {

    const [responseArray, setResponseArray] = useState<Planet[]>([]);
    const [filter, setFilter] = useState<string>("");
    const [filteredData, setFilteredData] = useState<Planet[]>(responseArray);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [climateFilter, setClimateFilter] = useState<string>("all");
    const itemsPerPage = 5;
    const [arrayFetched, setArrayFetched] = useState(false);
    const [climatesArray, setClimatesArray] = useState<string[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                let url = 'http://localhost:3002/planets';
                if (climateFilter !== 'all') {
                    url += `?climate=${climateFilter}`;
                }
                const response = await fetch(url, {
                    method: 'GET',
                });
                if (response.ok) {
                    
                    const responsePlanets: Planet[] = await response.json();
                    
                    setResponseArray(responsePlanets);

                    if (!arrayFetched) {
                        const climatesArray = responsePlanets
                        .map(planet => planet.climate)
                        .filter(Boolean); // Esto elimina valores nulos o indefinidos
                      
                      const uniquePlanetsArray = Array.from(new Set(climatesArray));
                      
                      setClimatesArray(uniquePlanetsArray);
                      setArrayFetched(true);
                    }

                }
            } catch (error) {
                console.error('Error al realizar la petición:', error);
            }
        };
        fetchData();
    }, [climateFilter]);

    useEffect(() => {
        const filtered = responseArray.filter((planet) =>
            planet.name.toLowerCase().includes(filter.toLowerCase())
        );
        setFilteredData(filtered);
        setCurrentPage(1);
    }, [filter, responseArray]);

    const totalPage = Math.ceil(filteredData.length / itemsPerPage);

    const currentData = filteredData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="pt-6">
            <div className="flex items-center pb-4 space-x-4 justify-center px-4">
                <div>
                    <p className="text-[15px] text-white text-center pb-2">Find by name:</p>
                    <Input 
                        type="text"
                        placeholder="Find by name..."
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="max-w-[200px]"
                    />
                </div>
                <div className="">
                    <p className="text-[15px] text-white text-center pb-2">Climate:</p>
                    <Select value={climateFilter} onValueChange={(value) => setClimateFilter(value)}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="All" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Climate</SelectLabel>
                                <SelectItem value="all">All</SelectItem>
                                {climatesArray.map((climate, index) => (
                                    <SelectItem key={index} value={climate}>
                                        {climate}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
            </div>
           
            
            <div className="space-y-2 flex flex-col items-center sm:grid sm:grid-cols-2 sm:space-y-0 sm:gap-10 pt-6 lg:grid-cols-3 2xl:grid-cols-4">
                {currentData.map((planet, index) => (
                    <div
                        key={index}
                        className="sm:min-h-[350px] w-[260px] border border-slate-400 rounded-md bg-slate-900 pl-4 p-2 text-white text-[20px]"
                    >
                        <div className="h-[40px]">
                            <h3 className="font-bold text-[25px] text-slate-400 pb-2">
                                {planet.name}
                            </h3>
                        </div>
                        <p className="text-gray-300">Climate: <span className="italic text-white">
                            {planet.climate}
                            </span>
                        </p>
                        <p className="text-gray-300">Diameter: <span className="italic text-white">
                            {planet.diameter}
                            </span>
                        </p>
                        <p className="text-gray-300">Gravity: <span className="italic text-white">
                            {planet.gravity}
                            </span>
                        </p>
                        <p className="text-gray-300">Orbital period: <span className="italic text-white">
                            {planet.orbital_period}
                            </span>
                        </p>
                        <p className="text-gray-300">Population: <span className="italic text-white">
                            {planet.population}
                            </span>
                        </p>
                        <p className="text-gray-300">Rotation period: <span className="italic text-white">
                            {planet.rotation_period}
                            </span>
                        </p>
                        <p className="text-gray-300">Terrain: <span className="italic text-white">
                            {planet.terrain}
                            </span>
                        </p>
                    </div>
                ))}
            </div>
            <div className="flex justify-center items-center space-x-2 py-6">
                <button 
                    onClick={() => setCurrentPage(currentPage - 1)} 
                    disabled={currentPage === 1 || filteredData.length === 0}
                    className={`p-1 ${
                        currentPage === 1 || filteredData.length === 0 ? 'bg-slate-400 cursor-not-allowed' : 'bg-slate-200'
                    }`}
                >
                    <ChevronLeftIcon width={24} height={24}/>
                </button>
                {Array.from({ length: totalPage }, (_, i) => i + 1).map(page => (
                    <button 
                        key={page} 
                        onClick={() => setCurrentPage(page)}
                        disabled={currentPage === page || filteredData.length === 0}
                        className={`bg-slate-200 p-1 ${
                            currentPage === page || filteredData.length === 0 ? 'bg-slate-500 text-white' : ''
                        }`}
                    >
                        {page}
                    </button>
                ))}
                <button 
                    onClick={() => setCurrentPage(currentPage + 1)} 
                    disabled={currentPage === totalPage || filteredData.length === 0}
                    className={`p-1 ${
                        currentPage === totalPage || filteredData.length === 0 ? 'bg-slate-400 cursor-not-allowed' : 'bg-slate-200'
                    }`}
                >
                    <ChevronRightIcon width={24} height={24}/>
                </button>
            </div>
        </div>
    );
}
