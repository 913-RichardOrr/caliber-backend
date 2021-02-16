import axios from 'axios';

function handler() {
	// call getBatchesLambda and return response
}

export function getBatchesLambda() {
	let caliberURI: string =
		'https://caliber2-mock.revaturelabs.com:443/mock/training/batch';

	let batchIDs: string[] = [];
	//get batchIDs

	let batchInfo = [];

	for (let batchID of batchIDs) {
		axios.get(`${caliberURI}/${batchID}`).then(() => {
			//transform batch info and add to batchInfo array
		});
	}
}
