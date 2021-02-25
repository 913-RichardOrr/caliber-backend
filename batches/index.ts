import createResponse from "../response";
import { getAllBatchesLambda } from "./getAllBatchesLambda";
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
  let batchInfo: BatchInfo[] = [];
  let validYears: string;
  if (!event.queryStringParameters.trainerEmail) {
    let batchInfoResponse = await getAllBatchesLambda();
	if (batchInfoResponse) {
		batchInfo = batchInfoResponse
	}
  } else {
		let bodyTrainer = await getBatchesByTrainer(event)
		batchInfo = JSON.parse(bodyTrainer.body);
  }
  let bodyYears = await getValidYearsLambda()
  validYears = JSON.parse(bodyYears.body);
  let comboBody = { validYears: validYears, batches: batchInfo };
  return createResponse(comboBody, 200);
}
