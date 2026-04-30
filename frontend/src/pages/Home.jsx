import React, { useState, useEffect, useContext } from 'react';
import { getCategories, addCategory, deleteCategory } from '../services/api';
import CategoryCard from '../components/CategoryCard';
import { ToastContext } from '../App';
import { Search, Plus, Trash2, X } from 'lucide-react';

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { addToast } = useContext(ToastContext);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await getCategories();
      setCategories(res.data);
    } catch (error) {
      addToast('Failed to load categories', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    
    setIsSubmitting(true);
    try {
      const res = await addCategory({ name: newCatName });
      setCategories([res.data, ...categories]);
      setNewCatName('');
      setShowAddModal(false);
      addToast('Category added successfully', 'success');
    } catch (error) {
      addToast('Failed to add category', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCategory = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"? This will also delete all images inside it.`)) return;
    
    try {
      await deleteCategory(id);
      setCategories(categories.filter(c => c._id !== id));
      addToast('Category deleted', 'success');
    } catch (error) {
      addToast('Failed to delete category', 'error');
    }
  };

  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {/* Search and Actions Row */}
      <div className="flex justify-center items-center mb-8 flex-wrap gap-4" style={{ maxWidth: '800px', margin: '0 auto 2rem auto' }}>
        <div style={{ position: 'relative', width: '100%', maxWidth: '400px' }}>
          <Search style={{ position: 'absolute', left: '16px', top: '12px', color: 'var(--text-muted)' }} size={18} />
          <input 
            type="text" 
            placeholder="Search categories..." 
            className="search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <div className="flex gap-3 justify-center">
          <button 
            className={`btn ${deleteMode ? 'btn-danger' : 'btn-danger-outline'}`}
            onClick={() => setDeleteMode(!deleteMode)}
          >
            <Trash2 size={16} />
            {deleteMode ? 'Done' : 'Delete Category'}
          </button>
          <button className="btn btn-gradient" onClick={() => setShowAddModal(true)}>
            <Plus size={16} /> Add Category
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center mt-8">
          <div className="loader"></div>
        </div>
      ) : filteredCategories.length === 0 ? (
        <div className="text-center mt-8 text-muted" style={{ padding: '3rem', backgroundColor: 'var(--card-bg)', borderRadius: 'var(--radius-lg)' }}>
          <p>No categories found.</p>
        </div>
      ) : (
        <div className="category-grid">
          {filteredCategories.map((category, index) => (
            <div key={category._id} style={{ position: 'relative', height: '100%' }}>
              <CategoryCard category={category} index={index} />
              {deleteMode && (
                <button 
                  style={{
                    position: 'absolute',
                    top: '-10px',
                    right: '-10px',
                    backgroundColor: 'var(--danger)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: 'var(--shadow-md)',
                    zIndex: 10
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteCategory(category._id, category.name);
                  }}
                >
                  <X size={16} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add Category Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Add New Category</h3>
              <button className="btn-icon" onClick={() => setShowAddModal(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddCategory}>
              <div className="mb-6">
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '14px' }}>Category Name</label>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="e.g. Baby Feeding Bottle" 
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  autoFocus
                />
              </div>
              <div className="flex justify-end gap-3">
                <button type="button" className="btn btn-outline" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-gradient" disabled={isSubmitting || !newCatName.trim()}>
                  {isSubmitting ? 'Adding...' : 'Add Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
