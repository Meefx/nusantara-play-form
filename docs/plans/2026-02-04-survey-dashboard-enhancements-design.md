# Survey Dashboard Enhancements Design

**Date:** 2026-02-04
**Status:** Approved
**Author:** Claude Opus 4.5

## Overview

Enhancement of the survey management dashboard with 5 new features:
1. Export to Excel
2. Filter by Provinsi
3. Filter by Kota/Kabupaten
4. Statistics count per Provinsi
5. Statistics count per Kota/Kabupaten

## Architecture & File Structure

### Files to Modify
- `app/management/dashboard/page.tsx` - Main dashboard UI
- `app/api/survey/route.ts` - Survey API with filter and statistics support

### New Files
- `app/api/survey/export/route.ts` - Excel export API endpoint

### Dependencies
- `exceljs` - Excel file generation library

## Data Model

### State Management (Dashboard)

New state additions to `app/management/dashboard/page.tsx`:

```typescript
const [provinsiFilter, setProvinsiFilter] = useState("");
const [kabKotaFilter, setKabKotaFilter] = useState("");
const [provinsiList, setProvinsiList] = useState<string[]>([]);
const [kabKotaList, setKabKotaList] = useState<string[]>([]);
const [statistics, setStatistics] = useState<Statistics | null>(null);
const [isExporting, setIsExporting] = useState(false);

interface Statistics {
    byProvinsi: Record<string, number>;
    byKabKota: Record<string, number>;
    uniqueProvinsi: string[];
    uniqueKabKota: string[];
}
```

### API Response Structure

GET `/api/survey?includeStats=true` response:

```typescript
{
    success: true,
    data: Survey[],
    pagination: {
        page: number,
        limit: number,
        total: number,
        totalPages: number,
        hasNextPage: boolean,
        hasPrevPage: boolean
    },
    statistics: {
        byProvinsi: { "Jawa Barat": 15, "Jawa Timur": 12, ... },
        byKabKota: { "Bandung": 8, "Surabaya": 7, ... },
        uniqueProvinsi: ["Jawa Barat", "Jawa Timur", ...],
        uniqueKabKota: ["Bandung", "Surabaya", ...]
    }
}
```

## UI Components Design

### 1. Filter Section

Enhanced filter layout (replacing current filter section at lines 242-277):

```
[Search Input - Full Width]
[Provinsi Dropdown] [Kota/Kab Dropdown] [Status Dropdown] [Export Excel Button] [Refresh Button]
```

**Provinsi Filter:**
- Auto-populated from unique values in database
- On change: reset page to 1, clear kabKota filter, refresh data
- Option: "Semua Provinsi" as default

**Kota/Kabupaten Filter:**
- Dependent on provinsi selection
- Disabled when no provinsi selected
- Auto-populated based on selected provinsi
- On change: reset page to 1, refresh data
- Option: "Semua Kota/Kab" as default

**Export Excel Button:**
- Icon: 📥
- Color: Green (bg-green-600 hover:bg-green-700)
- Label: "📥 Export Excel"
- Loading state: "⏳ Exporting..." (disabled during export)
- Disabled when no data available

### 2. Statistics Cards

New cards row added below existing stats (Total Survey, Completed, Draft):

```
Row 1: [Total Survey] [Completed] [Draft]
Row 2: [Jumlah per Provinsi (col-span-3)] [Jumlah per Kota/Kab (col-span-3)]
```

**Provinsi Statistics Card:**
- Icon: 🗺️
- Title: "Jumlah per Provinsi"
- Content: Top 5 provinsi dengan format "Provinsi: Count"
- Display format: "Jawa Barat: 15 | Jawa Timur: 12 | Bali: 8 ..."
- If more than 5: "+X provinsi lainnya"
- Responsive to active filters

**Kota/Kabupaten Statistics Card:**
- Icon: 🏙️
- Title: "Jumlah per Kota/Kabupaten"
- Content: Top 5 kota/kab dengan format "Kota: Count"
- Display format: "Bandung: 10 | Surabaya: 8 | Denpasar: 5 ..."
- If provinsi filter active: only show cities from that province
- If more than 5: "+X kota/kab lainnya"

### 3. Filter & Statistics Interaction

**Filter Flow:**
1. User selects Provinsi → Update kabKota list → Refresh data with provinsi filter
2. User selects Kota/Kab → Refresh data with both filters
3. Statistics cards update automatically based on filtered data

**Clear Filters:**
- Add "Clear All Filters" button option
- Clicking resets all filters to default state

## API Endpoints

### 1. Enhanced GET /api/survey

**New Query Parameters:**
- `provinsi` (string, optional) - Filter by provinsi
- `kabKota` (string, optional) - Filter by kota/kabupaten
- `includeStats` (boolean, optional) - Include statistics in response

