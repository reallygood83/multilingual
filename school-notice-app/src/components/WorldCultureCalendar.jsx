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
  
  @media (max-width: 768px) {
    width: 100%;
    justify-content: stretch;
    
    > * {
      flex: 1;
      min-width: 0;
    }
  }
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
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 18px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  @media (min-width: 1400px) {
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  }
`;

const EventCard = styled.div`
  background: #ffffff;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  padding: 20px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    border-color: #3498db;
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${props => {
      switch (props.type) {
        case 'traditional': return 'linear-gradient(90deg, #2e7d32, #4caf50)';
        case 'religious': return 'linear-gradient(90deg, #f57c00, #ff9800)';
        case 'national': return 'linear-gradient(90deg, #1976d2, #2196f3)';
        case 'international': return 'linear-gradient(90deg, #c2185b, #e91e63)';
        case 'modern': return 'linear-gradient(90deg, #7b1fa2, #9c27b0)';
        case 'seasonal': return 'linear-gradient(90deg, #00695c, #009688)';
        default: return 'linear-gradient(90deg, #616161, #757575)';
      }
    }};
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
  background: #f8f9fa;
  border-left: 3px solid #3498db;
  padding: 10px 14px;
  margin-top: 12px;
  border-radius: 0 6px 6px 0;
  font-size: 13px;
  color: #495057;
  line-height: 1.4;
`;

const TeacherTips = styled.div`
  background: linear-gradient(135deg, #667eea10, #764ba210);
  border: 1px solid #e0e7ff;
  border-radius: 8px;
  padding: 12px 16px;
  margin-top: 16px;
  position: relative;
  
  &::before {
    content: '👩‍🏫';
    position: absolute;
    top: -8px;
    left: 12px;
    background: white;
    padding: 0 4px;
    font-size: 16px;
  }
  
  .tips-title {
    font-size: 12px;
    font-weight: 600;
    color: #4f46e5;
    margin-bottom: 8px;
    margin-top: 4px;
  }
  
  .tips-content {
    font-size: 12px;
    color: #6b7280;
    line-height: 1.4;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #7f8c8d;
`;

// 교사용 활용 팁 생성 함수
const generateTeacherTips = (event) => {
  const baseActivities = {
    traditional: [
      '전통 의상이나 음식 사진 자료 준비하여 시각적 학습 효과 높이기',
      '해당 문화권 전래동화나 설화를 함께 읽어보는 독서 활동',
      '간단한 전통 공예품 만들기 체험 활동'
    ],
    religious: [
      '종교적 배경 설명 시 문화적 관점에서 중립적으로 접근하기',
      '해당 종교의 상징물이나 건축물 사진 자료 활용',
      '다양한 종교와 믿음에 대한 포용적 태도 기르기'
    ],
    national: [
      '해당 국가의 위치를 지도에서 찾아보는 지리 학습 연계',
      '국가 상징(국기, 국가 등)과 그 의미 알아보기',
      '우리나라 국경일과 비교하여 공통점과 차이점 찾기'
    ],
    international: [
      '전 세계가 함께 기념하는 의미와 가치 토론하기',
      '우리 생활 속에서 실천할 수 있는 방법 찾아보기',
      '다른 나라 친구들과 어떻게 함께 기념할지 생각해보기'
    ],
    modern: [
      '현대적 축제가 생겨난 배경과 변화 과정 알아보기',
      '전통 문화와 현대 문화의 조화 방법 토론',
      '우리만의 새로운 기념일 만들어보기 창작 활동'
    ],
    seasonal: [
      '계절별 기후 변화와 생활 모습 비교하기',
      '우리나라의 같은 계절 행사와 비교 분석',
      '자연 환경과 문화의 관계 탐구하기'
    ]
  };

  const gradeSpecificTips = {
    elementary: '색칠하기, 만들기 등 체험 중심 활동으로 접근',
    middle: '문화적 차이를 인정하고 존중하는 태도 기르기',
    high: '세계화 시대 문화적 다양성의 중요성 토론'
  };

  const activities = baseActivities[event.type] || baseActivities.traditional;
  const randomActivity = activities[Math.floor(Math.random() * activities.length)];
  
  return {
    activity: randomActivity,
    gradeTip: gradeSpecificTips.elementary, // 기본값으로 초등 설정
    assessment: `${event.event} 행사의 의미와 우리 문화와의 공통점 찾기`
  };
};

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
            <EventCard key={`${event.event}-${index}`} type={event.type}>
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
              
              <TeacherTips>
                <div className="tips-title">교사용 활용 가이드</div>
                <div className="tips-content">
                  <strong>🎯 활동 제안:</strong> {generateTeacherTips(event).activity}<br/>
                  <strong>📚 학급 적용:</strong> {generateTeacherTips(event).gradeTip}<br/>
                  <strong>📝 평가 방법:</strong> {generateTeacherTips(event).assessment}
                </div>
              </TeacherTips>
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