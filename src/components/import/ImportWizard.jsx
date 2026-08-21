import React, { useState } from 'react';
import { importService, PROPERTY_SCHEMA_FIELDS, LEAD_SCHEMA_FIELDS } from '../../services/importService';
import { RiUploadCloud2Line, RiCheckLine, RiAlertLine, RiFileExcel2Line } from 'react-icons/ri';
import './ImportWizard.css';

export function ImportWizard({ targetType = 'properties', onComplete, onCancel }) {
  const [step, setStep] = useState(1); // 1: Upload, 2: Mapping, 3: Preview/Validation, 4: Summary
  const [file, setFile] = useState(null);
  const [headers, setHeaders] = useState([]);
  const [rawRows, setRawRows] = useState([]);
  const [mapping, setMapping] = useState({});
  const [preparedData, setPreparedData] = useState(null);
  const [importSummary, setImportSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sheetsUrl, setSheetsUrl] = useState('');

  const schema = targetType === 'properties' ? PROPERTY_SCHEMA_FIELDS : LEAD_SCHEMA_FIELDS;

  // Step 1: File selection
  const handleFileChange = async (e) => {
    const selected = e.target.files[0];
    if (!selected) return;
    setFile(selected);
    setLoading(true);

    try {
      const { headers: parsedHeaders, rows } = await importService.parseFile(selected);
      setHeaders(parsedHeaders);
      setRawRows(rows);
      const autoMapping = importService.detectMapping(parsedHeaders, targetType);
      setMapping(autoMapping);
      setStep(2);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Validate mapping
  const handleProceedToValidation = () => {
    const validated = importService.validateAndPrepare(rawRows, mapping, targetType);
    setPreparedData(validated);
    setStep(3);
  };

  // Step 3: Run Import
  const handleExecuteImport = () => {
    if (!preparedData) return;
    const summary = importService.executeImport(preparedData.items, targetType);
    setImportSummary(summary);
    setStep(4);
    if (onComplete) onComplete(summary);
  };

  return (
    <div style={{ background: 'var(--surface)', padding: 'var(--space-6)', borderRadius: 'var(--radius-xl)' }}>
      <div className="wizard-steps">
        <div className={`wizard-step-item ${step === 1 ? 'active' : ''}`}>
          <span className="step-num">1</span>
          <span>Upload File</span>
        </div>
        <div className={`wizard-step-item ${step === 2 ? 'active' : ''}`}>
          <span className="step-num">2</span>
          <span>Column Mapping</span>
        </div>
        <div className={`wizard-step-item ${step === 3 ? 'active' : ''}`}>
          <span className="step-num">3</span>
          <span>Validation & Duplicates</span>
        </div>
        <div className={`wizard-step-item ${step === 4 ? 'active' : ''}`}>
          <span className="step-num">4</span>
          <span>Summary</span>
        </div>
      </div>

      {step === 1 && (
        <div>
          <label className="upload-dropzone">
            <input type="file" accept=".csv, .xlsx, .xls" onChange={handleFileChange} style={{ display: 'none' }} />
            <RiUploadCloud2Line size={48} color="var(--accent)" />
            <h4 style={{ fontWeight: 700, marginTop: '8px' }}>Select CSV or Excel (.xlsx) file</h4>
            <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)', marginTop: '4px' }}>
              Upload your existing property inventory or lead records. Auto-detects columns automatically.
            </p>
          </label>
        </div>
      )}

      {step === 2 && (
        <div>
          <h4 style={{ fontWeight: 700, marginBottom: '8px' }}>Confirm Column Mapping</h4>
          <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)' }}>
            Ensure your file columns are mapped accurately to PropIntel database schema.
          </p>

          <table className="mapping-table">
            <thead>
              <tr>
                <th>PropIntel Field</th>
                <th>Required</th>
                <th>File Column Header</th>
              </tr>
            </thead>
            <tbody>
              {schema.map(field => (
                <tr key={field.key}>
                  <td><strong>{field.label}</strong></td>
                  <td>{field.required ? <span style={{ color: 'var(--danger)' }}>Yes</span> : 'Optional'}</td>
                  <td>
                    <select
                      value={mapping[field.key] || ''}
                      onChange={(e) => setMapping({ ...mapping, [field.key]: e.target.value })}
                      style={{ padding: '6px', borderRadius: '4px', border: '1px solid var(--border-color)', width: '100%', background: 'var(--surface)', fontSize: 'var(--font-xs)' }}
                    >
                      <option value="">-- Ignore / Not Mapped --</option>
                      {headers.map(h => (
                        <option key={h} value={h}>{h}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)', marginTop: 'var(--space-6)' }}>
            <button onClick={() => setStep(1)} style={{ padding: '8px 16px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>Back</button>
            <button onClick={handleProceedToValidation} style={{ padding: '8px 16px', background: 'var(--accent)', color: '#fff', borderRadius: 'var(--radius-md)', fontWeight: 600 }}>Review & Validate</button>
          </div>
        </div>
      )}

      {step === 3 && preparedData && (
        <div>
          <h4 style={{ fontWeight: 700 }}>Validation & Duplicate Review</h4>
          <div style={{ display: 'flex', gap: 'var(--space-3)', margin: 'var(--space-3) 0' }}>
            <span style={{ fontSize: 'var(--font-xs)', padding: '4px 8px', background: 'var(--success-subtle)', color: 'var(--success-text)', borderRadius: '4px', fontWeight: 600 }}>
              Valid: {preparedData.summary.valid}
            </span>
            <span style={{ fontSize: 'var(--font-xs)', padding: '4px 8px', background: 'var(--warning-subtle)', color: 'var(--warning-text)', borderRadius: '4px', fontWeight: 600 }}>
              Duplicates: {preparedData.summary.duplicate}
            </span>
            <span style={{ fontSize: 'var(--font-xs)', padding: '4px 8px', background: 'var(--danger-subtle)', color: 'var(--danger-text)', borderRadius: '4px', fontWeight: 600 }}>
              Errors: {preparedData.summary.error}
            </span>
          </div>

          <div style={{ maxHeight: '280px', overflowY: 'auto', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', fontSize: 'var(--font-xs)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ background: 'var(--surface-subtle)', position: 'sticky', top: 0 }}>
                <tr>
                  <th style={{ padding: '8px', textAlign: 'left' }}>Import?</th>
                  <th style={{ padding: '8px', textAlign: 'left' }}>Row</th>
                  <th style={{ padding: '8px', textAlign: 'left' }}>Name / Title</th>
                  <th style={{ padding: '8px', textAlign: 'left' }}>Status</th>
                  <th style={{ padding: '8px', textAlign: 'left' }}>Notes</th>
                </tr>
              </thead>
              <tbody>
                {preparedData.items.slice(0, 50).map((item) => (
                  <tr key={item.rowIndex} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '8px' }}>
                      <input
                        type="checkbox"
                        checked={item.includeInImport}
                        disabled={item.status === 'error'}
                        onChange={(e) => {
                          const updated = [...preparedData.items];
                          updated[item.rowIndex - 1].includeInImport = e.target.checked;
                          setPreparedData({ ...preparedData, items: updated });
                        }}
                      />
                    </td>
                    <td style={{ padding: '8px' }}>#{item.rowIndex}</td>
                    <td style={{ padding: '8px', fontWeight: 600 }}>
                      {item.mapped.title || item.mapped.name || '—'}
                    </td>
                    <td style={{ padding: '8px' }}>
                      <span style={{
                        padding: '2px 6px',
                        borderRadius: '4px',
                        fontWeight: 600,
                        background: item.status === 'valid' ? 'var(--success-subtle)' : item.status === 'duplicate' ? 'var(--warning-subtle)' : 'var(--danger-subtle)',
                        color: item.status === 'valid' ? 'var(--success-text)' : item.status === 'duplicate' ? 'var(--warning-text)' : 'var(--danger-text)'
                      }}>
                        {item.status}
                      </span>
                    </td>
                    <td style={{ padding: '8px', color: 'var(--text-tertiary)' }}>
                      {item.errorMessage || item.duplicateReason || 'Ready'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)', marginTop: 'var(--space-6)' }}>
            <button onClick={() => setStep(2)} style={{ padding: '8px 16px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>Back</button>
            <button onClick={handleExecuteImport} style={{ padding: '8px 16px', background: 'var(--accent)', color: '#fff', borderRadius: 'var(--radius-md)', fontWeight: 600 }}>Import Selected ({preparedData.items.filter(i => i.includeInImport).length})</button>
          </div>
        </div>
      )}

      {step === 4 && importSummary && (
        <div style={{ textAlign: 'center', padding: 'var(--space-6) 0' }}>
          <RiCheckLine size={48} color="var(--success)" style={{ margin: '0 auto' }} />
          <h3 style={{ fontSize: 'var(--font-xl)', fontWeight: 700, marginTop: '8px' }}>Import Completed</h3>
          <p style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Successfully imported <strong>{importSummary.importedCount}</strong> records into your workspace ({importSummary.skippedCount} skipped).
          </p>
          <button
            onClick={onCancel}
            style={{ marginTop: 'var(--space-6)', padding: '8px 24px', background: 'var(--accent)', color: '#fff', borderRadius: 'var(--radius-md)', fontWeight: 600 }}
          >
            Done
          </button>
        </div>
      )}
    </div>
  );
}
