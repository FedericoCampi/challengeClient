import { useEffect, useState } from "react";
import { Starship } from "@/lib/definitions";
import { Input } from "./ui/input";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/16/solid";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./ui/select";

export default function Cardsstarships() {

    const [responseArray, setResponseArray] = useState<Starship[]>([]);
    const [filter, setFilter] = useState<string>("");
    const [filteredData, setFilteredData] = useState<Starship[]>(responseArray);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [passengersFilter, setPassengersFilter] = useState<string>("all");
    const itemsPerPage = 5;
    const [arrayFetched, setArrayFetched] = useState(false);
    const [passengersArray, setPassengersArray] = useState<string[]>([]);
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                let url = 'http://localhost:3002/starships';
                if (passengersFilter !== 'all') {
                    url += `?passengers=${passengersFilter}`;
                }
                const response = await fetch(url, {
                    method: 'GET',
                });
                if (response.ok) {
                    const responsePassengers: Starship[] = await response.json();
                    setResponseArray(responsePassengers);

                    if (!arrayFetched) {
                        const passengersArray = responsePassengers
                        .map(starship => starship.passengers)
                        .filter(Boolean); // Esto elimina valores nulos o indefinidos
                      
                      const uniquePassengersArray = Array.from(new Set(passengersArray));

                      const sortedArray = uniquePassengersArray.sort((a, b) => {
                        if (a === 'n/a') return -1; // Mantener 'n/a' al principio
                        if (b === 'n/a') return 1;
                      
                        // Convertir strings a números, removiendo comas
                        const numA = parseInt(a.replace(/,/g, ''), 10);
                        const numB = parseInt(b.replace(/,/g, ''), 10);
                      
                        return numA - numB;
                      });
                      
                      setPassengersArray(sortedArray);
                      setArrayFetched(true);
                    }

                }
            } catch (error) {
                console.error('Error al realizar la petición:', error);
            }
        };
        fetchData();
    }, [passengersFilter]);

    useEffect(() => {
        const filtered = responseArray.filter((starship) =>
            starship.name.toLowerCase().includes(filter.toLowerCase())
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
                <div className="">
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
                    <p className="text-[15px] text-white text-center pb-2">Passengers:</p>
                    <Select value={passengersFilter} onValueChange={(value) => setPassengersFilter(value)}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="All" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Passengers</SelectLabel>
                                <SelectItem value="all">All</SelectItem>
                                {passengersArray.map((passenger, index) => (
                                    <SelectItem key={index} value={passenger}>
                                        {passenger}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="space-y-2 flex flex-col items-center sm:grid sm:grid-cols-2 sm:space-y-0 sm:gap-10 pt-6 lg:grid-cols-3 2xl:grid-cols-4">
                {currentData.map((starship, index) => (
                    <div
                        key={index}
                        className="sm:min-h-[420px] w-[260px] border border-slate-400 rounded-md bg-slate-800 pl-4 p-2 text-white text-[20px]"
                    >
                        <div className="h-[70px]">
                            <h3 className="font-bold text-[25px] text-slate-400 pb-2">
                                {starship.name}
                            </h3>
                        </div>
                        <p className="text-gray-300">MGLT: <span className="italic text-white">
                            {starship.MGLT}
                        </span>
                        </p>
                        <p className="text-gray-300">Cargo capacity: <span className="italic text-white">
                            {starship.cargo_capacity}
                        </span>
                        </p>
                        <p className="text-gray-300">Consumables: <span className="italic text-white">
                            {starship.consumables}
                        </span>
                        </p>
                        <p className="text-gray-300">Cost in credits: <span className="italic text-white">
                            {starship.cost_in_credits}
                        </span>
                        </p>
                        <p className="text-gray-300">Crew: <span className="italic text-white">
                            {starship.crew}
                        </span>
                        </p>
                        <p className="text-gray-300">Length: <span className="italic text-white">
                            {starship.length}
                        </span>
                        </p>
                        <p className="text-gray-300">Model: <span className="italic text-white">
                            {starship.model}
                        </span>
                        </p>
                        <p className="text-gray-300">Passengers: <span className="italic text-white">
                            {starship.passengers}
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
                    <ChevronLeftIcon width={24} height={24} />
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
                    <ChevronRightIcon width={24} height={24} />
                </button>
            </div>
        </div>
    );
}