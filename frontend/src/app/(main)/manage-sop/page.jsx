'use client';
import React, { useState, useEffect, useRef } from "react";
import { Pencil, Trash2, Plus, X, Image, Upload, Camera, Filter, Clock, ExternalLink, Layers, Monitor, Eye, FileText, ArrowRight } from "lucide-react";
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Footer from "@/components/Footer";

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
                <Badge variant="secondary">Manage SOPs</Badge>
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Manage Your Standard Operating Procedures
                </h1>
                <p className="max-w-[600px] text-gray-500 md:text-xl">
                  Create, edit, and organize your SOPs in one place. Keep your documentation up to date and easily accessible.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="w-full md:px-16 py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            {/* Header with Add Button */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold">Your SOPs</h2>
                <p className="text-gray-500">Manage and organize your documentation</p>
              </div>
              <Button
                onClick={handleAdd}
                className="mt-4 md:mt-0 bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add New SOP
              </Button>
            </div>

            {/* Extension Data Banner */}
            {(hasExtensionData || extensionDataLoading) && (
              <Card className="mb-8 bg-blue-50 border-blue-200">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <Monitor className="h-6 w-6 text-blue-600" />
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
                </CardContent>
              </Card>
            )}

            {/* Filter and Sort Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-8">
              <div className="flex gap-2">
                <Button
                  variant={activeFilter === 'extension' ? 'default' : 'outline'}
                  onClick={() => setActiveFilter('extension')}
                  className="flex items-center gap-2"
                >
                  <Camera className="h-4 w-4" />
                  Extension SOPs
                  {extensionSOPCount > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      {extensionSOPCount}
                    </Badge>
                  )}
                </Button>
                <Button
                  variant={activeFilter === 'regular' ? 'default' : 'outline'}
                  onClick={() => setActiveFilter('regular')}
                >
                  Regular SOPs
                </Button>
              </div>
              
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

            {/* Error Message */}
            {error && (
              <Card className="mb-8 border-red-200 bg-red-50">
                <CardContent className="pt-6">
                  <p className="text-red-600">{error}</p>
                </CardContent>
              </Card>
            )}

            {/* Loading State */}
            {loading && (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            )}

            {/* SOP Grid */}
            {!loading && sops.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <Image className="mx-auto text-gray-400 mb-4" size={48} />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No SOPs Found</h3>
                  <p className="text-gray-500 mb-6">Get started by creating your first SOP</p>
                  <Button
                    onClick={handleAdd}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Create SOP
                  </Button>
                </CardContent>
              </Card>
            ) : !loading && filteredSOPs.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <Filter className="mx-auto text-gray-400 mb-4" size={48} />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No SOPs Match Filter</h3>
                  <p className="text-gray-500 mb-6">
                    {activeFilter === 'extension' 
                      ? 'No SOPs from the extension found. Capture some screenshots first!' 
                      : 'Try changing your filter to see more SOPs'}
                  </p>
                  <Button
                    onClick={() => setActiveFilter('extension')}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Show Extension SOPs
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedSOPs.map((sop) => (
                  <Card key={sop.id || sop._id} className="relative overflow-hidden group">
                    <CardContent className="pt-6">
                      {sop.fromExtension && (
                        <Badge className="absolute top-4 right-4 bg-blue-100 text-blue-800">
                          <Camera className="mr-1 h-3 w-3" />
                          Extension
                        </Badge>
                      )}
                      
                      <h3 className="text-xl font-semibold mb-2">{sop.title}</h3>
                      <p className="text-gray-500 mb-4 line-clamp-2">{sop.description}</p>
                      
                      {sop.imgData && (
                        <div className="mb-4 relative overflow-hidden rounded-lg">
                          <img 
                            src={sop.imgData} 
                            alt={sop.title} 
                            className="w-full h-48 object-cover"
                          />
                        </div>
                      )}
                      
                      <div className="flex justify-between items-center mt-4">
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push(`/sop/${sop._id || sop.id}`)}
                          >
                            <Eye className="mr-1 h-4 w-4" />
                            View
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(sop._id || sop.id)}
                          >
                            <Pencil className="mr-1 h-4 w-4" />
                            Edit
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDelete(sop._id || sop.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
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
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                Create New SOP
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

export default ManageSOPPage;
