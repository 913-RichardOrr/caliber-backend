import createResponse from "../response";
import { AllBatchInfo, getAllBatchesLambda } from "./getAllBatchesLambda";
import { MyEvent, BatchInfo, handler as getBatchesByTrainer } from "./getBatchesLambda";
import { getValidYearsLambda } from "./getValidYearsLambda";

// export interface MyEvent {
//   queryStringParameters: {
//     trainerEmail: string;
//   };
// }

// export interface BatchInfo {
// 	id: string;
// 	batchId: string;
// 	name: string;
// 	startDate: string;
// 	endDate: string;
// 	skill: string;
// 	location: string;
// 	type: string;
// 	trainer?: string;
// }

export default async function handler(event: MyEvent) {
  let batchInfo: BatchInfo[]|AllBatchInfo[] = [];
  let validYears: string;
  if (!event.queryStringParameters.trainerEmail) {
    let batchInfoResponse = await getAllBatchesLambda();
	if (batchInfoResponse) {
		batchInfo = batchInfoResponse
	}
  } else {
    batchInfo = JSON.parse(await (await getBatchesByTrainer(event)).body);
  }
  validYears = JSON.parse(await (await getValidYearsLambda()).body);
  let comboBody = { validYears: validYears, batches: batchInfo };
  return createResponse(comboBody, 200);
}
