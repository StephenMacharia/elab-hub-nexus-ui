
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, User, Filter, Plus, CalendarPlus } from 'lucide-react';
import Layout from '@/components/Layout';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface AppointmentsProps {
  userRole: 'admin' | 'technician' | 'patient';
  userName: string;
}

interface BookingForm {
  testType: string;
  date: Date;
  timeSlot: string;
  location: string;
  notes?: string;
}

const Appointments = ({ userRole, userName }: AppointmentsProps) => {
  const [filter, setFilter] = useState('all');
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>();

  const form = useForm<BookingForm>();

  const appointments = [
    {
      id: 1,
      patient: userName,
      test: 'Complete Blood Count',
      date: '2024-12-18',
      time: '9:00 AM',
      location: 'Main Lab',
      status: 'Confirmed',
      technician: 'Dr. Sarah Wilson'
    },
    {
      id: 2,
      patient: userName,
      test: 'Lipid Profile',
      date: '2024-12-18',
      time: '10:30 AM',
      location: 'Cardiology Lab',
      status: 'Pending',
      technician: 'Dr. Michael Chen'
    },
    {
      id: 3,
      patient: userName,
      test: 'Thyroid Function',
      date: '2024-12-19',
      time: '2:00 PM',
      location: 'Endocrine Lab',
      status: 'Confirmed',
      technician: 'Dr. Lisa Park'
    }
  ];

  const availableTests = [
    'Complete Blood Count',
    'Lipid Profile',
    'Thyroid Function Test',
    'Glucose Tolerance Test',
    'Liver Function Test',
    'Kidney Function Test',
    'Vitamin D Level',
    'Hemoglobin A1C'
  ];

  const timeSlots = [
    '8:00 AM', '8:30 AM', '9:00 AM', '9:30 AM', '10:00 AM',
    '10:30 AM', '11:00 AM', '11:30 AM', '2:00 PM', '2:30 PM',
    '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM'
  ];

  const locations = [
    'Main Lab',
    'Cardiology Lab',
    'Endocrine Lab',
    'Hematology Lab',
    'Chemistry Lab'
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmed': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Rescheduled': return 'bg-blue-100 text-blue-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const onSubmit = (data: BookingForm) => {
    console.log('Booking submitted:', data);
    // Here you would typically send the data to your backend
    setShowBookingForm(false);
    form.reset();
  };

  return (
    <Layout userRole={userRole} userName={userName}>
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Appointments</h1>
            <p className="text-gray-600 mt-1">Manage your lab test appointments</p>
          </div>
          <div className="mt-4 sm:mt-0 flex gap-3">
            <button 
              onClick={() => setShowBookingForm(!showBookingForm)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
            >
              <CalendarPlus className="h-4 w-4" />
              Book New Test
            </button>
          </div>
        </motion.div>

        {/* Booking Form */}
        {showBookingForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarPlus className="h-5 w-5" />
                  Book New Appointment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Test Type */}
                      <FormField
                        control={form.control}
                        name="testType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Test Type</FormLabel>
                            <FormControl>
                              <select
                                {...field}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                <option value="">Select a test</option>
                                {availableTests.map((test) => (
                                  <option key={test} value={test}>
                                    {test}
                                  </option>
                                ))}
                              </select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Date Selection */}
                      <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Preferred Date</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant="outline"
                                    className={cn(
                                      "w-full pl-3 text-left font-normal",
                                      !field.value && "text-muted-foreground"
                                    )}
                                  >
                                    {field.value ? (
                                      format(field.value, "PPP")
                                    ) : (
                                      <span>Pick a date</span>
                                    )}
                                    <Calendar className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <CalendarComponent
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={(date) =>
                                    date < new Date() || date.getDay() === 0 || date.getDay() === 6
                                  }
                                  initialFocus
                                  className={cn("p-3 pointer-events-auto")}
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Time Slot */}
                      <FormField
                        control={form.control}
                        name="timeSlot"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Preferred Time</FormLabel>
                            <FormControl>
                              <select
                                {...field}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                <option value="">Select time</option>
                                {timeSlots.map((time) => (
                                  <option key={time} value={time}>
                                    {time}
                                  </option>
                                ))}
                              </select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Location */}
                      <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Preferred Location</FormLabel>
                            <FormControl>
                              <select
                                {...field}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                <option value="">Select location</option>
                                {locations.map((location) => (
                                  <option key={location} value={location}>
                                    {location}
                                  </option>
                                ))}
                              </select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Notes */}
                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Additional Notes (Optional)</FormLabel>
                          <FormControl>
                            <textarea
                              {...field}
                              rows={3}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Any special requirements or notes..."
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex gap-4">
                      <Button type="submit" className="bg-blue-500 hover:bg-blue-600">
                        Book Appointment
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => setShowBookingForm(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm border p-4"
        >
          <div className="flex items-center gap-4">
            <Filter className="h-5 w-5 text-gray-400" />
            <div className="flex gap-2">
              {['all', 'today', 'upcoming', 'pending'].map((filterOption) => (
                <button
                  key={filterOption}
                  onClick={() => setFilter(filterOption)}
                  className={`px-3 py-1 text-sm rounded-full transition-colors ${
                    filter === filterOption
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Appointments List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border"
        >
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Scheduled Appointments</h3>
            <div className="space-y-4">
              {appointments.map((appointment, index) => (
                <motion.div
                  key={appointment.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{appointment.test}</h4>
                        <p className="text-sm text-gray-600">Test for {appointment.patient}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(appointment.status)}`}>
                      {appointment.status}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{appointment.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>{appointment.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{appointment.location}</span>
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      <strong>Technician:</strong> {appointment.technician}
                    </span>
                    <div className="flex gap-2">
                      <button className="px-3 py-1 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 transition-colors">
                        View Details
                      </button>
                      <button className="px-3 py-1 border border-gray-300 text-gray-700 text-sm rounded-md hover:bg-gray-50 transition-colors">
                        Reschedule
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Appointments;
