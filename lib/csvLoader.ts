// Utility untuk load dan parse CSV data

export interface CSVProvinsi {
  code: string;
  parent_code: string;
  name: string;
}

export interface CSVKabupaten {
  code: string;
  parent_code: string;
  name: string;
}

export interface CSVKecamatan {
  code: string;
  parent_code: string;
  name: string;
}

export interface CSVDesa {
  code: string;
  parent_code: string;
  name: string;
}

// Parse CSV string to array of objects
function parseCSV<T>(csvText: string): T[] {
  const lines = csvText.trim().split('\n');
  const headers = lines[0].split(',');
  
  return lines.slice(1).map(line => {
    const values = line.split(',');
    const obj: any = {};
    headers.forEach((header, index) => {
      obj[header.trim()] = values[index]?.trim() || '';
    });
    return obj as T;
  });
}

// Load CSV data
export async function loadProvinsiData(): Promise<CSVProvinsi[]> {
  const response = await fetch('/provinsi.csv');
  const text = await response.text();
  return parseCSV<CSVProvinsi>(text);
}

export async function loadKabupatenData(): Promise<CSVKabupaten[]> {
  const response = await fetch('/kabupaten.csv');
  const text = await response.text();
  return parseCSV<CSVKabupaten>(text);
}

export async function loadKecamatanData(): Promise<CSVKecamatan[]> {
  const response = await fetch('/kecamatan.csv');
  const text = await response.text();
  return parseCSV<CSVKecamatan>(text);
}

export async function loadDesaData(): Promise<CSVDesa[]> {
  const response = await fetch('/desa.csv');
  const text = await response.text();
  return parseCSV<CSVDesa>(text);
}

// Helper functions
export function getKabupatenByProvinsi(kabupatenList: CSVKabupaten[], provinsiCode: string): CSVKabupaten[] {
  return kabupatenList.filter(kab => kab.parent_code === provinsiCode);
}

export function getKecamatanByKabupaten(kecamatanList: CSVKecamatan[], kabupatenCode: string): CSVKecamatan[] {
  return kecamatanList.filter(kec => kec.parent_code === kabupatenCode);
}

export function getDesaByKecamatan(desaList: CSVDesa[], kecamatanCode: string): CSVDesa[] {
  return desaList.filter(desa => desa.parent_code === kecamatanCode);
}
