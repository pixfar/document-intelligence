const { AzureKeyCredential, DocumentAnalysisClient } = require("@azure/ai-form-recognizer");

class DocumentIntelligence {
    constructor(options) {
        this.key = options.key;
        this.endpoint = options.endpoint;
    }

    async analyzeDocuments(urls) {
        const client = new DocumentAnalysisClient(this.endpoint, new AzureKeyCredential(this.key));
        const results = [];

        for (const url of urls) {
            try {
                const poller = await client.beginAnalyzeDocumentFromUrl("prebuilt-document", url);
                const { keyValuePairs } = await poller.pollUntilDone();

                if (!keyValuePairs || keyValuePairs.length <= 0) {
                    results.push({
                        url,
                        status: "failed",
                        payload: [],
                    });
                } else {
                    const keyValueObject = {};

                    for (const { key, value, confidence } of keyValuePairs) {
                        // Remove special characters, newline characters, and whitespace from field names
                        const fieldName = key.content.replace(/[:?#\n\s]/g, "");

                        keyValueObject[fieldName] = {
                            value: value ? value.content : "<undefined>",
                            confidence: confidence,
                        };
                    }

                    results.push({
                        url,
                        status: "success",
                        payload: [keyValueObject],
                    });
                }
            } catch (error) {
                results.push({
                    url,
                    status: "failed",
                    payload: [],
                });
            }
        }

        const resultsJson = JSON.stringify(results, null, 2);
        return resultsJson;
    }
}

module.exports = DocumentIntelligence;