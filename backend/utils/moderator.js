const axios = require('axios');

const getToxicityScore = async (text) => {
    try {
        const API_KEY = process.env.PERSPECTIVE_API_KEY;
        const URL = `https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze?key=${API_KEY}`;

        // Change from axios.get to axios.post
        const response = await axios.post(URL, {
            comment: {text: text},
            languages: ["en"], // Best practice: use 'languages' plural
            requestedAttributes: {
                TOXICITY: {},
                IDENTITY_ATTACK: {},
                INSULT: {}
            }
        });

        const attr = response.data.attributeScores;

        return {
            toxicity: attr.TOXICITY.summaryScore.value,
            identity: attr.IDENTITY_ATTACK.summaryScore.value,
            insult: attr.INSULT.summaryScore.value
        };

    } catch(err) {
        console.error("MODERATION API ERROR", err.message);
    }
};

module.exports = {getToxicityScore};