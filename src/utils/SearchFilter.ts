import IFormatPool from 'src/struct/IFormatPool';

export function SearchFilter(data: IFormatPool[], search: string): any {
  const filter = search.toUpperCase();
  const filteredData = data.filter((pool) => {
    const { token1, token2 } = pool;
    const tokenMatch = token1.includes(filter) || token2?.includes(filter);
    return tokenMatch;
  });
  return filteredData;
}
