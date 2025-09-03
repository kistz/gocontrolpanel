import {
  ECMDriverFinishArgs,
  ECMRoundEndArgs,
} from "@/types/api/ecircuitmania";
import "server-only";
import { axiosECM } from "../axios/ecircuitmania";

export async function ecmOnDriverFinish(
  apiKey: string,
  body: ECMDriverFinishArgs,
): Promise<void> {
  const { matchId, authToken } = getMatchIdAndAuthToken(apiKey);

  await axiosECM.post("/match-addRoundTime?matchId=" + matchId, body, {
    headers: {
      Authorization: authToken,
    },
  });
}

export async function ecmOnRoundEnd(
  apiKey: string,
  body: ECMRoundEndArgs,
): Promise<void> {
  const { matchId, authToken } = getMatchIdAndAuthToken(apiKey);

  await axiosECM.post("/match-addRound?matchId=" + matchId, body, {
    headers: {
      Authorization: authToken,
    },
  });
}

function getMatchIdAndAuthToken(apiKey: string): {
  matchId: string;
  authToken: string;
} {
  const [matchId, authToken] = apiKey.split("_");
  if (!matchId || !authToken) {
    throw new Error("Invalid ECM API key");
  }
  return { matchId, authToken };
}
