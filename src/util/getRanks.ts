type RankAbleItem<T> = T & {
  wins: number
}
type RankedItem<T> = T & { wins: number; rank: number }

export default function getRanks<T>(items: RankAbleItem<T>[]): RankedItem<T>[] {
  const sorted = [...items].sort((a,b) => b.wins-a.wins);
  let rank = 0;
  let nextHighestScore = Infinity;
  for (const item of sorted) {
    if (item.wins !== nextHighestScore)
      rank++;
    (item as unknown as RankedItem<T>).rank = rank;
    nextHighestScore = item.wins;
  }
  return sorted as RankedItem<T>[] ;
}