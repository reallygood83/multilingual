import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { getHolidayActivityIdeas } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';

// In a real app, this would come from a database or a dedicated JSON file.
const cultureData = {
  'vn': {
    name: '베트남',
    flag: '🇻🇳',
    holidays: [
      { name: '뗏 (Tết - 설날)', month: 1, day: 29, description: '가장 큰 명절로, 가족들이 모여 새해의 복을 기원합니다.' },
      { name: '쭝추 (Tết Trung Thu - 추석)', month: 9, day: 17, description: '어린이들을 위한 명절로, 등불을 들고 용춤을 구경합니다.' },
    ]
  },
  'ph': {
    name: '필리핀',
    flag: '🇵🇭',
    holidays: [
      { name: "신년 (New Year's Day)", month: 1, day: 1, description: '가족과 함께 새해를 맞이하며, 시끄러운 소리로 악귀를 쫓는 풍습이 있습니다.' },
      { name: '부활절 (Holy Week)', month: 3, day: 28, description: '필리핀에서 가장 중요한 종교적 명절 주간입니다.' },
    ]
  },
  'cn': {
    name: '중국',
    flag: '🇨🇳',
    holidays: [
      { name: '춘절 (春节 - 설날)', month: 1, day: 29, description: '가장 중요한 명절로, 온 가족이 모여 만두를 빚고 불꽃놀이를 합니다.' },
      { name: '중추절 (中秋节 - 추석)', month: 9, day: 17, description: '달에게 소원을 비는 날로, 월병을 나누어 먹습니다.' },
    ]
  },
  'ru': {
    name: '러시아',
    flag: '🇷🇺',
    holidays: [
      { name: '신년 (Новый год)', month: 1, day: 1, description: '가장 인기 있는 명절로, 솨띄(겨울 할아버지)가 선물을 나눠줍니다.' },
      { name: '마슬레니차 (Масленица)', month: 3, day: 3, description: '봄을 맞이하는 축제로, 블리니(팬케이크)를 먹으며 겨울을 보냅니다.' },
    ]
  }
};

const CalendarContainer = styled.div`
  padding: 20px;
  background-color: var(--surface-primary);
`;

const Header = styled.div`
  margin-bottom: 24px;
  h2 {
    font-size: 24px;
    color: var(--text-primary);
    margin: 0 0 8px 0;
  }
  p {
    font-size: 16px;
    color: var(--text-secondary);
  }
`;

const HolidayCard = styled.div`
  background: var(--surface-secondary);
  border: 1px solid var(--neutral-200);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
  box-shadow: var(--elevation-1);
`;

const HolidayInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  .flag { font-size: 2em; }
  h4 { margin: 0; font-size: 1.2em; }
  p { margin: 4px 0 0 0; color: var(--text-secondary); }
`;

const AIButton = styled.button`
  margin-top: 16px;
  padding: 8px 16px;
  background-color: var(--primary-500);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  &:hover { background-color: var(--primary-600); }
`;

const AIResult = styled.div`
  margin-top: 16px;
  padding: 16px;
  background-color: #f0f7ff;
  border: 1px solid #b3d7ff;
  border-radius: 8px;
`;

const CultureCalendar = ({ apiKey }) => {
  const [aiResults, setAiResults] = useState({});
  const [loading, setLoading] = useState(null); // holiday.name as ID

  const holidays = useMemo(() => {
    const all = [];
    Object.keys(cultureData).forEach(countryCode => {
      const country = cultureData[countryCode];
      country.holidays.forEach(holiday => {
        all.push({ ...holiday, countryName: country.name, flag: country.flag });
      });
    });
    // Sort by month and day
    return all.sort((a, b) => a.month - b.month || a.day - b.day);
  }, []);

  const handleGetAIIdeas = async (holiday) => {
    if (!apiKey) {
      alert('설정에서 Gemini API 키를 먼저 입력해주세요.');
      return;
    }
    setLoading(holiday.name);
    setAiResults(prev => ({ ...prev, [holiday.name]: null }));
    try {
      const result = await getHolidayActivityIdeas(holiday.name, holiday.countryName, apiKey);
      setAiResults(prev => ({ ...prev, [holiday.name]: result }));
    } catch (error) {
      alert(`AI 활동 아이디어 생성 실패: ${error.message}`);
    }
    setLoading(null);
  };

  return (
    <CalendarContainer>
      <Header>
        <h2>세계 문화 캘린더</h2>
        <p>우리 반 친구들의 다양한 문화를 존중하고 함께 배워요.</p>
      </Header>
      <div>
        {holidays.map(holiday => (
          <HolidayCard key={`${holiday.countryName}-${holiday.name}`}>
            <HolidayInfo>
              <span className="flag">{holiday.flag}</span>
              <div>
                <h4>{holiday.countryName} - {holiday.name}</h4>
                <p>{`${holiday.month}월 ${holiday.day}일`} - {holiday.description}</p>
              </div>
            </HolidayInfo>
            <AIButton onClick={() => handleGetAIIdeas(holiday)} disabled={loading === holiday.name}>
              {loading === holiday.name ? 'AI 생각 중...' : 'AI로 활동 아이디어 보기'}
            </AIButton>
            {aiResults[holiday.name] && (
              <AIResult>
                <p><strong>✨ {aiResults[holiday.name].explanation}</strong></p>
                <ul>
                  {aiResults[holiday.name].activities.map((activity, index) => (
                    <li key={index}>{activity}</li>
                  ))}
                </ul>
              </AIResult>
            )}
          </HolidayCard>
        ))}
      </div>
    </CalendarContainer>
  );
};

export default CultureCalendar;
