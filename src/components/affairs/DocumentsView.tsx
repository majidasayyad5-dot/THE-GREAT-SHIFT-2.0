import React, { useState, useMemo } from 'react';
import { DocumentRecord, DocumentType } from '../../types/bi';
import { useI18n } from '../../context/I18nContext';
import { Plus, Search, Edit2, Trash2, FileText, Filter, X, Calendar, ShieldCheck, Tag } from 'lucide-react';

interface DocumentsViewProps {
  documents: DocumentRecord[];
  onAddDocument: (doc: DocumentRecord) => void;
  onEditDocument: (doc: DocumentRecord) => void;
  onDeleteDocument: (id: string) => void;
}

const DOCUMENT_TYPES: DocumentType[] = [
  'License',
  'Invoice',
  'Tax Document',
  'Contract',
  'Certificate',
  'Other',
];

export const DocumentsView: React.FC<DocumentsViewProps> = ({
  documents,
  onAddDocument,
  onEditDocument,
  onDeleteDocument,
}) => {
  const { t } = useI18n();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [type, setType] = useState<DocumentType>('License');
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
  const [expiryDate, setExpiryDate] = useState('');
  const [documentNumber, setDocumentNumber] = useState('');
  const [notes, setNotes] = useState('');

  const openAddModal = () => {
    setEditingId(null);
    setTitle('');
    setType('License');
    setIssueDate(new Date().toISOString().split('T')[0]);
    setExpiryDate('');
    setDocumentNumber('');
    setNotes('');
    setIsModalOpen(true);
  };

  const openEditModal = (doc: DocumentRecord) => {
    setEditingId(doc.id);
    setTitle(doc.title || doc.name || '');
    setType((doc.type as DocumentType) || 'License');
    setIssueDate(doc.issueDate || doc.dateAdded || new Date().toISOString().split('T')[0]);
    setExpiryDate(doc.expiryDate || '');
    setDocumentNumber(doc.documentNumber || '');
    setNotes(doc.notes || '');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingId) {
      const existing = documents.find((d) => d.id === editingId);
      if (existing) {
        onEditDocument({
          ...existing,
          title: title.trim(),
          name: title.trim(),
          type,
          issueDate,
          expiryDate: expiryDate ? expiryDate : undefined,
          documentNumber: documentNumber.trim() || undefined,
          notes: notes.trim() || undefined,
        });
      }
    } else {
      const newDoc: DocumentRecord = {
        id: `doc_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        title: title.trim(),
        name: title.trim(),
        type,
        issueDate,
        dateAdded: issueDate,
        expiryDate: expiryDate ? expiryDate : undefined,
        documentNumber: documentNumber.trim() || undefined,
        notes: notes.trim() || undefined,
        createdAt: new Date().toISOString(),
      };
      onAddDocument(newDoc);
    }
    setIsModalOpen(false);
  };

  const filteredDocs = useMemo(() => {
    return documents.filter((doc) => {
      const docTitle = doc.title || doc.name || '';
      const matchesSearch =
        docTitle.toLowerCase().includes(search.toLowerCase()) ||
        (doc.documentNumber && doc.documentNumber.toLowerCase().includes(search.toLowerCase())) ||
        (doc.notes && doc.notes.toLowerCase().includes(search.toLowerCase()));
      const matchesType = typeFilter === 'All' || doc.type === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [documents, search, typeFilter]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-teal-700" />
            <span>{t.affairs.documents}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {t.affairs.documents_desc}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {documents.length > 0 && (
            <div className="text-right px-3 py-1 bg-slate-100 border border-slate-200 rounded text-xs font-mono">
              <span className="font-bold text-slate-900">{documents.length} Cataloged Documents</span>
            </div>
          )}
          <button
            onClick={openAddModal}
            className="px-3.5 py-1.5 bg-teal-800 hover:bg-teal-900 text-white rounded text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{t.affairs.add_document}</span>
          </button>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder={t.common.search || 'Search documents...'}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-300 rounded text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal-600"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs text-slate-700 focus:outline-none focus:border-teal-600"
          >
            <option value="All">All Document Types</option>
            {DOCUMENT_TYPES.map((dt) => (
              <option key={dt} value={dt}>
                {dt}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table / List */}
      {documents.length === 0 ? (
        <div className="p-8 text-center bg-white border border-slate-200 rounded-lg space-y-2">
          <FileText className="w-8 h-8 text-slate-300 mx-auto" />
          <p className="font-semibold text-slate-700 text-sm">{t.affairs.no_records_added}</p>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Maintain administrative registers for trade licenses, GST certificates, vendor agreements, and tax documents.
          </p>
          <button
            onClick={openAddModal}
            className="mt-2 px-3 py-1.5 bg-teal-800 text-white rounded text-xs font-semibold cursor-pointer"
          >
            {t.affairs.add_document}
          </button>
        </div>
      ) : filteredDocs.length === 0 ? (
        <div className="p-6 text-center bg-white border border-slate-200 rounded-lg text-xs text-slate-500">
          No documents match your filter.
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-lg overflow-x-auto shadow-sm">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-mono text-[11px] uppercase tracking-wider">
                <th className="p-2.5">Document Title</th>
                <th className="p-2.5">Type</th>
                <th className="p-2.5">Reference #</th>
                <th className="p-2.5">Issue Date</th>
                <th className="p-2.5">Expiry Date</th>
                <th className="p-2.5">Notes</th>
                <th className="p-2.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDocs.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-2.5 font-semibold text-slate-900">{doc.title}</td>
                  <td className="p-2.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-100 text-slate-700 border border-slate-200">
                      {doc.type}
                    </span>
                  </td>
                  <td className="p-2.5 font-mono text-slate-700">{doc.documentNumber || '—'}</td>
                  <td className="p-2.5 font-mono text-slate-600">{doc.issueDate}</td>
                  <td className="p-2.5 font-mono text-slate-600">{doc.expiryDate || 'Perpetual / N/A'}</td>
                  <td className="p-2.5 text-slate-500 truncate max-w-xs">{doc.notes || '—'}</td>
                  <td className="p-2.5 text-right space-x-1">
                    <button
                      onClick={() => openEditModal(doc)}
                      className="p-1 text-slate-400 hover:text-teal-700 transition-colors"
                      title="Edit Document"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteDocument(doc.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                      title="Delete Document"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add / Edit Document Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full border border-slate-200 p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900">
                {editingId ? t.affairs.edit_document : t.affairs.add_document}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Document Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. GST Registration Certificate, Shop Lease"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Document Type *</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as DocumentType)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs text-slate-900"
                  >
                    {DOCUMENT_TYPES.map((dt) => (
                      <option key={dt} value={dt}>
                        {dt}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Reference / Reg #</label>
                  <input
                    type="text"
                    placeholder="e.g. 27AAAAA0000A1Z5"
                    value={documentNumber}
                    onChange={(e) => setDocumentNumber(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs text-slate-900 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Issue Date</label>
                  <input
                    type="date"
                    value={issueDate}
                    onChange={(e) => setIssueDate(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Expiry Date</label>
                  <input
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Notes / Authority Details</label>
                <textarea
                  rows={2}
                  placeholder="Issuing department, renewal notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs text-slate-900"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-medium cursor-pointer"
                >
                  {t.common.cancel}
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-teal-800 hover:bg-teal-900 text-white rounded text-xs font-bold transition-all shadow-sm cursor-pointer"
                >
                  {editingId ? 'Update Document' : 'Catalog Document'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
