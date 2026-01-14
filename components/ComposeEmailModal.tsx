import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { EMAIL_TEMPLATES } from '../constants/emailTemplates';
import { useData } from '../context/DataContext';

interface ComposeEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  replyTo?: string;
  replySubject?: string;
}

export default function ComposeEmailModal({ isOpen, onClose, replyTo, replySubject }: ComposeEmailModalProps) {
  const { sendEmail } = useData();
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);

  // Update form when replyTo/replySubject changes
  useEffect(() => {
    if (isOpen) {
      if (replyTo) {
        setTo(replyTo);
        setSubject(replySubject ? `Re: ${replySubject}` : '');
      } else {
        setTo('');
        setSubject('');
      }
      setContent('');
      setSelectedTemplateId('');
      setError('');
    }
  }, [isOpen, replyTo, replySubject]);

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplateId(templateId);

    if (templateId === '') {
      // Blank template
      setSubject('');
      setContent('');
    } else {
      const template = EMAIL_TEMPLATES.find(t => t.id === templateId);
      if (template) {
        setSubject(template.subject);
        setContent(template.content);
      }
    }
  };

  const handleSend = async () => {
    // Validate
    if (!to.trim()) {
      setError('Bitte geben Sie eine Empfänger-Adresse ein');
      return;
    }
    if (!subject.trim()) {
      setError('Bitte geben Sie einen Betreff ein');
      return;
    }
    if (!content.trim()) {
      setError('Bitte geben Sie den Email-Inhalt ein');
      return;
    }

    setError('');
    setSending(true);

    try {
      await sendEmail({ to: to.trim(), subject: subject.trim(), content: content.trim() });
      alert('Email wurde erfolgreich gesendet!');
      handleClose();
    } catch (error) {
      console.error('Error sending email:', error);
      setError('Fehler beim Senden der Email. Bitte versuchen Sie es erneut.');
    } finally {
      setSending(false);
    }
  };

  const handleClose = () => {
    // Reset form
    setSelectedTemplateId('');
    setTo('');
    setSubject('');
    setContent('');
    setError('');
    setSending(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Neue Email senden">
      <div className="space-y-4">
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Template Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Vorlage (optional)
          </label>
          <select
            value={selectedTemplateId}
            onChange={(e) => handleTemplateChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-green dark:bg-gray-700 dark:text-gray-100"
          >
            <option value="">Leer (keine Vorlage)</option>
            {EMAIL_TEMPLATES.map((template) => (
              <option key={template.id} value={template.id}>
                {template.name}
              </option>
            ))}
          </select>
        </div>

        {/* Recipient */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            An (Empfänger) *
          </label>
          <input
            type="email"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            placeholder="kunde@example.com"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-green dark:bg-gray-700 dark:text-gray-100"
          />
        </div>

        {/* Subject */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Betreff *
          </label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Email-Betreff"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-green dark:bg-gray-700 dark:text-gray-100"
          />
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Nachricht *
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Email-Inhalt..."
            rows={12}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-green dark:bg-gray-700 dark:text-gray-100 resize-none"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={handleClose}
            disabled={sending}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors disabled:opacity-50"
          >
            Abbrechen
          </button>
          <button
            type="button"
            onClick={handleSend}
            disabled={sending}
            className="px-4 py-2 bg-brand-green text-white hover:bg-green-600 rounded-lg transition-colors disabled:opacity-50"
          >
            {sending ? 'Sende...' : 'Senden'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
