import React, { useState, useEffect } from 'react';
import { X, Lock, CheckCircle, QrCode } from 'lucide-react';

interface EsewaPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  amount: number;
  esewaNumber?: string;
}

export const EsewaPaymentModal: React.FC<EsewaPaymentModalProps> = ({ isOpen, onClose, onSuccess, amount, esewaNumber = '9824024789' }) => {
  const [paymentState, setPaymentState] = useState<'pending' | 'verifying' | 'success'>('pending');

  useEffect(() => {
    if (!isOpen) {
      setPaymentState('pending');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleVerifyPayment = () => {
    setPaymentState('verifying');
    
    // Simulate payment verification delay
    setTimeout(() => {
      setPaymentState('success');
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1500);
    }, 2500);
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(5px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 100000, padding: '1rem'
    }}>
      <div style={{
        background: '#ffffff', borderRadius: '16px', width: '100%', maxWidth: '400px',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{ background: '#60B52F', padding: '1.5rem', position: 'relative', textAlign: 'center' }}>
          <button 
            onClick={onClose}
            style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: 'none', color: '#ffffff', cursor: 'pointer' }}
          >
            <X size={24} />
          </button>
          
          <h2 style={{ color: '#ffffff', margin: 0, fontSize: '1.5rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            <Lock size={20} /> Pay via QR
          </h2>
          <p style={{ color: '#eff6ff', margin: '0.5rem 0 0 0', fontSize: '0.95rem' }}>
            Unlock High-Quality PDF Download
          </p>
        </div>

        {/* Content */}
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          {paymentState === 'success' ? (
            <div style={{ padding: '2rem 0' }}>
              <CheckCircle size={72} color="#10b981" style={{ margin: '0 auto', marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.25rem', color: '#1f2937', margin: '0 0 0.5rem 0' }}>Payment Successful!</h3>
              <p style={{ color: '#6b7280', margin: 0 }}>Unlocking your download...</p>
            </div>
          ) : (
            <>
              <div style={{ marginBottom: '1.5rem' }}>
                <span style={{ color: '#475569', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>Total Amount to Pay</span>
                <span style={{ color: '#0f172a', fontSize: '2rem', fontWeight: 800 }}>Rs. {amount}</span>
              </div>

              <div style={{ 
                background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', 
                border: '2px dashed #cbd5e1', display: 'inline-block', marginBottom: '1.5rem' 
              }}>
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent('eSewa ID: ' + esewaNumber + ', Amount: Rs. ' + amount)}`}
                  alt="eSewa QR Code" 
                  style={{ width: '200px', height: '200px', borderRadius: '8px' }}
                />
                <p style={{ color: '#0f172a', fontSize: '1rem', marginTop: '1rem', marginBottom: 0, fontWeight: 700 }}>
                  eSewa ID: {esewaNumber}
                </p>
                <p style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '0.2rem', marginBottom: 0, fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                  <QrCode size={16} /> Scan with eSewa App
                </p>
              </div>

              <button
                onClick={handleVerifyPayment}
                disabled={paymentState === 'verifying'}
                style={{
                  width: '100%', background: paymentState === 'verifying' ? '#94a3b8' : '#60B52F', color: '#ffffff', border: 'none',
                  padding: '1rem', borderRadius: '8px', fontSize: '1.1rem', fontWeight: 700,
                  cursor: paymentState === 'verifying' ? 'wait' : 'pointer', transition: 'background 0.2s'
                }}
              >
                {paymentState === 'verifying' ? 'Verifying Payment...' : 'I have Paid (Verify)'}
              </button>
              
              <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '0.8rem', marginTop: '1rem' }}>
                Click Verify after scanning and completing the payment.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
