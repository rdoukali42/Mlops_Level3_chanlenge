
import { useState, useEffect } from 'react';

export interface MusicDataRow {
  artist_name: string;
  track_name: string;
  year: string;
  genre: string;
  danceability: string;
  energy: string;
  key: string;
  loudness: string;
  mode: string;
  speechiness: string;
  acousticness: string;
  instrumentalness: string;
  liveness: string;
  valence: string;
  tempo: string;
  duration_ms: string;
  time_signature: string;
  [key: string]: string; // Add index signature to allow string indexing
}

export const useCsvData = () => {
  const [csvData, setCsvData] = useState<MusicDataRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCsvData = async () => {
      try {
        const response = await fetch('/lovable-uploads/spotify_data.csv');
        const csvText = await response.text();
        
        // Parse CSV
        const rows = csvText.split('\n');
        const headers = rows[0].split(',');
        
        const parsedData = rows.slice(1).map(row => {
          const values = row.split(',');
          const rowData = {} as MusicDataRow;
          
          headers.forEach((header, index) => {
            rowData[header.trim()] = values[index]?.trim() || '';
          });
          
          return rowData;
        }).filter(row => Object.values(row).some(value => value !== ''));
        
        setCsvData(parsedData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching CSV:', err);
        setError('Failed to load CSV data');
        setLoading(false);
      }
    };

    fetchCsvData();
  }, []);

  const getRandomRow = (): MusicDataRow | null => {
    if (csvData.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * csvData.length);
    return csvData[randomIndex];
  };

  const getRowByIndex = (index: number): MusicDataRow | null => {
    if (index < 0 || index >= csvData.length || csvData.length === 0) return null;
    return csvData[index];
  };

  return { csvData, loading, error, getRandomRow, getRowByIndex };
};
