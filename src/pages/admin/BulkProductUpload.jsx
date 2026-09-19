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

      const blob = new Blob(
        [data],
        {
          type:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        }
      );

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

      setError(
        err.response?.data?.message ||
          "Unable to upload products."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Bulk Product Upload</h1>

      {error && <p>{error}</p>}

      <button onClick={handleDownloadTemplate}>
        Download Excel Template
      </button>

      <hr />

      <h2>Upload Products</h2>

      <input
        type="file"
        accept=".xlsx"
        onChange={(e) =>
          setFile(e.target.files[0])
        }
      />

      {file && (
        <p>
          Selected file: {file.name}
        </p>
      )}

      <button
        onClick={handleUpload}
        disabled={loading}
      >
        {loading
          ? "Uploading..."
          : "Upload Products"}
      </button>

      {result && (
        <div>
          <h2>Upload Result</h2>

          <p>
            Total Records:{" "}
            {result.totalRecords}
          </p>

          <p>
            Successful:{" "}
            {result.successCount}
          </p>

          <p>
            Failed:{" "}
            {result.failureCount}
          </p>

          {result.errors &&
            result.errors.length > 0 && (
              <div>
                <h3>Errors</h3>

                {result.errors.map(
                  (error, index) => (
                    <p key={index}>
                      {error}
                    </p>
                  )
                )}
              </div>
            )}
        </div>
      )}
    </div>
  );
}

export default BulkProductUpload;