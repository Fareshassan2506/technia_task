import React, { useEffect, useState } from "react";
import { createLazyFileRoute } from "@tanstack/react-router";
import {
  PlusCircle,
  Trash,
  Download,
  Filter,
  Columns,
  Pencil,
  PhoneCall,
  Users,
} from "lucide-react";
import axios from "axios";
import { useAuth } from "../../../hooks/useAuth"; // ✅ Import useAuth

export const Route = createLazyFileRoute("/_app/real-estate")({
  component: RealEstateLeads,
});

// Interface for Call Details
interface CallDetails {
  call_id: number;
  call_date: string; // ISO string format
  date_added: string; // ISO string format
  assigned_to: number; // ID of the person assigned
  call_status: number; // Status as a number
  company_domain: string; // Domain related to the call
}

// Interface for Meeting Details
interface MeetingDetails {
  meeting_id: number;
  meeting_date: string; // ISO string format
  date_added: string; // ISO string format
  assigned_to: number; // ID of the person assigned
  meeting_status: number; // Status as a number
  company_domain: string; // Domain related to the meeting
  lead_id: number; // ID of the lead
}

// Updated LeadDetails Interface
interface LeadDetails {
  lead_id?: number;
  name: string;
  lead_phone?: string;
  email?: string;
  lead_status?: number;
  assigned_to?: string; // user or agent name
  lead_stage?: number;
  company_domain?: string;
  lead_type?: number;
  calls?: CallDetails[]; // Array of CallDetails
  meetings?: MeetingDetails[]; // Array of MeetingDetails
}


interface LeadAction {
  id: number;
  type: string; // e.g., "call" or "meeting"
  notes: string;
  date: string; // or a Date type
}

