interface MatchSettingsProps {
  pointsLimit?: number;
  roundsLimit?: number;
  mapLimit?: number;
}

export default function MatchSettings({
  pointsLimit,
  roundsLimit,
  mapLimit,
}: MatchSettingsProps) {
  return (
    <div className="flex justify-center">
      <div className="flex text-md font-bold">
        {[
          pointsLimit && `Points Limit ${pointsLimit}`,
          roundsLimit && `Rounds Limit ${roundsLimit}`,
          mapLimit && `Map Limit ${mapLimit}`,
        ]
          .filter(Boolean)
          .map((item, idx, arr) => (
            <span key={idx}>
              {item}
              {idx < arr.length - 1 && <span className="mx-2">|</span>}
            </span>
          ))}
      </div>
    </div>
  );
}
