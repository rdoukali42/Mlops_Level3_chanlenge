
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useCsvData, MusicDataRow } from "@/utils/csvUtils";
import { toast } from "@/hooks/use-toast";
import { LabelEncoder } from '@/utils/labelEncoder'; // Import a utility for label encoding
import { MessageSquare } from "lucide-react"; // Import the chat icon

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
  artist_name: "string",
  track_name: "string",
  year: "float",
  genre: "string",
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

const labelEncoder = new LabelEncoder(); // Initialize the label encoder

export default function MusicDataForm() {
  const [formData, setFormData] = useState<MusicDataRow>({} as MusicDataRow);
  const [jsonOutput, setJsonOutput] = useState(null);
  const [resultMessage, setResultMessage] = useState("");
  const [rowIndex, setRowIndex] = useState<string>("");
  
  const { getRandomRow, getRowByIndex, loading, error } = useCsvData();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const fillFormWithData = (data: MusicDataRow | null) => {
    if (!data) {
      toast({
        title: "Error",
        description: "No data available to fill the form",
        variant: "destructive",
      });
      return;
    }
    
    setFormData(data);
  };

  const handleAutoFill = () => {
    const randomRow = getRandomRow();
    fillFormWithData(randomRow);
  };

  const handleFillByIndex = () => {
    const index = parseInt(rowIndex, 10);
    if (isNaN(index)) {
      toast({
        title: "Invalid Index",
        description: "Please enter a valid number between 0 and 99",
        variant: "destructive",
      });
      return;
    }
    
    const rowData = getRowByIndex(index);
    if (!rowData) {
      toast({
        title: "Invalid Index",
        description: `No data found at index ${index}. Please enter a number between 0 and 99`,
        variant: "destructive",
      });
      return;
    }
    fillFormWithData(rowData);
  };

  const prepareSubmitData = () => {
    const dataRow = fields.map((field) => {
      let value = formData[field];
      const type = fieldTypes[field as keyof typeof fieldTypes];

      // Apply label encoding for specific fields
    //   if (['artist_name', 'track_name', 'genre'].includes(field)) {
    //     // Always convert value to string before encoding
    //     const stringValue = String(value || '');
    //     value = labelEncoder.encode(stringValue);
    //   }

      // Convert to the proper type for the API request
      if (type === 'int') return parseInt(String(value));
      if (type === 'float') return parseFloat(String(value));
      return value;
    });

    return {
      dataframe_split: {
        index: [1],
        columns: fields,
        data: [dataRow]
      }
    };
  };

  const handleSubmit = async () => {
    const result = prepareSubmitData();
    setJsonOutput(result);
    console.log(JSON.stringify(result));

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
      console.log("API Response:", data)
      const prediction = data.prediction[0];
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

  const handleSubmitToChat = () => {
  const result = prepareSubmitData();
  const jsonString = JSON.stringify(result, null, 2);

  if (navigator.clipboard) {
    navigator.clipboard.writeText(jsonString)
      .then(() => {
        toast({
          title: "Copied to Clipboard",
          description: "Form data JSON has been copied successfully.",
        });
      })
      .catch(() => {
        toast({
          title: "Error",
          description: "Failed to copy data to clipboard.",
          variant: "destructive",
        });
      });
  } else {
    toast({
      title: "Error",
      description: "Clipboard API not supported in this browser.",
      variant: "destructive",
    });
  }
};


  if (loading) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <Card>
          <CardContent className="py-6">
            <p>Loading CSV data...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <Card>
          <CardContent className="py-6">
            <p className="text-red-500">Error: {error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-4">
      <Card>
        <CardContent className="space-y-4 py-6">
          <div className="flex gap-4 mb-4">
            <Button 
              onClick={handleAutoFill}
              className="bg-[#5CD8B1] text-[var(--primary-foreground)] hover:bg-[var(--primary)]/90"
            >
              AutoFill
            </Button>
            <div className="flex-1 flex gap-2">
              <Input
                type="number"
                min="0"
                max="99"
                placeholder="Row Index (0-99)"
                value={rowIndex}
                onChange={(e) => setRowIndex(e.target.value)}
                className="flex-1"
              />
              <Button 
                onClick={handleFillByIndex}
                className="bg-[#5CD8B1] text-[var(--primary-foreground)] hover:bg-[var(--primary)]/90"
              >
                FillByIndex
              </Button>
            </div>
          </div>
          
          {fields.map((field) => (
            <Input
              key={field}
              name={field}
              placeholder={field}
              value={formData[field] || ""}
              onChange={handleChange}
            />
          ))}
          
          <div className="flex gap-4">
            <Button 
              onClick={handleSubmit}
              className="bg-[#5CD8B1] text-[var(--primary-foreground)] hover:bg-[var(--primary)]/90"
            >
              Submit
            </Button>
            <Button 
              onClick={handleSubmitToChat}
              className="bg-[#5CD8B1] text-[var(--primary-foreground)] hover:bg-[var(--primary)]/90"
              title="Send to Chat"
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Copy
            </Button>
          </div>
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
