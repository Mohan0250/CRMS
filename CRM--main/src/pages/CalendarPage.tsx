import React, { useState, useMemo, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Clock, 
  Trash2,
  X,
  Loader2
} from 'lucide-react';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  isToday,
  parseISO
} from 'date-fns';
import { motion, AnimatePresence } from 'motion/react';
import Modal from '../components/Modal';
import { cn } from '../lib/utils';
import { toast } from 'sonner';
import { apiService } from '../services/apiService';
import { CalendarEvent } from '../types';

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [eventForm, setEventForm] = useState({ title: '', time: '' });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const data = await apiService.events.getAll();
      setEvents(data);
    } catch (error) {
      toast.error('Failed to fetch events');
    } finally {
      setIsLoading(false);
    }
  };

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const calendarDays = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate) return;

    setIsLoading(true);
    try {
      const newEvent = await apiService.events.create({
        title: eventForm.title,
        date: format(selectedDate, 'yyyy-MM-dd'),
        time: eventForm.time,
        description: ''
      });

      setEvents([...events, newEvent]);
      setEventForm({ title: '', time: '' });
      setIsModalOpen(false);
      toast.success('Event added successfully');
    } catch (error) {
      toast.error('Failed to add event');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await apiService.events.delete(id);
      setEvents(events.filter(e => e.id !== id));
      toast.info('Event deleted');
    } catch (error) {
      toast.error('Failed to delete event');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-4 md:p-8 space-y-6 md:space-y-8 max-w-[1600px] mx-auto"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-black tracking-tight">Calendar</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your schedule and follow-ups.</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <button 
              onClick={prevMonth}
              className="p-2 hover:bg-gray-50 text-gray-600 transition-colors border-r border-gray-200"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="px-4 py-2 text-sm font-bold text-black min-w-[140px] text-center">
              {format(currentDate, 'MMMM yyyy')}
            </div>
            <button 
              onClick={nextMonth}
              className="p-2 hover:bg-gray-50 text-gray-600 transition-colors border-l border-gray-200"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <button 
            onClick={() => {
              setSelectedDate(new Date());
              setIsModalOpen(true);
            }}
            className="btn-primary flex items-center justify-center gap-2 flex-1 sm:flex-none"
          >
            <Plus className="w-4 h-4" />
            Add Event
          </button>
        </div>
      </div>

      <div className="card-base !p-0 overflow-hidden shadow-sm border-gray-100">
        <div className="grid grid-cols-7 border-b border-gray-100">
          {weekDays.map(day => (
            <div key={day} className="py-4 text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50/50">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 divide-x divide-y divide-gray-100 border-l border-t border-gray-100">
          {calendarDays.map((day, idx) => {
            const dayEvents = events.filter(e => isSameDay(parseISO(e.date), day));
            const isCurrentMonth = isSameMonth(day, monthStart);

            return (
              <div 
                key={day.toString()} 
                onClick={() => handleDateClick(day)}
                className={cn(
                  "min-h-[100px] md:min-h-[140px] p-2 md:p-3 transition-all duration-200 group relative cursor-pointer",
                  isCurrentMonth ? "bg-white hover:bg-gray-50/80" : "bg-gray-50/30 text-gray-300",
                  isToday(day) && "bg-blue-50/30"
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={cn(
                    "text-sm font-bold transition-colors",
                    isToday(day) ? "text-blue-600" : isCurrentMonth ? "text-gray-400 group-hover:text-black" : "text-gray-300"
                  )}>
                    {format(day, 'd')}
                  </span>
                  {isToday(day) && (
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                  )}
                </div>

                <div className="space-y-1.5">
                  <AnimatePresence mode="popLayout">
                    {dayEvents.map(event => (
                      <motion.div 
                        key={event.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="p-1.5 bg-white border border-gray-100 rounded-lg shadow-sm group/event relative"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-start justify-between gap-1">
                          <div className="min-w-0">
                            <p className="text-[10px] font-bold text-black truncate">{event.title}</p>
                            <p className="text-[8px] text-gray-400 font-bold uppercase mt-0.5 flex items-center gap-1">
                              <Clock className="w-2 h-2" />
                              {event.time}
                            </p>
                          </div>
                          <button 
                            onClick={() => handleDelete(event.id)}
                            className="opacity-0 group-hover/event:opacity-100 p-0.5 hover:bg-red-50 text-gray-300 hover:text-red-500 rounded transition-all"
                          >
                            <Trash2 className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Add New Event"
      >
        <form onSubmit={handleAddEvent} className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Event Title</label>
            <input 
              required
              type="text" 
              value={eventForm.title}
              onChange={(e) => setEventForm({...eventForm, title: e.target.value})}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-4 focus:ring-black/5 focus:border-black transition-all outline-none"
              placeholder="e.g. Client Meeting"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Date</label>
              <div className="px-4 py-2.5 bg-gray-100 border border-gray-200 rounded-xl text-sm text-gray-600 font-medium">
                {selectedDate ? format(selectedDate, 'MMM dd, yyyy') : 'Select a date'}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Time</label>
              <input 
                required
                type="time" 
                value={eventForm.time}
                onChange={(e) => setEventForm({...eventForm, time: e.target.value})}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-4 focus:ring-black/5 focus:border-black transition-all outline-none"
              />
            </div>
          </div>
          <div className="pt-4 flex gap-3">
            <button 
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="flex-1 px-4 py-2.5 text-sm font-bold text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all"
            >
              Cancel
            </button>
            <button 
              disabled={isLoading}
              type="submit"
              className="flex-1 btn-primary py-2.5 flex items-center justify-center gap-2"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Add Event'}
            </button>
          </div>
        </form>
      </Modal>
    </motion.div>
  );
}
