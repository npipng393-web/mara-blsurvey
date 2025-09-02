'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { ErrorAlert } from '@/components/ui/ErrorAlert';

interface FormField {
  key: string;
  label: string;
  type: 'text' | 'number' | 'email' | 'password' | 'textarea' | 'select' | 'checkbox' | 'date';
  required?: boolean;
  options?: string[] | { value: string; label: string }[];
  placeholder?: string;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
}

interface AddEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => Promise<void> | void;
  title: string;
  fields: FormField[];
  initialData?: any;
  loading?: boolean;
}

export function AddEditModal({
  isOpen,
  onClose,
  onSave,
  title,
  fields,
  initialData = {},
  loading = false
}: AddEditModalProps) {
  const [formData, setFormData] = useState<any>({});
  const [errors, setErrors] = useState<any>({});
  const [submitting, setSubmitting] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setFormData(initialData);
      setErrors({});
      setSaveError(null);
    }
  }, [isOpen, initialData]);

  const validateField = (field: FormField, value: any) => {
    if (field.required && (!value || value === '')) {
      return `${field.label} is required`;
    }

    if (field.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return 'Please enter a valid email address';
      }
    }

    if (field.validation) {
      if (field.validation.min !== undefined && value < field.validation.min) {
        return `${field.label} must be at least ${field.validation.min}`;
      }
      if (field.validation.max !== undefined && value > field.validation.max) {
        return `${field.label} must be at most ${field.validation.max}`;
      }
      if (field.validation.pattern && value) {
        const regex = new RegExp(field.validation.pattern);
        if (!regex.test(value)) {
          return `${field.label} format is invalid`;
        }
      }
    }

    return null;
  };

  const validateForm = () => {
    const newErrors: any = {};
    let isValid = true;

    fields.forEach(field => {
      const error = validateField(field, formData[field.key]);
      if (error) {
        newErrors[field.key] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    setSaveError(null);
    try {
      await onSave(formData);
      // Don't close here - let the parent component handle it
    } catch (error) {
      console.error('Error saving:', error);
      setSaveError(error instanceof Error ? error.message : 'Failed to save. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFieldChange = (key: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [key]: value }));

    // Clear error for this field when user starts typing
    if (errors[key]) {
      setErrors((prev: any) => ({ ...prev, [key]: null }));
    }
  };

  const renderField = (field: FormField) => {
    const value = formData[field.key] || '';
    const error = errors[field.key];
    const commonProps = {
      id: field.key,
      className: error ? 'border-red-500' : '',
    };

    switch (field.type) {
      case 'textarea':
        return (
          <Textarea
            {...commonProps}
            value={value}
            onChange={(e) => handleFieldChange(field.key, e.target.value)}
            placeholder={field.placeholder}
            rows={4}
          />
        );

      case 'select':
        return (
          <Select
            value={value}
            onValueChange={(val) => handleFieldChange(field.key, val)}
          >
            <SelectTrigger className={error ? 'border-red-500' : ''}>
              <SelectValue placeholder={field.placeholder || `Select ${field.label}`} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => {
                const optionValue = typeof option === 'string' ? option : option.value;
                const optionLabel = typeof option === 'string' ? option.charAt(0).toUpperCase() + option.slice(1) : option.label;
                return (
                  <SelectItem key={optionValue} value={optionValue}>
                    {optionLabel}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        );

      case 'checkbox':
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              id={field.key}
              checked={value || false}
              onCheckedChange={(checked) => handleFieldChange(field.key, checked)}
            />
            <Label htmlFor={field.key} className="text-sm font-normal">
              {field.label}
            </Label>
          </div>
        );

      case 'number':
        return (
          <Input
            {...commonProps}
            type="number"
            value={value}
            onChange={(e) => handleFieldChange(field.key, parseFloat(e.target.value) || '')}
            placeholder={field.placeholder}
            min={field.validation?.min}
            max={field.validation?.max}
          />
        );

      case 'date':
        return (
          <Input
            {...commonProps}
            type="date"
            value={value}
            onChange={(e) => handleFieldChange(field.key, e.target.value)}
          />
        );

      default:
        return (
          <Input
            {...commonProps}
            type={field.type}
            value={value}
            onChange={(e) => handleFieldChange(field.key, e.target.value)}
            placeholder={field.placeholder}
          />
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <ErrorAlert error={saveError} onDismiss={() => setSaveError(null)} />

        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map((field) => (
            <div key={field.key} className="space-y-2">
              {field.type !== 'checkbox' && (
                <Label htmlFor={field.key} className="text-sm font-medium">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </Label>
              )}
              {renderField(field)}
              {errors[field.key] && (
                <p className="text-sm text-red-500">{errors[field.key]}</p>
              )}
            </div>
          ))}

          <DialogFooter className="flex space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting || loading}
            >
              {submitting ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
