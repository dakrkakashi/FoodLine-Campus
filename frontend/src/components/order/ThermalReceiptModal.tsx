'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { X, Printer, CheckCircle2, ShieldCheck } from 'lucide-react';

interface ThermalReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: {
    order_token: string;
    pickup_otp: string;
    total_amount: number;
    created_at: string;
    utr_number?: string;
    student_prn?: string;
    notes?: string;
    order_items?: {
      item_name: string;
      quantity: number;
      unit_price: number;
      subtotal: number;
    }[];
    pickup_slots?: {
      label: string;
      start_time?: string;
      end_time?: string;
    };
  } | null;
  qrPassUrl?: string;
}

/**
 * Dedicated, 1-Page Isolated Thermal Receipt Slip.
 * Rendered via React Portal directly into document.body so print engines
 * never encounter ancestor layout transforms, 100vh containers, or hidden page flow.
 */
function ThermalReceiptPrintSlip({
  order,
  qrPassUrl,
  formattedDate,
}: {
  order: NonNullable<ThermalReceiptModalProps['order']>;
  qrPassUrl?: string;
  formattedDate: string;
}) {
  return (
    <div id="thermal-receipt-print-area">
      {/* Header */}
      <div className="receipt-header">
        <div className="receipt-brand">CAFE @7</div>
        <div className="receipt-sub">Sanjivani University • Main Academic Quad</div>
        <div className="receipt-addr">Kopargaon, Maharashtra • 423603</div>
        <div className="receipt-fssai">FSSAI Lic: 11523038000412 • GST: Campus Exempt</div>
      </div>

      <div className="receipt-divider" />

      {/* Hero Token & OTP */}
      <div className="receipt-token-box">
        <div className="receipt-label">Order Token</div>
        <div className="receipt-token">{order.order_token}</div>
        <div className="receipt-otp">PICKUP OTP: {order.pickup_otp}</div>
      </div>

      <div className="receipt-divider" />

      {/* Metadata */}
      <div className="receipt-meta">
        <div className="receipt-row">
          <span>Date/Time:</span>
          <span>{formattedDate}</span>
        </div>
        <div className="receipt-row">
          <span>Break Slot:</span>
          <span>{order.pickup_slots?.label || 'Regular Break'}</span>
        </div>
        {order.student_prn && (
          <div className="receipt-row">
            <span>Student PRN:</span>
            <span>{order.student_prn}</span>
          </div>
        )}
        {order.utr_number && (
          <div className="receipt-row">
            <span>UPI Bank UTR:</span>
            <span>{order.utr_number}</span>
          </div>
        )}
      </div>

      <div className="receipt-divider" />

      {/* Itemized Table */}
      <div className="receipt-items">
        <div className="receipt-item-header">
          <span style={{ width: '15%' }}>Qty</span>
          <span style={{ width: '55%' }}>Item</span>
          <span style={{ width: '30%', textAlign: 'right' }}>Amt</span>
        </div>
        <div className="receipt-divider-light" />
        {(order.order_items || []).map((item, idx) => (
          <div key={idx} className="receipt-item-row">
            <span style={{ width: '15%', fontWeight: 'bold' }}>{item.quantity}×</span>
            <span style={{ width: '55%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {item.item_name}
            </span>
            <span style={{ width: '30%', textAlign: 'right', fontWeight: 'bold' }}>
              ₹{item.subtotal ? Number(item.subtotal).toFixed(2) : (item.quantity * item.unit_price).toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      <div className="receipt-divider" />

      {/* Financials */}
      <div className="receipt-financials">
        <div className="receipt-row">
          <span>Item Subtotal:</span>
          <span>₹{Number(order.total_amount).toFixed(2)}</span>
        </div>
        <div className="receipt-row">
          <span>Campus Express Fee:</span>
          <span>₹0.00 (FREE)</span>
        </div>
        <div className="receipt-row receipt-total">
          <span>TOTAL PAID (UPI):</span>
          <span>₹{Number(order.total_amount).toFixed(2)}</span>
        </div>
      </div>

      <div className="receipt-divider-double" />

      {/* Optical QR Pass Code */}
      {qrPassUrl && (
        <div className="receipt-qr-wrap">
          <img
            src={qrPassUrl}
            alt={`QR ${order.order_token}`}
            className="receipt-qr-img"
          />
          <div className="receipt-qr-caption">
            Flash this optical pass at Cafe @7 express lane scanner for instant collection.
          </div>
        </div>
      )}

      {/* Thermal Footer */}
      <div className="receipt-footer">
        <div className="receipt-bold">Powered by FoodLine Campus Ecosystem</div>
        <div>Zero Queue • 100% Student Free • Hot Pickups</div>
        <div className="receipt-fine">Keep this receipt slip for expense tally or offline handover.</div>
      </div>
    </div>
  );
}

export function ThermalReceiptModal({
  isOpen,
  onClose,
  order,
  qrPassUrl,
}: ThermalReceiptModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (order) {
      document.body.classList.add('has-thermal-receipt');
    }
    return () => {
      document.body.classList.remove('has-thermal-receipt');
      document.body.classList.remove('receipt-modal-open');
      document.body.classList.remove('printing-receipt');
    };
  }, [order]);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('receipt-modal-open');
    } else {
      document.body.classList.remove('receipt-modal-open');
      document.body.classList.remove('printing-receipt');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleAfterPrint = () => {
      document.body.classList.remove('printing-receipt');
    };
    window.addEventListener('afterprint', handleAfterPrint);
    return () => {
      window.removeEventListener('afterprint', handleAfterPrint);
    };
  }, []);

  if (!order) return null;

  const handlePrint = () => {
    document.body.classList.add('printing-receipt');
    // Defer print invocation to the next event loop tick so the click handler completes
    // immediately (<1ms), preventing browser INP (Interaction to Next Paint) main-thread freeze.
    setTimeout(() => {
      window.print();
    }, 50);
    setTimeout(() => {
      document.body.classList.remove('printing-receipt');
    }, 2000);
  };

  const formattedDate = new Date(order.created_at || Date.now()).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  return (
    <>
      {/* 1. Dedicated Portal for Crisp 1-Page Thermal Printout directly in document.body */}
      {mounted && typeof document !== 'undefined' &&
        createPortal(
          <ThermalReceiptPrintSlip
            order={order}
            qrPassUrl={qrPassUrl}
            formattedDate={formattedDate}
          />,
          document.body
        )}

      {/* 2. Interactive On-Screen Modal for User Viewing */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto print:hidden">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-md bg-white text-black rounded-3xl shadow-2xl overflow-hidden my-8"
            >
              {/* Header Action Bar */}
              <div className="flex items-center justify-between px-6 py-4 bg-zinc-100 border-b border-zinc-200">
                <span className="text-xs font-black uppercase tracking-wider text-zinc-600 flex items-center gap-1.5">
                  <ShieldCheck size={16} className="text-emerald-600" />
                  <span>Verified Campus Express Pass</span>
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrint}
                    className="px-3.5 py-1.5 bg-black text-white text-xs font-black rounded-xl hover:bg-zinc-800 transition flex items-center gap-1.5 cursor-pointer shadow-md active:scale-95"
                  >
                    <Printer size={13} />
                    <span>Print Receipt</span>
                  </button>

                  <button
                    onClick={onClose}
                    className="w-8 h-8 rounded-full bg-zinc-200 hover:bg-zinc-300 flex items-center justify-center transition cursor-pointer text-zinc-700 active:scale-95"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* On-Screen Receipt Preview */}
              <div className="p-6 sm:p-8 font-mono text-xs leading-relaxed text-zinc-900 bg-white">
                {/* Canteen Header */}
                <div className="text-center border-b-2 border-dashed border-zinc-400 pb-4 mb-4">
                  <h2 className="text-xl font-black tracking-tight text-black font-sans uppercase">
                    CAFE @7
                  </h2>
                  <p className="text-[11px] font-bold text-zinc-600 uppercase">
                    Sanjivani University • Main Academic Quad
                  </p>
                  <p className="text-[10px] text-zinc-500">
                    Kopargaon, Maharashtra • 423603
                  </p>
                  <p className="text-[10px] text-zinc-500 font-bold mt-1">
                    FSSAI Lic: 11523038000412 • GST: Campus Exempt
                  </p>
                </div>

                {/* Token & OTP Hero */}
                <div className="bg-zinc-100 rounded-2xl p-4 text-center border border-zinc-300 mb-4">
                  <div className="text-[10px] uppercase font-bold text-zinc-500">Order Token</div>
                  <div className="text-3xl font-black tracking-wider text-black font-sans my-1">
                    {order.order_token}
                  </div>
                  <div className="inline-flex items-center gap-1 text-[11px] font-black text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
                    <CheckCircle2 size={12} />
                    <span>Pickup OTP: {order.pickup_otp}</span>
                  </div>
                </div>

                {/* Order Details */}
                <div className="space-y-1.5 pb-3 border-b border-dashed border-zinc-300 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-zinc-500 font-medium">Date/Time:</span>
                    <span className="font-bold">{formattedDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500 font-medium">Break Slot:</span>
                    <span className="font-bold text-black">{order.pickup_slots?.label || 'Regular Break'}</span>
                  </div>
                  {order.student_prn && (
                    <div className="flex justify-between">
                      <span className="text-zinc-500 font-medium">Student PRN:</span>
                      <span className="font-bold font-mono">{order.student_prn}</span>
                    </div>
                  )}
                  {order.utr_number && (
                    <div className="flex justify-between">
                      <span className="text-zinc-500 font-medium">UPI Bank UTR:</span>
                      <span className="font-bold font-mono">{order.utr_number}</span>
                    </div>
                  )}
                </div>

                {/* Itemized Table */}
                <div className="py-3 border-b border-dashed border-zinc-300">
                  <div className="grid grid-cols-12 font-bold text-[11px] text-zinc-500 uppercase mb-2">
                    <span className="col-span-2">Qty</span>
                    <span className="col-span-7">Item</span>
                    <span className="col-span-3 text-right">Amt</span>
                  </div>

                  <div className="space-y-1.5">
                    {(order.order_items || []).map((item, idx) => (
                      <div key={idx} className="grid grid-cols-12 text-[11px]">
                        <span className="col-span-2 font-bold">{item.quantity}×</span>
                        <span className="col-span-7 truncate">{item.item_name}</span>
                        <span className="col-span-3 text-right font-bold">
                          ₹{item.subtotal ? Number(item.subtotal).toFixed(2) : (item.quantity * item.unit_price).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Financial Tally */}
                <div className="pt-3 pb-4 border-b-2 border-dashed border-zinc-400 space-y-1.5 text-[11px]">
                  <div className="flex justify-between text-zinc-600">
                    <span>Item Subtotal:</span>
                    <span>₹{Number(order.total_amount).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>Campus Express Fee:</span>
                    <span>₹0.00 (FREE)</span>
                  </div>
                  <div className="flex justify-between text-base font-black text-black pt-1">
                    <span>TOTAL PAID (UPI):</span>
                    <span>₹{Number(order.total_amount).toFixed(2)}</span>
                  </div>
                </div>

                {/* Optical QR Pass Code */}
                {qrPassUrl && (
                  <div className="py-4 text-center flex flex-col items-center">
                    <img
                      src={qrPassUrl}
                      alt={`QR ${order.order_token}`}
                      className="w-32 h-32 object-contain border border-zinc-300 rounded-xl p-1 mb-2 bg-white"
                    />
                    <p className="text-[10px] text-zinc-500 max-w-[200px] leading-tight">
                      Flash this optical pass at the Cafe @7 express lane scanner for instant collection.
                    </p>
                  </div>
                )}

                {/* Thermal Slip Footer */}
                <div className="text-center pt-3 border-t border-dashed border-zinc-300 text-[10px] text-zinc-500 space-y-0.5">
                  <p className="font-bold text-zinc-800">Powered by FoodLine Campus Ecosystem</p>
                  <p>Zero Queue • 100% Student Free • Hot Pickups</p>
                  <p className="text-[9px] pt-1">Keep this receipt slip for expense tally or offline handover.</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
