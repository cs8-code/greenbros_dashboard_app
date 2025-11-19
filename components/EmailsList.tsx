import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Email } from '../types';
import Modal from './Modal';
import TaskFormModal from './TaskFormModal';

const EmailsList: React.FC = () => {
  const { emails, updateEmailStatus, deleteEmail, createTaskFromEmail, revertEmailConversion, addEmail, analyzeEmailWithAI, clients, employees } = useData();
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showAddEmailModal, setShowAddEmailModal] = useState(false);
  const [newEmail, setNewEmail] = useState({ from: '', subject: '', content: '', keywords: '' });
  const [analyzingEmailId, setAnalyzingEmailId] = useState<string | null>(null);

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'unread':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'read':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      case 'converted':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleMarkAsRead = (emailId: string) => {
    updateEmailStatus(emailId, 'read');
  };

  const handleCreateTask = (email: Email) => {
    setSelectedEmail(email);
    setShowTaskModal(true);
  };

  const handleSaveTask = async (taskData: any) => {
    if (selectedEmail) {
      await createTaskFromEmail(selectedEmail, taskData);
    }
    setShowTaskModal(false);
    setSelectedEmail(null);
  };

  const handleCloseTaskModal = () => {
    setShowTaskModal(false);
    setSelectedEmail(null);
  };

  const handleRevertConversion = async (emailId: string) => {
    if (confirm('Möchten Sie die Aufgabe wirklich löschen und die Email-Konvertierung rückgängig machen?')) {
      try {
        await revertEmailConversion(emailId);
        alert('✅ Email-Konvertierung wurde rückgängig gemacht.');
      } catch (error) {
        console.error('Error reverting conversion:', error);
        alert('❌ Fehler beim Rückgängigmachen.');
      }
    }
  };

  const handleAnalyzeWithAI = async (email: Email) => {
    setAnalyzingEmailId(email.id);
    try {
      const analysis = await analyzeEmailWithAI(email.id);

      // Create a summary message to show what the AI found
      const summaryParts = [
        `📧 Email-Typ: ${analysis.emailType}`,
        analysis.customerName ? `👤 Kunde: ${analysis.customerName}` : null,
        analysis.customerPhone ? `📱 Telefon: ${analysis.customerPhone}` : null,
        `🔧 Service: ${analysis.serviceRequested}`,
        `⚠️ Dringlichkeit: ${analysis.urgency}`,
        analysis.location ? `📍 Standort: ${analysis.location}` : null,
        analysis.estimatedDuration ? `⏱️ Dauer: ${analysis.estimatedDuration}` : null,
      ].filter(Boolean);

      const summary = `🤖 AI Analyse:\n\n${summaryParts.join('\n')}\n\n${analysis.matchingClient ? `✅ Passender Kunde gefunden: ${clients.find(c => c.id === analysis.matchingClient)?.name}` : '❌ Kein passender Kunde gefunden'}`;

      alert(summary);

      // Open task modal with AI-suggested data pre-filled
      setSelectedEmail({
        ...email,
        // Store AI analysis in a custom property for reference
        aiAnalysis: analysis
      } as any);
      setShowTaskModal(true);
    } catch (error) {
      console.error('Error analyzing email:', error);
      alert('❌ Fehler bei der AI-Analyse. Bitte versuchen Sie es erneut.');
    } finally {
      setAnalyzingEmailId(null);
    }
  };

  const handleAddEmail = async () => {
    // Validation
    if (!newEmail.from.trim()) {
      alert('Bitte geben Sie eine Email-Adresse ein');
      return;
    }
    if (!newEmail.subject.trim()) {
      alert('Bitte geben Sie einen Betreff ein');
      return;
    }
    if (!newEmail.content.trim()) {
      alert('Bitte geben Sie den Email-Inhalt ein');
      return;
    }

    try {
      await addEmail({
        from: newEmail.from,
        subject: newEmail.subject,
        content: newEmail.content,
        keywords: newEmail.keywords.split(',').map(k => k.trim()).filter(k => k),
        attachments: []
      });
      setShowAddEmailModal(false);
      setNewEmail({ from: '', subject: '', content: '', keywords: '' });
    } catch (error) {
      console.error('Error adding email:', error);
      alert('Fehler beim Importieren der Email');
    }
  };

  const unreadCount = emails.filter(e => e.status === 'unread').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Email-Anfragen
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {unreadCount} ungelesene Anfrage{unreadCount !== 1 ? 'n' : ''}
          </p>
        </div>
        <button
          onClick={() => setShowAddEmailModal(true)}
          className="px-4 py-2 bg-brand-green text-white rounded-lg hover:bg-brand-green-dark transition-colors"
        >
          + Email importieren
        </button>
      </div>

      {/* Email List */}
      <div className="space-y-4">
        {emails.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Keine Emails vorhanden
            </p>
          </div>
        ) : (
          emails.map((email) => (
            <div
              key={email.id}
              className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border-l-4 ${
                email.status === 'unread' ? 'border-blue-500' :
                email.status === 'converted' ? 'border-green-500' :
                'border-gray-300'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {email.subject}
                    </h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeClass(email.status)}`}>
                      {email.status === 'unread' ? 'Neu' :
                       email.status === 'read' ? 'Gelesen' :
                       'In Aufgabe umgewandelt'}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                    <span className="flex items-center gap-1">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      {email.from}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {email.receivedDate}
                    </span>
                  </div>

                  {email.keywords.length > 0 && (
                    <div className="flex gap-2 mb-3">
                      {email.keywords.map((keyword, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 rounded-full"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  )}

                  <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {email.content}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-4 flex gap-2 flex-wrap">
                {email.status === 'unread' && (
                  <button
                    onClick={() => handleMarkAsRead(email.id)}
                    className="px-3 py-1.5 text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  >
                    Als gelesen markieren
                  </button>
                )}
                {email.status !== 'converted' && (
                  <>
                    <button
                      onClick={() => handleAnalyzeWithAI(email)}
                      disabled={analyzingEmailId === email.id}
                      className="px-3 py-1.5 text-sm bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {analyzingEmailId === email.id ? (
                        <>
                          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Analysiert...
                        </>
                      ) : (
                        <>
                          🤖 AI Analysieren
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => handleCreateTask(email)}
                      className="px-3 py-1.5 text-sm bg-brand-green text-white rounded hover:bg-brand-green-dark transition-colors"
                    >
                      Aufgabe erstellen
                    </button>
                  </>
                )}
                {email.status === 'converted' && (
                  <button
                    onClick={() => handleRevertConversion(email.id)}
                    className="px-3 py-1.5 text-sm bg-orange-600 text-white rounded hover:bg-orange-700 transition-colors"
                  >
                    Widerrufen
                  </button>
                )}
                <button
                  onClick={() => deleteEmail(email.id)}
                  className="px-3 py-1.5 text-sm bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
                >
                  Löschen
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Email Modal */}
      {showAddEmailModal && (
        <Modal isOpen={showAddEmailModal} onClose={() => setShowAddEmailModal(false)} title="Email importieren">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Von (Email-Adresse)
              </label>
              <input
                type="email"
                value={newEmail.from}
                onChange={(e) => setNewEmail({ ...newEmail, from: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-green dark:bg-gray-700 dark:text-gray-100"
                placeholder="kunde@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Betreff
              </label>
              <input
                type="text"
                value={newEmail.subject}
                onChange={(e) => setNewEmail({ ...newEmail, subject: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-green dark:bg-gray-700 dark:text-gray-100"
                placeholder="Preisanfrage für Gartenpflege"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Inhalt
              </label>
              <textarea
                value={newEmail.content}
                onChange={(e) => setNewEmail({ ...newEmail, content: e.target.value })}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-green dark:bg-gray-700 dark:text-gray-100"
                placeholder="Email-Text..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Keywords (Komma-getrennt)
              </label>
              <input
                type="text"
                value={newEmail.keywords}
                onChange={(e) => setNewEmail({ ...newEmail, keywords: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-green dark:bg-gray-700 dark:text-gray-100"
                placeholder="Preisanfrage, Angebot, Gartenpflege"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowAddEmailModal(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                Abbrechen
              </button>
              <button
                onClick={handleAddEmail}
                className="px-4 py-2 bg-brand-green text-white rounded-lg hover:bg-brand-green-dark transition-colors"
              >
                Email importieren
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Create Task Modal */}
      {showTaskModal && selectedEmail && (
        <TaskFormModal
          isOpen={showTaskModal}
          onClose={handleCloseTaskModal}
          onSave={handleSaveTask}
          task={{
            id: '',
            title: (selectedEmail as any).aiAnalysis?.suggestedTaskTitle || selectedEmail.subject,
            description: (selectedEmail as any).aiAnalysis?.suggestedTaskDescription || selectedEmail.content,
            clientId: (selectedEmail as any).aiAnalysis?.matchingClient || '',
            assignedTo: [],
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            status: 'open'
          }}
        />
      )}
    </div>
  );
};

export default EmailsList;
