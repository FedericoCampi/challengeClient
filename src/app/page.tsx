'use client'

import ContainerCards from "@/components/containerCards";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowBigUp } from "lucide-react";
import { useState } from "react";

export default function Home() { 

  const [isTabSelected, setIsTabSelected] = useState(false);

  const handleTabClick = () => {
    setIsTabSelected(true);
  };

  return (
    <main className="bg-slate-500 min-h-screen w-full">
      <h4 className="text-center pt-10 text-[25px] font-bold text-slate-400">Api: https://swapi.dev/</h4>
      <Tabs defaultValue="account" className="w-full flex flex-col justify-center items-center pt-10">
        <TabsList className="flex" onClick={handleTabClick}>
          <TabsTrigger value="people" className="w-[70px]">People</TabsTrigger>
          <TabsTrigger value="films" className="w-[70px]">Films</TabsTrigger>
          <TabsTrigger value="starships" className="w-[70px]">Starships</TabsTrigger>
          <TabsTrigger value="planets" className="w-[70px]">Planets</TabsTrigger>
        </TabsList>
        <TabsContent value="people">
          <ContainerCards type={"people"}/>
        </TabsContent>
        <TabsContent value="films">
          <ContainerCards type={"films"}/>
        </TabsContent>
        <TabsContent value="starships">
          <ContainerCards type={"starships"}/>
        </TabsContent>
        <TabsContent value="planets">
          <ContainerCards type={"planets"}/>
        </TabsContent>
      </Tabs>
      {!isTabSelected && (
        <div className="text-center text-white animate-bounce mt-20 flex flex-col justify-center items-center">
          <ArrowBigUp/>
          <p >
            Choose one
          </p>
        </div>
      )}
    </main>
  );
}
