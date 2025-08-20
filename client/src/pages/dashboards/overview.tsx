
import { usePageMetadata } from "@/hooks/use-page-metadata";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEvents } from "@/hooks/use-events";
import { useCategories } from "@/hooks/use-categories";
import { FaCalendarAlt, FaTags, FaCheckCircle, FaExclamationTriangle, FaChartLine, FaUsers, FaGlobe, FaStar } from "react-icons/fa";
import { motion } from "framer-motion";

export default function DashboardOverview() {
  usePageMetadata('dashboard');
  
  const { data: approvedEvents = [] } = useEvents({ approved: true });
  const { data: pendingEvents = [] } = useEvents({ approved: false });
  const { data: categories = [] } = useCategories({});

  const totalEvents = approvedEvents.length + pendingEvents.length;

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 animate-gradient-shift"></div>
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{ animationDelay: "2s" }}></div>
        <div className="absolute bottom-20 left-40 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{ animationDelay: "4s" }}></div>
      </div>

      {/* Main Content */}
      <motion.div 
        className="relative z-10 space-y-8 p-6"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Hero Section */}
        <motion.div 
          className="text-center mb-12"
          variants={cardVariants}
        >
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Dashboard Overview
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Welcome to your command center. Monitor events, track performance, and manage your platform with ease.
          </p>
          <div className="flex justify-center mt-6">
            <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"></div>
          </div>
        </motion.div>

        {/* Stats Cards Grid */}
        <motion.div 
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
          variants={containerVariants}
        >
          <motion.div variants={cardVariants}>
            <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600"></div>
              <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium text-white/90">Total Events</CardTitle>
                <div className="p-2 bg-white/20 rounded-lg">
                  <FaCalendarAlt className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent className="relative">
                <div className="text-3xl font-bold text-white mb-1">{totalEvents}</div>
                <p className="text-xs text-white/80">
                  All events in the system
                </p>
                <div className="absolute bottom-0 right-0 opacity-10">
                  <FaChartLine className="h-16 w-16 text-white" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={cardVariants}>
            <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-600"></div>
              <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium text-white/90">Approved Events</CardTitle>
                <div className="p-2 bg-white/20 rounded-lg">
                  <FaCheckCircle className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent className="relative">
                <div className="text-3xl font-bold text-white mb-1">{approvedEvents.length}</div>
                <p className="text-xs text-white/80">
                  Events visible to public
                </p>
                <div className="absolute bottom-0 right-0 opacity-10">
                  <FaStar className="h-16 w-16 text-white" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={cardVariants}>
            <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-red-500"></div>
              <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium text-white/90">Pending Approval</CardTitle>
                <div className="p-2 bg-white/20 rounded-lg">
                  <FaExclamationTriangle className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent className="relative">
                <div className="text-3xl font-bold text-white mb-1">{pendingEvents.length}</div>
                <p className="text-xs text-white/80">
                  Events awaiting review
                </p>
                <div className="absolute bottom-0 right-0 opacity-10">
                  <FaUsers className="h-16 w-16 text-white" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={cardVariants}>
            <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-indigo-600"></div>
              <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium text-white/90">Categories</CardTitle>
                <div className="p-2 bg-white/20 rounded-lg">
                  <FaTags className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent className="relative">
                <div className="text-3xl font-bold text-white mb-1">{categories.length}</div>
                <p className="text-xs text-white/80">
                  Total categories
                </p>
                <div className="absolute bottom-0 right-0 opacity-10">
                  <FaGlobe className="h-16 w-16 text-white" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Main Content Grid */}
        <motion.div 
          className="grid gap-6 lg:grid-cols-2"
          variants={containerVariants}
        >
          {/* Quick Actions Card */}
          <motion.div variants={cardVariants}>
            <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-semibold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3">
                  <motion.a 
                    href="/dashboards/events" 
                    className="group flex items-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg hover:from-blue-100 hover:to-indigo-100 transition-all duration-300 border border-blue-200/50"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="p-2 bg-blue-500 rounded-lg mr-4">
                      <FaCalendarAlt className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Manage Events</h4>
                      <p className="text-sm text-gray-600">Create, edit, and organize events</p>
                    </div>
                    <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="text-blue-500">→</span>
                    </div>
                  </motion.a>

                  <motion.a 
                    href="/admin/approvals" 
                    className="group flex items-center p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg hover:from-orange-100 hover:to-red-100 transition-all duration-300 border border-orange-200/50"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="p-2 bg-orange-500 rounded-lg mr-4">
                      <FaExclamationTriangle className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Review Pending Events</h4>
                      <p className="text-sm text-gray-600">Approve or reject submitted events</p>
                    </div>
                    <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="text-orange-500">→</span>
                    </div>
                  </motion.a>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* System Status Card */}
          <motion.div variants={cardVariants}>
            <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-semibold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
                  System Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200/50">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-3 animate-pulse"></div>
                      <span className="font-medium text-gray-900">System Status</span>
                    </div>
                    <span className="text-green-600 font-semibold">Online</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200/50">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-blue-500 rounded-full mr-3 animate-pulse"></div>
                      <span className="font-medium text-gray-900">Database</span>
                    </div>
                    <span className="text-blue-600 font-semibold">Connected</span>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-200/50">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-purple-500 rounded-full mr-3 animate-pulse"></div>
                      <span className="font-medium text-gray-900">API Health</span>
                    </div>
                    <span className="text-purple-600 font-semibold">Healthy</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Activity Timeline */}
        <motion.div variants={cardVariants}>
          <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl font-semibold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">System initialized successfully</p>
                    <p className="text-xs text-gray-500">Dashboard ready for management</p>
                  </div>
                  <span className="text-xs text-gray-400">Just now</span>
                </div>
                
                <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Database connection established</p>
                    <p className="text-xs text-gray-500">All systems operational</p>
                  </div>
                  <span className="text-xs text-gray-400">2 min ago</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
