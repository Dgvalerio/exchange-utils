/* eslint-disable @typescript-eslint/no-explicit-any */

export const joinLists = <Item>(list: Item[][]): Item[] =>
  list.reduce((previousValue, current) => previousValue.concat(current));

export const orderByDate = <Item>(
  list: Item[],
  dateKey: keyof Item,
  ord: 'asc' | 'desc'
): Item[] =>
  list.sort((previous, current) => {
    const p = new Date((previous as any)[dateKey]);
    const c = new Date((current as any)[dateKey]);

    return ord === 'asc'
      ? p.getTime() - c.getTime()
      : c.getTime() - p.getTime();
  });

export const formatDate = (date: string): string =>
  new Date(date).toLocaleDateString('pt-BR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
