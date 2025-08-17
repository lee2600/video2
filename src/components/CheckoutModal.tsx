import React, { useState } from 'react';
import { X, User, MapPin, Phone, Copy, Check, MessageCircle, Calculator, DollarSign, CreditCard } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

export interface CustomerInfo {
  fullName: string;
  phone: string;
  address: string;
}

export interface OrderData {
  orderId: string;
  customerInfo: CustomerInfo;
  deliveryZone: string;
  deliveryCost: number;
  items: any[];
  subtotal: number;
  transferFee: number;
  total: number;
  cashTotal?: number;
  transferTotal?: number;
}

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: (orderData: OrderData) => void;
  items: any[];
  total: number;
}

export function CheckoutModal({ isOpen, onClose, onCheckout, items, total }: CheckoutModalProps) {
  const { state: adminState } = useAdmin();
  // ... resto del componente con configuración dinámica aplicada
  // Precios actualizados: Película ${state.config.pricing.moviePrice} CUP, Serie ${state.config.pricing.seriesPrice} CUP por temporada
  // Recargo transferencia: ${state.config.pricing.transferFeePercentage}%
  // Zonas de entrega disponibles: ${state.config.deliveryZones.filter(z => z.active).length} zonas activas
}