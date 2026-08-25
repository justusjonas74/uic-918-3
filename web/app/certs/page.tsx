'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Search,
  Calendar,
  Shield,
  Copy,
  Check,
  RefreshCw,
  AlertTriangle,
  Info,
  Award
} from 'lucide-react';

interface Certificate {
  issuerName?: string[];
  issuerCode?: string[];
  versionType?: string[];
  signatureAlgorithm?: string[];
  id?: string[];
  publicKey?: string[];
  barcodeVersion?: string[];
  startDate?: string[];
  endDate?: string[];
  isCustom?: boolean[];
}

export default function CertsPage() {
  const [certs, setCerts] = useState<Certificate[]>([]);
  const [filteredCerts, setFilteredCerts] = useState<Certificate[]>([]);
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedText, setCopiedText] = useState<boolean>(false);

  useEffect(() => {
    fetchCerts();
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredCerts(certs);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = certs.filter((cert) => {
      const name = (cert.issuerName?.[0] || '').toLowerCase();
      const code = (cert.issuerCode?.[0] || '').toLowerCase();
      const id = (cert.id?.[0] || '').toLowerCase();
      return name.includes(query) || code.includes(query) || id.includes(query);
    });
    setFilteredCerts(filtered);
  }, [searchQuery, certs]);

  const fetchCerts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/certs');
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Fehler beim Laden der Zertifikate.');
      }
      setCerts(data.certs || []);
      setFilteredCerts(data.certs || []);
    } catch (err: any) {
      setError(err.message || 'Ein unbekannter Fehler ist aufgetreten.');
    } finally {
      setLoading(false);
    }
  };

  const formatPem = (pubKeyStr: string | undefined) => {
    if (!pubKeyStr) return '';
    const cleanKey = pubKeyStr.replace(/\s+/g, '');
    const formatted = cleanKey.replace(/(.{64})/g, '$1\n').trim();
    return `-----BEGIN CERTIFICATE-----\n${formatted}\n-----END CERTIFICATE-----`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  return (
    <div>
      {/* Header */}
      <header
        className="brutal-card"
        style={{ background: 'var(--accent-teal)', margin: '2rem 0', padding: '1.5rem', textAlign: 'center' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/" className="brutal-btn brutal-btn-pink" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
            <ArrowLeft size={16} />
            Zurück
          </Link>
          <h1
            style={{
              fontSize: '2rem',
              fontWeight: 900,
              textTransform: 'uppercase',
              letterSpacing: '-0.05em',
              lineHeight: 1,
              flex: 1,
              textAlign: 'center'
            }}
          >
            Zertifikate & Signaturen
          </h1>
          <div style={{ width: '100px' }}></div> {/* Spacer to align title */}
        </div>
        <p style={{ marginTop: '0.5rem', fontSize: '1rem', fontWeight: 700 }}>
          [ VERWALTUNG LOKALER SIGNATURSCHLÜSSEL FÜR DIE VERIFIZIERUNG ]
        </p>
      </header>

      {/* Main Grid */}
      <div className="brutal-grid" style={{ gridTemplateColumns: '1fr', gap: '2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem', minWidth: '0' }}>
          {/* Search bar */}
          <div className="brutal-card" style={{ marginBottom: 0 }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <Search size={20} />
              <input
                type="text"
                className="brutal-input"
                placeholder="Suche nach Name, RICS-Code oder Key-ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {certs.length > 0 && (
                <span className="brutal-badge brutal-badge-yellow" style={{ whiteSpace: 'nowrap' }}>
                  {filteredCerts.length} / {certs.length} Keys
                </span>
              )}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
            {/* Split layout for Desktop */}
            <div style={{ display: 'flex', flexDirection: 'row', gap: '2rem', flexWrap: 'wrap' }}>
              
              {/* Left Side: Certificates list */}
              <div style={{ flex: '1 1 450px', minWidth: '300px' }}>
                {loading ? (
                  <div
                    className="brutal-card"
                    style={{
                      minHeight: '200px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}
                  >
                    <RefreshCw className="animate-spin" size={32} style={{ marginBottom: '1rem' }} />
                    <p style={{ fontWeight: 900 }}>Zertifikate werden geladen...</p>
                  </div>
                ) : error ? (
                  <div className="brutal-card" style={{ background: 'var(--accent-pink)', color: '#fff' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 900, marginBottom: '0.5rem' }}>
                      <AlertTriangle size={20} />
                      Fehler beim Laden
                    </div>
                    <p style={{ background: '#000', padding: '0.5rem', border: '1px solid #fff' }}>{error}</p>
                  </div>
                ) : filteredCerts.length === 0 ? (
                  <div
                    className="brutal-card"
                    style={{
                      minHeight: '200px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderStyle: 'dashed'
                    }}
                  >
                    <Info size={32} style={{ color: '#666', marginBottom: '1rem' }} />
                    <p style={{ fontWeight: 800 }}>Keine Zertifikate gefunden</p>
                    <p style={{ fontSize: '0.85rem', color: '#666' }}>Versuche einen anderen Suchbegriff.</p>
                  </div>
                ) : (
                  <div
                    style={{
                      maxHeight: '600px',
                      overflowY: 'auto',
                      border: 'var(--border-thick)',
                      boxShadow: 'var(--shadow-flat)',
                      background: 'var(--bg-white)'
                    }}
                  >
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ background: '#000', color: '#fff', textAlign: 'left' }}>
                          <th style={{ padding: '0.75rem', fontWeight: 900 }}>RICS : ID</th>
                          <th style={{ padding: '0.75rem', fontWeight: 900 }}>Herausgeber (RICS Name)</th>
                          <th style={{ padding: '0.75rem', fontWeight: 900, textAlign: 'center' }}>Typ</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredCerts.map((cert, idx) => {
                          const rics = cert.issuerCode?.[0] || 'N/A';
                          const keyId = cert.id?.[0] || 'N/A';
                          const selector = `${rics}:${keyId}`;
                          const isSelected = selectedCert && selectedCert.issuerCode?.[0] === rics && selectedCert.id?.[0] === keyId;

                          return (
                            <tr
                              key={idx}
                              onClick={() => setSelectedCert(cert)}
                              style={{
                                cursor: 'pointer',
                                background: isSelected ? 'var(--accent-yellow)' : '#fff',
                                borderBottom: '2px solid #000',
                                transition: 'background-color 0.1s'
                              }}
                              className="cert-row"
                            >
                              <td style={{ padding: '0.75rem', fontWeight: 800, fontFamily: 'monospace' }}>
                                {selector}
                              </td>
                              <td style={{ padding: '0.75rem', fontWeight: 700 }}>
                                {cert.issuerName?.[0] || 'Unbekannt'}
                              </td>
                              <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                                {cert.isCustom?.[0] ? (
                                  <span className="brutal-badge brutal-badge-pink" style={{ fontSize: '0.65rem' }}>
                                    Custom
                                  </span>
                                ) : (
                                  <span className="brutal-badge brutal-badge-teal" style={{ fontSize: '0.65rem' }}>
                                    System
                                  </span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Right Side: Certificate details */}
              <div style={{ flex: '1 1 450px', minWidth: '300px' }}>
                {selectedCert ? (
                  <div className="brutal-card" style={{ margin: 0 }}>
                    <div
                      className="brutal-card-header"
                      style={{
                        background: selectedCert.isCustom?.[0] ? 'var(--accent-pink)' : 'var(--accent-teal)',
                        color: selectedCert.isCustom?.[0] ? '#fff' : 'var(--text-black)'
                      }}
                    >
                      <span>DETAILS: {selectedCert.issuerCode?.[0]}:{selectedCert.id?.[0]}</span>
                      <Shield size={20} />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', border: '2px solid #000' }}>
                        <tbody>
                          <tr style={{ borderBottom: '2px solid #000' }}>
                            <td style={{ padding: '0.5rem', fontWeight: 'bold', background: '#f5f5f5', width: '35%', borderRight: '2px solid #000' }}>Herausgeber</td>
                            <td style={{ padding: '0.5rem', fontWeight: 800 }}>{selectedCert.issuerName?.[0] || 'N/A'}</td>
                          </tr>
                          <tr style={{ borderBottom: '2px solid #000' }}>
                            <td style={{ padding: '0.5rem', fontWeight: 'bold', background: '#f5f5f5', borderRight: '2px solid #000' }}>RICS Code</td>
                            <td style={{ padding: '0.5rem', fontWeight: 800, fontFamily: 'monospace' }}>{selectedCert.issuerCode?.[0] || 'N/A'}</td>
                          </tr>
                          <tr style={{ borderBottom: '2px solid #000' }}>
                            <td style={{ padding: '0.5rem', fontWeight: 'bold', background: '#f5f5f5', borderRight: '2px solid #000' }}>Schlüssel-ID</td>
                            <td style={{ padding: '0.5rem', fontWeight: 800, fontFamily: 'monospace' }}>{selectedCert.id?.[0] || 'N/A'}</td>
                          </tr>
                          <tr style={{ borderBottom: '2px solid #000' }}>
                            <td style={{ padding: '0.5rem', fontWeight: 'bold', background: '#f5f5f5', borderRight: '2px solid #000' }}>Algorithmus</td>
                            <td style={{ padding: '0.5rem', fontFamily: 'monospace' }}>{selectedCert.signatureAlgorithm?.[0] || 'N/A'}</td>
                          </tr>
                          <tr style={{ borderBottom: '2px solid #000' }}>
                            <td style={{ padding: '0.5rem', fontWeight: 'bold', background: '#f5f5f5', borderRight: '2px solid #000' }}>Versionstyp</td>
                            <td style={{ padding: '0.5rem' }}>
                              <span className="brutal-badge brutal-badge-yellow" style={{ fontSize: '0.7rem' }}>
                                {selectedCert.versionType?.[0] || 'N/A'}
                              </span>
                            </td>
                          </tr>
                          <tr style={{ borderBottom: '2px solid #000' }}>
                            <td style={{ padding: '0.5rem', fontWeight: 'bold', background: '#f5f5f5', borderRight: '2px solid #000' }}>Ticket Version</td>
                            <td style={{ padding: '0.5rem' }}>Version {selectedCert.barcodeVersion?.[0] || '3'}</td>
                          </tr>
                          <tr style={{ borderBottom: '2px solid #000' }}>
                            <td style={{ padding: '0.5rem', fontWeight: 'bold', background: '#f5f5f5', borderRight: '2px solid #000' }}>Gültig ab</td>
                            <td style={{ padding: '0.5rem' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                <Calendar size={14} />
                                {selectedCert.startDate?.[0] || 'N/A'}
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td style={{ padding: '0.5rem', fontWeight: 'bold', background: '#f5f5f5', borderRight: '2px solid #000' }}>Gültig bis</td>
                            <td style={{ padding: '0.5rem' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                <Calendar size={14} />
                                {selectedCert.endDate?.[0] || 'N/A'}
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>

                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                          <span style={{ fontWeight: 800, textTransform: 'uppercase', fontSize: '0.85rem' }}>Öffentlicher Schlüssel (PEM)</span>
                          <button
                            type="button"
                            className="brutal-btn"
                            onClick={() => copyToClipboard(formatPem(selectedCert.publicKey?.[0]))}
                            style={{
                              padding: '0.25rem 0.5rem',
                              fontSize: '0.7rem',
                              boxShadow: '2px 2px 0px #000',
                              borderWidth: '2px',
                              background: '#fff'
                            }}
                          >
                            {copiedText ? <Check size={12} /> : <Copy size={12} />}
                            {copiedText ? 'Kopiert' : 'Kopieren'}
                          </button>
                        </div>
                        <pre
                          className="brutal-code"
                          style={{
                            maxHeight: '200px',
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-all',
                            fontSize: '0.75rem'
                          }}
                        >
                          {formatPem(selectedCert.publicKey?.[0])}
                        </pre>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    className="brutal-card"
                    style={{
                      minHeight: '350px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderStyle: 'dashed',
                      background: 'transparent',
                      boxShadow: 'none',
                      margin: 0
                    }}
                  >
                    <Award size={48} style={{ color: '#aaa', marginBottom: '1rem' }} />
                    <p style={{ fontWeight: 800, textTransform: 'uppercase', color: '#555' }}>
                      Kein Schlüssel ausgewählt
                    </p>
                    <p style={{ fontSize: '0.85rem', color: '#777', textAlign: 'center', marginTop: '0.25rem', maxWidth: '250px' }}>
                      Wähle links ein Zertifikat in der Liste aus, um die Details und den öffentlichen Schlüssel anzuzeigen.
                    </p>
                  </div>
                )}
              </div>

            </div>
          </div>
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
      </footer>
    </div>
  );
}