function RealEstateLeads() {
  const [leadsData, setLeadsData] = useState<LeadDetails[]>([]);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
    const [domains, setDomains] = useState<string[]>([]);
    interface User {
      id: number;
      first_name: string;
      last_name: string; 
    }
    
    const [users, setUsers] = useState<User[]>([]); // Store users from API

  // ✅ Get logged-in user
  const user = useAuth();

  // Add Lead Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newLead, setNewLead] = useState({
    name: "",
    phone: "",
    email: "",
    status: "",
    assigned_to: "",
    company_domain: "",
    stage: "",
    type: "",
  });

  // Edit Lead Modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState<LeadDetails | null>(null);
  const [editError, setEditError] = useState<string | { msg: string }[] | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [showErrorModal, setShowErrorModal] = useState(false);

  // Show modal when there is an error
  if (deleteError && !showErrorModal) {
    setShowErrorModal(true);
  }



  // View Lead Modal (with actions)
  const [showViewModal, setShowViewModal] = useState(false);

  // Add Action Modal
  const [showActionModal, setShowActionModal] = useState(false);

  // Example: user’s permissions
  const userCanEdit = true; // or fetched from user’s roles
  const userCanDelete = true; // likewise

  // Fetch leads on mount
  useEffect(() => {
    fetchLeads();
    fetchDomains();
    fetchUsers();
    if (deleteError) {
      setShowErrorModal(true);
    }
  }, [deleteError]);
  
  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/real-estate/users");
      setUsers(response.data.users || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchDomains = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/real-estate/domains");
      setDomains(response.data.domains || []);
    } catch (error) {
      console.error("Error fetching domains:", error);
    }
  };
  
  const fetchLeads = async () => {
    try {
      // Fetch leads from the backend API
      const response = await axios.get("http://127.0.0.1:8000/real-estate/leads");
      const fetchedLeads: LeadDetails[] = response.data.leads || [];
      
      // Update state with fetched leads
      setLeadsData(fetchedLeads);
    } catch (error) {
      console.error("Error fetching leads:", error);
      // Optionally handle errors by displaying a message or fallback UI
      setLeadsData([]);
    }
  };
  

  // -------------------------------
  // ADD LEAD LOGIC
  // -------------------------------
  const handleAddLeadClick = () => {
    setShowAddModal(true);
    // Reset the form
    setNewLead({
      name: "",
      phone: "",
      email: "",
      status: "",
      assigned_to: "",
      company_domain: "",
      stage: "",
      type: "",
    });
  };
  const fetchLeadDetails = async (leadId: any) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/real-estate/leads/${leadId}`);
      return response.data.lead; // Return the fetched lead details
    } catch (error) {
      console.error("Error fetching lead details:", error);
      return null; // Return null if an error occurs
    }
  };
  const handleAddLeadSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await axios.post("http://127.0.0.1:8000/real-estate/leads", {
        name: newLead.name,
        email: newLead.email,
        lead_phone: newLead.phone, // Matches backend
        lead_stage: newLead.stage, // Matches backend
        lead_status: newLead.status, // Matches backend (1,2,3,4)
        lead_type: newLead.type, // Matches backend
        assigned_to: newLead.assigned_to, // Should send user ID
        company_domain: newLead.company_domain, // Matches backend
      });
      
      setShowAddModal(false);
      fetchLeads(); // Refresh lead list
    } catch (error) {
      console.error("Error adding lead:", error);
    }
  };
  
  // -------------------------------
  // EDIT LEAD LOGIC
  // -------------------------------
  const handleEditClick = (lead: LeadDetails) => {
    if (!userCanEdit) return;
    setSelectedLead(lead);
    setShowEditModal(true);
  };
  const handleEditLeadSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    console.log("current user id", user?.user?.id);
    e.preventDefault();
    if (!selectedLead) return;
  
    try {
      await axios.put(
        `http://127.0.0.1:8000/real-estate/leads/${selectedLead.lead_id}`,
        {
          // Remove the "update_data" wrapper:
          name: selectedLead.name || null,
          email: selectedLead.email || null,
          lead_phone: selectedLead.lead_phone || null,
          lead_stage: selectedLead.lead_stage || null,
          lead_status: selectedLead.lead_status || null,
          assigned_to: selectedLead.assigned_to || null,
          company_domain: selectedLead.company_domain || null,
          lead_type: selectedLead.lead_type || null,
        },
        {
          params: {
            user_id: user?.user?.id, // or the actual logged-in user's ID
          },
        }
      );
      
      setEditError(null); // Clear previous errors
      setShowEditModal(false); // Close modal
      fetchLeads(); // Refresh leads list
    } catch (error) {
      if (axios.isAxiosError(error) && error.response && error.response.data.detail) {
        setEditError(error.response.data.detail); // Capture error details
      } else {
        setEditError("An unexpected error occurred. Please try again.");
      }
    }
  };
  
  
  // -------------------------------
  // DELETE LEAD LOGIC
  // -------------------------------

  const handleDeleteClick = async (leadId: number) => {
    if (!userCanDelete) return;

    try {
      // Call your delete endpoint
      await axios.delete(`http://127.0.0.1:8000/real-estate/leads/${leadId}`, {
        params: {
          user_id: user?.user?.id, // or the actual logged-in user's ID
        },
      });

      // Clear previous error (if any) and refresh leads
      setDeleteError(null);
      fetchLeads();
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        // The backend might return something like { "detail": "Permission denied" }
        setDeleteError(error.response.data.detail || "An error occurred.");
      } else {
        setDeleteError("An unexpected error occurred. Please try again.");
      }
    }
  };

  // -------------------------------
  // VIEW LEAD LOGIC
  // -------------------------------
  const handleViewClick = async (lead: LeadDetails) => {
    const fetchedLead = await fetchLeadDetails(lead.lead_id);
    if (fetchedLead) {
      setSelectedLead(fetchedLead); // Set the fetched lead details in the state
      setShowViewModal(true); // Show the modal
    } else {
      console.error("Failed to fetch lead details.");
    }
  };
  

  // -------------------------------
  // ADD ACTION TO LEAD LOGIC
  // -------------------------------
  const handleAddActionClick = (lead: LeadDetails) => {
    setSelectedLead(lead);
    // Reset action form
    setNewAction({ type: "call", notes: "", status: 1 });
    setShowActionModal(true);
  };

  const [newAction, setNewAction] = useState<{
    type: string;
    notes: string;
    meeting_date?: string;
    status: number; // Add status as a required integer property
  }>({
    type: "call",
    notes: "",
    status: 1, // Default status
  });
  
  

  const handleAddActionSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedLead?.lead_id) return;
  
    try {
      // Determine the endpoint and payload based on the action type
      const endpoint =
        newAction.type === "call"
          ? `http://127.0.0.1:8000/real-estate/leads/${selectedLead.lead_id}/calls`
          : `http://127.0.0.1:8000/real-estate/leads/${selectedLead.lead_id}/meetings`;
  
      const payload =
        newAction.type === "call"
          ? {
              call_status: newAction.status, // Use status for calls
              assigned_to: selectedLead.assigned_to,
              company_domain: selectedLead.company_domain,
            }
          : {
              meeting_status: newAction.status, // Use status for meetings
              assigned_to: selectedLead.assigned_to,
              company_domain: selectedLead.company_domain,
              meeting_date: newAction.meeting_date
    ? new Date(newAction.meeting_date).toISOString() // Convert to ISO 8601
    : new Date().toISOString(),
            };
  
      await axios.post(endpoint, payload);
      setShowActionModal(false);
  
      // Optionally refresh the lead details to reflect the new action
      const updatedLead = await fetchLeadDetails(selectedLead.lead_id);
      if (updatedLead) setSelectedLead(updatedLead);
    } catch (error) {
      console.error("Error adding action:", error);
    }
  };
  
  
  // Toggle row selection
  const handleRowSelect = (id: number) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((row) => row !== id) : [...prev, id]
    );
  };

  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Real Estate Leads</h1>
        <div className="flex gap-4">
          <div className="flex items-center gap-2 border px-4 py-2 rounded-lg">
            <span>Month</span>
            <input
              type="month"
              className="border-none outline-none focus:ring focus:ring-blue-300"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
            <Columns className="w-5 h-5" />
            Columns
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
            <Filter className="w-5 h-5" />
            Filters
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
            <Download className="w-5 h-5" />
            Export
          </button>
          <button
            onClick={handleAddLeadClick}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            <PlusCircle className="w-5 h-5" />
            Add Lead
          </button>
        </div>
      </div>

     {/* Table Section */}
