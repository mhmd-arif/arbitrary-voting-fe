type Item = {
  id: string;
  data: {
    name: string;
    slug: string;
  };
  header: string;
};

type Header = {
  id: string;
  name: string;
};

type Data = {
  Header: Header[];
  Item: Item[];
};

function generateData(amount: number): Data {
  const headers: Header[] = [];
  const items: Item[] = [];

  for (let i = 1; i <= 5; i++) {
    const header: Header = {
      id: `6645cb32b338a76195e5230b${i}`,
      name: `Header ${i}`,
    };

    headers.push(header);

    for (let j = 0; j < amount; j++) {
      const item: Item = {
        id: `6645cb32b338a76195e5230b${j}`,
        data: {
          name: `name${j + 1}` + `Header ${i}`,
          slug: `headline${i}${j + 1}`,
        },
        header: header.name,
      };

      items.push(item);
    }
  }

  return { Header: headers, Item: items };
}

export type { Item, Data, Header };
export { generateData };
