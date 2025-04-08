"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  FileText,
  Clock,
  Download,
  Printer,
  Share2,
  Send,
  Edit,
  UserPlus,
  MoreHorizontal,
  Globe,
  User,
  MessageCircle,
  Video,
  Camera,
  ArrowDownUp,
  Copy,
  Building2,
  Users,
  Award,
  Briefcase,
  DollarSign,
  Activity,
  AlertCircle,
  ChevronLeft,
  X,
  Upload,
  Trash2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import type { Persona } from "@/types/persona"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import axios from "axios"
export default function EmployeeProfile({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("basic-info")
  const [showImageModal, setShowImageModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [documentSortBy, setDocumentSortBy] = useState("name")
  const [timelineSortBy, setTimelineSortBy] = useState("date")
  const [persona, setPersona] = useState<Persona | null>(null)
  const [editedPersona, setEditedPersona] = useState<Persona | null>(null)
  const [loading, setLoading] = useState(true)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [showBasicInfoModal, setShowBasicInfoModal] = useState(false)
  const [showAboutModal, setShowAboutModal] = useState(false)

  useEffect(() => {
    const fetchPersona = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:5000/api/profile/personas/${resolvedParams.id}`
        );
        console.log("Fetched Persona Data:", response.data); // Debugging
        setPersona(response.data); // Set the fetched data to the state
      } catch (error) {
        console.error("Error fetching persona:", error);
        if (error.response?.status === 404) {
          alert("Persona not found. Please check the ID.");
        }
        router.push("/");
      } finally {
        setLoading(false);
      }
    };

    fetchPersona();
  }, [resolvedParams.id]);

  const handleEdit = () => {
    setShowEditModal(true)
  }

  const handleSave = () => {
    if (editedPersona) {
      setPersona(editedPersona)
      setShowEditModal(false)
    }
  }

  const handleCancel = () => {
    setEditedPersona(persona)
    setShowEditModal(false)
  }

  const handleInputChange = (field: keyof Persona, value: string) => {
    if (editedPersona) {
      setEditedPersona({ ...editedPersona, [field]: value })
    }
  }

  const handleSaveEdit = () => {
    if (editedPersona) {
      setPersona(editedPersona)
      setIsEditModalOpen(false)
    }
  }

  const handleBasicInfoEdit = () => {
    setShowBasicInfoModal(true)
  }

  const handleAboutEdit = () => {
    setShowAboutModal(true)
  }

  const handleSaveBasicInfo = () => {
    if (editedPersona) {
      setPersona(editedPersona)
      setShowBasicInfoModal(false)
    }
  }

  const handleSaveAbout = () => {
    if (editedPersona) {
      setPersona(editedPersona)
      setShowAboutModal(false)
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (!persona) {
    return <div>Persona not found</div>
  }

  return (
    <div className="container mx-auto p-4 max-w-7xl" suppressHydrationWarning>
      {/* Header */}
      <div className="flex flex-col items-center mb-8">
        <div className="flex items-center space-x-4 mb-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="text-center">
            <div className="relative mb-4">
              {persona.profile_photo ? (
                <img
                  src={persona.profile_photo.startsWith("http") ? persona.profile_photo : `http://localhost:5000/uploads/${persona.profile_photo}`}
                  alt={`${persona.name}'s profile`}
                  className="w-24 h-24 rounded-full object-cover mx-auto"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mx-auto">
                  <User className="h-12 w-12 text-gray-400" />
                </div>
              )}
              <Button 
                variant="outline" 
                size="icon" 
                className="absolute bottom-0 right-0 bg-white rounded-full shadow-sm hover:bg-gray-50"
                onClick={() => setShowImageModal(true)}
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">{persona.name}</h1>
            <p className="text-lg text-gray-600">{persona.type}</p>
          </div>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" size="sm" className="bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200">
            <MessageCircle className="h-4 w-4 mr-2" />
            Message
          </Button>
          <Button variant="outline" size="sm" className="bg-green-50 hover:bg-green-100 text-green-700 border-green-200">
            <Video className="h-4 w-4 mr-2" />
            Video Call
          </Button>
          <Button variant="outline" size="sm" className="bg-yellow-50 hover:bg-yellow-100 text-yellow-700 border-yellow-200" onClick={handleBasicInfoEdit}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button variant="outline" size="sm" className="bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex space-x-3 mt-4">
          <Button variant="outline" size="sm" className="bg-white hover:bg-gray-50 text-gray-700 border-gray-200">
            <Printer className="h-4 w-4 mr-2" />
            Print Profile
          </Button>
          <Button variant="outline" size="sm" className="bg-white hover:bg-gray-50 text-gray-700 border-gray-200">
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </div>

      {/* Quick Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Mail className="h-5 w-5 text-blue-800" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{persona.email}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Phone className="h-5 w-5 text-green-800" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p className="font-medium">{persona.phone}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <MapPin className="h-5 w-5 text-purple-800" />
            </div>
            <div>
              <p className="text-sm text-gray-500">State</p>
              <p className="font-medium">{persona.state}</p>
            </div>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-6">
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold text-gray-800">About</h2>
            <Button variant="ghost" size="sm" onClick={handleAboutEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </div>
          <p className="text-gray-600">{persona.message}</p>
          <div className="flex flex-wrap gap-2 mt-3">
            {persona.services?.map((service, index) => (
              <Badge key={index} variant="secondary">
                {service}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        {/* Tabs */}
        <div className="border-b">
          <div className="flex space-x-4 px-6">
            <button
              className={`py-4 px-2 border-b-2 ${
                activeTab === "basic-info"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("basic-info")}
            >
              Basic Information
            </button>
            <button
              className={`py-4 px-2 border-b-2 ${
                activeTab === "additional-details"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("additional-details")}
            >
              Additional Details
            </button>
            <button
              className={`py-4 px-2 border-b-2 ${
                activeTab === "activity-timeline"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("activity-timeline")}
            >
              Activity Timeline
            </button>
            <button
              className={`py-4 px-2 border-b-2 ${
                activeTab === "documents"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("documents")}
            >
              Documents
            </button>
            <button
              className={`py-4 px-2 border-b-2 ${
                activeTab === "location-contacts"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("location-contacts")}
            >
              Location & Contacts
            </button>
          </div>
        </div>

        {/* Basic Info Tab */}
        {activeTab === "basic-info" && (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-500">Name</label>
                    <p className="font-medium">{persona.name}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Email</label>
                    <p className="font-medium">{persona.email}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Phone</label>
                    <p className="font-medium">{persona.phone}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">State</label>
                    <p className="font-medium">{persona.state}</p>
                  </div>
                </div>
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-4">Professional Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-500">Role</label>
                    <p className="font-medium">{persona.role}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Department</label>
                    <p className="font-medium">{persona.department}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Status</label>
                    <Badge variant="outline">{persona.status}</Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Additional Details Tab */}
        {activeTab === "additional-details" && (
          <div className="p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Additional Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-6 shadow-sm">
                <div className="flex items-center mb-4">
                  <User size={24} className="text-indigo-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-800">Personal Information</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center p-3 bg-white rounded-lg shadow-sm">
                    <Calendar className="text-indigo-500 mr-3" size={20} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-500">Date of Birth</p>
                      <p className="font-medium">
                        {persona.additionalDetails?.date_of_birth
                          ? new Date(persona.additionalDetails.date_of_birth).toLocaleDateString()
                          : "Not provided"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center p-3 bg-white rounded-lg shadow-sm">
                    <User className="text-indigo-500 mr-3" size={20} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-500">Father's Name</p>
                      <p className="font-medium">{persona.additionalDetails.father_name || "Not provided"}</p>
                    </div>
                  </div>
                  <div className="flex items-center p-3 bg-white rounded-lg shadow-sm">
                    <Award className="text-indigo-500 mr-3" size={20} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-500">Blood Group</p>
                      <p className="font-medium">{persona.additionalDetails.blood_group || "Not provided"}</p>
                    </div>
                  </div>
                  {/* <div className="flex items-center p-3 bg-white rounded-lg shadow-sm">
                    <Phone className="text-indigo-500 mr-3" size={20} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-500">Emergency Contact</p>
                      <p className="font-medium">{persona.additionalDetails.emergency_Contact || "Not provided"}</p>
                    </div>
                  </div> */}
                </div>
              </div>

              <div className="bg-gradient-to-br from-indigo-50 to-green-50 rounded-xl p-6 shadow-sm">
                <div className="flex items-center mb-4">
                  <FileText size={24} className="text-indigo-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-800">Employment Details</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center p-3 bg-white rounded-lg shadow-sm">
                    <FileText className="text-indigo-500 mr-3" size={20} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-500">Aadhar Number</p>
                      <p className="font-medium">{persona.additionalDetails.aadhar_number || "Not provided"}</p>
                    </div>
                  </div>
                  <div className="flex items-center p-3 bg-white rounded-lg shadow-sm">
                    <Calendar className="text-indigo-500 mr-3" size={20} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-500">Joining Date</p>
                      <p className="font-medium">
                        {persona.additionalDetails?.joining_date
                          ? new Date(persona.additionalDetails.joining_date).toLocaleDateString()
                          : "Not provided"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center p-3 bg-white rounded-lg shadow-sm">
                    <Calendar className="text-indigo-500 mr-3" size={20} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-500">Probation End Date</p>
                      <p className="font-medium">
                        {persona.additionalDetails?.probation_end_date
                          ? new Date(persona.additionalDetails.probation_end_date).toLocaleDateString()
                          : "Not provided"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center p-3 bg-white rounded-lg shadow-sm">
                    <Building2 className="text-indigo-500 mr-3" size={20} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-500">Previous Employer</p>
                      <p className="font-medium">{persona.additionalDetails.previous_employer || "Not provided"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Activity Timeline Tab */}
        {activeTab === "activity-timeline" && (
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">Activity Timeline</h2>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" className="text-gray-600">
                  <ArrowDownUp className="h-4 w-4 mr-2" />
                  Sort by {timelineSortBy}
                </Button>
              </div>
            </div>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <Calendar className="h-4 w-4 text-blue-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="bg-white rounded-lg shadow-sm p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">Joined the company</h3>
                        <p className="text-sm text-gray-500">Started as Senior Engineer in R&D department</p>
                      </div>
                      <span className="text-sm text-gray-500">2022-06-15</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <Award className="h-4 w-4 text-green-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="bg-white rounded-lg shadow-sm p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">Completed probation period</h3>
                        <p className="text-sm text-gray-500">Successfully completed 6-month probation</p>
                      </div>
                      <span className="text-sm text-gray-500">2022-12-15</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                    <FileText className="h-4 w-4 text-purple-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="bg-white rounded-lg shadow-sm p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">Updated documentation</h3>
                        <p className="text-sm text-gray-500">Updated employee records and documentation</p>
                      </div>
                      <span className="text-sm text-gray-500">2023-05-10</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Documents Tab */}
        {activeTab === "documents" && (
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">Documents</h2>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" className="text-gray-600">
                  <ArrowDownUp className="h-4 w-4 mr-2" />
                  Sort by {documentSortBy}
                </Button>
                <Button variant="outline" size="sm" className="text-gray-600">
                  <Download className="h-4 w-4 mr-2" />
                  Download All
                </Button>
                <Button variant="outline" size="sm" className="text-gray-600">
                  <Printer className="h-4 w-4 mr-2" />
                  Print
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">Employment Contract</p>
                      <p className="text-sm text-gray-500">PDF • 2.4 MB</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Printer className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <FileText className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">ID Proof</p>
                      <p className="text-sm text-gray-500">PDF • 1.8 MB</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Printer className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <FileText className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium">Medical Records</p>
                      <p className="text-sm text-gray-500">PDF • 1.2 MB</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Printer className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <FileText className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div>
                      <p className="font-medium">Performance Review</p>
                      <p className="text-sm text-gray-500">PDF • 1.5 MB</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Printer className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Location & Contacts Tab */}
        {activeTab === "location-contacts" && (
          <div className="p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Location & Contacts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-6 shadow-sm">
                <div className="flex items-center mb-4">
                  <MapPin size={24} className="text-indigo-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-800">Office Location</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center p-3 bg-white rounded-lg shadow-sm">
                    <MapPin className="text-indigo-500 mr-3" size={20} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-500">Address</p>
                      <p className="font-medium">123 Tech Street, San Francisco, CA 94105</p>
                    </div>
                  </div>
                  <div className="flex items-center p-3 bg-white rounded-lg shadow-sm">
                    <Clock className="text-indigo-500 mr-3" size={20} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-500">Working Hours</p>
                      <p className="font-medium">9:00 AM - 6:00 PM (PST)</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-indigo-50 to-green-50 rounded-xl p-6 shadow-sm">
                <div className="flex items-center mb-4">
                  <Users size={24} className="text-indigo-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-800">Emergency Contacts</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center p-3 bg-white rounded-lg shadow-sm">
                    <User className="text-indigo-500 mr-3" size={20} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-500">Primary Contact</p>
                      <p className="font-medium">Sarah Thompson (Manager)</p>
                      <p className="text-sm text-gray-500">+1 (555) 123-4567</p>
                    </div>
                  </div>
                  <div className="flex items-center p-3 bg-white rounded-lg shadow-sm">
                    <User className="text-indigo-500 mr-3" size={20} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-500">Emergency Contact</p>
                      <p className="font-medium">Robert Smith (Father)</p>
                      <p className="text-sm text-gray-500">+1 (555) 987-6543</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Update the employee's information
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={editedPersona?.name}
                  onChange={(e) =>
                    setEditedPersona((prev) => ({ ...prev!, name: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={editedPersona?.email}
                  onChange={(e) =>
                    setEditedPersona((prev) => ({ ...prev!, email: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={editedPersona?.phone}
                  onChange={(e) =>
                    setEditedPersona((prev) => ({ ...prev!, phone: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={editedPersona?.location}
                  onChange={(e) =>
                    setEditedPersona((prev) => ({ ...prev!, location: e.target.value }))
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="about">About</Label>
              <Textarea
                id="about"
                value={editedPersona?.about}
                onChange={(e) =>
                  setEditedPersona((prev) => ({ ...prev!, about: e.target.value }))
                }
                className="min-h-[150px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="skills">Skills (comma-separated)</Label>
              <Input
                id="skills"
                value={editedPersona?.skills?.join(", ")}
                onChange={(e) =>
                  setEditedPersona((prev) => ({
                    ...prev!,
                    skills: e.target.value.split(",").map((s) => s.trim()),
                  }))
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Basic Info Edit Modal */}
      <Dialog open={showBasicInfoModal} onOpenChange={setShowBasicInfoModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Basic Information</DialogTitle>
            <DialogDescription>
              Update the employee's basic information
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={editedPersona?.name}
                  onChange={(e) =>
                    setEditedPersona((prev) => ({ ...prev!, name: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={editedPersona?.email}
                  onChange={(e) =>
                    setEditedPersona((prev) => ({ ...prev!, email: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={editedPersona?.phone}
                  onChange={(e) =>
                    setEditedPersona((prev) => ({ ...prev!, phone: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={editedPersona?.location}
                  onChange={(e) =>
                    setEditedPersona((prev) => ({ ...prev!, location: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  value={editedPersona?.department}
                  onChange={(e) =>
                    setEditedPersona((prev) => ({ ...prev!, department: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="position">Position</Label>
                <Input
                  id="position"
                  value={editedPersona?.position}
                  onChange={(e) =>
                    setEditedPersona((prev) => ({ ...prev!, position: e.target.value }))
                  }
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBasicInfoModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveBasicInfo}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* About Edit Modal */}
      <Dialog open={showAboutModal} onOpenChange={setShowAboutModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit About Section</DialogTitle>
            <DialogDescription>
              Update the employee's about information and skills
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="about">About</Label>
              <Textarea
                id="about"
                value={editedPersona?.about}
                onChange={(e) =>
                  setEditedPersona((prev) => ({ ...prev!, about: e.target.value }))
                }
                className="min-h-[150px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="skills">Skills (comma-separated)</Label>
              <Input
                id="skills"
                value={editedPersona?.skills?.join(", ")}
                onChange={(e) =>
                  setEditedPersona((prev) => ({
                    ...prev!,
                    skills: e.target.value.split(",").map((s) => s.trim()),
                  }))
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAboutModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveAbout}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 