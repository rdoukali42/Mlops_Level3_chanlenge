import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";


const FILE_API_ENDPOINT = "http://localhost:5002/invocations";
const FETCH_TIMEOUT = 300000; // 5 minutes in milliseconds

const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT);

const fields = [
  'artist_name', "track_name", "year", "genre",
  "danceability", "energy", "key", "loudness", "mode",
  "speechiness", "acousticness", "instrumentalness", "liveness",
  "valence", "tempo", "duration_ms", "time_signature"
];

const fieldTypes = {
  artist_name: "float",
  track_name: "float",
  year: "float",
  genre: "int",
  danceability: "float",
  energy: "float",
  key: "float",
  loudness: "float",
  mode: "int",
  speechiness: "float",
  acousticness: "float",
  instrumentalness: "float",
  liveness: "float",
  valence: "float",
  tempo: "float",
  duration_ms: "int",
  time_signature: "int",
};

export default function MusicDataForm() {
  const [formData, setFormData] = useState({});
  const [jsonOutput, setJsonOutput] = useState(null);
  const [resultMessage, setResultMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    const dataRow = fields.map((field) => {
      const value = formData[field];
      const type = fieldTypes[field];
      if (type === "int") return parseInt(value);
      if (type === "float") return parseFloat(value);
      return value;
    });

    const result = {
      dataframe_split: {
        index: [1],
        columns: fields,
        data: [dataRow]
      }
    };

    setJsonOutput(result);
    console.log(JSON.stringify(result));

    // try {
    //   const response = await fetch("https://your-endpoint.com/api/predict", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json"
    //     },
    //     body: JSON.stringify(result)
    //   });
    //   const data = await response.json();
    //   const prediction = data.predictions[0];
    //   setResultMessage(prediction === 1 ? "Popular" : "Unpopular");
    // } catch (error) {
    //   console.error("Error fetching prediction:", error);
    //   setResultMessage("Error occurred while fetching prediction");
    // }
    try {
    const response = await fetch(FILE_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(result),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Failed to read error response.');
      console.error(`API Error ${response.status}: ${errorText}`);
      setResultMessage("Input Error");
      return { status: 'error', message: `API Error: ${response.status}. ${errorText}`, userMessage: result };
    }
    
    const data = await response.json();
    const prediction = data.predictions;
    setResultMessage(prediction === 1 ? "Popular" : "Unpopular");

  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      console.error('Request timed out in sendChatresult:', error);
      return { status: 'error', result: 'The request timed out. Please try again.', userMessage: result };
    }
    console.error('Network or unexpected error in sendChatMessage:', error);
    return { status: 'error', message: error instanceof Error ? error.message : 'An unknown error occurred.', userMessage: result };
  }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-4">
      <Card>
        <CardContent className="space-y-4 py-6">
          {fields.map((field) => (
            <Input
              key={field}
              name={field}
              placeholder={field}
              value={formData[field] || ""}
              onChange={handleChange}
            />
          ))}
          <Button onClick={handleSubmit}>Submit</Button>
        </CardContent>
      </Card>
      {resultMessage && (
        <pre className="bg-white-100 p-4 rounded text-[#5CD8B1] overflow-x-auto">
          {resultMessage}
        </pre>
      )}
    </div>
  );
}

