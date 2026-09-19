import React, { useState } from 'react';

const EXPENSIVE_TPL = `AWSTemplateFormatVersion: '2010-09-09'
Description: 'Production-Grade Architecture (High Cost)'
Resources:
  MyProductionDatabase:
    Type: 'AWS::RDS::DBInstance'
    Properties:
      DBInstanceClass: db.m5.large
  MyCostlyNatGateway:
    Type: 'AWS::EC2::NatGateway'
    Properties:
      SubnetId: subnet-12345`;

const SAFE_TPL = `AWSTemplateFormatVersion: '2010-09-09'
Description: 'Student-Friendly Serverless Architecture (Zero Cost)'
Resources:
  MyFreeDatabase:
    Type: 'AWS::DynamoDB::Table'
    Properties:
      BillingMode: PAY_PER_REQUEST
  MyMicroServer:
    Type: 'AWS::EC2::Instance'
    Properties:
      InstanceType: t2.micro`;

const OUR_TPL = `AWSTemplateFormatVersion: '2010-09-09'
Description: 'DiffPulse - Zero Cost Serverless Backend'
Resources:
  DiffPulseParserFunction:
    Type: 'AWS::Lambda::Function'
    Properties:
      Runtime: nodejs20.x
      MemorySize: 128
  DiffPulseHttpApi:
    Type: 'AWS::ApiGatewayV2::Api'
    Properties:
      ProtocolType: HTTP`;

export default function App() {
  const [template, setTemplate] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_URL = "https://y0ciox7p16.execute-api.us-east-1.amazonaws.com";

  const handleAnalyze = async () => {
    if (!template.trim()) return;
    setLoading(true);
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ template })
      });
      const data = await response.json();
      setResult(data);
    } catch (err) {
      alert("Error contacting analysis backend");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#0f172a', color: '#f8fafc', minHeight: '100vh', padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <header style={{ borderBottom: '1px solid #334155', paddingBottom: '1.5rem', marginBottom: '2rem', textAlign: 'center' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: '900', color: '#38bdf8', margin: 0, letterSpacing: '-1px' }}>DiffPulse</h1>
          <p style={{ color: '#94a3b8', marginTop: '0.5rem', fontSize: '1.1rem' }}>Zero-Cost Cloud Infrastructure Drift & Cost Analyzer</p>
          <span style={{ display: 'inline-block', marginTop: '1rem', padding: '0.25rem 0.75rem', backgroundColor: '#1e293b', color: '#cbd5e1', borderRadius: '999px', fontSize: '0.8rem', border: '1px solid #334155' }}>
            Built for the AWS Zero to Shipped Hackathon
          </span>
        </header>

        <main>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '1rem' }}>
            <label style={{ fontWeight: '600', color: '#e2e8f0' }}>Paste CloudFormation / Terraform YAML:</label>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={() => { setTemplate(EXPENSIVE_TPL); setResult(null); }} style={{ backgroundColor: '#450a0a', color: '#f87171', border: '1px solid #7f1d1d', padding: '0.4rem 0.8rem', borderRadius: '0.375rem', fontSize: '0.85rem', cursor: 'pointer', fontWeight: 'bold' }}>
                Load Expensive Template
              </button>
              <button onClick={() => { setTemplate(SAFE_TPL); setResult(null); }} style={{ backgroundColor: '#052e16', color: '#4ade80', border: '1px solid #14532d', padding: '0.4rem 0.8rem', borderRadius: '0.375rem', fontSize: '0.85rem', cursor: 'pointer', fontWeight: 'bold' }}>
                Load Free-Tier Template
              </button>
              <button onClick={() => { setTemplate(OUR_TPL); setResult(null); }} style={{ backgroundColor: '#082f49', color: '#38bdf8', border: '1px solid #0c4a6e', padding: '0.4rem 0.8rem', borderRadius: '0.375rem', fontSize: '0.85rem', cursor: 'pointer', fontWeight: 'bold' }}>
                Load DiffPulse Architecture
              </button>
            </div>
          </div>

          <textarea
            rows="12"
            style={{ width: '100%', backgroundColor: '#1e293b', color: '#f8fafc', padding: '1.25rem', borderRadius: '0.5rem', border: '1px solid #334155', fontFamily: 'monospace', fontSize: '0.95rem', boxSizing: 'border-box', boxShadow: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)' }}
            placeholder="Paste your infrastructure blueprint here..."
            value={template}
            onChange={(e) => setTemplate(e.target.value)}
          />

          <button
            onClick={handleAnalyze}
            disabled={loading || !template.trim()}
            style={{ width: '100%', backgroundColor: loading ? '#0ea5e9' : '#0284c7', color: 'white', border: 'none', padding: '1rem', borderRadius: '0.5rem', fontSize: '1.1rem', fontWeight: 'bold', cursor: template.trim() ? 'pointer' : 'not-allowed', marginTop: '1.25rem', transition: 'background-color 0.2s', opacity: template.trim() ? 1 : 0.5 }}
          >
            {loading ? 'Analyzing Infrastructure Context...' : 'Analyze Infrastructure Risk'}
          </button>

          {result && (
            <section style={{ marginTop: '2.5rem', backgroundColor: '#1e293b', padding: '2rem', borderRadius: '0.75rem', border: '1px solid #334155', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #334155', paddingBottom: '1rem' }}>
                <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Cost Risk Score:</h2>
                <span style={{ fontSize: '2rem', fontWeight: '900', color: result.costScore > 40 ? '#ef4444' : '#22c55e' }}>
                  {result.costScore} <span style={{ fontSize: '1.25rem', color: '#64748b' }}>/ 100</span>
                </span>
              </div>

              {result.summary && (
                <div style={{ marginBottom: '1.5rem', padding: '0.75rem', backgroundColor: '#0f172a', borderRadius: '0.375rem', borderLeft: '4px solid #38bdf8', color: '#cbd5e1', fontSize: '0.9rem' }}>
                  {result.summary}
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <div>
                  <h3 style={{ color: '#cbd5e1', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ color: '#ef4444' }}>■</span> Detected Cost Risks
                  </h3>
                  {result.risks?.length === 0 ? (
                    <p style={{ color: '#22c55e', backgroundColor: '#052e16', padding: '0.75rem', borderRadius: '0.375rem', border: '1px solid #14532d' }}>No high-cost resources detected. Fully Free-Tier compliant!</p>
                  ) : (
                    <ul style={{ paddingLeft: '1.25rem', margin: 0 }}>
                      {result.risks?.map((risk, index) => (
                        <li key={index} style={{ color: '#fca5a5', marginBottom: '0.75rem', lineHeight: '1.4' }}>{risk}</li>
                      ))}
                    </ul>
                  )}
                </div>

                <div>
                  <h3 style={{ color: '#cbd5e1', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ color: '#22c55e' }}>■</span> Free-Tier Recommendations
                  </h3>
                  <ul style={{ paddingLeft: '1.25rem', margin: 0 }}>
                    {result.recommendations?.map((rec, index) => (
                      <li key={index} style={{ color: '#86efac', marginBottom: '0.75rem', lineHeight: '1.4' }}>{rec}</li>
                    ))}
                    {result.recommendations?.length === 0 && <li style={{ color: '#94a3b8' }}>Infrastructure is optimized.</li>}
                  </ul>
                </div>
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
