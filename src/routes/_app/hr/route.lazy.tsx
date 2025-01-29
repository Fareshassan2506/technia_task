import React, { useEffect, useState } from "react";
import { createLazyFileRoute } from "@tanstack/react-router";
import {
  PlusCircle,
  Trash,
  Download,
  Filter,
  Columns,
  Pencil,
  DollarSign,
} from "lucide-react";
import axios from "axios";

export const Route = createLazyFileRoute("/_app/hr")({
  component: RouteComponent,
});

interface EmployeeDetails {
  id?: number;
  company_domain?: string;
  name: string;
  personalPhone?: string;
  businessPhone?: string;
  businessEmail?: string;
  personalEmail?: string;
  gender?: string;
  isCompanyAdmin?: boolean;
  dateAdded?: string;
}

function RouteComponent() {
  const [employeeData, setEmployeeData] = useState<EmployeeDetails[]>([]);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [isEditingSalary, setIsEditingSalary] = useState(false);
  const [domains, setDomains] = useState([]);



  // Edit Employee Modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeDetails | null>(null);

  // Add Employee Modal
  const [showAddModal, setShowAddModal] = useState(false);
  // State to hold new-employee form data
  const [newEmployee, setNewEmployee] = useState({
    company_domain: "",
    contact_name: "",
    business_phone: "",
    personal_phone: "",
    business_email: "",
    personal_email: "",
    gender: "",
    is_company_admin: false,
  });

  // Salary Modal
  const [showSalaryModal, setShowSalaryModal] = useState(false);
  const [salaryData, setSalaryData] = useState({
    gross_salary: "",
    insurance: "",
    taxes: "",
    net_salary: "",
    due_year: "",
    due_month: "",
    due_date: "",
  });

  useEffect(() => {
    fetchEmployees();
    fetchDomains();
  }, []);

  const fetchDomains = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/real-estate/domains");
      setDomains(response.data.domains || []);
    } catch (error) {
      console.error("Error fetching domains:", error);
    }
  };
  
  // Call this function when the component mounts
  useEffect(() => {
    fetchDomains();
  }, []);
  

  const fetchEmployees = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/hr/employees", {
      });
      const formattedData = response.data.employees.map((employee: any) => ({
        id: employee.employee_id,
        name: employee.contact_name,
        company_domain: employee.company_domain,
        personalPhone: employee.personal_phone,
        businessPhone: employee.business_phone,
        businessEmail: employee.business_email,
        personalEmail: employee.personal_email,
        gender: employee.gender,
        isCompanyAdmin: employee.is_company_admin,
        dateAdded: employee.date_added.split("T")[0],
      }));
      setEmployeeData(formattedData);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const fetchSalaries = async (employeeId: number) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/hr/employees/${employeeId}/salaries`);
      return response.data.salary; // This will return an array
    } catch (error) {
      console.error("Error fetching salaries:", error);
      return [];
    }
  };
  

  // Toggle row selection
  const handleRowSelect = (id: number) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((row) => row !== id) : [...prev, id]
    );
  };

  // -------------------------------
  // ADD EMPLOYEE LOGIC
  // -------------------------------
  const handleAddEmployeeClick = () => {
    setShowAddModal(true);
    // Reset the form in case leftover data is still present
    setNewEmployee({
      company_domain: "",
      contact_name: "",
      business_phone: "",
      personal_phone: "",
      business_email: "",
      personal_email: "",
      gender: "", 
      is_company_admin: false,
    });
  };

  const handleAddSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await axios.post("http://127.0.0.1:8000/hr/employees", null, {
        params: {
          company_domain: newEmployee.company_domain,
          contact_name: newEmployee.contact_name,
          business_phone: newEmployee.business_phone,
          personal_phone: newEmployee.personal_phone,
          business_email: newEmployee.business_email,
          personal_email: newEmployee.personal_email,
          gender: newEmployee.gender,
          is_company_admin: newEmployee.is_company_admin,
        },
      });
      console.log("New employee added successfully");
      setShowAddModal(false);
      fetchEmployees();
    } catch (error) {
      console.error("Error adding new employee:", error);
    }
    };
  // Fetch Salaries and Determine Behavior
  const handleSalaryClick = async (employee: EmployeeDetails) => {
    setSelectedEmployee(employee);

    try {
      const salaries = await fetchSalaries(employee.id!); // Fetch salary data from the backend

      if (salaries.length > 0) {
        // If salary exists, set editing mode and pre-populate the data
        const salary = salaries[0];
        setSalaryData({
          gross_salary: salary.gross_salary,
          insurance: salary.insurance,
          taxes: salary.taxes,
          net_salary: salary.net_salary,
          due_year: salary.due_year,
          due_month: salary.due_month,
          due_date: salary.due_date,
        });
        setIsEditingSalary(true);
      } else {
        // If no salary, reset the form for adding a new salary
        setSalaryData({
          gross_salary: "",
          insurance: "",
          taxes: "",
          net_salary: "",
          due_year: "",
          due_month: "",
          due_date: "",
        });
        setIsEditingSalary(false);
      }

      setShowSalaryModal(true); // Open the modal
    } catch (error) {
      console.error("Error handling salary click:", error);
    }
  };
const handleAddSalarySubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  if (!selectedEmployee) {
    console.error("No employee selected");
    return;
  }

  const queryParams = new URLSearchParams({
    company_domain: selectedEmployee.company_domain || "",
    due_year: salaryData.due_year || "",
    due_month: salaryData.due_month || "",
    gross_salary: salaryData.gross_salary || "",
    insurance: salaryData.insurance || "",
    taxes: salaryData.taxes || "",
    net_salary: salaryData.net_salary || "",
    due_date: salaryData.due_date || "",
  });
  

  try {
   await axios.post(
    `http://127.0.0.1:8000/hr/employees/${selectedEmployee.id}/salaries?${queryParams}`
   );
    console.log("Salary added successfully");
    setShowSalaryModal(false);
    fetchEmployees(); // Refresh employee list
  } catch (error) {
    console.error("Error adding salary:", error);
  }
};


