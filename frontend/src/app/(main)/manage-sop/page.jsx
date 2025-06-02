'use client';
import React, { useState, useEffect, useRef } from "react";
import { Pencil, Trash2, Plus, X, Image, Upload, Camera, Filter, Clock, ExternalLink, Layers, Monitor, Eye } from "lucide-react";
import axios from 'axios';
import { useRouter } from 'next/navigation';

// Initial SOPs (will be replaced with data from API)
const initialSOPs = [
  { id: 1, title: "Onboarding Process", description: "Steps to onboard new employees." },
  { id: 2, title: "Bug Reporting", description: "Standard method to report software bugs." },
  { id: 3, title: "Content Publishing", description: "Workflow for publishing new content." },
];

const ManageSOPPage = () => {
  const router = useRouter();
  const [sops, setSOPs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [extensionDataLoading, setExtensionDataLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingSop, setEditingSop] = useState(null);
  const [activeFilter, setActiveFilter] = useState('extension'); // 'extension', 'regular'
  const [hasExtensionData, setHasExtensionData] = useState(false);
  const [sortOrder, setSortOrder] = useState('newest'); // 'newest', 'oldest', 'alphabetical'
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const fileInputRef = useRef(null);
  
  // Fetch SOPs on component mount and check for data from extension
  useEffect(() => {
    fetchSOPs();
    
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const source = urlParams.get('source');
      const hasData = urlParams.get('hasData');
      
      if (source === 'extension' && hasData === 'true') {
        setExtensionDataLoading(true);
        const screenshotDataString = localStorage.getItem('sopify_screenshots');
        
        if(!screenshotDataString) console.log('No screenshot data found in localStorage');

        if (screenshotDataString) {
          const screenshotData = JSON.parse(screenshotDataString);
          
          // Get user ID from token
          const token = localStorage.getItem('token');
          let userId = null;
          if (token) {
            try {
              const payload = JSON.parse(atob(token.split('.')[1]));
              userId = payload._id;
            } catch (e) {
              console.error('Error decoding token:', e);
            }
          }
  
          // Process each screenshot and save to backend
          const savePromises = screenshotData.map(async (screenshot) => {
            const formData = new FormData();
            formData.append('title', screenshot.title);
            formData.append('description', screenshot.description);
            formData.append('userId', userId);
            formData.append('fromExtension', 'true');
  
            // Convert base64 to Blob
            const byteString = atob(screenshot.imgData.split(',')[1]);
            const mimeType = screenshot.imgData.split(',')[0].split(':')[1].split(';')[0];
            const ab = new ArrayBuffer(byteString.length);
            const ia = new Uint8Array(ab);
            for (let i = 0; i < byteString.length; i++) {
              ia[i] = byteString.charCodeAt(i);
            }
            const blob = new Blob([ab], { type: mimeType });
            formData.append('image', blob, 'screenshot.png');
  
            try {
              await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/sops/add`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
              });
            } catch (error) {
              console.error('Error saving SOP:', error);
            }
          });
  
          Promise.all(savePromises)
            .then(() => {
              fetchSOPs();
              localStorage.removeItem('sopify_screenshots');
              setExtensionDataLoading(false);
            })
            .catch(() => {
              setExtensionDataLoading(false);
            });
        }
      }
    }
  }, []);
  
  // Filter SOPs based on active filter
  const filteredSOPs = sops.filter(sop => {
    if (activeFilter === 'extension') return sop.fromExtension;
    if (activeFilter === 'regular') return !sop.fromExtension;
    return true;
  });
  
  // Sort SOPs based on sort order
  const sortedSOPs = [...filteredSOPs].sort((a, b) => {
    if (sortOrder === 'newest') {
      return (b.timestamp || 0) - (a.timestamp || 0);
    } else if (sortOrder === 'oldest') {
      return (a.timestamp || 0) - (b.timestamp || 0);
    } else if (sortOrder === 'alphabetical') {
      return a.title.localeCompare(b.title);
    }
    return 0;
  });
  
  // Count extension SOPs
  const extensionSOPCount = sops.filter(sop => sop.fromExtension).length;
  
  const fetchSOPs = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Get user ID from token in localStorage
      let userId = null;
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (token) {
          // Decode the JWT token to get the user ID
          try {
            // JWT tokens are in the format: header.payload.signature
            // We need the payload part which is the second part
            const payload = token.split('.')[1];
            // The payload is base64 encoded, so we need to decode it
            const decodedPayload = JSON.parse(atob(payload));
            userId = decodedPayload._id; // Assuming the user ID is stored as _id in the token
            console.log('User ID from token:', userId);
          } catch (e) {
            console.error('Error decoding token:', e);
          }
        }
      }
      
      if (!userId) {
        setError('You need to be logged in to view SOPs');
        setLoading(false);
        return;
      }
      
      // Fetch SOPs from the API with user ID and source=extension
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/sops/getbyuser/${userId}?source=extension`);
      console.log(response.data.data);
      
      setSOPs(response.data.data);
    } catch (err) {
      console.error('Error fetching SOPs:', err);
      setError('Failed to load SOPs. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleEdit = (id) => {
    const sop = sops.find(s => s.id === id);
    if (sop) {
      setEditingSop(sop);
      setFormData({
        title: sop.title,
        description: sop.description
      });
      
      // If SOP has an image, set the preview
      if (sop.image) {
        setImagePreview(`${process.env.NEXT_PUBLIC_API_URL}/sop/image/${sop.id}`);
      } else {
        setImagePreview(null);
      }
      
      setShowForm(true);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this SOP?')) {
      try {
        // Uncomment when API is ready
        const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/sop/delete/${id}`);
        if (response.data.success) {
          setSOPs(sops.filter(sop => sop.id !== id));
        }
        
        // Using dummy implementation for now
        setSOPs(sops.filter(sop => sop.id !== id));
      } catch (err) {
        console.error('Error deleting SOP:', err);
        alert('Failed to delete SOP. Please try again.');
      }
    }
  };

  const handleAdd = () => {
    setEditingSop(null);
    setFormData({
      title: '',
      description: ''
    });
    setImagePreview(null);
    setSelectedFile(null);
    setShowForm(true);
  };

  // Handle file selection for image upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setFormError('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setFormError('Image size should be less than 5MB');
      return;
    }

    setSelectedFile(file);
    setFormError('');

    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Clear selected image
  const clearImage = () => {
    setImagePreview(null);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError('');

    try {
      // Create FormData object for multipart/form-data (required for file uploads)
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      
      // Add user ID if available from localStorage
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          if (payload._id) {
            formDataToSend.append('userId', payload._id);
          }
        } catch (err) {
          console.error('Error parsing token:', err);
        }
      }
      
      // Add file if selected
      if (selectedFile) {
        formDataToSend.append('image', selectedFile);
      }

      // For now, simulate API call
      // In a real implementation, uncomment the following code:
      /*
      let response;
      if (editingSop) {
        // Update existing SOP
        response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/sop/update/${editingSop.id}`, formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        // Create new SOP
        response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/sop/add`, formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }

      if (response.data.success) {
        // Refresh SOPs list
        fetchSOPs();
        // Close form
        setShowForm(false);
      } else {
        setFormError(response.data.message || 'Failed to save SOP');
      }
      */
      
      // Simulate successful API call
      setTimeout(() => {
        if (editingSop) {
          // Update existing SOP in the list
          setSOPs(sops.map(sop => 
            sop.id === editingSop.id 
              ? { ...sop, ...formData, image: selectedFile ? { path: URL.createObjectURL(selectedFile) } : sop.image }
              : sop
          ));
        } else {
          // Add new SOP to the list
          const newSop = {
            id: Date.now(), // Generate a temporary ID
            ...formData,
            image: selectedFile ? { path: URL.createObjectURL(selectedFile) } : null
          };
          setSOPs([...sops, newSop]);
        }
        
        // Close form
        setShowForm(false);
      }, 1000);
      
    } catch (err) {
      console.error('Error saving SOP:', err);
      setFormError(err.response?.data?.message || 'An error occurred while saving the SOP');
    } finally {
      setFormLoading(false);
    }
  };

  // Cancel form
  const handleCancelForm = () => {
    setShowForm(false);
    setFormError('');
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50 to-white overflow-x-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://www.sweetprocess.com/wp-content/uploads/2023/08/how-to-write-a-standard-operating-procedure-3-1024x511.jpg"
          alt="SOPify background"
          className="w-full h-full object-cover opacity-50"
        />
      </div>

      <div className="relative z-10 p-4 md:p-8 max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <h1 className="text-4xl font-extrabold text-blue-900 mb-4 md:mb-0 animate-fadeIn">
            🚀 Manage Your SOPs
          </h1>
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-full shadow-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 hover:scale-105"
          >
            <Plus size={20} />
            Add SOP
          </button>
        </div>
        
        {/* Extension Data Banner - Show only when extension data is present or loading */}
        {(hasExtensionData || extensionDataLoading) && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 p-4 rounded-lg mb-6 animate-fadeIn">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-full">
                <Monitor size={24} className="text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-blue-800">
                  {extensionDataLoading ? 'Processing Extension Data...' : 'Extension Data Available'}
                </h3>
                <p className="text-sm text-blue-600">
                  {extensionDataLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="inline-block h-3 w-3 rounded-full bg-blue-600 animate-pulse"></span>
                      Importing screenshots from Chrome extension
                    </span>
                  ) : (
                    `${extensionSOPCount} screenshot${extensionSOPCount !== 1 ? 's' : ''} imported from the Chrome extension`
                  )}
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Filter and Sort Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
          {/* Filter Tabs */}
          <div className="bg-white shadow-md rounded-lg p-1 flex">
            <button
              onClick={() => setActiveFilter('extension')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-1 ${activeFilter === 'extension' ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              <Camera size={16} />
              From Extension {extensionSOPCount > 0 && `(${extensionSOPCount})`}
            </button>
            <button
              onClick={() => setActiveFilter('regular')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeFilter === 'regular' ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              Regular SOPs
            </button>
          </div>
          
          {/* Sort Options */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Sort by:</span>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="bg-white border border-gray-300 text-gray-700 text-sm rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="alphabetical">Alphabetical</option>
            </select>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Loading indicator */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* SOP Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  {editingSop ? 'Edit SOP' : 'Create New SOP'}
                </h2>
                <button 
                  onClick={handleCancelForm}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>
              
              {formError && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">
                  {formError}
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="title" className="block text-gray-700 font-medium mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter SOP title"
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter SOP description"
                  />
                </div>
                
                <div className="mb-6">
                  <label htmlFor="image" className="block text-gray-700 font-medium mb-2">
                    Image
                  </label>
                  
                  <input
                    type="file"
                    id="image"
                    name="image"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                  
                  <div className="flex items-center space-x-4">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-700 transition-colors"
                    >
                      <Upload size={16} />
                      {selectedFile ? 'Change Image' : 'Select Image'}
                    </button>
                    
                    {selectedFile && (
                      <span className="text-sm text-gray-600">
                        {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
                      </span>
                    )}
                  </div>
                  
                  {imagePreview && (
                    <div className="mt-4 relative inline-block">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="max-w-xs max-h-48 rounded-lg border border-gray-300"
                      />
                      <button
                        type="button"
                        onClick={clearImage}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        title="Remove image"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={handleCancelForm}
                    className="px-6 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-700 transition-colors"
                    disabled={formLoading}
                  >
                    Cancel
                  </button>
                  
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors disabled:bg-blue-400 flex items-center gap-2"
                    disabled={formLoading}
                  >
                    {formLoading ? (
                      <>
                        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                        <span>Saving...</span>
                      </>
                    ) : (
                      <span>{editingSop ? 'Update SOP' : 'Create SOP'}</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* SOP Cards */}
        {!loading && sops.length === 0 ? (
          <div className="bg-white shadow-lg rounded-xl p-8 text-center">
            <Image size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No SOPs Found</h3>
            <p className="text-gray-500 mb-6">Get started by creating your first SOP</p>
            <button
              onClick={handleAdd}
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={18} />
              Create SOP
            </button>
          </div>
        ) : !loading && filteredSOPs.length === 0 ? (
          <div className="bg-white shadow-lg rounded-xl p-8 text-center">
            <Filter size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No SOPs Match Filter</h3>
            <p className="text-gray-500 mb-6">
              {activeFilter === 'extension' 
                ? 'No SOPs from the extension found. Capture some screenshots first!' 
                : 'Try changing your filter to see more SOPs'}
            </p>
            <button
              onClick={() => setActiveFilter('extension')}
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Show Extension SOPs
            </button>
          </div>
        ) : (
          <>
            {/* Extension SOPs Section - only show when filtered to extension */}
            {activeFilter === 'extension' && sortedSOPs.some(sop => sop.fromExtension) && (
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <h2 className="text-xl font-bold text-blue-800 flex items-center gap-2">
                    <Camera className="text-blue-600" />
                    Extension Screenshots
                  </h2>
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {sortedSOPs.filter(sop => sop.fromExtension).length}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sortedSOPs
                    .filter(sop => sop.fromExtension)
                    .map((sop) => (
                      <div
                        key={sop.id || sop._id}
                        className="bg-gradient-to-br from-white to-blue-50 shadow-xl rounded-3xl p-6 flex flex-col justify-between h-full hover:shadow-2xl transition-all relative overflow-hidden group border-2 border-blue-400"
                      >
                        {/* Extension Badge */}
                        <div className="absolute top-3 right-3 bg-blue-500 text-white text-xs px-2 py-1 rounded-full z-10 flex items-center gap-1">
                          <Camera size={12} />
                          Screenshot
                        </div>
                        
                        <div>
                          <h2 className="text-2xl font-bold text-gray-800 mb-3 cursor-pointer hover:text-blue-600 transition-colors" 
                              onClick={() => router.push(`/sop/${sop._id || sop.id}`)}>
                            {sop.title}
                          </h2>
                          
                          {/* Display the actual screenshot image */}
                          {sop.imgData && (
                            <div className="mb-4 relative overflow-hidden rounded-lg border border-gray-200 shadow-sm">
                              <img 
                                src={sop.imgData} 
                                alt={sop.title} 
                                className="w-full h-auto object-contain cursor-pointer hover:opacity-90 transition-opacity"
                                onClick={() => {
                                  // Create a modal or lightbox effect when clicked
                                  const modal = document.createElement('div');
                                  modal.style.position = 'fixed';
                                  modal.style.top = '0';
                                  modal.style.left = '0';
                                  modal.style.width = '100%';
                                  modal.style.height = '100%';
                                  modal.style.backgroundColor = 'rgba(0,0,0,0.8)';
                                  modal.style.display = 'flex';
                                  modal.style.justifyContent = 'center';
                                  modal.style.alignItems = 'center';
                                  modal.style.zIndex = '9999';
                                  modal.style.cursor = 'pointer';
                                  
                                  const img = document.createElement('img');
                                  img.src = sop.imgData;
                                  img.style.maxWidth = '90%';
                                  img.style.maxHeight = '90%';
                                  img.style.objectFit = 'contain';
                                  
                                  modal.appendChild(img);
                                  document.body.appendChild(modal);
                                  
                                  modal.onclick = () => {
                                    document.body.removeChild(modal);
                                  };
                                }}
                              />
                            </div>
                          )}
                          
                          <p className="text-sm text-gray-600 whitespace-pre-line">{sop.description}</p>
                          
                          {/* Timestamp */}
                          {sop.timestamp && (
                            <div className="mt-3 text-xs text-gray-500 flex items-center gap-1">
                              <Clock size={12} />
                              {new Date(sop.timestamp).toLocaleString()}
                            </div>
                          )}
                          
                          {/* URL */}
                          {sop.url && (
                            <div className="mt-2 text-xs text-blue-600 truncate flex items-center gap-1">
                              <ExternalLink size={12} />
                              <a href={sop.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                {sop.url}
                              </a>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex justify-between items-center mt-6">
                          <div className="flex gap-2">
                            <button
                              onClick={() => router.push(`/sop/${sop._id || sop.id}`)}
                              className="bg-green-100 hover:bg-green-200 text-green-700 p-2 rounded-lg transition-colors flex items-center gap-1 text-sm"
                              title="View SOP"
                            >
                              <Eye size={16} /> View
                            </button>

                          </div>
                          <button
                            onClick={() => handleDelete(sop._id || sop.id)}
                            className="text-red-600 hover:text-red-800 transition-transform hover:scale-110"
                            title="Delete"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
            
            {/* Regular SOPs Section - only show when filtered to regular */}
            {activeFilter === 'regular' && sortedSOPs.some(sop => !sop.fromExtension) && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <Layers className="text-gray-600" />
                    Regular SOPs
                  </h2>
                  <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {sortedSOPs.filter(sop => !sop.fromExtension).length}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sortedSOPs
                    .filter(sop => !sop.fromExtension)
                    .map((sop) => (
                      <div
                        key={sop.id || sop._id}
                        className="bg-white shadow-xl rounded-3xl p-6 flex flex-col justify-between h-full hover:shadow-2xl transition-all relative overflow-hidden group"
                      >
                        {/* SOP Image or Illustration */}
                        <div className="absolute top-0 right-0 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
                          {sop.image ? (
                            <img
                              src={sop.image.path || `/api/sop/image/${sop.id}`}
                              alt={`${sop.title} Image`}
                              className="w-32 h-32 object-contain"
                            />
                          ) : (
                            <img
                              src={`/images/sopify-${(sop.id % 3) + 1}.svg`}
                              alt={`${sop.title} Illustration`}
                              className="w-32 h-32 object-contain"
                            />
                          )}
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold text-gray-800 mb-3 cursor-pointer hover:text-blue-600 transition-colors"
                              onClick={() => router.push(`/sop/${sop._id || sop.id}`)}>
                            {sop.title}
                          </h2>
                          <p className="text-sm text-gray-600 whitespace-pre-line">{sop.description}</p>
                        </div>
                        <div className="flex justify-end mt-6 gap-4">
                          <button
                            onClick={() => router.push(`/sop/${sop._id || sop.id}`)}
                            className="text-green-600 hover:text-green-800 transition-transform hover:scale-110"
                            title="View"
                          >
                            <Eye size={24} />
                          </button>
                          <button
                            onClick={() => handleEdit(sop._id || sop.id)}
                            className="text-blue-600 hover:text-blue-800 transition-transform hover:scale-110"
                            title="Edit"
                          >
                            <Pencil size={24} />
                          </button>
                          <button
                            onClick={() => handleDelete(sop._id || sop.id)}
                            className="text-red-600 hover:text-red-800 transition-transform hover:scale-110"
                            title="Delete"
                          >
                            <Trash2 size={24} />
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Footer */}
        <div className="mt-16 text-center animate-fadeIn">
          <p className="text-gray-600 text-sm italic">
            SOPify – Simplifying your Standard Operating Procedures, one step at a time.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ManageSOPPage;
