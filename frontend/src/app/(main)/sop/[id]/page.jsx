'use client';
import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, Save, Plus, Trash2, ChevronUp, ChevronDown, 
  Edit, CheckCircle, Clock, ExternalLink, Image, Camera 
} from "lucide-react";
import axios from 'axios';

const SOPViewEditPage = () => {
  const params = useParams();
  const router = useRouter();
  const sopId = params.id;
  const [isEditing, setIsEditing] = useState(false);
  const [sop, setSop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  
  const fileInputRef = useRef(null);

  // For editing steps
  const [editStep, setEditStep] = useState(null);
  const [draggedStepIndex, setDraggedStepIndex] = useState(null);
  
  // Fetch SOP data
  useEffect(() => {
    const fetchSOP = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/sops/getbyid/${sopId}`);
        
        if (response.data.success) {
          setSop(response.data.data);
        } else {
          setError('Failed to load SOP data');
        }
      } catch (err) {
        console.error('Error fetching SOP:', err);
        setError('Error loading SOP. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSOP();
  }, [sopId]);

  // Handle main SOP data changes
  const handleSopChange = (e) => {
    const { name, value } = e.target;
    setSop(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Add a new step
  const handleAddStep = () => {
    setSop(prev => ({
      ...prev,
      steps: [
        ...prev.steps,
        {
          _id: `temp_${Date.now()}`,
          title: 'New Step',
          description: '',
          timestamp: Date.now()
        }
      ]
    }));
    
    // Put new step in edit mode
    const newIndex = sop.steps.length;
    setEditStep(newIndex);
  };

  // Handle step edit
  const handleStepChange = (index, field, value) => {
    setSop(prev => {
      const updatedSteps = [...prev.steps];
      updatedSteps[index] = {
        ...updatedSteps[index],
        [field]: value
      };
      return {
        ...prev,
        steps: updatedSteps
      };
    });
  };

  // Delete step
  const handleDeleteStep = (index) => {
    if (window.confirm('Are you sure you want to delete this step?')) {
      setSop(prev => {
        const updatedSteps = prev.steps.filter((_, i) => i !== index);
        return {
          ...prev,
          steps: updatedSteps
        };
      });
      
      if (editStep === index) {
        setEditStep(null);
      } else if (editStep !== null && editStep > index) {
        setEditStep(editStep - 1);
      }
    }
  };

  // Reorder steps
  const handleMoveStep = (index, direction) => {
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === sop.steps.length - 1)
    ) {
      return;
    }
    
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    setSop(prev => {
      const updatedSteps = [...prev.steps];
      const temp = updatedSteps[index];
      updatedSteps[index] = updatedSteps[newIndex];
      updatedSteps[newIndex] = temp;
      return {
        ...prev,
        steps: updatedSteps
      };
    });
    
    if (editStep === index) {
      setEditStep(newIndex);
    } else if (editStep === newIndex) {
      setEditStep(index);
    }
  };

  // Handle image upload for a step
  const handleStepImageUpload = (index) => {
    fileInputRef.current = index;
    document.getElementById(`step-image-upload-${index}`).click();
  };

  const handleImageChange = async (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      // Convert file to base64
      const reader = new FileReader();
      reader.onloadend = () => {
        handleStepChange(index, 'imgData', reader.result);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('Error processing image:', err);
    }
  };

  // Submit SOP changes
  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');
      setSuccess('');
      
      // Basic validation
      if (!sop.title || !sop.description) {
        setError('Title and description are required');
        setSaving(false);
        return;
      }
      
      // Send updated SOP to server
      const response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/sops/update/${sopId}`, sop, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data.success) {
        setSuccess('SOP updated successfully!');
        setIsEditing(false);
        // Update the SOP data with the response
        setSop(response.data.data);
      } else {
        setError(response.data.message || 'Failed to update SOP');
      }
    } catch (err) {
      console.error('Error updating SOP:', err);
      setError('Error saving changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Handle drag and drop for steps reordering
  const handleDragStart = (index) => {
    setDraggedStepIndex(index);
  };
  
  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedStepIndex === null || draggedStepIndex === index) return;
  };
  
  const handleDrop = (e, index) => {
    e.preventDefault();
    if (draggedStepIndex === null || draggedStepIndex === index) return;
    
    setSop(prev => {
      const updatedSteps = [...prev.steps];
      const draggedStep = updatedSteps[draggedStepIndex];
      
      // Remove the dragged step
      updatedSteps.splice(draggedStepIndex, 1);
      
      // Insert it at the new position
      updatedSteps.splice(index, 0, draggedStep);
      
      return {
        ...prev,
        steps: updatedSteps
      };
    });
    
    if (editStep === draggedStepIndex) {
      setEditStep(index);
    }
    
    setDraggedStepIndex(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  if (error && !sop) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex flex-col items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading SOP</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            onClick={() => router.push('/manage-sop')}
          >
            Return to SOPs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header with navigation and actions */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/manage-sop')}
              className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
              title="Back to SOPs"
            >
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
            
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
                {sop.fromExtension && <Camera size={24} className="text-blue-600" />}
                {isEditing ? 'Editing:' : ''} {sop.title}
              </h1>
              <p className="text-gray-500 text-sm">
                Created: {new Date(sop.createdAt).toLocaleDateString()}
                {sop.updatedAt !== sop.createdAt && 
                  ` · Updated: ${new Date(sop.updatedAt).toLocaleDateString()}`
                }
              </p>
            </div>
          </div>
          
          <div className="flex gap-3">
            {isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-4 py-2 bg-blue-600 rounded-lg text-white hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  {saving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      Save Changes
                    </>
                  )}
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-blue-600 rounded-lg text-white hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Edit size={18} />
                Edit SOP
              </button>
            )}
          </div>
        </div>
        
        {/* Success message */}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
            <CheckCircle size={20} />
            {success}
          </div>
        )}
        
        {/* Error message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}
        
        {/* SOP Content */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Title</h2>
            {isEditing ? (
              <input
                type="text"
                name="title"
                value={sop.title}
                onChange={handleSopChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            ) : (
              <p className="text-xl font-medium text-gray-800">{sop.title}</p>
            )}
          </div>
          
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Description</h2>
            {isEditing ? (
              <textarea
                name="description"
                value={sop.description}
                onChange={handleSopChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            ) : (
              <p className="text-gray-600 whitespace-pre-line">{sop.description}</p>
            )}
          </div>
          
          {/* Main image if available */}
          {sop.image && sop.image.path && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-700 mb-2">Main Image</h2>
              <div className="relative rounded-lg overflow-hidden border border-gray-200">
                <img 
                  src={`${process.env.NEXT_PUBLIC_API_URL}/sop/image/${sopId}`}
                  alt={sop.title}
                  className="w-full max-h-80 object-contain"
                />
              </div>
            </div>
          )}
        </div>
        
        {/* Steps Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Steps</h2>
            {isEditing && (
              <button
                onClick={handleAddStep}
                className="flex items-center gap-2 bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-lg transition-colors"
              >
                <Plus size={18} />
                Add Step
              </button>
            )}
          </div>
          
          {sop.steps && sop.steps.length > 0 ? (
            <div className="space-y-6">
              {sop.steps.map((step, index) => (
                <div 
                  key={step._id || index}
                  className={`bg-white rounded-xl shadow-lg overflow-hidden
                    ${isEditing ? 'border-2 border-dashed' : ''}
                    ${draggedStepIndex === index ? 'opacity-50' : ''}
                    ${editStep === index ? 'border-blue-400' : 'border-transparent'}`
                  }
                  draggable={isEditing}
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDrop={(e) => handleDrop(e, index)}
                >
                  <div className="flex justify-between items-center bg-gray-50 p-4 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <div className="bg-blue-600 text-white w-7 h-7 flex items-center justify-center rounded-full font-bold">
                        {index + 1}
                      </div>
                      
                      {editStep === index ? (
                        <input
                          type="text"
                          value={step.title}
                          onChange={(e) => handleStepChange(index, 'title', e.target.value)}
                          className="px-3 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
                        />
                      ) : (
                        <h3 className="font-semibold text-gray-800">{step.title || `Step ${index + 1}`}</h3>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-1">
                      {isEditing && (
                        <>
                          {editStep === index ? (
                            <button
                              onClick={() => setEditStep(null)}
                              className="p-1 text-green-600 hover:text-green-800"
                              title="Save step edit"
                            >
                              <CheckCircle size={18} />
                            </button>
                          ) : (
                            <button
                              onClick={() => setEditStep(index)}
                              className="p-1 text-blue-600 hover:text-blue-800"
                              title="Edit step"
                            >
                              <Edit size={18} />
                            </button>
                          )}
                          
                          <button
                            onClick={() => handleMoveStep(index, 'up')}
                            disabled={index === 0}
                            className={`p-1 ${index === 0 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-600 hover:text-gray-800'}`}
                            title="Move up"
                          >
                            <ChevronUp size={18} />
                          </button>
                          
                          <button
                            onClick={() => handleMoveStep(index, 'down')}
                            disabled={index === sop.steps.length - 1}
                            className={`p-1 ${index === sop.steps.length - 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-600 hover:text-gray-800'}`}
                            title="Move down"
                          >
                            <ChevronDown size={18} />
                          </button>
                          
                          <button
                            onClick={() => handleDeleteStep(index)}
                            className="p-1 text-red-600 hover:text-red-800"
                            title="Delete step"
                          >
                            <Trash2 size={18} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="p-4">
                    {/* Step content */}
                    <div className="mb-4">
                      {editStep === index ? (
                        <textarea
                          value={step.description || ''}
                          onChange={(e) => handleStepChange(index, 'description', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          rows={3}
                          placeholder="Describe this step..."
                        />
                      ) : (
                        step.description && <p className="text-gray-600 whitespace-pre-line">{step.description}</p>
                      )}
                    </div>
                    
                    {/* Step image */}
                    {(step.imgData || editStep === index) && (
                      <div className="mt-4">
                        {editStep === index && (
                          <div className="mb-3">
                            <input
                              id={`step-image-upload-${index}`}
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleImageChange(e, index)}
                              className="hidden"
                            />
                            <button
                              onClick={() => handleStepImageUpload(index)}
                              className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-md text-sm transition-colors"
                            >
                              <Image size={14} />
                              {step.imgData ? 'Change Image' : 'Add Image'}
                            </button>
                          </div>
                        )}
                        
                        {step.imgData && (
                          <div className="relative rounded-lg overflow-hidden border border-gray-200">
                            <img 
                              src={step.imgData} 
                              alt={step.title || `Step ${index + 1}`} 
                              className="max-w-full max-h-96 object-contain cursor-pointer"
                              onClick={() => {
                                // Create a modal for full-size view
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
                                img.src = step.imgData;
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
                      </div>
                    )}
                    
                    {/* Step metadata */}
                    <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-gray-500">
                      {step.timestamp && (
                        <div className="flex items-center gap-1">
                          <Clock size={12} />
                          {new Date(step.timestamp).toLocaleString()}
                        </div>
                      )}
                      
                      {step.url && (
                        <div className="flex items-center gap-1">
                          <ExternalLink size={12} />
                          <a 
                            href={step.url} 
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline truncate max-w-xs"
                          >
                            {step.url}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
              <Image size={36} className="mx-auto text-gray-400 mb-3" />
              <p className="text-gray-600 mb-4">No steps defined for this SOP yet.</p>
              
              {isEditing && (
                <button
                  onClick={handleAddStep}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors mx-auto"
                >
                  <Plus size={18} />
                  Add First Step
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SOPViewEditPage;