// Example Edit Salary Handler
const handleEditSalarySubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  if (!selectedEmployee) {
    console.error("No employee selected");
    return;
  }

  const payload = {
    company_domain: selectedEmployee.company_domain || "", // Ensure company_domain is included
    gross_salary: parseFloat(salaryData.gross_salary) || null,
    insurance: parseFloat(salaryData.insurance) || null,
    taxes: parseFloat(salaryData.taxes) || null,
    net_salary: parseFloat(salaryData.net_salary) || null,
    due_year: salaryData.due_year || null,
    due_month: salaryData.due_month || null,
  };

  try {
    await axios.put(
      `http://127.0.0.1:8000/hr/employees/${selectedEmployee.id}/salaries`,
      payload
    );
    console.log("Salary updated successfully");
    setShowSalaryModal(false);
    fetchEmployees(); // Refresh employee list
  } catch (error) {
    console.error("Error updating salary:", error);
  }
};


  // -------------------------------
  // EDIT EMPLOYEE LOGIC
  // -------------------------------
  const handleEditClick = (employee: EmployeeDetails) => {
    // Ensure the employee object is properly populated before setting it
    setSelectedEmployee({
      ...employee,
      company_domain: employee.company_domain || "", // Default value if undefined
      businessPhone: employee.businessPhone || "",
      personalPhone: employee.personalPhone || "",
      businessEmail: employee.businessEmail || "",
      personalEmail: employee.personalEmail || "",
      gender: employee.gender || "",
      isCompanyAdmin: employee.isCompanyAdmin || false,
    });
    setShowEditModal(true);
  };
  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default form behavior
  
    if (!selectedEmployee) {
      console.error("No employee selected for editing");
      return; // Exit if no employee is selected
    }
  
    try {
      // Prepare the payload for the request body
      const payload = {
        contact_name: selectedEmployee.name || "",
        business_phone: selectedEmployee.businessPhone || "",
        personal_phone: selectedEmployee.personalPhone || "",
        business_email: selectedEmployee.businessEmail || "",
        personal_email: selectedEmployee.personalEmail || "",
        gender: selectedEmployee.gender || "",
        is_company_admin: selectedEmployee.isCompanyAdmin || false,
      };
      console.log("Payload:", payload);
  
      // Make the PUT request with company_domain as a query parameter
      const response = await axios.put(
        `http://127.0.0.1:8000/hr/employees/${selectedEmployee.id}`,
        payload, // Payload goes in the body
        {
          params: {
            company_domain: selectedEmployee.company_domain, // Query parameter
          },
        }
      );
  
      // Handle success response
      console.log("Employee updated successfully:", response.data);
      setShowEditModal(false); // Close the modal
      fetchEmployees(); // Refresh employee list
    } catch (error: any) {
      // Improved error handling
      console.error("Error updating employee:", error);
  
      if (error.response) {
        // Server responded with an error
        console.error("Response error:", error.response.data);
        alert(`Failed to update employee: ${error.response.data.detail || "Unknown error"}`);
      } else if (error.request) {
        // No response received
        console.error("No response received:", error.request);
        alert("Failed to update employee: No response from the server.");
      } else {
        // Other errors
        console.error("Request error:", error.message);
        alert(`Failed to update employee: ${error.message}`);
      }
    }
  };
  

 // State for delete confirmation modal
