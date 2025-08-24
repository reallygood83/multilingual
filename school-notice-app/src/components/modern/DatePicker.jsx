import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const DatePickerContainer = styled.div`
  position: relative;
  width: 100%;
`;

const DateInput = styled.input`
  width: 100%;
  padding: 12px;
  border: 2px solid #e9ecef;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  background: white;
  transition: border-color 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #0969da;
    box-shadow: 0 0 0 3px rgba(9, 105, 218, 0.1);
  }
  
  &:disabled {
    background: #f8f9fa;
    cursor: not-allowed;
    color: #6c757d;
  }
`;

const CalendarContainer = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 1000;
  background: white;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  margin-top: 4px;
  padding: 16px;
  display: ${props => props.$isOpen ? 'block' : 'none'};
`;

const CalendarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const MonthYearDisplay = styled.div`
  font-weight: 600;
  color: #333;
  font-size: 16px;
`;

const NavButton = styled.button`
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  color: #666;
  transition: all 0.2s ease;
  
  &:hover {
    background: #f8f9fa;
    color: #333;
  }
`;

const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
  margin-bottom: 12px;
`;

const WeekdayHeader = styled.div`
  text-align: center;
  font-size: 12px;
  font-weight: 500;
  color: #666;
  padding: 8px 4px;
`;

const DayButton = styled.button`
  background: none;
  border: none;
  padding: 8px 4px;
  cursor: pointer;
  font-size: 14px;
  border-radius: 4px;
  transition: all 0.2s ease;
  color: ${props => props.$isOtherMonth ? '#ccc' : props.$isToday ? '#0969da' : '#333'};
  background: ${props => props.$isSelected ? '#0969da' : 'transparent'};
  color: ${props => props.$isSelected ? 'white' : (props.$isOtherMonth ? '#ccc' : (props.$isToday ? '#0969da' : '#333'))};
  font-weight: ${props => props.$isToday ? '600' : '400'};
  
  &:hover:not(:disabled) {
    background: ${props => props.$isSelected ? '#0860ca' : '#f0f8ff'};
    color: ${props => props.$isSelected ? 'white' : '#0969da'};
  }
  
  &:disabled {
    color: #ccc;
    cursor: not-allowed;
  }
`;

const TodayButton = styled.button`
  width: 100%;
  padding: 8px;
  background: #f0f8ff;
  border: 1px solid #0969da;
  border-radius: 4px;
  color: #0969da;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #0969da;
    color: white;
  }
`;

const DatePicker = ({ value, onChange, placeholder = "날짜를 선택하세요", disabled = false, showTime = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(value ? new Date(value) : null);

  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.date-picker-container')) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isOpen]);

  // Update selected date when value prop changes
  useEffect(() => {
    if (value) {
      setSelectedDate(new Date(value));
    } else {
      setSelectedDate(null);
    }
  }, [value]);

  const formatKoreanDate = (date) => {
    if (!date) return '';
    const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekday = weekdays[date.getDay()];
    
    if (showTime) {
      const hours = date.getHours();
      const minutes = date.getMinutes();
      return `${year}년 ${month}월 ${day}일(${weekday}) ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    }
    
    return `${year}년 ${month}월 ${day}일(${weekday})`;
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // Previous month's days
    const prevMonth = new Date(year, month - 1, 0);
    const prevMonthDays = prevMonth.getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({
        day: prevMonthDays - i,
        isCurrentMonth: false,
        date: new Date(year, month - 1, prevMonthDays - i)
      });
    }
    
    // Current month's days
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({
        day,
        isCurrentMonth: true,
        date: new Date(year, month, day)
      });
    }
    
    // Next month's days
    const remaining = 42 - days.length;
    for (let day = 1; day <= remaining; day++) {
      days.push({
        day,
        isCurrentMonth: false,
        date: new Date(year, month + 1, day)
      });
    }
    
    return days;
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    onChange(date);
    setIsOpen(false);
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const handleToday = () => {
    const today = new Date();
    setSelectedDate(today);
    setCurrentMonth(today);
    onChange(today);
    setIsOpen(false);
  };

  const today = new Date();
  const days = getDaysInMonth(currentMonth);
  const weekdays = ['일', '월', '화', '수', '목', '금', '토'];

  return (
    <DatePickerContainer className="date-picker-container">
      <DateInput
        type="text"
        value={formatKoreanDate(selectedDate)}
        placeholder={placeholder}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        readOnly
        disabled={disabled}
      />
      
      <CalendarContainer $isOpen={isOpen}>
        <CalendarHeader>
          <NavButton onClick={handlePrevMonth} type="button">
            ‹
          </NavButton>
          <MonthYearDisplay>
            {currentMonth.getFullYear()}년 {currentMonth.getMonth() + 1}월
          </MonthYearDisplay>
          <NavButton onClick={handleNextMonth} type="button">
            ›
          </NavButton>
        </CalendarHeader>
        
        <CalendarGrid>
          {weekdays.map(weekday => (
            <WeekdayHeader key={weekday}>{weekday}</WeekdayHeader>
          ))}
          
          {days.map((dayInfo, index) => {
            const isToday = dayInfo.date.toDateString() === today.toDateString();
            const isSelected = selectedDate && dayInfo.date.toDateString() === selectedDate.toDateString();
            
            return (
              <DayButton
                key={index}
                onClick={() => handleDateSelect(dayInfo.date)}
                $isOtherMonth={!dayInfo.isCurrentMonth}
                $isToday={isToday}
                $isSelected={isSelected}
                type="button"
              >
                {dayInfo.day}
              </DayButton>
            );
          })}
        </CalendarGrid>
        
        <TodayButton onClick={handleToday} type="button">
          📅 오늘 ({formatKoreanDate(today)})
        </TodayButton>
      </CalendarContainer>
    </DatePickerContainer>
  );
};

DatePicker.propTypes = {
  value: PropTypes.instanceOf(Date),
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  showTime: PropTypes.bool
};

export default DatePicker;