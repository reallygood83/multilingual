import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { 
  COUNTRIES, 
  MONTHLY_CULTURE_CALENDAR, 
  getTodaysCulture, 
  searchCultureByCountry, 
  getCultureByMonth 
} from '../data/worldCultureCalendar';

const CalendarContainer = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin: 20px 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid #e9ecef;
`;

const CalendarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 2px solid #f8f9fa;
`;

const Title = styled.h3`
  margin: 0;
  color: #2c3e50;
  font-size: 20px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
`;

const Select = styled.select`
  padding: 8px 12px;
  border: 2px solid #e9ecef;
  border-radius: 6px;
  background: white;
  font-size: 14px;
  cursor: pointer;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: #3498db;
  }
`;

const SearchInput = styled.input`
  padding: 8px 12px;
  border: 2px solid #e9ecef;
  border-radius: 6px;
  font-size: 14px;
  min-width: 200px;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: #3498db;
  }
`;

const TodaysBanner = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 16px 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const EventsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 16px;
`;

const EventCard = styled.div`
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 16px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  }
`;

const EventHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
`;

const EventTitle = styled.h4`
  margin: 0;
  color: #2c3e50;
  font-size: 16px;
  font-weight: 600;
`;

const EventDate = styled.span`
  color: #7f8c8d;
  font-size: 12px;
  font-weight: 500;
`;

const CountryFlags = styled.div`
  display: flex;
  gap: 4px;
  margin: 8px 0;
`;

const CountryFlag = styled.span`
  font-size: 16px;
  padding: 2px 4px;
  background: white;
  border-radius: 4px;
  border: 1px solid #e9ecef;
`;

const EventType = styled.span`
  display: inline-block;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 10px;
  font-weight: 500;
  text-transform: uppercase;
  margin-bottom: 8px;
  
  ${props => {
    switch (props.type) {
      case 'traditional':
        return 'background: #e8f5e8; color: #2e7d32;';
      case 'religious':
        return 'background: #fff3e0; color: #f57c00;';
      case 'national':
        return 'background: #e3f2fd; color: #1976d2;';
      case 'international':
        return 'background: #fce4ec; color: #c2185b;';
      case 'modern':
        return 'background: #f3e5f5; color: #7b1fa2;';
      case 'seasonal':
        return 'background: #e0f2f1; color: #00695c;';
      default:
        return 'background: #f5f5f5; color: #616161;';
    }
  }}
`;

const EventDescription = styled.p`
  margin: 8px 0;
  color: #495057;
  font-size: 14px;
  line-height: 1.5;
`;

const CulturalNotes = styled.div`
  background: white;
  border-left: 3px solid #3498db;
  padding: 8px 12px;
  margin-top: 12px;
  border-radius: 0 4px 4px 0;
  font-size: 13px;
  color: #666;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #7f8c8d;
`;

const WorldCultureCalendar = ({ showTodaysBanner = true }) => {
  const [selectedMonth, setSelectedMonth] = useState('all');
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // 오늘의 세계 문화 정보
  const todaysCulture = useMemo(() => getTodaysCulture(), []);

  // 필터링된 이벤트들
  const filteredEvents = useMemo(() => {
    let events = [];

    if (selectedMonth === 'all') {
      // 모든 월의 이벤트
      events = Object.values(MONTHLY_CULTURE_CALENDAR)
        .flatMap(month => month.events);
    } else {
      // 특정 월의 이벤트
      events = getCultureByMonth(parseInt(selectedMonth));
    }

    // 국가별 필터링
    if (selectedCountry !== 'all') {
      const countryKey = Object.keys(COUNTRIES).find(
        key => COUNTRIES[key].code === selectedCountry
      );
      if (countryKey) {
        events = events.filter(event => 
          event.countries.includes(countryKey)
        );
      }
    }

    // 검색어 필터링
    if (searchTerm) {
      events = events.filter(event => 
        event.event.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.countries.some(country => 
          COUNTRIES[country]?.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    return events;
  }, [selectedMonth, selectedCountry, searchTerm]);

  const months = [
    { value: 'all', label: '전체 월' },
    { value: '1', label: '1월' },
    { value: '2', label: '2월' },
    { value: '3', label: '3월' },
    { value: '4', label: '4월' },
    { value: '5', label: '5월' },
    { value: '6', label: '6월' },
    { value: '7', label: '7월' },
    { value: '8', label: '8월' },
    { value: '9', label: '9월' },
    { value: '10', label: '10월' },
    { value: '11', label: '11월' },
    { value: '12', label: '12월' }
  ];

  const countryOptions = [
    { value: 'all', label: '전체 국가' },
    ...Object.values(COUNTRIES).map(country => ({
      value: country.code,
      label: `${country.flag} ${country.name}`
    }))
  ];

  return (
    <CalendarContainer>
      <CalendarHeader>
        <Title>🌍 세계 문화 캘린더</Title>
        <FilterContainer>
          <Select 
            value={selectedMonth} 
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            {months.map(month => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </Select>
          <Select 
            value={selectedCountry} 
            onChange={(e) => setSelectedCountry(e.target.value)}
          >
            {countryOptions.map(country => (
              <option key={country.value} value={country.value}>
                {country.label}
              </option>
            ))}
          </Select>
          <SearchInput
            type="text"
            placeholder="문화 행사 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </FilterContainer>
      </CalendarHeader>

      {/* 오늘의 세계 문화 배너 */}
      {showTodaysBanner && todaysCulture && (
        <TodaysBanner>
          <span style={{ fontSize: '24px' }}>✨</span>
          <div>
            <strong>{todaysCulture.message}</strong>
            {todaysCulture.isSpecialDay ? (
              <div style={{ fontSize: '14px', marginTop: '4px' }}>
                {todaysCulture.todaysEvents.map(event => event.event).join(', ')}
              </div>
            ) : (
              <div style={{ fontSize: '14px', marginTop: '4px' }}>
                {todaysCulture.recommendedEvent?.event} ({
                  todaysCulture.recommendedEvent?.countries.map(c => COUNTRIES[c]?.flag).join('')
                })
              </div>
            )}
          </div>
        </TodaysBanner>
      )}

      {/* 이벤트 그리드 */}
      <EventsGrid>
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event, index) => (
            <EventCard key={`${event.event}-${index}`}>
              <EventHeader>
                <EventTitle>{event.event}</EventTitle>
                <EventDate>{event.date}</EventDate>
              </EventHeader>
              
              <EventType type={event.type}>{event.type}</EventType>
              
              <CountryFlags>
                {event.countries.map(countryKey => (
                  <CountryFlag 
                    key={countryKey} 
                    title={COUNTRIES[countryKey]?.name}
                  >
                    {COUNTRIES[countryKey]?.flag}
                  </CountryFlag>
                ))}
              </CountryFlags>
              
              <EventDescription>{event.description}</EventDescription>
              
              {event.culturalNotes && (
                <CulturalNotes>
                  <strong>문화적 특징:</strong> {event.culturalNotes}
                </CulturalNotes>
              )}
            </EventCard>
          ))
        ) : (
          <EmptyState>
            <h4>검색 결과가 없습니다</h4>
            <p>다른 검색 조건을 사용해보세요.</p>
          </EmptyState>
        )}
      </EventsGrid>
    </CalendarContainer>
  );
};

WorldCultureCalendar.propTypes = {
  showTodaysBanner: PropTypes.bool
};

export default WorldCultureCalendar;