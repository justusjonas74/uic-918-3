'use client';

import React, { useState, useRef } from 'react';
import {
  Upload,
  Binary,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Ticket,
  User,
  Calendar,
  Train,
  Copy,
  Check,
  FileCode,
  ArrowRight,
  RefreshCw
} from 'lucide-react';

interface Container {
  id: string;
  version: string;
  length: number;
  container_data: any;
}

interface DecodedTicket {
  version: number;
  header: {
    umid: string;
    mt_version: string;
    rics: string;
    key_id: string;
  };
  signature: string;
  ticketDataLength: string;
  ticketDataRaw: string;
  ticketDataUncompressed: string;
  ticketContainers: Container[];
  validityOfSignature?: string;
  isSignatureValid?: boolean;
}

// Map of common railway RICS codes to their operator names
const RICS_MAP: Record<string, string> = {
  '1080': 'Deutsche Bahn (DB)',
  '0080': 'Deutsche Bahn (DB)',
  '1181': 'Österreichische Bundesbahnen (ÖBB)',
  '0081': 'Österreichische Bundesbahnen (ÖBB)',
  '1185': 'Schweizerische Bundesbahnen (SBB)',
  '0085': 'Schweizerische Bundesbahnen (SBB)',
  '1187': 'SNCF (Frankreich)',
  '1088': 'SNCB (Belgien)',
  '1184': 'Nederlandse Spoorwegen (NS)',
  '0084': 'Nederlandse Spoorwegen (NS)',
  '1186': 'DSB (Dänemark)',
  '1154': 'České dráhy (ČD, Tschechien)',
  '1151': 'PKP (Polen)',
  '0083': 'Trenitalia (Italien)',
  '1183': 'Trenitalia (Italien)'
};

