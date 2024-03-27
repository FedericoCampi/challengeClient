import { useEffect, useState } from "react";
import { Film } from "@/lib/definitions";
import { Input } from "./ui/input";
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/16/solid";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { format } from "date-fns";


export default function Cardsfilms() {

    const [filter, setFilter] = useState<string>("");
    const [responseArray, setResponseArray] = useState<Film[]>([]);
    const [filteredData, setFilteredData] = useState<Film[]>(responseArray);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [releaseFilter, setReleaseFilter] = useState<string>("all");
    const [selectedDate, setSelectedDate] = useState("");
    const itemsPerPage = 5;

    useEffect(() => {
        const fetchData = async () => {
            try {
                let url = 'http://localhost:3002/films';
                if (releaseFilter !== 'all') {
                    url += `?release=${releaseFilter}`;
                }
                const response = await fetch(url, {
                    method: 'GET',
                });
                if (response.ok) {
                    const responseFilms: Film[] = await response.json();
                    setResponseArray(responseFilms);
                }
            } catch (error) {
                console.error('Error al realizar la petición:', error);
            }
        };
        fetchData();
    }, [releaseFilter]);

    useEffect(() => {
        const filtered = responseArray.filter((film) =>
            film.title.toLowerCase().includes(filter.toLowerCase())
        );
        setFilteredData(filtered);
        setCurrentPage(1);
    }, [filter, responseArray]);

    const totalPage = Math.ceil(filteredData.length / itemsPerPage);

    const currentData = filteredData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleDateChange = (date: any) => {
        const formattedDate = format(date, 'yyyy-MM-dd');
        setSelectedDate(formattedDate);
        setReleaseFilter(formattedDate);
    };

    return (
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
                <div>
                    <p className="text-[15px] text-white text-center pb-2">Release before:</p>
                    <Popover>
                        <PopoverTrigger asChild>
                            <button className="p-2 border border-gray-300 rounded-md flex items-center bg-white">
                                <span>Pick a date</span>
                                <CalendarIcon className="ml-2 h-5 w-5" />
                            </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                onSelect={handleDateChange}
                                // aquí deberías incluir la lógica específica de tu calendario
                                // como onSelect, disabled, etc.
                            />
                        </PopoverContent>
                    </Popover>
                </div>
            </div>

            <div className="space-y-2 grid grid-cols-1 sm:grid-cols-2 sm:space-y-0 sm:gap-10 pt-6 lg:grid-cols-3 2xl:grid-cols-4">
                {currentData.map((film, index) => (
                    <div
                        key={index}
                        className="min-h-[280px] sm:min-h-[300px] w-[260px] border border-slate-400 rounded-md bg-slate-700 pl-4 p-2 text-white text-[20px]"
                    >
                        <div className="h-[70px]">
                            <h3 className="font-bold text-[25px] text-slate-400 pb-2">
                                {film.title}
                            </h3>
                        </div>
                        <p className="text-gray-300">
                            Director:{" "}
                            <span className="italic text-white">{film.director}</span>
                        </p>
                        <p className="text-gray-300">
                            Episode:{" "}
                            <span className="italic text-white">{film.episode_id}</span>
                        </p>
                        <p className="text-gray-300">
                            Producer:{" "}
                            <span className="italic text-white">{film.producer}</span>
                        </p>
                        <p className="text-gray-300">
                            Release:{" "}
                            <span className="italic text-white">{film.release_date}</span>
                        </p>
                    </div>
                ))}
            </div>
            <div className="flex justify-center items-center space-x-2 py-6">
                <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`p-1 ${currentPage === 1 ? 'bg-slate-400 cursor-not-allowed' : 'bg-slate-200'
                        }`}
                >
                    <ChevronLeftIcon width={24} height={24} />
                </button>
                {Array.from({ length: totalPage }, (_, i) => i + 1).map(page => (
                    <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        disabled={currentPage === page}
                        className={`bg-slate-200 p-1 ${currentPage === page ? 'bg-slate-500 text-white' : ''
                            }`}
                    >
                        {page}
                    </button>
                ))}
                <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPage}
                    className={`p-1 ${currentPage === totalPage ? 'bg-slate-400 cursor-not-allowed' : 'bg-slate-200'
                        }`}
                >
                    <ChevronRightIcon width={24} height={24} />
                </button>
            </div>
        </div>
    );
}