<div className="overflow-x-auto bg-white rounded-lg shadow-md">
  <table className="table-auto w-full text-left border-collapse">
    <thead className="bg-gray-100">
      <tr>
        <th className="p-4 border-b">
          <input
            type="checkbox"
            onChange={(e) =>
              setSelectedRows(
                e.target.checked
                  ? leadsData.map((ld) => ld.lead_id!).filter(Boolean)
                  : []
              )
            }
          />
        </th>
        <th className="p-4 border-b">ID</th>
        <th className="p-4 border-b">Name</th>
        <th className="p-4 border-b">Phone</th>
        <th className="p-4 border-b">Email</th>
        <th className="p-4 border-b">Status</th>
        <th className="p-4 border-b">Stage</th>
        <th className="p-4 border-b">Type</th>
        <th className="p-4 border-b">Assigned To</th>
        <th className="p-4 border-b">Company Domain</th>
        <th className="p-4 border-b">Actions</th>
      </tr>
    </thead>
    <tbody>
      {leadsData.length > 0 ? (
        leadsData.map((lead) => (
          <tr key={lead.lead_id} className="border-t hover:bg-gray-50">
            <td className="p-4">
              <input
                type="checkbox"
                checked={selectedRows.includes(lead.lead_id!)}
                onChange={() => handleRowSelect(lead.lead_id!)}
              />
            </td>
            <td className="p-4">{lead.lead_id}</td>
            <td className="p-4">{lead.name}</td>
            <td className="p-4">{lead.lead_phone}</td>
            <td className="p-4">{lead.email}</td>
            <td className="p-4">{lead.lead_status}</td>
            <td className="p-4">{lead.lead_stage}</td>
            <td className="p-4">{lead.lead_type}</td>
            <td className="p-4">{lead.assigned_to}</td>
            <td className="p-4">{lead.company_domain}</td>
            <td className="p-4 flex gap-2 relative">
              {/* View (Outline) */}
              <div className="relative group">
                <button
                  onClick={() => handleViewClick(lead)}
                  className="px-3 py-2 border border-gray-500 text-gray-500 rounded-md hover:bg-gray-50"
                >
                  <Users className="w-4 h-4" />
                </button>
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 hidden group-hover:block bg-gray-800 text-white text-xs px-2 py-1 rounded">
                  View Lead
                </div>
              </div>

              {/* Edit (Outline) */}
              <div className="relative group">
                <button
                  onClick={() => handleEditClick(lead)}
                  disabled={!userCanEdit}
                  className={`px-3 py-2 border rounded-md hover:bg-yellow-50 ${
                    userCanEdit
                      ? "border-yellow-500 text-yellow-500"
                      : "border-gray-300 text-gray-300 cursor-not-allowed"
                  }`}
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 hidden group-hover:block bg-gray-800 text-white text-xs px-2 py-1 rounded">
                  Edit Lead
                </div>
              </div>

              {/* Delete (Outline) */}
              <div className="relative group">
                <button
                  onClick={() => handleDeleteClick(lead.lead_id!)}
                  disabled={!userCanDelete}
                  className={`px-3 py-2 border rounded-md hover:bg-red-50 ${
                    userCanDelete
                      ? "border-red-500 text-red-500"
                      : "border-gray-300 text-gray-300 cursor-not-allowed"
                  }`}
                >
                  <Trash className="w-4 h-4" />
                </button>
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 hidden group-hover:block bg-gray-800 text-white text-xs px-2 py-1 rounded">
                  Delete Lead
                </div>
                {showErrorModal && (
                <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/30 z-50">
                  <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
                    <h2 className="text-xl font-semibold mb-4 text-red-600">Error</h2>
                    <p className="mb-4 text-gray-700">{deleteError}</p>
                    <div className="flex justify-end">
                      <button
                        onClick={() => setShowErrorModal(false)}
                        className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
                )}
              </div>
              

              {/* Add Action (Outline) */}
              <div className="relative group">
                <button
                  onClick={() => handleAddActionClick(lead)}
                  className="px-3 py-2 border border-green-500 text-green-500 rounded-md hover:bg-green-50"
                >
                  <PhoneCall className="w-4 h-4" />
                </button>
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 hidden group-hover:block bg-gray-800 text-white text-xs px-2 py-1 rounded">
                  Add Action
                </div>
              </div>
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan={9} className="p-4 text-center text-gray-500">
            No leads found.
          </td>
        </tr>
      )}
    </tbody>
  </table>
</div>

      {/* ---------------------------- */}
{/* Add Lead Modal */}
{/* ---------------------------- */}
{showAddModal && (
  <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/30 z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
      <h2 className="text-xl font-semibold mb-4">Add Lead</h2>
      <form onSubmit={handleAddLeadSubmit}>
        {/* Lead Name */}
        <label className="block mb-2 font-semibold">Lead Name</label>
        <input
          type="text"
          value={newLead.name}
          onChange={(e) =>
            setNewLead({ ...newLead, name: e.target.value })
          }
          placeholder="e.g., John Doe"
          className="block w-full p-2 mb-4 border rounded-md"
          required
        />

        {/* Phone */}
        <label className="block mb-2 font-semibold">Phone</label>
        <input
          type="text"
          value={newLead.phone}
          onChange={(e) =>
            setNewLead({ ...newLead, phone: e.target.value })
          }
          placeholder="e.g., +1 123 456 7890"
          className="block w-full p-2 mb-4 border rounded-md"
        />

        {/* Email */}
        <label className="block mb-2 font-semibold">Email</label>
        <input
          type="email"
          value={newLead.email}
          onChange={(e) =>
            setNewLead({ ...newLead, email: e.target.value })
          }
          placeholder="e.g., john.doe@example.com"
          className="block w-full p-2 mb-4 border rounded-md"
        />

      {/* Status */}
      <label className="block mb-2 font-semibold">Status</label>
      <select
        value={newLead.status}
        onChange={(e) =>
          setNewLead({ ...newLead, status: e.target.value })
        }
        className="block w-full p-2 mb-4 border rounded-md"
        required
      >
        <option value="" disabled hidden>
          Select Status
        </option>
        <option value="1">Hot</option>
        <option value="2">Warm</option>
        <option value="3">Cold</option>
        <option value="4">New</option>
      </select>

      {/* Status */}
      <label className="block mb-2 font-semibold">Type</label>
      <select
        value={newLead.type}
        onChange={(e) =>
          setNewLead({ ...newLead, type: e.target.value })
        }
        className="block w-full p-2 mb-4 border rounded-md"
        required
      >
        <option value="" disabled hidden>
          Select Type
        </option>
        <option value="1">Campaign</option>
        <option value="2">Cold call</option>
        <option value="3">Personal</option>
      </select>


        {/* Stage */}
      <label className="block mb-2 font-semibold">Stage</label>
      <select
        value={newLead.stage}
        onChange={(e) =>
          setNewLead({ ...newLead, stage: e.target.value })
        }
        className="block w-full p-2 mb-4 border rounded-md"
        required
      >
        <option value="" disabled hidden>
          Select stage
        </option>
        <option value="1">Assigned</option>
        <option value="2">Not Assigned</option>
        <option value="3">Action Taken</option>
      </select>

      <label className="block mb-2 font-semibold">Company Domain</label>
      <select
        value={newLead.company_domain}
        onChange={(e) =>
          setNewLead({ ...newLead, company_domain: e.target.value })
        }
        className="block w-full p-2 mb-4 border rounded-md"
        required
      >
        <option value="" disabled hidden>
          Select Company Domain
        </option>
        {domains.map((domain, index) => (
          <option key={index} value={domain}>
            {domain}
          </option>
        ))}
      </select>


        {/* Assigned To */}
      <label className="block mb-2 font-semibold">Assigned To</label>
      <select
        value={newLead.assigned_to}
        onChange={(e) =>
          setNewLead({ ...newLead, assigned_to: e.target.value })
        }
        className="block w-full p-2 mb-4 border rounded-md"
        required
      >
        <option value="" disabled hidden>
          Select User
        </option>
        {users.map((user) => (
          <option key={user.id} value={user.id}>
            {`${user.first_name} ${user.last_name}`} {/* Display user name, send user ID */}
          </option>
        ))}
      </select>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => setShowAddModal(false)}
            className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Add
          </button>
        </div>
      </form>
    </div>
  </div>
)}
{/* ---------------------------- */}
{/* Edit Lead Modal */}
{/* ---------------------------- */}
{showEditModal && selectedLead && (
  <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/30 z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
      <h2 className="text-xl font-semibold mb-4">Edit Lead</h2>
      {/* Display Error Message */}
      {editError && (
  <div className="mb-4 p-2 bg-red-100 text-red-600 rounded-md">
    {typeof editError === "string"
      ? editError
      : Array.isArray(editError)
      ? editError.map((err: { msg: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; }, index: React.Key | null | undefined) => <p key={index}>{err.msg}</p>)
      : "An unexpected error occurred."}
  </div>
)}

      <form onSubmit={handleEditLeadSubmit}>
        {/* Lead Name */}
        <label className="block mb-2 font-semibold">Lead Name</label>
        <input
          type="text"
          value={selectedLead.name}
          onChange={(e) =>
            setSelectedLead({ ...selectedLead, name: e.target.value })
          }
          placeholder="e.g., John Doe"
          className="block w-full p-2 mb-4 border rounded-md"
          required
        />

        {/* Phone */}
        <label className="block mb-2 font-semibold">Phone</label>
        <input
          type="text"
          value={selectedLead.lead_phone}
          onChange={(e) =>
            setSelectedLead({ ...selectedLead, lead_phone: e.target.value })
          }
          placeholder="e.g., +1 123 456 7890"
          className="block w-full p-2 mb-4 border rounded-md"
        />

        {/* Email */}
        <label className="block mb-2 font-semibold">Email</label>
        <input
          type="email"
          value={selectedLead.email}
          onChange={(e) =>
            setSelectedLead({ ...selectedLead, email: e.target.value })
          }
          placeholder="e.g., john.doe@example.com"
          className="block w-full p-2 mb-4 border rounded-md"
        />

        {/* Status */}
        <label className="block mb-2 font-semibold">Status</label>
        <select
          value={selectedLead.lead_status}
          onChange={(e) =>
            setSelectedLead({ ...selectedLead, lead_status: Number(e.target.value) })
          }
          className="block w-full p-2 mb-4 border rounded-md"
          required
        >
          <option value="" disabled hidden>
            Select Status
          </option>
          <option value="1">Hot</option>
          <option value="2">Warm</option>
          <option value="3">Cold</option>
          <option value="4">New</option>
        </select>

        {/* Type */}
        <label className="block mb-2 font-semibold">Type</label>
        <select
          value={selectedLead.lead_type}
          onChange={(e) =>
            setSelectedLead({ ...selectedLead, lead_type: Number(e.target.value) })
          }
          className="block w-full p-2 mb-4 border rounded-md"
          required
        >
          <option value="" disabled hidden>
            Select Type
          </option>
          <option value="1">Campaign</option>
          <option value="2">Cold call</option>
          <option value="3">Personal</option>
        </select>

        {/* Stage */}
        <label className="block mb-2 font-semibold">Stage</label>
        <select
          value={selectedLead.lead_stage}
          onChange={(e) =>
            setSelectedLead({ ...selectedLead, lead_stage: Number(e.target.value) })
          }
          className="block w-full p-2 mb-4 border rounded-md"
          required
        >
          <option value="" disabled hidden>
            Select Stage
          </option>
          <option value="1">Assigned</option>
          <option value="2">Not Assigned</option>
          <option value="3">Action Taken</option>
        </select>

        {/* Company Domain */}
        <label className="block mb-2 font-semibold">Company Domain</label>
        <select
          value={selectedLead.company_domain}
          onChange={(e) =>
            setSelectedLead({ ...selectedLead, company_domain: e.target.value })
          }
          className="block w-full p-2 mb-4 border rounded-md"
          required
        >
          <option value="" disabled hidden>
            Select Company Domain
          </option>
          {domains.map((domain, index) => (
            <option key={index} value={domain}>
              {domain}
            </option>
          ))}
        </select>

        {/* Assigned To */}
        <label className="block mb-2 font-semibold">Assigned To</label>
        <select
          value={selectedLead.assigned_to}
          onChange={(e) =>
            setSelectedLead({ ...selectedLead, assigned_to: e.target.value })
          }
          className="block w-full p-2 mb-4 border rounded-md"
          required
        >
          <option value="" disabled hidden>
            Select User
          </option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {`${user.first_name} ${user.last_name}`}
            </option>
          ))}
        </select>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => setShowEditModal(false)}
            className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  </div>
)}



      {/* ---------------------------- */}
      {/* View Lead Modal */}
      {/* ---------------------------- */}
      
      {showViewModal && selectedLead && (
  <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/30 z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-1/3 max-h-[80vh] overflow-auto">
      <h2 className="text-xl font-semibold mb-4">{`Lead Details: ${selectedLead.name}`}</h2>
      <p>
        <strong>Phone:</strong> {selectedLead.lead_phone}
      </p>
      <p>
        <strong>Email:</strong> {selectedLead.email}
      </p>
      <p>
        <strong>Status:</strong> {selectedLead.lead_status}
      </p>
      <p>
        <strong>Assigned To:</strong> {selectedLead.assigned_to}
      </p>
      <p>
        <strong>Company Domain:</strong> {selectedLead.company_domain}
      </p>

      <hr className="my-4" />

      {/* Calls Section */}
      <h3 className="text-lg font-semibold">Calls</h3>
      {selectedLead.calls && selectedLead.calls.length > 0 ? (
        <ul className="list-disc list-inside">
          {selectedLead.calls.map((call) => (
            <li key={call.call_id}>
              <strong>Call Date:</strong> {new Date(call.call_date).toISOString()} <br />
              <strong>Status:</strong> {call.call_status} <br />
              <strong>Assigned To:</strong> {call.assigned_to}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No calls recorded.</p>
      )}

      {/* Meetings Section */}
      <h3 className="text-lg font-semibold mt-4">Meetings</h3>
      {selectedLead.meetings && selectedLead.meetings.length > 0 ? (
        <ul className="list-disc list-inside">
          {selectedLead.meetings.map((meeting) => (
            <li key={meeting.meeting_id}>
              <strong>Meeting Date:</strong> {new Date(meeting.meeting_date).toISOString()} <br />
              <strong>Status:</strong> {meeting.meeting_status} <br />
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No meetings recorded.</p>
      )}

      <div className="flex justify-end mt-4">
        <button
          className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
          onClick={() => setShowViewModal(false)}
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}


      {/* ---------------------------- */}
      {/* Add Action Modal */}
      {/* ---------------------------- */}
      {showActionModal && selectedLead && (
  <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/30 z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
      <h2 className="text-xl font-semibold mb-4">
        {`Add ${newAction.type === "call" ? "Call" : "Meeting"} to ${selectedLead.name}`}
      </h2>
      <form onSubmit={handleAddActionSubmit}>
        {/* Action Type Selector */}
        <select
          value={newAction.type}
          onChange={(e) =>
            setNewAction({ ...newAction, type: e.target.value })
          }
          className="block w-full p-2 mb-4 border rounded-md"
        >
          <option value="call">Call</option>
          <option value="meeting">Meeting</option>
        </select>

        {/* Dynamic Input for Meeting Date */}
        {newAction.type === "meeting" && (
          <input
            type="datetime-local"
            onChange={(e) =>
              setNewAction({ ...newAction, meeting_date: e.target.value })
            }
            className="block w-full p-2 mb-4 border rounded-md"
          />
        )}
         {/* Status Selector */}
  <select
    value={newAction.status}
    onChange={(e) =>
      setNewAction({ ...newAction, status: parseInt(e.target.value, 10) })
    }
    className="block w-full p-2 mb-4 border rounded-md"
  >
    <option value={1}>Pending</option>
    <option value={2}>Completed</option>
    <option value={3}>Cancelled</option>
  </select>


        {/* Notes */}
        <textarea
          placeholder="Notes..."
          value={newAction.notes}
          onChange={(e) => setNewAction({ ...newAction, notes: e.target.value })}
          className="block w-full p-2 mb-4 border rounded-md"
        />

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => setShowActionModal(false)}
            className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Save {newAction.type === "call" ? "Call" : "Meeting"}
          </button>
        </div>
      </form>
    </div>
  </div>
)}

    </div>
  );
}

export default RealEstateLeads;
