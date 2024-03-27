'use client'

import { People } from "@/lib/definitions";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input"
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/16/solid";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./ui/select";


export default function CardsPeople() {
    
    const [responseArray, setResponseArray] = useState<People[]>([]);
    const [filter, setFilter] = useState<string>("");
    const [filteredData, setFilteredData] = useState<People[]>(responseArray);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [genderFilter, setGenderFilter] = useState<string>("all");
    const itemsPerPage = 5;

    useEffect(() => {
        const fetchData = async () => {
            try {
                let url = 'http://localhost:3002/people';
                if (genderFilter !== 'all') {
                    url += `?gender=${genderFilter}`;
                }
                const response = await fetch(url, {
                    method: 'GET',
                });
                if (response.ok) {
                    const responsePeople: People[] = await response.json();
                    setResponseArray(responsePeople);
                }
            } catch (error) {
                console.error('Error al realizar la petición:', error);
            }
        };
        fetchData();
    }, [genderFilter]);
    
    useEffect(() => {
        const filtered = responseArray.filter((person) =>
            person.name.toLowerCase().includes(filter.toLowerCase())
        );
        setFilteredData(filtered);
        setCurrentPage(1);
    }, [filter, responseArray]);

    const totalPage = Math.ceil(filteredData.length / itemsPerPage);

    const currentData = filteredData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return(
        <div className="pt-6">
            <div className="flex items-center pb-4 space-x-4 justify-center">
                <div className="">
                    <p className="text-[15px] text-white text-center pb-2">Find by name:</p>
                    <Input 
                        type="email" 
                        placeholder="Find by name..." 
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="max-w-[200px]"
                    />
                </div>
                <div className="">
                    <p className="text-[15px] text-white text-center pb-2">Gender:</p>
                    <Select value={genderFilter} onValueChange={(value) => setGenderFilter(value)}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="All" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                            <SelectLabel>Gender</SelectLabel>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
            </div>
           
            <div className="space-y-2 grid grid-cols-1 sm:grid-cols-2 sm:space-y-0 sm:gap-10 pt-6 lg:grid-cols-3 2xl:grid-cols-4">
            {currentData.map((person, index) => (

                <div key={index} className="min-h-[280px] sm:min-h-[300px] w-[260px] border border-slate-400 rounded-md bg-slate-600 pl-4 p-2 text-white text-[20px]">
                    <div className="h-[50px]">
                        <h3 className="font-bold text-[25px] text-slate-400 pb-2">
                            {person.name}
                        </h3>
                    </div>
                    <p className="text-gray-300">Height: <span className="italic text-white">
                        {person.height}
                        </span>
                    </p>
                    <p className="text-gray-300">Birth year: <span className="italic text-white">
                        {person.birth_year}
                        </span>
                    </p>
                    <p className="text-gray-300">Eye color: <span className="italic text-white">
                        {person.eye_color}
                        </span>
                    </p>
                    <p className="text-gray-300">Gender: <span className="italic text-white">
                        {person.gender}
                        </span>
                    </p>
                    <p className="text-gray-300">Hair color: <span className="italic text-white">
                        {person.hair_color}
                        </span>
                    </p>
                    <p className="text-gray-300">Mass: <span className="italic text-white">
                        {person.mass}
                        </span>
                    </p>
                    <p className="text-gray-300">Skin color: <span className="italic text-white">
                        {person.skin_color}
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
    )
}