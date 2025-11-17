import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Document, DocumentType } from '../types';
import DocumentUploadModal from './DocumentUploadModal';

const Documents: React.FC = () => {
  const { documents, uploadDocument, deleteDocument, downloadDocument } = useData();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<DocumentType | 'Alle'>('Alle');

  const handleUpload = async (file: File, type: DocumentType) => {
    await uploadDocument(file, type);
  };

  const handleDelete = (documentId: string, documentName: string) => {
    if (window.confirm(`Möchten Sie "${documentName}" wirklich löschen?`)) {
      deleteDocument(documentId);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE');
  };

  const getTypeColor = (type: DocumentType) => {
    switch (type) {
      case 'Rechnung':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300';
      case 'Vertrag':
        return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
      case 'Sonstiges':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const filteredDocuments = selectedType === 'Alle'
    ? documents
    : documents.filter(doc => doc.type === selectedType);

  const documentsByType = {
    Rechnung: documents.filter(d => d.type === 'Rechnung').length,
    Vertrag: documents.filter(d => d.type === 'Vertrag').length,
    Sonstiges: documents.filter(d => d.type === 'Sonstiges').length,
  };

  return (
    <>
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Dokumente</h2>
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="bg-brand-green hover:bg-brand-green-dark text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors duration-200 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Dokument hochladen
            </button>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">Gesamt</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{documents.length}</p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <p className="text-sm text-blue-600 dark:text-blue-400">Rechnungen</p>
              <p className="text-2xl font-bold text-blue-800 dark:text-blue-300">{documentsByType.Rechnung}</p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <p className="text-sm text-green-600 dark:text-green-400">Verträge</p>
              <p className="text-2xl font-bold text-green-800 dark:text-green-300">{documentsByType.Vertrag}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">Sonstige</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{documentsByType.Sonstiges}</p>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex space-x-2 mb-6 border-b border-gray-200 dark:border-gray-700">
            {(['Alle', 'Rechnung', 'Vertrag', 'Sonstiges'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-4 py-2 font-medium transition-colors ${
                  selectedType === type
                    ? 'text-brand-green border-b-2 border-brand-green'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Documents List */}
          {filteredDocuments.length > 0 ? (
            <div className="space-y-3">
              {filteredDocuments.map((document) => (
                <div
                  key={document.id}
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-800 dark:text-gray-100 truncate">{document.name}</p>
                        <div className="flex items-center space-x-3 mt-1">
                          <span className={`text-xs px-2 py-1 rounded-full ${getTypeColor(document.type)}`}>
                            {document.type}
                          </span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">{formatFileSize(document.fileSize)}</span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">{formatDate(document.uploadDate)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => downloadDocument(document.id, document.name)}
                        className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        title="Herunterladen"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(document.id, document.name)}
                        className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        title="Löschen"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-gray-500 dark:text-gray-400">
                {selectedType === 'Alle' ? 'Keine Dokumente vorhanden' : `Keine ${selectedType}-Dokumente vorhanden`}
              </p>
            </div>
          )}
        </div>
      </div>

      <DocumentUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={handleUpload}
      />
    </>
  );
};

export default Documents;
