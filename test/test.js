const DocumentIntelligence = require('document-intelligence');

const options = {
    key: "your-key",
    endpoint: "your-endpoint"
};

const documentIntelligence = new DocumentIntelligence(options);

const formUrl = [
    "https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/sample-layout.pdf",
];

async function runTest() {
    try {
        const result = await documentIntelligence.analyzeDocuments(formUrl);
        console.log('Analysis Result:', result);
    } catch (error) {
        console.error('Error:', error);
    }
}

runTest();
