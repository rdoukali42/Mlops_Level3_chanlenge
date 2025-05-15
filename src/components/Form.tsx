
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useCsvData, MusicDataRow } from "@/utils/csvUtils";
import { toast } from "@/hooks/use-toast";

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

  const handleSubmit = async () => {
    const dataRow = fields.map((field) => {
      const value = formData[field];
      const type = fieldTypes[field as keyof typeof fieldTypes];
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
              className="bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary)]/90"
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
                className="bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary)]/90"
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
          <Button 
            onClick={handleSubmit}
            className="bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary)]/90"
          >
            Submit
          </Button>
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
