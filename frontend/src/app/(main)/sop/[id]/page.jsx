'use client';
import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, Save, Plus, Trash2, ChevronUp, ChevronDown, 
  Edit, CheckCircle, Clock, ExternalLink, Image, Camera, FileText, ArrowRight
} from "lucide-react";
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Footer from "@/components/Footer";

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
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  if (error && !sop) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-8 flex flex-col items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading SOP</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button 
              onClick={() => router.push('/manage-sop')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Return to SOPs
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-16 lg:py-24 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <FileText className="h-5 w-5 text-white" />
                  </div>
                  <span className="font-bold text-xl">SOPify</span>
                </div>
                <Badge variant="secondary">SOP Details</Badge>
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  {isEditing ? 'Editing SOP' : sop.title}
                </h1>
                <p className="max-w-[600px] text-gray-500 md:text-xl">
                  {sop.description}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="w-full md:px-16 py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            {/* Header with navigation and actions */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={() => router.push('/manage-sop')}
                  className="bg-white"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to SOPs
                </Button>
                
                <div>
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
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSave}
                      disabled={saving}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {saving ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={() => setIsEditing(true)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit SOP
                  </Button>
                )}
              </div>
            </div>
            
            {/* Success message */}
            {success && (
              <Card className="mb-8 border-green-200 bg-green-50">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 text-green-700">
                    <CheckCircle className="h-5 w-5" />
                    {success}
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Error message */}
            {error && (
              <Card className="mb-8 border-red-200 bg-red-50">
                <CardContent className="pt-6">
                  <p className="text-red-600">{error}</p>
                </CardContent>
              </Card>
            )}
            
            {/* SOP Content */}
            <Card className="mb-8">
              <CardContent className="pt-6">
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-700 mb-2">Title</h2>
                  {isEditing ? (
                    <Input
                      type="text"
                      name="title"
                      value={sop.title}
                      onChange={handleSopChange}
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
              </CardContent>
            </Card>
            
            {/* Steps Section */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Steps</h2>
                  <p className="text-gray-500">Manage the steps of your SOP</p>
                </div>
                {isEditing && (
                  <Button
                    onClick={handleAddStep}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Step
                  </Button>
                )}
              </div>
              
              {sop.steps && sop.steps.length > 0 ? (
                <div className="space-y-6">
                  {sop.steps.map((step, index) => (
                    <Card 
                      key={step._id || index}
                      className={`relative overflow-hidden
                        ${isEditing ? 'border-2 border-dashed' : ''}
                        ${draggedStepIndex === index ? 'opacity-50' : ''}
                        ${editStep === index ? 'border-blue-400' : 'border-transparent'}`
                      }
                      draggable={isEditing}
                      onDragStart={() => handleDragStart(index)}
                      onDragOver={(e) => handleDragOver(e, index)}
                      onDrop={(e) => handleDrop(e, index)}
                    >
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-center mb-4">
                          <div className="flex items-center gap-2">
                            <Badge className="bg-blue-600">
                              Step {index + 1}
                            </Badge>
                            
                            {editStep === index ? (
                              <Input
                                type="text"
                                value={step.title}
                                onChange={(e) => handleStepChange(index, 'title', e.target.value)}
                                className="w-full"
                              />
                            ) : (
                              <h3 className="font-semibold text-gray-800">{step.title || `Step ${index + 1}`}</h3>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-1">
                            {isEditing && (
                              <>
                                {editStep === index ? (
                                  <Button
                                    variant="ghost"
                                    onClick={() => setEditStep(null)}
                                    className="text-green-600 hover:text-green-800"
                                  >
                                    <CheckCircle className="h-4 w-4" />
                                  </Button>
                                ) : (
                                  <Button
                                    variant="ghost"
                                    onClick={() => setEditStep(index)}
                                    className="text-blue-600 hover:text-blue-800"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                )}
                                
                                <Button
                                  variant="ghost"
                                  onClick={() => handleMoveStep(index, 'up')}
                                  disabled={index === 0}
                                  className={index === 0 ? 'text-gray-400' : 'text-gray-600 hover:text-gray-800'}
                                >
                                  <ChevronUp className="h-4 w-4" />
                                </Button>
                                
                                <Button
                                  variant="ghost"
                                  onClick={() => handleMoveStep(index, 'down')}
                                  disabled={index === sop.steps.length - 1}
                                  className={index === sop.steps.length - 1 ? 'text-gray-400' : 'text-gray-600 hover:text-gray-800'}
                                >
                                  <ChevronDown className="h-4 w-4" />
                                </Button>
                                
                                <Button
                                  variant="ghost"
                                  onClick={() => handleDeleteStep(index)}
                                  className="text-red-600 hover:text-red-800"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                        
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
                                <Button
                                  variant="outline"
                                  onClick={() => handleStepImageUpload(index)}
                                  className="bg-gray-100 hover:bg-gray-200"
                                >
                                  <Image className="mr-2 h-4 w-4" />
                                  {step.imgData ? 'Change Image' : 'Add Image'}
                                </Button>
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
                              <Clock className="h-3 w-3" />
                              {new Date(step.timestamp).toLocaleString()}
                            </div>
                          )}
                          
                          {step.url && (
                            <div className="flex items-center gap-1">
                              <ExternalLink className="h-3 w-3" />
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
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="border-2 border-dashed border-gray-300">
                  <CardContent className="pt-6 text-center">
                    <Image className="mx-auto text-gray-400 mb-3" size={36} />
                    <p className="text-gray-600 mb-4">No steps defined for this SOP yet.</p>
                    
                    {isEditing && (
                      <Button
                        onClick={handleAddStep}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add First Step
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-blue-600">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-white">
                  Ready to Create More SOPs?
                </h2>
                <p className="max-w-[600px] text-blue-100 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Start documenting your processes and streamline your workflow today.
                </p>
              </div>
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-blue-50"
                onClick={() => router.push('/manage-sop')}
              >
                Back to SOPs
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default SOPViewEditPage;