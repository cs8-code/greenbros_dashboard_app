import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Email, EmailType } from '../types';
import Modal from './Modal';
import TaskFormModal from './TaskFormModal';
import ComposeEmailModal from './ComposeEmailModal';

// Safe button component that prevents form submission
const SafeButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ onClick, children, ...props }) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('SafeButton clicked');
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <button {...props} type="button" onClick={handleClick}>
      {children}
    </button>
  );
};

const EmailsList: React.FC = () => {
  const { emails, updateEmailStatus, deleteEmail, createTaskFromEmail, revertEmailConversion, addEmail, sendEmail, fetchEmailsFromGmail, analyzeEmailWithAI, clients, employees } = useData();
  const [activeTab, setActiveTab] = useState<EmailType>('received');
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [expandedEmailId, setExpandedEmailId] = useState<string | null>(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showComposeModal, setShowComposeModal] = useState(false);
  const [replyToEmail, setReplyToEmail] = useState<Email | null>(null);
  const [analyzingEmailId, setAnalyzingEmailId] = useState<string | null>(null);
  const [fetchingEmails, setFetchingEmails] = useState(false);

  // Helper to prevent all event propagation
  const preventEventPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (e.nativeEvent) {
      e.nativeEvent.stopImmediatePropagation();
      e.nativeEvent.stopPropagation();
    }
  };

  // Helper to extract contact person name from email signature
  const extractContactPersonFromSignature = (emailContent: string): string => {
    if (!emailContent) return '';

    // Common German and English sign-off phrases
    const signOffPatterns = [
      /(?:mit\s+freundlichen\s+grüßen|freundliche\s+grüße|viele\s+grüße|grüße|best\s+regards|kind\s+regards|regards)\s*[,:]?\s*\n+([^\n]+)/gi,
    ];

    for (const pattern of signOffPatterns) {
      const match = emailContent.match(pattern);
      if (match && match[1]) {
        // Clean up the extracted name (remove extra whitespace, company info on next lines)
        const name = match[1].trim().split('\n')[0].trim();
        // Remove common titles and company-related text
        return name.replace(/^(herr|frau|mr\.|mrs\.|ms\.|dr\.)\s+/i, '').trim();
      }
    }

    return '';
  };

  // Helper to extract email address from "Name <email@example.com>" format
  const extractEmailAddress = (fromField: string): string => {
    if (!fromField) return '';

    // Try to extract email from "Name <email@example.com>" format
    const match = fromField.match(/<([^>]+)>/);
    if (match && match[1]) {
      return match[1];
    }

    // If no angle brackets, assume it's just an email address
    return fromField;
  };

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

  const handleEmailClick = (email: Email) => {
    // Toggle expanded state
    if (expandedEmailId === email.id) {
      setExpandedEmailId(null);
    } else {
      setExpandedEmailId(email.id);
      // Automatically mark as read when expanded
      if (email.status === 'unread') {
        updateEmailStatus(email.id, 'read');
      }
    }
  };

  const handleCreateTask = (e: React.MouseEvent, email: Email) => {
    preventEventPropagation(e);
    setSelectedEmail(email);
    setShowTaskModal(true);
  };

  const handleReplyToEmail = (e: React.MouseEvent, email: Email) => {
    preventEventPropagation(e);
    setReplyToEmail(email);
    setShowComposeModal(true);
  };

  const handleSaveTask = async (taskData: any) => {
    console.log('📝 handleSaveTask called');
    try {
      if (selectedEmail) {
        console.log('🔄 Calling createTaskFromEmail...');
        await createTaskFromEmail(selectedEmail, taskData);
        console.log('✅ createTaskFromEmail completed');
      }
      console.log('🔒 Closing modal...');
      setShowTaskModal(false);
      setSelectedEmail(null);
      console.log('✅ handleSaveTask completed');
    } catch (error) {
      console.error('❌ Error in handleSaveTask:', error);
    }
  };

  const handleCloseTaskModal = () => {
    setShowTaskModal(false);
    setSelectedEmail(null);
  };

  const handleRevertConversion = async (e: React.MouseEvent, emailId: string) => {
    preventEventPropagation(e);
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

  const handleAnalyzeWithAI = async (e: React.MouseEvent, email: Email) => {
    preventEventPropagation(e);
    setAnalyzingEmailId(email.id);
    try {
      const analysis = await analyzeEmailWithAI(email.id);

      // Create a summary message to show what the AI found
      const summaryParts = [
        `📧 Email-Typ: ${analysis.emailType}`,
        analysis.customerName ? `👤 Kunde: ${analysis.customerName}` : null,
        analysis.suggestedContactPerson ? `🧑 Ansprechpartner: ${analysis.suggestedContactPerson}` : null,
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

  const handleFetchEmails = async () => {
    setFetchingEmails(true);
    try {
      const count = await fetchEmailsFromGmail();
      if (count === 0) {
        alert('Keine neuen Emails gefunden');
      } else {
        alert(`${count} neue Email(s) wurden abgerufen!`);
      }
    } catch (error) {
      console.error('Error fetching emails:', error);
      alert('Fehler beim Abrufen der Emails. Bitte überprüfen Sie Ihre Verbindung und Gmail-Konfiguration.');
    } finally {
      setFetchingEmails(false);
    }
  };

  const filteredEmails = emails.filter(e => e.type === activeTab);
  const unreadCount = emails.filter(e => e.status === 'unread' && e.type === 'received').length;
  const receivedCount = emails.filter(e => e.type === 'received').length;
  const sentCount = emails.filter(e => e.type === 'sent').length;

  return (
    <div
      className="space-y-6"
      onClick={(e) => e.stopPropagation()}
      onSubmit={(e) => {
        console.log('⚠️ Form submission blocked!');
        e.preventDefault();
        e.stopPropagation();
        return false;
      }}
    >
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {unreadCount} ungelesene Anfrage{unreadCount !== 1 ? 'n' : ''}
          </p>
        </div>
        <div className="flex gap-2">
          {activeTab === 'received' && (
            <button
              type="button"
              onClick={(e) => {
                preventEventPropagation(e);
                handleFetchEmails();
              }}
              disabled={fetchingEmails}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {fetchingEmails ? (
                <>
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Abrufen...
                </>
              ) : (
                <>
                  ↻ Emails abrufen
                </>
              )}
            </button>
          )}
          {activeTab === 'sent' && (
            <button
              type="button"
              onClick={(e) => {
                preventEventPropagation(e);
                setShowComposeModal(true);
              }}
              className="px-4 py-2 bg-brand-green text-white rounded-lg hover:bg-brand-green-dark transition-colors"
            >
              + Neue Email senden
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        <button
          type="button"
          onClick={(e) => {
            preventEventPropagation(e);
            setActiveTab('received');
          }}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'received'
              ? 'border-b-2 border-brand-green text-brand-green'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          Empfangen ({receivedCount})
        </button>
        <button
          type="button"
          onClick={(e) => {
            preventEventPropagation(e);
            setActiveTab('sent');
          }}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'sent'
              ? 'border-b-2 border-brand-green text-brand-green'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          Gesendet ({sentCount})
        </button>
      </div>

      {/* Email List */}
      <div className="space-y-4">
        {filteredEmails.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              {activeTab === 'received' ? 'Keine empfangenen Emails' : 'Keine gesendeten Emails'}
            </p>
          </div>
        ) : (
          filteredEmails.map((email) => {
            const isExpanded = expandedEmailId === email.id;

            return (
              <div
                key={email.id}
                className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border-l-4 transition-all ${
                  email.status === 'unread' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/10' :
                  email.status === 'converted' ? 'border-green-500' :
                  'border-gray-300'
                }`}
              >
                {/* Collapsed View - Email Header (Always Visible) */}
                <div
                  onClick={() => handleEmailClick(email)}
                  className={`p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                    email.status === 'unread' ? 'font-semibold' : ''
                  }`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        {/* Envelope icon for unread */}
                        {email.status === 'unread' && (
                          <svg className="h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                          </svg>
                        )}

                        <h3 className="text-base text-gray-900 dark:text-gray-100 truncate flex-1">
                          {email.subject}
                        </h3>

                        <span className={`px-2 py-1 text-xs font-medium rounded-full flex-shrink-0 ${getStatusBadgeClass(email.status)}`}>
                          {email.status === 'unread' ? 'Neu' :
                           email.status === 'read' ? 'Gelesen' :
                           'In Aufgabe umgewandelt'}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <span className="truncate">
                          {email.type === 'received' ? `Von: ${email.from}` : `An: ${email.to}`}
                        </span>
                        <span className="text-xs flex-shrink-0">
                          {email.receivedDate}
                        </span>
                      </div>
                    </div>

                    {/* Expand/Collapse Icon */}
                    <svg
                      className={`h-5 w-5 text-gray-400 flex-shrink-0 transition-transform ${
                        isExpanded ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {/* Expanded View - Full Email Content */}
                {isExpanded && (
                  <div className="px-4 pb-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="pt-4 space-y-4">
                      {/* Keywords */}
                      {email.keywords.length > 0 && (
                        <div className="flex gap-2 flex-wrap">
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

                      {/* Email Content */}
                      <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
                        <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                          {email.content}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 flex-wrap">
                        {email.status !== 'converted' && email.type === 'received' && (
                          <>
                            <button
                              type="button"
                              onClick={(e) => handleAnalyzeWithAI(e, email)}
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
                                  Automatisieren
                                </>
                              )}
                            </button>
                            <SafeButton
                              onClick={(e) => handleReplyToEmail(e, email)}
                              className="px-3 py-1.5 text-sm bg-brand-green text-white rounded hover:bg-brand-green-dark transition-colors"
                            >
                              Antworten
                            </SafeButton>
                          </>
                        )}
                        {email.status === 'converted' && (
                          <button
                            type="button"
                            onClick={(e) => handleRevertConversion(e, email.id)}
                            className="px-3 py-1.5 text-sm bg-orange-600 text-white rounded hover:bg-orange-700 transition-colors"
                          >
                            Widerrufen
                          </button>
                        )}
                        <SafeButton
                          onClick={(e) => {
                            preventEventPropagation(e);
                            deleteEmail(email.id);
                          }}
                          className="px-3 py-1.5 text-sm bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
                        >
                          Löschen
                        </SafeButton>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>


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
            contactPerson: (selectedEmail as any).aiAnalysis?.suggestedContactPerson || extractContactPersonFromSignature(selectedEmail.content),
            assignedTo: [],
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            status: 'open'
          }}
        />
      )}

      {/* Compose Email Modal */}
      <ComposeEmailModal
        isOpen={showComposeModal}
        onClose={() => {
          setShowComposeModal(false);
          setReplyToEmail(null);
        }}
        replyTo={replyToEmail ? extractEmailAddress(replyToEmail.from) : undefined}
        replySubject={replyToEmail?.subject}
      />
    </div>
  );
};

export default EmailsList;
