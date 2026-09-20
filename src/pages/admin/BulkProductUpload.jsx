import { useState } from "react";
import {
  downloadBulkTemplate,
  uploadBulkProducts,
} from "../../services/bulkProductService";

function BulkProductUpload() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDownloadTemplate = async () => {
    try {
      setError("");

      const data = await downloadBulkTemplate();

      const blob = new Blob([data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "BulkProductsTemplate.xlsx";

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      setError("Unable to download template.");
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    setError("");
    setResult(null);

    if (!selectedFile) {
      setFile(null);
      return;
    }

    if (!selectedFile.name.toLowerCase().endsWith(".xlsx")) {
      setError("Please select a valid Excel (.xlsx) file.");
      setFile(null);
      return;
    }

    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select an Excel file.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setResult(null);

      const data = await uploadBulkProducts(file);

      setResult(data);
      setFile(null);
    } catch (err) {
      console.error(err);

      setError(err.response?.data?.message || "Unable to upload products.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setError("");
  };

  return (
    <div className="bulk-upload-page">
      <div className="admin-page-header">
        <div>
          <p className="admin-eyebrow">ADMIN PANEL</p>
          <h1>Bulk Product Upload</h1>
          <p>Add multiple products quickly using an Excel spreadsheet.</p>
        </div>
      </div>

      {error && <div className="admin-error bulk-upload-message">{error}</div>}

      <div className="bulk-upload-layout">
        {/* Template Card */}
        <div className="bulk-template-card">
          <div className="bulk-card-icon">📄</div>

          <div>
            <h2>1. Download Template</h2>
            <p>
              Start with the standard Excel template to make sure your product
              data follows the required format.
            </p>
          </div>

          <button
            type="button"
            className="bulk-download-button"
            onClick={handleDownloadTemplate}
          >
            ↓ Download Excel Template
          </button>

          <div className="bulk-template-info">
            <span>✓</span>
            <p>
              The template contains the required product columns and can be
              opened in Microsoft Excel.
            </p>
          </div>
        </div>

        {/* Upload Card */}
        <div className="bulk-upload-card">
          <div className="bulk-card-icon">📦</div>

          <div>
            <h2>2. Upload Products</h2>
            <p>
              Select your completed Excel file and upload the products in bulk.
            </p>
          </div>

          <label className="bulk-file-area">
            <input type="file" accept=".xlsx" onChange={handleFileChange} />

            <div className="bulk-upload-icon">☁️</div>

            <strong>
              {file ? "Excel file selected" : "Choose an Excel file"}
            </strong>

            <span>
              {file
                ? "Click to choose a different file"
                : "Only .xlsx files are supported"}
            </span>
          </label>

          {file && (
            <div className="bulk-selected-file">
              <div className="bulk-file-icon">XLSX</div>

              <div className="bulk-file-info">
                <strong>{file.name}</strong>
                <span>{(file.size / 1024).toFixed(1)} KB</span>
              </div>

              <button
                type="button"
                className="bulk-remove-file"
                onClick={handleRemoveFile}
              >
                ✕
              </button>
            </div>
          )}

          <button
            type="button"
            className="bulk-upload-button"
            onClick={handleUpload}
            disabled={loading || !file}
          >
            {loading ? "Uploading Products..." : "Upload Products"}
          </button>
        </div>
      </div>

      {/* Upload Result */}
      {result && (
        <div className="bulk-result-card">
          <div className="bulk-result-header">
            <div>
              <p className="admin-eyebrow">UPLOAD COMPLETE</p>
              <h2>Upload Result</h2>
            </div>

            <div className="bulk-success-check">✓</div>
          </div>

          <div className="bulk-result-stats">
            <div className="bulk-result-stat">
              <span>Total Records</span>
              <strong>{result.totalRecords}</strong>
            </div>

            <div className="bulk-result-stat success">
              <span>Successful</span>
              <strong>{result.successCount}</strong>
            </div>

            <div className="bulk-result-stat failed">
              <span>Failed</span>
              <strong>{result.failureCount}</strong>
            </div>
          </div>

          {result.errors && result.errors.length > 0 && (
            <div className="bulk-errors">
              <h3>Upload Errors</h3>

              <div className="bulk-error-list">
                {result.errors.map((error, index) => (
                  <div className="bulk-error-item" key={index}>
                    <span>!</span>
                    <p>{error}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {result.failureCount === 0 && (
            <div className="bulk-all-success">
              <span>✓</span>
              <p>All products were uploaded successfully.</p>
            </div>
          )}
        </div>
      )}

      {/* Process Information */}
      <div className="bulk-process-card">
        <h2>How Bulk Upload Works</h2>

        <div className="bulk-process-steps">
          <div>
            <span>1</span>
            <h3>Download</h3>
            <p>Download the provided Excel template.</p>
          </div>

          <div>
            <span>2</span>
            <h3>Fill Data</h3>
            <p>Enter your product information into the spreadsheet.</p>
          </div>

          <div>
            <span>3</span>
            <h3>Upload</h3>
            <p>Upload the completed Excel file.</p>
          </div>

          <div>
            <span>4</span>
            <h3>Process</h3>
            <p>
              Products are processed in batches and the result is displayed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BulkProductUpload;
