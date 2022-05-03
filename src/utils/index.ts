/* eslint-disable @typescript-eslint/no-explicit-any */

export const joinLists = <Item>(list: Item[][]): Item[] =>
  list.reduce((previous, current) => previous.concat(current));

export const joinListsWithoutDuplicates = <Item>(
  list: Item[][],
  fieldName: keyof Item
): Item[] =>
  list.reduce((previous, current) => {
    const nonDuplicates = current.filter(
      (curr) =>
        !previous.find(
          (prev) => (curr as any)[fieldName] === (prev as any)[fieldName]
        )
    );

    return previous.concat(nonDuplicates);
  });

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