**Implementation:**
```typescript
// Add to existing where clause in route.ts
if (provinsi) {
    where.section1 = {
        ...where.section1,
        is: {
            kontakResponden: {
                is: {
                    provinsi: { contains: provinsi, mode: "insensitive" }
                }
            }
        }
    }
}

if (kabKota) {
    where.section1 = {
        ...where.section1,
        is: {
            kontakResponden: {
                is: {
                    kabKota: { contains: kabKota, mode: "insensitive" }
                }
            }
        }
    }
}

// Calculate statistics if requested
if (includeStats) {
    const allSurveys = await prisma.survey.findMany({ where });
    const statistics = calculateStatistics(allSurveys);
    // Include in response
}
```

**Statistics Calculation:**
Aggregate survey counts by provinsi and kabKota from section1.kontakResponden fields.

### 2. New POST /api/survey/export

**Endpoint:** `/api/survey/export`
**Method:** POST
**Request Body:**
```typescript
{
    provinsi?: string;
    kabKota?: string;
    status?: string;
    search?: string;
}
```

**Response:** Excel file (application/vnd.openxmlformats-officedocument.spreadsheetml.sheet)

**Implementation Steps:**
1. Parse request body for filters
2. Build where clause (same logic as GET)
3. Fetch ALL matching surveys (no pagination)
4. Generate Excel using ExcelJS
5. Return file as blob

**Excel Structure:**

Sheet 1: "Data Survey"

Columns:
- ID
- Status
- Tanggal Submit
- Kategori Responden
- Nama Lengkap
- Nomor HP
- Email
- Provinsi
- Kota/Kabupaten
- Jumlah PROT
- Entry 1: Nama PROT
- Entry 1: Jenis Kategori
- Entry 1: Provinsi Lokasi
- Entry 1: Kab/Kota Lokasi
- Entry 1: Kecamatan
- Entry 1: Desa
- (Continue for all entries in section2)
- Section 3: Frekuensi Dimainkan
- Section 3: Target Usia
- (All section 3-6 fields)

Features:
- Frozen header row (row 1)
- Auto-filter enabled
- Auto-width columns
- Bold headers
- Date formatting

## Data Flow

### Filter Update Flow
```
User selects filter
  → Update state
  → Reset page to 1
  → Call fetchSurveys() with new filters
  → Update UI with filtered data
  → Update statistics based on filtered data
```

### Export Flow
```
User clicks Export
  → Set isExporting = true
  → POST to /api/survey/export with current filters
  → Server generates Excel file
  → Return file blob
  → Trigger browser download
  → Set isExporting = false
```

### Statistics Update Flow
```
fetchSurveys() called
  → Include includeStats=true parameter
  → Backend calculates aggregations
  → Return statistics in response
  → Update statistics state
  → Re-render statistics cards
```

## Error Handling

### Export Errors
- Network failure: Alert "Gagal export data. Silakan coba lagi."
- No data: Disable export button
- Server error: Log to console, show user-friendly message

### Filter Errors
- Invalid filter combination: Show "Tidak ada data untuk filter ini"
- API failure: Keep previous data, show error toast

### Loading States
- Table loading: Existing spinner (lines 282-285)
- Export loading: Button text changes to "⏳ Exporting..." and disabled
- Filter loading: Subtle loading indicator

## Performance Optimization

1. **Backend Aggregation**: Statistics calculated in database queries, not in frontend
2. **Debounced Search**: 300ms debounce on search input
3. **Streaming Export**: Use streaming for large Excel files
4. **Memoization**: Memoize statistics calculations
5. **Index Usage**: Ensure database indexes on provinsi and kabKota fields

## Browser Compatibility

- Excel download using Blob API (supported in all modern browsers)
- File download trigger using anchor element with download attribute
- Fallback for older browsers if needed

## Testing Considerations

1. **Filter Testing:**
   - Provinsi filter works independently
   - KabKota filter depends on Provinsi
   - Filters combine correctly with existing search and status filters
   - Pagination resets on filter change

2. **Export Testing:**
   - Export respects all active filters
   - Excel file contains all expected columns
   - Data formatting is correct
   - Large dataset handling (1000+ rows)

3. **Statistics Testing:**
   - Counts are accurate
   - Top 5 sorting works correctly
   - Updates when filters change
   - Empty state handling

## Success Criteria

- ✅ Users can filter surveys by Provinsi
- ✅ Users can filter surveys by Kota/Kabupaten (dependent on Provinsi)
- ✅ Dashboard shows top 5 Provinsi by survey count
- ✅ Dashboard shows top 5 Kota/Kab by survey count
- ✅ Users can export filtered data to Excel
- ✅ Excel file contains all survey data (sections 1-6)
- ✅ All features work together with existing filters
- ✅ Performance remains acceptable with large datasets
