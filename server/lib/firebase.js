const fs = require("firebase-admin");
const path = require("path");
const serviceAccount = require("../tiem8-chatbot-firebase-adminsdk-dqmsm-a1cbcaec4f.json");
const dialogflow = require("@google-cloud/dialogflow");

fs.initializeApp({
  credential: fs.credential.cert(serviceAccount),
});

const sessionClient = new dialogflow.SessionsClient({
  keyFilename: path.join(
    __dirname,
    "../online-shopping-lsak-b5338bee976e.json"
  ),
});

async function detectIntent(sessionId, query, contexts, languageCode) {
  const projectId = "online-shopping-lsak";

  // The path to identify the agent that owns the created intent.
  const sessionPath = sessionClient.projectAgentSessionPath(
    projectId,
    sessionId
  );
  // The text query request.
  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: query,
        languageCode: languageCode,
      },
    },
  };

  if (contexts && contexts.length > 0) {
    request.queryParams = {
      contexts: contexts,
    };
  }

  const responses = await sessionClient.detectIntent(request);
  return responses[0];
}

module.exports = {
  db: fs.firestore(),
  fs,
  sessionClient,
  detectIntent,
};