const [showDeleteModal, setShowDeleteModal] = useState(false);
const [employeeToDelete, setEmployeeToDelete] = useState<number | null>(null);

// Updated handleDeleteClick to show the modal
const handleDeleteClick = (employeeId: number) => {
  setEmployeeToDelete(employeeId);
  setShowDeleteModal(true); // Open the modal
};

// Confirm deletion and proceed with API call
const confirmDelete = async () => {
  if (employeeToDelete !== null) {
    try {
      await axios.delete(`http://127.0.0.1:8000/hr/employees/${employeeToDelete}`);
      console.log(`Employee ${employeeToDelete} deleted successfully`);
      fetchEmployees(); // Refresh the employee list
      setShowDeleteModal(false); // Close the modal
      setEmployeeToDelete(null); // Reset the state
    } catch (error) {
      console.error("Error deleting employee:", error);
      setShowDeleteModal(false); // Close the modal
    }
  }
};

// Cancel deletion
const cancelDelete = () => {
  setShowDeleteModal(false);
  setEmployeeToDelete(null);
};


  // -------------------------------
  // SALARY MODAL LOGIC
  // -------------------------------
  const handleOpenSalaryModal = (employee: EmployeeDetails) => {
    setSelectedEmployee(employee);
    // Reset or load existing salary data if needed
    setSalaryData({
      gross_salary: "",
      insurance: "",
      taxes: "",
      net_salary: "",
      due_year: "",
      due_month: "",
      due_date: "",
    });
    setShowSalaryModal(true);
  };

  const handleSalarySubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedEmployee?.id) return;

    try {
      await axios.post(
        `http://127.0.0.1:8000/hr/salaries/${selectedEmployee.id}`,
        null,
        {
          params: {
            company_domain: "taskdomain",
            gross_salary: salaryData.gross_salary,
            insurance: salaryData.insurance,
            taxes: salaryData.taxes,
            net_salary: salaryData.net_salary,
            due_year: salaryData.due_year,
            due_month: salaryData.due_month,
            due_date: salaryData.due_date,
          },
        }
      );
      console.log("Salary submitted successfully");
      setShowSalaryModal(false);
    } catch (error) {
      console.error("Error submitting salary:", error);
    }
  };


  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">HR Management</h1>
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
            onClick={handleAddEmployeeClick}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            <PlusCircle className="w-5 h-5" />
            Add Employee
          </button>
        </div>
      </div>


