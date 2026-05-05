const axios = require('axios');
const vision = require('@google-cloud/vision');

const visionClient = new vision.ImageAnnotatorClient();

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

const moderateImage = async (imageUrl) => {
    try{
        const [safeSearchResult] = await visionClient.safeSearchDetection(imageUrl);
        const safeSearch = safeSearchResult.safeSearchAnnotation;

        const isNsfw = ['LIKELY', 'VERY_LIKELY'].includes(safeSearch.adult);
        const isViolent = ['LIKELY', 'VERY_LIKELY'].includes(safeSearch.violence);

        const [textResult] = await visionClient.textDetection(imageUrl);
        const extractedText = textResult.fullTextAnnotation ? textResult.fullTextAnnotation.text : "";

        let isTextToxic = false;
        if (extractedText.trim().length > 0) {
            const scores = await getToxicityScore(textResult, extractedText);
            if (scores&&scores.toxicity>0.8){
                isTextToxic = true;
            }
        }
        return {
            isSafe: !isNsfw && !isViolent && !isTextToxic,
            reason: isNsfw ? "Explicit visual content detected" :
                isViolent ? "Violent visual content detected" :
                    isTextToxic ? "Toxic text detected within the image" : null
        };

    }catch(err){
        console.error("IMAGE MODERATION ERROR:", err);
    }
}



module.exports = {getToxicityScore, moderateImage};