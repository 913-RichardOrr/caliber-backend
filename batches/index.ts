import axios from 'axios';

function handler() {
	// call getBatchesLambda and return response
}

function getBatchesLambda() {
	let caliberURI: string =
		'https://caliber2-mock.revaturelabs.com:443/mock/training/batch';

	let batchIDs = [];
	//get batchIDs

	let batchInfo = [];

	for (let batch of batchIDs) {
		axios.get(`${caliberURI}/${batch}`).then(() => {
			//transform batch info and add to batchInfo array
		});
	}
}
