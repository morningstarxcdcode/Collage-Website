import React, { useState, useEffect } from 'react';
import {
  Shield,
  AlertTriangle,
  Phone,
  Mail,
  MapPin,
  FileText,
  CheckCircle,
  Users,
  Clock,
  Building2,
  Download,
  ExternalLink,
  MessageSquare,
  Send,
  AlertCircle,
  Gavel,
  Book,
  HelpCircle,
  ChevronDown
} from 'lucide-react';

// ============================================
// ANTI-RAGGING PAGE
// ============================================

export const AntiRaggingPage: React.FC = () => {
  const committeeMembers = [
    { name: 'Dr. Ramesh Kumar', designation: 'Principal', role: 'Chairman', phone: '+91-9876543210', email: 'principal@edunexus.edu.in' },
    { name: 'Prof. Sunita Sharma', designation: 'Dean of Students', role: 'Member Secretary', phone: '+91-9876543211', email: 'dos@edunexus.edu.in' },
    { name: 'Mr. Vijay Singh', designation: 'Chief Warden', role: 'Member', phone: '+91-9876543212', email: 'warden@edunexus.edu.in' },
    { name: 'Dr. Priya Reddy', designation: 'HOD - Psychology', role: 'Member', phone: '+91-9876543213', email: 'psychology@edunexus.edu.in' },
    { name: 'SI Arun Kumar', designation: 'Local Police', role: 'External Member', phone: '+91-9876543214', email: 'police@local.gov.in' },
    { name: 'Mrs. Lakshmi Devi', designation: 'Parent Representative', role: 'External Member', phone: '+91-9876543215', email: 'parent.rep@edunexus.edu.in' },
  ];

  const punishments = [
    { offense: 'Verbal Abuse / Teasing', punishment: 'Written warning + Counseling', severity: 'Mild' },
    { offense: 'Physical Assault', punishment: 'Suspension + Legal Action', severity: 'Severe' },
    { offense: 'Forcing to perform tasks', punishment: 'Fine + Community Service', severity: 'Moderate' },
    { offense: 'Sexual Harassment', punishment: 'Expulsion + Criminal Charges', severity: 'Severe' },
    { offense: 'Cyberbullying', punishment: 'Suspension + Device Confiscation', severity: 'Moderate' },
    { offense: 'Repeated Offense', punishment: 'Expulsion + Ban from Campus', severity: 'Severe' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-red-600 to-rose-600 text-white py-16">
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-4 mb-4">
            <Shield className="w-12 h-12" />
            <div>
              <h1 className="text-4xl font-bold">Anti-Ragging Cell</h1>
              <p className="text-red-100">Zero Tolerance Policy Against Ragging</p>
            </div>
          </div>
          <div className="mt-8 bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <p className="text-lg font-medium mb-4">Emergency Helplines (24x7)</p>
            <div className="flex flex-wrap gap-6">
              <a href="tel:18001805522" className="flex items-center gap-2 bg-white text-red-600 px-6 py-3 rounded-lg font-bold hover:bg-red-50 transition-colors">
                <Phone className="w-5 h-5" />
                1800-180-5522 (Toll Free)
              </a>
              <a href="tel:1800111111" className="flex items-center gap-2 bg-white/20 px-6 py-3 rounded-lg font-medium hover:bg-white/30 transition-colors">
                <Phone className="w-5 h-5" />
                UGC Helpline: 1800-111-111
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        {/* What is Ragging */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">What Constitutes Ragging?</h2>
          <div className="bg-red-50 border border-red-100 rounded-2xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                'Any conduct by any student whether by words spoken or written',
                'Any act causing physical or mental harm',
                'Indulging in rowdy or indisciplined activities',
                'Asking to do any act against student\'s will',
                'Any form of teasing or bullying, physical or verbal',
                'Causing financial extortion or exploitation'
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                  <span className="text-slate-700">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Committee Members */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Anti-Ragging Committee</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {committeeMembers.map((member, idx) => (
              <div key={idx} className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg transition-all">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{member.name}</h3>
                    <p className="text-sm text-slate-500">{member.designation}</p>
                  </div>
                </div>
                <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm inline-block mb-4">
                  {member.role}
                </div>
                <div className="space-y-2 text-sm">
                  <a href={`tel:${member.phone}`} className="flex items-center gap-2 text-slate-600 hover:text-blue-600">
                    <Phone className="w-4 h-4" />
                    {member.phone}
                  </a>
                  <a href={`mailto:${member.email}`} className="flex items-center gap-2 text-slate-600 hover:text-blue-600">
                    <Mail className="w-4 h-4" />
                    {member.email}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Punishments */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Punishments for Ragging</h2>
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-left p-4 font-medium text-slate-700">Offense</th>
                  <th className="text-left p-4 font-medium text-slate-700">Punishment</th>
                  <th className="text-left p-4 font-medium text-slate-700">Severity</th>
                </tr>
              </thead>
              <tbody>
                {punishments.map((item, idx) => (
                  <tr key={idx} className="border-t border-slate-100">
                    <td className="p-4 text-slate-700">{item.offense}</td>
                    <td className="p-4 text-slate-600">{item.punishment}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        item.severity === 'Severe' ? 'bg-red-100 text-red-700' :
                        item.severity === 'Moderate' ? 'bg-amber-100 text-amber-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {item.severity}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Report Form */}
        <section className="bg-slate-900 rounded-3xl p-12 text-white">
          <div className="max-w-2xl mx-auto text-center">
            <AlertCircle className="w-16 h-16 mx-auto mb-6 text-red-400" />
            <h2 className="text-3xl font-bold mb-4">Report an Incident</h2>
            <p className="text-slate-300 mb-8">
              If you or someone you know is being ragged, report immediately. All complaints are treated with strict confidentiality.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-xl font-bold transition-all flex items-center gap-2 justify-center">
                <MessageSquare className="w-5 h-5" />
                File Online Complaint
              </button>
              <a 
                href="https://www.antiragging.in"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-white/20 px-8 py-4 rounded-xl font-bold transition-all flex items-center gap-2 justify-center"
              >
                <ExternalLink className="w-5 h-5" />
                UGC Portal
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

// ============================================
// RTI PAGE
// ============================================

export const RTIPage: React.FC = () => {
  const pioDetails = [
    { name: 'Dr. Suresh Reddy', designation: 'Public Information Officer', email: 'pio@edunexus.edu.in', phone: '+91-9876543220' },
    { name: 'Prof. Meena Kumari', designation: 'First Appellate Authority', email: 'faa@edunexus.edu.in', phone: '+91-9876543221' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-4 mb-4">
            <Gavel className="w-12 h-12" />
            <div>
              <h1 className="text-4xl font-bold">Right to Information</h1>
              <p className="text-indigo-100">RTI Act, 2005</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        {/* About RTI */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">About RTI</h2>
          <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-8">
            <p className="text-slate-700 leading-relaxed mb-4">
              The Right to Information Act, 2005 empowers every citizen to seek information from public authorities, 
              thereby promoting transparency and accountability in the working of every public authority.
            </p>
            <p className="text-slate-600">
              As per Section 4(1)(b) of RTI Act 2005, EduNexus Institute discloses all relevant information proactively.
            </p>
          </div>
        </section>

        {/* PIO Details */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">RTI Officers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pioDetails.map((officer, idx) => (
              <div key={idx} className="bg-white border border-slate-200 rounded-xl p-6">
                <h3 className="font-bold text-slate-900 text-lg mb-2">{officer.name}</h3>
                <p className="text-indigo-600 mb-4">{officer.designation}</p>
                <div className="space-y-2 text-sm">
                  <a href={`mailto:${officer.email}`} className="flex items-center gap-2 text-slate-600 hover:text-indigo-600">
                    <Mail className="w-4 h-4" />
                    {officer.email}
                  </a>
                  <a href={`tel:${officer.phone}`} className="flex items-center gap-2 text-slate-600 hover:text-indigo-600">
                    <Phone className="w-4 h-4" />
                    {officer.phone}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Fee Structure */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">RTI Fee Structure</h2>
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-left p-4 font-medium text-slate-700">Description</th>
                  <th className="text-left p-4 font-medium text-slate-700">Fee</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { desc: 'Application Fee', fee: '₹10' },
                  { desc: 'Per page (A4 Size)', fee: '₹2' },
                  { desc: 'Inspection of records (first hour)', fee: 'Free' },
                  { desc: 'Inspection of records (per hour after first)', fee: '₹5' },
                  { desc: 'For CD/Floppy', fee: '₹50' },
                ].map((item, idx) => (
                  <tr key={idx} className="border-t border-slate-100">
                    <td className="p-4 text-slate-700">{item.desc}</td>
                    <td className="p-4 text-slate-600 font-medium">{item.fee}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* How to Apply */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-6">How to Apply for RTI</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { step: 1, title: 'Write Application', desc: 'Write your application in English or Hindi with specific information required' },
              { step: 2, title: 'Pay Fee', desc: 'Attach application fee of ₹10 via DD/IPO/Cash' },
              { step: 3, title: 'Submit', desc: 'Submit to PIO by post or in person. Response within 30 days' },
            ].map((item, idx) => (
              <div key={idx} className="bg-slate-50 rounded-xl p-6">
                <div className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold mb-4">
                  {item.step}
                </div>
                <h3 className="font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

// ============================================
// MANDATORY DISCLOSURE PAGE
// ============================================

export const MandatoryDisclosurePage: React.FC = () => {
  const disclosures = [
    {
      category: 'Institution Details',
      items: [
        { label: 'Name of Institution', value: 'EduNexus Institute of Technology' },
        { label: 'Address', value: 'Tech Park Road, Sector 15, Bangalore - 560100' },
        { label: 'Year of Establishment', value: '2005' },
        { label: 'University Affiliation', value: 'Visvesvaraya Technological University (VTU)' },
        { label: 'AICTE Approval', value: 'Yes (1-3318421472)' },
        { label: 'NAAC Accreditation', value: 'A+ Grade (3.52 CGPA)' },
      ]
    },
    {
      category: 'Infrastructure',
      items: [
        { label: 'Total Land Area', value: '25 Acres' },
        { label: 'Built-up Area', value: '75,000 sq. meters' },
        { label: 'Number of Classrooms', value: '120' },
        { label: 'Computer Labs', value: '15' },
        { label: 'Library Books', value: '50,000+' },
        { label: 'Hostel Capacity', value: '2,500 students' },
      ]
    },
    {
      category: 'Faculty Information',
      items: [
        { label: 'Total Faculty', value: '350' },
        { label: 'Ph.D Holders', value: '120' },
        { label: 'Student-Faculty Ratio', value: '15:1' },
        { label: 'Female Faculty Percentage', value: '42%' },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white py-16">
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-4 mb-4">
            <Book className="w-12 h-12" />
            <div>
              <h1 className="text-4xl font-bold">Mandatory Disclosure</h1>
              <p className="text-slate-300">As per AICTE Norms</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        {/* Disclosure Sections */}
        <div className="space-y-8">
          {disclosures.map((section, idx) => (
            <div key={idx} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
                <h2 className="text-xl font-bold text-slate-900">{section.category}</h2>
              </div>
              <div className="divide-y divide-slate-100">
                {section.items.map((item, itemIdx) => (
                  <div key={itemIdx} className="flex justify-between items-center px-6 py-4">
                    <span className="text-slate-600">{item.label}</span>
                    <span className="font-medium text-slate-900">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Download Section */}
        <div className="mt-12 bg-blue-50 border border-blue-100 rounded-xl p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Download Complete Disclosure</h2>
          <p className="text-slate-600 mb-6">
            Download the complete mandatory disclosure document as per AICTE regulations.
          </p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-colors">
            <Download className="w-5 h-5" />
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================
// CONTACT PAGE
// ============================================

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const departments = [
    { name: 'Admission Office', email: 'admissions@edunexus.edu.in', phone: '+91-80-12345678', hours: '9:00 AM - 5:00 PM' },
    { name: 'Examination Cell', email: 'exam@edunexus.edu.in', phone: '+91-80-12345679', hours: '10:00 AM - 4:00 PM' },
    { name: 'Accounts Department', email: 'accounts@edunexus.edu.in', phone: '+91-80-12345680', hours: '9:30 AM - 4:30 PM' },
    { name: 'Placement Cell', email: 'placements@edunexus.edu.in', phone: '+91-80-12345681', hours: '10:00 AM - 5:00 PM' },
    { name: 'Student Affairs', email: 'studentaffairs@edunexus.edu.in', phone: '+91-80-12345682', hours: '9:00 AM - 6:00 PM' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-16">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-blue-100">We're here to help and answer any questions you might have.</p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-slate-200 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Send us a Message</h2>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Full Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Email *</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="+91 XXXXX XXXXX"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Subject *</label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                      aria-label="Subject"
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select a subject</option>
                      <option value="admission">Admission Inquiry</option>
                      <option value="academic">Academic Query</option>
                      <option value="fees">Fee Related</option>
                      <option value="placement">Placement</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Message *</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    rows={5}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    placeholder="Your message..."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  Send Message
                </button>
              </form>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            {/* Main Address */}
            <div className="bg-blue-50 rounded-2xl p-6">
              <h3 className="font-bold text-slate-900 mb-4">Main Campus</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-blue-600 mt-1" />
                  <div className="text-slate-600">
                    EduNexus Institute of Technology<br />
                    Tech Park Road, Sector 15<br />
                    Bangalore - 560100, Karnataka
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-blue-600" />
                  <span className="text-slate-600">+91-80-12345678</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-blue-600" />
                  <span className="text-slate-600">info@edunexus.edu.in</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <span className="text-slate-600">Mon - Sat: 9:00 AM - 6:00 PM</span>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="bg-slate-100 rounded-2xl h-64 flex items-center justify-center">
              <div className="text-center text-slate-500">
                <MapPin className="w-8 h-8 mx-auto mb-2" />
                <p>Interactive Map</p>
                <p className="text-sm">(Google Maps Integration)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Department Contacts */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Department Contacts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {departments.map((dept, idx) => (
              <div key={idx} className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="font-bold text-slate-900">{dept.name}</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <a href={`mailto:${dept.email}`} className="flex items-center gap-2 text-slate-600 hover:text-blue-600">
                    <Mail className="w-4 h-4" />
                    {dept.email}
                  </a>
                  <a href={`tel:${dept.phone}`} className="flex items-center gap-2 text-slate-600 hover:text-blue-600">
                    <Phone className="w-4 h-4" />
                    {dept.phone}
                  </a>
                  <div className="flex items-center gap-2 text-slate-500">
                    <Clock className="w-4 h-4" />
                    {dept.hours}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

// ============================================
// FAQ PAGE
// ============================================

export const FAQPage: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      category: 'Admissions',
      questions: [
        { q: 'What is the admission process?', a: 'Admissions are based on entrance exam scores (JEE Main/State CET) or management quota. Visit our admissions page to start your application.' },
        { q: 'What are the eligibility criteria for B.Tech?', a: '10+2 with Physics, Chemistry, and Mathematics with minimum 45% marks (40% for reserved categories).' },
        { q: 'Is there a direct admission option?', a: 'Yes, we have management quota seats. Contact the admissions office for details.' },
      ]
    },
    {
      category: 'Fees & Scholarships',
      questions: [
        { q: 'What are the fee payment options?', a: 'We accept payment through various modes: Online (Card/UPI/NetBanking), DD, or EMI through education loans.' },
        { q: 'Are scholarships available?', a: 'Yes, merit-based and need-based scholarships are available. Top performers in entrance exams get up to 100% tuition fee waiver.' },
        { q: 'Can I pay fees in installments?', a: 'Yes, semester-wise payment is allowed. EMI options are also available through partner banks.' },
      ]
    },
    {
      category: 'Hostel & Campus',
      questions: [
        { q: 'Is hostel accommodation available?', a: 'Yes, separate hostels for boys and girls with modern amenities, WiFi, mess facility, and 24/7 security.' },
        { q: 'What facilities are available on campus?', a: 'Our campus has library, sports complex, gymnasium, cafeteria, medical center, ATM, and more.' },
      ]
    },
    {
      category: 'Placements',
      questions: [
        { q: 'What is the placement record?', a: 'Over 90% placement rate with 250+ companies visiting campus annually. Highest package: ₹48 LPA.' },
        { q: 'Which companies visit for campus placements?', a: 'Top recruiters include Google, Microsoft, Amazon, Infosys, TCS, Wipro, and many more.' },
      ]
    }
  ];

  let globalIndex = 0;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-16">
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-4">
            <HelpCircle className="w-12 h-12" />
            <div>
              <h1 className="text-4xl font-bold">Frequently Asked Questions</h1>
              <p className="text-purple-100">Find answers to common questions</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <div className="max-w-3xl mx-auto">
          {faqs.map((category, catIdx) => (
            <div key={catIdx} className="mb-8">
              <h2 className="text-xl font-bold text-slate-900 mb-4">{category.category}</h2>
              <div className="space-y-3">
                {category.questions.map((faq, qIdx) => {
                  const currentIndex = globalIndex++;
                  return (
                    <div key={qIdx} className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                      <button
                        onClick={() => setOpenIndex(openIndex === currentIndex ? null : currentIndex)}
                        className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 transition-colors"
                      >
                        <span className="font-medium text-slate-900">{faq.q}</span>
                        <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${
                          openIndex === currentIndex ? 'rotate-180' : ''
                        }`} />
                      </button>
                      {openIndex === currentIndex && (
                        <div className="px-4 pb-4 text-slate-600">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Still Have Questions */}
        <div className="max-w-3xl mx-auto mt-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Still Have Questions?</h2>
          <p className="text-purple-100 mb-6">Can't find what you're looking for? Contact our support team.</p>
          <button className="bg-white text-purple-600 px-8 py-3 rounded-xl font-bold hover:bg-purple-50 transition-colors">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default {
  AntiRaggingPage,
  RTIPage,
  MandatoryDisclosurePage,
  ContactPage,
  FAQPage
};
