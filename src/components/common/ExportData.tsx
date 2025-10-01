import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Download, X } from 'lucide-react';

interface ExportDataProps<T> {
  data: T[];
  filename: string;
  title: string;
  description: string;
  headers: string[];
  getRowData: (item: T) => Record<string, string | number | boolean | null | undefined>;
  onExport?: (content: string) => void;
  children?: React.ReactNode;
  className?: string;
}

export function ExportData<T>({
  data,
  filename,
  title,
  description,
  headers,
  getRowData,
  onExport,
  children,
  className = ''
}: ExportDataProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [exportDelimiter, setExportDelimiter] = useState<',' | ';'>(',');
  const [exportIncludeHeaders, setExportIncludeHeaders] = useState(true);
  const [exportFileName, setExportFileName] = useState(filename);

  const downloadFile = (filename: string, content: string, type = 'text/csv') => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const toCSV = (rows: Record<string, any>[]) => {
    const escape = (s: string) => {
      if (s === null || s === undefined) return '';
      s = String(s);
      if (/[",\n]/.test(s)) return '"' + s.replace(/"/g, '""') + '"';
      return s;
    };

    const joiner = exportDelimiter;
    const lines: string[] = [];
    
    if (exportIncludeHeaders) {
      lines.push(headers.map(h => escape(h)).join(joiner));
    }
    
    const dataRows = rows.map(row => {
      const rowData = getRowData(row);
      return headers.map(h => escape(String(rowData[h] || ''))).join(joiner);
    });
    
    return [...lines, ...dataRows].join('\n');
  };

  const handleExport = () => {
    const csv = toCSV(data);
    const fullFilename = `${exportFileName}.csv`;
    
    if (onExport) {
      onExport(csv);
    } else {
      downloadFile(fullFilename, csv);
    }
    
    setIsOpen(false);
  };

  return (
    <>
      {children ? (
        <div onClick={() => setIsOpen(true)} className={className}>
          {children}
        </div>
      ) : (
        <Button 
          variant="outline" 
          className={`glass-card ${className}`} 
          onClick={() => setIsOpen(true)}
        >
          <Download className="w-4 h-4 mr-2" />
          Export Data
        </Button>
      )}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl glass-card">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Download className="w-5 h-5 text-primary" />
              <span>{title}</span>
            </DialogTitle>
            <DialogDescription>
              {description}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="export-filename">File name</Label>
                <Input 
                  id="export-filename" 
                  value={exportFileName} 
                  onChange={(e) => setExportFileName(e.target.value)} 
                />
              </div>
              <div className="space-y-2">
                <Label>Delimiter</Label>
                <Select 
                  value={exportDelimiter} 
                  onValueChange={(v: ',' | ';') => setExportDelimiter(v)}
                >
                  <SelectTrigger className="glass-card">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value=",">Comma (,)</SelectItem>
                    <SelectItem value=";">Semicolon (;)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-3">
                <Switch 
                  id="include-headers" 
                  checked={exportIncludeHeaders} 
                  onCheckedChange={setExportIncludeHeaders} 
                />
                <Label htmlFor="include-headers" className="text-sm">
                  Include headers
                </Label>
              </div>
            </div>

            <div className="bg-muted/50 rounded-lg p-4 max-h-60 overflow-auto">
              <div className="text-sm font-mono whitespace-pre">
                {exportIncludeHeaders && (
                  <div className="font-semibold text-foreground">
                    {headers.join(exportDelimiter)}
                  </div>
                )}
                {data.slice(0, 5).map((item, i) => {
                  const rowData = getRowData(item);
                  return (
                    <div key={i} className="text-muted-foreground">
                      {headers.map(h => String(rowData[h] || '')).join(exportDelimiter)}
                    </div>
                  );
                })}
                {data.length > 5 && (
                  <div className="text-muted-foreground italic">... and {data.length - 5} more rows</div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleExport}
              className="bg-gold-gradient text-primary-foreground"
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
