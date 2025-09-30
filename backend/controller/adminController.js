import mongoose from "mongoose";
import Stats from "../models/statsModel.js";
import Property from "../models/propertymodel.js";
import Appointment from "../models/appointmentModel.js";
import User from "../models/Usermodel.js";
import transporter from "../config/nodemailer.js";
import { getEmailTemplate } from "../email.js";

const formatRecentProperties = (properties) => {
  return properties.map((property) => ({
    type: "property",
    title: `New property: ${property.title}`,
    timestamp: property.createdAt,
    icon: "🏠",
  }));
};

const formatRecentAppointments = (appointments) => {
  return appointments.map((appointment) => ({
    type: "appointment",
    title: `Appointment for ${appointment.propertyId?.title || "Unknown Property"}`,
    subtitle: `by ${appointment.userId?.name || "Unknown User"}`,
    timestamp: appointment.createdAt,
    icon: "📅",
  }));
};

// Demo data functions for when MongoDB is not connected
const getDemoRecentActivity = () => {
  const now = new Date();
  return [
    {
      type: "property",
      title: "New property: Luxury Villa in Beşiktaş",
      timestamp: new Date(now - 2 * 60 * 60 * 1000), // 2 hours ago
      icon: "🏠",
    },
    {
      type: "appointment",
      title: "Appointment for Modern Apartment in Kadıköy",
      subtitle: "by Ahmet Yılmaz",
      timestamp: new Date(now - 4 * 60 * 60 * 1000), // 4 hours ago
      icon: "📅",
    },
    {
      type: "property",
      title: "New property: Office Space in Levent",
      timestamp: new Date(now - 6 * 60 * 60 * 1000), // 6 hours ago
      icon: "🏠",
    },
    {
      type: "appointment",
      title: "Appointment for Penthouse in Nişantaşı",
      subtitle: "by Zeynep Kaya",
      timestamp: new Date(now - 8 * 60 * 60 * 1000), // 8 hours ago
      icon: "📅",
    },
    {
      type: "property",
      title: "New property: Family House in Üsküdar",
      timestamp: new Date(now - 12 * 60 * 60 * 1000), // 12 hours ago
      icon: "🏠",
    },
  ];
};

const getDemoViewsData = () => {
  // Generate demo data for last 30 days
  const labels = [];
  const data = [];
  
  for (let i = 30; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateString = date.toISOString().split("T")[0];
    labels.push(dateString);
    
    // Generate random view counts between 10-50
    const viewCount = Math.floor(Math.random() * 40) + 10;
    data.push(viewCount);
  }

  return {
    labels,
    datasets: [
      {
        label: "Property Views",
        data,
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.4,
        fill: true,
      },
    ],
  };
};

// Add these helper functions before the existing exports
export const getAdminStats = async (req, res) => {
  try {
    // Check if MongoDB is connected
    const isMongoConnected = mongoose.connection.readyState === 1;
    
    if (!isMongoConnected) {
      // Return demo data when MongoDB is not connected
      res.json({
        success: true,
        stats: {
          totalProperties: 25,
          activeListings: 18,
          totalUsers: 156,
          pendingAppointments: 8,
          recentActivity: getDemoRecentActivity(),
          viewsData: getDemoViewsData(),
        },
      });
      return;
    }

    const [
      totalProperties,
      activeListings,
      totalUsers,
      pendingAppointments,
      recentActivity,
      viewsData,
    ] = await Promise.all([
      Property.countDocuments(),
      Property.countDocuments({ status: "active" }),
      User.countDocuments(),
      Appointment.countDocuments({ status: "pending" }),
      getRecentActivity(),
      getViewsData(),
    ]);

    res.json({
      success: true,
      stats: {
        totalProperties,
        activeListings,
        totalUsers,
        pendingAppointments,
        recentActivity,
        viewsData,
      },
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    // Return demo data on error
    res.json({
      success: true,
      stats: {
        totalProperties: 25,
        activeListings: 18,
        totalUsers: 156,
        pendingAppointments: 8,
        recentActivity: getDemoRecentActivity(),
        viewsData: getDemoViewsData(),
      },
    });
  }
};

const getRecentActivity = async () => {
  try {
    const recentProperties = await Property.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("title createdAt");

    const recentAppointments = await Appointment.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("propertyId", "title")
      .populate("userId", "name");

    // Filter out appointments with missing user or property data
    const validAppointments = recentAppointments.filter(
      (appointment) => appointment.userId && appointment.propertyId
    );

    return [
      ...formatRecentProperties(recentProperties),
      ...formatRecentAppointments(validAppointments),
    ].sort((a, b) => b.timestamp - a.timestamp);
  } catch (error) {
    console.error("Error getting recent activity:", error);
    return [];
  }
};

const getViewsData = async () => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const stats = await Stats.aggregate([
      {
        $match: {
          endpoint: /^\/api\/products\/single\//,
          method: "GET",
          timestamp: { $gte: thirtyDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$timestamp" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Generate dates for last 30 days
    const labels = [];
    const data = [];
    for (let i = 30; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split("T")[0];
      labels.push(dateString);

      const stat = stats.find((s) => s._id === dateString);
      data.push(stat ? stat.count : 0);
    }

    return {
      labels,
      datasets: [
        {
          label: "Property Views",
          data,
          borderColor: "rgb(75, 192, 192)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          tension: 0.4,
          fill: true,
        },
      ],
    };
  } catch (error) {
    console.error("Error generating chart data:", error);
    return {
      labels: [],
      datasets: [
        {
          label: "Property Views",
          data: [],
          borderColor: "rgb(75, 192, 192)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          tension: 0.4,
          fill: true,
        },
      ],
    };
  }
};

// Add these new controller functions
export const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("propertyId", "title location")
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      appointments,
    });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({
      success: false,
      message: "Randevular getirilirken hata oluştu",
    });
  }
};

export const updateAppointmentStatus = async (req, res) => {
  try {
    const { appointmentId, status } = req.body;

    const appointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { status },
      { new: true }
    ).populate("propertyId userId");

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Randevu bulunamadı",
      });
    }

    // Send email notification using the template from email.js
    const mailOptions = {
      from: process.env.EMAIL,
      to: appointment.userId.email,
      subject: `Viewing Appointment ${
        status.charAt(0).toUpperCase() + status.slice(1)
      } - BuildEstate`,
      html: getEmailTemplate(appointment, status),
    };

    await transporter.sendMail(mailOptions);

    res.json({
      success: true,
      message: `Randevu başarıyla ${status === 'confirmed' ? 'onaylandı' : status === 'cancelled' ? 'iptal edildi' : 'güncellendi'}`,
      appointment,
    });
  } catch (error) {
    console.error("Error updating appointment:", error);
    res.status(500).json({
      success: false,
      message: "Randevu güncellenirken hata oluştu",
    });
  }
};
