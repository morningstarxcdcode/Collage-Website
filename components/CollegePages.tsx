import React, { useState } from 'react';
import {
  Building2,
  Users,
  BookOpen,
  Trophy,
  Target,
  Award,
  GraduationCap,
  Briefcase,
  TrendingUp,
  Globe,
  CheckCircle,
  ChevronRight,
  Play,
  MapPin,
  Calendar,
  Star,
  Heart,
  Lightbulb,
  Rocket,
  Shield,
  Clock,
  FileText,
  Download,
  ExternalLink,
  Camera,
  Video,
  Image
} from 'lucide-react';

// ============================================
// PLACEMENT PAGE
// ============================================

export const PlacementPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const placementStats = [
    { label: 'Students Placed', value: '1,200+', icon: Users },
    { label: 'Highest Package', value: '₹48 LPA', icon: TrendingUp },
    { label: 'Average Package', value: '₹8.5 LPA', icon: Briefcase },
    { label: 'Companies Visited', value: '250+', icon: Building2 },
  ];

  const topRecruiters = [
    { name: 'Google', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/200px-Google_2015_logo.svg.png' },
    { name: 'Microsoft', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Microsoft_logo_%282012%29.svg/200px-Microsoft_logo_%282012%29.svg.png' },
    { name: 'Amazon', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/200px-Amazon_logo.svg.png' },
    { name: 'Infosys', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Infosys_logo.svg/200px-Infosys_logo.svg.png' },
    { name: 'TCS', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Tata_Consultancy_Services_Logo.svg/200px-Tata_Consultancy_Services_Logo.svg.png' },
    { name: 'Wipro', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Wipro_Primary_Logo_Color_RGB.svg/200px-Wipro_Primary_Logo_Color_RGB.svg.png' },
    { name: 'Accenture', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Accenture.svg/200px-Accenture.svg.png' },
    { name: 'Deloitte', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Deloitte.svg/200px-Deloitte.svg.png' },
  ];

  const recentPlacements = [
    { name: 'Rahul Sharma', branch: 'CSE', company: 'Google', package: '₹45 LPA', photo: 'https://ui-avatars.com/api/?name=Rahul+Sharma&background=3b82f6&color=fff' },
    { name: 'Priya Patel', branch: 'IT', company: 'Microsoft', package: '₹42 LPA', photo: 'https://ui-avatars.com/api/?name=Priya+Patel&background=ec4899&color=fff' },
    { name: 'Amit Kumar', branch: 'ECE', company: 'Amazon', package: '₹38 LPA', photo: 'https://ui-avatars.com/api/?name=Amit+Kumar&background=10b981&color=fff' },
    { name: 'Sneha Reddy', branch: 'CSE', company: 'Flipkart', package: '₹32 LPA', photo: 'https://ui-avatars.com/api/?name=Sneha+Reddy&background=f59e0b&color=fff' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white py-20">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1920')] opacity-10 bg-cover bg-center" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Training & Placement Cell</h1>
            <p className="text-xl text-blue-100 mb-8">
              Empowering students with industry-ready skills and connecting them with top recruiters worldwide.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {placementStats.map((stat, idx) => (
                <div key={idx} className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <stat.icon className="w-8 h-8 text-blue-300 mb-2" />
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-sm text-blue-200">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
        <div className="container mx-auto px-6">
          <div className="flex gap-8 overflow-x-auto">
            {['overview', 'recruiters', 'statistics', 'process', 'team'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-2 font-medium capitalize whitespace-nowrap transition-all border-b-2 ${
                  activeTab === tab
                    ? 'text-blue-600 border-blue-600'
                    : 'text-slate-600 border-transparent hover:text-blue-600'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        {activeTab === 'overview' && (
          <div className="space-y-16">
            {/* About T&P Cell */}
            <section>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">About Training & Placement Cell</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="prose prose-slate max-w-none">
                  <p className="text-lg text-slate-600 leading-relaxed">
                    The Training and Placement Cell at EduNexus Institute is dedicated to bridging the gap between 
                    academic learning and industry requirements. We work tirelessly to ensure our students are 
                    well-prepared for their professional careers.
                  </p>
                  <p className="text-slate-600">
                    Our comprehensive training programs include soft skills development, technical workshops, 
                    mock interviews, and industry expert sessions. We maintain strong relationships with 
                    over 500+ companies across various sectors.
                  </p>
                </div>
                <div className="bg-slate-50 rounded-2xl p-6">
                  <h3 className="font-bold text-slate-900 mb-4">Key Highlights</h3>
                  <ul className="space-y-3">
                    {[
                      '100% Placement assistance for eligible students',
                      'Pre-placement training from 5th semester',
                      'Industry mentorship programs',
                      'Internship opportunities with stipend',
                      'Career counseling and guidance',
                      'Alumni network support'
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                        <span className="text-slate-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            {/* Recent Placements */}
            <section>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Recent Top Placements</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {recentPlacements.map((student, idx) => (
                  <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg transition-all">
                    <img src={student.photo} alt={student.name} className="w-20 h-20 rounded-full mx-auto mb-4" />
                    <div className="text-center">
                      <h3 className="font-bold text-slate-900">{student.name}</h3>
                      <p className="text-sm text-slate-500">{student.branch}</p>
                      <div className="mt-3 bg-green-50 text-green-700 py-2 px-4 rounded-lg inline-block">
                        <p className="font-bold">{student.company}</p>
                        <p className="text-xs">{student.package}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {activeTab === 'recruiters' && (
          <section>
            <h2 className="text-3xl font-bold text-slate-900 mb-8">Our Recruiters</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {topRecruiters.map((company, idx) => (
                <div key={idx} className="bg-white border border-slate-200 rounded-xl p-6 flex items-center justify-center hover:shadow-md transition-all">
                  <img src={company.logo} alt={company.name} className="h-12 object-contain grayscale hover:grayscale-0 transition-all" />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

// ============================================
// CAMPUS LIFE PAGE
// ============================================

export const CampusLifePage: React.FC = () => {
  const facilities = [
    { name: 'Central Library', description: '50,000+ books, e-journals, 24/7 access during exams', icon: BookOpen, image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=600' },
    { name: 'Sports Complex', description: 'Indoor & outdoor facilities, Olympic-size pool', icon: Trophy, image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600' },
    { name: 'Hostels', description: 'Separate blocks for boys & girls, WiFi enabled', icon: Building2, image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600' },
    { name: 'Cafeteria', description: 'Multi-cuisine food court, hygienic preparation', icon: Heart, image: 'https://images.unsplash.com/photo-1567521464027-f127ff144326?w=600' },
    { name: 'Gymnasium', description: 'Modern equipment, personal trainers', icon: Users, image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600' },
    { name: 'Medical Center', description: '24/7 medical facility, ambulance service', icon: Shield, image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600' },
  ];

  const clubs = [
    { name: 'Coding Club', members: 250, description: 'Competitive programming, hackathons' },
    { name: 'Robotics Club', members: 120, description: 'Build robots, participate in competitions' },
    { name: 'Literary Club', members: 80, description: 'Debates, poetry, creative writing' },
    { name: 'Music Club', members: 150, description: 'Band, solo performances, music production' },
    { name: 'Dance Club', members: 180, description: 'Classical, contemporary, hip-hop' },
    { name: 'Photography Club', members: 90, description: 'Workshops, exhibitions, photo walks' },
    { name: 'Entrepreneurship Cell', members: 200, description: 'Startup incubation, mentorship' },
    { name: 'NSS', members: 300, description: 'Social service, community development' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="relative h-[60vh] bg-slate-900">
        <img 
          src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1920"
          alt="Campus"
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">Campus Life</h1>
            <p className="text-xl text-slate-200">Where Learning Meets Living</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16">
        {/* Facilities */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">World-Class Facilities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {facilities.map((facility, idx) => (
              <div key={idx} className="group bg-white rounded-2xl overflow-hidden border border-slate-200 hover:shadow-xl transition-all">
                <div className="h-48 overflow-hidden">
                  <img 
                    src={facility.image} 
                    alt={facility.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <facility.icon className="w-5 h-5 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">{facility.name}</h3>
                  </div>
                  <p className="text-slate-600">{facility.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Student Clubs */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Student Clubs & Societies</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {clubs.map((club, idx) => (
              <div key={idx} className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100 hover:shadow-md transition-all">
                <h3 className="text-lg font-bold text-slate-900 mb-2">{club.name}</h3>
                <p className="text-sm text-slate-600 mb-3">{club.description}</p>
                <div className="flex items-center gap-2 text-sm text-blue-600">
                  <Users className="w-4 h-4" />
                  <span>{club.members}+ members</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Virtual Tour CTA */}
        <section className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-12 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Take a Virtual Campus Tour</h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Experience our 25-acre green campus from the comfort of your home. Explore classrooms, 
            labs, hostels, and recreational facilities through our interactive virtual tour.
          </p>
          <button className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold hover:bg-blue-50 transition-all flex items-center gap-3 mx-auto">
            <Play className="w-5 h-5" />
            Start Virtual Tour
          </button>
        </section>
      </div>
    </div>
  );
};

// ============================================
// RESEARCH PAGE
// ============================================

export const ResearchPage: React.FC = () => {
  const researchAreas = [
    { name: 'Artificial Intelligence & ML', projects: 45, papers: 120, icon: Lightbulb },
    { name: 'Renewable Energy', projects: 32, papers: 85, icon: Rocket },
    { name: 'Nanotechnology', projects: 28, papers: 72, icon: Target },
    { name: 'Cybersecurity', projects: 38, papers: 95, icon: Shield },
    { name: 'Biotechnology', projects: 25, papers: 68, icon: Heart },
    { name: 'Robotics & Automation', projects: 35, papers: 88, icon: Building2 },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-gradient-to-br from-slate-900 to-blue-900 text-white py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Research & Innovation</h1>
            <p className="text-xl text-slate-300">
              Pushing the boundaries of knowledge through cutting-edge research and innovation.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {[
            { label: 'Research Papers', value: '500+' },
            { label: 'Patents Filed', value: '45' },
            { label: 'Research Labs', value: '25' },
            { label: 'Funding (Crores)', value: '₹50+' },
          ].map((stat, idx) => (
            <div key={idx} className="bg-blue-50 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-blue-600">{stat.value}</div>
              <div className="text-slate-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Research Areas */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-8">Research Focus Areas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {researchAreas.map((area, idx) => (
              <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-lg transition-all">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                  <area.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{area.name}</h3>
                <div className="flex gap-4 text-sm text-slate-500">
                  <span>{area.projects} Projects</span>
                  <span>{area.papers} Papers</span>
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
// ALUMNI PAGE
// ============================================

export const AlumniPage: React.FC = () => {
  const notableAlumni = [
    { name: 'Dr. Arvind Kumar', batch: '1998', position: 'CEO, Tech Innovations Inc.', image: 'https://ui-avatars.com/api/?name=Arvind+Kumar&background=3b82f6&color=fff&size=200' },
    { name: 'Priya Menon', batch: '2005', position: 'Senior VP, Google India', image: 'https://ui-avatars.com/api/?name=Priya+Menon&background=ec4899&color=fff&size=200' },
    { name: 'Rajesh Sharma', batch: '2002', position: 'Founder, StartupX', image: 'https://ui-avatars.com/api/?name=Rajesh+Sharma&background=10b981&color=fff&size=200' },
    { name: 'Dr. Sunita Patel', batch: '1995', position: 'Research Director, ISRO', image: 'https://ui-avatars.com/api/?name=Sunita+Patel&background=f59e0b&color=fff&size=200' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-gradient-to-br from-amber-500 to-orange-600 text-white py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Alumni Network</h1>
            <p className="text-xl text-amber-100">
              20,000+ alumni across 50+ countries, leading in various fields worldwide.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {[
            { label: 'Total Alumni', value: '20,000+' },
            { label: 'Countries', value: '50+' },
            { label: 'Alumni Chapters', value: '25' },
            { label: 'Mentors', value: '500+' },
          ].map((stat, idx) => (
            <div key={idx} className="bg-amber-50 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-amber-600">{stat.value}</div>
              <div className="text-slate-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Notable Alumni */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-8">Notable Alumni</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {notableAlumni.map((alumni, idx) => (
              <div key={idx} className="text-center">
                <img src={alumni.image} alt={alumni.name} className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-amber-200" />
                <h3 className="font-bold text-slate-900">{alumni.name}</h3>
                <p className="text-sm text-amber-600 mb-1">Batch of {alumni.batch}</p>
                <p className="text-sm text-slate-500">{alumni.position}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Alumni Portal CTA */}
        <section className="bg-slate-900 rounded-3xl p-12 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Join the Alumni Network</h2>
          <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
            Connect with fellow alumni, access exclusive events, mentorship programs, and career opportunities.
          </p>
          <div className="flex gap-4 justify-center">
            <button className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-4 rounded-xl font-bold transition-all">
              Register as Alumni
            </button>
            <button className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-xl font-bold transition-all border border-white/20">
              Alumni Portal Login
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

// ============================================
// GALLERY PAGE
// ============================================

export const GalleryPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  
  const categories = ['all', 'campus', 'events', 'academics', 'sports', 'cultural'];
  
  const galleryItems = [
    { id: 1, category: 'campus', type: 'image', url: 'https://images.unsplash.com/photo-1562774053-701939374585?w=600', title: 'Main Building' },
    { id: 2, category: 'events', type: 'image', url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600', title: 'TechFest 2024' },
    { id: 3, category: 'academics', type: 'image', url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600', title: 'Computer Lab' },
    { id: 4, category: 'sports', type: 'image', url: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600', title: 'Sports Day' },
    { id: 5, category: 'cultural', type: 'image', url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600', title: 'Annual Day' },
    { id: 6, category: 'campus', type: 'image', url: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600', title: 'Aerial View' },
  ];

  const filteredItems = activeCategory === 'all' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === activeCategory);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-slate-900 text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Photo Gallery</h1>
          <p className="text-xl text-slate-300">Capturing moments that make EduNexus special</p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        {/* Category Filter */}
        <div className="flex flex-wrap gap-4 justify-center mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2 rounded-full font-medium capitalize transition-all ${
                activeCategory === cat
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div key={item.id} className="group relative overflow-hidden rounded-2xl aspect-[4/3]">
              <img
                src={item.url}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-white font-bold text-lg">{item.title}</h3>
                  <p className="text-white/70 text-sm capitalize">{item.category}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================
// DOWNLOADS PAGE
// ============================================

export const DownloadsPage: React.FC = () => {
  const downloads = [
    { category: 'Academic', items: [
      { name: 'Academic Calendar 2025-26', size: '1.2 MB', type: 'PDF' },
      { name: 'Syllabus - B.Tech CSE', size: '3.5 MB', type: 'PDF' },
      { name: 'Exam Schedule', size: '500 KB', type: 'PDF' },
      { name: 'Holiday List', size: '200 KB', type: 'PDF' },
    ]},
    { category: 'Admission', items: [
      { name: 'Admission Brochure 2026', size: '8.5 MB', type: 'PDF' },
      { name: 'Application Form', size: '300 KB', type: 'PDF' },
      { name: 'Fee Structure', size: '450 KB', type: 'PDF' },
      { name: 'Scholarship Details', size: '600 KB', type: 'PDF' },
    ]},
    { category: 'Mandatory Disclosure', items: [
      { name: 'AICTE Approval Letter', size: '1.8 MB', type: 'PDF' },
      { name: 'NAAC Certificate', size: '2.1 MB', type: 'PDF' },
      { name: 'Anti-Ragging Policy', size: '400 KB', type: 'PDF' },
      { name: 'RTI Information', size: '350 KB', type: 'PDF' },
    ]},
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl font-bold mb-4">Downloads</h1>
          <p className="text-blue-100">Access important documents and resources</p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <div className="space-y-12">
          {downloads.map((section, idx) => (
            <div key={idx}>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">{section.category}</h2>
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                {section.items.map((item, itemIdx) => (
                  <div 
                    key={itemIdx}
                    className={`flex items-center justify-between p-4 hover:bg-slate-50 transition-colors ${
                      itemIdx !== section.items.length - 1 ? 'border-b border-slate-100' : ''
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-red-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-slate-900">{item.name}</h3>
                        <p className="text-sm text-slate-500">{item.type} • {item.size}</p>
                      </div>
                    </div>
                    <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium">
                      <Download className="w-5 h-5" />
                      Download
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================
// NAAC PAGE
// ============================================

const getNaacScoreWidthClass = (score: number) => {
  switch (score) {
    case 3.72:
      return 'w-[93%]';
    case 3.65:
      return 'w-[91%]';
    case 3.62:
      return 'w-[91%]';
    case 3.58:
      return 'w-[90%]';
    case 3.55:
      return 'w-[89%]';
    case 3.48:
      return 'w-[87%]';
    case 3.45:
      return 'w-[86%]';
    default:
      return 'w-[90%]';
  }
};

export const NAACPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-16">
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-4 mb-4">
            <Award className="w-12 h-12" />
            <div>
              <h1 className="text-4xl font-bold">NAAC Accreditation</h1>
              <p className="text-emerald-100">National Assessment and Accreditation Council</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        {/* Grade Display */}
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl p-12 text-center mb-12 border border-emerald-100">
          <div className="w-32 h-32 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-6xl font-bold text-white">A+</span>
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Grade A+ Accredited</h2>
          <p className="text-slate-600 mb-4">CGPA: 3.52 out of 4.00</p>
          <p className="text-sm text-slate-500">Valid: 2023 - 2028</p>
        </div>

        {/* Criteria Scores */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { criteria: 'Curricular Aspects', score: 3.65 },
            { criteria: 'Teaching-Learning', score: 3.72 },
            { criteria: 'Research', score: 3.45 },
            { criteria: 'Infrastructure', score: 3.58 },
            { criteria: 'Student Support', score: 3.62 },
            { criteria: 'Governance', score: 3.48 },
            { criteria: 'Institutional Values', score: 3.55 },
          ].map((item, idx) => (
            <div key={idx} className="bg-white border border-slate-200 rounded-xl p-6">
              <div className="text-2xl font-bold text-emerald-600 mb-2">{item.score}</div>
              <div className="text-sm text-slate-600">{item.criteria}</div>
              <div className="mt-3 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className={`h-full bg-emerald-500 rounded-full ${getNaacScoreWidthClass(item.score)}`} />
              </div>
            </div>
          ))}
        </div>

        {/* Documents */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-6">NAAC Documents</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              'Self Study Report (SSR)',
              'IQAC Minutes',
              'Annual Quality Assurance Report',
              'NAAC Certificate',
              'Peer Team Report',
              'Compliance Report'
            ].map((doc, idx) => (
              <div key={idx} className="bg-slate-50 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-slate-400" />
                  <span className="font-medium text-slate-700">{doc}</span>
                </div>
                <button className="text-blue-600 hover:text-blue-700 flex items-center gap-1">
                  <Download className="w-4 h-4" />
                  Download
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default {
  PlacementPage,
  CampusLifePage,
  ResearchPage,
  AlumniPage,
  GalleryPage,
  DownloadsPage,
  NAACPage
};
