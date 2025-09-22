## Starting server locally (I use venv environment for example)

1) Create `./models` directory and place there models, downloaded from this links `https://huggingface.co/NousResearch/Nous-Hermes-2-Mistral-7B-DPO-GGUF?show_file_info=Nous-Hermes-2-Mistral-7B-DPO.Q4_K_M.gguf`, `https://huggingface.co/TheBloke/TinyLlama-1.1B-Chat-v1.0-GGUF?show_file_info=tinyllama-1.1b-chat-v1.0.Q4_K_M.gguf`
2) Place your front end endpoint into `.env`. EXAMPLE: `FRONTEND_ORIGIN=http://localhost:5173`
3) Run `sudo apt update` and `sudo apt install python3 python3-venv python3-pip` (if you dont have environment yet),
4) Run `sudo apt install ffmpeg` for working with audio inputs,
5) Switch to project directory and run `python3 -m venv venv` to create virtual environment,
6) Run `source venv/bin/activate` to activate virtual environment,
7) Run `pip install -r requirements.txt` to install dependencies (do it after any change in requirements.txt),
8) Run server with `uvicorn main:app --reload`

## How to Build, Deploy and Run the Frontend (Chrome Extension)

1. Checkout to the branch `main`.
1. Run `npm i`, `npm run build` (folder `dist` should be generated in the root of project).
1. Open your browser's `Extentions` -> `Manage extensions`.
1. Enable Developer mode in the top right corner.
1. Click on `Load unpacked` and choose `dist` directory within the current project.
1. Now `AI Sales Assistant` is in your extentions list.
1. Start server (see [emotion-recognizer] https://github.com/dabogdan/sales-assistant-mono)
1. Open any online stream service within you browser (Youtube) tab and start to play any video or audio stream with English speech human voice
1. Next, open `AI Sales Assistant` (click its icon `A` in the extension bar)
1. In the new opened window press `Start Capturing` button and wait for advising

Your can modify `chrome-extension/public/manifest.json` file for further developing if it need.


## Interaction with server

#### POST /auto-suggest
Automatically suggests domain and answers based on business type.
###### Request format: `{ "business": string }`.
###### Response format:  `{ "domain": "string", "suggestions": string[] }`

#### POST /suggest-domains
Offers a list of domains based on business.
###### Request format: `{ "business": string }`.
###### Response format:  `{ "domains": string[] }`

#### POST /suggest-keywords
Generates keywords for the specified domain and business.
###### Request format: `{ "domain": string, "business": string }`.
###### Response format:  `{ "keywords": string[] }`

#### POST /generate-suggestions
generates short answers in a given domain and business.
###### Request format: `{ "domain": string, "business": string }`.
###### Response format:  `{ "suggestions": string[] }`

#### WebSocket /ws/summary
Real-time interaction.
Gives transcrip, emotions from audio, emotions from text, keywords from text, classifies domain and gives emotionally aware instructions how to interact with client. Each model gives response when ready.
###### Request example:
  `{
  "audio": "BASE64_AUDIO_CHUNK",
  "timestamp": 1717762000,
  "keywords_map": {
    "shipping": ["tracking number", "delivery time"]
  },
  "domain_response_map": {
    "shipping": "We offer tracking and fast delivery."
  }
}`.

###### Responses example:  
###### Transcript -
`{
  "type": "transcript",
  "transcript": "I would like to know my delivery status"
}`,
###### Audio emotion
`{
  "type": "audio_emotion",
  "audio_emotion": {
    "label": "Frustration",
    "score": 86.0
  }
}`,
###### Text emotions
`{
  "type": "text_emotions",
  "text_emotions": [
    { "label": "Anger", "score": 76.5 },
    { "label": "Frustration", "score": 64.3 }
  ]
}`,
###### Keywords
`{
  "type": "keywords",
  "keywords": ["delivery", "status"]
}`,
###### Domain classification
`{
  "type": "classification",
  "domain": "shipping",
  "desired_response": "We offer tracking and fast delivery."
}`,
###### Final summary
`{
  "type": "final_response",
  "emotionally_aware_response": "I understand you're frustrated, let me help you track your order right away."
}`

## Run tests

1) Run `pytest -v
