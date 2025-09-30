import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const TurkishCalendar = ({ selectedDate, onDateSelect, minDate, maxDate, className = '' }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isOpen, setIsOpen] = useState(false);

  const turkishMonths = [
    'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
  ];

  const turkishDays = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];

  useEffect(() => {
    if (selectedDate) {
      setCurrentMonth(new Date(selectedDate));
    }
  }, [selectedDate]);

  const formatDisplayDate = (date) => {
    if (!date) return 'Tarih seçin';
    const day = date.getDate();
    const month = turkishMonths[date.getMonth()];
    const year = date.getFullYear();
    const dayName = turkishDays[date.getDay()];
    return `${day} ${month} ${year}, ${dayName}`;
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Önceki ayın günleri
    for (let i = 0; i < startingDayOfWeek; i++) {
      const prevDate = new Date(year, month, -startingDayOfWeek + i + 1);
      days.push({
        date: prevDate,
        isCurrentMonth: false,
        isDisabled: true
      });
    }

    // Bu ayın günleri
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(year, month, day);
      const isDisabled = 
        (minDate && currentDate < minDate) || 
        (maxDate && currentDate > maxDate);
      
      days.push({
        date: currentDate,
        isCurrentMonth: true,
        isDisabled
      });
    }

    // Sonraki ayın günleri (42 gün için)
    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      const nextDate = new Date(year, month + 1, day);
      days.push({
        date: nextDate,
        isCurrentMonth: false,
        isDisabled: true
      });
    }

    return days;
  };

  const navigateMonth = (direction) => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      newMonth.setMonth(prev.getMonth() + direction);
      return newMonth;
    });
  };

  const handleDateClick = (date) => {
    if (!date.isDisabled) {
      onDateSelect(date.date);
      setIsOpen(false);
    }
  };

  const isDateSelected = (date) => {
    if (!selectedDate || !date.isCurrentMonth) return false;
    return date.date.toDateString() === selectedDate.toDateString();
  };

  const isToday = (date) => {
    const today = new Date();
    return date.date.toDateString() === today.toDateString();
  };

  const days = getDaysInMonth(currentMonth);

  return (
    <div className={`relative ${className}`}>
      {/* Tarih Input */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg cursor-pointer bg-white hover:border-blue-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors shadow-sm"
      >
        <span className={selectedDate ? 'text-gray-900' : 'text-gray-500'}>
          {formatDisplayDate(selectedDate)}
        </span>
      </div>

      {/* Takvim Popup */}
      {isOpen && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Takvim */}
          <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-[60] p-4 w-80">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => navigateMonth(-1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              <h3 className="text-lg font-semibold text-gray-900">
                {turkishMonths[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </h3>
              
              <button
                onClick={() => navigateMonth(1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Gün başlıkları */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {turkishDays.map(day => (
                <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Günler */}
            <div className="grid grid-cols-7 gap-1">
              {days.map((day, index) => (
                <button
                  key={index}
                  onClick={() => handleDateClick(day)}
                  disabled={day.isDisabled}
                  className={`
                    w-10 h-10 text-sm rounded-lg transition-colors
                    ${!day.isCurrentMonth 
                      ? 'text-gray-300 cursor-not-allowed' 
                      : day.isDisabled
                        ? 'text-gray-300 cursor-not-allowed'
                        : 'text-gray-900 hover:bg-blue-50'
                    }
                    ${isDateSelected(day) 
                      ? 'bg-blue-600 text-white hover:bg-blue-700' 
                      : ''
                    }
                    ${isToday(day) && !isDateSelected(day)
                      ? 'bg-blue-100 text-blue-600 font-semibold'
                      : ''
                    }
                  `}
                >
                  {day.date.getDate()}
                </button>
              ))}
            </div>

            {/* Bugün butonu */}
            <div className="mt-4 pt-3 border-t border-gray-200">
              <button
                onClick={() => {
                  const today = new Date();
                  const isDisabled = 
                    (minDate && today < minDate) || 
                    (maxDate && today > maxDate);
                  
                  if (!isDisabled) {
                    onDateSelect(today);
                    setIsOpen(false);
                  }
                }}
                className="w-full py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                Bugün
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TurkishCalendar;