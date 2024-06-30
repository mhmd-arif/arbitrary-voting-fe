export type Caleg = {
  id: string;
  name: string;
};

export type Data = {
  id: string;
  partai: string;
  caleg: Caleg[];
};

export const generateData = (amount: number): Data[] => {
  const data: Data[] = Array.from({ length: amount }, (_, index) => {
    return {
      id: `id${index + 1}`,
      partai: `Partai ${index + 1}`,
      caleg: Array.from({ length: 7 }, (_, calegIndex) => ({
        id: `id${index + 1}-${calegIndex + 1}`,
        name: `Caleg ${index + 1}-${calegIndex + 1}`,
      })),
    };
  });

  return data;
};
