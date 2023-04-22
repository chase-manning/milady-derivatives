import { useEffect, useState } from "react";

export interface MiladyType {
  openseaId: string;
  name: string;
  parent: string;
  description: string;
  chainId: number;
  image: string;
  volume: number;
  website?: string;
}

const useMiladys = () => {
  const [miladys, setMiladys] = useState<MiladyType[] | null>(null);

  const getMiladys = async () => {
    const res = await fetch("/api/data.json");
    const data = await res.json();
    setMiladys(data);
  };

  useEffect(() => {
    getMiladys();
  }, []);

  return miladys?.sort((a, b) => b.volume - a.volume);
};

export default useMiladys;
