import React, { useState, useRef } from 'react';
import { FiUpload, FiFile, FiX, FiDownload } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import ExcelJS from 'exceljs';
import Papa from 'papaparse';

export default function BulkUploadForm({ onClose, onProductsAdded }) {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [parsedData, setParsedData] = useState([]);
  const [uploadStep, setUploadStep] = useState(1); // 1: Select file, 2: Review data, 3: Upload complete
  const [validationErrors, setValidationErrors] = useState([]);
  const fileInputRef = useRef(null);
  const { userId } = useAuth();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    // Check file type
    const fileType = selectedFile.name.split('.').pop().toLowerCase();
    if (fileType !== 'csv' && fileType !== 'xlsx' && fileType !== 'xls') {
      setError('Please upload a CSV or Excel file');
      return;
    }

    setFile(selectedFile);
    setFileName(selectedFile.name);
    setError(null);
    parseFile(selectedFile, fileType);
  };

  const parseFile = (file, fileType) => {
    setLoading(true);
    
    if (fileType === 'csv') {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          handleParsedData(results.data);
          setLoading(false);
        },
        error: (error) => {
          setError(`Error parsing CSV: ${error.message}`);
          setLoading(false);
        }
      });
    } else {
      // Excel file - using ExcelJS for secure parsing
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const data = e.target.result;
          const workbook = new ExcelJS.Workbook();
          
          // Securely load Excel file with ExcelJS
          if (fileType === 'xlsx') {
            await workbook.xlsx.load(data);
          } else if (fileType === 'xls') {
            // For older Excel formats
            await workbook.xlsx.load(data); // ExcelJS handles both formats
          }
          
          const worksheet = workbook.getWorksheet(1); // Get first worksheet
          
          if (!worksheet) {
            throw new Error('No worksheet found in the Excel file');
          }
          
          // Convert worksheet to JSON with enhanced security
          const parsedData = [];
          const headers = [];
          const maxRows = 1000; // Limit maximum rows to prevent DoS attacks
          let rowCount = 0;
          
          // Get headers from first row with sanitization
          worksheet.getRow(1).eachCell((cell, colNumber) => {
            // Sanitize header names to prevent injection
            let headerValue = '';
            if (cell.value) {
              headerValue = typeof cell.value === 'string' ? 
                cell.value.trim() : 
                String(cell.value).trim();
              
              // Remove any potentially dangerous characters
              headerValue = headerValue.replace(/[^\w\s-]/gi, '');
            }
            headers[colNumber - 1] = headerValue;
          });
          
          // Process data rows with enhanced security
          worksheet.eachRow((row, rowNumber) => {
            if (rowNumber > 1 && rowCount < maxRows) { // Skip header row and respect max rows
              rowCount++;
              const rowData = {};
              row.eachCell((cell, colNumber) => {
                const header = headers[colNumber - 1];
                if (header) {
                  // Sanitize and convert cell value with enhanced security
                  let value = '';
                  if (cell.value !== null && cell.value !== undefined) {
                    value = cell.value;
                    // Handle dates and other special types
                    if (cell.value instanceof Date) {
                      value = cell.value.toISOString();
                    } else if (typeof cell.value === 'object' && cell.value.text) {
                      value = cell.value.text;
                    } else if (typeof cell.value === 'object') {
                      // Safely stringify other object types
                      try {
                        value = JSON.stringify(cell.value);
                      } catch (e) {
                        value = String(cell.value);
                      }
                    }
                    
                    // Convert to string and limit length to prevent memory issues
                    if (typeof value === 'string' && value.length > 5000) {
                      value = value.substring(0, 5000) + '... (truncated)';
                    }
                  }
                  rowData[header] = value;
                }
              });
              parsedData.push(rowData);
            }
          });
          
          if (rowCount >= maxRows) {
            console.warn(`File contains more than ${maxRows} rows. Only the first ${maxRows} rows were processed.`);
          }
          
          handleParsedData(parsedData);
        } catch (error) {
          setError(`Error parsing Excel file: ${error.message}`);
        } finally {
          setLoading(false);
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const handleParsedData = (data) => {
    if (!data || data.length === 0) {
      setError('No data found in the file');
      return;
    }

    // Validate required fields
    const errors = [];
    const validData = data.filter((item, index) => {
      const rowErrors = [];
      
      if (!item.name) rowErrors.push('Product name is required');
      if (!item.price || isNaN(Number(item.price))) rowErrors.push('Valid price is required');
      if (!item.category) rowErrors.push('Category is required');
      
      if (rowErrors.length > 0) {
        errors.push({ row: index + 2, errors: rowErrors }); // +2 because of 0-indexing and header row
        return false;
      }
      return true;
    });

    setParsedData(validData);
    setValidationErrors(errors);
    
    if (validData.length > 0) {
      setUploadStep(2); // Move to review step
    } else {
      setError('No valid products found in the file');
    }
  };

  const handleUpload = async () => {
    if (!userId) {
      setError("User not authenticated.");
      return;
    }

    if (parsedData.length === 0) {
      setError("No valid data to upload.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Prepare products data with seller_id
      const productsToUpload = parsedData.map(product => ({
        seller_id: userId,
        name: product.name,
        description: product.description || '',
        price: parseFloat(product.price),
        category: product.category,
        stock_quantity: parseInt(product.stock_quantity) || 0,
        // Add any other fields from your schema
      }));

      // Insert products in batches if there are many
      const { data, error } = await supabase
        .from('products')
        .insert(productsToUpload)
        .select();

      if (error) {
        console.error("Supabase error:", error);
        setError(`Failed to upload products: ${error.message}`);
      } else {
        setSuccessMessage(`Successfully uploaded ${data.length} products!`);
        setUploadStep(3); // Move to completion step
        
        // Notify parent component about the new products
        if (onProductsAdded && data) {
          onProductsAdded(data);
        }
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      setError("Unexpected error occurred while uploading products.");
    } finally {
      setLoading(false);
    }
  };

  const downloadTemplate = () => {
    // Create a simple CSV template
    const template = 'name,description,price,category,stock_quantity\nExample Product,Product description,10.99,Vegetables,100';
    const blob = new Blob([template], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'product_upload_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const resetForm = () => {
    setFile(null);
    setFileName('');
    setParsedData([]);
    setValidationErrors([]);
    setUploadStep(1);
    setError(null);
    setSuccessMessage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center overflow-y-auto z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Bulk Upload Products</h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close"
          >
            <FiX className="text-xl" />
          </button>
        </div>

        {error && <p className="text-red-500 text-sm mb-4 p-2 bg-red-50 rounded">{error}</p>}
        {successMessage && <p className="text-green-500 text-sm mb-4 p-2 bg-green-50 rounded">{successMessage}</p>}

        {uploadStep === 1 && (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-700 mb-2">Instructions:</h3>
              <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                <li>Upload a CSV or Excel file with product details</li>
                <li>Required columns: name, price, category</li>
                <li>Optional columns: description, stock_quantity</li>
                <li>Maximum 100 products per upload</li>
              </ul>
              <button 
                onClick={downloadTemplate}
                className="mt-3 flex items-center text-blue-600 hover:text-blue-800 text-sm"
              >
                <FiDownload className="mr-1" /> Download template
              </button>
            </div>

            <div 
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-agri-green transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept=".csv,.xlsx,.xls"
              />
              <FiUpload className="mx-auto text-3xl text-gray-400 mb-2" />
              <p className="text-gray-600 mb-1">Click to select or drag and drop</p>
              <p className="text-xs text-gray-500">Supported formats: CSV, Excel</p>
            </div>

            {fileName && (
              <div className="flex items-center p-2 bg-gray-50 rounded">
                <FiFile className="text-gray-500 mr-2" />
                <span className="text-sm truncate flex-1">{fileName}</span>
                {loading ? (
                  <span className="text-xs text-gray-500">Parsing...</span>
                ) : (
                  <button 
                    onClick={resetForm} 
                    className="text-red-500 hover:text-red-700"
                  >
                    <FiX />
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {uploadStep === 2 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Review Products</h3>
              <span className="text-sm text-gray-500">{parsedData.length} valid products</span>
            </div>

            {validationErrors.length > 0 && (
              <div className="bg-yellow-50 p-3 rounded-lg">
                <p className="text-yellow-700 text-sm font-medium mb-1">Some rows have errors and will be skipped:</p>
                <ul className="text-xs text-yellow-600 space-y-1 max-h-32 overflow-y-auto">
                  {validationErrors.slice(0, 5).map((error, index) => (
                    <li key={index}>
                      Row {error.row}: {error.errors.join(', ')}
                    </li>
                  ))}
                  {validationErrors.length > 5 && (
                    <li>...and {validationErrors.length - 5} more errors</li>
                  )}
                </ul>
              </div>
            )}

            <div className="border rounded-lg overflow-hidden">
              <div className="max-h-64 overflow-y-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      {parsedData.length > 0 && Object.keys(parsedData[0]).map((header, index) => (
                        <th 
                          key={index}
                          className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {parsedData.slice(0, 10).map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {Object.values(row).map((cell, cellIndex) => (
                          <td 
                            key={cellIndex}
                            className="px-3 py-2 text-xs text-gray-500 truncate max-w-xs"
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {parsedData.length > 10 && (
                <div className="py-2 px-3 bg-gray-50 text-xs text-gray-500">
                  Showing 10 of {parsedData.length} products
                </div>
              )}
            </div>

            <div className="flex justify-between pt-2">
              <button
                onClick={resetForm}
                className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                disabled={loading}
              >
                Back
              </button>
              <button
                onClick={handleUpload}
                className="bg-agri-green hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
                disabled={loading || parsedData.length === 0}
              >
                {loading ? 'Uploading...' : `Upload ${parsedData.length} Products`}
              </button>
            </div>
          </div>
        )}

        {uploadStep === 3 && (
          <div className="text-center py-6 space-y-4">
            <div className="text-green-500 text-5xl mb-4">✓</div>
            <h3 className="text-xl font-medium text-gray-800">Upload Complete!</h3>
            <p className="text-gray-600">{successMessage}</p>
            <div className="pt-4">
              <button
                onClick={onClose}
                className="bg-agri-green hover:bg-green-700 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}