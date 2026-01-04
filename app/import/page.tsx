"use client"

import { useState, useRef, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { AppShell } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { useAppStore } from "@/lib/store"

interface FormData {
  itemNumber: string
  description: string
  unitPrice: string
  quantity: string
  purchaseDate: string
  warehouse: string
}

const initialForm: FormData = {
  itemNumber: "",
  description: "",
  unitPrice: "",
  quantity: "1",
  purchaseDate: new Date().toISOString().split("T")[0],
  warehouse: "",
}

function ImportPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const showManual = searchParams.get("manual") === "true"

  const [mode, setMode] = useState<"choose" | "manual" | "upload">(
    showManual ? "manual" : "choose"
  )
  const [form, setForm] = useState<FormData>(initialForm)
  const [receiptImage, setReceiptImage] = useState<string | null>(null)
  const [errors, setErrors] = useState<Partial<FormData>>({})
  const fileInputRef = useRef<HTMLInputElement>(null)

  const addItem = useAppStore((s) => s.addItem)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Compress and convert to base64
    const reader = new FileReader()
    reader.onload = (ev) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement("canvas")
        const maxSize = 800
        let { width, height } = img
        if (width > height && width > maxSize) {
          height = (height * maxSize) / width
          width = maxSize
        } else if (height > maxSize) {
          width = (width * maxSize) / height
          height = maxSize
        }
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext("2d")
        ctx?.drawImage(img, 0, 0, width, height)
        const compressed = canvas.toDataURL("image/jpeg", 0.7)
        setReceiptImage(compressed)
        setMode("manual") // After uploading, go to manual entry
      }
      img.src = ev.target?.result as string
    }
    reader.readAsDataURL(file)
  }

  const validate = (): boolean => {
    const newErrors: Partial<FormData> = {}

    if (!form.itemNumber.trim()) {
      newErrors.itemNumber = "Item number required"
    }
    if (!form.description.trim()) {
      newErrors.description = "Description required"
    }
    const price = parseFloat(form.unitPrice)
    if (isNaN(price) || price <= 0) {
      newErrors.unitPrice = "Valid price required"
    }
    const qty = parseInt(form.quantity)
    if (isNaN(qty) || qty < 1) {
      newErrors.quantity = "Valid quantity required"
    }
    if (!form.purchaseDate) {
      newErrors.purchaseDate = "Purchase date required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (!validate()) return

    addItem({
      itemNumber: form.itemNumber.trim(),
      description: form.description.trim(),
      unitPrice: parseFloat(form.unitPrice),
      quantity: parseInt(form.quantity),
      purchaseDate: form.purchaseDate,
      warehouse: form.warehouse.trim() || undefined,
      receiptImage: receiptImage || undefined,
      status: "tracking",
    })

    router.push("/")
  }

  const handleAddAnother = () => {
    if (!validate()) return

    addItem({
      itemNumber: form.itemNumber.trim(),
      description: form.description.trim(),
      unitPrice: parseFloat(form.unitPrice),
      quantity: parseInt(form.quantity),
      purchaseDate: form.purchaseDate,
      warehouse: form.warehouse.trim() || undefined,
      receiptImage: receiptImage || undefined,
      status: "tracking",
    })

    // Reset form but keep date and warehouse
    setForm({
      ...initialForm,
      purchaseDate: form.purchaseDate,
      warehouse: form.warehouse,
    })
    setErrors({})
  }

  if (mode === "choose") {
    return (
      <AppShell title="Import">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground mb-6">
            Add items from your warehouse receipt to start tracking price adjustments.
          </p>

          {/* Upload option */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full bg-card rounded-[16px] p-4 border border-border text-left transition-all active:scale-[0.98]"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-[12px] bg-primary/10 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" x2="12" y1="3" y2="15" />
                </svg>
              </div>
              <div>
                <p className="font-medium">Upload receipt image</p>
                <p className="text-sm text-muted-foreground">
                  Take a photo or select from gallery
                </p>
              </div>
            </div>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileChange}
            className="hidden"
          />

          {/* Manual option */}
          <button
            onClick={() => setMode("manual")}
            className="w-full bg-card rounded-[16px] p-4 border border-border text-left transition-all active:scale-[0.98]"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-[12px] bg-secondary flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-foreground"
                >
                  <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                  <path d="m15 5 4 4" />
                </svg>
              </div>
              <div>
                <p className="font-medium">Add manually</p>
                <p className="text-sm text-muted-foreground">
                  Enter item details from your receipt
                </p>
              </div>
            </div>
          </button>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell title="Add Item">
      <div className="space-y-4">
        {/* Receipt preview */}
        {receiptImage && (
          <div className="relative">
            <img
              src={receiptImage}
              alt="Receipt"
              className="w-full h-32 object-cover rounded-[12px]"
            />
            <button
              onClick={() => setReceiptImage(null)}
              className="absolute top-2 right-2 w-8 h-8 bg-background/80 rounded-full flex items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Form */}
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Item number *</label>
            <input
              type="text"
              value={form.itemNumber}
              onChange={(e) => setForm({ ...form, itemNumber: e.target.value })}
              placeholder="e.g. 1234567"
              className="mt-1 w-full h-12 px-4 rounded-[12px] border border-border bg-background text-foreground tabular-nums"
            />
            {errors.itemNumber && (
              <p className="text-xs text-danger mt-1">{errors.itemNumber}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium">Description *</label>
            <input
              type="text"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="e.g. Kirkland Olive Oil 2L"
              className="mt-1 w-full h-12 px-4 rounded-[12px] border border-border bg-background text-foreground"
            />
            {errors.description && (
              <p className="text-xs text-danger mt-1">{errors.description}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium">Unit price *</label>
              <div className="relative mt-1">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                  $
                </span>
                <input
                  type="number"
                  step="0.01"
                  value={form.unitPrice}
                  onChange={(e) => setForm({ ...form, unitPrice: e.target.value })}
                  placeholder="0.00"
                  className="w-full h-12 pl-8 pr-4 rounded-[12px] border border-border bg-background text-foreground tabular-nums"
                />
              </div>
              {errors.unitPrice && (
                <p className="text-xs text-danger mt-1">{errors.unitPrice}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium">Quantity *</label>
              <input
                type="number"
                min="1"
                value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                className="mt-1 w-full h-12 px-4 rounded-[12px] border border-border bg-background text-foreground tabular-nums"
              />
              {errors.quantity && (
                <p className="text-xs text-danger mt-1">{errors.quantity}</p>
              )}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Purchase date *</label>
            <input
              type="date"
              value={form.purchaseDate}
              onChange={(e) => setForm({ ...form, purchaseDate: e.target.value })}
              className="mt-1 w-full h-12 px-4 rounded-[12px] border border-border bg-background text-foreground"
            />
            {errors.purchaseDate && (
              <p className="text-xs text-danger mt-1">{errors.purchaseDate}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium">Warehouse (optional)</label>
            <input
              type="text"
              value={form.warehouse}
              onChange={(e) => setForm({ ...form, warehouse: e.target.value })}
              placeholder="e.g. San Francisco #123"
              className="mt-1 w-full h-12 px-4 rounded-[12px] border border-border bg-background text-foreground"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3 pt-4">
          <Button variant="primary" onClick={handleSubmit}>
            Save & Done
          </Button>
          <Button variant="secondary" onClick={handleAddAnother}>
            Save & Add Another
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              if (receiptImage) {
                setMode("choose")
                setReceiptImage(null)
              } else {
                router.back()
              }
            }}
          >
            Cancel
          </Button>
        </div>
      </div>
    </AppShell>
  )
}

export default function ImportPage() {
  return (
    <Suspense
      fallback={
        <AppShell title="Import">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </AppShell>
      }
    >
      <ImportPageContent />
    </Suspense>
  )
}
