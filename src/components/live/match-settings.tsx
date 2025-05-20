interface MatchSettingsProps {
  pointsLimit?: number;
  roundsLimit?: number;
  mapLimit?: number;
  nbWinners?: number;
}

export default function MatchSettings({
  pointsLimit,
  roundsLimit,
  mapLimit,
  nbWinners,
}: MatchSettingsProps) {
  return (
    <div className="flex justify-center">
      <div className="text-lg font-bold">
        {[
          pointsLimit && `Points Limit ${pointsLimit}`,
          roundsLimit && `Rounds Limit ${roundsLimit}`,
          mapLimit && `Map Limit ${mapLimit}`,
          nbWinners && `Winners ${nbWinners}`,
        ]
          .filter(Boolean)
          .map((item, idx, arr) => (
            <span key={idx} className="text-nowrap">
              {item}
              {idx < arr.length - 1 && <span className="mx-2">|</span>}
            </span>
          ))}
      </div>
    </div>
  );
}