{/* Delete Confirmation Modal */}
{showDeleteModal && (
  <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/30 z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
      <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
      <p className="mb-4">Are you sure you want to delete this employee?</p>
      <div className="flex justify-end gap-4">
        <button
          onClick={cancelDelete}
          className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
        >
          Cancel
        </button>
        <button
          onClick={confirmDelete}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
)}
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
                  ? employeeData.map((emp) => emp.id!).filter(Boolean)
                  : []
              )
            }
          />
        </th>
        <th className="p-4 border-b">ID</th>
        <th className="p-4 border-b">Name</th>
        <th className="p-4 border-b">Company Domain</th>
        <th className="p-4 border-b">Personal Phone</th>
        <th className="p-4 border-b">Business Phone</th>
        <th className="p-4 border-b">Business Email</th>
        <th className="p-4 border-b">Personal Email</th>
        <th className="p-4 border-b">Gender</th>
        <th className="p-4 border-b">Admin</th>
        <th className="p-4 border-b">Date Added</th>
        <th className="p-4 border-b">Actions</th>
      </tr>
    </thead>
    <tbody>
      {employeeData.length > 0 ? (
        employeeData.map((employee) => (
          <tr key={employee.id} className="border-t hover:bg-gray-50">
            <td className="p-4">
              <input
                type="checkbox"
                checked={selectedRows.includes(employee.id!)}
                onChange={() => handleRowSelect(employee.id!)}
              />
            </td>
            <td className="p-4">{employee.id}</td>
            <td className="p-4">{employee.name}</td>
            <td className="p-4">{employee.company_domain}</td>
            <td className="p-4">{employee.personalPhone}</td>
            <td className="p-4">{employee.businessPhone}</td>
            <td className="p-4">{employee.businessEmail}</td>
            <td className="p-4">{employee.personalEmail}</td>
            <td className="p-4">{employee.gender}</td>
            <td className="p-4">{employee.isCompanyAdmin ? "Yes" : "No"}</td>
            <td className="p-4">{employee.dateAdded}</td>
            <td className="p-4 flex gap-2 relative">
              {/* Edit (Outline) */}
              <div className="relative group">
                <button
                  onClick={() => handleEditClick(employee)}
                  className="px-3 py-2 border border-yellow-500 text-yellow-500 rounded-md hover:bg-yellow-50"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 hidden group-hover:block bg-gray-800 text-white text-xs px-2 py-1 rounded">
                  Edit Employee
                </div>
              </div>

              {/* Delete (Outline) */}
              <div className="relative group">
                <button
                  onClick={() => handleDeleteClick(employee.id!)}
                  className="px-3 py-2 border border-red-500 text-red-500 rounded-md hover:bg-red-50"
                >
                  <Trash className="w-4 h-4" />
                </button>
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 hidden group-hover:block bg-gray-800 text-white text-xs px-2 py-1 rounded">
                  Delete Employee
                </div>
              </div>

              {/* Salary (Outline) */}
              <div className="relative group">
                <button
                  onClick={() => handleSalaryClick(employee)}
                  className="px-3 py-2 border border-green-500 text-green-500 rounded-md hover:bg-green-50"
                >
                  <DollarSign className="w-4 h-4" />
                </button>
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 hidden group-hover:block bg-gray-800 text-white text-xs px-2 py-1 rounded">
                  Add/Edit Salary
                </div>
              </div>
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan={11} className="p-4 text-center text-gray-500">
            No records found.
          </td>
        </tr>
      )}
    </tbody>
  </table>
</div>
    {/* ---------------------------- */}
{/* Add Employee Modal */}
{/* ---------------------------- */}
{showAddModal && (
  <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/30 z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
      <h2 className="text-xl font-semibold mb-4">Add Employee</h2>
      <form onSubmit={handleAddSubmit}>
        <label className="block mb-2 font-semibold">
          Name<span className="text-red-500 ml-1">*</span>
        </label>
        <input
          type="text"
          value={newEmployee.contact_name}
          onChange={(e) =>
            setNewEmployee({ ...newEmployee, contact_name: e.target.value })
          }
          placeholder="e.g., Fares Hassan"
          className="block w-full p-2 mb-4 border rounded-md"
          required
        />

        <label className="block mb-2 font-semibold">
          Company Domain<span className="text-red-500 ml-1">*</span>
        </label>
        <select
          value={newEmployee.company_domain}
          onChange={(e) =>
            setNewEmployee({ ...newEmployee, company_domain: e.target.value })
          }
          className="block w-full p-2 mb-4 border rounded-md"
          required
        >
          <option value="" disabled>
            Select Company Domain
          </option>
          {domains.map((domain, index) => (
            <option key={index} value={domain}>
              {domain}
            </option>
          ))}
        </select>

        <label className="block mb-2 font-semibold">
          Business Phone
        </label>
        <input
          type="text"
          value={newEmployee.business_phone}
          onChange={(e) =>
            setNewEmployee({ ...newEmployee, business_phone: e.target.value })
          }
          placeholder="e.g., +1 123 456 7890"
          className="block w-full p-2 mb-4 border rounded-md"
        />

        <label className="block mb-2 font-semibold">
          Personal Phone
        </label>
        <input
          type="text"
          value={newEmployee.personal_phone}
          onChange={(e) =>
            setNewEmployee({ ...newEmployee, personal_phone: e.target.value })
          }
          placeholder="e.g., +1 987 654 3210"
          className="block w-full p-2 mb-4 border rounded-md"
        />

        <label className="block mb-2 font-semibold">
          Business Email
        </label>
        <input
          type="email"
          value={newEmployee.business_email}
          onChange={(e) =>
            setNewEmployee({ ...newEmployee, business_email: e.target.value })
          }
          placeholder="e.g., fares.doe@company.com"
          className="block w-full p-2 mb-4 border rounded-md"
        />

        <label className="block mb-2 font-semibold">
          Personal Email
        </label>
        <input
          type="email"
          value={newEmployee.personal_email}
          onChange={(e) =>
            setNewEmployee({ ...newEmployee, personal_email: e.target.value })
          }
          placeholder="e.g., fares.doe@gmail.com"
          className="block w-full p-2 mb-4 border rounded-md"
        />

        <label className="block mb-2 font-semibold">
          Gender
        </label>
        <select
          value={newEmployee.gender}
          onChange={(e) =>
            setNewEmployee({ ...newEmployee, gender: e.target.value })
          }
          className="block w-full p-2 mb-4 border rounded-md"
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>

        <label className="flex items-center mb-4">
          <input
            type="checkbox"
            checked={newEmployee.is_company_admin}
            onChange={(e) =>
              setNewEmployee({
                ...newEmployee,
                is_company_admin: e.target.checked,
              })
            }
            className="mr-2"
          />
          Is Company Admin
        </label>

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
{/* Edit Employee Modal */}
{/* ---------------------------- */}
{showEditModal && selectedEmployee && (
  <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/30 z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
      <h2 className="text-xl font-semibold mb-4">Edit Employee</h2>
      <form onSubmit={handleEditSubmit}>
        {/* Name */}
        <label className="block mb-2 font-semibold">Name</label>
        <input
          type="text"
          value={selectedEmployee.name}
          onChange={(e) =>
            setSelectedEmployee({ ...selectedEmployee, name: e.target.value })
          }
          placeholder="e.g., John Doe"
          className="block w-full p-2 mb-4 border rounded-md"
        />

        {/* Company Domain */}
        <label className="block mb-2 font-semibold">Company Domain</label>
        <select
          value={newEmployee.company_domain}
          onChange={(e) =>
            setNewEmployee({ ...newEmployee, company_domain: e.target.value })
          }
          className="block w-full p-2 mb-4 border rounded-md"
          required
        >
          <option value="" disabled>
            Select Company Domain
          </option>
          {domains.map((domain, index) => (
            <option key={index} value={domain}>
              {domain}
            </option>
          ))}
        </select>

        {/* Business Phone */}
        <label className="block mb-2 font-semibold">Business Phone</label>
        <input
          type="text"
          value={selectedEmployee.businessPhone}
          onChange={(e) =>
            setSelectedEmployee({
              ...selectedEmployee,
              businessPhone: e.target.value,
            })
          }
          placeholder="e.g., +1 123 456 7890"
          className="block w-full p-2 mb-4 border rounded-md"
        />

        {/* Personal Phone */}
        <label className="block mb-2 font-semibold">Personal Phone</label>
        <input
          type="text"
          value={selectedEmployee.personalPhone}
          onChange={(e) =>
            setSelectedEmployee({
              ...selectedEmployee,
              personalPhone: e.target.value,
            })
          }
          placeholder="e.g., +1 987 654 3210"
          className="block w-full p-2 mb-4 border rounded-md"
        />

        {/* Business Email */}
        <label className="block mb-2 font-semibold">Business Email</label>
        <input
          type="email"
          value={selectedEmployee.businessEmail}
          onChange={(e) =>
            setSelectedEmployee({
              ...selectedEmployee,
              businessEmail: e.target.value,
            })
          }
          placeholder="e.g., john.doe@company.com"
          className="block w-full p-2 mb-4 border rounded-md"
        />

        {/* Personal Email */}
        <label className="block mb-2 font-semibold">Personal Email</label>
        <input
          type="email"
          value={selectedEmployee.personalEmail}
          onChange={(e) =>
            setSelectedEmployee({
              ...selectedEmployee,
              personalEmail: e.target.value,
            })
          }
          placeholder="e.g., john.doe@gmail.com"
          className="block w-full p-2 mb-4 border rounded-md"
        />

        {/* Gender */}
        <label className="block mb-2 font-semibold">Gender</label>
        <select
          value={selectedEmployee.gender}
          onChange={(e) =>
            setSelectedEmployee({ ...selectedEmployee, gender: e.target.value })
          }
          className="block w-full p-2 mb-4 border rounded-md"
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>

        {/* Is Company Admin */}
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={selectedEmployee.isCompanyAdmin}
            onChange={(e) =>
              setSelectedEmployee({
                ...selectedEmployee,
                isCompanyAdmin: e.target.checked,
              })
            }
            className="mr-2"
          />
          Is Company Admin
        </label>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 mt-4">
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
{/* ---------------------------- */}
{showSalaryModal && selectedEmployee && (
  <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/30 z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
      <h2 className="text-xl font-semibold mb-4">
        {isEditingSalary
          ? `Edit Salary for ${selectedEmployee.name}`
          : `Add Salary for ${selectedEmployee.name}`}
      </h2>
      <form
        onSubmit={isEditingSalary ? handleEditSalarySubmit : handleAddSalarySubmit}
      >
        {/* Gross Salary */}
        <label className="block mb-2 font-semibold">
          Gross Salary
        </label>
        <input
          type="number"
          placeholder="e.g., 5000"
          value={salaryData.gross_salary}
          onChange={(e) =>
            setSalaryData({ ...salaryData, gross_salary: e.target.value })
          }
          className="block w-full p-2 mb-4 border rounded-md"
        />

        {/* Insurance */}
        <label className="block mb-2 font-semibold">
          Insurance
        </label>
        <input
          type="number"
          placeholder="e.g., 200"
          value={salaryData.insurance}
          onChange={(e) =>
            setSalaryData({ ...salaryData, insurance: e.target.value })
          }
          className="block w-full p-2 mb-4 border rounded-md"
        />

        {/* Taxes */}
        <label className="block mb-2 font-semibold">
          Taxes
        </label>
        <input
          type="number"
          placeholder="e.g., 300"
          value={salaryData.taxes}
          onChange={(e) =>
            setSalaryData({ ...salaryData, taxes: e.target.value })
          }
          className="block w-full p-2 mb-4 border rounded-md"
        />

        {/* Net Salary */}
        <label className="block mb-2 font-semibold">
          Net Salary
        </label>
        <input
          type="number"
          placeholder="e.g., 4500"
          value={salaryData.net_salary}
          onChange={(e) =>
            setSalaryData({ ...salaryData, net_salary: e.target.value })
          }
          className="block w-full p-2 mb-4 border rounded-md"
        />

        {/* Due Year */}
        <label className="block mb-2 font-semibold">
          Due Year<span className="text-red-500 ml-1">*</span>
        </label>
        <input
          type="number"
          placeholder="e.g., 2025"
          value={salaryData.due_year}
          onChange={(e) =>
            setSalaryData({ ...salaryData, due_year: e.target.value })
          }
          className="block w-full p-2 mb-4 border rounded-md"
        />

        {/* Due Month */}
        <label className="block mb-2 font-semibold">
          Due Month<span className="text-red-500 ml-1">*</span>
        </label>
        <input
          type="number"
          placeholder="e.g., 1 for January"
          value={salaryData.due_month}
          onChange={(e) =>
            setSalaryData({ ...salaryData, due_month: e.target.value })
          }
          className="block w-full p-2 mb-4 border rounded-md"
        />

        {/* Due Date */}
        <label className="block mb-2 font-semibold">
          Due Date
        </label>
        <input
          type="text"
          placeholder="e.g., 2025-01-29"
          value={salaryData.due_date}
          onChange={(e) =>
            setSalaryData({ ...salaryData, due_date: e.target.value })
          }
          className="block w-full p-2 mb-4 border rounded-md"
        />

        <div className="flex justify-end gap-4 mt-4">
          <button
            type="button"
            onClick={() => setShowSalaryModal(false)}
            className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            {isEditingSalary ? "Save Changes" : "Add Salary"}
          </button>
        </div>
      </form>
    </div>
  </div>
)}



    </div>
  );
}