export default function Home() {
  const [activeTab, setActiveTab] = useState<'hex' | 'upload'>('hex');
  const [hexInput, setHexInput] = useState<string>('');

  // File upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState<boolean>(false);

  // Decoded response state
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<DecodedTicket | null>(null);

  // UI toggles
  const [copiedText, setCopiedText] = useState<boolean>(false);
  const [expandedContainers, setExpandedContainers] = useState<Record<string, boolean>>({});
  const [containerViewMode, setContainerViewMode] = useState<Record<string, 'details' | 'json'>>({});

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Toggle container expansion
  const toggleContainer = (id: string) => {
    setExpandedContainers((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Toggle formatted details vs JSON view mode inside container
  const setViewModeForContainer = (id: string, mode: 'details' | 'json') => {
    setContainerViewMode((prev) => ({
      ...prev,
      [id]: mode
    }));
  };

  // Drag and drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    // Only accept image files
    if (!file.type.startsWith('image/')) {
      setError('Bitte lade nur Bilddateien (PNG, JPG, JPEG) hoch.');
      return;
    }

    setSelectedFile(file);
    setError(null);

    // Create base64 preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setFilePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Copy to clipboard helper
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  // Clear all states
  const resetForm = () => {
    setHexInput('');
    setSelectedFile(null);
    setFilePreview(null);
    setResult(null);
    setError(null);
    setExpandedContainers({});
    setContainerViewMode({});
  };

  // Send request to API route
  const handleDecode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    setLoading(true);

    try {
      let payload = {};
      if (activeTab === 'hex') {
        if (!hexInput.trim()) {
          throw new Error('Bitte gib einen Hex-String ein.');
        }
        payload = { type: 'hex', data: hexInput };
      } else {
        if (!filePreview) {
          throw new Error('Bitte lade ein Bild des Aztec-Barcodes hoch.');
        }
        payload = { type: 'image', data: filePreview };
      }

      const response = await fetch('/api/decode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Fehler beim Dekodieren der Daten.');
      }

      setResult(data.result);
      // Auto-expand the first container if available
      if (data.result?.ticketContainers?.length > 0) {
        setExpandedContainers({ [data.result.ticketContainers[0].id]: true });
      }
    } catch (err: any) {
      setError(err.message || 'Ein unbekannter Fehler ist aufgetreten.');
    } finally {
      setLoading(false);
    }
  };

  // Format RICS organization code
  const formatRICS = (rics: string) => {
    const cleanRics = String(Number(rics));
    return RICS_MAP[cleanRics] ? `${cleanRics} - ${RICS_MAP[cleanRics]}` : cleanRics;
  };

  const renderUFlexDetails = (containerData: any) => {
    if (!containerData) return null;

    // Support both flattened and nested (FCB_Container) schemas
    const fcb = containerData.FCB_Container || containerData;
    const raw = fcb.raw || {};

    const issuing = fcb.issuingDetail || raw.issuingDetail || {};

    // Extract travelers
    let travelers: any[] = [];
    const travelerDetail = raw.travelerDetail || fcb.travelerDetail || {};
    if (travelerDetail.traveler) {
      const t = travelerDetail.traveler;
      // It can be a single traveler object (TravelerType) or an array
      if (Array.isArray(t)) {
        travelers = t;
      } else if (typeof t === 'object') {
        // Sometimes it's nested as { TravelerType: { ... } } or directly { ... }
        if (t.TravelerType) {
          travelers = Array.isArray(t.TravelerType) ? t.TravelerType : [t.TravelerType];
        } else {
          travelers = [t];
        }
      }
    }

    // Extract documents
    let documents: any[] = [];
    const docs = raw.transportDocument || fcb.transportDocument || [];
    if (Array.isArray(docs)) {
      documents = docs;
    } else if (typeof docs === 'object') {
      if (docs.DocumentData) {
        documents = Array.isArray(docs.DocumentData) ? docs.DocumentData : [docs.DocumentData];
      } else {
        documents = [docs];
      }
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Reisende */}
        {travelers.length > 0 && (
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontWeight: 800,
                marginBottom: '0.75rem',
                textTransform: 'uppercase'
              }}
            >
              <User size={18} style={{ color: 'var(--accent-pink)' }} />
              Reisende
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
              {travelers.map((traveler: any, idx: number) => (
                <div
                  key={idx}
                  className="brutal-card"
                  style={{
                    padding: '0.75rem 1rem',
                    margin: 0,
                    boxShadow: '2px 2px 0px #000',
                    borderWidth: '2px',
                    flex: '1 1 200px'
                  }}
                >
                  <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                    {traveler.firstName} {traveler.lastName}
                  </div>
                  <div style={{ fontSize: '0.85rem', marginTop: '0.25rem', color: '#555' }}>
                    Typ:{' '}
                    <span
                      className="brutal-badge brutal-badge-teal"
                      style={{ borderWidth: '1px', padding: '0.1rem 0.4rem' }}
                    >
                      {typeof traveler.passengerType === 'object'
                        ? Object.keys(traveler.passengerType)[0]
                        : traveler.passengerType || 'Erwachsener'}
                    </span>
                  </div>
                  {(traveler.yearOfBirth || traveler.monthOfBirth || traveler.dayOfBirthInMonth) && (
                    <div style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>
                      Geburtsdatum: {traveler.dayOfBirthInMonth || '?'}.{traveler.monthOfBirth || '?'}.
                      {traveler.yearOfBirth || '?'}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Ausstellungs-Details */}
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontWeight: 800,
              marginBottom: '0.75rem',
              textTransform: 'uppercase'
            }}
          >
            <Calendar size={18} style={{ color: 'var(--accent-teal)' }} />
            Ausstellungs-Details
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', border: '2px solid #000' }}>
            <tbody>
              <tr style={{ borderBottom: '2px solid #000' }}>
                <td
                  style={{
                    padding: '0.5rem',
                    fontWeight: 'bold',
                    background: '#f5f5f5',
                    width: '40%',
                    borderRight: '2px solid #000'
                  }}
                >
                  Herausgeber
                </td>
                <td style={{ padding: '0.5rem' }}>
                  {issuing.issuerName || issuing.issuerNum || 'Unbekannt'} (
                  {issuing.issuerNum || issuing.securityProviderNum})
                </td>
              </tr>
              {(issuing.issuingYear || issuing.issuingDay) && (
                <tr style={{ borderBottom: '2px solid #000' }}>
                  <td
                    style={{
                      padding: '0.5rem',
                      fontWeight: 'bold',
                      background: '#f5f5f5',
                      borderRight: '2px solid #000'
                    }}
                  >
                    Datum der Ausstellung
                  </td>
                  <td style={{ padding: '0.5rem' }}>
                    Jahr: {issuing.issuingYear} | Tag im Jahr: {issuing.issuingDay}
                  </td>
                </tr>
              )}
              {issuing.issuingTime !== undefined && (
                <tr style={{ borderBottom: '2px solid #000' }}>
                  <td
                    style={{
                      padding: '0.5rem',
                      fontWeight: 'bold',
                      background: '#f5f5f5',
                      borderRight: '2px solid #000'
                    }}
                  >
                    Uhrzeit der Ausstellung
                  </td>
                  <td style={{ padding: '0.5rem' }}>
                    {String(Math.floor(issuing.issuingTime / 60)).padStart(2, '0')}:
                    {String(issuing.issuingTime % 60).padStart(2, '0')} Uhr
                  </td>
                </tr>
              )}
              {issuing.issuerPNR && (
                <tr style={{ borderBottom: '2px solid #000' }}>
                  <td
                    style={{
                      padding: '0.5rem',
                      fontWeight: 'bold',
                      background: '#f5f5f5',
                      borderRight: '2px solid #000'
                    }}
                  >
                    PNR (Auftragsnummer)
                  </td>
                  <td style={{ padding: '0.5rem', fontFamily: 'monospace', fontWeight: 'bold' }}>
                    {issuing.issuerPNR}
                  </td>
                </tr>
              )}
              {issuing.currency && (
                <tr>
                  <td
                    style={{
                      padding: '0.5rem',
                      fontWeight: 'bold',
                      background: '#f5f5f5',
                      borderRight: '2px solid #000'
                    }}
                  >
                    Währung
                  </td>
                  <td style={{ padding: '0.5rem' }}>{issuing.currency}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Dokumente */}
        {documents.length > 0 && (
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontWeight: 800,
                marginBottom: '0.75rem',
                textTransform: 'uppercase'
              }}
            >
              <Train size={18} style={{ color: 'var(--accent-yellow)' }} />
              Reisedokumente
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {documents.map((doc: any, idx: number) => {
                const ticketObj = doc.ticket || doc || {};
                const ticketType = Object.keys(ticketObj)[0] || 'Unbekanntes Ticket';
                const ticketDetails = ticketObj[ticketType] || ticketObj;

                return (
                  <div
                    key={idx}
                    className="brutal-card"
                    style={{ padding: '1rem', margin: 0, borderWidth: '2px', boxShadow: '2px 2px 0px #000' }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '0.5rem'
                      }}
                    >
                      <span className="brutal-badge brutal-badge-yellow" style={{ fontSize: '0.8rem' }}>
                        {ticketType.toUpperCase()}
                      </span>
                    </div>
                    {ticketDetails && typeof ticketDetails === 'object' ? (
                      <div style={{ fontSize: '0.85rem' }}>
                        {Object.entries(ticketDetails).map(([key, val]: [string, any]) => {
                          if (typeof val === 'object') {
                            // If it's a tariff description or restriction
                            if (key === 'tariffs' && val.TariffType) {
                              return (
                                <div
                                  key={key}
                                  style={{ display: 'flex', borderBottom: '1px solid #eee', padding: '0.25rem 0' }}
                                >
                                  <span style={{ fontWeight: 'bold', width: '40%' }}>Tarif:</span>
                                  <span>{val.TariffType.tariffDesc || 'Standard'}</span>
                                </div>
                              );
                            }
                            return null;
                          }
                          return (
                            <div
                              key={key}
                              style={{ display: 'flex', borderBottom: '1px solid #eee', padding: '0.25rem 0' }}
                            >
                              <span style={{ fontWeight: 'bold', width: '40%' }}>{key}:</span>
                              <span>{key === 'price' ? `${(val / 100).toFixed(2)} €` : String(val)}</span>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div style={{ fontSize: '0.85rem', color: '#555' }}>Keine detaillierten Felder vorhanden.</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Recursive formatter for generic objects
  const renderGenericDetails = (data: any) => {
    if (!data) return null;
    if (typeof data !== 'object') {
      return <div style={{ fontSize: '0.9rem' }}>{String(data)}</div>;
    }

    return (
      <table style={{ width: '100%', borderCollapse: 'collapse', border: '2px solid #000' }}>
        <tbody>
          {Object.entries(data).map(([key, val]: [string, any]) => {
            let renderedValue = '';
            if (val === null || val === undefined) {
              renderedValue = 'null';
            } else if (typeof val === 'object') {
              renderedValue = JSON.stringify(val);
            } else {
              renderedValue = String(val);
            }

            return (
              <tr key={key} style={{ borderBottom: '2px solid #000' }}>
                <td
                  style={{
                    padding: '0.5rem',
                    fontWeight: 'bold',
                    background: '#f5f5f5',
                    width: '35%',
                    borderRight: '2px solid #000',
                    fontSize: '0.85rem'
                  }}
                >
                  {key}
                </td>
                <td style={{ padding: '0.5rem', fontSize: '0.85rem', fontFamily: 'monospace', wordBreak: 'break-all' }}>
                  {renderedValue}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  };

  return (
    <div>
      {/* Title Header */}
      <header
        className="brutal-card"
        style={{ background: 'var(--accent-yellow)', margin: '2rem 0', padding: '1.5rem', textAlign: 'center' }}
      >
        <h1
          style={{
            fontSize: '2.5rem',
            fontWeight: 900,
            textTransform: 'uppercase',
            letterSpacing: '-0.05em',
            lineHeight: 1
          }}
        >
          UIC 918 Barcode Decoder
        </h1>
        <p style={{ marginTop: '0.5rem', fontSize: '1.1rem', fontWeight: 700 }}>
          [ WEB-APP ZUM ENTSCHLÜSSELN VON BAHN-TICKETS ]
        </p>
      </header>

      {/* Main Responsive Grid */}
      <div className="brutal-grid">
        {/* Left Column: Input Forms */}
        <div>
          {/* Tab Selection */}
          <div className="brutal-tab-container">
            <button
              className={`brutal-tab ${activeTab === 'hex' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('hex');
                setError(null);
              }}
            >
              <Binary size={16} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'text-bottom' }} />
              Hex-Daten
            </button>
            <button
              className={`brutal-tab ${activeTab === 'upload' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('upload');
                setError(null);
              }}
            >
              <Upload size={16} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'text-bottom' }} />
              Bild-Upload
            </button>
          </div>

          {/* Form Card */}
          <div className="brutal-card">
            <form onSubmit={handleDecode}>
              {activeTab === 'hex' ? (
                <div>
                  <label
                    style={{ display: 'block', fontWeight: 900, marginBottom: '0.5rem', textTransform: 'uppercase' }}
                  >
                    Raw Hex-Daten eingeben:
                  </label>
                  <textarea
                    className="brutal-input"
                    rows={10}
                    placeholder="z.B. 23555430323336333444545830336889AC..."
                    value={hexInput}
                    onChange={(e) => setHexInput(e.target.value)}
                    style={{ resize: 'vertical', fontFamily: 'monospace' }}
                  />
                  <p style={{ fontSize: '0.8rem', marginTop: '0.5rem', color: '#555' }}>
                    Tipp: Der Hex-String muss mit dem Ticket-Header beginnen (z.B. `#UT02`, welches in Hex `2355543032`
                    ist).
                  </p>
                </div>
              ) : (
                <div>
                  <label
                    style={{ display: 'block', fontWeight: 900, marginBottom: '0.5rem', textTransform: 'uppercase' }}
                  >
                    Aztec-Barcode Bild hochladen:
                  </label>

                  <div
                    className="brutal-input"
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    style={{
                      borderStyle: dragActive ? 'solid' : 'dashed',
                      borderColor: dragActive ? 'var(--accent-pink)' : '#000',
                      padding: '2.5rem 1.5rem',
                      textAlign: 'center',
                      cursor: 'pointer',
                      background: dragActive ? '#fff9fa' : '#fff',
                      minHeight: '200px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      style={{ display: 'none' }}
                    />
                    <Upload size={48} style={{ marginBottom: '1rem' }} />
                    <p style={{ fontWeight: 800 }}>Drag & Drop die Bilddatei hierher</p>
                    <p style={{ fontSize: '0.8rem', marginTop: '0.25rem', color: '#666' }}>
                      oder klicke zum Auswählen (PNG, JPG, JPEG)
                    </p>
                  </div>

                  {/* Image Preview */}
                  {filePreview && (
                    <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                      <div
                        style={{
                          fontWeight: 800,
                          marginBottom: '0.5rem',
                          fontSize: '0.9rem',
                          textTransform: 'uppercase'
                        }}
                      >
                        Ausgewähltes Bild:
                      </div>
                      <div
                        style={{
                          border: '2px solid #000',
                          display: 'inline-block',
                          padding: '0.5rem',
                          background: '#fff'
                        }}
                      >
                        <img
                          src={filePreview}
                          alt="Barcode-Vorschau"
                          style={{ maxHeight: '150px', maxWidth: '100%', objectFit: 'contain' }}
                        />
                      </div>
                      <div style={{ fontSize: '0.8rem', marginTop: '0.25rem', color: '#333' }}>
                        {selectedFile?.name} ({(selectedFile ? selectedFile.size / 1024 : 0).toFixed(1)} KB)
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <button
                  type="submit"
                  className="brutal-btn"
                  disabled={loading}
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  {loading ? (
                    <>
                      <RefreshCw className="animate-spin" size={18} />
                      Dekodiere...
                    </>
                  ) : (
                    <>
                      <Binary size={18} />
                      Entschlüsseln
                    </>
                  )}
                </button>
                {(hexInput || selectedFile) && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="brutal-btn brutal-btn-pink"
                    style={{ padding: '0.75rem 1rem' }}
                  >
                    Clear
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Library Info Card */}
          {/* <div className="brutal-card" style={{ boxShadow: '4px 4px 0px #000', background: 'var(--bg-white)', padding: '1rem' }}>
            <h3 style={{ fontWeight: 900, textTransform: 'uppercase', marginBottom: '0.5rem', fontSize: '1rem' }}>
              Wie funktioniert das?
            </h3>
            <p style={{ fontSize: '0.85rem' }}>
              Diese App nutzt die lokale <strong>uic-918-3</strong> Bibliothek. 
              <br />
              - Bei <strong>Hex-Daten</strong> wird der Ticket-Inhalt direkt entpackt (Zlib) und nach dem UIC 918.3 Standard geparst.
              <br />
              - Bei <strong>Bild-Uploads</strong> sucht ein WebAssembly-Port von ZXing nach einem Aztec-Barcode, extrahiert die Binärdaten und übergibt sie dem Parser.
            </p>
        </div> */}
        </div>

        {/* Right Column: Decoding Output Results */}
        <div>
          {/* Empty State */}
          {!loading && !error && !result && (
            <div
              className="brutal-card"
              style={{
                minHeight: '300px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                borderStyle: 'dashed',
                background: 'transparent',
                boxShadow: 'none'
              }}
            >
              <Ticket size={48} style={{ color: '#aaa', marginBottom: '1rem' }} />
              <p style={{ fontWeight: 800, textTransform: 'uppercase', color: '#555', textAlign: 'center' }}>
                Bereit für Dekodierung
              </p>
              <p
                style={{
                  fontSize: '0.85rem',
                  color: '#777',
                  textAlign: 'center',
                  marginTop: '0.25rem',
                  maxWidth: '300px'
                }}
              >
                Füge links einen Hex-String ein oder lade ein Barcode-Bild hoch. Die dekodierten Ticket-Daten erscheinen
                hier.
              </p>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div
              className="brutal-card"
              style={{
                minHeight: '300px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                background: '#fff'
              }}
            >
              <div
                style={{
                  animation: 'spin 2s linear infinite',
                  border: '8px solid #f3f3f3',
                  borderTop: '8px solid #000',
                  borderRadius: '50%',
                  width: '50px',
                  height: '50px',
                  marginBottom: '1rem'
                }}
              />
              <p style={{ fontWeight: 900, textTransform: 'uppercase', fontSize: '1.25rem' }}>Dekodiere Daten...</p>
              <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.25rem' }}>
                Lese Barcode und entpacke Datencontainer. Bitte warten.
              </p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="brutal-card" style={{ background: 'var(--accent-pink)', color: '#fff', padding: '1.5rem' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontWeight: 900,
                  fontSize: '1.25rem',
                  marginBottom: '1rem',
                  textTransform: 'uppercase'
                }}
              >
                <XCircle size={24} style={{ color: '#fff' }} />
                Dekodierung Fehlgeschlagen
              </div>
              <p
                style={{
                  fontWeight: 800,
                  fontSize: '1rem',
                  background: '#000',
                  padding: '0.75rem',
                  border: '2px solid #fff'
                }}
              >
                {error}
              </p>
              <p style={{ fontSize: '0.85rem', marginTop: '1rem', lineHeight: 1.4 }}>
                Bitte stelle sicher, dass:
                <br />- Der Hex-String vollständig und korrekt ist.
                <br />- Das Bild einen gut erkennbaren Aztec-Barcode enthält.
                <br />- Das Ticket dem UIC-918.3 Standard entspricht.
              </p>
            </div>
          )}

          {/* Result Output */}
          {result && (
            <div>
              {/* Signature Status Banner */}
              {result.isSignatureValid ? (
                <div className="signature-status status-valid">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                    <CheckCircle2 size={24} />
                    <span>Signatur erfolgreich verifiziert!</span>
                  </div>
                </div>
              ) : result.validityOfSignature === 'Public Key not found' ? (
                <div className="signature-status status-unknown">
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      flexDirection: 'column'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <AlertTriangle size={24} />
                      <span>Signaturschlüssel fehlt</span>
                    </div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'none' }}>
                      (Für RICS {result.header.rics} und Key-ID {result.header.key_id} wurde kein lokaler
                      Zertifikatsschlüssel gefunden.)
                    </span>
                  </div>
                </div>
              ) : (
                <div className="signature-status status-invalid">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                    <XCircle size={24} />
                    <span>Ungültige Signatur!</span>
                  </div>
                </div>
              )}

              {/* Main Ticket Header Info */}
              <div className="brutal-card" style={{ background: 'var(--bg-white)' }}>
                <div className="brutal-card-header" style={{ background: 'var(--accent-teal)' }}>
                  <span>TICKET DETAILS</span>
                  <Ticket size={20} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div style={{ border: '2px solid #000', padding: '0.5rem', background: '#f9f9f9' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 900, color: '#666', textTransform: 'uppercase' }}>
                      Bahnunternehmen (RICS)
                    </div>
                    <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>{formatRICS(result.header.rics)}</div>
                  </div>
                  <div style={{ border: '2px solid #000', padding: '0.5rem', background: '#f9f9f9' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 900, color: '#666', textTransform: 'uppercase' }}>
                      Schlüssel-ID (Key ID)
                    </div>
                    <div style={{ fontWeight: 800, fontSize: '0.95rem', fontFamily: 'monospace' }}>
                      {result.header.key_id}
                    </div>
                  </div>
                  <div style={{ border: '2px solid #000', padding: '0.5rem', background: '#f9f9f9' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 900, color: '#666', textTransform: 'uppercase' }}>
                      Barcode Version
                    </div>
                    <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>Version {result.version}</div>
                  </div>
                  <div style={{ border: '2px solid #000', padding: '0.5rem', background: '#f9f9f9' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 900, color: '#666', textTransform: 'uppercase' }}>
                      UMID (Unique Ticket ID)
                    </div>
                    <div
                      style={{ fontWeight: 800, fontSize: '0.95rem', fontFamily: 'monospace', wordBreak: 'break-all' }}
                    >
                      {result.header.umid}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <span className="brutal-badge brutal-badge-yellow">Data Length: {result.ticketDataLength} Bytes</span>
                  <span className="brutal-badge brutal-badge-teal">Containers: {result.ticketContainers.length}</span>
                </div>
              </div>

              {/* Parsed Containers List */}
              <h2
                style={{
                  fontSize: '1.5rem',
                  fontWeight: 900,
                  textTransform: 'uppercase',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <FileCode size={24} />
                Daten-Container
              </h2>

              {result.ticketContainers.map((container, idx) => {
                const isOpen = expandedContainers[container.id];
                const viewMode = containerViewMode[container.id] || 'details';

                return (
                  <div key={container.id} className="brutal-card" style={{ padding: '0 0 1rem 0', overflow: 'hidden' }}>
                    {/* Container Title Header Accordion Trigger */}
                    <div
                      onClick={() => toggleContainer(container.id)}
                      style={{
                        background: isOpen ? 'var(--accent-yellow)' : '#fff',
                        padding: '1rem',
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        borderBottom: '4px solid #000',
                        fontWeight: 900,
                        fontSize: '1.1rem',
                        textTransform: 'uppercase',
                        userSelect: 'none'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span className="brutal-badge brutal-badge-teal" style={{ background: '#000', color: '#fff' }}>
                          {container.id}
                        </span>
                        <span style={{ fontSize: '0.85rem', fontWeight: 800 }}>
                          [ Version {container.version} | {container.length} Bytes ]
                        </span>
                      </div>
                      <div
                        style={{
                          transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)',
                          transition: 'transform 0.15s ease',
                          fontWeight: 900
                        }}
                      >
                        <ArrowRight size={20} />
                      </div>
                    </div>

                    {/* Container Content Body */}
                    {isOpen && (
                      <div style={{ padding: '1rem' }}>
                        {/* Tab Switcher inside Container (Details vs JSON) */}
                        <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1rem' }}>
                          <button
                            type="button"
                            className={`brutal-btn`}
                            onClick={() => setViewModeForContainer(container.id, 'details')}
                            style={{
                              padding: '0.25rem 0.75rem',
                              fontSize: '0.75rem',
                              background: viewMode === 'details' ? 'var(--accent-teal)' : '#fff',
                              boxShadow: '2px 2px 0px #000',
                              borderWidth: '2px'
                            }}
                          >
                            Strukturierte Ansicht
                          </button>
                          <button
                            type="button"
                            className={`brutal-btn`}
                            onClick={() => setViewModeForContainer(container.id, 'json')}
                            style={{
                              padding: '0.25rem 0.75rem',
                              fontSize: '0.75rem',
                              background: viewMode === 'json' ? 'var(--accent-teal)' : '#fff',
                              boxShadow: '2px 2px 0px #000',
                              borderWidth: '2px'
                            }}
                          >
                            Raw JSON
                          </button>
                        </div>

                        {/* Rendering logic based on selected sub-tab */}
                        {viewMode === 'details' ? (
                          container.id === 'U_FLEX' ? (
                            renderUFlexDetails(container.container_data)
                          ) : (
                            renderGenericDetails(container.container_data)
                          )
                        ) : (
                          <div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.5rem' }}>
                              <button
                                type="button"
                                className="brutal-btn"
                                onClick={() => copyToClipboard(JSON.stringify(container.container_data, null, 2))}
                                style={{
                                  padding: '0.25rem 0.5rem',
                                  fontSize: '0.7rem',
                                  boxShadow: '2px 2px 0px #000',
                                  borderWidth: '2px',
                                  background: '#fff'
                                }}
                              >
                                {copiedText ? <Check size={12} /> : <Copy size={12} />}
                                {copiedText ? 'Kopiert' : 'JSON kopieren'}
                              </button>
                            </div>
                            <pre className="brutal-code">{JSON.stringify(container.container_data, null, 2)}</pre>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer
        style={{
          marginTop: '4rem',
          borderTop: '4px solid #000',
          padding: '2rem 0',
          textAlign: 'center',
          fontSize: '0.8rem'
        }}
      >
        <p style={{ fontWeight: 800 }}>
          UIC 918-3 Barcode Decoder &bull; {new Date().getFullYear()} Francis Doege & Contributors
        </p>
        <p style={{ color: '#666', marginTop: '0.25rem' }}>
          Ausführung in Docker &bull; Spezifikation Version 3 &bull; Open Source MIT
        </p>
      </footer>
    </div>
  );
}
