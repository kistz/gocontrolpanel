import { formatTime } from '@/lib/utils';

export default function TimeDisplay({ time }: { time: number }) {
  return <div>{formatTime(time)}</div>;
}