import {
  ECMDriverFinishArgs,
  ECMRoundEndArgs,
} from "@/types/api/ecircuitmania";
import "server-only";
import { axiosECM } from "../axios/ecircuitmania";

export async function ecmOnDriverFinish(
  serverId: string,
  body: ECMDriverFinishArgs,
): Promise<void> {
  await axiosECM.post("/match-addRoundTime", body, {
    headers: {
      Authorization: serverId,
    },
  });
}

export async function ecmOnRoundEnd(
  serverId: string,
  body: ECMRoundEndArgs,
): Promise<void> {
  await axiosECM.post("/match-addRound", body, {
    headers: {
      Authorization: serverId,
    },
  });
}
