'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

const ManageContact = () => {
  const [contacts, setContacts] = useState([]);
  const [newContact, setNewContact] = useState({ id: null, name: '', email: '', phone: '' });
  const [editIndex, setEditIndex] = useState(null);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewContact((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddOrUpdate = () => {
    if (!newContact.name || !newContact.email || !newContact.phone) {
      setError('All fields are required.');
      return;
    }
    setError('');

    if (editIndex !== null) {
      const updated = [...contacts];
      updated[editIndex] = newContact;
      setContacts(updated);
      setEditIndex(null);
    } else {
      setContacts([...contacts, { ...newContact, id: Date.now() }]);
    }

    setNewContact({ id: null, name: '', email: '', phone: '' });
  };

  const handleEdit = (index) => {
    setNewContact(contacts[index]);
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    const updated = contacts.filter((_, i) => i !== index);
    setContacts(updated);
    if (editIndex === index) setEditIndex(null);
  };

  const handleCancel = () => {
    setNewContact({ id: null, name: '', email: '', phone: '' });
    setEditIndex(null);
    setError('');
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Manage Contacts</h2>

      {/* Contact Form */}
      <Card className="mb-6">
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
          <Input
            type="text"
            name="name"
            placeholder="Name"
            value={newContact.name}
            onChange={handleInputChange}
            aria-label="Contact Name"
          />
          <Input
            type="email"
            name="email"
            placeholder="Email"
            value={newContact.email}
            onChange={handleInputChange}
            aria-label="Contact Email"
          />
          <Input
            type="tel"
            name="phone"
            placeholder="Phone"
            value={newContact.phone}
            onChange={handleInputChange}
            aria-label="Contact Phone"
          />
          <div className="md:col-span-3 flex gap-2">
            <Button className="w-full" onClick={handleAddOrUpdate}>
              {editIndex !== null ? 'Update Contact' : 'Add Contact'}
            </Button>
            {editIndex !== null && (
              <Button variant="outline" className="w-full" onClick={handleCancel}>
                Cancel
              </Button>
            )}
          </div>
          {error && <p className="text-red-500 text-sm md:col-span-3">{error}</p>}
        </CardContent>
      </Card>

      {/* Contact List */}
      <div className="grid gap-4">
        {contacts.map((contact, index) => (
          <Card key={contact.id} className="p-4 flex flex-col md:flex-row md:justify-between items-start md:items-center">
            <div className="mb-2 md:mb-0">
              <h3 className="font-semibold">{contact.name}</h3>
              <p className="text-sm">{contact.email}</p>
              <p className="text-sm">{contact.phone}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => handleEdit(index)}>Edit</Button>
              <Button variant="destructive" onClick={() => handleDelete(index)}>Delete</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ManageContact;
