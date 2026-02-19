import { useState } from 'react';
import type { FormData } from '@/types';
import { Button, Input, Card } from '@/components/common';
import { cn, getCsrfToken } from '@/utils';

export default function BeneficiarioFormApp(props: FormData) {
  const { fields, initial_data = {}, action_url, csrf_token } = props;
  const [formData, setFormData] = useState<Record<string, unknown>>(initial_data);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const validateField = (field: typeof fields[0], value: unknown): string | null => {
    if (field.required && (!value || value === '')) {
      return `${field.label} es requerido`;
    }
    if (field.validation?.pattern && typeof value === 'string') {
      const regex = new RegExp(field.validation.pattern);
      if (!regex.test(value)) {
        return field.validation.message || `${field.label} no es válido`;
      }
    }
    if (field.validation?.min !== undefined && typeof value === 'number' && value < field.validation.min) {
      return `${field.label} debe ser mayor o igual a ${field.validation.min}`;
    }
    if (field.validation?.max !== undefined && typeof value === 'number' && value > field.validation.max) {
      return `${field.label} debe ser menor o igual a ${field.validation.max}`;
    }
    return null;
  };

  const handleChange = (name: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleBlur = (field: typeof fields[0]) => {
    const error = validateField(field, formData[field.name]);
    if (error) {
      setErrors(prev => ({ ...prev, [field.name]: error }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    fields.forEach(field => {
      const error = validateField(field, formData[field.name]);
      if (error) {
        newErrors[field.name] = error;
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

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch(action_url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrf_token || getCsrfToken(),
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus('success');
        // Optionally reset form
        // setFormData({});
      } else {
        const data = await response.json();
        if (data.errors) {
          setErrors(data.errors);
        }
        setSubmitStatus('error');
      }
    } catch {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderField = (field: typeof fields[0]) => {
    const value = formData[field.name] as string | number | undefined;
    const error = errors[field.name];

    switch (field.type) {
      case 'select':
        return (
          <div key={field.name} className="space-y-1.5">
            <label className="block text-sm font-semibold text-[var(--charcoal)]">
              {field.label}
              {field.required && <span className="text-[var(--clay)] ml-1">*</span>}
            </label>
            <select
              value={value || ''}
              onChange={(e) => handleChange(field.name, e.target.value)}
              onBlur={() => handleBlur(field)}
              className={cn(
                'w-full px-4 py-2.5 rounded-xl border-2 transition-all duration-200',
                'bg-white text-[var(--charcoal)]',
                'focus:outline-none focus:ring-2 focus:ring-[var(--leaf)] focus:ring-offset-1',
                error
                  ? 'border-[var(--clay)] focus:border-[var(--clay)]'
                  : 'border-[var(--wheat)] hover:border-[var(--earth)]/30 focus:border-[var(--leaf)]'
              )}
            >
              <option value="">Seleccionar...</option>
              {field.options?.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            {error && <p className="text-sm text-[var(--clay)] font-medium">{error}</p>}
          </div>
        );

      case 'textarea':
        return (
          <div key={field.name} className="space-y-1.5">
            <label className="block text-sm font-semibold text-[var(--charcoal)]">
              {field.label}
              {field.required && <span className="text-[var(--clay)] ml-1">*</span>}
            </label>
            <textarea
              value={value || ''}
              onChange={(e) => handleChange(field.name, e.target.value)}
              onBlur={() => handleBlur(field)}
              placeholder={field.placeholder}
              rows={4}
              className={cn(
                'w-full px-4 py-2.5 rounded-xl border-2 transition-all duration-200 resize-y',
                'bg-white text-[var(--charcoal)] placeholder:text-[var(--earth)]/50',
                'focus:outline-none focus:ring-2 focus:ring-[var(--leaf)] focus:ring-offset-1',
                error
                  ? 'border-[var(--clay)] focus:border-[var(--clay)]'
                  : 'border-[var(--wheat)] hover:border-[var(--earth)]/30 focus:border-[var(--leaf)]'
              )}
            />
            {error && <p className="text-sm text-[var(--clay)] font-medium">{error}</p>}
          </div>
        );

      case 'date':
        return (
          <Input
            key={field.name}
            type="date"
            label={field.label}
            value={value || ''}
            onChange={(e) => handleChange(field.name, e.target.value)}
            onBlur={() => handleBlur(field)}
            error={error}
            required={field.required}
          />
        );

      case 'number':
        return (
          <Input
            key={field.name}
            type="number"
            label={field.label}
            value={value || ''}
            onChange={(e) => handleChange(field.name, e.target.valueAsNumber)}
            onBlur={() => handleBlur(field)}
            placeholder={field.placeholder}
            error={error}
            required={field.required}
          />
        );

      default:
        return (
          <Input
            key={field.name}
            type={field.type}
            label={field.label}
            value={value || ''}
            onChange={(e) => handleChange(field.name, e.target.value)}
            onBlur={() => handleBlur(field)}
            placeholder={field.placeholder}
            error={error}
            required={field.required}
          />
        );
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-[var(--charcoal)]">
            {initial_data.id ? 'Editar Beneficiario' : 'Nuevo Beneficiario'}
          </h1>
          <p className="text-[var(--earth)] mt-1">
            {initial_data.id 
              ? 'Actualiza la información del beneficiario' 
              : 'Completa el formulario para registrar un nuevo beneficiario'}
          </p>
        </div>
      </div>

      {/* Status Messages */}
      {submitStatus === 'success' && (
        <div className="bg-[var(--leaf-light)] border-2 border-[var(--leaf)] text-[var(--leaf)] px-6 py-4 rounded-xl font-semibold flex items-center gap-3">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
          Beneficiario guardado exitosamente
        </div>
      )}

      {submitStatus === 'error' && (
        <div className="bg-[var(--clay-light)] border-2 border-[var(--clay)] text-[var(--clay)] px-6 py-4 rounded-xl font-semibold flex items-center gap-3">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="15" y1="9" x2="9" y2="15"/>
            <line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
          Error al guardar el beneficiario. Por favor, intenta nuevamente.
        </div>
      )}

      {/* Form */}
      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            {fields.map((field) => (
              <div key={field.name} className={field.type === 'textarea' ? 'col-span-2' : ''}>
                {renderField(field)}
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-4 pt-6 border-t-2 border-[var(--wheat)]">
            <Button type="button" variant="outline" onClick={() => window.history.back()}>
              Cancelar
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              {initial_data.id ? 'Actualizar Beneficiario' : 'Guardar Beneficiario'}
            </Button>
          </div>
        </form>
      </Card>

      {/* Debug Info */}
      <div className="text-xs text-[var(--earth)] p-4 bg-[var(--cream)] rounded-xl">
        <p className="font-semibold mb-2">Datos del formulario (debug):</p>
        <pre className="overflow-auto">{JSON.stringify(formData, null, 2)}</pre>
      </div>
    </div>
  );
}
